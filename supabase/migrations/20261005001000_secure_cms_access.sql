-- Persist CMS login throttling across Edge Function instances.
CREATE TABLE IF NOT EXISTS public.cms_login_attempts (
  identifier text PRIMARY KEY,
  failure_count integer NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
  window_started_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  last_failed_at timestamptz,
  locked_until timestamptz,
  alert_attempted_at timestamptz
);

ALTER TABLE public.cms_login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.cms_login_attempts FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.cms_login_attempts TO service_role;

-- CMS sessions are opaque random tokens. Supabase Auth access tokens alone never
-- authorize service-role CMS actions, so the throttled login route cannot be bypassed.
CREATE TABLE IF NOT EXISTS public.cms_sessions (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS cms_sessions_expires_at_idx
  ON public.cms_sessions (expires_at);

ALTER TABLE public.cms_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.cms_sessions FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.cms_sessions TO service_role;

CREATE OR REPLACE FUNCTION public.cms_login_attempt_status(p_identifier text)
RETURNS TABLE (
  is_locked boolean,
  retry_after_seconds integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_locked_until timestamptz;
  v_now timestamptz := clock_timestamp();
BEGIN
  IF p_identifier !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid login-attempt identifier';
  END IF;

  SELECT attempts.locked_until
  INTO v_locked_until
  FROM public.cms_login_attempts AS attempts
  WHERE attempts.identifier = p_identifier;

  is_locked := COALESCE(v_locked_until > v_now, false);
  retry_after_seconds := CASE
    WHEN is_locked THEN GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_locked_until - v_now)))::integer)
    ELSE 0
  END;
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_record_login_failure(p_identifier text)
RETURNS TABLE (
  failure_count integer,
  is_locked boolean,
  retry_after_seconds integer,
  should_alert boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt public.cms_login_attempts%ROWTYPE;
  v_count integer;
  v_exists boolean;
  v_locked_until timestamptz;
  v_now timestamptz := clock_timestamp();
BEGIN
  IF p_identifier !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid login-attempt identifier';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_identifier, 0));

  SELECT attempts.*
  INTO v_attempt
  FROM public.cms_login_attempts AS attempts
  WHERE attempts.identifier = p_identifier
  FOR UPDATE;
  v_exists := FOUND;

  IF v_exists AND v_attempt.locked_until > v_now THEN
    failure_count := v_attempt.failure_count;
    is_locked := true;
    retry_after_seconds := GREATEST(
      1,
      CEIL(EXTRACT(EPOCH FROM (v_attempt.locked_until - v_now)))::integer
    );
    should_alert := false;
    RETURN NEXT;
    RETURN;
  END IF;

  IF NOT v_exists
    OR v_attempt.locked_until IS NOT NULL
    OR v_attempt.window_started_at <= v_now - interval '15 minutes'
  THEN
    v_count := 1;
  ELSE
    v_count := v_attempt.failure_count + 1;
  END IF;

  v_locked_until := CASE
    WHEN v_count >= 3 THEN v_now + interval '30 minutes'
    ELSE NULL
  END;
  should_alert := v_count >= 3;

  INSERT INTO public.cms_login_attempts (
    identifier,
    failure_count,
    window_started_at,
    last_failed_at,
    locked_until,
    alert_attempted_at
  ) VALUES (
    p_identifier,
    v_count,
    CASE WHEN v_count = 1 THEN v_now ELSE v_attempt.window_started_at END,
    v_now,
    v_locked_until,
    CASE WHEN should_alert THEN v_now ELSE NULL END
  )
  ON CONFLICT (identifier) DO UPDATE
  SET failure_count = EXCLUDED.failure_count,
      window_started_at = EXCLUDED.window_started_at,
      last_failed_at = EXCLUDED.last_failed_at,
      locked_until = EXCLUDED.locked_until,
      alert_attempted_at = EXCLUDED.alert_attempted_at;

  failure_count := v_count;
  is_locked := v_locked_until IS NOT NULL;
  retry_after_seconds := CASE
    WHEN is_locked THEN GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_locked_until - v_now)))::integer)
    ELSE 0
  END;
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_reset_login_attempts(p_identifier text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.cms_login_attempts WHERE identifier = p_identifier;
$$;

REVOKE ALL ON FUNCTION public.cms_login_attempt_status(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cms_record_login_failure(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cms_reset_login_attempts(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_login_attempt_status(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cms_record_login_failure(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.cms_reset_login_attempts(text) TO service_role;

-- Anonymous visitors may only see assignments for members who are still active.
-- The CMS reads the complete assignment set through the service-role Edge Function.
DROP POLICY IF EXISTS "public_read_committee_members" ON public.committee_members;
CREATE POLICY "public_read_active_committee_members"
  ON public.committee_members
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.members
      WHERE members.id = committee_members.member_id
        AND members.is_active = true
    )
  );

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { login } from "@/lib/cmsApi"
import { supabase } from "@/lib/supabase"

interface AdminLoginProps {
  onSuccess: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [settingPassword, setSettingPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) {
        setError("The invitation link could not be verified. Please request a new invitation.")
        return
      }
      if (data.session) {
        setUsername(data.session.user.email ?? "")
        setSettingPassword(true)
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active || !session) return
      setUsername(session.user.email ?? "")
      setSettingPassword(true)
      setError(null)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 12) {
      setError("Use at least 12 characters for your CMS password.")
      return
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      await supabase.auth.signOut()
      window.history.replaceState({}, document.title, "/cmsadmin")
      setPassword("")
      setConfirmPassword("")
      setSettingPassword(false)
      setPasswordSaved(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to set the password. Please request a new invitation.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/BNiUnited_Logo_Color_1.png"
            alt="BNI United"
            className="h-14 object-contain"
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">
              {settingPassword ? "Set CMS password" : "CMS Admin"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {settingPassword
                ? "Choose a password for your invited admin account"
                : "Sign in to manage the chapter roster"}
            </p>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4 pt-5 px-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock size={14} />
              <span>Restricted access</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <form onSubmit={settingPassword ? handleSetPassword : handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle size={14} />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {passwordSaved && !settingPassword && (
                <Alert className="py-2 border-emerald-300 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 size={14} />
                  <AlertDescription className="text-xs">
                    Password saved. Sign in with your admin email and new password.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm">
                  Admin email
                </Label>
                <Input
                  id="username"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  readOnly={settingPassword}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={settingPassword ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={settingPassword ? 12 : undefined}
                  required
                />
                {settingPassword && (
                  <p className="text-xs text-muted-foreground">Use at least 12 characters.</p>
                )}
              </div>

              {settingPassword && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-sm">
                    Confirm password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={12}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full mt-1" disabled={loading}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading
                  ? settingPassword ? "Saving password…" : "Signing in…"
                  : settingPassword ? "Set password" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          BNI United Chapter · Members Directory CMS
        </p>
      </div>
    </div>
  )
}

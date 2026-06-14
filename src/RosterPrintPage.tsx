import { useEffect, useState } from "react"
import type { Member } from "@/lib/types"
import { sortMembersBySurname } from "@/lib/utils"

// BNI brand red (matches oklch(0.46 0.22 26) in index.css)
const R = "#C8102E"

const CORE_VALUES = [
  { label: "Givers Gain®", desc: "What you give, you get back. Build relationships by contributing first." },
  { label: "Building Relationships", desc: "People do business with people they know, like, and trust." },
  { label: "Lifelong Learning", desc: "The more you learn, the more you earn." },
  { label: "Traditions + Innovation", desc: "Respect what works. Embrace what's new." },
  { label: "Positive Attitude", desc: "Your attitude is contagious. Choose positivity." },
  { label: "Accountability", desc: "Own your results. Celebrate wins. Own your misses." },
  { label: "Recognition", desc: "Recognise others and be recognised. Appreciation drives performance." },
]

const CONTACT = {
  email: "bniuniteditdc@gmail.com",
  instagram: "@bni_united_mumbai",
  instagramUrl: "https://www.instagram.com/bni_united_mumbai",
  linkedin: "BNI United",
  linkedinUrl: "https://www.linkedin.com/in/bni-united-601082400/",
}

const POWER_TEAMS: Member["power_team"][] = ["Corporate", "Lifestyle & Wellness", "MSME", "Property"]

const PRINT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background: #f0f0f0; }

  .print-wrapper { padding: 20px; }

  .no-print-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    background: #1a1a1a; color: white; padding: 10px 20px;
    display: flex; align-items: center; justify-between; gap: 12px;
    font-size: 13px;
  }
  .no-print-bar button {
    background: ${R}; color: white; border: none; cursor: pointer;
    padding: 7px 18px; border-radius: 4px; font-size: 13px; font-weight: 600;
  }
  .no-print-bar button:hover { opacity: 0.9; }

  .print-page {
    background: white; width: 210mm; min-height: 297mm;
    margin: 0 auto 20px; padding: 15mm 14mm;
    box-shadow: 0 2px 20px rgba(0,0,0,0.15);
    position: relative; overflow: hidden;
  }

  /* cover decorative elements */
  .cover-accent-top {
    position: absolute; top: 0; right: 0; width: 60mm; height: 60mm;
    background: ${R}; opacity: 0.06; border-radius: 0 0 0 100%;
  }
  .cover-accent-bottom {
    position: absolute; bottom: 0; left: 0; width: 50mm; height: 50mm;
    background: ${R}; opacity: 0.06; border-radius: 0 100% 0 0;
  }

  /* section */
  .section-header {
    background: ${R}; color: white; padding: 7px 14px; margin-bottom: 14px;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .section-header h2 { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
  .section-header span { font-size: 10px; opacity: 0.8; }

  .section-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: ${R}; margin-bottom: 6px;
  }

  /* member card in grid */
  .members-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .members-grid-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .member-card {
    border: 1px solid #e8e8e8; border-radius: 6px; padding: 10px;
    display: flex; gap: 9px; align-items: flex-start; break-inside: avoid;
  }
  .member-avatar {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: #fbe9ec; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: ${R}; overflow: hidden;
  }
  .member-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .member-info { flex: 1; min-width: 0; }
  .member-name { font-size: 10.5px; font-weight: 700; color: #111; line-height: 1.3; }
  .member-cat { font-size: 9.5px; color: #555; line-height: 1.4; margin-top: 1px; }
  .member-company { font-size: 9px; color: #888; line-height: 1.3; margin-top: 1px; }
  .member-badge {
    display: inline-block; font-size: 8px; font-weight: 700; padding: 1px 5px;
    border-radius: 3px; margin-top: 3px; background: ${R}; color: white;
  }

  /* support/leadership row cards */
  .staff-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
  .staff-card {
    border: 1px solid #e8e8e8; border-radius: 8px; padding: 12px 10px;
    text-align: center; break-inside: avoid;
  }
  .staff-avatar {
    width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 8px;
    background: #111; display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: white; overflow: hidden;
  }
  .staff-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .staff-name { font-size: 11px; font-weight: 700; color: #111; line-height: 1.3; }
  .staff-role { font-size: 9.5px; color: #666; margin-top: 2px; }
  .staff-company { font-size: 9px; color: #999; margin-top: 2px; }

  /* values grid */
  .values-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .value-card {
    border: 1px solid #e8e8e8; border-radius: 6px; padding: 12px;
    border-left: 3px solid ${R}; break-inside: avoid;
  }
  .value-name { font-size: 11px; font-weight: 700; color: #111; margin-bottom: 4px; }
  .value-desc { font-size: 10px; color: #666; line-height: 1.5; }
  .value-num { font-size: 22px; font-weight: 800; color: ${R}; opacity: 0.12; float: right; margin-top: -4px; }

  /* contact page */
  .contact-item { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .contact-icon {
    width: 36px; height: 36px; border-radius: 50%; background: ${R};
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .contact-label { font-size: 10px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .contact-value { font-size: 13px; font-weight: 600; color: #111; }

  hr.red-rule { border: none; border-top: 2px solid ${R}; margin: 16px 0; }
  hr.light-rule { border: none; border-top: 1px solid #eee; margin: 14px 0; }

  @media print {
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page { size: A4 portrait; margin: 12mm 14mm; }
    body { background: white; }
    .print-wrapper { padding: 0; }
    .no-print-bar { display: none !important; }
    .print-page {
      width: 100%; min-height: initial; margin: 0; padding: 0;
      box-shadow: none; page-break-after: always;
    }
    .print-page:last-child { page-break-after: avoid; }
    .no-break { page-break-inside: avoid; }
    .pb-before { page-break-before: always; }
  }
`

function initials(m: Member) {
  return `${m.first_name[0] ?? ""}${m.last_name[0] ?? ""}`.toUpperCase()
}

function MemberAvatar({ member, size = 38 }: { member: Member; size?: number }) {
  const [err, setErr] = useState(false)
  if (member.photo_url && !err) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={member.photo_url}
          alt={`${member.first_name} ${member.last_name}`}
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    )
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: "#fbe9ec",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.32, fontWeight: 700, color: R, flexShrink: 0,
      }}
    >
      {initials(member)}
    </div>
  )
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="member-card no-break">
      <MemberAvatar member={member} size={38} />
      <div className="member-info">
        <div className="member-name">
          {member.first_name} {member.last_name}
        </div>
        <div className="member-cat">{member.business_category}</div>
        {member.company_name && <div className="member-company">{member.company_name}</div>}
        {member.is_power_team_captain && <span className="member-badge">Captain</span>}
        {member.is_power_team_vice_captain && <span className="member-badge" style={{ background: "#555" }}>Vice Captain</span>}
      </div>
    </div>
  )
}

function StaffCard({ member }: { member: Member }) {
  const [err, setErr] = useState(false)
  const hasPhoto = member.photo_url && !err
  return (
    <div className="staff-card no-break">
      <div className="staff-avatar">
        {hasPhoto ? (
          <img src={member.photo_url!} alt="" onError={() => setErr(true)} />
        ) : (
          initials(member)
        )}
      </div>
      <div className="staff-name">{member.first_name} {member.last_name}</div>
      {member.tagline && <div className="staff-role">{member.tagline}</div>}
      {member.company_name && <div className="staff-company">{member.company_name}</div>}
    </div>
  )
}

export default function RosterPrintPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("roster-pdf-members")
    if (stored) {
      try {
        setMembers(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready || members.length === 0) return
    const t = setTimeout(() => window.print(), 1500)
    return () => clearTimeout(t)
  }, [ready, members])

  const activeMembers = members.filter((m) => m.is_active)
  const supportTeam = activeMembers.filter((m) => m.chapter_role === "support").sort((a, b) => a.sort_order - b.sort_order)
  const leadership = activeMembers.filter((m) => m.chapter_role === "leadership").sort((a, b) => a.sort_order - b.sort_order)
  const byPowerTeam = (pt: Member["power_team"]) =>
    activeMembers
      .filter((m) => m.chapter_role === "member" && m.power_team === pt)
      .sort((a, b) => {
        if (a.is_power_team_captain !== b.is_power_team_captain) return a.is_power_team_captain ? -1 : 1
        if (a.is_power_team_vice_captain !== b.is_power_team_vice_captain) return a.is_power_team_vice_captain ? -1 : 1
        
        const lastA = (a.last_name || "").trim().toLowerCase()
        const lastB = (b.last_name || "").trim().toLowerCase()
        const lastCompare = lastA.localeCompare(lastB, undefined, { sensitivity: "base" })
        if (lastCompare !== 0) return lastCompare
        
        const firstA = (a.first_name || "").trim().toLowerCase()
        const firstB = (b.first_name || "").trim().toLowerCase()
        return firstA.localeCompare(firstB, undefined, { sensitivity: "base" })
      })
  const noPowerTeam = sortMembersBySurname(activeMembers.filter((m) => m.chapter_role === "member" && !m.power_team))
  const generatedDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  if (!ready) return null

  if (members.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16, marginBottom: 8 }}>No roster data found.</p>
          <p style={{ color: "#999", fontSize: 13 }}>Please open this page from the CMS Admin panel.</p>
          <button onClick={() => window.close()} style={{ marginTop: 16, padding: "8px 16px", background: R, color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{PRINT_CSS}</style>

      {/* Screen-only action bar */}
      <div className="no-print-bar">
        <span>BNI United Roster · {generatedDate} · {activeMembers.length} active members</span>
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>

      <div className="print-wrapper" style={{ paddingTop: "56px" }}>

        {/* ── PAGE 1: COVER ── */}
        <div className="print-page" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="cover-accent-top" />
          <div className="cover-accent-bottom" />

          {/* Logos */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <img src="/BNiUnited_Logo_Color_1.png" alt="BNI United" style={{ height: 56, objectFit: "contain" }} />
            <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" style={{ height: 44, objectFit: "contain" }} />
          </div>

          {/* Title */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: "24px 0" }}>
            <div style={{ display: "inline-block", background: R, color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 20, alignSelf: "center" }}>
              2026 CHAPTER ROSTER
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, color: "#111", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 8 }}>
              BNI <span style={{ color: R }}>United</span>
            </h1>
            <p style={{ fontSize: 14, color: "#666", letterSpacing: "0.04em" }}>
              Mumbai, India · Business Network International
            </p>

            <hr className="red-rule" style={{ width: 80, margin: "28px auto" }} />

            {/* Quote */}
            <blockquote style={{ maxWidth: "78%", margin: "0 auto", textAlign: "center" }}>
              <p style={{ fontSize: 16, fontStyle: "italic", color: "#333", lineHeight: 1.65, marginBottom: 12 }}>
                "The strength of your business is directly related to the size and quality of your network."
              </p>
              <footer style={{ fontSize: 12, color: R, fontWeight: 700 }}>
                — Dr. Ivan Misner, Founder &amp; Chairman, BNI
              </footer>
            </blockquote>
          </div>

          {/* Bottom stats strip */}
          <div style={{ borderTop: `2px solid ${R}`, paddingTop: 20, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              { label: "Active Members", value: activeMembers.length.toString() },
              { label: "Chapter Members", value: (activeMembers.length - supportTeam.length).toString() },
              { label: "Support Staff", value: supportTeam.length.toString() },
              { label: "Power Teams", value: "4" },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid #eee" : "none", padding: "0 8px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: R, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 9, color: "#bbb", textAlign: "center", marginTop: 16 }}>
            Generated {generatedDate}
          </p>
        </div>

        {/* ── PAGE 2: BNI CORE VALUES ── */}
        <div className="print-page">
          <div className="section-header">
            <h2>BNI Core Values</h2>
            <span>The Foundation of BNI's Culture</span>
          </div>

          <p style={{ fontSize: 11, color: "#666", marginBottom: 18, lineHeight: 1.6 }}>
            BNI was founded in 1985 on the principle of <strong style={{ color: R }}>"Givers Gain®"</strong> — the belief
            that by giving business to others, you will get business in return. These seven core values shape every interaction
            within the BNI community worldwide.
          </p>

          <div className="values-grid">
            {CORE_VALUES.map((v, i) => (
              <div key={v.label} className="value-card no-break">
                <div className="value-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="value-name">{v.label}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>

          <hr className="light-rule" style={{ marginTop: 24 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 9, color: "#bbb" }}>BNI United · 2026 Chapter Roster</p>
            <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" style={{ height: 20, objectFit: "contain", opacity: 0.4 }} />
          </div>
        </div>

        {/* ── PAGE 3: SUPPORT TEAM + LEADERSHIP ── */}
        <div className="print-page">
          {/* Support Team */}
          <div className="section-header">
            <h2>BNI United Support Team</h2>
            <span>{supportTeam.length} Staff</span>
          </div>
          <div className="staff-grid" style={{ gridTemplateColumns: `repeat(${Math.min(supportTeam.length, 4)}, 1fr)` }}>
            {supportTeam.map((m) => <StaffCard key={m.id} member={m} />)}
          </div>

          <hr className="light-rule" />

          {/* Leadership Team */}
          <div className="section-header" style={{ marginTop: 20 }}>
            <h2>Leadership Team</h2>
            <span>{leadership.length} Members</span>
          </div>
          <div className="members-grid-2col">
            {leadership.map((m) => (
              <div key={m.id} className="member-card no-break" style={{ padding: "12px 14px" }}>
                <MemberAvatar member={m} size={44} />
                <div className="member-info">
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
                    {m.first_name} {m.last_name}
                  </div>
                  {m.tagline && <div style={{ fontSize: 10, color: R, fontWeight: 600, marginTop: 2 }}>{m.tagline}</div>}
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{m.business_category}</div>
                  {m.company_name && <div style={{ fontSize: 9.5, color: "#888", marginTop: 1 }}>{m.company_name}</div>}
                </div>
              </div>
            ))}
          </div>

          <hr className="light-rule" style={{ marginTop: 24 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 9, color: "#bbb" }}>BNI United · 2026 Chapter Roster</p>
            <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" style={{ height: 20, objectFit: "contain", opacity: 0.4 }} />
          </div>
        </div>

        {/* ── PAGES 4-7: POWER TEAMS ── */}
        {POWER_TEAMS.map((pt) => {
          const ptMembers = byPowerTeam(pt)
          if (ptMembers.length === 0) return null
          return (
            <div key={pt} className="print-page">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 2, background: R, opacity: 0.2 }} />
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: R }}>
                  Power Team
                </div>
                <div style={{ flex: 1, height: 2, background: R, opacity: 0.2 }} />
              </div>

              <div className="section-header">
                <h2>{pt} Power Team</h2>
                <span>{ptMembers.length} Members</span>
              </div>

              <div className="members-grid">
                {ptMembers.map((m) => <MemberCard key={m.id} member={m} />)}
              </div>

              <hr className="light-rule" style={{ marginTop: 24 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 9, color: "#bbb" }}>BNI United · 2026 Chapter Roster</p>
                <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" style={{ height: 20, objectFit: "contain", opacity: 0.4 }} />
              </div>
            </div>
          )
        })}

        {/* Unassigned members */}
        {noPowerTeam.length > 0 && (
          <div className="print-page">
            <div className="section-header">
              <h2>Chapter Members</h2>
              <span>{noPowerTeam.length} Members</span>
            </div>
            <div className="members-grid">
              {noPowerTeam.map((m) => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        )}

        {/* ── LAST PAGE: CONTACT ── */}
        <div className="print-page" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="cover-accent-top" />

          <div>
            {/* Logos */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <img src="/BNiUnited_Logo_Color_1.png" alt="BNI United" style={{ height: 48, objectFit: "contain" }} />
              <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" style={{ height: 36, objectFit: "contain" }} />
            </div>

            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: R, marginBottom: 10 }}>
                Connect With Us
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: "#111", lineHeight: 1.2, marginBottom: 8 }}>
                BNI United
              </h2>
              <p style={{ fontSize: 13, color: "#666" }}>Mumbai, India · Business Network International</p>
            </div>

            <hr className="red-rule" style={{ width: "60%", margin: "0 auto 40px" }} />

            {/* Contact info */}
            <div style={{ maxWidth: "72%", margin: "0 auto" }}>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">{CONTACT.email}</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Instagram</div>
                  <div className="contact-value">{CONTACT.instagram}</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-label">LinkedIn</div>
                  <div className="contact-value">{CONTACT.linkedin}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: `2px solid ${R}`, paddingTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: R, letterSpacing: "0.08em" }}>"Givers Gain®"</p>
              <p style={{ fontSize: 9, color: "#bbb" }}>2026 Chapter Roster</p>
            </div>
            <p style={{ fontSize: 9, color: "#ccc", textAlign: "center" }}>
              © {new Date().getFullYear()} BNI United, Mumbai. All rights reserved. Generated {generatedDate}.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

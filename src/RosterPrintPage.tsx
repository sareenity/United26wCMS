import { useEffect, useState } from "react"
import type { Member } from "@/lib/types"
import { sortMembersBySurname } from "@/lib/utils"
import { Crown, Star } from "lucide-react"

// BNI brand red (matches oklch(0.46 0.22 26) in index.css)
const R = "#C8102E"

const CONTACT = {
  email: "bniuniteditdc@gmail.com",
  instagram: "bniunitedmumbai",
  instagramUrl: "https://www.instagram.com/bniunitedmumbai/",
  linkedin: "BNI United",
  linkedinUrl: "https://www.linkedin.com/in/bni-united-601082400/",
}

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

  .global-print-header {
    display: none;
  }

  .print-page {
    background: white; width: 210mm; min-height: 297mm;
    margin: 0 auto 20px; padding: 15mm 14mm;
    box-shadow: 0 2px 20px rgba(0,0,0,0.15);
    position: relative; overflow: hidden;
  }

  /* cover decorative elements */
  .cover-accent-top {
    position: absolute; top: 0; right: 0; width: 60mm; height: 60mm;
    background: ${R}; opacity: 0.05; border-radius: 0 0 0 100%;
  }

  /* headers & section */
  .screen-header {
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid ${R}; padding-bottom: 8px; margin-bottom: 15px;
    height: 48px;
  }
  .screen-header img.logo-left { height: 40px; object-fit: contain; }
  .screen-header img.logo-right { height: 30px; object-fit: contain; }

  .section-header {
    background: ${R}; color: white; padding: 5px 10px; margin-bottom: 10px;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .section-header h2 { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
  .section-header span { font-size: 10px; opacity: 0.8; }

  /* staff/leadership row cards (compacted to prevent A4 overflow) */
  .staff-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
  .staff-card {
    border: 1px solid #e8e8e8; border-radius: 6px; padding: 8px;
    text-align: center; break-inside: avoid;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 110px;
  }
  .staff-avatar {
    width: 36px; height: 36px; border-radius: 50%; margin-bottom: 4px;
    background: #fbe9ec; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: ${R}; overflow: hidden;
    flex-shrink: 0;
  }
  .staff-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .staff-name { font-size: 10.5px; font-weight: 700; color: #111; line-height: 1.3; }
  .staff-role { font-size: 8.5px; color: ${R}; font-weight: 600; margin-top: 1px; }
  .staff-company { font-size: 8px; color: #777; margin-top: 1px; }
  .staff-contact-info { display: flex; flex-direction: column; gap: 1px; margin-top: 5px; font-size: 8px; width: 100%; }
  .staff-contact-info a { color: #444; text-decoration: none; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }

  /* table roster styling */
  .roster-table-container {
    width: 100%;
    margin-top: 10px;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    overflow: hidden;
  }
  .roster-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  .roster-table th {
    background: #fcfcfc;
    border-bottom: 2px solid ${R};
    color: #333;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 8px 10px;
  }
  .roster-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }
  .roster-table tr {
    break-inside: avoid;
  }
  .roster-table tr:last-child td {
    border-bottom: none;
  }
  .roster-table tr:nth-child(even) td {
    background: #fdfdfd;
  }

  /* contact page */
  .contact-item { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .contact-icon {
    width: 36px; height: 36px; border-radius: 50%; background: ${R};
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .contact-label { font-size: 10px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .contact-value { font-size: 12px; font-weight: 600; color: #111; }
  .contact-value a { color: inherit; text-decoration: none; }
  .contact-value a:hover { text-decoration: underline; }

  hr.red-rule { border: none; border-top: 2px solid ${R}; margin: 16px 0; }
  hr.light-rule { border: none; border-top: 1px solid #eee; margin: 10px 0; }

  /* footer positioning */
  .print-footer {
    position: absolute;
    bottom: 12mm;
    left: 14mm;
    right: 14mm;
    border-top: 1px solid #eee;
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9px;
    color: #bbb;
  }

  @media print {
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4 portrait;
      margin: 20mm 10mm 15mm 10mm;
    }
    body { background: white; }
    .print-wrapper { padding: 0; }
    .no-print-bar { display: none !important; }
    
    .global-print-header {
      display: flex !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 14mm;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid ${R};
      background: white;
      z-index: 1000;
    }
    .global-print-header img.logo-left { height: 11mm; object-fit: contain; }
    .global-print-header img.logo-right { height: 7mm; object-fit: contain; }

    .print-page {
      width: 100%; min-height: initial !important; margin: 0; padding: 0;
      box-shadow: none; page-break-after: always;
      position: relative;
      padding-top: 18mm !important; /* Clears fixed header top spacing */
    }
    .print-page:last-child { page-break-after: avoid; }
    .no-break { page-break-inside: avoid; }
    .pb-before { page-break-before: always; }

    .screen-header { display: none !important; }
    
    .print-footer {
      position: absolute;
      bottom: 0mm;
      left: 0;
      right: 0;
    }
  }
`

function initials(m: Member) {
  return `${m.first_name[0] ?? ""}${m.last_name[0] ?? ""}`.toUpperCase()
}

function MemberAvatar({ member, size = 32 }: { member: Member; size?: number }) {
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
        fontSize: size * 0.35, fontWeight: 700, color: R, flexShrink: 0,
      }}
    >
      {initials(member)}
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
      <div className="staff-contact-info">
        {member.phone && <a href={`tel:${member.phone}`}>📞 {member.phone}</a>}
        {member.email && <a href={`mailto:${member.email}`} style={{ wordBreak: "break-all" }}>✉️ {member.email}</a>}
      </div>
    </div>
  )
}

export default function RosterPrintPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("roster-pdf-members")
    if (stored) {
      try {
        setMembers(JSON.parse(stored))
        localStorage.removeItem("roster-pdf-members")
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
  
  // Chapter roster contains all active members except support
  const rosterMembers = activeMembers.filter((m) => m.chapter_role !== "support")
  const sortedRoster = sortMembersBySurname(rosterMembers)

  // Chunk the roster to fit cleanly on pages (15 members per page)
  const MEMBERS_PER_PAGE = 15
  const chunkedRoster: Member[][] = []
  for (let i = 0; i < sortedRoster.length; i += MEMBERS_PER_PAGE) {
    chunkedRoster.push(sortedRoster.slice(i, i + MEMBERS_PER_PAGE))
  }

  const totalPrintPages = 1 + chunkedRoster.length + 1 // Support/Leadership + Roster Pages + Connect Page
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

      {/* Global Repeating Print Header */}
      <div className="global-print-header">
        <img src="/BNiUnited_Logo_Color_1.png" alt="BNI United" className="logo-left" />
        <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" className="logo-right" />
      </div>

      <div className="print-wrapper" style={{ paddingTop: "56px" }}>

        {/* ── PAGE 1: SUPPORT TEAM & LEADERSHIP ── */}
        <div className="print-page">
          <div className="screen-header">
            <img src="/BNiUnited_Logo_Color_1.png" alt="BNI United" className="logo-left" />
            <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" className="logo-right" />
          </div>

          {/* Page 1 Header Title */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: `2px solid #eee` }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: R, letterSpacing: "0.02em", textTransform: "uppercase" }}>
              BNI United Chapter Roster
            </h1>
          </div>

          {/* Support Team */}
          <div className="section-header">
            <h2>BNI United Support Team</h2>
            <span>{supportTeam.length} Staff</span>
          </div>
          <div className="staff-grid" style={{ gridTemplateColumns: `repeat(${supportTeam.length}, 1fr)` }}>
            {supportTeam.map((m) => <StaffCard key={m.id} member={m} />)}
          </div>

          <hr className="light-rule" />

          {/* Leadership Team */}
          <div className="section-header">
            <h2>Leadership Team</h2>
            <span>{leadership.length} Members</span>
          </div>
          <div className="staff-grid" style={{ gridTemplateColumns: `repeat(${leadership.length}, 1fr)` }}>
            {leadership.map((m) => <StaffCard key={m.id} member={m} />)}
          </div>

          <div className="print-footer">
            <span>BNI United · 2026 Chapter Roster</span>
            <span>Page 1 of {totalPrintPages}</span>
          </div>
        </div>

        {/* ── PAGES 2 to 2+N: CHAPTER ROSTER TABLE ── */}
        {chunkedRoster.map((pageMembers, pageIdx) => {
          const currentPageNum = pageIdx + 2
          return (
            <div key={pageIdx} className="print-page">
              <div className="screen-header">
                <img src="/BNiUnited_Logo_Color_1.png" alt="BNI United" className="logo-left" />
                <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" className="logo-right" />
              </div>

              <div className="section-header">
                <h2>BNI United Chapter Roster</h2>
                <span>{sortedRoster.length} Members</span>
              </div>

              <div className="roster-table-container">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30%" }}>Member</th>
                      <th style={{ width: "20%" }}>Power Team</th>
                      <th style={{ width: "25%" }}>Business Category &amp; Company</th>
                      <th style={{ width: "25%" }}>Contact Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageMembers.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <MemberAvatar member={m} size={28} />
                            <div>
                              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                                <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#111" }}>
                                  {m.first_name} {m.last_name}
                                </span>
                                {m.is_power_team_captain && (
                                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: R, borderRadius: "50%", padding: 2 }} title="Captain">
                                    <Crown size={8} style={{ color: "white" }} />
                                  </span>
                                )}
                                {m.is_power_team_vice_captain && (
                                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fbe9ec", borderRadius: "50%", padding: 2, border: `1px solid ${R}` }} title="Vice Captain">
                                    <Star size={8} style={{ color: R }} />
                                  </span>
                                )}
                              </div>
                              {m.chapter_role === "leadership" && m.tagline && (
                                <div style={{ fontSize: "8px", color: R, fontWeight: 600, marginTop: "1px" }}>
                                  {m.tagline}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: "9.5px", color: "#444" }}>
                          {m.power_team ?? "—"}
                        </td>
                        <td>
                          <div style={{ fontSize: "9.5px", fontWeight: 600, color: "#333", lineHeight: 1.2 }}>{m.business_category}</div>
                          {m.company_name && <div style={{ fontSize: "8.5px", color: "#777", marginTop: "1px" }}>{m.company_name}</div>}
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1px", fontSize: "9px" }}>
                            {m.phone && <a href={`tel:${m.phone}`} style={{ color: "#333", textDecoration: "none" }}>📞 {m.phone}</a>}
                            {m.email && <a href={`mailto:${m.email}`} style={{ color: "#333", textDecoration: "none", wordBreak: "break-all" }}>✉️ {m.email}</a>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="print-footer">
                <span>BNI United · 2026 Chapter Roster</span>
                <span>Page {currentPageNum} of {totalPrintPages}</span>
              </div>
            </div>
          )
        })}

        {/* ── LAST PAGE: BNI UNITED CONNECT ── */}
        <div className="print-page" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="screen-header">
            <img src="/BNiUnited_Logo_Color_1.png" alt="BNI United" className="logo-left" />
            <img src="/BNI_logo_Red_PMS_Final.png" alt="BNI" className="logo-right" />
          </div>

          <div className="cover-accent-top" />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: R, marginBottom: 8 }}>
                Connect With Us
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111", lineHeight: 1.2, marginBottom: 6 }}>
                BNI United
              </h2>
              <p style={{ fontSize: 13, color: "#666" }}>Mumbai, India · Business Network International</p>
            </div>

            <hr className="red-rule" style={{ width: "50%", margin: "0 auto 30px" }} />

            {/* Contact info */}
            <div style={{ maxWidth: "65%", margin: "0 auto" }}>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value" style={{ fontSize: "12px" }}>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </div>
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
                  <div className="contact-value" style={{ fontSize: "12px" }}>
                    <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">{CONTACT.instagram}</a>
                  </div>
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
                  <div className="contact-value" style={{ fontSize: "12px" }}>
                    <a href={CONTACT.linkedinUrl} target="_blank" rel="noopener noreferrer">{CONTACT.linkedin}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="print-footer" style={{ borderTop: `2px solid ${R}`, position: "relative", bottom: 0, left: 0, right: 0, marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: R, letterSpacing: "0.08em" }}>"Givers Gain®"</p>
              <p style={{ fontSize: 9, color: "#bbb" }}>Page {totalPrintPages} of {totalPrintPages}</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

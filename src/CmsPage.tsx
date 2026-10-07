import { useState, useEffect, useCallback } from "react"
import { AdminLogin } from "@/components/cms/AdminLogin"
import { AdminLayout } from "@/components/cms/AdminLayout"
import { MembersTable } from "@/components/cms/MembersTable"
import { MemberForm } from "@/components/cms/MemberForm"
import { StatisticsEditor } from "@/components/cms/StatisticsEditor"
import { getCommitteeData, getMembers, isAuthenticated, logout } from "@/lib/cmsApi"
import type { Committee, CommitteeMember, Member } from "@/lib/types"
import { resolveTermRoleData } from "@/lib/termRoleData"

export default function CmsPage() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [members, setMembers] = useState<Member[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [syncIssues, setSyncIssues] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<"members" | "statistics">("members")

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true)
    try {
      const [memberData, committeeData] = await Promise.all([
        getMembers(),
        getCommitteeData(),
      ])
      const rosterData = resolveTermRoleData(
        memberData,
        committeeData.committees,
        committeeData.committeeMembers,
      )
      setMembers(rosterData.members)
      setCommittees(rosterData.committees)
      setCommitteeMembers(rosterData.committeeMembers)

      const issues: string[] = []
      if (rosterData.source === "workbook") {
        issues.push("Workbook role mapping preview active; apply the included database migration before publishing role changes.")
      }
      if (rosterData.unmatchedNames.length > 0) {
        issues.push(`Not found in CMS: ${rosterData.unmatchedNames.join(", ")}.`)
      }
      if (rosterData.inactiveAssignedNames.length > 0) {
        issues.push(`Assigned but inactive: ${rosterData.inactiveAssignedNames.join(", ")}.`)
      }
      setSyncIssues(issues)
    } catch {
      if (!isAuthenticated()) setAuthed(false)
      // Leave existing data in place for transient non-authentication errors.
    } finally {
      setLoadingMembers(false)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchMembers()
  }, [authed, fetchMembers])

  function handleLoginSuccess() {
    setAuthed(true)
  }

  function handleLogout() {
    logout()
    setAuthed(false)
    setMembers([])
    setCommittees([])
    setCommitteeMembers([])
    localStorage.removeItem("roster-pdf-members")
  }

  function openAdd() {
    setEditingMember(null)
    setFormOpen(true)
  }

  function openEdit(member: Member) {
    setEditingMember(member)
    setFormOpen(true)
  }

  function handleDownloadPDF() {
    const activeMembers = members.filter((member) => member.is_active)
    const activeMemberIds = new Set(activeMembers.map((member) => member.id))
    localStorage.setItem("roster-pdf-members", JSON.stringify({
      members: activeMembers,
      committees,
      committeeMembers: committeeMembers.filter((assignment) => activeMemberIds.has(assignment.member_id)),
    }))
    window.open("/roster-pdf", "_blank", "noopener")
  }

  function handleSaved(saved: Member, savedAssignments: CommitteeMember[]) {
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [...prev, saved]
    })
    setCommitteeMembers((prev) => [
      ...prev.filter((assignment) => assignment.member_id !== saved.id),
      ...savedAssignments,
    ])
  }

  if (!authed) {
    return <AdminLogin onSuccess={handleLoginSuccess} />
  }

  return (
    <AdminLayout
      onLogout={handleLogout}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      breadcrumb={activeSection === "members" ? "Members" : "Statistics"}
    >
      {activeSection === "members" ? <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the BNI United chapter roster
          </p>
          {syncIssues.length > 0 && (
            <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Spreadsheet reconciliation: {syncIssues.join(" ")}
            </p>
          )}
        </div>

        <MembersTable
          members={members}
          committees={committees}
          committeeMembers={committeeMembers}
          loading={loadingMembers}
          onAdd={openAdd}
          onEdit={openEdit}
          onRefresh={fetchMembers}
          onDownloadPDF={handleDownloadPDF}
        />
      </div> : <StatisticsEditor />}

      {activeSection === "members" && (
        <MemberForm
          open={formOpen}
          member={editingMember}
          committees={committees}
          assignments={editingMember
            ? committeeMembers.filter((assignment) => assignment.member_id === editingMember.id)
            : []}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </AdminLayout>
  )
}

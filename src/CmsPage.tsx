import { useState, useEffect, useCallback } from "react"
import { AdminLogin } from "@/components/cms/AdminLogin"
import { AdminLayout } from "@/components/cms/AdminLayout"
import { MembersTable } from "@/components/cms/MembersTable"
import { MemberForm } from "@/components/cms/MemberForm"
import { isAuthenticated, getCommitteeData, getMembers } from "@/lib/cmsApi"
import type { Committee, CommitteeMember, Member } from "@/lib/types"
import { applyTermRoleData } from "@/lib/termRoleData"

export default function CmsPage() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [members, setMembers] = useState<Member[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [syncIssues, setSyncIssues] = useState<string[]>([])

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true)
    try {
      const [memberData, committeeData] = await Promise.all([
        getMembers(),
        getCommitteeData(),
      ])
      if (import.meta.env.DEV) {
        const preview = applyTermRoleData(memberData)
        setMembers(preview.members)
        setCommittees(preview.committees)
        setCommitteeMembers(preview.committeeMembers)
        const issues: string[] = []
        if (preview.unmatchedNames.length > 0) {
          issues.push(`Not found in CMS: ${preview.unmatchedNames.join(", ")}.`)
        }
        if (preview.inactiveAssignedNames.length > 0) {
          issues.push(`Assigned but inactive: ${preview.inactiveAssignedNames.join(", ")}.`)
        }
        setSyncIssues(issues)
      } else {
        setMembers(memberData)
        setCommittees(committeeData.committees)
        setCommitteeMembers(committeeData.committeeMembers)
        setSyncIssues([])
      }
    } catch {
      // Leave existing data in place on error
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
    setAuthed(false)
    setMembers([])
    setCommittees([])
    setCommitteeMembers([])
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
    localStorage.setItem("roster-pdf-members", JSON.stringify({
      members,
      committees,
      committeeMembers,
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
    <AdminLayout onLogout={handleLogout}>
      <div className="space-y-4">
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
      </div>

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
    </AdminLayout>
  )
}

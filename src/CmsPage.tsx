import { useState, useEffect, useCallback } from "react"
import { AdminLogin } from "@/components/cms/AdminLogin"
import { AdminLayout } from "@/components/cms/AdminLayout"
import { MembersTable } from "@/components/cms/MembersTable"
import { MemberForm } from "@/components/cms/MemberForm"
import { isAuthenticated, getMembers } from "@/lib/cmsApi"
import type { Member } from "@/lib/types"

export default function CmsPage() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [members, setMembers] = useState<Member[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true)
    try {
      const data = await getMembers()
      setMembers(data)
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
    localStorage.setItem("roster-pdf-members", JSON.stringify(members))
    window.open("/roster-pdf", "_blank", "noopener")
  }

  function handleSaved(saved: Member) {
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [...prev, saved]
    })
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
        </div>

        <MembersTable
          members={members}
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
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />
    </AdminLayout>
  )
}

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Pencil, ArchiveX, ArchiveRestore, Plus, Search, FileDown } from "lucide-react"
import { softDeleteMember, restoreMember } from "@/lib/cmsApi"
import type { Member } from "@/lib/types"
import { sortMembersBySurname } from "@/lib/utils"

interface MembersTableProps {
  members: Member[]
  loading: boolean
  onAdd: () => void
  onEdit: (member: Member) => void
  onRefresh: () => void
  onDownloadPDF: () => void
}

const ROLE_LABELS: Record<Member["chapter_role"], string> = {
  member: "Member",
  leadership: "Leadership",
  support: "Support",
}

const ROLE_VARIANTS: Record<Member["chapter_role"], "default" | "secondary" | "outline"> = {
  member: "outline",
  leadership: "default",
  support: "secondary",
}

export function MembersTable({ members, loading, onAdd, onEdit, onRefresh, onDownloadPDF }: MembersTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [confirmDeactivate, setConfirmDeactivate] = useState<Member | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const result = members.filter((m) => {
      const matchSearch =
        !q ||
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
        m.business_category.toLowerCase().includes(q) ||
        (m.company_name ?? "").toLowerCase().includes(q) ||
        (m.power_team ?? "").toLowerCase().includes(q)
      const matchRole = roleFilter === "all" || m.chapter_role === roleFilter
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && m.is_active) ||
        (statusFilter === "inactive" && !m.is_active)
      return matchSearch && matchRole && matchStatus
    })
    return sortMembersBySurname(result)
  }, [members, search, roleFilter, statusFilter])

  async function handleDeactivate(member: Member) {
    setActionLoading(member.id)
    try {
      await softDeleteMember(member.id)
      onRefresh()
    } finally {
      setActionLoading(null)
      setConfirmDeactivate(null)
    }
  }

  async function handleRestore(member: Member) {
    setActionLoading(member.id)
    try {
      await restoreMember(member.id)
      onRefresh()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, category, company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[145px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="member">Members</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAdd} className="gap-1.5 shrink-0">
          <Plus size={14} />
          Add member
        </Button>
        <Button variant="outline" onClick={onDownloadPDF} className="gap-1.5 shrink-0">
          <FileDown size={14} />
          Download PDF
        </Button>
      </div>

      {/* Stats breakdown */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          Showing {filtered.length} of {members.length}
        </span>
        {statusFilter === "all" && roleFilter === "all" && !loading && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              {members.filter((m) => m.chapter_role !== "support" && m.is_active).length} Chapter Members
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground" />
              {members.filter((m) => m.chapter_role === "support" && m.is_active).length} Support Staff
            </span>
            {members.filter((m) => !m.is_active).length > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-destructive/50" />
                {members.filter((m) => !m.is_active).length} Inactive
              </span>
            )}
          </>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[52px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Company</TableHead>
              <TableHead className="hidden xl:table-cell">Power Team</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[96px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-8 h-8 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                  {search || roleFilter !== "all" || statusFilter !== "all"
                    ? "No members match your filters"
                    : "No members found"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((member) => (
                <TableRow
                  key={member.id}
                  className={!member.is_active ? "opacity-50" : undefined}
                >
                  <TableCell>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.photo_url ?? undefined} className="object-cover" />
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {member.first_name[0]}{member.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {member.first_name} {member.last_name}
                      </p>
                      {member.tagline && (
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate max-w-[160px]">
                          {member.tagline}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground truncate max-w-[140px] block">
                      {member.business_category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground truncate max-w-[130px] block">
                      {member.company_name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {member.power_team ? (
                      <Badge variant="outline" className="text-xs font-normal">
                        {member.power_team}
                        {member.is_power_team_captain && " ★"}
                        {member.is_power_team_vice_captain && " ☆"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_VARIANTS[member.chapter_role]} className="text-xs">
                      {ROLE_LABELS[member.chapter_role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.is_active ? "default" : "outline"}
                      className={`text-xs ${member.is_active ? "bg-emerald-600 hover:bg-emerald-600 text-white border-0" : "text-muted-foreground"}`}
                    >
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onEdit(member)}
                          >
                            <Pencil size={13} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      {member.is_active ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setConfirmDeactivate(member)}
                              disabled={actionLoading === member.id}
                            >
                              <ArchiveX size={13} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Deactivate</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50"
                              onClick={() => handleRestore(member)}
                              disabled={actionLoading === member.id}
                            >
                              <ArchiveRestore size={13} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Restore</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Deactivate confirmation */}
      <AlertDialog
        open={!!confirmDeactivate}
        onOpenChange={(v) => { if (!v) setConfirmDeactivate(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate member?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeactivate?.first_name} {confirmDeactivate?.last_name} will be marked as
              inactive and hidden from the public directory. You can restore them at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => confirmDeactivate && handleDeactivate(confirmDeactivate)}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

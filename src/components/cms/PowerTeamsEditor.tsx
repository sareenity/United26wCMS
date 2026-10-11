import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { savePowerTeams } from "@/lib/cmsApi"
import { OCT26_MAR27_POWER_TEAM_ROSTER } from "@/lib/powerTeams"
import {
  POWER_TEAM_NAMES,
  type Member,
  type PowerTeamAssignmentInput,
  type PowerTeamName,
} from "@/lib/types"
import { sortMembersByFirstName } from "@/lib/utils"

type TeamRole = "member" | "captain" | "vice-captain"

interface EditorAssignment {
  powerTeam: PowerTeamName | ""
  role: TeamRole
}

interface PowerTeamsEditorProps {
  members: Member[]
  onSaved: (members: Member[]) => void
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase()
}

function buildAssignments(members: Member[]): Record<string, EditorAssignment> {
  return Object.fromEntries(
    members
      .filter((member) => member.is_active && member.chapter_role !== "support")
      .map((member) => [
        member.id,
        {
          powerTeam: POWER_TEAM_NAMES.includes(member.power_team as PowerTeamName)
            ? member.power_team as PowerTeamName
            : "",
          role: member.is_power_team_captain
            ? "captain"
            : member.is_power_team_vice_captain
              ? "vice-captain"
              : "member",
        },
      ]),
  )
}

export function PowerTeamsEditor({ members, onSaved }: PowerTeamsEditorProps) {
  const activeMembers = useMemo(
    () => sortMembersByFirstName(
      members.filter((member) => member.is_active && member.chapter_role !== "support"),
    ),
    [members],
  )
  const [assignments, setAssignments] = useState<Record<string, EditorAssignment>>({})
  const [savedSnapshot, setSavedSnapshot] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    const next = buildAssignments(members)
    setAssignments(next)
    setSavedSnapshot(JSON.stringify(next))
    setError(null)
  }, [members])

  const currentSnapshot = useMemo(() => JSON.stringify(assignments), [assignments])
  const isDirty = savedSnapshot !== "" && currentSnapshot !== savedSnapshot

  const teamCounts = useMemo(() => (
    Object.fromEntries(POWER_TEAM_NAMES.map((team) => [
      team,
      Object.values(assignments).filter((assignment) => assignment.powerTeam === team).length,
    ])) as Record<PowerTeamName, number>
  ), [assignments])

  function updateAssignment(
    memberId: string,
    field: "powerTeam" | "role",
    value: PowerTeamName | TeamRole,
  ) {
    setSavedMessage(false)
    setError(null)
    setAssignments((current) => ({
      ...current,
      [memberId]: { ...current[memberId], [field]: value },
    }))
  }

  function applyCurrentTermRoster() {
    const membersByName = new Map(
      activeMembers.map((member) => [
        normalizeName(`${member.first_name} ${member.last_name}`),
        member,
      ]),
    )
    const presetByName = new Map(
      OCT26_MAR27_POWER_TEAM_ROSTER.map((row) => [normalizeName(row.memberName), row]),
    )
    const missing = OCT26_MAR27_POWER_TEAM_ROSTER
      .filter((row) => !membersByName.has(normalizeName(row.memberName)))
      .map((row) => row.memberName)
    const notInRoster = activeMembers
      .filter((member) => !presetByName.has(normalizeName(`${member.first_name} ${member.last_name}`)))
      .map((member) => `${member.first_name} ${member.last_name}`)

    if (missing.length > 0 || notInRoster.length > 0) {
      const details = [
        missing.length > 0 ? `Not found in CMS: ${missing.join(", ")}.` : "",
        notInRoster.length > 0 ? `Active members missing from the supplied roster: ${notInRoster.join(", ")}.` : "",
      ].filter(Boolean).join(" ")
      setError(details)
      return
    }

    setAssignments(Object.fromEntries(activeMembers.map((member) => {
      const row = presetByName.get(normalizeName(`${member.first_name} ${member.last_name}`))!
      return [member.id, { powerTeam: row.powerTeam, role: row.role }]
    })))
    setSavedMessage(false)
    setError(null)
  }

  function validate(): string | null {
    if (activeMembers.some((member) => !assignments[member.id]?.powerTeam)) {
      return "Assign every active chapter member to a Power Team."
    }

    for (const team of POWER_TEAM_NAMES) {
      const teamAssignments = Object.values(assignments).filter(
        (assignment) => assignment.powerTeam === team,
      )
      if (teamAssignments.length === 0) return `${team} needs at least one member.`
      if (teamAssignments.filter((assignment) => assignment.role === "captain").length !== 1) {
        return `${team} needs exactly one captain.`
      }
      if (teamAssignments.filter((assignment) => assignment.role === "vice-captain").length !== 1) {
        return `${team} needs exactly one vice captain.`
      }
    }

    return null
  }

  async function handleSave() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError(null)
    setSavedMessage(false)
    try {
      const payload: PowerTeamAssignmentInput[] = activeMembers.map((member) => {
        const assignment = assignments[member.id]
        return {
          id: member.id,
          power_team: assignment.powerTeam as PowerTeamName,
          is_power_team_captain: assignment.role === "captain",
          is_power_team_vice_captain: assignment.role === "vice-captain",
        }
      })
      const saved = await savePowerTeams(payload)
      const next = buildAssignments(saved)
      setAssignments(next)
      setSavedSnapshot(JSON.stringify(next))
      setSavedMessage(true)
      onSaved(saved)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save Power Teams")
    } finally {
      setSaving(false)
    }
  }

  function resetChanges() {
    if (!savedSnapshot) return
    setAssignments(JSON.parse(savedSnapshot) as Record<string, EditorAssignment>)
    setError(null)
    setSavedMessage(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Power Teams</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Assign every active chapter member and maintain one captain and vice captain per team.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={applyCurrentTermRoster} disabled={saving}>
            <Sparkles size={14} />
            Load Oct ’26–Mar ’27 roster
          </Button>
          <Button variant="outline" onClick={resetChanges} disabled={!isDirty || saving}>
            <RotateCcw size={14} />
            Reset changes
          </Button>
          <Button onClick={() => void handleSave()} disabled={!isDirty || saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save all changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {POWER_TEAM_NAMES.map((team) => (
          <Badge key={team} variant="secondary" className="px-3 py-1 text-xs">
            {team}: {teamCounts[team]}
          </Badge>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {savedMessage && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 />
          <AlertDescription className="text-current">
            Power Teams saved. The public roster will use these assignments on its next load.
          </AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="w-[330px]">Power Team</TableHead>
              <TableHead className="w-[180px]">Team Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeMembers.map((member) => {
              const assignment = assignments[member.id] ?? { powerTeam: "", role: "member" as const }
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    <p className="text-xs text-muted-foreground">{member.business_category}</p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={assignment.powerTeam || undefined}
                      onValueChange={(value) => updateAssignment(member.id, "powerTeam", value as PowerTeamName)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {POWER_TEAM_NAMES.map((team) => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={assignment.role}
                      onValueChange={(value) => updateAssignment(member.id, "role", value as TeamRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="captain">Captain</SelectItem>
                        <SelectItem value="vice-captain">Vice Captain</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button onClick={() => void handleSave()} disabled={!isDirty || saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save all changes"}
        </Button>
      </div>
    </div>
  )
}

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import type { Member, Committee, CommitteeMember, PowerTeamName } from "@/lib/types"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { StatsSection } from "@/components/StatsSection"
import { SupportTeamSection } from "@/components/SupportTeamSection"
import { LeadershipSection } from "@/components/LeadershipSection"
import { CommitteesSection } from "@/components/CommitteesSection"
import { PowerTeamsSection } from "@/components/PowerTeamsSection"
import { MemberDialog } from "@/components/MemberDialog"
import { Footer } from "@/components/Footer"
import { Loader2, AlertCircle } from "lucide-react"
import { matchMember } from "@/lib/search"
import { sortMembersBySurname } from "@/lib/utils"


export default function App() {
  const [members, setMembers] = useState<Member[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [membersRes, committeesRes, cmRes] = await Promise.all([
          supabase.from("members").select("*").order("sort_order"),
          supabase.from("committees").select("*").order("sort_order"),
          supabase.from("committee_members").select("*"),
        ])

        if (membersRes.error) throw membersRes.error
        if (committeesRes.error) throw committeesRes.error
        if (cmRes.error) throw cmRes.error

        setMembers(membersRes.data as Member[])
        setCommittees(committeesRes.data as Committee[])
        setCommitteeMembers(cmRes.data as CommitteeMember[])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const supportMembers = useMemo(
    () => members.filter((m) => m.chapter_role === "support"),
    [members]
  )

  const leadershipMembers = useMemo(
    () => members.filter((m) => m.chapter_role === "leadership"),
    [members]
  )

  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members]
  )

  const committeeMembersMap = useMemo(() => {
    const map: Record<string, CommitteeMember[]> = {}
    for (const cm of committeeMembers) {
      if (!map[cm.committee_id]) map[cm.committee_id] = []
      map[cm.committee_id].push(cm)
    }
    return map
  }, [committeeMembers])

  const membersByTeam = useMemo(() => {
    const teams: Record<PowerTeamName, Member[]> = {
      Corporate: [],
      "Lifestyle & Wellness": [],
      MSME: [],
      Property: [],
    }
    for (const m of members) {
      if (m.power_team && m.power_team in teams) {
        teams[m.power_team as PowerTeamName].push(m)
      }
    }
    return teams
  }, [members])

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return []
    return sortMembersBySurname(members.filter((m) => matchMember(m, searchQuery)))
  }, [members, searchQuery])

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 size={36} className="animate-spin text-primary" />
          <p className="text-sm">Loading chapter roster...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle size={36} className="text-destructive" />
          <p className="font-semibold text-foreground">Failed to load roster</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <Header />

      <HeroSection
        totalMembers={members.length - supportMembers.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {searchQuery.trim() ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            {filteredMembers.length === 0
              ? `No results for "${searchQuery}"`
              : `${filteredMembers.length} result${filteredMembers.length === 1 ? "" : "s"} for "${searchQuery}"`}
          </h2>
          {filteredMembers.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMembers.map((m) => (
                <button
                  key={m.id}
                  className="w-full text-left"
                  onClick={() => handleMemberClick(m)}
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {m.first_name[0]}{m.last_name[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        <span className="text-primary">{m.first_name}</span>{" "}
                        <span>{m.last_name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{m.business_category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <StatsSection />
          <SupportTeamSection members={supportMembers} />
          <LeadershipSection members={leadershipMembers} onMemberClick={handleMemberClick} />
          <CommitteesSection
            committees={committees}
            committeeMembersMap={committeeMembersMap}
            membersById={membersById}
            onMemberClick={handleMemberClick}
          />
          <PowerTeamsSection membersByTeam={membersByTeam} onMemberClick={handleMemberClick} />
        </>
      )}

      <Footer />

      <MemberDialog
        member={selectedMember}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}

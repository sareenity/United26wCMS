import { Building, Crown, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MemberCard } from "@/components/MemberCard"
import type { Member, PowerTeamName } from "@/lib/types"
import { POWER_TEAM_DEFINITIONS } from "@/lib/powerTeams"
import { sortMembersByFirstName } from "@/lib/utils"

interface PowerTeamsSectionProps {
  membersByTeam: Record<PowerTeamName, Member[]>
  onMemberClick: (m: Member) => void
}

function TeamHeader({ members }: { members: Member[] }) {
  const captain = members.find((m) => m.is_power_team_captain)
  const viceCaptain = members.find((m) => m.is_power_team_vice_captain)

  if (!captain && !viceCaptain) return null

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {captain && (
        <div className="flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full">
          <Crown size={14} />
          <span>Captain: {captain.first_name} {captain.last_name}</span>
        </div>
      )}
      {viceCaptain && (
        <div className="flex items-center gap-2 bg-secondary text-foreground text-sm font-medium px-4 py-2 rounded-full border border-primary/20">
          <Star size={14} className="text-primary" />
          <span>Vice Captain: {viceCaptain.first_name} {viceCaptain.last_name}</span>
        </div>
      )}
    </div>
  )
}

export function PowerTeamsSection({ membersByTeam, onMemberClick }: PowerTeamsSectionProps) {
  const allMembers = sortMembersByFirstName(POWER_TEAM_DEFINITIONS.flatMap((t) => membersByTeam[t.name] || []))

  return (
    <section id="power-teams" className="bg-secondary/20 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Building size={12} /> Power Teams
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Power Teams</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Members grouped by business synergy to maximise referral opportunities
          </p>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-muted">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
            >
              All
              <span className="ml-1.5 text-xs opacity-70">({allMembers.length})</span>
            </TabsTrigger>
            {POWER_TEAM_DEFINITIONS.map((team) => (
              <TabsTrigger
                key={team.name}
                value={team.name}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
              >
                {team.name}
                <span className="ml-1.5 text-xs opacity-70">
                  ({(membersByTeam[team.name] || []).length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <p className="text-sm text-muted-foreground mb-5">All chapter members across every Power Team</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allMembers.map((m) => (
                <MemberCard key={m.id} member={m} onClick={onMemberClick} showBadge={false} />
              ))}
            </div>
          </TabsContent>

          {POWER_TEAM_DEFINITIONS.map((team) => {
            const members = sortMembersByFirstName(membersByTeam[team.name] || [])
            return (
              <TabsContent key={team.name} value={team.name}>
                <p className="text-sm text-muted-foreground mb-5">{team.description}</p>
                <TeamHeader members={members} />
                {members.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No members in this team yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {members.map((m) => (
                      <MemberCard key={m.id} member={m} onClick={onMemberClick} />
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

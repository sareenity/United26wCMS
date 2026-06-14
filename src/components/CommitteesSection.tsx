import { Layers, ChevronDown, UserCheck } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { MemberAvatar } from "@/components/MemberAvatar"
import type { Committee, CommitteeMember, Member } from "@/lib/types"

interface CommitteesSectionProps {
  committees: Committee[]
  committeeMembersMap: Record<string, CommitteeMember[]>
  membersById: Record<string, Member>
  onMemberClick: (m: Member) => void
}

function MemberRow({ cm, membersById, onMemberClick }: {
  cm: CommitteeMember
  membersById: Record<string, Member>
  onMemberClick: (m: Member) => void
}) {
  const member = membersById[cm.member_id]
  if (!member) return null

  return (
    <button
      className="flex items-center gap-3 w-full text-left py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors group"
      onClick={() => onMemberClick(member)}
    >
      <MemberAvatar
        photoUrl={member.photo_url}
        firstName={member.first_name}
        lastName={member.last_name}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium group-hover:text-primary transition-colors">
          <span className="text-primary">{member.first_name}</span>{" "}
          <span className="text-foreground">{member.last_name}</span>
        </p>
        <p className="text-xs text-muted-foreground truncate">{member.business_category}</p>
      </div>
      {cm.role !== "member" && (
        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 shrink-0 capitalize">
          {cm.role}
        </Badge>
      )}
    </button>
  )
}

function CommitteeBlock({ members, membersById, onMemberClick }: {
  members: CommitteeMember[]
  membersById: Record<string, Member>
  onMemberClick: (m: Member) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>
      </div>
      {members.length > 0 ? (
        members.map((cm) => (
          <MemberRow key={cm.id} cm={cm} membersById={membersById} onMemberClick={onMemberClick} />
        ))
      ) : (
        <p className="text-sm text-muted-foreground py-2 px-3">No members assigned</p>
      )}
    </div>
  )
}

export function CommitteesSection({ committees, committeeMembersMap, membersById, onMemberClick }: CommitteesSectionProps) {
  const membershipCommittee = committees.find((c) => c.committee_group === "membership")
  const visitorHostCommittee = committees.find((c) => c.committee_group === "visitor_host")
  const coordinatorCommittees = committees
    .filter((c) => c.committee_group === "coordinator")
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <section id="committees" className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Layers size={12} /> Committees
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Chapter Committees</h2>
          <p className="text-muted-foreground text-sm mt-2">The working engine behind every successful chapter meeting</p>
        </div>

        <Accordion type="multiple" className="space-y-3">
          {/* Membership Committee */}
          {membershipCommittee && (
            <AccordionItem value="membership" className="border border-border rounded-xl overflow-hidden">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 [&[data-state=open]]:bg-primary/5">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <UserCheck size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{membershipCommittee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(committeeMembersMap[membershipCommittee.id] || []).length} members
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 pt-2">
                <CommitteeBlock
                  members={committeeMembersMap[membershipCommittee.id] || []}
                  membersById={membersById}
                  onMemberClick={onMemberClick}
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Visitor Host Team */}
          {visitorHostCommittee && (
            <AccordionItem value="visitor_host" className="border border-border rounded-xl overflow-hidden">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 [&[data-state=open]]:bg-primary/5">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <UserCheck size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{visitorHostCommittee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(committeeMembersMap[visitorHostCommittee.id] || []).length} members
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 pt-2">
                <CommitteeBlock
                  members={committeeMembersMap[visitorHostCommittee.id] || []}
                  membersById={membersById}
                  onMemberClick={onMemberClick}
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Coordinators — nested accordion */}
          {coordinatorCommittees.length > 0 && (
            <AccordionItem value="coordinators" className="border border-border rounded-xl overflow-hidden">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 [&[data-state=open]]:bg-primary/5">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Coordinators</p>
                    <p className="text-xs text-muted-foreground">{coordinatorCommittees.length} coordinator roles</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 pt-2">
                <Accordion type="multiple" className="space-y-2">
                  {coordinatorCommittees.map((c) => (
                    <AccordionItem
                      key={c.id}
                      value={c.id}
                      className="border border-border/60 rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/40 text-sm [&[data-state=open]]:bg-primary/5">
                        <div className="flex items-center gap-2 text-left">
                          <ChevronDown size={14} className="text-primary shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                          <span className="font-medium text-foreground text-sm">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({(committeeMembersMap[c.id] || []).length})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 pt-1">
                        <CommitteeBlock
                          members={committeeMembersMap[c.id] || []}
                          membersById={membersById}
                          onMemberClick={onMemberClick}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </section>
  )
}

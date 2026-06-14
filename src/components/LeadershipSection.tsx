import { Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MemberAvatar } from "@/components/MemberAvatar"
import type { Member } from "@/lib/types"

interface LeadershipSectionProps {
  members: Member[]
  onMemberClick: (m: Member) => void
}

export function LeadershipSection({ members, onMemberClick }: LeadershipSectionProps) {
  if (!members.length) return null

  return (
    <section id="leadership" className="bg-secondary/20 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Award size={12} /> Leadership
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">BNI United Leadership Team</h2>
          <p className="text-muted-foreground text-sm mt-2">Guiding the chapter towards excellence and growth</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {members.map((m) => (
            <Card
              key={m.id}
              className="border-2 border-primary/20 hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white"
              onClick={() => onMemberClick(m)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="ring-4 ring-primary/20 rounded-full">
                    <MemberAvatar
                      photoUrl={m.photo_url}
                      firstName={m.first_name}
                      lastName={m.last_name}
                      size="lg"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs whitespace-nowrap shadow-sm">
                      {m.tagline}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="font-bold text-lg">
                    <span className="text-primary">{m.first_name}</span>{" "}
                    <span className="text-foreground">{m.last_name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{m.business_category}</p>
                  {m.company_name && (
                    <p className="text-xs text-foreground/60">{m.company_name}</p>
                  )}
                  {m.power_team && (
                    <p className="text-xs text-primary font-medium mt-1">{m.power_team} Power Team</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

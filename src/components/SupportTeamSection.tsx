import { Headset } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MemberAvatar } from "@/components/MemberAvatar"
import type { Member } from "@/lib/types"

interface SupportTeamSectionProps {
  members: Member[]
}

export function SupportTeamSection({ members }: SupportTeamSectionProps) {
  if (!members.length) return null

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Headset size={12} /> BNI Support
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">BNI Support Team</h2>
          <p className="text-muted-foreground text-sm mt-2">Our dedicated BNI professionals supporting chapter success</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {members.map((m) => (
            <Card key={m.id} className="border border-border bg-secondary/20">
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <MemberAvatar
                  photoUrl={m.photo_url}
                  firstName={m.first_name}
                  lastName={m.last_name}
                  size="md"
                />
                <div>
                  <p className="font-bold text-sm">
                    <span className="text-primary">{m.first_name}</span>{" "}
                    <span className="text-foreground">{m.last_name}</span>
                  </p>
                  {m.tagline && (
                    <Badge variant="secondary" className="mt-1.5 text-xs bg-primary/10 text-primary border-primary/20">
                      {m.tagline}
                    </Badge>
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

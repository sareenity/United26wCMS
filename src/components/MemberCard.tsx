import { Mail, Phone, Globe, Crown, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MemberAvatar } from "@/components/MemberAvatar"
import { cn } from "@/lib/utils"
import type { Member } from "@/lib/types"

interface MemberCardProps {
  member: Member
  onClick: (member: Member) => void
  className?: string
  showBadge?: boolean
}

export function MemberCard({ member, onClick, className, showBadge = true }: MemberCardProps) {
  const isLeadership = member.chapter_role === "leadership"

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-border",
        isLeadership && "ring-1 ring-primary/20",
        className
      )}
      onClick={() => onClick(member)}
    >
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        <div className="relative">
          <MemberAvatar
            photoUrl={member.photo_url}
            firstName={member.first_name}
            lastName={member.last_name}
            size="md"
          />
          {member.is_power_team_captain && (
            <span className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
              <Crown size={10} className="text-primary-foreground" />
            </span>
          )}
          {member.is_power_team_vice_captain && (
            <span className="absolute -top-1 -right-1 bg-secondary rounded-full p-0.5 border border-primary">
              <Star size={10} className="text-primary" />
            </span>
          )}
        </div>

        <div className="space-y-1 min-w-0 w-full">
          <p className="font-semibold text-sm leading-tight">
            <span className="text-primary">{member.first_name}</span>{" "}
            <span className="text-foreground">{member.last_name}</span>
          </p>
          {member.tagline && isLeadership ? (
            <p className="text-xs text-primary font-medium">{member.tagline}</p>
          ) : null}
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{member.business_category}</p>
          {member.company_name && (
            <p className="text-xs text-foreground/70 leading-snug line-clamp-1">{member.company_name}</p>
          )}
        </div>

        {showBadge && (member.is_power_team_captain || member.is_power_team_vice_captain) && (
          <Badge
            variant="secondary"
            className="text-xs bg-primary/10 text-primary border-primary/20"
          >
            {member.is_power_team_captain ? "Captain" : "Vice Captain"}
          </Badge>
        )}

        <div className="flex items-center gap-3 mt-1">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={14} />
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone size={14} />
            </a>
          )}
          {member.website && (
            <a
              href={member.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe size={14} />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

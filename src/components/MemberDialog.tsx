import { Mail, Phone, Globe, X, Briefcase, Building2, Crown, Star } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MemberAvatar } from "@/components/MemberAvatar"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Member } from "@/lib/types"

interface MemberDialogProps {
  member: Member | null
  open: boolean
  onClose: () => void
}

function MemberDetailContent({ member, onClose }: { member: Member; onClose: () => void }) {
  const isLeadership = member.chapter_role === "leadership"

  return (
    <div className="flex flex-col">
      {/* Red header */}
      <div className="bg-primary relative px-6 pt-6 pb-12">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="text-xs text-white/70 font-medium uppercase tracking-widest mb-1">BNI United</div>
        <div className="text-white/60 text-xs">2026 Chapter Roster</div>
      </div>

      {/* Avatar overlapping header */}
      <div className="relative px-6 -mt-10 mb-4">
        <div className="flex items-end gap-4">
          <div className="ring-4 ring-white rounded-full shadow-lg">
            <MemberAvatar
              photoUrl={member.photo_url}
              firstName={member.first_name}
              lastName={member.last_name}
              size="xl"
            />
          </div>
          <div className="pb-2 space-y-1">
            {member.is_power_team_captain && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                <Crown size={10} /> Captain
              </Badge>
            )}
            {member.is_power_team_vice_captain && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                <Star size={10} /> Vice Captain
              </Badge>
            )}
            {isLeadership && member.tagline && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                {member.tagline}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Name & category */}
      <div className="px-6 mb-5">
        <h2 className="text-2xl font-bold leading-tight">
          <span className="text-primary">{member.first_name}</span>{" "}
          <span className="text-foreground">{member.last_name}</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{member.business_category}</p>
      </div>

      {/* Details */}
      <div className="px-6 space-y-3 mb-6">
        {member.company_name && (
          <div className="flex items-center gap-3 text-sm">
            <Building2 size={16} className="text-primary shrink-0" />
            <span>{member.company_name}</span>
          </div>
        )}
        {member.power_team && (
          <div className="flex items-center gap-3 text-sm">
            <Briefcase size={16} className="text-primary shrink-0" />
            <span>Power Team: <strong>{member.power_team}</strong></span>
          </div>
        )}
      </div>

      {/* Contact actions */}
      {(member.email || member.phone || member.website) && (
        <div className="px-6 mb-6 flex flex-wrap gap-2">
          {member.email && (
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <a href={`mailto:${member.email}`}>
                <Mail size={14} /> Email
              </a>
            </Button>
          )}
          {member.phone && (
            <Button asChild size="sm" variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
              <a href={`tel:${member.phone}`}>
                <Phone size={14} /> Call
              </a>
            </Button>
          )}
          {member.website && (
            <Button asChild size="sm" variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
              <a href={member.website} target="_blank" rel="noopener noreferrer">
                <Globe size={14} /> Website
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mx-6 border-t border-border mb-4" />

      {/* BNI tagline */}
      <div className="px-6 pb-6">
        <p className="text-xs text-muted-foreground italic text-center">
          "Givers Gain" — BNI Core Philosophy
        </p>
      </div>
    </div>
  )
}

export function MemberDialog({ member, open, onClose }: MemberDialogProps) {
  const isMobile = useIsMobile()

  if (!member) return null

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="bottom" className="p-0 rounded-t-2xl max-h-[90dvh] overflow-y-auto">
          <SheetTitle className="sr-only">{member.first_name} {member.last_name}</SheetTitle>
          <MemberDetailContent member={member} onClose={onClose} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 max-w-md overflow-hidden">
        <DialogTitle className="sr-only">{member.first_name} {member.last_name}</DialogTitle>
        <MemberDetailContent member={member} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

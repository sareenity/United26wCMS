import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MemberAvatarProps {
  photoUrl?: string | null
  firstName: string
  lastName: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
}

const textSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
}

export function MemberAvatar({ photoUrl, firstName, lastName, size = "md", className }: MemberAvatarProps) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {photoUrl && <AvatarImage src={photoUrl} alt={`${firstName} ${lastName}`} className="object-cover" />}
      <AvatarFallback className="bg-primary/10 border-2 border-primary/20">
        <span className={cn("font-semibold text-primary", textSizes[size])}>{initials}</span>
      </AvatarFallback>
    </Avatar>
  )
}

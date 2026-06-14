import { Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeroSectionProps {
  totalMembers: number
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function HeroSection({ totalMembers, searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <section className="relative bg-white overflow-hidden" id="chapter">
      {/* BNI Super Graphic accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "var(--bni-red)" }}
        />
        <div
          className="absolute -right-8 top-16 w-64 h-64 rounded-full opacity-[0.03]"
          style={{ background: "var(--bni-red)" }}
        />
        {/* Diagonal stripe */}
        <div
          className="absolute top-0 right-0 w-full h-full opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              var(--bni-red) 0px,
              var(--bni-red) 2px,
              transparent 2px,
              transparent 24px
            )`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-3xl">
          {/* Chapter badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            2026 Chapter Roster
          </div>

          {/* Logos stacked on mobile */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <img
              src="/BNiUnited_Logo_Color_1.png"
              alt="BNI United"
              className="h-12 md:h-16 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = "none" }}
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
            Welcome to{" "}
            <span className="text-primary">BNI United</span>
          </h1>

          <blockquote className="border-l-4 border-primary pl-4 mb-6">
            <p className="text-base md:text-lg text-muted-foreground italic leading-relaxed">
              "The strength of your business is directly related to the size and quality of your network."
            </p>
            <footer className="text-sm text-primary font-semibold mt-2">— Dr. Ivan Misner, Founder, BNI</footer>
          </blockquote>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users size={16} className="text-primary" />
              <span>{totalMembers > 0 ? totalMembers : "—"} Members</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="text-sm font-medium text-foreground">Mumbai, India</div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="text-sm font-medium text-foreground">Est. BNI Chapter</div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search members by name, category, or company..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-sm bg-white border-border focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Bottom red line */}
      <div className="h-1 bg-primary w-full" />
    </section>
  )
}

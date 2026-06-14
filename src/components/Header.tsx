import { useState } from "react"
import { Menu, X, Users, BarChart3, Award, Layers, Building } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
const NAV_ITEMS = [
  { label: "Chapter", href: "#chapter", icon: Users },
  { label: "Stats", href: "#stats", icon: BarChart3 },
  { label: "Leadership", href: "#leadership", icon: Award },
  { label: "Committees", href: "#committees", icon: Layers },
  { label: "Power Teams", href: "#power-teams", icon: Building },
]

export function Header() {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo left */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/BNiUnited_Logo_Color_1.png"
            alt="BNI United"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right: BNI logo + hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/BNI_logo_Red_PMS_Final.png"
            alt="BNI"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-72 px-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <span className="font-semibold text-primary">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors text-left"
              >
                <item.icon size={18} className="text-primary" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">BNI United — Mumbai</p>
            <p className="text-xs text-muted-foreground text-center">2026 Chapter Roster</p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

import { Mail, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo & tagline */}
          <div className="space-y-3">
            <img
              src="/BNiUnited_Logo_Color_1.png"
              alt="BNI United"
              className="h-10 w-auto object-contain brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                const el = e.currentTarget.nextElementSibling as HTMLElement
                if (el) el.style.display = "block"
              }}
            />
            <p className="text-background/80 text-sm hidden" id="footer-fallback-title">
              <strong>BNI United</strong>
            </p>
            <p className="text-background/60 text-sm max-w-xs">
              A chapter of Business Network International — Mumbai, India
            </p>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest">
              "Givers Gain"
            </p>
          </div>

          {/* Social links */}
          <div className="space-y-4">
            <p className="text-background/40 text-xs uppercase tracking-widest font-semibold">Connect</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:bniuniteditdc@gmail.com"
                className="flex items-center gap-2.5 text-sm text-background/70 hover:text-primary transition-colors group"
              >
                <Mail size={16} className="shrink-0 group-hover:text-primary" />
                bniuniteditdc@gmail.com
              </a>
              <a
                href="https://www.instagram.com/bniunitedmumbai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-background/70 hover:text-primary transition-colors group"
              >
                <ExternalLink size={16} className="shrink-0 group-hover:text-primary" />
                bniunitedmumbai (Instagram)
              </a>
              <a
                href="https://www.linkedin.com/in/bni-united-601082400/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-background/70 hover:text-primary transition-colors group"
              >
                <ExternalLink size={16} className="shrink-0 group-hover:text-primary" />
                BNI United (LinkedIn)
              </a>
            </div>
          </div>

          {/* BNI Logo */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <img
              src="/BNI_logo_Red_PMS_Final.png"
              alt="BNI"
              className="h-10 w-auto object-contain brightness-0 invert"
              onError={(e) => { e.currentTarget.style.display = "none" }}
            />
            <p className="text-background/40 text-xs">Business Network International</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-background/40 text-xs">
            © {new Date().getFullYear()} BNI United, Mumbai. All rights reserved.
          </p>
          <p className="text-background/30 text-xs">2026 Chapter Roster</p>
        </div>
      </div>
    </footer>
  )
}

import { useEffect, useRef, useState } from "react"
import {
  Heart, Handshake, TrendingUp, Users, Globe, MapPin, Building2,
  Award, Star, Lightbulb, LifeBuoy
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 1500
          const step = Math.ceil(target / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const CORE_VALUES = [
  { icon: Heart, label: "Givers Gain®", desc: "What you give, you get back. Build relationships by contributing first." },
  { icon: Users, label: "Building Relationships", desc: "People do business with people they know, like, and trust." },
  { icon: TrendingUp, label: "Lifelong Learning", desc: "The more you learn, the more you earn." },
  { icon: Handshake, label: "Traditions + Innovation", desc: "Respect what works. Embrace what's new." },
  { icon: Lightbulb, label: "Positive Attitude", desc: "Your attitude is contagious. Choose positivity." },
  { icon: Star, label: "Accountability", desc: "Own your results. Celebrate wins. Own your misses." },
  { icon: Award, label: "Recognition", desc: "Recognise others and be recognised. Appreciation drives performance." },
]

const WORLD_STATS = [
  { label: "Members Worldwide", value: 355582, suffix: "+" },
  { label: "Chapters", value: 11728, suffix: "+" },
  { label: "Countries", value: 76, suffix: "+" },
  { label: "Referrals (Millions)", value: 17, suffix: ".9M+" },
]

const INDIA_STATS = [
  { label: "Members in India", value: 72513, suffix: "+" },
  { label: "Chapters in India", value: 1498, suffix: "+" },
  { label: "Cities", value: 143, suffix: "+" },
  { label: "Business (Crores)", value: 55770, suffix: "+" },
]

const MUMBAI_STATS = [
  { label: "Members in Mumbai", value: 5976, suffix: "+" },
  { label: "Chapters in Mumbai", value: 117, suffix: "+" },
  { label: "Referrals", value: 312434, suffix: "+" },
  { label: "Business (Crores)", value: 3656, suffix: "+" },
]

const UNITED_STATS = [
  { label: "Referrals", value: 3224, suffix: "+" },
  { label: "1-2-1 Done", value: 2224, suffix: "+" },
  { label: "Visitors", value: 270, suffix: "+" },
  { label: "Active Members", value: 41, suffix: "" },
]

function StatGrid({ stats }: { stats: typeof WORLD_STATS }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="border border-border">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-extrabold text-primary mb-1">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StatsSection() {
  return (
    <section id="stats" className="bg-secondary/30 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <BarChart3 size={12} /> BNI by the Numbers
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Chapter Statistics & Values</h2>
        </div>

        <Tabs defaultValue="values">
          <TabsList className="mb-8 flex-wrap h-auto gap-1 bg-muted">
            <TabsTrigger value="values" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Core Values</TabsTrigger>
            <TabsTrigger value="world" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Worldwide</TabsTrigger>
            <TabsTrigger value="india" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">India</TabsTrigger>
            <TabsTrigger value="mumbai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Mumbai</TabsTrigger>
            <TabsTrigger value="chapter" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">BNI United</TabsTrigger>
          </TabsList>

          <TabsContent value="values">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {CORE_VALUES.map((v) => (
                <Card key={v.label} className="border border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <v.icon size={24} className="text-primary mb-3" />
                    <h3 className="font-bold text-sm text-foreground mb-1">{v.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="world">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Globe size={16} className="text-primary" />
              <span>BNI generated $26.09 Billion in the last 12 months with 17.9 Million referrals worldwide</span>
            </div>
            <StatGrid stats={WORLD_STATS} />
          </TabsContent>

          <TabsContent value="india">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              <span>BNI India generated 55,770 Crores in the last 12 months with 49,31,926 referrals</span>
            </div>
            <StatGrid stats={INDIA_STATS} />
          </TabsContent>

          <TabsContent value="mumbai">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 size={16} className="text-primary" />
              <span>BNI Mumbai generated 3656 Crores in the last 12 months with 3,12,434+ referrals</span>
            </div>
            <StatGrid stats={MUMBAI_STATS} />
          </TabsContent>

          <TabsContent value="chapter">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <LifeBuoy size={16} className="text-primary" />
              <span>BNI United has generated 21,35,04,308 Crores in business till date</span>
            </div>
            <StatGrid stats={UNITED_STATS} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function BarChart3({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

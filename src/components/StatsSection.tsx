import { useEffect, useRef, useState } from "react"
import {
  Heart, Handshake, TrendingUp, Users, Globe, MapPin, Building2,
  Award, Star, Lightbulb, LifeBuoy
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import {
  cloneDefaultChapterStatistics,
  normalizeChapterStatistics,
  type StatisticItem,
} from "@/lib/statistics"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    setCount(0)
    hasAnimated.current = false
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

function StatGrid({ stats }: { stats: StatisticItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, index) => (
        <Card key={`${s.label}-${index}`} className="border border-border">
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
  const [statistics, setStatistics] = useState(cloneDefaultChapterStatistics)

  useEffect(() => {
    let active = true

    async function loadStatistics() {
      const { data, error } = await supabase
        .from("chapter_statistics")
        .select("region, summary, stats, updated_at")

      if (!error && active) {
        setStatistics(normalizeChapterStatistics(data))
      }
    }

    void loadStatistics()
    return () => { active = false }
  }, [])

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
              <span>{statistics.worldwide.summary}</span>
            </div>
            <StatGrid stats={statistics.worldwide.stats} />
          </TabsContent>

          <TabsContent value="india">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              <span>{statistics.india.summary}</span>
            </div>
            <StatGrid stats={statistics.india.stats} />
          </TabsContent>

          <TabsContent value="mumbai">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 size={16} className="text-primary" />
              <span>{statistics.mumbai.summary}</span>
            </div>
            <StatGrid stats={statistics.mumbai.stats} />
          </TabsContent>

          <TabsContent value="chapter">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <LifeBuoy size={16} className="text-primary" />
              <span>{statistics.united.summary}</span>
            </div>
            <StatGrid stats={statistics.united.stats} />
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

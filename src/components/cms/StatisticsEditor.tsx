import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe,
  LifeBuoy,
  Loader2,
  MapPin,
  RotateCcw,
  Save,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getChapterStatistics, saveChapterStatistics } from "@/lib/cmsApi"
import {
  cloneDefaultChapterStatistics,
  STATISTIC_REGION_LABELS,
  STATISTIC_REGIONS,
  type ChapterStatisticsByRegion,
  type StatisticRegion,
} from "@/lib/statistics"

const REGION_ICONS = {
  worldwide: Globe,
  india: MapPin,
  mumbai: Building2,
  united: LifeBuoy,
} satisfies Record<StatisticRegion, typeof Globe>

export function StatisticsEditor() {
  const [statistics, setStatistics] = useState<ChapterStatisticsByRegion>(cloneDefaultChapterStatistics)
  const [savedSnapshot, setSavedSnapshot] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)

  const currentSnapshot = useMemo(() => JSON.stringify(statistics), [statistics])
  const isDirty = savedSnapshot !== "" && currentSnapshot !== savedSnapshot

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSavedMessage(false)
    try {
      const data = await getChapterStatistics()
      setStatistics(data)
      setSavedSnapshot(JSON.stringify(data))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function updateSummary(region: StatisticRegion, summary: string) {
    setSavedMessage(false)
    setStatistics((current) => ({
      ...current,
      [region]: { ...current[region], summary },
    }))
  }

  function updateStat(
    region: StatisticRegion,
    index: number,
    field: "label" | "value" | "suffix",
    value: string,
  ) {
    setSavedMessage(false)
    setStatistics((current) => ({
      ...current,
      [region]: {
        ...current[region],
        stats: current[region].stats.map((stat, statIndex) => (
          statIndex === index
            ? { ...stat, [field]: field === "value" ? Number(value) : value }
            : stat
        )),
      },
    }))
  }

  function validate(): string | null {
    for (const region of STATISTIC_REGIONS) {
      const group = statistics[region]
      if (!group.summary.trim()) return `${STATISTIC_REGION_LABELS[region]} summary is required.`
      for (const stat of group.stats) {
        if (!stat.label.trim()) return `Every ${STATISTIC_REGION_LABELS[region]} statistic needs a label.`
        if (!Number.isSafeInteger(stat.value) || stat.value < 0) {
          return `${stat.label || STATISTIC_REGION_LABELS[region]} must have a whole number of zero or more.`
        }
      }
    }
    return null
  }

  async function handleSave() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError(null)
    setSavedMessage(false)
    try {
      const saved = await saveChapterStatistics(statistics)
      setStatistics(saved)
      setSavedSnapshot(JSON.stringify(saved))
      setSavedMessage(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save statistics")
    } finally {
      setSaving(false)
    }
  }

  function resetChanges() {
    if (!savedSnapshot) return
    setStatistics(JSON.parse(savedSnapshot) as ChapterStatisticsByRegion)
    setError(null)
    setSavedMessage(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={18} className="animate-spin text-primary" />
        Loading statistics...
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Chapter Statistics</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Update the summaries and number cards shown under Chapter Statistics &amp; Values.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetChanges} disabled={!isDirty || saving}>
            <RotateCcw size={14} />
            Reset changes
          </Button>
          <Button onClick={() => void handleSave()} disabled={!isDirty || saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save all changes"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {error}
            {!savedSnapshot && (
              <Button variant="link" className="h-auto p-0 text-destructive" onClick={() => void load()}>
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {savedMessage && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 />
          <AlertDescription className="text-current">
            Statistics saved. The homepage will use these values on its next load.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {STATISTIC_REGIONS.map((region) => {
          const Icon = REGION_ICONS[region]
          const group = statistics[region]

          return (
            <Card key={region}>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon size={17} />
                  </span>
                  {STATISTIC_REGION_LABELS[region]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <div className="space-y-2">
                  <Label htmlFor={`${region}-summary`}>Summary shown above the cards</Label>
                  <Textarea
                    id={`${region}-summary`}
                    value={group.summary}
                    maxLength={500}
                    rows={3}
                    onChange={(event) => updateSummary(region, event.target.value)}
                  />
                  <p className="text-right text-[11px] text-muted-foreground">
                    {group.summary.length}/500 characters
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium">Statistic cards</h3>
                    <p className="text-xs text-muted-foreground">Edit the label, whole-number value, and optional suffix for each card.</p>
                  </div>

                  {group.stats.map((stat, index) => (
                    <div key={index} className="rounded-lg border border-border bg-muted/20 p-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Card {index + 1}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(120px,0.55fr)_minmax(85px,0.35fr)]">
                        <div className="space-y-1.5">
                          <Label htmlFor={`${region}-${index}-label`} className="text-xs">Label</Label>
                          <Input
                            id={`${region}-${index}-label`}
                            value={stat.label}
                            maxLength={80}
                            onChange={(event) => updateStat(region, index, "label", event.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`${region}-${index}-value`} className="text-xs">Value</Label>
                          <Input
                            id={`${region}-${index}-value`}
                            type="number"
                            min={0}
                            step={1}
                            value={stat.value}
                            onChange={(event) => updateStat(region, index, "value", event.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`${region}-${index}-suffix`} className="text-xs">Suffix</Label>
                          <Input
                            id={`${region}-${index}-suffix`}
                            value={stat.suffix}
                            maxLength={20}
                            placeholder="e.g. +"
                            onChange={(event) => updateStat(region, index, "suffix", event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button onClick={() => void handleSave()} disabled={!isDirty || saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save all changes"}
        </Button>
      </div>
    </div>
  )
}

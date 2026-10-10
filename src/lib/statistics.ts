export const STATISTIC_REGIONS = ["worldwide", "india", "mumbai", "united"] as const

export type StatisticRegion = (typeof STATISTIC_REGIONS)[number]

export interface StatisticItem {
  label: string
  value: number
  suffix: string
}

export interface ChapterStatistics {
  region: StatisticRegion
  summary: string
  stats: StatisticItem[]
  updated_at?: string
}

export type ChapterStatisticsByRegion = Record<StatisticRegion, ChapterStatistics>

export const STATISTIC_REGION_LABELS: Record<StatisticRegion, string> = {
  worldwide: "Worldwide",
  india: "India",
  mumbai: "Mumbai",
  united: "BNI United",
}

export const STATISTIC_CARD_COUNTS: Record<StatisticRegion, number> = {
  worldwide: 5,
  india: 6,
  mumbai: 5,
  united: 4,
}

export const DEFAULT_CHAPTER_STATISTICS: ChapterStatisticsByRegion = {
  worldwide: {
    region: "worldwide",
    summary: "BNI global statistics for September 2025 through August 2026",
    stats: [
      { label: "Members", value: 359812, suffix: "" },
      { label: "Chapters", value: 11894, suffix: "" },
      { label: "Countries", value: 76, suffix: "" },
      { label: "Referrals (Sep 25 – Aug 26)", value: 17, suffix: ".25 Million" },
      { label: "Business Generated (Sep 25 – Aug 26)", value: 26, suffix: ".9 Billion USD" },
    ],
  },
  india: {
    region: "india",
    summary: "BNI India performance in the last 12 months",
    stats: [
      { label: "Members", value: 76543, suffix: "" },
      { label: "Chapters", value: 1577, suffix: "" },
      { label: "Cities", value: 149, suffix: "" },
      { label: "Referrals Passed", value: 4990438, suffix: "" },
      { label: "Business Done in the Last 12 Months", value: 60503, suffix: " Crores" },
      { label: "Average Value of the Seat Per Annum", value: 83, suffix: ".62 Lakh" },
    ],
  },
  mumbai: {
    region: "mumbai",
    summary: "BNI Mumbai performance in the last 12 months",
    stats: [
      { label: "Members", value: 5973, suffix: "" },
      { label: "Chapters", value: 117, suffix: "" },
      { label: "Referrals Passed", value: 307050, suffix: "" },
      { label: "Business Done in the Last 12 Months", value: 3775, suffix: " Crores" },
      { label: "Average Value of the Seat Per Annum", value: 63, suffix: ".34 Lakh" },
    ],
  },
  united: {
    region: "united",
    summary: "BNI United has generated 21,35,04,308 Crores in business till date",
    stats: [
      { label: "Referrals", value: 3224, suffix: "+" },
      { label: "1-2-1 Done", value: 2224, suffix: "+" },
      { label: "Visitors", value: 270, suffix: "+" },
      { label: "Active Members", value: 41, suffix: "" },
    ],
  },
}

export function cloneDefaultChapterStatistics(): ChapterStatisticsByRegion {
  return Object.fromEntries(
    STATISTIC_REGIONS.map((region) => [
      region,
      {
        ...DEFAULT_CHAPTER_STATISTICS[region],
        stats: DEFAULT_CHAPTER_STATISTICS[region].stats.map((stat) => ({ ...stat })),
      },
    ]),
  ) as ChapterStatisticsByRegion
}

export function normalizeChapterStatistics(rows: unknown): ChapterStatisticsByRegion {
  const normalized = cloneDefaultChapterStatistics()
  if (!Array.isArray(rows)) return normalized

  for (const row of rows) {
    if (!row || typeof row !== "object") continue
    const candidate = row as Partial<ChapterStatistics>
    if (!candidate.region || !STATISTIC_REGIONS.includes(candidate.region)) continue
    if (typeof candidate.summary !== "string" || !Array.isArray(candidate.stats)) continue

    const stats = candidate.stats.filter((stat): stat is StatisticItem => (
      !!stat
      && typeof stat === "object"
      && typeof stat.label === "string"
      && typeof stat.value === "number"
      && Number.isFinite(stat.value)
      && typeof stat.suffix === "string"
    ))

    if (stats.length !== STATISTIC_CARD_COUNTS[candidate.region]) continue
    normalized[candidate.region] = {
      region: candidate.region,
      summary: candidate.summary,
      stats: stats.map((stat) => ({ ...stat })),
      updated_at: typeof candidate.updated_at === "string" ? candidate.updated_at : undefined,
    }
  }

  return normalized
}

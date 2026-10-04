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

export const DEFAULT_CHAPTER_STATISTICS: ChapterStatisticsByRegion = {
  worldwide: {
    region: "worldwide",
    summary: "BNI generated $26.09 Billion in the last 12 months with 17.9 Million referrals worldwide",
    stats: [
      { label: "Members Worldwide", value: 355582, suffix: "+" },
      { label: "Chapters", value: 11728, suffix: "+" },
      { label: "Countries", value: 76, suffix: "+" },
      { label: "Referrals (Millions)", value: 17, suffix: ".9M+" },
    ],
  },
  india: {
    region: "india",
    summary: "BNI India generated 55,770 Crores in the last 12 months with 49,31,926 referrals",
    stats: [
      { label: "Members in India", value: 72513, suffix: "+" },
      { label: "Chapters in India", value: 1498, suffix: "+" },
      { label: "Cities", value: 143, suffix: "+" },
      { label: "Business (Crores)", value: 55770, suffix: "+" },
    ],
  },
  mumbai: {
    region: "mumbai",
    summary: "BNI Mumbai generated 3656 Crores in the last 12 months with 3,12,434+ referrals",
    stats: [
      { label: "Members in Mumbai", value: 5976, suffix: "+" },
      { label: "Chapters in Mumbai", value: 117, suffix: "+" },
      { label: "Referrals", value: 312434, suffix: "+" },
      { label: "Business (Crores)", value: 3656, suffix: "+" },
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

    if (stats.length !== 4) continue
    normalized[candidate.region] = {
      region: candidate.region,
      summary: candidate.summary,
      stats: stats.map((stat) => ({ ...stat })),
      updated_at: typeof candidate.updated_at === "string" ? candidate.updated_at : undefined,
    }
  }

  return normalized
}

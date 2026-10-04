import { createClient } from "@supabase/supabase-js"
import { MOCK_MEMBERS } from "./mockData"
import { applyTermRoleData } from "./termRoleData"
import { STATISTIC_REGIONS, cloneDefaultChapterStatistics } from "./statistics"

export const supabaseUrl = "https://qttuvwyggpgqhfydbxvg.supabase.co"
export const supabaseAnonKey = "sb_publishable_h0GWl3cpJxnaDkUlIi6k-w_AKyxdxP3"


function createMockSupabaseClient() {
  console.warn("Supabase credentials missing. Falling back to local mock client with seed data.")
  const mockRoster = applyTermRoleData(MOCK_MEMBERS)

  const mockFrom = (table: string) => {
    let data: any[] = []
    if (table === "members") {
      data = mockRoster.members
    } else if (table === "committees") {
      data = mockRoster.committees
    } else if (table === "committee_members") {
      data = mockRoster.committeeMembers
    } else if (table === "chapter_statistics") {
      const statistics = cloneDefaultChapterStatistics()
      data = STATISTIC_REGIONS.map((region) => statistics[region])
    }

    const builder = {
      select: () => builder,
      order: () => builder,
      then: (resolve: any) => {
        resolve({ data, error: null })
      }
    }
    return builder
  }

  return {
    from: mockFrom
  } as any
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient()

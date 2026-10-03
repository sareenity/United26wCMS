export const POWER_TEAM_NAMES = [
  "Corporate",
  "Marketing & Branding",
  "MSME",
  "Real-Estate",
  "Lifestyle",
  "Wellness",
] as const

export type PowerTeamName = (typeof POWER_TEAM_NAMES)[number]

export interface Member {
  id: string
  first_name: string
  last_name: string
  business_category: string
  company_name: string | null
  phone: string | null
  email: string | null
  photo_url: string | null
  chapter_role: "support" | "leadership" | "member"
  power_team: PowerTeamName | "Lifestyle & Wellness" | "Property" | null
  is_power_team_captain: boolean
  is_power_team_vice_captain: boolean
  tagline: string | null
  website: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Committee {
  id: string
  name: string
  committee_group: "membership" | "visitor_host" | "coordinator"
  coordinator_subgroup: string | null
  sort_order: number
  created_at: string
}

export interface CommitteeMember {
  id: string
  committee_id: string
  member_id: string
  role: string
  created_at: string
  member?: Member
  committee?: Committee
}

export interface CommitteeAssignmentInput {
  committee_id: string
  role: string
}

export interface CommitteeData {
  committees: Committee[]
  committeeMembers: CommitteeMember[]
}

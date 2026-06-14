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
  power_team: "Corporate" | "Lifestyle & Wellness" | "MSME" | "Property" | null
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

export type PowerTeamName = "Corporate" | "Lifestyle & Wellness" | "MSME" | "Property"

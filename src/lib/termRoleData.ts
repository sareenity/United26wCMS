import type { Committee, CommitteeMember, Member, PowerTeamName } from "@/lib/types"

const CREATED_AT = "2026-10-03T00:00:00.000Z"

type SourceLead = string | { name: string; role: string }

interface RoleRow {
  name: string
  owner: string
  leads: SourceLead[]
}

interface PowerTeamRow {
  name: PowerTeamName
  members: string[]
}

const MEMBER_NAME_MAP: Record<string, string> = {
  Rohit: "Rohit DK Sareen",
  "Rohit S": "Rohit DK Sareen",
  "Rohit J": "Rohit Jhunjhunwala",
  Bhavana: "Bhavana Patel",
  Sahil: "Sahil Amesur",
  Pooja: "Pooja Shah",
  Sanikka: "Sanikka Vankadia",
  Priyanka: "Priyanka Gidwani",
  Hardik: "Hardik Bhanushali",
  Anuja: "Anuja Shah",
  Purva: "Purva Velapure-Gokhale",
  Atharva: "Atharva Patankar",
  Shweta: "Shweta Chheda",
  Jinal: "Jinal Vora",
  Poonam: "Poonam Sandu",
  Tamanna: "Tamanna Mulchandani",
  Shagun: "Shagun Talwar",
  Khushbu: "Khushbu Agarwal",
  Neisha: "Neisha Arya Saxena",
  Chandrashekhar: "Chandrashekhar Amolkar",
  Shekhar: "Chandrashekhar Amolkar",
  Zubin: "Zubin Kutar",
  Hrishit: "Hrishit Parikh",
  Nikhil: "Nikhil Gala",
  Jayessh: "Jayessh Trivedi",
  Saumil: "Saumil Seetha",
  Nalini: "Nalini Mishra",
  Adnan: "Adnan Vahanvaty",
  Sachin: "Sachin Pawar",
  Purvi: "Purvi Jain",
  Kushal: "Kushal Prahladka",
  Khushal: "Kushal Prahladka",
  Divya: "Divya Singh",
  Rushi: "Rushi Thar",
  Mayur: "Mayur Bhanage",
  Ankit: "Ankit Surolia",
  Gaurav: "Gauravkumar Nawalgaria",
  Pratik: "Pratik Mishra",
  Janish: "Janish Jain",
  "Dr Aniket": "Aniket Bhide",
  Abhishek: "Abhishek",
  Vidit: "Vidit",
}

const MAIN_COMMITTEES = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    name: "Membership Committee",
    committee_group: "membership" as const,
    coordinator_subgroup: null,
    sort_order: 1,
    created_at: CREATED_AT,
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    name: "Visitor Host Team",
    committee_group: "visitor_host" as const,
    coordinator_subgroup: null,
    sort_order: 2,
    created_at: CREATED_AT,
  },
]

const ROLE_ROWS: RoleRow[] = [
  { name: "121 Coordinators", owner: "Rohit", leads: ["Jinal", "Poonam"] },
  { name: "30 Sec +Energiser", owner: "Rohit", leads: ["Tamanna", "Shagun"] },
  { name: "BNI Connect", owner: "Rohit", leads: ["Khushbu", "Hardik"] },
  { name: "Education Coordinator", owner: "Rohit", leads: ["Priyanka", "Neisha", "Rohit J"] },
  { name: "FP Coordinators", owner: "Rohit", leads: ["Sanikka", "Shagun", "Purva"] },
  { name: "Go Green Coordinator", owner: "Rohit", leads: ["Chandrashekhar", "Zubin"] },
  { name: "Business Council coordinator", owner: "Rohit", leads: ["Priyanka", "Hrishit"] },
  { name: "Mentor Coordinator", owner: "Bhavana", leads: ["Sanikka", "Nikhil"] },
  { name: "Power Date Coordinator", owner: "Rohit", leads: ["Chandrashekhar", "Jayessh", "Pooja"] },
  { name: "Power Team Coordinator", owner: "Rohit", leads: ["Rohit J", "Saumil", "Nalini"] },
  { name: "Referral, TYFCB and Gives & Ask Coordinator", owner: "Rohit", leads: ["Jinal", "Khushbu"] },
  { name: "Social Media", owner: "Rohit", leads: ["Adnan", "Sachin", "Purvi"] },
  { name: "Sports", owner: "Rohit", leads: ["Atharva", "Kushal", "Purvi"] },
  { name: "Socials / Events", owner: "Rohit", leads: ["Divya", "Shekhar", "Kushal", "Adnan", "Tamanna"] },
  { name: "Special Creatives", owner: "Rohit", leads: ["Rushi", "Adnan", "Sachin"] },
  { name: "Notable Networker", owner: "Rohit", leads: ["Kushal", "Mayur", "Ankit"] },
  {
    name: "Tech Team / Show Runner",
    owner: "Rohit",
    leads: [
      "Divya",
      "Zubin",
      "Anuja",
      { name: "Gaurav", role: "Mic Runner" },
      { name: "Pratik", role: "Mic Runner" },
      { name: "Shagun", role: "Time Keeper" },
      { name: "Neisha", role: "Time Keeper" },
    ],
  },
  { name: "Testimonial Coordinator", owner: "Rohit", leads: ["Ankit", "Mayur"] },
  { name: "BNI Events & Training", owner: "Rohit", leads: ["Neisha", "Rohit J", "Priyanka"] },
  { name: "Lead VHT", owner: "Sahil", leads: ["Jayessh", "Shweta", "Sanikka"] },
  { name: "Venue Co-ordinator", owner: "Sahil", leads: ["Shweta"] },
  { name: "Visitor Orientation", owner: "Bhavana", leads: ["Pooja", "Anuja", "Nikhil", "Priyanka", "Shekhar", "Hardik"] },
  { name: "Door Prize (Sync with FP?)", owner: "Sahil", leads: ["Sanikka", "Purva"] },
  { name: "Birthday", owner: "Rohit", leads: ["Poonam", "Tamanna"] },
  { name: "Growth Coordinator", owner: "Bhavana", leads: ["Hardik", "Khushbu"] },
  { name: "Retention Coordintor", owner: "Bhavana", leads: ["Pooja", "Rushi"] },
  { name: "Culture Coordinator", owner: "Rohit", leads: ["Adnan", "Rushi"] },
  { name: "Women's Growth Coordinator", owner: "Rohit", leads: ["Poonam", "Shagun"] },
]

const MEMBERSHIP_MEMBERS = ["Pooja", "Sanikka", "Priyanka", "Hardik", "Anuja", "Purva", "Atharva", "Shweta"]
const VISITOR_HOST_MEMBERS = ["Zubin", "Purvi", "Janish", "Divya", "Nalini"]

const POWER_TEAM_ROWS: PowerTeamRow[] = [
  { name: "Corporate", members: ["Priyanka", "Hardik", "Purva", "Janish", "Divya", "Ankit"] },
  { name: "Marketing & Branding", members: ["Adnan", "Zubin", "Sahil", "Sachin", "Rushi", "Abhishek"] },
  { name: "MSME", members: ["Sanikka", "Rohit J", "Rohit S", "Shweta", "Nikhil", "Anuja"] },
  { name: "Real-Estate", members: ["Nalini", "Pratik", "Jayessh", "Khushbu", "Atharva", "Khushal", "Poonam", "Vidit"] },
  { name: "Lifestyle", members: ["Purvi", "Pooja", "Tamanna", "Hrishit", "Mayur", "Shagun", "Gaurav"] },
  { name: "Wellness", members: ["Shekhar", "Dr Aniket", "Saumil", "Jinal", "Bhavana", "Neisha"] },
]

export const TERM_COMMITTEES: Committee[] = [
  ...MAIN_COMMITTEES,
  ...ROLE_ROWS.map((row, index) => ({
    id: `c0000000-0000-4000-8000-${String(index + 3).padStart(12, "0")}`,
    name: row.name,
    committee_group: "coordinator" as const,
    coordinator_subgroup: row.name,
    sort_order: index + 10,
    created_at: CREATED_AT,
  })),
]

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase()
}

function fullNameFor(sourceName: string) {
  return MEMBER_NAME_MAP[sourceName] ?? sourceName
}

function sourceAssignmentRows() {
  const rows: Array<{ committeeName: string; sourceName: string; role: string }> = [
    ...MEMBERSHIP_MEMBERS.map((sourceName) => ({ committeeName: "Membership Committee", sourceName, role: "member" })),
    ...VISITOR_HOST_MEMBERS.map((sourceName) => ({ committeeName: "Visitor Host Team", sourceName, role: "Visitor Host" })),
  ]

  for (const row of ROLE_ROWS) {
    if (row.owner !== "Rohit") {
      rows.push({ committeeName: row.name, sourceName: row.owner, role: "Owner" })
    }
    for (const lead of row.leads) {
      rows.push({
        committeeName: row.name,
        sourceName: typeof lead === "string" ? lead : lead.name,
        role: typeof lead === "string" ? "Coordinator" : lead.role,
      })
    }
  }
  return rows
}

export interface TermRoleData {
  members: Member[]
  committees: Committee[]
  committeeMembers: CommitteeMember[]
  unmatchedNames: string[]
  inactiveAssignedNames: string[]
}

export function applyTermRoleData(sourceMembers: Member[]): TermRoleData {
  const membersByName = new Map(
    sourceMembers.map((member) => [normalizeName(`${member.first_name} ${member.last_name}`), member])
  )
  const unmatched = new Set<string>()
  const powerTeamsByMember = new Map<string, { powerTeam: PowerTeamName; captain: boolean; viceCaptain: boolean }>()

  for (const team of POWER_TEAM_ROWS) {
    team.members.forEach((sourceName, index) => {
      const fullName = fullNameFor(sourceName)
      if (!membersByName.has(normalizeName(fullName))) unmatched.add(fullName)
      powerTeamsByMember.set(normalizeName(fullName), {
        powerTeam: team.name,
        captain: index === 0,
        viceCaptain: index === 1,
      })
    })
  }

  const members = sourceMembers.map((member) => {
    if (member.chapter_role === "support") return member
    const assignment = powerTeamsByMember.get(normalizeName(`${member.first_name} ${member.last_name}`))
    return {
      ...member,
      power_team: assignment?.powerTeam ?? null,
      is_power_team_captain: assignment?.captain ?? false,
      is_power_team_vice_captain: assignment?.viceCaptain ?? false,
    }
  })

  const committeesByName = new Map(TERM_COMMITTEES.map((committee) => [committee.name, committee]))
  const committeeMembers: CommitteeMember[] = []
  const assignedMemberIds = new Set<string>()

  for (const row of sourceAssignmentRows()) {
    const fullName = fullNameFor(row.sourceName)
    const member = membersByName.get(normalizeName(fullName))
    const committee = committeesByName.get(row.committeeName)
    if (!member) {
      unmatched.add(fullName)
      continue
    }
    if (!committee) continue
    assignedMemberIds.add(member.id)
    committeeMembers.push({
      id: `term-${committee.id}-${member.id}`,
      committee_id: committee.id,
      member_id: member.id,
      role: row.role,
      created_at: CREATED_AT,
    })
  }

  const inactiveAssignedNames = members
    .filter((member) => !member.is_active && (assignedMemberIds.has(member.id) || powerTeamsByMember.has(normalizeName(`${member.first_name} ${member.last_name}`))))
    .map((member) => `${member.first_name} ${member.last_name}`)

  return {
    members,
    committees: TERM_COMMITTEES,
    committeeMembers,
    unmatchedNames: [...unmatched].sort(),
    inactiveAssignedNames: inactiveAssignedNames.sort(),
  }
}

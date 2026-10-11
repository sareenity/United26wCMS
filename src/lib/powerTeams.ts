import type { PowerTeamName } from "@/lib/types"

export const POWER_TEAM_DEFINITIONS: ReadonlyArray<{
  name: PowerTeamName
  description: string
}> = [
  { name: "Corporate", description: "Corporate services and professional solutions" },
  { name: "Marketing & Branding", description: "Marketing, branding, media, and creative services" },
  { name: "MSME", description: "Manufacturing, exports, logistics, and small business" },
  { name: "Real-Estate", description: "Real estate, architecture, interiors, and construction" },
  {
    name: "Lifestyle, Health & Wellness",
    description: "Lifestyle, health, medical, wellness, retail, hospitality, and personal services",
  },
]

export type PowerTeamRosterRole = "member" | "captain" | "vice-captain"

export const OCT26_MAR27_POWER_TEAM_ROSTER: ReadonlyArray<{
  memberName: string
  powerTeam: PowerTeamName
  role: PowerTeamRosterRole
}> = [
  { memberName: "Hardik Bhanushali", powerTeam: "Corporate", role: "captain" },
  { memberName: "Purva Velapure-Gokhale", powerTeam: "Corporate", role: "vice-captain" },
  { memberName: "Ankit Surolia", powerTeam: "Corporate", role: "member" },
  { memberName: "Janish Jain", powerTeam: "Corporate", role: "member" },
  { memberName: "Divya Singh", powerTeam: "Corporate", role: "member" },
  { memberName: "Tamanna Mulchandani", powerTeam: "Corporate", role: "member" },

  { memberName: "Adnan Vahanvaty", powerTeam: "Marketing & Branding", role: "captain" },
  { memberName: "Zubin Kutar", powerTeam: "Marketing & Branding", role: "vice-captain" },
  { memberName: "Sahil Amesur", powerTeam: "Marketing & Branding", role: "member" },
  { memberName: "Sachin Pawar", powerTeam: "Marketing & Branding", role: "member" },
  { memberName: "Rushi Thar", powerTeam: "Marketing & Branding", role: "member" },
  { memberName: "Abhishek Jaiswal", powerTeam: "Marketing & Branding", role: "member" },
  { memberName: "Rohit DK Sareen", powerTeam: "Marketing & Branding", role: "member" },

  { memberName: "Sanikka Vankadia", powerTeam: "MSME", role: "captain" },
  { memberName: "Rohit Jhunjhunwala", powerTeam: "MSME", role: "vice-captain" },
  { memberName: "Priyanka Gidwani", powerTeam: "MSME", role: "member" },
  { memberName: "Anuja Shah", powerTeam: "MSME", role: "member" },
  { memberName: "Shweta Chheda", powerTeam: "MSME", role: "member" },
  { memberName: "Nikhil Gala", powerTeam: "MSME", role: "member" },

  { memberName: "Nalini Mishra", powerTeam: "Real-Estate", role: "captain" },
  { memberName: "Pratik Mishra", powerTeam: "Real-Estate", role: "vice-captain" },
  { memberName: "Jayessh Trivedi", powerTeam: "Real-Estate", role: "member" },
  { memberName: "Khushbu Agarwal", powerTeam: "Real-Estate", role: "member" },
  { memberName: "Atharva Patankar", powerTeam: "Real-Estate", role: "member" },
  { memberName: "Kushal Prahladka", powerTeam: "Real-Estate", role: "member" },
  { memberName: "Poonam Sandu", powerTeam: "Real-Estate", role: "member" },
  { memberName: "Gauravkumar Nawalgaria", powerTeam: "Real-Estate", role: "member" },
  { memberName: "Chandrashekhar Amolkar", powerTeam: "Real-Estate", role: "member" },

  { memberName: "Purvi Jain", powerTeam: "Lifestyle, Health & Wellness", role: "captain" },
  { memberName: "Jinal Vora", powerTeam: "Lifestyle, Health & Wellness", role: "vice-captain" },
  { memberName: "Pooja Shah", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
  { memberName: "Hrishit Parikh", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
  { memberName: "Mayur Bhanage", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
  { memberName: "Shagun Talwar", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
  { memberName: "Saumil Seetha", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
  { memberName: "Aniket Bhide", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
  { memberName: "Bhavana Patel", powerTeam: "Lifestyle, Health & Wellness", role: "member" },
]

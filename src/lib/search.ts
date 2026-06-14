import type { Member } from "./types"

// A comprehensive dictionary mapping unique BNI categories to related terms, synonyms, and overlapping concepts.
export const CATEGORY_SYNONYMS: Record<string, string[]> = {
  "BNI Support": ["support", "bni", "director", "consultant", "ambassador", "admin"],
  "CHRO Services": ["hr", "human resources", "hiring", "recruitment", "chro", "people", "talent", "staffing", "employment", "jobs"],
  "Life Insurance": ["insurance", "life", "lic", "finance", "protection"],
  "IT Hardware - Sales & Service": ["it", "hardware", "computer", "tech", "laptop", "desktop", "networking", "server", "repair", "technology"],
  "Mutual Fund Advisor": ["finance", "wealth", "investment", "mutual funds", "mf", "sip", "advisory"],
  "Content Writer": ["copywriter", "writing", "content", "marketing", "creative", "writer", "blog", "articles", "social media"],
  "Graphic Designer": ["design", "graphic", "ui", "ux", "logo", "branding", "creative", "designer", "artwork", "photoshop"],
  "Image Consultant": ["styling", "grooming", "fashion", "personality", "etiquette", "wardrobe"],
  "Corporate Gifting - Homeware": ["gifting", "gifts", "corporate gifts", "swag", "homeware", "crockery"],
  "Interior Designer - Commercial": ["architecture", "interior", "design", "office design", "commercial", "decor", "architect"],
  "Printing": ["print", "packaging", "brochure", "visiting cards", "banner", "branding"],
  "Video Content Creator - Corporate": ["video", "film", "shoot", "production", "content", "videography", "editor", "youtube", "corporate video"],
  "AI Trainer": ["ai", "artificial intelligence", "tech", "training", "education", "prompt engineering", "chatgpt"],
  "Baker": ["food", "cakes", "baking", "dessert", "pastry", "bread"],
  "Diamond Jewellery": ["jewelry", "diamonds", "gold", "jeweller", "ornaments"],
  "Nutritionist": ["diet", "health", "wellness", "weight loss", "nutrition", "dietitian"],
  "Wedding and Event - Photo & Video": ["photography", "photo", "videography", "events", "wedding", "photographer", "camera"],
  "Essential Oils": ["wellness", "aroma", "health", "healing", "oils", "diffuser", "natural"],
  "Tours & Travel": ["travel", "tourism", "holidays", "flights", "hotels", "packages", "booking"],
  "Saumil Wellness - Rudraksha Expert": ["wellness", "rudraksha", "astrology", "healing", "spiritual", "gemstones"],
  "Icecreams and Popsicles": ["dessert", "food", "ice cream", "gelato", "popsicles"],
  "Event Decoration": ["events", "decor", "flowers", "wedding", "decoration", "stage"],
  "CA - Direct Taxes": ["ca", "tax", "income tax", "auditor", "audit", "chartered accountant", "taxes", "filing"],
  "Process Consultant - Artificial Intelligence": ["ai", "artificial intelligence", "automation", "consulting", "process", "tech", "chatgpt"],
  "GST Consultant": ["gst", "tax", "ca", "chartered accountant", "indirect tax", "filing"],
  "Debt Investments": ["finance", "wealth", "bonds", "investments", "fixed income"],
  "Emotional Freedom Coach": ["coaching", "therapy", "mental health", "wellness", "eft", "healing", "mindset"],
  "General Insurance": ["insurance", "general insurance", "car insurance", "health insurance", "motor", "mediclaim"],
  "Digital Marketing": ["marketing", "seo", "social media", "ads", "online marketing", "sem", "advertising"],
  "Commercial Photography": ["photography", "photo", "shoot", "commercial", "photographer", "product shoot"],
  "Portfolio Management Services": ["finance", "pms", "investment", "wealth", "stocks", "equity", "shares"],
  "Vaastu Consultant": ["vaastu", "feng shui", "astrology", "numerology", "remedies"],
  "Pipes and Valves Manufacturer": ["pipes", "valves", "manufacturing", "industrial", "hardware", "valves manufacturer"],
  "Environmental Waste Management Solutions": ["waste management", "recycling", "environment", "green", "sustainability", "organic"],
  "Property and RERA Law": ["law", "rera", "lawyer", "legal", "property law", "advocate", "litigation"],
  "LED Lights": ["lighting", "led", "electrical", "lights", "fixtures"],
  "Turnkey Contractor": ["contractor", "construction", "civil", "builder", "interior", "renovation"],
  "Interior Design - Residential": ["interior", "design", "home design", "decor", "architecture", "architect", "residential"]
}

/**
 * Checks if a member matches the search query.
 * The matching is multi-token (intersection search). Every token in the query must match
 * at least one attribute of the member (names, company, category, tagline, or synonyms).
 */
export function matchMember(member: Member, query: string): boolean {
  const cleanQuery = query.toLowerCase().trim()
  if (!cleanQuery) return false

  const tokens = cleanQuery.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return false

  const firstName = member.first_name.toLowerCase()
  const lastName = member.last_name.toLowerCase()
  const company = (member.company_name || "").toLowerCase()
  const category = member.business_category.toLowerCase()
  const tagline = (member.tagline || "").toLowerCase()
  
  const synonyms = (CATEGORY_SYNONYMS[member.business_category] || []).map(s => s.toLowerCase())

  return tokens.every(token => {
    return (
      firstName.includes(token) ||
      lastName.includes(token) ||
      company.includes(token) ||
      category.includes(token) ||
      tagline.includes(token) ||
      synonyms.some(syn => syn.includes(token) || token.includes(syn))
    )
  })
}

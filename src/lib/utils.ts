import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortMembersBySurname<T extends { first_name: string; last_name: string }>(members: T[]): T[] {
  return [...members].sort((a, b) => {
    const lastA = (a.last_name || "").trim().toLowerCase()
    const lastB = (b.last_name || "").trim().toLowerCase()
    
    // Sort by last name first
    const lastCompare = lastA.localeCompare(lastB, undefined, { sensitivity: "base" })
    if (lastCompare !== 0) return lastCompare
    
    // If last names are equal, sort by first name
    const firstA = (a.first_name || "").trim().toLowerCase()
    const firstB = (b.first_name || "").trim().toLowerCase()
    return firstA.localeCompare(firstB, undefined, { sensitivity: "base" })
  })
}

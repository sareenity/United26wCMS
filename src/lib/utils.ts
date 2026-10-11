import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compareMembersByFirstName<T extends { first_name: string; last_name: string }>(a: T, b: T): number {
  const firstA = (a.first_name || "").trim().toLowerCase()
  const firstB = (b.first_name || "").trim().toLowerCase()
  const firstCompare = firstA.localeCompare(firstB, undefined, { sensitivity: "base" })
  if (firstCompare !== 0) return firstCompare

  const lastA = (a.last_name || "").trim().toLowerCase()
  const lastB = (b.last_name || "").trim().toLowerCase()
  return lastA.localeCompare(lastB, undefined, { sensitivity: "base" })
}

export function sortMembersByFirstName<T extends { first_name: string; last_name: string }>(members: T[]): T[] {
  return [...members].sort(compareMembersByFirstName)
}

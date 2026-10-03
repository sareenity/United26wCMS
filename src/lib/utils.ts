import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compareMembersBySurname<T extends { first_name: string; last_name: string }>(a: T, b: T): number {
  const lastA = (a.last_name || "").trim().toLowerCase()
  const lastB = (b.last_name || "").trim().toLowerCase()
  const lastCompare = lastA.localeCompare(lastB, undefined, { sensitivity: "base" })
  if (lastCompare !== 0) return lastCompare

  const firstA = (a.first_name || "").trim().toLowerCase()
  const firstB = (b.first_name || "").trim().toLowerCase()
  return firstA.localeCompare(firstB, undefined, { sensitivity: "base" })
}

export function sortMembersBySurname<T extends { first_name: string; last_name: string }>(members: T[]): T[] {
  return [...members].sort(compareMembersBySurname)
}

import { supabaseAnonKey, supabaseUrl } from "./supabase"
import type { CommitteeData, Member } from "./types"

interface PublicDirectoryData extends CommitteeData {
  members: Member[]
}

export async function getPublicDirectory(): Promise<PublicDirectoryData> {
  const response = await fetch(`${supabaseUrl}/functions/v1/cms-api`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ action: "get-public-directory" }),
  })
  const data = await response.json()
  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Request failed (${response.status})`)
  }
  return data as PublicDirectoryData
}

import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, Upload, AlertCircle } from "lucide-react"
import { PhotoCropper } from "./PhotoCropper"
import { addMember, updateMember, uploadPhoto } from "@/lib/cmsApi"
import type { Member } from "@/lib/types"

const schema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  business_category: z.string().min(1, "Required"),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  tagline: z.string().optional(),
  chapter_role: z.enum(["member", "leadership", "support"]),
  power_team: z.string().optional(),
  is_power_team_captain: z.boolean(),
  is_power_team_vice_captain: z.boolean(),
  sort_order: z.coerce.number().int().min(0).default(100),
})

type FormValues = z.infer<typeof schema>

interface MemberFormProps {
  open: boolean
  member: Member | null
  onClose: () => void
  onSaved: (member: Member) => void
}

function nullify(v: string | undefined): string | null {
  return v?.trim() || null
}

export function MemberForm({ open, member, onClose, onSaved }: MemberFormProps) {
  const isEdit = !!member
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      business_category: "",
      company_name: "",
      phone: "",
      email: "",
      website: "",
      tagline: "",
      chapter_role: "member",
      power_team: "",
      is_power_team_captain: false,
      is_power_team_vice_captain: false,
      sort_order: 100,
    },
  })

  useEffect(() => {
    if (open) {
      if (member) {
        reset({
          first_name: member.first_name,
          last_name: member.last_name,
          business_category: member.business_category,
          company_name: member.company_name ?? "",
          phone: member.phone ?? "",
          email: member.email ?? "",
          website: member.website ?? "",
          tagline: member.tagline ?? "",
          chapter_role: member.chapter_role,
          power_team: member.power_team ?? "",
          is_power_team_captain: member.is_power_team_captain,
          is_power_team_vice_captain: member.is_power_team_vice_captain,
          sort_order: member.sort_order,
        })
        setPhotoPreview(member.photo_url)
      } else {
        reset({
          first_name: "", last_name: "", business_category: "",
          company_name: "", phone: "", email: "", website: "", tagline: "",
          chapter_role: "member", power_team: "",
          is_power_team_captain: false, is_power_team_vice_captain: false,
          sort_order: 100,
        })
        setPhotoPreview(null)
      }
      setPendingBlob(null)
      setCropSrc(null)
      setError(null)
    }
  }, [open, member, reset])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCropSrc(url)
    setCropOpen(true)
    e.target.value = ""
  }

  function handleCropConfirm(blob: Blob) {
    setPendingBlob(blob)
    const previewUrl = URL.createObjectURL(blob)
    setPhotoPreview(previewUrl)
    setCropOpen(false)
    setCropSrc(null)
  }

  const firstNameVal = watch("first_name")
  const lastNameVal = watch("last_name")
  const initials = `${firstNameVal?.[0] ?? ""}${lastNameVal?.[0] ?? ""}`.toUpperCase()

  async function onSubmit(values: FormValues) {
    setSaving(true)
    setError(null)
    try {
      let photoUrl = member?.photo_url ?? null

      const memberData: Partial<Member> = {
        first_name: values.first_name,
        last_name: values.last_name,
        business_category: values.business_category,
        company_name: nullify(values.company_name),
        phone: nullify(values.phone),
        email: nullify(values.email),
        website: nullify(values.website),
        tagline: nullify(values.tagline),
        chapter_role: values.chapter_role,
        power_team: (values.power_team || null) as Member["power_team"],
        is_power_team_captain: values.is_power_team_captain,
        is_power_team_vice_captain: values.is_power_team_vice_captain,
        sort_order: values.sort_order,
        photo_url: photoUrl,
      }

      let saved: Member
      if (isEdit && member) {
        // Upload photo first if changed (use member id as filename)
        if (pendingBlob) {
          photoUrl = await uploadPhoto(member.id, pendingBlob)
          memberData.photo_url = photoUrl
        }
        saved = await updateMember(member.id, memberData)
      } else {
        // Insert member first (without photo), then upload with the new id
        saved = await addMember(memberData)
        if (pendingBlob) {
          const url = await uploadPhoto(saved.id, pendingBlob)
          saved = await updateMember(saved.id, { photo_url: url })
        }
      }

      onSaved(saved)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save member")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
        <SheetContent side="right" className="w-full sm:max-w-[560px] overflow-y-auto flex flex-col gap-0 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <SheetTitle>{isEdit ? "Edit Member" : "Add New Member"}</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? `Editing ${member?.first_name} ${member?.last_name}`
                : "Fill in the details to add a new chapter member"}
            </p>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle size={14} />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}

              {/* Photo */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Photograph</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 rounded-lg border border-border">
                    <AvatarImage src={photoPreview ?? undefined} className="object-cover" />
                    <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary rounded-lg">
                      {initials || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5"
                    >
                      <Upload size={13} />
                      {photoPreview ? "Change photo" : "Upload photo"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG or PNG. Will be cropped to 1:1 square.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              <Separator />

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="text-sm">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <Input id="first_name" {...field} placeholder="e.g. Priyanka" />
                    )}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-destructive">{errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="text-sm">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <Input id="last_name" {...field} placeholder="e.g. Gidwani" />
                    )}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-destructive">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Business Category */}
              <div className="space-y-1.5">
                <Label htmlFor="business_category" className="text-sm">
                  Business Category <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="business_category"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <Input id="business_category" {...field} placeholder="e.g. Chartered Accountant" />
                  )}
                />
                {errors.business_category && (
                  <p className="text-xs text-destructive">{errors.business_category.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <Label htmlFor="company_name" className="text-sm">Company Name</Label>
                <Controller
                  name="company_name"
                  control={control}
                  render={({ field }) => (
                    <Input id="company_name" {...field} placeholder="e.g. Gidwani Numerology" />
                  )}
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <Label htmlFor="tagline" className="text-sm">Tagline / Role</Label>
                <Controller
                  name="tagline"
                  control={control}
                  render={({ field }) => (
                    <Input id="tagline" {...field} placeholder="e.g. President / Numerologist & Life Coach" />
                  )}
                />
              </div>

              <Separator />

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm">Phone</Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input id="phone" type="tel" {...field} placeholder="+91 98765 43210" />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input id="email" type="email" {...field} placeholder="name@example.com" />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm">Website</Label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Input id="website" type="url" {...field} placeholder="https://example.com" />
                  )}
                />
              </div>

              <Separator />

              {/* Chapter role + Power Team */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">
                    Chapter Role <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="chapter_role"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="support">Support Team</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Power Team</Label>
                  <Controller
                    name="power_team"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "__none__"} onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Lifestyle & Wellness">Lifestyle &amp; Wellness</SelectItem>
                          <SelectItem value="MSME">MSME</SelectItem>
                          <SelectItem value="Property">Property</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Captain / Vice-Captain */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">Team Captain</p>
                    <p className="text-xs text-muted-foreground">Power team captain</p>
                  </div>
                  <Controller
                    name="is_power_team_captain"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">Vice Captain</p>
                    <p className="text-xs text-muted-foreground">Power team vice-captain</p>
                  </div>
                  <Controller
                    name="is_power_team_vice_captain"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <Label htmlFor="sort_order" className="text-sm">Sort Order</Label>
                <Controller
                  name="sort_order"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="sort_order"
                      type="number"
                      min={0}
                      {...field}
                      className="w-28"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first. Support team uses 1–9, Leadership 10–19, Members 20+.
                </p>
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t border-border shrink-0 flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="gap-1.5">
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? "Saving…" : isEdit ? "Save changes" : "Add member"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {cropSrc && (
        <PhotoCropper
          open={cropOpen}
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => { setCropOpen(false); setCropSrc(null) }}
        />
      )}
    </>
  )
}

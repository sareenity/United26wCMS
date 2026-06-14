import { useRef, useState, useCallback } from "react"
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ZoomIn, ZoomOut } from "lucide-react"

interface PhotoCropperProps {
  open: boolean
  imageSrc: string
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  )
}

async function generateCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  const outputSize = 500
  canvas.width = outputSize
  canvas.height = outputSize

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  ctx.imageSmoothingQuality = "high"

  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2
  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY
  const cropW = crop.width * scaleX
  const cropH = crop.height * scaleY

  ctx.save()
  ctx.translate(outputSize / 2, outputSize / 2)
  ctx.scale(1, 1)
  ctx.translate(-outputSize / 2, -outputSize / 2)

  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
  ctx.restore()

  // Re-draw properly scoped to crop
  const canvas2 = document.createElement("canvas")
  canvas2.width = outputSize
  canvas2.height = outputSize
  const ctx2 = canvas2.getContext("2d")!
  ctx2.imageSmoothingQuality = "high"
  ctx2.drawImage(
    image,
    (crop.x / scale) * scaleX,
    (crop.y / scale) * scaleY,
    (cropW / scale),
    (cropH / scale),
    0,
    0,
    outputSize,
    outputSize,
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas2.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Canvas is empty"))
      },
      "image/jpeg",
      0.92,
    )
  })
}

export function PhotoCropper({ open, imageSrc, onConfirm, onCancel }: PhotoCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [processing, setProcessing] = useState(false)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
    setScale(1)
  }, [])

  async function handleConfirm() {
    if (!imgRef.current || !completedCrop) return
    setProcessing(true)
    try {
      const blob = await generateCroppedBlob(imgRef.current, completedCrop, scale)
      onConfirm(blob)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel() }}>
      <DialogContent className="max-w-[520px] p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base">Adjust Photo</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Drag the crop area to reposition. Use the zoom slider to frame the image.
          </p>
        </DialogHeader>

        <div className="px-5 flex justify-center bg-muted/40 py-4">
          <div className="max-w-[400px] w-full">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
              className="rounded overflow-hidden"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Photo to crop"
                onLoad={onImageLoad}
                style={{
                  maxWidth: "100%",
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                }}
              />
            </ReactCrop>
          </div>
        </div>

        <div className="px-5 py-4 space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-2">
            <ZoomOut size={13} />
            Zoom
            <ZoomIn size={13} />
          </Label>
          <Slider
            min={1}
            max={3}
            step={0.05}
            value={[scale]}
            onValueChange={([v]) => setScale(v)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground text-right">{Math.round(scale * 100)}%</p>
        </div>

        <DialogFooter className="px-5 pb-5 pt-2 gap-2">
          <Button variant="outline" onClick={onCancel} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!completedCrop || processing}>
            {processing ? "Processing…" : "Use this photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

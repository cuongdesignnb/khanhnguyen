'use client'

import MediaPicker from '@/components/admin/media-picker'

interface EditorImageDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string, alt?: string, title?: string) => void
}

export default function EditorImageDialog({
  isOpen,
  onClose,
  onSelect,
}: EditorImageDialogProps) {
  if (!isOpen) return null

  const handleSelect = (selected: any[]) => {
    if (selected && selected.length > 0) {
      const item = selected[0]
      onSelect(item.url, item.alt || '', item.title || '')
    }
    onClose()
  }

  return (
    <MediaPicker
      isOpen={isOpen}
      onClose={onClose}
      onSelect={handleSelect}
      multiple={false}
    />
  )
}

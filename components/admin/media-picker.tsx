'use client'

import MediaLibraryDialog from './media/media-library-dialog'
import type { MediaPickerProps } from '@/types/media'

export default function MediaPicker(props: MediaPickerProps) {
  return <MediaLibraryDialog key={props.isOpen ? 'media-picker-open' : 'media-picker-closed'} {...props} />
}

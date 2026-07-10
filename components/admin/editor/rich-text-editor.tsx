'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useState, useEffect } from 'react'

import EditorToolbar from './editor-toolbar'
import EditorLinkDialog from './editor-link-dialog'
import EditorImageDialog from './editor-image-dialog'
import EditorPreview from './editor-preview'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  disabled?: boolean
  allowMedia?: boolean
  allowTables?: boolean
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung tại đây...',
  minHeight = 250,
  disabled = false,
  allowMedia = true,
  allowTables = true,
  className,
}: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[color:var(--gold)] hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg border border-white/10 my-4 mx-auto max-w-full h-auto',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse my-4 border border-white/10',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-white/10 bg-white/5 p-2 font-bold text-white',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-white/10 p-2 text-[color:var(--silver)]',
        },
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none focus:outline-none p-4 text-xs sm:text-sm text-[color:var(--silver)] leading-relaxed min-h-[${minHeight}px]`,
        style: `min-height: ${minHeight}px`,
      },
      // Prevent pasting raw base64 images
      handlePaste(view, event) {
        const items = event.clipboardData?.items
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.type.startsWith('image/')) {
              alert(
                'Để tránh làm nặng cơ sở dữ liệu và tối ưu tốc độ tải trang, vui lòng upload hình ảnh vào Thư viện Media trước, sau đó chèn vào nội dung bằng nút Chèn ảnh trên thanh công cụ.'
              )
              event.preventDefault()
              return true
            }
          }
        }

        const html = event.clipboardData?.getData('text/html')
        if (html && html.includes('src="data:image/')) {
          alert(
            'Phát hiện ảnh Base64 được nhúng trực tiếp. Vui lòng sử dụng Thư viện Media để tải ảnh lên thay vì dán trực tiếp.'
          )
          event.preventDefault()
          return true
        }

        return false
      },
      transformPastedHTML(html) {
        if (html.includes('src="data:image/')) {
          return html.replace(
            /<img[^>]*src="data:image\/[^>]*>/g,
            '<p class="text-red-400 italic">[Đã gỡ bỏ ảnh Base64 - Vui lòng tải lên Thư viện Media]</p>'
          )
        }
        return html
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Synchronize dynamic updates to value from external forms
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  // Handles updating editor editable status
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled && !isPreviewMode)
    }
  }, [disabled, isPreviewMode, editor])

  const handleLinkSubmit = (url: string, openInNewTab: boolean) => {
    if (!editor) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    const command = editor.chain().focus().extendMarkRange('link')
    if (openInNewTab) {
      command.setLink({ href: url, target: '_blank' }).run()
    } else {
      command.setLink({ href: url }).run()
    }
  }

  const handleImageSelect = (url: string, alt?: string, title?: string) => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: alt || '', title: title || '' })
      .run()
  }

  return (
    <div className={`border border-white/10 rounded-lg overflow-hidden bg-[color:var(--surface)] focus-within:border-[color:var(--gold)] transition ${className}`}>
      {/* Editor toolbar */}
      <EditorToolbar
        editor={editor}
        allowTables={allowTables}
        allowMedia={allowMedia}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        onOpenLinkModal={() => setIsLinkOpen(true)}
        onOpenImageModal={() => setIsImageOpen(true)}
      />

      {/* Editor Content Area / Preview Mode */}
      <div className="relative">
        {isPreviewMode ? (
          <div className="p-4 overflow-y-auto" style={{ minHeight: `${minHeight}px` }}>
            <EditorPreview html={value} />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Dialog Modals */}
      <EditorLinkDialog
        isOpen={isLinkOpen}
        onClose={() => setIsLinkOpen(false)}
        onSubmit={handleLinkSubmit}
        initialUrl={editor?.getAttributes('link').href || ''}
        initialOpenInNewTab={editor?.getAttributes('link').target === '_blank'}
      />

      <EditorImageDialog
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  )
}

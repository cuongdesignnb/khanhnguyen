'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Heading4,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Undo2,
  Redo2,
  Table,
  PlusSquare,
  MinusSquare,
  Trash2,
  Eye,
  Eraser,
  Link2Off
} from 'lucide-react'
import clsx from 'clsx'

interface EditorToolbarProps {
  editor: Editor | null
  allowTables?: boolean
  allowMedia?: boolean
  isPreviewMode: boolean
  setIsPreviewMode: (val: boolean) => void
  onOpenLinkModal: () => void
  onOpenImageModal: () => void
}

export default function EditorToolbar({
  editor,
  allowTables = true,
  allowMedia = true,
  isPreviewMode,
  setIsPreviewMode,
  onOpenLinkModal,
  onOpenImageModal,
}: EditorToolbarProps) {
  if (!editor) return null

  const btnClass = (isActive: boolean) =>
    clsx(
      'p-1.5 rounded transition-colors focus:outline-none',
      isActive
        ? 'bg-[color:var(--gold)] text-black'
        : 'text-[color:var(--silver)] hover:text-white hover:bg-white/5'
    )

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[color:var(--surface-2)] border-b border-white/10 select-none">
      {/* Undo / Redo */}
      <button
        type="button"
        title="Hoàn tác (Undo)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1.5 rounded text-[color:var(--muted)] hover:text-white disabled:opacity-30 transition"
      >
        <Undo2 size={15} />
      </button>
      <button
        type="button"
        title="Làm lại (Redo)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1.5 rounded text-[color:var(--muted)] hover:text-white disabled:opacity-30 transition"
      >
        <Redo2 size={15} />
      </button>

      <span className="w-px h-4 bg-white/10 mx-1" />

      {/* Headings */}
      <button
        type="button"
        title="Tiêu đề H2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
      >
        <Heading2 size={15} />
      </button>
      <button
        type="button"
        title="Tiêu đề H3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
      >
        <Heading3 size={15} />
      </button>
      <button
        type="button"
        title="Tiêu đề H4"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={btnClass(editor.isActive('heading', { level: 4 }))}
      >
        <Heading4 size={15} />
      </button>

      <span className="w-px h-4 bg-white/10 mx-1" />

      {/* Marks formatting */}
      <button
        type="button"
        title="Chữ đậm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        <Bold size={15} />
      </button>
      <button
        type="button"
        title="Chữ nghiêng"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        <Italic size={15} />
      </button>
      <button
        type="button"
        title="Chữ gạch chân"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive('underline'))}
      >
        <Underline size={15} />
      </button>

      <span className="w-px h-4 bg-white/10 mx-1" />

      {/* Alignments */}
      <button
        type="button"
        title="Căn lề trái"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={btnClass(editor.isActive({ textAlign: 'left' }))}
      >
        <AlignLeft size={15} />
      </button>
      <button
        type="button"
        title="Căn giữa"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={btnClass(editor.isActive({ textAlign: 'center' }))}
      >
        <AlignCenter size={15} />
      </button>
      <button
        type="button"
        title="Căn lề phải"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={btnClass(editor.isActive({ textAlign: 'right' }))}
      >
        <AlignRight size={15} />
      </button>

      <span className="w-px h-4 bg-white/10 mx-1" />

      {/* Lists */}
      <button
        type="button"
        title="Danh sách dấu chấm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        <List size={15} />
      </button>
      <button
        type="button"
        title="Danh sách số"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
      >
        <ListOrdered size={15} />
      </button>

      <span className="w-px h-4 bg-white/10 mx-1" />

      {/* Blockquote & Links */}
      <button
        type="button"
        title="Trích dẫn (Blockquote)"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
      >
        <Quote size={15} />
      </button>
      <button
        type="button"
        title="Chèn liên kết"
        onClick={onOpenLinkModal}
        className={btnClass(editor.isActive('link'))}
      >
        <Link size={15} />
      </button>
      {editor.isActive('link') && (
        <button
          type="button"
          title="Hủy liên kết"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition"
        >
          <Link2Off size={15} />
        </button>
      )}

      {/* Image Media Picker */}
      {allowMedia && (
        <button
          type="button"
          title="Chèn ảnh từ thư viện"
          onClick={onOpenImageModal}
          className="p-1.5 text-[color:var(--silver)] hover:text-white hover:bg-white/5 rounded transition"
        >
          <Image size={15} />
        </button>
      )}

      {/* Tables support */}
      {allowTables && (
        <>
          <span className="w-px h-4 bg-white/10 mx-1" />
          <button
            type="button"
            title="Chèn bảng"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className={btnClass(editor.isActive('table'))}
          >
            <Table size={15} />
          </button>

          {editor.isActive('table') && (
            <div className="flex items-center gap-1 bg-black/30 border border-white/5 rounded px-1 py-0.5 ml-1">
              <button
                type="button"
                title="Thêm hàng phía dưới"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="p-1 text-xs text-[color:var(--silver)] hover:text-[color:var(--gold)]"
              >
                <PlusSquare size={13} />
              </button>
              <button
                type="button"
                title="Xóa hàng hiện tại"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="p-1 text-xs text-red-400 hover:text-red-300"
              >
                <MinusSquare size={13} />
              </button>
              <button
                type="button"
                title="Xóa toàn bộ bảng"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="p-1 text-xs text-red-500 hover:text-red-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </>
      )}

      <span className="w-px h-4 bg-white/10 mx-1" />

      {/* Format removal */}
      <button
        type="button"
        title="Xóa định dạng"
        onClick={() => {
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }}
        className="p-1.5 text-[color:var(--muted)] hover:text-white rounded transition"
      >
        <Eraser size={15} />
      </button>

      <span className="flex-grow" />

      {/* Preview Toggle */}
      <button
        type="button"
        onClick={() => setIsPreviewMode(!isPreviewMode)}
        className={clsx(
          'px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition',
          isPreviewMode
            ? 'bg-white/10 text-white'
            : 'border border-white/10 text-[color:var(--silver)] hover:text-white hover:bg-white/5'
        )}
      >
        <Eye size={13} />
        <span>{isPreviewMode ? 'Chỉnh sửa' : 'Xem trước'}</span>
      </button>
    </div>
  )
}

import PostEditorPage from '@/components/admin/posts/post-editor-page'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <PostEditorPage mode="edit" postId={id} />
}

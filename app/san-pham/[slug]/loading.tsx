export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-64 rounded bg-white/10" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-white/10" />
        <div className="space-y-5">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="h-10 w-4/5 rounded bg-white/10" />
          <div className="h-6 w-2/5 rounded bg-white/10" />
          <div className="h-28 rounded-xl bg-white/10" />
          <div className="h-12 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  )
}

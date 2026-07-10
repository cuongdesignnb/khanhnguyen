'use client'

import { PublicProductDetail } from '@/types/public'

interface ProductSpecTableProps {
  product: PublicProductDetail
}

export default function ProductSpecTable({ product }: ProductSpecTableProps) {
  // Build a list of specifications to display
  const displaySpecs = product.specs && product.specs.length > 0 ? product.specs : [
    ...(product.model ? [{ label: 'Model', value: product.model }] : []),
    ...(product.brandName ? [{ label: 'Thương hiệu', value: product.brandName }] : []),
    ...(product.capacity ? [{ label: 'Tải trọng nâng', value: product.capacity }] : []),
    ...(product.liftHeight ? [{ label: 'Chiều cao nâng', value: product.liftHeight }] : []),
    ...(product.fuelType ? [{ label: 'Nguồn năng lượng', value: product.fuelType }] : []),
    ...(product.manufactureYear ? [{ label: 'Năm sản xuất', value: String(product.manufactureYear) }] : []),
    ...(product.forkLength ? [{ label: 'Chiều dài càng nâng', value: product.forkLength }] : []),
    ...(product.condition ? [{ label: 'Tình trạng', value: product.condition }] : []),
    ...(product.origin ? [{ label: 'Xuất xứ', value: product.origin }] : []),
  ]

  if (displaySpecs.length === 0) {
    return (
      <p className="text-xs text-[color:var(--muted)] italic text-center py-4">
        Đang cập nhật thông số kỹ thuật...
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 bg-[color:var(--surface)] text-sm">
      {displaySpecs.map((spec, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center py-3.5 border-b border-white/5 gap-4"
        >
          <span className="font-semibold text-[color:var(--muted)] text-xs uppercase tracking-wide">
            {spec.label}
          </span>
          <span className="text-white font-bold text-right">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  )
}

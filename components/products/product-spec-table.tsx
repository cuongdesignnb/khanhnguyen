'use client'

import { PublicProductDetail } from '@/types/public'

interface ProductSpecTableProps {
  product: PublicProductDetail
}

export default function ProductSpecTable({ product }: ProductSpecTableProps) {
  // Build a list of specifications to display
  const displaySpecs = product.specs.length > 0 ? product.specs : [
    ...(product.capacity ? [{ label: 'Tải trọng nâng', value: product.capacity }] : []),
    ...(product.liftHeight ? [{ label: 'Chiều cao nâng', value: product.liftHeight }] : []),
    ...(product.fuelType ? [{ label: 'Nhiên liệu', value: product.fuelType }] : []),
    ...(product.manufactureYear ? [{ label: 'Năm sản xuất', value: String(product.manufactureYear) }] : []),
    ...(product.condition ? [{ label: 'Tình trạng xe', value: product.condition }] : []),
    ...(product.origin ? [{ label: 'Xuất xứ', value: product.origin }] : []),
    ...(product.forkLength ? [{ label: 'Chiều dài càng nâng', value: product.forkLength }] : []),
  ]

  if (displaySpecs.length === 0) {
    return (
      <p className="text-xs text-[color:var(--muted)] italic text-center py-4">
        Đang cập nhật thông số kỹ thuật...
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/5 bg-[color:var(--surface)] text-sm">
      <table className="w-full text-left border-collapse">
        <tbody className="divide-y divide-white/5">
          {displaySpecs.map((spec, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}
            >
              <th className="px-4 py-3 font-semibold text-[color:var(--silver)] w-1/3 border-r border-white/5">
                {spec.label}
              </th>
              <td className="px-4 py-3 text-white">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import assert from 'node:assert/strict'
import { normalizeProductSpecs, selectProductSpecs } from '@/lib/products/normalize-product-specs'

const cases: Array<{ name: string; input: unknown; base?: Record<string, unknown> }> = [
  { name: 'đúng 3 specs', input: [{ label: 'Model', value: '8FB25' }, { label: 'Tải trọng', value: '2500 kg' }, { label: 'Nâng cao', value: '4500 mm' }] },
  { name: '20 specs', input: Array.from({ length: 20 }, (_, index) => ({ label: `Thông số ${index + 1}`, value: index + 1 })) },
  { name: 'không specs', input: [] },
  { name: 'field chuẩn', input: [], base: { model: 'FD25', capacity: '2500 kg' } },
  { name: 'object lồng', input: [{ label: '0', value: { label: 'Tải trọng nâng', value: '2500 kg' } }] },
  { name: 'value number', input: [{ label: 'Năm sản xuất', value: 2019 }] },
  { name: 'value null', input: [{ label: 'Xuất xứ', value: null }] },
  { name: 'label số với object', input: { 0: { label: 'Model', value: '7FB15' }, 1: { label: 'Nhiên liệu', value: 'Điện' } } },
  { name: 'JSON string', input: '[{"label":"Chiều dài càng","value":"1070 mm"}]' },
  { name: 'primitive', input: 'Thông số nguyên bản' },
  { name: 'array primitive', input: [{ label: 'Trang bị', value: ['Đèn', 'Còi'] }] },
  { name: 'object không có nghĩa', input: [{ label: 'Lỗi', value: { foo: 'bar' } }] },
]

for (const testCase of cases) {
  const output = normalizeProductSpecs(testCase.input, testCase.base)
  assert.equal(output.some((spec) => spec.value === '[object Object]'), false, testCase.name)
  assert.equal(output.some((spec) => /^\d+$/.test(spec.label)), false, testCase.name)
  assert.ok(output.every((spec) => typeof spec.value === 'string' && spec.value.trim()), testCase.name)
  assert.ok(selectProductSpecs(output, 3).length <= 3, testCase.name)
  assert.ok(selectProductSpecs(output, 6).length <= 6, testCase.name)
}

console.log(`Đã kiểm tra ${cases.length} nhóm dữ liệu ProductSpec; không phát hiện [object Object].`)

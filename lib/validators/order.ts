import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.string().uuid('ID sản phẩm không hợp lệ').nullable().optional(),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  model: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  quantity: z.number().int().positive('Số lượng phải lớn hơn 0'),
  unitPrice: z.number().nonnegative('Đơn giá không được âm'),
  totalPrice: z.number().nonnegative('Thành tiền không được âm'),
})

export const orderSchema = z.object({
  customerName: z.string().min(1, 'Tên khách hàng không được để trống'),
  company: z.string().nullable().optional(),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  email: z.string().email('Email không hợp lệ').or(z.string().length(0)).nullable().optional(),
  address: z.string().nullable().optional(),
  totalAmount: z.number().nonnegative('Tổng tiền không được âm'),
  depositAmount: z.number().nonnegative('Tiền cọc không được âm').optional().default(0),
  remainingAmount: z.number().nonnegative('Số tiền còn lại không được âm'),
  discountAmount: z.number().nonnegative('Tiền giảm giá không được âm').optional().default(0),
  shippingFee: z.number().nonnegative('Phí vận chuyển không được âm').optional().default(0),
  orderStatus: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  paymentStatus: z.enum(['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED']).default('UNPAID'),
  source: z.enum(['WEBSITE', 'ADMIN', 'PHONE', 'ZALO', 'FACEBOOK']).default('WEBSITE'),
  deliveryMethod: z.enum(['PICKUP', 'DELIVERY', 'INSTALLATION']).default('DELIVERY'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'COD']).nullable().optional(),
  assignedToId: z.string().uuid('ID nhân viên không hợp lệ').nullable().optional(),
  note: z.string().nullable().optional(),
  internalNote: z.string().nullable().optional(),
  expectedDeliveryAt: z.string().nullable().optional(), // ISO string from date input
  items: z.array(orderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm'),
})

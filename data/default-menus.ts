export type DefaultMenuItem = { label: string; url: string; children?: DefaultMenuItem[] }

export const defaultHeaderMenu: DefaultMenuItem[] = [
  { label: 'Trang chủ', url: '/' },
  { label: 'Sản phẩm', url: '/san-pham', children: [
    { label: 'Xe nâng mới', url: '/xe-nang-moi' }, { label: 'Xe nâng điện', url: '/xe-nang-dien' },
    { label: 'Xe nâng dầu', url: '/xe-nang-dau' }, { label: 'Xe nâng tay', url: '/xe-nang-tay' },
    { label: 'Bình điện', url: '/binh-dien' }, { label: 'Phụ tùng', url: '/phu-tung' },
  ] },
  { label: 'Dịch vụ', url: '/dich-vu' }, { label: 'Tin tức', url: '/tin-tuc' },
  { label: 'Giới thiệu', url: '/gioi-thieu' }, { label: 'Liên hệ', url: '/lien-he' },
]

export const defaultFooterMenu: DefaultMenuItem[] = [
  { label: 'Sản phẩm', url: '/san-pham', children: [
    { label: 'Xe nâng điện', url: '/xe-nang-dien' }, { label: 'Xe nâng dầu', url: '/xe-nang-dau' },
    { label: 'Xe nâng tay', url: '/xe-nang-tay' }, { label: 'Bình điện', url: '/binh-dien' },
    { label: 'Phụ tùng', url: '/phu-tung' },
  ] },
  { label: 'Dịch vụ', url: '/dich-vu', children: [
    { label: 'Cho thuê xe nâng', url: '/dich-vu/cho-thue-xe-nang' },
    { label: 'Sửa chữa xe nâng', url: '/dich-vu/sua-chua-xe-nang' },
    { label: 'Bảo dưỡng xe nâng', url: '/dich-vu/bao-duong-dinh-ky' },
    { label: 'Nhập khẩu xe nâng', url: '/dich-vu/nhap-khau-theo-yeu-cau' },
  ] },
  { label: 'Hỗ trợ', url: '/ho-tro/faq', children: [
    { label: 'Hướng dẫn mua hàng', url: '/ho-tro/huong-dan-mua-hang' },
    { label: 'Bảo hành', url: '/ho-tro/bao-hanh' }, { label: 'Đổi trả', url: '/ho-tro/doi-tra' },
    { label: 'Thanh toán', url: '/ho-tro/thanh-toan' }, { label: 'FAQ', url: '/ho-tro/faq' },
  ] },
]

export const defaultMobileMenu = defaultHeaderMenu

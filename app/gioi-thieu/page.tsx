import PublicPageShell from '@/components/public/public-page-shell'
import PageHero from '@/components/public/page-hero'
import Breadcrumb from '@/components/public/breadcrumb'
import { Award, Users, CheckCircle, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu | Khanh Nguyên Forklift',
  description: 'Tìm hiểu về Khanh Nguyên Forklift - Đơn vị nhập khẩu mua bán xe nâng Nhật bãi chính hãng uy tín hàng đầu tại TP.HCM và toàn quốc.',
}

export default function Page() {
  return (
    <PublicPageShell>
      <div className="bg-[color:var(--surface)] min-h-screen text-white pb-16">
        <PageHero title="GIỚI THIỆU KHANH NGUYÊN" subtitle="Uy tín – Chất lượng – Tạo niềm tin" />
        <Breadcrumb items={[{ label: 'Giới thiệu' }]} />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[color:var(--gold)]">
                ĐƠN VỊ CUNG CẤP XE NÂNG NHẬT BÃI UY TÍN HÀNG ĐẦU
              </h2>
              <div className="h-1 w-12 rounded bg-[color:var(--gold)]" />
              <p className="text-sm text-[color:var(--silver)] leading-relaxed">
                Được thành lập từ năm 2012, <strong>Khanh Nguyên Forklift</strong> tự hào là một trong những đơn vị tiên phong trong lĩnh vực nhập khẩu và mua bán xe nâng cũ (xe nâng Nhật bãi) chất lượng cao tại Việt Nam.
              </p>
              <p className="text-sm text-[color:var(--silver)] leading-relaxed">
                Chúng tôi chuyên cung cấp các dòng xe nâng điện đứng lái, ngồi lái, xe nâng dầu, xe nâng tay và linh kiện bình điện ắc quy xe nâng từ các thương hiệu hàng đầu Nhật Bản như TOYOTA, KOMATSU, MITSUBISHI, TCM, NICHIYU, SUMITOMO...
              </p>
              <p className="text-sm text-[color:var(--silver)] leading-relaxed">
                Với tôn chỉ hoạt động <strong>&ldquo;Uy tín - Chất lượng - Tạo niềm tin&rdquo;</strong>, chúng tôi luôn cam kết kiểm định kỹ thuật 100% trước khi bàn giao xe và cung cấp chế độ hậu mãi bảo hành dài hạn chu đáo nhất cho mọi đối tác.
              </p>
            </div>
            {/* Visual element */}
            <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-8 flex flex-col justify-center h-80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[color:var(--gold)]/5 rounded-full filter blur-2xl" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--gold)]">KHANH NGUYEN FORKLIFT</span>
              <p className="text-3xl font-black mt-2 text-white font-sans">12+ NĂM ĐỒNG HÀNH CÙNG DOANH NGHIỆP</p>
              <p className="text-sm text-[color:var(--muted)] mt-4 leading-relaxed">
                Hơn 2,500 chiếc xe nâng chất lượng đã bàn giao thành công, giúp giải quyết bài toán nâng hạ hàng hóa tối ưu hiệu quả chi phí đầu tư cho hàng ngàn nhà máy, kho hàng trên toàn quốc.
              </p>
            </div>
          </div>

          {/* Core values block */}
          <div className="bg-[color:var(--surface-2)] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-center text-white tracking-wider uppercase">GIÁ TRỊ CỐT LÕI CỦA CHÚNG TÔI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <CheckCircle size={24} />
                </div>
                <h4 className="font-bold text-white text-base">CHẤT LƯỢNG HÀNG ĐẦU</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Tất cả xe nâng nhập khẩu trực tiếp từ Nhật Bản, bảo đảm nguyên bản, chưa qua sửa chữa tại Việt Nam.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <Award size={24} />
                </div>
                <h4 className="font-bold text-white text-base">UY TÍN CHUYÊN NGHIỆP</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Cam kết thông tin sản phẩm trung thực, chính xác và thực hiện đúng 100% các điều khoản bảo hành hỗ trợ kỹ thuật.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center justify-center size-12 rounded-full bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-white text-base">HỖ TRỢ TẬN TÂM</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Đội ngũ kỹ thuật túc trực hỗ trợ bảo dưỡng nhanh trong vòng 24 giờ kể từ khi nhận phản hồi từ khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}

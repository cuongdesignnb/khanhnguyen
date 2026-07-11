import type {Metadata} from 'next'
import PublicPageShell from '@/components/public/public-page-shell'
import CompareWorkspace from '@/components/compare/compare-workspace'
export const metadata:Metadata={title:'So sánh sản phẩm',description:'So sánh thông số kỹ thuật các sản phẩm xe nâng tại Khanh Nguyên.',robots:{index:false,follow:true},alternates:{canonical:'/so-sanh'}}
export default function Page(){return <PublicPageShell><CompareWorkspace/></PublicPageShell>}

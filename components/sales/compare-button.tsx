'use client'
import CompareButton from '@/components/compare/compare-button'
export default function LegacyCompareButton({showText,...props}:{productId:string;productName:string;showText?:boolean;className?:string}){return <CompareButton {...props} showLabel={showText} variant={showText?'outline':'icon'}/>}

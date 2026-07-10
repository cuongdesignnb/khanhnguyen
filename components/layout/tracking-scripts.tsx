import Script from 'next/script'
import { defaultSettings } from '@/data/default-settings'
import { getSettingsByGroup } from '@/lib/settings'

export default async function TrackingScripts() {
  const tracking = await getSettingsByGroup('integrations.tracking', defaultSettings.integrationsTracking)
  return <>
    {tracking.googleTagManagerId && <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${tracking.googleTagManagerId}');`}</Script>}
    {tracking.googleAnalyticsId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${tracking.googleAnalyticsId}`} strategy="afterInteractive" /><Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tracking.googleAnalyticsId}');`}</Script></>}
    {tracking.facebookPixelId && <Script id="fb-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.facebookPixelId}');fbq('track','PageView');`}</Script>}
    {tracking.customHeadScript && <Script id="custom-head" strategy="beforeInteractive">{tracking.customHeadScript}</Script>}
    {tracking.customBodyScript && <Script id="custom-body" strategy="afterInteractive">{tracking.customBodyScript}</Script>}
    {tracking.customFooterScript && <Script id="custom-footer" strategy="lazyOnload">{tracking.customFooterScript}</Script>}
  </>
}

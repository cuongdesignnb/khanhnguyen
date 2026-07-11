import {notFound}from'next/navigation';import SettingsTabForm from '@/components/admin/settings/settings-tab-form';import {settingsTabBySlug}from'@/lib/site-config/registry'
export default async function SettingsTabPage({params}:{params:Promise<{tab:string}>}){const {tab:slug}=await params;const tab=settingsTabBySlug.get(slug);if(!tab)notFound();return <SettingsTabForm tab={tab}/>}

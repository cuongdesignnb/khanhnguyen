import prisma from '@/lib/prisma'
export async function getPageConfiguration(pageKey:string){try{return await prisma.pageConfiguration.findUnique({where:{pageKey},include:{sections:{orderBy:{sortOrder:'asc'},include:{image:true,background:true,items:{orderBy:{sortOrder:'asc'},include:{image:true}}}}}})}catch(error){console.error(`[site-config] Không thể tải trang ${pageKey}, dùng fallback.`,error);return null}}
export async function getPageSections(pageKey:string){return (await getPageConfiguration(pageKey))?.sections??[]}
export async function getPageSection(pageKey:string,sectionKey:string){return (await getPageSections(pageKey)).find(section=>section.sectionKey===sectionKey)??null}

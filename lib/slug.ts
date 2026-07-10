import slugify from 'slugify'

export function toVietnameseSlug(input: string): string {
  if (!input) return ''
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function toSlug(input: string): string {
  return toVietnameseSlug(input)
}

export async function generateUniqueSlug(
  base: string,
  checker: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = toSlug(base)
  let slug = baseSlug
  let counter = 2
  
  while (await checker(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

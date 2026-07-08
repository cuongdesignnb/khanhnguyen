import slugify from 'slugify'

export function toSlug(input: string): string {
  if (!input) return ''
  return slugify(input, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    locale: 'vi',
    trim: true,
  })
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

interface JsonLdProps {
  data?: Record<string, unknown> | Record<string, unknown>[] | null
  schema?: Record<string, unknown> | Record<string, unknown>[] | null
}

export default function JsonLd({ data, schema }: JsonLdProps) {
  const value = data || schema
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const json = JSON.stringify(value).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

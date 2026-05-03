export interface WPPost {
  slug: string
  categoria: string
  titulo: string
  desc: string
  data: string
  autor: string
  cover: string | null
  href: string
  content: string
}

const WP_API = process.env.NEXT_PUBLIC_WP_API ?? 'https://cms.casacriative.com.br/wp-json/wp/v2'

function formatDate(dateString: string): string {
  const d = new Date(dateString)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

export async function getWPPosts(): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?_embed&per_page=20&status=publish`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const posts = await res.json()

    return posts.map((p: any): WPPost => {
      const featuredImg =
        p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null

      const categoryName =
        p._embedded?.['wp:term']?.[0]?.[0]?.name ?? 'Blog'

      const authorName =
        p._embedded?.['author']?.[0]?.name ?? 'Casa Criative Digital'

      return {
        slug: p.slug,
        categoria: categoryName,
        titulo: p.title.rendered,
        desc: stripHtml(p.excerpt.rendered).slice(0, 160),
        data: formatDate(p.date),
        autor: authorName,
        cover: featuredImg,
        href: `/blog/${p.slug}`,
        content: p.content.rendered,
      }
    })
  } catch {
    return []
  }
}

export async function getWPPost(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${WP_API}/posts?_embed&slug=${slug}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const posts = await res.json()
    if (!posts.length) return null

    const p = posts[0]
    const featuredImg =
      p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null
    const categoryName =
      p._embedded?.['wp:term']?.[0]?.[0]?.name ?? 'Blog'
    const authorName =
      p._embedded?.['author']?.[0]?.name ?? 'Casa Criative Digital'

    return {
      slug: p.slug,
      categoria: categoryName,
      titulo: p.title.rendered,
      desc: stripHtml(p.excerpt.rendered).slice(0, 160),
      data: formatDate(p.date),
      autor: authorName,
      cover: featuredImg,
      href: `/blog/${p.slug}`,
      content: p.content.rendered,
    }
  } catch {
    return null
  }
}

export async function getWPSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?per_page=100&status=publish&_fields=slug`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const posts = await res.json()
    return posts.map((p: any) => p.slug)
  } catch {
    return []
  }
}

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

// Se o WordPress estiver fora do ar, o build não pode ficar pendurado à espera:
// desiste em 8s e o site usa os posts locais. O aviso fica no log de build da
// Cloudflare, para se perceber porque o blog saiu com os artigos antigos.
async function wpFetch(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) console.warn(`[wp-posts] ${url} respondeu ${res.status}; a usar posts locais`)
    return res.ok ? res : null
  } catch (e) {
    console.warn(`[wp-posts] ${url} falhou (${(e as Error).message}); a usar posts locais`)
    return null
  }
}

function formatDate(dateString: string): string {
  const d = new Date(dateString)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

export async function getWPPosts(): Promise<WPPost[]> {
  try {
    const res = await wpFetch(`${WP_API}/posts?_embed&per_page=20&status=publish`)
    if (!res) return []
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
    const res = await wpFetch(`${WP_API}/posts?_embed&slug=${slug}`)
    if (!res) return null
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
    const res = await wpFetch(`${WP_API}/posts?per_page=100&status=publish&_fields=slug`)
    if (!res) return []
    const posts = await res.json()
    return posts.map((p: any) => p.slug)
  } catch {
    return []
  }
}

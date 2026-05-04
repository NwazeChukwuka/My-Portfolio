/**
 * Map Supabase rows to shapes used by public pages.
 */

const DEFAULT_PROFILE = '/assets/Me 1.webp';
const DEFAULT_SECONDARY = '/assets/Me 2.webp';

export function mapBlogPostRow(row) {
  if (!row || row.status === 'draft') return null;
  const dateStr = row.published_at || row.created_at || '';
  return {
    id: row.id || row.slug,
    slug: row.slug,
    title: row.title || '',
    category: row.category || 'General',
    tags: Array.isArray(row.tags) ? row.tags : [],
    date: dateStr,
    author: row.author || '',
    image: row.cover_image_url || DEFAULT_PROFILE,
    altText: row.title || '',
    snippet: row.snippet || '',
    preview: row.snippet || '',
    content: row.content_html || '',
    readTime: row.read_time || '',
    status: row.status,
  };
}

function isDataCategory(category) {
  const c = String(category || '').toLowerCase();
  return /\b(data|analyst|analytics|bi|machine|visualization|dashboard)\b/.test(c);
}

export function mapProjectRow(row) {
  if (!row || row.status === 'draft') return null;
  const slug = row.slug || row.id;
  return {
    id: row.id || slug,
    slug,
    image: row.image_url || DEFAULT_SECONDARY,
    title: row.title || '',
    category: row.category || 'General',
    description: row.summary || '',
    summary: row.summary || '',
    detailsLink: row.details_url || `/case-studies/${slug}`,
    isInternalLink: true,
  };
}

export function filterProjectsForWebDev(projects) {
  return (projects || []).filter((p) => !isDataCategory(p.category));
}

export function filterProjectsForDataAnalyst(projects) {
  return (projects || []).filter((p) => isDataCategory(p.category));
}

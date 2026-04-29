import { supabase } from './supabaseClient';

// Example data access layer for dynamic portfolio content.
// Update table/storage names to match your Supabase schema.

export async function getProjects() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateProject(projectId, payload) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAsset(file, pathPrefix = 'portfolio') {
  if (!supabase) throw new Error('Supabase is not configured.');
  const filePath = `${pathPrefix}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('assets').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createContactMessage(payload) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add your environment keys to enable contact submissions.');
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContactMessages() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateContactMessageStatus(id, status) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) throw error;
  return data;
}

export async function upsertSiteSetting(key, value) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBlogPosts() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function upsertBlogPost(post) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const payload = {
    id: post.id || undefined,
    slug: post.slug,
    title: post.title,
    snippet: post.snippet || '',
    content_html: post.content_html || '',
    category: post.category || 'General',
    tags: Array.isArray(post.tags) ? post.tags : [],
    cover_image_url: post.cover_image_url || null,
    published_at: post.published_at || new Date().toISOString().slice(0, 10),
    author: post.author || 'Mazi Chukwuka',
    read_time: post.read_time || null,
    status: post.status || 'published',
  };

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createProject(project) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const payload = {
    slug: project.slug,
    title: project.title,
    category: project.category || 'General',
    summary: project.summary || '',
    description: project.description || '',
    image_url: project.image_url || null,
    details_url: project.details_url || '/portfolio',
    is_featured: Boolean(project.is_featured),
    sort_order: Number(project.sort_order || 0),
    status: project.status || 'published',
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

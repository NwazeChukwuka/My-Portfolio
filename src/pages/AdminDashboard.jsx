import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  createProject,
  deleteBlogPost,
  deleteProject,
  getBlogPosts,
  getContactMessages,
  getProjects,
  getSiteSettings,
  updateContactMessageStatus,
  updateProject,
  uploadAsset,
  upsertBlogPost,
  upsertSiteSetting,
} from '../lib/portfolioApi';
import './AdminDashboard.css';

const TABS = ['messages', 'settings', 'blogs', 'projects', 'assets'];

const defaultBlogForm = {
  id: '',
  slug: '',
  title: '',
  snippet: '',
  content_html: '',
  category: 'General',
  tags: '',
  cover_image_url: '',
  published_at: '',
  author: 'Mazi Chukwuka',
  read_time: '',
  status: 'published',
};

const defaultProjectForm = {
  id: '',
  slug: '',
  title: '',
  category: 'General',
  summary: '',
  description: '',
  image_url: '',
  details_url: '/portfolio',
  is_featured: false,
  sort_order: 0,
  status: 'published',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('messages');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [messages, setMessages] = useState([]);
  const [settingsMap, setSettingsMap] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogForm, setBlogForm] = useState(defaultBlogForm);
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [assetFile, setAssetFile] = useState(null);
  const [uploadPrefix, setUploadPrefix] = useState('portfolio');
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState('');

  const [saving, setSaving] = useState(false);

  const contactSettings = useMemo(() => ({
    full_name: settingsMap.general?.full_name || '',
    tagline: settingsMap.general?.tagline || '',
    availability_badge: settingsMap.general?.availability_badge || '',
    email: settingsMap.contact?.email || '',
    phone: settingsMap.contact?.phone || '',
    whatsapp: settingsMap.contact?.whatsapp || '',
    address: settingsMap.contact?.address || '',
    linkedin: settingsMap.contact?.linkedin || '',
    github: settingsMap.contact?.github || '',
    cv_full: settingsMap.cvs?.full || settingsMap.general?.cvs?.full || '',
    cv_webDeveloper: settingsMap.cvs?.webDeveloper || '',
    cv_dataAnalyst: settingsMap.cvs?.dataAnalyst || '',
    content_json: JSON.stringify(settingsMap.content || {}, null, 2),
  }), [settingsMap]);
  const [settingsForm, setSettingsForm] = useState(contactSettings);

  useEffect(() => {
    setSettingsForm(contactSettings);
  }, [contactSettings]);

  const loadAll = async () => {
    const [messageData, settingsData, blogData, projectData] = await Promise.all([
      getContactMessages(),
      getSiteSettings(),
      getBlogPosts(),
      getProjects(),
    ]);
    const map = {};
    settingsData.forEach((item) => {
      map[item.key] = item.value || {};
    });
    setMessages(messageData || []);
    setSettingsMap(map);
    setBlogs(blogData || []);
    setProjects(projectData || []);
  };

  useEffect(() => {
    const boot = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
        }
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          navigate('/admin/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          throw new Error('Your account is not an admin yet. Set your profile role to admin.');
        }

        await loadAll();
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load admin dashboard.');
      } finally {
        setCheckingAuth(false);
      }
    };

    boot();
  }, [navigate]);

  const clearNotices = () => {
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleStatusUpdate = async (id, status) => {
    clearNotices();
    try {
      await updateContactMessageStatus(id, status);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      setStatusMessage('Message status updated.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update message status.');
    }
  };

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setSettingsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    clearNotices();
    setSaving(true);
    try {
      let contentOverride = {};
      if (settingsForm.content_json?.trim()) {
        contentOverride = JSON.parse(settingsForm.content_json);
      }

      await Promise.all([
        upsertSiteSetting('general', {
          full_name: settingsForm.full_name,
          tagline: settingsForm.tagline,
          availability_badge: settingsForm.availability_badge,
          profile_picture: settingsMap.general?.profile_picture || '/assets/mazi-profile.jpg',
        }),
        upsertSiteSetting('contact', {
          email: settingsForm.email,
          phone: settingsForm.phone,
          whatsapp: settingsForm.whatsapp,
          address: settingsForm.address,
          linkedin: settingsForm.linkedin,
          github: settingsForm.github,
        }),
        upsertSiteSetting('cvs', {
          full: settingsForm.cv_full,
          webDeveloper: settingsForm.cv_webDeveloper,
          dataAnalyst: settingsForm.cv_dataAnalyst,
        }),
        upsertSiteSetting('content', contentOverride),
      ]);
      setStatusMessage('Site settings saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save settings. Ensure Content JSON is valid JSON.');
    } finally {
      setSaving(false);
    }
  };

  const handleBlogInput = (event) => {
    const { name, value } = event.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditBlog = (post) => {
    setBlogForm({
      id: post.id,
      slug: post.slug || '',
      title: post.title || '',
      snippet: post.snippet || '',
      content_html: post.content_html || '',
      category: post.category || 'General',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      cover_image_url: post.cover_image_url || '',
      published_at: post.published_at || '',
      author: post.author || 'Mazi Chukwuka',
      read_time: post.read_time || '',
      status: post.status || 'published',
    });
    setActiveTab('blogs');
  };

  const handleSaveBlog = async (event) => {
    event.preventDefault();
    clearNotices();
    setSaving(true);
    try {
      await upsertBlogPost({
        ...blogForm,
        tags: blogForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setStatusMessage('Blog post saved.');
      setBlogForm(defaultBlogForm);
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    clearNotices();
    try {
      await deleteBlogPost(id);
      setStatusMessage('Blog post deleted.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete blog post.');
    }
  };

  const handleProjectInput = (event) => {
    const { name, value, type, checked } = event.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditProject = (project) => {
    setProjectForm({
      id: project.id,
      slug: project.slug || '',
      title: project.title || '',
      category: project.category || 'General',
      summary: project.summary || '',
      description: project.description || '',
      image_url: project.image_url || '',
      details_url: project.details_url || '/portfolio',
      is_featured: Boolean(project.is_featured),
      sort_order: project.sort_order || 0,
      status: project.status || 'published',
    });
    setActiveTab('projects');
  };

  const handleSaveProject = async (event) => {
    event.preventDefault();
    clearNotices();
    setSaving(true);
    try {
      if (projectForm.id) {
        await updateProject(projectForm.id, {
          slug: projectForm.slug,
          title: projectForm.title,
          category: projectForm.category,
          summary: projectForm.summary,
          description: projectForm.description,
          image_url: projectForm.image_url,
          details_url: projectForm.details_url,
          is_featured: projectForm.is_featured,
          sort_order: Number(projectForm.sort_order || 0),
          status: projectForm.status,
        });
      } else {
        await createProject(projectForm);
      }
      setStatusMessage('Project saved.');
      setProjectForm(defaultProjectForm);
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    clearNotices();
    try {
      await deleteProject(id);
      setStatusMessage('Project deleted.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete project.');
    }
  };

  const handleAssetUpload = async (event) => {
    event.preventDefault();
    clearNotices();
    if (!assetFile) {
      setErrorMessage('Select an image/file first.');
      return;
    }
    setSaving(true);
    try {
      const url = await uploadAsset(assetFile, uploadPrefix || 'portfolio');
      setUploadedAssetUrl(url);
      setStatusMessage('Asset uploaded. Copy the URL into project/blog/image fields.');
      setAssetFile(null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to upload asset.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (checkingAuth) {
    return <div className="admin-page"><p>Loading admin console...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Console</h1>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn secondary" onClick={() => navigate('/')}>View Site</button>
          <button type="button" className="admin-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {statusMessage && <p className="admin-note success">{statusMessage}</p>}
      {errorMessage && <p className="admin-note error">{errorMessage}</p>}

      {activeTab === 'messages' && (
        <section className="admin-section">
          <h2>Incoming Messages</h2>
          <div className="admin-list">
            {messages.map((message) => (
              <article key={message.id} className="admin-card">
                <h3>{message.subject}</h3>
                <p><strong>Name:</strong> {message.name}</p>
                <p><strong>Email:</strong> {message.email || '-'}</p>
                <p><strong>Phone:</strong> {message.phone || '-'}</p>
                <p>{message.message}</p>
                <div className="inline-row">
                  <span className="pill">{message.status}</span>
                  <select
                    value={message.status}
                    onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                  >
                    <option value="new">new</option>
                    <option value="in_progress">in_progress</option>
                    <option value="closed">closed</option>
                  </select>
                </div>
              </article>
            ))}
            {messages.length === 0 && <p>No messages yet.</p>}
          </div>
        </section>
      )}

      {activeTab === 'settings' && (
        <section className="admin-section">
          <h2>Display Settings</h2>
          <p className="admin-note">
            Content JSON lets you override any text/list on the site. Use the same object structure as `src/data/personalData.js`.
          </p>
          <div className="admin-form-grid">
            <input name="full_name" placeholder="Display name" value={settingsForm.full_name} onChange={handleSettingsChange} />
            <input name="tagline" placeholder="Tagline" value={settingsForm.tagline} onChange={handleSettingsChange} />
            <input name="availability_badge" placeholder="Hero availability badge text" value={settingsForm.availability_badge} onChange={handleSettingsChange} />
            <input name="email" placeholder="Display email" value={settingsForm.email} onChange={handleSettingsChange} />
            <input name="phone" placeholder="Display phone" value={settingsForm.phone} onChange={handleSettingsChange} />
            <input name="whatsapp" placeholder="WhatsApp link" value={settingsForm.whatsapp} onChange={handleSettingsChange} />
            <input name="address" placeholder="Address" value={settingsForm.address} onChange={handleSettingsChange} />
            <input name="linkedin" placeholder="LinkedIn URL" value={settingsForm.linkedin} onChange={handleSettingsChange} />
            <input name="github" placeholder="GitHub URL" value={settingsForm.github} onChange={handleSettingsChange} />
            <input name="cv_full" placeholder="General CV URL (PDF)" value={settingsForm.cv_full} onChange={handleSettingsChange} />
            <input name="cv_webDeveloper" placeholder="Web Developer CV URL (PDF)" value={settingsForm.cv_webDeveloper} onChange={handleSettingsChange} />
            <input name="cv_dataAnalyst" placeholder="Data Analyst CV URL (PDF)" value={settingsForm.cv_dataAnalyst} onChange={handleSettingsChange} />
            <textarea
              name="content_json"
              placeholder='{"aboutEducation":[...], "homeExperience":[...]}'
              value={settingsForm.content_json}
              onChange={handleSettingsChange}
              rows={16}
            />
          </div>
          <button type="button" className="admin-btn" onClick={handleSaveSettings} disabled={saving}>Save settings</button>
        </section>
      )}

      {activeTab === 'blogs' && (
        <section className="admin-section">
          <h2>Blog Manager</h2>
          <form className="admin-form-grid" onSubmit={handleSaveBlog}>
            <input name="slug" required placeholder="slug" value={blogForm.slug} onChange={handleBlogInput} />
            <input name="title" required placeholder="title" value={blogForm.title} onChange={handleBlogInput} />
            <input name="category" placeholder="category" value={blogForm.category} onChange={handleBlogInput} />
            <input name="author" placeholder="author" value={blogForm.author} onChange={handleBlogInput} />
            <input name="published_at" type="date" value={blogForm.published_at} onChange={handleBlogInput} />
            <input name="read_time" placeholder="read time" value={blogForm.read_time} onChange={handleBlogInput} />
            <input name="cover_image_url" placeholder="cover image url" value={blogForm.cover_image_url} onChange={handleBlogInput} />
            <input name="tags" placeholder="tags comma separated" value={blogForm.tags} onChange={handleBlogInput} />
            <select name="status" value={blogForm.status} onChange={handleBlogInput}>
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
            <textarea name="snippet" placeholder="snippet" value={blogForm.snippet} onChange={handleBlogInput} />
            <textarea name="content_html" placeholder="content html" value={blogForm.content_html} onChange={handleBlogInput} />
            <button type="submit" className="admin-btn" disabled={saving}>Save blog post</button>
          </form>
          <div className="admin-list">
            {blogs.map((blog) => (
              <article key={blog.id} className="admin-card">
                <h3>{blog.title}</h3>
                <p>{blog.slug}</p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditBlog(blog)}>Edit</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'projects' && (
        <section className="admin-section">
          <h2>Project Manager</h2>
          <form className="admin-form-grid" onSubmit={handleSaveProject}>
            <input name="slug" required placeholder="slug" value={projectForm.slug} onChange={handleProjectInput} />
            <input name="title" required placeholder="title" value={projectForm.title} onChange={handleProjectInput} />
            <input name="category" placeholder="category" value={projectForm.category} onChange={handleProjectInput} />
            <input name="image_url" placeholder="image url" value={projectForm.image_url} onChange={handleProjectInput} />
            <input name="details_url" placeholder="details url" value={projectForm.details_url} onChange={handleProjectInput} />
            <input name="sort_order" type="number" placeholder="sort order" value={projectForm.sort_order} onChange={handleProjectInput} />
            <select name="status" value={projectForm.status} onChange={handleProjectInput}>
              <option value="published">published</option>
              <option value="draft">draft</option>
            </select>
            <label className="checkbox-row">
              <input type="checkbox" name="is_featured" checked={projectForm.is_featured} onChange={handleProjectInput} />
              Featured project
            </label>
            <textarea name="summary" placeholder="summary" value={projectForm.summary} onChange={handleProjectInput} />
            <textarea name="description" placeholder="description" value={projectForm.description} onChange={handleProjectInput} />
            <button type="submit" className="admin-btn" disabled={saving}>Save project</button>
          </form>
          <div className="admin-list">
            {projects.map((project) => (
              <article key={project.id} className="admin-card">
                <h3>{project.title}</h3>
                <p>{project.slug}</p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditProject(project)}>Edit</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'assets' && (
        <section className="admin-section">
          <h2>Asset Upload</h2>
          <form className="admin-form-grid" onSubmit={handleAssetUpload}>
            <input
              type="text"
              value={uploadPrefix}
              onChange={(e) => setUploadPrefix(e.target.value)}
              placeholder="folder prefix (e.g. blog, projects)"
            />
            <input
              type="file"
              onChange={(e) => setAssetFile(e.target.files?.[0] || null)}
            />
            <button type="submit" className="admin-btn" disabled={saving}>Upload asset</button>
          </form>
          {uploadedAssetUrl && (
            <div className="admin-card">
              <p>Uploaded URL:</p>
              <code>{uploadedAssetUrl}</code>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;

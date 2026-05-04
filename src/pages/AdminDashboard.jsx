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
import personalData from '../data/personalData';
import { serviceIconOptions } from '../lib/serviceIcons';
import './AdminDashboard.css';

const TAB_LABELS = {
  messages: 'Messages',
  settings: 'Display settings',
  blogs: 'Blog posts',
  projects: 'Projects',
  homeServices: 'Home services',
  homePage: 'Home page sections',
  faqs: 'FAQs',
  assets: 'Upload assets',
};

const TABS = ['messages', 'settings', 'blogs', 'projects', 'homeServices', 'homePage', 'faqs', 'assets'];

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
  author: 'Nwaze Chukwuka',
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
  details_url: '',
  is_featured: false,
  sort_order: 0,
  status: 'published',
};

const defaultHomeServiceForm = {
  originalTitle: '',
  title: '',
  description: '',
  featuresText: '',
  iconKey: 'FaBriefcase',
};

const defaultServicePackageForm = {
  serviceTitle: '',
  name: '',
  details: '',
  cta: '',
  editIndex: -1,
};

const defaultFaqForm = {
  question: '',
  answer: '',
  editIndex: -1,
};

const defaultHomeSkillForm = {
  skill: '',
  percentage: '85',
  color: '#61DAFB',
  editIndex: -1,
};

const defaultHomeExpForm = {
  title: '',
  company: '',
  years: '',
  description: '',
  achievementsText: '',
  editIndex: -1,
};

const defaultHomeTestimonialForm = {
  quote: '',
  author: '',
  image: '',
  editIndex: -1,
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
  const [homeServicesDraft, setHomeServicesDraft] = useState([]);
  const [homeServicePackagesDraft, setHomeServicePackagesDraft] = useState({});
  const [homeServiceForm, setHomeServiceForm] = useState(defaultHomeServiceForm);
  const [servicePackageForm, setServicePackageForm] = useState(defaultServicePackageForm);
  const [faqDraft, setFaqDraft] = useState([]);
  const [faqForm, setFaqForm] = useState(defaultFaqForm);

  const [homeSkillsDraft, setHomeSkillsDraft] = useState([]);
  const [homeSkillForm, setHomeSkillForm] = useState(defaultHomeSkillForm);
  const [homeExperienceDraft, setHomeExperienceDraft] = useState([]);
  const [homeExperienceForm, setHomeExperienceForm] = useState(defaultHomeExpForm);
  const [homeTestimonialsDraft, setHomeTestimonialsDraft] = useState([]);
  const [homeTestimonialForm, setHomeTestimonialForm] = useState(defaultHomeTestimonialForm);

  const [saving, setSaving] = useState(false);

  const contactSettings = useMemo(() => ({
    full_name: settingsMap.general?.full_name || '',
    tagline: settingsMap.general?.tagline || '',
    availability_badge: settingsMap.general?.availability_badge || '',
    profile_picture: settingsMap.general?.profile_picture || '/assets/Me 1.webp',
    secondary_profile_picture: settingsMap.general?.secondary_profile_picture || '/assets/Me 2.webp',
    email: settingsMap.contact?.email || '',
    phone: settingsMap.contact?.phone || '',
    whatsapp: settingsMap.contact?.whatsapp || '',
    address: settingsMap.contact?.address || '',
    linkedin: settingsMap.contact?.linkedin || '',
    github: settingsMap.contact?.github || '',
    cv_full: settingsMap.cvs?.full || settingsMap.general?.cvs?.full || '',
    cv_webDeveloper: settingsMap.cvs?.webDeveloper || '',
    cv_dataAnalyst: settingsMap.cvs?.dataAnalyst || '',
    about_short: settingsMap.general?.about_short_bio || settingsMap.general?.aboutShortBio || '',
    about_long: settingsMap.general?.about_long_bio || settingsMap.general?.aboutLongBio || '',
    about_page_bio: settingsMap.general?.about_page_bio || settingsMap.general?.aboutPageBio || '',
  }), [settingsMap]);
  const [settingsForm, setSettingsForm] = useState(contactSettings);

  useEffect(() => {
    setSettingsForm(contactSettings);
  }, [contactSettings]);

  useEffect(() => {
    const baseServices = Array.isArray(settingsMap.home_services) && settingsMap.home_services.length > 0
      ? settingsMap.home_services
      : (personalData.homeServices || []).map((service) => ({
        title: service.title || '',
        description: service.description || '',
        features: Array.isArray(service.features) ? service.features : [],
        iconKey: service.iconKey || 'FaBriefcase',
      }));
    const basePackages = settingsMap.home_service_packages && typeof settingsMap.home_service_packages === 'object'
      ? settingsMap.home_service_packages
      : (personalData.homeServicePackages || {});

    setHomeServicesDraft(baseServices);
    setHomeServicePackagesDraft(basePackages);
  }, [settingsMap.home_services, settingsMap.home_service_packages]);

  useEffect(() => {
    const baseFaqs = Array.isArray(settingsMap.faqs) && settingsMap.faqs.length > 0
      ? settingsMap.faqs
      : (personalData.faqs || []);
    setFaqDraft(baseFaqs);
  }, [settingsMap.faqs]);

  useEffect(() => {
    setHomeSkillsDraft(Array.isArray(settingsMap.home_skills) ? settingsMap.home_skills : []);
  }, [settingsMap.home_skills]);

  useEffect(() => {
    setHomeExperienceDraft(Array.isArray(settingsMap.home_experience) ? settingsMap.home_experience : []);
  }, [settingsMap.home_experience]);

  useEffect(() => {
    setHomeTestimonialsDraft(Array.isArray(settingsMap.home_testimonials) ? settingsMap.home_testimonials : []);
  }, [settingsMap.home_testimonials]);

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
          throw new Error('Database is not configured.');
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
      await Promise.all([
        upsertSiteSetting('general', {
          full_name: settingsForm.full_name,
          tagline: settingsForm.tagline,
          availability_badge: settingsForm.availability_badge,
          profile_picture: settingsForm.profile_picture || '/assets/Me 1.webp',
          secondary_profile_picture: settingsForm.secondary_profile_picture || '/assets/Me 2.webp',
          about_short_bio: settingsForm.about_short || '',
          about_long_bio: settingsForm.about_long || '',
          about_page_bio: settingsForm.about_page_bio || '',
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
      ]);
      setStatusMessage('Site settings saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save settings.');
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
      author: post.author || 'Nwaze Chukwuka',
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
      details_url: project.details_url || `/case-studies/${project.slug || ''}`,
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
      let savedProject = null;
      if (projectForm.id) {
        savedProject = await updateProject(projectForm.id, {
          slug: projectForm.slug,
          title: projectForm.title,
          category: projectForm.category,
          summary: projectForm.summary,
          description: projectForm.description,
          image_url: projectForm.image_url,
          details_url: projectForm.details_url || `/case-studies/${projectForm.slug}`,
          is_featured: projectForm.is_featured,
          sort_order: Number(projectForm.sort_order || 0),
          status: projectForm.status,
        });
      } else {
        savedProject = await createProject(projectForm);
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

  const handleHomeServiceInput = (event) => {
    const { name, value } = event.target;
    setHomeServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditHomeService = (service) => {
    setHomeServiceForm({
      originalTitle: service.title || '',
      title: service.title || '',
      description: service.description || '',
      featuresText: Array.isArray(service.features) ? service.features.join(', ') : '',
      iconKey: service.iconKey || 'FaBriefcase',
    });
  };

  const handleSaveHomeServiceDraft = (event) => {
    event.preventDefault();
    if (!homeServiceForm.title.trim()) return;

    const featureList = homeServiceForm.featuresText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const payload = {
      title: homeServiceForm.title.trim(),
      description: homeServiceForm.description.trim(),
      features: featureList,
      iconKey: homeServiceForm.iconKey || 'FaBriefcase',
    };

    setHomeServicesDraft((prev) => {
      const next = [...prev];
      const editIndex = next.findIndex((item) => item.title === homeServiceForm.originalTitle);
      if (editIndex >= 0) next[editIndex] = payload;
      else next.push(payload);
      return next;
    });

    if (homeServiceForm.originalTitle && homeServiceForm.originalTitle !== payload.title) {
      setHomeServicePackagesDraft((prev) => {
        const next = { ...prev };
        if (next[homeServiceForm.originalTitle]) {
          next[payload.title] = next[homeServiceForm.originalTitle];
          delete next[homeServiceForm.originalTitle];
        }
        return next;
      });
    }

    setHomeServiceForm(defaultHomeServiceForm);
  };

  const handleDeleteHomeServiceDraft = (title) => {
    setHomeServicesDraft((prev) => prev.filter((item) => item.title !== title));
    setHomeServicePackagesDraft((prev) => {
      const next = { ...prev };
      delete next[title];
      return next;
    });
    setServicePackageForm((prev) => (prev.serviceTitle === title ? defaultServicePackageForm : prev));
  };

  const moveHomeService = (title, direction) => {
    setHomeServicesDraft((prev) => {
      const index = prev.findIndex((item) => item.title === title);
      if (index < 0) return prev;
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handlePackageFormInput = (event) => {
    const { name, value } = event.target;
    setServicePackageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditServicePackage = (serviceTitle, pack, index) => {
    setServicePackageForm({
      serviceTitle,
      name: pack.name || '',
      details: pack.details || '',
      cta: pack.cta || '',
      editIndex: index,
    });
  };

  const handleSaveServicePackageDraft = (event) => {
    event.preventDefault();
    if (!servicePackageForm.serviceTitle || !servicePackageForm.name.trim()) return;

    const payload = {
      name: servicePackageForm.name.trim(),
      details: servicePackageForm.details.trim(),
      cta: servicePackageForm.cta.trim(),
    };

    setHomeServicePackagesDraft((prev) => {
      const next = { ...prev };
      const existing = Array.isArray(next[servicePackageForm.serviceTitle]) ? [...next[servicePackageForm.serviceTitle]] : [];
      if (servicePackageForm.editIndex >= 0) existing[servicePackageForm.editIndex] = payload;
      else existing.push(payload);
      next[servicePackageForm.serviceTitle] = existing;
      return next;
    });
    setServicePackageForm((prev) => ({ ...defaultServicePackageForm, serviceTitle: prev.serviceTitle }));
  };

  const handleDeleteServicePackageDraft = (serviceTitle, index) => {
    setHomeServicePackagesDraft((prev) => {
      const next = { ...prev };
      const existing = Array.isArray(next[serviceTitle]) ? [...next[serviceTitle]] : [];
      existing.splice(index, 1);
      next[serviceTitle] = existing;
      return next;
    });
  };

  const moveServicePackage = (serviceTitle, index, direction) => {
    setHomeServicePackagesDraft((prev) => {
      const next = { ...prev };
      const existing = Array.isArray(next[serviceTitle]) ? [...next[serviceTitle]] : [];
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= existing.length) return prev;
      [existing[index], existing[nextIndex]] = [existing[nextIndex], existing[index]];
      next[serviceTitle] = existing;
      return next;
    });
  };

  const handleSaveHomeServices = async () => {
    clearNotices();
    setSaving(true);
    try {
      await Promise.all([
        upsertSiteSetting('home_services', homeServicesDraft),
        upsertSiteSetting('home_service_packages', homeServicePackagesDraft),
      ]);
      setStatusMessage('Home services saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save home services.');
    } finally {
      setSaving(false);
    }
  };

  const handleFaqInput = (event) => {
    const { name, value } = event.target;
    setFaqForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveFaqDraft = (event) => {
    event.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    const payload = { question: faqForm.question.trim(), answer: faqForm.answer.trim() };
    setFaqDraft((prev) => {
      const next = [...prev];
      if (faqForm.editIndex >= 0) next[faqForm.editIndex] = payload;
      else next.push(payload);
      return next;
    });
    setFaqForm(defaultFaqForm);
  };

  const handleEditFaqDraft = (faq, index) => {
    setFaqForm({
      question: faq.question || '',
      answer: faq.answer || '',
      editIndex: index,
    });
  };

  const handleDeleteFaqDraft = (index) => {
    setFaqDraft((prev) => prev.filter((_, i) => i !== index));
    if (faqForm.editIndex === index) setFaqForm(defaultFaqForm);
  };

  const moveFaq = (index, direction) => {
    setFaqDraft((prev) => {
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSaveFaqs = async () => {
    clearNotices();
    setSaving(true);
    try {
      await upsertSiteSetting('faqs', faqDraft);
      setStatusMessage('FAQs saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save FAQs.');
    } finally {
      setSaving(false);
    }
  };

  const handleHomeSkillInput = (event) => {
    const { name, value } = event.target;
    setHomeSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHomeSkillDraft = (event) => {
    event.preventDefault();
    if (!homeSkillForm.skill?.trim()) return;
    const payload = {
      skill: homeSkillForm.skill.trim(),
      percentage: Math.min(100, Math.max(0, parseInt(homeSkillForm.percentage, 10) || 0)),
      color: (homeSkillForm.color || '#888888').trim(),
    };
    setHomeSkillsDraft((prev) => {
      const next = [...prev];
      if (homeSkillForm.editIndex >= 0) next[homeSkillForm.editIndex] = payload;
      else next.push(payload);
      return next;
    });
    setHomeSkillForm(defaultHomeSkillForm);
  };

  const handleEditHomeSkill = (row, index) => {
    setHomeSkillForm({
      skill: row.skill || '',
      percentage: String(row.percentage ?? ''),
      color: row.color || '#61DAFB',
      editIndex: index,
    });
  };

  const handleDeleteHomeSkill = (index) => {
    setHomeSkillsDraft((prev) => prev.filter((_, i) => i !== index));
    if (homeSkillForm.editIndex === index) setHomeSkillForm(defaultHomeSkillForm);
  };

  const moveHomeSkill = (index, direction) => {
    setHomeSkillsDraft((prev) => {
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSaveHomeSkills = async () => {
    clearNotices();
    setSaving(true);
    try {
      await upsertSiteSetting('home_skills', homeSkillsDraft);
      setStatusMessage('Home skills saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save home skills.');
    } finally {
      setSaving(false);
    }
  };

  const handleHomeExpInput = (event) => {
    const { name, value } = event.target;
    setHomeExperienceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHomeExpDraft = (event) => {
    event.preventDefault();
    if (!homeExperienceForm.title?.trim() || !homeExperienceForm.company?.trim()) return;
    const achievements = (homeExperienceForm.achievementsText || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      title: homeExperienceForm.title.trim(),
      company: homeExperienceForm.company.trim(),
      years: homeExperienceForm.years?.trim() || '',
      description: homeExperienceForm.description?.trim() || '',
      achievements,
    };
    setHomeExperienceDraft((prev) => {
      const next = [...prev];
      if (homeExperienceForm.editIndex >= 0) next[homeExperienceForm.editIndex] = payload;
      else next.push(payload);
      return next;
    });
    setHomeExperienceForm(defaultHomeExpForm);
  };

  const handleEditHomeExp = (row, index) => {
    setHomeExperienceForm({
      title: row.title || '',
      company: row.company || '',
      years: row.years || '',
      description: row.description || '',
      achievementsText: Array.isArray(row.achievements) ? row.achievements.join('\n') : '',
      editIndex: index,
    });
  };

  const handleDeleteHomeExp = (index) => {
    setHomeExperienceDraft((prev) => prev.filter((_, i) => i !== index));
    if (homeExperienceForm.editIndex === index) setHomeExperienceForm(defaultHomeExpForm);
  };

  const moveHomeExp = (index, direction) => {
    setHomeExperienceDraft((prev) => {
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSaveHomeExperience = async () => {
    clearNotices();
    setSaving(true);
    try {
      await upsertSiteSetting('home_experience', homeExperienceDraft);
      setStatusMessage('Home experience saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save home experience.');
    } finally {
      setSaving(false);
    }
  };

  const handleHomeTestimonialInput = (event) => {
    const { name, value } = event.target;
    setHomeTestimonialForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHomeTestimonialDraft = (event) => {
    event.preventDefault();
    if (!homeTestimonialForm.quote?.trim() || !homeTestimonialForm.author?.trim()) return;
    const payload = {
      quote: homeTestimonialForm.quote.trim(),
      author: homeTestimonialForm.author.trim(),
      image: homeTestimonialForm.image?.trim() || '',
    };
    setHomeTestimonialsDraft((prev) => {
      const next = [...prev];
      if (homeTestimonialForm.editIndex >= 0) next[homeTestimonialForm.editIndex] = payload;
      else next.push(payload);
      return next;
    });
    setHomeTestimonialForm(defaultHomeTestimonialForm);
  };

  const handleEditHomeTestimonial = (row, index) => {
    setHomeTestimonialForm({
      quote: row.quote || '',
      author: row.author || '',
      image: row.image || '',
      editIndex: index,
    });
  };

  const handleDeleteHomeTestimonial = (index) => {
    setHomeTestimonialsDraft((prev) => prev.filter((_, i) => i !== index));
    if (homeTestimonialForm.editIndex === index) setHomeTestimonialForm(defaultHomeTestimonialForm);
  };

  const moveHomeTestimonial = (index, direction) => {
    setHomeTestimonialsDraft((prev) => {
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSaveHomeTestimonials = async () => {
    clearNotices();
    setSaving(true);
    try {
      await upsertSiteSetting('home_testimonials', homeTestimonialsDraft);
      setStatusMessage('Home testimonials saved.');
      await loadAll();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save testimonials.');
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
            {TAB_LABELS[tab] || tab}
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
            Use the fields below for day-to-day updates. Blog posts, projects, home services, FAQs, and home page sections each have their own tab.
          </p>
          <div className="admin-form-grid">
            <input name="full_name" placeholder="Display name" value={settingsForm.full_name} onChange={handleSettingsChange} />
            <input name="tagline" placeholder="Tagline" value={settingsForm.tagline} onChange={handleSettingsChange} />
            <input name="availability_badge" placeholder="Hero availability badge text" value={settingsForm.availability_badge} onChange={handleSettingsChange} />
            <input name="profile_picture" placeholder="Main hero profile image URL" value={settingsForm.profile_picture} onChange={handleSettingsChange} />
            <input name="secondary_profile_picture" placeholder="About / secondary image URL" value={settingsForm.secondary_profile_picture} onChange={handleSettingsChange} />
            <label className="admin-field-span2">
              Short bio (hero intro paragraph)
              <textarea name="about_short" rows={3} value={settingsForm.about_short} onChange={handleSettingsChange} placeholder="First paragraph under your name on the home page" />
            </label>
            <label className="admin-field-span2">
              Longer bio (About section on home)
              <textarea name="about_long" rows={5} value={settingsForm.about_long} onChange={handleSettingsChange} placeholder="Second paragraph in the About block" />
            </label>
            <label className="admin-field-span2">
              About page bio (separate from home bio)
              <textarea name="about_page_bio" rows={5} value={settingsForm.about_page_bio} onChange={handleSettingsChange} placeholder="Main bio text for the About page" />
            </label>
            <input name="email" placeholder="Display email" value={settingsForm.email} onChange={handleSettingsChange} />
            <input name="phone" placeholder="Display phone" value={settingsForm.phone} onChange={handleSettingsChange} />
            <input name="whatsapp" placeholder="WhatsApp link" value={settingsForm.whatsapp} onChange={handleSettingsChange} />
            <input name="address" placeholder="Address" value={settingsForm.address} onChange={handleSettingsChange} />
            <input name="linkedin" placeholder="LinkedIn URL" value={settingsForm.linkedin} onChange={handleSettingsChange} />
            <input name="github" placeholder="GitHub URL" value={settingsForm.github} onChange={handleSettingsChange} />
            <input name="cv_full" placeholder="General CV URL (PDF)" value={settingsForm.cv_full} onChange={handleSettingsChange} />
            <input name="cv_webDeveloper" placeholder="Web Developer CV URL (PDF)" value={settingsForm.cv_webDeveloper} onChange={handleSettingsChange} />
            <input name="cv_dataAnalyst" placeholder="Data Analyst CV URL (PDF)" value={settingsForm.cv_dataAnalyst} onChange={handleSettingsChange} />
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
            <input name="details_url" placeholder="details url (defaults to /case-studies/your-slug)" value={projectForm.details_url} onChange={handleProjectInput} />
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

      {activeTab === 'homeServices' && (
        <section className="admin-section">
          <h2>Home Service Manager</h2>
          <p className="admin-note">Manage homepage service cards and their dedicated service-page packages.</p>

          <h3 className="admin-subsection-title">Service Cards</h3>
          <form className="admin-form-grid home-services-form" onSubmit={handleSaveHomeServiceDraft}>
            <input name="title" required placeholder="Service title" value={homeServiceForm.title} onChange={handleHomeServiceInput} />
            <select name="iconKey" value={homeServiceForm.iconKey} onChange={handleHomeServiceInput}>
              {serviceIconOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
            <textarea name="description" placeholder="Service description" value={homeServiceForm.description} onChange={handleHomeServiceInput} />
            <textarea name="featuresText" placeholder="Features (comma separated)" value={homeServiceForm.featuresText} onChange={handleHomeServiceInput} />
            <button type="submit" className="admin-btn">{homeServiceForm.originalTitle ? 'Update service card' : 'Add service card'}</button>
          </form>

          <div className="admin-list">
            {homeServicesDraft.map((service) => (
              <article key={service.title} className="admin-card admin-home-service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p><strong>Features:</strong> {Array.isArray(service.features) ? service.features.join(', ') : '-'}</p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditHomeService(service)}>Edit</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeService(service.title, 'up')}>Move up</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeService(service.title, 'down')}>Move down</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteHomeServiceDraft(service.title)}>Delete</button>
                </div>
              </article>
            ))}
          </div>

          <h3 className="admin-subsection-title">Service Packages (for dedicated pages)</h3>
          <form className="admin-form-grid home-services-form" onSubmit={handleSaveServicePackageDraft}>
            <select name="serviceTitle" value={servicePackageForm.serviceTitle} onChange={handlePackageFormInput} required>
              <option value="">Select service</option>
              {homeServicesDraft.map((service) => (
                <option key={service.title} value={service.title}>{service.title}</option>
              ))}
            </select>
            <input name="name" required placeholder="Package name" value={servicePackageForm.name} onChange={handlePackageFormInput} />
            <textarea name="details" placeholder="Package details" value={servicePackageForm.details} onChange={handlePackageFormInput} />
            <input name="cta" placeholder="Button label (optional)" value={servicePackageForm.cta} onChange={handlePackageFormInput} />
            <button type="submit" className="admin-btn">{servicePackageForm.editIndex >= 0 ? 'Update package' : 'Add package'}</button>
          </form>

          <div className="admin-list">
            {homeServicesDraft.map((service) => {
              const packages = homeServicePackagesDraft?.[service.title] || [];
              return (
                <article key={`${service.title}-packages`} className="admin-card">
                  <h3>{service.title}</h3>
                  {packages.length === 0 && <p>No packages yet.</p>}
                  {packages.map((pack, index) => (
                    <div key={`${service.title}-${pack.name}-${index}`} className="admin-package-item">
                      <p><strong>{pack.name}</strong></p>
                      <p>{pack.details}</p>
                      <div className="inline-row">
                        <button type="button" className="admin-btn secondary" onClick={() => handleEditServicePackage(service.title, pack, index)}>Edit</button>
                      <button type="button" className="admin-btn secondary" onClick={() => moveServicePackage(service.title, index, 'up')}>Up</button>
                      <button type="button" className="admin-btn secondary" onClick={() => moveServicePackage(service.title, index, 'down')}>Down</button>
                        <button type="button" className="admin-btn danger" onClick={() => handleDeleteServicePackageDraft(service.title, index)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </article>
              );
            })}
          </div>

          <div className="admin-home-services-actions">
            <button type="button" className="admin-btn" disabled={saving} onClick={handleSaveHomeServices}>Publish Home Services</button>
          </div>
        </section>
      )}

      {activeTab === 'faqs' && (
        <section className="admin-section">
          <h2>FAQ Manager</h2>
          <p className="admin-note">Manage FAQ questions and answers directly from Admin.</p>
          <form className="admin-form-grid home-services-form" onSubmit={handleSaveFaqDraft}>
            <input
              name="question"
              required
              placeholder="Question"
              value={faqForm.question}
              onChange={handleFaqInput}
            />
            <textarea
              name="answer"
              required
              placeholder="Answer"
              value={faqForm.answer}
              onChange={handleFaqInput}
              rows={4}
            />
            <button type="submit" className="admin-btn">{faqForm.editIndex >= 0 ? 'Update FAQ' : 'Add FAQ'}</button>
          </form>
          <div className="admin-list">
            {faqDraft.map((faq, index) => (
              <article key={`${faq.question}-${index}`} className="admin-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditFaqDraft(faq, index)}>Edit</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveFaq(index, 'up')}>Up</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveFaq(index, 'down')}>Down</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteFaqDraft(index)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-home-services-actions">
            <button type="button" className="admin-btn" disabled={saving} onClick={handleSaveFaqs}>Publish FAQs</button>
          </div>
        </section>
      )}

      {activeTab === 'homePage' && (
        <section className="admin-section">
          <h2>Home page sections</h2>
          <p className="admin-note">
            Fill these lists and click Publish on each block. The home page shows Featured Projects from the Projects tab (published), Latest Insights from Blog posts,
            and Skills / Experience / Testimonials from here once published.
          </p>

          <h3>Skills (progress rings)</h3>
          <form className="admin-form-grid home-services-form" onSubmit={handleSaveHomeSkillDraft}>
            <input name="skill" placeholder="Skill name (e.g. React)" value={homeSkillForm.skill} onChange={handleHomeSkillInput} />
            <input name="percentage" type="number" min="0" max="100" placeholder="%" value={homeSkillForm.percentage} onChange={handleHomeSkillInput} />
            <input name="color" placeholder="Color (#hex)" value={homeSkillForm.color} onChange={handleHomeSkillInput} />
            <button type="submit" className="admin-btn">{homeSkillForm.editIndex >= 0 ? 'Update skill' : 'Add skill'}</button>
          </form>
          <div className="admin-list">
            {homeSkillsDraft.map((row, index) => (
              <article key={`${row.skill}-${index}`} className="admin-card">
                <p><strong>{row.skill}</strong> — {row.percentage}% ({row.color})</p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditHomeSkill(row, index)}>Edit</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeSkill(index, 'up')}>Up</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeSkill(index, 'down')}>Down</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteHomeSkill(index)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-home-services-actions">
            <button type="button" className="admin-btn" disabled={saving} onClick={handleSaveHomeSkills}>Publish skills</button>
          </div>

          <h3>Experience (timeline)</h3>
          <form className="admin-form-grid home-services-form" onSubmit={handleSaveHomeExpDraft}>
            <input name="title" placeholder="Job title" value={homeExperienceForm.title} onChange={handleHomeExpInput} />
            <input name="company" placeholder="Company" value={homeExperienceForm.company} onChange={handleHomeExpInput} />
            <input name="years" placeholder="Years (e.g. 2022 - Present)" value={homeExperienceForm.years} onChange={handleHomeExpInput} />
            <textarea name="description" placeholder="Role description" rows={3} value={homeExperienceForm.description} onChange={handleHomeExpInput} />
            <textarea name="achievementsText" placeholder={'Achievements (one per line)'} rows={4} value={homeExperienceForm.achievementsText} onChange={handleHomeExpInput} />
            <button type="submit" className="admin-btn">{homeExperienceForm.editIndex >= 0 ? 'Update role' : 'Add role'}</button>
          </form>
          <div className="admin-list">
            {homeExperienceDraft.map((row, index) => (
              <article key={`${row.title}-${index}`} className="admin-card">
                <h3>{row.title} · {row.company}</h3>
                <p>{row.years}</p>
                <p>{row.description}</p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditHomeExp(row, index)}>Edit</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeExp(index, 'up')}>Up</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeExp(index, 'down')}>Down</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteHomeExp(index)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-home-services-actions">
            <button type="button" className="admin-btn" disabled={saving} onClick={handleSaveHomeExperience}>Publish experience</button>
          </div>

          <h3>Testimonials</h3>
          <form className="admin-form-grid home-services-form" onSubmit={handleSaveHomeTestimonialDraft}>
            <textarea name="quote" required placeholder="Quote" rows={4} value={homeTestimonialForm.quote} onChange={handleHomeTestimonialInput} />
            <input name="author" required placeholder="Author name & role" value={homeTestimonialForm.author} onChange={handleHomeTestimonialInput} />
            <input name="image" placeholder="Photo URL (optional)" value={homeTestimonialForm.image} onChange={handleHomeTestimonialInput} />
            <button type="submit" className="admin-btn">{homeTestimonialForm.editIndex >= 0 ? 'Update testimonial' : 'Add testimonial'}</button>
          </form>
          <div className="admin-list">
            {homeTestimonialsDraft.map((row, index) => (
              <article key={`${row.author}-${index}`} className="admin-card">
                <p>{row.quote}</p>
                <p><strong>{row.author}</strong></p>
                <div className="inline-row">
                  <button type="button" className="admin-btn secondary" onClick={() => handleEditHomeTestimonial(row, index)}>Edit</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeTestimonial(index, 'up')}>Up</button>
                  <button type="button" className="admin-btn secondary" onClick={() => moveHomeTestimonial(index, 'down')}>Down</button>
                  <button type="button" className="admin-btn danger" onClick={() => handleDeleteHomeTestimonial(index)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="admin-home-services-actions">
            <button type="button" className="admin-btn" disabled={saving} onClick={handleSaveHomeTestimonials}>Publish testimonials</button>
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

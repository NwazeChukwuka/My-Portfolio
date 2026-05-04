import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import personalData from '../data/personalData';
import { supabase } from '../lib/supabaseClient';
import { serviceIconMap } from '../lib/serviceIcons';
import { getBlogPosts, getProjects } from '../lib/portfolioApi';
import {
  mapBlogPostRow,
  mapProjectRow,
  filterProjectsForWebDev,
  filterProjectsForDataAnalyst,
} from '../lib/contentMappers';

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const merged = { ...base };
  Object.keys(override).forEach((key) => {
    const baseValue = base[key];
    const overrideValue = override[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      merged[key] = deepMerge(baseValue, overrideValue);
    } else {
      merged[key] = overrideValue;
    }
  });
  return merged;
}

let cachedSettingsMap = null;
let settingsPromise = null;

let cachedBlogRows = null;
let cachedProjectRows = null;
let remoteTablesPromise = null;

function normalizeGeneral(gen) {
  if (!gen || typeof gen !== 'object') return { ...personalData.general };
  const shortBio = gen.about_short_bio || gen.aboutShortBio || gen.aboutMe?.[0] || personalData.general.aboutMe?.[0] || '';
  const longBio = gen.about_long_bio || gen.aboutLongBio || gen.aboutMe?.[1] || personalData.general.aboutMe?.[1] || '';
  return {
    ...gen,
    fullName: gen.fullName || gen.full_name || personalData.general.fullName,
    profilePicture: gen.profilePicture || gen.profile_picture || '/assets/Me 1.webp',
    secondaryProfilePicture:
      gen.secondaryProfilePicture || gen.secondary_profile_picture || '/assets/Me 2.webp',
    aboutMe: [shortBio, longBio],
    aboutPageBio:
      gen.aboutPageBio || gen.about_page_bio || [shortBio, longBio].filter(Boolean).join(' '),
  };
}

const PortfolioContentContext = createContext(personalData);

export const PortfolioContentProvider = ({ children }) => {
  const [settingsMap, setSettingsMap] = useState(cachedSettingsMap || {});
  const [blogRows, setBlogRows] = useState(cachedBlogRows || []);
  const [projectRows, setProjectRows] = useState(cachedProjectRows || []);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      if (!supabase) return;
      if (cachedSettingsMap) {
        setSettingsMap(cachedSettingsMap);
        return;
      }

      if (!settingsPromise) {
        settingsPromise = supabase.from('site_settings').select('key, value');
      }

      const { data, error } = await settingsPromise;
      if (error || !mounted || !Array.isArray(data)) return;
      const map = {};
      data.forEach((item) => {
        map[item.key] = item.value || {};
      });
      cachedSettingsMap = map;
      setSettingsMap(map);
    };

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadRemoteTables = async () => {
      if (!supabase) return;

      if (cachedBlogRows && cachedProjectRows) {
        setBlogRows(cachedBlogRows);
        setProjectRows(cachedProjectRows);
        return;
      }

      if (!remoteTablesPromise) {
        remoteTablesPromise = Promise.all([getBlogPosts(), getProjects()]);
      }

      try {
        const [blogs, projects] = await remoteTablesPromise;
        if (!mounted) return;
        cachedBlogRows = Array.isArray(blogs) ? blogs : [];
        cachedProjectRows = Array.isArray(projects) ? projects : [];
        setBlogRows(cachedBlogRows);
        setProjectRows(cachedProjectRows);
      } catch {
        if (!mounted) return;
        cachedBlogRows = [];
        cachedProjectRows = [];
        setBlogRows([]);
        setProjectRows([]);
      }
    };

    loadRemoteTables();
    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    const merged = deepMerge(personalData, {});

    if (isPlainObject(settingsMap.general)) {
      merged.general = deepMerge(merged.general || {}, settingsMap.general);
    }

    if (isPlainObject(settingsMap.contact)) {
      merged.contact = deepMerge(merged.contact || {}, settingsMap.contact);
    }

    if (isPlainObject(settingsMap.cvs)) {
      merged.general = merged.general || {};
      merged.general.cvs = deepMerge(merged.general.cvs || {}, settingsMap.cvs);
    }

    if (Array.isArray(settingsMap.home_services)) {
      merged.homeServices = settingsMap.home_services;
    }

    if (isPlainObject(settingsMap.home_service_packages)) {
      merged.homeServicePackages = settingsMap.home_service_packages;
    }

    if (Array.isArray(settingsMap.faqs)) {
      merged.faqs = settingsMap.faqs;
    }

    if (Array.isArray(settingsMap.home_skills)) {
      merged.homeSkills = settingsMap.home_skills;
    }
    if (Array.isArray(settingsMap.home_experience)) {
      merged.homeExperience = settingsMap.home_experience;
    }
    if (Array.isArray(settingsMap.home_testimonials)) {
      merged.homeTestimonials = settingsMap.home_testimonials;
    }

    if (Array.isArray(merged.homeServices)) {
      merged.homeServices = merged.homeServices.map((service) => {
        const iconFromKey = serviceIconMap[service.iconKey];
        return {
          ...service,
          icon: service.icon || iconFromKey || serviceIconMap.FaBriefcase,
        };
      });
    }

    merged.general = normalizeGeneral(merged.general);

    const projectsFromDb = (projectRows || [])
      .map(mapProjectRow)
      .filter(Boolean)
      .sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    merged.projectsFromDb = projectsFromDb;

    merged.webDeveloper = {
      ...(merged.webDeveloper || {}),
      projects: filterProjectsForWebDev(projectsFromDb),
    };
    merged.dataAnalyst = {
      ...(merged.dataAnalyst || {}),
      projects: filterProjectsForDataAnalyst(projectsFromDb),
    };

    const blogArticlesList = (blogRows || [])
      .map(mapBlogPostRow)
      .filter(Boolean)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    merged.blogArticlesList = blogArticlesList;

    merged.blogPostsSummaryForAssistant = blogArticlesList.slice(0, 20).map((blog) => ({
      slug: blog.slug,
      title: blog.title,
      category: blog.category,
      tags: blog.tags,
      snippet: blog.snippet,
    }));

    return merged;
  }, [settingsMap, blogRows, projectRows]);

  return createElement(PortfolioContentContext.Provider, { value: content }, children);
};

const usePortfolioContent = () => useContext(PortfolioContentContext);

export default usePortfolioContent;

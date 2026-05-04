import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePortfolioContent from '../hooks/usePortfolioContent';
import { getProjects } from '../lib/portfolioApi';
import './CaseStudy.css';

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return value.split(',').map((v) => v.trim()).filter(Boolean);
  return [];
};

const CaseStudy = () => {
  const { slug } = useParams();
  const content = usePortfolioContent();
  const [remoteProjects, setRemoteProjects] = useState([]);
  const [loadingRemote, setLoadingRemote] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadRemote = async () => {
      try {
        const projects = await getProjects();
        if (!mounted) return;
        setRemoteProjects(Array.isArray(projects) ? projects : []);
      } catch (_error) {
        if (mounted) {
          setRemoteProjects([]);
        }
      } finally {
        if (mounted) setLoadingRemote(false);
      }
    };
    loadRemote();
    return () => { mounted = false; };
  }, []);

  const staticProjects = useMemo(() => {
    const list = [
      ...(content.projectsFromDb || []),
      ...(content.homePortfolioPreviews || []),
    ];
    return list.map((project) => ({
      ...project,
      slug: project.slug || slugify(project.title || project.id),
      image_url: project.image,
      summary: project.summary || project.description || '',
    }));
  }, [content]);

  const project = useMemo(() => {
    const fromRemote = remoteProjects.find((item) => item.slug === slug);
    if (fromRemote) return fromRemote;
    return staticProjects.find((item) => item.slug === slug || item.id === slug);
  }, [remoteProjects, staticProjects, slug]);

  if (!project && !loadingRemote) {
    return (
      <section className="case-study-page common-section">
        <div className="case-study-container">
          <h1>Case study not found</h1>
          <p>This project does not have a case study yet.</p>
          <Link to="/portfolio">Back to portfolio</Link>
        </div>
      </section>
    );
  }

  const title = project?.title || 'Case Study';
  const coverImage = project?.image_url || project?.image || '/assets/Me 2.webp';
  const category = project?.category || 'Project';
  const summary = project?.summary || project?.description || '';
  const challenge = project?.summary || 'Challenge details can be managed from Admin -> Projects.';
  const approach = project?.description || '';
  const outcome = project?.description || 'Outcome details can be managed from Admin -> Projects.';
  const tools = asArray(project?.tools);
  const gallery = asArray(project?.gallery);

  return (
    <div className="case-study-page">
      <section className="case-study-hero common-section">
        <div className="case-study-container" data-aos="fade-up">
          <span className="case-study-category">{category}</span>
          <h1>{title}</h1>
          <p>{summary}</p>
          <img src={coverImage} alt={title} className="case-study-cover" loading="lazy" decoding="async" />
        </div>
      </section>

      <section className="case-study-body common-section">
        <div className="case-study-container">
          <article className="case-study-block card" data-aos="fade-up">
            <h2>Challenge</h2>
            <p>{challenge}</p>
          </article>
          <article className="case-study-block card" data-aos="fade-up" data-aos-delay="80">
            <h2>Approach</h2>
            <p>{approach}</p>
          </article>
          <article className="case-study-block card" data-aos="fade-up" data-aos-delay="120">
            <h2>Outcome</h2>
            <p>{outcome}</p>
          </article>

          {tools.length > 0 && (
            <article className="case-study-block card" data-aos="fade-up" data-aos-delay="160">
              <h2>Tools & Stack</h2>
              <ul className="case-study-tools">
                {tools.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
            </article>
          )}

          {gallery.length > 0 && (
            <article className="case-study-block card" data-aos="fade-up" data-aos-delay="200">
              <h2>Gallery</h2>
              <div className="case-study-gallery">
                {gallery.map((src, index) => (
                  <img key={`${src}-${index}`} src={src} alt={`${title} screenshot ${index + 1}`} loading="lazy" decoding="async" />
                ))}
              </div>
            </article>
          )}

          <div className="case-study-actions" data-aos="fade-up">
            <Link to="/portfolio">Back to Portfolio</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudy;

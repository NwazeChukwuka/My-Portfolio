// src/pages/BlogArticleDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { supabase } from '../lib/supabaseClient';
import { getBlogPostBySlug } from '../lib/portfolioApi';
import { mapBlogPostRow } from '../lib/contentMappers';

import './BlogArticleDetail.css';

const BlogArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
    AOS.refresh();
  }, [slug]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        if (!supabase) {
          setArticle(null);
          return;
        }
        const row = await getBlogPostBySlug(slug);
        const mapped = mapBlogPostRow(row);
        if (mounted) setArticle(mapped && row?.status !== 'draft' ? mapped : null);
      } catch {
        if (mounted) setArticle(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-detail-page common-section">
        <p data-aos="fade-up">Loading article…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="blog-detail-page not-found common-section">
        <h1 data-aos="fade-up">Article Not Found</h1>
        <p data-aos="fade-up" data-aos-delay="100">
          This post is not available. Add it in Admin.
        </p>
        <Link to="/blog" className="back-to-blog-btn" data-aos="fade-up" data-aos-delay="200">
          ← Back to all articles
        </Link>
      </div>
    );
  }

  const renderContent = (contentBlock, index) => {
    switch (contentBlock.type) {
      case 'paragraph':
        return <p key={index} data-aos="fade-up">{contentBlock.text}</p>;
      case 'heading':
        if (contentBlock.level === 2) {
          return <h2 key={index} data-aos="fade-up" data-aos-delay="100">{contentBlock.text}</h2>;
        }
        if (contentBlock.level === 3) {
          return <h3 key={index} data-aos="fade-up" data-aos-delay="100">{contentBlock.text}</h3>;
        }
        return null;
      case 'image':
        return (
          <figure key={index} data-aos="zoom-in">
            <img src={contentBlock.src} alt={contentBlock.alt} className="article-image" />
            {contentBlock.caption && <figcaption>{contentBlock.caption}</figcaption>}
          </figure>
        );
      case 'list':
        return (
          <ul key={index} data-aos="fade-up" data-aos-delay="150">
            {contentBlock.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
      case 'code':
        return (
          <div key={index} className="code-block-container" data-aos="fade-up" data-aos-delay="200">
            <pre>
              <code>{contentBlock.code}</code>
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  const hasStructuredContent = Array.isArray(article.content);

  return (
    <div className="blog-detail-page">
      <article className="blog-article-content common-section">
        <header className="article-header">
          <img
            src={article.image}
            alt={article.altText || article.title}
            className="article-hero-image"
            data-aos="zoom-out"
          />
          <h1 className="article-title" data-aos="fade-up" data-aos-delay="200">{article.title}</h1>
          <div className="article-meta" data-aos="fade-up" data-aos-delay="300">
            <span>By {article.author}</span>
            |
            <span>
              {' '}
              {article.date
                ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : ''}
            </span>
            |
            <span>
              {' '}
              Category: <Link to={`/blog?category=${encodeURIComponent(article.category)}`}>{article.category}</Link>
            </span>
          </div>
          <div className="article-tags" data-aos="fade-up" data-aos-delay="400">
            {(article.tags || []).map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </header>

        <section className="article-body">
          {hasStructuredContent ? (
            article.content.map(renderContent)
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
        </section>

        <footer className="article-footer" data-aos="fade-up" data-aos-delay="200">
          <Link to="/blog" className="back-to-blog-btn">
            ← Back to all articles
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default BlogArticleDetail;

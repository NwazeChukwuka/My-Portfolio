// src/pages/BlogArticleDetail.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import blog articles data
// Ensure this path is correct relative to BlogArticleDetail.jsx (e.g., ../data/blogArticles.js)
import blogArticles from '../data/blogArticles';

import './BlogArticleDetail.css'; // Page-specific styles for Blog Article Detail

/**
 * BlogArticleDetail Component
 * Displays the full content of a single blog article.
 * Article ID (slug) is retrieved from the URL parameters.
 */
const BlogArticleDetail = () => {
  // Get the article slug from the URL parameters.
  // This 'slug' variable must match the parameter name defined in your App.jsx Route:
  // e.g., <Route path="/blog/:slug" element={<BlogArticleDetail />} />
  const { slug } = useParams();

  // Support both slug-based and legacy id-based URLs.
  const article = blogArticles.find((art) => art.slug === slug || art.id === slug);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    // Ensure the browser scrolls to the very top when a new article loads or is accessed directly.
    window.scrollTo(0, 0);
    AOS.refresh();
  }, [slug]); // Effect re-runs whenever the 'slug' changes (i.e., navigating to a different article)

  // If no article is found matching the URL slug, display a "Not Found" message.
  if (!article) {
    return (
      <div className="blog-detail-page not-found common-section">
        <h1 data-aos="fade-up">Article Not Found</h1>
        <p data-aos="fade-up" data-aos-delay="100">The blog post you are looking for does not exist or has been moved.</p>
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
        // Renders h2 or h3 based on the 'level' property of the content block.
        if (contentBlock.level === 2) {
          return <h2 key={index} data-aos="fade-up" data-aos-delay="100">{contentBlock.text}</h2>;
        }
        if (contentBlock.level === 3) {
          return <h3 key={index} data-aos="fade-up" data-aos-delay="100">{contentBlock.text}</h3>;
        }
        return null; // For unsupported heading levels, render nothing
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
              // Using dangerouslySetInnerHTML to allow basic HTML (like <strong> or <em>) in list items.
              // Use with caution and ensure content is trusted to prevent XSS attacks.
              <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
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
        return null; // Fallback for any content blocks with unhandled 'type' values
    }
  };

  const hasStructuredContent = Array.isArray(article.content);

  return (
    <div className="blog-detail-page">
      <article className="blog-article-content common-section">
        {/* Article Header Section */}
        <header className="article-header">
          {/* Hero image for the article */}
          <img
            src={article.image}
            alt={article.altText || article.title} // Fallback alt text to title if not provided
            className="article-hero-image"
            data-aos="zoom-out" // AOS animation
          />
          {/* Article title */}
          <h1 className="article-title" data-aos="fade-up" data-aos-delay="200">{article.title}</h1>
          {/* Article metadata: author, publication date, and category */}
          <div className="article-meta" data-aos="fade-up" data-aos-delay="300">
            <span>By {article.author}</span> |
            {/* Format date for readability */}
            <span> {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> |
            {/* Link to the blog list, potentially filtered by this article's category */}
            <span> Category: <Link to={`/blog?category=${article.category}`}>{article.category}</Link></span>
          </div>
          {/* Article tags */}
          <div className="article-tags" data-aos="fade-up" data-aos-delay="400">
            {article.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* Main body of the article, rendered dynamically by mapping over content blocks */}
        <section className="article-body">
          {hasStructuredContent ? (
            article.content.map(renderContent)
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
        </section>

        {/* Article Footer Section */}
        <footer className="article-footer" data-aos="fade-up" data-aos-delay="200">
          {/* Button/Link to navigate back to the main blog articles list */}
          <Link to="/blog" className="back-to-blog-btn">
            ← Back to all articles
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default BlogArticleDetail;
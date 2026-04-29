// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import blog articles data
import blogArticles from '../data/blogArticles';

// Import UI Components (or create a new BlogCard if needed, but ProjectCard works for now)
import ProjectCard from '../components/UI/ProjectCard'; // Re-using ProjectCard for blog previews

import './Blog.css'; // Page-specific styles for Blog List

/**
 * Blog List Page Component
 * Displays a list of all blog articles with filtering capabilities.
 */
const Blog = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0); // Ensure scroll to top on page load
  }, []);

  // Extract unique categories from blog articles for filtering
  const categories = ['All', ...new Set(blogArticles.map(article => article.category))];

  const [filter, setFilter] = useState('All');
  const [filteredArticles, setFilteredArticles] = useState(blogArticles);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredArticles(blogArticles);
    } else {
      setFilteredArticles(blogArticles.filter(article => article.category === filter));
    }
    AOS.refreshHard(); // Re-initialize AOS on filter change
  }, [filter]);

  return (
    <div className="blog-page">
      {/* --- Page Hero/Banner Section --- */}
      <section className="blog-hero-section">
        <div className="blog-hero-content" data-aos="fade-up">
          <h1 className="page-title">My Insights & Articles</h1>
          <p className="page-subtitle">Sharing Knowledge Across My Diverse Expertise</p>
        </div>
      </section>

      {/* --- Filter Section --- */}
      <section className="blog-filter-section common-section">
        <div className="filter-buttons" data-aos="fade-up">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`filter-button ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- Blog Articles Grid --- */}
      <section className="blog-articles-grid common-section">
        {filteredArticles.length > 0 ? (
          <div className="articles-grid-container">
            {filteredArticles.map((article, index) => (
              <ProjectCard // Re-using ProjectCard structure for blog articles
                key={article.id}
                image={article.image}
                title={article.title}
                category={`${article.category} | ${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                description={article.snippet}
                detailsLink={`/blog/${article.slug}`} // Link to the specific article detail page
                aos="fade-up"
                aosDelay={index % 3 * 100}
              />
            ))}
          </div>
        ) : (
          <p className="no-articles-message" data-aos="fade-up">No articles found for this category.</p>
        )}
      </section>
    </div>
  );
};

export default Blog;
// src/pages/Blog.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import usePortfolioContent from '../hooks/usePortfolioContent';
import ProjectCard from '../components/UI/ProjectCard';

import './Blog.css';

const Blog = () => {
  const { blogArticlesList = [] } = usePortfolioContent();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(blogArticlesList.map((article) => article.category).filter(Boolean))],
    [blogArticlesList],
  );

  const [filter, setFilter] = useState('All');
  const [filteredArticles, setFilteredArticles] = useState(blogArticlesList);

  useEffect(() => {
    setFilteredArticles(
      filter === 'All'
        ? blogArticlesList
        : blogArticlesList.filter((article) => article.category === filter),
    );
  }, [filter, blogArticlesList]);

  useEffect(() => {
    AOS.refreshHard();
  }, [filter, filteredArticles]);

  return (
    <div className="blog-page">
      <section className="blog-hero-section">
        <div className="blog-hero-content" data-aos="fade-up">
          <h1 className="page-title">My Insights & Articles</h1>
          <p className="page-subtitle">Sharing Knowledge Across My Diverse Expertise</p>
        </div>
      </section>

      <section className="blog-filter-section common-section">
        <div className="filter-buttons" data-aos="fade-up">
          {categories.map((cat, index) => (
            <button
              key={index}
              type="button"
              className={`filter-button ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="blog-articles-grid common-section">
        {filteredArticles.length > 0 ? (
          <div className="articles-grid-container">
            {filteredArticles.map((article, index) => (
              <ProjectCard
                key={article.id || article.slug}
                image={article.image}
                title={article.title}
                category={`${article.category} | ${article.date ? new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}`}
                description={article.snippet}
                detailsLink={`/blog/${article.slug}`}
                aos="fade-up"
                aosDelay={(index % 3) * 100}
              />
            ))}
          </div>
        ) : (
          <p className="no-articles-message" data-aos="fade-up">
            No articles yet. Add blog posts in Admin.
          </p>
        )}
      </section>
    </div>
  );
};

export default Blog;

-- 02_seed_data.sql
-- Run this after 01_schema_and_policies.sql.
-- Seed data is safe to rerun due to ON CONFLICT.

-- Optional: promote one existing auth user to admin
-- Replace with your real login email.
update public.profiles
set role = 'admin', full_name = coalesce(full_name, 'Mazi Chukwuka')
where email = 'mazichukwuka@gmail.com';

-- Site settings
insert into public.site_settings (key, value)
values
  ('general', jsonb_build_object(
    'full_name', 'Mazi Chukwuka',
    'tagline', 'Full-Stack Developer & Data Analyst',
    'profile_picture', '/assets/Me 1.webp',
    'availability_badge', 'Open to collaborations and new projects'
  )),
  ('contact', jsonb_build_object(
    'email', 'mazichukwuka@gmail.com',
    'phone', '+2349046049655',
    'whatsapp', 'https://wa.me/2349046049655',
    'address', 'Port Harcourt, Rivers State, Nigeria',
    'linkedin', 'https://www.linkedin.com/in/mazichukwuka',
    'github', 'https://github.com/mazichukwuka'
  )),
  ('cvs', jsonb_build_object(
    'full', '/assets/cvs/mazi-full-cv.pdf',
    'webDeveloper', '/assets/cvs/mazi-web-developer-cv.pdf',
    'dataAnalyst', '/assets/cvs/mazi-data-analyst-cv.pdf'
  ))
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Projects seed
insert into public.projects (slug, title, category, summary, description, image_url, details_url, is_featured, sort_order, status)
values
  (
    'cross-disciplinary-digital-transformation',
    'Cross-Disciplinary Digital Transformation Project',
    'Consulting',
    'A comprehensive project leveraging accounting, data analysis, and web development.',
    'Digitalized a small business operation by combining financial process design, analytics dashboards, and custom web tools.',
    '/assets/general/cross-disciplinary-project.jpg',
    '/portfolio',
    true,
    10,
    'published'
  ),
  (
    'ecommerce-platform-redesign',
    'E-commerce Platform Redesign',
    'Full-Stack Development',
    'Responsive e-commerce platform with modern UX.',
    'Built with modern frontend patterns and robust backend APIs for scalable transactions and admin operations.',
    '/assets/webdev/e-commerce-site.jpg',
    '/portfolio',
    true,
    20,
    'published'
  ),
  (
    'customer-churn-prediction-model',
    'Customer Churn Prediction Model',
    'Predictive Analytics',
    'ML model for churn risk scoring.',
    'Developed and operationalized a churn model to improve retention planning and campaign targeting.',
    '/assets/dataanalyst/sales-analysis.jpg',
    '/portfolio',
    true,
    30,
    'published'
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  description = excluded.description,
  image_url = excluded.image_url,
  details_url = excluded.details_url,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

-- Blog seed
insert into public.blog_posts (slug, title, snippet, content_html, category, tags, cover_image_url, published_at, author, read_time, status)
values
  (
    '5-common-mistakes-business-financial-reports',
    '5 Common Mistakes in Business Financial Reports (And How to Avoid Them)',
    'Learn the most frequent errors in financial reporting and practical ways to avoid them.',
    '<h2>Introduction</h2><p>Financial reports are foundational to business decisions...</p>',
    'Accounting',
    array['financial reporting','accounting','auditing'],
    '/assets/blog/ifrs-16.jpg',
    '2025-07-20',
    'Mazi Chukwuka',
    '6 min read',
    'published'
  ),
  (
    'beginners-guide-excel-data-analysis',
    'Beginner''s Guide to Excel for Data Analysis',
    'A practical starter guide to cleaning, analyzing, and visualizing data with Excel.',
    '<h2>Why Excel Still Matters</h2><p>Excel remains one of the most practical tools...</p>',
    'Data Analysis',
    array['excel','data analysis','beginners'],
    '/assets/blog/data-viz.jpg',
    '2025-07-15',
    'Mazi Chukwuka',
    '7 min read',
    'published'
  ),
  (
    'how-i-built-first-web-app-gomatrix',
    'How I Built My First Web App for GoMatrix Academy',
    'A technical walkthrough of architecture, trade-offs, and lessons learned.',
    '<h2>Project Background</h2><p>This article covers the stack and implementation journey...</p>',
    'Web Development',
    array['react','node.js','web development'],
    '/assets/blog/react-hooks.jpg',
    '2025-07-10',
    'Mazi Chukwuka',
    '8 min read',
    'published'
  )
on conflict (slug) do update set
  title = excluded.title,
  snippet = excluded.snippet,
  content_html = excluded.content_html,
  category = excluded.category,
  tags = excluded.tags,
  cover_image_url = excluded.cover_image_url,
  published_at = excluded.published_at,
  author = excluded.author,
  read_time = excluded.read_time,
  status = excluded.status,
  updated_at = now();

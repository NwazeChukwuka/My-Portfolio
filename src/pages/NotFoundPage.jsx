import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="common-section" style={{ textAlign: 'center' }}>
    <h1>404</h1>
    <p>The page you requested does not exist.</p>
    <Link to="/">Go back home</Link>
  </section>
);

export default NotFoundPage;

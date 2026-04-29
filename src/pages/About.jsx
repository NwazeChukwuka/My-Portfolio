import React, { useEffect } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import usePortfolioContent from '../hooks/usePortfolioContent';
import CircularProgressBar from '../components/UI/CircularProgressBar';
import './About.css';

const About = () => {
  const personalData = usePortfolioContent();
  const { general = {} } = personalData;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-out-cubic',
      offset: 40,
    });
    AOS.refreshHard();
    window.scrollTo(0, 0);
  }, []);

  const aboutParagraph = general.aboutMe?.[0] || '';
  const summaryParagraph = general.aboutMe?.[1] || '';

  const trustedBrands = personalData.trustedBrands || ['LOGOIPSUM', 'FLASH', 'SNOWFLAKE', 'PROLINE'];
  const educationItems = personalData.aboutEducation || [
    { title: 'MSc Accounting', institution: 'Ignatius Ajuru University of Education', years: '' },
    { title: 'BSc Accounting', institution: 'Ignatius Ajuru University of Education', years: '' },
  ];
  const qualificationItems = personalData.aboutQualifications || [
    { title: 'Chartered Accountant (ICAN)', institution: 'Institute of Chartered Accountants of Nigeria', years: '' },
    { title: 'National Institute of Management (Chartered)', institution: 'NIM', years: '' },
    { title: 'Chartered Institute of Customer Relationship Management (CICRM)', institution: 'CICRM', years: '' },
  ];
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Me.</h1>
        <p>{aboutParagraph}</p>
        <p>{summaryParagraph}</p>
      </section>

      <section className="brands-strip" aria-label="Trusted brands">
        <span className="brands-label" data-aos="fade-up">Worked with global brands</span>
        <div className="brand-pills">
          {trustedBrands.map((brand, index) => (
            <div key={brand} className="brand-pill" data-aos="fade-up" data-aos-delay={index * 80}>
              <FaGlobeAfrica className="brand-pill-icon" />
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-career-section common-section">
        <div className="about-career-block">
          <h2 className="about-career-title" data-aos="fade-up">Education</h2>
          <div className="about-career-timeline">
            {educationItems.map((item, index) => (
              <div className="about-career-item" key={`${item.title}-${item.years || index}`} data-aos="fade-up" data-aos-delay={index * 120 + 50}>
                <div className="about-career-dot"></div>
                <div className="about-career-content card">
                  <h3>{item.title}</h3>
                  <p>{item.institution}</p>
                  {item.years ? <small>{item.years}</small> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-career-block">
          <h2 className="about-career-title" data-aos="fade-up">Professional Qualifications</h2>
          <div className="about-career-timeline">
            {qualificationItems.map((item, index) => (
              <div className="about-career-item" key={`${item.title}-${item.years || index}`} data-aos="fade-up" data-aos-delay={index * 120 + 50}>
                <div className="about-career-dot"></div>
                <div className="about-career-content card">
                  <h3>{item.title}</h3>
                  <p>{item.institution}</p>
                  {item.years ? <small>{item.years}</small> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-career-block">
          <h2 className="about-career-title" data-aos="fade-up">Experience</h2>
          <div className="about-career-timeline">
            {(personalData.homeExperience || []).map((item, index) => (
              <div
                className="about-career-item"
                key={`${item.title}-${item.years}`}
                data-aos="fade-up"
                data-aos-delay={index * 120 + 50}
              >
                <div className="about-career-dot"></div>
                <div className="about-career-content card">
                  <h3>{item.title}</h3>
                  <p>{item.company}</p>
                  <small>{item.years}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="skills-strip common-section">
        <h2 data-aos="fade-up">Coding Skills</h2>
        <div className="about-skills-grid">
          {(personalData.homeSkills || []).map((skill, index) => (
            <CircularProgressBar
              key={skill.skill}
              skill={skill.skill}
              percentage={skill.percentage}
              aos="zoom-in"
              aosDelay={index * 80}
              animateOnClick
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

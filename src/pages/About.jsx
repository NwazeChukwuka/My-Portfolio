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

  const aboutParagraph = general.aboutPageBio
    || [general.aboutMe?.[0], general.aboutMe?.[1]].filter(Boolean).join(' ');

  const trustedBrands = personalData.trustedBrands || [];
  const educationItems = personalData.aboutEducation || [];
  const qualificationItems = personalData.aboutQualifications || [];
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Me.</h1>
        <p>{aboutParagraph}</p>
      </section>

      {trustedBrands.length > 0 && (
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
      )}

      <section className="about-career-section common-section">
        {educationItems.length > 0 && (
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
        )}

        {qualificationItems.length > 0 && (
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
        )}

        {(personalData.homeExperience || []).length > 0 && (
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
        )}
      </section>

      {(personalData.homeSkills || []).length > 0 && (
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
      )}
    </div>
  );
};

export default About;

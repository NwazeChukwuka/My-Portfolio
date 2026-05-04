// src/data/personalData.js
// Defaults are minimal; live content is merged from Supabase `site_settings` and table data in `usePortfolioContent`.

import {
  FaLaptopCode,
  FaChartLine,
  FaCode,
  FaChartBar,
  FaNodeJs,
  FaDatabase,
  FaGithub,
  FaPython,
  FaChartArea,
  FaBrain,
  FaRegLightbulb,
} from 'react-icons/fa';

const personalData = {
  general: {
    fullName: 'Nwaze Chukwuka',
    tagline: 'Full-Stack Developer & Data Analyst',
    profilePicture: '/assets/Me 1.webp',
    secondaryProfilePicture: '/assets/Me 2.webp',
    aboutMe: [
      'Add your short bio in Admin.',
      'Add your longer bio in Admin.',
    ],
    professionalInterests: [],
    cvs: {
      full: '',
      webDeveloper: '',
      dataAnalyst: '',
    },
  },

  webDeveloper: {
    title: 'Full-Stack Web Developer',
    tagline: 'Crafting Dynamic & User-Centric Digital Experiences',
    heroImage: '/assets/Me 2.webp',
    introduction: [
      'Describe your web development focus here',
    ],
    skills: [
      { icon: FaCode, name: 'JavaScript', level: 'Advanced' },
      { icon: FaNodeJs, name: 'Node.js', level: 'Advanced' },
      { icon: FaDatabase, name: 'Data Stores', level: 'Intermediate' },
      { icon: FaGithub, name: 'Git', level: 'Advanced' },
    ],
    services: [],
    projects: [],
    testimonials: [],
    stats: [],
    experience: [],
    pricing: [],
  },

  dataAnalyst: {
    title: 'Data Analyst',
    tagline: 'Transforming Data into Actionable Business Intelligence',
    heroImage: '/assets/Me 2.webp',
    introduction: [
      'Describe your analytics focus here.',
    ],
    skills: [
      { icon: FaPython, name: 'Python', level: 'Advanced' },
      { icon: FaChartBar, name: 'SQL', level: 'Advanced' },
      { icon: FaChartArea, name: 'Dashboards', level: 'Advanced' },
      { icon: FaBrain, name: 'Analysis', level: 'Advanced' },
      { icon: FaRegLightbulb, name: 'Data Storytelling', level: 'Advanced' },
    ],
    services: [],
    projects: [],
    testimonials: [],
    stats: [],
    experience: [],
    pricing: [],
  },

  homeExperience: [],
  homeTestimonials: [],

  homeServices: [
    {
      icon: FaLaptopCode,
      iconKey: 'FaLaptopCode',
      title: 'Web Development',
      description: 'Detail this service in Admin → Home services.',
      features: [],
    },
    {
      icon: FaChartLine,
      iconKey: 'FaChartLine',
      title: 'Data Analytics',
      description: 'Detail this service in Admin → Home services.',
      features: [],
    },
  ],

  homeServicePackages: {},

  homePortfolioPreviews: [],

  homeSkills: [],

  faqs: [],

  trustedBrands: [],
  aboutEducation: [],
  aboutQualifications: [],

  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    linkedin: '',
    twitter: '',
    github: '',
    socialLinks: {
      linkedin: '',
      github: '',
      whatsapp: '',
      twitter: '',
      facebook: '',
    },
  },
};

export default personalData;

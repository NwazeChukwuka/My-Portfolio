// src/data/personalData.js

import {
  FaBriefcase, FaCode, FaChartBar, FaBookReader,
  FaFileInvoiceDollar, FaLaptopCode, FaChartLine, FaUniversity,
  FaLightbulb, FaFlask, FaRegLightbulb, FaHandshake, FaBullhorn,
  FaLinkedin, FaTwitter, FaGithub,
  FaBalanceScale, FaChartPie, FaCalculator, FaGraduationCap,
  FaReact, FaJsSquare, FaHtml5, FaCss3Alt, FaNodeJs,
  FaPython, FaDatabase, FaBrain, FaChartArea,
  FaMicroscope, FaPencilRuler, FaClipboardList, FaFileAlt
} from 'react-icons/fa';

const personalData = {
  general: {
    fullName: 'Mazi Chukwuka',
    tagline: 'Full-Stack Developer & Data Analyst',
    profilePicture: '/assets/mazi-profile.jpg',
    aboutMe: [
      "I am a full-stack developer and data analyst based in Port Harcourt, Nigeria, focused on building practical digital products and analytics-driven solutions. I enjoy turning business problems into user-friendly web experiences and clear, actionable insights.",
      "My work combines product thinking, modern web engineering, and performance-focused delivery. From responsive interfaces to API integrations and dashboards, I design systems that are clean, scalable, and useful for real-world teams.",
      "I am committed to continuous learning and measurable impact. Whether I am launching a web platform, optimizing existing workflows, or delivering business intelligence, I prioritize clarity, reliability, and outcomes."
    ],
    professionalInterests: [
      {
        icon: FaLaptopCode,
        title: 'Product Engineering',
        description: 'Building robust web applications with strong UX, maintainable architecture, and production readiness.'
      },
      {
        icon: FaChartLine,
        title: 'Data-Driven Decisions',
        description: 'Translating data into dashboards, reports, and insights that guide strategic execution.'
      },
      {
        icon: FaCode,
        title: 'Continuous Improvement',
        description: 'Improving delivery speed, code quality, and platform performance through iterative optimization.'
      }
    ],
    cvs: {
      full: '/assets/cvs/mazi-full-cv.pdf',
      webDeveloper: '/assets/cvs/mazi-web-developer-cv.pdf',
      dataAnalyst: '/assets/cvs/mazi-data-analyst-cv.pdf',
    },
  },

  accountant: {
    title: 'Chartered Accountant',
    tagline: 'Driving Financial Integrity & Strategic Growth',
    heroImage: '/assets/accountant/accounting-hero.jpg',
    introduction: [
      "As a seasoned Chartered Accountant, my expertise lies in ensuring financial accuracy, optimizing fiscal performance, and providing strategic insights that drive sustainable business growth. I possess a deep understanding of financial reporting standards (IFRS/GAAP), taxation, auditing, and corporate finance.",
      "My approach combines meticulous attention to detail with a broader perspective on how financial data informs operational and strategic decisions. I am adept at transforming complex financial information into clear, actionable intelligence for stakeholders."
    ],
    services: [
      { icon: FaFileInvoiceDollar, title: 'Financial Reporting & Analysis', description: 'Preparation of accurate financial statements, variance analysis, and performance dashboards.' },
      { icon: FaCalculator, title: 'Tax Planning & Compliance', description: 'Strategic tax advisory, compliance with local regulations, and efficient tax return preparation.' },
      { icon: FaBalanceScale, title: 'Audit & Assurance', description: 'Independent financial audits, internal control reviews, and assurance services to enhance trust.' },
      { icon: FaChartPie, title: 'Budgeting & Forecasting', description: 'Development of robust budgets, financial forecasts, and cash flow projections to guide decision-making.' },
      { icon: FaHandshake, title: 'Financial Consulting', description: 'Advisory on business valuation, mergers & acquisitions, and financial due diligence.' },
      { icon: FaRegLightbulb, title: 'Process Optimization', description: 'Streamlining accounting processes and implementing financial systems for efficiency.' }
    ],
    projects: [
      { id: 'acc-001', image: '/assets/accountant/audit-report.jpg', title: 'Annual Financial Audit for ABC Corp.', category: 'Audit & Assurance', description: 'Led the external audit for a mid-sized manufacturing firm, ensuring compliance with IFRS and identifying key areas for internal control improvement.', detailsLink: '/portfolio', isInternalLink: true },
      { id: 'acc-002', image: '/assets/accountant/tax-planning.jpg', title: 'Tax Efficiency Strategy for Startup XYZ', category: 'Tax Planning', description: 'Developed and implemented a multi-year tax planning strategy resulting in a 15% reduction in corporate tax liability for a tech startup.', detailsLink: '/portfolio', isInternalLink: true },
      { id: 'acc-003', image: '/assets/accountant/budgeting.jpg', title: 'Budget & Forecasting Model for Retail Chain', category: 'Budgeting & Forecasting', description: 'Designed and deployed a dynamic budgeting and forecasting model that improved financial planning accuracy by 20% for a regional retail chain.', detailsLink: '/portfolio', isInternalLink: true }
    ],
    testimonials: [
      { quote: "Mazi's financial acumen transformed our chaotic books into a clear, compliant, and strategic asset. His insights were invaluable.", author: "Peter Obi, CEO of TechInnovate", image: '/assets/testimonials/sarah-chen.jpg' },
      { quote: "His detailed audit work provided us with the confidence and clarity we needed for our investor relations. Truly professional.", author: "Atiku Abubakar, CFO of Global Supply Co.", image: '/assets/testimonials/david-lee.jpg' }
    ]
  },

  webDeveloper: {
    title: 'Full-Stack Web Developer',
    tagline: 'Crafting Dynamic & User-Centric Digital Experiences',
    heroImage: '/assets/webdev/webdev-hero.jpg',
    introduction: [
      "As a Full-Stack Web Developer, I specialize in building robust, scalable, and intuitive web applications. My expertise spans both front-end and back-end development, ensuring seamless integration and exceptional user experiences.",
      "I am passionate about writing clean, efficient code and staying abreast of the latest technologies to deliver modern and high-performing digital solutions. My strong problem-solving skills, combined with a keen eye for design, enable me to bring complex ideas to life on the web."
    ],
    skills: [
      { icon: FaReact, name: 'React.js', level: 'Advanced' },
      { icon: FaJsSquare, name: 'JavaScript (ES6+)', level: 'Expert' },
      { icon: FaHtml5, name: 'HTML5', level: 'Expert' },
      { icon: FaCss3Alt, name: 'CSS3 / SASS', level: 'Expert' },
      { icon: FaNodeJs, name: 'Node.js / Express.js', level: 'Advanced' },
      { icon: FaDatabase, name: 'MongoDB / SQL', level: 'Intermediate' },
      { icon: FaGithub, name: 'Git / GitHub', level: 'Expert' },
      { icon: FaCode, name: 'RESTful APIs', level: 'Advanced' },
    ],
    projects: [
      { id: 'web-001', image: '/assets/webdev/e-commerce-site.jpg', title: 'E-commerce Platform Redesign', category: 'Full-Stack Development', description: 'Developed a responsive e-commerce platform with MERN stack, including secure payment gateway integration and admin dashboard.', detailsLink: '/portfolio', isInternalLink: true },
      { id: 'web-002', image: '/assets/webdev/api-dev.jpg', title: 'Custom CRM API Development', category: 'Backend Development', description: 'Built a scalable RESTful API using Node.js and Express.js for a CRM system, handling user authentication and data management.', detailsLink: '/portfolio', isInternalLink: true },
      { id: 'web-003', image: '/assets/webdev/portfolio-site.jpg', title: 'Interactive Portfolio Website', category: 'Frontend Development', description: 'Designed and developed a dynamic, animated personal portfolio site using React.js and modern CSS techniques.', detailsLink: '/portfolio', isInternalLink: true }
    ],
    testimonials: [
      { quote: "Mazi delivered our website on time and exceeded our expectations. His attention to detail and clean code are remarkable.", author: "Micheal Okpara, CTO of InnovateX", image: '/assets/testimonials/john-doe.jpg' },
      { quote: "Highly recommend Mazi for any web development needs. He's a great communicator and a skilled developer.", author: "Nnamdi Azikiwe, Marketing Director", image: '/assets/testimonials/emily-white.jpg' }
    ]
  },

  dataAnalyst: {
    title: 'Data Analyst',
    tagline: 'Transforming Data into Actionable Business Intelligence',
    heroImage: '/assets/dataanalyst/data-hero.jpg',
    introduction: [
      "As a Data Analyst, I specialize in extracting meaningful insights from complex datasets to inform strategic business decisions. My expertise includes data cleaning, statistical analysis, predictive modeling, and data visualization.",
      "I am proficient in using various tools and programming languages to uncover trends, identify opportunities, and present findings in a clear, compelling manner that drives actionable outcomes for organizations."
    ],
    skills: [
      { icon: FaPython, name: 'Python (Pandas, NumPy, Scikit-learn)', level: 'Advanced' },
      { icon: FaChartBar, name: 'SQL', level: 'Expert' },
      { icon: FaChartArea, name: 'Tableau / Power BI', level: 'Advanced' },
      { icon: FaBrain, name: 'Statistical Analysis', level: 'Expert' },
      { icon: FaDatabase, name: 'Database Management', level: 'Intermediate' },
      { icon: FaRegLightbulb, name: 'Data Storytelling', level: 'Expert' },
    ],
    projects: [
      { id: 'data-001', image: '/assets/dataanalyst/sales-analysis.jpg', title: 'Customer Churn Prediction Model', category: 'Predictive Analytics', description: 'Developed a machine learning model to predict customer churn with 85% accuracy, enabling proactive retention strategies for a telecom company.', detailsLink: '/portfolio', isInternalLink: true },
      { id: 'data-002', image: '/assets/dataanalyst/market-segment.jpg', title: 'Sales Performance Dashboard', category: 'Business Intelligence', description: 'Created an interactive Tableau dashboard for real-time sales performance tracking and market segmentation analysis, leading to targeted campaigns.', detailsLink: '/portfolio', isInternalLink: true },
      { id: 'data-003', image: '/assets/dataanalyst/fraud-detection.jpg', title: 'Financial Fraud Detection System', category: 'Risk Analytics', description: 'Implemented an anomaly detection algorithm to identify fraudulent transactions in a financial dataset, reducing potential losses by 30%.', detailsLink: '/portfolio', isInternalLink: true }
    ],
    testimonials: [
      { quote: "Mazi's data analysis brought clarity to our complex sales data. His dashboards are now indispensable for our strategic meetings.", author: "David Umahi, Head of Sales", image: '/assets/testimonials/michael-brown.jpg' },
      { quote: "The insights derived from his churn prediction model have directly impacted our customer retention efforts. A true expert.", author: "Francis Nwifuru, Customer Success Lead", image: '/assets/testimonials/jessica-green.jpg' }
    ]
  },

  researchAcademic: {
    title: 'Research & Academic',
    tagline: 'Driving Knowledge Creation & Interdisciplinary Inquiry',
    heroImage: '/assets/research/research-hero.jpg',
    introduction: [
      "As a Research Academic, I am dedicated to rigorous inquiry, knowledge creation, and critical analysis across diverse fields. My research focuses on the intersection of technology, finance, and societal impact, contributing to both academic discourse and practical applications.",
      "I possess strong capabilities in literature review, quantitative and qualitative research methodologies, data interpretation, and scholarly writing. My goal is to produce impactful research that informs policy, advances understanding, and solves real-world challenges."
    ],
    researchAreas: [
      { icon: FaFlask, title: 'FinTech Innovation', description: 'Investigating the impact of emerging technologies on financial services and markets.' },
      { icon: FaMicroscope, title: 'Data Ethics & Governance', description: 'Exploring ethical implications and governance frameworks for large-scale data use and AI.' },
      { icon: FaClipboardList, title: 'Sustainable Development', description: 'Researching the role of technology and financial mechanisms in achieving sustainable development goals.' },
      { icon: FaPencilRuler, title: 'Accounting Standards Evolution', description: 'Analyzing the development and implementation challenges of international accounting standards.' }
    ],
    publications: [
      { id: 'pub-001', image: '/assets/research/fintech-paper.jpg', title: 'The Role of Blockchain in Decentralized Finance (DeFi): Opportunities and Challenges', category: 'FinTech', snippet: 'Published in the Journal of Financial Innovation, this paper examines the disruptive potential and regulatory hurdles of blockchain-based finance.', link: 'https://example.com/blockchain-defi-paper', isInternalLink: false },
      { id: 'pub-002', image: '/assets/research/data-privacy-paper.jpg', title: 'Navigating Data Privacy in the Age of AI: A Regulatory Framework Analysis', category: 'Data Ethics', snippet: 'A comprehensive review article in the International Journal of Data Science exploring global data privacy regulations and AI ethics.', link: 'https://example.com/data-privacy-ai-paper', isInternalLink: false },
      { id: 'pub-003', image: '/assets/research/ifrs-impact-paper.jpg', title: 'Impact of IFRS 9 on Financial Institutions: A Case Study Approach', category: 'Accounting Standards', snippet: 'Presented at the Global Accounting Conference, this study analyzes the practical implications of IFRS 9 adoption on bank financial reporting.', link: 'https://example.com/ifrs9-impact-study', isInternalLink: false }
    ],
    testimonials: [
      { quote: "Mazi's research on FinTech is insightful and rigorously conducted. His contributions are valuable to the academic community.", author: "Prof. Dr. Anya Okpara, Head of Finance Department", image: '/assets/testimonials/prof-anya.jpg' },
      { quote: "A diligent and thorough researcher, Mazi brings a unique interdisciplinary perspective to complex problems.", author: "Dr. Chika Okafor, Senior Data Scientist", image: '/assets/testimonials/dr-ben.jpg' }
    ]
  },

  homeExperience: [
    { title: 'Senior Web Developer', company: 'TechSolutions Ltd.', years: '2022 - Present', description: 'Lead development on full-stack projects using React and Node.js.', achievements: ['Increased site performance by 25%', 'Mentored junior developers'] },
    { title: 'Data Analyst', company: 'Global Data Insights', years: '2019 - 2022', description: 'Analyzed market trends and customer data to inform business strategy.', achievements: ['Developed a key sales performance dashboard', 'Reduced customer churn by 10%'] },
    { title: 'Frontend Developer', company: 'Freelance & Contract Projects', years: '2017 - 2019', description: 'Delivered responsive interfaces, landing pages, and early product MVPs for small businesses and founders.', achievements: ['Shipped multiple client sites', 'Established reusable UI workflows'] }
  ],

  homeTestimonials: [
    { quote: "Mazi is a true professional. His technical skills are matched only by his clear communication and project management abilities.", author: 'Bola Tinubu, CTO at InnovateCo', image: '/assets/testimonials/jane-smith.jpg' },
    { quote: "The financial insights Mazi provided were instrumental in our company's strategic planning. Highly recommend his services.", author: 'Peter Obi, CFO at Global Ventures', image: '/assets/testimonials/david-lee.jpg' },
    { quote: "I was impressed by Mazi's ability to seamlessly blend development and data analysis. He delivered a project that was both beautiful and highly functional.", author: 'Atiku Abubakar, Project Lead', image: '/assets/testimonials/sarah-chen.jpg' },
  ],

  homeServices: [
    {
      icon: FaLaptopCode,
      title: 'Web Development',
      description: 'Building modern, responsive, and high-performance web applications using MERN stack and other technologies.',
      features: ['Full-Stack Development', 'Frontend Design', 'API Integration']
    },
    {
      icon: FaChartLine,
      title: 'Data Analytics',
      description: 'Uncovering actionable insights from complex datasets through statistical modeling and data visualization.',
      features: ['Predictive Modeling', 'Business Intelligence', 'Data Storytelling']
    },
  ],

  homePortfolioPreviews: [
    { id: 'gen-001', image: '/assets/general/cross-disciplinary-project.jpg', title: 'Data-Driven Product Revamp', category: 'Hybrid Product Engineering', description: 'A full product revamp combining frontend modernization, API integration, and actionable analytics dashboards.', detailsLink: '/portfolio', isInternalLink: true }
  ],

  blogArticles: [
    {
      id: 'understanding-ifrs-16',
      title: 'Understanding IFRS 16: Lease Accounting Simplified',
      category: 'Accounting',
      tags: ['IFRS', 'Lease Accounting', 'Finance'],
      date: '2024-03-15',
      author: 'Mazi Chukwuka',
      image: '/assets/blog/ifrs-16.jpg',
      altText: 'IFRS 16 lease accounting document',
      preview: 'IFRS 16 brought significant changes to how leases are reported on financial statements. This article breaks down the core principles and impacts for businesses.',
      content: [
        { type: 'heading', level: 2, text: 'Introduction to IFRS 16' },
        { type: 'paragraph', text: 'IFRS 16, a new standard for lease accounting, took effect on January 1, 2019, replacing IAS 17. The primary goal was to bring all leases onto the balance sheet, providing a more transparent and accurate view of a company\'s financial position.' },
        { type: 'paragraph', text: 'This change primarily affects lessees by eliminating the distinction between operating and finance leases. Previously, operating leases were treated as off-balance-sheet items, which could understate a company\'s liabilities and assets.' },
        { type: 'heading', level: 3, text: 'Key Changes for Lessees' },
        { type: 'paragraph', text: 'Under IFRS 16, lessees are required to recognize a "right-of-use" (ROU) asset and a corresponding lease liability for most leases.' },
        { type: 'list', items: ['**Right-of-use (ROU) Asset:** Represents the lessee\'s right to use an underlying asset for the lease term.', '**Lease Liability:** Represents the lessee\'s obligation to make lease payments.'] },
        { type: 'paragraph', text: 'The ROU asset is depreciated over the shorter of the lease term or its useful life, while the lease liability is reduced as payments are made, with interest expense recognized separately.' },
        { type: 'image', src: '/assets/blog/ifrs-16-impact.png', alt: 'IFRS 16 impact diagram', caption: 'Diagram illustrating the balance sheet impact of IFRS 16.' },
        { type: 'heading', level: 2, text: 'Practical Implications' },
        { type: 'paragraph', text: 'The new standard has several practical implications for companies, including:' },
        { type: 'list', items: ['**Balance Sheet Impact:** Increases both assets and liabilities, affecting key financial ratios like debt-to-equity.', '**Profitability:** Changes in expense recognition from a straight-line operating expense to a depreciation and interest expense split, impacting EBITDA.', '**System Changes:** Requires companies to implement new systems and processes to track lease data.'] },
        { type: 'heading', level: 3, text: 'Example Calculation' },
        { type: 'paragraph', text: 'Let\'s consider a simple example of a 5-year lease with annual payments of $10,000, and a discount rate of 5%.' },
        { type: 'code', language: 'javascript', code: `// Simplified example to calculate Lease Liability
const annualPayment = 10000;
const leaseTerm = 5;
const discountRate = 0.05;

// Present Value of future lease payments (simplified)
const leaseLiability = annualPayment * ((1 - Math.pow(1 + discountRate, -leaseTerm)) / discountRate);

console.log(leaseLiability.toFixed(2)); // Output: 43294.77` },
        { type: 'paragraph', text: 'This simplified calculation shows the initial lease liability recognized on the balance sheet.' },
        { type: 'heading', level: 2, text: 'Conclusion' },
        { type: 'paragraph', text: 'IFRS 16 has fundamentally changed lease accounting. While it introduces new complexities, it provides investors with a more accurate and transparent view of a company\'s financial obligations, making it a crucial standard for all lessees to understand and implement correctly.' },
      ]
    },
    {
      id: 'react-hooks-for-beginners',
      title: 'React Hooks for Beginners: A Practical Guide',
      category: 'Web Development',
      tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
      date: '2024-05-01',
      author: 'Mazi Chukwuka',
      image: '/assets/blog/react-hooks.jpg',
      altText: 'React Hooks code snippet',
      preview: 'New to React Hooks? This guide provides a straightforward introduction to useState and useEffect, helping you build dynamic components with ease.',
      content: [
        { type: 'heading', level: 2, text: 'What are React Hooks?' },
        { type: 'paragraph', text: 'React Hooks were introduced in React 16.8. They are functions that let you "hook into" React state and lifecycle features from function components. Before hooks, these features were only available in class components.' },
        { type: 'paragraph', text: 'Hooks solve several problems, including making stateful logic easier to share and component code cleaner and more readable.' },
        { type: 'heading', level: 3, text: 'The `useState` Hook' },
        { type: 'paragraph', text: 'The `useState` hook allows you to add state to function components. It returns an array with two items: the current state value and a function to update it.' },
        { type: 'code', language: 'javascript', code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}` },
        { type: 'paragraph', text: 'In this example, `useState(0)` initializes the state `count` to `0`. `setCount` is the function we use to update that state.' },
        { type: 'image', src: '/assets/blog/usestate-diagram.png', alt: 'useState diagram', caption: 'Visual representation of the useState hook.' },
        { type: 'heading', level: 3, text: 'The `useEffect` Hook' },
        { type: 'paragraph', text: 'The `useEffect` hook lets you perform side effects in function components. It\'s a combination of `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` from class components.' },
        { type: 'code', language: 'javascript', code: `import React, { useState, useEffect } from 'react';

function DocumentTitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]); // The dependency array ensures this effect only runs when 'count' changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}` },
        { type: 'paragraph', text: 'The second argument to `useEffect`, the **dependency array**, is crucial. An empty array `[]` means the effect runs once on mount. Omitting it means the effect runs after every render. Including state variables like `[count]` means the effect runs whenever those variables change.' },
        { type: 'heading', level: 2, text: 'Conclusion' },
        { type: 'paragraph', text: '`useState` and `useEffect` are the two most fundamental hooks. Mastering them is a major step towards writing clean, functional React components. They allow for a more declarative and readable approach to building UIs.' },
      ]
    },
    {
      id: 'power-of-data-visualization',
      title: 'The Power of Data Visualization in Decision Making',
      category: 'Data Analysis',
      tags: ['Data Visualization', 'Business Intelligence', 'Decision Making'],
      date: '2024-04-20',
      author: 'Mazi Chukwuka',
      image: '/assets/blog/data-viz.jpg',
      altText: 'Colorful data visualization chart',
      preview: 'Data visualization transforms complex datasets into digestible insights, empowering better and faster decision-making for businesses of all sizes.',
      content: [
        { type: 'heading', level: 2, text: 'Why Data Visualization Matters' },
        { type: 'paragraph', text: 'In today\'s data-driven world, organizations collect vast amounts of information. However, raw data is often overwhelming and difficult to interpret. Data visualization turns this raw data into visual representations like charts, graphs, and maps, making it easier for the human brain to understand and process.' },
        { type: 'paragraph', text: 'Good data visualization helps in:' },
        { type: 'list', items: ['**Identifying Trends and Patterns:** It quickly reveals trends, outliers, and patterns that might be hidden in spreadsheets.', '**Improving Decision Making:** Visual insights enable stakeholders to make faster, more informed decisions based on evidence.', '**Facilitating Communication:** It simplifies complex concepts, making it easier to communicate findings to non-technical audiences.'] },
        { type: 'image', src: '/assets/blog/data-viz-example.png', alt: 'Example data visualization', caption: 'An example of a well-designed sales performance dashboard.' },
        { type: 'heading', level: 3, text: 'Common Visualization Techniques' },
        { type: 'paragraph', text: 'Different types of data require different visualization techniques:' },
        { type: 'list', items: ['**Bar Charts:** Ideal for comparing values across different categories.', '**Line Charts:** Best for showing trends over time.', '**Pie Charts:** Useful for illustrating parts of a whole.', '**Heatmaps:** Effective for showing the relationship between two variables.'] },
        { type: 'heading', level: 2, text: 'Tools of the Trade' },
        { type: 'paragraph', text: 'There are numerous tools available for data visualization, from programming libraries to dedicated software. Some popular options include:' },
        { type: 'code', language: 'python', code: `# Popular Python libraries for data visualization
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px` },
        { type: 'paragraph', text: 'Software like Tableau and Power BI also offer powerful, user-friendly interfaces for creating interactive dashboards and reports without extensive coding knowledge.' },
        { type: 'heading', level: 2, text: 'Conclusion' },
        { type: 'paragraph', text: 'Data visualization is more than just creating pretty charts; it is a critical skill for any data professional. It bridges the gap between data and actionable insights, ultimately driving success in business, science, and beyond.' },
      ]
    },
    {
      id: 'impact-of-ai-on-research',
      title: 'The Impact of AI on Scientific Research Methodologies',
      category: 'Research',
      tags: ['AI', 'Research', 'Science', 'Innovation'],
      date: '2024-06-10',
      author: 'Mazi Chukwuka',
      image: '/assets/blog/ai-research.jpg',
      altText: 'AI neural network graphic over research papers',
      preview: 'Artificial Intelligence is revolutionizing scientific research, from accelerating data analysis to discovering new materials and drugs. Explore its transformative impact.',
      content: [
        { type: 'heading', level: 2, text: 'AI as a Research Accelerator' },
        { type: 'paragraph', text: 'Artificial Intelligence is fundamentally changing the scientific research landscape. It allows researchers to process and analyze data at a scale and speed that was previously unimaginable. From genomics to astrophysics, AI tools are becoming indispensable.' },
        { type: 'list', items: ['**Drug Discovery:** AI models can predict the properties of molecules, dramatically shortening the time it takes to identify potential drug candidates.', '**Material Science:** Machine learning is used to simulate and predict the properties of new materials, accelerating the development of superconductors and advanced composites.', '**Climate Modeling:** AI helps create more accurate and higher-resolution climate models to predict future environmental changes.'] },
        { type: 'image', src: '/assets/blog/ai-research-lab.jpg', alt: 'Scientists working in a lab with AI-powered tools', caption: 'AI tools are helping researchers analyze complex data sets faster than ever before.' },
        { type: 'heading', level: 3, text: 'Ethical and Methodological Considerations' },
        { type: 'paragraph', text: 'While the benefits are clear, the integration of AI into research also presents new challenges.' },
        { type: 'list', items: ['**Bias in Data:** AI models can inherit and amplify biases present in their training data, leading to skewed results.', '**Interpretability:** The "black box" nature of some complex AI models makes it difficult to understand how they arrived at a conclusion, which can be a barrier in scientific validation.', '**Data Privacy:** Using large datasets for research, especially in fields like medicine, raises significant privacy concerns.'] },
        { type: 'heading', level: 2, text: 'Conclusion' },
        { type: 'paragraph', text: 'AI is a powerful new tool in the researcher\'s arsenal. By harnessing its power while also critically addressing its ethical and methodological challenges, we can unlock new frontiers of knowledge and accelerate progress in every scientific discipline.' },
      ]
    },
    {
      id: 'web-performance-tips',
      title: 'Essential Web Performance Tips for Developers',
      category: 'Web Development',
      tags: ['Web Performance', 'Frontend', 'Optimization', 'SEO'],
      date: '2024-07-20',
      author: 'Mazi Chukwuka',
      image: '/assets/blog/web-perf.jpg',
      altText: 'Website speed optimization graphic',
      preview: 'Slow websites frustrate users and hurt SEO. Learn practical tips to optimize your web applications for speed and efficiency, enhancing user experience.',
      content: [
        { type: 'heading', level: 2, text: 'The Importance of Web Performance' },
        { type: 'paragraph', text: 'A fast website is no longer a luxury; it\'s a necessity. Users expect websites to load instantly, and search engines like Google use page speed as a ranking factor. A slow site leads to high bounce rates, poor user experience, and lost conversions.' },
        { type: 'heading', level: 3, text: 'Key Performance Metrics (Core Web Vitals)' },
        { type: 'paragraph', text: 'Google introduced Core Web Vitals to provide a standardized set of metrics for measuring user experience. The three key metrics are:' },
        { type: 'list', items: ['**Largest Contentful Paint (LCP):** Measures loading performance. It should occur within 2.5 seconds of the page starting to load.', '**First Input Delay (FID):** Measures interactivity. It should be less than 100 milliseconds.', '**Cumulative Layout Shift (CLS):** Measures visual stability. The score should be less than 0.1.'] },
        { type: 'image', src: '/assets/blog/core-web-vitals.png', alt: 'Core Web Vitals chart', caption: 'The three main metrics of Google\'s Core Web Vitals.' },
        { type: 'heading', level: 2, text: 'Practical Optimization Tips' },
        { type: 'paragraph', text: 'Here are some practical tips to improve your website\'s performance:' },
        { type: 'list', items: ['**Optimize Images:** Compress images, use modern formats like WebP, and lazy-load them so they only load when they are visible in the viewport.', '**Minify CSS and JavaScript:** Remove unnecessary characters from your code to reduce file sizes.', '**Leverage Browser Caching:** Use HTTP caching headers to tell browsers to store static assets locally, so they don\'t have to be re-downloaded on subsequent visits.', '**Reduce Server Response Time:** Optimize your backend code and use a Content Delivery Network (CDN) to serve assets from servers closer to your users.', '**Eliminate Render-Blocking Resources:** Move scripts to the end of your HTML body and use `async` or `defer` attributes to prevent them from blocking the page from rendering.'] },
        { type: 'heading', level: 2, text: 'Conclusion' },
        { type: 'paragraph', text: 'Improving web performance is an ongoing process, not a one-time task. By focusing on key metrics and implementing these best practices, you can create a faster, more reliable, and more enjoyable experience for your users.' },
      ]
    },
  ],

  homeSkills: [
    { skill: 'React', percentage: 90, color: '#61DAFB' },
    { skill: 'JavaScript', percentage: 95, color: '#F7DF1E' },
    { skill: 'Flutter', percentage: 78, color: '#02569B' },
    { skill: 'Node.js', percentage: 80, color: '#68A063' },
    { skill: 'Python', percentage: 85, color: '#3776AB' },
    { skill: 'SQL', percentage: 75, color: '#4479A1' },
    { skill: 'Data Analysis', percentage: 88, color: '#FF7F50' },
  ],

  faqs: [
    { question: 'What are your primary areas of expertise?', answer: 'My core expertise is full-stack web development and data analysis. I focus on building usable products and turning data into decisions.' },
    { question: 'How can I request a quote for your services?', answer: 'You can request a quote by visiting the "Contact" page and filling out the inquiry form. Please provide as much detail as possible about your project or needs.' },
    { question: 'Do you offer remote consulting or services?', answer: 'Yes, I offer remote services for web development and analytics engagements, working with clients globally.' },
    { question: 'What is your typical project turnaround time for web development?', answer: 'Project turnaround time for web development varies significantly based on complexity, scope, and specific requirements. After an initial consultation, I can provide a more accurate estimate.' },
    { question: 'Can I see examples of your previous work?', answer: 'Absolutely! Please visit my "Portfolio" page to see a selection of my projects across different domains. You can also find detailed case studies on my individual role pages.' },
    { question: 'Do you provide training or workshops?', answer: 'While my primary focus is on project work and consulting, I occasionally offer specialized training or workshops based on demand and my schedule. Please contact me if you have specific training needs.' },
    { question: 'What industries have you worked with?', answer: 'My experience spans tech startups, e-commerce, education, and operations-focused teams. I adapt delivery to each business model and growth stage.' },
    { question: 'What payment methods do you accept?', answer: 'I accept various payment methods, including bank transfers and major online payment platforms. Specific details will be provided in the project agreement.' }
  ],

  contact: {
    email: 'mazichukwuka@gmail.com',
    phone: '+2349046049655',
    whatsapp: 'https://wa.me/2349046049655',
    address: 'Port Harcourt, Rivers State, Nigeria',
    linkedin: 'https://www.linkedin.com/in/mazichukwuka',
    twitter: 'https://twitter.com/mazichukwuka',
    github: 'https://github.com/mazichukwuka',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/mazichukwuka',
      github: 'https://github.com/mazichukwuka',
      whatsapp: 'https://wa.me/2349046049655',
      twitter: 'https://twitter.com/mazichukwuka',
      facebook: 'https://www.facebook.com/mazichukwuka'
    }
  },
};

export default personalData;
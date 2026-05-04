import personalData from '../data/personalData';

const MAX_CV_CHARS = 6000;
const cvTextCache = new Map();

const roleCvMap = {
  webDeveloper: ['web', 'website', 'frontend', 'backend', 'react', 'developer', 'api'],
  dataAnalyst: ['data', 'analytics', 'dashboard', 'power bi', 'tableau', 'sql', 'python'],
  full: ['general', 'all', 'overview', 'portfolio', 'multidisciplinary'],
};

const STOP_WORDS = new Set([
  'the', 'is', 'are', 'a', 'an', 'i', 'you', 'we', 'to', 'for', 'of', 'and', 'or', 'on', 'in',
  'about', 'with', 'my', 'your', 'me', 'it', 'this', 'that', 'can', 'do', 'how', 'what', 'who',
  'when', 'where', 'would', 'should', 'want', 'need', 'please',
]);

function sanitizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function tokenize(value) {
  return sanitizeText(value)
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function overlapScore(queryTokens, corpusTokens) {
  if (!queryTokens.length || !corpusTokens.length) return 0;
  const set = new Set(corpusTokens);
  let score = 0;
  queryTokens.forEach((token) => {
    if (set.has(token)) score += 1;
  });
  return score;
}

function rankCvKey(message) {
  const lower = (message || '').toLowerCase();
  const scores = Object.fromEntries(Object.keys(roleCvMap).map((key) => [key, 0]));
  Object.entries(roleCvMap).forEach(([key, keywords]) => {
    keywords.forEach((keyword) => {
      if (lower.includes(keyword)) scores[key] += 2;
    });
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'full';
}

async function extractPdfText(url) {
  if (!url) return '';
  if (cvTextCache.has(url)) return cvTextCache.get(url);

  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      text += ` ${pageText}`;
      if (text.length > MAX_CV_CHARS) break;
    }
    const cleaned = sanitizeText(text).slice(0, MAX_CV_CHARS);
    cvTextCache.set(url, cleaned);
    return cleaned;
  } catch (error) {
    console.warn('CV parsing failed:', error);
    return '';
  }
}

function buildKnowledgeBase({ settings }) {
  const content = settings || personalData;
  const general = content.general || personalData.general;
  const contact = content.contact || personalData.contact;

  const blogSummary = Array.isArray(content.blogPostsSummaryForAssistant)
    ? content.blogPostsSummaryForAssistant
    : [];

  return {
    profile: {
      fullName: general.fullName || personalData.general.fullName,
      tagline: general.tagline || personalData.general.tagline,
      about: general.aboutMe || personalData.general.aboutMe,
      contact: {
        email: contact.email,
        phone: contact.phone,
        whatsapp: contact.whatsapp || contact.socialLinks?.whatsapp,
      },
    },
    services: content.homeServices || personalData.homeServices,
    faqs: content.faqs || personalData.faqs || [],
    roleOverviews: {
      webDeveloper: content.webDeveloper?.introduction || personalData.webDeveloper?.introduction || [],
      dataAnalyst: content.dataAnalyst?.introduction || personalData.dataAnalyst?.introduction || [],
    },
    blogs: blogSummary,
  };
}

function chooseBestBlog(queryTokens, blogs) {
  let best = null;
  let bestScore = 0;
  blogs.forEach((blog) => {
    const corpus = tokenize(`${blog.title} ${blog.category} ${(blog.tags || []).join(' ')} ${blog.snippet || ''}`);
    const score = overlapScore(queryTokens, corpus);
    if (score > bestScore) {
      best = blog;
      bestScore = score;
    }
  });
  return { blog: best, score: bestScore };
}

function chooseBestFaq(queryTokens, faqs) {
  let best = null;
  let bestScore = 0;
  faqs.forEach((faq) => {
    const corpus = tokenize(`${faq.question} ${faq.answer}`);
    const score = overlapScore(queryTokens, corpus);
    if (score > bestScore) {
      best = faq;
      bestScore = score;
    }
  });
  return { faq: best, score: bestScore };
}

function chooseBestService(queryTokens, services) {
  let best = null;
  let bestScore = 0;
  services.forEach((service) => {
    const corpus = tokenize(`${service.title} ${service.description} ${(service.features || []).join(' ')}`);
    const score = overlapScore(queryTokens, corpus);
    if (score > bestScore) {
      best = service;
      bestScore = score;
    }
  });
  return { service: best, score: bestScore };
}

function buildHumanFallback(contact) {
  const whatsapp = contact.whatsapp || contact.socialLinks?.whatsapp || '';
  const phone = contact.phone || '';
  const ways = [];
  if (whatsapp) ways.push(`WhatsApp: ${whatsapp}`);
  if (phone) ways.push(`Call: ${phone}`);
  return ways.length ? `If you want a direct human response, use ${ways.join(' | ')}.` : '';
}

function getGuidedResponse({ message, knowledge, recommendedCvUrl, cvKey }) {
  const lower = sanitizeText(message).toLowerCase();
  const queryTokens = tokenize(message);
  const contact = knowledge.profile.contact || {};

  const asksContact = /contact|reach|call|phone|whatsapp|email|talk|speak/.test(lower);
  const asksBlog = /blog|article|write|post|topic|insight/.test(lower);
  const asksCv = /cv|resume|résumé|curriculum/.test(lower);
  const asksService = /service|offer|hire|project|consult|work/.test(lower);

  if (asksContact) {
    const text = [
      `I'm Gixy. You can reach ${knowledge.profile.fullName} directly by email (${contact.email || 'not listed'}), phone (${contact.phone || 'not listed'}), or WhatsApp (${contact.whatsapp || 'not listed'}).`,
      'Share your project goal and budget range for a faster human response.',
    ].join(' ');
    return { text, confidence: 0.95 };
  }

  if (asksCv) {
    const roleLabel = cvKey === 'full' ? 'general' : cvKey;
    const text = recommendedCvUrl
      ? `Based on your question, the best CV is the ${roleLabel} CV: ${recommendedCvUrl}`
      : 'I can recommend the right CV once the CV URLs are added in Admin Settings.';
    return { text, confidence: 0.92 };
  }

  if (asksBlog || queryTokens.includes('ifrs') || queryTokens.includes('react') || queryTokens.includes('data')) {
    const { blog, score } = chooseBestBlog(queryTokens, knowledge.blogs || []);
    if (blog && score > 0) {
      return {
        text: `A relevant blog for your question is "${blog.title}" (${blog.category}). ${blog.snippet} You can open it at /blog/${blog.slug}.`,
        confidence: 0.85,
      };
    }
  }

  if (asksService) {
    const { service, score } = chooseBestService(queryTokens, knowledge.services || []);
    if (service && score > 0) {
      return {
        text: `The best matching service is "${service.title}". ${service.description} Key scope: ${(service.features || []).join(', ')}.`,
        confidence: 0.84,
      };
    }
  }

  const { faq, score: faqScore } = chooseBestFaq(queryTokens, knowledge.faqs || []);
  if (faq && faqScore > 0) {
    return {
      text: `${faq.answer}`,
      confidence: 0.8,
    };
  }

  return {
    text: `I'm Gixy. I can help with services, project fit, CV selection, blog guidance, and contact details. ${buildHumanFallback(contact)}`.trim(),
    confidence: 0.45,
  };
}

async function callOpenAI(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  if (!apiKey) throw new Error('Missing VITE_OPENAI_API_KEY');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

async function callGemini(messages) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');

  const composed = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: composed }] }],
        generationConfig: { temperature: 0.4 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status}`);
  }
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function askSmartAssistant({ message, settings }) {
  const provider = (import.meta.env.VITE_AI_PROVIDER || 'openai').toLowerCase();
  const allowAiFallback = String(import.meta.env.VITE_AI_ENABLE_FALLBACK || 'false').toLowerCase() === 'true';
  const cvs = settings?.general?.cvs || personalData.general.cvs || {};
  const cvKey = rankCvKey(message);
  const recommendedCvUrl = cvs[cvKey] || cvs.full || '';
  const knowledge = buildKnowledgeBase({ settings });
  const guided = getGuidedResponse({ message, knowledge, recommendedCvUrl, cvKey });
  const humanFallback = buildHumanFallback(knowledge.profile.contact || {});

  if (!allowAiFallback || guided.confidence >= 0.72) {
    return {
      reply: `${guided.text}\n\n${humanFallback}`.trim(),
      recommendedCvUrl,
      recommendedCvKey: cvKey,
      mode: 'guided',
    };
  }

  const systemPrompt = `
You are Mazi Chukwuka's portfolio assistant.
Goal:
- Answer enquiries about services, blogs, and contact details.
- Recommend the best CV URL based on user intent.
- Be concise, practical, and accurate.

Rules:
- Only use the provided context.
- If asked about unavailable information, say it's not yet listed and offer contact guidance.
- End with one practical next step.
  `.trim();

  const userPrompt = `
User enquiry:
${message}

Portfolio knowledge:
${JSON.stringify(knowledge, null, 2)}

Recommended CV key: ${cvKey}
Recommended CV URL: ${recommendedCvUrl}

Extracted CV text:
${await extractPdfText(recommendedCvUrl) || 'No CV text extracted yet.'}

Respond with plain text and include the recommended CV URL when useful.
  `.trim();

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const content = provider === 'gemini'
    ? await callGemini(messages)
    : await callOpenAI(messages);

  return {
    reply: `${content || guided.text}\n\n${humanFallback}`.trim(),
    recommendedCvUrl,
    recommendedCvKey: cvKey,
    mode: 'ai-fallback',
  };
}

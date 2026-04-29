import React, { useEffect, useMemo, useState } from 'react';
import { FaComments, FaPaperPlane } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { askSmartAssistant } from '../../lib/smartAssistant';
import usePortfolioContent from '../../hooks/usePortfolioContent';
import './SmartAssistantWidget.css';

const SmartAssistantWidget = () => {
  const location = useLocation();
  const settings = usePortfolioContent();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm Gixy. I can help with services, blogs, CV recommendations, and the fastest way to reach Mazi.",
      cvUrl: '',
      timestamp: Date.now(),
    },
  ]);
  const whatsapp = settings?.contact?.whatsapp || settings?.contact?.socialLinks?.whatsapp || '';
  const phone = settings?.contact?.phone || '';
  const quickPrompts = useMemo(() => ([
    'What services fit my business needs?',
    'Recommend the right CV for hiring',
    'Show me relevant blog posts about accounting',
    'How can I contact Mazi directly?',
  ]), []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('portfolio:floating-widget:register', {
      detail: { width: 68, height: 68, gap: 18 },
    }));

    return () => {
      window.dispatchEvent(new CustomEvent('portfolio:floating-widget:clear'));
    };
  }, []);

  const handleAsk = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: question, timestamp: Date.now() }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askSmartAssistant({
        message: question,
        settings,
      });
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: response.reply,
        cvUrl: response.recommendedCvUrl,
        timestamp: Date.now(),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: error.message || 'I could not answer right now. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className={`smart-assistant-widget ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="smart-assistant-widget-panel">
          <div className="smart-assistant-widget-header">
            <h3>Gixy Smart Assistant</h3>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close smart assistant">x</button>
          </div>

          <p className="smart-assistant-widget-warning">
            Smart guided chat is active. For urgent enquiries, use WhatsApp or call directly.
          </p>

          <div className="smart-assistant-widget-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`smart-assistant-msg ${msg.role}`}>
                <div className="smart-assistant-msg-meta">
                  <strong>{msg.role === 'assistant' ? 'Gixy' : 'You'}</strong>
                  {msg.timestamp && (
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </div>
                <p>{msg.text}</p>
                {msg.cvUrl && (
                  <a href={msg.cvUrl} target="_blank" rel="noopener noreferrer">
                    Open recommended CV
                  </a>
                )}
              </div>
            ))}
            {loading && <p className="smart-assistant-msg assistant">Thinking...</p>}
          </div>

          <div className="smart-assistant-widget-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => setInput(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="smart-assistant-widget-human-row">
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            )}
            {phone && (
              <a href={`tel:${phone}`}>Call</a>
            )}
          </div>

          <form className="smart-assistant-widget-form" onSubmit={handleAsk}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Ask about services, blogs, or CVs..."
            />
            <button type="submit" disabled={loading}>
              <FaPaperPlane />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="smart-assistant-widget-launcher"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open smart assistant"
      >
        <FaComments />
      </button>
    </div>
  );
};

export default SmartAssistantWidget;

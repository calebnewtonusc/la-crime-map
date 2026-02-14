import React, { useState } from 'react';
import './TrustPages.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, this would send the form data to a backend
    // For now, we'll create a mailto link as a fallback
    const subject = encodeURIComponent(`LA Crime Map - ${formData.category}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Category: ${formData.category}\n\n` +
      `Message:\n${formData.message}`
    );

    // This would be replaced with actual form submission in production
    window.location.href = `mailto:contact@lacrimemap.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="trust-page">
      <div className="trust-page-container">
        <h1>Contact Us</h1>

        <section className="trust-section">
          <p>
            We welcome your feedback, questions, and suggestions. Whether you've found a bug, have an idea for
            improvement, or just want to share your thoughts, we'd love to hear from you.
          </p>
        </section>

        <div className="contact-container">
          <div className="contact-main">
            <section className="trust-section">
              <h2>Send Us a Message</h2>

              {submitted ? (
                <div className="submission-success">
                  <div className="success-icon">✓</div>
                  <h3>Thank you for your message!</h3>
                  <p>
                    Your email client should open with your message pre-filled. If it doesn't open automatically,
                    please send your message to: <a href="mailto:contact@lacrimemap.com">contact@lacrimemap.com</a>
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="data">Data Question</option>
                      <option value="partnership">Partnership / Collaboration</option>
                      <option value="press">Press / Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <div className="form-note">
                    <p>
                      <strong>Note:</strong> This form will open your email client. In a future version,
                      we'll implement a direct submission system.
                    </p>
                  </div>

                  <button type="submit" className="btn-primary btn-submit">
                    Send Message
                  </button>
                </form>
              )}
            </section>
          </div>

          <div className="contact-sidebar">
            <section className="trust-section contact-info-box">
              <h3>Quick Links</h3>
              <ul className="contact-links">
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:contact@lacrimemap.com">contact@lacrimemap.com</a>
                </li>
                <li>
                  <strong>Response Time:</strong> 1-3 business days
                </li>
              </ul>
            </section>

            <section className="trust-section contact-info-box">
              <h3>Before You Contact Us</h3>
              <p>You might find your answer faster in:</p>
              <ul>
                <li><a href="/faq">FAQ</a> - Common questions</li>
                <li><a href="/about">About</a> - Methodology details</li>
                <li><a href="/data-sources">Data Sources</a> - API information</li>
                <li><a href="/disclaimers">Disclaimers</a> - Limitations</li>
              </ul>
            </section>

            <section className="trust-section contact-info-box">
              <h3>Report a Crime</h3>
              <div className="emergency-notice">
                <p><strong>This is NOT a crime reporting tool!</strong></p>
                <p>To report a crime:</p>
                <ul>
                  <li><strong>Emergency:</strong> Call 911</li>
                  <li><strong>Non-emergency:</strong><br/>1-877-ASK-LAPD<br/>(1-877-275-5273)</li>
                  <li>
                    <strong>Online:</strong><br/>
                    <a href="https://www.lapdonline.org/" target="_blank" rel="noopener noreferrer">
                      www.lapdonline.org
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <section className="trust-section contact-info-box">
              <h3>Data Corrections</h3>
              <p>
                We do not control the crime data. If you believe there's an error in the crime records,
                please contact the LAPD directly:
              </p>
              <ul>
                <li>
                  <a href="https://www.lapdonline.org/" target="_blank" rel="noopener noreferrer">
                    LAPD Official Website
                  </a>
                </li>
                <li>
                  <a href="https://data.lacity.org/" target="_blank" rel="noopener noreferrer">
                    LA Open Data Portal
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <section className="trust-section">
          <h2>What to Include in Your Message</h2>
          <div className="message-tips-grid">
            <div className="tip-card">
              <h4>Bug Reports</h4>
              <ul>
                <li>What you were trying to do</li>
                <li>What happened instead</li>
                <li>Your browser and device</li>
                <li>Screenshots if possible</li>
              </ul>
            </div>

            <div className="tip-card">
              <h4>Feature Requests</h4>
              <ul>
                <li>What feature you'd like to see</li>
                <li>Why it would be useful</li>
                <li>How you envision it working</li>
                <li>Examples from other tools</li>
              </ul>
            </div>

            <div className="tip-card">
              <h4>Data Questions</h4>
              <ul>
                <li>Specific neighborhood/metric</li>
                <li>What seems incorrect</li>
                <li>What you expected to see</li>
                <li>Reference sources if applicable</li>
              </ul>
            </div>

            <div className="tip-card">
              <h4>Partnership Inquiries</h4>
              <ul>
                <li>Your organization/affiliation</li>
                <li>How you'd like to collaborate</li>
                <li>Benefits for both parties</li>
                <li>Your contact information</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <h2>Press & Media</h2>
          <p>
            If you're a journalist, researcher, or media organization interested in featuring LA Crime Map
            or using our data in your reporting, we're happy to help. Please contact us with:
          </p>
          <ul>
            <li>Your publication/organization</li>
            <li>The nature of your story or research</li>
            <li>Any specific data or insights you need</li>
            <li>Your deadline</li>
          </ul>
          <p>
            We can provide high-resolution screenshots, data exports, methodology explanations, and commentary
            for your story. Please allow 1-2 business days for media inquiries.
          </p>
        </section>

        <section className="trust-section">
          <h2>Contributing</h2>
          <p>
            Interested in contributing to LA Crime Map? We welcome contributions in various forms:
          </p>
          <ul>
            <li><strong>Code:</strong> If the project becomes open-source, we'll share repository details</li>
            <li><strong>Data:</strong> Suggestions for additional data sources or metrics</li>
            <li><strong>Design:</strong> UI/UX improvements and accessibility enhancements</li>
            <li><strong>Documentation:</strong> Help improve our help pages and guides</li>
            <li><strong>Translation:</strong> Interest in non-English language support</li>
          </ul>
          <p>Contact us to discuss how you can contribute.</p>
        </section>

        <div className="last-updated">
          Last Updated: February 2026
        </div>
      </div>
    </div>
  );
};

export default Contact;

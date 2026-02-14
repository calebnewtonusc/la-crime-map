import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility, FontSize } from '../contexts/AccessibilityContext';
import './AccessibilityPanel.css';

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { settings, updateSetting } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Trap focus within panel when open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Focus first element when panel opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('la-crime-map-language', lang);
    document.documentElement.lang = lang;
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('a11y.openSettings')}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        title={t('a11y.settings')}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 2C11.4477 2 11 2.44772 11 3V5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5V3C13 2.44772 12.5523 2 12 2Z"
            fill="currentColor"
          />
          <path
            d="M12 18C11.4477 18 11 18.4477 11 19V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V19C13 18.4477 12.5523 18 12 18Z"
            fill="currentColor"
          />
          <path
            d="M22 12C22 11.4477 21.5523 11 21 11H19C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13H21C21.5523 13 22 12.5523 22 12Z"
            fill="currentColor"
          />
          <path
            d="M6 12C6 11.4477 5.55228 11 5 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H5C5.55228 13 6 12.5523 6 12Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="accessibility-panel-overlay"
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}

      <div
        ref={panelRef}
        id="accessibility-panel"
        className={`accessibility-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-panel-title"
      >
        <div className="accessibility-panel-header">
          <h2 id="accessibility-panel-title">{t('a11y.settings')}</h2>
          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label={t('a11y.closeSettings')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="accessibility-panel-content">
          {/* High Contrast Mode */}
          <div className="setting-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="setting-checkbox"
              />
              <span className="setting-text">{t('a11y.highContrast')}</span>
            </label>
            <p className="setting-description">
              Increases color contrast for better readability
            </p>
          </div>

          {/* Colorblind Mode */}
          <div className="setting-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.colorblindMode}
                onChange={(e) => updateSetting('colorblindMode', e.target.checked)}
                className="setting-checkbox"
              />
              <span className="setting-text">{t('a11y.colorblindMode')}</span>
            </label>
            <p className="setting-description">
              Uses patterns and textures in addition to colors
            </p>
          </div>

          {/* Font Size */}
          <div className="setting-group">
            <label className="setting-label-block">
              <span className="setting-text">{t('a11y.fontSize')}</span>
            </label>
            <div className="font-size-buttons" role="group" aria-label={t('a11y.fontSize')}>
              {(['small', 'medium', 'large', 'xlarge'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  className={`font-size-button ${settings.fontSize === size ? 'active' : ''}`}
                  onClick={() => updateSetting('fontSize', size)}
                  aria-pressed={settings.fontSize === size}
                >
                  {t(`a11y.fontSize${size.charAt(0).toUpperCase() + size.slice(1)}` as any)}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="setting-group">
            <label className="setting-label-block">
              <span className="setting-text">{t('a11y.language')}</span>
            </label>
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-select"
              aria-label={t('a11y.language')}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          {/* Accessibility Statement Link */}
          <div className="setting-group">
            <a
              href="#accessibility-statement"
              className="accessibility-link"
              onClick={() => setIsOpen(false)}
            >
              {t('a11y.statement')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

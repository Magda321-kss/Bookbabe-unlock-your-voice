import { setVoice } from './tts.js';

document.addEventListener('DOMContentLoaded', () => {
  const voiceSelect = document.getElementById('voice-select');
  const languageToggle = document.getElementById('language-toggle');
  const listeningBoostToggle = document.getElementById('boost-toggle');
  const feedbackBtn = document.getElementById('feedback-btn');
  const privacyBtn = document.getElementById('privacy-policy-btn');
  const privacyModal = document.getElementById('privacy-modal');
  const closePrivacyBtn = document.getElementById('close-privacy');

  // Load saved settings
  const savedVoice = localStorage.getItem('bookbabe-voice') || 'Bianca';
  const savedLang = localStorage.getItem('bookbabe-lang') || 'en';
  const boostState = localStorage.getItem('bookbabe-boost') === 'true';

  voiceSelect.value = savedVoice;
  languageToggle.checked = savedLang === 'ny'; // Chichewa = 'ny'
  listeningBoostToggle.checked = boostState;

  // Set initial voice
  setVoice(savedVoice);

  // Change voice
  voiceSelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    setVoice(selected);
    localStorage.setItem('bookbabe-voice', selected);
  });

  // Toggle interface language
  languageToggle.addEventListener('change', (e) => {
    const lang = e.target.checked ? 'ny' : 'en';
    localStorage.setItem('bookbabe-lang', lang);
    window.location.reload(); // Reload to re-render interface
  });

  // Toggle Listening Boost
  listeningBoostToggle.addEventListener('change', (e) => {
    const isBoosted = e.target.checked;
    localStorage.setItem('bookbabe-boost', isBoosted);
    // May link to recognizer config here
  });

  // Feedback button
  feedbackBtn.addEventListener('click', () => {
    window.open('https://forms.gle/your-feedback-form', '_blank');
  });

  // Privacy Policy modal
  privacyBtn.addEventListener('click', () => {
    privacyModal.style.display = 'block';
  });

  closePrivacyBtn.addEventListener('click', () => {
    privacyModal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target == privacyModal) {
      privacyModal.style.display = 'none';
    }
  });
});

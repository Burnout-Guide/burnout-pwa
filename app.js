// Simple, robust translation system for PWA
(function() {
  'use strict';
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(console.error);
  }
  
  // Get saved language or default to English
  let currentLang = localStorage.getItem('lang') || 'en';
  
  // Crisis resources by language
  const crisisResources = {
    en: `
      <li><strong>988 Suicide & Crisis Lifeline</strong><br>Call or text 988 (US)</li>
      <li><strong>Crisis Text Line</strong><br>Text HOME to 741741</li>
      <li><strong>International Crisis Lines</strong><br>findahelpline.com</li>
    `,
    ru: `
      <li><strong>Телефон доверия</strong><br>8-800-2000-122 (Россия)</li>
      <li><strong>Психологическая помощь МЧС</strong><br>+7 (495) 989-50-50</li>
      <li><strong>Международные кризисные линии</strong><br>findahelpline.com</li>
    `
  };
  
  // Apply language
  function applyLanguage(lang) {
    // Update body data attribute
    document.body.setAttribute('data-lang', lang);
    
    // Update all elements with lang-content class
    const elements = document.querySelectorAll('.lang-content');
    elements.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });
    
    // Update crisis resources
    const crisisList = document.querySelector('.crisis-list');
    if (crisisList) {
      crisisList.innerHTML = crisisResources[lang];
    }
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Save preference
    localStorage.setItem('lang', lang);
    currentLang = lang;
  }
  
  // Initialize on DOM ready
  function init() {
    // Apply saved language
    applyLanguage(currentLang);
    
    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        if (lang && lang !== currentLang) {
          applyLanguage(lang);
        }
      });
    });
    
    // PWA install handling
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installBtn = document.getElementById('installBtn');
      if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', handleInstall);
      }
    });
    
    function handleInstall() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
          const installBtn = document.getElementById('installBtn');
          if (installBtn) installBtn.style.display = 'none';
        });
      }
    }
    
    // iOS install prompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               window.navigator.standalone === true;
    
    if (isIOS && !isInStandaloneMode) {
      const lastPrompt = localStorage.getItem('iosPrompt');
      const now = Date.now();
      
      if (!lastPrompt || now - parseInt(lastPrompt) > 604800000) { // 1 week
        setTimeout(() => {
          const iosPrompt = document.querySelector('.install-ios');
          if (iosPrompt) {
            iosPrompt.style.display = 'block';
            
            const closeBtn = iosPrompt.querySelector('.close-prompt');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                iosPrompt.style.display = 'none';
                localStorage.setItem('iosPrompt', now.toString());
              });
            }
          }
        }, 3000);
      }
    }
    
    // Card animations
    const cards = document.querySelectorAll('.card');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });
      
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
      });
    }
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
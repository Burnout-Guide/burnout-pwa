if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
  
  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  installBtn.style.display = 'none';
});

if (window.matchMedia('(display-mode: standalone)').matches || 
    window.navigator.standalone === true) {
  console.log('App is running in standalone mode');
}

let currentLang = localStorage.getItem('language') || 'en';

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  document.documentElement.lang = lang;
  
  const langToggle = document.getElementById('langToggle');
  const langFlag = langToggle.querySelector('.lang-flag');
  const langText = langToggle.querySelector('.lang-text');
  
  if (lang === 'ru') {
    langFlag.textContent = '🇷🇺';
    langText.textContent = 'RU';
  } else {
    langFlag.textContent = '🇺🇸';
    langText.textContent = 'EN';
  }
  
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    let translation = translations[lang];
    
    for (const k of keys) {
      translation = translation[k];
    }
    
    if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    } else {
      element.innerHTML = translation;
    }
  });
  
  const crisisSection = document.querySelector('[data-i18n="professional.crisis.title"]').parentElement;
  const crisisContent = crisisSection.querySelector('ul');
  if (lang === 'ru') {
    crisisContent.innerHTML = `
      <li><strong>Телефон доверия</strong><br>8-800-2000-122 (Россия)</li>
      <li><strong>Психологическая помощь МЧС</strong><br>+7 (495) 989-50-50</li>
      <li><strong>Международные кризисные линии</strong><br>findahelpline.com</li>
    `;
  } else {
    crisisContent.innerHTML = `
      <li><strong>988 Suicide & Crisis Lifeline</strong><br>Call or text 988 (US)</li>
      <li><strong>Crisis Text Line</strong><br>Text HOME to 741741</li>
      <li><strong>International Crisis Lines</strong><br>findahelpline.com</li>
    `;
  }
  
  const supportSection = document.querySelector('[data-i18n="professional.support.title"]').parentElement;
  const supportList = supportSection.querySelector('ul');
  const lastItem = supportList.lastElementChild;
  if (lang === 'ru') {
    if (lastItem.innerHTML.includes('Colorado')) {
      lastItem.innerHTML = '<strong>Жители Колорадо:</strong><br><a href="https://www.yourwavecounseling.com/" target="_blank" rel="noopener">Your Wave Counseling</a>';
    }
  } else {
    if (lastItem.innerHTML.includes('Колорадо')) {
      lastItem.innerHTML = '<strong>Colorado residents:</strong><br><a href="https://www.yourwavecounseling.com/" target="_blank" rel="noopener">Your Wave Counseling</a>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateLanguage(currentLang);
  
  const langToggle = document.getElementById('langToggle');
  langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    updateLanguage(newLang);
  });
  
  const cards = document.querySelectorAll('.card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
});
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
let installPromptShown = false;

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

function isMobileSafari() {
  return isIOS() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

function showIOSInstallBanner() {
  if (isMobileSafari() && !isInStandaloneMode()) {
    const hasSeenBanner = localStorage.getItem('iosInstallBannerSeen');
    const lastSeen = localStorage.getItem('iosInstallBannerLastSeen');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    if (!hasSeenBanner || (lastSeen && now - parseInt(lastSeen) > oneWeek)) {
      setTimeout(() => {
        const banner = document.getElementById('iosInstallBanner');
        if (banner) {
          banner.style.display = 'block';
          localStorage.setItem('iosInstallBannerLastSeen', now.toString());
        }
      }, 3000);
    }
  }
}

function showInstallPrompt() {
  if (!isInStandaloneMode() && !installPromptShown) {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
      setTimeout(() => {
        installPrompt.style.display = 'block';
        installPromptShown = true;
      }, 5000);
    }
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  const installBtn = document.getElementById('installBtn');
  const installPromptBtn = document.getElementById('installPromptBtn');
  
  if (installBtn) {
    installBtn.style.display = 'block';
  }
  
  showInstallPrompt();
  
  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        
        if (installBtn) installBtn.style.display = 'none';
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) installPrompt.style.display = 'none';
      });
    }
  };
  
  if (installBtn && !installBtn.hasAttribute('data-listener')) {
    installBtn.addEventListener('click', handleInstall);
    installBtn.setAttribute('data-listener', 'true');
  }
  
  if (installPromptBtn && !installPromptBtn.hasAttribute('data-listener')) {
    installPromptBtn.addEventListener('click', handleInstall);
    installPromptBtn.setAttribute('data-listener', 'true');
  }
});

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  const installBtn = document.getElementById('installBtn');
  const installPrompt = document.getElementById('installPrompt');
  const iosInstallBanner = document.getElementById('iosInstallBanner');
  
  if (installBtn) installBtn.style.display = 'none';
  if (installPrompt) installPrompt.style.display = 'none';
  if (iosInstallBanner) iosInstallBanner.style.display = 'none';
  
  localStorage.setItem('pwaInstalled', 'true');
});

if (isInStandaloneMode()) {
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
  
  showIOSInstallBanner();
  
  const iosCloseBanner = document.querySelector('.close-banner');
  if (iosCloseBanner) {
    iosCloseBanner.addEventListener('click', () => {
      const banner = document.getElementById('iosInstallBanner');
      if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('iosInstallBannerSeen', 'true');
      }
    });
  }
  
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
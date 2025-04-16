const flipSound = new Audio('flip.mp3');
const currentTheme = localStorage.getItem('theme') || 'light';
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
let speechEnabled = localStorage.getItem('speechEnabled') === 'true';
let currentLanguage = localStorage.getItem('language') || 'en';
let showAdultCategory = localStorage.getItem('showAdult') === 'true';

// Apply stored theme on page load
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
}

// --- Global variable for loop-back mode ---
const questionHistory = {};

// --- Global variable for enabled categories ---
let enabledCategories = JSON.parse(localStorage.getItem('enabledCategories'));
if (!enabledCategories) {
  // Assuming categories is defined in questions.js
  enabledCategories = Object.keys(categories);
  localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
}

// Utility function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Get references to UI elements
  const languageToggle = document.querySelector('.language-toggle');
  const adultToggle = document.querySelector('.adult-toggle');
  const soundToggle = document.querySelector('.sound-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const card = document.querySelector('.card');
  const back = document.querySelector('.back');
  const settingsToggle = document.querySelector('.settings-toggle'); // New settings button
  const settingsModal = document.getElementById('settings-modal');
  const settingsCategoriesContainer = document.getElementById('settings-categories');
  const settingsSave = document.getElementById('settings-save');
  const settingsCancel = document.getElementById('settings-cancel');

  const toast = document.getElementById('toast');

  function showToast(message) {
    console.log('----')

    toast.textContent = message;
    toast.classList.add('show');
  
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // ===== SETTINGS TOGGLE =====

const resetLoopbackBtn = document.querySelector('.reset-loopback');

if (resetLoopbackBtn) {
  resetLoopbackBtn.addEventListener('click', () => {
    for (let key in questionHistory) {
      questionHistory[key] = [];
    }
    showToast('✅ Refresh Question');
  });
}

  // ===== SOUND FUNCTIONS =====
  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundToggleLabel();
  }

  function playFlipSound() {
    if (soundEnabled) {
      flipSound.currentTime = 0;
      flipSound.play().catch(err => console.warn('Flip sound error:', err));
    }
  }

  function updateSoundToggleLabel() {
    if (soundToggle) {
      soundToggle.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', toggleSound);
    updateSoundToggleLabel();
  }

  // ===== THEME TOGGLE FUNCTIONS =====
  function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  }

  function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    updateThemeIcon();
  }

  // ===== LANGUAGE FUNCTIONS =====
  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', currentLanguage);
    languageToggle.textContent = getLanguageLabel(currentLanguage);
    renderCategories();
  }

  function getLanguageLabel(lang) {
    switch (lang) {
      case 'zh': return '中文';
      case 'en+zh': return 'EN + 中文';
      case 'en+zh+roman': return 'EN + 中文 + 拼音';
      case 'yue': return 'EN + 粤语';
      case 'en': return 'EN';
      default: return 'EN';
    }
  }

  // Cycle through languages with the toggle button
  const languageCycle = ['en', 'zh', 'en+zh', 'en+zh+roman', 'yue'];
  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      const currentIndex = languageCycle.indexOf(currentLanguage);
      const nextIndex = (currentIndex + 1) % languageCycle.length;
      setLanguage(languageCycle[nextIndex]);
    });
  }

  // Get language for speech synthesis
  function getTextToSpeechLanguage(currentLanguage) {
    switch (currentLanguage) {
      case 'yue': return 'zh-HK';
      case 'zh': return 'zh-CN';
      case 'en+zh': return 'zh-CN';
      case 'en+zh+roman': return 'zh-CN';
      case 'en': return 'en-US';
      default: return 'en-US';
    }
  }

  // ===== SPEECH FUNCTIONS =====
  const speakText = (text) => {
    if ('speechSynthesis' in window && speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getTextToSpeechLanguage(currentLanguage);
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not supported or disabled.");
    }
  };

  function toggleSpeech() {
    speechEnabled = !speechEnabled;
    localStorage.setItem('speechEnabled', speechEnabled);
    updateSpeechToggleLabel();
  }

  function updateSpeechToggleLabel() {
    const speechToggle = document.querySelector('.speech-toggle');
    if (speechToggle) {
      speechToggle.textContent = speechEnabled ? '🔊 Speech ON' : '🔇 Speech OFF';
    }
  }

  const speechToggle = document.querySelector('.speech-toggle');
  if (speechToggle) {
    speechToggle.addEventListener('click', toggleSpeech);
    updateSpeechToggleLabel();
  }

  // ===== ADULT MODE TOGGLE =====
  function toggleAdultMode() {
    showAdultCategory = !showAdultCategory;
    localStorage.setItem('showAdult', showAdultCategory);
    adultToggle.textContent = showAdultCategory ? '🔞 Adult ✅' : '🔞 Adult';
    renderCategories();
  }

  if (adultToggle) {
    adultToggle.addEventListener('click', toggleAdultMode);
  }

  // ===== SETTINGS OVERLAY FUNCTIONS =====
  function openSettings() {
    settingsCategoriesContainer.innerHTML = '';
    Object.keys(categories).forEach(cat => {
      const label = document.createElement('label');
      label.style.display = "block";
      label.style.marginBottom = "10px";
      const checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.value = cat;
      checkbox.checked = enabledCategories.includes(cat);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + cat));
      settingsCategoriesContainer.appendChild(label);
    });
    settingsModal.style.display = 'flex';
  }

  function closeSettings() {
    settingsModal.style.display = 'none';
  }

  if (settingsToggle) {
    settingsToggle.addEventListener('click', openSettings);
  }

  settingsCancel.addEventListener('click', closeSettings);
  
  settingsSave.addEventListener('click', () => {
    const checkboxes = settingsCategoriesContainer.querySelectorAll('input[type="checkbox"]');
    enabledCategories = [];
    checkboxes.forEach(cb => {
      if (cb.checked) {
        enabledCategories.push(cb.value);
      }
    });
    localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
    closeSettings();
    renderCategories();
  });

  // ===== RENDERING FUNCTIONS =====
  function renderCategories() {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    container.parentElement.querySelector('h2').textContent = getCategoryTitle();
    Object.keys(categories).forEach((cat) => {
      if (!enabledCategories.includes(cat)) return;
      if (cat === "Adult" && !showAdultCategory) return;
      if (cat === "Explore Deeper") return;
      
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.textContent = getCategoryLabel(cat);
      btn.onclick = (e) => {
        e.stopPropagation();
        showQuestion(cat);
      };
      container.appendChild(btn);
    });
  }

  function getCategoryTitle() {
    switch (currentLanguage) {
      case 'zh': return '请选择一个类别';
      case 'en+zh': return 'Select a Category / 请选择一个类别';
      case 'en+zh+roman': return 'Select a Category / 请选择一个类别';
      default: return 'Select a Category';
    }
  }
  
  function getCategoryLabel(cat) {
    const cnLabels = {
      "Career": "职业",
      "Travel": "旅行",
      "Hobbies": "爱好",
      "Fun Facts": "趣事",
      "Technology": "科技",
      "Explore Deeper": "深入探索",
      "Adult": "成人",
      "Dating History": "感情经历",
      "Attraction": "吸引力"
    };

    if (currentLanguage === 'zh') return cnLabels[cat] || cat;
    if (currentLanguage === 'en+zh') return `${cat} / ${cnLabels[cat] || cat}`;
    if (currentLanguage === 'en+zh+roman')
      return `${cat} / ${cnLabels[cat] || cat}`;
    return cat;
  }

  // ===== SHOW QUESTION FUNCTION =====
  function showQuestion(category) {
    const { question, speech } = getRandomQuestion(category);
    // Speak the question (if speechEnabled and supported)
    speakText(speech);
    document.getElementById('question-category').textContent = getCategoryLabel(category);
    document.getElementById('question-content').innerHTML = question;
    card.classList.add('flipped');
    playFlipSound();
  }
  
  // ===== LOOP-BACK MODE FOR QUESTIONS =====
  function getRandomQuestion(category) {
    const cat = categories[category];
    if (!cat) return { question: "No questions available.", speech: "" };
    
    const questionCount = cat.en.length;
    if (!questionHistory[category] || questionHistory[category].length === 0) {
      questionHistory[category] = Array.from({ length: questionCount }, (_, i) => i);
      shuffleArray(questionHistory[category]);
    }
    
    const index = questionHistory[category].pop();
    let question = '';
    let speech = '';
    switch (currentLanguage) {
      case 'en':
        question = cat.en[index];
        speech = question;
        break;
      case 'zh':
        question = cat.zh[index];
        speech = question;
        break;
      case 'en+zh':
        question = `${cat.en[index]}<br><br>${cat.zh[index]}`;
        speech = cat.zh[index];
        break;
      case 'en+zh+roman':
        question = `${cat.en[index]}<br><br>${cat.zh[index]}<br><br>${cat.zh_roman[index]}`;
        speech = cat.zh[index];
        break;
      case 'yue':
        question = `${cat.en[index]}<br><br>${cat.zh[index]}<br><br>${cat.zh_roman[index]}`;
        speech = cat.zh[index];
        break;  
      default:
        question = cat.en[index];
        speech = question;
    }
    return { question, speech };
  }
  
  // ===== FLIP BACK TO CATEGORY SELECTION =====
  back.addEventListener('click', () => {
    if (card.classList.contains('flipped')) {
      card.classList.remove('flipped');
      playFlipSound();
    }
  });
  
  // Initial UI setup
  setLanguage(currentLanguage);
  adultToggle.textContent = showAdultCategory ? '🔞 Adult ✅' : '🔞 Adult';
});

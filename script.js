(function() {
  // Remove intro after animation
  setTimeout(() => {
    const intro = document.getElementById('logo-intro');
    if (intro) intro.remove();
  }, 2000);

  // Constants & Initial State
  const CATEGORIES = categories1;
  const flipSound = new Audio('flip.mp3');

  // Application state
  const state = {
    soundEnabled: JSON.parse(localStorage.getItem('soundEnabled') ?? 'true'),
    speechEnabled: JSON.parse(localStorage.getItem('speechEnabled') ?? 'true'),
    useRandomCategory: JSON.parse(localStorage.getItem('useRandomCategory') ?? 'false'),
    themeIsDark: localStorage.getItem('theme') === 'dark',
    currentLanguage: localStorage.getItem('language') || 'en'
  };

  // History & categories
  const questionHistory = {};
  let enabledCategories = JSON.parse(localStorage.getItem('enabledCategories') || 'null');
  if (!enabledCategories) {
    enabledCategories = Object.keys(CATEGORIES);
    localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
  }

  // Utility: Fisher–Yates shuffle
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Generic toggle configurations
  const toggleConfigs = [
    {
      key: 'soundEnabled',
      selector: '.sound-toggle',
      onLabel: '🔊 Sound ON',
      offLabel: '🔇 Sound OFF'
    },
    {
      key: 'speechEnabled',
      selector: '.speech-toggle',
      onLabel: '🔊 Speech ON',
      offLabel: '🔇 Speech OFF'
    },
    {
      key: 'useRandomCategory',
      selector: '.random-toggle',
      onLabel: '🎲 Random ON',
      offLabel: '🎲 Random',
      onToggle: () => renderCategories()
    },
    {
      key: 'themeIsDark',
      selector: '.theme-toggle',
      onLabel: '☀️',
      offLabel: '🌙',
      storageKey: 'theme',
      onToggle: value => document.body.classList.toggle('dark', value)
    }
  ];

  // Initialize toggles
  toggleConfigs.forEach(cfg => {
    const el = document.querySelector(cfg.selector);
    if (!el) return;

    // Apply initial state
    if (cfg.onToggle) cfg.onToggle(state[cfg.key]);

    // Update label
    function updateLabel() {
      el.textContent = state[cfg.key]
        ? cfg.onLabel
        : cfg.offLabel;
    }

    el.addEventListener('click', () => {
      state[cfg.key] = !state[cfg.key];
      // Persist
      const valueToStore = cfg.storageKey === 'theme'
        ? (state.themeIsDark ? 'dark' : 'light')
        : state[cfg.key];
      localStorage.setItem(cfg.storageKey || cfg.key, JSON.stringify(valueToStore));
      if (cfg.onToggle) cfg.onToggle(state[cfg.key]);
      updateLabel();
    });

    updateLabel();
  });

  // Language toggle (cycle through options)
  const languageCycle = ['en','zh','en+zh','en+zh+roman','yue'];
  const languageToggleEl = document.querySelector('.language-toggle');
  function getLanguageLabel(lang) {
    switch(lang){
      case 'zh': return '中文';
      case 'en+zh': return 'EN + 中文';
      case 'en+zh+roman': return 'EN + 中文 + 拼音';
      case 'yue': return 'EN + 粤语';
      default: return 'EN';
    }
  }
  function setLanguage(lang) {
    state.currentLanguage = lang;
    localStorage.setItem('language', lang);
    languageToggleEl.textContent = getLanguageLabel(lang);
    renderCategories();
  }
  languageToggleEl?.addEventListener('click', () => {
    const idx = languageCycle.indexOf(state.currentLanguage);
    setLanguage(languageCycle[(idx + 1) % languageCycle.length]);
  });
  languageToggleEl.textContent = getLanguageLabel(state.currentLanguage);

  // Category settings modal
  const settingsModal  = document.getElementById('settings-modal');
  const settingsCats   = document.getElementById('settings-categories');
  document.querySelector('.settings-toggle')?.addEventListener('click', openSettings);
  document.getElementById('settings-cancel')?.addEventListener('click', () => settingsModal.style.display = 'none');

  document.getElementById('settings-save')?.addEventListener('click', () => {
    const checks = settingsCats.querySelectorAll('input[type=checkbox]');
    enabledCategories = Array.from(checks)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
    settingsModal.style.display = 'none';
    renderCategories();
  });

  function openSettings() {
    settingsCats.innerHTML = '';
    Object.keys(CATEGORIES).forEach(cat => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.cursor  = 'pointer';
      const input = document.createElement('input');
      input.type    = 'checkbox';
      input.value   = cat;
      input.checked = enabledCategories.includes(cat);
      label.append(input, document.createTextNode(` ${cat}`));
      settingsCats.appendChild(label);
    });
    settingsModal.style.display = 'flex';
  }

  // Render categories & questions
  function renderCategories() {
    const cont = document.getElementById('category-buttons');
    cont.innerHTML = '';
    cont.classList.toggle('single-btn', state.useRandomCategory);
    document.querySelector('.front h2').textContent = getCategoryTitle();

    const cats = state.useRandomCategory ? ['Random'] : Object.keys(CATEGORIES).filter(cat => enabledCategories.includes(cat));
    cats.forEach(cat => createCategoryButton(cat, cont));
  }

  function getCategoryTitle() {
    switch (state.currentLanguage) {
      case 'zh': return '请选择一个类别';
      case 'en+zh':
      case 'en+zh+roman':
      case 'yue': return 'Select a Category / 请选择一个类别';
      default: return 'Select a Category';
    }
  }

  function createCategoryButton(cat, container) {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat;
    btn.onclick = () => showQuestion(cat);
    container.appendChild(btn);
  }

  function showQuestion(cat) {
    if (cat === 'Random') {
      const pool = enabledCategories;
      cat = pool[Math.floor(Math.random() * pool.length)];
    }
    const { question, speech } = getRandomQuestion(cat);
    document.getElementById('question-category').textContent = cat;
    document.getElementById('question-content').innerHTML = question;
    document.querySelector('.card').classList.add('flipped');
    if (state.soundEnabled) playFlipSound();
    if (state.speechEnabled) speakText(speech);
    renderCategories();
  }

  function getRandomQuestion(cat) {
    const set = CATEGORIES[cat];
    if (!set) return { question: 'No questions.', speech: '' };
    const total = set.en.length;
    if (!questionHistory[cat] || questionHistory[cat].length === 0) {
      questionHistory[cat] = Array.from({ length: total }, (_, i) => i);
      shuffleArray(questionHistory[cat]);
    }
    const idx = questionHistory[cat].pop();
    let q, sp;
    switch (state.currentLanguage) {
      case 'zh': q = set.zh[idx]; sp = q; break;
      case 'en+zh': q = `${set.en[idx]}<br><br>${set.zh[idx]}`; sp = set.zh[idx]; break;
      case 'en+zh+roman':
      case 'yue': q = `${set.en[idx]}<br><br>${set.zh[idx]}<br><br>${set.zh_roman[idx]}`; sp = set.zh[idx]; break;
      default: q = set.en[idx]; sp = q;
    }
    return { question: q, speech: sp };
  }

  // Sound & speech helpers
  function playFlipSound() {
    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});
  }

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

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getTextToSpeechLanguage(state.currentLanguage);
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not supported or disabled.");
    }
  };

  // Card back button
  document.querySelector('.back')?.addEventListener('click', () => {
    const card = document.querySelector('.card');
    if (card.classList.contains('flipped')) {
      card.classList.remove('flipped');
      if (state.soundEnabled) playFlipSound();
    }
  });

  // Initial render
  document.addEventListener('DOMContentLoaded', renderCategories);
})();

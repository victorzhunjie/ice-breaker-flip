const flipSound = new Audio('flip.mp3');
const currentTheme = localStorage.getItem('theme') || 'light';
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
let currentLanguage = localStorage.getItem('language') || 'en';
let showAdultCategory = localStorage.getItem('showAdult') === 'true';

// Apply stored theme on page load
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const languageToggle = document.querySelector('.language-toggle');
  const adultToggle = document.querySelector('.adult-toggle');
  const soundToggle = document.querySelector('.sound-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const card = document.querySelector('.card');
  const back = document.querySelector('.back');

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

  // ===== THEME TOGGLE =====
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
    sessionStorage.setItem('language', currentLanguage);
    languageToggle.textContent = getLanguageLabel(currentLanguage);
    renderCategories();
  }

  function getLanguageLabel(lang) {
    switch (lang) {
      case 'zh': return '中文';
      case 'en+zh': return 'EN + 中文';
      case 'en+zh+roman': return 'EN + 中文 + 拼音';
      case 'en': return 'EN';
      default: return 'EN';
    }
  }

  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      switch (currentLanguage) {
        case 'en': setLanguage('zh'); break;
        case 'zh': setLanguage('en+zh'); break;
        case 'en+zh': setLanguage('en+zh+roman'); break;
        case 'en+zh+roman': setLanguage('en'); break;
        default: setLanguage('en'); break;
      }
    });
  }

  // ===== ADULT MODE TOGGLE =====
  function toggleAdultMode() {
    showAdultCategory = !showAdultCategory;
    sessionStorage.setItem('showAdult', showAdultCategory);
    adultToggle.textContent = showAdultCategory ? '🔞 Adult ✅' : '🔞 Adult';
    renderCategories();
  }

  if (adultToggle) {
    adultToggle.addEventListener('click', toggleAdultMode);
  }

  // ===== CATEGORY RENDERING =====
  function renderCategories() {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    container.parentElement.querySelector('h2').textContent = getCategoryTitle();

    for (const cat of Object.keys(categories)) {
      if (cat === "Attraction" && !showAdultCategory) continue;
      if (cat === "Adult" && !showAdultCategory) continue;

      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.textContent = getCategoryLabel(cat);
      btn.onclick = (e) => {
        e.stopPropagation();
        showQuestion(cat);
      };
      container.appendChild(btn);
    };
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
      "Career": "职业-Zhí yè",
      "Travel": "旅行-Lǚ xíng",
      "Hobbies": "爱好-Ài hào",
      "Fun Facts": "趣事-Qù shì",
      "Technology": "科技-Kē jì",
      "Explore Deeper": "深入探索-Shēn rù tàn suǒ",
      "Adult": "成人-Chéng rèn",
      "Dating History": "感情经历-Gǎnqíng jīnglì",
      "Attraction": "吸引力-Xī yǐn lì"
    };

    if (currentLanguage === 'zh') return cnLabels[cat] || cat;
    if (currentLanguage === 'en+zh') return `${cat} / ${cnLabels[cat] || cat}`;
    if (currentLanguage === 'en+zh+roman')
      // return `${cat} / ${cnLabels[cat] || cat} / ${getRomanization(cat)}`;
      return `${cat} / ${cnLabels[cat] || cat}`;
    return cat;
  }

  function getRomanization(cat) {
    return romanization[cat] || cat;
  }

  // ===== SHOW QUESTION =====
  function showQuestion(category) {
    const question = getRandomQuestion(category);
    document.getElementById('question-category').textContent = getCategoryLabel(category);
    document.getElementById('question-content').innerHTML = question;
    card.classList.add('flipped');
    playFlipSound();
  }

  function getRandomQuestion(category) {
    const cat = categories[category];
    if (currentLanguage === 'en') {
      return randomItem(cat.en);
    } else if (currentLanguage === 'zh') {
      return randomItem(cat.zh);
    } else if (currentLanguage === 'en+zh') {
      const index = Math.floor(Math.random() * cat.en.length);
      return `${cat.en[index]}<br><br>${cat.zh[index]}`;
    } else if (currentLanguage === 'en+zh+roman') {
      const index = Math.floor(Math.random() * cat.en.length);
      return `${cat.en[index]}<br><br>${cat.zh[index]}<br><br>${cat.zh_roman[index]}`;
    }
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Flip back to category selection
  back.addEventListener('click', () => {
    if (card.classList.contains('flipped')) {
      card.classList.remove('flipped');
      playFlipSound();
    }
  });

  // Initial UI setup
  setLanguage(currentLanguage);
  if (adultToggle) adultToggle.textContent = showAdultCategory ? '🔞 Adult ✅' : '🔞 Adult';
});

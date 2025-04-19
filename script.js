// script.js
setTimeout(() => {
  const intro = document.getElementById('logo-intro');
  if (intro) intro.remove();
}, 2000); // match your animation duration


// Categories
// const categorySets = {
//   Default: categories1,
//   Fun: categories2
// };
const categories = categories1
const flipSound = new Audio('flip.mp3');
const currentTheme = localStorage.getItem('theme') || 'light';
let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
let speechEnabled = localStorage.getItem('speechEnabled') === 'true';
let currentLanguage = localStorage.getItem('language') || 'en';
// let showAdultCategory = localStorage.getItem('showAdult') === 'true';
let useRandomCategory = localStorage.getItem('useRandomCategory') === 'true';

if (currentTheme === 'dark') {
  document.body.classList.add('dark');
}

// loop‑back history
const questionHistory = {};

// which categories are enabled
let enabledCategories = JSON.parse(localStorage.getItem('enabledCategories'));
if (!enabledCategories) {
  enabledCategories = Object.keys(categories);
  localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
}

// Fisher–Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // UI references
  const randomToggleEl = document.querySelector('.random-toggle');
  const languageToggle = document.querySelector('.language-toggle');
  // const adultToggle    = document.querySelector('.adult-toggle');
  const soundToggle    = document.querySelector('.sound-toggle');
  const speechToggleEl = document.querySelector('.speech-toggle');
  const themeToggle    = document.querySelector('.theme-toggle');
  const card           = document.querySelector('.card');
  const back           = document.querySelector('.back');
  const resetLoopback  = document.querySelector('.reset-loopback');
  const settingsToggle = document.querySelector('.settings-toggle');
  const settingsModal  = document.getElementById('settings-modal');
  const settingsCats   = document.getElementById('settings-categories');
  const categoryListSelect  = document.getElementById('category-list-select');
  const btnSave        = document.getElementById('settings-save');
  const btnCancel      = document.getElementById('settings-cancel');
  const toast          = document.getElementById('toast');

  // let selectedSetName = localStorage.getItem('selectedSet') || 'Default';
  // let categories = categorySets[selectedSetName];

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // Populate the dropdown
  // Object.keys(categorySets).forEach(name => {
  //   const opt = document.createElement('option');
  //   opt.value = name;
  //   opt.textContent = name;
  //   if (name === selectedSetName) opt.selected = true;
  //   categoryListSelect.append(opt);
  // });

  // function populateSelect() {
  //   // clear any existing options
  //   categoryListSelect.innerHTML = "";
  
  //   // populate from your categorySets keys
  //   Object.keys(categorySets).forEach(name => {
  //     const option = document.createElement("option");
  //     option.value = name;
  //     option.textContent = name;
  //     // pre‑select the current set
  //     if (name === selectedSetName) option.selected = true;
  //     categoryListSelect.appendChild(option);
  //   });
  // }

  document.querySelector('.settings-toggle').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'block';
    populateSelect();
  });

  // When the user picks a new set:
  // categoryListSelect.addEventListener('change', e => {
  //   selectedSetName = e.target.value;
  //   localStorage.setItem('selectedSet', selectedSetName);
  //   categories = categorySets[selectedSetName];
  //   // reset enabled/categories history
  //   enabledCategories = Object.keys(categories);
  //   localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));
  //   Object.keys(questionHistory).forEach(cat => questionHistory[cat] = []);
  //   renderCategories();
  // });

  // —— RANDOM CATEGORY ——
  function toggleRandom() {
    useRandomCategory = !useRandomCategory;
    localStorage.setItem('useRandomCategory', useRandomCategory);
    updateRandomLabel();
    renderCategories();
  }

  function updateRandomLabel() {
    randomToggleEl.textContent = useRandomCategory
      ? '🎲 Random ON'
      : '🎲 Random';
  }

  randomToggleEl?.addEventListener('click', toggleRandom);
  updateRandomLabel();

  // Reset loop‑back
  resetLoopback?.addEventListener('click', () => {
    Object.keys(questionHistory).forEach(cat => questionHistory[cat] = []);
    showToast('✅ Questions refreshed');
  });

  // —— SOUND —— 
  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundLabel();
  }
  function updateSoundLabel() {
    soundToggle.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
  }
  function playFlipSound() {
    if (soundEnabled) {
      flipSound.currentTime = 0;
      flipSound.play().catch(() => {});
    }
  }
  soundToggle?.addEventListener('click', toggleSound);
  updateSoundLabel();

  // —— SPEECH ——
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
    updateSpeechLabel();
  }
  function updateSpeechLabel() {
    speechToggleEl.textContent = speechEnabled ? '🔊 Speech ON' : '🔇 Speech OFF';
  }
  speechToggleEl?.addEventListener('click', toggleSpeech);
  updateSpeechLabel();

  // —— THEME ——
  function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeLabel();
  }
  function updateThemeLabel() {
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }
  themeToggle?.addEventListener('click', toggleTheme);
  updateThemeLabel();

  // —— LANGUAGE ——
  const languageCycle = ['en','zh','en+zh','en+zh+roman','yue'];
  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    languageToggle.textContent = getLanguageLabel(lang);
    renderCategories();
  }
  function getLanguageLabel(lang) {
    switch(lang){
      case 'zh': return '中文';
      case 'en+zh': return 'EN + 中文';
      case 'en+zh+roman': return 'EN + 中文 + 拼音';
      case 'yue': return 'EN + 粤语';
      default: return 'EN';
    }
  }

  languageToggle?.addEventListener('click', () => {
    const i = languageCycle.indexOf(currentLanguage);
    setLanguage(languageCycle[(i+1)%languageCycle.length]);
  });
  languageToggle.textContent = getLanguageLabel(currentLanguage);

  // —— SETTINGS OVERLAY ——
  function addCategoryCheckbox(cat) {
    const label = document.createElement('label');
    console.log('--', currentLanguage)
    label.innerHTML = `<input type="checkbox" value="${cat}" ${enabledCategories.includes(cat) ? 'checked' : ''}/> ${getCategoryLabel(cat)}`;
    settingsCats.append(label);
  }  
  function openSettings() {
    settingsCats.innerHTML = '';
    Object.keys(categories).forEach(addCategoryCheckbox);

    // Random-toggle
    // const randLabel = document.createElement('label');
    // randLabel.style.marginTop = '0.5rem';
    // randLabel.innerHTML = `<input id="random-checkbox" type="checkbox" ${useRandomCategory?'checked':''}/> Random`;
    // settingsCats.append(randLabel);

    settingsModal.style.display = 'flex';
  }
  function closeSettings() {
    settingsModal.style.display = 'none';
  }
  settingsToggle?.addEventListener('click', openSettings);
  btnCancel?.addEventListener('click', closeSettings);

  btnSave?.addEventListener('click', () => {
    // real categories
    const cats = settingsCats.querySelectorAll('input[type=checkbox][value]');
    enabledCategories = Array.from(cats)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    localStorage.setItem('enabledCategories', JSON.stringify(enabledCategories));

    // // random
    // const randCb = document.getElementById('random-checkbox');
    // useRandomCategory = randCb.checked;
    // localStorage.setItem('useRandomCategory', useRandomCategory);

    closeSettings();
    renderCategories();
  });

  // —— RENDER CATEGORIES ——  
  function createBtn(cat, container) {
    const b = document.createElement('button');
    b.className = 'category-btn';
    b.textContent = getCategoryLabel(cat);
    b.onclick = () => showQuestion(cat);
    container.append(b);
  }
  function renderCategories() {
    const cont = document.getElementById('category-buttons');
    cont.innerHTML = '';
    // add/remove the 'single-btn' class
    cont.classList.toggle('single-btn', useRandomCategory);

    document.querySelector('.front h2').textContent = getCategoryTitle();
  
    if (useRandomCategory) {
      createBtn('Random', cont);
    } else {
      Object.keys(categories).forEach(cat => {
        if (!enabledCategories.includes(cat)) return;
        createBtn(cat, cont);
      });
    }
  }

  function getCategoryTitle() {
    switch (currentLanguage) {
      case 'zh':
        return '请选择一个类别';
      case 'en+zh':
      case 'en+zh+roman':
      case 'yue':
        return 'Select a Category / 请选择一个类别';
      default:
        return 'Select a Category';
    }
  }
  function getCategoryLabel(cat){
    const cn = {
      'Get to Know You': '认识你',
      Hobbies:'爱好',
      'Fun Facts':'趣事',
      Career:'职业',
      Travel:'旅行',
      Reflection : "思考人生",
      Technology:'科技',
      'Dating History':'感情经历',
      'Dating':'约会',
      'First Time':'第一次',
      "What If": "假如",
      Random:'随机'
    };
    if(currentLanguage==='zh') return cn[cat]||cat;
    if(currentLanguage==='yue') return cn[cat]||cat;
    if(currentLanguage.startsWith('en+zh')) return `${cat} / ${cn[cat]||cat}`;
    return cat;
  }

  // —— SHOW QUESTION ——
  function showQuestion(cat) {
    if (cat==='Random') {
      // pick random from enabled
      // const pool = enabledCategories.filter(c=>c!=='Explore Deeper' && (c!=='Adult'||showAdultCategory));
      const pool = enabledCategories
      cat = pool[Math.floor(Math.random()*pool.length)]||pool[0];
    }
    const {question,speech} = getRandomQuestion(cat);
    console.log('------------',cat,question);
    document.getElementById('question-category').textContent = getCategoryLabel(cat);
    document.getElementById('question-content').innerHTML = question;
    card.classList.add('flipped');
    playFlipSound();
    if (speechEnabled) speakText(speech);
  }

  function getRandomQuestion(cat) {
    const set = categories[cat];
    if (!set) return {question:'No questions.',speech:''};
    const n = set.en.length;
    if (!questionHistory[cat] || questionHistory[cat].length===0) {
      questionHistory[cat] = Array.from({length:n},(_,i)=>i);
      shuffleArray(questionHistory[cat]);
    }
    const idx = questionHistory[cat].pop();
    let q='', sp='';
    switch(currentLanguage){
      case 'zh': q=set.zh[idx]; sp=q; break;
      case 'en+zh': q=`${set.en[idx]}<br><br>${set.zh[idx]}`; sp=set.zh[idx]; break;
      case 'en+zh+roman':
      case 'yue':
        q=`${set.en[idx]}<br><br>${set.zh[idx]}<br><br>${set.zh_roman[idx]}`; sp=set.zh[idx];
        break;
      default: q=set.en[idx]; sp=q;
    }
    return {question:q,speech:sp};
  }

  back.addEventListener('click',()=>{
    if(card.classList.contains('flipped')){
      card.classList.remove('flipped');
      playFlipSound();
    }
  });

  // initial render
  renderCategories();
});

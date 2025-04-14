const flipSound = new Audio('flip.mp3');

let currentLanguage = sessionStorage.getItem('language') || 'en';
let showAdultCategory = sessionStorage.getItem('showAdult') === 'true';
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
  document.body.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  const languageToggle = document.querySelector('.language-toggle');
  const adultToggle = document.querySelector('.adult-toggle');
  const card = document.querySelector('.card');
  const back = document.querySelector('.back');

  // Function to set language and update UI accordingly
  function setLanguage(lang) {
    currentLanguage = lang;
    sessionStorage.setItem('language', currentLanguage);
    languageToggle.textContent = getLanguageLabel(currentLanguage); // Update button text
    renderCategories();
  }

  // Returns label based on selected language
  function getLanguageLabel(lang) {
    switch (lang) {
      case 'zh': return '中文';
      case 'en+zh': return 'EN + 中文';
      case 'en+zh+roman': return 'EN + 中文 + 拼音';
      case 'en': return 'EN';
      default: return 'EN';
    }
  }

  languageToggle.addEventListener('click', () => {
    switch (currentLanguage) {
      case 'en':
        setLanguage('zh');
        break;
      case 'zh':
        setLanguage('en+zh');
        break;
      case 'en+zh':
        setLanguage('en+zh+roman');
        break;
      case 'en+zh+roman':
        setLanguage('en');
        break;
      default:
        setLanguage('en');
        break;
    }
  });

  // Adult toggle handler
  window.toggleAdultMode = () => {
    showAdultCategory = !showAdultCategory;
    sessionStorage.setItem('showAdult', showAdultCategory);
    adultToggle.textContent = showAdultCategory ? '🔞 Adult ✅' : '🔞 Adult';
    renderCategories();
  };

  // Expose dark theme toggle to global scope
  window.toggleTheme = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  };

  // Render category buttons based on questions.js data
  function renderCategories() {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    container.parentElement.querySelector('h2').textContent = getCategoryTitle();

    Object.keys(categories).forEach((cat) => {
      if (cat === "Explore Deeper") return;
      if (cat === "Adult" && !showAdultCategory) return;

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

  // Get the main title for the category selection
  function getCategoryTitle() {
    switch (currentLanguage) {
      case 'zh':
        return '请选择一个类别';
      case 'en+zh':
        return 'Select a Category / 请选择一个类别';
      case 'en+zh+roman':
        return 'Select a Category / 请选择一个类别 / 选择一个类别';
      default:
        return 'Select a Category';
    }
  }

  // Return category label based on language settings
  function getCategoryLabel(cat) {
    const cnLabels = {
      "Career": "职业",
      "Travel": "旅行",
      "Hobbies": "爱好",
      "Fun Facts": "趣事",
      "Technology": "科技",
      "Explore Deeper": "深入探索",
      "Adult": "成人"
    };

    if (currentLanguage === 'zh') return cnLabels[cat] || cat;
    if (currentLanguage === 'en+zh') return `${cat} / ${cnLabels[cat] || cat}`;
    if (currentLanguage === 'en+zh+roman') return `${cat} / ${cnLabels[cat] || cat} / ${getRomanization(cat)}`;
    return cat;
  }

  // Add Romanization for Chinese text
  function getRomanization(cat) {
    const romanization = {
      "Career": "Zhí yè",
      "Travel": "Lǚ xíng",
      "Hobbies": "Ài hào",
      "Fun Facts": "Qù shì",
      "Technology": "Kē jì",
      "Explore Deeper": "Shēn rù tàn suǒ",
      "Adult": "Chéng rèn"
    };
    return romanization[cat] || cat;
  }

  // Display a random question when a category button is clicked
  function showQuestion(category) {
    const question = getRandomQuestion(category);
    document.getElementById('question-category').textContent = getCategoryLabel(category);
    document.getElementById('question-content').innerHTML = question;
    card.classList.add('flipped');
    playFlipSound();
  }

  // Get a random question from the questions list for the selected category
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

  function playFlipSound() {
    flipSound.currentTime = 0;
    flipSound.play().catch(err => console.warn('Flip sound error:', err));
  }

  // Allow clicking the back side to flip back to the category selection
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

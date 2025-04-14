const categories = {
  "Career": {
    en: [
      "What job would you choose if money weren't a factor?",
      "What's your biggest career goal right now?",
      "What's a skill you wish you had for your job?",
      "Have you ever completely switched careers?",
      "What's your dream company to work for?"
    ],
    zh: [
      "如果不用担心钱，你想做什么工作？",
      "你目前最大的职业目标是什么？",
      "你希望拥有哪项职业技能？",
      "你是否曾经完全换过职业？",
      "你梦想为哪家公司工作？"
    ],
    zh_roman: [
      "Rúguǒ bùyòng dānxīn qián, nǐ xiǎng zuò shénme gōngzuò?",
      "Nǐ mùqián zuìdà de zhíyè mùbiāo shì shénme?",
      "Nǐ xīwàng yǒngyǒu nǎ xiàng zhíyè jìnéng?",
      "Nǐ shìfǒu céngjīng wánquán huànguò zhíyè?",
      "Nǐ mèngxiǎng wèi nǎ jiā gōngsī gōngzuò?"
    ]
  },
  "Travel": {
    en: [
      "What's your top travel destination?",
      "Do you prefer mountains or beaches?",
      "What's a city you could visit over and over?",
      "Have you ever traveled solo?",
      "What's your funniest travel story?"
    ],
    zh: [
      "你最想去哪个旅行目的地？",
      "你喜欢山还是海？",
      "哪个城市你想一去再去？",
      "你有没有一个人旅行过？",
      "你最搞笑的旅行经历是什么？"
    ],
    zh_roman: [
      "Nǐ zuì xiǎng qù nǎge lǚxíng mùdìdì?",
      "Nǐ xǐhuān shān háishì hǎi?",
      "Nǎge chéngshì nǐ xiǎng yī qù zài qù?",
      "Nǐ yǒu méiyǒu yīgè rén lǚxíng guò?",
      "Nǐ zuì gǎoxiào de lǚxíng jīnglì shì shénme?"
    ]
  },
  "Hobbies": {
    en: [
      "What's a hobby you've always wanted to try?",
      "What's your weirdest hobby?",
      "How do you usually spend your weekends?",
      "Do you prefer creative or physical hobbies?",
      "What hobby makes you lose track of time?"
    ],
    zh: [
      "你一直想尝试什么爱好？",
      "你最奇怪的爱好是什么？",
      "你周末通常怎么度过？",
      "你更喜欢创意类还是体力类爱好？",
      "什么爱好让你忘记时间？"
    ],
    zh_roman: [
      "Nǐ yīzhí xiǎng chángshì shénme àihào?",
      "Nǐ zuì qíguài de àihào shì shénme?",
      "Nǐ zhōumò tōngcháng zěnme dùguò?",
      "Nǐ gèng xǐhuān chuàngyì lèi háishì tǐlì lèi àihào?",
      "Shénme àihào ràng nǐ wàngjì shíjiān?"
    ]
  },
  "Fun Facts": {
    en: [
      "What's a fun fact most people don't know about you?",
      "What's the weirdest thing you’ve ever eaten?",
      "Can you do any impressions or party tricks?",
      "What’s a random talent you have?",
      "What’s the most unusual job you’ve ever had?"
    ],
    zh: [
      "别人不知道你的有趣事实是什么？",
      "你吃过最奇怪的食物是什么？",
      "你会表演模仿或派对技巧吗？",
      "你有什么冷门技能？",
      "你做过最不寻常的工作是什么？"
    ],
    zh_roman: [
      "Biérén bù zhīdào nǐ de yǒuqù shìshí shì shénme?",
      "Nǐ chīguò zuì qíguài de shíwù shì shénme?",
      "Nǐ huì biǎoyǎn mófǎng huò pàiduì jìqiǎo ma?",
      "Nǐ yǒu shénme lěngmén jìnéng?",
      "Nǐ zuòguò zuì bù xúnyáng de gōngzuò shì shénme?"
    ]
  },
  "Technology": {
    en: [
      "What’s a gadget you can’t live without?",
      "What’s your favorite app right now?",
      "Are you a Mac or PC person?",
      "If you could invent an app, what would it do?",
      "What's your opinion on AI taking over?"
    ],
    zh: [
      "你最离不开的科技产品是什么？",
      "你现在最喜欢的应用程序是什么？",
      "你更喜欢用Mac还是PC？",
      "如果你能发明一个应用，它会做什么？",
      "你如何看待人工智能的普及？"
    ],
    zh_roman: [
      "Nǐ zuì lí bù kāi de kējì chǎnpǐn shì shénme?",
      "Nǐ xiànzài zuì xǐhuān de yìngyòng chéngxù shì shénme?",
      "Nǐ gèng xǐhuān yòng Mac háishì PC?",
      "Rúguǒ nǐ néng fāmíng yīgè yìngyòng, tā huì zuò shénme?",
      "Nǐ rúhé kàndài réngōng zhìnéng de pǔjí?"
    ]
  },
  "Adult": {
    en: [
      "What's your funniest adult mishap?",
      "What's something you do that you wouldn't admit on a first date?",
      "What's a guilty pleasure that you secretly love?",
      "What's the most embarrassing thing that's happened at a pub?",
      "What's an adult challenge you've overcome?"
    ],
    zh: [
      "你有什么搞笑的成人失误？",
      "第一次约会时你不会承认的事是什么？",
      "你秘密喜爱的罪恶快感是什么？",
      "在酒吧里发生过最尴尬的事情是什么？",
      "你克服过的成人挑战是什么？"
    ],
    zh_roman: [
      "Nǐ yǒu shénme gǎoxiào de chéngrén shīwù?",
      "Dì yī cì yuēhuì shí nǐ bù huì chéngrèn de shì shì shénme?",
      "Nǐ mìmì xǐ'ài de zuì'è kuàigǎn shì shénme?",
      "Zài jiǔbā lǐ fāshēng guò zuì gāngà de shìqíng shì shénme?",
      "Nǐ kèfú guò de chéngrén tiǎozhàn shì shénme?"
    ]
  }
};

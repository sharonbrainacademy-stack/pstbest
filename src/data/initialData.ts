import { MinistryConfig, Sermon, WordCafeArticle, Book, MinistryEvent, DailyScripture, AdminUser } from '../types';

export const INITIAL_CONFIG: MinistryConfig = {
  pastorName: 'Pastor Eghosa Best IGBINOVIA (PST BEST EGHOSA)',
  ministryTitle: 'Prophetic Minister, Teacher of the Word, Author & Founder',
  churchName: 'Champions of Grace Assembly, Incorporated',
  churchServicesOverview: 'Champions of Grace Assembly, Incorporated, holds regular services, fellowships, prayer meetings, and special programmes throughout the month. These gatherings provide opportunities for worship, Bible teaching, prayer, spiritual growth, fellowship, and service.',
  branchHeadquarters: 'Grace Chapel (Headquarters — Igue-Iheya, Benin City, Edo State, Nigeria)',
  motto: 'Building Lives, Spreading the Gospel & Winning Souls at All Costs',
  announcementBanner: 'Welcome to PST BEST EGHOSA personal website.',
  phoneNumbers: ['+234803277524', '+2348023456789'],
  whatsappMinistryLine: '+234803277524',
  whatsappPrayerChannelUrl: 'https://whatsapp.com/channel/0029VbBwoo04o7qG1nuOLn0J',
  emails: ['pstbesteghosa@gmail.com', 'info@cgagracechapel.org', 'contact@pastorbesteghosa.org'],
  address: 'Grace Chapel International, Igue-Iheya, Benin City, Edo State, Nigeria',
  serviceTimes: [
    {
      id: 'svc-sunday-services',
      title: 'Sunday Services',
      day: 'Every Sunday',
      time: '6:30 a.m. – 10:30 a.m.',
      overallTime: '6:30 a.m. – 10:30 a.m.',
      category: 'Sunday Services',
      badge: 'Main Sunday Assembly',
      description: 'Overall Time: 6:30 a.m. – 10:30 a.m. The core Sunday worship assembly including Workers’ Prayer, Sunday School, and the Main Worship Service.',
      subServices: [
        {
          title: 'Workers’ Prayer Meeting',
          time: '6:30 a.m. – 7:00 a.m.',
          description: 'A time of prayer for church workers before the day’s services begin.'
        },
        {
          title: 'Sunday School',
          time: '7:00 a.m. – 8:00 a.m.',
          description: 'A dedicated time for systematic teaching and study of the Word of God.'
        },
        {
          title: 'Main Worship Service',
          time: '8:00 a.m. – 10:30 a.m.',
          description: 'The main Sunday worship service includes praise, worship, prayers, testimonies, ministrations, the teaching of God’s Word, giving, and the closing benediction.'
        }
      ]
    },
    {
      id: 'svc-wednesday-study',
      title: 'Wednesday Bible Study',
      day: 'Every Wednesday',
      time: '5:00 p.m. – 6:30 p.m.',
      category: 'Weekly Services',
      badge: 'Weekly Word Study',
      description: 'A weekly Bible study focused on teaching and understanding the Word of God and applying biblical principles to daily life.'
    },
    {
      id: 'svc-friday-prayer',
      title: 'Friday Prayer Meeting',
      day: 'Every Friday',
      time: '5:00 p.m. – 6:30 p.m.',
      category: 'Weekly Services',
      badge: 'Weekly Intercession',
      description: 'A weekly prayer gathering where members come together to seek God, intercede, and receive spiritual strength.'
    },
    {
      id: 'svc-anointing-communion',
      title: 'Anointing and Holy Communion Service',
      day: 'First Sunday of Every Month',
      frequency: 'First Sunday of every month',
      time: '8:00 a.m. – 12:00 noon',
      category: 'Special Sunday Services',
      badge: '1st Sunday of the Month',
      description: 'A special monthly service dedicated to worship, prayer, anointing, and Holy Communion.'
    },
    {
      id: 'svc-ministers-fellowship',
      title: 'Ministers’ Prayer and Fasting Fellowship',
      day: 'Every Second Monday of the Month',
      frequency: 'Every second Monday of the month',
      time: '9:00 a.m. – 12:00 p.m.',
      category: 'Ministers Fellowship',
      badge: 'Ministers In-House',
      description: 'This is an in-house fellowship specifically for ministers serving at Champions of Grace Assembly. It provides a dedicated time for ministers to pray, fast, seek God’s direction, strengthen one another, and intercede for the church and the work of God.'
    },
    {
      id: 'svc-psalm-91-fasting',
      title: 'Psalm 91 Three-Day Fasting and Prayer Programme',
      day: 'First or Second Week of Each Month',
      frequency: 'Held either in the first or second week of each month, as announced by the church',
      time: '8:00 a.m. – 12:00 noon',
      category: 'Monthly Programmes',
      badge: 'Monthly 3-Day Programme',
      description: 'The Psalm 91 Three-Day Fasting and Prayer Programme is held either in the first or second week of each month, as announced by the church. The programme provides a dedicated period for fasting, prayer, intercession, and seeking God’s intervention and protection.'
    }
  ],
  bankAccounts: [
    {
      bankName: 'Zenith Bank',
      accountName: 'Champions of Grace Assembly Inc.',
      accountNumber: '1012345678',
      purpose: 'Tithe & Offering'
    },
    {
      bankName: 'First Bank of Nigeria',
      accountName: 'Best Eghosa Ministry',
      accountNumber: '2034567890',
      purpose: 'Project & Missions'
    }
  ],
  primaryColor: '#C8102E', // Crimson Red
  accentColor: '#D4AF37', // Royal Gold
  navyColor: '#0A2342', // Regal Dark Navy
  heroImageUrl: 'https://i.postimg.cc/1zJvWQv9/9623BAC8-75C6-4928-A7F8-8E2930DC25CD.jpg',
  heroBanners: [
    {
      id: 'banner-1',
      imageUrl: 'https://i.postimg.cc/1zJvWQv9/9623BAC8-75C6-4928-A7F8-8E2930DC25CD.jpg',
      title: 'Pastor Eghosa Best IGBINOVIA',
      subtitle: 'Champions of Grace Assembly International — Grace Chapel Headquarters',
      linkUrl: 'events',
      linkText: 'Upcoming Prophetic Encounter',
      isActive: true
    }
  ],
  aboutExecutiveImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  pastorAndWifeImageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  wordCafeBannerUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  socials: {
    facebook: 'https://facebook.com/pstbesteghosa',
    youtube: 'https://youtube.com/@pstbesteghosa',
    instagram: 'https://instagram.com/pstbesteghosa',
    telegram: 'https://t.me/pstbesteghosaoutreach'
  }
};

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: 'sermon-1',
    title: 'Power in the Prophetic Mantle',
    scripture: '2 Kings 2:9-14 & Hosea 12:13',
    series: 'Kingdom Authority & Supernatural Alignment',
    duration: '1h 14m',
    durationSeconds: 4440,
    date: 'September 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Prophetic',
    description: 'Unveiling the mystery of divine transference, prophetic covering, and how by a prophet the Lord delivered Israel and preserved them.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89b7e7c8e.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    playsCount: 2840,
    isFeatured: true
  },
  {
    id: 'sermon-2',
    title: 'Walking in Uncommon Grace',
    scripture: '2 Corinthians 12:9 & Romans 5:17',
    series: 'The Exceeding Riches of His Grace',
    duration: '58m 20s',
    durationSeconds: 3500,
    date: 'August 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Grace',
    description: 'Grace is not an excuse for passivity; it is divine empowerment that substitutes human struggle with supernatural ease and favor.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=worship-ambient-atmosphere-112191.mp3',
    playsCount: 3410,
    isFeatured: true
  },
  {
    id: 'sermon-3',
    title: 'The Mystery of Prevailing Prayer',
    scripture: 'James 5:16-18 & Luke 18:1',
    series: 'Fire on the Altar Series',
    duration: '1h 22m',
    durationSeconds: 4920,
    date: 'July 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Prayer',
    description: 'Mastering the art of travailing in the secret place until decrees in the spirit realm manifest with undeniable physical precision.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_82e8111e11.mp3?filename=calm-meditation-ambient-prayer-7889.mp3',
    playsCount: 1980,
    isFeatured: true
  },
  {
    id: 'sermon-4',
    title: 'Grace for the Marketplace: Wealth Transfer Codes',
    scripture: 'Deuteronomy 8:18 & Isaiah 45:1-3',
    series: 'Kingdom Dominion & Financial Thrones',
    duration: '1h 05m',
    durationSeconds: 3900,
    date: 'June 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Kingdom Wealth',
    description: 'Breaking free from poverty covenants. The biblical strategy for capturing market territories and financing global evangelism.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8bbf7b9d3.mp3?filename=inspirational-piano-calm-10884.mp3',
    playsCount: 2210
  },
  {
    id: 'sermon-5',
    title: 'Total Deliverance from Generational Altars',
    scripture: 'Judges 6:25-28 & Colossians 2:14-15',
    series: 'Breaking Evil Foundations',
    duration: '1h 35m',
    durationSeconds: 5700,
    date: 'May 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Deliverance',
    description: 'A deep surgical analysis into family trees, ancestral limitations, and invoking the superior Blood of Jesus to establish permanent freedom.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7a759.mp3?filename=prophetic-soaking-intercession-1234.mp3',
    playsCount: 4120
  },
  {
    id: 'sermon-6',
    title: 'The Unstoppable Believer: Walking by Raw Faith',
    scripture: 'Hebrews 11:1-6 & Mark 11:22-24',
    series: 'Faith That Moves Mountains',
    duration: '52m 10s',
    durationSeconds: 3130,
    date: 'April 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Faith',
    description: 'How to silence doubt, lay hold on God’s eternal promises, and see invisible realities crystallize into physical victories.',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=gentle-acoustic-reflection-11234.mp3',
    playsCount: 1750
  }
];

export const INITIAL_WORD_CAFE_ARTICLES: WordCafeArticle[] = [
  {
    id: 'article-1',
    title: 'The Secret Place of Prophetic Vision',
    subtitle: 'Ascending the hill of the Lord to hear what He will speak',
    author: 'Pastor Eghosa Best IGBINOVIA',
    date: 'September 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    scriptureRef: 'Habakkuk 2:1-3',
    tags: ['Prophetic', 'Secret Place', 'Spiritual Hearing'],
    excerpt: 'Many believers struggle to discern God’s voice because their inner ears are flooded with the noise of the marketplace. Spiritual elevation requires intentional isolation.',
    content: `In the kingdom of God, sight precedes possession. What you cannot see in the spirit, you cannot manifest in the natural. When God called Habakkuk, the mandate was unequivocal: "I will stand my watch and set myself on the rampart, and watch to see what He will say to me."

Notice the paradoxical scripture: "watch to see what He will SAY." In the prophetic dimension, God’s voice is visual; His instructions arrive as illumination.

To cultivate an acute prophetic ear:
1. Silence the clamor of anxious thoughts.
2. Immerse your spirit in the unadulterated written Word.
3. Cultivate extended praying in the Holy Ghost.
4. Keep a dedicated journal to record divine promptings without cynicism.

When God speaks, peace settles like morning dew. You move from running blindly into running with divine speed.`,
    prayerDeclaration: 'Father, unclog my spiritual sensory gates. I refuse to stumble in darkness. From this day, my eyes behold visions of glory and my ears hear the voice of direction behind me saying, "This is the way, walk in it."'
  },
  {
    id: 'article-2',
    title: 'Grace That Defies Human Logic',
    subtitle: 'How unmerited favor overrides qualified contenders',
    author: 'Pastor Eghosa Best IGBINOVIA',
    date: 'August 2026',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    scriptureRef: '1 Corinthians 1:26-29',
    tags: ['Grace', 'Supernatural Favor', 'Kingdom Acceleration'],
    excerpt: 'When grace steps into a matter, human protocols collapse. You don’t need an apology from those who bypassed you; grace will seat you at tables they never anticipated.',
    content: `The world operates on a meritocracy — sweat, network, pedigree, and ruthless competition. While excellence is commendable, kingdom advancement operates by a higher constitution: the Law of Sovereign Grace.

David was in the wilderness tending sheep, completely forgotten by his father Jesse during the royal vetting. Yet when the prophet Samuel arrived, the horn of oil refused to pour upon Eliab’s towering stature or Abinadab’s impressive credentials. Heaven had cast its ballot for the overlooked shepherd boy.

Grace does not eliminate diligence; grace dignifies your obedience. Grace is the fragrance of Christ upon an ordinary vessel that makes kings search for you in obscurity.`,
    prayerDeclaration: 'I declare that the mantle of uncommon grace surrounds me like a shield. Where doors were shut against my ancestry, royal gates swing wide open for me this season in Jesus’ name!'
  },
  {
    id: 'article-3',
    title: 'The Law of Spiritual Alignment in the Marketplace',
    subtitle: 'Positioning your business, career, and investments under the open heaven',
    author: 'Pastor Eghosa Best IGBINOVIA',
    date: 'July 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    scriptureRef: 'Deuteronomy 8:18 & Genesis 26:12-14',
    tags: ['Marketplace', 'Wealth Transfer', 'Prophetic Strategy'],
    excerpt: 'Wealth in God’s hands is not for vanity or ostentatious pride; it is a weapon for establishing covenant on earth and financing the end-time harvest of souls.',
    content: `Isaac sowed in the year of famine and reaped a hundredfold in the same year because he was in spiritual alignment with God’s geographical instruction.

Many believers run viable businesses with worldly mindsets. Kingdom wealth requires:
1. Covenant fidelity — faithful tithes and sacrificial kingdom partnership.
2. Integrity in transactions — zero compromise on righteous weights and measures.
3. Prophetic intelligence — inquiring of the Lord before mergers, investments, and expansion.

When your business is designated as a financial outpost for Champions of Grace World Outreach, God protects your enterprise from devourers.`,
    prayerDeclaration: 'Lord, give me ideas that rule industries. Anoint my hands with the dew of heaven and connect me with kingdom destinies for global impact.'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Power in the Prophetic',
    subtitle: 'Unlocking the Dimensions of Spiritual Sight, Decrees & Apostolic Preservation',
    author: 'Pastor Eghosa Best IGBINOVIA',
    pages: 248,
    year: '2025',
    format: 'Paperback & Digital eBook',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'A revolutionary prophetic handbook exploring biblical dynamics of hearing God, decreeing heaven’s verdicts, shutting down demonic verdicts, and deploying prophetic intelligence for personal and territorial dominion.',
    keyRevelations: [
      'The difference between psychic counterfeits and genuine Holy Ghost prophetic flow.',
      'How to activate the spirit of counsel and might in daily decisions.',
      'The legal jurisdiction of prophetic decrees over generational sickness and delay.',
      'Maintaining character purity while operating under high spiritual power.'
    ],
    chapters: [
      'Chapter 1: The Anatomy of Prophetic Calling',
      'Chapter 2: The Secret Place & Spiritual Frequency',
      'Chapter 3: Decrees That Shift Atmospheres',
      'Chapter 4: Confronting Territorial Witchcraft',
      'Chapter 5: Guarding the Anointing Through Humility'
    ],
    featuredQuote: '“A prophetic decree is not a wish; it is an executive warrant issued by the Supreme Court of Heaven.”',
    priceNgn: 4500
  },
  {
    id: 'book-2',
    title: 'Walking in Uncommon Grace',
    subtitle: 'Experiencing the Limitless Superabundance of Unearned Favor',
    author: 'Pastor Eghosa Best IGBINOVIA',
    pages: 210,
    year: '2024',
    format: 'Hardcover & Digital eBook',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'Discover how God’s unmerited favor obliterates human calculations. Pastor Best unravels the mystery of grace that elevated Joseph from prison to prime minister, Esther from orphan to queen, and transforms ordinary lives into global wonders.',
    keyRevelations: [
      'The multi-faceted dimensions of the grace of God.',
      'Breaking free from the spirit of toil and endless struggles.',
      'How grace attracts divine helpers from unexpected quarters.',
      'Sustaining the grace atmosphere in times of adversity.'
    ],
    chapters: [
      'Chapter 1: Beyond Human Qualifications',
      'Chapter 2: The Currency of Favor',
      'Chapter 3: When Mercy Speaks over Judgment',
      'Chapter 4: The Grace Magnet for Destiny Helpers',
      'Chapter 5: Reigning in Life as Kings'
    ],
    featuredQuote: '“When Grace arrives, sweat ceases and wonder begins.”',
    priceNgn: 4000
  },
  {
    id: 'book-3',
    title: 'The Mystery of Prevailing Prayer',
    subtitle: 'Birthing Supernatural Realities on the Altar of Midnight Warfare',
    author: 'Pastor Eghosa Best IGBINOVIA',
    pages: 280,
    year: '2025',
    format: 'Paperback & Digital eBook',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37271?auto=format&fit=crop&w=800&q=80',
    description: 'Prayer is not an occasional religious duty; it is the spiritual control room where earthly affairs are legislated. Learn warfare principles that shatter stubborn obstacles, silence ancestral voices, and command immediate angelic assistance.',
    keyRevelations: [
      'The power of midnight prayer watches and their strategic importance.',
      'Praying with covenant scriptures that God cannot deny.',
      'Dismantling satanic blockades erected against your promotion.',
      'Cultivating unceasing communion with the Holy Spirit.'
    ],
    chapters: [
      'Chapter 1: The Altar of Prevailing Intercession',
      'Chapter 2: The Mystery of Midnight Watches',
      'Chapter 3: Pleading Your Case in the Court of Heaven',
      'Chapter 4: Breaking Ancient Curses and Covenants',
      'Chapter 5: Releasing Angelic Reinforcements'
    ],
    featuredQuote: '“The man who kneels before God can stand before any challenge on earth without trembling.”',
    priceNgn: 5000
  },
  {
    id: 'book-4',
    title: 'Grace for the Marketplace',
    subtitle: 'Dominion Strategies for Business Pioneers, Professionals & Visionaries',
    author: 'Pastor Eghosa Best IGBINOVIA',
    pages: 224,
    year: '2026',
    format: 'Paperback & Digital eBook',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    description: 'God did not call the Church to remain inside four walls. This book serves as a divine blueprint for taking boardrooms, financial institutions, governance, and technology for the Kingdom of God.',
    keyRevelations: [
      'The Daniel Mandate: excelling in secular environments without moral compromise.',
      'Unlocking kingdom wealth through covenant seed and sacrificial giving.',
      'Receiving prophetic innovation and problem-solving secrets from heaven.',
      'Transforming businesses into thriving outposts of gospel financing.'
    ],
    chapters: [
      'Chapter 1: The Believer in the Boardroom',
      'Chapter 2: Divine Intelligence & Business Innovation',
      'Chapter 3: Overcoming Economic Famines',
      'Chapter 4: Covenant Partnership and Supernatural Supply',
      'Chapter 5: Becoming a Generational Pillar'
    ],
    featuredQuote: '“You are not just doing business; you are occupying commercial territory until Jesus returns.”',
    priceNgn: 4500
  }
];

export const INITIAL_EVENTS: MinistryEvent[] = [
  {
    id: 'event-1',
    title: 'Benin City Prophetic Fire & Deliverance Convention 2026',
    theme: '“The Reign of Sovereign Grace & Unstoppable Power”',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    time: '5:00 PM Daily & 10:00 PM Friday Vigil',
    venue: 'Grace Chapel International Headquarters, Igue-Iheya, Benin City, Edo State, Nigeria',
    minister: 'Pst Best Eghosa & Guest Anointed Minstrels',
    description: 'Four power-packed days of raw apostolic demonstrations, blind eyes opening, deaf ears unstopped, prophetic decrees, and total deliverance from generational captivity.',
    isFeatured: true,
    category: 'Conference',
    rsvpCount: 1450
  },
  {
    id: 'event-2',
    title: 'Champions Night of Prophetic Wonders & Vigil',
    theme: '“Breaking the Gates of Brass & Cutting the Bars of Iron”',
    startDate: '2026-09-25',
    time: '11:00 PM – 4:00 AM Prompt',
    venue: 'Grace Chapel Auditorium, Igue-Iheya, Benin City',
    minister: 'Pastor Eghosa Best IGBINOVIA',
    description: 'An all-night prophetic vigil dedicated to breaking ancestral yokes, commanding financial turnarounds, and receiving mantle upgrades for the upcoming quarter.',
    isFeatured: true,
    category: 'Vigil',
    rsvpCount: 890
  },
  {
    id: 'event-3',
    title: 'Word Café Live: Supernatural Alignment Masterclass',
    theme: '“Sip. Study. Soak. Transform.”',
    startDate: '2026-10-03',
    time: '9:00 AM – 1:00 PM',
    venue: 'Executive Fellowship Hall & Online Livestream',
    minister: 'Pastor Eghosa Best IGBINOVIA',
    description: 'An intimate, high-impact teaching intensive for pastors, business owners, professionals, and church leaders on hearing God and dominating in their fields.',
    isFeatured: false,
    category: 'Special Service',
    rsvpCount: 420
  },
  {
    id: 'event-4',
    title: 'Psalm 91 Three-Day Fasting and Prayer Programme',
    theme: '“Divine Protection, Supernatural Intervention & Covenant Exemption”',
    startDate: 'First / Second Week of Each Month (As Announced)',
    time: '8:00 a.m. – 12:00 noon Daily',
    venue: 'Grace Chapel Auditorium, Igue-Iheya, Benin City & Virtual Broadcast',
    minister: 'Pastor Eghosa Best IGBINOVIA',
    description: 'A monthly three-day sacred convocation for intense fasting, intercession, prayer, and invoking the divine covenant of Psalm 91 for family preservation and victory.',
    isFeatured: true,
    category: 'Special Service',
    rsvpCount: 1280
  },
  {
    id: 'event-5',
    title: 'Anointing and Holy Communion Service',
    theme: '“The Mystery of the Covenant Table & the Prophetic Oil”',
    startDate: 'First Sunday of Every Month',
    time: '8:00 a.m. – 12:00 noon Prompt',
    venue: 'Grace Chapel International Headquarters, Igue-Iheya, Benin City',
    minister: 'Pastor Eghosa Best IGBINOVIA',
    description: 'A special monthly service dedicated to worship, prevailing prayer, Holy Communion at the Lord’s Table, and prophetic anointing for supernatural breakthroughs.',
    isFeatured: true,
    category: 'Special Service',
    rsvpCount: 1650
  }
];

export const PROPHETIC_SCRIPTURES: DailyScripture[] = [
  {
    verse: '“And by a prophet the Lord brought Israel out of Egypt, and by a prophet was he preserved.”',
    reference: 'Hosea 12:13',
    propheticTheme: 'Supernatural Preservation & Deliverance',
    reflection: 'The prophetic mantle is God’s divine instrument for deliverance and long-term preservation. You are not scheduled for destruction.',
    declaration: 'I declare that under divine prophetic covering, every demonic limitation over my life is broken. I walk out of every spiritual Egypt into my wealthy place!'
  },
  {
    verse: '“For the Lord will do nothing, but he revealeth his secret unto his servants the prophets.”',
    reference: 'Amos 3:7',
    propheticTheme: 'Divine Revelation & Advance Intelligence',
    reflection: 'God never leaves His children stranded in the dark. He broadcasts His council to the watchful, guiding every strategic step.',
    declaration: 'My spiritual ears are sensitive. Confusion is permanently eliminated from my decisions. I will never run into unseen traps!'
  },
  {
    verse: '“And God is able to make all grace abound toward you; that ye, always having all sufficiency in all things, may abound to every good work.”',
    reference: '2 Corinthians 9:8',
    propheticTheme: 'All-Sufficient Grace',
    reflection: 'Grace does not merely manage deficit; grace produces an overflow so that you become a reservoir of blessing to nations.',
    declaration: 'Uncommon grace speaks for me today. I will not beg or crawl through life; heaven finances every vision God has planted in my spirit!'
  },
  {
    verse: '“Believe in the Lord your God, so shall ye be established; believe his prophets, so shall ye prosper.”',
    reference: '2 Chronicles 20:20',
    propheticTheme: 'Establishment & Prospering',
    reflection: 'Faith in God establishes your foundation, and honor for the prophetic voice accelerates your tangible prosperity.',
    declaration: 'I receive every prophetic word spoken over my life. Today marks the beginning of my undeniable rising and unstoppable speed!'
  },
  {
    verse: '“Thou shalt also decree a thing, and it shall be established unto thee: and the light shall shine upon thy ways.”',
    reference: 'Job 22:28',
    propheticTheme: 'The Decree of Authority',
    reflection: 'When your words align with heaven’s decrees, authority is released to alter earthly conditions immediately.',
    declaration: 'I boldly decree health, peace, supernatural favor, and open doors over my family and calling in the mighty name of Jesus!'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Pst Best Eghosa (Lead Pastor)',
    email: 'pstbesteghosa@gmail.com',
    role: 'Super Admin',
    lastLogin: 'Today, 08:30 PM',
    canManageSettings: true,
    canManageSermons: true,
    canManageBookings: true
  },
  {
    id: 'admin-2',
    name: 'Grace Chapel Media Minister',
    email: 'info@cgagracechapel.org',
    role: 'Media Minister',
    lastLogin: 'Yesterday, 04:15 PM',
    canManageSettings: false,
    canManageSermons: true,
    canManageBookings: false
  },
  {
    id: 'admin-3',
    name: 'Pastoral Protocol Officer',
    email: 'contact@pastorbesteghosa.org',
    role: 'Protocol Officer',
    lastLogin: '3 days ago',
    canManageSettings: false,
    canManageSermons: false,
    canManageBookings: true
  }
];

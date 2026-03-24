const SETTINGS_KEY = 'vdOverlayTools.settings.v1';
const AUTH_PREFS_KEY = 'vdOverlayTools.auth.v1';
const DEFAULT_AUTH_SERVER_URL = 'https://rings-hip-favourite-yards.trycloudflare.com';
const LEGACY_AUTH_SERVER_URLS = new Set([
  'https://elderly-upload-cooperative-smaller.trycloudflare.com',
  'https://idaho-discussions-lid-generates.trycloudflare.com',
  'https://nursing-conjunction-multi-des.trycloudflare.com',
  'https://treatments-downloading-ellis-desired.trycloudflare.com'
]);

const mapsNA = [
  'BayHarbor',
  'BloodBath',
  'Firelink',
  'Mercy',
  'Village',
  'Woodview'
];

const mapsEU = [
  'EUMap1',
  'EUMap2',
  'EUMap3',
  'EUMap4',
  'EUMap5',
  'EUMap6'
];

const mapsOrder = mapsNA;
const allKnownMaps = Array.from(new Set([...mapsNA, ...mapsEU]));
const mapRegionByName = new Map([
  ...mapsNA.map((name) => [name, 'NA']),
  ...mapsEU.map((name) => [name, 'EU'])
]);
const TOURNAMENT_KILLER_OPTIONS = ['Myers', 'Veil', 'Jacket', 'Hidden', 'Jason', 'Abysswalker', 'The Cure'];

const FONT_OPTIONS = [
  'Segoe UI',
  'Arial',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Lucida Console',
  'Palatino Linotype',
  'Book Antiqua',
  'Impact',
  'Comic Sans MS',
  'Candara',
  'Calibri',
  'Cambria',
  'Consolas',
  'Constantia',
  'Corbel',
  'Franklin Gothic Medium',
  'Gill Sans MT',
  'Century Gothic',
  'Baskerville Old Face',
  'Perpetua',
  'Rockwell',
  'Copperplate Gothic',
  'MS Gothic',
  'Yu Gothic',
  'Meiryo',
  'Malgun Gothic',
  'SimSun',
  'SimHei',
  'Microsoft YaHei',
  'Nirmala UI',
  'Leelawadee UI',
  'Ebrima',
  'Bahnschrift',
  'Dubai',
  'Sitka',
  'Aptos',
  'Optima',
  'Futura',
  'Didot',
  'American Typewriter',
  'Avenir',
  'Avenir Next',
  'Helvetica',
  'Helvetica Neue',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Raleway',
  'Merriweather',
  'Nunito',
  'Rubik',
  'Inter',
  'PT Sans',
  'PT Serif',
  'Source Sans Pro',
  'Source Serif Pro',
  'Playfair Display',
  'Bebas Neue',
  'Josefin Sans',
  'Quicksand',
  'Work Sans',
  'Inconsolata',
  'Fira Sans',
  'Fira Code',
  'JetBrains Mono',
  'IBM Plex Sans',
  'IBM Plex Serif',
  'Noto Sans',
  'Noto Serif',
  'Noto Sans JP',
  'Noto Sans KR',
  'Noto Sans SC',
  'DM Sans',
  'Manrope',
  'Karla',
  'Cabin',
  'Arvo',
  'Abril Fatface',
  'Anton',
  'Barlow',
  'Exo 2',
  'Hind',
  'Mukta',
  'Teko',
  'Titillium Web',
  'Ubuntu',
  'Vollkorn',
  'Zilla Slab',
  'Libre Baskerville',
  'Space Grotesk',
  'Space Mono',
  'Caveat'
];

const SUPPORTED_LANGUAGES = [
  'English',
  'Mandarin Chinese',
  'Hindi',
  'Spanish',
  'French',
  'Arabic',
  'Bengali',
  'Portuguese',
  'Russian',
  'Urdu'
];

const I18N = {
  'Sign In To VD OverlayTools': {
    'Mandarin Chinese': '登录 VD OverlayTools',
    Hindi: 'VD OverlayTools में साइन इन करें',
    Spanish: 'Iniciar sesion en VD OverlayTools',
    French: 'Connexion a VD OverlayTools',
    Arabic: 'تسجيل الدخول إلى VD OverlayTools',
    Bengali: 'VD OverlayTools এ সাইন ইন করুন',
    Portuguese: 'Entrar no VD OverlayTools',
    Russian: 'Войти в VD OverlayTools',
    Urdu: 'VD OverlayTools میں سائن ان کریں'
  },
  'Username': {
    'Mandarin Chinese': '用户名', Hindi: 'यूजरनेम', Spanish: 'Usuario', French: 'Nom d utilisateur', Arabic: 'اسم المستخدم', Bengali: 'ইউজারনেম', Portuguese: 'Nome de usuario', Russian: 'Имя пользователя', Urdu: 'یوزرنیم'
  },
  'Password': {
    'Mandarin Chinese': '密码', Hindi: 'पासवर्ड', Spanish: 'Contrasena', French: 'Mot de passe', Arabic: 'كلمة المرور', Bengali: 'পাসওয়ার্ড', Portuguese: 'Senha', Russian: 'Пароль', Urdu: 'پاس ورڈ'
  },
  'Languages': {
    'Mandarin Chinese': '语言', Hindi: 'भाषाएं', Spanish: 'Idiomas', French: 'Langues', Arabic: 'اللغات', Bengali: 'ভাষা', Portuguese: 'Idiomas', Russian: 'Языки', Urdu: 'زبانیں'
  },
  'Remember me': {
    'Mandarin Chinese': '记住我', Hindi: 'मुझे याद रखें', Spanish: 'Recordarme', French: 'Se souvenir de moi', Arabic: 'تذكرني', Bengali: 'আমাকে মনে রাখুন', Portuguese: 'Lembrar de mim', Russian: 'Запомнить меня', Urdu: 'مجھے یاد رکھیں'
  },
  'Login': {
    'Mandarin Chinese': '登录', Hindi: 'लॉगिन', Spanish: 'Iniciar sesion', French: 'Connexion', Arabic: 'تسجيل الدخول', Bengali: 'লগইন', Portuguese: 'Entrar', Russian: 'Войти', Urdu: 'لاگ ان'
  },
  'Create Account': {
    'Mandarin Chinese': '创建账户', Hindi: 'खाता बनाएं', Spanish: 'Crear cuenta', French: 'Creer un compte', Arabic: 'إنشاء حساب', Bengali: 'অ্যাকাউন্ট তৈরি করুন', Portuguese: 'Criar conta', Russian: 'Создать аккаунт', Urdu: 'اکاؤنٹ بنائیں'
  },
  'Back to Login': {
    'Mandarin Chinese': '返回登录', Hindi: 'लॉगिन पर वापस जाएं', Spanish: 'Volver a iniciar sesion', French: 'Retour a la connexion', Arabic: 'العودة لتسجيل الدخول', Bengali: 'লগইনে ফিরে যান', Portuguese: 'Voltar ao login', Russian: 'Вернуться ко входу', Urdu: 'لاگ ان پر واپس جائیں'
  },
  'Map overlay enabled': {
    'Mandarin Chinese': '启用地图覆盖层', Hindi: 'मैप ओवरले चालू', Spanish: 'Superposicion de mapa activada', French: 'Superposition de carte activee', Arabic: 'تفعيل تراكب الخريطة', Bengali: 'ম্যাপ ওভারলে চালু', Portuguese: 'Sobreposicao de mapa ativada', Russian: 'Оверлей карты включен', Urdu: 'میپ اوورلے فعال'
  },
  'Always on top': {
    'Mandarin Chinese': '总在最前', Hindi: 'हमेशा ऊपर', Spanish: 'Siempre visible', French: 'Toujours au premier plan', Arabic: 'دائمًا في المقدمة', Bengali: 'সর্বদা সামনে', Portuguese: 'Sempre no topo', Russian: 'Поверх всех окон', Urdu: 'ہمیشہ اوپر'
  },
  'Transparent background': {
    'Mandarin Chinese': '透明背景', Hindi: 'पारदर्शी बैकग्राउंड', Spanish: 'Fondo transparente', French: 'Arriere-plan transparent', Arabic: 'خلفية شفافة', Bengali: 'স্বচ্ছ ব্যাকগ্রাউন্ড', Portuguese: 'Fundo transparente', Russian: 'Прозрачный фон', Urdu: 'شفاف پس منظر'
  },
  'Close Winstreak Overlay': {
    'Mandarin Chinese': '关闭连胜覆盖层', Hindi: 'विनस्ट्रीक ओवरले बंद करें', Spanish: 'Cerrar superposicion de racha', French: 'Fermer la superposition de serie', Arabic: 'اغلاق تراكب السلسلة', Bengali: 'উইনস্ট্রিক ওভারলে বন্ধ করুন', Portuguese: 'Fechar sobreposicao de sequencia', Russian: 'Закрыть оверлей серии', Urdu: 'ونسٹریک اوورلے بند کریں'
  },
  'Current Streak': {
    'Mandarin Chinese': '当前连胜', Hindi: 'वर्तमान स्ट्रीक', Spanish: 'Racha actual', French: 'Serie actuelle', Arabic: 'السلسلة الحالية', Bengali: 'বর্তমান স্ট্রিক', Portuguese: 'Sequencia atual', Russian: 'Текущая серия', Urdu: 'موجودہ اسٹریک'
  },
  'Personal Best': {
    'Mandarin Chinese': '个人最佳', Hindi: 'व्यक्तिगत सर्वश्रेष्ठ', Spanish: 'Mejor personal', French: 'Meilleur perso', Arabic: 'افضل رقم شخصي', Bengali: 'ব্যক্তিগত সেরা', Portuguese: 'Melhor pessoal', Russian: 'Личный рекорд', Urdu: 'ذاتی بہترین'
  },
  'World Record': {
    'Mandarin Chinese': '世界纪录', Hindi: 'विश्व रिकॉर्ड', Spanish: 'Record mundial', French: 'Record du monde', Arabic: 'الرقم القياسي العالمي', Bengali: 'বিশ্ব রেকর্ড', Portuguese: 'Recorde mundial', Russian: 'Мировой рекорд', Urdu: 'ورلڈ ریکارڈ'
  },
  'Add +1': {
    'Mandarin Chinese': '增加 +1', Hindi: '+1 जोड़ें', Spanish: 'Agregar +1', French: 'Ajouter +1', Arabic: 'اضافة +1', Bengali: '+1 যোগ করুন', Portuguese: 'Adicionar +1', Russian: 'Добавить +1', Urdu: '+1 شامل کریں'
  },
  'Reset': {
    'Mandarin Chinese': '重置', Hindi: 'रीसेट', Spanish: 'Restablecer', French: 'Reinitialiser', Arabic: 'اعادة تعيين', Bengali: 'রিসেট', Portuguese: 'Redefinir', Russian: 'Сброс', Urdu: 'ری سیٹ'
  },
  'Winstreak Hotkeys': {
    'Mandarin Chinese': '连胜快捷键', Hindi: 'विनस्ट्रीक हॉटकी', Spanish: 'Atajos de racha', French: 'Raccourcis de serie', Arabic: 'اختصارات السلسلة', Bengali: 'উইনস্ট্রিক হটকি', Portuguese: 'Atalhos de sequencia', Russian: 'Горячие клавиши серии', Urdu: 'ونسٹریک ہاٹ کیز'
  },
  'Add +1 Key': {
    'Mandarin Chinese': '增加 +1 键', Hindi: '+1 कुंजी', Spanish: 'Tecla +1', French: 'Touche +1', Arabic: 'زر +1', Bengali: '+1 কী', Portuguese: 'Tecla +1', Russian: 'Клавиша +1', Urdu: '+1 کلید'
  },
  '-1 Key': {
    'Mandarin Chinese': '-1 键', Hindi: '-1 कुंजी', Spanish: 'Tecla -1', French: 'Touche -1', Arabic: 'زر -1', Bengali: '-1 কী', Portuguese: 'Tecla -1', Russian: 'Клавиша -1', Urdu: '-1 کلید'
  },
  'Reset Key': {
    'Mandarin Chinese': '重置键', Hindi: 'रीसेट कुंजी', Spanish: 'Tecla de reinicio', French: 'Touche reset', Arabic: 'زر اعادة التعيين', Bengali: 'রিসেট কী', Portuguese: 'Tecla reset', Russian: 'Клавиша сброса', Urdu: 'ری سیٹ کلید'
  },
  'Live Winstreak Card': {
    'Mandarin Chinese': '实时连胜卡', Hindi: 'लाइव विनस्ट्रीक कार्ड', Spanish: 'Tarjeta de racha en vivo', French: 'Carte serie en direct', Arabic: 'بطاقة السلسلة المباشرة', Bengali: 'লাইভ উইনস্ট্রিক কার্ড', Portuguese: 'Cartao de sequencia ao vivo', Russian: 'Карточка серии в реальном времени', Urdu: 'لائیو ونسٹریک کارڈ'
  },
  'Killer': {
    'Mandarin Chinese': '杀手', Hindi: 'किलर', Spanish: 'Asesino', French: 'Tueur', Arabic: 'القاتل', Bengali: 'কিলার', Portuguese: 'Assassino', Russian: 'Убийца', Urdu: 'کلر'
  },
  'Streak': {
    'Mandarin Chinese': '连胜', Hindi: 'स्ट्रीक', Spanish: 'Racha', French: 'Serie', Arabic: 'السلسلة', Bengali: 'স্ট্রিক', Portuguese: 'Sequencia', Russian: 'Серия', Urdu: 'اسٹریک'
  },
  'P. Best': {
    'Mandarin Chinese': '个人最佳', Hindi: 'व्य. सर्वश्रेष्ठ', Spanish: 'Mejor pers.', French: 'Meilleur pers.', Arabic: 'افضل شخصي', Bengali: 'ব্য. সেরা', Portuguese: 'Melhor pes.', Russian: 'Лич. рекорд', Urdu: 'ذاتی بہترین'
  },
  'WR': {
    'Mandarin Chinese': '世界纪录', Hindi: 'विश्व रिकॉर्ड', Spanish: 'RM', French: 'RM', Arabic: 'رقم عالمي', Bengali: 'বিশ্ব রেকর্ড', Portuguese: 'RM', Russian: 'МР', Urdu: 'ورلڈ ریکارڈ'
  },
  'Close Overlay': {
    'Mandarin Chinese': '关闭覆盖层', Hindi: 'ओवरले बंद करें', Spanish: 'Cerrar superposicion', French: 'Fermer la superposition', Arabic: 'اغلاق التراكب', Bengali: 'ওভারলে বন্ধ করুন', Portuguese: 'Fechar sobreposicao', Russian: 'Закрыть оверлей', Urdu: 'اوورلے بند کریں'
  },
  'Saved': {
    'Mandarin Chinese': '已保存', Hindi: 'सहेजा गया', Spanish: 'Guardado', French: 'Enregistre', Arabic: 'تم الحفظ', Bengali: 'সেভ হয়েছে', Portuguese: 'Salvo', Russian: 'Сохранено', Urdu: 'محفوظ'
  },
  'Save Now': {
    'Mandarin Chinese': '立即保存', Hindi: 'अभी सहेजें', Spanish: 'Guardar ahora', French: 'Enregistrer maintenant', Arabic: 'احفظ الان', Bengali: 'এখন সেভ করুন', Portuguese: 'Salvar agora', Russian: 'Сохранить сейчас', Urdu: 'ابھی محفوظ کریں'
  },
  'Press key...': {
    'Mandarin Chinese': '按下按键...', Hindi: 'कुंजी दबाएं...', Spanish: 'Presiona una tecla...', French: 'Appuyez sur une touche...', Arabic: 'اضغط مفتاح...', Bengali: 'কী চাপুন...', Portuguese: 'Pressione uma tecla...', Russian: 'Нажмите клавишу...', Urdu: 'کلید دبائیں...'
  },
  'Best of': {
    'Mandarin Chinese': 'BO', Hindi: 'बेस्ट ऑफ', Spanish: 'Mejor de', French: 'Best of', Arabic: 'افضل من', Bengali: 'বেস্ট অফ', Portuguese: 'Melhor de', Russian: 'До', Urdu: 'بیسٹ آف'
  },
  'Overlay On': {
    'Mandarin Chinese': '覆盖层已开启', Hindi: 'ओवरले चालू', Spanish: 'Superposicion activa', French: 'Superposition active', Arabic: 'التراكب قيد التشغيل', Bengali: 'ওভারলে চালু', Portuguese: 'Sobreposicao ativa', Russian: 'Оверлей включен', Urdu: 'اوورلے آن'
  },
  'Overlay Off': {
    'Mandarin Chinese': '覆盖层已关闭', Hindi: 'ओवरले बंद', Spanish: 'Superposicion desactivada', French: 'Superposition desactivee', Arabic: 'التراكب متوقف', Bengali: 'ওভারলে বন্ধ', Portuguese: 'Sobreposicao desativada', Russian: 'Оверлей выключен', Urdu: 'اوورلے آف'
  },
  'Start': {
    'Mandarin Chinese': '开始', Hindi: 'शुरू', Spanish: 'Iniciar', French: 'Demarrer', Arabic: 'ابدأ', Bengali: 'শুরু', Portuguese: 'Iniciar', Russian: 'Старт', Urdu: 'شروع'
  },
  'Stop': {
    'Mandarin Chinese': '停止', Hindi: 'रोकें', Spanish: 'Detener', French: 'Arreter', Arabic: 'إيقاف', Bengali: 'বন্ধ করুন', Portuguese: 'Parar', Russian: 'Стоп', Urdu: 'روکیں'
  }
};

Object.assign(I18N, {
  'ACCOUNT VERIFICATION': {
    'Mandarin Chinese': '账户验证', Hindi: 'अकाउंट सत्यापन', Spanish: 'Verificacion de cuenta', French: 'Verification du compte', Arabic: 'التحقق من الحساب', Bengali: 'অ্যাকাউন্ট যাচাইকরণ', Portuguese: 'Verificacao de conta', Russian: 'Проверка аккаунта', Urdu: 'اکاؤنٹ کی تصدیق'
  },
  'Login is verified through your account and role access.': {
    'Mandarin Chinese': '登录通过你的账户和角色权限进行验证。', Hindi: 'लॉगिन आपके अकाउंट और रोल एक्सेस से सत्यापित होता है।', Spanish: 'El inicio de sesion se verifica con tu cuenta y rol.', French: 'La connexion est verifiee via votre compte et votre role.', Arabic: 'يتم التحقق من تسجيل الدخول عبر الحساب وصلاحية الدور.', Bengali: 'লগইন আপনার অ্যাকাউন্ট ও রোল দিয়ে যাচাই হয়।', Portuguese: 'O login e verificado pela conta e papel de acesso.', Russian: 'Вход проверяется через аккаунт и роль доступа.', Urdu: 'لاگ ان آپ کے اکاؤنٹ اور رول ایکسس سے تصدیق ہوتا ہے۔'
  },
  'Official Sponsor': {
    'Mandarin Chinese': '官方赞助商', Hindi: 'आधिकारिक प्रायोजक', Spanish: 'Patrocinador oficial', French: 'Sponsor officiel', Arabic: 'الراعي الرسمي', Bengali: 'অফিশিয়াল স্পন্সর', Portuguese: 'Patrocinador oficial', Russian: 'Официальный спонсор', Urdu: 'آفیشل اسپانسر'
  },
  'Sponsored by VDL': {
    'Mandarin Chinese': '由 VDL 赞助', Hindi: 'VDL द्वारा प्रायोजित', Spanish: 'Patrocinado por VDL', French: 'Sponsorise par VDL', Arabic: 'برعاية VDL', Bengali: 'VDL দ্বারা স্পন্সরকৃত', Portuguese: 'Patrocinado por VDL', Russian: 'При поддержке VDL', Urdu: 'VDL کے تعاون سے'
  },
  'Competitive Violence District Organization': {
    'Mandarin Chinese': '竞争暴力地区组织', Hindi: 'कम्पेटिटिव वॉयलेंस डिस्ट्रिक्ट संगठन', Spanish: 'Organizacion Competitive Violence District', French: 'Organisation Competitive Violence District', Arabic: 'منظمة منطقة العنف التنافسي', Bengali: 'কমপেটিটিভ ভায়োলেন্স ডিস্ট্রিক্ট অর্গানাইজেশন', Portuguese: 'Organizacao Competitive Violence District', Russian: 'Организация Competitive Violence District', Urdu: 'کمپیٹیٹو وائلنس ڈسٹرکٹ آرگنائزیشن'
  },
  Category: {
    'Mandarin Chinese': '分类', Hindi: 'श्रेणी', Spanish: 'Categoria', French: 'Categorie', Arabic: 'الفئة', Bengali: 'ক্যাটাগরি', Portuguese: 'Categoria', Russian: 'Категория', Urdu: 'کیٹیگری'
  },
  Maps: {
    'Mandarin Chinese': '地图', Hindi: 'मैप्स', Spanish: 'Mapas', French: 'Cartes', Arabic: 'الخرائط', Bengali: 'ম্যাপস', Portuguese: 'Mapas', Russian: 'Карты', Urdu: 'نقشے'
  },
  Settings: {
    'Mandarin Chinese': '设置', Hindi: 'सेटिंग्स', Spanish: 'Ajustes', French: 'Parametres', Arabic: 'الإعدادات', Bengali: 'সেটিংস', Portuguese: 'Configuracoes', Russian: 'Настройки', Urdu: 'سیٹنگز'
  },
  Region: {
    'Mandarin Chinese': '地区', Hindi: 'क्षेत्र', Spanish: 'Region', French: 'Region', Arabic: 'المنطقة', Bengali: 'রিজিয়ন', Portuguese: 'Regiao', Russian: 'Регион', Urdu: 'ریجن'
  },
  Preview: {
    'Mandarin Chinese': '预览', Hindi: 'प्रीव्यू', Spanish: 'Vista previa', French: 'Apercu', Arabic: 'معاينة', Bengali: 'প্রিভিউ', Portuguese: 'Pre-visualizacao', Russian: 'Предпросмотр', Urdu: 'پری ویو'
  },
  '1V1 OVERLAY': {
    'Mandarin Chinese': '1V1 覆盖层', Hindi: '1V1 ओवरले', Spanish: 'Overlay 1V1', French: 'Overlay 1V1', Arabic: 'تراكب 1V1', Bengali: '1V1 ওভারলে', Portuguese: 'Overlay 1V1', Russian: 'Оверлей 1V1', Urdu: '1V1 اوورلے'
  },
  'Overlay Window': {
    'Mandarin Chinese': '覆盖层窗口', Hindi: 'ओवरले विंडो', Spanish: 'Ventana de overlay', French: 'Fenetre de superposition', Arabic: 'نافذة التراكب', Bengali: 'ওভারলে উইন্ডো', Portuguese: 'Janela de overlay', Russian: 'Окно оверлея', Urdu: 'اوورلے ونڈو'
  },
  'Enable animations': {
    'Mandarin Chinese': '启用动画', Hindi: 'एनिमेशन सक्षम करें', Spanish: 'Habilitar animaciones', French: 'Activer les animations', Arabic: 'تفعيل الرسوم المتحركة', Bengali: 'অ্যানিমেশন চালু', Portuguese: 'Ativar animacoes', Russian: 'Включить анимации', Urdu: 'اینیمیشن فعال کریں'
  },
  'Auto-detect current map in game': {
    'Mandarin Chinese': '在游戏中自动检测当前地图', Hindi: 'गेम में वर्तमान मैप ऑटो-डिटेक्ट', Spanish: 'Auto-detectar mapa actual en juego', French: 'Detection auto de la carte en jeu', Arabic: 'الكشف التلقائي عن الخريطة الحالية داخل اللعبة', Bengali: 'গেমে বর্তমান ম্যাপ অটো-ডিটেক্ট', Portuguese: 'Detectar mapa atual no jogo automaticamente', Russian: 'Автоопределение текущей карты в игре', Urdu: 'گیم میں موجودہ نقشہ خودکار طور پر شناخت کریں'
  },
  'Auto-detecting map from active game window...': {
    'Mandarin Chinese': '正在从活动游戏窗口自动检测地图...', Hindi: 'सक्रिय गेम विंडो से मैप ऑटो-डिटेक्ट हो रहा है...', Spanish: 'Detectando mapa desde la ventana activa del juego...', French: 'Detection de la carte depuis la fenetre de jeu active...', Arabic: 'جارٍ اكتشاف الخريطة من نافذة اللعبة النشطة...', Bengali: 'সক্রিয় গেম উইন্ডো থেকে ম্যাপ শনাক্ত করা হচ্ছে...', Portuguese: 'Detectando mapa pela janela ativa do jogo...', Russian: 'Определение карты из активного окна игры...', Urdu: 'فعال گیم ونڈو سے نقشہ شناخت کیا جا رہا ہے...'
  },
  'Auto-detect map is off.': {
    'Mandarin Chinese': '自动检测地图已关闭。', Hindi: 'ऑटो-डिटेक्ट मैप बंद है।', Spanish: 'La deteccion automatica esta desactivada.', French: 'La detection auto est desactivee.', Arabic: 'الكشف التلقائي للخريطة متوقف.', Bengali: 'অটো-ডিটেক্ট ম্যাপ বন্ধ আছে।', Portuguese: 'Deteccao automatica de mapa desligada.', Russian: 'Автоопределение карты выключено.', Urdu: 'آٹو ڈیٹیکٹ میپ بند ہے۔'
  },
  'Detected map': {
    'Mandarin Chinese': '已检测地图', Hindi: 'डिटेक्ट किया गया मैप', Spanish: 'Mapa detectado', French: 'Carte detectee', Arabic: 'الخريطة المكتشفة', Bengali: 'সনাক্তকৃত ম্যাপ', Portuguese: 'Mapa detectado', Russian: 'Обнаруженная карта', Urdu: 'شناخت شدہ نقشہ'
  },
  'No map detected yet.': {
    'Mandarin Chinese': '暂未检测到地图。', Hindi: 'अभी तक कोई मैप नहीं मिला।', Spanish: 'Aun no se detecto ningun mapa.', French: 'Aucune carte detectee pour le moment.', Arabic: 'لم يتم اكتشاف أي خريطة بعد.', Bengali: 'এখনও কোনো ম্যাপ সনাক্ত হয়নি।', Portuguese: 'Nenhum mapa detectado ainda.', Russian: 'Пока карта не обнаружена.', Urdu: 'ابھی تک کوئی نقشہ شناخت نہیں ہوا۔'
  },
  'Map detector unavailable': {
    'Mandarin Chinese': '地图检测器不可用', Hindi: 'मैप डिटेक्टर उपलब्ध नहीं', Spanish: 'Detector de mapas no disponible', French: 'Detecteur de carte indisponible', Arabic: 'كاشف الخريطة غير متاح', Bengali: 'ম্যাপ ডিটেক্টর পাওয়া যাচ্ছে না', Portuguese: 'Detector de mapa indisponivel', Russian: 'Детектор карты недоступен', Urdu: 'میپ ڈیٹیکٹر دستیاب نہیں'
  },
  'Low confidence map detection. Keeping current map.': {
    'Mandarin Chinese': '地图检测置信度较低，保持当前地图。', Hindi: 'मैप डिटेक्शन कॉन्फिडेंस कम है, वर्तमान मैप रखा गया।', Spanish: 'Deteccion de mapa con baja confianza. Se mantiene el mapa actual.', French: 'Confiance de detection faible. Carte actuelle conservee.', Arabic: 'ثقة اكتشاف الخريطة منخفضة. سيتم الإبقاء على الخريطة الحالية.', Bengali: 'ম্যাপ শনাক্তকরণে কনফিডেন্স কম। বর্তমান ম্যাপই রাখা হয়েছে।', Portuguese: 'Baixa confianca na deteccao do mapa. Mantendo o mapa atual.', Russian: 'Низкая уверенность определения карты. Текущая карта сохранена.', Urdu: 'نقشے کی شناخت کا اعتماد کم ہے۔ موجودہ نقشہ برقرار رکھا گیا ہے۔'
  },
  'Manual Override Hotkeys': {
    'Mandarin Chinese': '手动覆盖快捷键', Hindi: 'मैनुअल ओवरराइड हॉटकी', Spanish: 'Atajos de anulacion manual', French: 'Raccourcis de remplacement manuel', Arabic: 'اختصارات التجاوز اليدوي', Bengali: 'ম্যানুয়াল ওভাররাইড হটকি', Portuguese: 'Atalhos de substituicao manual', Russian: 'Горячие клавиши ручного переопределения', Urdu: 'مینول اووررائیڈ ہاٹ کیز'
  },
  'Next Map Key': {
    'Mandarin Chinese': '下一张地图键', Hindi: 'अगला मैप कुंजी', Spanish: 'Tecla siguiente mapa', French: 'Touche carte suivante', Arabic: 'مفتاح الخريطة التالية', Bengali: 'পরের ম্যাপ কী', Portuguese: 'Tecla proximo mapa', Russian: 'Клавиша следующей карты', Urdu: 'اگلا نقشہ کلید'
  },
  'Toggle Auto-Detect Key': {
    'Mandarin Chinese': '切换自动检测键', Hindi: 'ऑटो-डिटेक्ट टॉगल कुंजी', Spanish: 'Tecla alternar auto-deteccion', French: 'Touche basculer detection auto', Arabic: 'مفتاح تبديل الكشف التلقائي', Bengali: 'অটো-ডিটেক্ট টগল কী', Portuguese: 'Tecla alternar deteccao automatica', Russian: 'Клавиша переключения автоопределения', Urdu: 'آٹو ڈیٹیکٹ ٹوگل کلید'
  },
  'Timer Controls': {
    'Mandarin Chinese': '计时器控制', Hindi: 'टाइमर कंट्रोल्स', Spanish: 'Controles del temporizador', French: 'Commandes du timer', Arabic: 'عناصر التحكم بالمؤقت', Bengali: 'টাইমার কন্ট্রোল', Portuguese: 'Controles do timer', Russian: 'Управление таймером', Urdu: 'ٹائمر کنٹرولز'
  },
  'Swap Sides': {
    'Mandarin Chinese': '交换双方', Hindi: 'साइड बदलें', Spanish: 'Cambiar lados', French: 'Inverser les cotes', Arabic: 'تبديل الجانبين', Bengali: 'সাইড বদলান', Portuguese: 'Trocar lados', Russian: 'Поменять стороны', Urdu: 'سائیڈ بدلیں'
  },
  'Keyboard / Mouse Hotkeys': {
    'Mandarin Chinese': '键盘/鼠标快捷键', Hindi: 'कीबोर्ड/माउस हॉटकी', Spanish: 'Atajos de teclado/raton', French: 'Raccourcis clavier/souris', Arabic: 'اختصارات لوحة المفاتيح/الماوس', Bengali: 'কিবোর্ড/মাউস হটকি', Portuguese: 'Atalhos teclado/mouse', Russian: 'Горячие клавиши клавиатуры/мыши', Urdu: 'کی بورڈ/ماؤس ہاٹ کیز'
  },
  'Start/Stop/Reset Key': {
    'Mandarin Chinese': '开始/停止/重置键', Hindi: 'स्टार्ट/स्टॉप/रीसेट कुंजी', Spanish: 'Tecla iniciar/detener/reset', French: 'Touche demarrer/arreter/reset', Arabic: 'زر البدء/الإيقاف/إعادة التعيين', Bengali: 'স্টার্ট/স্টপ/রিসেট কী', Portuguese: 'Tecla iniciar/parar/reset', Russian: 'Клавиша старт/стоп/сброс', Urdu: 'اسٹارٹ/اسٹاپ/ری سیٹ کلید'
  },
  'Swap Timer Key': {
    'Mandarin Chinese': '切换计时器键', Hindi: 'टाइमर स्वैप कुंजी', Spanish: 'Tecla cambiar temporizador', French: 'Touche changer timer', Arabic: 'زر تبديل المؤقت', Bengali: 'টাইমার বদল কী', Portuguese: 'Tecla trocar timer', Russian: 'Клавиша смены таймера', Urdu: 'ٹائمر سوئچ کلید'
  },
  Name: {
    'Mandarin Chinese': '名称', Hindi: 'नाम', Spanish: 'Nombre', French: 'Nom', Arabic: 'الاسم', Bengali: 'নাম', Portuguese: 'Nome', Russian: 'Имя', Urdu: 'نام'
  },
  'Name Color': {
    'Mandarin Chinese': '名字颜色', Hindi: 'नाम का रंग', Spanish: 'Color del nombre', French: 'Couleur du nom', Arabic: 'لون الاسم', Bengali: 'নামের রং', Portuguese: 'Cor do nome', Russian: 'Цвет имени', Urdu: 'نام کا رنگ'
  },
  Score: {
    'Mandarin Chinese': '分数', Hindi: 'स्कोर', Spanish: 'Puntuacion', French: 'Score', Arabic: 'النتيجة', Bengali: 'স্কোর', Portuguese: 'Placar', Russian: 'Счет', Urdu: 'اسکور'
  },
  'Overlay Style': {
    'Mandarin Chinese': '覆盖层样式', Hindi: 'ओवरले स्टाइल', Spanish: 'Estilo de overlay', French: 'Style de superposition', Arabic: 'نمط التراكب', Bengali: 'ওভারলে স্টাইল', Portuguese: 'Estilo do overlay', Russian: 'Стиль оверлея', Urdu: 'اوورلے اسٹائل'
  },
  'Timer Color': {
    'Mandarin Chinese': '计时器颜色', Hindi: 'टाइमर रंग', Spanish: 'Color del temporizador', French: 'Couleur du timer', Arabic: 'لون المؤقت', Bengali: 'টাইমার রং', Portuguese: 'Cor do timer', Russian: 'Цвет таймера', Urdu: 'ٹائمر رنگ'
  },
  'Underline Color': {
    'Mandarin Chinese': '下划线颜色', Hindi: 'अंडरलाइन रंग', Spanish: 'Color de subrayado', French: 'Couleur du soulignement', Arabic: 'لون الخط السفلي', Bengali: 'আন্ডারলাইন রং', Portuguese: 'Cor do sublinhado', Russian: 'Цвет подчеркивания', Urdu: 'انڈر لائن رنگ'
  },
  'Score Color': {
    'Mandarin Chinese': '分数颜色', Hindi: 'स्कोर रंग', Spanish: 'Color del marcador', French: 'Couleur du score', Arabic: 'لون النتيجة', Bengali: 'স্কোর রং', Portuguese: 'Cor do placar', Russian: 'Цвет счета', Urdu: 'اسکور رنگ'
  },
  'Tournament Setup': {
    'Mandarin Chinese': '锦标赛设置', Hindi: 'टूर्नामेंट सेटअप', Spanish: 'Configuracion del torneo', French: 'Configuration du tournoi', Arabic: 'إعداد البطولة', Bengali: 'টুর্নামেন্ট সেটআপ', Portuguese: 'Configuracao do torneio', Russian: 'Настройка турнира', Urdu: 'ٹورنامنٹ سیٹ اپ'
  },
  'Tournament overlay enabled': {
    'Mandarin Chinese': '启用锦标赛覆盖层', Hindi: 'टूर्नामेंट ओवरले सक्षम', Spanish: 'Overlay de torneo habilitado', French: 'Overlay tournoi active', Arabic: 'تفعيل تراكب البطولة', Bengali: 'টুর্নামেন্ট ওভারলে চালু', Portuguese: 'Overlay de torneio ativado', Russian: 'Оверлей турнира включен', Urdu: 'ٹورنامنٹ اوورلے فعال'
  },
  'Close Tournament Overlay': {
    'Mandarin Chinese': '关闭锦标赛覆盖层', Hindi: 'टूर्नामेंट ओवरले बंद करें', Spanish: 'Cerrar overlay de torneo', French: 'Fermer overlay tournoi', Arabic: 'اغلاق تراكب البطولة', Bengali: 'টুর্নামেন্ট ওভারলে বন্ধ করুন', Portuguese: 'Fechar overlay do torneio', Russian: 'Закрыть оверлей турнира', Urdu: 'ٹورنامنٹ اوورلے بند کریں'
  },
  Series: {
    'Mandarin Chinese': '系列赛', Hindi: 'सीरीज', Spanish: 'Serie', French: 'Serie', Arabic: 'السلسلة', Bengali: 'সিরিজ', Portuguese: 'Serie', Russian: 'Серия', Urdu: 'سیریز'
  },
  'Best of 1': {
    'Mandarin Chinese': 'BO1', Hindi: 'बेस्ट ऑफ 1', Spanish: 'Mejor de 1', French: 'Best of 1', Arabic: 'افضل من 1', Bengali: 'বেস্ট অফ 1', Portuguese: 'Melhor de 1', Russian: 'До 1', Urdu: 'بیسٹ آف 1'
  },
  'Best of 3': {
    'Mandarin Chinese': 'BO3', Hindi: 'बेस्ट ऑफ 3', Spanish: 'Mejor de 3', French: 'Best of 3', Arabic: 'افضل من 3', Bengali: 'বেস্ট অফ 3', Portuguese: 'Melhor de 3', Russian: 'До 3', Urdu: 'بیسٹ آف 3'
  },
  'Best of 5': {
    'Mandarin Chinese': 'BO5', Hindi: 'बेस्ट ऑफ 5', Spanish: 'Mejor de 5', French: 'Best of 5', Arabic: 'افضل من 5', Bengali: 'বেস্ট অফ 5', Portuguese: 'Melhor de 5', Russian: 'До 5', Urdu: 'بیسٹ آف 5'
  },
  'Live Score': {
    'Mandarin Chinese': '实时比分', Hindi: 'लाइव स्कोर', Spanish: 'Marcador en vivo', French: 'Score en direct', Arabic: 'النتيجة المباشرة', Bengali: 'লাইভ স্কোর', Portuguese: 'Placar ao vivo', Russian: 'Счет в реальном времени', Urdu: 'لائیو اسکور'
  },
  'Score Hotkeys': {
    'Mandarin Chinese': '比分快捷键', Hindi: 'स्कोर हॉटकी', Spanish: 'Atajos de puntuacion', French: 'Raccourcis score', Arabic: 'اختصارات النتيجة', Bengali: 'স্কোর হটকি', Portuguese: 'Atalhos de placar', Russian: 'Горячие клавиши счета', Urdu: 'اسکور ہاٹ کیز'
  },
  'Killer Winstreak Overlay': {
    'Mandarin Chinese': '杀手连胜覆盖层', Hindi: 'किलर विनस्ट्रीक ओवरले', Spanish: 'Overlay de racha del asesino', French: 'Overlay de serie du tueur', Arabic: 'تراكب سلسلة القاتل', Bengali: 'কিলার উইনস্ট্রিক ওভারলে', Portuguese: 'Overlay de sequencia do assassino', Russian: 'Оверлей серии убийцы', Urdu: 'کلر ونسٹریک اوورلے'
  },
  'Winstreak overlay enabled': {
    'Mandarin Chinese': '启用连胜覆盖层', Hindi: 'विनस्ट्रीक ओवरले सक्षम', Spanish: 'Overlay de racha habilitado', French: 'Overlay de serie active', Arabic: 'تفعيل تراكب السلسلة', Bengali: 'উইনস্ট্রিক ওভারলে চালু', Portuguese: 'Overlay de sequencia ativado', Russian: 'Оверлей серии включен', Urdu: 'ونسٹریک اوورلے فعال'
  },
  'Killer Selection': {
    'Mandarin Chinese': '杀手选择', Hindi: 'किलर चयन', Spanish: 'Seleccion de asesino', French: 'Selection du tueur', Arabic: 'اختيار القاتل', Bengali: 'কিলার নির্বাচন', Portuguese: 'Selecao de assassino', Russian: 'Выбор убийцы', Urdu: 'کلر سلیکشن'
  },
  'Live Tournament Card': {
    'Mandarin Chinese': '实时锦标赛卡片', Hindi: 'लाइव टूर्नामेंट कार्ड', Spanish: 'Tarjeta de torneo en vivo', French: 'Carte de tournoi en direct', Arabic: 'بطاقة البطولة المباشرة', Bengali: 'লাইভ টুর্নামেন্ট কার্ড', Portuguese: 'Cartao de torneio ao vivo', Russian: 'Карточка турнира в реальном времени', Urdu: 'لائیو ٹورنامنٹ کارڈ'
  },
  'Reset to Defaults': {
    'Mandarin Chinese': '重置为默认', Hindi: 'डिफॉल्ट पर रीसेट', Spanish: 'Restablecer por defecto', French: 'Reinitialiser par defaut', Arabic: 'اعادة للوضع الافتراضي', Bengali: 'ডিফল্টে রিসেট', Portuguese: 'Redefinir para padrao', Russian: 'Сбросить по умолчанию', Urdu: 'ڈیفالٹس پر ری سیٹ'
  },
  Logout: {
    'Mandarin Chinese': '退出登录', Hindi: 'लॉगआउट', Spanish: 'Cerrar sesion', French: 'Deconnexion', Arabic: 'تسجيل الخروج', Bengali: 'লগআউট', Portuguese: 'Sair', Russian: 'Выйти', Urdu: 'لاگ آؤٹ'
  },
  'Not logged in': {
    'Mandarin Chinese': '未登录', Hindi: 'लॉगिन नहीं', Spanish: 'No conectado', French: 'Non connecte', Arabic: 'غير مسجل الدخول', Bengali: 'লগইন করা নেই', Portuguese: 'Nao conectado', Russian: 'Не выполнен вход', Urdu: 'لاگ ان نہیں'
  },
  'role: user': {
    'Mandarin Chinese': '角色: 用户', Hindi: 'भूमिका: यूजर', Spanish: 'rol: usuario', French: 'role: utilisateur', Arabic: 'الدور: مستخدم', Bengali: 'রোল: ইউজার', Portuguese: 'papel: usuario', Russian: 'роль: пользователь', Urdu: 'رول: صارف'
  },
  'Buy Premium!': {
    'Mandarin Chinese': '购买高级版!', Hindi: 'प्रीमियम खरीदें!', Spanish: 'Compra Premium!', French: 'Acheter Premium!', Arabic: 'اشترِ بريميوم!', Bengali: 'প্রিমিয়াম কিনুন!', Portuguese: 'Compre Premium!', Russian: 'Купить Premium!', Urdu: 'پریمیم خریدیں!'
  },
  'Buy!': {
    'Mandarin Chinese': '购买!', Hindi: 'खरीदें!', Spanish: 'Comprar!', French: 'Acheter!', Arabic: 'اشترِ!', Bengali: 'কিনুন!', Portuguese: 'Comprar!', Russian: 'Купить!', Urdu: 'خریدیں!'
  },
  'Restart Now': {
    'Mandarin Chinese': '立即重启', Hindi: 'अभी रीस्टार्ट', Spanish: 'Reiniciar ahora', French: 'Redemarrer maintenant', Arabic: 'اعادة التشغيل الآن', Bengali: 'এখনই রিস্টার্ট', Portuguese: 'Reiniciar agora', Russian: 'Перезапустить сейчас', Urdu: 'ابھی ری اسٹارٹ کریں'
  },
  Later: {
    'Mandarin Chinese': '稍后', Hindi: 'बाद में', Spanish: 'Luego', French: 'Plus tard', Arabic: 'لاحقًا', Bengali: 'পরে', Portuguese: 'Mais tarde', Russian: 'Позже', Urdu: 'بعد میں'
  },
  'Update available. Restart the app to apply.': {
    'Mandarin Chinese': '有可用更新。重启应用以应用更新。', Hindi: 'अपडेट उपलब्ध है। लागू करने के लिए ऐप रीस्टार्ट करें।', Spanish: 'Actualizacion disponible. Reinicia la app para aplicar.', French: 'Mise a jour disponible. Redemarrez l app pour appliquer.', Arabic: 'يتوفر تحديث. اعد تشغيل التطبيق للتطبيق.', Bengali: 'আপডেট পাওয়া গেছে। প্রয়োগ করতে অ্যাপ রিস্টার্ট করুন।', Portuguese: 'Atualizacao disponivel. Reinicie o app para aplicar.', Russian: 'Доступно обновление. Перезапустите приложение для применения.', Urdu: 'اپ ڈیٹ دستیاب ہے۔ لاگو کرنے کے لیے ایپ ری اسٹارٹ کریں۔'
  },
  Clear: {
    'Mandarin Chinese': '清除', Hindi: 'साफ करें', Spanish: 'Borrar', French: 'Effacer', Arabic: 'مسح', Bengali: 'ক্লিয়ার', Portuguese: 'Limpar', Russian: 'Очистить', Urdu: 'صاف کریں'
  },
  English: {
    'Mandarin Chinese': '英语', Hindi: 'अंग्रेजी', Spanish: 'Ingles', French: 'Anglais', Arabic: 'الانجليزية', Bengali: 'ইংরেজি', Portuguese: 'Ingles', Russian: 'Английский', Urdu: 'انگریزی'
  },
  'Mandarin Chinese': {
    'Mandarin Chinese': '普通话', Hindi: 'मंदारिन चीनी', Spanish: 'Chino mandarin', French: 'Chinois mandarin', Arabic: 'الصينية المندرينية', Bengali: 'ম্যান্ডারিন চীনা', Portuguese: 'Mandarim chines', Russian: 'Китайский (мандарин)', Urdu: 'مینڈارن چینی'
  },
  Hindi: {
    'Mandarin Chinese': '印地语', Hindi: 'हिंदी', Spanish: 'Hindi', French: 'Hindi', Arabic: 'الهندية', Bengali: 'হিন্দি', Portuguese: 'Hindi', Russian: 'Хинди', Urdu: 'ہندی'
  },
  Spanish: {
    'Mandarin Chinese': '西班牙语', Hindi: 'स्पेनिश', Spanish: 'Espanol', French: 'Espagnol', Arabic: 'الإسبانية', Bengali: 'স্প্যানিশ', Portuguese: 'Espanhol', Russian: 'Испанский', Urdu: 'ہسپانوی'
  },
  French: {
    'Mandarin Chinese': '法语', Hindi: 'फ्रेंच', Spanish: 'Frances', French: 'Francais', Arabic: 'الفرنسية', Bengali: 'ফরাসি', Portuguese: 'Frances', Russian: 'Французский', Urdu: 'فرانسیسی'
  },
  Arabic: {
    'Mandarin Chinese': '阿拉伯语', Hindi: 'अरबी', Spanish: 'Arabe', French: 'Arabe', Arabic: 'العربية', Bengali: 'আরবি', Portuguese: 'Arabe', Russian: 'Арабский', Urdu: 'عربی'
  },
  Bengali: {
    'Mandarin Chinese': '孟加拉语', Hindi: 'बंगाली', Spanish: 'Bengali', French: 'Bengali', Arabic: 'البنغالية', Bengali: 'বাংলা', Portuguese: 'Bengali', Russian: 'Бенгальский', Urdu: 'بنگالی'
  },
  Portuguese: {
    'Mandarin Chinese': '葡萄牙语', Hindi: 'पुर्तगाली', Spanish: 'Portugues', French: 'Portugais', Arabic: 'البرتغالية', Bengali: 'পর্তুগিজ', Portuguese: 'Portugues', Russian: 'Португальский', Urdu: 'پرتگالی'
  },
  Russian: {
    'Mandarin Chinese': '俄语', Hindi: 'रूसी', Spanish: 'Ruso', French: 'Russe', Arabic: 'الروسية', Bengali: 'রাশিয়ান', Portuguese: 'Russo', Russian: 'Русский', Urdu: 'روسی'
  },
  Urdu: {
    'Mandarin Chinese': '乌尔都语', Hindi: 'उर्दू', Spanish: 'Urdu', French: 'Ourdou', Arabic: 'الأردية', Bengali: 'উর্দু', Portuguese: 'Urdu', Russian: 'Урду', Urdu: 'اردو'
  },
  role: {
    'Mandarin Chinese': '角色', Hindi: 'भूमिका', Spanish: 'rol', French: 'role', Arabic: 'الدور', Bengali: 'রোল', Portuguese: 'papel', Russian: 'роль', Urdu: 'رول'
  },
  User: {
    'Mandarin Chinese': '用户', Hindi: 'यूजर', Spanish: 'usuario', French: 'utilisateur', Arabic: 'مستخدم', Bengali: 'ইউজার', Portuguese: 'usuario', Russian: 'пользователь', Urdu: 'صارف'
  },
  Premium: {
    'Mandarin Chinese': '高级', Hindi: 'प्रीमियम', Spanish: 'premium', French: 'premium', Arabic: 'بريميوم', Bengali: 'প্রিমিয়াম', Portuguese: 'premium', Russian: 'премиум', Urdu: 'پریمیم'
  },
  Tester: {
    'Mandarin Chinese': '测试员', Hindi: 'टेस्टर', Spanish: 'tester', French: 'testeur', Arabic: 'مختبر', Bengali: 'টেস্টার', Portuguese: 'testador', Russian: 'тестер', Urdu: 'ٹیسٹر'
  },
  Dev: {
    'Mandarin Chinese': '开发', Hindi: 'डेव', Spanish: 'dev', French: 'dev', Arabic: 'مطوّر', Bengali: 'ডেভ', Portuguese: 'dev', Russian: 'разработчик', Urdu: 'ڈیو'
  },
  'Logging in...': {
    'Mandarin Chinese': '正在登录...', Hindi: 'लॉगिन हो रहा है...', Spanish: 'Iniciando sesion...', French: 'Connexion...', Arabic: 'جار تسجيل الدخول...', Bengali: 'লগইন হচ্ছে...', Portuguese: 'Entrando...', Russian: 'Выполняется вход...', Urdu: 'لاگ ان ہو رہا ہے...'
  },
  'Creating...': {
    'Mandarin Chinese': '创建中...', Hindi: 'बनाया जा रहा है...', Spanish: 'Creando...', French: 'Creation...', Arabic: 'جارٍ الإنشاء...', Bengali: 'তৈরি হচ্ছে...', Portuguese: 'Criando...', Russian: 'Создание...', Urdu: 'بنایا جا رہا ہے...'
  }
});

const i18nTextBase = new WeakMap();
const i18nPlaceholderBase = new WeakMap();

function getSelectedLanguage() {
  const candidate = authLanguage ? String(authLanguage.value || 'English') : 'English';
  return SUPPORTED_LANGUAGES.includes(candidate) ? candidate : 'English';
}

function t(text) {
  const input = String(text || '');
  const language = getSelectedLanguage();
  if (language === 'English') return input;
  const entry = I18N[input];
  if (!entry) return input;
  return entry[language] || input;
}

function localizeNodeText(node) {
  const original = i18nTextBase.has(node) ? i18nTextBase.get(node) : node.nodeValue;
  if (!i18nTextBase.has(node)) i18nTextBase.set(node, original);
  const raw = String(original || '');
  const trimmed = raw.trim();
  if (!trimmed) return;
  const translated = t(trimmed);
  node.nodeValue = raw.replace(trimmed, translated);
}

function localizePlaceholder(el) {
  if (!el || typeof el.getAttribute !== 'function') return;
  const ph = el.getAttribute('placeholder');
  if (!ph) return;
  const original = i18nPlaceholderBase.has(el) ? i18nPlaceholderBase.get(el) : ph;
  if (!i18nPlaceholderBase.has(el)) i18nPlaceholderBase.set(el, original);
  el.setAttribute('placeholder', t(original));
}

function applyLanguageToStaticUI() {
  if (!document || !document.body) return;
  document.documentElement.lang = getSelectedLanguage();
  document.documentElement.dir = getSelectedLanguage() === 'Arabic' ? 'rtl' : 'ltr';

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parentTag = node.parentElement ? node.parentElement.tagName : '';
    if (parentTag === 'SCRIPT' || parentTag === 'STYLE') continue;
    localizeNodeText(node);
  }

  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(localizePlaceholder);
  protectSensitiveTokens(appContainer || document.body);
}

function maskSensitiveToken(value) {
  const token = String(value || '').trim();
  if (!token) return '••••••••';
  const keepStart = Math.min(10, token.length);
  const keepEnd = Math.min(4, Math.max(0, token.length - keepStart));
  const hiddenLen = Math.max(4, token.length - keepStart - keepEnd);
  return `${token.slice(0, keepStart)}${'•'.repeat(hiddenLen)}${keepEnd > 0 ? token.slice(-keepEnd) : ''}`;
}

function applySensitiveTokenVisibility(root = appContainer || document.body) {
  if (!root || !root.querySelectorAll) return;
  const chips = root.querySelectorAll('.sensitive-token');

  chips.forEach((chip) => {
    const token = String(chip.dataset.sensitiveToken || '').trim();
    if (!token) return;

    chip.classList.remove('is-redacted', 'is-dev-visible', 'is-revealed');

    chip.title = chip.dataset.revealed === '1' ? 'Shown once' : 'Hover and click to reveal';
    if (chip.dataset.revealed !== '1') {
      chip.classList.remove('is-locked');
      chip.textContent = maskSensitiveToken(token);
    }
  });
}

function tokenizeSensitiveText(text) {
  const raw = String(text || '');
  const regex = new RegExp(SENSITIVE_TOKEN_REGEX.source, 'g');
  const matches = [...raw.matchAll(regex)];
  if (matches.length === 0) return null;

  const frag = document.createDocumentFragment();
  let cursor = 0;
  matches.forEach((match) => {
    const token = String(match[0] || '');
    const index = Number(match.index) || 0;
    if (index > cursor) {
      frag.appendChild(document.createTextNode(raw.slice(cursor, index)));
    }

    const chip = document.createElement('span');
    chip.className = 'sensitive-token';
    chip.dataset.sensitiveToken = token;
    chip.dataset.revealed = '0';
    chip.textContent = maskSensitiveToken(token);
    chip.title = 'Hover and click to reveal';
    frag.appendChild(chip);

    cursor = index + token.length;
  });

  if (cursor < raw.length) {
    frag.appendChild(document.createTextNode(raw.slice(cursor)));
  }

  return frag;
}

function protectSensitiveTokens(root = appContainer || document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node || !node.nodeValue) continue;
    const parent = node.parentElement;
    if (!parent) continue;
    if (parent.closest('.sensitive-token')) continue;
    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;
    if (SENSITIVE_TOKEN_REGEX.test(node.nodeValue)) {
      targets.push(node);
    }
    SENSITIVE_TOKEN_REGEX.lastIndex = 0;
  }

  targets.forEach((node) => {
    const frag = tokenizeSensitiveText(node.nodeValue);
    if (!frag || !node.parentNode) return;
    node.parentNode.replaceChild(frag, node);
  });

  applySensitiveTokenVisibility(root);
}

function setupSensitiveTokenProtection() {
  if (!document || !appContainer || sensitiveTokenObserver) return;

  document.addEventListener('click', (event) => {
    const chip = event.target && event.target.closest ? event.target.closest('.sensitive-token') : null;
    if (!chip) return;
    if (chip.dataset.revealed === '1') return;

    const token = String(chip.dataset.sensitiveToken || '').trim();
    if (!token) return;

    chip.dataset.revealed = '1';
    chip.textContent = token;
    chip.classList.add('is-locked');
    chip.classList.add('is-revealed');
    chip.title = 'Shown once';
    window.setTimeout(() => {
      chip.textContent = maskSensitiveToken(token);
      chip.classList.remove('is-revealed');
    }, SENSITIVE_REVEAL_MS);
  });

  sensitiveTokenObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!node) return;
        if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
          protectSensitiveTokens(node.parentElement);
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          protectSensitiveTokens(node);
        }
      });
    });
  });

  sensitiveTokenObserver.observe(appContainer, { childList: true, subtree: true });
  protectSensitiveTokens(appContainer);
  applySensitiveTokenVisibility(appContainer);
}

function injectHiddenPremiumHuntKeys() {
  if (!document || !appContainer) return;
  if (document.querySelector('[data-hunt-layer="1"]')) return;

  const byCategory = {
    maps: HIDDEN_PREMIUM_HUNT_KEYS.slice(0, 5),
    onevone: HIDDEN_PREMIUM_HUNT_KEYS.slice(5, 10),
    fourvone: HIDDEN_PREMIUM_HUNT_KEYS.slice(10, 15),
    marketplace: HIDDEN_PREMIUM_HUNT_KEYS.slice(15, 21),
    settings: HIDDEN_PREMIUM_HUNT_KEYS.slice(21, 27)
  };

  const placements = [
    'hunt-spot-nw',
    'hunt-spot-ne',
    'hunt-spot-sw',
    'hunt-spot-se',
    'hunt-spot-mid',
    'hunt-spot-low'
  ];

  const targets = [
    { key: 'maps', el: mapsView },
    { key: 'onevone', el: oneVOneView },
    { key: 'fourvone', el: fourVOneView },
    { key: 'marketplace', el: marketplaceView },
    { key: 'settings', el: settingsWorkspace }
  ];

  targets.forEach((entry) => {
    if (!entry || !entry.el) return;
    const target = entry.el;
    target.classList.add('hunt-host');

    const layer = document.createElement('div');
    layer.className = 'hunt-clue-layer';
    layer.dataset.huntLayer = '1';

    const keys = Array.isArray(byCategory[entry.key]) && byCategory[entry.key].length >= 4
      ? byCategory[entry.key]
      : HIDDEN_PREMIUM_HUNT_KEYS.slice(0, 4);

    keys.forEach((code, idx) => {
      const clue = document.createElement('span');
      clue.className = `hunt-clue ${placements[idx % placements.length]}`;
      clue.dataset.huntClue = '1';
      clue.textContent = `trace:${code}`;
      layer.appendChild(clue);
    });

    target.appendChild(layer);
  });

  protectSensitiveTokens(appContainer);
  applySensitiveTokenVisibility(appContainer);
}

function applyLanguageEverywhere() {
  applyLanguageToStaticUI();
  updateTournamentPreview();
  updateWinstreakPreview();
  applyOneVOneUI();
  applyTournamentUI();
  applyWinstreakUI();
  setMapAutoDetectStatus(mapAutoDetectStatusKey, mapAutoDetectLastMap);
}

const defaults = {
  category: '1v1',
  region: 'NA',
  mapName: 'BayHarbor',
  mapOverlayEnabled: false,
  mapAutoDetectEnabled: false,
  mapManualNextKey: 'F3',
  mapToggleAutoDetectKey: 'F4',
  overlayWindow: {
    map: {
      opacity: 0.9,
      alwaysOnTop: false
    },
    onevone: {
      opacity: 0.9,
      alwaysOnTop: false
    },
    tournament: {
      opacity: 0.9,
      alwaysOnTop: false
    },
    winstreak: {
      opacity: 0.9,
      alwaysOnTop: false
    }
  },
  overlayTheme: {
    primaryColor: '#4fc3ff',
    accentColor: '#f4dd73',
    textColor: '#f6fbff',
    cardBgColor: '#0b1220',
    neonColor: '#3fd8ff',
    neonIntensity: 0.65,
    borderRadius: 14,
    animationStyle: 'float',
    animationSpeed: 1,
    backgroundPath: '',
    backgroundOpacity: 0.35
  },
  overlayThemeByMode: {
    map: null,
    onevone: null,
    tournament: null,
    winstreak: null
  },
  // legacy fallback fields kept for migration from older saved settings
  opacity: 0.9,
  alwaysOnTop: false,
  onevone: {
    overlayEnabled: false,
    animationsEnabled: true,
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    player1NameColor: '#ffffff',
    player2NameColor: '#ffffff',
    scoreColor: '#4fc3ff',
    timerColor: '#ffffff',
    underlineColor: '#2f7dff',
    player1Score: 0,
    player2Score: 0,
    player1Seconds: 0,
    player2Seconds: 0,
    activePlayer: 'p1',
    timerRunning: false,
    startStopKey: 'F1',
    swapKey: 'F2'
  },
  tournament: {
    tournamentName: '',
    teamOne: 'Serenity',
    teamTwo: 'Onliners',
    bestOf: '3',
    firstKillerTeam: 'team1',
    killerRotation: [
      { round: 1, team: 'team1', killer: 'Myers' },
      { round: 2, team: 'team2', killer: 'Veil' },
      { round: 3, team: 'team1', killer: 'The Cure' }
    ],
    killer: 'Veil',
    overlayEnabled: false,
    teamOneScore: 0,
    teamTwoScore: 0,
    teamOneScoreKey: 'F7',
    teamTwoScoreKey: 'F8',
    resetScoreKey: 'F9'
  },
  winstreak: {
    killer: 'Veil',
    currentStreak: 0,
    personalBest: 0,
    worldRecord: 0,
    incrementKey: 'F10',
    decrementKey: 'F11',
    resetKey: 'F12',
    overlayEnabled: false,
    transparentBackground: false
  },
  settings: {
    appFont: 'Segoe UI',
    customFontFiles: [],
    backgroundVisualPath: '',
    backgroundAudioPath: '',
    backgroundAudioStreamUrl: '',
    backgroundAudioEnabled: false,
    backgroundVolume: 0.6,
    allowVisualUpscale: false
  }
};

function deepMerge(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return structuredClone(base);
  const output = structuredClone(base);
  for (const key of Object.keys(output)) {
    if (incoming[key] === undefined) continue;
    if (
      output[key] &&
      typeof output[key] === 'object' &&
      !Array.isArray(output[key]) &&
      incoming[key] &&
      typeof incoming[key] === 'object' &&
      !Array.isArray(incoming[key])
    ) {
      output[key] = deepMerge(output[key], incoming[key]);
    } else {
      output[key] = incoming[key];
    }
  }
  return output;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return structuredClone(defaults);
    const parsed = JSON.parse(raw);
    const merged = deepMerge(defaults, parsed);

    // Backward compatibility: migrate legacy single background path to visual path.
    if (!merged.settings.backgroundVisualPath && merged.settings.backgroundPath) {
      merged.settings.backgroundVisualPath = merged.settings.backgroundPath;
    }

    // Backward compatibility: migrate legacy global overlay controls to per-mode controls.
    if (!merged.overlayWindow || typeof merged.overlayWindow !== 'object') {
      const legacyOpacity = Number.isFinite(Number(merged.opacity)) ? Number(merged.opacity) : 0.9;
      const legacyAlwaysOnTop = !!merged.alwaysOnTop;
      merged.overlayWindow = {
        map: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop },
        onevone: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop },
        tournament: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop },
        winstreak: { opacity: legacyOpacity, alwaysOnTop: legacyAlwaysOnTop }
      };
    }

    return merged;
  } catch {
    return structuredClone(defaults);
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
}

const state = loadSettings();
ensureTournamentStateShape();
let appBooted = false;
let authState = {
  user: null,
  serverUrl: ''
};
const FEATURE_ACCESS_ROLES = new Set(['premium', 'tester', 'dev']);

function modeToWindowKey(mode) {
  if (mode === '1v1') return 'onevone';
  if (mode === '4v1') return 'tournament';
  if (mode === 'winstreak') return 'winstreak';
  return 'map';
}

function getOverlayWindowConfig(mode) {
  const key = modeToWindowKey(mode);
  if (!state.overlayWindow || typeof state.overlayWindow !== 'object') {
    state.overlayWindow = structuredClone(defaults.overlayWindow);
  }
  if (!state.overlayWindow[key] || typeof state.overlayWindow[key] !== 'object') {
    state.overlayWindow[key] = structuredClone(defaults.overlayWindow[key]);
  }
  return state.overlayWindow[key];
}

function getOverlayOpacity(mode) {
  const cfg = getOverlayWindowConfig(mode);
  const value = Number(cfg.opacity);
  return Number.isFinite(value) ? value : 0.9;
}

function getOverlayAlwaysOnTop(mode) {
  return !!getOverlayWindowConfig(mode).alwaysOnTop;
}

function setOverlayOpacity(mode, value) {
  getOverlayWindowConfig(mode).opacity = Math.max(0.05, Math.min(1, Number(value) || 0.9));
}

function setOverlayAlwaysOnTop(mode, value) {
  getOverlayWindowConfig(mode).alwaysOnTop = !!value;
}

function loadAuthPrefs() {
  try {
    const raw = localStorage.getItem(AUTH_PREFS_KEY);
    if (!raw) {
      return {
        serverUrl: DEFAULT_AUTH_SERVER_URL,
        username: '',
        rememberMe: false,
        language: 'English'
      };
    }
    const parsed = JSON.parse(raw);
    const savedServerUrl = String(parsed.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
    const normalizedServerUrl = LEGACY_AUTH_SERVER_URLS.has(savedServerUrl)
      ? DEFAULT_AUTH_SERVER_URL
      : savedServerUrl;

    return {
      serverUrl: normalizedServerUrl,
      username: String(parsed.username || ''),
      rememberMe: !!parsed.rememberMe,
      language: String(parsed.language || 'English')
    };
  } catch {
    return {
      serverUrl: DEFAULT_AUTH_SERVER_URL,
      username: '',
      rememberMe: false,
      language: 'English'
    };
  }
}

function saveAuthPrefs(prefs) {
  localStorage.setItem(AUTH_PREFS_KEY, JSON.stringify(prefs));
}

const overlayWorkspace = document.getElementById('overlayWorkspace');
const settingsWorkspace = document.getElementById('settingsWorkspace');

const category = document.getElementById('category');
const mapsView = document.getElementById('mapsView');
const oneVOneView = document.getElementById('oneVOneView');
const fourVOneView = document.getElementById('fourVOneView');
const marketplaceView = document.getElementById('marketplaceView');

const regionSelect = document.getElementById('regionSelect');
const mapList = document.getElementById('mapList');
const previewImg = document.getElementById('previewImg');
const mapOverlayEnabled = document.getElementById('mapOverlayEnabled');
const mapAutoDetectEnabled = document.getElementById('mapAutoDetectEnabled');
const mapAutoDetectStatus = document.getElementById('mapAutoDetectStatus');
const mapManualNextKey = document.getElementById('mapManualNextKey');
const mapToggleAutoDetectKey = document.getElementById('mapToggleAutoDetectKey');
const clearMapManualNextKey = document.getElementById('clearMapManualNextKey');
const clearMapToggleAutoDetectKey = document.getElementById('clearMapToggleAutoDetectKey');
const closeOverlayBtn = document.getElementById('closeOverlay');
const opacity = document.getElementById('opacity');
const alwaysOnTop = document.getElementById('alwaysOnTop');

const oneVOneOverlayEnabled = document.getElementById('oneVOneOverlayEnabled');
const overlayVisibleLabel = document.getElementById('overlayVisibleLabel');
const oneVOneOpacity = document.getElementById('oneVOneOpacity');
const oneVOneAlwaysOnTop = document.getElementById('oneVOneAlwaysOnTop');
const oneVOneAnimationsEnabled = document.getElementById('oneVOneAnimationsEnabled');
const player1Name = document.getElementById('player1Name');
const player2Name = document.getElementById('player2Name');
const player1NameColor = document.getElementById('player1NameColor');
const player2NameColor = document.getElementById('player2NameColor');
const scoreColor = document.getElementById('scoreColor');
const timerColor = document.getElementById('timerColor');
const underlineColor = document.getElementById('underlineColor');
const p1Minus = document.getElementById('p1Minus');
const p1Plus = document.getElementById('p1Plus');
const p2Minus = document.getElementById('p2Minus');
const p2Plus = document.getElementById('p2Plus');
const p1Score = document.getElementById('p1Score');
const p2Score = document.getElementById('p2Score');
const timerReadout = document.getElementById('timerReadout');
const timerStartStopBtn = document.getElementById('timerStartStopBtn');
const timerResetBtn = document.getElementById('timerResetBtn');
const swapSidesBtn = document.getElementById('swapSidesBtn');

const startStopKeyBtn = document.getElementById('startStopKey');
const swapKeyBtn = document.getElementById('swapKey');
const clearStartStopKey = document.getElementById('clearStartStopKey');
const clearSwapKey = document.getElementById('clearSwapKey');

const teamOne = document.getElementById('teamOne');
const teamTwo = document.getElementById('teamTwo');
const bestOf = document.getElementById('bestOf');
const killerPick = document.getElementById('killerPick');
const killerWinstreakOverlayEnabled = document.getElementById('killerWinstreakOverlayEnabled');
const killerWinstreakOpacity = document.getElementById('killerWinstreakOpacity');
const killerWinstreakAlwaysOnTop = document.getElementById('killerWinstreakAlwaysOnTop');
const killerWinstreakTransparentBg = document.getElementById('killerWinstreakTransparentBg');
const closeKillerWinstreakOverlay = document.getElementById('closeKillerWinstreakOverlay');
const killerWinstreakPick = document.getElementById('killerWinstreakPick');
const killerWinstreakCurrent = document.getElementById('killerWinstreakCurrent');
const killerWinstreakPersonalBest = document.getElementById('killerWinstreakPersonalBest');
const killerWinstreakWorldRecord = document.getElementById('killerWinstreakWorldRecord');
const killerWinstreakPlus = document.getElementById('killerWinstreakPlus');
const killerWinstreakMinus = document.getElementById('killerWinstreakMinus');
const killerWinstreakReset = document.getElementById('killerWinstreakReset');
const killerWinstreakIncKey = document.getElementById('killerWinstreakIncKey');
const killerWinstreakDecKey = document.getElementById('killerWinstreakDecKey');
const killerWinstreakResetKey = document.getElementById('killerWinstreakResetKey');
const clearKillerWinstreakIncKey = document.getElementById('clearKillerWinstreakIncKey');
const clearKillerWinstreakDecKey = document.getElementById('clearKillerWinstreakDecKey');
const clearKillerWinstreakResetKey = document.getElementById('clearKillerWinstreakResetKey');
const tournamentOverlayEnabled = document.getElementById('tournamentOverlayEnabled');
const tournamentOpacity = document.getElementById('tournamentOpacity');
const tournamentAlwaysOnTop = document.getElementById('tournamentAlwaysOnTop');
const closeTournamentOverlay = document.getElementById('closeTournamentOverlay');
const t1Minus = document.getElementById('t1Minus');
const t1Plus = document.getElementById('t1Plus');
const t2Minus = document.getElementById('t2Minus');
const t2Plus = document.getElementById('t2Plus');
const tournamentScoreDisplay = document.getElementById('tournamentScoreDisplay');
const teamOneScoreKey = document.getElementById('teamOneScoreKey');
const teamTwoScoreKey = document.getElementById('teamTwoScoreKey');
const resetScoreKey = document.getElementById('resetScoreKey');
const clearTeamOneScoreKey = document.getElementById('clearTeamOneScoreKey');
const clearTeamTwoScoreKey = document.getElementById('clearTeamTwoScoreKey');
const clearResetScoreKey = document.getElementById('clearResetScoreKey');
const openTournamentWizardBtn = document.getElementById('openTournamentWizardBtn');
const tournamentWizardModal = document.getElementById('tournamentWizardModal');
const closeTournamentWizardBtn = document.getElementById('closeTournamentWizardBtn');
const wizardBackBtn = document.getElementById('wizardBackBtn');
const wizardCancelBtn = document.getElementById('wizardCancelBtn');
const wizardNextBtn = document.getElementById('wizardNextBtn');
const wizardCreateBtn = document.getElementById('wizardCreateBtn');
const wizardTournamentName = document.getElementById('wizardTournamentName');
const wizardTeamOne = document.getElementById('wizardTeamOne');
const wizardTeamTwo = document.getElementById('wizardTeamTwo');
const wizardBestOfGrid = document.getElementById('wizardBestOfGrid');
const wizardFirstKillerTeamOne = document.getElementById('wizardFirstKillerTeamOne');
const wizardFirstKillerTeamTwo = document.getElementById('wizardFirstKillerTeamTwo');
const wizardRotationList = document.getElementById('wizardRotationList');
const wizardReviewTournamentName = document.getElementById('wizardReviewTournamentName');
const wizardReviewFormat = document.getElementById('wizardReviewFormat');
const wizardReviewTeamOne = document.getElementById('wizardReviewTeamOne');
const wizardReviewTeamTwo = document.getElementById('wizardReviewTeamTwo');
const wizardReviewFirstKiller = document.getElementById('wizardReviewFirstKiller');
const wizardReviewRotation = document.getElementById('wizardReviewRotation');
const seriesPreview = document.getElementById('seriesPreview');
const matchupPreview = document.getElementById('matchupPreview');
const killerPreview = document.getElementById('killerPreview');
const killerWinstreakLiveKiller = document.getElementById('killerWinstreakLiveKiller');
const killerWinstreakLiveCurrent = document.getElementById('killerWinstreakLiveCurrent');
const killerWinstreakLivePersonalBest = document.getElementById('killerWinstreakLivePersonalBest');
const killerWinstreakLiveWorldRecord = document.getElementById('killerWinstreakLiveWorldRecord');

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const appFontSelect = document.getElementById('appFontSelect');
const fontPreview = document.getElementById('fontPreview');
const fontStatus = document.getElementById('fontStatus');
const customFontPath = document.getElementById('customFontPath');
const chooseCustomFontBtn = document.getElementById('chooseCustomFontBtn');
const removeCustomFontBtn = document.getElementById('removeCustomFontBtn');
const backgroundVisualPath = document.getElementById('backgroundVisualPath');
const backgroundAudioPath = document.getElementById('backgroundAudioPath');
const backgroundAudioEnabled = document.getElementById('backgroundAudioEnabled');
const backgroundVolume = document.getElementById('backgroundVolume');
const backgroundVolumeValue = document.getElementById('backgroundVolumeValue');
const chooseBackgroundVisualBtn = document.getElementById('chooseBackgroundVisualBtn');
const clearBackgroundVisualBtn = document.getElementById('clearBackgroundVisualBtn');
const chooseBackgroundAudioBtn = document.getElementById('chooseBackgroundAudioBtn');
const clearBackgroundAudioBtn = document.getElementById('clearBackgroundAudioBtn');
const allowVisualUpscale = document.getElementById('allowVisualUpscale');
const backgroundValidation = document.getElementById('backgroundValidation');
const overlayThemePrimaryColor = document.getElementById('overlayThemePrimaryColor');
const overlayThemeAccentColor = document.getElementById('overlayThemeAccentColor');
const overlayThemeTextColor = document.getElementById('overlayThemeTextColor');
const overlayThemeCardBgColor = document.getElementById('overlayThemeCardBgColor');
const overlayThemeNeonColor = document.getElementById('overlayThemeNeonColor');
const overlayThemeAnimationStyle = document.getElementById('overlayThemeAnimationStyle');
const overlayThemeBackgroundPath = document.getElementById('overlayThemeBackgroundPath');
const chooseOverlayThemeBackgroundBtn = document.getElementById('chooseOverlayThemeBackgroundBtn');
const clearOverlayThemeBackgroundBtn = document.getElementById('clearOverlayThemeBackgroundBtn');
const overlayThemeBackgroundOpacity = document.getElementById('overlayThemeBackgroundOpacity');
const overlayThemeBackgroundOpacityValue = document.getElementById('overlayThemeBackgroundOpacityValue');
const overlayThemeBorderRadius = document.getElementById('overlayThemeBorderRadius');
const overlayThemeBorderRadiusValue = document.getElementById('overlayThemeBorderRadiusValue');
const overlayThemeNeonIntensity = document.getElementById('overlayThemeNeonIntensity');
const overlayThemeNeonIntensityValue = document.getElementById('overlayThemeNeonIntensityValue');
const overlayThemeAnimationSpeed = document.getElementById('overlayThemeAnimationSpeed');
const overlayThemeAnimationSpeedValue = document.getElementById('overlayThemeAnimationSpeedValue');
const overlayThemeValidation = document.getElementById('overlayThemeValidation');
const themeMarketplaceName = document.getElementById('themeMarketplaceName');
const themeMarketplaceDescription = document.getElementById('themeMarketplaceDescription');
const publishThemeMarketplaceBtn = document.getElementById('publishThemeMarketplaceBtn');
const refreshThemeMarketplaceBtn = document.getElementById('refreshThemeMarketplaceBtn');
const themeMarketplaceSearch = document.getElementById('themeMarketplaceSearch');
const themeMarketplaceSort = document.getElementById('themeMarketplaceSort');
const themeMarketplaceFilter = document.getElementById('themeMarketplaceFilter');
const themeMarketplaceTabBrowse = document.getElementById('themeMarketplaceTabBrowse');
const themeMarketplaceTabFavorites = document.getElementById('themeMarketplaceTabFavorites');
const themeMarketplaceTabMine = document.getElementById('themeMarketplaceTabMine');
const themeMarketplaceCurrentPreview = document.getElementById('themeMarketplaceCurrentPreview');
const themeMarketplaceCurrentPreviewTitle = document.getElementById('themeMarketplaceCurrentPreviewTitle');
const themeMarketplaceCurrentPreviewSubtitle = document.getElementById('themeMarketplaceCurrentPreviewSubtitle');
const publishScopeOverlayTheme = document.getElementById('publishScopeOverlayTheme');
const publishScopeBackground = document.getElementById('publishScopeBackground');
const publishScopeOneVOne = document.getElementById('publishScopeOneVOne');
const publishScopeTournament = document.getElementById('publishScopeTournament');
const publishScopeMap = document.getElementById('publishScopeMap');
const applyScopeOverlayTheme = document.getElementById('applyScopeOverlayTheme');
const applyScopeBackground = document.getElementById('applyScopeBackground');
const applyScopeOneVOne = document.getElementById('applyScopeOneVOne');
const applyScopeTournament = document.getElementById('applyScopeTournament');
const applyScopeMap = document.getElementById('applyScopeMap');
const applyOverlayTargetOneVOne = document.getElementById('applyOverlayTargetOneVOne');
const applyOverlayTargetTournament = document.getElementById('applyOverlayTargetTournament');
const applyOverlayTargetWinstreak = document.getElementById('applyOverlayTargetWinstreak');
const applyOverlayTargetMap = document.getElementById('applyOverlayTargetMap');
const applyOverlayPresetAll = document.getElementById('applyOverlayPresetAll');
const applyOverlayPresetOneVOne = document.getElementById('applyOverlayPresetOneVOne');
const applyOverlayPresetTournament = document.getElementById('applyOverlayPresetTournament');
const applyOverlayPresetWinstreak = document.getElementById('applyOverlayPresetWinstreak');
const applyOverlayPresetMap = document.getElementById('applyOverlayPresetMap');
const themeMarketplaceStatus = document.getElementById('themeMarketplaceStatus');
const themeMarketplaceList = document.getElementById('themeMarketplaceList');
const appBackground = document.getElementById('appBackground');
const updateNotification = document.getElementById('updateNotification');
const updateMessage = document.getElementById('updateMessage');
const restartButton = document.getElementById('restartButton');
const dismissUpdateBtn = document.getElementById('dismissUpdateBtn');

const authGate = document.getElementById('authGate');
const authLoginSection = document.getElementById('authLoginSection');
const authRegisterSection = document.getElementById('authRegisterSection');
const showCreateAccountBtn = document.getElementById('showCreateAccountBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const authForm = document.getElementById('authForm');
const authServerUrl = document.getElementById('authServerUrl');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authLanguage = document.getElementById('authLanguage');
const authRememberMe = document.getElementById('authRememberMe');
const authLoginBtn = document.getElementById('authLoginBtn');
const authStatus = document.getElementById('authStatus');
const authRegisterForm = document.getElementById('authRegisterForm');
const authRegisterServerUrl = document.getElementById('authRegisterServerUrl');
const authRegisterInviteCode = document.getElementById('authRegisterInviteCode');
const authRegisterEmail = document.getElementById('authRegisterEmail');
const authRegisterUsername = document.getElementById('authRegisterUsername');
const authRegisterPassword = document.getElementById('authRegisterPassword');
const authRegisterConfirmPassword = document.getElementById('authRegisterConfirmPassword');
const authRegisterBtn = document.getElementById('authRegisterBtn');
const authRegisterStatus = document.getElementById('authRegisterStatus');
const appContainer = document.getElementById('appContainer');
const accountLabel = document.getElementById('accountLabel');
const accountRole = document.getElementById('accountRole');
const authLogoutBtn = document.getElementById('authLogoutBtn');
const premiumUpsell = document.getElementById('premiumUpsell');
const buyPremiumBtn = document.getElementById('buyPremiumBtn');
const sponsorVdlBtn = document.getElementById('sponsorVdlBtn');
const featureLockNotice = document.getElementById('featureLockNotice');

const DISCORD_BUY_URL = 'https://discord.gg/EMsvghEefN';
const DISCORD_SPONSOR_URL = 'https://discord.gg/5Vw2P8xP4g';
const SENSITIVE_TOKEN_REGEX = /\b(?:PREMIUM|TESTER|VDL)-[A-Z0-9]{4,}(?:-[A-Z0-9]{2,})+\b/g;
const SENSITIVE_REVEAL_MS = 3200;
const HIDDEN_PREMIUM_HUNT_KEYS = [
  'PREMIUM-E7C09137-3C87',
  'PREMIUM-BCA52178-8D63',
  'PREMIUM-C7E42D0B-558A',
  'PREMIUM-787AA05B-C830',
  'PREMIUM-ADBEF253-5B95',
  'PREMIUM-B216FF0E-D055',
  'PREMIUM-CAC4A1B1-809E',
  'PREMIUM-42FF68C9-D40B',
  'PREMIUM-4329ACEE-2B54',
  'PREMIUM-3022B375-C1CF',
  'PREMIUM-EF2AF2DF-2DAD',
  'PREMIUM-921FF208-C7A6',
  'PREMIUM-6AE9E3E1-9E84',
  'PREMIUM-6C1DC568-0538',
  'PREMIUM-72CD5881-EE49',
  'PREMIUM-45A428F5-13E5',
  'PREMIUM-8241401B-73F5',
  'PREMIUM-46EA3ED1-5D13',
  'PREMIUM-5579E3D0-756C',
  'PREMIUM-D8C954AC-6889',
  'PREMIUM-49C7239B-9AEE',
  'PREMIUM-F177E2C2-1AE5',
  'PREMIUM-69113233-977D',
  'PREMIUM-0A7685CE-E753',
  'PREMIUM-6229C921-24E0',
  'PREMIUM-6274110E-9DC6',
  'PREMIUM-F3FC99EF-DD62'
];
let sensitiveTokenObserver = null;

const oneVOneCustomizationControls = [
  player1NameColor,
  player2NameColor,
  timerColor,
  underlineColor,
  scoreColor
].filter(Boolean);

const visualBackgroundControls = [
  chooseBackgroundVisualBtn,
  clearBackgroundVisualBtn,
  allowVisualUpscale
].filter(Boolean);

const musicSearchInput = document.getElementById('musicSearchInput');
const musicSearchBtn = document.getElementById('musicSearchBtn');
const musicSearchResults = document.getElementById('musicSearchResults');
const musicResultsList = document.getElementById('musicResultsList');
const musicSelection = document.getElementById('musicSelection');
const selectedSongTitle = document.getElementById('selectedSongTitle');
const selectedSongArtist = document.getElementById('selectedSongArtist');
const loadMusicVideoBtn = document.getElementById('loadMusicVideoBtn');
const playSongOnlyBtn = document.getElementById('playSongOnlyBtn');
const clearMusicBtn = document.getElementById('clearMusicBtn');
const videoSearchResults = document.getElementById('videoSearchResults');
const videoResultsList = document.getElementById('videoResultsList');
const musicLoadStatus = document.getElementById('musicLoadStatus');
const musicValidation = document.getElementById('musicValidation');
const appMinimizeBtn = document.getElementById('appMinimizeBtn');
const appFullscreenBtn = document.getElementById('appFullscreenBtn');
const appCloseBtn = document.getElementById('appCloseBtn');

let captureTarget = null;
let timerInterval = null;
const loadedWebFonts = new Set();
const loadedCustomFontFaces = new Set();
let currentSelectedSong = null;
let mapAutoDetectInterval = null;
let mapAutoDetectInFlight = false;
let mapAutoDetectStatusKey = 'off';
let mapAutoDetectLastMap = '';
let mapAutoDetectPendingMap = '';
let mapAutoDetectPendingCount = 0;
let themeMarketplaceEntries = [];
let themeMarketplaceActiveTab = 'browse';
let tournamentWizardCloseTimer = null;
let tournamentWizardStep = 1;
let tournamentWizardDraft = null;
const MAP_AUTO_DETECT_MIN_CONFIDENCE = 0.45;
const MAP_AUTO_DETECT_STRONG_CONFIDENCE = 0.7;
const MAP_AUTO_DETECT_ROI = {
  x: 0.3,
  y: 0.02,
  width: 0.4,
  height: 0.12
};

function setMapAutoDetectStatus(key, mapName = '') {
  mapAutoDetectStatusKey = key;
  mapAutoDetectLastMap = String(mapName || '').trim();
  if (!mapAutoDetectStatus) return;

  let text = '';
  if (key === 'detecting') {
    text = t('Auto-detecting map from active game window...');
  } else if (key === 'off') {
    text = t('Auto-detect map is off.');
  } else if (key === 'detected') {
    text = `${t('Detected map')}: ${mapAutoDetectLastMap}`;
  } else if (key === 'none') {
    text = t('No map detected yet.');
  } else if (key === 'unavailable') {
    text = t('Map detector unavailable');
  } else if (key === 'low-confidence') {
    text = t('Low confidence map detection. Keeping current map.');
  }

  mapAutoDetectStatus.textContent = text;
}

function applyDetectedMapSelection(mapName) {
  const nextMap = String(mapName || '').trim();
  if (!nextMap) return false;

  const expectedRegion = mapRegionByName.get(nextMap) || state.region;
  let changed = false;

  if (state.region !== expectedRegion) {
    state.region = expectedRegion;
    if (regionSelect) regionSelect.value = expectedRegion;
    populateMaps(expectedRegion);
    changed = true;
  }

  if (state.mapName !== nextMap) {
    state.mapName = nextMap;
    changed = true;
  }

  if (mapList) mapList.value = nextMap;
  updateMapPreview();
  return changed;
}

function moveToNextMap() {
  const maps = state.region === 'EU' ? mapsEU : mapsNA;
  if (!Array.isArray(maps) || maps.length === 0) return;

  const currentIndex = maps.indexOf(state.mapName);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % maps.length : 0;
  state.mapName = maps[nextIndex];
  if (mapList) mapList.value = state.mapName;
  updateMapPreview();

  if (state.mapOverlayEnabled) {
    const imagePath = `../images/${state.mapName}.png`;
    window.api.updateOverlay({
      mode: 'map',
      image: imagePath,
      language: getSelectedLanguage(),
      autoFit: false
    });
  }
}

async function detectCurrentMapOnce() {
  if (!window.api || typeof window.api.detectCurrentMap !== 'function') {
    setMapAutoDetectStatus('unavailable');
    return;
  }

  if (mapAutoDetectInFlight) return;
  mapAutoDetectInFlight = true;

  try {
    setMapAutoDetectStatus('detecting');
    const result = await window.api.detectCurrentMap({
      mapNames: allKnownMaps,
      currentMap: state.mapName,
      method: 'screen',
      roi: MAP_AUTO_DETECT_ROI
    });
    if (!result || result.ok === false) {
      setMapAutoDetectStatus('unavailable');
      return;
    }

    const confidence = Number(result.confidence) || 0;
    if (confidence < MAP_AUTO_DETECT_MIN_CONFIDENCE) {
      mapAutoDetectPendingMap = '';
      mapAutoDetectPendingCount = 0;
      setMapAutoDetectStatus('low-confidence');
      return;
    }

    const detectedMap = String(result.map || '').trim();
    if (!detectedMap) {
      mapAutoDetectPendingMap = '';
      mapAutoDetectPendingCount = 0;
      setMapAutoDetectStatus('none');
      return;
    }

    if (detectedMap !== state.mapName) {
      if (mapAutoDetectPendingMap === detectedMap) {
        mapAutoDetectPendingCount += 1;
      } else {
        mapAutoDetectPendingMap = detectedMap;
        mapAutoDetectPendingCount = 1;
      }

      // Require stronger stability when confidence is moderate.
      const requiredMatches = confidence >= MAP_AUTO_DETECT_STRONG_CONFIDENCE ? 2 : 3;
      if (mapAutoDetectPendingCount < requiredMatches) {
        setMapAutoDetectStatus('detecting');
        return;
      }
    }

    mapAutoDetectPendingMap = '';
    mapAutoDetectPendingCount = 0;

    const changed = applyDetectedMapSelection(detectedMap);
    setMapAutoDetectStatus('detected', detectedMap);

    if (state.mapOverlayEnabled) {
      const imagePath = `../images/${state.mapName}.png`;
      window.api.updateOverlay({
        mode: 'map',
        image: imagePath,
        language: getSelectedLanguage(),
        autoFit: false
      });
    }

    if (changed) saveSettings();
  } catch {
    setMapAutoDetectStatus('unavailable');
  } finally {
    mapAutoDetectInFlight = false;
  }
}

function stopMapAutoDetectLoop() {
  if (mapAutoDetectInterval) {
    clearInterval(mapAutoDetectInterval);
    mapAutoDetectInterval = null;
  }
  mapAutoDetectPendingMap = '';
  mapAutoDetectPendingCount = 0;
}

function syncMapAutoDetectLoop() {
  const shouldRun = !!(state.mapOverlayEnabled && state.mapAutoDetectEnabled);
  if (!shouldRun) {
    stopMapAutoDetectLoop();
    setMapAutoDetectStatus('off');
    return;
  }

  if (!mapAutoDetectInterval) {
    void detectCurrentMapOnce();
    mapAutoDetectInterval = window.setInterval(() => {
      void detectCurrentMapOnce();
    }, 5000);
  }
}

function isWebUrl(value) {
  return /^https?:\/\//i.test((value || '').trim());
}

function mediaSource(value) {
  if (!value) return '';
  if (isWebUrl(value)) return value;
  return toFileUrl(value);
}

async function searchSongs(query) {
  const result = await window.api.spotifySearchTracks({
    query,
    limit: 15
  });

  if (!result || !result.ok) {
    throw new Error(result && result.error ? result.error : 'Song lookup failed.');
  }

  return Array.isArray(result.tracks) ? result.tracks : [];
}

function formatDurationMs(durationMs) {
  const total = Math.max(0, Math.floor((Number(durationMs) || 0) / 1000));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

async function searchYouTube(songTitle, artistName) {
  try {
    const query = `${songTitle} ${artistName} official music video`;
    // YouTube search via public interface is blocked, so we'll provide direct link format
    // User will need to click and verify the video themselves
    return generateYouTubeSearchLink(query);
  } catch {
    return null;
  }
}

function generateYouTubeSearchLink(query) {
  return {
    title: 'Official Music Video',
    artist: 'YouTube',
    searchQuery: query,
    link: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  };
}

function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.max(0, totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function toFileUrl(filePath) {
  return encodeURI(`file:///${filePath.replace(/\\/g, '/')}`);
}

function isWindowsAbsolutePath(filePath) {
  return /^[a-zA-Z]:\\/.test(filePath || '');
}

function isUncPath(filePath) {
  return /^\\\\/.test(filePath || '');
}

function mediaFileUrl(filePath) {
  if (!filePath) return '';
  if (isWebUrl(filePath)) return filePath;

  if (isWindowsAbsolutePath(filePath) || isUncPath(filePath)) {
    return toFileUrl(filePath);
  }

  try {
    return encodeURI(new URL(filePath, window.location.href).href);
  } catch {
    return toFileUrl(filePath);
  }
}

function mediaKind(filePath) {
  const lower = (filePath || '').toLowerCase();
  if (!lower) return 'none';
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) return 'video';
  if (lower.endsWith('.mp3') || lower.endsWith('.wav')) return 'audio';
  return 'image';
}

function audioKind(filePath) {
  const lower = (filePath || '').toLowerCase();
  if (!lower) return 'none';
  if (lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.ogg')) return 'audio';
  return 'other';
}

function fileExt(filePath) {
  const lower = (filePath || '').toLowerCase();
  const dot = lower.lastIndexOf('.');
  if (dot < 0) return '';
  return lower.slice(dot + 1);
}

function parseResolutionTier(width, height) {
  if (width === 1920 && height === 1080) return '1080p';
  if (width === 3840 && height === 2160) return '4K';
  return null;
}

function readImageDimensions(filePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Could not read image dimensions.'));
    };
    img.src = mediaFileUrl(filePath);
  });
}

function readVideoDimensions(filePath) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      video.src = '';
    };
    video.onerror = () => {
      reject(new Error('Could not read video dimensions.'));
      video.src = '';
    };
    video.src = mediaFileUrl(filePath);
  });
}

async function validateVisualResolution(filePath) {
  const kind = mediaKind(filePath);
  if (kind !== 'image' && kind !== 'video') {
    return {
      ok: false,
      message: 'Visual must be an image or video file.',
      width: 0,
      height: 0,
      tier: null
    };
  }

  try {
    const dimensions = kind === 'image'
      ? await readImageDimensions(filePath)
      : await readVideoDimensions(filePath);

    const tier = parseResolutionTier(dimensions.width, dimensions.height);
    if (!tier) {
      return {
        ok: false,
        message: `Visual must be 1920x1080 (1080p) or 3840x2160 (4K). Selected ${dimensions.width}x${dimensions.height}.`,
        width: dimensions.width,
        height: dimensions.height,
        tier: null
      };
    }

    return {
      ok: true,
      message: `Visual quality verified at ${tier} (${dimensions.width}x${dimensions.height}).`,
      width: dimensions.width,
      height: dimensions.height,
      tier
    };
  } catch {
    return {
      ok: false,
      message: 'Could not inspect visual resolution. Try a different file.',
      width: 0,
      height: 0,
      tier: null
    };
  }
}

function isValidVisualFile(filePath) {
  const ext = fileExt(filePath);
  return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'webm', 'ogg'].includes(ext);
}

function isValidAudioFile(filePath) {
  const ext = fileExt(filePath);
  return ['mp3', 'wav', 'ogg'].includes(ext);
}

function setBackgroundValidation(message, type) {
  if (!message) {
    backgroundValidation.textContent = '';
    backgroundValidation.classList.add('hidden');
    backgroundValidation.classList.remove('error', 'success', 'warning');
    return;
  }

  backgroundValidation.textContent = message;
  backgroundValidation.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) backgroundValidation.classList.add(type);
}

function setOverlayThemeValidation(message, type) {
  if (!overlayThemeValidation) return;
  if (!message) {
    overlayThemeValidation.textContent = '';
    overlayThemeValidation.classList.add('hidden');
    overlayThemeValidation.classList.remove('error', 'success', 'warning');
    return;
  }

  overlayThemeValidation.textContent = message;
  overlayThemeValidation.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) overlayThemeValidation.classList.add(type);
}

function setThemeMarketplaceStatus(message, type) {
  if (!themeMarketplaceStatus) return;
  if (!message) {
    themeMarketplaceStatus.textContent = '';
    themeMarketplaceStatus.classList.add('hidden');
    themeMarketplaceStatus.classList.remove('error', 'success', 'warning');
    return;
  }

  themeMarketplaceStatus.textContent = message;
  themeMarketplaceStatus.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) themeMarketplaceStatus.classList.add(type);
}

function applyThemePreviewStyles(container, titleEl, subtitleEl, theme, titleText, subtitleText) {
  if (!container) return;
  const safeTheme = theme && typeof theme === 'object' ? theme : defaults.overlayTheme;
  const neonIntensity = Math.max(0, Math.min(1, Number(safeTheme.neonIntensity) || 0.65));
  const borderRadius = Math.max(0, Math.min(40, Number(safeTheme.borderRadius) || 14));
  const cardBg = String(safeTheme.cardBgColor || '#0b1220');
  const neon = String(safeTheme.neonColor || '#3fd8ff');
  const text = String(safeTheme.textColor || '#f6fbff');

  container.style.borderRadius = `${borderRadius}px`;
  container.style.background = `linear-gradient(180deg, ${cardBg}, rgba(10, 14, 24, 0.9))`;
  container.style.borderColor = neon;
  container.style.boxShadow = `0 0 ${Math.round(14 + (neonIntensity * 22))}px ${neon}`;

  if (titleEl) {
    titleEl.textContent = titleText;
    titleEl.style.color = String(safeTheme.primaryColor || '#4fc3ff');
  }
  if (subtitleEl) {
    subtitleEl.textContent = subtitleText;
    subtitleEl.style.color = text;
  }

  const chips = container.querySelectorAll('.theme-market-preview-chip');
  chips.forEach((chip, idx) => {
    chip.style.background = idx % 2 === 0
      ? String(safeTheme.primaryColor || '#4fc3ff')
      : String(safeTheme.accentColor || '#f4dd73');
    chip.style.color = text;
  });
}

function renderCurrentThemePreview() {
  applyThemePreviewStyles(
    themeMarketplaceCurrentPreview,
    themeMarketplaceCurrentPreviewTitle,
    themeMarketplaceCurrentPreviewSubtitle,
    state.overlayTheme,
    'Current Theme Preview',
    'Live preview of the style you will publish.'
  );
}

function upsertThemeMarketplaceEntry(nextEntry) {
  if (!nextEntry || !nextEntry.id) return;
  const idx = themeMarketplaceEntries.findIndex((entry) => entry && entry.id === nextEntry.id);
  if (idx >= 0) {
    themeMarketplaceEntries[idx] = {
      ...themeMarketplaceEntries[idx],
      ...nextEntry
    };
    return;
  }
  themeMarketplaceEntries.unshift(nextEntry);
}

function removeThemeMarketplaceEntry(themeId) {
  themeMarketplaceEntries = themeMarketplaceEntries.filter((entry) => entry && entry.id !== themeId);
}

function setThemeMarketplaceActiveTab(tab) {
  const nextTab = ['browse', 'favorites', 'mine'].includes(String(tab)) ? String(tab) : 'browse';
  themeMarketplaceActiveTab = nextTab;

  if (themeMarketplaceTabBrowse) {
    themeMarketplaceTabBrowse.classList.toggle('active', nextTab === 'browse');
    themeMarketplaceTabBrowse.setAttribute('aria-selected', nextTab === 'browse' ? 'true' : 'false');
  }
  if (themeMarketplaceTabFavorites) {
    themeMarketplaceTabFavorites.classList.toggle('active', nextTab === 'favorites');
    themeMarketplaceTabFavorites.setAttribute('aria-selected', nextTab === 'favorites' ? 'true' : 'false');
  }
  if (themeMarketplaceTabMine) {
    themeMarketplaceTabMine.classList.toggle('active', nextTab === 'mine');
    themeMarketplaceTabMine.setAttribute('aria-selected', nextTab === 'mine' ? 'true' : 'false');
  }
}

function formatThemeMarketplaceDate(isoText) {
  const parsed = new Date(String(isoText || ''));
  if (Number.isNaN(parsed.getTime())) return 'Unknown date';
  return parsed.toLocaleDateString();
}

function getThemeMarketplaceVisibleEntries() {
  const search = String(themeMarketplaceSearch && themeMarketplaceSearch.value ? themeMarketplaceSearch.value : '')
    .trim()
    .toLowerCase();
  const animationFilter = String(
    themeMarketplaceFilter && themeMarketplaceFilter.value ? themeMarketplaceFilter.value : 'all'
  ).toLowerCase();
  const sortMode = String(themeMarketplaceSort && themeMarketplaceSort.value ? themeMarketplaceSort.value : 'newest');

  let entries = themeMarketplaceEntries.slice();

  if (themeMarketplaceActiveTab === 'favorites') {
    entries = entries.filter((entry) => !!entry && !!entry.isFavorited);
  } else if (themeMarketplaceActiveTab === 'mine') {
    entries = entries.filter((entry) => !!entry && !!entry.isOwner);
  }

  if (animationFilter !== 'all') {
    entries = entries.filter((entry) => String(entry && entry.theme && entry.theme.animationStyle || '').toLowerCase() === animationFilter);
  }

  if (search) {
    entries = entries.filter((entry) => {
      const haystack = [
        String(entry && entry.name ? entry.name : ''),
        String(entry && entry.description ? entry.description : ''),
        String(entry && entry.createdByUsername ? entry.createdByUsername : '')
      ].join(' ').toLowerCase();
      return haystack.includes(search);
    });
  }

  entries.sort((a, b) => {
    if (sortMode === 'name') {
      return String(a && a.name || '').localeCompare(String(b && b.name || ''));
    }
    if (sortMode === 'popular') {
      return (Number(b && b.usageCount) || 0) - (Number(a && a.usageCount) || 0);
    }
    if (sortMode === 'favorites') {
      return (Number(b && b.favoriteCount) || 0) - (Number(a && a.favoriteCount) || 0);
    }

    const aTime = new Date(String(a && a.createdAt || '')).getTime();
    const bTime = new Date(String(b && b.createdAt || '')).getTime();
    return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
  });

  return entries;
}

function getThemePublishScopeFromControls() {
  const scope = {
    backgroundCustomization: !!(publishScopeBackground && publishScopeBackground.checked),
    overlayTheme: !!(publishScopeOverlayTheme && publishScopeOverlayTheme.checked),
    onevoneTheme: !!(publishScopeOneVOne && publishScopeOneVOne.checked),
    tournamentTheme: !!(publishScopeTournament && publishScopeTournament.checked),
    mapOverlayPositions: !!(publishScopeMap && publishScopeMap.checked)
  };

  if (![
    scope.backgroundCustomization,
    scope.overlayTheme,
    scope.onevoneTheme,
    scope.tournamentTheme,
    scope.mapOverlayPositions
  ].some(Boolean)) {
    scope.overlayTheme = true;
    if (publishScopeOverlayTheme) publishScopeOverlayTheme.checked = true;
  }

  return scope;
}

function getThemeApplyScopeFromControls() {
  const scope = {
    backgroundCustomization: !!(applyScopeBackground && applyScopeBackground.checked),
    overlayTheme: !!(applyScopeOverlayTheme && applyScopeOverlayTheme.checked),
    onevoneTheme: !!(applyScopeOneVOne && applyScopeOneVOne.checked),
    tournamentTheme: !!(applyScopeTournament && applyScopeTournament.checked),
    mapOverlayPositions: !!(applyScopeMap && applyScopeMap.checked),
    overlayTargets: {
      onevone: !!(applyOverlayTargetOneVOne && applyOverlayTargetOneVOne.checked),
      tournament: !!(applyOverlayTargetTournament && applyOverlayTargetTournament.checked),
      winstreak: !!(applyOverlayTargetWinstreak && applyOverlayTargetWinstreak.checked),
      map: !!(applyOverlayTargetMap && applyOverlayTargetMap.checked)
    }
  };

  if (!Object.values(scope).some(Boolean)) {
    scope.overlayTheme = true;
    if (applyScopeOverlayTheme) applyScopeOverlayTheme.checked = true;
  }

  if (scope.overlayTheme && !Object.values(scope.overlayTargets).some(Boolean)) {
    scope.overlayTargets = {
      onevone: true,
      tournament: true,
      winstreak: true,
      map: true
    };
    if (applyOverlayTargetOneVOne) applyOverlayTargetOneVOne.checked = true;
    if (applyOverlayTargetTournament) applyOverlayTargetTournament.checked = true;
    if (applyOverlayTargetWinstreak) applyOverlayTargetWinstreak.checked = true;
    if (applyOverlayTargetMap) applyOverlayTargetMap.checked = true;
  }

  return scope;
}

function applyOverlayTargetPreset(preset) {
  const targetMap = {
    all: { onevone: true, tournament: true, winstreak: true, map: true },
    onevone: { onevone: true, tournament: false, winstreak: false, map: false },
    tournament: { onevone: false, tournament: true, winstreak: false, map: false },
    winstreak: { onevone: false, tournament: false, winstreak: true, map: false },
    map: { onevone: false, tournament: false, winstreak: false, map: true }
  };
  const next = targetMap[preset] || targetMap.all;

  if (applyOverlayTargetOneVOne) applyOverlayTargetOneVOne.checked = !!next.onevone;
  if (applyOverlayTargetTournament) applyOverlayTargetTournament.checked = !!next.tournament;
  if (applyOverlayTargetWinstreak) applyOverlayTargetWinstreak.checked = !!next.winstreak;
  if (applyOverlayTargetMap) applyOverlayTargetMap.checked = !!next.map;
  if (applyScopeOverlayTheme) applyScopeOverlayTheme.checked = true;
}

function buildThemeScopedPayload(scope) {
  const payload = {};

  if (scope.backgroundCustomization) {
    payload.backgroundCustomization = {
      backgroundVisualPath: state.settings.backgroundVisualPath || '',
      backgroundAudioPath: state.settings.backgroundAudioPath || '',
      backgroundAudioStreamUrl: state.settings.backgroundAudioStreamUrl || '',
      backgroundAudioEnabled: !!state.settings.backgroundAudioEnabled,
      backgroundVolume: Number(state.settings.backgroundVolume) || 0,
      allowVisualUpscale: !!state.settings.allowVisualUpscale
    };
  }

  if (scope.overlayTheme) {
    payload.overlayTheme = buildOverlayThemePayload();
  }

  if (scope.onevoneTheme) {
    payload.onevoneTheme = {
      animationsEnabled: state.onevone.animationsEnabled !== false,
      player1NameColor: state.onevone.player1NameColor,
      player2NameColor: state.onevone.player2NameColor,
      scoreColor: state.onevone.scoreColor,
      timerColor: state.onevone.timerColor,
      underlineColor: state.onevone.underlineColor
    };
  }

  if (scope.tournamentTheme) {
    payload.tournamentTheme = {
      tournamentName: state.tournament.tournamentName || '',
      teamOne: state.tournament.teamOne || '',
      teamTwo: state.tournament.teamTwo || '',
      bestOf: state.tournament.bestOf || '3',
      firstKillerTeam: state.tournament.firstKillerTeam || 'team1',
      killerRotation: Array.isArray(state.tournament.killerRotation)
        ? state.tournament.killerRotation.map((entry) => ({
            round: Number(entry && entry.round ? entry.round : 1),
            team: String(entry && entry.team === 'team2' ? 'team2' : 'team1'),
            killer: String(entry && entry.killer ? entry.killer : TOURNAMENT_KILLER_OPTIONS[0])
          }))
        : [],
      killer: state.tournament.killer || TOURNAMENT_KILLER_OPTIONS[0]
    };
  }

  if (scope.mapOverlayPositions) {
    const mapWindow = getOverlayWindowConfig('map');
    payload.mapOverlayPositions = {
      region: state.region || 'NA',
      mapName: state.mapName || '',
      mapAutoDetectEnabled: !!state.mapAutoDetectEnabled,
      overlayWindow: {
        opacity: Number(mapWindow.opacity) || 0.9,
        alwaysOnTop: !!mapWindow.alwaysOnTop
      }
    };
  }

  return payload;
}

function applyThemeScopedPayload(entry, applyScopeOverride = null) {
  const publishedScope = entry && entry.publishScope && typeof entry.publishScope === 'object'
    ? entry.publishScope
    : { overlayTheme: true };
  const requestedScope = applyScopeOverride && typeof applyScopeOverride === 'object'
    ? applyScopeOverride
    : publishedScope;
  const effectiveScope = {
    backgroundCustomization: !!(requestedScope.backgroundCustomization && publishedScope.backgroundCustomization),
    overlayTheme: !!(requestedScope.overlayTheme && publishedScope.overlayTheme),
    onevoneTheme: !!(requestedScope.onevoneTheme && publishedScope.onevoneTheme),
    tournamentTheme: !!(requestedScope.tournamentTheme && publishedScope.tournamentTheme),
    mapOverlayPositions: !!(requestedScope.mapOverlayPositions && publishedScope.mapOverlayPositions)
  };
  const overlayTargets = requestedScope.overlayTargets && typeof requestedScope.overlayTargets === 'object'
    ? {
        onevone: !!requestedScope.overlayTargets.onevone,
        tournament: !!requestedScope.overlayTargets.tournament,
        winstreak: !!requestedScope.overlayTargets.winstreak,
        map: !!requestedScope.overlayTargets.map
      }
    : {
        onevone: true,
        tournament: true,
        winstreak: true,
        map: true
      };

  const unavailableRequested = [];
  if (requestedScope.overlayTheme && !publishedScope.overlayTheme) unavailableRequested.push('Overlay Theme');
  if (requestedScope.backgroundCustomization && !publishedScope.backgroundCustomization) unavailableRequested.push('Background Customization');
  if (requestedScope.onevoneTheme && !publishedScope.onevoneTheme) unavailableRequested.push('1v1 Theme');
  if (requestedScope.tournamentTheme && !publishedScope.tournamentTheme) unavailableRequested.push('4v1 Tournament Theme');
  if (requestedScope.mapOverlayPositions && !publishedScope.mapOverlayPositions) unavailableRequested.push('Map Overlay Positions');

  const payload = entry && entry.payload && typeof entry.payload === 'object'
    ? entry.payload
    : {};

  let appliedCount = 0;

  if (effectiveScope.overlayTheme) {
    const nextOverlayTheme = payload.overlayTheme && typeof payload.overlayTheme === 'object'
      ? payload.overlayTheme
      : (entry && entry.theme && typeof entry.theme === 'object' ? entry.theme : {});

    const allTargetsSelected = !!(overlayTargets.onevone && overlayTargets.tournament && overlayTargets.winstreak && overlayTargets.map);
    if (allTargetsSelected) {
      state.overlayTheme = {
        ...state.overlayTheme,
        ...nextOverlayTheme
      };
      state.overlayThemeByMode = {
        map: null,
        onevone: null,
        tournament: null,
        winstreak: null
      };
      sanitizeOverlayTheme();
    } else {
      sanitizeOverlayThemeByMode();
      if (overlayTargets.map) {
        state.overlayThemeByMode.map = {
          ...(state.overlayThemeByMode.map || {}),
          ...nextOverlayTheme
        };
      }
      if (overlayTargets.onevone) {
        state.overlayThemeByMode.onevone = {
          ...(state.overlayThemeByMode.onevone || {}),
          ...nextOverlayTheme
        };
      }
      if (overlayTargets.tournament) {
        state.overlayThemeByMode.tournament = {
          ...(state.overlayThemeByMode.tournament || {}),
          ...nextOverlayTheme
        };
      }
      if (overlayTargets.winstreak) {
        state.overlayThemeByMode.winstreak = {
          ...(state.overlayThemeByMode.winstreak || {}),
          ...nextOverlayTheme
        };
      }
    }

    sendOverlayThemeUpdate();
    appliedCount += 1;
  }

  if (effectiveScope.backgroundCustomization && payload.backgroundCustomization && typeof payload.backgroundCustomization === 'object') {
    state.settings.backgroundVisualPath = String(payload.backgroundCustomization.backgroundVisualPath || '');
    state.settings.backgroundAudioPath = String(payload.backgroundCustomization.backgroundAudioPath || '');
    state.settings.backgroundAudioStreamUrl = String(payload.backgroundCustomization.backgroundAudioStreamUrl || '');
    state.settings.backgroundAudioEnabled = !!payload.backgroundCustomization.backgroundAudioEnabled;
    state.settings.backgroundVolume = Math.max(0, Math.min(1, Number(payload.backgroundCustomization.backgroundVolume) || 0));
    state.settings.allowVisualUpscale = !!payload.backgroundCustomization.allowVisualUpscale;
    appliedCount += 1;
  }

  if (effectiveScope.onevoneTheme && payload.onevoneTheme && typeof payload.onevoneTheme === 'object') {
    state.onevone.animationsEnabled = !!payload.onevoneTheme.animationsEnabled;
    state.onevone.player1NameColor = String(payload.onevoneTheme.player1NameColor || state.onevone.player1NameColor);
    state.onevone.player2NameColor = String(payload.onevoneTheme.player2NameColor || state.onevone.player2NameColor);
    state.onevone.scoreColor = String(payload.onevoneTheme.scoreColor || state.onevone.scoreColor);
    state.onevone.timerColor = String(payload.onevoneTheme.timerColor || state.onevone.timerColor);
    state.onevone.underlineColor = String(payload.onevoneTheme.underlineColor || state.onevone.underlineColor);
    appliedCount += 1;
  }

  if (effectiveScope.tournamentTheme && payload.tournamentTheme && typeof payload.tournamentTheme === 'object') {
    state.tournament.tournamentName = String(payload.tournamentTheme.tournamentName || state.tournament.tournamentName || '');
    state.tournament.teamOne = String(payload.tournamentTheme.teamOne || state.tournament.teamOne || 'Team 1');
    state.tournament.teamTwo = String(payload.tournamentTheme.teamTwo || state.tournament.teamTwo || 'Team 2');
    state.tournament.bestOf = normalizeBestOf(payload.tournamentTheme.bestOf || state.tournament.bestOf || '3');
    state.tournament.firstKillerTeam = payload.tournamentTheme.firstKillerTeam === 'team2' ? 'team2' : 'team1';
    state.tournament.killerRotation = Array.isArray(payload.tournamentTheme.killerRotation)
      ? payload.tournamentTheme.killerRotation
      : state.tournament.killerRotation;
    state.tournament.killer = String(payload.tournamentTheme.killer || state.tournament.killer || TOURNAMENT_KILLER_OPTIONS[0]);
    ensureTournamentStateShape();
    appliedCount += 1;
  }

  if (effectiveScope.mapOverlayPositions && payload.mapOverlayPositions && typeof payload.mapOverlayPositions === 'object') {
    const mapCfg = payload.mapOverlayPositions;
    if (mapCfg.region === 'NA' || mapCfg.region === 'EU') {
      state.region = mapCfg.region;
    }
    if (String(mapCfg.mapName || '').trim()) {
      state.mapName = String(mapCfg.mapName || '').trim();
    }
    state.mapAutoDetectEnabled = !!mapCfg.mapAutoDetectEnabled;
    if (mapCfg.overlayWindow && typeof mapCfg.overlayWindow === 'object') {
      setOverlayOpacity('map', Number(mapCfg.overlayWindow.opacity));
      setOverlayAlwaysOnTop('map', !!mapCfg.overlayWindow.alwaysOnTop);
    }
    syncMapAutoDetectLoop();
    appliedCount += 1;
  }

  applySettingsUI();
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();

  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
  if (state.mapOverlayEnabled) {
    window.api.updateOverlay({
      mode: 'map',
      image: `../images/${state.mapName}.png`,
      opacity: getOverlayOpacity('map'),
      alwaysOnTop: getOverlayAlwaysOnTop('map')
    });
  }

  saveSettings();

  return {
    appliedCount,
    unavailableRequested
  };
}

async function setThemeFavorite(entry, favorited) {
  if (!entry || !entry.id) return;
  if (!window.api || typeof window.api.themeMarketFavorite !== 'function') return;

  const result = await window.api.themeMarketFavorite({
    serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL,
    themeId: entry.id,
    favorited
  });

  if (!result || !result.ok) {
    setThemeMarketplaceStatus(result && result.error ? result.error : 'Could not update favorite.', 'error');
    return;
  }

  if (result.theme) upsertThemeMarketplaceEntry(result.theme);
  renderThemeMarketplaceList();
}

async function editThemeMarketplaceEntry(entry) {
  if (!entry || !entry.id) return;
  if (!window.api || typeof window.api.themeMarketUpdate !== 'function') return;

  const nextName = window.prompt('Edit theme name', String(entry.name || ''));
  if (nextName === null) return;
  const nextDescription = window.prompt('Edit theme description', String(entry.description || ''));
  if (nextDescription === null) return;

  const result = await window.api.themeMarketUpdate({
    serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL,
    themeId: entry.id,
    name: String(nextName || '').trim(),
    description: String(nextDescription || '').trim()
  });

  if (!result || !result.ok) {
    setThemeMarketplaceStatus(result && result.error ? result.error : 'Could not update theme.', 'error');
    return;
  }

  if (result.theme) upsertThemeMarketplaceEntry(result.theme);
  renderThemeMarketplaceList();
  setThemeMarketplaceStatus('Theme updated.', 'success');
}

async function updateThemeStyleFromCurrent(entry) {
  if (!entry || !entry.id) return;
  if (!window.api || typeof window.api.themeMarketUpdate !== 'function') return;

  const result = await window.api.themeMarketUpdate({
    serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL,
    themeId: entry.id,
    theme: buildOverlayThemePayload()
  });

  if (!result || !result.ok) {
    setThemeMarketplaceStatus(result && result.error ? result.error : 'Could not update theme style.', 'error');
    return;
  }

  if (result.theme) upsertThemeMarketplaceEntry(result.theme);
  renderThemeMarketplaceList();
  setThemeMarketplaceStatus('Theme style updated from current settings.', 'success');
}

async function deleteThemeMarketplaceEntry(entry) {
  if (!entry || !entry.id) return;
  if (!window.api || typeof window.api.themeMarketDelete !== 'function') return;
  const confirmed = window.confirm(`Delete theme "${entry.name}"?`);
  if (!confirmed) return;

  const result = await window.api.themeMarketDelete({
    serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL,
    themeId: entry.id
  });

  if (!result || !result.ok) {
    setThemeMarketplaceStatus(result && result.error ? result.error : 'Could not delete theme.', 'error');
    return;
  }

  removeThemeMarketplaceEntry(entry.id);
  renderThemeMarketplaceList();
  setThemeMarketplaceStatus('Theme deleted.', 'success');
}

function applyThemeFromMarketplace(entry) {
  if (!entry || typeof entry !== 'object') return;

  const applyScope = getThemeApplyScopeFromControls();
  const result = applyThemeScopedPayload(entry, applyScope);
  if (result && result.appliedCount === 0) {
    setThemeMarketplaceStatus('No selected sections were available in this theme.', 'warn');
  } else if (result && Array.isArray(result.unavailableRequested) && result.unavailableRequested.length) {
    setThemeMarketplaceStatus(`Applied theme: ${entry.name}. Unavailable: ${result.unavailableRequested.join(', ')}`, 'info');
  } else {
    setThemeMarketplaceStatus(`Applied theme: ${entry.name}`, 'success');
  }

  if (window.api && typeof window.api.themeMarketUse === 'function') {
    void window.api.themeMarketUse({
      serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL,
      themeId: entry.id
    }).then((result) => {
      if (result && result.ok && result.theme) {
        upsertThemeMarketplaceEntry(result.theme);
        renderThemeMarketplaceList();
      }
    });
  }
}

function renderThemeMarketplaceList() {
  if (!themeMarketplaceList) return;
  themeMarketplaceList.innerHTML = '';
  const entries = getThemeMarketplaceVisibleEntries();

  if (!Array.isArray(entries) || entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'settings-note';
    empty.textContent = 'No themes match this view yet.';
    themeMarketplaceList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'theme-market-card';

    const top = document.createElement('div');
    top.className = 'theme-market-card-top';

    const name = document.createElement('div');
    name.className = 'theme-market-card-name';
    name.textContent = String(entry.name || 'Untitled Theme');

    const meta = document.createElement('div');
    meta.className = 'theme-market-card-meta';
    const creator = String(entry.createdByUsername || 'unknown');
    const usageCount = Number(entry.usageCount) || 0;
    const favoriteCount = Number(entry.favoriteCount) || 0;
    meta.textContent = `by ${creator} • ${formatThemeMarketplaceDate(entry.createdAt)} • ${usageCount} uses • ${favoriteCount} likes`;

    top.appendChild(name);
    top.appendChild(meta);
    card.appendChild(top);

    if (entry.description) {
      const desc = document.createElement('p');
      desc.className = 'theme-market-card-desc';
      desc.textContent = String(entry.description);
      card.appendChild(desc);
    }

    const scope = entry.publishScope && typeof entry.publishScope === 'object'
      ? entry.publishScope
      : { overlayTheme: true };
    const scopeLabels = [];
    if (scope.overlayTheme) scopeLabels.push('Overlay');
    if (scope.backgroundCustomization) scopeLabels.push('Background');
    if (scope.onevoneTheme) scopeLabels.push('1v1');
    if (scope.tournamentTheme) scopeLabels.push('4v1');
    if (scope.mapOverlayPositions) scopeLabels.push('Map');
    if (scopeLabels.length > 0) {
      const scopeLine = document.createElement('p');
      scopeLine.className = 'theme-market-card-meta';
      scopeLine.textContent = `Includes: ${scopeLabels.join(', ')}`;
      card.appendChild(scopeLine);
    }

    const swatches = document.createElement('div');
    swatches.className = 'theme-market-swatches';
    const colors = [
      entry.theme && entry.theme.primaryColor,
      entry.theme && entry.theme.accentColor,
      entry.theme && entry.theme.textColor,
      entry.theme && entry.theme.cardBgColor,
      entry.theme && entry.theme.neonColor
    ].filter(Boolean);
    colors.forEach((color) => {
      const swatch = document.createElement('span');
      swatch.className = 'theme-market-swatch';
      swatch.style.background = String(color);
      swatches.appendChild(swatch);
    });
    card.appendChild(swatches);

    const preview = document.createElement('div');
    preview.className = 'theme-market-preview';
    const previewTitle = document.createElement('p');
    previewTitle.className = 'theme-market-preview-title';
    const previewSub = document.createElement('p');
    previewSub.className = 'theme-market-preview-subtitle';
    const previewRow = document.createElement('div');
    previewRow.className = 'theme-market-preview-row';
    const previewChipA = document.createElement('span');
    previewChipA.className = 'theme-market-preview-chip';
    previewChipA.textContent = 'Preview A';
    const previewChipB = document.createElement('span');
    previewChipB.className = 'theme-market-preview-chip';
    previewChipB.textContent = 'Preview B';
    previewRow.appendChild(previewChipA);
    previewRow.appendChild(previewChipB);
    preview.appendChild(previewTitle);
    preview.appendChild(previewSub);
    preview.appendChild(previewRow);
    applyThemePreviewStyles(preview, previewTitle, previewSub, entry.theme, 'Theme Preview', 'How this style feels in overlay UI.');
    card.appendChild(preview);

    const actions = document.createElement('div');
    actions.className = 'theme-market-card-actions';

    const favoriteBtn = document.createElement('button');
    favoriteBtn.type = 'button';
    favoriteBtn.className = 'theme-market-action-secondary';
    favoriteBtn.textContent = entry.isFavorited ? 'Unfavorite' : 'Favorite';
    favoriteBtn.addEventListener('click', async () => {
      await setThemeFavorite(entry, !entry.isFavorited);
    });
    actions.appendChild(favoriteBtn);

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.textContent = 'Apply Theme';
    applyBtn.addEventListener('click', () => applyThemeFromMarketplace(entry));
    actions.appendChild(applyBtn);

    if (entry.isOwner) {
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'theme-market-action-secondary';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', async () => {
        await editThemeMarketplaceEntry(entry);
      });
      actions.appendChild(editBtn);

      const updateStyleBtn = document.createElement('button');
      updateStyleBtn.type = 'button';
      updateStyleBtn.className = 'theme-market-action-secondary';
      updateStyleBtn.textContent = 'Update Style';
      updateStyleBtn.addEventListener('click', async () => {
        await updateThemeStyleFromCurrent(entry);
      });
      actions.appendChild(updateStyleBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'theme-market-action-danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', async () => {
        await deleteThemeMarketplaceEntry(entry);
      });
      actions.appendChild(deleteBtn);
    }

    card.appendChild(actions);

    themeMarketplaceList.appendChild(card);
  });
}

async function loadThemeMarketplace() {
  if (!window.api || typeof window.api.themeMarketList !== 'function') return;
  if (!(authState && authState.user)) return;

  try {
    const result = await window.api.themeMarketList({
      serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL
    });

    if (!result || !result.ok) {
      setThemeMarketplaceStatus(result && result.error ? result.error : 'Could not load marketplace themes.', 'error');
      return;
    }

    themeMarketplaceEntries = Array.isArray(result.themes) ? result.themes : [];
    renderThemeMarketplaceList();
    setThemeMarketplaceStatus(`Loaded ${themeMarketplaceEntries.length} marketplace theme(s).`, 'success');
  } catch (err) {
    setThemeMarketplaceStatus(err && err.message ? err.message : 'Could not load marketplace themes.', 'error');
  }
}

async function publishCurrentThemeToMarketplace() {
  if (!window.api || typeof window.api.themeMarketPublish !== 'function') return;
  if (!authState || !authState.user) {
    setThemeMarketplaceStatus('Log in to publish themes.', 'warning');
    return;
  }

  const name = String(themeMarketplaceName && themeMarketplaceName.value ? themeMarketplaceName.value : '').trim();
  const description = String(
    themeMarketplaceDescription && themeMarketplaceDescription.value ? themeMarketplaceDescription.value : ''
  ).trim();
  const publishScope = getThemePublishScopeFromControls();
  const payload = buildThemeScopedPayload(publishScope);

  if (name.length < 3) {
    setThemeMarketplaceStatus('Theme name must be at least 3 characters.', 'error');
    return;
  }

  if (publishThemeMarketplaceBtn) {
    publishThemeMarketplaceBtn.disabled = true;
    publishThemeMarketplaceBtn.textContent = 'Publishing...';
  }

  try {
    const result = await window.api.themeMarketPublish({
      serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL,
      name,
      description,
      publishScope,
      payload,
      theme: buildOverlayThemePayload()
    });

    if (!result || !result.ok) {
      setThemeMarketplaceStatus(result && result.error ? result.error : 'Theme publish failed.', 'error');
      return;
    }

    if (themeMarketplaceName) themeMarketplaceName.value = '';
    if (themeMarketplaceDescription) themeMarketplaceDescription.value = '';
    setThemeMarketplaceStatus('Theme published to marketplace.', 'success');
    await loadThemeMarketplace();
  } catch (err) {
    setThemeMarketplaceStatus(err && err.message ? err.message : 'Theme publish failed.', 'error');
  } finally {
    if (publishThemeMarketplaceBtn) {
      publishThemeMarketplaceBtn.disabled = false;
      publishThemeMarketplaceBtn.textContent = 'Publish Current Theme';
    }
  }
}

function sanitizeOverlayThemePayload(inputTheme) {
  const theme = {
    ...defaults.overlayTheme,
    ...(inputTheme && typeof inputTheme === 'object' ? inputTheme : {})
  };
  const fallback = defaults.overlayTheme;
  const styles = new Set(['none', 'float', 'pulse']);

  theme.primaryColor = String(theme.primaryColor || fallback.primaryColor);
  theme.accentColor = String(theme.accentColor || fallback.accentColor);
  theme.textColor = String(theme.textColor || fallback.textColor);
  theme.cardBgColor = String(theme.cardBgColor || fallback.cardBgColor);
  theme.neonColor = String(theme.neonColor || fallback.neonColor);
  theme.neonIntensity = Math.max(0, Math.min(1, Number(theme.neonIntensity) || fallback.neonIntensity));
  theme.borderRadius = Math.max(0, Math.min(40, Number(theme.borderRadius) || fallback.borderRadius));
  theme.animationStyle = styles.has(String(theme.animationStyle)) ? String(theme.animationStyle) : fallback.animationStyle;
  theme.animationSpeed = Math.max(0.2, Math.min(2, Number(theme.animationSpeed) || fallback.animationSpeed));
  theme.backgroundPath = String(theme.backgroundPath || '');
  theme.backgroundOpacity = Math.max(0, Math.min(1, Number(theme.backgroundOpacity) || fallback.backgroundOpacity));

  return theme;
}

function sanitizeOverlayThemeByMode() {
  if (!state.overlayThemeByMode || typeof state.overlayThemeByMode !== 'object') {
    state.overlayThemeByMode = {
      map: null,
      onevone: null,
      tournament: null,
      winstreak: null
    };
  }

  ['map', 'onevone', 'tournament', 'winstreak'].forEach((key) => {
    const value = state.overlayThemeByMode[key];
    if (!value || typeof value !== 'object') {
      state.overlayThemeByMode[key] = null;
      return;
    }
    state.overlayThemeByMode[key] = sanitizeOverlayThemePayload({
      ...state.overlayTheme,
      ...value
    });
  });
}

function sanitizeOverlayTheme() {
  state.overlayTheme = sanitizeOverlayThemePayload(state.overlayTheme);
  sanitizeOverlayThemeByMode();
}

function buildOverlayThemePayloadForMode(mode) {
  sanitizeOverlayTheme();
  const key = modeToWindowKey(mode);
  const override = state.overlayThemeByMode && state.overlayThemeByMode[key];
  if (override && typeof override === 'object') {
    return sanitizeOverlayThemePayload({
      ...state.overlayTheme,
      ...override
    });
  }
  return sanitizeOverlayThemePayload(state.overlayTheme);
}

function buildOverlayThemePayload() {
  return buildOverlayThemePayloadForMode('map');
}

function sendOverlayThemeUpdate() {
  renderCurrentThemePreview();
  ['map', '1v1', '4v1', 'winstreak'].forEach((mode) => window.api.updateOverlay({
    mode,
    theme: buildOverlayThemePayloadForMode(mode)
  }));
}

function setFontStatus(message, type) {
  if (!message) {
    fontStatus.textContent = '';
    fontStatus.classList.add('hidden');
    fontStatus.classList.remove('error', 'success');
    return;
  }
  fontStatus.textContent = message;
  fontStatus.classList.remove('hidden', 'error', 'success');
  if (type) fontStatus.classList.add(type);
}

function normalizeCustomFontList(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => ({
      name: String(entry && entry.name ? entry.name : '').trim(),
      path: String(entry && entry.path ? entry.path : '').trim()
    }))
    .filter((entry) => entry.name && entry.path);
}

function getCustomFontList() {
  return normalizeCustomFontList(state.settings.customFontFiles);
}

function findCustomFontEntry(fontName) {
  const selected = String(fontName || '').trim();
  if (!selected) return null;
  return getCustomFontList().find((entry) => entry.name === selected) || null;
}

function fileNameWithoutExt(filePath) {
  const normalized = String(filePath || '').replace(/\\/g, '/');
  const base = normalized.split('/').pop() || '';
  return base.replace(/\.[^.]+$/, '').trim() || 'Custom Font';
}

function isValidCustomFontFile(filePath) {
  const ext = fileExt(filePath);
  return ['ttf', 'otf', 'woff', 'woff2'].includes(ext);
}

function buildUniqueCustomFontName(filePath, existingFonts) {
  const base = fileNameWithoutExt(filePath);
  let candidate = `Custom ${base}`;
  let i = 2;

  while ((existingFonts || []).some((entry) => entry.name === candidate && entry.path !== filePath)) {
    candidate = `Custom ${base} ${i}`;
    i += 1;
  }

  return candidate;
}

function setAuthStatus(message, type) {
  if (!message) {
    authStatus.textContent = '';
    authStatus.classList.add('hidden');
    authStatus.classList.remove('error', 'success', 'warning');
    return;
  }

  authStatus.textContent = message;
  authStatus.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) authStatus.classList.add(type);
}

function setAuthRegisterStatus(message, type) {
  if (!message) {
    authRegisterStatus.textContent = '';
    authRegisterStatus.classList.add('hidden');
    authRegisterStatus.classList.remove('error', 'success', 'warning');
    return;
  }

  authRegisterStatus.textContent = message;
  authRegisterStatus.classList.remove('hidden', 'error', 'success', 'warning');
  if (type) authRegisterStatus.classList.add(type);
}

function setAuthMode(mode) {
  const registerMode = mode === 'register';
  if (authLoginSection) authLoginSection.classList.toggle('hidden', registerMode);
  if (authRegisterSection) authRegisterSection.classList.toggle('hidden', !registerMode);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function roleLabel(role) {
  const value = String(role || 'user').toLowerCase();
  if (value === 'premium') return t('Premium');
  if (value === 'tester') return t('Tester');
  if (value === 'dev') return t('Dev');
  return t('User');
}

function hasFeatureAccess() {
  const role = String(authState && authState.user && authState.user.role ? authState.user.role : 'user').toLowerCase();
  return FEATURE_ACCESS_ROLES.has(role);
}

function shouldShowPremiumUpsell() {
  const role = String(authState && authState.user && authState.user.role ? authState.user.role : 'user').toLowerCase();
  return role === 'user';
}

function setWorkspaceLocked(workspaceEl, locked) {
  if (!workspaceEl) return;

  workspaceEl.classList.toggle('locked-view', locked);
  const controls = workspaceEl.querySelectorAll('input, select, textarea, button');
  controls.forEach((control) => {
    control.disabled = locked;
  });
}

function setControlsLocked(controls, locked) {
  (controls || []).forEach((control) => {
    control.disabled = locked;
  });
}

function applyFeatureAccessUI() {
  const isAuthed = !!(authState.user && authState.user.username);
  const locked = isAuthed && !hasFeatureAccess();
  const oneVOneCustomizationLocked = isAuthed && !hasFeatureAccess();
  const visualBackgroundLocked = isAuthed && !hasFeatureAccess();

  if (featureLockNotice) {
    const show4v1Lock = locked && state.category === '4v1';
    const showOneVOneCustomizationLock = oneVOneCustomizationLocked && state.category === '1v1';
    const showVisualBackgroundLock = visualBackgroundLocked && state.category === 'settings';
    featureLockNotice.classList.toggle('hidden', !(show4v1Lock || showOneVOneCustomizationLock || showVisualBackgroundLock));
    if (show4v1Lock) {
      featureLockNotice.innerHTML = '<strong>4v1 Locked:</strong> This tab is only available to <strong>Premium</strong>, <strong>Tester</strong>, or <strong>Dev</strong> accounts.';
    } else if (showOneVOneCustomizationLock) {
      featureLockNotice.innerHTML = '<strong>Customization Locked:</strong> Only <strong>Player 1</strong> and <strong>Player 2</strong> names are editable on user-tier accounts. Color/style customization is for <strong>Premium</strong>, <strong>Tester</strong>, and <strong>Dev</strong>.';
    } else if (showVisualBackgroundLock) {
      featureLockNotice.innerHTML = '<strong>Background Visual Locked:</strong> Changing overlay visuals (images/videos) is available to <strong>Premium</strong>, <strong>Tester</strong>, and <strong>Dev</strong> accounts.';
    }
  }

  setWorkspaceLocked(fourVOneView, locked);
  setControlsLocked(oneVOneCustomizationControls, oneVOneCustomizationLocked);
  setControlsLocked(visualBackgroundControls, visualBackgroundLocked);
  renderThemeMarketplaceList();

  if (locked && state.tournament.overlayEnabled) {
    state.tournament.overlayEnabled = false;
    applyTournamentUI();
    saveSettings();
    void window.api.closeOverlay({ mode: '4v1' });
  }

  if (locked && state.winstreak.overlayEnabled) {
    state.winstreak.overlayEnabled = false;
    applyWinstreakUI();
    saveSettings();
    void window.api.closeOverlay({ mode: 'winstreak' });
  }
}

function applyAuthUI() {
  const isAuthed = !!(authState.user && authState.user.username);
  authGate.classList.toggle('hidden', isAuthed);
  appContainer.classList.toggle('hidden', !isAuthed);

  if (isAuthed) {
    accountLabel.textContent = `@${authState.user.username}`;
    accountRole.textContent = `${t('role')}: ${roleLabel(authState.user.role)}`;
  } else {
    accountLabel.textContent = t('Not logged in');
    accountRole.textContent = `${t('role')}: ${t('User')}`;
  }

  if (premiumUpsell) {
    premiumUpsell.classList.toggle('hidden', !(isAuthed && shouldShowPremiumUpsell()));
  }

  applySensitiveTokenVisibility(appContainer || document.body);
  applyFeatureAccessUI();
  applyLanguageEverywhere();
}

async function ensureBooted() {
  if (appBooted) {
    applyFeatureAccessUI();
    return;
  }

  bootUI();
  if (!hasFeatureAccess() && state.tournament.overlayEnabled) {
    state.tournament.overlayEnabled = false;
    saveSettings();
  }
  if (!hasFeatureAccess() && state.winstreak.overlayEnabled) {
    state.winstreak.overlayEnabled = false;
    saveSettings();
  }
  await bootOverlayState();
  appBooted = true;
  applyFeatureAccessUI();
}

async function loginWithServer() {
  const serverUrl = (authState.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
  const username = authUsername.value.trim();
  const password = authPassword.value;
  const rememberMe = !!(authRememberMe && authRememberMe.checked);
  const language = authLanguage ? String(authLanguage.value || 'English') : 'English';

  if (!username || !password) {
    setAuthStatus('Enter username and password.', 'error');
    return;
  }

  authLoginBtn.disabled = true;
  authLoginBtn.textContent = t('Logging in...');
  setAuthStatus('', '');

  try {
    const result = await window.api.authLogin({
      serverUrl,
      username,
      password
    });

    if (!result || !result.ok || !result.user) {
      setAuthStatus(result && result.error ? result.error : 'Login failed.', 'error');
      return;
    }

    authState = {
      user: result.user,
      serverUrl: result.serverUrl || ''
    };
    if (rememberMe) {
      saveAuthPrefs({
        serverUrl,
        username,
        rememberMe: true,
        language
      });
    } else {
      saveAuthPrefs({
        serverUrl,
        username: '',
        rememberMe: false,
        language
      });
    }

    authPassword.value = '';
    applyAuthUI();
    await ensureBooted();
    await loadThemeMarketplace();
  } catch (err) {
    setAuthStatus(err && err.message ? err.message : 'Login failed.', 'error');
  } finally {
    authLoginBtn.disabled = false;
    authLoginBtn.textContent = t('Login');
  }
}

async function registerWithServer() {
  const serverUrl = (authState.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
  const inviteCode = authRegisterInviteCode.value.trim();
  const email = authRegisterEmail.value.trim();
  const username = authRegisterUsername.value.trim();
  const password = authRegisterPassword.value;
  const confirmPassword = authRegisterConfirmPassword.value;

  if (!inviteCode || !email || !username || !password || !confirmPassword) {
    setAuthRegisterStatus('Enter invite code, email, username, password, and confirm password.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    setAuthRegisterStatus('Enter a valid email address.', 'error');
    return;
  }
  if (password !== confirmPassword) {
    setAuthRegisterStatus('Passwords do not match.', 'error');
    return;
  }

  authRegisterBtn.disabled = true;
  authRegisterBtn.textContent = t('Creating...');
  setAuthRegisterStatus('', '');

  try {
    const result = await window.api.authRegister({ serverUrl, inviteCode, email, username, password });
    if (!result || !result.ok) {
      setAuthRegisterStatus(result && result.error ? result.error : 'Create account failed.', 'error');
      return;
    }

    authUsername.value = username;
    authPassword.value = '';
    authRegisterInviteCode.value = '';
    authRegisterPassword.value = '';
    authRegisterConfirmPassword.value = '';
    setAuthRegisterStatus(result.message || 'Account created. You can log in now.', 'success');
    setAuthMode('login');
    setAuthStatus('Account created. Log in with your new username and password.', 'success');
  } catch (err) {
    setAuthRegisterStatus(err && err.message ? err.message : 'Create account failed.', 'error');
  } finally {
    authRegisterBtn.disabled = false;
    authRegisterBtn.textContent = t('Create Account');
  }
}

async function restoreSession() {
  themeMarketplaceEntries = [];
  renderThemeMarketplaceList();

  // Check for available updates
  try {
    const updateResult = await window.api.checkUpdates();
    if (updateResult && updateResult.ok && updateResult.updateAvailable) {
      console.log('Update is available');
    }
  } catch (err) {
    console.log('Update check skipped');
  }

  const prefs = loadAuthPrefs();
  authState.serverUrl = String(prefs.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
  if (authServerUrl) {
    authServerUrl.value = authState.serverUrl;
    authServerUrl.readOnly = true;
    authServerUrl.setAttribute('aria-readonly', 'true');
    authServerUrl.title = 'Auth host is pinned by secure runtime policy.';
  }
  authUsername.value = prefs.username || '';
  authPassword.value = '';
  if (authLanguage) authLanguage.value = prefs.language || 'English';
  if (authRememberMe) authRememberMe.checked = !!prefs.rememberMe;
  applyLanguageEverywhere();

  try {
    const result = await window.api.authMe({ serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL });
    if (result && result.ok && result.user) {
      authState = {
        user: result.user,
        serverUrl: result.serverUrl || ''
      };
      applyAuthUI();
      await ensureBooted();
      await loadThemeMarketplace();
      return;
    }
  } catch {
    // Ignore and show login form.
  }

  applyAuthUI();
}

function webFontHref(font) {
  const family = encodeURIComponent(font).replace(/%20/g, '+');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@400;600;700;800&display=swap`;
}

async function ensureFontAvailable(font) {
  const cssDescriptor = `16px "${font}"`;
  if (document.fonts && document.fonts.check(cssDescriptor)) return true;

  const customEntry = findCustomFontEntry(font);
  if (customEntry) {
    try {
      if (!loadedCustomFontFaces.has(font)) {
        const fontFace = new FontFace(font, `url("${toFileUrl(customEntry.path)}")`);
        await fontFace.load();
        if (document.fonts && document.fonts.add) {
          document.fonts.add(fontFace);
        }
        loadedCustomFontFaces.add(font);
      }

      return document.fonts ? document.fonts.check(cssDescriptor) : true;
    } catch {
      return false;
    }
  }

  if (!loadedWebFonts.has(font)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = webFontHref(font);
    document.head.appendChild(link);
    loadedWebFonts.add(font);
  }

  try {
    if (document.fonts && document.fonts.load) {
      await document.fonts.load(cssDescriptor);
    }
  } catch {
    // fallback check below
  }

  return document.fonts ? document.fonts.check(cssDescriptor) : true;
}

function applyBackgroundMedia() {
  const visualPath = state.settings.backgroundVisualPath;
  const visualKind = mediaKind(visualPath);
  const audioPath = state.settings.backgroundAudioPath;
  const audioStreamUrl = state.settings.backgroundAudioStreamUrl || '';
  const activeAudioSource = audioStreamUrl || audioPath;
  const audioTrackKind = activeAudioSource
    ? (isWebUrl(activeAudioSource) ? 'audio' : audioKind(activeAudioSource))
    : 'none';
  const allowAudio = !!state.settings.backgroundAudioEnabled;
  const volume = Math.max(0, Math.min(1, Number(state.settings.backgroundVolume) || 0));
  appBackground.style.backgroundImage = 'none';
  appBackground.innerHTML = '';

  if (visualPath && visualKind === 'image') {
    const visualUrl = mediaFileUrl(visualPath);
    const image = document.createElement('img');
    image.src = visualUrl;
    image.alt = '';
    image.decoding = 'async';
    appBackground.appendChild(image);
  }

  if (visualPath && visualKind === 'video') {
    const visualUrl = mediaFileUrl(visualPath);
    const video = document.createElement('video');
    video.src = visualUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = !allowAudio || !!activeAudioSource;
    video.volume = volume;
    video.playsInline = true;
    video.controls = false;
    appBackground.appendChild(video);
    video.play().catch(() => {});
  }

  if (activeAudioSource && audioTrackKind === 'audio') {
    const audioUrl = mediaSource(activeAudioSource);
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.autoplay = true;
    audio.loop = true;
    audio.muted = !allowAudio;
    audio.volume = volume;
    audio.controls = false;
    appBackground.appendChild(audio);
    audio.play().catch(() => {});
  }
}

function applyBackgroundPlaybackSettings() {
  const audioPath = state.settings.backgroundAudioPath;
  const audioStreamUrl = state.settings.backgroundAudioStreamUrl || '';
  const activeAudioSource = audioStreamUrl || audioPath;
  const allowAudio = !!state.settings.backgroundAudioEnabled;
  const volume = Math.max(0, Math.min(1, Number(state.settings.backgroundVolume) || 0));

  const visualVideo = appBackground.querySelector('video');
  if (visualVideo) {
    visualVideo.muted = !allowAudio || !!activeAudioSource;
    visualVideo.volume = volume;
  }

  const audioTrack = appBackground.querySelector('audio');
  if (audioTrack) {
    audioTrack.muted = !allowAudio;
    audioTrack.volume = volume;
  }
}

function applyCategoryView() {
  const value = state.category;
  category.value = value;
  const showSettings = value === 'settings';
  overlayWorkspace.classList.toggle('hidden', showSettings);
  settingsWorkspace.classList.toggle('hidden', !showSettings);
  mapsView.classList.toggle('hidden', value !== 'maps');
  oneVOneView.classList.toggle('hidden', value !== '1v1');
  fourVOneView.classList.toggle('hidden', value !== '4v1');
  if (marketplaceView) marketplaceView.classList.toggle('hidden', value !== 'marketplace');
}

function populateFontOptions() {
  appFontSelect.innerHTML = '';
  FONT_OPTIONS.forEach((font) => {
    const opt = document.createElement('option');
    opt.value = font;
    opt.textContent = font;
    appFontSelect.appendChild(opt);
  });

  const customFonts = getCustomFontList();
  if (customFonts.length > 0) {
    customFonts.forEach((entry) => {
      const opt = document.createElement('option');
      opt.value = entry.name;
      opt.textContent = `${entry.name} (Custom)`;
      appFontSelect.appendChild(opt);
    });
  }

  const selectedFont = state.settings.appFont || 'Segoe UI';
  const hasSelected = Array.from(appFontSelect.options).some((opt) => opt.value === selectedFont);
  if (!hasSelected) {
    const fallback = document.createElement('option');
    fallback.value = selectedFont;
    fallback.textContent = selectedFont;
    appFontSelect.appendChild(fallback);
  }
}

function applyAppFont() {
  const selectedFont = state.settings.appFont || 'Segoe UI';
  const fontStack = `"${selectedFont}", "Segoe UI", Arial, sans-serif`;
  document.body.style.fontFamily = fontStack;
  fontPreview.style.fontFamily = fontStack;
  fontPreview.textContent = `The quick brown fox jumps over the lazy dog 0123456789`;
}

async function applySelectedFontWithValidation() {
  const selectedFont = state.settings.appFont || 'Segoe UI';
  applyAppFont();
  const ok = await ensureFontAvailable(selectedFont);
  if (ok) {
    setFontStatus(`Font applied: ${selectedFont}`, 'success');
  } else {
    setFontStatus(`Font '${selectedFont}' is unavailable here. Fallback font is being used.`, 'error');
  }
}

function populateMaps(region = 'NA') {
  mapList.innerHTML = '';
  const maps = region === 'EU' ? mapsEU : mapsNA;
  maps.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    mapList.appendChild(opt);
  });
}

function updateMapPreview() {
  const path = `../images/${state.mapName}.png`;
  previewImg.src = path;
  previewImg.onerror = () => {
    previewImg.alt = 'Add map image in images/ folder, for example BayHarbor.png';
  };
}

function formatKey(ev) {
  if (!ev || !ev.key) return '-';
  const key = ev.key;
  if (key === ' ') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return key;
}

function updateTournamentPreview() {
  const left = (state.tournament.teamOne || '').trim() || 'Team 1';
  const right = (state.tournament.teamTwo || '').trim() || 'Team 2';
  const scoreMid = `${state.tournament.teamOneScore}-${state.tournament.teamTwoScore}`;
  seriesPreview.textContent = `${t('Best of')} ${state.tournament.bestOf}`;
  matchupPreview.textContent = `${left} ${scoreMid} ${right}`;
  killerPreview.textContent = `${t('Killer')}: ${state.tournament.killer}`;
  tournamentScoreDisplay.textContent = scoreMid;
}

function normalizeBestOf(value) {
  const allowed = new Set(['1', '2', '3', '4', '5', '7', '9']);
  const next = String(value || '').trim();
  return allowed.has(next) ? next : '3';
}

function getRotationTeamByRound(roundIndex, firstKillerTeam) {
  const startTeam = firstKillerTeam === 'team2' ? 'team2' : 'team1';
  if (roundIndex % 2 === 0) return startTeam;
  return startTeam === 'team1' ? 'team2' : 'team1';
}

function buildKillerRotation(bestOfValue, firstKillerTeam, existingRotation = []) {
  const rounds = Number.parseInt(normalizeBestOf(bestOfValue), 10);
  const source = Array.isArray(existingRotation) ? existingRotation : [];
  const fallbackKiller = TOURNAMENT_KILLER_OPTIONS[0] || 'Myers';

  return Array.from({ length: rounds }, (_, index) => {
    const round = index + 1;
    const existing = source[index] || {};
    const killerCandidate = String(existing.killer || '').trim();
    return {
      round,
      team: getRotationTeamByRound(index, firstKillerTeam),
      killer: TOURNAMENT_KILLER_OPTIONS.includes(killerCandidate) ? killerCandidate : fallbackKiller
    };
  });
}

function ensureTournamentStateShape() {
  state.tournament.bestOf = normalizeBestOf(state.tournament.bestOf);
  state.tournament.tournamentName = String(state.tournament.tournamentName || '').trim();
  state.tournament.firstKillerTeam = state.tournament.firstKillerTeam === 'team2' ? 'team2' : 'team1';
  state.tournament.killerRotation = buildKillerRotation(
    state.tournament.bestOf,
    state.tournament.firstKillerTeam,
    state.tournament.killerRotation
  );
  if (!state.tournament.killer || !TOURNAMENT_KILLER_OPTIONS.includes(state.tournament.killer)) {
    state.tournament.killer = state.tournament.killerRotation[0].killer;
  }
}

function createTournamentDraftFromState() {
  ensureTournamentStateShape();
  return {
    tournamentName: String(state.tournament.tournamentName || '').trim(),
    teamOne: String(state.tournament.teamOne || '').trim() || 'Team 1',
    teamTwo: String(state.tournament.teamTwo || '').trim() || 'Team 2',
    bestOf: normalizeBestOf(state.tournament.bestOf),
    firstKillerTeam: state.tournament.firstKillerTeam === 'team2' ? 'team2' : 'team1',
    killerRotation: buildKillerRotation(
      state.tournament.bestOf,
      state.tournament.firstKillerTeam,
      state.tournament.killerRotation
    )
  };
}

function syncWizardChoiceButtons() {
  if (!tournamentWizardDraft) return;

  const formatButtons = wizardBestOfGrid
    ? wizardBestOfGrid.querySelectorAll('.wizard-format-pill')
    : [];
  formatButtons.forEach((btn) => {
    const value = String(btn.getAttribute('data-format') || '');
    btn.classList.toggle('is-selected', value === tournamentWizardDraft.bestOf);
  });

  if (wizardFirstKillerTeamOne) {
    const label = tournamentWizardDraft.teamOne || 'Team 1';
    wizardFirstKillerTeamOne.textContent = label;
    wizardFirstKillerTeamOne.classList.toggle('is-selected', tournamentWizardDraft.firstKillerTeam === 'team1');
  }

  if (wizardFirstKillerTeamTwo) {
    const label = tournamentWizardDraft.teamTwo || 'Team 2';
    wizardFirstKillerTeamTwo.textContent = label;
    wizardFirstKillerTeamTwo.classList.toggle('is-selected', tournamentWizardDraft.firstKillerTeam === 'team2');
  }
}

function renderWizardRotationRows() {
  if (!wizardRotationList || !tournamentWizardDraft) return;
  wizardRotationList.innerHTML = '';

  tournamentWizardDraft.killerRotation.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'wizard-rotation-row';

    const round = document.createElement('span');
    round.className = 'wizard-round-label';
    round.textContent = `Round ${entry.round}`;

    const teamBadge = document.createElement('span');
    const teamClass = entry.team === 'team2' ? 'team2' : 'team1';
    teamBadge.className = `wizard-team-badge ${teamClass}`;
    teamBadge.textContent = teamClass === 'team1'
      ? (tournamentWizardDraft.teamOne || 'Team 1')
      : (tournamentWizardDraft.teamTwo || 'Team 2');

    const killerSelect = document.createElement('select');
    killerSelect.dataset.round = String(entry.round);
    TOURNAMENT_KILLER_OPTIONS.forEach((killerName) => {
      const option = document.createElement('option');
      option.value = killerName;
      option.textContent = killerName;
      if (killerName === entry.killer) option.selected = true;
      killerSelect.appendChild(option);
    });
    killerSelect.addEventListener('change', () => {
      const roundNumber = Number.parseInt(String(killerSelect.dataset.round || '0'), 10);
      const index = roundNumber - 1;
      if (index >= 0 && index < tournamentWizardDraft.killerRotation.length) {
        tournamentWizardDraft.killerRotation[index].killer = killerSelect.value;
      }
    });

    row.appendChild(round);
    row.appendChild(teamBadge);
    row.appendChild(killerSelect);
    wizardRotationList.appendChild(row);
  });
}

function renderWizardReview() {
  if (!tournamentWizardDraft) return;

  if (wizardReviewTournamentName) {
    wizardReviewTournamentName.textContent = tournamentWizardDraft.tournamentName || '-';
  }
  if (wizardReviewFormat) {
    wizardReviewFormat.textContent = `Best of ${tournamentWizardDraft.bestOf}`;
  }
  if (wizardReviewTeamOne) wizardReviewTeamOne.textContent = tournamentWizardDraft.teamOne || 'Team 1';
  if (wizardReviewTeamTwo) wizardReviewTeamTwo.textContent = tournamentWizardDraft.teamTwo || 'Team 2';
  if (wizardReviewFirstKiller) {
    wizardReviewFirstKiller.textContent = tournamentWizardDraft.firstKillerTeam === 'team2'
      ? (tournamentWizardDraft.teamTwo || 'Team 2')
      : (tournamentWizardDraft.teamOne || 'Team 1');
  }

  if (!wizardReviewRotation) return;
  wizardReviewRotation.innerHTML = '';
  tournamentWizardDraft.killerRotation.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'wizard-review-rotation-row';
    const teamClass = entry.team === 'team2' ? 'team2' : 'team1';
    const teamText = teamClass === 'team1'
      ? (tournamentWizardDraft.teamOne || 'Team 1')
      : (tournamentWizardDraft.teamTwo || 'Team 2');

    const roundLabel = document.createElement('span');
    roundLabel.className = 'wizard-round-label';
    roundLabel.textContent = `R${entry.round}`;

    const killerLabel = document.createElement('span');
    killerLabel.textContent = String(entry.killer || '');

    const teamBadge = document.createElement('span');
    teamBadge.className = `wizard-team-badge ${teamClass}`;
    teamBadge.textContent = teamText;

    item.appendChild(roundLabel);
    item.appendChild(killerLabel);
    item.appendChild(teamBadge);
    wizardReviewRotation.appendChild(item);
  });
}

function renderTournamentWizard() {
  if (!tournamentWizardModal || !tournamentWizardDraft) return;

  if (wizardTournamentName) wizardTournamentName.value = tournamentWizardDraft.tournamentName;
  if (wizardTeamOne) wizardTeamOne.value = tournamentWizardDraft.teamOne;
  if (wizardTeamTwo) wizardTeamTwo.value = tournamentWizardDraft.teamTwo;

  const pages = tournamentWizardModal.querySelectorAll('.wizard-step-page');
  pages.forEach((page) => {
    const step = Number.parseInt(String(page.getAttribute('data-step') || '1'), 10);
    page.classList.toggle('hidden', step !== tournamentWizardStep);
  });

  const dots = tournamentWizardModal.querySelectorAll('.wizard-step-dot');
  dots.forEach((dot) => {
    const step = Number.parseInt(String(dot.getAttribute('data-step') || '1'), 10);
    dot.classList.toggle('is-active', step === tournamentWizardStep);
  });

  if (wizardBackBtn) wizardBackBtn.disabled = tournamentWizardStep <= 1;
  if (wizardNextBtn) wizardNextBtn.classList.toggle('hidden', tournamentWizardStep >= 5);
  if (wizardCreateBtn) wizardCreateBtn.classList.toggle('hidden', tournamentWizardStep < 5);

  syncWizardChoiceButtons();
  renderWizardRotationRows();
  renderWizardReview();
}

function openTournamentWizard() {
  if (!tournamentWizardModal) return;
  if (tournamentWizardCloseTimer) {
    clearTimeout(tournamentWizardCloseTimer);
    tournamentWizardCloseTimer = null;
  }
  tournamentWizardDraft = createTournamentDraftFromState();
  tournamentWizardStep = 1;
  tournamentWizardModal.classList.remove('is-closing');
  tournamentWizardModal.classList.remove('hidden');
  document.body.classList.add('wizard-active');
  renderTournamentWizard();
}

function closeTournamentWizard() {
  if (!tournamentWizardModal) return;
  if (tournamentWizardModal.classList.contains('hidden')) {
    tournamentWizardDraft = null;
    document.body.classList.remove('wizard-active');
    return;
  }
  tournamentWizardModal.classList.add('is-closing');
  if (tournamentWizardCloseTimer) clearTimeout(tournamentWizardCloseTimer);
  tournamentWizardCloseTimer = window.setTimeout(() => {
    tournamentWizardModal.classList.add('hidden');
    tournamentWizardModal.classList.remove('is-closing');
    document.body.classList.remove('wizard-active');
    tournamentWizardCloseTimer = null;
  }, 170);
  tournamentWizardDraft = null;
}

function applyTournamentDraftToState() {
  if (!tournamentWizardDraft) return;

  state.tournament.tournamentName = tournamentWizardDraft.tournamentName;
  state.tournament.teamOne = tournamentWizardDraft.teamOne || 'Team 1';
  state.tournament.teamTwo = tournamentWizardDraft.teamTwo || 'Team 2';
  state.tournament.bestOf = normalizeBestOf(tournamentWizardDraft.bestOf);
  state.tournament.firstKillerTeam = tournamentWizardDraft.firstKillerTeam === 'team2' ? 'team2' : 'team1';
  state.tournament.killerRotation = buildKillerRotation(
    state.tournament.bestOf,
    state.tournament.firstKillerTeam,
    tournamentWizardDraft.killerRotation
  );
  state.tournament.killer = state.tournament.killerRotation[0].killer;
  state.tournament.teamOneScore = 0;
  state.tournament.teamTwoScore = 0;

  applyTournamentUI();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
}

function syncTournamentWizardDraftFromInputs() {
  if (!tournamentWizardDraft) return;

  if (wizardTournamentName) {
    tournamentWizardDraft.tournamentName = String(wizardTournamentName.value || '').trim();
  }
  if (wizardTeamOne) {
    tournamentWizardDraft.teamOne = String(wizardTeamOne.value || '').trim();
  }
  if (wizardTeamTwo) {
    tournamentWizardDraft.teamTwo = String(wizardTeamTwo.value || '').trim();
  }

  if (!tournamentWizardDraft.teamOne) tournamentWizardDraft.teamOne = 'Team 1';
  if (!tournamentWizardDraft.teamTwo) tournamentWizardDraft.teamTwo = 'Team 2';
}

function updateWinstreakPreview() {
  const killer = (state.winstreak.killer || '').trim() || 'Veil';
  const current = Number.isFinite(Number(state.winstreak.currentStreak)) ? Number(state.winstreak.currentStreak) : 0;
  const personalBest = Number.isFinite(Number(state.winstreak.personalBest)) ? Number(state.winstreak.personalBest) : 0;
  const worldRecord = Number.isFinite(Number(state.winstreak.worldRecord)) ? Number(state.winstreak.worldRecord) : 0;
  if (killerWinstreakLiveKiller) {
    killerWinstreakLiveKiller.textContent = `${t('Killer')}: ${killer}`;
  }
  if (killerWinstreakLiveCurrent) {
    killerWinstreakLiveCurrent.textContent = `${t('Streak')}: ${current}`;
  }
  if (killerWinstreakLivePersonalBest) {
    killerWinstreakLivePersonalBest.textContent = `${t('P. Best')}: ${personalBest}`;
  }
  if (killerWinstreakLiveWorldRecord) {
    killerWinstreakLiveWorldRecord.textContent = `${t('WR')}: ${worldRecord}`;
  }
}

function sendTournamentOverlayUpdate() {
  window.api.updateOverlay({
    mode: '4v1',
    alwaysOnTop: getOverlayAlwaysOnTop('4v1'),
    language: getSelectedLanguage(),
    fontFamily: state.settings.appFont,
    theme: buildOverlayThemePayloadForMode('4v1'),
    tournament: {
      teamOne: state.tournament.teamOne,
      teamTwo: state.tournament.teamTwo,
      teamOneScore: state.tournament.teamOneScore,
      teamTwoScore: state.tournament.teamTwoScore,
      bestOf: state.tournament.bestOf,
      killer: state.tournament.killer
    }
  });
}

function sendWinstreakOverlayUpdate() {
  window.api.updateOverlay({
    mode: 'winstreak',
    alwaysOnTop: getOverlayAlwaysOnTop('winstreak'),
    language: getSelectedLanguage(),
    fontFamily: state.settings.appFont,
    theme: buildOverlayThemePayloadForMode('winstreak'),
    winstreak: {
      killer: state.winstreak.killer,
      currentStreak: state.winstreak.currentStreak,
      personalBest: state.winstreak.personalBest,
      worldRecord: state.winstreak.worldRecord,
      transparentBackground: !!state.winstreak.transparentBackground
    }
  });
}

async function openTournamentOverlayIfEnabled() {
  if (!state.tournament.overlayEnabled || !hasFeatureAccess()) return;
  await window.api.openOverlay({
    mode: '4v1',
    opacity: getOverlayOpacity('4v1'),
    alwaysOnTop: getOverlayAlwaysOnTop('4v1'),
    language: getSelectedLanguage(),
    fontFamily: state.settings.appFont,
    theme: buildOverlayThemePayloadForMode('4v1'),
    tournament: {
      teamOne: state.tournament.teamOne,
      teamTwo: state.tournament.teamTwo,
      teamOneScore: state.tournament.teamOneScore,
      teamTwoScore: state.tournament.teamTwoScore,
      bestOf: state.tournament.bestOf,
      killer: state.tournament.killer
    }
  });
}

async function openWinstreakOverlayIfEnabled() {
  if (!state.winstreak.overlayEnabled || !hasFeatureAccess()) return;
  await window.api.openOverlay({
    mode: 'winstreak',
    opacity: getOverlayOpacity('winstreak'),
    alwaysOnTop: getOverlayAlwaysOnTop('winstreak'),
    language: getSelectedLanguage(),
    fontFamily: state.settings.appFont,
    theme: buildOverlayThemePayloadForMode('winstreak'),
    winstreak: {
      killer: state.winstreak.killer,
      currentStreak: state.winstreak.currentStreak,
      personalBest: state.winstreak.personalBest,
      worldRecord: state.winstreak.worldRecord,
      transparentBackground: !!state.winstreak.transparentBackground
    }
  });
}

function applyTimerUI() {
  const p1Time = formatTimer(state.onevone.player1Seconds);
  const p2Time = formatTimer(state.onevone.player2Seconds);
  const scoreText = `${state.onevone.player1Score}-${state.onevone.player2Score}`;
  const activeTag = state.onevone.activePlayer === 'p1' ? 'P1 live' : 'P2 live';
  timerReadout.textContent = `${state.onevone.player1Name} (${p1Time}) ${scoreText} ${state.onevone.player2Name} (${p2Time}) - ${activeTag}`;
  timerReadout.style.color = state.onevone.timerColor;
  p1Score.textContent = String(state.onevone.player1Score);
  p2Score.textContent = String(state.onevone.player2Score);
  p1Score.style.color = state.onevone.scoreColor;
  p2Score.style.color = state.onevone.scoreColor;
  timerStartStopBtn.textContent = state.onevone.timerRunning ? t('Stop') : t('Start');
}

function applyOneVOneUI() {
  oneVOneOverlayEnabled.checked = !!state.onevone.overlayEnabled;
  overlayVisibleLabel.textContent = state.onevone.overlayEnabled ? t('Overlay On') : t('Overlay Off');
  if (oneVOneOpacity) oneVOneOpacity.value = String(getOverlayOpacity('1v1'));
  if (oneVOneAlwaysOnTop) oneVOneAlwaysOnTop.checked = getOverlayAlwaysOnTop('1v1');
  if (oneVOneAnimationsEnabled) oneVOneAnimationsEnabled.checked = state.onevone.animationsEnabled !== false;

  player1Name.value = state.onevone.player1Name;
  player2Name.value = state.onevone.player2Name;
  player1NameColor.value = state.onevone.player1NameColor;
  player2NameColor.value = state.onevone.player2NameColor;
  scoreColor.value = state.onevone.scoreColor;
  timerColor.value = state.onevone.timerColor;
  underlineColor.value = state.onevone.underlineColor;

  startStopKeyBtn.textContent = state.onevone.startStopKey;
  swapKeyBtn.textContent = state.onevone.swapKey;
  applyTimerUI();
}

function applyMapsUI() {
  mapList.value = state.mapName;
  mapOverlayEnabled.checked = !!state.mapOverlayEnabled;
  if (mapAutoDetectEnabled) mapAutoDetectEnabled.checked = !!state.mapAutoDetectEnabled;
  if (mapManualNextKey) mapManualNextKey.textContent = state.mapManualNextKey || defaults.mapManualNextKey;
  if (mapToggleAutoDetectKey) mapToggleAutoDetectKey.textContent = state.mapToggleAutoDetectKey || defaults.mapToggleAutoDetectKey;
  opacity.value = String(getOverlayOpacity('map'));
  alwaysOnTop.checked = getOverlayAlwaysOnTop('map');
  updateMapPreview();
  syncMapAutoDetectLoop();
}

function syncOverlayWindowControlViews() {
  if (opacity) opacity.value = String(getOverlayOpacity('map'));
  if (alwaysOnTop) alwaysOnTop.checked = getOverlayAlwaysOnTop('map');
  if (oneVOneOpacity) oneVOneOpacity.value = String(getOverlayOpacity('1v1'));
  if (oneVOneAlwaysOnTop) oneVOneAlwaysOnTop.checked = getOverlayAlwaysOnTop('1v1');
  if (tournamentOpacity) tournamentOpacity.value = String(getOverlayOpacity('4v1'));
  if (tournamentAlwaysOnTop) tournamentAlwaysOnTop.checked = getOverlayAlwaysOnTop('4v1');
  if (killerWinstreakOpacity) killerWinstreakOpacity.value = String(getOverlayOpacity('winstreak'));
  if (killerWinstreakAlwaysOnTop) killerWinstreakAlwaysOnTop.checked = getOverlayAlwaysOnTop('winstreak');
}

function applyTournamentUI() {
  teamOne.value = state.tournament.teamOne;
  teamTwo.value = state.tournament.teamTwo;
  bestOf.value = state.tournament.bestOf;
  if (killerPick) killerPick.value = state.tournament.killer;
  tournamentOverlayEnabled.checked = !!state.tournament.overlayEnabled;
  if (tournamentOpacity) tournamentOpacity.value = String(getOverlayOpacity('4v1'));
  if (tournamentAlwaysOnTop) tournamentAlwaysOnTop.checked = getOverlayAlwaysOnTop('4v1');
  teamOneScoreKey.textContent = state.tournament.teamOneScoreKey;
  teamTwoScoreKey.textContent = state.tournament.teamTwoScoreKey;
  resetScoreKey.textContent = state.tournament.resetScoreKey;
  updateTournamentPreview();
}

function applyWinstreakUI() {
  if (killerWinstreakPick) killerWinstreakPick.value = state.winstreak.killer;
  if (killerWinstreakCurrent) killerWinstreakCurrent.value = String(Math.max(0, Number(state.winstreak.currentStreak) || 0));
  if (killerWinstreakPersonalBest) killerWinstreakPersonalBest.value = String(Math.max(0, Number(state.winstreak.personalBest) || 0));
  if (killerWinstreakWorldRecord) killerWinstreakWorldRecord.value = String(Math.max(0, Number(state.winstreak.worldRecord) || 0));
  if (killerWinstreakOverlayEnabled) killerWinstreakOverlayEnabled.checked = !!state.winstreak.overlayEnabled;
  if (killerWinstreakOpacity) killerWinstreakOpacity.value = String(getOverlayOpacity('winstreak'));
  if (killerWinstreakAlwaysOnTop) killerWinstreakAlwaysOnTop.checked = getOverlayAlwaysOnTop('winstreak');
  if (killerWinstreakTransparentBg) killerWinstreakTransparentBg.checked = !!state.winstreak.transparentBackground;
  if (killerWinstreakIncKey) killerWinstreakIncKey.textContent = state.winstreak.incrementKey;
  if (killerWinstreakDecKey) killerWinstreakDecKey.textContent = state.winstreak.decrementKey;
  if (killerWinstreakResetKey) killerWinstreakResetKey.textContent = state.winstreak.resetKey;
  updateWinstreakPreview();
  applyLanguageToStaticUI();
}

function applySettingsUI() {
  sanitizeOverlayTheme();
  renderCurrentThemePreview();
  appFontSelect.value = state.settings.appFont || 'Segoe UI';
  const selectedCustomFont = findCustomFontEntry(state.settings.appFont || '');
  customFontPath.value = selectedCustomFont ? selectedCustomFont.path : '';
  if (removeCustomFontBtn) {
    removeCustomFontBtn.disabled = !selectedCustomFont;
  }
  backgroundVisualPath.value = state.settings.backgroundVisualPath || '';
  backgroundAudioPath.value = state.settings.backgroundAudioStreamUrl || state.settings.backgroundAudioPath || '';
  backgroundAudioEnabled.checked = !!state.settings.backgroundAudioEnabled;
  allowVisualUpscale.checked = !!state.settings.allowVisualUpscale;
  backgroundVolume.value = String(Math.round((Number(state.settings.backgroundVolume) || 0) * 100));
  backgroundVolumeValue.textContent = `${backgroundVolume.value}%`;

  const warnings = [];
  if (state.settings.backgroundVisualPath && !isValidVisualFile(state.settings.backgroundVisualPath)) {
    warnings.push('Visual file type is invalid. Use png/jpg/jpeg/webp/gif/mp4/webm/ogg.');
  }
  if (state.settings.backgroundAudioPath && !state.settings.backgroundAudioStreamUrl && !isValidAudioFile(state.settings.backgroundAudioPath)) {
    warnings.push('Audio file type is invalid. Use mp3/wav/ogg.');
  }

  if (warnings.length > 0) {
    setBackgroundValidation(warnings.join(' '), 'error');
  }

  if (overlayThemePrimaryColor) overlayThemePrimaryColor.value = state.overlayTheme.primaryColor;
  if (overlayThemeAccentColor) overlayThemeAccentColor.value = state.overlayTheme.accentColor;
  if (overlayThemeTextColor) overlayThemeTextColor.value = state.overlayTheme.textColor;
  if (overlayThemeCardBgColor) overlayThemeCardBgColor.value = state.overlayTheme.cardBgColor;
  if (overlayThemeNeonColor) overlayThemeNeonColor.value = state.overlayTheme.neonColor;
  if (overlayThemeAnimationStyle) overlayThemeAnimationStyle.value = state.overlayTheme.animationStyle;
  if (overlayThemeBackgroundPath) overlayThemeBackgroundPath.value = state.overlayTheme.backgroundPath || '';

  const bgOpacityPct = Math.round(state.overlayTheme.backgroundOpacity * 100);
  if (overlayThemeBackgroundOpacity) overlayThemeBackgroundOpacity.value = String(bgOpacityPct);
  if (overlayThemeBackgroundOpacityValue) overlayThemeBackgroundOpacityValue.textContent = `${bgOpacityPct}%`;

  const neonPct = Math.round(state.overlayTheme.neonIntensity * 100);
  if (overlayThemeNeonIntensity) overlayThemeNeonIntensity.value = String(neonPct);
  if (overlayThemeNeonIntensityValue) overlayThemeNeonIntensityValue.textContent = `${neonPct}%`;

  const radiusPx = Math.round(state.overlayTheme.borderRadius);
  if (overlayThemeBorderRadius) overlayThemeBorderRadius.value = String(radiusPx);
  if (overlayThemeBorderRadiusValue) overlayThemeBorderRadiusValue.textContent = `${radiusPx}px`;

  const speedPct = Math.round(state.overlayTheme.animationSpeed * 100);
  if (overlayThemeAnimationSpeed) overlayThemeAnimationSpeed.value = String(speedPct);
  if (overlayThemeAnimationSpeedValue) overlayThemeAnimationSpeedValue.textContent = `${(speedPct / 100).toFixed(2)}x`;

  void applySelectedFontWithValidation();
  applyBackgroundMedia();
}

function sendOneVOneOverlayUpdate() {
  window.api.updateOverlay({
    mode: '1v1',
    alwaysOnTop: getOverlayAlwaysOnTop('1v1'),
    language: getSelectedLanguage(),
    fontFamily: state.settings.appFont,
    theme: buildOverlayThemePayloadForMode('1v1'),
    onevone: {
      animationsEnabled: state.onevone.animationsEnabled !== false,
      player1Name: state.onevone.player1Name,
      player2Name: state.onevone.player2Name,
      player1NameColor: state.onevone.player1NameColor,
      player2NameColor: state.onevone.player2NameColor,
      scoreColor: state.onevone.scoreColor,
      timerColor: state.onevone.timerColor,
      underlineColor: state.onevone.underlineColor,
      player1Score: state.onevone.player1Score,
      player2Score: state.onevone.player2Score,
      player1TimeText: formatTimer(state.onevone.player1Seconds),
      player2TimeText: formatTimer(state.onevone.player2Seconds)
    }
  });
}

async function openOneVOneOverlayIfEnabled() {
  if (!state.onevone.overlayEnabled) return;
  await window.api.openOverlay({
    mode: '1v1',
    opacity: getOverlayOpacity('1v1'),
    alwaysOnTop: getOverlayAlwaysOnTop('1v1'),
    language: getSelectedLanguage(),
    fontFamily: state.settings.appFont,
    theme: buildOverlayThemePayloadForMode('1v1'),
    onevone: {
      animationsEnabled: state.onevone.animationsEnabled !== false,
      player1Name: state.onevone.player1Name,
      player2Name: state.onevone.player2Name,
      player1NameColor: state.onevone.player1NameColor,
      player2NameColor: state.onevone.player2NameColor,
      scoreColor: state.onevone.scoreColor,
      timerColor: state.onevone.timerColor,
      underlineColor: state.onevone.underlineColor,
      player1Score: state.onevone.player1Score,
      player2Score: state.onevone.player2Score,
      player1TimeText: formatTimer(state.onevone.player1Seconds),
      player2TimeText: formatTimer(state.onevone.player2Seconds)
    }
  });
}

function updateTimerLoop() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (!state.onevone.timerRunning) return;
  timerInterval = window.setInterval(() => {
    if (state.onevone.activePlayer === 'p1') {
      state.onevone.player1Seconds += 1;
    } else {
      state.onevone.player2Seconds += 1;
    }
    applyTimerUI();
    if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
    saveSettings();
  }, 1000);
}

function startCapture(which) {
  captureTarget = which;
  let btn = swapKeyBtn;
  if (which === 'startStopKey') btn = startStopKeyBtn;
  if (which === 'teamOneScoreKey') btn = teamOneScoreKey;
  if (which === 'teamTwoScoreKey') btn = teamTwoScoreKey;
  if (which === 'resetScoreKey') btn = resetScoreKey;
  if (which === 'winstreakIncKey' && killerWinstreakIncKey) btn = killerWinstreakIncKey;
  if (which === 'winstreakDecKey' && killerWinstreakDecKey) btn = killerWinstreakDecKey;
  if (which === 'winstreakResetKey' && killerWinstreakResetKey) btn = killerWinstreakResetKey;
  if (which === 'mapManualNextKey' && mapManualNextKey) btn = mapManualNextKey;
  if (which === 'mapToggleAutoDetectKey' && mapToggleAutoDetectKey) btn = mapToggleAutoDetectKey;
  btn.textContent = t('Press key...');
  btn.classList.add('capturing');
}

function endCapture() {
  captureTarget = null;
  startStopKeyBtn.classList.remove('capturing');
  swapKeyBtn.classList.remove('capturing');
  teamOneScoreKey.classList.remove('capturing');
  teamTwoScoreKey.classList.remove('capturing');
  resetScoreKey.classList.remove('capturing');
  if (killerWinstreakIncKey) killerWinstreakIncKey.classList.remove('capturing');
  if (killerWinstreakDecKey) killerWinstreakDecKey.classList.remove('capturing');
  if (killerWinstreakResetKey) killerWinstreakResetKey.classList.remove('capturing');
  if (mapManualNextKey) mapManualNextKey.classList.remove('capturing');
  if (mapToggleAutoDetectKey) mapToggleAutoDetectKey.classList.remove('capturing');
  startStopKeyBtn.textContent = state.onevone.startStopKey;
  swapKeyBtn.textContent = state.onevone.swapKey;
  teamOneScoreKey.textContent = state.tournament.teamOneScoreKey;
  teamTwoScoreKey.textContent = state.tournament.teamTwoScoreKey;
  resetScoreKey.textContent = state.tournament.resetScoreKey;
  if (killerWinstreakIncKey) killerWinstreakIncKey.textContent = state.winstreak.incrementKey;
  if (killerWinstreakDecKey) killerWinstreakDecKey.textContent = state.winstreak.decrementKey;
  if (killerWinstreakResetKey) killerWinstreakResetKey.textContent = state.winstreak.resetKey;
  if (mapManualNextKey) mapManualNextKey.textContent = state.mapManualNextKey || defaults.mapManualNextKey;
  if (mapToggleAutoDetectKey) mapToggleAutoDetectKey.textContent = state.mapToggleAutoDetectKey || defaults.mapToggleAutoDetectKey;
}

function parseNonNegativeInt(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function syncWinstreakInputsToState() {
  if (killerWinstreakCurrent) state.winstreak.currentStreak = parseNonNegativeInt(killerWinstreakCurrent.value);
  if (killerWinstreakPersonalBest) state.winstreak.personalBest = parseNonNegativeInt(killerWinstreakPersonalBest.value);
  if (killerWinstreakWorldRecord) state.winstreak.worldRecord = parseNonNegativeInt(killerWinstreakWorldRecord.value);
}

function bumpWinstreak(delta) {
  state.winstreak.currentStreak = Math.max(0, parseNonNegativeInt(state.winstreak.currentStreak) + delta);
  if (state.winstreak.currentStreak > parseNonNegativeInt(state.winstreak.personalBest)) {
    state.winstreak.personalBest = state.winstreak.currentStreak;
  }
  updateWinstreakPreview();
  applyWinstreakUI();
  if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
  saveSettings();
}

function resetWinstreak() {
  state.winstreak.currentStreak = 0;
  updateWinstreakPreview();
  applyWinstreakUI();
  if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
  saveSettings();
}

function swapSides() {
  state.onevone.activePlayer = state.onevone.activePlayer === 'p1' ? 'p2' : 'p1';
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
}

function bumpTournamentScore(team, delta) {
  if (team === 'team1') {
    state.tournament.teamOneScore = Math.max(0, state.tournament.teamOneScore + delta);
  } else {
    state.tournament.teamTwoScore = Math.max(0, state.tournament.teamTwoScore + delta);
  }
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
}

function resetTournamentScore() {
  state.tournament.teamOneScore = 0;
  state.tournament.teamTwoScore = 0;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
}

function resetToDefaults() {
  const fresh = structuredClone(defaults);
  Object.assign(state, fresh);
  applyCategoryView();
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();
  applyWinstreakUI();
  applySettingsUI();
  updateTimerLoop();
  saveSettings();
}

function bootUI() {
  if (regionSelect) regionSelect.value = state.region || 'NA';
  populateMaps(state.region || 'NA');
  populateFontOptions();
  applyCategoryView();
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();
  applyWinstreakUI();
  applySettingsUI();
  updateTimerLoop();
  applyLanguageEverywhere();
}

async function bootOverlayState() {
  if (state.mapOverlayEnabled) {
    const imagePath = `../images/${state.mapName}.png`;
    await window.api.openOverlay({
      mode: 'map',
      image: imagePath,
      opacity: getOverlayOpacity('map'),
      alwaysOnTop: getOverlayAlwaysOnTop('map'),
      language: getSelectedLanguage(),
      fontFamily: state.settings.appFont,
      theme: buildOverlayThemePayloadForMode('map')
    });
    return;
  }

  if (state.onevone.overlayEnabled) {
    await openOneVOneOverlayIfEnabled();
    return;
  }

  if (state.tournament.overlayEnabled) {
    await openTournamentOverlayIfEnabled();
  }

  if (state.winstreak.overlayEnabled) {
    await openWinstreakOverlayIfEnabled();
  }
}

category.addEventListener('change', () => {
  state.category = category.value;
  applyCategoryView();
  applyFeatureAccessUI();
  if (state.category === 'marketplace') {
    void loadThemeMarketplace();
  }
  saveSettings();
});

if (regionSelect) {
  regionSelect.addEventListener('change', () => {
    state.region = regionSelect.value;
    populateMaps(state.region);
    state.mapName = mapList.value;
    updateMapPreview();
    saveSettings();
  });
}

mapList.addEventListener('change', () => {
  state.mapName = mapList.value;
  updateMapPreview();
  if (state.mapOverlayEnabled) {
    const imagePath = `../images/${state.mapName}.png`;
    window.api.updateOverlay({
      mode: 'map',
      image: imagePath,
      language: getSelectedLanguage(),
      autoFit: false
    });
  }
  saveSettings();
});

mapOverlayEnabled.addEventListener('change', async () => {
  state.mapOverlayEnabled = mapOverlayEnabled.checked;

  if (state.mapOverlayEnabled) {
    state.onevone.overlayEnabled = false;
    state.tournament.overlayEnabled = false;
    state.winstreak.overlayEnabled = false;
    applyOneVOneUI();
    applyTournamentUI();
    applyWinstreakUI();
    const imagePath = `../images/${state.mapName}.png`;
    await window.api.openOverlay({
      mode: 'map',
      image: imagePath,
      opacity: getOverlayOpacity('map'),
      alwaysOnTop: getOverlayAlwaysOnTop('map'),
      language: getSelectedLanguage(),
      fontFamily: state.settings.appFont,
      theme: buildOverlayThemePayloadForMode('map'),
      autoFit: true
    });
  } else {
    await window.api.closeOverlay();
  }

  syncMapAutoDetectLoop();
  saveSettings();
});

if (mapAutoDetectEnabled) {
  mapAutoDetectEnabled.addEventListener('change', () => {
    state.mapAutoDetectEnabled = !!mapAutoDetectEnabled.checked;
    syncMapAutoDetectLoop();
    saveSettings();
  });
}

if (mapManualNextKey) {
  mapManualNextKey.addEventListener('click', () => startCapture('mapManualNextKey'));
}

if (mapToggleAutoDetectKey) {
  mapToggleAutoDetectKey.addEventListener('click', () => startCapture('mapToggleAutoDetectKey'));
}

if (clearMapManualNextKey) {
  clearMapManualNextKey.addEventListener('click', () => {
    state.mapManualNextKey = '-';
    if (mapManualNextKey) mapManualNextKey.textContent = state.mapManualNextKey;
    saveSettings();
  });
}

if (clearMapToggleAutoDetectKey) {
  clearMapToggleAutoDetectKey.addEventListener('click', () => {
    state.mapToggleAutoDetectKey = '-';
    if (mapToggleAutoDetectKey) mapToggleAutoDetectKey.textContent = state.mapToggleAutoDetectKey;
    saveSettings();
  });
}

closeOverlayBtn.addEventListener('click', async () => {
  await window.api.closeOverlay();
  state.mapOverlayEnabled = false;
  state.onevone.overlayEnabled = false;
  state.tournament.overlayEnabled = false;
  state.winstreak.overlayEnabled = false;
  applyMapsUI();
  applyOneVOneUI();
  applyTournamentUI();
  applyWinstreakUI();
  syncMapAutoDetectLoop();
  saveSettings();
});

opacity.addEventListener('input', () => {
  setOverlayOpacity('map', parseFloat(opacity.value));
  syncOverlayWindowControlViews();
  window.api.updateOverlay({ mode: 'map', opacity: getOverlayOpacity('map'), language: getSelectedLanguage() });
  saveSettings();
});

alwaysOnTop.addEventListener('change', () => {
  setOverlayAlwaysOnTop('map', alwaysOnTop.checked);
  syncOverlayWindowControlViews();
  window.api.updateOverlay({ mode: 'map', alwaysOnTop: getOverlayAlwaysOnTop('map'), language: getSelectedLanguage() });
  saveSettings();
});

if (oneVOneOpacity) {
  oneVOneOpacity.addEventListener('input', () => {
    setOverlayOpacity('1v1', parseFloat(oneVOneOpacity.value));
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '1v1', opacity: getOverlayOpacity('1v1') });
    saveSettings();
  });
}

if (oneVOneAlwaysOnTop) {
  oneVOneAlwaysOnTop.addEventListener('change', () => {
    setOverlayAlwaysOnTop('1v1', !!oneVOneAlwaysOnTop.checked);
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '1v1', alwaysOnTop: getOverlayAlwaysOnTop('1v1') });
    saveSettings();
  });
}

if (oneVOneAnimationsEnabled) {
  oneVOneAnimationsEnabled.addEventListener('change', () => {
    state.onevone.animationsEnabled = !!oneVOneAnimationsEnabled.checked;
    if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
    saveSettings();
  });
}

if (tournamentOpacity) {
  tournamentOpacity.addEventListener('input', () => {
    setOverlayOpacity('4v1', parseFloat(tournamentOpacity.value));
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '4v1', opacity: getOverlayOpacity('4v1') });
    saveSettings();
  });
}

if (tournamentAlwaysOnTop) {
  tournamentAlwaysOnTop.addEventListener('change', () => {
    setOverlayAlwaysOnTop('4v1', !!tournamentAlwaysOnTop.checked);
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: '4v1', alwaysOnTop: getOverlayAlwaysOnTop('4v1') });
    saveSettings();
  });
}

if (killerWinstreakOpacity) {
  killerWinstreakOpacity.addEventListener('input', () => {
    setOverlayOpacity('winstreak', parseFloat(killerWinstreakOpacity.value));
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: 'winstreak', opacity: getOverlayOpacity('winstreak') });
    saveSettings();
  });
}

if (killerWinstreakAlwaysOnTop) {
  killerWinstreakAlwaysOnTop.addEventListener('change', () => {
    setOverlayAlwaysOnTop('winstreak', !!killerWinstreakAlwaysOnTop.checked);
    syncOverlayWindowControlViews();
    window.api.updateOverlay({ mode: 'winstreak', alwaysOnTop: getOverlayAlwaysOnTop('winstreak') });
    saveSettings();
  });

if (killerWinstreakTransparentBg) {
  killerWinstreakTransparentBg.addEventListener('change', () => {
    state.winstreak.transparentBackground = killerWinstreakTransparentBg.checked;
    if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
    saveSettings();
  });
}
}

appFontSelect.addEventListener('change', () => {
  state.settings.appFont = appFontSelect.value;
  void applySelectedFontWithValidation();
  window.api.updateOverlay({ fontFamily: state.settings.appFont, language: getSelectedLanguage() });
  saveSettings();
});

if (overlayThemePrimaryColor) {
  overlayThemePrimaryColor.addEventListener('input', () => {
    state.overlayTheme.primaryColor = overlayThemePrimaryColor.value;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeAccentColor) {
  overlayThemeAccentColor.addEventListener('input', () => {
    state.overlayTheme.accentColor = overlayThemeAccentColor.value;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeTextColor) {
  overlayThemeTextColor.addEventListener('input', () => {
    state.overlayTheme.textColor = overlayThemeTextColor.value;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeCardBgColor) {
  overlayThemeCardBgColor.addEventListener('input', () => {
    state.overlayTheme.cardBgColor = overlayThemeCardBgColor.value;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeNeonColor) {
  overlayThemeNeonColor.addEventListener('input', () => {
    state.overlayTheme.neonColor = overlayThemeNeonColor.value;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeAnimationStyle) {
  overlayThemeAnimationStyle.addEventListener('change', () => {
    state.overlayTheme.animationStyle = overlayThemeAnimationStyle.value;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeBackgroundOpacity) {
  overlayThemeBackgroundOpacity.addEventListener('input', () => {
    const pct = Number(overlayThemeBackgroundOpacity.value) || 0;
    state.overlayTheme.backgroundOpacity = Math.max(0, Math.min(1, pct / 100));
    if (overlayThemeBackgroundOpacityValue) overlayThemeBackgroundOpacityValue.textContent = `${pct}%`;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeBorderRadius) {
  overlayThemeBorderRadius.addEventListener('input', () => {
    const px = Number(overlayThemeBorderRadius.value) || 0;
    state.overlayTheme.borderRadius = Math.max(0, Math.min(40, px));
    if (overlayThemeBorderRadiusValue) overlayThemeBorderRadiusValue.textContent = `${Math.round(state.overlayTheme.borderRadius)}px`;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeNeonIntensity) {
  overlayThemeNeonIntensity.addEventListener('input', () => {
    const pct = Number(overlayThemeNeonIntensity.value) || 0;
    state.overlayTheme.neonIntensity = Math.max(0, Math.min(1, pct / 100));
    if (overlayThemeNeonIntensityValue) overlayThemeNeonIntensityValue.textContent = `${pct}%`;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (overlayThemeAnimationSpeed) {
  overlayThemeAnimationSpeed.addEventListener('input', () => {
    const pct = Number(overlayThemeAnimationSpeed.value) || 100;
    state.overlayTheme.animationSpeed = Math.max(0.2, Math.min(2, pct / 100));
    if (overlayThemeAnimationSpeedValue) overlayThemeAnimationSpeedValue.textContent = `${state.overlayTheme.animationSpeed.toFixed(2)}x`;
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (chooseOverlayThemeBackgroundBtn) {
  chooseOverlayThemeBackgroundBtn.addEventListener('click', async () => {
    const filePath = await window.api.chooseBackgroundMedia();
    if (!filePath) return;
    if (!isValidVisualFile(filePath)) {
      setOverlayThemeValidation('Invalid overlay background. Use png/jpg/jpeg/webp/gif/mp4/webm/ogg.', 'error');
      return;
    }

    state.overlayTheme.backgroundPath = filePath;
    if (overlayThemeBackgroundPath) overlayThemeBackgroundPath.value = filePath;
    setOverlayThemeValidation('Overlay background applied to all overlays.', 'success');
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (clearOverlayThemeBackgroundBtn) {
  clearOverlayThemeBackgroundBtn.addEventListener('click', () => {
    state.overlayTheme.backgroundPath = '';
    if (overlayThemeBackgroundPath) overlayThemeBackgroundPath.value = '';
    setOverlayThemeValidation('Overlay background cleared.', 'success');
    sendOverlayThemeUpdate();
    saveSettings();
  });
}

if (publishThemeMarketplaceBtn) {
  publishThemeMarketplaceBtn.addEventListener('click', async () => {
    await publishCurrentThemeToMarketplace();
  });
}

if (refreshThemeMarketplaceBtn) {
  refreshThemeMarketplaceBtn.addEventListener('click', async () => {
    await loadThemeMarketplace();
  });
}

if (themeMarketplaceSearch) {
  themeMarketplaceSearch.addEventListener('input', () => {
    renderThemeMarketplaceList();
  });
}

if (themeMarketplaceSort) {
  themeMarketplaceSort.addEventListener('change', () => {
    renderThemeMarketplaceList();
  });
}

if (themeMarketplaceFilter) {
  themeMarketplaceFilter.addEventListener('change', () => {
    renderThemeMarketplaceList();
  });
}

if (themeMarketplaceTabBrowse) {
  themeMarketplaceTabBrowse.addEventListener('click', () => {
    setThemeMarketplaceActiveTab('browse');
    renderThemeMarketplaceList();
  });
}

if (themeMarketplaceTabFavorites) {
  themeMarketplaceTabFavorites.addEventListener('click', () => {
    setThemeMarketplaceActiveTab('favorites');
    renderThemeMarketplaceList();
  });
}

if (themeMarketplaceTabMine) {
  themeMarketplaceTabMine.addEventListener('click', () => {
    setThemeMarketplaceActiveTab('mine');
    renderThemeMarketplaceList();
  });
}

if (applyOverlayPresetAll) {
  applyOverlayPresetAll.addEventListener('click', () => applyOverlayTargetPreset('all'));
}

if (applyOverlayPresetOneVOne) {
  applyOverlayPresetOneVOne.addEventListener('click', () => applyOverlayTargetPreset('onevone'));
}

if (applyOverlayPresetTournament) {
  applyOverlayPresetTournament.addEventListener('click', () => applyOverlayTargetPreset('tournament'));
}

if (applyOverlayPresetWinstreak) {
  applyOverlayPresetWinstreak.addEventListener('click', () => applyOverlayTargetPreset('winstreak'));
}

if (applyOverlayPresetMap) {
  applyOverlayPresetMap.addEventListener('click', () => applyOverlayTargetPreset('map'));
}

if (chooseCustomFontBtn) {
  chooseCustomFontBtn.addEventListener('click', async () => {
    const filePath = await window.api.chooseCustomFont();
    if (!filePath) return;

    if (!isValidCustomFontFile(filePath)) {
      setFontStatus('Invalid font file. Use .ttf, .otf, .woff, or .woff2.', 'error');
      return;
    }

    const existing = getCustomFontList();
    const existingByPath = existing.find((entry) => entry.path.toLowerCase() === filePath.toLowerCase());
    const fontName = existingByPath
      ? existingByPath.name
      : buildUniqueCustomFontName(filePath, existing);

    const nextFonts = existingByPath
      ? existing
      : [...existing, { name: fontName, path: filePath }];

    state.settings.customFontFiles = nextFonts;
    state.settings.appFont = fontName;
    populateFontOptions();
    applySettingsUI();
    saveSettings();
    setFontStatus(`Custom font added: ${fontName}`, 'success');
  });
}

if (removeCustomFontBtn) {
  removeCustomFontBtn.addEventListener('click', () => {
    const selected = findCustomFontEntry(state.settings.appFont || '');
    if (!selected) return;

    state.settings.customFontFiles = getCustomFontList().filter((entry) => entry.name !== selected.name);
    state.settings.appFont = 'Segoe UI';
    populateFontOptions();
    applySettingsUI();
    saveSettings();
    setFontStatus(`Removed custom font: ${selected.name}`, 'success');
  });
}

oneVOneOverlayEnabled.addEventListener('change', async () => {
  state.onevone.overlayEnabled = oneVOneOverlayEnabled.checked;
  if (state.onevone.overlayEnabled) {
    state.mapOverlayEnabled = false;
    state.tournament.overlayEnabled = false;
    state.winstreak.overlayEnabled = false;
    applyMapsUI();
    applyTournamentUI();
    applyWinstreakUI();
  }
  applyOneVOneUI();
  if (state.onevone.overlayEnabled) {
    await openOneVOneOverlayIfEnabled();
  } else {
    await window.api.closeOverlay({ mode: '1v1' });
  }
  saveSettings();
});

player1Name.addEventListener('input', () => {
  state.onevone.player1Name = player1Name.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

player2Name.addEventListener('input', () => {
  state.onevone.player2Name = player2Name.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

player1NameColor.addEventListener('input', () => {
  state.onevone.player1NameColor = player1NameColor.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

player2NameColor.addEventListener('input', () => {
  state.onevone.player2NameColor = player2NameColor.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

scoreColor.addEventListener('input', () => {
  state.onevone.scoreColor = scoreColor.value;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

timerColor.addEventListener('input', () => {
  state.onevone.timerColor = timerColor.value;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

underlineColor.addEventListener('input', () => {
  state.onevone.underlineColor = underlineColor.value;
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p1Minus.addEventListener('click', () => {
  state.onevone.player1Score -= 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p1Plus.addEventListener('click', () => {
  state.onevone.player1Score += 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p2Minus.addEventListener('click', () => {
  state.onevone.player2Score -= 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

p2Plus.addEventListener('click', () => {
  state.onevone.player2Score += 1;
  applyTimerUI();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

timerStartStopBtn.addEventListener('click', () => {
  state.onevone.timerRunning = !state.onevone.timerRunning;
  applyTimerUI();
  updateTimerLoop();
  saveSettings();
});

timerResetBtn.addEventListener('click', () => {
  state.onevone.player1Seconds = 0;
  state.onevone.player2Seconds = 0;
  state.onevone.activePlayer = 'p1';
  state.onevone.timerRunning = false;
  applyTimerUI();
  updateTimerLoop();
  if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
  saveSettings();
});

swapSidesBtn.addEventListener('click', () => {
  swapSides();
});

startStopKeyBtn.addEventListener('click', () => startCapture('startStopKey'));
swapKeyBtn.addEventListener('click', () => startCapture('swapKey'));

clearStartStopKey.addEventListener('click', () => {
  state.onevone.startStopKey = '-';
  startStopKeyBtn.textContent = state.onevone.startStopKey;
  saveSettings();
});

clearSwapKey.addEventListener('click', () => {
  state.onevone.swapKey = '-';
  swapKeyBtn.textContent = state.onevone.swapKey;
  saveSettings();
});

window.addEventListener('keydown', (ev) => {
  if (!authState.user) return;

  const targetTag = (ev.target && ev.target.tagName ? ev.target.tagName : '').toLowerCase();
  const isTypingField = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

  if (captureTarget) {
    ev.preventDefault();
    const key = formatKey(ev);
    if (captureTarget === 'startStopKey') state.onevone.startStopKey = key;
    if (captureTarget === 'swapKey') state.onevone.swapKey = key;
    if (captureTarget === 'teamOneScoreKey') state.tournament.teamOneScoreKey = key;
    if (captureTarget === 'teamTwoScoreKey') state.tournament.teamTwoScoreKey = key;
    if (captureTarget === 'resetScoreKey') state.tournament.resetScoreKey = key;
    if (captureTarget === 'winstreakIncKey') state.winstreak.incrementKey = key;
    if (captureTarget === 'winstreakDecKey') state.winstreak.decrementKey = key;
    if (captureTarget === 'winstreakResetKey') state.winstreak.resetKey = key;
    if (captureTarget === 'mapManualNextKey') state.mapManualNextKey = key;
    if (captureTarget === 'mapToggleAutoDetectKey') state.mapToggleAutoDetectKey = key;
    endCapture();
    saveSettings();
    return;
  }

  if (isTypingField) return;

  const pressed = formatKey(ev);
  if (pressed === state.onevone.startStopKey) {
    state.onevone.timerRunning = !state.onevone.timerRunning;
    applyTimerUI();
    updateTimerLoop();
    saveSettings();
  }

  if (pressed === state.onevone.swapKey) {
    swapSides();
  }

  if (hasFeatureAccess() && pressed === state.tournament.teamOneScoreKey) {
    bumpTournamentScore('team1', 1);
  }

  if (hasFeatureAccess() && pressed === state.tournament.teamTwoScoreKey) {
    bumpTournamentScore('team2', 1);
  }

  if (hasFeatureAccess() && pressed === state.tournament.resetScoreKey) {
    resetTournamentScore();
  }

  if (hasFeatureAccess() && pressed === state.winstreak.incrementKey) {
    bumpWinstreak(1);
  }

  if (hasFeatureAccess() && pressed === state.winstreak.decrementKey) {
    bumpWinstreak(-1);
  }

  if (hasFeatureAccess() && pressed === state.winstreak.resetKey) {
    resetWinstreak();
  }

  if (pressed === state.mapToggleAutoDetectKey) {
    state.mapAutoDetectEnabled = !state.mapAutoDetectEnabled;
    applyMapsUI();
    syncMapAutoDetectLoop();
    saveSettings();
  }

  if (pressed === state.mapManualNextKey) {
    if (state.mapAutoDetectEnabled) {
      state.mapAutoDetectEnabled = false;
    }
    moveToNextMap();
    applyMapsUI();
    syncMapAutoDetectLoop();
    saveSettings();
  }
});

if (openTournamentWizardBtn) {
  openTournamentWizardBtn.addEventListener('click', () => {
    openTournamentWizard();
  });
}

if (closeTournamentWizardBtn) {
  closeTournamentWizardBtn.addEventListener('click', () => {
    closeTournamentWizard();
  });
}

if (wizardCancelBtn) {
  wizardCancelBtn.addEventListener('click', () => {
    closeTournamentWizard();
  });
}

if (wizardBestOfGrid) {
  wizardBestOfGrid.querySelectorAll('.wizard-format-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!tournamentWizardDraft) return;
      const nextBestOf = normalizeBestOf(btn.getAttribute('data-format'));
      tournamentWizardDraft.bestOf = nextBestOf;
      tournamentWizardDraft.killerRotation = buildKillerRotation(
        nextBestOf,
        tournamentWizardDraft.firstKillerTeam,
        tournamentWizardDraft.killerRotation
      );
      renderTournamentWizard();
    });
  });
}

if (wizardFirstKillerTeamOne) {
  wizardFirstKillerTeamOne.addEventListener('click', () => {
    if (!tournamentWizardDraft) return;
    tournamentWizardDraft.firstKillerTeam = 'team1';
    tournamentWizardDraft.killerRotation = buildKillerRotation(
      tournamentWizardDraft.bestOf,
      tournamentWizardDraft.firstKillerTeam,
      tournamentWizardDraft.killerRotation
    );
    renderTournamentWizard();
  });
}

if (wizardFirstKillerTeamTwo) {
  wizardFirstKillerTeamTwo.addEventListener('click', () => {
    if (!tournamentWizardDraft) return;
    tournamentWizardDraft.firstKillerTeam = 'team2';
    tournamentWizardDraft.killerRotation = buildKillerRotation(
      tournamentWizardDraft.bestOf,
      tournamentWizardDraft.firstKillerTeam,
      tournamentWizardDraft.killerRotation
    );
    renderTournamentWizard();
  });
}

if (wizardBackBtn) {
  wizardBackBtn.addEventListener('click', () => {
    if (!tournamentWizardDraft) return;
    syncTournamentWizardDraftFromInputs();
    tournamentWizardStep = Math.max(1, tournamentWizardStep - 1);
    renderTournamentWizard();
  });
}

if (wizardNextBtn) {
  wizardNextBtn.addEventListener('click', () => {
    if (!tournamentWizardDraft) return;
    syncTournamentWizardDraftFromInputs();
    tournamentWizardStep = Math.min(5, tournamentWizardStep + 1);
    renderTournamentWizard();
  });
}

if (wizardCreateBtn) {
  wizardCreateBtn.addEventListener('click', () => {
    if (!tournamentWizardDraft) return;
    syncTournamentWizardDraftFromInputs();
    applyTournamentDraftToState();
    closeTournamentWizard();
  });
}

teamOne.addEventListener('input', () => {
  state.tournament.teamOne = teamOne.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

teamTwo.addEventListener('input', () => {
  state.tournament.teamTwo = teamTwo.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

bestOf.addEventListener('change', () => {
  state.tournament.bestOf = bestOf.value;
  updateTournamentPreview();
  if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
  saveSettings();
});

if (killerPick) {
  killerPick.addEventListener('change', () => {
    state.tournament.killer = killerPick.value;
    updateTournamentPreview();
    if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
    saveSettings();
  });
}

if (killerWinstreakPick) {
  killerWinstreakPick.addEventListener('change', () => {
    state.winstreak.killer = killerWinstreakPick.value;
    updateWinstreakPreview();
    if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
    saveSettings();
  });
}

if (killerWinstreakCurrent) {
  killerWinstreakCurrent.addEventListener('input', () => {
    syncWinstreakInputsToState();
    updateWinstreakPreview();
    if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
    saveSettings();
  });
}

if (killerWinstreakPersonalBest) {
  killerWinstreakPersonalBest.addEventListener('input', () => {
    syncWinstreakInputsToState();
    updateWinstreakPreview();
    if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
    saveSettings();
  });
}

if (killerWinstreakWorldRecord) {
  killerWinstreakWorldRecord.addEventListener('input', () => {
    syncWinstreakInputsToState();
    updateWinstreakPreview();
    if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
    saveSettings();
  });
}

if (killerWinstreakPlus) {
  killerWinstreakPlus.addEventListener('click', () => {
    bumpWinstreak(1);
  });
}

if (killerWinstreakMinus) {
  killerWinstreakMinus.addEventListener('click', () => {
    bumpWinstreak(-1);
  });
}

if (killerWinstreakReset) {
  killerWinstreakReset.addEventListener('click', () => {
    resetWinstreak();
  });
}

if (killerWinstreakIncKey) {
  killerWinstreakIncKey.addEventListener('click', () => startCapture('winstreakIncKey'));
}

if (killerWinstreakDecKey) {
  killerWinstreakDecKey.addEventListener('click', () => startCapture('winstreakDecKey'));
}

if (killerWinstreakResetKey) {
  killerWinstreakResetKey.addEventListener('click', () => startCapture('winstreakResetKey'));
}

if (clearKillerWinstreakIncKey) {
  clearKillerWinstreakIncKey.addEventListener('click', () => {
    state.winstreak.incrementKey = '-';
    if (killerWinstreakIncKey) killerWinstreakIncKey.textContent = state.winstreak.incrementKey;
    saveSettings();
  });
}

if (clearKillerWinstreakDecKey) {
  clearKillerWinstreakDecKey.addEventListener('click', () => {
    state.winstreak.decrementKey = '-';
    if (killerWinstreakDecKey) killerWinstreakDecKey.textContent = state.winstreak.decrementKey;
    saveSettings();
  });
}

if (clearKillerWinstreakResetKey) {
  clearKillerWinstreakResetKey.addEventListener('click', () => {
    state.winstreak.resetKey = '-';
    if (killerWinstreakResetKey) killerWinstreakResetKey.textContent = state.winstreak.resetKey;
    saveSettings();
  });
}

tournamentOverlayEnabled.addEventListener('change', async () => {
  if (!hasFeatureAccess()) {
    tournamentOverlayEnabled.checked = false;
    state.tournament.overlayEnabled = false;
    applyTournamentUI();
    applyFeatureAccessUI();
    saveSettings();
    return;
  }

  state.tournament.overlayEnabled = tournamentOverlayEnabled.checked;
  if (state.tournament.overlayEnabled) {
    state.mapOverlayEnabled = false;
    state.onevone.overlayEnabled = false;
    applyMapsUI();
    applyOneVOneUI();
    await openTournamentOverlayIfEnabled();
  } else {
    await window.api.closeOverlay({ mode: '4v1' });
  }
  applyTournamentUI();
  saveSettings();
});

closeTournamentOverlay.addEventListener('click', async () => {
  state.tournament.overlayEnabled = false;
  applyTournamentUI();
  await window.api.closeOverlay({ mode: '4v1' });
  saveSettings();
});

if (killerWinstreakOverlayEnabled) {
  killerWinstreakOverlayEnabled.addEventListener('change', async () => {
    if (!hasFeatureAccess()) {
      killerWinstreakOverlayEnabled.checked = false;
      state.winstreak.overlayEnabled = false;
      applyWinstreakUI();
      applyFeatureAccessUI();
      saveSettings();
      return;
    }

    state.winstreak.overlayEnabled = killerWinstreakOverlayEnabled.checked;
    if (state.winstreak.overlayEnabled) {
      state.mapOverlayEnabled = false;
      state.onevone.overlayEnabled = false;
      applyMapsUI();
      applyOneVOneUI();
      await openWinstreakOverlayIfEnabled();
    } else {
      await window.api.closeOverlay({ mode: 'winstreak' });
    }
    applyWinstreakUI();
    saveSettings();
  });
}

if (closeKillerWinstreakOverlay) {
  closeKillerWinstreakOverlay.addEventListener('click', async () => {
    state.winstreak.overlayEnabled = false;
    applyWinstreakUI();
    await window.api.closeOverlay({ mode: 'winstreak' });
  saveSettings();
  });
}

t1Minus.addEventListener('click', () => bumpTournamentScore('team1', -1));
t1Plus.addEventListener('click', () => bumpTournamentScore('team1', 1));
t2Minus.addEventListener('click', () => bumpTournamentScore('team2', -1));
t2Plus.addEventListener('click', () => bumpTournamentScore('team2', 1));

teamOneScoreKey.addEventListener('click', () => startCapture('teamOneScoreKey'));
teamTwoScoreKey.addEventListener('click', () => startCapture('teamTwoScoreKey'));
resetScoreKey.addEventListener('click', () => startCapture('resetScoreKey'));

clearTeamOneScoreKey.addEventListener('click', () => {
  state.tournament.teamOneScoreKey = '-';
  teamOneScoreKey.textContent = state.tournament.teamOneScoreKey;
  saveSettings();
});

clearTeamTwoScoreKey.addEventListener('click', () => {
  state.tournament.teamTwoScoreKey = '-';
  teamTwoScoreKey.textContent = state.tournament.teamTwoScoreKey;
  saveSettings();
});

clearResetScoreKey.addEventListener('click', () => {
  state.tournament.resetScoreKey = '-';
  resetScoreKey.textContent = state.tournament.resetScoreKey;
  saveSettings();
});

saveSettingsBtn.addEventListener('click', () => {
  saveSettings();
  saveSettingsBtn.textContent = t('Saved');
  window.setTimeout(() => {
    saveSettingsBtn.textContent = t('Save Now');
  }, 1000);
});

resetSettingsBtn.addEventListener('click', async () => {
  await window.api.closeOverlay();
  resetToDefaults();
});

chooseBackgroundVisualBtn.addEventListener('click', async () => {
  if (!hasFeatureAccess()) {
    setBackgroundValidation('Background visual customization is available to premium/tester/dev accounts.', 'warning');
    return;
  }

  const filePath = await window.api.chooseBackgroundMedia();
  if (!filePath) return;
  if (!isValidVisualFile(filePath)) {
    setBackgroundValidation('Invalid visual file. Choose png/jpg/jpeg/webp/gif/mp4/webm/ogg.', 'error');
    return;
  }

  const quality = await validateVisualResolution(filePath);
  if (!quality.ok) {
    const canUpscale = !!state.settings.allowVisualUpscale && quality.width > 0 && quality.height > 0;
    if (canUpscale) {
      state.settings.backgroundVisualPath = filePath;
      setBackgroundValidation(
        `Upscale mode enabled. Using ${quality.width}x${quality.height}; best clarity is 1080p or 4K.`,
        'warning'
      );
      applySettingsUI();
      saveSettings();
      return;
    }
    setBackgroundValidation(quality.message, 'error');
    return;
  }

  state.settings.backgroundVisualPath = filePath;
  setBackgroundValidation(quality.message, 'success');
  applySettingsUI();
  saveSettings();
});

chooseBackgroundAudioBtn.addEventListener('click', async () => {
  const filePath = await window.api.chooseBackgroundMedia();
  if (!filePath) return;
  if (!isValidAudioFile(filePath)) {
    setBackgroundValidation('Invalid audio file. Choose mp3/wav/ogg.', 'error');
    return;
  }
  state.settings.backgroundAudioStreamUrl = '';
  state.settings.backgroundAudioPath = filePath;
  setBackgroundValidation('Background audio updated.', 'success');
  applySettingsUI();
  saveSettings();
});

clearBackgroundVisualBtn.addEventListener('click', () => {
  if (!hasFeatureAccess()) {
    setBackgroundValidation('Background visual customization is available to premium/tester/dev accounts.', 'warning');
    return;
  }

  state.settings.backgroundVisualPath = '';
  setBackgroundValidation('Visual background cleared.', 'success');
  applySettingsUI();
  saveSettings();
});

clearBackgroundAudioBtn.addEventListener('click', () => {
  state.settings.backgroundAudioStreamUrl = '';
  state.settings.backgroundAudioPath = '';
  setBackgroundValidation('Background audio cleared.', 'success');
  applySettingsUI();
  saveSettings();
});

backgroundAudioEnabled.addEventListener('change', () => {
  state.settings.backgroundAudioEnabled = backgroundAudioEnabled.checked;
  applyBackgroundPlaybackSettings();
  saveSettings();
});

allowVisualUpscale.addEventListener('change', () => {
  state.settings.allowVisualUpscale = allowVisualUpscale.checked;
  if (state.settings.allowVisualUpscale) {
    setBackgroundValidation('Upscale mode enabled. Non-1080p/4K visuals are allowed with softer quality.', 'warning');
  } else {
    setBackgroundValidation('Strict mode enabled. Visuals must be exactly 1080p or 4K.', 'success');
  }
  saveSettings();
});

musicSearchBtn.addEventListener('click', async () => {
  const query = musicSearchInput.value.trim();
  if (!query) {
    musicValidation.textContent = 'Enter a song title or artist name.';
    musicValidation.classList.add('error');
    musicValidation.classList.remove('success', 'warning');
    musicValidation.classList.remove('hidden');
    return;
  }

  musicValidation.classList.add('hidden');
  musicSearchBtn.disabled = true;
  musicSearchBtn.textContent = 'Searching...';

  try {
    const songs = await searchSongs(query);
    displayMusicResults(songs);
  } catch (err) {
    musicValidation.textContent = err && err.message ? err.message : 'Song lookup failed.';
    musicValidation.classList.add('error');
    musicValidation.classList.remove('success', 'warning');
    musicValidation.classList.remove('hidden');
  }

  musicSearchBtn.disabled = false;
  musicSearchBtn.textContent = 'Search Songs';
});

function displayMusicResults(songs) {
  musicResultsList.innerHTML = '';
  if (!songs || songs.length === 0) {
    musicValidation.textContent = 'No songs found for that search. Try a different title or artist.';
    musicValidation.classList.add('warning');
    musicValidation.classList.remove('error', 'success');
    musicValidation.classList.remove('hidden');
    return;
  }

  songs.forEach((song) => {
    const item = document.createElement('div');
    item.className = 'music-result-item';
    const artistName = Array.isArray(song.artists) && song.artists.length > 0
      ? song.artists.map((a) => a.name).join(', ')
      : 'Unknown Artist';
    const cover = song.coverUrl || '';
    const duration = formatDurationMs(song.durationMs);

    item.innerHTML = `
      <img class="music-result-cover" src="${cover}" alt="${song.name}" />
      <div>
        <div class="music-result-meta">
          <p class="music-result-title">${song.name}</p>
          <span class="music-result-duration">${duration}</span>
        </div>
        <p class="music-result-artist">${artistName}</p>
      </div>
    `;
    item.addEventListener('click', () => selectSong(song));
    musicResultsList.appendChild(item);
  });

  musicSearchResults.classList.remove('hidden');
  musicValidation.classList.add('hidden');
}

function selectSong(song) {
  currentSelectedSong = song;
  const artistName = Array.isArray(song.artists) && song.artists.length > 0
    ? song.artists.map((a) => a.name).join(', ')
    : 'Unknown Artist';
  const duration = formatDurationMs(song.durationMs);

  selectedSongTitle.textContent = song.name;
  selectedSongArtist.textContent = `by ${artistName} • ${duration}`;

  musicSelection.classList.remove('hidden');
  musicSearchResults.classList.add('hidden');
  videoSearchResults.classList.add('hidden');
  musicValidation.classList.add('hidden');
}

loadMusicVideoBtn.addEventListener('click', async () => {
  if (!currentSelectedSong) return;

  loadMusicVideoBtn.disabled = true;
  loadMusicVideoBtn.textContent = 'Searching YouTube...';
  musicLoadStatus.classList.add('hidden');

  const artistName = currentSelectedSong.artists?.[0]?.name || '';
  const videoLink = generateYouTubeSearchLink(`${currentSelectedSong.name} ${artistName} official music video`);

  displayVideoResults([videoLink]);

  loadMusicVideoBtn.disabled = false;
  loadMusicVideoBtn.textContent = 'Find Music Video on YouTube';
});

playSongOnlyBtn.addEventListener('click', () => {
  if (!currentSelectedSong) return;

  const previewUrl = currentSelectedSong.previewUrl || '';
  if (!previewUrl) {
    musicLoadStatus.textContent = 'This song has no preview stream. Pick another result or use Choose Audio.';
    musicLoadStatus.classList.remove('hidden', 'success', 'warning');
    musicLoadStatus.classList.add('error');
    return;
  }

  // Song mode: play selected song preview while keeping the user's current visual.
  state.settings.backgroundAudioStreamUrl = previewUrl;
  state.settings.backgroundAudioPath = '';
  state.settings.backgroundAudioEnabled = true;
  applySettingsUI();
  saveSettings();

  musicLoadStatus.textContent = 'Song enabled. Your current custom video/visual stays active unless you change it.';
  musicLoadStatus.classList.remove('hidden', 'error', 'warning');
  musicLoadStatus.classList.add('success');
  videoSearchResults.classList.add('hidden');
});

function displayVideoResults(videos) {
  videoResultsList.innerHTML = '';
  if (!videos || videos.length === 0) {
    musicLoadStatus.textContent = 'No videos found.';
    musicLoadStatus.classList.remove('hidden');
    return;
  }

  videos.forEach((video) => {
    const item = document.createElement('div');
    item.className = 'video-result-item';

    const title = document.createElement('p');
    title.className = 'video-result-title';
    title.textContent = String(video && video.title ? video.title : 'Video');

    const artist = document.createElement('p');
    artist.className = 'video-result-artist';

    const link = document.createElement('a');
    link.href = String(video && video.link ? video.link : '#');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.color = '#4fc3ff';
    link.style.textDecoration = 'none';
    link.textContent = 'Click to open search in browser ->';

    artist.appendChild(link);
    item.appendChild(title);
    item.appendChild(artist);
    videoResultsList.appendChild(item);
  });

  videoSearchResults.classList.remove('hidden');
  musicLoadStatus.innerHTML = '<strong>Found music video alternatives.</strong> Click the YouTube link to find and download the official video. After download, use "Choose Visual" to add it as your background.';
  musicLoadStatus.classList.remove('hidden');
}

function showUpdateNotification(message) {
  if (!updateNotification || !updateMessage) return;
  updateMessage.textContent = message || 'Update downloaded. Restart the app to apply.';
  updateNotification.classList.remove('hidden');
}

function hideUpdateNotification() {
  if (!updateNotification) return;
  updateNotification.classList.add('hidden');
}

clearMusicBtn.addEventListener('click', () => {
  currentSelectedSong = null;
  musicSelection.classList.add('hidden');
  musicSearchResults.classList.add('hidden');
  videoSearchResults.classList.add('hidden');
  musicSearchInput.value = '';
  musicValidation.classList.add('hidden');
  musicLoadStatus.classList.add('hidden');
});

if (appMinimizeBtn) {
  appMinimizeBtn.addEventListener('click', () => {
    window.api.minimizeWindow();
  });
}

function setFullscreenButtonState(isFullscreen) {
  if (!appFullscreenBtn) return;
  appFullscreenBtn.classList.toggle('is-fullscreen', !!isFullscreen);
  appFullscreenBtn.textContent = isFullscreen ? '><' : '[]';
  appFullscreenBtn.setAttribute('aria-label', isFullscreen ? 'Exit Fullscreen' : 'Fullscreen');
  appFullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
}

if (appFullscreenBtn) {
  appFullscreenBtn.addEventListener('click', async () => {
    try {
      const isFullscreen = await window.api.toggleFullscreen();
      setFullscreenButtonState(!!isFullscreen);
    } catch {
      // noop: keep existing titlebar state if fullscreen toggle fails.
    }
  });
}

if (appCloseBtn) {
  appCloseBtn.addEventListener('click', () => {
    window.api.closeWindow();
  });
}

if (restartButton) {
  restartButton.addEventListener('click', async () => {
    restartButton.disabled = true;
    restartButton.textContent = 'Restarting...';
    try {
      await window.api.restartApp();
    } catch {
      restartButton.disabled = false;
      restartButton.textContent = 'Restart Now';
    }
  });
}

if (dismissUpdateBtn) {
  dismissUpdateBtn.addEventListener('click', () => {
    hideUpdateNotification();
  });
}

if (window.api && typeof window.api.on === 'function') {
  window.api.on('overlay-closed', (payload) => {
    const mode = payload && payload.mode ? String(payload.mode) : '';

    if (mode === 'winstreak') {
      if (state.winstreak.overlayEnabled) {
        state.winstreak.overlayEnabled = false;
        applyWinstreakUI();
        saveSettings();
      }
      return;
    }

    if (mode === '4v1') {
      if (state.tournament.overlayEnabled) {
        state.tournament.overlayEnabled = false;
        applyTournamentUI();
        saveSettings();
      }
      return;
    }

    if (mode === '1v1') {
      if (state.onevone.overlayEnabled) {
        state.onevone.overlayEnabled = false;
        applyOneVOneUI();
        saveSettings();
      }
      return;
    }

    if (mode === 'map') {
      if (state.mapOverlayEnabled) {
        state.mapOverlayEnabled = false;
        applyMapsUI();
        syncMapAutoDetectLoop();
        saveSettings();
      }
    }
  });

  window.api.on('window-fullscreen-changed', (isFullscreen) => {
    setFullscreenButtonState(!!isFullscreen);
  });

  window.api.on('update-ready', (payload) => {
    const version = payload && payload.version ? ` (v${payload.version})` : '';
    const message = payload && payload.message
      ? `${payload.message}${version}`
      : `Update downloaded${version}. Restart the app to apply.`;
    showUpdateNotification(message);
  });
}

if (authForm) {
  authForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    await loginWithServer();
  });
}

if (authRegisterForm) {
  authRegisterForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    await registerWithServer();
  });
}

if (showCreateAccountBtn) {
  showCreateAccountBtn.addEventListener('click', () => {
    setAuthStatus('', '');
    setAuthMode('register');
  });
}

if (showLoginBtn) {
  showLoginBtn.addEventListener('click', () => {
    setAuthRegisterStatus('', '');
    setAuthMode('login');
  });
}

if (authServerUrl) {
  authServerUrl.addEventListener('change', () => {
    authServerUrl.value = authState.serverUrl || DEFAULT_AUTH_SERVER_URL;
  });
}

if (authLanguage) {
  authLanguage.addEventListener('change', () => {
    const nextLanguage = getSelectedLanguage();
    const prefs = loadAuthPrefs();
    saveAuthPrefs({
      serverUrl: prefs.serverUrl || (authState.serverUrl || DEFAULT_AUTH_SERVER_URL),
      username: prefs.username || '',
      rememberMe: !!prefs.rememberMe,
      language: nextLanguage
    });

    applyLanguageEverywhere();

    if (state.onevone.overlayEnabled) sendOneVOneOverlayUpdate();
    if (state.tournament.overlayEnabled) sendTournamentOverlayUpdate();
    if (state.winstreak.overlayEnabled) sendWinstreakOverlayUpdate();
    if (state.mapOverlayEnabled) {
      window.api.updateOverlay({ mode: 'map', language: nextLanguage });
    }
  });
}

if (authLogoutBtn) {
  authLogoutBtn.addEventListener('click', async () => {
    await window.api.authLogout();
    await window.api.closeOverlay();
    authState = { user: null, serverUrl: authState.serverUrl || DEFAULT_AUTH_SERVER_URL };
    if (!(authRememberMe && authRememberMe.checked)) {
      const savedServerUrl = (authState.serverUrl || DEFAULT_AUTH_SERVER_URL).trim();
      const language = authLanguage ? String(authLanguage.value || 'English') : 'English';
      saveAuthPrefs({ serverUrl: savedServerUrl, username: '', rememberMe: false, language });
      authUsername.value = '';
      authPassword.value = '';
    }
    themeMarketplaceEntries = [];
    renderThemeMarketplaceList();
    setThemeMarketplaceStatus('', '');
    applyAuthUI();
    setAuthStatus('Logged out.', 'success');
  });
}

if (buyPremiumBtn) {
  buyPremiumBtn.addEventListener('click', async () => {
    await window.api.openExternalUrl(DISCORD_BUY_URL);
  });
}

if (sponsorVdlBtn) {
  sponsorVdlBtn.addEventListener('click', async () => {
    await window.api.openExternalUrl(DISCORD_SPONSOR_URL);
  });
}

backgroundVolume.addEventListener('input', () => {
  const pct = Number(backgroundVolume.value) || 0;
  state.settings.backgroundVolume = Math.max(0, Math.min(1, pct / 100));
  backgroundVolumeValue.textContent = `${pct}%`;
  applyBackgroundPlaybackSettings();
  saveSettings();
});

setupSensitiveTokenProtection();
injectHiddenPremiumHuntKeys();
applyAuthUI();
setAuthMode('login');
setThemeMarketplaceActiveTab('browse');
void restoreSession();

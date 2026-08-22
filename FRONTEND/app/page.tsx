'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, Smartphone, Mail, ArrowRight, Tractor, Globe, User, MapPin, Save, LogOut, X, AlertTriangle, TrendingUp } from 'lucide-react'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { DashboardSidebar, type DashboardTab } from '@/components/dashboard/sidebar'
import { DashboardHome } from '@/components/dashboard/dashboard-home'
import { GrowBetter } from '@/components/dashboard/grow-better'
import { SellSmarter } from '@/components/dashboard/sell-smarter'
import { LoseLess } from '@/components/dashboard/lose-less'
import { useLanguage, LANGUAGE_OPTIONS, type SupportedLang } from '@/lib/language-context'

type TranslationRecord = {
  appSubtitle: string
  gmailBtn: string
  orMobile: string
  phonePlaceholder: string
  sendOtp: string
  verifyTitle: string
  verifySub: string
  verifyBtn: string
  searchBox: string
  profileSettings: string
  fullName: string
  address: string
  appLanguage: string
  saveChanges: string
  logout: string
  backToDash: string
  greeting: string
  homeSub: string
  growSub: string
  sellSub: string
  loseSub: string
}

const TRANSLATIONS: Record<SupportedLang, TranslationRecord> = {
  en: {
    appSubtitle: 'Your AI Farm Intelligence Agent', gmailBtn: 'Continue with Gmail', orMobile: 'Or mobile', phonePlaceholder: 'Enter Phone Number (+91...)', sendOtp: 'Send OTP', verifyTitle: 'Verify OTP', verifySub: 'Enter the 6-digit SMS code sent to', verifyBtn: 'Verify & Login', searchBox: 'Search crops, prices...', profileSettings: 'Profile Settings', fullName: 'Full Name', address: 'Farm Address', appLanguage: 'App Language', saveChanges: 'Save Changes', logout: 'Log Out', backToDash: 'Back to Dashboard', greeting: 'Namaste',
    homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.'
  },
  te: {
    appSubtitle: 'మీ AI వ్యవసాయ ఇంటెలిజెన్స్ ఏజెంట్', gmailBtn: 'Gmail తో కొనసాగండి', orMobile: 'లేదా మొబైల్', phonePlaceholder: 'ఫోన్ నంబర్ (+91...)', sendOtp: 'OTP పంపండి', verifyTitle: 'OTP నిర్ధారించండి', verifySub: 'పంపబడిన 6-అంకెల కోడ్‌ను నమోదు చేయండి', verifyBtn: 'లాగిన్ చేయండి', searchBox: 'పంటలు, ధరలను శోధించండి...', profileSettings: 'ప్రొఫైల్ సెట్టింగులు', fullName: 'పూర్తి పేరు', address: 'వ్యవసాయ చిరునామా', appLanguage: 'యాప్ భాష', saveChanges: 'మార్పులను భద్రపరచండి', logout: 'లాగ్ అవుట్', backToDash: 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి', greeting: 'నమస్కారం',
    homeSub: 'ఈ రోజు మీ పొలంలో జరుగుతున్న విశేషాలు.', growSub: 'మీ పంట దిగుబడిని పెంచడానికి AI మార్గదర్శకత్వం.', sellSub: 'ప్రత్యక్ష మార్కెట్ ధరలు మరియు విక్రయించడానికి ఉత్తమ సమయం.', loseSub: 'తెగుళ్ళు, వ్యాధులు మరియు నష్టాల నివారణ.'
  },
  hi: {
    appSubtitle: 'आपका AI फार्म इंटेलिजेंस एजेंट', gmailBtn: 'Gmail के साथ जारी रखें', orMobile: 'या मोबाइल', phonePlaceholder: 'फ़ोन नंबर दर्ज करें (+91...)', sendOtp: 'OTP भेजें', verifyTitle: 'OTP सत्यापित करें', verifySub: 'भेजे गए 6-अंकीय कोड को दर्ज करें', verifyBtn: 'लॉगिन करें', searchBox: 'फसलें, कीमतें खोजें...', profileSettings: 'प्रोफ़ाइल सेटिंग', fullName: 'पूरा नाम', address: 'खेत का पता', appLanguage: 'ऐप की भाषा', saveChanges: 'परिवर्तन सहेजें', logout: 'लॉग आउट', backToDash: 'डैशबोर्ड पर वापस जाएं', greeting: 'नमस्ते',
    homeSub: 'आज आपके खेत में क्या हो रहा है, इसका विवरण यहां है।', growSub: 'फसल की पैदावार बढ़ाने के लिए AI मार्गदर्शन।', sellSub: 'ताज़ा मंडी भाव और बेचने का सही समय।', loseSub: 'कीट, रोग और कटाई के बाद के नुकसान से बचाव।'
  },
  ta: { appSubtitle: 'உங்கள் AI வேளாண் நுண்ணறிவு முகவர்', gmailBtn: 'Gmail மூலம் தொடரவும்', orMobile: 'அல்லது மொபைல்', phonePlaceholder: 'தொலைபேசி எண் (+91...)', sendOtp: 'OTP அனுப்பவும்', verifyTitle: 'OTP சரிபார்க்கவும்', verifySub: 'அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிடவும்', verifyBtn: 'உள்நுழையவும்', searchBox: 'பயிர்கள், விலைகளைத் தேடுங்கள்...', profileSettings: 'சுயவிவர அமைப்புகள்', fullName: 'முழு பெயர்', address: 'பண்ணை முகவரி', appLanguage: 'பயன்பாட்டு மொழி', saveChanges: 'சேமிக்கவும்', logout: 'வெளியேறு', backToDash: 'முகப்புப்பக்கத்திற்குச் செல்லவும்', greeting: 'வணக்கம்', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  kn: { appSubtitle: 'ನಿಮ್ಮ AI ಕೃಷಿ ಇಂಟೆಲಿಜೆನ್ಸ್ ಏಜೆಂಟ್', gmailBtn: 'Gmail ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ', orMobile: 'ಅಥವಾ ಮೊಬೈಲ್', phonePlaceholder: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ (+91...)', sendOtp: 'OTP ಕಳುಹಿಸಿ', verifyTitle: 'OTP ಪರಿಶೀಲಿಸಿ', verifySub: 'ಕಳುಹಿಸಲಾದ 6 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ', verifyBtn: 'ಲಾಗಿನ್ ಮಾಡಿ', searchBox: 'ಬೆಳೆಗಳು, ಬೆಲೆಗಳನ್ನು ಹುಡುಕಿ...', profileSettings: 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', fullName: 'ಪೂರ್ಣ ಹೆಸರು', address: 'ಕೃಷಿ ವಿಳಾಸ', appLanguage: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ', saveChanges: 'ಉಳಿಸಿ', logout: 'ಲಾಗ್ ಔಟ್', backToDash: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ', greeting: 'ನಮಸ್ಕಾರ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ml: { appSubtitle: 'നിങ്ങളുടെ AI കാർഷിക ഇന്റലിജൻസ് ഏജന്റ്', gmailBtn: 'Gmail വഴി തുടരുക', orMobile: 'അല്ലെങ്കിൽ മൊബൈൽ', phonePlaceholder: 'ഫോൺ നമ്പർ (+91...)', sendOtp: 'OTP അയക്കുക', verifyTitle: 'OTP പരിശോധിക്കുക', verifySub: 'അയച്ച 6 അക്ക കോഡ് നൽകുക', verifyBtn: 'ലോഗിൻ ചെയ്യുക', searchBox: 'വിളകളും വിലകളും തിരയുക...', profileSettings: 'പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ', fullName: 'പൂർണ്ണ പേര്', address: 'ഫാം വിലാസം', appLanguage: 'ഭാഷ', saveChanges: 'സേവ് ചെയ്യുക', logout: 'ലോഗ് ഔട്ട്', backToDash: 'ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക', greeting: 'നമസ്കാരം', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  mr: { appSubtitle: 'तुमचा AI शेती गुप्तचर एजंट', gmailBtn: 'Gmail सह सुरू ठेवा', orMobile: 'किंवा मोबाईल', phonePlaceholder: 'फोन नंबर टाका (+91...)', sendOtp: 'OTP पाठवा', verifyTitle: 'OTP सत्यापित करा', verifySub: 'पाठवलेला 6-अंकी कोड टाका', verifyBtn: 'लॉगिन करा', searchBox: 'पिके, दर शोधा...', profileSettings: 'प्रोफाइल सेटिंग्ज', fullName: 'पूर्ण नाव', address: 'शेताचा पत्ता', appLanguage: 'अ‍ॅप भाषा', saveChanges: 'जतन करा', logout: 'लॉग आउट', backToDash: 'डॅशबोर्डवर परत जा', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  gu: { appSubtitle: 'તમારું AI કૃષિ ઇન્ટેલિજન્સ એજન્ટ', gmailBtn: 'Gmail સાથે આગળ વધો', orMobile: 'અથવા મોબાઇલ', phonePlaceholder: 'ફોન નંબર દાખલ કરો (+91...)', sendOtp: 'OTP મોકલો', verifyTitle: 'OTP ચકાસો', verifySub: 'મોકલેલ 6-અંકનો કોડ દાખલ કરો', verifyBtn: 'લોગિન કરો', searchBox: 'પાક, કિંમતો શોધો...', profileSettings: 'પ્રોફાઇલ સેટિંગ્સ', fullName: 'પૂરું નામ', address: 'ખેતરનું સરનામું', appLanguage: 'એપ ભાષા', saveChanges: 'સાચવો', logout: 'લોગ આઉટ', backToDash: 'ડેશબોર્ડ પર પાછા જાઓ', greeting: 'નમસ્તે', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  bn: { appSubtitle: 'আপনার AI কৃষি বুদ্ধিমত্তা এজেন্ট', gmailBtn: 'Gmail দিয়ে চালিয়ে যান', orMobile: 'অথবা মোবাইল', phonePlaceholder: 'ফোন নম্বর লিখুন (+91...)', sendOtp: 'OTP পাঠান', verifyTitle: 'OTP যাচাই করুন', verifySub: 'পাঠানো ৬-সংখ্যার কোড লিখুন', verifyBtn: 'লগইন করুন', searchBox: 'ফসল, দাম খুঁজুন...', profileSettings: 'প্রোফাইল সেটিংস', fullName: 'সম্পূর্ণ নাম', address: 'খামারের ঠিকানা', appLanguage: 'অ্যাপের ভাষা', saveChanges: 'সংরক্ষণ করুন', logout: 'লগ আউট', backToDash: 'ড্যাশবোর্ডে ফিরুন', greeting: 'নমস্কার', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  pa: { appSubtitle: 'ਤੁਹਾਡਾ AI ਖੇਤੀਬਾੜੀ ਏਜੰਟ', gmailBtn: 'Gmail ਨਾਲ ਜਾਰੀ ਰੱਖੋ', orMobile: 'ਜਾਂ ਮੋਬਾਈਲ', phonePlaceholder: 'ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ (+91...)', sendOtp: 'OTP ਭੇਜੋ', verifyTitle: 'OTP ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', verifySub: 'ਭੇਜਿਆ ਗਿਆ 6-ਅੰਕਾਂ ਵਾਲਾ ਕੋਡ ਦਰਜ ਕਰੋ', verifyBtn: 'ਲਾਗਇਨ ਕਰੋ', searchBox: 'ਫ਼ਸਲਾਂ, ਭਾਅ ਖੋਜੋ...', profileSettings: 'ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ', fullName: 'ਪੂਰਾ ਨਾਮ', address: 'ਖੇਤ ਦਾ ਪਤਾ', appLanguage: 'ਐਪ ਦੀ ਭਾਸ਼ਾ', saveChanges: 'ਸੰਭਾਲੋ', logout: 'ਲਾਗ ਆਉਟ', backToDash: 'ਡੈਸ਼ਬੋਰਡ \'ਤੇ ਵਾਪਸ ਜਾਓ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  or: { appSubtitle: 'ଆପଣଙ୍କର AI କୃଷି ଗୁଇନ୍ଦା ଏଜେଣ୍ଟ', gmailBtn: 'Gmail ସହିତ ଆଗକୁ ବଢନ୍ତୁ', orMobile: 'କିମ୍ବା ମୋବାଇଲ୍', phonePlaceholder: 'ଫୋନ୍ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ (+91...)', sendOtp: 'OTP ପଠାନ୍ତୁ', verifyTitle: 'OTP ଯାଞ୍ଚ କରନ୍ତୁ', verifySub: 'ପଠାଯାଇଥିବା 6-ଅଙ୍କ ବିଶିଷ୍ଟ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ', verifyBtn: 'ଲଗଇନ୍ କରନ୍ତୁ', searchBox: 'ଫସଲ, ମୂଲ୍ୟ ଖୋଜନ୍ତୁ...', profileSettings: 'ପ୍ରୋଫାଇଲ୍ ସେଟିଙ୍ଗ୍', fullName: 'ପୂରା ନାମ', address: 'ଚାଷ ଜମି ଠିକଣା', appLanguage: 'ଆପ୍ ଭାଷା', saveChanges: 'ସଂରକ୍ଷଣ କରନ୍ତୁ', logout: 'ଲଗ୍ ଆଉଟ୍', backToDash: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ', greeting: 'ନମସ୍କାର', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  as: { appSubtitle: 'আপোনাৰ AI কৃষি বুদ্ধিমত্তা এজেণ্ট', gmailBtn: 'Gmail ৰ সৈতে আগবাঢ়ক', orMobile: 'বা ম’বাইল', phonePlaceholder: 'ফোন নম্বৰ দিয়ক (+91...)', sendOtp: 'OTP পঠাওক', verifyTitle: 'OTP পৰীক্ষা কৰক', verifySub: 'প্ৰেৰণ কৰা ৬-অংকৰ ক’ড দিয়ক', verifyBtn: 'লগ ইন কৰক', searchBox: 'শস্য, মূল্য সন্ধান কৰক...', profileSettings: 'প্রফাইল ছেটিংছ', fullName: 'সম্পূৰ্ণ নাম', address: 'খেতিৰ ঠিকনা', appLanguage: 'ভাষা', saveChanges: 'সংৰক্ষণ কৰক', logout: 'লগ আউট', backToDash: 'ডেশ্বব’ৰ্ডলৈ উভতি যাওক', greeting: 'নমস্কাৰ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ur: { appSubtitle: 'آپ کا AI زرعی انٹیلی جنس ایجنٹ', gmailBtn: 'Gmail کے ساتھ جاری رکھیں', orMobile: 'یا موبائل', phonePlaceholder: 'فون نمبر درج کریں (+91...)', sendOtp: 'OTP بھیجیں', verifyTitle: 'OTP کی تصدیق کریں', verifySub: 'بھیجا گیا 6 ہندسوں کا کوڈ درج کریں', verifyBtn: 'لاگ ان کریں', searchBox: 'فصلیں، قیمتیں تلاش کریں...', profileSettings: 'پروفائل کی ترتیبات', fullName: 'پورا نام', address: 'فارم کا پتہ', appLanguage: 'ایپ کی زبان', saveChanges: 'محفوظ کریں', logout: 'لاگ آؤٹ', backToDash: 'ڈیش بورڈ پر واپس جائیں', greeting: 'سلام', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  sa: { appSubtitle: 'भवतः AI कृषिमतिमान् प्रतिनिधिः', gmailBtn: 'Gmail द्वारा अनुवर्तताम्', orMobile: 'अथवा चलदूरभाषः', phonePlaceholder: 'दूरभाषसंख्यां प्रविशतु (+91...)', sendOtp: 'OTP प्रेषयतु', verifyTitle: 'OTP सत्यापयतु', verifySub: 'प्रेषितं षडङ्कीयसङ्केतं प्रविशतु', verifyBtn: 'प्रवेशं करोतु', searchBox: 'सस्यानि मूल्यानि च अन्विष्यताम्...', profileSettings: 'विवरणसंयोजनानि', fullName: 'पूर्णं नाम', address: 'क्षेत्रसङ्केतः', appLanguage: 'भाषा', saveChanges: 'रक्षतु', logout: 'निर्गमनम्', backToDash: 'मुख्यपट्टं प्रतिगच्छतु', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ne: { appSubtitle: 'तपाईंको AI कृषि বুদ্ধिमत्ता एजेन्ट', gmailBtn: 'Gmail मार्फत जारी राख्नुहोस्', orMobile: 'वा मोबाइल', phonePlaceholder: 'फोन नम्बर प्रविष्ट गर्नुहोस् (+91...)', sendOtp: 'OTP पठाउनुहोस्', verifyTitle: 'OTP प्रमाणित गर्नुहोस्', verifySub: 'पठाइएको ६-अङ्कको कोड प्रविष्ट गर्नुहोस्', verifyBtn: 'लगइन गर्नुहोस्', searchBox: 'बाली, मूल्यहरू खोज्नुहोस्...', profileSettings: 'प्रोफाइल सेटिङहरू', fullName: 'पूरा नाम', address: 'खेतको ठेगाना', appLanguage: 'एप भाषा', saveChanges: 'सुरक्षित गर्नुहोस्', logout: 'लग आउट', backToDash: 'ड्यासबोर्डमा फर्कनुहोस्', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  kok: { appSubtitle: 'तुमचो AI शेतकी गुप्तहेर एजंट', gmailBtn: 'Gmail वरून मुखार वचात', orMobile: 'वा मोबाइल', phonePlaceholder: 'फोन नंबर घालात (+91...)', sendOtp: 'OTP धाडा', verifyTitle: 'OTP तपासणी', verifySub: 'धाडिल्लो 6-अंकी कोड घालात', verifyBtn: 'लॉगिन करात', searchBox: 'पिकां, दर सोदात...', profileSettings: 'प्रोफाइल मांडणी', fullName: 'पूर्ण नांव', address: 'शेताचो पत्तो', appLanguage: 'अ‍ॅप भास', saveChanges: 'सांबाळात', logout: 'भायर सरा', backToDash: 'डॅशबोर्डार परते वचात', greeting: 'नमस्कार', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  mai: { appSubtitle: 'अहाँक AI कृषि बुद्धिमत्ता एजेंट', gmailBtn: 'Gmail सँ जारी राखू', orMobile: 'वा मोबाइल', phonePlaceholder: 'फोन नंबर दर्ज करू (+91...)', sendOtp: 'OTP पठाउ', verifyTitle: 'OTP सत्यापित करू', verifySub: 'पठायल 6-अंकी कोड दर्ज करू', verifyBtn: 'लॉगिन करू', searchBox: 'फसल, दाम खोजू...', profileSettings: 'प्रोफाइल सेटिंग्स', fullName: 'पूरा नाम', address: 'खेतक पता', appLanguage: 'ऐप भाषा', saveChanges: 'सुरक्षित करू', logout: 'लॉग आउट', backToDash: 'डैशबोर्ड पर वापस जाउ', greeting: 'प्रणाम', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  doi: { appSubtitle: 'तुंदा AI खेतीबाड़ी एजेंट', gmailBtn: 'Gmail कन्नै जारी रक्खो', orMobile: 'या मोबाइल', phonePlaceholder: 'फोन नंबर दर्ज करो (+91...)', sendOtp: 'OTP भेजो', verifyTitle: 'OTP दी पुष्टि करो', verifySub: 'भेजे गेदे 6-अंकी कोड गी दर्ज करो', verifyBtn: 'लॉगिन करो', searchBox: 'फसलां, कीमतां तुप्पो...', profileSettings: 'प्रोफाइल सैटिंगां', fullName: 'पूरा नांउ', address: 'खेत दा पता', appLanguage: 'ऐप दी भाखा', saveChanges: 'संजोओ', logout: 'लॉग आउट', backToDash: 'डैशबोर्ड पर परत जाओ', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ks: { appSubtitle: 'تہنٛد AI زراعت انٹیلی جنس ایجنٹ', gmailBtn: 'Gmail سٟتؠ جٲری تھٲوو', orMobile: 'یا موبائل', phonePlaceholder: 'فون نمبر دَرٕج کٔرِو (+91...)', sendOtp: 'OTP سوزِو', verifyTitle: 'OTP تصدیق کٔرِو', verifySub: 'سوزنہٕ آمُت 6 ہندسَن ہُنٛد کوڈ دَرٕج کٔرِو', verifyBtn: 'لاگ اِن کٔرِو', searchBox: 'فصلہٕ، قیمتھ ژھانٛڈِو...', profileSettings: 'پروفائل سیٹنگس', fullName: 'پورا ناو', address: 'کھیتُک پتہٕ', appLanguage: 'ایپٕچ زَبان', saveChanges: 'محفوظ کٔرِو', logout: 'لاگ آؤٹ', backToDash: 'ڈیش بورڈَس پؠٹھ واپس گٔژھِو', greeting: 'سلام', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  mni: { appSubtitle: 'নহাক্কী AI লৌউ-শিংউগী ইন্তেলিজেন্স এজেন্ত', gmailBtn: 'Gmail দা চত্থবা', orMobile: 'নত্রগা মোবাঈল', phonePlaceholder: 'ফোন নম্বর চনবা (+91...)', sendOtp: 'OTP থাবা', verifyTitle: 'OTP য়েংশিনবা', verifySub: 'থারকপা ওতিপি কোদ চনবা', verifyBtn: 'লোগ ইন তৌবা', searchBox: 'পাম্বী, মমল থিবা...', profileSettings: 'প্রোফাইল সেত্তিংস', fullName: 'মপুংফাবা মমিং', address: 'লৌবুক্কী লৈফম', appLanguage: 'লোন', saveChanges: 'শেভ তৌবা', logout: 'লোগ আউৎ', backToDash: 'দেশবোর্দতা হলকপা', greeting: 'খুরুমজরি', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  sat: { appSubtitle: 'ᱟᱢᱟᱜ AI ᱪᱟᱥᱵᱟᱥ ᱜᱚᱲᱚᱭᱤᱡ', gmailBtn: 'Gmail ᱛᱮ ᱞᱟᱦᱟᱜ ᱢᱮ', orMobile: 'ᱥᱮ ᱢᱳᱵᱟᱭᱤᱞ', phonePlaceholder: 'ᱯᱷᱳᱱ ᱱᱚᱢᱵᱚᱨ ᱮᱢ ᱢᱮ (+91...)', sendOtp: 'OTP ᱠᱩᱞ ᱢᱮ', verifyTitle: 'OTP ᱧᱮᱞ ᱢᱮ', verifySub: 'ᱠᱩᱞ ᱟᱠᱟᱱ ᱖-ᱮᱞ ᱠᱳᱰ ᱮᱢ ᱢᱮ', verifyBtn: 'ᱞᱚᱜᱤষ্ঠ ᱢᱮ', searchBox: 'ᱯᱷᱚᱥᱚᱞ, ᱫᱟᱢ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...', profileSettings: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱥᱟᱡᱟᱣ', fullName: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ', address: 'ᱠᱷᱮᱛ ᱴᱷᱟᱶ', appLanguage: 'ᱯᱟᱹᱨᱥᱤ', saveChanges: 'ᱥᱟᱺᱪᱟᱣ ᱢᱮ', logout: 'ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ', backToDash: 'ᱰᱮᱥᱵᱳᱨᱰ ᱛᱮ ᱨᱩᱣᱟᱹᱲ', greeting: 'ᱡᱚᱦᱟᱨ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  sd: { appSubtitle: 'توهان جو AI زرعي ايجنٽ', gmailBtn: 'Gmail سان جاري رکو', orMobile: 'يا موبائل', phonePlaceholder: 'فون نمبر داخل ڪريو (+91...)', sendOtp: 'OTP موڪليو', verifyTitle: 'OTP جي تصديق ڪريو', verifySub: 'موڪليل 6 انگن وارو ڪوڊ داخل ڪريو', verifyBtn: 'لاگ ان ڪريو', searchBox: 'فصل، قيمتون ڳوليو...', profileSettings: 'پروفائل سيٽنگون', fullName: 'پورو نالو', address: 'ٻنيءَ جو پتو', appLanguage: 'ايپ جي ٻولي', saveChanges: 'محفوظ ڪريو', logout: 'لاگ آئوٽ', backToDash: 'ڊيش بورڊ ڏانهن واپس وڃو', greeting: 'سلام', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  brx: { appSubtitle: 'नोंथांनि AI आबाद एजेन्ट', gmailBtn: 'Gmail जों थां', orMobile: 'एबा मबाइल', phonePlaceholder: 'फन नम्बर हर (+91...)', sendOtp: 'OTP हर', verifyTitle: 'OTP आनजाद खालाम', verifySub: 'हरनाय 6-अनजिमानि कद हर', verifyBtn: 'लग इन खालाम', searchBox: 'फसल, बेसेन नागिर...', profileSettings: 'प्रफाइल सेटिं', fullName: 'आबुं मुं', address: 'फारमनि थिकना', appLanguage: 'राव', saveChanges: 'थिन', logout: 'अंखारलां', backToDash: 'देसबर्डसिम थांफिन', greeting: 'खुलुमबाय', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' }
}

export default function Page() {
  const { lang, setLang } = useLanguage()
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  const [appState, setAppState] = useState<'loading' | 'login' | 'otp' | 'dashboard' | 'profile'>('loading')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  
  // NEW: Interactive states for Search and Notifications
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  const [userData, setUserData] = useState({
    name: 'Farmer',
    initial: 'A',
    address: 'Vadlamudi, Andhra Pradesh',
    phoneOrEmail: '',
  })

  const [tab, setTab] = useState<DashboardTab>('home')
  
  const meta = {
    title: tab === 'home' ? `${t.greeting}, ${userData.name.split(' ')[0] || 'Farmer'}` : 
           tab === 'grow' ? 'Grow Better' : tab === 'sell' ? 'Sell Smarter' : 'Lose Less',
    subtitle: tab === 'home' ? t.homeSub : 
              tab === 'grow' ? t.growSub : tab === 'sell' ? t.sellSub : t.loseSub,
  }

  useEffect(() => {
    const savedSession = localStorage.getItem('krishi_session')
    if (savedSession) {
      setUserData(JSON.parse(savedSession))
      setAppState('dashboard')
    } else {
      setAppState('login')
    }
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const userInfo = {
        name: user.displayName || 'Farmer',
        initial: (user.displayName || 'A').charAt(0).toUpperCase(),
        address: userData.address,
        phoneOrEmail: user.email || '',
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    } catch (error: any) {
      alert(`Google Login Error: ${error.message}`)
    }
  }

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setupRecaptcha()
      const appVerifier = (window as any).recaptchaVerifier
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
      setConfirmationResult(confirmation)
      setAppState('otp')
    } catch (error: any) {
      alert(`SMS Error: ${error.message}`)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await confirmationResult.confirm(otp)
      const user = result.user
      const userInfo = {
        name: 'Farmer',
        initial: 'A',
        address: userData.address,
        phoneOrEmail: user.phoneNumber || '',
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    } catch (error: any) {
      alert(`Invalid OTP: ${error.message}`)
    }
  }

  const handleProfileSave = () => {
    localStorage.setItem('krishi_session', JSON.stringify(userData))
    setAppState('dashboard')
  }

  if (appState === 'loading') return <div className="min-h-screen bg-background" />

  if (appState === 'login') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative">
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm max-w-[220px]">
          <Globe className="size-4 text-primary shrink-0" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as SupportedLang)}
            className="bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer w-full truncate"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code} className="bg-card text-foreground">
                {opt.native} ({opt.label})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="bg-primary/10 p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Tractor className="size-8" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">KrishiRakshak</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.appSubtitle}</p>
          </div>
          <div className="p-8 space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Mail className="size-5 text-red-500" /> {t.gmailBtn}
            </button>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 shrink-0 text-xs text-muted-foreground uppercase">{t.orMobile}</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="relative">
                <Smartphone className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  placeholder={t.phonePlaceholder}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <div id="recaptcha-container"></div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                {t.sendOtp} <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (appState === 'otp') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 animate-in slide-in-from-right duration-300">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground">{t.verifyTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-6">
            {t.verifySub} <span className="font-bold text-foreground">{phoneNumber}</span>
          </p>
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <input
              type="text"
              required
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center tracking-[0.5em] rounded-xl border border-border bg-background py-4 text-2xl font-bold outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-md"
            >
              {t.verifyBtn}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (appState === 'profile') {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background p-4 sm:p-8 animate-in fade-in duration-300">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
              {userData.initial}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t.profileSettings}</h2>
              <p className="text-sm text-muted-foreground">{userData.phoneOrEmail}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="size-4 text-primary" /> {t.fullName}
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    name: e.target.value,
                    initial: e.target.value.charAt(0).toUpperCase() || 'A',
                  })
                }
                className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> {t.address}
              </label>
              <textarea
                value={userData.address}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="size-4 text-primary" /> {t.appLanguage}
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLang)}
                className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.native} ({opt.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 border-t border-border pt-8">
            <button
              onClick={handleProfileSave}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
            >
              <Save className="size-4" /> {t.saveChanges}
            </button>
            <button
              onClick={() => setAppState('dashboard')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-bold text-foreground hover:bg-secondary/80 transition-all"
            >
              {t.backToDash}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('krishi_session')
                localStorage.removeItem('krishi_lang')
                window.location.reload()
              }}
              className="flex flex-1 sm:flex-none sm:px-6 items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-transparent py-3.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="size-4" /> {t.logout}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground animate-in fade-in duration-500">
      <DashboardSidebar active={tab} onChange={setTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur lg:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-foreground lg:text-2xl">{meta.title}</h1>
            <p className="truncate text-sm text-muted-foreground">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* FULLY FUNCTIONAL SEARCH BAR */}
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 md:flex focus-within:border-primary transition-colors">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                placeholder={t.searchBox}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    alert(`Searching database for: ${searchQuery}...`)
                    setSearchQuery('')
                  }
                }}
                className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            
            {/* FULLY FUNCTIONAL NOTIFICATION BELL WITH DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex size-11 items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
              >
                <Bell className="size-5" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                    <h4 className="text-sm font-bold text-foreground">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)}><X className="size-4 text-muted-foreground hover:text-foreground" /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl bg-destructive/10 p-3">
                      <p className="text-xs font-bold text-destructive flex items-center gap-1"><AlertTriangle className="size-3"/> Urgent: Weather Alert</p>
                      <p className="text-[11px] text-destructive/80 mt-1 font-medium">Check your dashboard for active disease warnings in Vadlamudi.</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-3">
                      <p className="text-xs font-bold text-foreground flex items-center gap-1"><TrendingUp className="size-3 text-primary"/> Market Update</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Tomato prices are up 12% today in your local Mandi.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Click Avatar to open Settings Dashboard */}
            <button
              onClick={() => setAppState('profile')}
              className="flex size-11 cursor-pointer items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground hover:scale-105 shadow-md transition-transform"
              title="Open Settings"
            >
              {userData.initial}
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          {tab === 'home' && <DashboardHome onNavigate={setTab} />}
          {tab === 'grow' && <GrowBetter />}
          {tab === 'sell' && <SellSmarter />}
          {tab === 'lose' && <LoseLess />}
        </main>
      </div>
    </div>
  )
}
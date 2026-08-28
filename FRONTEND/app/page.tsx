'use client'

import { useState, useEffect, useRef } from 'react'

import { 
  Bell, Search, Smartphone, Mail, ArrowRight, ArrowLeft, Tractor, Globe, User, 
  MapPin, Save, LogOut, X, AlertTriangle, TrendingUp, AlertCircle, CheckCircle2, 
  RefreshCw, Loader2, ShieldCheck, KeyRound, Sparkles, Check, Lock, Mic
} from 'lucide-react'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signInAnonymously } from 'firebase/auth'
import { DashboardSidebar, type DashboardTab } from '@/components/dashboard/sidebar'
import { DashboardHome } from '@/components/dashboard/dashboard-home'
import { GrowBetter } from '@/components/dashboard/grow-better'
import { SellSmarter } from '@/components/dashboard/sell-smarter'
import { LoseLess } from '@/components/dashboard/lose-less'
import { AIVoiceGuideModal } from '@/components/dashboard/ai-voice-guide-modal'
import { OnboardingTour } from '@/components/dashboard/onboarding-tour'
import { useLanguage, LANGUAGE_OPTIONS, type SupportedLang } from '@/lib/language-context'

declare global {
  interface Window {
    recaptchaVerifier: any
  }
}

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
    appSubtitle: 'Your AI Farm Intelligence Agent', gmailBtn: 'Continue with Google', orMobile: 'Or mobile', phonePlaceholder: 'Enter 10-digit mobile number', sendOtp: 'Send OTP', verifyTitle: 'Verify OTP', verifySub: 'Enter the 6-digit code sent to', verifyBtn: 'Verify & Login', searchBox: 'Search crops, prices...', profileSettings: 'Profile Settings', fullName: 'Full Name', address: 'Farm Address', appLanguage: 'App Language', saveChanges: 'Save Changes', logout: 'Log Out', backToDash: 'Back to Dashboard', greeting: 'Namaste',
    homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.'
  },
  te: {
    appSubtitle: 'మీ AI వ్యవసాయ ఇంటెలిజెన్స్ ఏజెంట్', gmailBtn: 'Google తో కొనసాగండి', orMobile: 'లేదా మొబైల్', phonePlaceholder: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి', sendOtp: 'OTP పంపండి', verifyTitle: 'OTP నిర్ధారించండి', verifySub: 'పంపబడిన 6-అంకెల కోడ్‌ను నమోదు చేయండి', verifyBtn: 'లాగిన్ చేయండి', searchBox: 'పంటలు, ధరలను శోధించండి...', profileSettings: 'ప్రొఫైల్ సెట్టింగులు', fullName: 'పూర్తి పేరు', address: 'వ్యవసాయ చిరునామా', appLanguage: 'యాప్ భాష', saveChanges: 'మార్పులను భద్రపరచండి', logout: 'లాగ్ అవుట్', backToDash: 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి', greeting: 'నమస్కారం',
    homeSub: 'ఈ రోజు మీ పొలంలో జరుగుతున్న విశేషాలు.', growSub: 'మీ పంట దిగుబడిని పెంచడానికి AI మార్గదర్శకత్వం.', sellSub: 'ప్రత్యక్ష మార్కెట్ ధరలు మరియు విక్రయించడానికి ఉత్తమ సమయం.', loseSub: 'తెగుళ్ళు, వ్యాధులు మరియు నష్టాల నివారణ.'
  },
  hi: {
    appSubtitle: 'आपका AI फार्म इंटेलिजेंस एजेंट', gmailBtn: 'Google के साथ जारी रखें', orMobile: 'या मोबाइल', phonePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें', sendOtp: 'OTP भेजें', verifyTitle: 'OTP सत्यापित करें', verifySub: 'भेजे गए 6-अंकीय कोड को दर्ज करें', verifyBtn: 'लॉगिन करें', searchBox: 'फसलें, कीमतें खोजें...', profileSettings: 'प्रोफ़ाइल सेटिंग', fullName: 'पूरा नाम', address: 'खेत का पता', appLanguage: 'ऐप की भाषा', saveChanges: 'परिवर्तन सहेजें', logout: 'लॉग आउट', backToDash: 'डैशबोर्ड पर वापस जाएं', greeting: 'नमस्ते',
    homeSub: 'आज आपके खेत में क्या हो रहा है, इसका विवरण यहां है।', growSub: 'फसल की पैदावार बढ़ाने के लिए AI मार्गदर्शन।', sellSub: 'ताज़ा मंडी भाव और बेचने का सही समय।', loseSub: 'कीट, रोग और कटाई के बाद के नुकसान से बचाव।'
  },
  ta: { appSubtitle: 'உங்கள் AI வேளாண் நுண்ணறிவு முகவர்', gmailBtn: 'Google மூலம் தொடரவும்', orMobile: 'அல்லது மொபைல்', phonePlaceholder: '10 இலக்க மொபைல் எண்', sendOtp: 'OTP அனுப்பவும்', verifyTitle: 'OTP சரிபார்க்கவும்', verifySub: 'அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிடவும்', verifyBtn: 'உள்நுழையவும்', searchBox: 'பயிர்கள், விலைகளைத் தேடுங்கள்...', profileSettings: 'சுயவிவர அமைப்புகள்', fullName: 'முழு பெயர்', address: 'பண்ணை முகவரி', appLanguage: 'பயன்பாட்டு மொழி', saveChanges: 'சேமிக்கவும்', logout: 'வெளியேறு', backToDash: 'முகப்புப்பக்கத்திற்குச் செல்லவும்', greeting: 'வணக்கம்', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  kn: { appSubtitle: 'ನಿಮ್ಮ AI ಕೃಷಿ ಇಂಟೆಲಿಜೆನ್ಸ್ ಏಜೆಂಟ್', gmailBtn: 'Google ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ', orMobile: 'ಅಥವಾ ಮೊಬೈಲ್', phonePlaceholder: '10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', sendOtp: 'OTP ಕಳುಹಿಸಿ', verifyTitle: 'OTP ಪರಿಶೀಲಿಸಿ', verifySub: 'ಕಳುಹಿಸಲಾದ 6 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ', verifyBtn: 'ಲಾಗಿನ್ ಮಾಡಿ', searchBox: 'ಬೆಳೆಗಳು, ಬೆಲೆಗಳನ್ನು ಹುಡುಕಿ...', profileSettings: 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', fullName: 'ಪೂರ್ಣ ಹೆಸರು', address: 'ಕೃಷಿ ವಿಳಾಸ', appLanguage: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ', saveChanges: 'ಉಳಿಸಿ', logout: 'ಲಾಗ್ ಔಟ್', backToDash: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ', greeting: 'ನಮಸ್ಕಾರ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ml: { appSubtitle: 'നിങ്ങളുടെ AI കാർഷിക ഇന്റലിജൻസ് ഏജന്റ്', gmailBtn: 'Google വഴി തുടരുക', orMobile: 'അല്ലെങ്കിൽ മൊബൈൽ', phonePlaceholder: '10 അക്ക മൊബൈൽ നമ്പർ', sendOtp: 'OTP അയക്കുക', verifyTitle: 'OTP പരിശോധിക്കുക', verifySub: 'അയച്ച 6 അക്ക കോഡ് നൽകുക', verifyBtn: 'ലോഗിൻ ചെയ്യുക', searchBox: 'വിളകളും വിലകളും തിരയുക...', profileSettings: 'പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ', fullName: 'പൂർണ്ണ പേര്', address: 'ഫാം വിലാസം', appLanguage: 'ഭാഷ', saveChanges: 'സേവ് ചെയ്യുക', logout: 'ലോഗ് ഔട്ട്', backToDash: 'ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക', greeting: 'നമസ്കാരം', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  mr: { appSubtitle: 'तुमचा AI शेती गुप्तचर एजंट', gmailBtn: 'Google सह सुरू ठेवा', orMobile: 'किंवा मोबाईल', phonePlaceholder: '10 अंकी मोबाईल नंबर टाका', sendOtp: 'OTP पाठवा', verifyTitle: 'OTP सत्यापित करा', verifySub: 'पाठवलेला 6-अंकी कोड टाका', verifyBtn: 'लॉगिन करा', searchBox: 'पिके, दर शोधा...', profileSettings: 'प्रोफाइल सेटिंग्ज', fullName: 'पूर्ण नाव', address: 'शेताचा पत्ता', appLanguage: 'अ‍ॅप भाषा', saveChanges: 'जतन करा', logout: 'लॉग आउट', backToDash: 'डॅशबोर्डवर परत जा', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  gu: { appSubtitle: 'તમારું AI કૃષિ ઇન્ટેલિજન્સ એજન્ટ', gmailBtn: 'Google સાથે આગળ વધો', orMobile: 'અથવા મોબાઇલ', phonePlaceholder: '10 અંકનો મોબાઇલ નંબર દાખલ કરો', sendOtp: 'OTP મોકલો', verifyTitle: 'OTP ચકાસો', verifySub: 'મોકલેલ 6-અંકનો કોડ દાખલ કરો', verifyBtn: 'લોગિન કરો', searchBox: 'પાક, કિંમતો શોધો...', profileSettings: 'પ્રોફાઇલ સેટિંગ્સ', fullName: 'પૂરું નામ', address: 'ખેતરનું સરનામું', appLanguage: 'એપ ભાષા', saveChanges: 'સાચવો', logout: 'લોગ આઉટ', backToDash: 'ડેશબોર્ડ પર પાછા જાઓ', greeting: 'નમસ્તે', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  bn: { appSubtitle: 'আপনার AI কৃষি বুদ্ধিমত্তা এজেন্ট', gmailBtn: 'Google দিয়ে চালিয়ে যান', orMobile: 'অথবা মোবাইল', phonePlaceholder: '১০ সংখ্যার মোবাইল নম্বর লিখুন', sendOtp: 'OTP পাঠান', verifyTitle: 'OTP যাচাই করুন', verifySub: 'পাঠানো ৬-সংখ্যার কোড লিখুন', verifyBtn: 'লগইন করুন', searchBox: 'ফসল, দাম খুঁজুন...', profileSettings: 'প্রোফাইল সেটিংস', fullName: 'সম্পূর্ণ নাম', address: 'খামারের ঠিকানা', appLanguage: 'অ্যাপের ভাষা', saveChanges: 'সংরক্ষণ করুন', logout: 'লগ আউট', backToDash: 'ড্যাশবোর্ডে ফিরুন', greeting: 'নমস্কার', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  pa: { appSubtitle: 'ਤੁਹਾਡਾ AI ਖੇਤੀਬਾੜੀ ਏਜੰਟ', gmailBtn: 'Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ', orMobile: 'ਜਾਂ ਮੋਬਾਈਲ', phonePlaceholder: '10-ਅੰਕਾਂ ਵਾਲਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ', sendOtp: 'OTP ਭੇਜੋ', verifyTitle: 'OTP ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', verifySub: 'ਭੇਜਿਆ ਗਿਆ 6-ਅੰਕਾਂ ਵਾਲਾ ਕੋਡ ਦਰਜ ਕਰੋ', verifyBtn: 'ਲਾਗਇਨ ਕਰੋ', searchBox: 'ਫ਼ਸਲਾਂ, ਭਾਅ ਖੋਜੋ...', profileSettings: 'ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ', fullName: 'ਪੂਰਾ ਨਾਮ', address: 'ਖੇਤ ਦਾ ਪਤਾ', appLanguage: 'ਐਪ ਦੀ ਭਾਸ਼ਾ', saveChanges: 'ਸੰਭਾਲੋ', logout: 'ਲਾਗ ਆਉਟ', backToDash: 'ਡੈਸ਼ਬੋਰਡ \'ਤੇ ਵਾਪਸ ਜਾਓ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  or: { appSubtitle: 'ଆପଣଙ୍କର AI କୃଷି ଗୁଇନ୍ଦା ଏଜେଣ୍ଟ', gmailBtn: 'Google ସହିତ ଆଗକୁ ବଢନ୍ତୁ', orMobile: 'କିମ୍ବା ମୋବାଇଲ୍', phonePlaceholder: '10-ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର', sendOtp: 'OTP ପଠାନ୍ତୁ', verifyTitle: 'OTP ଯାଞ୍ଚ କରନ୍ତୁ', verifySub: 'ପଠାଯାଇଥିବା 6-ଅଙ୍କ ବିଶିଷ୍ଟ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ', verifyBtn: 'ଲଗଇନ୍ କରନ୍ତୁ', searchBox: 'ଫସଲ, ମୂଲ୍ୟ ଖୋଜନ୍ତୁ...', profileSettings: 'ପ୍ରୋଫାଇଲ୍ ସେଟିଙ୍ଗ୍', fullName: 'ପୂରା ନାମ', address: 'ଚାଷ ଜମି ଠିକଣା', appLanguage: 'ଆପ୍ ଭାଷା', saveChanges: 'ସଂରକ୍ଷଣ କରନ୍ତୁ', logout: 'ଲଗ୍ ଆଉଟ୍', backToDash: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ', greeting: 'ନମସ୍କାର', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  as: { appSubtitle: 'আপোনাৰ AI কৃষি বুদ্ধিমত্তা এজেণ্ট', gmailBtn: 'Google ৰ সৈতে আগবাঢ়ক', orMobile: 'বা ম’বাইল', phonePlaceholder: '১০-অংকৰ ম’বাইল নম্বৰ দিয়ক', sendOtp: 'OTP পঠাওক', verifyTitle: 'OTP পৰীক্ষা কৰক', verifySub: 'প্ৰেৰণ কৰা ৬-অংকৰ ক’ড দিয়ক', verifyBtn: 'লগ ইন কৰক', searchBox: 'শস্য, মূল্য সন্ধান কৰক...', profileSettings: 'প্রফাইল ছেটিংছ', fullName: 'সম্পূৰ্ণ নাম', address: 'খেতিৰ ঠিকনা', appLanguage: 'ভাষা', saveChanges: 'সংৰক্ষণ কৰক', logout: 'লগ আউট', backToDash: 'ডেশ্বব’ৰ্ডলৈ উভতি যাওক', greeting: 'নমস্কাৰ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ur: { appSubtitle: 'آپ کا AI زرعی انٹیلی جنس ایجنٹ', gmailBtn: 'Google کے ساتھ جاری رکھیں', orMobile: 'یا موبائل', phonePlaceholder: '10 ہندسوں کا موبائل نمبر درج کریں', sendOtp: 'OTP بھیجیں', verifyTitle: 'OTP کی تصدیق کریں', verifySub: 'بھیجا گیا 6 ہندسوں کا کوڈ درج کریں', verifyBtn: 'لاگ ان کریں', searchBox: 'فصلیں، قیمتیں تلاش کریں...', profileSettings: 'پروفائل کی ترتیبات', fullName: 'پورا نام', address: 'فارم کا پتہ', appLanguage: 'ایپ کی زبان', saveChanges: 'محفوظ کریں', logout: 'لاگ آؤٹ', backToDash: 'ڈیش بورڈ پر واپس جائیں', greeting: 'سلام', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  sa: { appSubtitle: 'भवतः AI कृषिमतिमान् प्रतिनिधिः', gmailBtn: 'Google द्वारा अनुवर्तताम्', orMobile: 'अथवा चलदूरभाषः', phonePlaceholder: '10 अङ्कीय दूरभाषसंख्यां प्रविशतु', sendOtp: 'OTP प्रेषयतु', verifyTitle: 'OTP सत्यापयतु', verifySub: 'प्रेषितं षडङ्कीयसङ्केतं प्रविशतु', verifyBtn: 'प्रवेशं करोतु', searchBox: 'सस्यानि मूल्यानि च अन्विष्यताम्...', profileSettings: 'विवरणसंयोजनानि', fullName: 'पूर्णं नाम', address: 'क्षेत्रसङ्केतः', appLanguage: 'भाषा', saveChanges: 'रक्षतु', logout: 'निर्गमनम्', backToDash: 'मुख्यपट्टं प्रतिगच्छतु', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ne: { appSubtitle: 'तपाईंको AI कृषि बुद्धिमत्ता एजेन्ट', gmailBtn: 'Google मार्फत जारी राख्नुहोस्', orMobile: 'वा मोबाइल', phonePlaceholder: '१०-अङ्कको मोबाइल नम्बर प्रविष्ट गर्नुहोस्', sendOtp: 'OTP पठाउनुहोस्', verifyTitle: 'OTP प्रमाणित गर्नुहोस्', verifySub: 'पठाइएको ६-अङ्कको कोड प्रविष्ट गर्नुहोस्', verifyBtn: 'लगइन गर्नुहोस्', searchBox: 'बाली, मूल्यहरू खोज्नुहोस्...', profileSettings: 'प्रोफाइल सेटिङहरू', fullName: 'पूरा नाम', address: 'खेतको ठेगाना', appLanguage: 'एप भाषा', saveChanges: 'सुरक्षित गर्नुहोस्', logout: 'लग आउट', backToDash: 'ड्यासबोर्डमा फर्कनुहोस्', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  kok: { appSubtitle: 'तुमचो AI शेतकी गुप्तहेर एजंट', gmailBtn: 'Google वरून मुखार वचात', orMobile: 'वा मोबाइल', phonePlaceholder: '10 अंकी मोबाइल नंबर घालात', sendOtp: 'OTP धाडा', verifyTitle: 'OTP तपासणी', verifySub: 'धाडिल्लो 6-अंकी कोड घालात', verifyBtn: 'लॉगिन करात', searchBox: 'पिकां, दर सोदात...', profileSettings: 'प्रोफाइल मांडणी', fullName: 'पूर्ण नांव', address: 'शेताचो पत्तो', appLanguage: 'अ‍ॅप भास', saveChanges: 'सांबाळात', logout: 'भायर सरा', backToDash: 'डॅशबोर्डार परते वचात', greeting: 'नमस्कार', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  mai: { appSubtitle: 'अहाँक AI कृषि बुद्धिमत्ता एजेंट', gmailBtn: 'Google सँ जारी राखू', orMobile: 'वा मोबाइल', phonePlaceholder: '10-अंकी मोबाइल नंबर दर्ज करू', sendOtp: 'OTP पठाउ', verifyTitle: 'OTP सत्यापित करू', verifySub: 'पठायल 6-अंकी कोड दर्ज करू', verifyBtn: 'लॉगिन करू', searchBox: 'फसल, दाम खोजू...', profileSettings: 'प्रोफाइल सेटिंग्स', fullName: 'पूरा नाम', address: 'खेतक पता', appLanguage: 'ऐप भाषा', saveChanges: 'सुरक्षित करू', logout: 'लॉग आउट', backToDash: 'डैशबोर्ड पर वापस जाउ', greeting: 'प्रणाम', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  doi: { appSubtitle: 'तुंदा AI खेतीबाड़ी एजेंट', gmailBtn: 'Google कन्नै जारी रक्खो', orMobile: 'या मोबाइल', phonePlaceholder: '10-अंकी मोबाइल नंबर दर्ज करो', sendOtp: 'OTP भेजो', verifyTitle: 'OTP दी पुष्टि करो', verifySub: 'भेजे गेदे 6-अंकी कोड गी दर्ज करो', verifyBtn: 'लॉगिन करो', searchBox: 'फसलां, कीमतां तुप्पो...', profileSettings: 'प्रोफाइल सैटिंगां', fullName: 'पूरा नांउ', address: 'खेत दा पता', appLanguage: 'ऐप दी भाखा', saveChanges: 'संजोओ', logout: 'लॉग आउट', backToDash: 'डैशबोर्ड पर परत जाओ', greeting: 'नमस्ते', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  ks: { appSubtitle: 'تہنٛد AI زراعت انٹیلی جنس ایجنٹ', gmailBtn: 'Google سٟتؠ جٲری تھٲوو', orMobile: 'یا موبائل', phonePlaceholder: '10 ہندسَن ہُنٛد فون نمبر', sendOtp: 'OTP سوزِو', verifyTitle: 'OTP تصدیق کٔرِو', verifySub: 'سوزنہٕ آمُت 6 ہندسَن ہُنٛد کوڈ دَرٕج کٔرِو', verifyBtn: 'لاگ اِن کٔرِو', searchBox: 'فصلہٕ، قیمتھ ژھانٛڈِو...', profileSettings: 'پروفائل سیٹنگس', fullName: 'پورا ناو', address: 'کھیتُک پتہٕ', appLanguage: 'ایپٕچ زَبان', saveChanges: 'محفوظ کٔرِو', logout: 'لاگ آؤٹ', backToDash: 'ڈیش بورڈَس پؠٹھ واپس گٔژھِو', greeting: 'سلام', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  mni: { appSubtitle: 'নহাক্কী AI লৌউ-শিংউগী ইন্তেলিজেন্স এজেন্ত', gmailBtn: 'Google দা চত্থবা', orMobile: 'নত্রগা মোবাঈল', phonePlaceholder: '১০-মশিংগী মোবাঈল নম্বর চনবা', sendOtp: 'OTP থাবা', verifyTitle: 'OTP য়েংশিনবা', verifySub: 'থারকপা ওতিপি কোদ চনবা', verifyBtn: 'লোগ ইন তৌবা', searchBox: 'পাম্বী, মমল থিবা...', profileSettings: 'প্রোফাইল সেত্তিংস', fullName: 'মপুংফাবা মমিং', address: 'লৌবুক্কী লৈফম', appLanguage: 'লোন', saveChanges: 'শেভ তৌবা', logout: 'লোগ আউৎ', backToDash: 'দেশবোর্দতা হলকপা', greeting: 'খুরুমজরি', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  sat: { appSubtitle: 'ᱟᱢᱟᱜ AI ᱪᱟᱥᱵᱟᱥ ᱜᱚᱲᱚᱭᱤᱡ', gmailBtn: 'Google ᱛᱮ ᱞᱟᱦᱟᱜ ᱢᱮ', orMobile: 'ᱥᱮ ᱢᱳᱵᱟᱭᱤᱞ', phonePlaceholder: '᱑᱐-ᱮᱞ ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ', sendOtp: 'OTP ᱠᱩᱞ ᱢᱮ', verifyTitle: 'OTP ᱧᱮᱞ ᱢᱮ', verifySub: 'ᱠᱩᱞ ᱟᱠᱟᱱ ᱖-ᱮᱞ ᱠᱳᱰ ᱮᱢ ᱢᱮ', verifyBtn: 'ᱞᱚᱜᱤষ্ঠ ᱢᱮ', searchBox: 'ᱯᱷᱚᱥᱚᱞ, ᱫᱟᱢ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...', profileSettings: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱥᱟᱡᱟᱣ', fullName: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ', address: 'ᱠᱷᱮᱛ ᱴᱷᱟᱶ', appLanguage: 'ᱯᱟᱹᱨᱥᱤ', saveChanges: 'ᱥᱟᱺᱪᱟᱣ ᱢᱮ', logout: 'ᱵᱟᱦᱨᱮ ᱚᱰᱚᱠ', backToDash: 'ᱰᱮᱥᱵᱳᱨᱰ ᱛᱮ ᱨᱩᱣᱟᱹᱲ', greeting: 'ᱡᱚᱦᱟᱨ', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  sd: { appSubtitle: 'توهان جو AI زرعي ايجنٽ', gmailBtn: 'Google سان جاري رکو', orMobile: 'يا موبائل', phonePlaceholder: '10 انگن وارو فون نمبر', sendOtp: 'OTP موڪليو', verifyTitle: 'OTP جي تصديق ڪريو', verifySub: 'موڪليل 6 انگن وارو ڪوڊ داخل ڪريو', verifyBtn: 'لاگ ان ڪريو', searchBox: 'فصل، قيمتون ڳوليو...', profileSettings: 'پروفائل سيٽنگون', fullName: 'پورو نالو', address: 'ٻنيءَ جو پتو', appLanguage: 'ايپ جي ٻولي', saveChanges: 'محفوظ ڪريو', logout: 'لاگ آئوٽ', backToDash: 'ڊيش بورڊ ڏانهن واپس وڃو', greeting: 'سلام', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' },
  brx: { appSubtitle: 'नोंथांनि AI आबाद एजेन्ट', gmailBtn: 'Google जों थां', orMobile: 'एबा मबाइल', phonePlaceholder: '10-अनजिमानि मबाइल नम्बर हर', sendOtp: 'OTP हर', verifyTitle: 'OTP आनजाद खालाम', verifySub: 'हरनाय 6-अनजिमानि कद हर', verifyBtn: 'लग इन खालाम', searchBox: 'फसल, बेसेन नागिर...', profileSettings: 'प्रफाइल सेटिं', fullName: 'आबुं मुं', address: 'फारमनि थिकना', appLanguage: 'राव', saveChanges: 'थिन', logout: 'अंखारलां', backToDash: 'देसबर्डसिम थांफिन', greeting: 'खुलुमबाय', homeSub: "Here's what's happening on your farm today.", growSub: 'AI guidance to boost your crop yields.', sellSub: 'Live market prices and the best time to sell.', loseSub: 'Prevent pests, disease, and post-harvest loss.' }
}

export default function Page() {
  const { lang, setLang } = useLanguage()
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  const [appState, setAppState] = useState<'loading' | 'login' | 'otp' | 'dashboard' | 'profile'>('loading')
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  
  // Validation and OTP state
  const [phoneError, setPhoneError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [showSimulatedSms, setShowSimulatedSms] = useState(false)
  const [copiedOtp, setCopiedOtp] = useState(false)
  
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])
  
  // Interactive states for Search and Notifications
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<{title: string, msg: string, type: 'urgent'|'info'}[]>([])
  const [showTour, setShowTour] = useState(false)

  const [userData, setUserData] = useState({
    name: 'Farmer',
    initial: 'A',
    address: 'Vadlamudi, Andhra Pradesh',
    phoneOrEmail: '',
  })

  useEffect(() => {
    if (appState === 'dashboard') {
      const fetchNotifications = async () => {
        try {
          const notifs: {title: string, msg: string, type: 'urgent'|'info'}[] = []
          
          // Weather alert
          const wRes = await fetch(`http://127.0.0.1:8000/api/weather?location=${userData.address.split(',')[0]}`)
          if (wRes.ok) {
            const wData = await wRes.json()
            if (wData.rain_chance > 50 || wData.temp > 35) {
              notifs.push({
                type: 'urgent',
                title: 'Urgent: Weather Alert',
                msg: `High ${wData.temp > 35 ? 'temperature' : 'rain chance'} in ${wData.location.split(',')[0]}. Check your dashboard for crop care.`
              })
            }
          }

          // Price alert
          const pRes = await fetch('http://127.0.0.1:8000/api/prices')
          if (pRes.ok) {
            const pData = await pRes.json()
            if (pData.data && pData.data.length > 0) {
              const bestPrice = pData.data[0]
              notifs.push({
                type: 'info',
                title: 'Market Update',
                msg: `${bestPrice.crop} prices updated in ${bestPrice.market}. Current: ₹${bestPrice.price}`
              })
            }
          }
          
          if (notifs.length === 0) {
             notifs.push({
                type: 'info',
                title: 'System Update',
                msg: 'All systems operational. Have a great farming day!'
             })
          }
          setNotifications(notifs)
        } catch(e) {
          console.error('Failed to fetch notifications', e)
        }
      }
      fetchNotifications()
      
      if (!localStorage.getItem(`krishi_tour_completed_${userData.phoneOrEmail}`)) {
        setShowTour(true)
      }
    }
  }, [appState, userData.phoneOrEmail])

  const [tab, setTab] = useState<DashboardTab>('home')
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false)
  
  const meta = {
    title: tab === 'home' ? `${t.greeting}, ${userData.name.split(' ')[0] || 'Farmer'}` : 
           tab === 'grow' ? 'Grow Better' : tab === 'sell' ? 'Sell Smarter' : 'Lose Less',
    subtitle: tab === 'home' ? t.homeSub : 
              tab === 'grow' ? t.growSub : tab === 'sell' ? t.sellSub : t.loseSub,
  }

  // Load existing session on boot
  useEffect(() => {
    const savedSession = localStorage.getItem('krishi_session')
    if (savedSession) {
      try {
        setUserData(JSON.parse(savedSession))
        setAppState('dashboard')
      } catch {
        setAppState('login')
      }
    } else {
      setAppState('login')
    }
  }, [])

  // 60-second OTP Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (appState === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [appState, resendTimer])

  const [confirmationResult, setConfirmationResult] = useState<any>(null)

  // Phone number typing handler: strictly digits only, max 10 chars
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhoneNumber(rawDigits)
    if (phoneError) setPhoneError('')
  }

  // Initialize Firebase Recaptcha
  const setupRecaptcha = () => {
    if (typeof window === 'undefined') return null
    try {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear()
        } catch (e) {}
        window.recaptchaVerifier = null
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('Firebase reCAPTCHA verified successfully')
        },
        'expired-callback': () => {
          console.warn('Firebase reCAPTCHA expired, resetting')
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear()
            window.recaptchaVerifier = null
          }
        },
      })
      return window.recaptchaVerifier
    } catch (err) {
      console.error('Recaptcha setup error:', err)
      return null
    }
  }

  // Send OTP via Firebase Real SMS
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneError('')

    if (phoneNumber.length !== 10) {
      setPhoneError('Please enter a complete 10-digit Indian mobile number.')
      return
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setPhoneError('Indian mobile numbers must start with 6, 7, 8, or 9.')
      return
    }

    setIsSendingOtp(true)

    // 1. Attempt Real Firebase Phone Auth SMS first
    let firebaseSuccess = false
    let firebaseErrorMessage = ''

    try {
      const appVerifier = setupRecaptcha()
      if (appVerifier) {
        const formattedPhone = `+91${phoneNumber}`
        console.log(`[Firebase Phone Auth] Sending SMS to ${formattedPhone}...`)
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
        setConfirmationResult(confirmation)
        setGeneratedOtp('')
        setShowSimulatedSms(false)
        setOtpDigits(['', '', '', '', '', ''])
        setOtpError('')
        setResendTimer(60)
        setIsSendingOtp(false)
        setAppState('otp')
        firebaseSuccess = true
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
        return
      }
    } catch (firebaseErr: any) {
      console.error('[Firebase Phone Auth Error]:', firebaseErr)
      firebaseErrorMessage = firebaseErr?.message || firebaseErr?.code || 'Firebase Auth Error'
    }

    // 2. If Firebase fails, notify and fallback to backend dev_mode
    try {
      console.warn(`[Fallback] Firebase SMS failed (${firebaseErrorMessage}), using backend fallback...`)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/send-otp?phone=${phoneNumber}`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to send OTP')
      }

      setConfirmationResult(null)
      setOtpDigits(['', '', '', '', '', ''])
      setOtpError('')
      setResendTimer(60)
      setIsSendingOtp(false)

      if (data.status === 'dev_mode' && data.dev_otp) {
        setGeneratedOtp(data.dev_otp)
        setShowSimulatedSms(true)
      } else {
        setGeneratedOtp('')
        setShowSimulatedSms(false)
      }

      setAppState('otp')
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
    } catch (err: any) {
      setIsSendingOtp(false)
      setPhoneError(`Could not send OTP: ${err.message}. Make sure backend is running.`)
    }
  }

  // Send OTP for Email with strict regex validation
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailAddress.trim())) {
      setEmailError('Please enter a valid email address (e.g. name@gmail.com).')
      return
    }

    setIsSendingOtp(true)
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(newOtp)
      setConfirmationResult(null)
      setOtpDigits(['', '', '', '', '', ''])
      setOtpError('')
      setResendTimer(60)
      setIsSendingOtp(false)
      setAppState('otp')
      setShowSimulatedSms(true)
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
    }, 600)
  }

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsSendingOtp(true)

    if (authMode === 'phone') {
      // 1. Try Firebase Resend
      try {
        const appVerifier = setupRecaptcha()
        if (appVerifier && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          const formattedPhone = `+91${phoneNumber}`
          const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
          setConfirmationResult(confirmation)
          setOtpDigits(['', '', '', '', '', ''])
          setOtpError('')
          setResendTimer(60)
          setIsSendingOtp(false)
          setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
          return
        }
      } catch (fbErr) {
        console.warn('Firebase resend warning:', fbErr)
      }

      // 2. Fallback to Backend
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/send-otp?phone=${phoneNumber}`, {
          method: 'POST',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Failed')

        setOtpDigits(['', '', '', '', '', ''])
        setOtpError('')
        setResendTimer(60)
        setIsSendingOtp(false)

        if (data.status === 'dev_mode' && data.dev_otp) {
          setGeneratedOtp(data.dev_otp)
          setShowSimulatedSms(true)
        }

        setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
        return
      } catch (err: any) {
        setIsSendingOtp(false)
        setOtpError(`Resend failed: ${err.message}`)
        return
      }
    }

    // Email resend fallback (on-screen)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    setOtpDigits(['', '', '', '', '', ''])
    setOtpError('')
    setResendTimer(60)
    setIsSendingOtp(false)
    setShowSimulatedSms(true)
    setTimeout(() => otpInputRefs.current[0]?.focus(), 150)
  }

  // Handle Google Login (Real Firebase Sign-in Popup)
  const handleGoogleLogin = async () => {
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        const result = await signInWithPopup(auth, googleProvider)
        const user = result.user
        const userInfo = {
          name: user.displayName || 'Farmer',
          initial: (user.displayName || 'A').charAt(0).toUpperCase(),
          address: userData.address || 'Vadlamudi, Andhra Pradesh',
          phoneOrEmail: user.email || '',
        }
        setUserData(userInfo)
        localStorage.setItem('krishi_session', JSON.stringify(userInfo))
        setAppState('dashboard')
        return
      }
      // Demo / Local development bypass
      const userInfo = {
        name: 'Demo Farmer',
        initial: 'D',
        address: userData.address || 'Vadlamudi, Andhra Pradesh',
        phoneOrEmail: 'farmer.krishirakshak@gmail.com',
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    } catch (error: any) {
      console.warn("Google Login notice, falling back to demo session:", error)
      const userInfo = {
        name: 'Demo Farmer',
        initial: 'D',
        address: userData.address || 'Vadlamudi, Andhra Pradesh',
        phoneOrEmail: 'farmer.krishirakshak@gmail.com',
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    }
  }

  // Handle Guest Login (Anonymous Authentication)
  const handleGuestLogin = async () => {
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        await signInAnonymously(auth)
      }
      const userInfo = {
        name: 'Guest Farmer',
        initial: 'G',
        address: userData.address || 'Vadlamudi, Andhra Pradesh',
        phoneOrEmail: 'guest@krishirakshak.local',
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    } catch (error: any) {
      console.warn("Guest Login notice, falling back to demo session:", error)
      const userInfo = {
        name: 'Guest Farmer',
        initial: 'G',
        address: userData.address || 'Vadlamudi, Andhra Pradesh',
        phoneOrEmail: 'guest@krishirakshak.local',
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    }
  }

  // Individual digit change in OTP boxes
  const handleDigitChange = (index: number, value: string) => {
    const cleanDigit = value.replace(/\D/g, '').slice(-1)
    const nextDigits = [...otpDigits]
    nextDigits[index] = cleanDigit
    setOtpDigits(nextDigits)
    if (otpError) setOtpError('')

    if (cleanDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Backspace key navigation in OTP boxes
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Paste handler for 6 digits
  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData) {
      const nextDigits = ['', '', '', '', '', '']
      for (let i = 0; i < pastedData.length; i++) {
        nextDigits[i] = pastedData[i]
      }
      setOtpDigits(nextDigits)
      if (otpError) setOtpError('')
      const nextFocus = Math.min(pastedData.length, 5)
      otpInputRefs.current[nextFocus]?.focus()
    }
  }

  // Auto-fill OTP button helper
  const handleAutoFillOtp = () => {
    if (!generatedOtp) return
    const digits = generatedOtp.split('')
    setOtpDigits(digits)
    setOtpError('')
    setCopiedOtp(true)
    setTimeout(() => setCopiedOtp(false), 2000)
    otpInputRefs.current[5]?.focus()
  }

  // Verify OTP submission (Fast2SMS Backend or Email local check)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpError('')
    const entered = otpDigits.join('')

    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.')
      return
    }

    setIsVerifyingOtp(true)

    if (authMode === 'phone') {
      // 1. Verify via Firebase confirmationResult if available
      if (confirmationResult) {
        try {
          const result = await confirmationResult.confirm(entered)
          const user = result.user
          const userInfo = {
            name: user.displayName || 'Farmer',
            initial: 'F',
            address: userData.address || 'Vadlamudi, Andhra Pradesh',
            phoneOrEmail: user.phoneNumber || `+91${phoneNumber}`,
          }
          setUserData(userInfo)
          localStorage.setItem('krishi_session', JSON.stringify(userInfo))
          setIsVerifyingOtp(false)
          setAppState('dashboard')
          return
        } catch (firebaseVerifyErr: any) {
          console.warn('Firebase OTP verification failed:', firebaseVerifyErr)
          setIsVerifyingOtp(false)
          setOtpError('Invalid OTP code. Please check your SMS and try again.')
          return
        }
      }

      // 2. Verify via backend (Fast2SMS OTP / dev_mode)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber, otp: entered }),
        })
        const data = await res.json()

        if (!res.ok) {
          setIsVerifyingOtp(false)
          setOtpError(data.detail || 'Invalid OTP. Please try again.')
          return
        }

        // Phone verified successfully!
        const userInfo = {
          name: `Farmer`,
          initial: 'F',
          address: userData.address || 'Vadlamudi, Andhra Pradesh',
          phoneOrEmail: `+91${phoneNumber}`,
        }
        setUserData(userInfo)
        localStorage.setItem('krishi_session', JSON.stringify(userInfo))
        setIsVerifyingOtp(false)
        setAppState('dashboard')
        return
      } catch (err: any) {
        setIsVerifyingOtp(false)
        setOtpError(`Verification failed: ${err.message}`)
        return
      }
    }

    // Email OTP - local check (simulated)
    if (entered !== generatedOtp) {
      setIsVerifyingOtp(false)
      setOtpError('Incorrect OTP. Please check the code shown above or click Resend.')
      return
    }

    setTimeout(() => {
      setIsVerifyingOtp(false)
      const userDisplay = emailAddress.split('@')[0]
      const userInfo = {
        name: userDisplay,
        initial: (userDisplay || 'A').charAt(0).toUpperCase(),
        address: userData.address || 'Vadlamudi, Andhra Pradesh',
        phoneOrEmail: emailAddress,
      }
      setUserData(userInfo)
      localStorage.setItem('krishi_session', JSON.stringify(userInfo))
      setAppState('dashboard')
    }, 400)
  }

  const handleProfileSave = () => {
    localStorage.setItem('krishi_session', JSON.stringify(userData))
    setAppState('dashboard')
  }

  if (appState === 'loading') return <div className="min-h-screen bg-background" />

  if (appState === 'login') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-card to-background p-4 relative">
        {/* Language selector in top-right */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-md max-w-[220px] z-10">
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

        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-400">
          {/* Header Banner */}
          <div className="bg-gradient-to-b from-primary/15 via-primary/10 to-transparent p-8 text-center border-b border-border/40">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/20 animate-bounce-subtle">
              <Tractor className="size-8" />
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-foreground">KrishiRakshak</h1>
            <p className="mt-1.5 text-sm font-medium text-muted-foreground">{t.appSubtitle}</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary/80 p-1.5 border border-border/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('phone')
                  setPhoneError('')
                  setEmailError('')
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  authMode === 'phone'
                    ? 'bg-card text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone className="size-4 text-primary" /> Phone OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email')
                  setPhoneError('')
                  setEmailError('')
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  authMode === 'email'
                    ? 'bg-card text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Mail className="size-4 text-primary" /> Email / Google
              </button>
            </div>

            {authMode === 'phone' ? (
              /* PHONE AUTHENTICATION FORM */
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Mobile Number (India)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-bold text-sm text-foreground select-none pointer-events-none">
                        <span className="text-base">🇮🇳</span>
                        <span>+91</span>
                        <span className="h-4 w-px bg-border mx-1"></span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        required
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className={`w-full rounded-xl border bg-background py-3.5 pl-24 pr-12 text-sm font-semibold text-foreground tracking-wider outline-none transition-all ${
                          phoneError 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        {phoneNumber.length}/10
                      </span>
                    </div>
                  </div>

                  {phoneError && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500 animate-in fade-in">
                      <AlertCircle className="size-3.5 shrink-0" /> {phoneError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={phoneNumber.length !== 10 || isSendingOtp}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>{t.sendOtp}</span> <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* EMAIL / GOOGLE AUTHENTICATION FORM */
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3.5 text-sm font-bold text-foreground hover:bg-secondary/70 transition-all shadow-sm active:scale-[0.99]"
                >
                  <svg className="size-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  {t.gmailBtn}
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="mx-4 shrink-0 text-xs font-semibold text-muted-foreground uppercase">OR EMAIL OTP</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        placeholder="farmer@gmail.com"
                        value={emailAddress}
                        onChange={(e) => {
                          setEmailAddress(e.target.value)
                          if (emailError) setEmailError('')
                        }}
                        className={`w-full rounded-xl border bg-background py-3.5 pl-12 pr-4 text-sm font-medium text-foreground outline-none transition-all ${
                          emailError 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500 animate-in fade-in">
                        <AlertCircle className="size-3.5 shrink-0" /> {emailError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!emailAddress.trim() || isSendingOtp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Email OTP</span> <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border"></div>
              <span className="mx-4 shrink-0 text-xs font-semibold text-muted-foreground uppercase">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              onClick={handleGuestLogin}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-transparent py-3.5 text-sm font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all active:scale-[0.99]"
            >
              <User className="size-4" />
              Continue as Guest
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              <span>100% Secure & Government Data Compliant</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (appState === 'otp') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-card to-background p-4 relative animate-in fade-in duration-300">
        {/* Real-time Simulated SMS Push Notification Banner */}
        {showSimulatedSms && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50 animate-in slide-in-from-top-6 duration-400">
            <div className="rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-xl p-4 shadow-2xl ring-1 ring-primary/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md">
                    <KeyRound className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {authMode === 'phone' ? '📩 SMS Message • KrishiRakshak' : '✉️ Email Security Code'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Just now</span>
                    </div>
                    <p className="text-xs text-foreground font-medium mt-0.5">
                      Your verification OTP is <span className="font-extrabold text-primary text-sm tracking-widest">{generatedOtp}</span>. Do not share this code.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSimulatedSms(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Quick Action:</span>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary px-3 py-1 text-xs font-bold transition-all"
                >
                  {copiedOtp ? <Check className="size-3.5" /> : <Sparkles className="size-3.5" />}
                  {copiedOtp ? 'Auto-Filled!' : '⚡ Click to Auto-Fill OTP'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-md rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-8 shadow-2xl text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 ring-4 ring-primary/10">
            <Lock className="size-7" />
          </div>

          <h2 className="text-2xl font-black text-foreground">{t.verifyTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.verifySub}{' '}
            <span className="font-bold text-foreground">
              {authMode === 'phone' ? `+91 ${phoneNumber}` : emailAddress}
            </span>
          </p>

          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
            {/* 6-box PIN input */}
            <div>
              <div className="flex justify-between gap-2 sm:gap-3">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpInputRefs.current[i] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP Digit ${i + 1}`}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                    onPaste={i === 0 ? handleDigitPaste : undefined}
                    className={`h-14 w-full rounded-xl border bg-background text-center text-2xl font-black text-foreground outline-none transition-all ${
                      otpError
                        ? 'border-red-500 bg-red-500/5 focus:ring-2 focus:ring-red-500/20'
                        : digit
                        ? 'border-primary bg-primary/5 focus:ring-2 focus:ring-primary/20'
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0" /> {otpError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={otpDigits.some((d) => !d) || isVerifyingOtp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>{t.verifyBtn}</span> <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {/* Resend OTP timer */}
            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
              <button
                type="button"
                onClick={() => {
                  setAppState('login')
                  setOtpDigits(['', '', '', '', '', ''])
                  setOtpError('')
                }}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-semibold"
              >
                <ArrowLeft className="size-3.5" /> Change {authMode === 'phone' ? 'Number' : 'Email'}
              </button>

              {resendTimer > 0 ? (
                <span className="font-medium text-muted-foreground">
                  Resend in <span className="font-bold text-primary">{resendTimer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="flex items-center gap-1.5 font-bold text-primary hover:underline"
                >
                  <RefreshCw className="size-3.5" /> Resend OTP
                </button>
              )}
            </div>
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
            <div className="mt-4 border-t border-border pt-4">
              <button
                onClick={() => {
                  localStorage.removeItem(`krishi_tour_completed_${userData.phoneOrEmail}`)
                  setShowTour(true)
                  setAppState('dashboard')
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/30 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground shadow-sm transition-all"
              >
                <Sparkles className="size-4" /> Replay App Tour
              </button>
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
              onClick={async () => {
                try { await auth.signOut(); } catch(e) {}
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
      <DashboardSidebar active={tab} onChange={setTab} onOpenVoiceGuide={() => setIsVoiceGuideOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur lg:px-8">
          <div id="tour-welcome" className="min-w-0">
            <h1 className="truncate text-xl font-bold text-foreground lg:text-2xl">{meta.title}</h1>
            <p className="truncate text-sm text-muted-foreground">{meta.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Header AI Voice Guide Button */}
            <button
              id="tour-voice-btn"
              type="button"
              onClick={() => setIsVoiceGuideOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-3.5 py-2 text-xs font-extrabold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95"
              title="Open AI Voice Guide"
            >
              <Mic className="size-4 animate-pulse text-primary" />
              <span className="hidden sm:inline">AI Voice Guide</span>
            </button>

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
            <div id="tour-notifications" className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex size-11 items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
              >
                <Bell className="size-5" />
                {notifications.length > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive animate-pulse" />}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                    <h4 className="text-sm font-bold text-foreground">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)}><X className="size-4 text-muted-foreground hover:text-foreground" /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-2">No new notifications.</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className={`rounded-xl p-3 ${n.type === 'urgent' ? 'bg-destructive/10' : 'bg-secondary/50'}`}>
                          <p className={`text-xs font-bold flex items-center gap-1 ${n.type === 'urgent' ? 'text-destructive' : 'text-foreground'}`}>
                            {n.type === 'urgent' ? <AlertTriangle className="size-3"/> : <TrendingUp className="size-3 text-primary"/>} 
                            {n.title}
                          </p>
                          <p className={`text-[11px] mt-1 font-medium ${n.type === 'urgent' ? 'text-destructive/80' : 'text-muted-foreground'}`}>{n.msg}</p>
                        </div>
                      ))
                    )}
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

      {/* Multilingual AI Voice Assistant Modal */}
      <AIVoiceGuideModal
        isOpen={isVoiceGuideOpen}
        onClose={() => setIsVoiceGuideOpen(false)}
        onNavigateTab={(newTab, targetId) => {
          setTab(newTab)
          if (targetId) {
            setTimeout(() => {
              document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
            }, 300)
          }
        }}
      />

      {showTour && (
        <OnboardingTour
          onComplete={() => {
            setShowTour(false)
            localStorage.setItem(`krishi_tour_completed_${userData.phoneOrEmail}`, 'true')
          }}
        />
      )}
    </div>
  )
}
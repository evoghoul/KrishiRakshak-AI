'use client'

import { useMemo, useState } from 'react'
import { 
  Search, Landmark, BadgeCheck, IndianRupee, ArrowRight, X, FileText, 
  ExternalLink, CheckCircle2, ShieldCheck, Copy, Check, Info, Sparkles 
} from 'lucide-react'
import { useLanguage, type SupportedLang } from '@/lib/language-context'

interface Scheme {
  id: string
  name: string
  tag: string
  category: 'Central' | 'State'
  benefit: string
  description: string
  officialUrl: string
  portalName: string
  eligibility: string[]
  stepsToApply?: string[]
}

const SCHEMES_DATABASE: Record<string, { officialUrl: string; portalName: string }> = {
  'pm-kisan': {
    officialUrl: 'https://pmkisan.gov.in/',
    portalName: 'pmkisan.gov.in (Ministry of Agriculture)',
  },
  'rythu-bharosa': {
    officialUrl: 'https://www.myscheme.gov.in/schemes/ysr-rb-pmk',
    portalName: 'myscheme.gov.in (YSR Rythu Bharosa Official Portal)',
  },
  'pmfby': {
    officialUrl: 'https://pmfby.gov.in/',
    portalName: 'pmfby.gov.in (PMFBY Official Portal)',
  },
  'kcc': {
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    portalName: 'myscheme.gov.in / pmkisan.gov.in',
  },
  'pmksy': {
    officialUrl: 'https://pmksy.gov.in/',
    portalName: 'pmksy.gov.in (Pradhan Mantri Krishi Sinchayee Yojana)',
  },
  'pm-kusum': {
    officialUrl: 'https://pmkusum.mnre.gov.in/',
    portalName: 'pmkusum.mnre.gov.in (Solar Agriculture Scheme)',
  },
  'soil-health': {
    officialUrl: 'https://soilhealth.dac.gov.in/',
    portalName: 'soilhealth.dac.gov.in (DAC&FW)',
  },
  'enam': {
    officialUrl: 'https://www.enam.gov.in/web/',
    portalName: 'enam.gov.in (National Agriculture Market)',
  },
}

const SCHEME_TRANSLATIONS: Record<string, any> = {
  en: {
    title: 'Government Schemes & Crop Assistance',
    subtitle: 'Official subsidies, financial aid, and direct government portals',
    searchPlaceholder: 'Search schemes (e.g. PM-Kisan, Fasal Bima, KCC)',
    filters: { All: 'All Schemes', Central: 'Central Govt', State: 'State Govt' },
    noSchemes: 'No schemes match your search query.',
    checkEligibility: 'Check Eligibility',
    visitDirect: 'Official Portal',
    modalTitle: 'Scheme Eligibility & Official Portal',
    requirementsTitle: 'Required Documents & Criteria',
    stepsTitle: 'How to Apply on Official Portal',
    applyBtn: 'Open Official Government Portal',
    copyLink: 'Copy Portal URL',
    copied: 'Link Copied!',
    closeBtn: 'Close',
    officialBadge: 'Verified Official Govt.in Portal',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'PM-Kisan Samman Nidhi',
        tag: 'Income Support',
        category: 'Central',
        benefit: '₹6,000 / year (Direct DBT)',
        description: 'Direct income support of ₹6,000 per year transferred in 3 equal installments into eligible farmer bank accounts.',
        eligibility: [
          'Must own cultivable land with valid land records',
          'Aadhaar linked active bank account (e-KYC mandatory)',
          'Small & marginal farmer families without high tax income'
        ],
        stepsToApply: [
          'Visit the official PM-Kisan portal at pmkisan.gov.in',
          'Click on "New Farmer Registration" under Farmers Corner',
          'Enter Aadhaar number, state, mobile number, and land details',
          'Submit and track status with Aadhaar card'
        ]
      },
      {
        id: 'rythu-bharosa',
        name: 'YSR Rythu Bharosa (AP)',
        tag: 'Income Support',
        category: 'State',
        benefit: '₹13,500 / year',
        description: 'Financial investment assistance of ₹13,500 per year provided to farmer and tenant farmer families in Andhra Pradesh.',
        eligibility: [
          'Resident farmer of Andhra Pradesh',
          'Valid land records (Pattadar Passbook / Adangal / RoR 1B)',
          'CCRC card for tenant (Kaulu) farmers',
          'Active Aadhaar-seeded bank account'
        ],
        stepsToApply: [
          'Visit ysrrythubharosa.ap.gov.in or nearest Rythu Bharosa Kendra (RBK)',
          'Verify your name in the beneficiary village list (e-Panta)',
          'Submit Pattadar Passbook or tenant CCRC agreement to VAA',
          'DBT funds deposited directly before crop sowing season'
        ]
      },
      {
        id: 'pmfby',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        tag: 'Crop Insurance',
        category: 'Central',
        benefit: 'Up to 90% premium subsidy',
        description: 'Comprehensive financial protection and claims against crop loss caused by flood, drought, cyclones, pests, and unseasonal rains.',
        eligibility: [
          'Farmers growing notified crops in notified areas',
          'Available for both loanee (KCC) and non-loanee farmers',
          'Land possession certificate and sowing declaration required'
        ],
        stepsToApply: [
          'Open pmfby.gov.in and click "Farmer Corner" -> "Apply as Farmer"',
          'Enter mobile number and verify via OTP',
          'Select State, District, Crop, Season (Kharif/Rabi), and Survey Number',
          'Pay the minimal farmer premium (1.5% to 2%) online or via CSC'
        ]
      },
      {
        id: 'kcc',
        name: 'Kisan Credit Card (KCC)',
        tag: 'Subsidized Credit',
        category: 'Central',
        benefit: 'Loans at 4% effective interest',
        description: 'Low-interest institutional credit up to ₹3 Lakhs for cultivation, seeds, fertilizers, and farm equipment.',
        eligibility: [
          'Owner cultivators, tenant farmers, oral lessees, and sharecroppers',
          'Self Help Groups (SHGs) or Joint Liability Groups of farmers',
          'Valid KYC documents (Aadhaar, PAN) and land records'
        ],
        stepsToApply: [
          'Visit the official portal or your local bank branch / PM-Kisan portal',
          'Download and fill the standard one-page KCC Application Form',
          'Attach copy of land records and crop sowing pattern',
          'Card issued within 14 working days with pre-approved credit limit'
        ]
      },
      {
        id: 'pmksy',
        name: 'PM Krishi Sinchayee Yojana (Per Drop More Crop)',
        tag: 'Micro-Irrigation',
        category: 'Central',
        benefit: 'Up to 55% subsidy on Drip/Sprinkler',
        description: 'Subsidized installation of drip irrigation, sprinkler sets, and water harvesting structures to maximize crop yields.',
        eligibility: [
          'Farmers owning agricultural land with an assured water source (borewell/well)',
          'Priority given to small and marginal farmers, SC/ST, and women farmers',
          'Valid electricity connection or solar pump setup'
        ],
        stepsToApply: [
          'Visit pmksy.gov.in or the State Horticulture/Agriculture portal',
          'Register with Aadhaar and farm plot survey details',
          'Select authorized micro-irrigation manufacturer and field estimate',
          'Field verification by officer -> Subsidy credited directly'
        ]
      },
      {
        id: 'pm-kusum',
        name: 'PM-KUSUM (Solar Agricultural Pumps)',
        tag: 'Solar Energy',
        category: 'Central',
        benefit: 'Up to 60% subsidy on Solar Pumps',
        description: 'Install stand-alone solar agricultural pumps or solarize existing grid-connected tube wells with up to 60% total subsidy.',
        eligibility: [
          'Individual farmers, cooperatives, panchayats, and FPOs',
          'Agricultural land requiring irrigation without reliable grid power',
          'Adequate ground water clearance in the area'
        ],
        stepsToApply: [
          'Open pmkusum.mnre.gov.in or your State Renewable Energy Agency portal',
          'Register online with land ownership documents and Aadhaar',
          'Pay 10% farmer share; remaining 60% covered by Central & State subsidy',
          'Solar pump installation completed within 60 days'
        ]
      }
    ]
  },
  te: {
    title: 'ప్రభుత్వ పథకాలు & పంట సహాయం',
    subtitle: 'అధికారిక సబ్సిడీలు, ఆర్థిక సహాయం మరియు ప్రభుత్వ పోర్టల్స్',
    searchPlaceholder: 'పథకాలను శోధించండి (ఉదా. పీఎం-కిసాన్, రైతు భరోసా, ఫసల్ బీమా)',
    filters: { All: 'అన్ని పథకాలు', Central: 'కేంద్ర ప్రభుత్వం', State: 'రాష్ట్ర ప్రభుత్వం' },
    noSchemes: 'మీ శోధనకు సరిపోలే పథకాలు లేవు.',
    checkEligibility: 'అర్హత తనిఖీ చేయండి',
    visitDirect: 'అధికారిక పోర్టల్',
    modalTitle: 'పథకం అర్హత & అధికారిక పోర్టల్ వివరాలు',
    requirementsTitle: 'అవసరమైన పత్రాలు & ప్రమాణాలు',
    stepsTitle: 'అధికారిక పోర్టల్‌లో ఎలా దరఖాస్తు చేసుకోవాలి',
    applyBtn: 'అధికారిక ప్రభుత్వ పోర్టల్‌కు వెళ్లండి',
    copyLink: 'పోర్టల్ లింక్ కాపీ చేయండి',
    copied: 'లింక్ కాపీ చేయబడింది!',
    closeBtn: 'మూసివేయి',
    officialBadge: 'ధృవీకరించబడిన అధికారిక ప్రభుత్వ వెబ్‌సైట్',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'పీఎం-కిసాన్ సమ్మాన్ నిధి',
        tag: 'ఆదాయ మద్దతు',
        category: 'Central',
        benefit: '₹6,000 / ఏడాదికి (ప్రత్యక్ష DBT)',
        description: 'అర్హులైన రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 చొప్పున మూడు సమాన వాయిదాలలో నేరుగా బ్యాంకు ఖాతాలోకి జమ చేయబడుతుంది.',
        eligibility: [
          'సాగు భూమి యాజమాన్యం మరియు సరైన భూమి రికార్డులు ఉండాలి',
          'ఆధార్ లింక్ చేయబడిన బ్యాంకు ఖాతా (e-KYC తప్పనిసరి)',
          'చిన్న మరియు సన్నకారు రైతు కుటుంబాలు'
        ],
        stepsToApply: [
          'pmkisan.gov.in అధికారిక పోర్టల్‌ను సందర్శించండి',
          '"Farmers Corner" లో "New Farmer Registration" పై క్లిక్ చేయండి',
          'ఆధార్ నంబర్, రాష్ట్రం, మొబైల్ నంబర్ మరియు భూమి వివరాలను నమోదు చేయండి',
          'సమర్పించి ఆధార్ కార్డుతో స్థితిని ట్రాక్ చేయండి'
        ]
      },
      {
        id: 'rythu-bharosa',
        name: 'వైఎస్ఆర్ రైతు భరోసా (AP)',
        tag: 'ఆదాయ మద్దతు',
        category: 'State',
        benefit: '₹13,500 / ఏడాదికి',
        description: 'కౌలు రైతులతో సహా ఆంధ్రప్రదేశ్ రైతులందరికీ పంట సీజన్‌కు పెట్టుబడి మద్దతుగా ₹13,500 నేరుగా జమ చేయబడుతుంది.',
        eligibility: [
          'ఆంధ్రప్రదేశ్ నివాసి అయి ఉండాలి',
          'చెల్లుబాటు అయ్యే భూమి రికార్డులు (పట్టాదారు పాస్‌బుక్ / అడంగల్)',
          'కౌలు రైతులకు CCRC కార్డు ఉండాలి',
          'DBT కోసం ఆధార్‌తో అనుసంధానించబడిన క్రియాశీల బ్యాంక్ ఖాతా'
        ],
        stepsToApply: [
          'ysrrythubharosa.ap.gov.in లేదా రైతు భరోసా కేంద్రాన్ని (RBK) సంప్రదించండి',
          'గ్రామ లబ్ధిదారుల జాబితాలో (e-Panta) మీ పేరును తనిఖీ చేసుకోండి',
          'పట్టాదారు పాస్‌బుక్ లేదా CCRC ఒప్పందాన్ని VAA కి సమర్పించండి',
          'పంట విత్తన కాలానికి ముందే ఖాతాలో డబ్బులు జమ అవుతాయి'
        ]
      },
      {
        id: 'pmfby',
        name: 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన',
        tag: 'పంట బీమా',
        category: 'Central',
        benefit: '90% వరకు ప్రీమియం సబ్సిడీ',
        description: 'వరదలు, కరువు, తుఫానులు, తెగుళ్లు మరియు అకాల వర్షాల వల్ల పంట నష్టానికి పూర్తి ఆర్థిక రక్షణ.',
        eligibility: [
          'నోటిఫైడ్ ప్రాంతాల్లో నోటిఫైడ్ పంటలు పండిస్తున్న రైతులు',
          'రుణం తీసుకున్న (KCC) మరియు తీసుకోని రైతులకు అందుబాటులో ఉంది',
          'భూమి స్వాధీన ధృవీకరణ పత్రం మరియు విత్తన డిక్లరేషన్ అవసరం'
        ],
        stepsToApply: [
          'pmfby.gov.in ఓపెన్ చేసి "Farmer Corner" పై క్లిక్ చేయండి',
          'మొబైల్ నంబర్ ఎంటర్ చేసి OTP తో లాగిన్ అవ్వండి',
          'రాష్ట్రం, జిల్లా, పంట, సర్వే నంబర్ వివరాలు నమోదు చేయండి',
          'చాలా తక్కువ ప్రీమియం (1.5% నుండి 2%) ఆన్‌లైన్‌లో చెల్లించండి'
        ]
      },
      {
        id: 'kcc',
        name: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC)',
        tag: 'రాయితీ రుణం',
        category: 'Central',
        benefit: '4% వడ్డీతో రూ. 3 లక్షల వరకు రుణాలు',
        description: 'విత్తనాలు, ఎరువులు మరియు సాగు ఖర్చుల కోసం అత్యంత తక్కువ వడ్డీతో స్వల్పకాలిక బ్యాంక్ రుణం.',
        eligibility: [
          'స్వంత భూమి ఉన్న రైతులు, కౌలు రైతులు, భాగస్వామ్య సాగుదారులు',
          'రైతుల స్వయం సహాయక సంఘాలు (SHGs) లేదా జాయింట్ లయబిలిటీ గ్రూపులు',
          'చెల్లుబాటు అయ్యే కేవైసీ పత్రాలు (ఆధార్, పాన్) మరియు భూమి వివరాలు'
        ],
        stepsToApply: [
          'myscheme.gov.in లేదా సమీపంలోని బ్యాంక్ శాఖను సంప్రదించండి',
          'ఒక పేజీ KCC దరఖాస్తు ఫారమ్‌ను పూరించండి',
          'భూమి రికార్డుల కాపీ మరియు పంట ప్రణాళికను జత చేయండి',
          '14 పని దినాలలో KCC కార్డు జారీ చేయబడుతుంది'
        ]
      },
      {
        id: 'pmksy',
        name: 'ప్రధాన మంత్రి కృషి సించాయి యోజన',
        tag: 'నీటిపారుదల',
        category: 'Central',
        benefit: '55% వరకు సబ్సిడీ (బిందు/తుంపర సేద్యం)',
        description: 'నీటి వినియోగాన్ని ఆప్టిమైజ్ చేయడానికి మరియు దిగుబడిని పెంచడానికి డ్రిప్ మరియు స్ప్రింక్లర్ సెట్ల కోసం ఆర్థిక సహాయం.',
        eligibility: [
          'సొంత వ్యవసాయ భూమి మరియు నీటి వనరు (బోరుబావి/కాలువ) ఉన్న రైతులు',
          'చిన్న, సన్నకారు మరియు మహిళా రైతులకు ప్రాధాన్యత',
          'చెల్లుబాటు అయ్యే విద్యుత్ కనెక్షన్ లేదా సోలార్ పంపు అమరిక'
        ],
        stepsToApply: [
          'pmksy.gov.in లేదా రాష్ట్ర ఉద్యానవన పోర్టల్‌ను సందర్శించండి',
          'ఆధార్ మరియు పొలం సర్వే వివరాలతో నమోదు చేసుకోండి',
          'అధీకృత డ్రిప్ కంపెనీని మరియు ఫీల్డ్ ఎస్టిమేట్‌ను ఎంచుకోండి',
          'క్షేత్ర తనిఖీ తర్వాత సబ్సిడీ నేరుగా మంజూరు చేయబడుతుంది'
        ]
      },
      {
        id: 'pm-kusum',
        name: 'పీఎం కుసుమ్ (సోలార్ అగ్రికల్చరల్ పంపులు)',
        tag: 'సౌర శక్తి',
        category: 'Central',
        benefit: 'సోలార్ పంపులపై 60% వరకు సబ్సిడీ',
        description: 'వ్యవసాయానికి స్వతంత్ర సోలార్ పంపులను ఏర్పాటు చేసుకోవడానికి 60% వరకు కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ సబ్సిడీ.',
        eligibility: [
          'వ్యక్తిగత రైతులు, సహకార సంఘాలు, పంచాయతీలు మరియు FPOలు',
          'విద్యుత్ సౌకర్యం లేని లేదా తక్కువ విద్యుత్ ఉన్న సాగు భూమి',
          'భూగర్భ జలాల లభ్యత ఉన్న ప్రాంతాలు'
        ],
        stepsToApply: [
          'pmkusum.mnre.gov.in లేదా రాష్ట్ర రెన్యూవబుల్ ఎనర్జీ పోర్టల్ తెరవండి',
          'భూమి పత్రాలు మరియు ఆధార్ కార్డుతో ఆన్‌లైన్ దరఖాస్తు చేయండి',
          'రైతు వాటాగా 10% మాత్రమే చెల్లించాలి; మిగిలిన 60% సబ్సిడీ',
          '60 రోజుల్లో సోలార్ పంపు అమరిక పూర్తి అవుతుంది'
        ]
      }
    ]
  },
  hi: {
    title: 'सरकारी योजनाएं और फसल सहायता',
    subtitle: 'आधिकारिक सरकारी सब्सिडी, वित्तीय सहायता एवं डायरेक्ट सरकारी पोर्टल',
    searchPlaceholder: 'योजना खोजें (उदा. PM-Kisan, फसल बीमा, KCC)',
    filters: { All: 'सभी योजनाएं', Central: 'केंद्र सरकार', State: 'राज्य सरकार' },
    noSchemes: 'आपकी खोज से मेल खाने वाली कोई योजना नहीं है।',
    checkEligibility: 'पात्रता जांचें',
    visitDirect: 'ऑफिशियल पोर्टल',
    modalTitle: 'योजना पात्रता एवं आधिकारिक पोर्टल विवरण',
    requirementsTitle: 'आवश्यक दस्तावेज और मानदंड',
    stepsTitle: 'आधिकारिक पोर्टल पर ऑनलाइन आवेदन कैसे करें',
    applyBtn: 'आधिकारिक सरकारी पोर्टल खोलें',
    copyLink: 'पोर्टल लिंक कॉपी करें',
    copied: 'लिंक कॉपी हो गया!',
    closeBtn: 'बंद करें',
    officialBadge: 'सत्यापित आधिकारिक सरकारी वेबसाइट (.gov.in)',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'पीएम-किसान सम्मान निधि',
        tag: 'आय सहायता',
        category: 'Central',
        benefit: '₹6,000 / वर्ष (सीधे बैंक खाते में)',
        description: 'पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता 3 समान किश्तों में सीधे बैंक खाते में DBT के माध्यम से दी जाती है।',
        eligibility: [
          'कृषि योग्य भूमि का वैध भू-स्वामित्व रिकॉर्ड होना चाहिए',
          'आधार से लिंक सक्रिय बैंक खाता (e-KYC अनिवार्य)',
          'छोटे एवं सीमांत किसान परिवार'
        ],
        stepsToApply: [
          'आधिकारिक पोर्टल pmkisan.gov.in पर जाएं',
          '"Farmers Corner" में "New Farmer Registration" पर क्लिक करें',
          'आधार संख्या, राज्य, मोबाइल नंबर और खतौनी/जमीन का विवरण दर्ज करें',
          'सबमिट करें और आधार नंबर से स्थिति ट्रैक करें'
        ]
      },
      {
        id: 'rythu-bharosa',
        name: 'वाईएसआर रायथु भरोसा (AP)',
        tag: 'आय सहायता',
        category: 'State',
        benefit: '₹13,500 / वर्ष',
        description: 'किरायेदार (कौल) किसानों सहित आंध्र प्रदेश के किसानों के लिए प्रति फसल मौसम ₹13,500 की सीधी निवेश सहायता।',
        eligibility: [
          'आंध्र प्रदेश का निवासी किसान होना चाहिए',
          'वैध भूमि रिकॉर्ड (पट्टेदार पासबुक / अडंगल)',
          'किरायेदार किसानों के लिए CCRC कार्ड',
          'DBT के लिए आधार से लिंक बैंक खाता'
        ],
        stepsToApply: [
          'ysrrythubharosa.ap.gov.in या नजदीकी रायथु भरोसा केंद्र (RBK) पर जाएं',
          'ग्राम लाभार्थी सूची (e-Panta) में अपना नाम सत्यापित करें',
          'पट्टेदार पासबुक या CCRC अनुबंध VAA को जमा करें',
          'फसल बुवाई से पहले राशि सीधे बैंक खाते में जमा हो जाती है'
        ]
      },
      {
        id: 'pmfby',
        name: 'प्रधान मंत्री फसल बीमा योजना',
        tag: 'फसल बीमा',
        category: 'Central',
        benefit: '90% तक प्रीमियम सब्सिडी',
        description: 'प्राकृतिक आपदाओं, बाढ़, सूखा, ओलावृष्टि, कीटों और बेमौसम बारिश से फसल नुकसान के विरुद्ध व्यापक वित्तीय सुरक्षा।',
        eligibility: [
          'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान',
          'ऋणी (KCC धारक) और गैर-ऋणी दोनों किसानों के लिए उपलब्ध',
          'भू-स्वामित्व प्रमाण पत्र और बुवाई स्व-घोषणा आवश्यक'
        ],
        stepsToApply: [
          'pmfby.gov.in खोलें और "Farmer Corner" पर क्लिक करें',
          'मोबाइल नंबर दर्ज कर OTP से लॉगिन करें',
          'राज्य, जिला, फसल, मौसम (खरीफ/रबी) और खसरा/सर्वे नंबर दर्ज करें',
          'न्यूनतम किसान प्रीमियम (1.5% से 2%) ऑनलाइन या CSC द्वारा जमा करें'
        ]
      },
      {
        id: 'kcc',
        name: 'किसान क्रेडिट कार्ड (KCC)',
        tag: 'सस्ती ऋण सुविधा',
        category: 'Central',
        benefit: '4% ब्याज दर पर ₹3 लाख तक का ऋण',
        description: 'खेती, बीज, खाद, कीटनाशक और कृषि उपकरणों के लिए रियायती ब्याज दर पर आसान संस्थागत ऋण।',
        eligibility: [
          'स्वयं खेती करने वाले किसान, बटाईदार, पट्टेदार और किरायेदार किसान',
          'स्वयं सहायता समूह (SHGs) या संयुक्त देयता समूह',
          'वैध केवाईसी (आधार, पैन) और जमीन के कागजात'
        ],
        stepsToApply: [
          'myscheme.gov.in या नजदीकी बैंक शाखा / PM-Kisan पोर्टल पर जाएं',
          'एक पन्ने का सरल KCC आवेदन फॉर्म भरें',
          'खतौनी/भूमि रिकॉर्ड और फसल विवरण संलग्न करें',
          '14 कार्य दिवसों के भीतर KCC कार्ड स्वीकृत हो जाता है'
        ]
      },
      {
        id: 'pmksy',
        name: 'पीएम कृषि सिंचाई योजना (प्रति बूंद अधिक फसल)',
        tag: 'सूक्ष्म सिंचाई',
        category: 'Central',
        benefit: 'ड्रिप/स्प्रिंकलर पर 55% तक सब्सिडी',
        description: 'पानी की बचत और पैदावार बढ़ाने के लिए ड्रिप सिंचाई और फव्वारा (स्प्रिंकलर) संयंत्रों की स्थापना पर भारी सब्सिडी।',
        eligibility: [
          'कृषि भूमि और सुनिश्चित जल स्रोत (बोरवेल/कुआं/नहर) वाले किसान',
          'लघु, सीमांत, महिला और SC/ST किसानों को विशेष प्राथमिकता',
          'विद्युत कनेक्शन या सोलर पंप की उपलब्धता'
        ],
        stepsToApply: [
          'pmksy.gov.in या राज्य बागवानी/कृषि विभाग के पोर्टल पर जाएं',
          'आधार और खेत के खसरा विवरण के साथ ऑनलाइन पंजीकरण करें',
          'अधिकृत ड्रिप निर्माता कंपनी और फील्ड एस्टीमेट चुनें',
          'भौतिक सत्यापन के बाद सब्सिडी सीधे बैंक खाते में हस्तांतरित होती है'
        ]
      },
      {
        id: 'pm-kusum',
        name: 'पीएम-कुसुम योजना (सोलर कृषि पंप)',
        tag: 'सौर ऊर्जा',
        category: 'Central',
        benefit: 'सोलर पंपों पर 60% तक सब्सिडी',
        description: 'डीजल और बिजली पर निर्भरता खत्म करने के लिए खेतों में सोलर पंप लगाने पर 60% तक संयुक्त केंद्र और राज्य सब्सिडी।',
        eligibility: [
          'व्यक्तिगत किसान, सहकारी समितियां, पंचायतें और किसान उत्पादक संगठन (FPO)',
          'सिंचाई योग्य कृषि भूमि जहां बिजली ग्रिड नहीं है',
          'पर्याप्त भूजल स्तर वाले क्षेत्र'
        ],
        stepsToApply: [
          'pmkusum.mnre.gov.in या राज्य अक्षय ऊर्जा एजेंसी के पोर्टल पर जाएं',
          'जमीन के दस्तावेज और आधार कार्ड के साथ ऑनलाइन आवेदन करें',
          'किसान को केवल 10% अंशदान देना होता है; शेष 60% सब्सिडी',
          '60 दिनों के भीतर सोलर पंप का इंस्टॉलेशन पूरा हो जाता है'
        ]
      }
    ]
  }
}

type FilterType = 'All' | 'Central' | 'State'

export function GovSchemes() {
  const { lang } = useLanguage()
  const t = SCHEME_TRANSLATIONS[lang] || SCHEME_TRANSLATIONS.en
  
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('All')
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const FILTERS: FilterType[] = ['All', 'Central', 'State']

  const mergedSchemes = useMemo(() => {
    const rawList = t.schemes || []
    return rawList.map((item: any) => {
      const dbInfo = SCHEMES_DATABASE[item.id] || {
        officialUrl: 'https://myscheme.gov.in/',
        portalName: 'myscheme.gov.in (Official Govt. Portal)',
      }
      return {
        ...item,
        officialUrl: dbInfo.officialUrl,
        portalName: dbInfo.portalName,
      } as Scheme
    })
  }, [t.schemes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mergedSchemes.filter((s: Scheme) => {
      const matchesFilter = filter === 'All' || s.category === filter
      const matchesQuery =
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [query, filter, mergedSchemes])

  const handleOpenPortal = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  return (
    <section
      id="gov-schemes-section"
      aria-label="Government schemes and crop assistance"
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      {/* Section Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
            <Landmark className="size-6 text-primary" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">{t.title}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="size-3.5" /> 100% Verified Govt Portals
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 sm:max-w-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search schemes"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  filter === f
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30 py-16 text-center">
          <Landmark className="size-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-bold text-foreground">{t.noSchemes}</p>
          <p className="text-xs text-muted-foreground mt-1">Try searching with a different keyword like "PM-Kisan" or "Insurance".</p>
          <button
            onClick={() => { setQuery(''); setFilter('All') }}
            className="mt-4 rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary/80 border border-border"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((scheme: Scheme) => (
            <li
              key={scheme.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card/80 p-5 transition-all hover:border-primary/50 hover:bg-card hover:shadow-md ring-1 ring-border/50"
            >
              <div>
                {/* Header tags */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    <Sparkles className="size-3" /> {scheme.tag}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-md border border-border/50">
                    {t.filters[scheme.category]}
                  </span>
                </div>

                {/* Scheme Title */}
                <h3 className="text-base font-bold text-foreground text-balance group-hover:text-primary transition-colors">
                  {scheme.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {scheme.description}
                </p>

                {/* Benefit Badge */}
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-foreground bg-secondary/70 rounded-xl px-3 py-2 border border-border/60">
                  <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <IndianRupee className="size-3.5" />
                  </div>
                  <span className="truncate">{scheme.benefit}</span>
                </div>

                {/* Official Domain Tag */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground px-1">
                  <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-mono">{scheme.portalName.split(' ')[0]}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                {/* Check Eligibility Details Modal */}
                <button
                  type="button"
                  onClick={() => setSelectedScheme(scheme)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary/80 py-2.5 px-2 text-xs font-bold text-foreground hover:bg-secondary border border-border/80 hover:border-primary/40 transition-all"
                >
                  <BadgeCheck className="size-3.5 text-primary" />
                  <span className="truncate">{t.checkEligibility}</span>
                </button>

                {/* Direct 1-Click Launch into Real Official Government Website */}
                <button
                  type="button"
                  onClick={() => handleOpenPortal(scheme.officialUrl)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 px-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95 group/btn"
                  title={`Open ${scheme.officialUrl} in a new tab`}
                >
                  <span className="truncate">{t.visitDirect}</span>
                  <ExternalLink className="size-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Interactive Scheme Eligibility & Launch Modal */}
      {selectedScheme && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedScheme(null)}
        >
          <div 
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/40 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <Landmark className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{t.modalTitle}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span className="font-semibold">{t.filters[selectedScheme.category]}</span>
                    <span>•</span>
                    <span>{selectedScheme.tag}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1">
              {/* Scheme Main Information */}
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary mb-2">
                  <Sparkles className="size-3" /> {selectedScheme.tag}
                </span>
                <h4 className="text-xl font-extrabold text-foreground">{selectedScheme.name}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {selectedScheme.description}
                </p>

                <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm font-bold text-primary">
                  <IndianRupee className="size-5 shrink-0" />
                  <span>Benefit: {selectedScheme.benefit}</span>
                </div>
              </div>

              {/* Verified Official Portal Notice Banner */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                        {t.officialBadge}
                      </h5>
                      <p className="text-xs font-mono text-emerald-950 dark:text-emerald-100 font-semibold mt-0.5 select-all">
                        {selectedScheme.officialUrl}
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                        Managed by: {selectedScheme.portalName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(selectedScheme.officialUrl)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                    title="Copy official website URL"
                  >
                    {copiedUrl ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{copiedUrl ? t.copied : t.copyLink}</span>
                  </button>
                </div>
              </div>

              {/* Eligibility Criteria & Required Documents */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 mb-3">
                  <FileText className="size-4 text-primary" /> 
                  {t.requirementsTitle}
                </h5>
                <ul className="space-y-2.5">
                  {selectedScheme.eligibility.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-foreground/90">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Guide on How to Apply Online */}
              {selectedScheme.stepsToApply && selectedScheme.stepsToApply.length > 0 && (
                <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2 mb-3">
                    <Info className="size-4 text-primary" /> 
                    {t.stepsTitle}
                  </h5>
                  <ol className="space-y-2">
                    {selectedScheme.stepsToApply.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed text-foreground/90">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-border bg-secondary/20 p-5 flex flex-col sm:flex-row gap-3">
              {/* PRIMARY ACTION: Opens the real Government Portal in a new tab */}
              <button
                type="button"
                onClick={() => handleOpenPortal(selectedScheme.officialUrl)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm font-extrabold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-[0.99]"
              >
                <span>{t.applyBtn}</span>
                <ExternalLink className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="rounded-xl border border-border bg-background py-3.5 px-5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
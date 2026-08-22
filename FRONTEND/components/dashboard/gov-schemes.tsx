'use client'

import { useMemo, useState } from 'react'
import { Search, Landmark, BadgeCheck, IndianRupee, ArrowRight, X, FileText, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useLanguage, type SupportedLang } from '@/lib/language-context'

interface Scheme {
  id: string
  name: string
  tag: string
  category: 'Central' | 'State'
  benefit: string
  description: string
  eligibility: string[]
}

const SCHEME_TRANSLATIONS: Record<SupportedLang, any> = {
  en: {
    title: 'Government Schemes & Crop Assistance',
    subtitle: 'Subsidies and support programs you may qualify for',
    searchPlaceholder: 'Search schemes (e.g. PM-Kisan)',
    filters: { All: 'All', Central: 'Central', State: 'State' },
    noSchemes: 'No schemes match your search.',
    checkEligibility: 'Check Eligibility',
    modalTitle: 'Scheme Eligibility & Details',
    requirementsTitle: 'Required Documents & Criteria',
    applyBtn: 'Proceed to Official Portal',
    closeBtn: 'Close',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'PM-Kisan Samman Nidhi',
        tag: 'Income Support',
        category: 'Central',
        benefit: '₹6,000 / year',
        description: 'Direct income support in three equal installments to eligible farmer families.',
        eligibility: ['Must own cultivable land', 'Valid ID linked bank account', 'Not a high-income earner or institutional landholder']
      },
      {
        id: 'rythu-bharosa',
        name: 'YSR Rythu Bharosa (AP)',
        tag: 'Income Support',
        category: 'State',
        benefit: '₹13,500 / year',
        description: 'Investment support for Andhra Pradesh farmers per cropping season, including tenant farmers.',
        eligibility: ['Resident of Andhra Pradesh', 'Valid land records (Pattadar Passbook)', 'Active bank account for DBT']
      },
      {
        id: 'pmfby',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        tag: 'Crop Insurance',
        category: 'Central',
        benefit: 'Up to 90% premium subsidy',
        description: 'Insurance cover against crop loss due to natural calamities, pests, and disease.',
        eligibility: ['Growing notified crops in notified areas', 'Available for loanee and non-loanee farmers', 'Sowing certificate required']
      },
      {
        id: 'kcc',
        name: 'Kisan Credit Card',
        tag: 'Credit',
        category: 'Central',
        benefit: 'Loans at 4% interest',
        description: 'Short-term credit for cultivation and post-harvest expenses at subsidised rates.',
        eligibility: ['Active farmer or tenant farmer', 'Good credit history', 'Valid identity and address proof']
      },
      {
        id: 'pmksy',
        name: 'PM Krishi Sinchayee Yojana',
        tag: 'Irrigation',
        category: 'Central',
        benefit: 'Up to 55% subsidy',
        description: 'Financial assistance for micro-irrigation like drip and sprinkler systems to optimize water use.',
        eligibility: ['Own agricultural land', 'Water source availability (borewell/canal)', 'Willingness to adopt micro-irrigation']
      }
    ]
  },
  te: {
    title: 'ప్రభుత్వ పథకాలు & పంట సహాయం',
    subtitle: 'మీకు అర్హత ఉన్న సబ్సిడీలు మరియు మద్దతు కార్యక్రమాలు',
    searchPlaceholder: 'పథకాలను శోధించండి (ఉదా. రైతు భరోసా)',
    filters: { All: 'అన్నీ', Central: 'కేంద్ర', State: 'రాష్ట్ర' },
    noSchemes: 'మీ శోధనకు సరిపోలే పథకాలు లేవు.',
    checkEligibility: 'అర్హత తనిఖీ చేయండి',
    modalTitle: 'పథకం అర్హత & వివరాలు',
    requirementsTitle: 'అవసరమైన పత్రాలు & ప్రమాణాలు',
    applyBtn: 'అధికారిక పోర్టల్‌కు వెళ్లండి',
    closeBtn: 'మూసివేయి',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'పీఎం-కిసాన్ సమ్మాన్ నిధి',
        tag: 'ఆదాయ మద్దతు',
        category: 'Central',
        benefit: '₹6,000 / ఏడాదికి',
        description: 'అర్హులైన రైతు కుటుంబాలకు మూడు సమాన వాయిదాలలో ప్రత్యక్ష ఆదాయ మద్దతు.',
        eligibility: ['సాగు భూమి కలిగి ఉండాలి', 'గుర్తింపు కార్డుతో లింక్ చేయబడిన బ్యాంకు ఖాతా', 'అధిక ఆదాయం కలిగిన వారు లేదా సంస్థాగత భూస్వాములు కాదు']
      },
      {
        id: 'rythu-bharosa',
        name: 'వైఎస్ఆర్ రైతు భరోసా (AP)',
        tag: 'ఆదాయ మద్దతు',
        category: 'State',
        benefit: '₹13,500 / ఏడాదికి',
        description: 'కౌలు రైతులతో సహా ఆంధ్రప్రదేశ్ రైతులందరికీ పంట సీజన్‌కు పెట్టుబడి మద్దతు.',
        eligibility: ['ఆంధ్రప్రదేశ్ నివాసి అయి ఉండాలి', 'చెల్లుబాటు అయ్యే భూమి రికార్డులు (పట్టాదారు పాస్‌బుక్)', 'DBT కోసం యాక్టివ్ బ్యాంక్ ఖాతా']
      },
      {
        id: 'pmfby',
        name: 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన',
        tag: 'పంట బీమా',
        category: 'Central',
        benefit: '90% వరకు ప్రీమియం సబ్సిడీ',
        description: 'ప్రకృతి వైపరీత్యాలు, తెగుళ్లు మరియు వ్యాధుల కారణంగా పంట నష్టానికి బీమా రక్షణ.',
        eligibility: ['నోటిఫైడ్ ప్రాంతాల్లో నోటిఫైడ్ పంటలు పండిస్తున్నవారు', 'రుణం తీసుకున్న మరియు తీసుకోని రైతులకు అందుబాటులో ఉంది', 'విత్తన ధృవీకరణ పత్రం అవసరం']
      },
      {
        id: 'kcc',
        name: 'కిసాన్ క్రెడిట్ కార్డ్',
        tag: 'రుణం',
        category: 'Central',
        benefit: '4% వడ్డీతో రుణాలు',
        description: 'సాగు మరియు పంట కోత అనంతర ఖర్చుల కోసం సబ్సిడీ రేట్లపై స్వల్పకాలిక రుణం.',
        eligibility: ['యాక్టివ్ రైతు లేదా కౌలు రైతు', 'మంచి క్రెడిట్ చరిత్ర', 'చెల్లుబాటు అయ్యే గుర్తింపు మరియు చిరునామా రుజువు']
      },
      {
        id: 'pmksy',
        name: 'ప్రధాన మంత్రి కృషి సించాయి యోజన',
        tag: 'నీటిపారుదల',
        category: 'Central',
        benefit: '55% వరకు సబ్సిడీ',
        description: 'నీటి వినియోగాన్ని ఆప్టిమైజ్ చేయడానికి బిందు మరియు తుంపర సేద్యం వంటి సూక్ష్మ సేద్యం కోసం ఆర్థిక సహాయం.',
        eligibility: ['సొంత వ్యవసాయ భూమి', 'నీటి వనరుల లభ్యత (బోరుబావి/కాలువ)', 'సూక్ష్మ సేద్యం అవలంబించడానికి సుముఖత']
      }
    ]
  },
  hi: {
    title: 'सरकारी योजनाएं और फसल सहायता',
    subtitle: 'सब्सिडी और सहायता कार्यक्रम जिनके लिए आप पात्र हो सकते हैं',
    searchPlaceholder: 'योजनाएं खोजें (उदा. PM-Kisan)',
    filters: { All: 'सभी', Central: 'केंद्रीय', State: 'राज्य' },
    noSchemes: 'आपकी खोज से मेल खाने वाली कोई योजना नहीं है।',
    checkEligibility: 'पात्रता जांचें',
    modalTitle: 'योजना की पात्रता और विवरण',
    requirementsTitle: 'आवश्यक दस्तावेज और मानदंड',
    applyBtn: 'आधिकारिक पोर्टल पर जाएं',
    closeBtn: 'बंद करें',
    schemes: [
      {
        id: 'pm-kisan',
        name: 'पीएम-किसान सम्मान निधि',
        tag: 'आय सहायता',
        category: 'Central',
        benefit: '₹6,000 / वर्ष',
        description: 'पात्र किसान परिवारों को तीन समान किश्तों में प्रत्यक्ष आय सहायता।',
        eligibility: ['कृषि योग्य भूमि का स्वामित्व होना चाहिए', 'वैध आईडी से जुड़ा बैंक खाता', 'उच्च आय वाले या संस्थागत भूमिधारक नहीं']
      },
      {
        id: 'rythu-bharosa',
        name: 'वाईएसआर रायथु भरोसा (AP)',
        tag: 'आय सहायता',
        category: 'State',
        benefit: '₹13,500 / वर्ष',
        description: 'किरायेदार किसानों सहित आंध्र प्रदेश के किसानों के लिए प्रति फसल मौसम निवेश सहायता।',
        eligibility: ['आंध्र प्रदेश का निवासी', 'वैध भूमि रिकॉर्ड (पट्टेदार पासबुक)', 'DBT के लिए सक्रिय बैंक खाता']
      },
      {
        id: 'pmfby',
        name: 'प्रधान मंत्री फसल बीमा योजना',
        tag: 'फसल बीमा',
        category: 'Central',
        benefit: '90% तक प्रीमियम सब्सिडी',
        description: 'प्राकृतिक आपदाओं, कीटों और बीमारी के कारण फसल के नुकसान के खिलाफ बीमा कवर।',
        eligibility: ['अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाना', 'ऋणी और गैर-ऋणी किसानों के लिए उपलब्ध', 'बुवाई प्रमाण पत्र आवश्यक']
      },
      {
        id: 'kcc',
        name: 'किसान क्रेडिट कार्ड',
        tag: 'ऋण',
        category: 'Central',
        benefit: '4% ब्याज पर ऋण',
        description: 'खेती और कटाई के बाद के खर्चों के लिए रियायती दरों पर अल्पकालिक ऋण।',
        eligibility: ['सक्रिय किसान या किरायेदार किसान', 'अच्छा क्रेडिट इतिहास', 'वैध पहचान और पता प्रमाण']
      },
      {
        id: 'pmksy',
        name: 'पीएम कृषि सिंचाई योजना',
        tag: 'सिंचाई',
        category: 'Central',
        benefit: '55% तक सब्सिडी',
        description: 'पानी के उपयोग को अनुकूलित करने के लिए ड्रिप और स्प्रिंकलर जैसी सूक्ष्म सिंचाई के लिए वित्तीय सहायता।',
        eligibility: ['स्वयं की कृषि भूमि', 'जल स्रोत की उपलब्धता (बोरवेल/नहर)', 'सूक्ष्म सिंचाई अपनाने की इच्छा']
      }
    ]
  }
} as any

type FilterType = 'All' | 'Central' | 'State'

export function GovSchemes() {
  const { lang } = useLanguage()
  const t = SCHEME_TRANSLATIONS[lang] || SCHEME_TRANSLATIONS.en
  
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('All')
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)

  const FILTERS: FilterType[] = ['All', 'Central', 'State']

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const schemesList: Scheme[] = t.schemes
    
    return schemesList.filter((s) => {
      const matchesFilter = filter === 'All' || s.category === filter
      const matchesQuery =
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [query, filter, t.schemes])

  return (
    <section
      aria-label="Government schemes and crop assistance"
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Landmark className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">{t.title}</h2>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <div className="flex min-w-52 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 sm:max-w-xs focus-within:border-primary transition-colors">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search schemes"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 py-12">
          <Landmark className="size-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">{t.noSchemes}</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((scheme) => (
            <li
              key={scheme.id}
              className="group flex flex-col rounded-2xl border border-border bg-secondary/40 p-5 transition-all hover:border-primary/40 hover:bg-secondary/80 hover:shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {scheme.tag}
                </span>
                <span className="text-xs font-bold text-muted-foreground">{t.filters[scheme.category]}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground text-balance">{scheme.name}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">{scheme.description}</p>
              
              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-foreground bg-background rounded-lg px-3 py-2 border border-border/50">
                <IndianRupee className="size-4 text-primary" aria-hidden="true" />
                {scheme.benefit}
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedScheme(scheme)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <BadgeCheck className="size-4" aria-hidden="true" />
                {t.checkEligibility}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Interactive Scheme Eligibility Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Landmark className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{t.modalTitle}</h3>
                  <p className="text-xs text-muted-foreground">{t.filters[selectedScheme.category]} • {selectedScheme.tag}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <h4 className="text-lg font-bold text-foreground">{selectedScheme.name}</h4>
                <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 rounded-lg px-3 py-1.5">
                  <IndianRupee className="size-4" />
                  {selectedScheme.benefit}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-2 mb-3">
                  <FileText className="size-4 text-primary" /> 
                  {t.requirementsTitle}
                </h4>
                <ul className="space-y-2">
                  {selectedScheme.eligibility.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-snug">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setSelectedScheme(null)} // Simulated external link
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
              >
                {t.applyBtn} <ExternalLink className="size-4" />
              </button>
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-full rounded-xl bg-transparent border border-border py-3.5 text-sm font-bold text-foreground hover:bg-secondary transition-all"
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
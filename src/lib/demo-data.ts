export const DEMO_DIAGNOSTICS = [
  {
    id: "diag-001",
    disease_class: "bud rot",
    confidence: 0.94,
    location: { lat: 7.2914, lng: 80.6342 },
    captured_at: "2026-08-25T10:30:00Z"
  },
  {
    id: "diag-002",
    disease_class: "gray leaf spot",
    confidence: 0.88,
    location: { lat: 7.2928, lng: 80.6325 },
    captured_at: "2026-08-25T11:15:00Z"
  },
  {
    id: "diag-003",
    disease_class: "healthy leaves",
    confidence: 0.98,
    location: { lat: 7.2895, lng: 80.6358 },
    captured_at: "2026-08-24T09:20:00Z"
  },
  {
    id: "diag-004",
    disease_class: "healthy leaves",
    confidence: 0.96,
    location: { lat: 7.2905, lng: 80.6348 },
    captured_at: "2026-08-24T14:45:00Z"
  },
  {
    id: "diag-005",
    disease_class: "leaf rot",
    confidence: 0.82,
    location: { lat: 7.2935, lng: 80.6315 },
    captured_at: "2026-08-23T16:10:00Z"
  },
  {
    id: "diag-006",
    disease_class: "bud root dropping",
    confidence: 0.89,
    location: { lat: 7.2910, lng: 80.6365 },
    captured_at: "2026-08-23T10:05:00Z"
  },
  {
    id: "diag-007",
    disease_class: "stembleeding",
    confidence: 0.93,
    location: { lat: 7.2940, lng: 80.6330 },
    captured_at: "2026-08-22T14:15:00Z"
  }
];

export const DISEASE_COLORS: Record<string, { 
  label: string, 
  label_si: string,
  label_ta: string,
  color: string, 
  bg: string, 
  description: string,
  description_si: string,
  description_ta: string
}> = {
  "healthy leaves": { 
    label: "Healthy", 
    label_si: "නිරෝගී",
    label_ta: "ஆரோக்கியமான",
    color: "#00FF9D", 
    bg: "rgba(0, 255, 157, 0.15)",
    description: "Non-diseased healthy palm tissue with optimal chlorophyll density.",
    description_si: "ප්‍රශස්ත හරිතප්‍රද ඝනත්වයකින් යුත් නිරෝගී පොල් පත්‍ර පටක.",
    description_ta: "உகந்த பச்சைய அடர்த்தியுடன் கூடிய நோயற்ற ஆரோக்கியமான இலைத் திசுக்கள்."
  },
  "bud rot": { 
    label: "Bud Rot", 
    label_si: "අග කුණු වීම",
    label_ta: "குருத்து அழுகல்",
    color: "#FF4C4C", 
    bg: "rgba(255, 76, 76, 0.15)",
    description: "Fatal fungal disease (Phytophthora palmivora) attacking terminal bud.",
    description_si: "අග්‍රස්ථ අංකුරයට හානි කරන මාරාන්තික දිලීර රෝගයකි (Phytophthora palmivora).",
    description_ta: "முனைய குருத்தைத் தாக்கும் ஆபத்தான பூஞ்சை நோய் (Phytophthora palmivora)."
  },
  "gray leaf spot": { 
    label: "Gray Leaf Spot", 
    label_si: "අළු ලප රෝගය",
    label_ta: "சாம்பல் இலை புள்ளி",
    color: "#FF8C00", 
    bg: "rgba(255, 140, 0, 0.15)",
    description: "Foliar disease (Pestalotiopsis palmarum) with greyish-white necrotic spots.",
    description_si: "අළු-සුදු පැහැති ලප සහිත පත්‍ර ආසාදනය (Pestalotiopsis palmarum).",
    description_ta: "சாம்பல்-வெள்ளை புள்ளிகளுடன் கூடிய இலை நோய் (Pestalotiopsis palmarum)."
  },
  "leaf rot": { 
    label: "Leaf Rot", 
    label_si: "කොළ කුණු වීම",
    label_ta: "இலை அழுகல்",
    color: "#E6AF2E", 
    bg: "rgba(230, 175, 46, 0.15)",
    description: "Fungal infection causing necrosis of younger fronds.",
    description_si: "ළපටි පොල් මට්ටු කුණු වීමට ලක්වන දිලීර ආසාදනයකි.",
    description_ta: "இளம் ஓலைகளை அழுகச் செய்யும் பூஞ்சை தொற்று."
  },
  "bud root dropping": { 
    label: "Bud Root Dropping", 
    label_si: "කරය හැලීම",
    label_ta: "குருத்து வீழ்ச்சி",
    color: "#A78BFA", 
    bg: "rgba(167, 139, 250, 0.15)",
    description: "Critical advanced spindle collapse and drooping due to bud decay.",
    description_si: "කරටිය දිරාපත් වීම නිසා ඇතිවන දරුණු මට්ටේ කඩා වැටීම.",
    description_ta: "குருத்து அழுகலால் ஏற்படும் தீவிர ஓலை வீழ்ச்சி."
  },
  "stembleeding": { 
    label: "Stem Bleeding", 
    label_si: "කඳෙන් ලේ වැගිරීම",
    label_ta: "தண்டு வடியல்",
    color: "#F472B6", 
    bg: "rgba(244, 114, 182, 0.15)",
    description: "Vascular infection oozing dark reddish exudate from trunk.",
    description_si: "පොල් කඳෙන් තද දුඹුරු ශ්‍රාවයක් ගලා යන සනාල ආසාදනය (Ceratocystis paradoxa).",
    description_ta: "மரத் தண்டிலிருந்து கருஞ்சிவப்பு திரவம் வழியும் நாளத் தொற்று."
  }
};

export interface KnowledgeItem {
  id: string;
  common_name: string;
  common_name_si: string;
  common_name_ta: string;
  scientific_name: string;
  symptoms: string[];
  symptoms_si: string[];
  symptoms_ta: string[];
  treatment_protocols: {
    chemical: string[];
    chemical_si: string[];
    chemical_ta: string[];
    biological: string[];
    biological_si: string[];
    biological_ta: string[];
    cultural: string[];
    cultural_si: string[];
    cultural_ta: string[];
  };
  vernacular_advice: string;
  vernacular_advice_si: string;
  vernacular_advice_ta: string;
  severity_level: 'critical' | 'high' | 'medium' | 'low';
  source: string;
}

export const DEMO_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "kb_001",
    common_name: "Bud Rot",
    common_name_si: "අග කුණු වීම",
    common_name_ta: "குருத்து அழுகல்",
    scientific_name: "Phytophthora palmivora",
    symptoms: [
      "Rotting and yellowing of the central spindle leaf (cabbage)",
      "Foul-smelling brownish-black liquid oozing from crown",
      "Successive outer fronds drooping and dropping prematurely",
      "Spindle leaf can be pulled out easily with negligible resistance",
    ],
    symptoms_si: [
      "මධ්‍යම කරටි පත්‍රය (ගොබය) කහ වීම සහ කුණු වී යාම",
      "කරටියෙන් දුගඳ හමන තද දුඹුරු-කළු පැහැති දියරයක් ගලා ඒම",
      "පිටත මට්ටු අකාලයේ පහතට එල්ලා වැටීම හා හැලී යාම",
      "කරටි පත්‍රය ඉතා පහසුවෙන් සුළු ඇදීමකින් ගැලවී ඒම",
    ],
    symptoms_ta: [
      "மையக் குருத்து இலை மஞ்சள் நிறமாகி அழுகுதல்",
      "கிரீடத்திலிருந்து துர்நாற்றமுடைய கரும் பழுப்பு திரவம் வடிதல்",
      "வெளிப்புற ஓலைகள் முன்கூட்டியே தொங்கி உதிர்தல்",
      "குருத்து இலையை மிக எளிதாக இழுத்து எடுக்க முடிதல்",
    ],
    treatment_protocols: {
      chemical: [
        "Cut and thoroughly excise rotted tissue until healthy tissue is exposed",
        "Apply 10% Bordeaux paste directly to cut surgical surfaces",
        "Crown drench with Mancozeb (0.3% / 3g per Liter) or Copper Oxychloride",
        "Repeat application at 14-day intervals during monsoon rain spells",
      ],
      chemical_si: [
        "නිරෝගී පටක මතුවන තෙක් කුණු වූ සියලු කොටස් කපා ඉවත් කරන්න",
        "කපන ලද පෘෂ්ඨය මත 10% බෝඩෝ මිශ්‍රණ පේස්ට් එක කෙලින්ම ආලේප කරන්න",
        "මැන්කොසෙබ් (ලීටරයකට ග්‍රෑම් 3) හෝ කොපර් ඔක්සික්ලෝරයිඩ් මඟින් කරටිය තෙමන්න",
        "වැසි සහිත කාලගුණය තුළ දින 14කට වරක් නැවත යොදන්න",
      ],
      chemical_ta: [
        "ஆரோக்கியமான திசு வெளிப்படும் வரை அழுகிய திசுக்களை வெட்டி அகற்றவும்",
        "வெட்டப்பட்ட மேற்பரப்பில் 10% போர்டோ பசையை நேரடியாக தடவவும்",
        "மேன்கோசெப் (3 கிராம்/லிட்டர்) அல்லது காப்பர் ஆக்ஸிகுளோரைடு கொண்டு நனைக்கவும்",
        "மழைக்காலத்தில் 14 நாட்கள் இடைவெளியில் மீண்டும் பயன்படுத்தவும்",
      ],
      biological: [
        "Apply Trichoderma viride enriched organic compost around root zone",
        "Incorporate Pseudomonas fluorescens foliar spray for antagonistic suppression",
      ],
      biological_si: [
        "මුල් කලාපය වටා ට්‍රයිකොඩර්මා (Trichoderma viride) මිශ්‍ර කොම්පෝස්ට් යොදන්න",
        "දිලීර මර්දනය සඳහා Pseudomonas fluorescens පත්‍ර ඉසින යොදන්න",
      ],
      biological_ta: [
        "வேர் பகுதியைச் சுற்றி ட்ரைக்கோடெர்மா செறிவூட்டப்பட்ட உரம் இடவும்",
        "நோய் எதிர்ப்புக்கு சூடோமோனாஸ் இலைத் தெளிப்பைப் பயன்படுத்தவும்",
      ],
      cultural: [
        "Isolate severely affected palms; burn excavated infected cabbage tissue immediately",
        "Improve field drainage to eliminate standing crown water and humidity traps",
      ],
      cultural_si: [
        "දැඩි ලෙස ආසාදිත ගස් හුදකලා කර කපා ඉවත් කළ කොටස් වහාම පුළුස්සා දමන්න",
        "කරටිය ආශ්‍රිතව ජලය රැඳීම වැළැක්වීමට වගා බිමේ ජලාපවහනය දියුණු කරන්න",
      ],
      cultural_ta: [
        "பாதிக்கப்பட்ட மரங்களை தனிமைப்படுத்தி, வெட்டிய பகுதிகளை உடனே எரிக்கவும்",
        "நீர் தேங்குவதைத் தவிர்க்க பண்ணை வடிகால் வசதியை மேம்படுத்தவும்",
      ]
    },
    vernacular_advice: "Bud Root Dropping indicates terminal stage necrosis. Prompt surgical excision of the infected crown is required within 48 hours to prevent complete tree loss.",
    vernacular_advice_si: "අග කුණු වීම මාරාන්තික තත්ත්වයකි. ගස සම්පූර්ණයෙන්ම විනාශ වීම වැළැක්වීම සඳහා පැය 48ක් ඇතුළත කුණු වූ කොටස් කපා ප්‍රතිකාර කළ යුතුය.",
    vernacular_advice_ta: "குருத்து அழுகல் உயிருக்கே ஆபத்தானது. மரம் முழுமையாக அழிவதைத் தவிர்க்க 48 மணி நேரத்திற்குள் சிகிச்சை அளிக்க வேண்டும்.",
    severity_level: "critical",
    source: "Coconut Research Institute of Sri Lanka (CRI Bulletin No. 12)",
  },
  {
    id: "kb_002",
    common_name: "Gray Leaf Spot",
    common_name_si: "අළු ලප රෝගය",
    common_name_ta: "சாம்பல் இலை புள்ளி",
    scientific_name: "Pestalotiopsis palmarum",
    symptoms: [
      "Minute yellowish-brown spots enlarging to greyish-white oval lesions",
      "Dark brown necrotic margins surrounding grey centers on older fronds",
      "Coalescence of lesions leading to severe blighting and premature frond drying",
      "Noticeably reduced photosynthetic efficiency and nut-setting capacity",
    ],
    symptoms_si: [
      "කුඩා කහ-දුඹුරු ලප අළු-සුදු ඉලිප්සාකාර තුවාල බවට විශාල වීම",
      "පැරණි මට්ටුවල අළු පැහැති මධ්‍යය වටා තද දුඹුරු දාර ඇතිවීම",
      "ලප එකතු වීමෙන් මට්ටු වේලී පිලිස්සී යාම",
      "ප්‍රභාසංස්ලේෂණය හා ගෙඩි හටගැනීම සැලකිය යුතු ලෙස අඩුවීම",
    ],
    symptoms_ta: [
      "சிறிய மஞ்சள்-பழுப்பு புள்ளிகள் சாம்பல்-வெள்ளை தழும்புகளாக விரிவடைதல்",
      "பழைய ஓலைகளில் சாம்பல் மையத்தைச் சுற்றி கரும்பழுப்பு ஓரங்கள் தோன்றுதல்",
      "புள்ளிகள் இணைந்து ஓலைகள் காய்ந்து கருகிப் போதல்",
      "ஒளிச்சேர்க்கை மற்றும் காய் பிடிக்கும் திறன் கணிசமாகக் குறைதல்",
    ],
    treatment_protocols: {
      chemical: [
        "Foliar spray with Carbendazim (0.1%) or Mancozeb (0.25%) at first symptom onset",
        "Spray Copper Hydroxide (2g/L) across lower and middle canopy tiers",
      ],
      chemical_si: [
        "රෝග ලක්ෂණ ආරම්භයේදීම කාබෙන්ඩසිම් (0.1%) හෝ මැන්කොසෙබ් (0.25%) පත්‍ර ඉසින්න",
        "පහළ සහ මැද වියන් ස්ථර සඳහා කොපර් හයිඩ්‍රොක්සයිඩ් (ලීටරයකට ග්‍රෑම් 2) ඉසින්න",
      ],
      chemical_ta: [
        "ஆரம்ப நிலையிலேயே கார்பென்டாசிம் (0.1%) அல்லது மேன்கோசெப் (0.25%) தெளிக்கவும்",
        "கீழ் மற்றும் நடுத்தர ஓலைகளுக்கு காப்பர் ஹைட்ராக்சைடு (2g/L) தெளிக்கவும்",
      ],
      biological: [
        "Apply Bacillus subtilis bio-fungicide to promote leaf microbiome resilience",
      ],
      biological_si: [
        "පත්‍ර ප්‍රතිශක්තිය වැඩි කිරීමට Bacillus subtilis ජෛව දිලීර නාශක යොදන්න",
      ],
      biological_ta: [
        "இலை நுண்ணுயிர் எதிர்ப்பை அதிகரிக்க பேசிலஸ் சப்டிலிஸ் பயன்படுத்தவும்",
      ],
      cultural: [
        "Remediate Potassium (K₂O) and Magnesium (MgO) soil deficits via targeted fertilization",
        "Prune and incinerate severely dried, diseased lower fronds to reduce inoculum load",
      ],
      cultural_si: [
        "පොටෑසියම් (K₂O) සහ මැග්නීසියම් (MgO) ඌනතා නිවැරදි කිරීමට පොහොර යොදන්න",
        "දැඩි ලෙස රෝගී වූ වියළි පහළ මට්ටු කපා පුළුස්සා දමන්න",
      ],
      cultural_ta: [
        "பொட்டாசியம் மற்றும் மெக்னீசியம் பற்றாக்குறையை உரமிடுதல் மூலம் சரிசெய்யவும்",
        "காய்ந்த பாதிக்கப்பட்ட கீழ் ஓலைகளை வெட்டி எரிக்கவும்",
      ]
    },
    vernacular_advice: "Frequently exacerbated by severe soil nutritional deficiencies, especially Potassium. Balanced NPK+Mg fertilizing is essential.",
    vernacular_advice_si: "විශේෂයෙන් පොටෑසියම් පෝෂක ඌනතාවය නිසා මෙම රෝගය උත්සන්න වේ. නිවැරදි පොහොර යෙදීම අත්‍යවශ්‍යයි.",
    vernacular_advice_ta: "பொட்டாசியம் ஊட்டச்சத்து குறைபாட்டினால் இந்நோய் தீவிரமடைகிறது. சீரான உரமிடுதல் அவசியம்.",
    severity_level: "medium",
    source: "CRI Advisory Circular No. 42",
  },
  {
    id: "kb_003",
    common_name: "Leaf Rot",
    common_name_si: "කොළ කුණු වීම",
    common_name_ta: "இலை அழுகல்",
    scientific_name: "Exserohilum rostratum / Colletotrichum gloeosporioides",
    symptoms: [
      "Water-soaked lesions on tips and margins of emerging tender leaflets",
      "Infected areas turn pitch black, shrivel, and break off in wind currents",
      "Distorted, ragged 'fan-shaped' appearance on maturing fronds",
      "Secondary opportunistic entry following Rhinoceros beetle wounding",
    ],
    symptoms_si: [
      "ළපටි පත්‍ර අග්‍රවල ජලයෙන් පෙඟුණු ස්වභාවයක් සහිත ලප ඇතිවීම",
      "ආසාදිත කොටස් කළු පැහැයට හැරී වේලී සුළඟට කැඩී යාම",
      "පත්‍ර පවන් හැඩැති විකෘති ස්වරූපයක් ගැනීම",
      "රයිනෝසිරස් කුරුමිණි හානි මඟින් දිලීරය ශාකයට ඇතුළු වීම",
    ],
    symptoms_ta: [
      "இளம் இலைகளின் நுனிகளில் நீர் ஊறிய புள்ளிகள் தோன்றுதல்",
      "பாதிக்கப்பட்ட பகுதிகள் கருப்பாகி, காய்ந்து காற்றில் உடைந்து விழுதல்",
      "முதிர்ந்த ஓலைகள் விசிறி போன்ற சிதைந்த தோற்றம் பெறுதல்",
      "வண்டு தாக்குதலுக்குப் பின் பூஞ்சை தொற்று ஏற்படுதல்",
    ],
    treatment_protocols: {
      chemical: [
        "Pour 1% Bordeaux mixture or Hexaconazole (2ml/L) directly into spindle axis",
        "Apply Mancozeb (3g/L) + Wettable Sulfur (2g/L) during active vegetative flushes",
      ],
      chemical_si: [
        "1% බෝඩෝ මිශ්‍රණය හෝ හෙක්සකොනසෝල් (ලීටරයකට මිලිලීටර් 2) කරටි අක්ෂයට වත් කරන්න",
        "මැන්කොසෙබ් (ලීටරයකට ග්‍රෑම් 3) සල්ෆර් සමඟ මිශ්‍ර කර යොදන්න",
      ],
      chemical_ta: [
        "1% போர்டோ கலவை அல்லது ஹெக்ஸாகோனசோல் (2ml/L) குருத்து அச்சில் ஊற்றவும்",
        "மேன்கோசெப் (3g/L) + கந்தகம் (2g/L) கலந்து தெளிக்கவும்",
      ],
      biological: [
        "Release Metarhizium anisopliae green muscardine fungus for Rhinoceros beetle suppression",
      ],
      biological_si: [
        "කුරුමිණි මර්දනය සඳහා මෙටාරයිසියම් (Metarhizium) දිලීරය භාවිත කරන්න",
      ],
      biological_ta: [
        "வண்டுகளைக் கட்டுப்படுத்த மெட்டாரைசியம் பூஞ்சையைப் பயன்படுத்தவும்",
      ],
      cultural: [
        "Clean crown frond axils of decaying organic debris where beetles breed",
        "Ensure spacing intervals > 26ft to facilitate air circulation",
      ],
      cultural_si: [
        "කුරුමිණියන් බෝවන කරටියේ රැඳී ඇති කුණු වූ ශාක කොටස් පිරිසිදු කරන්න",
        "හොඳ වාතාශ්‍රයක් සඳහා ගස් අතර පරතරය අඩි 26ට වඩා පවත්වා ගන්න",
      ],
      cultural_ta: [
        "வண்டுகள் இனப்பெருக்கம் செய்யும் கழிவுகளை கிரீடத்திலிருந்து அகற்றவும்",
        "நல்ல காற்றோட்டத்திற்கு மரங்களுக்கு இடையே 26 அடி இடைவெளியைப் பராமரிக்கவும்",
      ]
    },
    vernacular_advice: "Young palms (< 8 years) are highly susceptible. Protecting the central spear leaf from mechanical injury is paramount.",
    vernacular_advice_si: "අවුරුදු 8ට අඩු ළපටි ගස්වලට දැඩි අවදානමක් ඇත. ගොබ පත්‍රයට හානි සිදු වීම වළක්වා ගන්න.",
    vernacular_advice_ta: "8 வயதுக்குட்பட்ட இளம் மரங்கள் அதிகம் பாதிக்கப்படுகின்றன. குருத்து இலை சேதமடைவதைத் தடுக்கவும்.",
    severity_level: "high",
    source: "CRI Plant Pathology Division",
  },
  {
    id: "kb_004",
    common_name: "Stem Bleeding",
    common_name_si: "කඳෙන් ලේ වැගිරීම",
    common_name_ta: "தண்டு வடியல்",
    scientific_name: "Thielaviopsis paradoxa (Ceratocystis paradoxa)",
    symptoms: [
      "Dark reddish-brown to black viscous fluid oozing from trunk fissures",
      "Fluid dries into a dark encrustation with internal hollow cavitation",
      "Gradual yellowing, tapering of trunk diameter, and drastic nut reduction",
      "Extensive vascular discoloration visible upon trunk dissection",
    ],
    symptoms_si: [
      "කඳේ පැලුම් වලින් තද දුඹුරු පැහැති ඝන දියරයක් පිටවීම",
      "ශ්‍රාවය වේලී කළු පැහැති කබොලක් බවට පත්වී කඳ ඇතුළත කුහර ඇතිවීම",
      "කඳ සිහින් වීම, පත්‍ර කහ වීම සහ ගෙඩි අස්වැන්න ශීඝ්‍රයෙන් අඩුවීම",
      "කඳ ඇතුළත සනාල පටක දුර්වර්ණ වී විනාශ වීම",
    ],
    symptoms_ta: [
      "தண்டு வெடிப்புகளிலிருந்து அடர் சிவப்பு-பழுப்பு திரவம் வடிதல்",
      "திரவம் காய்ந்து கருப்பாகி தண்டினுள் பொந்து ஏற்படுதல்",
      "மரம் மெலிந்து, இலைகள் மஞ்சளாகி காய் உற்பத்தி பெருமளவில் குறைதல்",
      "தண்டின் உள்பகுதி நிறமாற்றமடைந்து திசுக்கள் அழிதல்",
    ],
    treatment_protocols: {
      chemical: [
        "Chisel out all discolored vascular wood until clean white trunk tissue is exposed",
        "Dress the wound with hot coal tar or concentrated 10% Bordeaux paste",
        "Apply 1% Bordeaux drench or Tridemorph root-feeding (5ml in 100ml water)",
      ],
      chemical_si: [
        "නිරෝගී සුදු පැහැති දැව මතුවන තෙක් රෝගී සියලු දැව කොටස් කටුවකින් හාරා ඉවත් කරන්න",
        "තුවාලය මත උණුසුම් තාර හෝ ඝන 10% බෝඩෝ පේස්ට් ආලේප කරන්න",
        "ට්‍රයිඩෙමෝෆ් (Tridemorph) මුල් මඟින් අවශෝෂණය කරවන්න (වතුර 100ml කට 5ml)",
      ],
      chemical_ta: [
        "வெள்ளை நிற திசு வரும் வரை பாதிக்கப்பட்ட மரப்பகுதியை உளியால் செதுக்கி எடுக்கவும்",
        "காயத்தின் மேல் நிலக்கரி தார் அல்லது 10% போர்டோ பசையை பூசவும்",
        "ட்ரைடெமார்ப் (100ml தண்ணீரில் 5ml) வேர் மூலம் செலுத்தவும்",
      ],
      biological: [
        "Apply Trichoderma harzianum paste onto treated trunk wounds",
      ],
      biological_si: [
        "ප්‍රතිකාර කළ තුවාලය මත ට්‍රයිකොඩර්මා (Trichoderma harzianum) ආලේප කරන්න",
      ],
      biological_ta: [
        "சிகிச்சை செய்யப்பட்ட காயத்தின் மேல் ட்ரைக்கோடெர்மா பசையைப் பூசவும்",
      ],
      cultural: [
        "Prevent mechanical damage by weeding machinery or livestock to base trunk",
        "Provide adequate organic mulching and prevent coastal waterlogging",
      ],
      cultural_si: [
        "වල් නෙළන යන්ත්‍ර හෝ සතුන් මඟින් ගසේ කඳට තුවාල වීම වළක්වන්න",
        "කාබනික වසුන් යොදා කඳ මුල ජලය රැඳීම වළක්වන්න",
      ],
      cultural_ta: [
        "இயந்திரங்கள் அல்லது கால்நடைகளால் மரத்தண்டில் காயம் ஏற்படுவதைத் தவிர்க்கவும்",
        "கரிம மூடாக்கு இட்டு நீர் தேங்குவதைத் தடுக்கவும்",
      ]
    },
    vernacular_advice: "Early detection prevents structural hollows in trunk. Never prune living roots near trunk base during active bleeding.",
    vernacular_advice_si: "කල්තියා හඳුනාගැනීමෙන් කඳේ කුහර ඇතිවීම වළක්වා ගත හැක. රෝගය පවතින විට කඳ මුල සජීවී මුල් කැපීමෙන් වළකින්න.",
    vernacular_advice_ta: "ஆரம்பத்திலேயே கண்டறிவது தண்டு பொந்தாவதைத் தடுக்கும். நோய் இருக்கும்போது வேர்களை வெட்டாதீர்கள்.",
    severity_level: "high",
    source: "CRI Advisory Circular No. 19",
  }
];

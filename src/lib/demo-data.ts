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
    label_si: "ගොබය කුණුවීම",
    label_ta: "குருத்து அழுகல்",
    color: "#FF4C4C", 
    bg: "rgba(255, 76, 76, 0.15)",
    description: "Fatal fungal disease (Phytophthora palmivora) attacking terminal bud.",
    description_si: "අග්‍රස්ථ අංකුරයට (ගොබයට) හානි කරන මාරාන්තික දිලීර රෝගයකි (Phytophthora palmivora).",
    description_ta: "முனைய குருத்தைத் தாக்கும் ஆபத்தான பூஞ்சை நோய் (Phytophthora palmivora)."
  },
  "gray leaf spot": { 
    label: "Gray Leaf Spot", 
    label_si: "කොළ අංගමාරය",
    label_ta: "சாம்பல் இலை புள்ளி",
    color: "#FF8C00", 
    bg: "rgba(255, 140, 0, 0.15)",
    description: "Foliar disease (Pestalotiopsis palmarum) with greyish-white necrotic spots.",
    description_si: "අළු-සුදු පැහැති පත්‍ර ලප සහ අංගමාරය ඇති කරන ආසාදනය (Pestalotiopsis palmarum).",
    description_ta: "சாம்பல்-வெள்ளை புள்ளிகளுடன் கூடிய இலை நோய் (Pestalotiopsis palmarum)."
  },
  "leaf rot": { 
    label: "Leaf Rot", 
    label_si: "කොළ කුණු වීම",
    label_ta: "இலை அழுகல்",
    color: "#E6AF2E", 
    bg: "rgba(230, 175, 46, 0.15)",
    description: "Fungal infection causing necrosis of younger fronds.",
    description_si: "ළපටි පොල් පිති කුණු වීමට ලක්වන දිලීර ආසාදනයකි.",
    description_ta: "இளம் ஓலைகளை அழுகச் செய்யும் பூஞ்சை தொற்று."
  },
  "bud root dropping": { 
    label: "Bud Root Dropping", 
    label_si: "කරය හැලීම",
    label_ta: "குருத்து வீழ்ச்சி",
    color: "#A78BFA", 
    bg: "rgba(167, 139, 250, 0.15)",
    description: "Critical advanced spindle collapse and drooping due to bud decay.",
    description_si: "කරටිය දිරාපත් වීම නිසා ඇතිවන දරුණු පිති කඩා වැටීම.",
    description_ta: "குருத்து அழுகலால் ஏற்படும் தீவிர ஓலை வீழ்ச்சி."
  },
  "stembleeding": { 
    label: "Stem Bleeding", 
    label_si: "කඳෙන් යුෂ ගැලීම",
    label_ta: "தண்டு வடியல்",
    color: "#F472B6", 
    bg: "rgba(244, 114, 182, 0.15)",
    description: "Vascular infection oozing dark reddish exudate from trunk.",
    description_si: "පොල් කඳෙන් තද දුඹුරු ශ්‍රාවයක් ගලා යන සනාල ආසාදනය (Ceratocystis paradoxa).",
    description_ta: "மரத் தண்டிலிருந்து கருஞ்சிவப்பு திரவம் வழியும் நாளத் தொற்று."
  },
  "undetected": {
    label: "Undetected / Non-Coconut",
    label_si: "හඳුනාගත නොහැක",
    label_ta: "அடையாளம் காணப்படவில்லை",
    color: "#64748B",
    bg: "rgba(100, 116, 139, 0.15)",
    description: "The input image lacks recognized coconut leaf or trunk botanical patterns.",
    description_si: "ලබාදුන් ඡායාරූපයේ පොල් පත්‍ර හෝ කඳ පිළිබඳ ලක්ෂණ අඩංගු නොවේ.",
    description_ta: "உள்ளீட்டுப் படத்தில் அங்கீகரிக்கப்பட்ட தென்னை இலை அல்லது தண்டு அமைப்புகள் இல்லை."
  }
};

export interface PreparationRecipe {
  title: string;
  title_si: string;
  title_ta: string;
  ingredients: string[];
  ingredients_si: string[];
  ingredients_ta: string[];
  preparation_steps: string[];
  preparation_steps_si: string[];
  preparation_steps_ta: string[];
  safety_precautions: string;
  safety_precautions_si: string;
  safety_precautions_ta: string;
}

export interface KnowledgeItem {
  id: string;
  common_name: string;
  common_name_si: string;
  common_name_ta: string;
  scientific_name: string;
  circular_no: string;
  susceptible_stage: string;
  susceptible_stage_si: string;
  susceptible_stage_ta: string;
  predisposing_factors: string[];
  predisposing_factors_si: string[];
  predisposing_factors_ta: string[];
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
  preventive_measures?: {
    measures: string[];
    measures_si: string[];
    measures_ta: string[];
  };
  recipes?: PreparationRecipe[];
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
    common_name_si: "ගොබය කුණුවීමේ රෝගය (අංකුර කුණු වීම)",
    common_name_ta: "குருத்து அழுகல்",
    scientific_name: "Phytophthora palmivora",
    circular_no: "Advisory Circular No. B 9",
    susceptible_stage: "Palms of age 3-45 years are particularly susceptible (especially young palms with clustered leaves or shaded by older palms)",
    susceptible_stage_si: "වයස අවුරුදු 3-45 අතර ගස් (විශේෂයෙන් පත්‍ර ළංව පිහිටි ළපටි ගස් හෝ වැඩිහිටි ගස්වල සෙවණට යට වූ පැළ) විශේෂයෙන් ගොදුරු වේ",
    susceptible_stage_ta: "3-45 வயதுடைய மரங்கள் (குறிப்பாக இளம் கன்றுகள் மற்றும் நிழலில் உள்ள மரங்கள்) அதிகம் பாதிக்கப்படுகின்றன",
    predisposing_factors: [
      "High atmospheric humidity favoring fungal spore growth and dispersal",
      "Young palms with clustered leaves or dense shade under older palms",
      "River banks and low-lying plantations subject to seasonal flooding",
      "Sporadic occurrence across wet and intermediate climatic zones in Sri Lanka"
    ],
    predisposing_factors_si: [
      "දිලීරයේ වර්ධනයට හා ව්‍යාප්තියට හිතකර අධික වායුගෝලීය ආර්ද්‍රතාවය",
      "පත්‍ර ළංව පිහිටි ළපටි ගස් සහ වැඩිහිටි ගස්වල සෙවණට යටවීම",
      "ගංවතුරට හෝ ජල ගැලීම්වලට ලක්වන ගංගා ඉවුරු සහ පහත් බිම්",
      "ශ්‍රී ලංකාවේ තෙත් සහ අතරමැදි කලාපවල සුළු වසංගත තත්ත්වයන් ලෙස වාර්තා වීම"
    ],
    predisposing_factors_ta: [
      "பூஞ்சை வளர்ச்சிக்கு சாதகமான அதிக ஈரப்பதம்",
      "நெருக்கமான ஓலைகள் மற்றும் நிழல் பாங்கான சூழல்",
      "வெள்ளப்பெருக்கு ஏற்படும் ஆற்றங்கரை மற்றும் தாழ்வான நிலங்கள்",
      "ஈர மற்றும் இடைநிலை வலயங்களில் பரவலாகக் காணப்படுதல்"
    ],
    symptoms: [
      "Initial symptom: Spear leaf loses its luster and withers gradually",
      "Wilting spreads successively to adjacent young fronds",
      "Discolored patches visible at the base of the spear leaf upon close examination",
      "Withered fronds turn brown and dry while lower fronds remain green and healthy",
      "Drying of inflorescence and immature nut fall occurs at this stage",
      "Advanced stage: Spear leaf can be pulled out effortlessly with a foul rotting odor",
      "Bud and adjacent fronds collapse, leaving only an empty trunk (palms beyond recovery once growing point is attacked)"
    ],
    symptoms_si: [
      "මූලික ලක්ෂණය: ගොබ පත්‍රයේ දීප්තිය නැතිවී මැලවී යාම",
      "මැලවීම ක්‍රමයෙන් යාබද ළපටි පත්‍ර කරා පැතිර යාම",
      "පරික්ෂා කිරීමේදී ගොබ පත්‍රයේ පාදමෙහි දුර්වර්ණ ලප දක්නට ලැබීම",
      "පහළ පිති කොළ පැහැයෙන් තිබියදී මැලවුණු පිති දුඹුරු වී වේලී යාම",
      "මල් පොකුරු (කරටි) වේලී යාම සහ නොමේරූ ගෙඩි හැලී යාම",
      "උත්සන්න අවස්ථාව: දැඩි දුගඳක් සමඟ ගොබ පත්‍රය ඉතා පහසුවෙන් ඇද ඉවත් කළ හැකි වීම",
      "ගොබය සහ යාබද පිති කඩා වැටී කඳ පමණක් ඉතිරි වීම (වර්ධක ලක්ෂ්‍යය විනාශ වූ පසු ගස සුව කළ නොහැක)"
    ],
    symptoms_ta: [
      "ஆரம்ப அறிகுறி: குருத்து ஓலை பளபளப்பை இழந்து வாடுதல்",
      "வாடல் அறிகுறி படிப்படியாக அடுத்தடுத்த ஓலைகளுக்கும் பரவுதல்",
      "குருத்து இலையின் அடிப்பகுதியில் நிறமாற்றமடைந்த புள்ளிகள் தோன்றுதல்",
      "கீழ் ஓலைகள் பச்சையாக இருக்க, மேல் ஓலைகள் பழுப்பாகி காய்ந்து போதல்",
      "பாளைகள் காய்ந்து இளம் காய்கள் உதிர்ந்து விழுதல்",
      "முதிர்ந்த நிலை: துர்நாற்றத்துடன் குருத்து ஓலையை எளிதாக இழுத்து எடுக்க முடிதல்",
      "குருத்து முறிந்து விழுந்து வெற்று தண்டு மட்டுமே எஞ்சுதல் (வளர்ச்சிப் புள்ளி பாதிக்கப்பட்டால் மரம் அழியும்)"
    ],
    treatment_protocols: {
      chemical: [
        "Early Detection: Thoroughly wet the bud region with Bordeaux mixture or 1% copper fungicide solution",
        "Older Bearing Palms: Wet the bud region with recommended copper fungicide to kill fungus while retaining bunches until nuts mature",
        "Preventive Treatment for Surrounding Palms: Thoroughly wet bud regions of healthy neighboring palms once every 2-3 weeks with Bordeaux mixture or 1% copper fungicide"
      ],
      chemical_si: [
        "කල්තියා හඳුනාගත් විට: ගොබ ප්‍රදේශය බෝඩෝ මිශ්‍රණයෙන් හෝ 1% කොපර් දිලීර නාශක ද්‍රාවණයකින් හොඳින් තෙමන්න",
        "ඵලදරන වැඩිහිටි ගස් සඳහා: ගෙඩි මේරෙන තෙක් තබා ගැනීමට දිලීරය විනාශ කිරීම පිණිස ගොබ ප්‍රදේශයට දිලීර නාශක යොදන්න",
        "අවට නිරෝගී ගස් ආරක්ෂා කිරීමට: සති 2-3කට වරක් නිරෝගී ගස්වල ගොබ ප්‍රදේශය බෝඩෝ මිශ්‍රණයෙන් හෝ 1% කොපර් දිලීර නාශකයෙන් තෙමන්න"
      ],
      chemical_ta: [
        "ஆரம்ப நிலையிலேயே கண்டறிந்தால்: குருத்துப் பகுதியை போர்டோ கலவை அல்லது 1% காப்பர் பூஞ்சைக் கொல்லி கரைசலால் நன்கு நனைக்கவும்",
        "காய் காய்க்கும் மரங்கள்: காய்கள் முதிரும் வரை காப்பாற்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக் கொல்லியை தெளிக்கவும்",
        "சுற்றியுள்ள மரங்களுக்கு தடுப்பு முறை: 2-3 வாரங்களுக்கு ஒருமுறை அருகிலுள்ள ஆரோக்கியமான மரங்களின் குருத்துகளில் மருந்து தெளிக்கவும்"
      ],
      biological: [
        "Apply Trichoderma-enriched compost to root zones to boost natural systemic resistance"
      ],
      biological_si: [
        "ස්වභාවික ප්‍රතිශක්තිය වර්ධනය සඳහා මුල් කලාපයට ට්‍රයිකොඩර්මා මිශ්‍ර කොම්පෝස්ට් යොදන්න"
      ],
      biological_ta: [
        "மரத்தின் எதிர்ப்பு சக்தியை அதிகரிக்க வேர் பகுதியில் ட்ரைக்கோடெர்மா கலந்த உரம் இடவும்"
      ],
      cultural: [
        "Advanced Stage: Cut down the palm crown and burn it completely to incinerate all fungal spores",
        "Provide effective surface drainage in flood-prone lands to prevent root waterlogging and excessive humidity",
        "Thin out excessive shading over young palms"
      ],
      cultural_si: [
        "උත්සන්න අවස්ථාවේදී: දිලීර බීජාණු විනාශ කිරීම සඳහා ගසේ කරටිය කපා සම්පූර්ණයෙන්ම පුළුස්සා දමන්න",
        "ජල ගැලීම් ඇතිවන පහත් බිම්වල ජලය බැසයාමට විධිමත් කාණු පද්ධති සකස් කරන්න",
        "පැළ මතට අධික සෙවණ වැටීම අවම කරන්න"
      ],
      cultural_ta: [
        "முற்றிய நிலை: பூஞ்சை பரவுவதைத் தடுக்க பாதிக்கப்பட்ட மரத்தின் கிரீடத்தை வெட்டி எரிக்கவும்",
        "நீர் தேங்குவதைத் தவிர்க்க முறையான வடிகால் அமைப்பை ஏற்படுத்தவும்",
        "இளம் கன்றுகளுக்கு அதிகப்படியான நிழல் விழுவதைத் தவிர்க்கவும்"
      ]
    },
    preventive_measures: {
      measures: [
        "Fungicidal Bag Deployment: Convenient protection lasting 4-6 months during dry weather",
        "1. Take a 15 cm square piece of jute hessian or gunny bag",
        "2. Place a handful of coir dust inside and tie it securely to make a small bag",
        "3. Soak the bag overnight in 1% copper fungicide solution",
        "4. Dry the bag for a few hours the following morning",
        "5. Place one bag in the axil of the youngest leaf",
        "6. Inspect monthly and shift to the base of the newly emerged spear leaf (re-dip more often if heavy rains persist)"
      ],
      measures_si: [
        "දිලීර නාශක ගෝනි මල්ල (Fungicidal Bag) ක්‍රමය: වියළි කාලගුණයේදී මාස 4-6ක් ආරක්ෂාව සපයයි",
        "1. සෙන්ටිමීටර 15ක් පළල ගෝනි හෝ ජූට් රෙදි කැබැල්ලක් ගන්න",
        "2. එයට කොහුබත් මිටක් දමා කුඩා මල්ලක් සේ ගැටගසන්න",
        "3. මෙම මල්ල 1% කොපර් දිලීර නාශක ද්‍රාවණයක මුළු රැයක් ගිල්වා තබන්න",
        "4. පසුදා උදෑසන පැය කිහිපයක් වියළා ගන්න",
        "5. ළපටිම පත්‍රයේ කිහිල්ලේ (axil) එක් මල්ලක් තැන්පත් කරන්න",
        "6. මසකට වරක් පරීක්ෂා කර අලුතින් මතුවන ගොබ පත්‍රයේ පාදමට මාරු කරන්න (අධික වැසි සහිත විට නිතර ද්‍රාවණයේ ගිල්වන්න)"
      ],
      measures_ta: [
        "பூஞ்சைக் கொல்லி பை முறை: உலர் காலநிலையில் 4-6 மாதங்கள் வரை பாதுகாப்பளிக்கும்",
        "1. 15 செ.மீ அளவுள்ள சாக்கு அல்லது சணல் துணியை எடுக்கவும்",
        "2. ஒரு கைப்பிடி தென்னை நார் தூள் வைத்து சிறிய பையாக கட்டவும்",
        "3. 1% காப்பர் பூஞ்சைக் கொல்லி கரைசலில் இரவு முழுவதும் ஊறவைக்கவும்",
        "4. மறுநாள் காலையில் சில மணி நேரம் உலர்த்தவும்",
        "5. இளம் ஓலையின் இடுக்கில் ஒரு பையை வைக்கவும்",
        "6. மாதந்தோறும் கவனித்து புதிய குருத்தின் அடிப்பகுதிக்கு மாற்றவும்"
      ]
    },
    recipes: [
      {
        title: "CRI Official Bordeaux Mixture (25 Litres)",
        title_si: "CRI නිල බෝඩෝ මිශ්‍රණය පිළියෙල කිරීම (ලීටර් 25)",
        title_ta: "CRI அதிகாரப்பூர்வ போர்டோ கலவை தயாரிப்பு (25 லிட்டர்)",
        ingredients: [
          "Copper Sulphate (Blue Vitriol): 200 g",
          "Quick Lime (Calcium Oxide): 200 g",
          "Water: 25 Litres"
        ],
        ingredients_si: [
          "කොපර් සල්ෆේට් (මයිලමාණික්කම්): ග්‍රෑම් 200",
          "හුණු (Quick Lime): ග්‍රෑම් 200",
          "ජලය: ලීටර් 25"
        ],
        ingredients_ta: [
          "மயில் துத்தம் (காப்பர் சல்பேட்): 200 கிராம்",
          "சுண்ணாம்பு: 200 கிராம்",
          "தண்ணீர்: 25 லிட்டர்"
        ],
        preparation_steps: [
          "Use only earthenware vessels or plastic containers (never use metal vessels)",
          "Dissolve 200 g copper sulphate overnight in 5 litres of water (suspend in a cloth bag to facilitate dissolving)",
          "Suspend 200 g lime separately in 20 litres of water and strain through a fine cloth",
          "Add copper sulphate solution slowly into the lime suspension while stirring vigorously",
          "Use immediately after preparation"
        ],
        preparation_steps_si: [
          "මැටි බඳුන් හෝ ප්ලාස්ටික් බඳුන් පමණක් භාවිතා කරන්න (ලෝහ බඳුන් කිසිවිටෙකත් භාවිතා නොකරන්න)",
          "කොපර් සල්ෆේට් ග්‍රෑම් 200ක් රෙදි මල්ලක දමා ජලය ලීටර් 5ක මුළු රැයක් දියවීමට තබන්න",
          "හුණු ග්‍රෑම් 200ක් ජලය ලීටර් 20ක වෙනම දියකර සියුම් රෙදි කඩකින් පෙරා ගන්න",
          "හුණු ද්‍රාවණය වේගයෙන් කලතමින් එයට කොපර් සල්ෆේට් ද්‍රාවණය සෙමින් එකතු කරන්න",
          "පිළියෙල කළ වහාම ක්ෂේත්‍රයේ භාවිතයට ගන්න"
        ],
        preparation_steps_ta: [
          "மண்பாண்டங்கள் அல்லது பிளாஸ்டிக் பாத்திரங்களை மட்டுமே பயன்படுத்தவும்",
          "200 கிராம் காப்பர் சல்பேட்டை 5 லிட்டர் தண்ணீரில் இரவு முழுவதும் கரைக்கவும்",
          "200 கிராம் சுண்ணாம்பை 20 லிட்டர் தண்ணீரில் கரைத்து மெல்லிய துணியால் வடிகட்டவும்",
          "சுண்ணாம்பு கரைசலை நன்கு கலக்கிக்கொண்டே காப்பர் சல்பேட் கரைசலை மெதுவாக சேர்க்கவும்",
          "தயாரித்த உடனே பயன்படுத்தவும்"
        ],
        safety_precautions: "Both Bordeaux mixture and Copper fungicides are toxic chemicals and must be handled with protective care.",
        safety_precautions_si: "බෝඩෝ මිශ්‍රණය සහ කොපර් දිලීර නාශක විෂ සහිත බැවින් ප්‍රවේශමෙන් පරිහරණය කරන්න.",
        safety_precautions_ta: "போர்டோ கலவை மற்றும் காப்பர் பூஞ்சைக் கொல்லிகள் நச்சுத்தன்மை வாய்ந்தவை, கவனமாக கையாளவும்."
      }
    ],
    vernacular_advice: "Once the terminal growing point is destroyed, the palm is beyond recovery. Early detection of spear leaf withering and prophylactic fungicidal bags on surrounding palms are vital.",
    vernacular_advice_si: "වර්ධක ලක්ෂ්‍යයට හානි වූ පසු ගස බේරාගත නොහැක. ගොබ පත්‍රයේ දීප්තිය අඩු වන විටම හඳුනාගෙන අවට ගස්වලට දිලීර නාශක මලු යෙදීම අත්‍යවශ්‍යයි.",
    vernacular_advice_ta: "வளர்ச்சிப் புள்ளி தாக்கப்பட்டால் மரம் அழியும். ஆரம்ப நிலையிலேயே கண்டறிந்து சுற்றியுள்ள மரங்களுக்கு பூஞ்சைக்கொல்லி பை வைப்பது மிக முக்கியம்.",
    severity_level: "critical",
    source: "Coconut Research Institute of Sri Lanka (Advisory Circular No. B 9)"
  },
  {
    id: "kb_002",
    common_name: "Gray Leaf Spot",
    common_name_si: "කොළ අංගමාරය / අළු පැහැති පත්‍ර ලප රෝගය (Leaf Blight)",
    common_name_ta: "சாம்பல் இலை புள்ளி / இலை கருகல் நோய் (Leaf Blight)",
    scientific_name: "Pestalozzia palmarum & Bipolaris incurvata (Drechslera incurvata / Helminthosporium incurvatum)",
    circular_no: "Advisory Circular No. B 11",
    susceptible_stage: "Seedlings and young palms are very susceptible; common in neglected or nutrient-weak palms across all coconut growing areas",
    susceptible_stage_si: "පැළ සහ ළපටි ගස් ඉතා සංවේදීය; නිසි නඩත්තුවක් හෝ පොහොර නොයෙදූ දුර්වල ගස්වල බහුලව දක්නට ලැබේ",
    susceptible_stage_ta: "நாற்றுகள் மற்றும் இளம் கன்றுகள் அதிகம் பாதிக்கப்படுகின்றன; பராமரிக்கப்படாத மரங்களில் பரவலாகக் காணப்படும்",
    predisposing_factors: [
      "Neglected, unfertilized plantations and nutrient-deficient soils",
      "Prolonged dry weather spells",
      "Excessive nitrogen application without balanced potassium",
      "Poor soil drainage and seasonal waterlogging"
    ],
    predisposing_factors_si: [
      "පොහොර නොයෙදූ, නොසලකා හරින ලද වතු සහ පෝෂණ ඌනතා සහිත පස්",
      "දීර්ඝ වියළි කාලගුණික තත්ත්වයන්",
      "පොටෑසියම් සමතුලිතතාවයකින් තොරව නයිට්‍රජන් පමණක් අධිකව යෙදීම",
      "දුර්වල ජලාපවහනය සහ ජලය රැඳී පැවතීම"
    ],
    predisposing_factors_ta: [
      "சரியான உரமிடாத பலவீனமான மரங்கள் மற்றும் நிலங்கள்",
      "நீண்ட வறண்ட காலநிலை",
      "அதிகப்படியான தழைச்சத்து (நைட்ரஜன்) பயன்பாடு",
      "வடிகால் வசதியின்மை மற்றும் நீர் தேங்குதல்"
    ],
    symptoms: [
      "Early stage: Tiny yellowish-brown spots appear on leaflets (predominantly on lower fronds)",
      "Spots gradually enlarge and turn grey in the center with dark brown peripheral borders",
      "As disease advances, patches coalesce to form large brown dead areas, making leaflets appear completely dried",
      "In seedlings and young palms, severe outbreaks damage foliage and cause severe growth setbacks",
      "Older bearing palms show lower canopy drying but mortality is rare unless completely neglected"
    ],
    symptoms_si: [
      "මුල් අවධිය: පත්‍රිකා මත කුඩා කහ-දුඹුරු ලප හටගැනීම (ප්‍රධාන වශයෙන් පහළ පිතිවල)",
      "ලප ක්‍රමයෙන් විශාල වී මැද අළු පැහැයට හැරෙන අතර දාරය තද දුඹුරු පැහැ වේ",
      "රෝගය උත්සන්න වන විට ලප එකිනෙක එක්වී විශාල දුඹුරු වියළි ප්‍රදේශ සෑදී මුළු පිත්තම වේලී යයි",
      "තවාන් පැළ සහ ළපටි ගස්වල පත්‍ර විනාශ වී වර්ධනය මුළුමනින්ම අඩාල වේ",
      "වැඩිහිටි ගස්වල මරණය සිදු නොවුවද අස්වැන්න සහ ප්‍රභාසංස්ලේෂණය පහත වැටේ"
    ],
    symptoms_ta: [
      "ஆரம்ப நிலை: கீழ் ஓலைகளின் சிற்றிலைகளில் சிறிய மஞ்சள்-பழுப்பு புள்ளிகள் தோன்றுதல்",
      "புள்ளிகள் விரிவடைந்து மையத்தில் சாம்பல் நிறமாகவும், ஓரத்தில் கரும்பழுப்பாகவும் மாறுதல்",
      "புள்ளிகள் இணைந்து பெரிய காய்ந்த திட்டுகளாகி ஓலைகள் முழுமையாக காய்ந்து போதல்",
      "இளம் கன்றுகளில் வளர்ச்சி கடுமையாக பாதிக்கப்படுதல்",
      "பழைய மரங்களில் கீழ் ஓலைகள் காய்ந்து உதிர்தல்"
    ],
    treatment_protocols: {
      chemical: [
        "Rare necessity: If disease continues to spread despite balanced fertilization, apply Bordeaux mixture or any commercial copper fungicide as directed by the manufacturer",
        "Spray foliage thoroughly covering both upper and lower surfaces of infected fronds"
      ],
      chemical_si: [
        "කලාතුරකින් අවශ්‍ය වේ: පොහොර යෙදීමෙන් පසුවත් රෝගය පැතිරේ නම් පමණක් බෝඩෝ මිශ්‍රණය හෝ වෙළඳපොලේ ඇති කොපර් දිලීර නාශකයක් ඉසින්න",
        "ආසාදිත පත්‍රවල උඩ සහ යට දෙපැත්තම හොඳින් තෙමෙන සේ ඉසින්න"
      ],
      chemical_ta: [
        "உரமிட்ட பிறகும் நோய் பரவினால் மட்டுமே போர்டோ கலவை அல்லது காப்பர் பூஞ்சைக் கொல்லியை தெளிக்கவும்",
        "ஓலைகளின் மேல் மற்றும் கீழ் பக்கங்களில் நன்கு படும்படி தெளிக்கவும்"
      ],
      biological: [
        "Incorporate organic compost to enhance soil microbial antagonists and plant vigor"
      ],
      biological_si: [
        "පසෙහි ක්ෂුද්‍රජීවී සක්‍රියතාවය සහ ශාක ශක්තිය වැඩි කිරීමට කාබනික කොම්පෝස්ට් යොදන්න"
      ],
      biological_ta: [
        "மண்ணின் ஆரோக்கியத்தை மேம்படுத்த இயற்கை உரங்களை இடவும்"
      ],
      cultural: [
        "Primary Control: Ensure normal CRI fertilizer schedule is carried out without delay",
        "Targeted Potassium Remediation: In fertilized lands where blight appears, apply an additional dose of Muriate of Potash (60% K₂O) or Kitchen Ash at 6-monthly intervals when soil is wet until fresh symptoms cease",
        "Dose for Seedlings/Young palms: 250 g Muriate of Potash OR 5 kg Kitchen Ash per palm",
        "Dose for Adult palms: 500 g Muriate of Potash OR 10 kg Kitchen Ash per palm",
        "Avoid excessive nitrogen applications and improve drainage to avoid waterlogging"
      ],
      cultural_si: [
        "ප්‍රධාන පාලන ක්‍රමය: නියමිත කාලයට පොල් පර්යේෂණ ආයතනයේ පොහොර නිර්දේශය යෙදීම තහවුරු කරන්න",
        "අතිරේක පොටෑසියම් යෙදීම: රෝගය පවතින විට තෙතමනය ඇති අවස්ථාවලදී මාස 6කට වරක් නව ලක්ෂණ මතුවීම නතර වන තුරු පහත මාත්‍රාවලින් මියුරියේට් ඔෆ් පොටෑෂ් (MOP) හෝ ළිප් අළු යොදන්න",
        "පැළ/ළපටි ගස් සඳහා: ගසකට MOP ග්‍රෑම් 250ක් හෝ ළිප් අළු කිලෝග්‍රෑම් 5ක්",
        "වැඩිහිටි ගස් සඳහා: ගසකට MOP ග්‍රෑම් 500ක් හෝ ළිප් අළු කිලෝග්‍රෑම් 10ක්",
        "නයිට්‍රජන් පමණක් වැඩිපුර යෙදීමෙන් වළකින්න, වගාබිමේ ජලය රැඳීම වළක්වන්න"
      ],
      cultural_ta: [
        "முக்கிய கட்டுப்பாடு: வழக்கமான உர அட்டவணையை தவறாமல் பின்பற்றவும்",
        "பொட்டாசியம் சிகிச்சை: நோய் அறிகுறி மறையும் வரை 6 மாதங்களுக்கு ஒருமுறை ஈரமான மண்ணில் பொட்டாஷ் உரம் அல்லது அடுப்புச் சாம்பல் இடவும்",
        "இளம் கன்றுகளுக்கு: 250 கிராம் பொட்டாஷ் அல்லது 5 கிலோ சாம்பல்",
        "முதிர்ந்த மரங்களுக்கு: 500 கிராம் பொட்டாஷ் அல்லது 10 கிலோ சாம்பல்",
        "அதிக நைட்ரஜனைத் தவிர்த்து வடிகால் வசதியை சீரமைக்கவும்"
      ]
    },
    recipes: [
      {
        title: "CRI Official Bordeaux Mixture (25 Litres)",
        title_si: "CRI නිල බෝඩෝ මිශ්‍රණය පිළියෙල කිරීම (ලීටර් 25)",
        title_ta: "CRI அதிகாரப்பூர்வ போர்டோ கலவை தயாரிப்பு (25 லிட்டர்)",
        ingredients: [
          "Copper Sulphate: 200 g",
          "Quick Lime: 200 g",
          "Water: 25 Litres"
        ],
        ingredients_si: [
          "කොපර් සල්ෆේට්: ග්‍රෑම් 200",
          "හුණු: ග්‍රෑම් 200",
          "ජලය: ලීටර් 25"
        ],
        ingredients_ta: [
          "காப்பர் சல்பேட்: 200 கிராம்",
          "சுண்ணாம்பு: 200 கிராம்",
          "தண்ணீர்: 25 லிட்டர்"
        ],
        preparation_steps: [
          "Use earthenware or plastic vessels (never metal)",
          "Dissolve 200 g copper sulphate overnight in 5 L water",
          "Suspend 200 g quick lime in 20 L water and strain through fine cloth",
          "Add copper sulphate solution slowly into lime while stirring vigorously",
          "Use immediately after preparation"
        ],
        preparation_steps_si: [
          "මැටි හෝ ප්ලාස්ටික් බඳුන් භාවිතා කරන්න",
          "කොපර් සල්ෆේට් ග්‍රෑම් 200ක් ජලය ලීටර් 5ක දියකරන්න",
          "හුණු ග්‍රෑම් 200ක් ජලය ලීටර් 20ක දියකර පෙරා ගන්න",
          "හුණු ද්‍රාවණයට කොපර් සල්ෆේට් ද්‍රාවණය එකතු කර කලතන්න",
          "පිළියෙල කළ වහාම භාවිතා කරන්න"
        ],
        preparation_steps_ta: [
          "மண்பாண்டங்களை பயன்படுத்தவும்",
          "200 கிராம் காப்பர் சல்பேட்டை 5 லிட்டர் நீரில் கரைக்கவும்",
          "200 கிராம் சுண்ணாம்பை 20 லிட்டர் நீரில் கரைத்து வடிகட்டவும்",
          "சுண்ணாம்பு கரைசலுடன் காப்பர் சல்பேட்டை சேர்த்து கலக்கவும்",
          "உடனே பயன்படுத்தவும்"
        ],
        safety_precautions: "Handle copper fungicides and Bordeaux mixture with care using gloves and face protection.",
        safety_precautions_si: "දිලීර නාශක භාවිතයේදී අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න.",
        safety_precautions_ta: "பூஞ்சைக் கொல்லிகளை கையாளும்போது பாதுகாப்பு கவசங்களை அணியவும்."
      }
    ],
    vernacular_advice: "Leaf blight is primarily an indicator of weak or neglected palm nutrition. In most cases, applying MOP (Potash) or Kitchen Ash at 6-month intervals cures the condition without needing chemical fungicides.",
    vernacular_advice_si: "කොළ අංගමාරය බොහෝවිට ගසේ පෝෂණ ඌනතාවය පෙන්නුම් කරන ලක්ෂණයකි. බොහෝවිට දිලීර නාශක නොමැතිව නියමිත පරිදි MOP හෝ ළිප් අළු යෙදීමෙන් රෝගය සුව කරගත හැක.",
    vernacular_advice_ta: "இலை கருகல் நோய் ஊட்டச்சத்து குறைபாட்டின் அறிகுறியாகும். பொட்டாஷ் உரம் அல்லது சாம்பல் இடுவதன் மூலமே இதை எளிதாகக் குணப்படுத்தலாம்.",
    severity_level: "medium",
    source: "Coconut Research Institute of Sri Lanka (Advisory Circular No. B 11)"
  },
  {
    id: "kb_003",
    common_name: "Leaf Rot",
    common_name_si: "කොළ කුණුවීමේ රෝගය",
    common_name_ta: "இலை அழுகல்",
    scientific_name: "Exserohilum rostratum / Colletotrichum gloeosporioides",
    circular_no: "Advisory Circular No. B 12",
    susceptible_stage: "Young palms under 8 years and central spear leaves damaged by pests",
    susceptible_stage_si: "අවුරුදු 8ට අඩු ළපටි ගස් සහ කෘමි හානි සිදුවූ ගොබ පත්‍ර",
    susceptible_stage_ta: "8 வயதுக்குட்பட்ட இளம் மரங்கள் மற்றும் பூச்சி தாக்கிய குருத்துகள்",
    predisposing_factors: [
      "Secondary opportunistic infection following Rhinoceros beetle or Red Palm Weevil injury",
      "High canopy density hindering air circulation",
      "Prolonged wet weather"
    ],
    predisposing_factors_si: [
      "රයිනෝසිරස් කුරුමිණි හානි මඟින් ඇතිවන තුවාල තුළින් දිලීරය ඇතුළුවීම",
      "වාතාශ්‍රය අඩු ඝන වියන්",
      "දීර්ඝ තෙත් කාලගුණය"
    ],
    predisposing_factors_ta: [
      "வண்டு தாக்குதலால் ஏற்படும் காயங்கள்",
      "காற்றோட்டமற்ற நெருக்கமான தோப்பு",
      "தொடர் மழை"
    ],
    symptoms: [
      "Water-soaked lesions on tips and margins of emerging tender leaflets",
      "Infected areas turn pitch black, shrivel, and break off in wind currents",
      "Distorted, ragged 'fan-shaped' appearance on maturing fronds",
      "Secondary opportunistic entry following Rhinoceros beetle wounding"
    ],
    symptoms_si: [
      "ළපටි පත්‍ර අග්‍රවල ජලයෙන් පෙඟුණු ස්වභාවයක් සහිත ලප ඇතිවීම",
      "ආසාදිත කොටස් කළු පැහැයට හැරී වේලී සුළඟට කැඩී යාම",
      "පත්‍ර පවන් හැඩැති විකෘති ස්වරූපයක් ගැනීම",
      "රයිනෝසිරස් කුරුමිණි හානි මඟින් දිලීරය ශාකයට ඇතුළු වීම"
    ],
    symptoms_ta: [
      "இளம் இலைகளின் நுனிகளில் நீர் ஊறிய புள்ளிகள் தோன்றுதல்",
      "பாதிக்கப்பட்ட பகுதிகள் கருப்பாகி, காய்ந்து காற்றில் உடைந்து விழுதல்",
      "முதிர்ந்த ஓலைகள் விசிறி போன்ற சிதைந்த தோற்றம் பெறுதல்",
      "வண்டு தாக்குதலுக்குப் பின் பூஞ்சை தொற்று ஏற்படுதல்"
    ],
    treatment_protocols: {
      chemical: [
        "Pour 1% Bordeaux mixture into the spindle axil",
        "Apply Mancozeb (3g/L) to affected young leaves during active flush"
      ],
      chemical_si: [
        "1% බෝඩෝ මිශ්‍රණය කරටි අක්ෂයට වත් කරන්න",
        "මැන්කොසෙබ් (ලීටරයකට ග්‍රෑම් 3) ආසාදිත ළපටි පත්‍රවලට යොදන්න"
      ],
      chemical_ta: [
        "1% போர்டோ கலவையை குருத்தில் ஊற்றவும்",
        "மேன்கோசெப் (3g/L) மருந்தைத் தெளிக்கவும்"
      ],
      biological: [
        "Release Metarhizium anisopliae green muscardine fungus for Rhinoceros beetle biological suppression"
      ],
      biological_si: [
        "කුරුමිණි මර්දනය සඳහා මෙටාරයිසියම් (Metarhizium) දිලීරය භාවිත කරන්න"
      ],
      biological_ta: [
        "வண்டுகளைக் கட்டுப்படுத்த மெட்டாரைசியம் பூஞ்சையைப் பயன்படுத்தவும்"
      ],
      cultural: [
        "Clean crown frond axils of decaying organic debris where beetles breed",
        "Ensure spacing intervals > 26ft to facilitate air circulation"
      ],
      cultural_si: [
        "කුරුමිණියන් බෝවන කරටියේ රැඳී ඇති කුණු වූ ශාක කොටස් පිරිසිදු කරන්න",
        "හොඳ වාතාශ්‍රයක් සඳහා ගස් අතර පරතරය අඩි 26ට වඩා පවත්වා ගන්න"
      ],
      cultural_ta: [
        "வண்டுகள் இனப்பெருக்கம் செய்யும் கழிவுகளை அகற்றவும்",
        "மரங்களுக்கு இடையே போதிய இடைவெளியைப் பராமரிக்கவும்"
      ]
    },
    vernacular_advice: "Young palms (< 8 years) are highly susceptible. Protecting the central spear leaf from mechanical injury is paramount.",
    vernacular_advice_si: "අවුරුදු 8ට අඩු ළපටි ගස්වලට දැඩි අවදානමක් ඇත. ගොබ පත්‍රයට හානි සිදු වීම වළක්වා ගන්න.",
    vernacular_advice_ta: "8 வயதுக்குட்பட்ட இளம் மரங்கள் அதிகம் பாதிக்கப்படுகின்றன. குருத்து இலை சேதமடைவதைத் தடுக்கவும்.",
    severity_level: "high",
    source: "CRI Plant Pathology Division"
  },
  {
    id: "kb_004",
    common_name: "Stem Bleeding",
    common_name_si: "කඳෙන් යුෂ ගැලීමේ රෝගය (Stem Bleeding)",
    common_name_ta: "தண்டு வடியல் நோய் (Stem Bleeding)",
    scientific_name: "Ceratocystis paradoxa (Thielaviopsis paradoxa)",
    circular_no: "Advisory Circular No. B 10",
    susceptible_stage: "Palms of all ages; young palms with rapidly expanding trunk bases are especially prone due to bark cracking",
    susceptible_stage_si: "සියලු වයස්වල ගස්; කඳ පාදම වේගයෙන් මහත් වන ළපටි ගස්වල පොත්ත පැලීම නිසා වඩාත් ගොදුරු වේ",
    susceptible_stage_ta: "அனைத்து வயது மரங்கள்; வேகமாக வளரும் இளம் மரங்களின் பட்டை வெடிப்பதால் அதிகம் பாதிக்கப்படுகின்றன",
    predisposing_factors: [
      "Infection by Ceratocystis paradoxa through bark cracks or growth fissures",
      "Rapid trunk base expansion causing longitudinal cracking",
      "Severe flooding, waterlogging, or frequently fluctuating water table",
      "High overdose of inorganic fertilizers causing soft bark expansion",
      "Lightning strikes (cluster of palms with broken fronds) or fire damage (charred ash present)",
      "Red Palm Weevil infestation (identifiable by cocoons, circular trunk boreholes, and chewed fiber)",
      "Basal stem bleeding caused by Ganoderma bracket fungus (rare in Sri Lanka; shows bracket-shaped fruiting bodies at base)"
    ],
    predisposing_factors_si: [
      "පොත්තේ පැලුම් තුළින් Ceratocystis paradoxa දිලීරය ඇතුළුවීම",
      "කඳ පාදම සීඝ්‍රයෙන් මහත් වීම නිසා පොත්තෙහි පැලුම් ඇතිවීම",
      "ගංවතුර, ජලය රැඳීම හෝ භූගත ජල මට්ටමේ නිරන්තර උච්චාවචනයන්",
      "රසායනික පොහොර අධික මාත්‍රාවලින් යෙදීම නිසා පොත්ත ඉරිතලා යාම",
      "අකුණු සැර වැදීම් (ගස් කිහිපයක පිති එකවර කැඩී යාම) හෝ ගිනි හානි (අළු සහ දැලි පැවතීම)",
      "රතු කුරුමිණි හානිය (කඳෙහි සිදුරු, කෝෂ සහ කෙඳි පිටතට පැමිණීම)",
      "ගැනෝඩර්මා (Ganoderma) දිලීරය නිසා පාදමෙන් යුෂ ගැලීම (කඳ පාදමේ බිම්මල් වැනි කොටස් හටගැනීම)"
    ],
    predisposing_factors_ta: [
      "பட்டை வெடிப்புகள் வழியாக பூஞ்சை தொற்று ஏற்படுதல்",
      "தண்டு வேகமாக பருப்பதால் ஏற்படும் வெடிப்புகள்",
      "வெள்ளப்பெருக்கு மற்றும் நீர் தேங்குதல்",
      "அதிகப்படியான இரசாயன உரப் பயன்பாடு",
      "மின்னல் அல்லது தீ விபத்து பாதிப்புகள்",
      "சிவப்பு கூன்வண்டு தாக்குதல் (துளைகள் மற்றும் கூடுகள்)",
      "கானோடெர்மா பூஞ்சை தொற்று"
    ],
    symptoms: [
      "Primary symptom: Oozing of reddish-brown, rust-colored liquid from longitudinal cracks on trunk bark",
      "Bleeding points turn dark brown and eventually dry into black encrusted patches",
      "Tissues beneath the bleeding spot turn yellow and decay into a brown fibrous rotting mass",
      "Adjacent bleeding spots coalesce beneath the bark to form large internal decayed cavities",
      "Advanced stage: Progressive hollow cavitation weakens trunk structural strength and reduces yields drastically"
    ],
    symptoms_si: [
      "ප්‍රධාන ලක්ෂණය: කඳේ ඇතිවන දිගටි පැලුම් වලින් රතු-දුඹුරු පැහැති (මලකඩ පැහැති) දියරයක් පිටතට ගලා ඒම",
      "යුෂ ගලන ස්ථාන පසුව කළු පැහැයට හැරී වේලී කළු පැල්ලම් බවට පත්වීම",
      "යුෂ ගලන ස්ථානයට යටින් ඇති පටක කහ පැහැයට හැරී දුඹුරු පැහැති කෙඳි සහිත කුණු වූ ස්කන්ධයක් බවට පත්වීම",
      "පොත්ත යටින් යාබද ආසාදිත ස්ථාන එකිනෙක එක්වී විශාල දිරාපත් වූ කුහර සෑදීම",
      "උත්සන්න අවස්ථාව: කඳ ඇතුළත කුහර හටගැනීම නිසා කඳ දුර්වල වී අස්වැන්න පහත වැටීම"
    ],
    symptoms_ta: [
      "முக்கிய அறிகுறி: தண்டு வெடிப்புகளிலிருந்து துரு போன்ற சிவப்பு-பழுப்பு திரவம் வடிதல்",
      "திரவம் வடிந்த இடங்கள் காய்ந்து கருப்பு திட்டுகளாக மாறுதல்",
      "பட்டையின் கீழ் உள்ள திசுக்கள் மஞ்சளாகி, அழுகிய பழுப்பு நார்ப்பொருளாக மாறுதல்",
      "உட்பகுதியில் திசுக்கள் அழிந்து பெரிய பொந்துகள் ஏற்படுதல்",
      "முற்றிய நிலை: மரத்தின் உறுதித்தன்மை குறைந்து விளைச்சல் வீழ்ச்சியடைதல்"
    ],
    treatment_protocols: {
      chemical: [
        "Surgical Chiseling: Early identification makes management easy. Affected decayed tissues should be chiseled out with a little healthy tissue",
        "Wound Dressing: Treat the excised wound immediately with concentrated Bordeaux paste, Bordeaux mixture, or 1% copper fungicide solution",
        "Waterproofing & Termite Prevention: After a few weeks of application, once bleeding has completely stopped, dress the wound with coal tar to prevent termite damage and water ingress",
        "Lightning Damage Protocol: Cut an oblique hole into the trunk to drain fluid; seal later with cement-sand mixture",
        "Red Weevil Protocol: Inject Monocrotophos / recommended systemic insecticide directly into trunk if red weevil larvae are present inside"
      ],
      chemical_si: [
        "ශල්‍යකර්ම ප්‍රතිකාරය: කල්තියා හඳුනාගත් විට පාලනය පහසුය. ආසාදිත කුණු වූ කොටස් නිරෝගී පටක මඳක් මතුවන තුරු කටුවකින් හාරා ඉවත් කරන්න",
        "තුවාල ආලේපනය: කපා පිරිසිදු කළ තුවාලය මත 10% බෝඩෝ පේස්ට්, බෝඩෝ මිශ්‍රණය හෝ 1% කොපර් දිලීර නාශක ද්‍රාවණය ආලේප කරන්න",
        "වේයන්ගෙන් ආරක්ෂා කිරීම: සති කිහිපයකට පසු යුෂ ගැලීම සම්පූර්ණයෙන්ම නතර වූ විට වේයන්ගෙන් සහ වැසි ජලයෙන් ආරක්ෂා වීමට තුවාලය මත උණුසුම් තාර ආලේප කරන්න",
        "අකුණු හානි ප්‍රතිකාරය: රැඳුනු දියර බැසයාමට කඳට ආනත සිදුරක් විදින්න; පසුව එම සිදුර සිමෙන්ති-වැලි මිශ්‍රණයකින් වසා දමන්න",
        "රතු කුරුමිණි මර්දනය: රතු කුරුමිණි කීටයන් සිටී නම් කඳට නියමිත කෘමිනාශක එන්නත් කරන්න"
      ],
      chemical_ta: [
        "அறுவை சிகிச்சை முறை: பாதிக்கப்பட்ட அழுகிய பகுதிகளை உளியால் செதுக்கி ஆரோக்கியமான திசு வரும் வரை அகற்றவும்",
        "காயத்திற்கு மருந்திடுதல்: செதுக்கிய காயத்தின் மேல் போர்டோ பசை அல்லது 1% காப்பர் பூஞ்சைக் கொல்லி பூசவும்",
        "கரையான் தடுப்பு: சில வாரங்களுக்குப் பின் நீர் வடிதல் நின்றவுடன், நிலக்கரி தார் பூசி பாதுகாக்கவும்",
        "மின்னல் பாதிப்பு: தேங்கிய நீரை வெளியேற்ற சாய்வான துளை இட்டு, பின்னர் சிமென்ட் கலவையால் அடைக்கவும்",
        "கூன்வண்டு கட்டுப்பாடு: தண்டுக்குள் வண்டு புழுக்கள் இருந்தால் பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லியை உட்செலுத்தவும்"
      ],
      biological: [
        "Apply Trichoderma harzianum antagonistic biocontrol paste over cleaned wound margins"
      ],
      biological_si: [
        "පිරිසිදු කළ තුවාල දාර මත ට්‍රයිකොඩර්මා (Trichoderma harzianum) ආලේප කරන්න"
      ],
      biological_ta: [
        "காயத்தின் ஓரங்களில் ட்ரைக்கோடெர்மா பூஞ்சை பசையை பூசவும்"
      ],
      cultural: [
        "Avoid causing mechanical damage to trunk bark with tractors, slashers, or weeding equipment",
        "Maintain optimal soil drainage and avoid severe fluctuations in water table",
        "Do not apply excessive single-dose chemical fertilizers; split applications evenly"
      ],
      cultural_si: [
        "ට්‍රැක්ටර් හෝ වල් නෙළන උපකරණ මඟින් ගසේ කඳට තුවාල සිදු වීම වළක්වා ගන්න",
        "වගාබිමේ හොඳ ජලාපවහනයක් පවත්වා ගන්න සහ ජල මට්ටම නිතර වෙනස් වීම පාලනය කරන්න",
        "රසායනික පොහොර එකවර අධික මාත්‍රාවලින් නොයොදා වාර කිහිපයකට බෙදා යොදන්න"
      ],
      cultural_ta: [
        "இயந்திரங்கள் அல்லது கருவிகளால் மரத்தண்டில் காயம் ஏற்படுவதைத் தவிர்க்கவும்",
        "முறையான வடிகால் அமைப்பை பராமரிக்கவும்",
        "அதிகப்படியான இரசாயன உரங்களை ஒரே நேரத்தில் இடுவதைத் தவிர்க்கவும்"
      ]
    },
    recipes: [
      {
        title: "CRI Official Bordeaux Paste Formulation",
        title_si: "CRI නිල බෝඩෝ පේස්ට් (Bordeaux Paste) සකස් කිරීම",
        title_ta: "CRI அதிகாரப்பூர்வ போர்டோ பசை தயாரிப்பு",
        ingredients: [
          "Copper Sulphate: 450 g",
          "Quick Lime: 450 g",
          "Water: 4.5 Litres total (2.25 L + 2.25 L)"
        ],
        ingredients_si: [
          "කොපර් සල්ෆේට්: ග්‍රෑම් 450",
          "හුණු: ග්‍රෑම් 450",
          "ජලය: මුළු එකතුව ලීටර් 4.5 (ලීටර් 2.25 + ලීටර් 2.25)"
        ],
        ingredients_ta: [
          "காப்பர் சல்பேட்: 450 கிராம்",
          "சுண்ணாம்பு: 450 கிராம்",
          "தண்ணீர்: மொத்தம் 4.5 லிட்டர் (2.25 லிட்டர் + 2.25 லிட்டர்)"
        ],
        preparation_steps: [
          "Dissolve 450 g Copper Sulphate completely in 2.25 litres of water in an earthenware or plastic pot",
          "In a separate non-metallic container, suspend 450 g Quick Lime in 2.25 litres of water",
          "Mix the copper sulphate solution into the lime suspension, stirring vigorously to form a thick, creamy paste",
          "Apply the fresh paste with a paintbrush directly onto chiseled trunk wounds"
        ],
        preparation_steps_si: [
          "මැටි හෝ ප්ලාස්ටික් බඳුනක කොපර් සල්ෆේට් ග්‍රෑම් 450ක් ජලය ලීටර් 2.25ක දියකරන්න",
          "වෙනත් බඳුනක හුණු ග්‍රෑම් 450ක් ජලය ලීටර් 2.25ක දියකරන්න",
          "හුණු ද්‍රාවණයට කොපර් සල්ෆේට් ද්‍රාවණය එක්කර හොඳින් කලවම් කර ඝන පේස්ට් එකක් සකස් කරගන්න",
          "පිරිසිදු කළ කඳේ තුවාලය මත බුරුසුවක් ආධාරයෙන් මෙම පේස්ට් එක ආලේප කරන්න"
        ],
        preparation_steps_ta: [
          "450 கிராம் காப்பர் சல்பேட்டை 2.25 லிட்டர் நீரில் கரைக்கவும்",
          "தனியாக 450 கிராம் சுண்ணாம்பை 2.25 லிட்டர் நீரில் கரைக்கவும்",
          "இரண்டையும் ஒன்றாகக் கலந்து கெட்டியான பசையாக மாறும் வரை கிளறவும்",
          "செதுக்கப்பட்ட காயத்தின் மீது தூரிகை மூலம் பூசவும்"
        ],
        safety_precautions: "Bordeaux paste, mixture, and copper fungicides are toxic. Handle with rubber gloves and wash hands thoroughly.",
        safety_precautions_si: "බෝඩෝ පේස්ට් සහ දිලීර නාශක විෂ සහිත බැවින් අත්වැසුම් පළඳින්න.",
        safety_precautions_ta: "போர்டோ பசை நச்சுத்தன்மை கொண்டது, கையுறைகளைப் பயன்படுத்தவும்."
      }
    ],
    vernacular_advice: "Early chiseling of diseased tissue down to healthy white wood followed by Bordeaux paste and later coal tar dressing stops decay permanently. Confirm bleeding is not caused by Red Palm Weevil or Lightning.",
    vernacular_advice_si: "නිරෝගී සුදු දැව මතුවන තෙක් රෝගී කොටස් කපා ඉවත් කර බෝඩෝ පේස්ට් සහ පසුව තාර ආලේප කිරීමෙන් රෝගය සුව කළ හැක. මෙය රතු කුරුමිණි හෝ අකුණු හානියක් නොවන බව තහවුරු කරගන්න.",
    vernacular_advice_ta: "ஆரம்பத்திலேயே பாதிக்கப்பட்ட மரத்தை உளியால் செதுக்கி போர்டோ பசை மற்றும் தார் பூசுவதன் மூலம் மரத்தை காப்பாற்றலாம். இது கூன்வண்டு அல்லது மின்னல் பாதிப்பு அல்ல என்பதை உறுதிப்படுத்தவும்.",
    severity_level: "high",
    source: "Coconut Research Institute of Sri Lanka (Advisory Circular No. B 10)"
  }
];

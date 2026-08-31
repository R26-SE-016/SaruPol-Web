"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Plane, Smartphone, Cpu, Layers, Activity, CheckCircle2, 
  AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Zap, Microscope, Eye
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PathologyHelpModalProps {
  system: "A" | "B" | null;
  onClose: () => void;
}

export default function PathologyHelpModal({ system, onClose }: PathologyHelpModalProps) {
  const { language } = useLanguage();
  if (!system) return null;

  const isSi = language === "si";
  const isTa = language === "ta";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pt-24 pb-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-3xl max-h-[calc(88vh-4rem)] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl font-mono mt-4"
          style={{
            background: "rgba(11, 17, 30, 0.98)",
            borderColor: system === "A" ? "rgba(0, 229, 255, 0.35)" : "rgba(255, 76, 76, 0.35)",
            boxShadow: system === "A" 
              ? "0 25px 50px -12px rgba(0, 229, 255, 0.25)" 
              : "0 25px 50px -12px rgba(255, 76, 76, 0.25)",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl border transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)", color: "#94A3B8" }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* ═════════════════════════════════════════════════════════════════
              SYSTEM A: UAV DRONE ORTHOMOSAIC SURVEILLANCE GUIDE
             ═════════════════════════════════════════════════════════════════ */}
          {system === "A" && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-cyan-500/15 border border-cyan-500/30">
                  <Plane className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    {isSi ? "පද්ධතිය A: ඩ්‍රෝන ගුවන් නිරීක්ෂණ සහ වර්ණාවලි ඛණ්ඩනය" : isTa ? "அமைப்பு A: ட்ரோன் வான்வழி கண்காணிப்பு & நிறமாலை பிரிவு" : "System A: UAV Aerial Surveillance & Spectral Segmentation"}
                  </h2>
                  <p className="text-xs text-cyan-400 font-semibold">
                    {isSi ? "ක්‍රියාකාරී ක්‍රියාවලිය සහ ප්‍රතිඵල විග්‍රහය" : isTa ? "செயல்முறை விளக்கம் & வெளியீட்டு முடிவுகள்" : "How it works & Output Results Interpretation"}
                  </p>
                </div>
              </div>

              {/* 4-Step Process Pipeline */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> 
                  {isSi ? "1. ඩ්‍රෝන සමීක්ෂණ විශ්ලේෂණ පියවර 4" : isTa ? "1. ட்ரோன் ஆய்வு செயலாக்க நிலைகள்" : "1. End-to-End UAV Processing Pipeline"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">1</span>
                      <strong className="text-white">
                        {isSi ? "ඕතෝමොසයික් රූප ආදානය" : isTa ? "ஆர்த்தோமொசைக் உள்ளீடு" : "Orthomosaic Input"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi 
                        ? "ඩ්‍රෝන යානය මීටර් 50-80 උසකින් 75% අතිච්ඡාදනයක් සහිතව ඡායාරූප ලබා ගනී. මුළු වතු යාය ආවරණය කරමින් GeoTIFF/RGB ඕතෝමොසයික් රූපයක් සකස් කෙරේ."
                        : isTa 
                        ? "ட்ரோன் 50-80 மீ உயரத்தில் 75% மேலடுக்குடன் படங்களைப் பிடிக்கிறது. முழு தோட்டத்தையும் பிரதிநிதித்துவப்படுத்தும் ஒரு GeoTIFF படம் உருவாக்கப்படுகிறது."
                        : "Drone captures high-res aerial imagery at 50–80m altitude with 75% overlap. A GeoTIFF/RGB orthomosaic is stitched representing the entire plantation block."}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">2</span>
                      <strong className="text-white">
                        {isSi ? "වර්ණාවලි දර්ශක ගණනය" : isTa ? "நிறமாலை குறியீட்டு மாற்றம்" : "Spectral Index Transformation"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "Python පසුබිම් පද්ධතිය සාමාන්‍ය RGB සඳහා VARI ((G-R)/(G+R-B)) ද, NIR සංවේදක සඳහා NDVI ((NIR-R)/(NIR+R)) ද ගණනය කර ක්ලෝරෝෆිල් අවශෝෂණය වෙන්කර හඳුනා ගනී."
                        : isTa
                        ? "Python பின்தளம் நிலையான RGB-க்கு VARI ((G-R)/(G+R-B)) மற்றும் NIR-க்கு NDVI ((NIR-R)/(NIR+R)) கணக்கிட்டு குளோரோபில் உறிஞ்சுதலை பிரிக்கிறது."
                        : "The Python backend computes VARI ((G-R)/(G+R-B)) for standard RGB, or NDVI ((NIR-R)/(NIR+R)) for companion multispectral NIR, isolating chlorophyll absorption."}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">3</span>
                      <strong className="text-white">
                        {isSi ? "වියන් ඛණ්ඩනය සහ ගස් මුදුන් හඳුනාගැනීම" : isTa ? "மர முடிகள் கண்டறிதல்" : "Canopy Segmentation & Peak Detection"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "Otsu අනුවර්තී සීමාකරණය මඟින් පසෙන් ගස්වල වියන වෙන් කරයි. සංයුක්ත කේන්ද්‍ර විශ්ලේෂණය මඟින් තනි තනි පොල් ගස් මුදුන් හඳුනා ගනී."
                        : isTa
                        ? "Otsu முறை மூலம் மண்ணிலிருந்து இலைகளைப் பிரிக்கிறது. மையப் பகுப்பாய்வு மூலம் தனித்தனி தென்னை மர முடிகளை கண்டறிகிறது."
                        : "Otsu adaptive thresholding segments active foliage from background soil. Connected component centroid analysis locates discrete palm crown apexes."}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">4</span>
                      <strong className="text-white">
                        {isSi ? "අවදානම් ගස් සහ සෞඛ්‍ය තක්සේරුව" : isTa ? "பாதிக்கப்பட்ட மரங்கள் மதிப்பீடு" : "Crown Anomaly & Threat Scoring"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "සෑම පොල් ගසකම වියන් ශක්තිය තක්සේරු කෙරේ. දැඩි කහ වීම, පත්‍ර හැලීම හෝ දර්ශක බිඳවැටීමක් ඇති ගස් අවදානම් සහිත ගස් ලෙස සලකුණු කරයි."
                        : isTa
                        ? "ஒவ்வொரு தென்னை மர முடியும் தாவர தூய்மைக்காக மதிப்பிடப்படுகிறது. தீவிர மஞ்சள் நிறமாதல் அல்லது இலை உதிர்தல் உள்ள மரங்கள் எச்சரிக்கையாகக் குறிக்கப்படுகின்றன."
                        : "Each segmented palm crown is evaluated for vegetative purity. Palms exhibiting severe chlorosis, defoliation, or spectral index collapse are flagged as anomalies."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Output Results Explained */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> 
                  {isSi ? "2. ඔබේ ප්‍රතිඵල දර්ශක තේරුම් ගැනීම" : isTa ? "2. வெளியீட்டு முடிவுகள் விளக்கம்" : "2. Understanding Your Output Metrics"}
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-cyan-400 font-bold min-w-[130px]">
                      {isSi ? "හඳුනාගත් ගස් ගණන" : isTa ? "கண்டறியப்பட்ட மரங்கள்" : "Detected Palms"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "ස්ථානීය උපරිම විශ්ලේෂණයෙන් හඳුනාගත් මුළු පොල් ගස් ගණන. වත්තේ සැබෑ ගස් සංඛ්‍යාවට ගැලපේ."
                        : isTa
                        ? "கண்டறியப்பட்ட மொத்த தென்னை மரங்களின் எண்ணிக்கை. தோட்டத்தின் நேரடி மரங்களின் எண்ணிக்கையுடன் பொருந்துகிறது."
                        : "Total count of isolated discrete coconut palm crowns identified by crown peak local maxima. Matches empirical tree stand counts."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-emerald-400 font-bold min-w-[130px]">
                      {isSi ? "වියන් ශක්තිය (%)" : isTa ? "இலைகளின் தூய்மை (%)" : "Canopy Purity (%)"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "නිරෝගී වර්ධනයක් සහිත වියන් ප්‍රතිශතය. 80% ට වැඩි අගයන් ප්‍රශස්ථ වර්ධනයක් පෙන්නුම් කරයි."
                        : isTa
                        ? "ஆரோக்கியமான இலைகளின் சதவீத அளவு. 80% க்கு மேல் ஆரோக்கியமான நிலையைக் குறிக்கிறது."
                        : "The percentage of segmented foliage exhibiting optimal healthy spectral absorption. Values above 80% indicate strong vegetative health."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-cyan-300 font-bold min-w-[130px]">
                      {isSi ? "සාමාන්‍ය දර්ශකය" : isTa ? "சராசரி குறியீடு" : "Mean Index"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "සමීක්ෂණය කළ වතු වියනේ සාමාන්‍ය ශාක වර්ධන දර්ශකය. (සාමාන්‍ය VARI: 0.05 සිට 0.25; සාමාන්‍ය NDVI: 0.40 සිට 0.85)."
                        : isTa
                        ? "ஆய்வு செய்யப்பட்ட தோட்டத்தின் சராசரி தாவர குறியீட்டு மதிப்பு. (வழக்கமான VARI: 0.05 - 0.25; வழக்கமான NDVI: 0.40 - 0.85)."
                        : "Average vegetative index value across the surveyed estate canopy. (Typical VARI: 0.05 to 0.25; Typical NDVI: 0.40 to 0.85)."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-red-400 font-bold min-w-[130px]">
                      {isSi ? "අවදානම් ලක්ෂ්‍ය" : isTa ? "பாதிக்கப்பட்ட மரங்கள்" : "Flagged Anomalies"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "පත්‍ර වියළීම හෝ දිලීර ආසාදන පෙන්නුම් කරන, බිම් මට්ටමේ පරීක්ෂාවට (පද්ධතිය B) ලක් කළ යුතු නිශ්චිත ගස්වල GPS ඛණ්ඩාංක."
                        : isTa
                        ? "கள மட்டத்தில் ஆய்வு செய்ய வேண்டிய பாதிக்கப்பட்ட மரங்களின் GPS ஆயத்தொலைவுகள்."
                        : "Specific palm coordinates exhibiting acute chlorosis, frond dieback, or fungal thinning requiring ground-level System B leaf inspection."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              SYSTEM B: MOBILE LEAF ON-DEVICE EDGE AI DIAGNOSTICS GUIDE
             ═════════════════════════════════════════════════════════════════ */}
          {system === "B" && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-red-500/15 border border-red-500/30">
                  <Smartphone className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    {isSi ? "පද්ධතිය B: ජංගම දුරකථන Edge AI පත්‍ර රෝග විනිශ්චය" : isTa ? "அமைப்பு B: மொபைல் Edge AI இலை நோய் கண்டறிதல்" : "System B: On-Device Edge AI Mobile Leaf Pathology"}
                  </h2>
                  <p className="text-xs text-red-400 font-semibold">
                    {isSi ? "ක්‍රියාකාරී ක්‍රියාවලිය සහ ප්‍රතිඵල විග්‍රහය" : isTa ? "செயல்முறை விளக்கம் & வெளியீட்டு முடிவுகள்" : "How it works & Output Results Interpretation"}
                  </p>
                </div>
              </div>

              {/* 4-Step Process Pipeline */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-red-400" /> 
                  {isSi ? "1. Edge AI ක්ෂණික රෝග විනිශ්චය පියවර 4" : isTa ? "1. Edge AI உடனடி நோய் கண்டறிதல் நிலைகள்" : "1. Edge AI On-Device Inference Pipeline"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">1</span>
                      <strong className="text-white">
                        {isSi ? "සමීප ඡායාරූප ලබා ගැනීම" : isTa ? "நெருக்கமான புகைப்படம்" : "Macro Foliar Capture"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "වගාකරු හෝ ක්ෂේත්‍ර නිලධාරියා රෝගී පොල් පත්‍රයක හෝ කඳේ ලපයක සමීප ඡායාරූපයක් ලබා ගනී."
                        : isTa
                        ? "விவசாயி அல்லது கள அலுவலர் பாதிக்கப்பட்ட தென்னை ஓலை அல்லது தண்டுப் பகுதியின் நெருக்கமான புகைப்படத்தை எடுக்கிறார்."
                        : "Planter or field officer takes a close-up photograph of a diseased coconut leaflet, frond midrib, or stem bleeding lesion using a mobile camera."}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">2</span>
                      <strong className="text-white">
                        {isSi ? "INT8 MobileNetV2 විශ්ලේෂණය" : isTa ? "INT8 MobileNetV2 செயலாக்கம்" : "INT8 MobileNetV2 Execution"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "TensorFlow Lite WebAssembly සහ XNNPACK තාක්ෂණය මඟින් ඔබගේ දුරකථනය තුළම ක්‍රියාත්මක වේ. දුරස්ථ වතුකරයේ කිසිදු අන්තර්ජාලයක් නොමැතිව 100% ක් නොබැඳිව ක්‍රියා කරයි."
                        : isTa
                        ? "TensorFlow Lite மூலம் இணைய வசதி இல்லாமலேயே 100% ஆஃப்லைனில் உங்கள் சாதனத்திலேயே இயங்குகிறது."
                        : "The image is processed locally on-device via TensorFlow Lite WebAssembly with XNNPACK CPU acceleration. Works 100% offline in remote plantations without mobile reception."}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">3</span>
                      <strong className="text-white">
                        {isSi ? "රෝග කාරක වර්ගීකරණය" : isTa ? "நோய்க்கிருமி வகைப்பாடு" : "Pathogen Classification"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "රෝග ලපවල ක්ෂුද්‍ර ලක්ෂණ විශ්ලේෂණය කර පන්ති 5ක් හරහා (කරටි කුණුවීම, පත්‍ර අංගමාරය, කඳෙන් ශ්‍රාවය ගැලීම, වැලිගම පත්‍ර කොළමැලවීම, නිරෝගී) සම්භාවිතාව ලබා දෙයි."
                        : isTa
                        ? "நோய்களை 5 வகைகளாகப் பிரித்து துல்லியமான சதவீதத்தை வழங்குகிறது (குருத்து அழுகல், இலை கருகல், தண்டு கசிவு, வலிblock இலையோடல், நலம்)."
                        : "Extracts micro-textural lesion characteristics and outputs softmax confidence probabilities across 5 classes (Bud Rot, Leaf Blight, Stem Bleeding, Weligama Leaf Wilt, Healthy)."}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl border bg-black/30 space-y-1.5" style={{ borderColor: "rgba(255, 76, 76, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">4</span>
                      <strong className="text-white">
                        {isSi ? "CRI නිල ප්‍රතිකාර උපදෙස්" : isTa ? "CRI அதிகாரப்பூர்வ சிகிச்சை முறைகள்" : "CRI Advisory Protocols"}
                      </strong>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "හඳුනාගත් රෝගය පොල් පර්යේෂණ ආයතනයේ (CRI) නිල ප්‍රතිකාර සහ දිලීර නාශක මාත්‍රා සඳහා ස්වයංක්‍රීයව යොමු කරයි."
                        : isTa
                        ? "தென்னை ஆராய்ச்சி நிறுவனத்தின் (CRI) அதிகாரப்பூர்வ சிகிச்சை முறைகளை தானாகவே வழங்குகிறது."
                        : "Automatically maps the diagnosis to official Coconut Research Institute (CRI) treatment protocols (fungicidal dosages, quarantine, sanitization)."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Output Results Explained */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2">
                  <Microscope className="w-3.5 h-3.5 text-red-400" /> 
                  {isSi ? "2. ඔබේ රෝග විනිශ්චය ප්‍රතිඵල තේරුම් ගැනීම" : isTa ? "2. நோய் கண்டறிதல் முடிவுகள் விளக்கம்" : "2. Understanding Your Diagnostic Outputs"}
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-red-400 font-bold min-w-[130px]">
                      {isSi ? "රෝග පන්තිය" : isTa ? "நோயின் வகை" : "Pathogen Class"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "හඳුනාගත් ජීව විද්‍යාත්මක රෝග කාරකය (කරටි කුණුවීම සඳහා Phytophthora palmivora, පත්‍ර අංගමාරය සඳහා Lasiodiplodia theobromae, ආදිය)."
                        : isTa
                        ? "கண்டறியப்பட்ட நோய்க்கிருமியின் வகை (எ.கா. குருத்து அழுகல், இலை கருகல்)."
                        : "Identified biological pathogen (e.g. Phytophthora palmivora for Bud Rot, Lasiodiplodia theobromae for Leaf Blight, or Phytoplasma for Weligama Wilt)."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-purple-400 font-bold min-w-[130px]">
                      {isSi ? "විශ්වාසනීයත්වය (%)" : isTa ? "துல்லியம் (%)" : "Confidence (%)"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "කෘතිම බුද්ධි ආකෘතියේ විශ්වාසනීයත්ව ප්‍රතිශතය. 85% ට වැඩි අගයන් ඉහළ නිරවද්‍යතාවයක් දක්වයි."
                        : isTa
                        ? "செயற்கை நுண்ணறிவின் துல்லியத்தன்மை சதவீதம். 85% க்கு மேல் அதிக நம்பகத்தன்மை கொண்டது."
                        : "Statistical certainty rating of the neural network. Scores above 85% represent high diagnostic reliability."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-amber-400 font-bold min-w-[130px]">
                      {isSi ? "ජෛව අවදානම" : isTa ? "உயிரியல் அச்சுறுத்தல்" : "Biosecurity Risk"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "ජෛව ආරක්ෂණ අවදානම් මට්ටම (කරටි කුණුවීම සඳහා හදිසි ගස් කපා විනාශ කිරීම හෝ දැඩි නිරෝධායනය අවශ්‍ය වේ)."
                        : isTa
                        ? "உயிரியல் பாதுகாப்பு அச்சுறுத்தல் நிலை (குருத்து அழுகலுக்கு மரத்தை அகற்றுதல் அவசியம்)."
                        : "Contagion threat level (e.g. CRITICAL for Bud Rot requiring emergency tree removal; MONITORED for mild fungal leaf spots)."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <span className="text-emerald-400 font-bold min-w-[130px]">
                      {isSi ? "ප්‍රතිකාර මාර්ගෝපදේශ" : isTa ? "சிகிச்சை வழிகாட்டி" : "Treatment Guide"}
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {isSi
                        ? "CRI උපදෙස් අනුව නිර්දේශිත දිලීර නාශක (බෝඩෝ මිශ්‍රණය, කොපර් ඔක්සික්ලෝරයිඩ්) සහ සනීපාරක්ෂක පියවර."
                        : isTa
                        ? "பரிந்துரைக்கப்பட்ட பூஞ்சைக் கொல்லிகள் மற்றும் துப்புரவு வழிமுறைகள்."
                        : "Prescribed chemical intervention (e.g. 1% Bordeaux mixture, Copper Oxychloride) and mechanical sanitation steps under CRI guidance."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer Dismiss Button */}
          <div className="pt-4 border-t flex justify-end" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105"
              style={{
                background: system === "A" ? "rgba(0, 229, 255, 0.2)" : "rgba(255, 76, 76, 0.2)",
                color: system === "A" ? "#00E5FF" : "#FF4C4C",
                border: system === "A" ? "1px solid rgba(0, 229, 255, 0.4)" : "1px solid rgba(255, 76, 76, 0.4)",
              }}
            >
              {isSi ? "තේරුම් ගත්තා, ආපසු ස්කෑනරය වෙත →" : isTa ? "புரிந்தது, மீண்டும் ஸ்கேனருக்குச் செல்லவும் →" : "Got it, Return to Scanner →"}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

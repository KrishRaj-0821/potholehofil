/**
 * Gemini AI Vision & Kasba Meme Generator Helper
 * Emulates / calls AI vision agent for Kasba (854330) road defects.
 */

const KASBA_MEME_TEMPLATES = [
  {
    caption: 'कस्बा (854330) का नया वाटर पार्क! टिकट बिल्कुल फ्री फ्री फ्री! 🏊‍♂️',
    subtext: 'स्थानीय नगर प्रशासन को विश्वस्तरीय वॉटर-स्पोर्ट्स सुविधा देने के लिए धन्यवाद! 😂',
    severity: 'CRITICAL' as const,
  },
  {
    caption: 'सावधान! यह कस्बा का रास्ता नहीं, चंद्रयान का टेस्टिंग ग्राउंड है! 🚀🌕',
    subtext: 'बिना स्पेससूट के इधर से गुजरना सख्त मना है!',
    severity: 'HIGH' as const,
  },
  {
    caption: 'गड्ढा इतना गहरा है कि उल्टा जाओगे तो सीधे अमेरिका निकलोगे! 🕳️🌎',
    subtext: 'ISRO और NASA मिलकर इसकी गहराई नाप रहे हैं!',
    severity: 'CRITICAL' as const,
  },
  {
    caption: 'सड़क में गड्ढा है या गड्ढे में सड़क? कस्बा 854330 का महान रहस्य! 🤔',
    subtext: 'फिजिक्स के सारे नियम यहाँ आकर फेल हो जाते हैं!',
    severity: 'HIGH' as const,
  },
  {
    caption: 'ऑर्थोपेडिक डॉक्टरों का पसंदीदा स्पॉट! 1 मिनट में कमर का इलाज! 🦴💥',
    subtext: 'सस्पेंशन ख़राब हो जाए तो बिल पार्षद जी को भेजें!',
    severity: 'MODERATE' as const,
  },
];

export async function generateKasbaRoast(imageDataUrl?: string) {
  // Simulate network delay for AI processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const randomTemplate = KASBA_MEME_TEMPLATES[Math.floor(Math.random() * KASBA_MEME_TEMPLATES.length)];

  const depth = Math.floor(Math.random() * 20) + 12; // 12cm - 32cm
  const area = parseFloat((Math.random() * 2 + 0.5).toFixed(1)); // 0.5 - 2.5 m²
  const count = Math.floor(Math.random() * 4) + 1; // 1 - 5 potholes

  return {
    memeCaption: randomTemplate.caption,
    memeSubtext: randomTemplate.subtext,
    severity: randomTemplate.severity,
    metrics: {
      depthCm: depth,
      areaSqM: area,
      count: count,
    },
  };
}

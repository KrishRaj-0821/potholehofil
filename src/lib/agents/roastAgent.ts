import { GoogleGenerativeAI } from '@google/generative-ai';

export interface MemeRoastResult {
  caption: string;
  subtext: string;
}

const KASBA_LOCAL_ROAST_BANK = [
  {
    caption: 'कस्बा (854330) का नया वाटर पार्क! टिकट बिल्कुल मुफ़्त मुफ़्त मुफ़्त! 🏊‍♂️',
    subtext: 'नगर पालिका को स्विमिंग पूल की सुविधा देने के लिए कोटि-कोटि धन्यवाद! 😂',
  },
  {
    caption: 'कस्बा NH-131A रोड: यहाँ गाड़ी कम और चंद्रयान ज़्यादा उछलता है! 🚀🌕',
    subtext: 'NASA वाले यहाँ आकर गाड़ियों के शॉक-एब्जॉर्बर टेस्ट करते हैं!',
  },
  {
    caption: 'इस गड्ढे की गहराई मापने के लिए ISRO से विशेष वैज्ञानिकों की टीम आ रही है! 🔬🔍',
    subtext: 'स्थानीय लोगों ने इसमें बत्तख पालन शुरू करने की योजना बनाई है। 🦆',
  },
  {
    caption: 'सड़क में गड्ढा है या गड्ढे में सड़क? कस्बा 854330 का महान अजूबा! 🤔🕳️',
    subtext: 'ऑर्थोपेडिक डॉक्टरों का पसंदीदा स्पॉट, 1 मिनट में कमर का इलाज!',
  },
  {
    caption: 'कस्बा बस स्टैंड रोड: हेलीकॉप्टर से आने वाले यात्रियों का स्वागत है! 🚁💥',
    subtext: 'कमर की हड्डी सलामत रखनी है तो पैदल चलने से बचें!',
  },
];

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function runLocalizedRoastingAgent(
  count: number,
  severity: string,
  depthCm: number
): Promise<MemeRoastResult> {
  if (API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Act as a local viral civic meme creator from Kasba (PIN: 854330), Purnea, Bihar.
Generate a hilarious 1-line Hindi/Bhojpuri roast caption for a road that has ${count} potholes with a severe depth of ${depthCm}cm.
Make references to Kasba landmarks like Kasba Bus Stand, NH-131A, Kasba Station Road, or Municipal Corporation.
Return strictly valid JSON:
{
  "caption": "funny 1-liner Hindi roast caption with emojis",
  "subtext": "funny satirical 1-liner subtext"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.caption) {
          return {
            caption: parsed.caption,
            subtext: parsed.subtext || 'कस्बा (854330) रोड रोस्ट PWA',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini AI Meme Roaster error, falling back to local dialect bank:', err);
    }
  }

  // Fallback Kasba Meme Bank Selection
  const selected = KASBA_LOCAL_ROAST_BANK[Math.floor(Math.random() * KASBA_LOCAL_ROAST_BANK.length)];
  return selected;
}

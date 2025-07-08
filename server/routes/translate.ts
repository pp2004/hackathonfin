import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Microsoft Translator API configuration
const translatorConfig = {
  subscriptionKey: 'DfGNWqrvA5QEwwPAiuHw1dP7b9JJYsrg0b8GA9FfRpVwsxIYtAVeJQQJ99BGACYeBjFXJ3w3AAAbACOGmpP6',
  endpoint: 'https://api.cognitive.microsofttranslator.com',
  location: 'eastus'
};

const translateSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.string().min(2).max(5),
  sourceLanguage: z.string().min(2).max(5).optional().default('en')
});

router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = translateSchema.parse(req.body);
    
    // If target language is English, return original text
    if (targetLanguage === 'en') {
      return res.json({ translatedText: text });
    }
    
    const response = await fetch(`${translatorConfig.endpoint}/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': translatorConfig.subscriptionKey,
        'Ocp-Apim-Subscription-Region': translatorConfig.location,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ text }])
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    const translatedText = data[0]?.translations?.[0]?.text || text;
    
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

export default router;
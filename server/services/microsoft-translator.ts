interface TranslateOptions {
  text: string;
  to: string;
  from?: string;
}

interface TranslateResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

export class MicrosoftTranslatorService {
  private endpoint = "https://api.cognitive.microsofttranslator.com";
  private apiKey = "DfGNWqrvA5QEwwPAiuHw1dP7b9JJYsrg0b8GA9FfRpVwsxIYtAVeJQQJ99BGACYeBjFXJ3w3AAAbACOGmpP6";
  private location = "eastus";

  async translateText(options: TranslateOptions): Promise<string> {
    try {
      const { text, to, from = 'en' } = options;
      
      const url = `${this.endpoint}/translate?api-version=3.0&to=${to}${from ? `&from=${from}` : ''}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Ocp-Apim-Subscription-Region': this.location,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text }])
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const result: TranslateResponse[] = await response.json();
      return result[0]?.translations[0]?.text || text;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return options.text;
    }
  }

  async translateObject(obj: Record<string, any>, targetLanguage: string): Promise<Record<string, any>> {
    if (targetLanguage === 'en') {
      return obj; // No translation needed for English
    }

    const translated: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.trim()) {
        translated[key] = await this.translateText({
          text: value,
          to: targetLanguage,
          from: 'en'
        });
      } else {
        translated[key] = value;
      }
    }
    
    return translated;
  }

  async translateArray(items: string[], targetLanguage: string): Promise<string[]> {
    if (targetLanguage === 'en') {
      return items;
    }

    const translations = await Promise.all(
      items.map(item => 
        this.translateText({
          text: item,
          to: targetLanguage,
          from: 'en'
        })
      )
    );
    
    return translations;
  }
}
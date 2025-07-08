import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface Translation {
  [key: string]: string;
}

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Default English translations
const defaultTranslations: Translation = {
  // Header Navigation
  'nav.overview': 'Overview',
  'nav.portfolio': 'Portfolio',
  'nav.insights': 'Insights',
  'nav.transactions': 'Transactions',
  'nav.chat': 'Chat',
  
  // Client Selection
  'client.select': 'Select Client ID',
  'client.placeholder': 'Choose a client...',
  
  // Dashboard Sections
  'welcome.title': 'Investment Dashboard',
  'welcome.subtitle': 'Comprehensive portfolio analysis and AI-powered insights',
  'portfolio.title': 'Portfolio Performance',
  'portfolio.subtitle': 'Track your investment performance over time',
  'allocation.title': 'Asset Allocation',
  'allocation.subtitle': 'Portfolio distribution across asset classes',
  'risk.title': 'Risk Analysis',
  'risk.subtitle': 'Portfolio risk assessment and recommendations',
  'profile.title': 'Client Profile',
  'profile.subtitle': 'Investment preferences and objectives',
  'insights.title': 'Market Insights',
  'insights.subtitle': 'Latest market analysis and research',
  'transactions.title': 'Recent Transactions',
  'transactions.subtitle': 'Trading activity and portfolio changes',
  'chat.title': 'AI Investment Assistant',
  'chat.subtitle': 'Get personalized investment advice and portfolio analysis',
  
  // Portfolio Metrics
  'metrics.totalValue': 'Total Value',
  'metrics.ytdReturn': 'YTD Return',
  'metrics.volatility': 'Volatility',
  'metrics.lastUpdated': 'Last Updated',
  
  // Asset Types
  'assets.equities': 'Equities',
  'assets.bonds': 'Bonds',
  'assets.alternatives': 'Alternatives',
  'assets.cash': 'Cash',
  'assets.realEstate': 'Real Estate',
  
  // Risk Levels
  'risk.conservative': 'Conservative',
  'risk.moderate': 'Moderate',
  'risk.balanced': 'Balanced',
  'risk.aggressive': 'Aggressive',
  'risk.growth': 'Growth',
  
  // Buttons and Actions
  'button.download': 'Download Report',
  'button.schedule': 'Schedule Meeting',
  'button.refresh': 'Refresh Data',
  'button.viewAll': 'View All',
  'button.send': 'Send',
  'button.clear': 'Clear',
  
  // Transaction Table Headers
  'transaction.date': 'Date',
  'transaction.type': 'Type',
  'transaction.instrument': 'Instrument',
  'transaction.amount': 'Amount',
  'transaction.currency': 'Currency',
  'transaction.status': 'Status',
  
  // Transaction Types
  'transaction.buy': 'Buy',
  'transaction.sell': 'Sell',
  'transaction.deposit': 'Deposit',
  'transaction.withdrawal': 'Withdrawal',
  
  // Chat Interface
  'chat.placeholder': 'Ask about your portfolio, market trends, or investment strategies...',
  'chat.thinking': 'AI is analyzing...',
  'chat.error': 'Unable to get response. Please try again.',
  
  // Client Profile Fields
  'profile.riskTolerance': 'Risk Tolerance',
  'profile.investmentHorizon': 'Investment Horizon',
  'profile.experience': 'Investment Experience',
  'profile.objective': 'Investment Objective',
  'profile.freeAssetRatio': 'Free Asset Ratio',
  
  // Time Periods
  'time.years': 'years',
  'time.months': 'months',
  'time.days': 'days',
  
  // Status Messages
  'status.loading': 'Loading...',
  'status.error': 'Error loading data',
  'status.noData': 'No data available',
  'status.success': 'Success',
  
  // Language Selection
  'language.english': 'English',
  'language.chinese': 'Chinese',
  'language.japanese': 'Japanese',
  'language.french': 'French',
  'language.german': 'German',
  'language.spanish': 'Spanish'
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Translation>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
          sourceLanguage: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  };

  const translateAllTexts = async (targetLanguage: string) => {
    if (targetLanguage === 'en') {
      setTranslations(defaultTranslations);
      return;
    }

    setIsLoading(true);
    try {
      const translatedTexts: Translation = {};
      
      // Translate in batches to avoid overwhelming the API
      const entries = Object.entries(defaultTranslations);
      const batchSize = 10;
      
      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        const translationPromises = batch.map(async ([key, text]) => {
          const translatedText = await translateText(text, targetLanguage);
          return [key, translatedText];
        });
        
        const batchResults = await Promise.all(translationPromises);
        batchResults.forEach(([key, translatedText]) => {
          translatedTexts[key] = translatedText;
        });
      }
      
      setTranslations(translatedTexts);
    } catch (error) {
      console.error('Error translating texts:', error);
      // Keep English as fallback
      setTranslations(defaultTranslations);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    translateAllTexts(language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
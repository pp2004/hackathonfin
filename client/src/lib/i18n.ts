import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh' | 'ja';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'welcome': 'Welcome to Circle One',
    'portfolio_value': 'Portfolio Value',
    'ytd_return': 'YTD Return',
    'risk_level': 'Risk Level',
    'portfolio_performance': 'Portfolio Performance',
    'asset_allocation': 'Asset Allocation',
    'risk_analysis': 'Risk Analysis',
    'client_profile': 'Client Profile',
    'market_insights': 'Market Insights',
    'ai_assistant': 'AI Investment Assistant',
    'dashboard': 'Dashboard',
    'portfolio': 'Portfolio',
    'insights': 'Insights',
    'chat': 'Chat',
    'select_client': 'Select Client ID',
    'loading': 'Loading...',
  },
  es: {
    'welcome': 'Bienvenido a Circle One',
    'portfolio_value': 'Valor del Portafolio',
    'ytd_return': 'Rendimiento del Año',
    'risk_level': 'Nivel de Riesgo',
    'portfolio_performance': 'Rendimiento del Portafolio',
    'asset_allocation': 'Asignación de Activos',
    'risk_analysis': 'Análisis de Riesgo',
    'client_profile': 'Perfil del Cliente',
    'market_insights': 'Perspectivas del Mercado',
    'ai_assistant': 'Asistente de Inversión AI',
    'dashboard': 'Panel de Control',
    'portfolio': 'Portafolio',
    'insights': 'Perspectivas',
    'chat': 'Chat',
    'select_client': 'Seleccionar ID del Cliente',
    'loading': 'Cargando...',
  },
  fr: {
    'welcome': 'Bienvenue à Circle One',
    'portfolio_value': 'Valeur du Portefeuille',
    'ytd_return': 'Rendement Annuel',
    'risk_level': 'Niveau de Risque',
    'portfolio_performance': 'Performance du Portefeuille',
    'asset_allocation': 'Allocation d\'Actifs',
    'risk_analysis': 'Analyse des Risques',
    'client_profile': 'Profil Client',
    'market_insights': 'Perspectives du Marché',
    'ai_assistant': 'Assistant d\'Investissement AI',
    'dashboard': 'Tableau de Bord',
    'portfolio': 'Portefeuille',
    'insights': 'Perspectives',
    'chat': 'Chat',
    'select_client': 'Sélectionner ID Client',
    'loading': 'Chargement...',
  },
  de: {
    'welcome': 'Willkommen bei Circle One',
    'portfolio_value': 'Portfolio-Wert',
    'ytd_return': 'Jahresrendite',
    'risk_level': 'Risikolevel',
    'portfolio_performance': 'Portfolio-Performance',
    'asset_allocation': 'Asset-Allokation',
    'risk_analysis': 'Risikoanalyse',
    'client_profile': 'Kundenprofil',
    'market_insights': 'Markteinblicke',
    'ai_assistant': 'KI-Investmentassistent',
    'dashboard': 'Dashboard',
    'portfolio': 'Portfolio',
    'insights': 'Einblicke',
    'chat': 'Chat',
    'select_client': 'Kunden-ID auswählen',
    'loading': 'Laden...',
  },
  hi: {
    'welcome': 'Circle One में आपका स्वागत है',
    'portfolio_value': 'पोर्टफोलियो मूल्य',
    'ytd_return': 'वार्षिक रिटर्न',
    'risk_level': 'जोखिम स्तर',
    'portfolio_performance': 'पोर्टफोलियो प्रदर्शन',
    'asset_allocation': 'संपत्ति आवंटन',
    'risk_analysis': 'जोखिम विश्लेषण',
    'client_profile': 'ग्राहक प्रोफाइल',
    'market_insights': 'बाजार अंतर्दृष्टि',
    'ai_assistant': 'AI निवेश सहायक',
    'dashboard': 'डैशबोर्ड',
    'portfolio': 'पोर्टफोलियो',
    'insights': 'अंतर्दृष्टि',
    'chat': 'चैट',
    'select_client': 'ग्राहक ID चुनें',
    'loading': 'लोड हो रहा है...',
  },
  zh: {
    'welcome': '欢迎来到Circle One',
    'portfolio_value': '投资组合价值',
    'ytd_return': '年度回报',
    'risk_level': '风险水平',
    'portfolio_performance': '投资组合表现',
    'asset_allocation': '资产配置',
    'risk_analysis': '风险分析',
    'client_profile': '客户档案',
    'market_insights': '市场洞察',
    'ai_assistant': 'AI投资助手',
    'dashboard': '仪表板',
    'portfolio': '投资组合',
    'insights': '洞察',
    'chat': '聊天',
    'select_client': '选择客户ID',
    'loading': '加载中...',
  },
  ja: {
    'welcome': 'Circle Oneへようこそ',
    'portfolio_value': 'ポートフォリオ価値',
    'ytd_return': '年間リターン',
    'risk_level': 'リスクレベル',
    'portfolio_performance': 'ポートフォリオパフォーマンス',
    'asset_allocation': 'アセットアロケーション',
    'risk_analysis': 'リスク分析',
    'client_profile': 'クライアントプロフィール',
    'market_insights': 'マーケットインサイト',
    'ai_assistant': 'AI投資アシスタント',
    'dashboard': 'ダッシュボード',
    'portfolio': 'ポートフォリオ',
    'insights': 'インサイト',
    'chat': 'チャット',
    'select_client': 'クライアントID選択',
    'loading': '読み込み中...',
  },
};

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages,
  };
}

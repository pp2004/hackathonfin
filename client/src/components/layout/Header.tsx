import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  selectedClient: string | null;
  setSelectedClient: (clientId: string | null) => void;
  clients: Array<{ id: number; clientId: string; name: string }>;
}

export function Header({ selectedClient, setSelectedClient, clients }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, isLoading } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* UBS Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <img 
                  src="@assets/ubs-logo.png" 
                  alt="UBS Logo" 
                  className="h-8 w-auto"
                />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Wealth Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Circle One Platform
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('dashboard')}
              className="text-gray-900 dark:text-white hover:text-[var(--ubs-red)] transition-colors duration-200"
            >
              {t('nav.overview', 'Dashboard')}
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200"
            >
              {t('nav.portfolio', 'Portfolio')}
            </button>
            <button 
              onClick={() => scrollToSection('insights')}
              className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200"
            >
              {t('nav.insights', 'Insights')}
            </button>
            <button 
              onClick={() => scrollToSection('transactions')}
              className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200"
            >
              {t('nav.transactions', 'Transactions')}
            </button>
            <button 
              onClick={() => scrollToSection('chat')}
              className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200"
            >
              {t('nav.chat', 'Chat')}
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="zh">🇨🇳 ZH</SelectItem>
                <SelectItem value="ja">🇯🇵 JA</SelectItem>
                <SelectItem value="fr">🇫🇷 FR</SelectItem>
                <SelectItem value="de">🇩🇪 DE</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
              </SelectContent>
            </Select>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* Client Selector */}
            <Select value={selectedClient || ""} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-48 bg-[var(--ubs-red)] text-white border-[var(--ubs-red)] hover:bg-[var(--ubs-red-dark)]">
                <SelectValue placeholder={t('client.select', 'Select Client ID')} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {clients.map((client) => (
                  <SelectItem key={client.clientId} value={client.clientId} className="cursor-pointer">
                    {client.clientId} - {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

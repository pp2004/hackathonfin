import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  selectedClient: string | null;
  onClientChange: (clientId: string) => void;
  clients: Array<{ id: number; clientId: string; name: string }>;
}

export function Header({ selectedClient, onClientChange, clients }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage, t, languages } = useTranslation();

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
                  src="@assets/ubs_logo_1751886734052.png" 
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
            <a href="#dashboard" className="text-gray-900 dark:text-white hover:text-[var(--ubs-red)] transition-colors duration-200">
              {t('dashboard')}
            </a>
            <a href="#portfolio" className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200">
              {t('portfolio')}
            </a>
            <a href="#insights" className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200">
              {t('insights')}
            </a>
            <a href="#chat" className="text-gray-500 dark:text-gray-400 hover:text-[var(--ubs-red)] transition-colors duration-200">
              {t('chat')}
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={currentLanguage} onValueChange={changeLanguage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.code.toUpperCase()}
                  </SelectItem>
                ))}
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
            <Select value={selectedClient || ""} onValueChange={onClientChange}>
              <SelectTrigger className="w-48 bg-[var(--ubs-red)] text-white border-[var(--ubs-red)] hover:bg-[var(--ubs-red-dark)]">
                <SelectValue placeholder={t('select_client')} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.clientId} value={client.clientId}>
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

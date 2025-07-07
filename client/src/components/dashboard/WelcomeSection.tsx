import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ClientData } from "@/hooks/use-client-data";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface WelcomeSectionProps {
  clientData: ClientData | null;
}

export function WelcomeSection({ clientData }: WelcomeSectionProps) {
  const { t } = useTranslation();

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${(num / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-[var(--ubs-red)] to-[var(--ubs-red-dark)] rounded-2xl p-8 text-white relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"
        />
        
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2"
          >
            {t('welcome')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-red-100 mb-6"
          >
            Your comprehensive wealth management platform
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <p className="text-sm text-red-100">{t('portfolio_value')}</p>
                <InfoTooltip term="Portfolio Value" className="h-3 w-3 text-red-200 hover:text-white cursor-pointer" />
              </div>
              <p className="text-2xl font-bold">
                {clientData?.portfolio ? formatCurrency(clientData.portfolio.totalValue) : '--'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <p className="text-sm text-red-100">{t('ytd_return')}</p>
                <InfoTooltip term="YTD Return" className="h-3 w-3 text-red-200 hover:text-white cursor-pointer" />
              </div>
              <p className="text-2xl font-bold">
                {clientData?.portfolio ? `${parseFloat(clientData.portfolio.ytdReturn).toFixed(1)}%` : '--'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="glass-effect rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <p className="text-sm text-red-100">{t('risk_level')}</p>
                <InfoTooltip term="Risk Tolerance" className="h-3 w-3 text-red-200 hover:text-white cursor-pointer" />
              </div>
              <p className="text-2xl font-bold">
                {clientData?.client?.riskTolerance || '--'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

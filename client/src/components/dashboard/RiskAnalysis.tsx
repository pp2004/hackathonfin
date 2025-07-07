import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClientData } from "@/hooks/use-client-data";

interface RiskAnalysisProps {
  clientData: ClientData | null;
}

export function RiskAnalysis({ clientData }: RiskAnalysisProps) {
  const { t } = useTranslation();

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'conservative':
        return 'from-green-500 to-green-600';
      case 'moderate':
        return 'from-yellow-500 to-yellow-600';
      case 'aggressive':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 8) return 'from-green-500 to-green-600';
    if (volatility < 12) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const volatility = clientData?.portfolio ? parseFloat(clientData.portfolio.volatility) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              {t('risk_analysis')}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400 hover:text-[var(--ubs-red)] cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-64">
                    Risk tolerance measures your ability to handle portfolio volatility 
                    based on your investment horizon and financial situation.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getRiskColor(clientData?.client?.riskTolerance || '')} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {clientData?.client?.riskTolerance?.charAt(0) || 'C'}
                    </span>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Risk Tolerance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {clientData?.client?.riskTolerance || 'Moderate'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getVolatilityColor(volatility)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {volatility.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Portfolio Volatility</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {volatility < 8 ? 'Within Range' : volatility < 12 ? 'Moderate' : 'High'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {clientData?.client?.investmentHorizon || 7}Y
                    </span>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Time Horizon</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(clientData?.client?.investmentHorizon || 0) > 5 ? 'Long Term' : 'Short Term'}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

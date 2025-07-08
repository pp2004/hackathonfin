import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { ClientData } from "@/hooks/use-client-data";

interface BudgetHealthTrafficLightProps {
  clientData: ClientData | null;
}

interface HealthMetric {
  name: string;
  value: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: string;
  description: string;
}

export function BudgetHealthTrafficLight({ clientData }: BudgetHealthTrafficLightProps) {
  const { t } = useTranslation();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [overallHealth, setOverallHealth] = useState<'excellent' | 'good' | 'warning' | 'critical'>('good');

  useEffect(() => {
    if (!clientData?.portfolio || !clientData?.assetAllocations) return;

    const portfolioValue = parseFloat(clientData.portfolio.totalValue);
    const ytdReturn = parseFloat(clientData.portfolio.ytdReturn);
    const volatility = parseFloat(clientData.portfolio.volatility);
    const freeAssetRatio = parseFloat(clientData.client.freeAssetRatio);

    // Calculate diversification score
    const assetCount = clientData.assetAllocations.length;
    const diversificationScore = Math.min(assetCount * 25, 100);

    // Calculate allocation balance
    const allocations = clientData.assetAllocations.map(a => parseFloat(a.allocation));
    const maxAllocation = Math.max(...allocations);
    const balanceScore = 100 - (maxAllocation - 40); // Penalize over-concentration

    const metrics: HealthMetric[] = [
      {
        name: 'Portfolio Growth',
        value: Math.max(0, Math.min(100, (ytdReturn + 10) * 5)), // Scale -10% to +10% as 0-100
        status: ytdReturn > 5 ? 'excellent' : ytdReturn > 0 ? 'good' : ytdReturn > -5 ? 'warning' : 'critical',
        icon: '📈',
        description: `YTD Return: ${ytdReturn.toFixed(1)}%`
      },
      {
        name: 'Risk Management',
        value: Math.max(0, Math.min(100, (20 - volatility) * 5)), // Lower volatility = better score
        status: volatility < 5 ? 'excellent' : volatility < 10 ? 'good' : volatility < 15 ? 'warning' : 'critical',
        icon: '🛡️',
        description: `Portfolio Volatility: ${(volatility * 100).toFixed(1)}%`
      },
      {
        name: 'Diversification',
        value: diversificationScore,
        status: assetCount >= 4 ? 'excellent' : assetCount >= 3 ? 'good' : assetCount >= 2 ? 'warning' : 'critical',
        icon: '🎯',
        description: `Asset Classes: ${assetCount}`
      },
      {
        name: 'Liquidity',
        value: Math.min(100, freeAssetRatio * 10), // Scale 0-10% as 0-100
        status: freeAssetRatio > 8 ? 'excellent' : freeAssetRatio > 5 ? 'good' : freeAssetRatio > 3 ? 'warning' : 'critical',
        icon: '💧',
        description: `Free Asset Ratio: ${freeAssetRatio}%`
      },
      {
        name: 'Balance',
        value: Math.max(0, balanceScore),
        status: maxAllocation < 50 ? 'excellent' : maxAllocation < 60 ? 'good' : maxAllocation < 70 ? 'warning' : 'critical',
        icon: '⚖️',
        description: `Max Allocation: ${maxAllocation.toFixed(1)}%`
      }
    ];

    setHealthMetrics(metrics);

    // Calculate overall health
    const averageScore = metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
    if (averageScore >= 80) setOverallHealth('excellent');
    else if (averageScore >= 60) setOverallHealth('good');
    else if (averageScore >= 40) setOverallHealth('warning');
    else setOverallHealth('critical');
  }, [clientData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getOverallEmoji = () => {
    switch (overallHealth) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚦 {t('budget_health', 'Portfolio Health Monitor')}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {getOverallEmoji()}
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Health Indicator */}
          <div className="text-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative mx-auto w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-2"
            >
              <motion.div
                className={`absolute inset-2 rounded-full ${getStatusBg(overallHealth)}`}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10 text-white font-bold">
                {Math.round(healthMetrics.reduce((sum, m) => sum + m.value, 0) / healthMetrics.length || 0)}
              </span>
            </motion.div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(overallHealth)} border-current`}
            >
              {overallHealth.toUpperCase()} HEALTH
            </Badge>
          </div>

          {/* Health Metrics */}
          <div className="space-y-3">
            {healthMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border"
              >
                <div className="text-2xl">{metric.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{metric.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(metric.status)} border-current`}
                    >
                      {metric.value.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${getStatusBg(metric.status)}`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {metric.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Health Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <div className="font-medium text-blue-700 dark:text-blue-300 text-sm mb-1">
                  {t('health_tip', 'Health Tip')}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {overallHealth === 'excellent' && "Excellent portfolio health! Keep maintaining this balanced approach."}
                  {overallHealth === 'good' && "Good portfolio health. Consider optimizing underperforming areas."}
                  {overallHealth === 'warning' && "Portfolio needs attention. Review risk management and diversification."}
                  {overallHealth === 'critical' && "Immediate portfolio review recommended. Consult with your advisor."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
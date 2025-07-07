import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, InfoIcon, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRebalancingRecommendations } from "@/hooks/use-client-data";
import { ClientData } from "@/hooks/use-client-data";

interface RebalancingRecommendationsProps {
  clientData: ClientData | null;
}

export function RebalancingRecommendations({ clientData }: RebalancingRecommendationsProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: recommendations, isLoading, refetch } = useRebalancingRecommendations(
    clientData?.client?.clientId || null
  );

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'increase':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'decrease':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (!clientData?.client?.clientId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Portfolio Rebalancing</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400 hover:text-[var(--ubs-red)] cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-64">
                    AI-powered portfolio rebalancing recommendations based on your risk tolerance,
                    current allocation, and market conditions.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Select a client to view rebalancing recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <span>Portfolio Rebalancing</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400 hover:text-[var(--ubs-red)] cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-64">
                      AI-powered portfolio rebalancing recommendations based on your risk tolerance,
                      current allocation, and market conditions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : recommendations ? (
            <div className="space-y-6">
              {/* Risk Assessment */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Risk Assessment
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  {recommendations.riskAssessment || "Portfolio risk aligned with client objectives."}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Recommended Actions
                </h4>
                {recommendations.recommendations?.map((rec: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getActionIcon(rec.action)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {rec.assetClass}
                        </span>
                        <Badge className={getActionColor(rec.action)}>
                          {rec.action}
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-600 dark:text-gray-400">
                          {rec.currentAllocation} → {rec.recommendedAllocation}
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rec.reasoning}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Toggle Details */}
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full"
              >
                {isExpanded ? 'Show Less' : 'Show Details'}
              </Button>

              {/* Expected Impact */}
              {recommendations.expectedImpact && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                    Expected Impact
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    {recommendations.expectedImpact}
                  </p>
                </div>
              )}

              {/* Implementation Timeframe */}
              {recommendations.timeframe && (
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Implementation Timeline:</span>
                  <span className="font-medium">{recommendations.timeframe}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No rebalancing recommendations available</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Generate Recommendations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
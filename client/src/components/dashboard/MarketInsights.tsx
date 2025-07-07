import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketInsights } from "@/hooks/use-client-data";

export function MarketInsights() {
  const { t } = useTranslation();
  const { data: insights, isLoading } = useMarketInsights();

  const getBorderColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cio update':
        return 'border-[var(--ubs-red)]';
      case 'recommendation':
        return 'border-blue-500';
      case 'esg':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('market_insights')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('market_insights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights?.length ? (
              insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={`border-l-4 ${getBorderColor(insight.category)} pl-4 cursor-pointer`}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {insight.content}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {getTimeAgo(insight.createdAt)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No market insights available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

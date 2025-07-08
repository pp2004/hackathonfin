import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ClientData } from "@/hooks/use-client-data";
import { Calendar, TrendingUp, Award, Target } from "lucide-react";

interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  achieved: boolean;
  badge: string;
  category: 'portfolio' | 'learning' | 'engagement' | 'achievement';
  value?: string;
  icon: string;
}

interface InvestmentJourneyProps {
  clientData: ClientData | null;
}

export function InvestmentJourney({ clientData }: InvestmentJourneyProps) {
  const { t } = useTranslation();
  const [journeyMilestones, setJourneyMilestones] = useState<JourneyMilestone[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '3m' | '6m' | '1y'>('1y');

  useEffect(() => {
    if (!clientData?.client) return;

    const portfolioValue = parseFloat(clientData.portfolio?.totalValue || '0');
    const ytdReturn = parseFloat(clientData.portfolio?.ytdReturn || '0');
    const clientCreated = new Date(clientData.client.createdAt || Date.now());
    
    // Generate journey milestones based on client data and achievements
    const milestones: JourneyMilestone[] = [
      {
        id: 'account_created',
        title: 'Investment Journey Begins',
        description: 'Welcome to UBS Wealth Management',
        date: clientCreated,
        achieved: true,
        badge: 'Starter',
        category: 'engagement',
        icon: '🚀'
      },
      {
        id: 'first_portfolio',
        title: 'Portfolio Established',
        description: 'Initial investment portfolio created',
        date: new Date(clientCreated.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week after
        achieved: true,
        badge: 'Investor',
        category: 'portfolio',
        value: `$${portfolioValue.toLocaleString()}`,
        icon: '💼'
      },
      {
        id: 'diversified_portfolio',
        title: 'Diversification Achieved',
        description: 'Portfolio spread across multiple asset classes',
        date: new Date(clientCreated.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month after
        achieved: clientData.assetAllocations.length >= 3,
        badge: 'Diversifier',
        category: 'portfolio',
        value: `${clientData.assetAllocations.length} asset classes`,
        icon: '🌈'
      },
      {
        id: 'positive_returns',
        title: 'First Positive Returns',
        description: 'Portfolio showing positive performance',
        date: new Date(clientCreated.getTime() + 90 * 24 * 60 * 60 * 1000), // 3 months after
        achieved: ytdReturn > 0,
        badge: 'Performer',
        category: 'achievement',
        value: `+${ytdReturn.toFixed(1)}% YTD`,
        icon: '📈'
      },
      {
        id: 'risk_balanced',
        title: 'Risk Management Mastery',
        description: 'Optimal risk-return balance achieved',
        date: new Date(clientCreated.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months after
        achieved: clientData.client.riskTolerance !== 'Conservative' || ytdReturn > -2,
        badge: 'Risk Manager',
        category: 'portfolio',
        value: clientData.client.riskTolerance,
        icon: '⚖️'
      },
      {
        id: 'learning_milestone',
        title: 'Financial Knowledge Builder',
        description: 'Completed learning modules',
        date: new Date(clientCreated.getTime() + 60 * 24 * 60 * 60 * 1000), // 2 months after
        achieved: true, // Assume some learning completed
        badge: 'Scholar',
        category: 'learning',
        icon: '🎓'
      },
      {
        id: 'value_milestone',
        title: portfolioValue >= 1000000 ? 'Millionaire Status' : portfolioValue >= 500000 ? 'High Net Worth' : 'Growing Wealth',
        description: portfolioValue >= 1000000 ? 'Reached $1M portfolio value' : portfolioValue >= 500000 ? 'Reached $500K portfolio value' : 'Building wealth steadily',
        date: new Date(clientCreated.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year after
        achieved: portfolioValue >= 100000,
        badge: portfolioValue >= 1000000 ? 'Millionaire' : portfolioValue >= 500000 ? 'High Achiever' : 'Wealth Builder',
        category: 'achievement',
        value: `$${portfolioValue.toLocaleString()}`,
        icon: portfolioValue >= 1000000 ? '👑' : portfolioValue >= 500000 ? '💎' : '💰'
      },
      {
        id: 'consistency',
        title: 'Consistent Investor',
        description: 'Regular engagement with portfolio',
        date: new Date(clientCreated.getTime() + 120 * 24 * 60 * 60 * 1000), // 4 months after
        achieved: true, // Assume regular engagement
        badge: 'Dedicated',
        category: 'engagement',
        icon: '🎯'
      },
      {
        id: 'future_planning',
        title: 'Long-term Vision',
        description: `${clientData.client.investmentHorizon}-year investment plan active`,
        date: new Date(), // Current
        achieved: clientData.client.investmentHorizon > 5,
        badge: 'Visionary',
        category: 'achievement',
        value: `${clientData.client.investmentHorizon} years`,
        icon: '🔮'
      }
    ];

    // Filter by timeframe
    const now = new Date();
    const filtered = milestones.filter(milestone => {
      const daysDiff = (now.getTime() - milestone.date.getTime()) / (1000 * 60 * 60 * 24);
      switch (selectedTimeframe) {
        case '3m': return daysDiff <= 90;
        case '6m': return daysDiff <= 180;
        case '1y': return daysDiff <= 365;
        default: return true;
      }
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setJourneyMilestones(filtered);
  }, [clientData, selectedTimeframe]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'portfolio': return <TrendingUp className="h-4 w-4" />;
      case 'learning': return '🎓';
      case 'engagement': return <Target className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'portfolio': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'learning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'engagement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'achievement': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const achievedCount = journeyMilestones.filter(m => m.achieved).length;
  const totalBadges = new Set(journeyMilestones.filter(m => m.achieved).map(m => m.badge)).size;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            🗺️ {t('investment_journey', 'Investment Journey')}
            <Badge variant="outline">
              <Award className="h-3 w-3 mr-1" />
              {totalBadges} badges
            </Badge>
          </div>
          <div className="flex gap-1">
            {['3m', '6m', '1y', 'all'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className="text-xs h-7"
              >
                {timeframe === 'all' ? 'All' : timeframe.toUpperCase()}
              </Button>
            ))}
          </div>
        </CardTitle>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{achievedCount} milestones achieved</span>
          <span>{journeyMilestones.length} total milestones</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Achievement Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {['Portfolio', 'Learning', 'Engagement', 'Achievement'].map((category) => {
              const categoryMilestones = journeyMilestones.filter(m => 
                m.category === category.toLowerCase() && m.achieved
              );
              return (
                <div key={category} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="text-lg mb-1">{getCategoryIcon(category.toLowerCase())}</div>
                  <div className="font-bold text-lg">{categoryMilestones.length}</div>
                  <div className="text-xs text-gray-500">{category}</div>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 to-orange-300"></div>
            
            <div className="space-y-4">
              {journeyMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg ${
                    milestone.achieved 
                      ? 'bg-green-500 border-green-200 text-white' 
                      : 'bg-gray-300 border-gray-200 text-gray-500'
                  }`}>
                    {milestone.icon}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 p-4 rounded-lg border transition-all ${
                    milestone.achieved 
                      ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{milestone.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {milestone.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getCategoryColor(milestone.category)}>
                          {milestone.badge}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {milestone.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {milestone.value && (
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {milestone.value}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getCategoryColor(milestone.category)}>
                        {milestone.category}
                      </Badge>
                      {milestone.achieved && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Achieved
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Milestones Preview */}
          {journeyMilestones.filter(m => !m.achieved).length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                {t('upcoming_milestones', 'Upcoming Milestones')}
              </h4>
              <div className="space-y-2">
                {journeyMilestones.filter(m => !m.achieved).slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <span>{milestone.icon}</span>
                    <span>{milestone.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
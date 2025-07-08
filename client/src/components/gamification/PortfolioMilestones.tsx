import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ClientData } from "@/hooks/use-client-data";

interface Milestone {
  id: string;
  title: string;
  description: string;
  emoji: string;
  threshold: number;
  achieved: boolean;
  date?: string;
  celebration?: string;
}

interface PortfolioMilestonesProps {
  clientData: ClientData | null;
}

export function PortfolioMilestones({ clientData }: PortfolioMilestonesProps) {
  const { t } = useTranslation();
  const [celebratingMilestone, setCelebratingMilestone] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    if (!clientData?.portfolio) return;

    const portfolioValue = parseFloat(clientData.portfolio.totalValue);
    const ytdReturn = parseFloat(clientData.portfolio.ytdReturn);
    
    const clientMilestones: Milestone[] = [
      {
        id: "first_investment",
        title: "First Investment",
        description: "Welcome to your investment journey!",
        emoji: "🌱",
        threshold: 1000,
        achieved: portfolioValue >= 1000,
        celebration: "🎉 Your investment journey begins!"
      },
      {
        id: "growing_portfolio",
        title: "Growing Portfolio",
        description: "Your portfolio is taking shape",
        emoji: "📈",
        threshold: 100000,
        achieved: portfolioValue >= 100000,
        celebration: "💪 Building wealth steadily!"
      },
      {
        id: "six_figures",
        title: "Six Figures",
        description: "Reached $100K milestone",
        emoji: "💰",
        threshold: 100000,
        achieved: portfolioValue >= 100000,
        celebration: "🚀 Six figures achieved!"
      },
      {
        id: "half_million",
        title: "Half Million",
        description: "Impressive portfolio growth",
        emoji: "💎",
        threshold: 500000,
        achieved: portfolioValue >= 500000,
        celebration: "🏆 Half million milestone!"
      },
      {
        id: "millionaire",
        title: "Millionaire Status",
        description: "Welcome to the millionaire club",
        emoji: "👑",
        threshold: 1000000,
        achieved: portfolioValue >= 1000000,
        celebration: "🎊 Millionaire achieved!"
      },
      {
        id: "positive_return",
        title: "Positive Returns",
        description: "Your investments are growing",
        emoji: "📊",
        threshold: 0,
        achieved: ytdReturn > 0,
        celebration: "📈 Positive growth!"
      },
      {
        id: "strong_performer",
        title: "Strong Performer",
        description: "Above 5% YTD return",
        emoji: "🔥",
        threshold: 5,
        achieved: ytdReturn > 5,
        celebration: "🔥 Excellent performance!"
      },
      {
        id: "diversified",
        title: "Well Diversified",
        description: "Balanced across asset classes",
        emoji: "⚖️",
        threshold: 4,
        achieved: clientData.assetAllocations.length >= 4,
        celebration: "⚖️ Perfect balance!"
      }
    ];

    setMilestones(clientMilestones);
  }, [clientData]);

  const handleCelebrate = (milestone: Milestone) => {
    setCelebratingMilestone(milestone.id);
    setTimeout(() => setCelebratingMilestone(null), 3000);
  };

  const achievedMilestones = milestones.filter(m => m.achieved);
  const nextMilestone = milestones.find(m => !m.achieved);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 {t('portfolio_milestones', 'Portfolio Milestones')}
          <Badge variant="secondary">{achievedMilestones.length}/{milestones.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Achievement Progress */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(achievedMilestones.length / milestones.length) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <span className="text-sm font-medium">
              {Math.round((achievedMilestones.length / milestones.length) * 100)}%
            </span>
          </div>

          {/* Achieved Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievedMilestones.map((milestone) => (
              <motion.div
                key={milestone.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                  onClick={() => handleCelebrate(milestone)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{milestone.emoji}</div>
                    <div className="text-xs font-medium text-green-700 dark:text-green-300">
                      {milestone.title}
                    </div>
                  </div>
                </Button>
                
                <AnimatePresence>
                  {celebratingMilestone === milestone.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap z-10"
                    >
                      {milestone.celebration}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="text-2xl opacity-50">{nextMilestone.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-blue-700 dark:text-blue-300">
                    {t('next_milestone', 'Next Milestone')}: {nextMilestone.title}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {nextMilestone.description}
                  </div>
                  {nextMilestone.threshold && (
                    <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                      Target: ${nextMilestone.threshold.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Celebration Animations */}
          <AnimatePresence>
            {celebratingMilestone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      rotate: 0,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i / 12) * Math.PI * 2) * 200,
                      y: Math.sin((i / 12) * Math.PI * 2) * 200,
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeOut",
                    }}
                    className="absolute text-3xl"
                  >
                    🎉
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
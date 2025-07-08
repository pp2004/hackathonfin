import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/use-translation";
import { ClientData } from "@/hooks/use-client-data";
import { CheckCircle, Play, Trophy, Star } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  completed: boolean;
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  icon: string;
}

interface LearningModulesProps {
  clientData: ClientData | null;
}

export function LearningModules({ clientData }: LearningModulesProps) {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Generate personalized challenges based on client's experience and portfolio
    const experience = clientData?.client?.investmentExperience || 'Beginner';
    const riskTolerance = clientData?.client?.riskTolerance || 'Conservative';
    
    const allChallenges: Challenge[] = [
      {
        id: 'risk_basics',
        title: 'Understanding Risk Tolerance',
        description: 'Learn about different risk levels and their implications',
        category: 'Risk Management',
        difficulty: 'beginner',
        points: 100,
        completed: false,
        question: 'What does "risk tolerance" mean in investing?',
        options: [
          'The amount of money you can afford to lose',
          'Your ability to handle investment volatility emotionally and financially',
          'The maximum return you expect from investments',
          'The time you plan to invest'
        ],
        correctAnswer: 1,
        explanation: 'Risk tolerance refers to your ability and willingness to handle the ups and downs of investment values.',
        icon: '🎯'
      },
      {
        id: 'diversification',
        title: 'Portfolio Diversification',
        description: 'Master the art of spreading investment risk',
        category: 'Portfolio Management',
        difficulty: 'intermediate',
        points: 150,
        completed: false,
        question: 'Which portfolio is better diversified?',
        options: [
          '100% stocks from one company',
          '50% stocks, 30% bonds, 20% real estate',
          '100% government bonds',
          '80% cash, 20% gold'
        ],
        correctAnswer: 1,
        explanation: 'A mix of different asset classes (stocks, bonds, real estate) provides better diversification.',
        icon: '🌈'
      },
      {
        id: 'compound_interest',
        title: 'The Power of Compounding',
        description: 'Understand how your money grows over time',
        category: 'Investment Fundamentals',
        difficulty: 'beginner',
        points: 100,
        completed: false,
        question: 'If you invest $1,000 at 7% annual return, how much will you have after 10 years with compounding?',
        options: [
          '$1,700',
          '$1,967',
          '$2,100',
          '$1,500'
        ],
        correctAnswer: 1,
        explanation: 'With compound interest, $1,000 at 7% annually becomes approximately $1,967 after 10 years.',
        icon: '📈'
      },
      {
        id: 'market_volatility',
        title: 'Managing Market Volatility',
        description: 'Learn strategies for turbulent markets',
        category: 'Risk Management',
        difficulty: 'advanced',
        points: 200,
        completed: false,
        question: 'During market downturns, what is typically the best strategy for long-term investors?',
        options: [
          'Sell everything to avoid further losses',
          'Stay invested and consider dollar-cost averaging',
          'Switch entirely to cash',
          'Only invest in individual stocks'
        ],
        correctAnswer: 1,
        explanation: 'Staying invested and continuing regular investments (dollar-cost averaging) often works best long-term.',
        icon: '🌊'
      },
      {
        id: 'asset_allocation',
        title: 'Strategic Asset Allocation',
        description: 'Optimize your portfolio allocation',
        category: 'Portfolio Management',
        difficulty: 'intermediate',
        points: 150,
        completed: false,
        question: `For a ${riskTolerance.toLowerCase()} investor, which allocation might be most appropriate?`,
        options: [
          '90% stocks, 10% bonds',
          riskTolerance === 'Conservative' ? '30% stocks, 70% bonds' : '60% stocks, 40% bonds',
          '100% stocks',
          '100% bonds'
        ],
        correctAnswer: 1,
        explanation: `${riskTolerance} investors typically benefit from a balanced approach matching their risk profile.`,
        icon: '⚖️'
      },
      {
        id: 'fee_impact',
        title: 'Understanding Investment Fees',
        description: 'Learn how fees affect your returns',
        category: 'Cost Management',
        difficulty: 'intermediate',
        points: 125,
        completed: false,
        question: 'What is the approximate impact of a 1% annual fee on a $100,000 investment over 20 years?',
        options: [
          '$20,000',
          '$45,000',
          '$10,000',
          '$5,000'
        ],
        correctAnswer: 1,
        explanation: 'High fees compound over time. A 1% fee can cost approximately $45,000 over 20 years on a $100,000 investment.',
        icon: '💰'
      }
    ];

    // Personalize challenges based on experience level
    let personalizedChallenges = allChallenges;
    if (experience === 'Beginner') {
      personalizedChallenges = allChallenges.filter(c => c.difficulty !== 'advanced');
    } else if (experience === 'Intermediate') {
      personalizedChallenges = allChallenges.filter(c => c.difficulty !== 'beginner');
    }

    setChallenges(personalizedChallenges);

    // Load completed challenges from localStorage
    const saved = localStorage.getItem(`learning_progress_${clientData?.client?.clientId}`);
    if (saved) {
      const progress = JSON.parse(saved);
      setChallenges(prev => prev.map(c => ({ ...c, completed: progress.includes(c.id) })));
      setTotalPoints(progress.length * 125); // Average points
    }
  }, [clientData]);

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !activeChallenge) return;
    
    setShowResult(true);
    
    if (selectedAnswer === activeChallenge.correctAnswer) {
      // Correct answer
      setTimeout(() => {
        setChallenges(prev => 
          prev.map(c => 
            c.id === activeChallenge.id ? { ...c, completed: true } : c
          )
        );
        setTotalPoints(prev => prev + activeChallenge.points);
        
        // Save progress
        const completedIds = challenges.filter(c => c.completed || c.id === activeChallenge.id).map(c => c.id);
        localStorage.setItem(`learning_progress_${clientData?.client?.clientId}`, JSON.stringify(completedIds));
        
        setActiveChallenge(null);
      }, 3000);
    } else {
      // Wrong answer - close after showing explanation
      setTimeout(() => {
        setActiveChallenge(null);
      }, 4000);
    }
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const progressPercentage = (completedChallenges / challenges.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎓 {t('learning_modules', 'Learning Modules')}
            <Badge variant="outline" className="ml-auto">
              <Trophy className="h-3 w-3 mr-1" />
              {totalPoints} pts
            </Badge>
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('progress', 'Progress')}</span>
              <span>{completedChallenges}/{challenges.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  challenge.completed 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {challenge.points} pts
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {challenge.category}
                      </Badge>
                      {challenge.completed ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Completed</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startChallenge(challenge)}
                          className="text-xs h-7"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenge Modal */}
      <AnimatePresence>
        {activeChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{activeChallenge.icon}</div>
                <h2 className="text-xl font-bold">{activeChallenge.title}</h2>
                <Badge className={getDifficultyColor(activeChallenge.difficulty)}>
                  {activeChallenge.difficulty} • {activeChallenge.points} points
                </Badge>
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  <p className="text-center font-medium">{activeChallenge.question}</p>
                  <div className="space-y-2">
                    {activeChallenge.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        className={`w-full p-3 text-left rounded-lg border transition-all ${
                          selectedAnswer === index
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  {selectedAnswer === activeChallenge.correctAnswer ? (
                    <div className="space-y-2">
                      <div className="text-4xl">🎉</div>
                      <h3 className="text-lg font-bold text-green-600">Correct!</h3>
                      <p className="text-green-600">+{activeChallenge.points} points</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">🤔</div>
                      <h3 className="text-lg font-bold text-orange-600">Not quite right</h3>
                      <p className="text-sm">The correct answer was: {activeChallenge.options?.[activeChallenge.correctAnswer!]}</p>
                    </div>
                  )}
                  {activeChallenge.explanation && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 {activeChallenge.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
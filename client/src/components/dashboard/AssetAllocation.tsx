import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { InvestmentInfoTooltip } from "@/components/ui/info-tooltip";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AssetAllocationProps {
  allocations: Array<{
    id: number;
    assetType: string;
    allocation: string;
    value: string;
  }>;
}

export function AssetAllocation({ allocations }: AssetAllocationProps) {
  const { t } = useTranslation();

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  
  const chartData = {
    labels: allocations.map(a => a.assetType),
    datasets: [{
      data: allocations.map(a => parseFloat(a.allocation)),
      backgroundColor: colors.slice(0, allocations.length),
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            return `${context.label}: ${value}%`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center space-x-2">
            <span>{t('asset_allocation')}</span>
            <InvestmentInfoTooltip term="Asset Allocation" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="chart-container"
            >
              <Doughnut data={chartData} options={options} />
            </motion.div>
            
            <div className="space-y-4">
              {allocations.map((allocation, index) => (
                <motion.div
                  key={allocation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {allocation.assetType}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {parseFloat(allocation.allocation).toFixed(1)}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

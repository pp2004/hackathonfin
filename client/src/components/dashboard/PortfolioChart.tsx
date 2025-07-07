import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PortfolioChartProps {
  performanceData: Array<{
    date: string;
    value: string;
    benchmarkValue: string;
  }>;
}

export function PortfolioChart({ performanceData }: PortfolioChartProps) {
  const { t } = useTranslation();

  const chartData = {
    labels: performanceData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Portfolio Value',
        data: performanceData.map(d => parseFloat(d.value)),
        borderColor: 'hsl(var(--ubs-red))',
        backgroundColor: 'hsla(var(--ubs-red), 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Benchmark',
        data: performanceData.map(d => parseFloat(d.benchmarkValue)),
        borderColor: 'hsl(var(--ubs-gray))',
        backgroundColor: 'hsla(var(--ubs-gray), 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: $${(value / 1000000).toFixed(1)}M`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `$${(value / 1000000).toFixed(1)}M`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              {t('portfolio_performance')}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="default" size="sm">1Y</Button>
              <Button variant="outline" size="sm">3Y</Button>
              <Button variant="outline" size="sm">5Y</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="chart-container"
          >
            <Line data={chartData} options={options} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

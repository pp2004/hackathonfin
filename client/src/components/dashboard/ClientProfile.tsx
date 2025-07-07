import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientData } from "@/hooks/use-client-data";

interface ClientProfileProps {
  clientData: ClientData | null;
}

export function ClientProfile({ clientData }: ClientProfileProps) {
  const { t } = useTranslation();

  const profileItems = [
    { label: 'Client ID', value: clientData?.client?.clientId || '--' },
    { label: 'Investment Experience', value: clientData?.client?.investmentExperience || '--' },
    { label: 'Free Asset Ratio', value: clientData?.client ? `${clientData.client.freeAssetRatio}%` : '--' },
    { label: 'Investment Objective', value: clientData?.client?.investmentObjective || '--' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('client_profile')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex justify-between items-center"
              >
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

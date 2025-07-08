import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { AssetAllocation } from "@/components/dashboard/AssetAllocation";
import { RiskAnalysis } from "@/components/dashboard/RiskAnalysis";
import { ClientProfile } from "@/components/dashboard/ClientProfile";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { LoadingOverlay } from "@/components/dashboard/LoadingOverlay";
import { RebalancingRecommendations } from "@/components/dashboard/RebalancingRecommendations";
import { Transactions } from "@/components/dashboard/Transactions";
import { useClientData, useClients } from "@/hooks/use-client-data";
import { Button } from "@/components/ui/button";
import { ChartLine, Download, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const { toast } = useToast();
  
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: clientData, isLoading: clientDataLoading } = useClientData(selectedClient);

  const handleClientChange = (clientId: string) => {
    setShowLoading(true);
    setSelectedClient(clientId);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setShowLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Download Report' && selectedClient) {
      handleDownloadReport();
    } else {
      toast({
        title: "Action Requested",
        description: `${action} functionality will be implemented soon.`,
      });
    }
  };

  const handleDownloadReport = async () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/clients/${selectedClient}/report`);
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-report-${selectedClient}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Portfolio report downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header 
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        clients={clients || []}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="dashboard">
          <WelcomeSection clientData={clientData || null} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div id="portfolio">
              <PortfolioChart 
                performanceData={clientData?.performance || []} 
              />
              
              <AssetAllocation 
                allocations={clientData?.assetAllocations || []} 
              />
              
              <RiskAnalysis 
                clientData={clientData || null} 
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <ClientProfile 
              clientData={clientData || null} 
            />
            
            <MarketInsights />
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleQuickAction('Portfolio Rebalancing')}
                    className="w-full bg-[var(--ubs-red)] hover:bg-[var(--ubs-red-dark)] text-white"
                  >
                    <ChartLine className="w-4 h-4 mr-2" />
                    Portfolio Rebalancing
                  </Button>
                  <Button 
                    onClick={() => handleQuickAction('Download Report')}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button 
                    onClick={() => handleQuickAction('Schedule Meeting')}
                    variant="outline"
                    className="w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Rebalancing Recommendations */}
        <div id="insights" className="mt-8">
          <RebalancingRecommendations 
            clientData={clientData || null} 
          />
        </div>

        {/* Transactions Section */}
        <div id="transactions" className="mt-8">
          <Transactions 
            clientId={selectedClient} 
          />
        </div>

        {/* Chat Interface */}
        <div id="chat" className="mt-8">
          <ChatInterface 
            clientData={clientData || null} 
          />
        </div>
      </main>
      
      <LoadingOverlay isVisible={showLoading || clientDataLoading} />
    </div>
  );
}

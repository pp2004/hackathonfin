import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export interface ClientData {
  client: {
    id: number;
    clientId: string;
    name: string;
    riskTolerance: string;
    investmentHorizon: number;
    investmentExperience: string;
    freeAssetRatio: string;
    investmentObjective: string;
  };
  portfolio?: {
    id: number;
    totalValue: string;
    ytdReturn: string;
    volatility: string;
    lastUpdated: string;
  };
  assetAllocations: Array<{
    id: number;
    assetType: string;
    allocation: string;
    value: string;
  }>;
  performance: Array<{
    date: string;
    value: string;
    benchmarkValue: string;
  }>;
  chatHistory: Array<{
    id: number;
    message: string;
    response: string;
    timestamp: string;
  }>;
}

export function useClientData(clientId: string | null) {
  return useQuery<ClientData>({
    queryKey: ['/api/clients', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('Client ID is required');
      
      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }
      return response.json();
    },
    enabled: !!clientId,
  });
}

export function useClients() {
  return useQuery({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      return response.json();
    },
  });
}

export function useMarketInsights() {
  return useQuery({
    queryKey: ['/api/market-insights'],
    queryFn: async () => {
      const response = await fetch('/api/market-insights');
      if (!response.ok) {
        throw new Error('Failed to fetch market insights');
      }
      return response.json();
    },
  });
}

export function useRebalancingRecommendations(clientId: string | null) {
  return useQuery({
    queryKey: ['/api/clients', clientId, 'rebalancing'],
    queryFn: async () => {
      if (!clientId) throw new Error('Client ID is required');
      
      const response = await fetch(`/api/clients/${clientId}/rebalancing`);
      if (!response.ok) {
        throw new Error('Failed to fetch rebalancing recommendations');
      }
      return response.json();
    },
    enabled: !!clientId,
  });
}

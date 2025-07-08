import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className = "h-4 w-4 text-gray-400 hover:text-gray-600" }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={className} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Investment-specific tooltips
export const investmentTooltips = {
  "Portfolio Value": "The total current market value of all investments in the portfolio",
  "YTD Return": "Year-to-date return showing the percentage gain or loss from the beginning of the current year",
  "Portfolio Volatility": "A measure of how much the portfolio's value fluctuates over time, indicating investment risk",
  "Risk Tolerance": "The client's ability and willingness to accept investment losses in pursuit of potential gains",
  "Investment Horizon": "The expected time period before the client will need to access their investments",
  "Asset Allocation": "The distribution of investments across different asset classes like stocks, bonds, and alternatives",
  "Free Asset Ratio": "The percentage of assets that are not restricted and can be freely allocated",
  "Investment Experience": "The client's level of knowledge and previous experience with investment products",
  "Investment Objective": "The primary goal the client wants to achieve with their investments",
  "Benchmark Value": "A standard index or portfolio used to compare the performance of the client's investments",
  "Rebalancing": "The process of realigning the weightings of a portfolio by buying or selling assets",
  "Market Insights": "Research and analysis from UBS Chief Investment Office providing market outlook and recommendations"
};

interface InvestmentInfoTooltipProps {
  term: keyof typeof investmentTooltips;
  className?: string;
}

export function InvestmentInfoTooltip({ term, className }: InvestmentInfoTooltipProps) {
  const content = investmentTooltips[term];
  return <InfoTooltip content={content} className={className} />;
}
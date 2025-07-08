import { config } from "dotenv";
import { AzureOpenAI } from "openai";
import {
  Client,
  Portfolio,
  AssetAllocation,
  PortfolioPerformance,
} from "@shared/schema";

// load .env into process.env
config();

export class OpenAIService {
  private client: AzureOpenAI;

  constructor() {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    if (!apiKey || !endpoint || !apiVersion) {
      throw new Error(
        "Missing Azure OpenAI configuration. Check your .env file for AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, and AZURE_OPENAI_API_VERSION."
      );
    }

    this.client = new AzureOpenAI({
      apiKey,
      endpoint,
      apiVersion,
    });
  }

  async getChatResponse(
    message: string,
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[],
    performanceData: PortfolioPerformance[] = []
  ): Promise<string> {
    try {
      const context = this.buildClientContext(
        client,
        portfolio,
        assetAllocations
      );

      const response = await this.client.chat.completions.create({
        model: "o3-mini",
        messages: [
          {
            role: "developer",
            content: [
              {
                type: "text",
                text: `You are an AI financial advisor assistant for UBS Wealth Management. You have access to the client's profile and portfolio data. Provide professional, accurate financial advice and analysis based on the client's specific situation. Always maintain a professional tone and provide actionable insights.

Client Context:
${context}

Guidelines:
- Provide specific, actionable advice
- Reference the client's risk tolerance and investment objectives
- Explain complex financial concepts clearly
- Suggest appropriate UBS products when relevant
- Always consider the client's investment horizon and experience level
- If asked about portfolio rebalancing, provide specific recommendations`,
              },
            ],
          },
          {
            role: "user",
            content: [{ type: "text", text: message }],
          },
        ],
        max_completion_tokens: 25000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.error("No content in response:", JSON.stringify(response, null, 2));
        return "I apologize, but I couldn't generate a response at this time.";
      }

      if (Array.isArray(content)) {
        return content[0]?.text ?? "I apologize, but I couldn't generate a response at this time.";
      }

      return content;
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  async getRebalancingRecommendations(
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[]
  ): Promise<any> {
    try {
      const context = this.buildClientContext(
        client,
        portfolio,
        assetAllocations
      );

      const response = await this.client.chat.completions.create({
        model: "o3-mini",
        messages: [
          {
            role: "developer",
            content: [
              {
                type: "text",
                text: `You are a portfolio rebalancing expert for UBS Wealth Management. Analyze the client's current portfolio allocation and provide specific rebalancing recommendations based on their risk tolerance, investment objectives, and current market conditions.

Client Context:
${context}

Provide your response in JSON format with the following structure:
{
  "recommendations": [
    {
      "action": "increase/decrease/maintain",
      "assetClass": "asset class name",
      "currentAllocation": "current percentage",
      "recommendedAllocation": "recommended percentage",
      "reasoning": "detailed explanation"
    }
  ],
  "riskAssessment": "overall risk assessment",
  "expectedImpact": "expected impact on portfolio performance",
  "timeframe": "recommended implementation timeframe"
}`,
              },
            ],
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please provide portfolio rebalancing recommendations for this client." },
            ],
          },
        ],
        max_completion_tokens: 25000,
      });

      let content: any = response.choices[0]?.message?.content;
      if (Array.isArray(content)) {
        content = content[0]?.text ?? "";
      }

      const clean = content
        .toString()
        .trim()
        .replace(/```json|```/g, "")
        .trim();

      try {
        return JSON.parse(clean);
      } catch {
        console.error("Failed to parse rebalancing JSON:", clean);
        return {
          recommendations: [
            {
              action: "review",
              assetClass: "Portfolio Review Required",
              currentAllocation: "0%",
              recommendedAllocation: "0%",
              reasoning:
                "Unable to generate specific recommendations. Please consult with your advisor for personalized guidance.",
            },
          ],
          riskAssessment: "Assessment pending",
          expectedImpact: "Manual review recommended",
          timeframe: "Immediate consultation suggested",
        };
      }
    } catch (error) {
      console.error("Error generating rebalancing recommendations:", error);
      throw new Error("Failed to generate rebalancing recommendations");
    }
  }

  private buildClientContext(
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[]
  ): string {
    let context = `
Client ID: ${client.clientId}
Risk Tolerance: ${client.riskTolerance}
Investment Horizon: ${client.investmentHorizon} years
Investment Experience: ${client.investmentExperience}
Free Asset Ratio: ${client.freeAssetRatio}%
Investment Objective: ${client.investmentObjective}
`;

    if (portfolio) {
      context += `
Portfolio Value: $${portfolio.totalValue}
YTD Return: ${portfolio.ytdReturn}%
Portfolio Volatility: ${portfolio.volatility}%
`;
    }

    if (assetAllocations.length) {
      context += `
Asset Allocation:
`;
      assetAllocations.forEach((a) => {
        context += `- ${a.assetType}: ${a.allocation}% ($${a.value})
`;
      });
    }

    return context;
  }
}
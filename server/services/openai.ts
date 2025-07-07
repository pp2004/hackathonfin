import OpenAI from "openai";
import { Client, Portfolio, AssetAllocation } from "@shared/schema";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    // Azure OpenAI configuration
    const azureApiKey = "4j8tLKCb6vbV0G3NpvNLDcMNrMQLkyQhsDYYkAIj5uRqmkroikjTJQQJ99BGACYeBjFXJ3w3AAABACOGtqPx";
    const azureEndpoint = "https://openaibuisnesshackathon.openai.azure.com/";
    const azureApiVersion = "2024-02-15-preview";
    const deploymentName = "gpt-4";

    this.openai = new OpenAI({
      apiKey: azureApiKey,
      baseURL: `${azureEndpoint}/openai/deployments/${deploymentName}`,
      defaultQuery: { 'api-version': azureApiVersion },
      defaultHeaders: { 'api-key': azureApiKey },
    });
  }

  async getChatResponse(
    message: string, 
    client: Client, 
    portfolio: Portfolio | undefined, 
    assetAllocations: AssetAllocation[]
  ): Promise<string> {
    try {
      const context = this.buildClientContext(client, portfolio, assetAllocations);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4", // Azure OpenAI deployment model
        messages: [
          {
            role: "system",
            content: `You are an AI financial advisor assistant for UBS Wealth Management. You have access to the client's profile and portfolio data. Provide professional, accurate financial advice and analysis based on the client's specific situation. Always maintain a professional tone and provide actionable insights.

Client Context:
${context}

Guidelines:
- Provide specific, actionable advice
- Reference the client's risk tolerance and investment objectives
- Explain complex financial concepts clearly
- Suggest appropriate UBS products when relevant
- Always consider the client's investment horizon and experience level
- If asked about portfolio rebalancing, provide specific recommendations`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content || "I apologize, but I couldn't generate a response at this time.";
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
      const context = this.buildClientContext(client, portfolio, assetAllocations);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4", // Azure OpenAI deployment model
        messages: [
          {
            role: "system",
            content: `You are a portfolio rebalancing expert for UBS Wealth Management. Analyze the client's current portfolio allocation and provide specific rebalancing recommendations based on their risk tolerance, investment objectives, and current market conditions.

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
}`
          },
          {
            role: "user",
            content: "Please provide portfolio rebalancing recommendations for this client."
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
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

    if (assetAllocations.length > 0) {
      context += `
Asset Allocation:
`;
      assetAllocations.forEach(allocation => {
        context += `- ${allocation.assetType}: ${allocation.allocation}% ($${allocation.value})
`;
      });
    }

    return context;
  }
}

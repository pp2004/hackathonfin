import OpenAI from "openai";
import { Client, Portfolio, AssetAllocation } from "@shared/schema";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    // Azure OpenAI configuration with o3-mini model
    const azureApiKey = process.env.AZURE_OPENAI_KEY || "4j8tLKCb6vbV0G3NpvNLDcMNrMQLkyQhsDYYkAIj5uRqmkroikjTJQQJ99BGACYeBjFXJ3w3AAABACOGtqPx";
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://openaibuisnesshackathon.openai.azure.com";
    const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || "o3-mini";

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
        model: "o3-mini", // Azure OpenAI o3-mini deployment
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
        max_completion_tokens: 500
        // Note: o3-mini model doesn't support temperature parameter
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
        model: "o3-mini", // Azure OpenAI o3-mini deployment
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

        max_completion_tokens: 800
        // Note: o3-mini model doesn't support temperature parameter
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response content received");
      }

      // Clean the response to ensure it's valid JSON
      const cleanContent = content.trim().replace(/```json|```/g, '').trim();
      
      try {
        const result = JSON.parse(cleanContent);
        return result;
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", cleanContent);
        // Return a fallback response
        return {
          recommendations: [
            {
              action: "review",
              assetClass: "Portfolio Review Required", 
              currentAllocation: "0%",
              recommendedAllocation: "0%",
              reasoning: "Unable to generate specific recommendations. Please consult with your advisor for personalized guidance."
            }
          ],
          riskAssessment: "Assessment pending",
          expectedImpact: "Manual review recommended",
          timeframe: "Immediate consultation suggested"
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

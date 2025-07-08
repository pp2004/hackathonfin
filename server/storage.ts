import { 
  clients, 
  portfolios, 
  assetAllocations, 
  portfolioPerformance, 
  marketInsights, 
  chatMessages, 
  investmentGlossary,
  transactions,
  type Client, 
  type InsertClient,
  type Portfolio,
  type InsertPortfolio,
  type AssetAllocation,
  type InsertAssetAllocation,
  type PortfolioPerformance,
  type InsertPortfolioPerformance,
  type MarketInsight,
  type InsertMarketInsight,
  type ChatMessage,
  type InsertChatMessage,
  type InvestmentGlossary,
  type InsertInvestmentGlossary,
  type Transaction,
  type InsertTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClientByClientId(clientId: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  getAllClients(): Promise<Client[]>;
  
  // Portfolio operations
  getPortfolioByClientId(clientId: number): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(portfolioId: number, updates: Partial<InsertPortfolio>): Promise<Portfolio>;
  
  // Asset allocation operations
  getAssetAllocationsByPortfolioId(portfolioId: number): Promise<AssetAllocation[]>;
  createAssetAllocation(allocation: InsertAssetAllocation): Promise<AssetAllocation>;
  updateAssetAllocation(id: number, updates: Partial<InsertAssetAllocation>): Promise<AssetAllocation>;
  
  // Performance operations
  getPortfolioPerformance(portfolioId: number, limit?: number): Promise<PortfolioPerformance[]>;
  createPortfolioPerformance(performance: InsertPortfolioPerformance): Promise<PortfolioPerformance>;
  
  // Market insights operations
  getMarketInsights(limit?: number): Promise<MarketInsight[]>;
  createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight>;
  
  // Chat operations
  getChatHistory(clientId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Glossary operations
  getGlossaryTerms(language?: string): Promise<InvestmentGlossary[]>;
  getGlossaryTerm(term: string, language?: string): Promise<InvestmentGlossary | undefined>;
  createGlossaryTerm(term: InsertInvestmentGlossary): Promise<InvestmentGlossary>;
  
  // Transaction operations
  getTransactionsByClientId(clientId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByClientId(clientId: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.clientId, clientId));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  // Portfolio operations
  async getPortfolioByClientId(clientId: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.clientId, clientId));
    return portfolio || undefined;
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db.insert(portfolios).values(portfolio).returning();
    return newPortfolio;
  }

  async updatePortfolio(portfolioId: number, updates: Partial<InsertPortfolio>): Promise<Portfolio> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(portfolios.id, portfolioId))
      .returning();
    return updatedPortfolio;
  }

  // Asset allocation operations
  async getAssetAllocationsByPortfolioId(portfolioId: number): Promise<AssetAllocation[]> {
    return await db.select().from(assetAllocations).where(eq(assetAllocations.portfolioId, portfolioId));
  }

  async createAssetAllocation(allocation: InsertAssetAllocation): Promise<AssetAllocation> {
    const [newAllocation] = await db.insert(assetAllocations).values(allocation).returning();
    return newAllocation;
  }

  async updateAssetAllocation(id: number, updates: Partial<InsertAssetAllocation>): Promise<AssetAllocation> {
    const [updatedAllocation] = await db
      .update(assetAllocations)
      .set(updates)
      .where(eq(assetAllocations.id, id))
      .returning();
    return updatedAllocation;
  }

  // Performance operations
  async getPortfolioPerformance(portfolioId: number, limit = 12): Promise<PortfolioPerformance[]> {
    return await db
      .select()
      .from(portfolioPerformance)
      .where(eq(portfolioPerformance.portfolioId, portfolioId))
      .orderBy(desc(portfolioPerformance.date))
      .limit(limit);
  }

  async createPortfolioPerformance(performance: InsertPortfolioPerformance): Promise<PortfolioPerformance> {
    const [newPerformance] = await db.insert(portfolioPerformance).values(performance).returning();
    return newPerformance;
  }

  // Market insights operations
  async getMarketInsights(limit = 10): Promise<MarketInsight[]> {
    return await db
      .select()
      .from(marketInsights)
      .orderBy(desc(marketInsights.createdAt))
      .limit(limit);
  }

  async createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight> {
    const [newInsight] = await db.insert(marketInsights).values(insight).returning();
    return newInsight;
  }

  // Chat operations
  async getChatHistory(clientId: number, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.clientId, clientId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Glossary operations
  async getGlossaryTerms(language = "en"): Promise<InvestmentGlossary[]> {
    return await db
      .select()
      .from(investmentGlossary)
      .where(eq(investmentGlossary.language, language));
  }

  async getGlossaryTerm(term: string, language = "en"): Promise<InvestmentGlossary | undefined> {
    const [glossaryTerm] = await db
      .select()
      .from(investmentGlossary)
      .where(and(
        eq(investmentGlossary.term, term),
        eq(investmentGlossary.language, language)
      ));
    return glossaryTerm || undefined;
  }

  async createGlossaryTerm(term: InsertInvestmentGlossary): Promise<InvestmentGlossary> {
    const [newTerm] = await db.insert(investmentGlossary).values(term).returning();
    return newTerm;
  }

  async getTransactionsByClientId(clientId: string, limit = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.clientId, clientId))
      .orderBy(desc(transactions.transactionDate))
      .limit(limit);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }
}

export const storage = new DatabaseStorage();

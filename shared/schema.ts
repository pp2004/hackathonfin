import { pgTable, text, serial, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  clientId: text("client_id").notNull().unique(),
  name: text("name").notNull(),
  riskTolerance: text("risk_tolerance").notNull(), // Conservative, Moderate, Aggressive
  investmentHorizon: integer("investment_horizon").notNull(), // years
  investmentExperience: text("investment_experience").notNull(),
  freeAssetRatio: decimal("free_asset_ratio", { precision: 5, scale: 2 }).notNull(),
  investmentObjective: text("investment_objective").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  ytdReturn: decimal("ytd_return", { precision: 5, scale: 2 }).notNull(),
  volatility: decimal("volatility", { precision: 5, scale: 2 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const assetAllocations = pgTable("asset_allocations", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  assetType: text("asset_type").notNull(), // Equities, Fixed Income, Alternatives, Cash
  allocation: decimal("allocation", { precision: 5, scale: 2 }).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
});

export const portfolioPerformance = pgTable("portfolio_performance", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  date: timestamp("date").notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  benchmarkValue: decimal("benchmark_value", { precision: 15, scale: 2 }).notNull(),
});

export const marketInsights = pgTable("market_insights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // CIO Update, Recommendation, ESG
  priority: text("priority").notNull(), // High, Medium, Low
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const investmentGlossary = pgTable("investment_glossary", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull().default("en"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  clientId: text("client_id").notNull(),
  transactionDate: text("transaction_date").notNull(),
  settlementDate: text("settlement_date"),
  maturityDate: text("maturity_date"),
  orderType: text("order_type"),
  status: text("status"),
  priceType: text("price_type"),
  side: text("side"),
  initiation: text("initiation"),
  timeInForce: text("time_in_force"),
  instrumentId: text("instrument_id"),
  isin: text("isin"),
  quantity: decimal("quantity", { precision: 20, scale: 6 }),
  currency: text("currency"),
  marketValue: decimal("market_value", { precision: 20, scale: 6 }),
  nominalValue: decimal("nominal_value", { precision: 20, scale: 6 }),
  price: decimal("price", { precision: 20, scale: 6 }),
  interestRate: decimal("interest_rate", { precision: 10, scale: 6 }),
  instrumentName: text("instrument_name"),
  assetClass: text("asset_class"),
  instrumentType: text("instrument_type"),
  investmentCategory: text("investment_category"),
  advisoryType: text("advisory_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ one, many }) => ({
  portfolio: one(portfolios),
  chatMessages: many(chatMessages),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  client: one(clients, {
    fields: [transactions.clientId],
    references: [clients.clientId],
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  client: one(clients, {
    fields: [portfolios.clientId],
    references: [clients.id],
  }),
  assetAllocations: many(assetAllocations),
  performance: many(portfolioPerformance),
}));

export const assetAllocationsRelations = relations(assetAllocations, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [assetAllocations.portfolioId],
    references: [portfolios.id],
  }),
}));

export const portfolioPerformanceRelations = relations(portfolioPerformance, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioPerformance.portfolioId],
    references: [portfolios.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  client: one(clients, {
    fields: [chatMessages.clientId],
    references: [clients.id],
  }),
}));

// Insert schemas
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  lastUpdated: true,
});

export const insertAssetAllocationSchema = createInsertSchema(assetAllocations).omit({
  id: true,
});

export const insertPortfolioPerformanceSchema = createInsertSchema(portfolioPerformance).omit({
  id: true,
});

export const insertMarketInsightSchema = createInsertSchema(marketInsights).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertInvestmentGlossarySchema = createInsertSchema(investmentGlossary).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type AssetAllocation = typeof assetAllocations.$inferSelect;
export type InsertAssetAllocation = z.infer<typeof insertAssetAllocationSchema>;
export type PortfolioPerformance = typeof portfolioPerformance.$inferSelect;
export type InsertPortfolioPerformance = z.infer<typeof insertPortfolioPerformanceSchema>;
export type MarketInsight = typeof marketInsights.$inferSelect;
export type InsertMarketInsight = z.infer<typeof insertMarketInsightSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InvestmentGlossary = typeof investmentGlossary.$inferSelect;
export type InsertInvestmentGlossary = z.infer<typeof insertInvestmentGlossarySchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

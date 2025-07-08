import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { OpenAIService } from "./services/openai";
import { ExcelService } from "./services/excel";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });
const openAIService = new OpenAIService();
const excelService = new ExcelService();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Get client by client ID
  app.get("/api/clients/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      const client = await storage.getClientByClientId(clientId);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Get portfolio data
      const portfolio = await storage.getPortfolioByClientId(client.id);
      const assetAllocations = portfolio ? await storage.getAssetAllocationsByPortfolioId(portfolio.id) : [];
      const performance = portfolio ? await storage.getPortfolioPerformance(portfolio.id) : [];
      const chatHistory = await storage.getChatHistory(client.id, 10);

      res.json({
        client,
        portfolio,
        assetAllocations,
        performance,
        chatHistory
      });
    } catch (error) {
      console.error("Error fetching client data:", error);
      res.status(500).json({ error: "Failed to fetch client data" });
    }
  });

  // Create new client
  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(400).json({ error: "Failed to create client" });
    }
  });

  // Import clients from Excel
  app.post("/api/clients/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const clients = await excelService.importClientsFromExcel(req.file.path);
      
      // Create clients in database
      const createdClients = [];
      for (const clientData of clients) {
        try {
          const client = await storage.createClient(clientData);
          createdClients.push(client);
        } catch (error) {
          console.error("Error creating client:", error);
        }
      }

      res.json({
        message: `Successfully imported ${createdClients.length} clients`,
        clients: createdClients
      });
    } catch (error) {
      console.error("Error importing clients:", error);
      res.status(500).json({ error: "Failed to import clients" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { clientId, message } = z.object({
        clientId: z.union([z.string(), z.number()]).transform(val => String(val)),
        message: z.string()
      }).parse(req.body);

      const client = await storage.getClientByClientId(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const portfolio = await storage.getPortfolioByClientId(client.id);
      const assetAllocations = portfolio ? await storage.getAssetAllocationsByPortfolioId(portfolio.id) : [];

      // Use Azure OpenAI o3-mini for AI responses
      const openaiService = new OpenAIService();
      const response = await openaiService.getChatResponse(message, client, portfolio, assetAllocations);

      // Save chat message
      await storage.createChatMessage({
        clientId: client.id,
        message,
        response,
        timestamp: new Date()
      });

      res.json({ response });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get market insights
  app.get("/api/market-insights", async (req, res) => {
    try {
      const insights = await storage.getMarketInsights();
      res.json(insights);
    } catch (error) {
      console.error("Error fetching market insights:", error);
      res.status(500).json({ error: "Failed to fetch market insights" });
    }
  });

  // Get investment glossary
  app.get("/api/glossary", async (req, res) => {
    try {
      const { language = "en" } = req.query;
      const terms = await storage.getGlossaryTerms(language as string);
      res.json(terms);
    } catch (error) {
      console.error("Error fetching glossary:", error);
      res.status(500).json({ error: "Failed to fetch glossary" });
    }
  });

  // Get specific glossary term
  app.get("/api/glossary/:term", async (req, res) => {
    try {
      const { term } = req.params;
      const { language = "en" } = req.query;
      const glossaryTerm = await storage.getGlossaryTerm(term, language as string);
      
      if (!glossaryTerm) {
        return res.status(404).json({ error: "Term not found" });
      }

      res.json(glossaryTerm);
    } catch (error) {
      console.error("Error fetching glossary term:", error);
      res.status(500).json({ error: "Failed to fetch glossary term" });
    }
  });

  // Portfolio rebalancing recommendations
  app.get("/api/clients/:clientId/rebalancing", async (req, res) => {
    try {
      const { clientId } = req.params;
      const client = await storage.getClientByClientId(clientId);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const portfolio = await storage.getPortfolioByClientId(client.id);
      const assetAllocations = portfolio ? await storage.getAssetAllocationsByPortfolioId(portfolio.id) : [];

      const recommendations = await openAIService.getRebalancingRecommendations(client, portfolio, assetAllocations);

      res.json(recommendations);
    } catch (error) {
      console.error("Error generating rebalancing recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

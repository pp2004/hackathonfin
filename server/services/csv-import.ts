import { readFileSync } from 'fs';
import { db } from '../db';
import { 
  clients, 
  portfolios, 
  assetAllocations, 
  portfolioPerformance,
  type InsertClient,
  type InsertPortfolio,
  type InsertAssetAllocation,
  type InsertPortfolioPerformance
} from '@shared/schema';

export class CSVImportService {
  async importPersonaData(filePath: string): Promise<void> {
    console.log('Starting CSV import of 47 client personas...');
    
    // Read CSV file
    const csvContent = readFileSync(filePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    console.log(`Found ${dataLines.length} client records in CSV`);
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const columns = this.parseCSVLine(line);
      
      if (columns.length < 8) {
        console.log(`Skipping invalid line ${i + 2}: ${line}`);
        continue;
      }
      
      const [
        persona,
        maskedId,
        riskTolerance,
        portfolioCCY,
        portfolioRiskBreach,
        portfolioVolatility,
        saaPortfolioVol,
        numPositions
      ] = columns;
      
      // Create client name from persona and masked ID
      const clientName = this.generateClientName(persona, maskedId);
      
      // Determine investment experience based on persona
      const investmentExperience = persona.includes('Established') ? 'High' : 'Medium';
      
      // Calculate portfolio value based on positions and risk level
      const portfolioValue = this.calculatePortfolioValue(
        parseInt(numPositions), 
        portfolioCCY, 
        riskTolerance
      );
      
      // Create client record
      const clientData: InsertClient = {
        clientId: maskedId,
        name: clientName,
        riskTolerance: this.mapRiskTolerance(riskTolerance),
        investmentHorizon: this.getInvestmentHorizon(persona),
        investmentExperience,
        freeAssetRatio: this.calculateFreeAssetRatio(
          parseFloat(portfolioVolatility), 
          parseFloat(saaPortfolioVol)
        ),
        investmentObjective: this.getInvestmentObjective(riskTolerance, persona)
      };

      // Insert client
      const [newClient] = await db.insert(clients).values(clientData).returning();
      
      // Create portfolio record
      const portfolioData: InsertPortfolio = {
        clientId: newClient.id,
        totalValue: portfolioValue.toFixed(2),
        ytdReturn: this.generateYTDReturn(parseFloat(portfolioVolatility)).toFixed(2),
        volatility: (parseFloat(portfolioVolatility) * 100).toFixed(1),
        lastUpdated: new Date()
      };

      const [newPortfolio] = await db.insert(portfolios).values(portfolioData).returning();
      
      // Generate asset allocations based on risk tolerance and persona
      const allocations = this.generateAssetAllocations(riskTolerance, portfolioValue);
      
      for (const allocation of allocations) {
        const allocationData: InsertAssetAllocation = {
          portfolioId: newPortfolio.id,
          assetType: allocation.assetType,
          allocation: allocation.percentage.toFixed(1),
          value: allocation.value.toFixed(2)
        };
        
        await db.insert(assetAllocations).values(allocationData);
      }
      
      // Generate performance data
      const performanceData = this.generatePortfolioPerformance(
        portfolioValue, 
        parseFloat(portfolioVolatility)
      );
      
      for (const performance of performanceData) {
        const performanceRecord: InsertPortfolioPerformance = {
          portfolioId: newPortfolio.id,
          date: performance.date,
          value: performance.value.toFixed(2),
          benchmarkValue: performance.benchmarkValue.toFixed(2)
        };
        
        await db.insert(portfolioPerformance).values(performanceRecord);
      }
      
      console.log(`✓ Imported client ${i + 1}/47: ${clientName} (${maskedId})`);
    }
    
    console.log('✅ CSV import completed successfully!');
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private generateClientName(persona: string, maskedId: string): string {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Amanda'];
    const lastNames = ['Anderson', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    // Use masked ID to consistently generate the same name
    const hash = maskedId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const firstName = firstNames[hash % firstNames.length];
    const lastName = lastNames[(hash + 5) % lastNames.length];
    
    const personaType = persona.includes('Established') ? 'Established' : 'Reactive';
    return `${firstName} ${lastName} (${personaType})`;
  }

  private mapRiskTolerance(riskCode: string): string {
    switch (riskCode) {
      case 'D': return 'Balanced';
      case 'F': return 'Equities';
      case 'A': return 'Conservative';
      case 'B': return 'Moderate Conservative';
      case 'C': return 'Moderate';
      case 'E': return 'Dynamic';
      case 'G': return 'Aggressive';
      default: return 'Balanced';
    }
  }

  private getInvestmentHorizon(persona: string): number {
    // Established investors typically have longer horizons
    return persona.includes('Established') ? 10 : 5;
  }

  private getInvestmentObjective(riskTolerance: string, persona: string): string {
    if (riskTolerance === 'F') return 'Growth';
    if (riskTolerance === 'D') return 'Balanced Growth';
    return 'Capital Preservation';
  }

  private calculateFreeAssetRatio(portfolioVol: number, saaVol: number): string {
    const deviation = Math.abs(portfolioVol - saaVol) / saaVol;
    const freeAssetRatio = Math.min(20, deviation * 100);
    return freeAssetRatio.toFixed(1);
  }

  private calculatePortfolioValue(numPositions: number, currency: string, riskTolerance: string): number {
    let baseValue = numPositions * 50000; // $50k per position base
    
    // Adjust for currency
    const currencyMultiplier = currency === 'USD' ? 1 : currency === 'EUR' ? 0.9 : 0.8;
    baseValue *= currencyMultiplier;
    
    // Adjust for risk tolerance (F = Equities tends to have higher values)
    const riskMultiplier = riskTolerance === 'F' ? 1.5 : 1.0;
    baseValue *= riskMultiplier;
    
    return baseValue;
  }

  private generateYTDReturn(volatility: number): number {
    const baseReturn = 0.08; // 8% base return
    const volatilityFactor = (Math.random() - 0.5) * volatility * 2;
    return (baseReturn + volatilityFactor) * 100;
  }

  private generateAssetAllocations(riskTolerance: string, totalValue: number) {
    const allocations = [];
    
    if (riskTolerance === 'F') {
      // Equities (high risk)
      allocations.push(
        { assetType: 'Equities', percentage: 70, value: totalValue * 0.70 },
        { assetType: 'Fixed Income', percentage: 20, value: totalValue * 0.20 },
        { assetType: 'Alternatives', percentage: 8, value: totalValue * 0.08 },
        { assetType: 'Cash', percentage: 2, value: totalValue * 0.02 }
      );
    } else {
      // Balanced (D)
      allocations.push(
        { assetType: 'Equities', percentage: 50, value: totalValue * 0.50 },
        { assetType: 'Fixed Income', percentage: 35, value: totalValue * 0.35 },
        { assetType: 'Alternatives', percentage: 10, value: totalValue * 0.10 },
        { assetType: 'Cash', percentage: 5, value: totalValue * 0.05 }
      );
    }
    
    return allocations;
  }

  private generatePortfolioPerformance(baseValue: number, volatility: number) {
    const performances = [];
    const startDate = new Date('2024-01-01');
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const growthFactor = 1 + (0.08 / 12); // 8% annual growth
      const volatilityFactor = 1 + (Math.random() - 0.5) * volatility;
      
      const portfolioValue = baseValue * Math.pow(growthFactor, i) * volatilityFactor;
      const benchmarkValue = baseValue * Math.pow(1.06 / 12 + 1, i) * (1 + (Math.random() - 0.5) * 0.05);
      
      performances.push({
        date,
        value: portfolioValue,
        benchmarkValue
      });
    }
    
    return performances;
  }
}
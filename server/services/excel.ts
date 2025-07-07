import * as XLSX from 'xlsx';
import { InsertClient } from "@shared/schema";

export class ExcelService {
  async importClientsFromExcel(filePath: string): Promise<InsertClient[]> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const clients: InsertClient[] = [];

      for (const row of data) {
        try {
          const client = this.mapExcelRowToClient(row as any);
          clients.push(client);
        } catch (error) {
          console.error("Error processing row:", error);
        }
      }

      return clients;
    } catch (error) {
      console.error("Error reading Excel file:", error);
      throw new Error("Failed to import clients from Excel");
    }
  }

  private mapExcelRowToClient(row: any): InsertClient {
    // Map Excel columns to client fields
    // Adjust these mappings based on your Excel structure
    return {
      clientId: row['Client ID'] || row['ClientID'] || `WM-${String(row['ID'] || '').padStart(3, '0')}`,
      name: row['Name'] || row['Client Name'] || 'Unknown Client',
      riskTolerance: this.mapRiskTolerance(row['Risk Tolerance'] || row['RiskTolerance'] || 'Moderate'),
      investmentHorizon: parseInt(row['Investment Horizon'] || row['InvestmentHorizon'] || '5'),
      investmentExperience: this.mapInvestmentExperience(row['Investment Experience'] || row['InvestmentExperience'] || 'Moderate'),
      freeAssetRatio: parseFloat(row['Free Asset Ratio'] || row['FreeAssetRatio'] || '75'),
      investmentObjective: row['Investment Objective'] || row['InvestmentObjective'] || 'Growth'
    };
  }

  private mapRiskTolerance(value: string): string {
    const normalized = value.toLowerCase();
    if (normalized.includes('conservative') || normalized.includes('low')) return 'Conservative';
    if (normalized.includes('aggressive') || normalized.includes('high')) return 'Aggressive';
    return 'Moderate';
  }

  private mapInvestmentExperience(value: string): string {
    const normalized = value.toLowerCase();
    if (normalized.includes('beginner') || normalized.includes('novice')) return 'Beginner';
    if (normalized.includes('experienced') || normalized.includes('expert')) return 'Experienced';
    return 'Moderate';
  }
}

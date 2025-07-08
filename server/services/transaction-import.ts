import { promises as fs } from 'fs';
import { db } from '../db';
import { transactions, type InsertTransaction } from '@shared/schema';

export class TransactionImportService {
  async importTransactionsFromCSV(filePath: string): Promise<void> {
    try {
      const csvContent = await fs.readFile(filePath, 'utf-8');
      const lines = csvContent.trim().split('\n');
      
      // Skip header row if present
      const dataLines = lines.slice(1);
      
      const transactionData: InsertTransaction[] = [];
      
      for (const line of dataLines) {
        const columns = this.parseCSVLine(line);
        
        if (columns.length >= 22) {
          const transaction: InsertTransaction = {
            clientId: columns[1] || '',
            transactionDate: columns[0] || '',
            settlementDate: columns[4] || null,
            maturityDate: columns[5] || null,
            orderType: columns[6] || null,
            status: columns[8] || null,
            priceType: columns[9] || null,
            side: columns[10] || null,
            initiation: columns[11] || null,
            timeInForce: columns[12] || null,
            instrumentId: columns[15] || null,
            isin: columns[17] || null,
            quantity: columns[19] ? parseFloat(columns[19]) : null,
            currency: columns[20] || null,
            marketValue: columns[21] ? parseFloat(columns[21]) : null,
            nominalValue: columns[22] ? parseFloat(columns[22]) : null,
            price: columns[23] ? parseFloat(columns[23]) : null,
            interestRate: columns[25] ? parseFloat(columns[25]) : null,
            instrumentName: columns[35] || null,
            assetClass: columns[36] || null,
            instrumentType: columns[37] || null,
            investmentCategory: columns[38] || null,
            advisoryType: columns[42] || null,
          };
          
          transactionData.push(transaction);
        }
      }
      
      // Insert transactions in batches
      const batchSize = 100;
      for (let i = 0; i < transactionData.length; i += batchSize) {
        const batch = transactionData.slice(i, i + batchSize);
        await db.insert(transactions).values(batch);
      }
      
      console.log(`Successfully imported ${transactionData.length} transactions`);
    } catch (error) {
      console.error('Error importing transactions:', error);
      throw error;
    }
  }
  
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
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
}
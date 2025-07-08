import { db } from './db';
import { clients, transactions } from '@shared/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

async function importTransactions() {
  try {
    console.log('Importing transaction data from CSV...');

    // Read the transactions CSV file
    const csvPath = join(process.cwd(), '..', 'attached_assets', 'Transactions-Table 1_1751953618135.csv');
    const csvData = readFileSync(csvPath, 'utf-8');
    const lines = csvData.split('\n').slice(1); // Skip header

    let transactionCount = 0;

    for (const line of lines) {
      if (!line.trim()) continue;

      const columns = parseCSVLine(line);
      if (columns.length < 10) continue;

      const [
        date, clientId, transactionType, , , , , , status, , 
        action, , , , , , , , , , amount, currency, , , , , 
        , , , , , , , , , instrumentName, assetClass
      ] = columns;

      // Find matching client in our database
      const [client] = await db.select().from(clients).where(
        db.sql`client_id = ${clientId}`
      );

      if (!client) {
        console.log(`Client ${clientId} not found, skipping transaction`);
        continue;
      }

      // Create transaction record
      await db.insert(transactions).values({
        clientId: client.clientId,
        date: new Date(date).toISOString().split('T')[0],
        type: mapTransactionType(transactionType, action),
        instrument: instrumentName || 'Unknown',
        amount: parseFloat(amount) || 0,
        currency: currency || 'USD',
        status: status === 'ACTIVE' ? 'Completed' : status === 'FILLED' ? 'Completed' : 'Pending'
      });

      transactionCount++;
    }

    console.log(`Successfully imported ${transactionCount} transactions`);
  } catch (error) {
    console.error('Error importing transactions:', error);
    throw error;
  }
}

function parseCSVLine(line: string): string[] {
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

function mapTransactionType(type: string, action: string): string {
  if (type === 'DEPOSIT') return 'Deposit';
  if (action === 'BUY') return 'Buy';
  if (action === 'SELL') return 'Sell';
  return 'Other';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importTransactions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { importTransactions };
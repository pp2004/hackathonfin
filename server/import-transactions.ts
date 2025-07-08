import { TransactionImportService } from './services/transaction-import';

async function importTransactions() {
  const transactionService = new TransactionImportService();
  
  try {
    await transactionService.importTransactionsFromCSV('../attached_assets/Transactions-Table 1_1751952882477.csv');
    console.log('Transaction import completed successfully');
  } catch (error) {
    console.error('Transaction import failed:', error);
  }
}

importTransactions();
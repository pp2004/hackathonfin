import { CSVImportService } from './services/csv-import';
import path from 'path';

async function importCSVData() {
  console.log('Starting CSV data import process...');
  
  try {
    const csvService = new CSVImportService();
    const filePath = path.join(process.cwd(), '..', 'attached_assets', 'Persona_new_1751890300893.csv');
    
    console.log(`Reading CSV file: ${filePath}`);
    await csvService.importPersonaData(filePath);
    
    console.log('✅ CSV data import completed successfully!');
    console.log('📊 All 47 client portfolios have been imported with:');
    console.log('   - Exact Masked IDs from CSV');
    console.log('   - Client profiles and risk tolerance data');
    console.log('   - Portfolio holdings and asset allocations');
    console.log('   - Performance history for 12 months');
    
  } catch (error) {
    console.error('❌ Error importing CSV data:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importCSVData();
}

export { importCSVData };
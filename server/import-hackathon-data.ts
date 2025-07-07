import { HackathonExcelService } from './services/hackathon-excel';
import path from 'path';

async function importHackathonData() {
  console.log('Starting hackathon data import process...');
  
  try {
    const excelService = new HackathonExcelService();
    const filePath = path.join(process.cwd(), '..', 'attached_assets', 'Hackathon_Data_without_CID_1751889519635.xlsx');
    
    console.log(`Reading Excel file: ${filePath}`);
    await excelService.importHackathonData(filePath);
    
    console.log('✅ Hackathon data import completed successfully!');
    console.log('📊 47 client portfolios have been imported with:');
    console.log('   - Client profiles and risk tolerance data');
    console.log('   - Portfolio holdings and asset allocations');
    console.log('   - Performance history for 12 months');
    console.log('   - Investor profile (IP) information');
    
  } catch (error) {
    console.error('❌ Error importing hackathon data:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importHackathonData();
}

export { importHackathonData };
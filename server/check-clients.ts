import { db } from './db';
import { clients } from '../shared/schema';

async function checkClients() {
  try {
    const result = await db.select().from(clients);
    console.log('Total clients in database:', result.length);
    
    if (result.length > 0) {
      console.log('Sample clients:');
      result.slice(0, 10).forEach(client => {
        console.log(`- ${client.clientId}: ${client.name}`);
      });
    } else {
      console.log('No clients found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking clients:', error);
    process.exit(1);
  }
}

checkClients();
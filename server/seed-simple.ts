import { db } from './db';
import { clients, portfolios, assetAllocations, portfolioPerformance } from '@shared/schema';

// All 47 masked client IDs from the Persona CSV
const personaData = [
  { maskedId: 'A7GBHDVRRZ8Y774A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 30 },
  { maskedId: 'ATPBHDVRR2ACLMKA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 30 },
  { maskedId: 'AUABHDVRR2A4Z5SA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 39 },
  { maskedId: 'AWKBHDVRR2DZTYYA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 36 },
  { maskedId: 'AXFBHDVSA5RUNKXA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 37 },
  { maskedId: 'A2WBHDVRR2FFKQNA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'AV3BHDVSZ9GSFLKA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 9 },
  { maskedId: 'BCTBHDVRR2BHW29A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'A3FBHDVSRGFTE49A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 9 },
  { maskedId: 'BANBHDVR42Z9NXZA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 7 },
  { maskedId: 'BRLBHDVRR2ER9ZNA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 11 },
  { maskedId: 'BNBBHDVRR2EZWL6A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 29 },
  { maskedId: 'AUJBHDVRR2C2TQUA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 18 },
  { maskedId: 'A3GBHDVS6BD6NEEA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 5 },
  { maskedId: 'AZXBHDVTZSRT5RHA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 11 },
  { maskedId: 'A6ZBHDVRR2DBNCMA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 28 },
  { maskedId: 'BAJBHDVRR2EWG2AA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 14 },
  { maskedId: 'A5MBHDVVE3M58U4A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 20 },
  { maskedId: 'A8WBHDVVAM6GLWDA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'SGD', numPositions: 12 },
  { maskedId: 'A8ZBHDVTZEURRHQA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'BH5BHDVSR9576KXA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 7 },
  { maskedId: 'A2PBHDVRR2CQCENA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 16 },
  { maskedId: 'BJVBHDVRRZ8RA3TA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'BA4BHDVRR2J7JYPA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'EUR', numPositions: 9 },
  { maskedId: 'BDUBHDVRR2FB9BEA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 62 },
  { maskedId: 'A4BBHDVR5RUT4PUA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 16 },
  { maskedId: 'A3FBHDVRR2FKRHHA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 22 },
  { maskedId: 'A4NBHDVRR2F5P8KA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 29 },
  { maskedId: 'A4UBHDVRR2FXXDSA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 15 },
  { maskedId: 'A76BHDVRR2FYH9EA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 26 },
  { maskedId: 'BKBBHDVRR2CD38CA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 31 },
  { maskedId: 'AZ2BHDVRR2C2DNYA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 35 },
  { maskedId: 'AZ4BHDVSHCDVPJMA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 38 },
  { maskedId: 'AW5BHDVS88K4TSNA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 18 },
  { maskedId: 'AYFBHDVSQYG9DN6A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 34 },
  { maskedId: 'A5NBHDVRR2D94D4A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 25 },
  { maskedId: 'A3XBHDVT653CGGDA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 19 },
  { maskedId: 'A62BHDVRR2EM3Y6A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 17 },
  { maskedId: 'AV3BHDVSPBDR2USA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 34 },
  { maskedId: 'A4XBHDVRR2GDW64A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'A4HBHDVRR2FMQXGA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'A6DBHDVVDUJT5G5A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 12 },
  { maskedId: 'AULBHDVRR2EP38MA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'A5VBHDVRR2EJAPZA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'BH2BHDVRR2AZFH3A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 14 },
  { maskedId: 'A2JBHDVRR2FK5VWA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 12 },
  { maskedId: 'BHHBHDVR6LEEXFZA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 12 }
];

async function seedSimple() {
  try {
    console.log('Starting simple seeding of 47 clients...');

    // Clear existing data
    await db.delete(portfolioPerformance);
    await db.delete(assetAllocations);
    await db.delete(portfolios);
    await db.delete(clients);

    console.log('Cleared existing data');

    for (const [index, data] of personaData.entries()) {
      console.log(`Creating client ${index + 1}/47: ${data.maskedId}`);
      
      // Create client - no timestamps, let defaults handle it
      const [client] = await db.insert(clients).values({
        clientId: data.maskedId,
        name: `${data.persona.replace(' Investor', '')} Client ${data.maskedId.slice(-4)}`,
        riskTolerance: data.riskTolerance === 'D' ? 'Balanced' : 'Aggressive',
        investmentHorizon: data.persona === 'Reactive Investor' ? 3 : 7,
        investmentExperience: data.persona === 'Reactive Investor' ? 'Intermediate' : 'Advanced',
        freeAssetRatio: '12.5',
        investmentObjective: data.riskTolerance === 'F' ? 'Long-term growth' : 'Balanced growth and income'
      }).returning();

      // Create portfolio - no timestamps, let defaults handle it
      const portfolioValue = data.numPositions * 50000;
      const [portfolio] = await db.insert(portfolios).values({
        clientId: client.id,
        totalValue: portfolioValue.toString(),
        ytdReturn: (Math.random() * 0.3 - 0.1).toFixed(4),
        volatility: data.riskTolerance === 'F' ? '0.25' : '0.08'
      }).returning();

      // Create asset allocations
      const allocations = data.riskTolerance === 'F' 
        ? [
            { assetType: 'Equities', allocation: '70', value: (portfolioValue * 0.7).toString() },
            { assetType: 'Bonds', allocation: '15', value: (portfolioValue * 0.15).toString() },
            { assetType: 'Alternatives', allocation: '10', value: (portfolioValue * 0.1).toString() },
            { assetType: 'Cash', allocation: '5', value: (portfolioValue * 0.05).toString() }
          ]
        : [
            { assetType: 'Equities', allocation: '50', value: (portfolioValue * 0.5).toString() },
            { assetType: 'Bonds', allocation: '33', value: (portfolioValue * 0.33).toString() },
            { assetType: 'Alternatives', allocation: '12', value: (portfolioValue * 0.12).toString() },
            { assetType: 'Cash', allocation: '5', value: (portfolioValue * 0.05).toString() }
          ];

      for (const allocation of allocations) {
        await db.insert(assetAllocations).values({
          portfolioId: portfolio.id,
          assetType: allocation.assetType,
          allocation: allocation.allocation,
          value: allocation.value
        });
      }

      // Create 12 months of performance data
      const months = ['2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01', '2024-06-01', 
                     '2024-07-01', '2024-08-01', '2024-09-01', '2024-10-01', '2024-11-01', '2024-12-01'];
      
      let currentValue = portfolioValue;
      let benchmarkValue = portfolioValue;

      for (const month of months) {
        const monthlyReturn = (Math.random() - 0.5) * 0.06;
        currentValue *= (1 + monthlyReturn);
        
        const benchmarkReturn = (Math.random() - 0.5) * 0.02;
        benchmarkValue *= (1 + benchmarkReturn);

        await db.insert(portfolioPerformance).values({
          portfolioId: portfolio.id,
          date: month,
          value: Math.round(currentValue).toString(),
          benchmarkValue: Math.round(benchmarkValue).toString()
        });
      }
    }

    console.log('Successfully seeded all 47 clients with complete data!');
  } catch (error) {
    console.error('Error seeding:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSimple()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedSimple };
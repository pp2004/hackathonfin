import { Client, Portfolio, AssetAllocation, PortfolioPerformance } from '@shared/schema';

export class HTMLReportService {
  generateHTMLReport(
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[],
    performanceData: PortfolioPerformance[]
  ): string {
    const formatCurrency = (value: string) => {
      return parseFloat(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short',
        day: 'numeric'
      });
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>UBS Wealth Management - Client Portfolio Report</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
                background: #f8f9fa;
            }
            .report-container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #e60028, #b8001f);
                color: white;
                text-align: center;
                padding: 40px 20px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .header h1 {
                margin: 15px 0 5px 0;
                font-size: 24px;
            }
            .header p {
                margin: 0;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .client-info {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 8px;
                margin-bottom: 30px;
                border-left: 4px solid #e60028;
            }
            .client-info h2 {
                margin-top: 0;
                color: #e60028;
                font-size: 20px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .info-item {
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .info-label {
                font-weight: 600;
                color: #666;
                font-size: 14px;
            }
            .info-value {
                font-size: 16px;
                color: #333;
                margin-top: 2px;
            }
            .portfolio-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .metric-card {
                background: white;
                border: 2px solid #f0f0f0;
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                transition: all 0.3s ease;
            }
            .metric-card:hover {
                border-color: #e60028;
                transform: translateY(-2px);
            }
            .metric-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .metric-value {
                font-size: 28px;
                font-weight: bold;
                color: #e60028;
            }
            .section-title {
                font-size: 20px;
                font-weight: bold;
                color: #e60028;
                margin: 40px 0 20px 0;
                padding-bottom: 10px;
                border-bottom: 3px solid #e60028;
                position: relative;
            }
            .allocation-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .allocation-table th {
                background: #e60028;
                color: white;
                padding: 15px;
                text-align: left;
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .allocation-table td {
                padding: 15px;
                border-bottom: 1px solid #f0f0f0;
                font-size: 15px;
            }
            .allocation-table tr:hover {
                background: #f8f9fa;
            }
            .performance-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            .performance-item {
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s ease;
            }
            .performance-item:hover {
                border-color: #e60028;
                box-shadow: 0 4px 8px rgba(230, 0, 40, 0.1);
            }
            .performance-date {
                font-weight: 600;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            .performance-value {
                font-size: 18px;
                font-weight: bold;
                color: #e60028;
            }
            .footer {
                background: #f8f9fa;
                margin-top: 40px;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
            }
            .footer p {
                margin: 5px 0;
                font-size: 12px;
                color: #666;
            }
            .disclaimer {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                font-size: 13px;
                color: #856404;
            }
            @media print {
                body { background: white; }
                .report-container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <div class="logo">UBS Wealth Management</div>
                <h1>Client Portfolio Report</h1>
                <p>Generated on ${currentDate}</p>
            </div>

            <div class="content">
                <div class="client-info">
                    <h2>Client Information</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Client ID</div>
                            <div class="info-value">${client.clientId}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Client Name</div>
                            <div class="info-value">${client.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Risk Tolerance</div>
                            <div class="info-value">${client.riskTolerance}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Investment Horizon</div>
                            <div class="info-value">${client.investmentHorizon} years</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Investment Experience</div>
                            <div class="info-value">${client.investmentExperience}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Investment Objective</div>
                            <div class="info-value">${client.investmentObjective}</div>
                        </div>
                    </div>
                </div>

                ${portfolio ? `
                <div class="section-title">Portfolio Overview</div>
                <div class="portfolio-overview">
                    <div class="metric-card">
                        <div class="metric-label">Total Portfolio Value</div>
                        <div class="metric-value">${formatCurrency(portfolio.totalValue)}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">YTD Return</div>
                        <div class="metric-value">${portfolio.ytdReturn}%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Portfolio Volatility</div>
                        <div class="metric-value">${portfolio.volatility}%</div>
                    </div>
                </div>
                ` : ''}

                ${assetAllocations.length > 0 ? `
                <div class="section-title">Asset Allocation</div>
                <table class="allocation-table">
                    <thead>
                        <tr>
                            <th>Asset Type</th>
                            <th>Allocation %</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assetAllocations.map(allocation => `
                        <tr>
                            <td>${allocation.assetType}</td>
                            <td>${allocation.allocation}%</td>
                            <td>${formatCurrency(allocation.value)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : ''}

                ${performanceData.length > 0 ? `
                <div class="section-title">Recent Performance History</div>
                <div class="performance-grid">
                    ${performanceData.slice(0, 8).map(performance => `
                    <div class="performance-item">
                        <div class="performance-date">${formatDate(performance.date)}</div>
                        <div class="performance-value">${formatCurrency(performance.value)}</div>
                    </div>
                    `).join('')}
                </div>
                ` : ''}

                <div class="disclaimer">
                    <strong>Important Notice:</strong> This report contains confidential information and is intended solely for the named client. 
                    Past performance does not guarantee future results. All investments carry risk and may lose value.
                </div>
            </div>

            <div class="footer">
                <p><strong>UBS Wealth Management</strong></p>
                <p>This report is confidential and intended solely for the use of UBS Wealth Management clients.</p>
                <p>© ${new Date().getFullYear()} UBS Group AG. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
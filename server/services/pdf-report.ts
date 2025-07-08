import htmlPdf from 'html-pdf-node';
import { Client, Portfolio, AssetAllocation, PortfolioPerformance } from '@shared/schema';

export class PDFReportService {
  async generatePDFReport(
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[],
    performanceData: PortfolioPerformance[]
  ): Promise<Buffer> {
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

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>UBS Wealth Management - Portfolio Report</title>
        <style>
            @page {
                margin: 20mm 15mm;
                size: A4;
            }
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                font-size: 12px;
            }
            .header {
                text-align: center;
                border-bottom: 4px solid #e60028;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                color: #e60028;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .header h1 {
                margin: 10px 0 5px 0;
                font-size: 20px;
                color: #333;
            }
            .header p {
                margin: 0;
                color: #666;
                font-size: 11px;
            }
            .client-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
                border-left: 4px solid #e60028;
            }
            .client-section h2 {
                margin-top: 0;
                color: #e60028;
                font-size: 16px;
                margin-bottom: 15px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .info-item {
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .info-label {
                font-weight: 600;
                color: #666;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .info-value {
                font-size: 12px;
                color: #333;
                margin-top: 2px;
            }
            .metrics-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;
                margin-bottom: 25px;
            }
            .metric-card {
                background: white;
                border: 2px solid #f0f0f0;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            .metric-label {
                font-size: 10px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
                font-weight: 600;
            }
            .metric-value {
                font-size: 18px;
                font-weight: bold;
                color: #e60028;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #e60028;
                margin: 25px 0 15px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #e60028;
            }
            .allocation-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background: white;
                border-radius: 6px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .allocation-table th {
                background: #e60028;
                color: white;
                padding: 12px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .allocation-table td {
                padding: 10px;
                border-bottom: 1px solid #f0f0f0;
                font-size: 11px;
            }
            .performance-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }
            .performance-item {
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 12px;
                text-align: center;
            }
            .performance-date {
                font-weight: 600;
                color: #666;
                font-size: 10px;
                text-transform: uppercase;
                margin-bottom: 4px;
            }
            .performance-value {
                font-size: 14px;
                font-weight: bold;
                color: #e60028;
            }
            .footer {
                background: #f8f9fa;
                margin-top: 30px;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
                page-break-inside: avoid;
            }
            .footer p {
                margin: 3px 0;
                font-size: 10px;
                color: #666;
            }
            .disclaimer {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 4px;
                padding: 12px;
                margin: 15px 0;
                font-size: 10px;
                color: #856404;
                line-height: 1.4;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">UBS Wealth Management</div>
            <h1>Client Portfolio Report</h1>
            <p>Generated on ${currentDate}</p>
        </div>

        <div class="client-section">
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
        <div class="metrics-row">
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

        <div class="footer">
            <p><strong>UBS Wealth Management</strong></p>
            <p>This report is confidential and intended solely for the use of UBS Wealth Management clients.</p>
            <p>© ${new Date().getFullYear()} UBS Group AG. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;

    const options = {
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    };

    const file = { content: htmlContent };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    return pdfBuffer;
  }
}
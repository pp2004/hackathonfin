import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { Client, Portfolio, AssetAllocation, PortfolioPerformance } from '@shared/schema';

export class ReportGeneratorService {
  private generateReportHTML(
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[],
    performanceData: PortfolioPerformance[]
  ): string {
    const templateSource = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '    <meta charset="utf-8">',
      '    <title>UBS Wealth Management - Client Portfolio Report</title>',
      '    <style>',
      '        body {',
      '            font-family: Arial, sans-serif;',
      '            line-height: 1.6;',
      '            color: #333;',
      '            max-width: 800px;',
      '            margin: 0 auto;',
      '            padding: 20px;',
      '        }',
      '        .header {',
      '            text-align: center;',
      '            border-bottom: 3px solid #e60028;',
      '            padding-bottom: 20px;',
      '            margin-bottom: 30px;',
      '        }',
      '        .logo {',
      '            color: #e60028;',
      '            font-size: 24px;',
      '            font-weight: bold;',
      '            margin-bottom: 10px;',
      '        }',
      '        .client-info {',
      '            background: #f8f9fa;',
      '            padding: 20px;',
      '            border-radius: 8px;',
      '            margin-bottom: 30px;',
      '        }',
      '        .portfolio-overview {',
      '            display: grid;',
      '            grid-template-columns: repeat(3, 1fr);',
      '            gap: 20px;',
      '            margin-bottom: 30px;',
      '        }',
      '        .metric-card {',
      '            background: white;',
      '            border: 1px solid #ddd;',
      '            border-radius: 8px;',
      '            padding: 15px;',
      '            text-align: center;',
      '        }',
      '        .metric-label {',
      '            font-size: 12px;',
      '            color: #666;',
      '            text-transform: uppercase;',
      '            margin-bottom: 5px;',
      '        }',
      '        .metric-value {',
      '            font-size: 24px;',
      '            font-weight: bold;',
      '            color: #e60028;',
      '        }',
      '        .section-title {',
      '            font-size: 18px;',
      '            font-weight: bold;',
      '            color: #e60028;',
      '            margin: 30px 0 15px 0;',
      '            border-bottom: 2px solid #e60028;',
      '            padding-bottom: 5px;',
      '        }',
      '        .allocation-table {',
      '            width: 100%;',
      '            border-collapse: collapse;',
      '            margin-bottom: 20px;',
      '        }',
      '        .allocation-table th,',
      '        .allocation-table td {',
      '            padding: 12px;',
      '            text-align: left;',
      '            border-bottom: 1px solid #ddd;',
      '        }',
      '        .allocation-table th {',
      '            background-color: #f8f9fa;',
      '            font-weight: bold;',
      '        }',
      '        .performance-grid {',
      '            display: grid;',
      '            grid-template-columns: repeat(4, 1fr);',
      '            gap: 10px;',
      '            margin-bottom: 20px;',
      '        }',
      '        .performance-item {',
      '            text-align: center;',
      '            padding: 10px;',
      '            background: #f8f9fa;',
      '            border-radius: 4px;',
      '        }',
      '        .footer {',
      '            margin-top: 50px;',
      '            padding-top: 20px;',
      '            border-top: 1px solid #ddd;',
      '            text-align: center;',
      '            font-size: 12px;',
      '            color: #666;',
      '        }',
      '    </style>',
      '</head>',
      '<body>',
      '    <div class="header">',
      '        <div class="logo">UBS Wealth Management</div>',
      '        <h1>Client Portfolio Report</h1>',
      '        <p>Generated on {{reportDate}}</p>',
      '    </div>',
      '',
      '    <div class="client-info">',
      '        <h2>Client Information</h2>',
      '        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">',
      '            <div><strong>Client ID:</strong> {{client.clientId}}</div>',
      '            <div><strong>Name:</strong> {{client.name}}</div>',
      '            <div><strong>Risk Tolerance:</strong> {{client.riskTolerance}}</div>',
      '            <div><strong>Investment Horizon:</strong> {{client.investmentHorizon}} years</div>',
      '            <div><strong>Investment Experience:</strong> {{client.investmentExperience}}</div>',
      '            <div><strong>Investment Objective:</strong> {{client.investmentObjective}}</div>',
      '        </div>',
      '    </div>',
      '',
      '    {{#if portfolio}}',
      '    <div class="portfolio-overview">',
      '        <div class="metric-card">',
      '            <div class="metric-label">Total Portfolio Value</div>',
      '            <div class="metric-value">${{formatCurrency portfolio.totalValue}}</div>',
      '        </div>',
      '        <div class="metric-card">',
      '            <div class="metric-label">YTD Return</div>',
      '            <div class="metric-value">{{portfolio.ytdReturn}}%</div>',
      '        </div>',
      '        <div class="metric-card">',
      '            <div class="metric-label">Portfolio Volatility</div>',
      '            <div class="metric-value">{{portfolio.volatility}}%</div>',
      '        </div>',
      '    </div>',
      '    {{/if}}',
      '',
      '    {{#if assetAllocations}}',
      '    <div class="section-title">Asset Allocation</div>',
      '    <table class="allocation-table">',
      '        <thead>',
      '            <tr>',
      '                <th>Asset Type</th>',
      '                <th>Allocation %</th>',
      '                <th>Value</th>',
      '            </tr>',
      '        </thead>',
      '        <tbody>',
      '            {{#each assetAllocations}}',
      '            <tr>',
      '                <td>{{this.assetType}}</td>',
      '                <td>{{this.allocation}}%</td>',
      '                <td>${{formatCurrency this.value}}</td>',
      '            </tr>',
      '            {{/each}}',
      '        </tbody>',
      '    </table>',
      '    {{/if}}',
      '',
      '    {{#if performanceData}}',
      '    <div class="section-title">Recent Performance</div>',
      '    <div class="performance-grid">',
      '        {{#each performanceData}}',
      '        <div class="performance-item">',
      '            <div style="font-weight: bold;">{{formatDate this.date}}</div>',
      '            <div>${{formatCurrency this.value}}</div>',
      '        </div>',
      '        {{/each}}',
      '    </div>',
      '    {{/if}}',
      '',
      '    <div class="footer">',
      '        <p>This report is confidential and intended solely for the use of UBS Wealth Management clients.</p>',
      '        <p>© {{currentYear}} UBS Group AG. All rights reserved.</p>',
      '    </div>',
      '</body>',
      '</html>'
    ].join('\n');

    // Register Handlebars helpers
    Handlebars.registerHelper('formatCurrency', function(value: string) {
      return parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });

    Handlebars.registerHelper('formatDate', function(dateString: string) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    });

    const compiledTemplate = Handlebars.compile(templateSource);
    
    return compiledTemplate({
      client,
      portfolio,
      assetAllocations,
      performanceData: performanceData.slice(0, 8), // Last 8 data points
      reportDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      currentYear: new Date().getFullYear()
    });
  }

  async generatePDFReport(
    client: Client,
    portfolio: Portfolio | undefined,
    assetAllocations: AssetAllocation[],
    performanceData: PortfolioPerformance[]
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      const html = this.generateReportHTML(client, portfolio, assetAllocations, performanceData);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }
}
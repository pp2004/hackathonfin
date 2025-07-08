import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { InvestmentInfoTooltip } from "@/components/ui/info-tooltip";

interface Transaction {
  id: number;
  clientId: string;
  transactionDate: string;
  settlementDate: string | null;
  status: string | null;
  side: string | null;
  instrumentName: string | null;
  assetClass: string | null;
  quantity: string | null;
  currency: string | null;
  marketValue: string | null;
  price: string | null;
}

interface TransactionsProps {
  clientId: string | null;
}

export function Transactions({ clientId }: TransactionsProps) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/clients', clientId, 'transactions'],
    enabled: !!clientId,
  });

  const formatCurrency = (value: string | null, currency: string | null = 'USD') => {
    if (!value) return '-';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const statusColors: Record<string, string> = {
      'ACTIVE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'FILLED': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'TERMINATED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}>
        {status}
      </Badge>
    );
  };

  const getSideBadge = (side: string | null) => {
    if (!side) return null;
    
    const sideColors: Record<string, string> = {
      'BUY': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'SELL': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <Badge className={sideColors[side] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}>
        {side}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              Transaction History
              <InvestmentInfoTooltip term="Transaction History" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!clientId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              Transaction History
              <InvestmentInfoTooltip term="Transaction History" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Please select a client to view transaction history
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Transaction History
            <InvestmentInfoTooltip term="Transaction History" />
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Recent transactions for selected client
          </p>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No transactions found for this client
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Instrument</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Market Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 20).map((transaction: Transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell className="font-medium">
                        {formatDate(transaction.transactionDate)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {transaction.instrumentName || 'Unknown Instrument'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.assetClass}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.assetClass || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getSideBadge(transaction.side)}
                      </TableCell>
                      <TableCell>
                        {transaction.quantity ? parseFloat(transaction.quantity).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        {transaction.price ? formatCurrency(transaction.price, transaction.currency) : '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.marketValue, transaction.currency)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {transactions.length > 20 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing first 20 transactions of {transactions.length} total
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
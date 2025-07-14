'use client';

import { useState, useEffect } from 'react';
import { Download, CreditCard, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Define types for jsPDF-AutoTable plugin
interface AutoTableOptions {
  startY: number;
  head: string[][];
  body: string[][];
  theme: string;
  headStyles: {
    fillColor: number[];
    textColor: number[];
    fontStyle: string;
  };
}

interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: AutoTableOptions) => void;
  lastAutoTable?: {
    finalY: number;
  };
}

// Define the Payment interface
interface Payment {
  id: string;
  bookingId: string;
  packageName: string;
  amount: number;
  status: string;
  date: string;
  paymentMethod: string;
  cardLast4?: string;
  upiId?: string;
  bankName?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  
  // Fetch payment data from our API
  useEffect(() => {
    if (isLoaded && user) {
      fetchPaymentData();
    }
  }, [isLoaded, user]);
  
  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('/api/payments');
      const { data } = response.data;
      
      // Transform the data if needed
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  // Get status badge styles based on payment status
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate and download invoice as PDF
  const generateInvoice = (payment: Payment) => {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Bhraman Travel', pageWidth / 2, 20, { align: 'center' });
    
    // Add invoice title
    doc.setFontSize(16);
    doc.text('INVOICE', pageWidth / 2, 30, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: ${payment.id}`, 14, 45);
    doc.text(`Date: ${formatDate(payment.date)}`, 14, 50);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 14, 55);
    doc.text(`Status: ${payment.status.toUpperCase()}`, 14, 60);
    
    // Add customer info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Customer Details', 14, 75);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (user) {
      doc.text(`Name: ${user.fullName || 'N/A'}`, 14, 80);
      doc.text(`Email: ${user.primaryEmailAddress?.emailAddress || 'N/A'}`, 14, 85);
    }
    
    // Add package details
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Package Details', 14, 100);
    
    // Create table for package details
    // Using the defined interface for type safety
    (doc as unknown as JsPDFWithAutoTable).autoTable({
      startY: 105,
      head: [['Package', 'Booking ID', 'Amount']],
      body: [
        [
          payment.packageName,
          payment.bookingId,
          `₹${payment.amount.toLocaleString()}`,
        ],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });
    
    // Add total amount
    // Using the defined interface for type safety
    const finalY = (doc as unknown as JsPDFWithAutoTable).lastAutoTable?.finalY || 130;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Amount: ₹${payment.amount.toLocaleString()}`, pageWidth - 14, finalY + 10, { align: 'right' });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing Bhraman Travel!', pageWidth / 2, finalY + 30, { align: 'center' });
    doc.text('For any queries, please contact support@bhraman.com', pageWidth / 2, finalY + 35, { align: 'center' });
    
    // Save the PDF
    doc.save(`invoice-${payment.id}.pdf`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600">View your payment history and download invoices</p>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h2>
          {isLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              ₹{payments.reduce((total, payment) => total + payment.amount, 0).toLocaleString()}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h2>
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Last Payment</h2>
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">
                ₹{payments[0]?.amount.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">{payments[0] ? formatDate(payments[0].date) : 'N/A'}</p>
            </>
          )}
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          {isLoading && <p className="text-sm text-gray-500">Loading payment data...</p>}
        </div>
        
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        {payment.packageName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        {payment.paymentMethod}
                        {payment.cardLast4 && <span className="ml-1 text-xs text-gray-400">(**** {payment.cardLast4})</span>}
                        {payment.upiId && <span className="ml-1 text-xs text-gray-400">({payment.upiId})</span>}
                        {payment.bankName && <span className="ml-1 text-xs text-gray-400">({payment.bankName})</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex items-center"
                        onClick={() => generateInvoice(payment)}
                        disabled={payment.status.toLowerCase() !== 'completed'}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && payments.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No payment records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
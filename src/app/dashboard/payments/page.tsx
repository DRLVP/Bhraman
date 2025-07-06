'use client';

import { useState, useEffect } from 'react';
import { Download, CreditCard, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

// Metadata is now defined in layout.tsx or a separate metadata.ts file

// Mock payments data
const mockPayments = [
  {
    id: 'PAY78901',
    bookingId: 'BK12345',
    packageName: 'Sikkim Explorer',
    amount: 89250,
    status: 'completed',
    date: '2023-11-01',
    paymentMethod: 'Credit Card',
    cardLast4: '4242',
  },
  {
    id: 'PAY78902',
    bookingId: 'BK12346',
    packageName: 'Kerala Backwaters',
    amount: 75000,
    status: 'completed',
    date: '2023-10-15',
    paymentMethod: 'UPI',
    upiId: 'user@okbank',
  },
  {
    id: 'PAY78903',
    bookingId: 'BK12347',
    packageName: 'Rajasthan Heritage Tour',
    amount: 68500,
    status: 'completed',
    date: '2023-09-22',
    paymentMethod: 'Net Banking',
    bankName: 'HDFC Bank',
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments);
  const { user, isLoaded } = useUser();
  
  // In a real application, you would fetch the user's payments from your database
  useEffect(() => {
    if (isLoaded && user) {
      // Example of how you would fetch payment data
      // async function fetchData() {
      //   const paymentsData = await fetchUserPayments(user.id);
      //   setPayments(paymentsData);
      // }
      // fetchData();
    }
  }, [isLoaded, user]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600">View your payment history and download invoices</p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h2>
          <p className="text-3xl font-bold text-gray-900">
            ₹{payments.reduce((total, payment) => total + payment.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h2>
          <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Last Payment</h2>
          <p className="text-3xl font-bold text-gray-900">
            ₹{payments[0]?.amount.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">{payments[0] ? formatDate(payments[0].date) : 'N/A'}</p>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </div>
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button size="sm" variant="ghost" className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No payment records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
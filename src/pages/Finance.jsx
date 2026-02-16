import React, { useState } from 'react'
import Card from '../components/Card'
import DashboardChart from '../components/DashboardChart'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'

const mockFeeStructure = [
  { id: 1, category: 'Tuition Fee', amount: 50000, dueDate: '2025-02-15', paid: true, paidDate: '2025-02-10' },
  { id: 2, category: 'Lab Fee', amount: 5000, dueDate: '2025-02-15', paid: true, paidDate: '2025-02-12' },
  { id: 3, category: 'Library Fee', amount: 2000, dueDate: '2025-02-20', paid: false, paidDate: null },
  { id: 4, category: 'Sports Fee', amount: 3000, dueDate: '2025-02-20', paid: false, paidDate: null },
  { id: 5, category: 'Examination Fee', amount: 4000, dueDate: '2025-03-01', paid: false, paidDate: null },
]

const mockTransactions = [
  { id: 1, type: 'Payment', amount: 50000, category: 'Tuition Fee', date: '2025-02-10', status: 'Completed', ref: 'TXN001245' },
  { id: 2, type: 'Payment', amount: 5000, category: 'Lab Fee', date: '2025-02-12', status: 'Completed', ref: 'TXN001246' },
  { id: 3, type: 'Refund', amount: 2000, category: 'Late Fee Waiver', date: '2025-02-05', status: 'Completed', ref: 'TXN001244' },
]

const mockInstallments = [
  { id: 1, semester: 'Semester 1', total: 57000, paid: 57000, remaining: 0, dueDate: '2025-02-15', status: 'Paid' },
  { id: 2, semester: 'Semester 2', total: 57000, paid: 0, remaining: 57000, dueDate: '2025-08-15', status: 'Due' },
]

export default function Finance() {
  const { push } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [openPayment, setOpenPayment] = useState(false)
  const [selectedFee, setSelectedFee] = useState(null)

  const totalDue = mockFeeStructure.filter(f => !f.paid).reduce((sum, f) => sum + f.amount, 0)
  const totalPaid = mockFeeStructure.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0)
  const totalAmount = mockFeeStructure.reduce((sum, f) => sum + f.amount, 0)

  const feeChartData = {
    labels: ['Tuition', 'Lab', 'Library', 'Sports', 'Exam'],
    values: [50000, 5000, 2000, 3000, 4000]
  }

  const paymentTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [10000, 55000, 0, 0, 0]
  }

  const handlePayment = (fee) => {
    setSelectedFee(fee)
    setOpenPayment(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Finance & Fees</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Download Statement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Amount" value={`₹${totalAmount.toLocaleString()}`} />
        <Card title="Amount Paid" value={`₹${totalPaid.toLocaleString()}`} />
        <Card title="Amount Due" value={`₹${totalDue.toLocaleString()}`} />
        <Card title="Payment Status" value={`${Math.round((totalPaid / totalAmount) * 100)}%`} />
      </div>

      {/* Alert */}
      {totalDue > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="font-semibold text-red-900">Outstanding Dues</div>
          <div className="text-sm text-red-700 mt-1">
            You have ₹{totalDue.toLocaleString()} outstanding. Please make payment before the deadline.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 rounded-t-lg">
        <div className="flex">
          {['overview', 'installments', 'transactions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <Card>
            <h3 className="font-semibold mb-4">Fee Breakdown</h3>
            <div className="space-y-3">
              {mockFeeStructure.map(fee => (
                <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{fee.category}</div>
                    <div className="text-sm text-slate-600">Due: {fee.dueDate}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold text-lg">₹{fee.amount.toLocaleString()}</div>
                    {fee.paid ? (
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">Paid</div>
                    ) : (
                      <button
                        onClick={() => handlePayment(fee)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block hover:bg-blue-200"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold mb-4">Fee Distribution</h3>
              <div className="h-64">
                <DashboardChart data={feeChartData} />
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Payment Trend</h3>
              <div className="h-64">
                <DashboardChart data={paymentTrendData} />
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Installments Tab */}
      {activeTab === 'installments' && (
        <Card>
          <h3 className="font-semibold mb-4">Fee Installments</h3>
          <div className="space-y-4">
            {mockInstallments.map(inst => (
              <div key={inst.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-slate-900">{inst.semester}</div>
                    <div className="text-sm text-slate-600">Due: {inst.dueDate}</div>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-semibold ${
                    inst.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inst.status}
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(inst.paid / inst.total) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-slate-600">
                  Paid: ₹{inst.paid.toLocaleString()} / ₹{inst.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card>
          <h3 className="font-semibold mb-4">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Amount</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Reference</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map(t => (
                  <tr key={t.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      <span className={`font-semibold ${t.type === 'Payment' ? 'text-blue-600' : 'text-green-600'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3">{t.category}</td>
                    <td className="p-3 font-semibold">₹{t.amount.toLocaleString()}</td>
                    <td className="p-3">{t.date}</td>
                    <td className="p-3 text-slate-600">{t.ref}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payment Modal */}
      <Modal title="Make Payment" open={openPayment} onClose={() => setOpenPayment(false)}>
        {selectedFee && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600">Fee Category</div>
              <div className="text-xl font-semibold">{selectedFee.category}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-slate-600">Amount Due</div>
              <div className="text-3xl font-bold text-blue-600">₹{selectedFee.amount.toLocaleString()}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2"> Payment Method</label>
              <select className="w-full border rounded-lg p-2">
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Net Banking</option>
                <option>UPI</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setOpenPayment(false)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  push('Payment processed successfully!', 'success')
                  setOpenPayment(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

import React, { useState } from "react";
import {
  History,
  Eye,
  Download,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";

const LoanHistory: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock loan data
  const loans = [
    {
      id: "LN001",
      amount: 25000,
      currency: "USD",
      status: "repaid",
      date: "2024-12-15",
      collateral: 0.6,
      interestRate: 8.5,
      term: 12,
      nextPayment: null,
      progress: 100,
    },
    {
      id: "LN002",
      amount: 18000,
      currency: "USDT",
      status: "active",
      date: "2025-01-10",
      collateral: 0.45,
      interestRate: 7.2,
      term: 18,
      nextPayment: "2025-02-15",
      progress: 15,
    },
    {
      id: "LN003",
      amount: 15000,
      currency: "USD",
      status: "pending",
      date: "2025-01-28",
      collateral: 0.38,
      interestRate: 9.1,
      term: 12,
      nextPayment: null,
      progress: 0,
    },
    {
      id: "LN004",
      amount: 30000,
      currency: "USD",
      status: "rejected",
      date: "2024-11-20",
      collateral: 0.72,
      interestRate: null,
      term: null,
      nextPayment: null,
      progress: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "repaid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "defaulted":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredLoans = loans.filter(
    (loan) => filterStatus === "all" || loan.status === filterStatus,
  );

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount":
        return b.amount - a.amount;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-3">
          <History className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Loan History
          </h2>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="repaid">Repaid</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          {/* Export */}
          <button className="flex items-center space-x-2 rounded-xl bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <SummaryCard
          title="Total Loans"
          value={loans.length.toString()}
          icon={<History className="h-6 w-6 text-blue-500" />}
        />
        <SummaryCard
          title="Total Borrowed"
          value={`$${loans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
        <SummaryCard
          title="Active Loans"
          value={loans
            .filter((loan) => loan.status === "active")
            .length.toString()}
          icon={<Eye className="h-6 w-6 text-orange-500" />}
        />
        <SummaryCard
          title="Repaid Loans"
          value={loans
            .filter((loan) => loan.status === "repaid")
            .length.toString()}
          icon={<Calendar className="h-6 w-6 text-purple-500" />}
        />
      </div>

      {/* Loan List */}
      <div className="overflow-hidden rounded-3xl bg-white/70 shadow-lg backdrop-blur-sm dark:bg-gray-800/70">
        {sortedLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Loan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Next Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {sortedLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {loan.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        Collateral: {loan.collateral} BTC
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${loan.amount.toLocaleString()} {loan.currency}
                      </div>
                      {loan.interestRate && (
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {loan.interestRate}% APR
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${getStatusColor(loan.status)}`}
                      >
                        {loan.status.charAt(0).toUpperCase() +
                          loan.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      {new Date(loan.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.status === "active" || loan.status === "repaid" ? (
                        <div className="w-24">
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-2 rounded-full ${loan.status === "repaid" ? "bg-green-500" : "bg-blue-500"}`}
                              style={{ width: `${loan.progress}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                            {loan.progress}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      {loan.nextPayment
                        ? new Date(loan.nextPayment).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <History className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No loans found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filterStatus === "all"
                ? "You haven't applied for any loans yet"
                : `No loans with status "${filterStatus}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/70">
    <div className="mb-4 flex items-center justify-between">{icon}</div>
    <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white">
      {title}
    </h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

export default LoanHistory;

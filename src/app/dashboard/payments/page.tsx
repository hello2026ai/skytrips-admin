"use client";

import { useState } from "react";

// Mock Data matching the reference image
const TRANSACTIONS = [
  {
    id: "#BK-9921",
    agency: "Skybound Travels Ltd.",
    cost: 1050.00,
    selling: 1200.00,
    customerStatus: "PAID",
    agencyStatus: "PAID",
    isDirect: false,
  },
  {
    id: "#BK-8824",
    agency: "DIRECT",
    cost: 2100.00,
    selling: 2450.00,
    customerStatus: "PARTIAL",
    agencyStatus: "N/A",
    isDirect: true,
  },
  {
    id: "#BK-7729",
    agency: "Elite Gateways",
    cost: 750.00,
    selling: 890.00,
    customerStatus: "UNPAID",
    agencyStatus: "PARTIAL",
    isDirect: false,
  },
  {
    id: "#BK-6612",
    agency: "Global Travel Hub",
    cost: 2800.00,
    selling: 3100.00,
    customerStatus: "PAID",
    agencyStatus: "UNPAID",
    isDirect: false,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "bg-slate-100 text-slate-500";
  if (status === "PAID") styles = "bg-emerald-50 text-emerald-600";
  if (status === "PARTIAL") styles = "bg-amber-50 text-amber-600";
  if (status === "UNPAID") styles = "bg-red-50 text-red-600";
  
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${styles}`}>
      {status}
    </span>
  );
};

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [period, setPeriod] = useState("30D");

  return (
    <div className="max-w-[1600px] mx-auto w-full font-display pb-12 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Payments Transaction Listing</h1>
          <p className="text-slate-500 font-medium">Unified view of direct bookings and partner agency financial settlements.</p>
        </div>
        <button className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-colors">
          <span className="material-symbols-outlined text-[20px]">download</span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <button className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          Date Range: <span className="text-[#00A76F]">{dateRange}</span>
          <span className="material-symbols-outlined text-[20px]">expand_more</span>
        </button>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["30D", "90D", "YTD"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                period === p 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Volume Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL VOLUME (SP)</h3>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-3 tracking-tight">$482,900.00</div>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            +12.5% vs last month
          </div>
        </div>

        {/* Total Direct Due Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL DIRECT DUE</h3>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined text-[18px]">priority_high</span>
            </div>
          </div>
          <div className="text-3xl font-black text-orange-500 mb-3 tracking-tight">$12,450.00</div>
          <div className="text-xs font-medium text-slate-400">
            Consolidated customer outstanding
          </div>
        </div>

        {/* Agency Payables Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AGENCY PAYABLES</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[18px]">domain</span>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-3 tracking-tight">$8,340.00</div>
          <div className="text-xs font-medium text-slate-400">
            Net settlement due to partners
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">BOOKING ID</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">AGENCY / SOURCE</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">COST (CP)</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">SELLING (SP)</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">CUSTOMER PMT STATUS</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">AGENCY PMT STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-[#00A76F] group-hover:underline cursor-pointer">{tx.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    {tx.isDirect ? (
                      <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase italic">
                        DIRECT
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-600">{tx.agency}</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-medium text-slate-500">{formatCurrency(tx.cost)}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(tx.selling)}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <StatusBadge status={tx.customerStatus} />
                  </td>
                  <td className="px-8 py-5 text-center">
                    <StatusBadge status={tx.agencyStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">1</span> to <span className="font-bold text-slate-900">4</span> of <span className="font-bold text-slate-900">240</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00A76F] text-white text-sm font-bold shadow-sm shadow-emerald-200">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">24</button>
            
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

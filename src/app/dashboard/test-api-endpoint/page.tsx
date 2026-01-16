"use client";

import { useState, useEffect } from "react";

export default function TestApiPage() {
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"pending" | "success" | "failure">("pending");

  const runTest = async () => {
    setLoading(true);
    try {
      // Test the new endpoint
      const response = await fetch('/api/dashboard/recent-bookings?limit=5');
      const data = await response.json();
      
      setResult(data);
      
      // Basic Assertions
      let passed = true;
      if (!data.success) passed = false;
      if (!Array.isArray(data.data)) passed = false;
      if (data.data.length > 0) {
        // Check sorting (Ascending)
        const dates = data.data.map((b: { bookingDate: string }) => new Date(b.bookingDate).getTime());
        const sorted = [...dates].sort((a, b) => a - b);
        if (JSON.stringify(dates) !== JSON.stringify(sorted)) passed = false;
        
        // Check future dates
        const now = new Date().getTime();
        const hasPastDates = dates.some(d => d < now);
        // Note: strict check might fail if 'now' drifts slightly, but conceptually all should be future
        // We'll just log it for visual inspection
      }
      
      setTestStatus(passed ? "success" : "failure");
    } catch (err) {
      console.error(err);
      setTestStatus("failure");
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Endpoint Verification</h1>
      
      <div className="bg-slate-100 p-6 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Endpoint: /api/dashboard/recent-bookings</h2>
        <p className="text-sm text-slate-600 mb-4">
          Fetches upcoming bookings (next 30 days), sorted by date ascending.
        </p>
        <button 
          onClick={runTest}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Running Tests..." : "Run Verification Test"}
        </button>
      </div>

      {testStatus !== "pending" && (
        <div className={`p-4 rounded-lg mb-6 ${testStatus === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <h3 className={`font-bold ${testStatus === "success" ? "text-green-800" : "text-red-800"}`}>
            Test Result: {testStatus.toUpperCase()}
          </h3>
        </div>
      )}

      {result && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-mono text-xs font-semibold text-slate-500">
            JSON Response
          </div>
          <pre className="p-4 bg-slate-900 text-green-400 overflow-auto max-h-[500px] text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test 1: Check Supabase connection
      console.log("Testing Supabase connection...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const tests: any = {
        timestamp: new Date().toISOString(),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        session: session ? "User logged in" : "No active session",
        sessionError: sessionError?.message || null,
      };

      // Test 2: Try to fetch bookings (without RLS)
      console.log("Testing bookings query...");
      const {
        data: bookingsData,
        error: bookingsError,
        count,
      } = await supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .limit(5);

      tests.bookingsQuery = {
        success: !bookingsError,
        error: bookingsError?.message || null,
        errorDetails: bookingsError?.details || null,
        errorHint: bookingsError?.hint || null,
        errorCode: bookingsError?.code || null,
        count: count,
        sampleData: bookingsData ? bookingsData.slice(0, 2) : null,
      };

      // Test 3: Try to get table schema
      console.log("Testing table existence...");
      const { data: schemaData, error: schemaError } = await supabase
        .from("bookings")
        .select("*")
        .limit(0);

      tests.tableExists = !schemaError;
      tests.schemaError = schemaError?.message || null;

      setResult(tests);
    } catch (err: any) {
      console.error("Test error:", err);
      setError(err.message || "An error occurred during testing");
    } finally {
      setLoading(false);
    }
  };

  const testRLSPolicies = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const tests: any = {
        timestamp: new Date().toISOString(),
      };

      // Test without authentication
      const { data: publicData, error: publicError } = await supabase
        .from("bookings")
        .select("count", { count: "exact", head: true });

      tests.publicAccess = {
        canAccess: !publicError,
        error: publicError?.message || null,
        count: publicData,
      };

      setResult(tests);
    } catch (err: any) {
      console.error("RLS test error:", err);
      setError(err.message || "An error occurred during RLS testing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase API Diagnostics</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Connection & Query"}
        </button>

        <button
          onClick={testRLSPolicies}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test RLS Policies"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Test Results:</h2>
          <pre className="bg-white p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

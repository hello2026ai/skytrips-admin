"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Customer } from "@/types";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (err: any) {
      console.error("Error fetching customer:", err);
      setError(err.message || "Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 font-display">
            Loading customer details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || "Customer not found"}
        </div>
        <button
          onClick={() => router.push("/dashboard/customers")}
          className="mt-4 text-primary hover:underline"
        >
          ← Back to Customers
        </button>
      </div>
    );
  }

  // Parse JSON fields safely
  const address =
    typeof customer.address === "string"
      ? JSON.parse(customer.address)
      : customer.address || {};
  const passport =
    typeof customer.passport === "string"
      ? JSON.parse(customer.passport)
      : customer.passport || {};

  return (
    <div className="flex flex-col w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      <div className="flex flex-col border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Customer Details
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              ID: {customer.id}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Edit"
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
            >
              <span className="material-symbols-outlined text-[20px]">
                edit
              </span>
            </button>
            <button
              aria-label="Close"
              onClick={() => router.push("/dashboard/customers")}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
            >
              <span className="material-symbols-outlined text-[22px]">
                close
              </span>
            </button>
          </div>
        </div>
        <div className="px-6 pb-6 pt-2">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex gap-5 items-center">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full h-20 w-20 ring-4 ring-slate-50 shadow-sm"
                  style={{
                    backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${customer.firstName} ${customer.lastName}`
                    )}&background=random")`,
                  }}
                ></div>
                {customer.isActive === "true" && (
                  <div
                    className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-2 border-white"
                    title="Active"
                  ></div>
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-[#0d131b] text-2xl font-bold leading-tight tracking-tight">
                  {customer.firstName} {customer.lastName}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-slate-500 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      mail
                    </span>
                    <span>{customer.email}</span>
                  </div>
                  <span className="hidden sm:block text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      call
                    </span>
                    <span>
                      {customer.phoneCountryCode} {customer.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:self-center">
              {customer.isActive === "true" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>
                  <span className="text-xs font-semibold">Active</span>
                </div>
              )}
              {customer.isVerified === "true" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  <span className="text-xs font-semibold">Verified</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                <span className="material-symbols-outlined text-[14px]">
                  flight
                </span>
                <span className="text-xs font-semibold">
                  {customer.userType || "Traveler"}
                </span>
              </div>
              {customer.socialProvider === "google" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                  <span className="material-symbols-outlined text-[14px]">
                    g_mobiledata
                  </span>
                  <span className="text-xs font-semibold">Google Auth</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-slate-900 text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      person
                    </span>
                    Personal Information
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        First Name
                      </p>
                      <p className="text-slate-900 font-medium">
                        {customer.firstName}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Last Name
                      </p>
                      <p className="text-slate-900 font-medium">
                        {customer.lastName}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Date of Birth
                      </p>
                      <p className="text-slate-900 font-medium">
                        {customer.dateOfBirth || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Gender
                      </p>
                      <p className="text-slate-900 font-medium">
                        {customer.gender || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Phone Country Code
                      </p>
                      <p className="text-slate-900 font-medium flex items-center gap-2">
                        {customer.phoneCountryCode} ({customer.country})
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Nationality
                      </p>
                      <p className="text-slate-900 font-medium">
                        {customer.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-slate-900 text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      home_pin
                    </span>
                    Address Details
                  </h3>
                  <a
                    className="text-xs font-medium text-primary hover:text-blue-600 flex items-center gap-1"
                    href="#"
                  >
                    Open Map{" "}
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                  </a>
                </div>
                <div className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-40 md:h-auto bg-slate-100 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-100">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKcaqUPfNzFUXIasZ9PxpmvmrnRmOaRp7wcxwTfHbBDGcQMoIa8AQXrOXZWfXd2O_PgoZ6HLTOvIVU4yeKQKaU3k9BwEpR36jIIcGrPzpcQDG8K_f5_ZoAdOTXi5O5xKski2M4r6LpEN04XlUjY6WVqkZzNvPmEsYP-etxNeH1nhKHxcRV5t_LXlqYTuHVFb0flVoeXI1GSORmwpXR3TCot2fP0IYXcqBXCd5j1YIQhQemb-nQBdG3R0l3PaapHtNK7GRs_y_X5-5K')",
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                          <span className="material-symbols-outlined text-[20px] block">
                            location_on
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                            Street Address
                          </p>
                          <p className="text-slate-900 font-medium">
                            {address.street || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                            City
                          </p>
                          <p className="text-slate-900 font-medium">
                            {address.city || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                            State / Province
                          </p>
                          <p className="text-slate-900 font-medium">
                            {address.state || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                            Postal Code
                          </p>
                          <p className="text-slate-900 font-medium">
                            {address.postalCode || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                            Country
                          </p>
                          <p className="text-slate-900 font-medium">
                            {customer.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-slate-900 text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      badge
                    </span>
                    Passport Details
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300">
                    CONFIDENTIAL
                  </span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8">
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Passport Number
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900 font-mono font-bold text-lg">
                          {passport.number || "N/A"}
                        </p>
                        {customer.isVerified === "true" && (
                          <span
                            className="material-symbols-outlined text-green-500 text-[18px]"
                            title="Verified"
                          >
                            check_circle
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Issue Country
                      </p>
                      <p className="text-slate-900 font-medium flex items-center gap-2">
                        {passport.issueCountry || customer.country}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        Expiry Date
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900 font-medium">
                          {passport.expiryDate || "N/A"}
                        </p>
                        {passport.expiryDate &&
                          new Date(passport.expiryDate) > new Date() && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              VALID
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-slate-900 text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      settings
                    </span>
                    System Metadata
                  </h3>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                      User ID
                    </p>
                    <div className="flex justify-between items-center group cursor-pointer">
                      <p className="text-slate-900 font-mono text-sm">
                        u_{customer.id}
                      </p>
                      <span className="material-symbols-outlined text-slate-400 hover:text-primary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                        content_copy
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                      Created At
                    </p>
                    <p className="text-slate-900 text-sm">
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                      Referral Code
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-mono font-medium">
                        {customer.referralCode || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                      Social Provider
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-slate-900 text-sm font-medium capitalize">
                        {customer.socialProvider || "Email"}
                      </p>
                    </div>
                    {customer.socialId && (
                      <p className="text-slate-400 text-xs font-mono mt-1 break-all">
                        {customer.socialId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-500 text-xs font-medium">
                      Account Status
                    </p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={customer.isDisabled === "true"}
                        readOnly
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                      <span className="ml-2 text-xs font-medium text-slate-900">
                        Disable
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-primary text-sm font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    info
                  </span>
                  Admin Note
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  System generated account. Details verified by automation.
                </p>
                <button className="text-primary text-xs font-bold hover:underline">
                  View Ticket History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 p-6 bg-white shrink-0">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/customers")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                block
              </span>
              Disable Account
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">
              <span className="material-symbols-outlined text-[18px]">
                lock_reset
              </span>
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

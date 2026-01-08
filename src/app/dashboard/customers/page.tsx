"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Customer } from "@/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("customers")
        .select("*", { count: "exact" })
        .order("id", { ascending: true })
        .range(from, to);

      if (debouncedSearch) {
        query = query.or(`firstName.ilike.*${debouncedSearch}*,lastName.ilike.*${debouncedSearch}*,email.ilike.*${debouncedSearch}*,phone.ilike.*${debouncedSearch}*`);
      }

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setCustomers(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (isActive: string) => {
    if (isActive === "true" || isActive === "Active") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500 font-display">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full font-display">
      {/* Breadcrumbs */}
      <nav className="flex mb-4 text-sm text-slate-500">
        <ol className="flex items-center gap-2">
          <li>Dashboard</li>
          <li>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </li>
          <li className="font-medium text-primary">Customers</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your user base, view details and travel history.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters and Search Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Search by name, email, or phone..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select className="w-full sm:w-48 rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-12 text-center align-middle">
                  <input
                    className="rounded border-gray-300 text-primary focus:ring-primary bg-white"
                    type="checkbox"
                  />
                </th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-center align-middle">
                    <input
                      className="rounded border-gray-300 text-primary focus:ring-primary bg-white"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url("https://ui-avatars.com/api/?name=${encodeURIComponent(
                            `${customer.firstName} ${customer.lastName}`
                            )}&background=random")`,
                        }}
                      ></div>
                      <div className="font-medium text-slate-900">
                        {customer.firstName} {customer.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {customer.phoneCountryCode} {customer.phone}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(customer.isActive)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/dashboard/customers/${customer.id}`}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-primary"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          visibility
                        </span>
                      </Link>
                      <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500">
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-500 font-display">
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-900">
                  {Math.min(currentPage * pageSize, totalCount)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">
                  {totalCount}
                </span>{" "}
                results
              </p>
              <div className="hidden sm:flex items-center gap-2 ml-4 border-l border-slate-100 pl-4">
                <span className="text-xs text-slate-500">Rows per page:</span>
                <select 
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              >
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_left
                  </span>
                </button>
                
                <div className="flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-200">
                  Page <span className="mx-1 font-bold text-primary">{currentPage}</span> of {totalPages || 1}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0 || loading}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


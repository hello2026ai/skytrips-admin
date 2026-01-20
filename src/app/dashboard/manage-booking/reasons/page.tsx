"use client";

import { useState, useEffect } from "react";
import { AddReasonModal } from "@/components/AddReasonModal";
import { supabase } from "@/lib/supabase";
import { Reason } from "@/types";

export default function ReasonManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReason, setEditingReason] = useState<Reason | null>(null);

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reasons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReasons(data || []);
    } catch (error) {
      console.error("Error fetching reasons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReason = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      if (editingReason) {
        // Update existing
        const { error } = await supabase
          .from("reasons")
          .update({ title: data.title, description: data.description })
          .eq("id", editingReason.id);

        if (error) throw error;
      } else {
        // Create new
        // Generate a random code for now, similar to mock logic
        const code = `REF-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`;
        const { error } = await supabase
          .from("reasons")
          .insert([{ code, title: data.title, description: data.description }]);

        if (error) throw error;
      }
      fetchReasons();
      setIsModalOpen(false);
      setEditingReason(null);
    } catch (error) {
      console.error("Error saving reason:", error);
      alert("Failed to save reason. Please try again.");
    }
  };

  const handleEdit = (reason: Reason) => {
    setEditingReason(reason);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this reason?")) {
      try {
        const { error } = await supabase.from("reasons").delete().eq("id", id);
        if (error) throw error;
        setReasons((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Error deleting reason:", error);
        alert("Failed to delete reason. Please try again.");
      }
    }
  };

  const handleAddNew = () => {
    setEditingReason(null);
    setIsModalOpen(true);
  };

  const filteredReasons = reasons.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto w-full font-display pb-12 space-y-8">
      <AddReasonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReason(null);
        }}
        onSubmit={handleSaveReason}
        initialData={
          editingReason
            ? {
                uid: editingReason.code,
                title: editingReason.title,
                description: editingReason.description,
              }
            : null
        }
      />

      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reason Management
          </h1>
          <p className="text-slate-500 mt-1">
            Configure standardized codes for refunds, reissues, and tour
            cancellations.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Reason
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              TOTAL REASONS DEFINED
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {reasons.length}
            </p>
          </div>
          <div className="size-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-500">
            <span className="material-symbols-outlined">list</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              MOST USED REASON
            </p>
            <p className="text-3xl font-bold text-slate-900">Weather</p>
          </div>
          <div className="size-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-500">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              RECENT ACTIVITY COUNT
            </p>
            <p className="text-3xl font-bold text-slate-900">142</p>
          </div>
          <div className="size-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-500">
            <span className="material-symbols-outlined">analytics</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search and filter through all reasons..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto"></div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">
                  UID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-64">
                  TITLE
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-32">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Loading reasons...
                  </td>
                </tr>
              ) : filteredReasons.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No reasons found.
                  </td>
                </tr>
              ) : (
                filteredReasons.map((reason) => (
                  <tr
                    key={reason.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="text-teal-500 font-bold text-sm bg-teal-50 px-2 py-1 rounded">
                        {reason.code}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-900">
                        {reason.title}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-500 text-sm">
                        {reason.description}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 transition-all">
                        <button
                          onClick={() => handleEdit(reason)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Edit reason"
                          aria-label={`Edit ${reason.title}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(reason.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete reason"
                          aria-label={`Delete ${reason.title}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredReasons.length > 0 ? 1 : 0}-
              {Math.min(filteredReasons.length, 5)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900">
              {filteredReasons.length}
            </span>{" "}
            reasons
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Frequency Chart Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Frequency of Reasons
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Distribution of refund and reissue selections (Last 30 days)
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
            Monthly
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
        </div>

        {/* Chart Placeholder Area */}
        <div className="h-64 w-full relative">
          <div className="absolute inset-0 flex items-end justify-between px-4 sm:px-12">
            {[
              "WEATHER",
              "MEDICAL",
              "SCHEDULE",
              "CUSTOMER",
              "PRICING",
              "GUIDE",
            ].map((label) => (
              <span
                key={label}
                className="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

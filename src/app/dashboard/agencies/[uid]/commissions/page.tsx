"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AddCommissionModal, { CommissionData } from "@/components/agency/AddCommissionModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export default function AgencyCommissionsPage() {
  const params = useParams();
  const uid = params?.uid as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Partial<CommissionData> | null>(null);
  const [commissionToDelete, setCommissionToDelete] = useState<Partial<CommissionData> | null>(null);
  
  const [commissions, setCommissions] = useState<CommissionData[]>([]);
  const [agencyName, setAgencyName] = useState("Agency");
  const [loading, setLoading] = useState(true);

  // Fetch Agency Name
  useEffect(() => {
    if (!uid) return;
    const fetchAgency = async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("agency_name")
        .eq("uid", uid)
        .single();
      
      if (data) {
        setAgencyName(data.agency_name);
      } else if (error) {
        console.error("Error fetching agency:", error);
      }
    };
    fetchAgency();
  }, [uid]);

  // Fetch Commissions
  const fetchCommissions = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("airline_commissions")
      .select("*")
      .eq("agency_uid", uid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching commissions:", error);
    } else {
      // Map DB to CommissionData
      const mapped: CommissionData[] = (data || []).map((item: any) => ({
        id: item.id,
        airline: item.airline_name,
        airline_iata: item.airline_iata,
        airline_logo: item.airline_logo,
        type: item.commission_type as "PERCENTAGE" | "FIXED",
        value: item.commission_type === "PERCENTAGE" ? `${item.value}%` : `$${item.value}`,
        rawValue: item.value,
        status: item.status as "ACTIVE" | "INACTIVE",
        classType: item.class_type,
        origin: item.origin || "",
        destination: item.destination || "",
      }));
      setCommissions(mapped);
    }
    setLoading(false);
  }, [uid]);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const handleOpenAdd = () => {
    setSelectedCommission(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (commission: CommissionData) => {
    setSelectedCommission(commission);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (commission: CommissionData) => {
    setCommissionToDelete(commission);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: CommissionData) => {
    try {
      const payload = {
        agency_uid: uid,
        airline_name: data.airline,
        airline_iata: data.airline_iata,
        airline_logo: data.airline_logo,
        commission_type: data.type,
        value: data.rawValue ?? parseFloat(data.value.replace(/[^0-9.]/g, "")),
        status: data.status,
        class_type: data.classType,
        origin: data.origin,
        destination: data.destination,
      };

      if (selectedCommission?.id) {
        // Update
        const { error } = await supabase
          .from("airline_commissions")
          .update(payload)
          .eq("id", selectedCommission.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from("airline_commissions")
          .insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCommissions();
    } catch (error) {
      console.error("Error saving commission:", error);
      alert("Failed to save commission");
    }
  };

  const handleDelete = async () => {
    if (!commissionToDelete?.id) return;
    try {
      const { error } = await supabase
        .from("airline_commissions")
        .delete()
        .eq("id", commissionToDelete.id);
      
      if (error) throw error;
      
      setIsDeleteModalOpen(false);
      setCommissionToDelete(null);
      fetchCommissions();
    } catch (error) {
      console.error("Error deleting commission:", error);
      alert("Failed to delete commission");
    }
  };

  const filteredCommissions = commissions.filter((c) =>
    c.airline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto w-full font-display pb-12 space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-slate-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/dashboard/agencies" className="hover:text-primary transition-colors">
              Agencies
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li>
            <Link href={`/dashboard/agencies/${uid}`} className="hover:text-primary transition-colors">
              {agencyName}
            </Link>
          </li>
          <li className="text-slate-300">/</li>
          <li className="text-slate-900 font-bold">Airline Commissions</li>
        </ol>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl">
            %
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Airline Commissions</h1>
            <p className="text-slate-500 font-medium">Manage custom commission rates for {agencyName}.</p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="h-10 px-4 rounded-lg bg-[#00A76F] text-white font-bold text-sm hover:bg-[#009462] flex items-center gap-2 shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Airline Commission
        </button>
      </div>

      <AddCommissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={selectedCommission || undefined}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Commission"
        message={`Are you sure you want to delete the commission rule for ${
          commissionToDelete?.airline || "this airline"
        }? This action cannot be undone.`}
      />

      {/* Content Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500">list_alt</span>
            <h2 className="text-lg font-bold text-slate-900">Active Commissions</h2>
          </div>
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Filter airlines..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Airline</th>
                <th className="px-6 py-4">Commission Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      Loading commissions...
                    </div>
                  </td>
                </tr>
              ) : filteredCommissions.length > 0 ? (
                filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                           {commission.airline_logo ? (
                             <img src={commission.airline_logo} alt={commission.airline} className="w-full h-full object-contain" />
                           ) : (
                             <span className="text-[10px] font-bold text-slate-400">LOGO</span>
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{commission.airline}</span>
                          {commission.airline_iata && (
                            <span className="text-xs text-slate-500 font-medium">{commission.airline_iata}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                        commission.type === 'PERCENTAGE' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {commission.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {commission.value}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                        commission.status === 'ACTIVE' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {commission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(commission)}
                          className="text-slate-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(commission)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No commissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 font-medium">
            Showing {filteredCommissions.length} airlines with custom commissions
          </p>
          {/* Pagination controls can be added here if needed */}
        </div>
      </div>
    </div>
  );
}

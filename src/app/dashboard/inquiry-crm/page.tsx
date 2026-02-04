"use client";

import { useState, useRef } from "react";
import InquiryKanbanBoard from "@/components/dashboard/inquiry-crm/InquiryKanbanBoard";
import CreateInquiryModal from "@/components/dashboard/inquiry-crm/CreateInquiryModal";
import ImportPNRModal from "@/components/dashboard/inquiry-crm/ImportPNRModal";

export default function InquiryCRMPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    
    // Save Status State
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);

    const boardRef = useRef<{ fetchInquiries: () => void }>(null);

    const handleImportPNR = async (pnrDataString: string) => {
        try {
            setIsSaving(true);
            setSaveStatus('idle');
            setSaveError(null);
            
            const pnrData = JSON.parse(pnrDataString);
            console.log("Importing PNR Data:", pnrData);
            
            // Generate inquiry number
            const inquiryNumber = `PNR-${pnrData.pnr_number || Math.floor(Math.random() * 10000)}`;
            
            // Extract dates
            const startDate = pnrData.segments?.[0]?.departure_time 
                ? new Date(pnrData.segments[0].departure_time).toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0];
                
            const endDate = pnrData.segments?.[pnrData.segments.length - 1]?.arrival_time
                ? new Date(pnrData.segments[pnrData.segments.length - 1].arrival_time).toISOString().split('T')[0]
                : startDate;

            // Prepare payload for API matching the FlightInquiry interface and DB schema
            const payload = {
                inquiry_number: inquiryNumber,
                client_name: `${pnrData.customer?.firstName || ''} ${pnrData.customer?.lastName || ''}`.trim() || 'Unknown Client',
                departure_code: pnrData.segments?.[0]?.departure_airport || 'XXX',
                arrival_code: pnrData.segments?.[pnrData.segments.length - 1]?.arrival_airport || 'XXX',
                start_date: startDate,
                end_date: endDate,
                priority: "MEDIUM",
                status: "NEW",
                created_at: new Date().toISOString(),
                pnr_text: pnrData.pnrText,
                pnr_parsed_data: pnrData,
                preview_url: pnrData.previewUrl
            };

            const response = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!result.success) {
                const errorMessage = result.error?.message || result.message || "Failed to create inquiry";
                throw new Error(errorMessage);
            }

            setSaveStatus("success");
            
            // Refresh board to show new data
            if (boardRef.current) {
                boardRef.current.fetchInquiries();
            }

            // Close modal after success feedback
            setTimeout(() => {
                setIsImportModalOpen(false);
                setSaveStatus("idle"); // Reset status after closing
            }, 1500);

        } catch (e) {
            console.error("Failed to save inquiry", e);
            setSaveStatus("error");
            setSaveError(e instanceof Error ? e.message : "An unknown error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto w-full font-display pb-12 space-y-8 min-h-full">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Inquiry CRM Board</h1>
                    <p className="text-slate-500 font-bold">Drag and drop inquiries to update their status in the lifecycle.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-100"
                    >
                        <span className="material-symbols-outlined">upload_file</span>
                        Import PNR
                    </button>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 hover:-translate-y-0.5 transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-primary/20"
                    >
                        <span className="material-symbols-outlined">add</span>
                        New Inquiry
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <InquiryKanbanBoard ref={boardRef} />

            {/* Modals */}
            <CreateInquiryModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={() => {
                    if (boardRef.current) {
                        boardRef.current.fetchInquiries();
                    }
                }}
            />
            
            <ImportPNRModal 
                isOpen={isImportModalOpen} 
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportPNR}
                isSaving={isSaving}
                saveStatus={saveStatus}
                saveError={saveError}
            />
        </div>
    );
}

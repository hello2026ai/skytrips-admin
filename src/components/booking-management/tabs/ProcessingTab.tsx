import { Booking, ManageBooking, Traveller } from "@/types";

interface ProcessingTabProps {
  booking: Booking;
  record: ManageBooking;
  selectedTravellers: string[];
  setSelectedTravellers: React.Dispatch<React.SetStateAction<string[]>>;
  refundStatus: string;
  setRefundStatus: (status: string) => void;
}

export default function ProcessingTab({
  booking,
  record,
  selectedTravellers,
  setSelectedTravellers,
  refundStatus,
  setRefundStatus,
}: ProcessingTabProps) {
  const toggleTraveller = (travellerId: string) => {
    setSelectedTravellers((prev) =>
      prev.includes(travellerId)
        ? prev.filter((id) => id !== travellerId)
        : [...prev, travellerId],
    );
  };

  const handleSelectAllTravellers = () => {
    if (!booking?.travellers) return;
    if (selectedTravellers.length === booking.travellers.length) {
      setSelectedTravellers([]);
    } else {
      setSelectedTravellers(
        booking.travellers.map((t) => t.id || "").filter(Boolean),
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Passenger Selection */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">
                groups
              </span>
              Select Passengers
            </h3>
            <button
              onClick={handleSelectAllTravellers}
              className="text-xs font-medium text-primary hover:text-primary-hover hover:underline"
            >
              {selectedTravellers.length === booking.travellers?.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">
              Select the passengers for whom you want to process this request.
            </p>
            <div className="space-y-3">
              {booking.travellers?.map((traveller: Traveller, idx: number) => {
                const isSelected = selectedTravellers.includes(
                  traveller.id || "",
                );
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTraveller(traveller.id || "")}
                    className={`relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-1 ring-primary"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {traveller.firstName} {traveller.lastName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{traveller.nationality || "N/A"}</span>
                          <span>•</span>
                          <span className="font-mono">
                            {traveller.eticketNumber || "No Ticket"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[14px]">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">
              info
            </span>
            Request Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase text-slate-500 mb-1">
                Reason
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-900">
                {record.reason || "No reason provided"}
              </div>
            </div>

            {record.reason_detail && (
              <div>
                <label className="block text-xs font-medium uppercase text-slate-500 mb-1">
                  Additional Details
                </label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-900">
                  {record.reason_detail}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase text-slate-500 mb-1">
                Status
              </label>
              <select
                value={refundStatus}
                onChange={(e) => setRefundStatus(e.target.value)}
                className="w-full rounded-lg border-slate-300 text-sm focus:border-primary focus:ring-primary"
              >
                <option value="Processing">Processing</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="More Info Required">More Info Required</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

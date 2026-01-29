import { Booking, ManageBooking } from "@/types";
import FlightDetailsCard from "@/components/booking-management/FlightDetailsCard";
import SendEmailModal from "@/components/booking-management/SendEmailModal";
import { useState } from "react";
import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/email-templates";

interface FlightDetailsTabProps {
  booking: Booking;
  record: ManageBooking;
  onNext: () => void;
  calculations: {
    sellingPrice: number;
    costPrice: number;
    profit: number;
    profitPercent: string;
  };
  requester: {
    name: string;
    email: string;
    agency?: string;
  } | null;
}

export default function FlightDetailsTab({
  booking,
  record,
  onNext,
  calculations,
  requester,
}: FlightDetailsTabProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Note: Requester fetching was in the page. 
  // Ideally, we should fetch this in the parent or reuse the booking user info if available.
  // For now, I'll rely on what's available or we might need to fetch user details in the parent.
  // To avoid complex fetching here, I'll skip the user fetch for now or stub it, 
  // assuming the parent might pass it down if needed.
  // Actually, let's just display what we have or stub "Loading..." if not passed.
  // The original page fetched user details based on record.user_id.

  const itinerary = booking.itineraries?.[0];
  const segments = itinerary?.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (_e) {
      return dateStr;
    }
  };

  const departureInfo = firstSegment?.departure?.at
    ? formatDateTime(firstSegment.departure.at)
    : "10:00 AM";

  const arrivalInfo = lastSegment?.arrival?.at
    ? formatDateTime(lastSegment.arrival.at)
    : "02:00 PM";

  const durationInfo = itinerary?.duration
    ? itinerary.duration.replace("PT", "").toLowerCase()
    : "N/A";

  const flightStatus =
    segments.length > 1 ? `${segments.length - 1} Stop(s)` : "Direct";

  const handleSendEmail = async (data: {
    subject: string;
    message: string;
    template: string;
  }) => {
    console.log("Sending email:", data);
    setIsEmailModalOpen(false);
  };

  const { sellingPrice, costPrice, profit, profitPercent } = calculations;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-50/50">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-600">
                  pending_actions
                </span>
                Refund Request Summary
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                Waiting Response from Agency
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <div className="text-xs font-medium uppercase text-slate-500 mb-1">
                  Reason
                </div>
                <div className="text-sm text-slate-900 font-medium">
                  {record.reason || "Customer Cancellation (Medical)"}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase text-slate-500 mb-1">
                  Request Date
                </div>
                <div className="text-sm text-slate-900 font-medium">
                  {new Date(record.created_at).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase text-slate-500 mb-1">
                  Requested By
                </div>
                <div className="text-sm text-slate-900 font-medium">
                  {requester?.name || "Loading..."}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase text-slate-500 mb-1">
                  Handling Agency
                </div>
                <div className="text-sm text-slate-900 font-medium">
                  {requester?.agency || "Global Travels Inc."}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs font-medium uppercase text-slate-500 mb-1">
                  Notes / Remarks
                </div>
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {record.reason_detail ||
                    "Request forwarded to handling agency. Awaiting confirmation regarding cancellation fees and refund eligibility from their side before processing."}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">
                  history
                </span>
                Communication Log
              </h3>
            </div>
            <div className="p-6">
              <ol className="relative border-l border-slate-200 ml-2">
                <li className="mb-8 ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 ring-4 ring-white">
                    <span
                      className="material-symbols-outlined text-orange-600"
                      style={{ fontSize: "14px" }}
                    >
                      hourglass_empty
                    </span>
                  </span>
                  <h3 className="flex items-center mb-1 text-sm font-semibold text-slate-900">
                    Waiting for Agency Response
                  </h3>
                  <time className="block mb-2 text-xs font-normal leading-none text-slate-400">
                    Current Status
                  </time>
                  <p className="mb-2 text-sm font-normal text-slate-500">
                    Refund request has been sent to the partner agency. Awaiting
                    their confirmation on waiver policy.
                  </p>
                </li>
              </ol>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        Email
                    </button>
                    <button
                        onClick={onNext}
                        className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover"
                    >
                        Next
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleSendEmail}
        initialTemplateId="ticket_confirmation"
        recipient={{
          name: booking.travellers?.[0]
            ? `${booking.travellers[0].firstName} ${booking.travellers[0].lastName}`
            : "Customer",
          email: booking.email || "",
          pnr: booking.PNR
        }}
      />
    </div>
  );
}

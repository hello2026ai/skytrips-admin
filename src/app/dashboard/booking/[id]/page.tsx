"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/types";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (err: any) {
      console.error("Error fetching booking:", err);
      setError(err.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || "Booking not found"}
        </div>
        <button
          onClick={() => router.push("/dashboard/booking")}
          className="mt-4 text-primary hover:underline"
        >
          ← Back to Bookings
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string = "Confirmed") => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "paid":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/30">
      <div className="mb-8">
        <nav className="flex text-sm text-slate-500 mb-2">
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link
            href="/dashboard/booking"
            className="hover:text-primary transition-colors"
          >
            Bookings
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-primary font-medium">Details</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              Booking #{booking.id}
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  booking.payment
                )}`}
              >
                {booking.payment || "Confirmed"}
              </span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage booking details for {booking.travellerFirstName}{" "}
              {booking.travellerLastName}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg shadow-sm hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20">
              <span className="material-symbols-outlined text-lg mr-2">
                cancel
              </span>
              Cancel Booking
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/20">
              <span className="material-symbols-outlined text-lg mr-2">
                download
              </span>
              Download Ticket
            </button>
            <button 
              onClick={() => router.push(`/dashboard/booking/edit/${bookingId}`)}
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary scale-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg mr-2">
                edit
              </span>
              Edit Booking
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Itinerary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="material-symbols-outlined text-primary mr-2">
                  flight_takeoff
                </span>
                Flight Itinerary
              </h3>
              <span className="text-sm font-medium text-slate-500">
                {booking.tripType} • {booking.IssueDay} {booking.issueMonth}{" "}
                {booking.issueYear}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900">
                    {booking.origin}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {booking.origin}
                  </div>
                </div>
                <div className="flex-1 px-8 flex flex-col items-center">
                  <div className="text-sm font-bold text-primary mb-1">
                    16h 45m
                  </div>
                  <div className="w-full flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1 h-0.5 bg-slate-200 mx-1 relative">
                      {booking.transit && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-100 px-3 py-0.5 rounded-full shadow-sm text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                          1 Stop ({booking.transit})
                        </div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-primary rotate-90 text-2xl">
                      flight
                    </span>
                    <div className="flex-1 h-0.5 bg-slate-200 mx-1"></div>
                    <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900">
                    {booking.destination}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {booking.destination}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50/30 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <img
                      alt="Airline"
                      className="h-8 w-8 object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5U8hWQ6ODC0ae4NgdzVeWoVty7ITSwwpRDRVxDe36XWyAhWQR7p1-oyx8yQ8OEKn7j4YXag9Gd5f1LaH7Sqq3Fy3nY95Ba-wt_nhhm8u1AyPMXATsl3EEzHhv7vULNCXrGTa51GWdrTpzgvrJuXGlEDVw_FcWDPq7urpDMNpqZt9fhhQkegeU0C_DCAa7QK7exL-Abo_HzkS6_POah1IQjChTfW3WYWr-iUDnHnug82Jo-KFHsr43kyKKouy679U45eqZ9peW8A"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="font-bold text-slate-900">
                        {booking.airlines}
                      </div>
                      <div className="text-sm font-medium text-slate-500">
                        Flight SQ218 • Economy
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">
                          Depart
                        </span>
                        <span className="text-slate-900 font-bold">
                          {booking.IssueDay} {booking.issueMonth}, 10:30 AM
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">
                          Arrive
                        </span>
                        <span className="text-slate-900 font-bold">
                          {booking.IssueDay} {booking.issueMonth}, 04:20 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.transit && (
                  <>
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 rounded-full border border-amber-100 shadow-sm">
                        <span className="material-symbols-outlined text-amber-600 text-sm">
                          schedule
                        </span>
                        <span className="text-xs font-bold text-amber-700">
                          Layover in {booking.transit} • 3h 15m
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50/30 hover:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <img
                          alt="Airline"
                          className="h-8 w-8 object-contain"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrgdyKAW96_UOctlRGTbWrSQabiBefZ7bqHkQo3qKuvXWZf84OQ0VRRwXPwYR9nxnagn7Kvwez8qDn0QAookSIAIbML7_ifGZs0wFRuHsrl1TddcSRzN6JVSbUEhf0TCgDEeK0fVBEU7Vr4B8FptUnS6w6mVhFwIU2GDDAbH3vWw1gR4yJg_yjZ7fQsaxLVjSCsinHDrmmjl_BxfLHmtG2eP2RNpscdaikAzilpnnUF1o2F9YB8k1jO3jZNwAY-eO8ychRpTDWbg"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <div className="font-bold text-slate-900">
                            {booking.airlines}
                          </div>
                          <div className="text-sm font-medium text-slate-500">
                            Flight SQ401 • Economy
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">
                              Depart
                            </span>
                            <span className="text-slate-900 font-bold">
                              {booking.IssueDay} {booking.issueMonth}, 07:35 PM
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">
                              Arrive
                            </span>
                            <span className="text-slate-900 font-bold">
                              {booking.IssueDay} {booking.issueMonth}, 10:10 PM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Traveller Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="material-symbols-outlined text-primary mr-2">
                  person
                </span>
                Traveller Information
              </h3>
            </div>
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="size-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-4xl shadow-inner border border-primary/20 shrink-0">
                  {booking.travellerFirstName?.charAt(0)}
                  {booking.travellerLastName?.charAt(0)}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {booking.travellerFirstName} {booking.travellerLastName}
                  </h4>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        Email Address
                      </label>
                      <p className="text-sm font-bold text-slate-900 break-all">
                        {booking.travellerFirstName?.toLowerCase()}.
                        {booking.travellerLastName?.toLowerCase()}@example.com
                      </p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        Phone Number
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        +61 412 345 678
                      </p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        Nationality
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        International
                      </p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                        Date of Birth
                      </label>
                      <p className="text-sm font-bold text-slate-900">
                        15 Mar 1985
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="material-symbols-outlined text-primary mr-2">
                  badge
                </span>
                Customer Details
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Customer Full Name
                  </label>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.travellerFirstName} {booking.travellerLastName}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    ID
                  </label>
                  <p className="text-sm font-bold text-slate-900">
                    CUST-{booking.id}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <p className="text-sm font-bold text-slate-900 break-all">
                      {booking.travellerFirstName?.toLowerCase()}.
                      {booking.travellerLastName?.toLowerCase()}@example.com
                    </p>
                    <a
                      className="inline-flex items-center px-3 py-1 text-[10px] font-black rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-colors uppercase tracking-wider"
                      href={`mailto:${booking.travellerFirstName?.toLowerCase()}.${booking.travellerLastName?.toLowerCase()}@example.com`}
                    >
                      <span className="material-symbols-outlined text-xs mr-1.5">
                        email
                      </span>
                      Send Email
                    </a>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Phone Number
                  </label>
                  <p className="text-sm font-bold text-slate-900">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                Booking Summary
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">
                  PNR Reference
                </span>
                <span className="px-3 py-1 text-sm font-black bg-primary/10 text-primary rounded-lg border border-primary/20">
                  {booking.PNR}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">
                  Booking Date
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {booking.IssueDay} {booking.issueMonth} {booking.issueYear}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">
                  Trip Type
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {booking.tripType}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-sm font-medium text-slate-500">
                  Airline
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {booking.airlines}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm font-medium text-slate-500">
                  Payment Status
                </span>
                <span className="flex items-center text-sm font-bold text-emerald-600">
                  <span className="material-symbols-outlined text-sm mr-1.5 fill-1">
                    check_circle
                  </span>
                  {booking.payment || "Paid"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                Payment Details
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Selling Price</span>
                  <span className="text-slate-900 font-bold">
                    {booking.buyingPrice}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900 uppercase">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-primary">
                    {booking.buyingPrice}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Payment Method
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">
                      {booking.payment || "Credit Card"}
                    </span>
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      credit_card
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 flex justify-center items-center px-4 py-3 border border-primary/20 shadow-sm text-sm font-bold rounded-xl text-primary bg-primary/5 hover:bg-primary/10 transition-all active:scale-95">
                <span className="material-symbols-outlined text-lg mr-2">
                  receipt
                </span>
                View Invoice
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Support</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">
                    support_agent
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900 mb-1">
                    Need help with this booking?
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    Contact our 24/7 support team for assistance with changes or
                    cancellations.
                  </p>
                </div>
              </div>
              <a
                className="text-sm font-bold text-primary hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                href="#"
              >
                Contact Support
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

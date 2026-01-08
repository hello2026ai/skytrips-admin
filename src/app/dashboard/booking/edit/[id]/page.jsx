"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AirportAutocomplete from "@/components/AirportAutocomplete";
import AirlineAutocomplete from "@/components/AirlineAutocomplete";
import countryData from "../../../../../../libs/shared-utils/constants/country.json";
// import { Booking } from "@/types";
import Link from "next/link";





export default function EditBookingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [showStopover, setShowStopover] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    travellerFirstName: "",
    travellerLastName: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "Nepalese",
    dob: "",
    tripType: "One Way",
    travelDate: "",
    origin: "",
    destination: "",
    stopoverLocation: "",
    stopoverArrival: "",
    stopoverDeparture: "",
    airlines: "",
    flightNumber: "",
    flightClass: "Economy",
    addons: {
      meals: false,
      wheelchair: false,
      pickup: false,
      dropoff: false,
      luggage: false,
    },
    prices: {
      meals: "0.00",
      wheelchair: "0.00",
      pickup: "0.00",
      dropoff: "0.00",
      luggage: "0.00",
    },
    frequentFlyer: "",
    pnr: "",
    agency: "SkyHigh Agency Ltd.",
    status: "Confirmed",
    paymentStatus: "Pending",
    costPrice: 0,
    sellingPrice: 0,
    customerType: "existing", // Added customerType
    contactType: "existing", // Added contactType for Customer Contact Details
  });

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setBooking(data);
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          travellerFirstName: data.travellerFirstName || "",
          travellerLastName: data.travellerLastName || "",
          passportNumber: data.passportNumber || "",
          passportExpiry: data.passportExpiry || "",
          nationality: data.nationality || "Nepalese",
          dob: data.dob || "",
          tripType: data.tripType || "One Way",
          travelDate: data.travelDate || "",
          origin: data.origin || "",
          destination: data.destination || "",
          stopoverLocation: data.stopoverLocation || "",
          stopoverArrival: data.stopoverArrival || "",
          stopoverDeparture: data.stopoverDeparture || "",
          airlines: data.airlines || "",
          flightNumber: data.flightNumber || "",
          flightClass: data.flightClass || "Economy",
          addons: data.addons || {
            meals: false,
            wheelchair: false,
            pickup: false,
            dropoff: false,
            luggage: false,
          },
          prices: data.prices || {
            meals: "0.00",
            wheelchair: "0.00",
            pickup: "0.00",
            dropoff: "0.00",
            luggage: "0.00",
          },
          frequentFlyer: data.frequentFlyer || "",
          pnr: data.PNR || "",
          agency: data.agency || "SkyHigh Agency Ltd.",
          status: data.status || "Confirmed",
          paymentStatus: data.paymentStatus || "Pending",
          costPrice: data.buyingPrice || 0,
          sellingPrice: data.sellingPrice || 0,
          customerType: data.customerType || "existing",
          contactType: data.contactType || "existing",
        });
        if (data.stopoverLocation) setShowStopover(true);
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith("addon-")) {
      const addonName = name.replace("addon-", "");
      setFormData(prev => ({
        ...prev,
        addons: {
          ...prev.addons,
          [addonName]: e.target.checked
        }
      }));
      return;
    } else if (name.startsWith("price-")) {
      const priceName = name.replace("price-", "");
      setFormData((prev) => ({
        ...prev,
        prices: { ...prev.prices, [priceName]: value },
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const calculateAddonsTotal = () => {
    return Object.values(formData.prices || {}).reduce((acc, price) => acc + (parseFloat(price) || 0), 0).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const addonsTotal = parseFloat(calculateAddonsTotal()) || 0;
    return (sellingPrice + addonsTotal).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        email: formData.email,
        phone: formData.phone,
        travellerFirstName: formData.travellerFirstName,
        travellerLastName: formData.travellerLastName,
        passportNumber: formData.passportNumber,
        passportExpiry: formData.passportExpiry,
        nationality: formData.nationality,
        dob: formData.dob,
        tripType: formData.tripType,
        travelDate: formData.travelDate,
        origin: formData.origin,
        destination: formData.destination,
        stopoverLocation: formData.stopoverLocation,
        stopoverArrival: formData.stopoverArrival,
        stopoverDeparture: formData.stopoverDeparture,
        airlines: formData.airlines,
        flightNumber: formData.flightNumber,
        flightClass: formData.flightClass,
        addons: formData.addons,
        frequentFlyer: formData.frequentFlyer,
        PNR: formData.pnr,
        agency: formData.agency,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        buyingPrice: formData.costPrice,
        sellingPrice: formData.sellingPrice,
        customerType: formData.customerType,
        contactType: formData.contactType,
      };

      const { error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      router.push("/dashboard/booking");
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-w-0 bg-white">
      <div className="mb-10">
        <nav className="flex text-sm text-slate-500 mb-2">
          <Link className="hover:text-slate-700 transition-colors" href="/dashboard">Dashboard</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link className="hover:text-slate-700 transition-colors" href="/dashboard/booking">Bookings</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-primary font-bold">Edit Booking</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Edit Booking #{id}
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-primary border border-primary/20">
                ACTIVE EDIT
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">Update traveller information and itinerary details to keep records accurate.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Contact Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center tracking-tight">
                  <span className="material-symbols-outlined text-primary mr-3">contact_mail</span>
                  Customer Contact Details
                </h3>
              </div>
              <div className="p-8">
                <div className="mb-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center h-6">
                        <input 
                          checked={formData.contactType === 'existing'} 
                          onChange={() => setFormData(prev => ({ ...prev, contactType: 'existing' }))}
                          className="focus:ring-primary h-5 w-5 text-primary border-slate-300 cursor-pointer" 
                          id="existing-contact" 
                          name="contact-type" 
                          type="radio" 
                          value="existing"
                        />
                      </div>
                      <label className="font-bold text-slate-700 text-sm whitespace-nowrap cursor-pointer hover:text-slate-900" htmlFor="existing-contact">Existing Customer</label>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center h-6">
                        <input 
                          checked={formData.contactType === 'new'} 
                          onChange={() => setFormData(prev => ({ ...prev, contactType: 'new' }))}
                          className="focus:ring-primary h-5 w-5 text-primary border-slate-300 cursor-pointer" 
                          id="new-contact" 
                          name="contact-type" 
                          type="radio" 
                          value="new"
                        />
                      </div>
                      <label className="font-bold text-slate-700 text-sm whitespace-nowrap cursor-pointer hover:text-slate-900" htmlFor="new-contact">New Customer</label>
                    </div>
                  </div>
                  
                  {formData.contactType === 'existing' && (
                    <div className="w-full mt-6 relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>search</span>
                      </div>
                      <input className="block w-full h-11 rounded-lg border-slate-200 pl-11 focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm shadow-sm font-medium" id="contact-search" name="contact-search" placeholder="Search by name, email or phone..." type="text"/>
                    </div>
                  )}
                </div>

                {formData.contactType === 'new' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="email">Email Address</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>email</span>
                        </div>
                        <input 
                          className="block w-full h-12 rounded-lg border-slate-200 pl-11 focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium" 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="customer@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="phone">Phone Number</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>phone</span>
                        </div>
                        <input 
                          className="block w-full h-12 rounded-lg border-slate-200 pl-11 focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium" 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+61 XXX XXX XXX"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Traveller Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center tracking-tight">
                  <span className="material-symbols-outlined text-primary mr-3">person</span>
                  Traveller Information
                </h3>
              </div>
              <div className="p-8">
                <div className="mb-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center h-6">
                        <input 
                          checked={formData.customerType === 'existing'} 
                          onChange={() => setFormData(prev => ({ ...prev, customerType: 'existing' }))}
                          className="focus:ring-primary h-5 w-5 text-primary border-slate-300 cursor-pointer" 
                          id="existing-customer" 
                          name="customer-type" 
                          type="radio" 
                          value="existing"
                        />
                      </div>
                      <label className="font-bold text-slate-700 text-sm whitespace-nowrap cursor-pointer hover:text-slate-900" htmlFor="existing-customer">Existing Traveller</label>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center h-6">
                        <input 
                          checked={formData.customerType === 'new'} 
                          onChange={() => setFormData(prev => ({ ...prev, customerType: 'new' }))}
                          className="focus:ring-primary h-5 w-5 text-primary border-slate-300 cursor-pointer" 
                          id="new-customer" 
                          name="customer-type" 
                          type="radio" 
                          value="new"
                        />
                      </div>
                      <label className="font-bold text-slate-700 text-sm whitespace-nowrap cursor-pointer hover:text-slate-900" htmlFor="new-customer">New Traveller</label>
                    </div>
                    {formData.customerType === 'existing' && (
                      <div className="w-full mt-6 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>search</span>
                        </div>
                        <input className="block w-full h-11 rounded-lg border-slate-200 pl-11 focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm shadow-sm font-medium" id="customer-search" name="customer-search" placeholder="Search by name, email or phone..." type="text"/>
                      </div>
                    )}
                  </div>
                </div>
                {formData.customerType === 'new' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">First Name</label>
                      <input 
                        className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium pl-4" 
                        name="travellerFirstName" 
                        type="text" 
                        value={formData.travellerFirstName}
                        onChange={handleChange}
                        placeholder="e.g. John"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Last Name</label>
                      <input 
                        className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium pl-4" 
                        name="travellerLastName" 
                        type="text" 
                        value={formData.travellerLastName}
                        onChange={handleChange}
                        placeholder="e.g. Doe"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="passport-number">Passport Number</label>
                        <div className="relative rounded-lg shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>badge</span>
                          </div>
                          <input 
                            className="block w-full h-12 rounded-lg border-slate-200 pl-11 focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium" 
                            id="passport-number" 
                            name="passportNumber" 
                            placeholder="e.g. A1234567X" 
                            type="text"
                            value={formData.passportNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="passport-expiry">Passport Expiry Date</label>
                        <input 
                          className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                          id="passport-expiry" 
                          name="passportExpiry" 
                          type="date"
                          value={formData.passportExpiry}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="nationality">Nationality</label>
                        <select 
                          className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                          id="nationality" 
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                        >
                          <option value="">Select Nationality</option>
                          {countryData.countries.map((c) => (
                            <option key={c.value} value={c.label}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="dob">Date of Birth</label>
                        <input 
                          className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                          id="dob" 
                          name="dob" 
                          type="date" 
                          value={formData.dob}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Route & Trip Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center tracking-tight">
                  <span className="material-symbols-outlined text-primary mr-3">flight_takeoff</span>
                  Route & Trip Details
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowStopover(!showStopover)}
                  className={`text-sm font-bold transition-all flex items-center px-4 py-2 rounded-lg ${showStopover ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-primary bg-blue-50 hover:bg-blue-100'}`}
                >
                  <span className="material-symbols-outlined text-base mr-2">
                    {showStopover ? 'remove_circle' : 'add_circle'}
                  </span>
                  {showStopover ? 'Remove Stopover' : 'Add Stopover'}
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="trip-type">Trip Type</label>
                    <select 
                      className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                      id="trip-type" 
                      name="tripType"
                      value={formData.tripType}
                      onChange={handleChange}
                    >
                      <option value="One Way">One Way</option>
                      <option>Round Trip</option>
                      <option>Multi City</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="travel-date">Travel Date</label>
                    <input 
                      className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                      id="travel-date" 
                      name="travelDate" 
                      type="date" 
                      value={formData.travelDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <AirportAutocomplete 
                      label="Origin (From)"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      disabled={saving}
                      icon="flight_takeoff"
                    />
                  </div>
                  <div>
                    <AirportAutocomplete 
                      label="Destination (To)"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      disabled={saving}
                      icon="flight_land"
                    />
                  </div>
                  
                  {showStopover && (
                    <div className="md:col-span-2 bg-slate-50/50 border border-slate-100 rounded-xl p-6 mt-2 mb-2 relative transition-all duration-300">
                      <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                        Stopover Segment Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="stopover-location">Stopover Location</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>place</span>
                            </div>
                            <input 
                              className="block w-full h-12 pl-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium" 
                              id="stopover-location" 
                              name="stopoverLocation" 
                              placeholder="City, Airport Code" 
                              type="text"
                              value={formData.stopoverLocation}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="stopover-arrival">Arrival Date</label>
                          <input 
                            className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                            id="stopover-arrival" 
                            name="stopoverArrival" 
                            type="date"
                            value={formData.stopoverArrival}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="stopover-departure">Departure Date</label>
                          <input 
                            className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                            id="stopover-departure" 
                            name="stopoverDeparture" 
                            type="date"
                            value={formData.stopoverDeparture}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Flight Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1">
                        <AirlineAutocomplete 
                          label="Airline"
                          name="airlines"
                          value={formData.airlines}
                          onChange={handleChange}
                          disabled={saving}
                          icon="airlines"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="flight-number">Flight No.</label>
                        <input 
                          className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                          id="flight-number" 
                          name="flightNumber" 
                          placeholder="e.g. SQ218" 
                          type="text" 
                          value={formData.flightNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="flight-class">Class</label>
                        <select 
                          className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                          id="flight-class" 
                          name="flightClass"
                          value={formData.flightClass}
                          onChange={handleChange}
                        >
                          <option value="Economy">Economy</option>
                          <option>Premium Economy</option>
                          <option>Business</option>
                          <option>First Class</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-3">
                      <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Itinerary Modification</p>
                        <p className="text-xs text-blue-600 mt-0.5">Changing origin, destination, or dates may affect pricing. Ensure to re-calculate fares after modifying the itinerary.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons & Services */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center tracking-tight">
                  <span className="material-symbols-outlined text-primary mr-3">extension</span>
                  Add-ons & Services
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Ancillary Services</h4>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="flex items-center">
                        <label className="flex items-center space-x-4 cursor-pointer group">
                          <input 
                            className="h-5 w-5 text-primary border-slate-300 rounded focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            name="addon-meals"
                            checked={formData.addons.meals}
                            onChange={handleChange}
                          />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Meals</span>
                        </label>
                        <button 
                          type="button"
                          onClick={() => setIsMealModalOpen(true)}
                          className="ml-4 text-xs font-bold text-primary hover:text-blue-700 cursor-pointer flex items-center gap-1.5 transition-colors px-2 py-1 bg-blue-50 rounded-md"
                        >
                          <span className="material-symbols-outlined text-base">tune</span>
                          Options
                        </button>
                      </div>
                      <div className="relative w-32">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-slate-400 font-bold sm:text-xs">$</span>
                        </div>
                        <input className="block w-full h-10 rounded-lg border-slate-200 pl-7 text-right focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700" name="price-meals" value={formData.prices?.meals || ""} onChange={handleChange} placeholder="0.00" type="number"/>
                      </div>
                    </div>
                    {/* Simplified remaining addons */}
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <label className="flex items-center space-x-4 cursor-pointer group">
                        <input 
                          className="h-5 w-5 text-primary border-slate-300 rounded focus:ring-primary transition-all cursor-pointer" 
                          type="checkbox"
                          name="addon-wheelchair"
                          checked={formData.addons.wheelchair}
                          onChange={handleChange}
                        />
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Wheelchair</span>
                      </label>
                      <div className="relative w-32">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-slate-400 font-bold sm:text-xs">$</span>
                        </div>
                        <input className="block w-full h-10 rounded-lg border-slate-200 pl-7 text-right focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700" name="price-wheelchair" value={formData.prices?.wheelchair || ""} onChange={handleChange} placeholder="0.00" type="number"/>
                      </div>
                    </div>
                    <div className="pt-6 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Add-ons Subtotal</span>
                      <div className="text-xl font-black text-primary">${calculateAddonsTotal()}</div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="frequent-flyer">Frequent Flyer Number</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>loyalty</span>
                        </div>
                        <input 
                          className="block w-full h-12 rounded-lg border-slate-200 pl-11 focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium" 
                          id="frequent-flyer" 
                          name="frequentFlyer" 
                          placeholder="e.g. AA-12345678" 
                          type="text"
                          value={formData.frequentFlyer}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 tracking-tight">Seat Selection</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-primary/30 transition-all cursor-pointer group h-28">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary mb-2 transition-colors" style={{ fontSize: '28px' }}>event_seat</span>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors tracking-tight">Select Premium Seat</span>
                        <span className="text-xs text-primary mt-1 font-black bg-blue-50 px-2 py-0.5 rounded">FROM $25.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Booking Details</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ID Ref (Read Only)</label>
                  <input className="block w-full h-11 rounded-lg border-slate-100 bg-slate-50 text-slate-400 shadow-none cursor-not-allowed sm:text-sm font-mono" readOnly type="text" value={`#${id}`}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="pnr">PNR Reference</label>
                  <input 
                    className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 font-mono uppercase sm:text-sm font-bold text-slate-700 pl-4" 
                    id="pnr" 
                    name="pnr" 
                    type="text" 
                    value={formData.pnr}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="agency">Issued through</label>
                  <select 
                    className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700 px-4" 
                    id="agency" 
                    name="agency"
                    value={formData.agency}
                    onChange={handleChange}
                  >
                    <option value="SkyHigh Agency Ltd.">SkyHigh Agency Ltd.</option>
                    <option>Global Travels Inc.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="status">Booking Status</label>
                  <select 
                    className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700 px-4" 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Financials Summary</h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="payment-status">Payment Status</label>
                  <select 
                    className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700 px-4" 
                    id="payment-status" 
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                  >
                    <option>Paid</option>
                    <option value="Pending">Pending</option>
                    <option>Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="cost-price">Cost Price ($)</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-slate-400 font-bold">$</span>
                    </div>
                    <input 
                      className="block w-full h-11 rounded-lg border-slate-200 pl-8 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700" 
                      id="cost-price" 
                      name="costPrice" 
                      step="0.01" 
                      type="number" 
                      value={formData.costPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="selling-price">Selling Price ($)</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-slate-400 font-bold">$</span>
                    </div>
                    <input 
                      className="block w-full h-11 rounded-lg border-slate-200 pl-8 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-black text-primary" 
                      id="selling-price" 
                      name="sellingPrice" 
                      step="0.01" 
                      type="number" 
                      value={formData.sellingPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 mt-4 border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-500">Net Cost</span>
                    <span className="text-sm font-black text-slate-900">${formData.costPrice}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <span className="text-base font-black text-slate-900">Grand Total</span>
                    <span className="text-xl font-black text-primary tracking-tight">${calculateGrandTotal()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <button 
                className="w-full flex justify-center items-center h-14 border border-transparent shadow-lg text-base font-black rounded-xl text-white bg-primary hover:bg-blue-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-blue-500/20 disabled:opacity-50" 
                type="submit"
                disabled={saving}
              >
                <span className="material-symbols-outlined text-2xl mr-3">save</span>
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button 
                className="w-full flex justify-center items-center h-14 border-2 border-slate-100 shadow-sm text-base font-bold rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all" 
                type="button"
                onClick={() => router.push("/dashboard/booking")}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Meal Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center overflow-hidden p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsMealModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden ring-1 ring-slate-200 flex flex-col max-h-[90vh] transition-all transform scale-100">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Select Meal Options</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Premium Flight Services</p>
              </div>
              <button onClick={() => setIsMealModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-all cursor-pointer p-2 rounded-xl hover:bg-slate-100">
                <span className="material-symbols-outlined font-bold">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              {[
                { id: 'vml', name: 'Vegetarian Hindu Meal', desc: 'No beef, no pork, prepared with dairy.' },
                { id: 'moors', name: 'Muslim Meal', desc: 'No pork, no alcohol, Halal certified.' },
                { id: 'ksml', name: 'Kosher Meal', desc: 'Prepared under rabbinic supervision.' },
                { id: 'vgml', name: 'Vegan Meal', desc: 'No animal products, no honey or eggs.' },
                { id: 'gfml', name: 'Gluten Free Meal', desc: 'Prepared without wheat, barley or rye.' }
              ].map((meal) => (
                <label key={meal.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-blue-50/30 cursor-pointer transition-all group">
                  <div className="flex items-center h-6 mt-1">
                    <input name="meal-selection" type="radio" className="w-5 h-5 text-primary border-slate-300 focus:ring-primary cursor-pointer" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{meal.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{meal.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
              <button onClick={() => setIsMealModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">CLOSE</button>
              <button onClick={() => setIsMealModalOpen(false)} className="px-8 py-2.5 text-sm font-black text-white bg-primary rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">CONFIRM SELECTION</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import AirportAutocomplete from "@/components/AirportAutocomplete";
import AirlineAutocomplete from "@/components/AirlineAutocomplete";
import countryData from "../../../../libs/shared-utils/constants/country.json";

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  onEdit,
  booking,
  isLoading,
  isReadOnly = false,
}) {
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [showStopover, setShowStopover] = useState(false);
  const [formData, setFormData] = useState({
    email: "sarita.p@example.com",
    phone: "+61 412 345 678",
    travellerFirstName: "",
    travellerLastName: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "Nepalese",
    dob: "1985-03-15",
    tripType: "One Way",
    travelDate: "",
    origin: "",
    destination: "",
    transit: "",
    airlines: "",
    flightNumber: "",
    flightClass: "Economy",
    frequentFlyer: "",
    pnr: "",
    ticketNumber: "",
    issueMonth: "",
    IssueDay: "",
    issueYear: "",
    agency: "SkyHigh Agency Ltd.",
    handledBy: "John Doe",
    status: "Confirmed",
    currency: "USD",
    paymentStatus: "Pending",
    paymentMethod: "",
    transactionId: "",
    paymentDate: "",
    buyingPrice: "0.00",
    costPrice: "0.00",
    sellingPrice: "0.00",
    payment: "Pending", // For backward compatibility
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
    customerType: "existing",
    contactType: "existing",
  });

  useEffect(() => {
    if (booking) {
      setFormData((prev) => ({
        ...prev,
        ...booking,
        pnr: booking.PNR || prev.pnr,
        // Ensure all fields are mapped
        issueMonth: booking.issueMonth || "",
        IssueDay: booking.IssueDay || "",
        issueYear: booking.issueYear || "",
        buyingPrice: booking.buyingPrice || "0.00",
        payment: booking.payment || "Pending",
        customerType: booking.customerType || "existing",
        contactType: booking.contactType || "existing",
      }));
    } else {
      // Reset for new booking
      setFormData({
        email: "",
        phone: "",
        travellerFirstName: "",
        travellerLastName: "",
        passportNumber: "",
        passportExpiry: "",
        nationality: "Australian",
        dob: "",
        tripType: "One Way",
        travelDate: "",
        origin: "",
        destination: "",
        transit: "",
        airlines: "",
        flightNumber: "",
        flightClass: "Economy",
        frequentFlyer: "",
        pnr: "",
        ticketNumber: "",
        issueMonth: "",
        IssueDay: "",
        issueYear: "",
        agency: "SkyHigh Agency Ltd.",
        handledBy: "",
        status: "Confirmed",
        currency: "USD",
        paymentStatus: "Pending",
        paymentMethod: "",
        transactionId: "",
        paymentDate: "",
        buyingPrice: "0.00",
        costPrice: "0.00",
        sellingPrice: "0.00",
        payment: "Pending",
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
        customerType: "existing",
        contactType: "existing",
      });
    }
  }, [booking, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox" && name.startsWith("addon-")) {
      const addonName = name.replace("addon-", "");
      setFormData((prev) => ({
        ...prev,
        addons: { ...prev.addons, [addonName]: checked },
      }));
    } else if (name.startsWith("price-")) {
      const priceName = name.replace("price-", "");
      setFormData((prev) => ({
        ...prev,
        prices: { ...prev.prices, [priceName]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateAddonsTotal = () => {
    return Object.values(formData.prices || {}).reduce((acc, price) => acc + (parseFloat(price) || 0), 0).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const addonsTotal = parseFloat(calculateAddonsTotal()) || 0;
    return (sellingPrice + addonsTotal).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    // Map back to the Booking interface structure before saving
    const bookingToSave = {
      travellerFirstName: formData.travellerFirstName,
      travellerLastName: formData.travellerLastName,
      PNR: formData.pnr,
      ticketNumber: formData.ticketNumber || (formData.pnr + "01"),
      airlines: formData.airlines,
      origin: formData.origin,
      transit: formData.transit,
      destination: formData.destination,
      tripType: formData.tripType,
      issueMonth: formData.issueMonth || new Date().getMonth() + 1 + "",
      IssueDay: formData.IssueDay || new Date().getDate() + "",
      issueYear: formData.issueYear || new Date().getFullYear() + "",
      buyingPrice: formData.buyingPrice,
      payment: formData.paymentStatus, // Or use formData.payment
      customerType: formData.customerType,
      contactType: formData.contactType,
    };
    onSave(bookingToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-6xl h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden border border-gray-200 mx-4">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8 z-10 shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {booking ? "Edit Booking" : "New Booking"}
            </h1>
            <p className="text-xs text-gray-500">
              {booking ? `Manage details for Booking #${booking.id}` : "Enter new booking details"}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </header>

        {/* Main Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <main className="p-6 lg:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Columns (Main Form) */}
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
                                disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                              disabled={isReadOnly}
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
                              disabled={isReadOnly}
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
                                  name="passportNumber" 
                                  placeholder="e.g. A1234567X" 
                                  type="text"
                                  value={formData.passportNumber}
                                  onChange={handleChange}
                                  disabled={isReadOnly}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="passport-expiry">Passport Expiry Date</label>
                              <input 
                                className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                                name="passportExpiry" 
                                type="date"
                                value={formData.passportExpiry}
                                onChange={handleChange}
                                disabled={isReadOnly}
                              />
                            </div>
                          </div>
                          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight" htmlFor="nationality">Nationality</label>
                              <select 
                                className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                disabled={isReadOnly}
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
                                name="dob" 
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                disabled={isReadOnly}
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
                          <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Trip Type</label>
                          <select 
                            className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                            name="tripType"
                            value={formData.tripType}
                            onChange={handleChange}
                            disabled={isReadOnly}
                          >
                            <option>One Way</option>
                            <option>Round Trip</option>
                            <option>Multi City</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Travel Date</label>
                          <input 
                            className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                            name="travelDate" 
                            type="date"
                            value={formData.travelDate}
                            onChange={handleChange}
                            disabled={isReadOnly}
                          />
                        </div>
                        <div>
                          <AirportAutocomplete 
                            label="Origin (From)"
                            name="origin"
                            value={formData.origin}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            icon="flight_takeoff"
                          />
                        </div>
                        <div>
                          <AirportAutocomplete 
                            label="Destination (To)"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            disabled={isReadOnly}
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
                                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Stopover Location</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>place</span>
                                  </div>
                                  <input 
                                    className="block w-full h-12 pl-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium" 
                                    name="stopoverLocation" 
                                    placeholder="City, Airport Code" 
                                    type="text"
                                    value={formData.stopoverLocation}
                                    onChange={handleChange}
                                    disabled={isReadOnly}
                                  />
                                </div>
                              </div>
                              <div className="md:col-span-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Arrival Date</label>
                                <input 
                                  className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                                  name="stopoverArrival" 
                                  type="date"
                                  value={formData.stopoverArrival}
                                  onChange={handleChange}
                                  disabled={isReadOnly}
                                />
                              </div>
                              <div className="md:col-span-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Departure Date</label>
                                <input 
                                  className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                                  name="stopoverDeparture" 
                                  type="date"
                                  value={formData.stopoverDeparture}
                                  onChange={handleChange}
                                  disabled={isReadOnly}
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
                                disabled={isReadOnly}
                                icon="airlines"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Flight No.</label>
                              <input 
                                className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                                name="flightNumber" 
                                placeholder="e.g. SQ218" 
                                type="text"
                                value={formData.flightNumber}
                                onChange={handleChange}
                                disabled={isReadOnly}
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">Class</label>
                              <select 
                                className="block w-full h-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium px-4" 
                                name="flightClass"
                                value={formData.flightClass}
                                onChange={handleChange}
                                disabled={isReadOnly}
                              >
                                <option>Economy</option>
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
                                disabled={isReadOnly}
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
                  {/* Booking Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">Booking Details</h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ID Ref (Read Only)</label>
                        <input className="block w-full h-11 rounded-lg border-slate-100 bg-slate-50 text-slate-400 shadow-none cursor-not-allowed sm:text-sm font-mono" readOnly type="text" value={booking?.id ? `#${booking.id}` : "NEW"}/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="pnr">PNR Reference</label>
                        <input 
                          className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 font-mono uppercase sm:text-sm font-bold text-slate-700 pl-4" 
                          name="pnr" 
                          type="text"
                          value={formData.pnr}
                          onChange={handleChange}
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="agency">Issued through</label>
                        <select className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700 px-4" name="agency" value={formData.agency} onChange={handleChange} disabled={isReadOnly}>
                          <option>SkyHigh Agency Ltd.</option>
                          <option>Global Travels Inc.</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="status">Booking Status</label>
                        <select className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700 px-4" name="status" value={formData.status} onChange={handleChange} disabled={isReadOnly}>
                          <option>Confirmed</option>
                          <option>Pending</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">Financials Summary</h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="payment-status">Payment Status</label>
                        <select className="block w-full h-11 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 sm:text-sm font-bold text-slate-700 px-4" name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} disabled={isReadOnly}>
                          <option>Paid</option>
                          <option>Pending</option>
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
                            name="costPrice" 
                            type="number" 
                            step="0.01" 
                            value={formData.costPrice} 
                            onChange={handleChange} 
                            disabled={isReadOnly}
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
                            name="sellingPrice" 
                            type="number" 
                            step="0.01" 
                            value={formData.sellingPrice} 
                            onChange={handleChange} 
                            disabled={isReadOnly}
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

                  {/* Actions */}
                  <div className="pt-4 flex flex-col gap-3 sticky bottom-0 bg-gray-50 p-2 -mx-2">
                    <button 
                      className="w-full flex justify-center items-center h-14 border border-transparent shadow-lg text-base font-black rounded-xl text-white bg-primary hover:bg-blue-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-blue-500/20 disabled:opacity-50" 
                      type="submit"
                      disabled={isLoading}
                    >
                      <span className="material-symbols-outlined text-2xl mr-3">save</span>
                      {isLoading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                    <button 
                      className="w-full flex justify-center items-center h-14 border-2 border-slate-100 shadow-sm text-base font-bold rounded-xl text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all" 
                      type="button"
                      onClick={onClose}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>

      {/* Meal Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMealModalOpen(false)}></div>
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

      {/* Material Icons Link Removed */}
    </div>
  );
}

"use client";

import RouteForm from "@/components/dashboard/routes/RouteForm";

export default function CreateRoutePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add New Route</h1>
        <p className="text-slate-500">Create a new flight route</p>
      </div>
      <RouteForm />
    </div>
  );
}

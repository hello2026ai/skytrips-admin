"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RouteForm from "@/components/dashboard/routes/RouteForm";
import { Route } from "@/types/route";

export default function EditRoutePage() {
  const params = useParams();
  const router = useRouter();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const { data, error } = await supabase
          .from("routes")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setRoute(data);
      } catch (error) {
        console.error("Error fetching route:", error);
        router.push("/dashboard/routes");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRoute();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-slate-500">Loading route details...</div>
      </div>
    );
  }

  if (!route) {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Route</h1>
        <p className="text-slate-500">Update route schedule and details</p>
      </div>
      <RouteForm initialData={route} isEdit />
    </div>
  );
}

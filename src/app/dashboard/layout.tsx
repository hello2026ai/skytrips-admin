"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, getCurrentUser } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only redirect if not using static admin
      const isStaticAdmin = localStorage.getItem("isAdmin") === "true";
      if (!session && !isStaticAdmin) {
        router.push("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const checkAuth = async () => {
    try {
      // Check for static admin session first
      const isStaticAdmin = localStorage.getItem("isAdmin") === "true";

      if (isStaticAdmin) {
        setUserEmail("admin@skytrips.com.au");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Otherwise check Supabase auth
      const { user, isAdmin } = await getCurrentUser();

      if (!user || !isAdmin) {
        router.push("/");
        return;
      }

      setUserEmail(user.email || "");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear static admin session
      localStorage.removeItem("isAdmin");

      // Also sign out from Supabase
      await supabase.auth.signOut();

      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white font-display text-slate-900 h-screen overflow-hidden flex w-full">
      {/* Side Navigation */}
      <aside className="w-64 bg-white border-r border-slate-100 flex-col hidden md:flex h-full flex-shrink-0 z-20">
        <div className="p-6 pb-2">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <div
              className="bg-center bg-no-repeat bg-cover rounded-xl size-10 shadow-sm border border-primary/20 bg-primary/5"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBITXaAg6zaUCIOjUTE68Ge0G4SmMV4Pv3Lcqnku1BN_EltI3RchuZZ2qNbptNXQqdfZeXiyDf1piWwfpuBC1nvCEdNcp4CvSAUrRlEn1kFwiNird4P5EFYVdH-3Fom70VdDFXNpoxIMrLapPyNuPU3TR4PgFcQQ6AaQg9BOOy5Rtntf9UeV6IsH7QHo9zwL2Qe-kwKhfCcFDen2t2Fnw9utzNilh-XO-UZoKpYoQ8K-VJOKnyj20c1yEcAnYbxQXI_SbVjKO-Pzts")',
              }}
            ></div>
            <h1 className="text-primary text-xl font-black leading-normal tracking-tight">
              SkyTrips
            </h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-4 mt-6 flex-1 overflow-y-auto">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              pathname === "/dashboard"
                ? "bg-primary text-white shadow-md shadow-blue-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 group"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                pathname === "/dashboard"
                  ? "active-icon"
                  : "group-hover:text-primary transition-colors"
              }`}
            >
              dashboard
            </span>
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </Link>

          {/* Flights */}
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              flight
            </span>
            <p className="text-sm font-medium leading-normal">Flights</p>
          </Link>

          {/* Hotels */}
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              hotel
            </span>
            <p className="text-sm font-medium leading-normal">Hotels</p>
          </Link>

          {/* Customers */}
          <Link
            href="/dashboard/customers"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              pathname === "/dashboard/customers"
                ? "bg-primary text-white shadow-md shadow-blue-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 group"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                pathname === "/dashboard/customers"
                  ? "active-icon"
                  : "group-hover:text-primary transition-colors"
              }`}
            >
              group
            </span>
            <p className="text-sm font-medium leading-normal">Customers</p>
          </Link>

          {/* Bookings */}
          <Link
            href="/dashboard/booking"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              pathname === "/dashboard/booking"
                ? "bg-primary text-white shadow-md shadow-blue-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 group"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                pathname === "/dashboard/booking"
                  ? "active-icon"
                  : "group-hover:text-primary transition-colors"
              }`}
            >
              confirmation_number
            </span>
            <p className="text-sm font-medium leading-normal">Bookings</p>
          </Link>

          {/* Analytics */}
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              bar_chart
            </span>
            <p className="text-sm font-medium leading-normal">Analytics</p>
          </Link>

          {/* Support */}
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              support_agent
            </span>
            <p className="text-sm font-medium leading-normal">Support</p>
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">Sign Out</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 bg-white overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap bg-white border-b border-slate-100 px-6 py-4 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-500">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <h2 className="text-slate-900 text-lg font-bold leading-tight">
                Dashboard Overview
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Welcome back, Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <label className="hidden md:flex flex-col min-w-64 h-10">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="text-slate-500 flex items-center justify-center pl-4 pr-2">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    search
                  </span>
                </div>
                <input
                  className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 text-sm font-normal"
                  placeholder="Search bookings, users..."
                />
              </div>
            </label>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-50 text-slate-900 transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-sm cursor-pointer"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtdUFJhCY23zRHICCmdcqLphWmvNrGwS4fcKPbXSW5jX8KWpfe5nuooOqBEsvDtEahEUHfI_is0F8NU-gYv2iA-gmKGGPg7K0T0lawDA5xEtl3B8jhCzh681V3xVwHpkvOOXSXzj7GFDu5AP3ixiwPYzT4VUTd7fWIFEKSztODrf3nFh5bITRQG4zAn7kdaJ82gHHxViATaKOD7AIn6Ghks-sXo0-1fv1T9jE8Vfpq_nCg_Zc5lfs6jBTvMCIHcjvadlicEr9mXT4")',
                }}
              ></div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

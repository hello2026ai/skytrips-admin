"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CompanyLogoProps {
  className?: string;
  fallbackText?: string;
}

export function CompanyLogo({ className, fallbackText = "admin panel" }: CompanyLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.logo_url) {
            setLogoUrl(data.logo_url);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch company logo:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLogo();
  }, []);

  if (loading) {
    return (
      <div className={`h-8 w-32 bg-muted/20 animate-pulse rounded ${className}`} />
    );
  }

  if (error || !logoUrl) {
    return (
      <h1 className={`text-primary text-xl font-black leading-normal tracking-tight ${className}`}>
        {fallbackText}
      </h1>
    );
  }

  return (
    <div className={`relative h-10 w-auto max-w-[180px] ${className}`}>
      <img
        src={logoUrl}
        alt="Company Logo"
        className="h-full w-auto object-contain object-left"
        onError={() => setError(true)}
      />
    </div>
  );
}

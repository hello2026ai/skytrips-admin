"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserWelcomeProps {
  email?: string;
  className?: string;
}

export function UserWelcome({ email, className }: UserWelcomeProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: any;
    let isMounted = true;

    async function fetchProfile() {
      // Try to get email from Supabase session if not provided
      let currentEmail = email;
      
      if (!currentEmail) {
        const { data } = await supabase.auth.getUser();
        currentEmail = data?.user?.email;
      }

      // If still no email, use fallback
      if (!currentEmail) {
        if (isMounted) {
          setDisplayName("Admin");
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("email", currentEmail)
          .single();

        if (error) {
           console.warn("User profile fetch error:", error);
           if (isMounted) {
             setDisplayName(currentEmail.split("@")[0]);
           }
        } else if (data?.first_name || data?.last_name) {
          const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
          if (isMounted) {
            setDisplayName(name);
          }
        } else {
          if (isMounted) {
            setDisplayName(currentEmail.split("@")[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        if (isMounted) {
          setDisplayName(currentEmail.split("@")[0] || "Admin");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }

      // Subscribe to changes for this user
      if (currentEmail) {
        channel = supabase
            .channel(`user_welcome_${currentEmail}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `email=eq.${currentEmail}`
                },
                (payload) => {
                    const newData = payload.new as any;
                    if (isMounted && (newData.first_name || newData.last_name)) {
                         const name = [newData.first_name, newData.last_name].filter(Boolean).join(" ");
                         setDisplayName(name);
                    }
                }
            )
            .subscribe();
      }
    }

    fetchProfile();

    return () => {
        isMounted = false;
        if (channel) {
            supabase.removeChannel(channel);
        }
    };
  }, [email]);

  if (loading) {
    return (
      <p className={className} aria-busy="true" aria-label="Loading user name">
        Welcome back, <span className="animate-pulse">...</span>
      </p>
    );
  }

  return (
    <p className={className} data-testid="user-welcome-message">
      Welcome back, {displayName}
    </p>
  );
}

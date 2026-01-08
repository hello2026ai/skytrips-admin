"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  bio: string;
  location: string;
  avatarUrl: string;
  language: string;
  timezone: string;
  notifications: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@traveldash.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Travel Manager",
    bio: "Passionate about organizing seamless travel experiences for corporate teams.",
    location: "San Francisco, CA",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtdUFJhCY23zRHICCmdcqLphWmvNrGwS4fcKPbXSW5jX8KWpfe5nuooOqBEsvDtEahEUHfI_is0F8NU-gYv2iA-gmKGGPg7K0T0lawDA5xEtl3B8jhCzh681V3xVwHpkvOOXSXzj7GFDu5AP3ixiwPYzT4VUTd7fWIFEKSztODrf3nFh5bITRQG4zAn7kdaJ82gHHxViATaKOD7AIn6Ghks-sXo0-1fv1T9jE8Vfpq_nCg_Zc5lfs6jBTvMCIHcjvadlicEr9mXT4",
    language: "en-US",
    timezone: "Pacific Time (US & Canada)",
    notifications: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // In a real app, we would fetch additional profile data from a profiles table
        setProfile(prev => ({
          ...prev,
          email: user.email || prev.email,
          // firstName: user.user_metadata?.first_name || prev.firstName,
          // lastName: user.user_metadata?.last_name || prev.lastName,
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would update the profile in Supabase
      // const { error } = await supabase.from('profiles').update({ ... }).eq('id', user.id);
      
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Profile Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal information and account preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div 
            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-background shadow-md"
            style={{ backgroundImage: `url("${profile.avatarUrl}")` }}
          />
          <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-xl font-bold text-foreground">{profile.firstName} {profile.lastName}</h2>
          <p className="text-muted-foreground font-medium">{profile.jobTitle}</p>
          <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {profile.location}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-bold text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors">
            Remove
          </button>
          <button className="px-4 py-2 text-sm font-bold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-blue-500/20">
            Change Avatar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Information */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="font-bold text-foreground">Personal Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">First Name</label>
                  <input 
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Last Name</label>
                  <input 
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Job Title</label>
                <input 
                  type="text"
                  value={profile.jobTitle}
                  onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Bio</label>
                <textarea 
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  maxLength={500}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
                <div className="text-right text-xs text-muted-foreground">
                  {profile.bio.length}/500 characters
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">contact_mail</span>
              <h3 className="font-bold text-foreground">Contact Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-muted-foreground text-[20px]">mail</span>
                  <input 
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full pl-10 pr-20 py-2 bg-muted/50 border border-input rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Phone Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-muted-foreground text-[20px]">call</span>
                  <input 
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Settings & Preferences */}
        <div className="space-y-8">
          
          {/* Account Activity */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h3 className="font-bold text-foreground">Account Activity</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                  <p className="text-3xl font-black text-primary">124</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Total Bookings</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center dark:bg-emerald-900/10 dark:border-emerald-900/20">
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">Active</p>
                  <p className="text-xs font-bold text-emerald-700/70 dark:text-emerald-400/70 uppercase tracking-wider mt-1">Status</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-bold text-foreground">Oct 2021</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last login</span>
                  <span className="font-bold text-foreground">Today, 10:23 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              <h3 className="font-bold text-foreground">Preferences</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Language</label>
                <select 
                  value={profile.language}
                  onChange={(e) => setProfile({...profile, language: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Time Zone</label>
                <select 
                  value={profile.timezone}
                  onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option>Pacific Time (US & Canada)</option>
                  <option>Eastern Time (US & Canada)</option>
                  <option>London</option>
                  <option>Paris</option>
                  <option>Tokyo</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-foreground block">Notifications</label>
                  <p className="text-xs text-muted-foreground">Receive email updates</p>
                </div>
                <button 
                  onClick={() => setProfile({...profile, notifications: !profile.notifications})}
                  className={`w-11 h-6 rounded-full transition-colors relative ${profile.notifications ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${profile.notifications ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings</span>
              <h3 className="font-bold text-foreground">Account Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary">lock</span>
                  <span className="text-sm font-medium">Change Password</span>
                </div>
                <span className="material-symbols-outlined text-muted-foreground text-[18px]">chevron_right</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary">shield</span>
                  <span className="text-sm font-medium">Privacy Settings</span>
                </div>
                <span className="material-symbols-outlined text-muted-foreground text-[18px]">chevron_right</span>
              </button>

              <div className="pt-4 border-t border-border">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors font-medium"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-6 bg-card border border-border p-4 rounded-xl shadow-lg flex items-center justify-between md:justify-end gap-4 z-10 animate-in slide-in-from-bottom-2">
        <button 
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

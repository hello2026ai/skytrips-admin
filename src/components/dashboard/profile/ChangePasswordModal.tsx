"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Zod schema for password validation
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PasswordFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const result = passwordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PasswordFormData, string>> = {};
      // Try accessing issues directly, as ZodError has an issues array
      const issues = result.error.issues || result.error.errors;
      if (issues) {
        issues.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof PasswordFormData] = error.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validate()) return;

    setLoading(true);

    try {
      // Note: Supabase Admin API doesn't verify current password automatically if logged in.
      // But good practice often involves re-authentication or ensuring the session is valid.
      // Since we can't easily "verify" the old password without signing in again (which might invalidate session),
      // we'll proceed with the update. 
      // Ideally, we'd sign in with the old password first to verify it, but that might complicate session state.
      // For this implementation, we'll assume the user is authenticated and authorized to change their password.
      // However, to strictly follow the requirement of "form validation for current password", we can attempt a signIn.
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("User not found");

      // Verify current password by attempting a sign in (optional but recommended for security)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      });

      if (signInError) {
        setErrors((prev) => ({ ...prev, currentPassword: "Incorrect current password" }));
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }, 2000);

    } catch (err: any) {
      console.error("Password update error:", err);
      setGeneralError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(formData.newPassword);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-black text-slate-900 tracking-tight">Change Password</h2>
          <button 
            onClick={onClose} 
            className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Password Updated!</h3>
            <p className="text-slate-500">Your password has been changed successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {generalError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-lg">error</span>
                {generalError}
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest" htmlFor="current-password">Current Password</label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.currentPassword ? "border-red-300 focus:border-red-500" : "border-slate-100 focus:border-primary/50"} rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">{showCurrent ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
              {errors.currentPassword && <p className="text-xs text-red-500 font-medium pl-1">{errors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest" htmlFor="new-password">New Password</label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.newPassword ? "border-red-300 focus:border-red-500" : "border-slate-100 focus:border-primary/50"} rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">{showNew ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
              
              {/* Strength Meter */}
              {formData.newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full transition-colors duration-300 ${
                          i <= strength 
                            ? strength <= 2 ? "bg-red-400" : strength <= 4 ? "bg-yellow-400" : "bg-green-500"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-right font-bold text-slate-400">
                    {strength <= 2 ? "Weak" : strength <= 4 ? "Medium" : "Strong"}
                  </p>
                </div>
              )}
              
              {errors.newPassword && <p className="text-xs text-red-500 font-medium pl-1">{errors.newPassword}</p>}
              
              <ul className="text-[10px] text-slate-400 pl-1 space-y-0.5 list-disc list-inside">
                <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>Uppercase letter</li>
                <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>Lowercase letter</li>
                <li className={/[0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>Number</li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>Special character</li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest" htmlFor="confirm-password">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.confirmPassword ? "border-red-300 focus:border-red-500" : "border-slate-100 focus:border-primary/50"} rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">{showConfirm ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 font-medium pl-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

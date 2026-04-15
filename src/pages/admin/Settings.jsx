import { useState, useEffect } from "react";
import { Save, Lock, User, Loader2 } from "lucide-react";
import { getCurrentUser } from "../../utils/auth";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600 disabled:opacity-40 disabled:cursor-not-allowed";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";

const PROVINCES = ["Kigali", "Northern", "Southern", "Eastern", "Western"];

export default function Settings() {
  const { showToast } = useToast();
  const currentUser = getCurrentUser();

  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    email: "",
    telephone: "",
    province: "",
    district: "",
    cell: "",
  });

  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) return;

    api
      .get(`/auth/me`)
      .then((res) => {
        const u = res.data;
        setProfile({
          full_name: u.full_name || "",
          username: u.username || "",
          email: u.email || "",
          telephone: u.telephone || "",
          province: u.province || "",
          district: u.district || "",
          cell: u.cell || "",
        });
      })
      .catch(() => showToast("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, []);

  const setP = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  /* ── Profile save ─────────────────────────────────── */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/me`, {
        full_name: profile.full_name,
        username: profile.username,
        telephone: profile.telephone,
        province: profile.province,
        district: profile.district,
        cell: profile.cell,
      });
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Password save ────────────────────────────────── */
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!passwords.new_password)
      return showToast("Enter a new password", "error");
    if (passwords.new_password.length < 8)
      return showToast("Password must be at least 8 characters", "error");
    if (passwords.new_password !== passwords.confirm_password)
      return showToast("Passwords do not match", "error");

    setSavingPwd(true);
    try {
      await api.put(`/users/me`, {
        password: passwords.new_password,
      });
      setPasswords({ new_password: "", confirm_password: "" });
      showToast("Password updated successfully", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update password",
        "error",
      );
    } finally {
      setSavingPwd(false);
    }
  };

  /* ── Loading state ────────────────────────────────── */
  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
      </div>
    );

  /* ── Main render ──────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Account Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Update your profile and password
        </p>
      </div>

      {/* ── Profile form ──────────────────────────────── */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-[#FF6B00]" />
          Profile Information
        </h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                className={inputCls}
                value={profile.full_name}
                onChange={(e) => setP("full_name", e.target.value)}
                placeholder="Full name"
              />
            </div>

            {/* Username */}
            <div>
              <label className={labelCls}>Username</label>
              <input
                className={inputCls}
                value={profile.username}
                onChange={(e) => setP("username", e.target.value)}
                placeholder="username"
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className={labelCls}>Email (cannot be changed)</label>
              <input
                className={inputCls}
                value={profile.email}
                disabled
                placeholder="email"
              />
            </div>

            {/* Telephone */}
            <div>
              <label className={labelCls}>Telephone</label>
              <input
                className={inputCls}
                value={profile.telephone}
                onChange={(e) => setP("telephone", e.target.value)}
                placeholder="+250..."
              />
            </div>

            {/* Province */}
            <div>
              <label className={labelCls}>Province</label>
              <select
                className={inputCls}
                value={profile.province}
                onChange={(e) => setP("province", e.target.value)}
              >
                <option value="">Select...</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className={labelCls}>District</label>
              <input
                className={inputCls}
                value={profile.district}
                onChange={(e) => setP("district", e.target.value)}
                placeholder="District"
              />
            </div>

            {/* Cell */}
            <div>
              <label className={labelCls}>Cell</label>
              <input
                className={inputCls}
                value={profile.cell}
                onChange={(e) => setP("cell", e.target.value)}
                placeholder="Cell"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* ── Password form ─────────────────────────────── */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-[#FF6B00]" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                className={inputCls}
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, new_password: e.target.value }))
                }
                placeholder="Min 8 characters"
              />
            </div>

            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input
                type="password"
                className={inputCls}
                value={passwords.confirm_password}
                onChange={(e) =>
                  setPasswords((p) => ({
                    ...p,
                    confirm_password: e.target.value,
                  }))
                }
                placeholder="Repeat password"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPwd}
              className="flex items-center gap-2 bg-[#111111] border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {savingPwd ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

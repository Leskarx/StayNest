import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { userService } from "../services/userService";
import { Loader } from "../components/Loader";

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: ""
  });

  useEffect(() => {
    userService
      .getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name,
          phoneNumber: res.data.phoneNumber || ""
        });
      })
      .catch(() => {
        if (user) {
          setProfile(user);
          setForm({
            name: user.name,
            phoneNumber: user.phoneNumber || ""
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userService.updateProfile(form);
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const fd = new FormData();
    fd.append("profileImage", file);

    setUploading(true);

    try {
      const res = await userService.uploadProfileImage(fd);

      // update profile state
      setProfile((prev) => ({
        ...prev,
        profileImage: res.data.profileImage
      }));

      await refreshUser();

      toast.success("Profile image updated!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Image upload failed.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24">
        <Loader />
      </div>
    );
  }

  const displayUser = profile ?? user;

  const avatar =
    preview ||
    displayUser?.profileImage?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayUser?.name || "U"
    )}&background=2563EB&color=fff&size=100`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={avatar}
                  alt={displayUser?.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white/20 object-cover"
                />

                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute -bottom-2 -right-2 bg-[#2563EB] text-white rounded-xl p-2 hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  hidden
                />
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">
                  {displayUser?.name}
                </h2>

                <p className="text-slate-400 text-sm capitalize mt-1">
                  {displayUser?.role}
                </p>

                <p className="text-slate-400 text-sm">
                  {displayUser?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value
                    }))
                  }
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="email"
                  value={displayUser?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400"
                />
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phoneNumber: e.target.value
                    }))
                  }
                  placeholder="+1234567890"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
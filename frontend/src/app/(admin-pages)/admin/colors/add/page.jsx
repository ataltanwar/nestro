"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AddColorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", value: "#8a6040", status: true });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      await toast.promise(
        axios.post(`${API_BASE}/colors/create`, {
          name: formData.name,
          value: formData.value,
          status: formData.status,
        }),
        {
          loading: "Creating color...",
          success: "Color created successfully",
          error: (error) => error?.response?.data?.message || "Failed to create color",
        }
      );

      router.push("/admin/colors");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to create color");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[820px] space-y-7">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[9px] border border-[#e5e2dc] bg-white text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"
        >
          <FiArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">Add Color</h1>
          <p className="mt-1 text-[14px] text-slate-500">Add a swatch to your storefront filters</p>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#e8e5df] bg-white p-7">
        {errorMessage && (
          <div className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Color Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Walnut"
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Status</label>
            <select
              name="status"
              value={String(formData.status)}
              onChange={(event) => setFormData((previous) => ({ ...previous, status: event.target.value === "true" }))}
              className="h-[46px] w-full cursor-pointer rounded-[9px] border border-[#e5e2dc] bg-white px-4 text-[14px] outline-none focus:border-[#10b99a]"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Hex Value</label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="h-[46px] w-[64px] cursor-pointer rounded-[9px] border border-[#e5e2dc] bg-white p-1"
              />
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="#8a6040"
                maxLength={7}
                className="h-[46px] flex-1 rounded-[9px] border border-[#e5e2dc] px-4 font-mono text-[14px] uppercase outline-none transition focus:border-[#10b99a]"
              />
              <span
                className="h-[46px] w-[46px] shrink-0 rounded-[9px] border border-black/10"
                style={{ backgroundColor: formData.value }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-[#eeeae3] pt-6">
          <button
            onClick={() => router.back()}
            className="cursor-pointer rounded-[9px] border border-[#e5e2dc] bg-white px-5 py-3 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer rounded-[9px] bg-[#10b99a] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#0da88c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Color"}
          </button>
        </div>
      </div>
    </div>
  );
}

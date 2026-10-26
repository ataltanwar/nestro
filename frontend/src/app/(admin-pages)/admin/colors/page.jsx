"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ColorsPage() {
  const [colors, setColors] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteColor, setDeleteColor] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${API_BASE}/colors`);
      setColors(response.data.colors || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load colors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    axios.get(`${API_BASE}/colors`)
      .then((response) => {
        if (active) setColors(response.data.colors || []);
      })
      .catch((error) => {
        if (active) toast.error(error?.response?.data?.message || "Failed to load colors");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const handleDeleteColor = async () => {
    if (!deleteColor) return;

    try {
      setDeleting(true);
      await axios.delete(`${API_BASE}/colors/${deleteColor._id}`);
      setDeleteColor(null);
      fetchColors();
      toast("Color deleted successfully", {
        className: "toast-deletion",
        description: "The color was removed from your storefront filters.",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete color");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (color) => {
    if (updatingStatus) return;

    const nextStatus = !color.status;
    setUpdatingStatus(color._id);
    setColors((previous) => previous.map((item) => (
      item._id === color._id ? { ...item, status: nextStatus } : item
    )));

    try {
      const response = await axios.patch(`${API_BASE}/colors/${color._id}/status`);
      const updatedColor = response.data.color;
      setColors((previous) => previous.map((item) => (
        item._id === updatedColor._id ? updatedColor : item
      )));
      toast.success(`Color marked ${updatedColor.status ? "active" : "inactive"}`);
    } catch (error) {
      setColors((previous) => previous.map((item) => (
        item._id === color._id ? { ...item, status: color.status } : item
      )));
      toast.error(error?.response?.data?.message || "Failed to update color status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">Colors</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Manage the color palette used across your storefront
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/colors/add")}
          className="flex items-center gap-2 rounded-[10px] bg-[#10b99a] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#0da88c]"
        >
          <FiPlus size={18} />
          Add Color
        </button>
      </div>

      <div className="rounded-[16px] border border-[#e8e5df] bg-white">
        <div className="flex items-center justify-between border-b border-[#eeeae3] p-5">
          <div>
            <h2 className="text-[17px] font-semibold text-[#17212b]">All Colors</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              {loading ? "Loading..." : `${filteredColors.length} colors`}
            </p>
          </div>

          <div className="relative">
            <FiSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search colors..."
              className="h-[40px] w-[240px] rounded-[9px] border border-[#e5e2dc] pl-10 pr-3 text-[13px] outline-none transition focus:border-[#10b99a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-[#eeeae3] text-left">
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Color</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Hex Value</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-4 text-right text-[12px] font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredColors.map((color) => (
                <tr key={color._id} className="border-b border-[#f1eee9] last:border-0 hover:bg-[#faf9f7]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-[34px] w-[34px] rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-[14px] font-semibold capitalize text-[#17212b]">{color.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-mono text-[13px] uppercase text-slate-500">{color.value}</td>

                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(color)}
                      disabled={updatingStatus === color._id}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        color.status ? "bg-[#e8f8f3] text-[#0d9f83]" : "bg-[#f1f1f1] text-slate-500"
                      } transition hover:opacity-75 disabled:cursor-wait disabled:opacity-60`}
                    >
                      {color.status ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/colors/${color._id}`)}
                        aria-label={`Edit ${color.name}`}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-[#eef8f5] hover:text-[#10b99a]"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteColor(color)}
                        aria-label={`Delete ${color.name}`}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredColors.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[14px] text-slate-500">
                    No colors found. Add your first color to get started.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[14px] text-slate-500">
                    Loading colors...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteColor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiTrash2 size={20} />
              </div>

              <button
                onClick={() => setDeleteColor(null)}
                className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-[19px] font-bold text-[#17212b]">Delete Color?</h2>
              <p className="mt-2 text-[14px] leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#17212b]">&quot;{deleteColor.name}&quot;</span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeleteColor(null)}
                className="cursor-pointer rounded-[9px] border border-[#e5e2dc] px-5 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteColor}
                disabled={deleting}
                className="cursor-pointer rounded-[9px] bg-red-500 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-wait disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

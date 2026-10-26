"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiArrowLeft, FiRefreshCw, FiUpload } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const initialForm = { name: "", slug: "", count: "0", image: "", status: true, file: null };

export default function EditRoomPage({ params }) {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.resolve(params)
      .then(({ id }) => {
        if (!active) return null;
        setRoomId(id);
        return axios.get(`${API_BASE}/rooms/${id}`);
      })
      .then((response) => {
        if (!active || !response) return;
        const room = response.data.room;
        setFormData({
          name: room.name ?? "",
          slug: room.slug ?? "",
          count: String(room.count ?? 0),
          image: room.image ?? "",
          status: room.status !== false,
          file: null,
        });
        setPreviewUrl(room.image || "");
      })
      .catch((error) => {
        if (active) {
          const message = error?.response?.data?.message || "Failed to load room";
          setErrorMessage(message);
          toast.error(message, { description: "Please try again." });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [params]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (name === "name") {
      setFormData((previous) => ({
        ...previous,
        slug: value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }

    if (name === "slug") {
      const normalizedSlug = value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData((previous) => ({
        ...previous,
        slug: normalizedSlug,
        name: normalizedSlug
          .split("-")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setPreviewUrl(formData.image || "");
      setFormData((previous) => ({ ...previous, file: null }));
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFormData((previous) => ({ ...previous, file, image: "" }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setErrorMessage("");

      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("count", String(formData.count ?? "0"));
      form.append("status", String(formData.status));

      if (formData.file) {
        form.append("imageFile", formData.file);
      } else if (formData.image) {
        form.append("image", formData.image);
      }

      await toast.promise(axios.put(`${API_BASE}/rooms/${roomId}`, form), {
        loading: "Saving room...",
        success: "Room updated successfully",
        error: (error) => error?.response?.data?.message || "Failed to update room",
      });

      router.push("/admin/rooms");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to update room");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-7">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[9px] border border-[#e5e2dc] bg-white text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"
        >
          <FiArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">Edit Room</h1>
          <p className="mt-1 text-[14px] text-slate-500">Update room information</p>
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
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Room Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              disabled={loading}
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Pieces</label>
            <input
              type="number"
              min="0"
              name="count"
              value={formData.count}
              onChange={handleChange}
              disabled={loading}
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Status</label>
            <select
              name="status"
              value={String(formData.status)}
              onChange={(event) => setFormData((previous) => ({ ...previous, status: event.target.value === "true" }))}
              disabled={loading}
              className="h-[46px] w-full cursor-pointer rounded-[9px] border border-[#e5e2dc] bg-white px-4 text-[14px] outline-none focus:border-[#10b99a]"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">Room Image</label>

            <div>
              {previewUrl ? (
                <>
                  <div className="group relative h-[180px] overflow-hidden rounded-[10px] border border-[#e5e2dc] bg-[#faf9f7]">
                    <img src={previewUrl} alt="Room preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#17212b]/45 opacity-0 transition group-hover:opacity-100">
                      <label
                        htmlFor="room-image-file"
                        className="flex cursor-pointer items-center gap-2 rounded-[8px] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#17212b] shadow-sm transition hover:bg-[#f5fbf9]"
                      >
                        <FiRefreshCw size={15} />
                        Change image
                      </label>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] text-slate-500">
                    Select a new image to replace the current one.
                  </p>
                </>
              ) : (
                <label
                  htmlFor="room-image-file"
                  className="relative flex h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[10px] border-2 border-dashed border-[#ddd9d1] bg-[#faf9f7] text-slate-400 transition hover:border-[#10b99a] hover:bg-[#f5fbf9]"
                >
                  <FiUpload size={25} />
                  <span className="mt-3 text-[13px] font-medium">Upload image</span>
                  <span className="mt-1 text-[11px]">PNG, JPG up to 5MB</span>
                </label>
              )}

              <input id="room-image-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
            disabled={loading || saving || !roomId}
            className="cursor-pointer rounded-[9px] bg-[#10b99a] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#0da88c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

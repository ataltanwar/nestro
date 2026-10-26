"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiArrowLeft, FiUpload } from "react-icons/fi";

export default function AddCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    quantity: "",
    price: "",
    image: "",
    status: true,
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "image" && value) {
      setPreviewUrl(value);
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }

    if (name === "image" && !value) {
      setPreviewUrl("");
      setFormData((prev) => ({ ...prev, file: null }));
    }

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }

    if (name === "slug") {
      const normalizedSlug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      setFormData((prev) => ({
        ...prev,
        slug: normalizedSlug,
        name: normalizedSlug
          .split("-")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("quantity", formData.quantity);
      form.append("price", formData.price);
      form.append("image", formData.image);
      form.append("status", String(Boolean(formData.status)));

      if (formData.file) {
        form.append("imageFile", formData.file);
      }

      await toast.promise(
        axios.post("http://localhost:5000/api/category/create", form),
        {
          loading: "Creating category...",
          success: "Category created successfully",
          error: (error) => error?.response?.data?.message || "Failed to create category",
        }
      );

      router.push("/admin/category");
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to create category";
      setErrorMessage(message);
      console.error("Failed to create category:", message);
    } finally {
      setLoading(false);
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
          <h1 className="text-[30px] font-bold text-[#17212b]">
            Add Category
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Create a new product category
          </p>
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
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">
              Slug
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="category-slug"
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
           <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter category quantity"
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>

          <div>
           <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter category price"
              className="h-[46px] w-full rounded-[9px] border border-[#e5e2dc] px-4 text-[14px] outline-none transition focus:border-[#10b99a]"
            />
          </div>


          <div className="col-span-2">
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">
              Category Image
            </label>

            <label className="relative flex h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[10px] border-2 border-dashed border-[#ddd9d1] bg-[#faf9f7] text-slate-400 transition hover:border-[#10b99a] hover:bg-[#f5fbf9]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Category preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <FiUpload size={25} />

                  <span className="mt-3 text-[13px] font-medium">
                    Upload image
                  </span>

                  <span className="mt-1 text-[11px]">
                    PNG, JPG up to 5MB
                  </span>
                </>
              )}

              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;

                  if (previewUrl && previewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                  }

                  if (!file) {
                    setPreviewUrl("");
                    setFormData((prev) => ({ ...prev, file: null, image: "" }));
                    return;
                  }

                  setPreviewUrl(URL.createObjectURL(file));
                  setFormData((prev) => ({ ...prev, file, image: "" }));
                }}
              />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#17212b]">
              Status
            </label>

            <select
              name="status"
              value={String(formData.status)}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "true" }))}
              className="h-[46px] w-full cursor-pointer rounded-[9px] border border-[#e5e2dc] bg-white px-4 text-[14px] outline-none focus:border-[#10b99a]"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
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
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
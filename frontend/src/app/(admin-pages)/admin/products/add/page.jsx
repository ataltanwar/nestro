"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiArrowLeft, FiUpload } from "react-icons/fi";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  originalPrice: "",
  salePrice: "",
  category: "",
  room: "",
  color: "",
  stock: "0",
  image: "",
  file: null,
  newArrival: false,
  featured: false,
  bestseller: false,
};

export default function AddProductPage() {
  const router = useRouter();
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [colors, setColors] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      const [categoryResult, roomResult, colorResult] = await Promise.allSettled([
        axios.get("http://localhost:5000/api/category"),
        axios.get("http://localhost:5000/api/rooms"),
        axios.get("http://localhost:5000/api/colors"),
      ]);

      if (categoryResult.status === "fulfilled") {
        setCategories(categoryResult.value.data.category || []);
      } else {
        const message = categoryResult.reason?.response?.data?.message || "Failed to load categories";
        setErrorMessage(message);
        toast.error(message);
      }

      if (roomResult.status === "fulfilled") {
        setRooms(roomResult.value.data.rooms || []);
      }

      if (colorResult.status === "fulfilled") {
        setColors(colorResult.value.data.colors || []);
      }

      setLoadingCategories(false);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    setEditId(new URLSearchParams(window.location.search).get("edit") || "");
  }, []);

  useEffect(() => {
    if (!editId) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${editId}`);
        const product = response.data.product;
        setFormData((previous) => ({
          ...previous,
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          originalPrice: String(product.originalPrice ?? product.price ?? ""),
          salePrice: String(product.salePrice ?? product.price ?? ""),
          price: String(product.salePrice ?? product.price ?? ""),
          category: product.category?._id || product.category || "",
          room: product.room?._id || product.room || "",
          color: product.color?._id || product.color || "",
          stock: String(product.stock ?? 0),
          image: product.image || "",
          newArrival: product.newArrival === true,
          featured: product.featured === true,
          bestseller: product.bestseller === true,
        }));
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to load product";
        setErrorMessage(message);
        toast.error(message);
      }
    };

    fetchProduct();
  }, [editId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    setFormData((previous) => ({ ...previous, [name]: nextValue }));

    if (name === "name") {
      setFormData((previous) => ({
        ...previous,
        slug: value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setPreviewUrl(formData.image);
      setFormData((previous) => ({ ...previous, file: null }));
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFormData((previous) => ({ ...previous, file, image: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("originalPrice", formData.originalPrice);
      form.append("salePrice", formData.salePrice);
      form.append("category", formData.category);
      form.append("room", formData.room);
      form.append("color", formData.color);
      form.append("stock", formData.stock);
      form.append("image", formData.image);
      form.append("newArrival", String(formData.newArrival));
      form.append("featured", String(formData.featured));
      form.append("bestseller", String(formData.bestseller));
      if (formData.file) form.append("imageFile", formData.file);

      const endpoint = editId
        ? `http://localhost:5000/api/product/${editId}`
        : "http://localhost:5000/api/product/create";
      await toast.promise(
        editId ? axios.put(endpoint, form) : axios.post(endpoint, form),
        {
          loading: editId ? "Saving product..." : "Creating product...",
          success: editId ? "Product updated successfully" : "Product created successfully",
          error: (error) => error?.response?.data?.message || "Failed to save product",
        }
      );
      router.push("/admin/products");
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to save product";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-7">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-[#e5e2dc] bg-white text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"><FiArrowLeft size={18} /></button>
        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">{editId ? "Edit Product" : "Add Product"}</h1>
          <p className="mt-1 text-[14px] text-slate-500">{editId ? "Update product details" : "Create a product for your catalog"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[16px] border border-[#e8e5df] bg-white p-7">
        {errorMessage && <div className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{errorMessage}</div>}

        <div className="grid grid-cols-2 gap-6">
          <Field label="Product Name">
            <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Ember Velvet 3-Seater" className={inputClass} />
          </Field>
          <Field label="Slug">
            <input required name="slug" value={formData.slug} onChange={handleChange} placeholder="product-slug" className={inputClass} />
          </Field>
          <Field label="Original Price">
            <input required min="0" step="0.01" type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="0.00" className={inputClass} />
          </Field>
          <Field label="Sale Price">
            <input required min="0" step="0.01" type="number" name="salePrice" value={formData.salePrice} onChange={(event) => setFormData((previous) => ({ ...previous, salePrice: event.target.value, price: event.target.value }))} placeholder="0.00" className={inputClass} />
            <p className="mt-2 text-[12px] font-medium text-[#0d9f83]">Discount: {getDiscount(formData.originalPrice, formData.salePrice)}%</p>
          </Field>
          <Field label="Category">
            <select required name="category" value={formData.category} onChange={handleChange} disabled={loadingCategories} className={inputClass}>
              <option value="">{loadingCategories ? "Loading categories..." : "Select category"}</option>
              {categories.filter((category) => category.status !== false).map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
          </Field>
          <Field label="Room">
            <select name="room" value={formData.room} onChange={handleChange} className={inputClass}>
              <option value="">No room</option>
              {rooms.map((room) => <option key={room._id} value={room._id}>{room.name}</option>)}
            </select>
          </Field>
          <Field label="Color">
            <select name="color" value={formData.color} onChange={handleChange} className={inputClass}>
              <option value="">No color</option>
              {colors.map((color) => <option key={color._id} value={color._id}>{color.name} ({color.value})</option>)}
            </select>
          </Field>
          <Field label="Stock">
            <input required min="0" type="number" name="stock" value={formData.stock} onChange={handleChange} className={inputClass} />
          </Field>
          <div className="col-span-2">
            <Field label="Description">
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Describe the product..." className="w-full resize-none rounded-[9px] border border-[#e5e2dc] px-4 py-3 text-[14px] outline-none transition focus:border-[#10b99a]" />
            </Field>
          </div>

          <div className="col-span-2">
            <Field label="Product Image">
              <label className="relative flex h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[10px] border-2 border-dashed border-[#ddd9d1] bg-[#faf9f7] text-slate-400 transition hover:border-[#10b99a] hover:bg-[#f5fbf9]">
                {previewUrl || formData.image ? <img src={previewUrl || formData.image} alt="Product preview" className="h-full w-full object-cover" /> : <><FiUpload size={25} /><span className="mt-3 text-[13px] font-medium">Upload product image</span><span className="mt-1 text-[11px]">PNG, JPG up to 5MB</span></>}
                <input type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </Field>
          </div>

          <div className="col-span-2 grid grid-cols-3 gap-3 border-t border-[#eeeae3] pt-6">
            <Toggle name="newArrival" checked={formData.newArrival} onChange={handleChange} label="New Arrival" />
            <Toggle name="featured" checked={formData.featured} onChange={handleChange} label="Featured" />
            <Toggle name="bestseller" checked={formData.bestseller} onChange={handleChange} label="Bestseller" />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-[#eeeae3] pt-6">
          <button type="button" onClick={() => router.back()} className="rounded-[9px] border border-[#e5e2dc] bg-white px-5 py-3 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]">Cancel</button>
          <button type="submit" disabled={loading} className="rounded-[9px] bg-black px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#17212b] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Saving..." : editId ? "Save Changes" : "Create Product"}</button>
        </div>
      </form>
    </div>
  );
}

const inputClass = "h-[46px] w-full rounded-[9px] border border-[#e5e2dc] bg-white px-4 text-[14px] outline-none transition focus:border-[#10b99a]";

function Field({ label, children }) {
  return <div><label className="mb-2 block text-[13px] font-semibold text-[#17212b]">{label}</label>{children}</div>;
}

function Toggle({ name, checked, onChange, label }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-[#e5e2dc] px-4 py-3 text-[13px] font-medium text-[#17212b]"><input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-[#10b99a]" />{label}</label>;
}

function getDiscount(originalPrice, salePrice) {
  const original = Number(originalPrice);
  const sale = Number(salePrice);
  if (!original || !Number.isFinite(original) || !Number.isFinite(sale) || sale > original) return 0;
  return Math.max(0, Math.round(((original - sale) / original) * 100));
}

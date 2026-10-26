"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiEdit2, FiExternalLink, FiEye, FiImage, FiPackage, FiPlus, FiTrash2, FiX } from "react-icons/fi";

const flagLabel = (value) => (value ? "Yes" : "No");

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product");
        setProducts(response.data.products || []);
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to load products";
        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeletingId(deleteProduct._id);
      await axios.delete(`http://localhost:5000/api/product/${deleteProduct._id}`);
      setProducts((previous) => previous.filter((item) => item._id !== deleteProduct._id));
      setDeleteProduct(null);
      toast("Product deleted successfully", {
        className: "toast-deletion",
        description: "The product was removed from your catalog.",
      });
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Failed to delete product");
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">Product</h1>
          <p className="mt-1 text-[14px] text-slate-500">Manage your product catalog</p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/products/add")}
          className="flex items-center gap-2 rounded-[9px] bg-black px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17212b]"
        >
          <FiPlus size={18} />
          Add Product
        </button>
      </div>

      <div className="scrollbar-hidden overflow-x-auto rounded-[16px] border border-[#e8e5df] bg-white shadow-[0_1px_2px_rgba(23,33,43,0.04)]">
        {errorMessage && (
          <div className="m-5 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <table className="w-full min-w-[1120px] border-collapse">
          <thead>
            <tr className="border-b border-[#eeeae3] bg-[#fcfcfd] text-left">
              <th className="w-16 px-7 py-5 text-[13px] font-semibold text-[#17212b]">#</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Product</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Slug</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Thumbnail</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Stock</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">New Arrival</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Featured</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Bestseller</th>
              <th className="px-5 py-5 text-[13px] font-semibold text-[#17212b]">Status</th>
              <th className="px-7 py-5 text-right text-[13px] font-semibold text-[#17212b]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className="border-b border-[#f1eee9] last:border-0 hover:bg-[#fdfcfb]">
                <td className="px-7 py-5 text-[14px] text-slate-500">{index + 1}</td>
                <td className="max-w-[180px] px-5 py-5 text-[14px] font-medium leading-5 text-[#17212b]">{product.name}</td>
                <td className="max-w-[150px] px-5 py-5 text-[13px] text-slate-500">/{product.slug}</td>
                <td className="px-5 py-5">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-14 w-14 rounded-[9px] object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-[9px] bg-[#f1f3f4] text-slate-400">
                      <FiPackage size={22} />
                    </div>
                  )}
                </td>
                <td className="px-5 py-5 text-[14px] text-[#17212b]">{product.stock ?? 0}</td>
                <td className="px-5 py-5"><Pill value={product.newArrival} /></td>
                <td className="px-5 py-5"><Pill value={product.featured} /></td>
                <td className="px-5 py-5"><Pill value={product.bestseller} /></td>
                <td className="px-5 py-5"><StatusPill value={product.status !== false} /></td>
                <td className="px-7 py-5">
                  <div className="flex justify-end gap-2">
                    <a href={`/store/${product.slug || product._id}`} target="_blank" rel="noopener noreferrer" title="View in Website Store" className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#e5e2dc] text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"><FiExternalLink size={18} /></a>
                    <button type="button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#e5e2dc] text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"><FiEye size={18} /></button>
                    <button type="button" onClick={() => router.push(`/admin/products/add?edit=${product._id}`)} aria-label={`Edit ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#e5e2dc] text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"><FiEdit2 size={18} /></button>
                    <button type="button" onClick={() => router.push(`/admin/products/add/add-images?product=${product._id}`)} aria-label={`Upload images for ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#e5e2dc] text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"><FiImage size={18} /></button>
                    <button type="button" onClick={() => setDeleteProduct(product)} disabled={deletingId === product._id} aria-label={`Delete ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#e5e2dc] text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-wait disabled:opacity-50"><FiTrash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && products.length === 0 && (
              <tr><td colSpan="10" className="px-7 py-16 text-center text-[14px] text-slate-500">No products found. Add your first product to get started.</td></tr>
            )}
            {loading && (
              <tr><td colSpan="10" className="px-7 py-16 text-center text-[14px] text-slate-500">Loading products...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setSelectedProduct(null)}>
          <div className="w-full max-w-[480px] rounded-[16px] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-bold text-[#17212b]">{selectedProduct.name}</h2>
                <p className="mt-1 text-[13px] text-slate-500">/{selectedProduct.slug}</p>
              </div>
              <button type="button" onClick={() => setSelectedProduct(null)} className="text-[13px] font-semibold text-slate-500 hover:text-[#17212b]">Close</button>
            </div>
            {selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.name} className="mt-5 h-48 w-full rounded-[10px] object-cover" />}
            <p className="mt-5 text-[14px] leading-6 text-slate-600">{selectedProduct.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-[13px]">
              <Detail label="Stock" value={selectedProduct.stock ?? 0} />
              <Detail label="Sale price" value={selectedProduct.salePrice ?? selectedProduct.price ?? "-"} />
              <Detail label="Discount" value={`${selectedProduct.discount ?? 0}%`} />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-[9px] border border-[#e5e2dc] px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-[#f8f7f4]"
              >
                Close
              </button>
              <a
                href={`/store/${selectedProduct.slug || selectedProduct._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-[9px] bg-black px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#17212b]"
              >
                <FiExternalLink size={15} />
                View in Store
              </a>
            </div>
          </div>
        </div>
      )}

      {deleteProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiTrash2 size={20} />
              </div>

              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-[19px] font-bold text-[#17212b]">Delete Product?</h2>
              <p className="mt-2 text-[14px] leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#17212b]">&quot;{deleteProduct.name}&quot;</span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="cursor-pointer rounded-[9px] border border-[#e5e2dc] px-5 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === deleteProduct._id}
                className="cursor-pointer rounded-[9px] bg-red-500 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-wait disabled:opacity-60"
              >
                {deletingId === deleteProduct._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ value }) {
  return <span className="inline-flex rounded-full bg-[#f1f3f4] px-3 py-1.5 text-[12px] font-medium text-slate-500">{flagLabel(value)}</span>;
}

function StatusPill({ value }) {
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-[12px] font-medium ${value ? "bg-[#e6f8ee] text-[#179447]" : "bg-[#f1f3f4] text-slate-500"}`}>{value ? "Active" : "Inactive"}</span>;
}

function Detail({ label, value }) {
  return <div className="rounded-[9px] bg-[#f8f7f4] p-3"><p className="text-[11px] text-slate-500">{label}</p><p className="mt-1 font-semibold text-[#17212b]">{value}</p></div>;
}

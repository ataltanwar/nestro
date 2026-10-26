"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      setCategories(response.data.category || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load categories");
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    axios.get("http://localhost:5000/api/category")
      .then((response) => {
        if (active) setCategories(response.data.category || []);
      })
      .catch((error) => {
        if (active) toast.error(error?.response?.data?.message || "Failed to load categories");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
      await axios.delete(`http://localhost:5000/api/category/${deleteCategory._id}`);
      setDeleteCategory(null);
      fetchCategories();
      toast("Category deleted successfully", {
        className: "toast-deletion",
        description: "The category was removed from your catalog.",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete category");
      console.error("Failed to delete category:", error);
    }
  };

  const handleToggleStatus = async (category) => {
    if (updatingStatus) return;

    const nextStatus = !category.status;
    setUpdatingStatus(category._id);
    setCategories((previous) => previous.map((item) => (
      item._id === category._id ? { ...item, status: nextStatus } : item
    )));

    try {
      const response = await axios.patch(`http://localhost:5000/api/category/${category._id}/status`);
      const updatedCategory = response.data.category;
      setCategories((previous) => previous.map((item) => (
        item._id === updatedCategory._id ? updatedCategory : item
      )));
      toast.success(`Category marked ${updatedCategory.status ? "active" : "inactive"}`);
    } catch (error) {
      setCategories((previous) => previous.map((item) => (
        item._id === category._id ? { ...item, status: category.status } : item
      )));
      toast.error(error?.response?.data?.message || "Failed to update category status");
      console.error("Failed to update category status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">
            Categories
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Manage your product categories
          </p>
        </div>

        <button onClick={() => router.push("/admin/category/add")} className="flex items-center gap-2 rounded-[10px] bg-[#10b99a] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#0da88c]">
          <FiPlus size={18} />
          Add Category
        </button>
      </div>

      <div className="rounded-[16px] border border-[#e8e5df] bg-white">
        <div className="flex items-center justify-between border-b border-[#eeeae3] p-5">
          <div>
            <h2 className="text-[17px] font-semibold text-[#17212b]">
              All Categories
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              {loading ? "Loading..." : `${filteredCategories.length} categories`}
            </p>
          </div>

          <div className="relative">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="h-[40px] w-[240px] rounded-[9px] border border-[#e5e2dc] pl-10 pr-3 text-[13px] outline-none transition focus:border-[#10b99a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eeeae3] text-left">
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Slug
                </th>

                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b border-[#f1eee9] last:border-0 hover:bg-[#faf9f7]"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={`${category.name} category`}
                          className="h-[42px] w-[42px] rounded-[9px] object-cover"
                        />
                      ) : (
                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9px] bg-[#eef8f5] text-[#10b99a]">
                          <span className="text-[16px] font-bold">
                            {category.name[0]}
                          </span>
                        </div>
                      )}

                      <span className="text-[14px] font-semibold text-[#17212b]">
                        {category.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-[13px] text-slate-500">
                    /{category.slug}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(category)}
                      disabled={updatingStatus === category._id}
                      title={`Set category ${category.status ? "inactive" : "active"}`}
                      aria-label={`Set ${category.name} ${category.status ? "inactive" : "active"}`}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        category.status
                          ? "bg-[#e8f8f3] text-[#0d9f83]"
                          : "bg-[#f1f1f1] text-slate-500"
                      } transition hover:opacity-75 disabled:cursor-wait disabled:opacity-60`}
                    >
                      {category.status ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/admin/category/${category._id}`)} className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-[#eef8f5] hover:text-[#10b99a]">
                        <FiEdit2 size={16} />
                      </button>

                      <button  onClick={() => setDeleteCategory(category)} className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-red-50 hover:text-red-500">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-[14px] text-slate-500"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {deleteCategory && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-[420px] rounded-[16px] bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between">
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-red-50 text-red-500">
          <FiTrash2 size={20} />
        </div>

        <button
          onClick={() => setDeleteCategory(null)}
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="mt-5">
        <h2 className="text-[19px] font-bold text-[#17212b]">
          Delete Category?
        </h2>

        <p className="mt-2 text-[14px] leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#17212b]">
            &quot;{deleteCategory.name}&quot;
          </span>
        ? This action cannot be undone.
        </p>
      </div>

      <div className="mt-7 flex justify-end gap-3">
        <button
          onClick={() => setDeleteCategory(null)}
          className="cursor-pointer rounded-[9px] border border-[#e5e2dc] px-5 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteCategory}
          className="cursor-pointer rounded-[9px] bg-red-500 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
  
}
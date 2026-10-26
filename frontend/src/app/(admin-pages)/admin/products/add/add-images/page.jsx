"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiArrowLeft, FiImage, FiTrash2, FiUpload, FiX } from "react-icons/fi";

const apiUrl = "http://localhost:5000/api/product";
const maxImages = 4;

function AddProductImagesPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const productId = searchParams.get("product") || "";
	const [product, setProduct] = useState(null);
	const [files, setFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!productId) return;

		axios.get(`${apiUrl}/${productId}`)
			.then((response) => setProduct(response.data.product))
			.catch((error) => setErrorMessage(error?.response?.data?.message || "Failed to load product"))
			.finally(() => setLoading(false));
	}, [productId]);

	useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview)), [previews]);

	const handleFiles = (event) => {
		const selectedFiles = Array.from(event.target.files || []);
		const remainingSlots = Math.max(0, maxImages - gallery.length);
		const validFiles = selectedFiles.filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024).slice(0, remainingSlots);
		if (validFiles.length !== selectedFiles.length) toast.error(`Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} can be added. Images must be up to 5MB.`);

		previews.forEach((preview) => URL.revokeObjectURL(preview));
		setFiles(validFiles);
		setPreviews(validFiles.map((file) => URL.createObjectURL(file)));
		event.target.value = "";
	};

	const removeFile = (index) => {
		URL.revokeObjectURL(previews[index]);
		setFiles((previous) => previous.filter((_, fileIndex) => fileIndex !== index));
		setPreviews((previous) => previous.filter((_, previewIndex) => previewIndex !== index));
	};

	const removeGalleryImage = async (image) => {
		try {
			setErrorMessage("");
			const request = axios.delete(`${apiUrl}/${productId}/images`, { data: { image } });
			toast.promise(request, {
				loading: "Removing image...",
				success: "Image removed successfully",
				error: (error) => error?.response?.data?.message || "Failed to remove image",
			});
			const response = await request;
			setProduct(response.data.product);
		} catch (error) {
			setErrorMessage(error?.response?.data?.message || "Failed to remove image");
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!productId || !files.length) return;

		const form = new FormData();
		files.forEach((file) => form.append("imageFiles", file));
		try {
			setUploading(true);
			setErrorMessage("");
			const uploadRequest = axios.post(`${apiUrl}/${productId}/images`, form);
			toast.promise(uploadRequest, {
				loading: "Uploading product images...",
				success: "Product images uploaded successfully",
				error: (error) => error?.response?.data?.message || "Failed to upload images",
			});
			const response = await uploadRequest;
			if (response.data.product) {
				previews.forEach((preview) => URL.revokeObjectURL(preview));
				router.push("/admin/products");
			}
		} catch (error) {
			setErrorMessage(error?.response?.data?.message || "Failed to upload images");
		} finally {
			setUploading(false);
		}
	};

	const gallery = [...new Set([...(product?.image ? [product.image] : []), ...(product?.images || [])])];

	return (
		<div className="mx-auto max-w-[1100px] space-y-7">
			<div className="flex items-center gap-4">
				<button type="button" onClick={() => router.back()} aria-label="Back to products" className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-[#e5e2dc] bg-white text-slate-500 transition hover:bg-[#f8f7f4] hover:text-[#17212b]"><FiArrowLeft size={18} /></button>
				<div><h1 className="text-[30px] font-bold text-[#17212b]">Product Images</h1><p className="mt-1 text-[14px] text-slate-500">{product ? `Add images to ${product.name}` : "Manage product gallery"}</p></div>
			</div>

			{(errorMessage || !productId) && <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{errorMessage || "Select a product before uploading images."}</div>}
			{!loading && product && (
				<form onSubmit={handleSubmit} className="space-y-7 rounded-[16px] border border-[#e8e5df] bg-white p-7">
					<div>
						<div className="mb-3 flex items-center justify-between"><h2 className="text-[17px] font-bold text-[#17212b]">Gallery</h2><span className="text-[13px] text-slate-500">{gallery.length} image{gallery.length === 1 ? "" : "s"}</span></div>
						{gallery.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{gallery.map((image, index) => <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-[10px] border border-[#e5e2dc]"><img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />{image !== product.image && <button type="button" onClick={() => removeGalleryImage(image)} aria-label={`Remove image ${index + 1}`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-red-500"><FiX size={17} /></button>}{image === product.image && <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">Thumbnail</span>}</div>)}</div> : <div className="rounded-[10px] border border-dashed border-[#ddd9d1] px-5 py-10 text-center text-[13px] text-slate-500"><FiImage className="mx-auto mb-2" size={25} />No images yet.</div>}
					</div>

					<label className={`flex min-h-[170px] flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-[#ddd9d1] bg-[#faf9f7] px-5 text-center text-slate-400 transition ${gallery.length >= maxImages ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#10b99a] hover:bg-[#f5fbf9]"}`}><FiUpload size={25} /><span className="mt-3 text-[13px] font-medium">{gallery.length >= maxImages ? "Maximum images reached" : "Choose multiple product images"}</span><span className="mt-1 text-[11px]">PNG, JPG up to 5MB each, maximum {maxImages} total</span><input type="file" accept="image/*" multiple disabled={gallery.length >= maxImages} className="hidden" onChange={handleFiles} /></label>

					{previews.length > 0 && <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{previews.map((preview, index) => <div key={preview} className="relative aspect-square overflow-hidden rounded-[10px] border border-[#e5e2dc]"><img src={preview} alt={`Selected preview ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => removeFile(index)} aria-label={`Remove selected image ${index + 1}`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm"><FiTrash2 size={15} /></button></div>)}</div>}

					<div className="flex justify-end gap-3 border-t border-[#eeeae3] pt-6"><button type="button" onClick={() => router.back()} className="rounded-[9px] border border-[#e5e2dc] px-5 py-3 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]">Cancel</button><button type="submit" disabled={uploading || !files.length} className="flex items-center gap-2 rounded-[9px] bg-black px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#17212b] disabled:cursor-not-allowed disabled:opacity-60"><FiUpload size={16} />{uploading ? "Uploading..." : "Upload images"}</button></div>
				</form>
			)}
		</div>
	);
}

export default function AddProductImagesPage() {
	return (
		<Suspense fallback={<div className="mx-auto max-w-[1100px] py-10 text-center text-[13px] text-slate-500">Loading product images...</div>}>
			<AddProductImagesPageContent />
		</Suspense>
	);
}

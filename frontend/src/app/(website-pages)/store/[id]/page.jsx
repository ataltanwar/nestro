"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductDetailPage({ params }) {
  // Unwrap Next.js dynamic params promise
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_BASE}/product/${productId}`);
        const found = response.data.product;
        setProduct(found);

        // Set primary image
        const initialImg =
          found.image ||
          (found.images && found.images[0]) ||
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85";
        setSelectedImage(initialImg);

        // Fetch related products from backend
        try {
          const listRes = await axios.get(`${API_BASE}/product`);
          if (listRes.data?.products) {
            const others = listRes.data.products
              .filter(
                (p) =>
                  p._id !== found._id &&
                  p.slug !== found.slug &&
                  p.status !== false
              )
              .slice(0, 4);
            setRelatedProducts(others);
          }
        } catch {
          // ignore related products error
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message ||
            "Unable to find this product. It may have been removed or is temporarily unavailable."
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} × ${product.name} to your bag!`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7f4] px-4 md:px-[48px] py-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="h-6 w-48 animate-pulse rounded bg-[#ebe5dc] mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square w-full animate-pulse rounded-[16px] bg-[#ebe5dc]" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 w-20 animate-pulse rounded-[10px] bg-[#ebe5dc]"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 w-2/3 animate-pulse rounded bg-[#ebe5dc]" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-[#ebe5dc]" />
              <div className="h-24 w-full animate-pulse rounded bg-[#ebe5dc]" />
              <div className="h-12 w-48 animate-pulse rounded bg-[#ebe5dc]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f8f7f4] px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-[440px] rounded-[16px] border border-[#e6e0da] bg-white p-8 shadow-sm">
          <p className="text-[20px] font-semibold text-[#18110b]">
            Product Not Found
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#7c7872]">
            {error || "We couldn't locate the product you're looking for."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#8d6b51] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#72543d]"
            >
              <ArrowLeft size={16} /> Return to Store
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Collect all gallery images: main image + images array
  const allImages = Array.from(
    new Set(
      [product.image, ...(product.images || [])].filter(
        (img) => Boolean(img) && typeof img === "string"
      )
    )
  );

  const price = Number(product.salePrice ?? product.price ?? 0);
  const oldPrice =
    product.originalPrice && Number(product.originalPrice) > price
      ? Number(product.originalPrice)
      : null;

  const discountPercent =
    product.discount ||
    (oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);

  const savings = oldPrice ? oldPrice - price : 0;
  const inStock = Number(product.stock ?? 0) > 0;

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : product.category || "Collection";

  const roomName =
    typeof product.room === "object" && product.room !== null
      ? product.room.name
      : product.room || "";

  const colorName =
    typeof product.color === "object" && product.color !== null
      ? product.color.name
      : product.color || "";

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#292929] pb-24">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#ece6de] bg-white/70 px-4 md:px-[48px] py-3.5 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center gap-2 text-[12px] text-[#787672]">
          <Link href="/" className="hover:text-[#18110b] transition">
            Home
          </Link>
          <ChevronRight size={14} className="text-[#bbb]" />
          <Link href="/store" className="hover:text-[#18110b] transition">
            Store
          </Link>
          <ChevronRight size={14} className="text-[#bbb]" />
          <Link
            href={`/store?category=${encodeURIComponent(categoryName)}`}
            className="hover:text-[#18110b] transition"
          >
            {categoryName}
          </Link>
          <ChevronRight size={14} className="text-[#bbb]" />
          <span className="truncate font-medium text-[#18110b]">
            {product.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 md:px-[48px] pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[520px] pb-2 md:pb-0 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[10px] border-2 transition ${
                      selectedImage === img
                        ? "border-[#8d6b51] shadow-sm"
                        : "border-[#e5dfd7] hover:border-[#b49984]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Preview Image */}
            <div className="relative flex-1 aspect-square md:aspect-[4/3] overflow-hidden rounded-[18px] border border-[#e6e0da] bg-[#ebe5df]">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover transition duration-300"
              />

              {/* Badges on main image */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="rounded-[6px] bg-[#a35232] px-3 py-1 text-[11px] font-semibold tracking-wider text-white shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.newArrival && (
                  <span className="rounded-[6px] bg-[#3e5f49] px-3 py-1 text-[11px] font-semibold tracking-wider text-white shadow-sm">
                    NEW ARRIVAL
                  </span>
                )}
                {product.bestseller && (
                  <span className="rounded-[6px] bg-[#806149] px-3 py-1 text-[11px] font-semibold tracking-wider text-white shadow-sm">
                    BESTSELLER
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast.success(
                    isLiked ? "Removed from wishlist" : "Saved to wishlist"
                  );
                }}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#ded8cf] bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 ${
                  isLiked ? "text-[#8e6549]" : "text-[#73685e]"
                }`}
              >
                <Heart
                  size={19}
                  strokeWidth={1.8}
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          {/* Product Info Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#eee7de] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#7a5e47]">
                {categoryName}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[#7c7872] hover:text-[#18110b]"
              >
                <Share2 size={15} /> Share
              </button>
            </div>

            <h1 className="mt-3.5 text-[26px] md:text-[32px] font-normal leading-tight tracking-[-0.5px] text-[#18110b]">
              {product.name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="mt-3 flex items-center gap-4 text-[13px]">
              <div className="flex items-center gap-1 text-[#ad8b68]">
                {"★".repeat(5)}
                <span className="ml-1 text-[12px] font-medium text-[#7a7873]">
                  (5.0 · 34 reviews)
                </span>
              </div>
              <span className="text-[#ccc]">•</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    inStock ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span
                  className={`text-[12px] font-medium ${
                    inStock ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {inStock
                    ? `In Stock (${product.stock} units)`
                    : "Made to Order (2-3 weeks)"}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="mt-6 rounded-[12px] border border-[#ece4da] bg-white p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[28px] font-bold text-[#18110b]">
                  {money.format(price)}
                </span>
                {oldPrice && (
                  <span className="text-[16px] text-[#8e8d89] line-through">
                    {money.format(oldPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[12px] font-semibold text-emerald-700">
                    Save {money.format(savings)} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12px] text-[#85827c]">
                Inclusive of all taxes. Free white glove delivery included.
              </p>
            </div>

            {/* Short Description */}
            <div className="mt-5">
              <p className="text-[14px] leading-relaxed text-[#595551]">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector and CTA Buttons */}
            <div className="mt-7 space-y-3.5 border-t border-[#eee8e1] pt-6">
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-[#494642]">
                  Quantity:
                </span>
                <div className="flex items-center rounded-[8px] border border-[#dcd6ce] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center text-[#555] hover:bg-[#f6f2ec] transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-[14px] font-semibold text-[#18110b]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) =>
                        product.stock ? Math.min(product.stock, q + 1) : q + 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center text-[#555] hover:bg-[#f6f2ec] transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex h-[48px] items-center justify-center gap-2.5 rounded-[9px] bg-[#8d6b51] text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#72543d]"
                >
                  <ShoppingBag size={18} />
                  Add to Bag
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    router.push("/checkout");
                  }}
                  className="flex-1 flex h-[48px] items-center justify-center gap-2 rounded-[9px] border border-[#8d6b51] bg-white text-[14px] font-semibold text-[#8d6b51] transition hover:bg-[#f6f0ea]"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Assurances Banner */}
            <div className="mt-8 grid grid-cols-2 gap-3.5 rounded-[12px] border border-[#e8e2d8] bg-[#fdfcfb] p-4 text-[12px] text-[#5c5854]">
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-[#8d6b51] shrink-0" />
                <span>Free Delivery above ₹50,000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#8d6b51] shrink-0" />
                <span>5-Year Frame Warranty</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={18} className="text-[#8d6b51] shrink-0" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-[#8d6b51] shrink-0" />
                <span>Handcrafted Solid Wood</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs Section */}
        <section className="mt-16 rounded-[16px] border border-[#e6e0da] bg-white p-6 md:p-8">
          <div className="flex border-b border-[#ede7de] gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3 text-[14px] font-semibold transition ${
                activeTab === "description"
                  ? "border-b-2 border-[#8d6b51] text-[#8d6b51]"
                  : "text-[#7a7873] hover:text-[#18110b]"
              }`}
            >
              Description & Craft
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specifications")}
              className={`pb-3 text-[14px] font-semibold transition ${
                activeTab === "specifications"
                  ? "border-b-2 border-[#8d6b51] text-[#8d6b51]"
                  : "text-[#7a7873] hover:text-[#18110b]"
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("delivery")}
              className={`pb-3 text-[14px] font-semibold transition ${
                activeTab === "delivery"
                  ? "border-b-2 border-[#8d6b51] text-[#8d6b51]"
                  : "text-[#7a7873] hover:text-[#18110b]"
              }`}
            >
              Shipping & Care
            </button>
          </div>

          <div className="pt-6">
            {activeTab === "description" && (
              <div className="space-y-4 text-[14px] leading-relaxed text-[#5e5a55]">
                <p>{product.description}</p>
                <p>
                  Each piece is handcrafted with precision, highlighting the
                  natural grain of seasoned wood and finished with organic,
                  low-VOC oils. Designed to integrate seamlessly into both
                  minimalist contemporary interiors and warm heritage spaces.
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-[13px]">
                <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                  <span className="text-[#888]">Product SKU / ID</span>
                  <span className="font-medium text-[#18110b]">
                    {product._id}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                  <span className="text-[#888]">Slug</span>
                  <span className="font-medium text-[#18110b]">
                    /{product.slug}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                  <span className="text-[#888]">Category</span>
                  <span className="font-medium text-[#18110b]">
                    {categoryName}
                  </span>
                </div>
                {roomName && (
                  <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                    <span className="text-[#888]">Room</span>
                    <span className="font-medium text-[#18110b]">{roomName}</span>
                  </div>
                )}
                {colorName && (
                  <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                    <span className="text-[#888]">Color</span>
                    <span className="font-medium capitalize text-[#18110b]">{colorName}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                  <span className="text-[#888]">Stock Inventory</span>
                  <span className="font-medium text-[#18110b]">
                    {product.stock ?? 0} units
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                  <span className="text-[#888]">Warranty</span>
                  <span className="font-medium text-[#18110b]">
                    5 Years Manufacturer Warranty
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1ebe3] py-2">
                  <span className="text-[#888]">Assembly</span>
                  <span className="font-medium text-[#18110b]">
                    Complimentary White Glove Setup
                  </span>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-3 text-[14px] leading-relaxed text-[#5e5a55]">
                <p>
                  We offer scheduled room-of-choice delivery and complimentary
                  installation across all major cities. Our delivery team will
                  unpack, assemble, and inspect your furniture, removing all
                  packaging materials upon completion.
                </p>
                <p>
                  Care instructions: Wipe clean with a soft, slightly damp
                  cloth. Avoid harsh chemical cleaners and direct prolonged
                  exposure to excessive sunlight.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-[2px] text-[#916847]">
                  RECOMMENDED
                </p>
                <h2 className="text-[22px] font-normal text-[#18110b]">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/store"
                className="text-[13px] font-medium text-[#8d6b51] hover:underline"
              >
                View all in Store →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => {
                const itemImg =
                  item.image ||
                  item.images?.[0] ||
                  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80";
                const itemPrice = Number(item.salePrice ?? item.price ?? 0);

                return (
                  <Link
                    key={item._id}
                    href={`/store/${item.slug || item._id}`}
                    className="group flex flex-col overflow-hidden rounded-[14px] border border-[#e8e2d8] bg-white transition hover:shadow-md"
                  >
                    <div className="aspect-[1.5/1] overflow-hidden bg-[#efebe4]">
                      <img
                        src={itemImg}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-medium tracking-[1.2px] text-[#919191] uppercase">
                          {typeof item.category === "object"
                            ? item.category?.name
                            : item.category || "Piece"}
                        </p>
                        <h3 className="line-clamp-2 mt-1 text-[14px] font-medium text-[#18110b] group-hover:text-[#8d6b51] transition">
                          {item.name}
                        </h3>
                      </div>
                      <div className="mt-3 text-[15px] font-semibold text-[#18110b]">
                        {money.format(itemPrice)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

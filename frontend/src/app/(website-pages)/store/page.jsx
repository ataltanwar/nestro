"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
  ChevronDown,
  Heart,
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  RotateCcw,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:5000/api";

const fallbackCategories = [
  "Sofas",
  "Chairs",
  "Tables",
  "Storage",
  "Bedroom",
  "Dining",
  "Decor",
];

const fallbackRooms = [
  "Living Room",
  "Dining Room",
  "Bedroom",
  "Office",
];

const materials = [
  "Solid Wood",
  "Velvet",
  "Linen",
  "Marble",
  "Leather",
];

const fallbackColors = [
  { name: "cream", value: "#f3eee7" },
  { name: "black", value: "#29231e" },
  { name: "brown", value: "#8a6040" },
  { name: "blue", value: "#718092" },
  { name: "beige", value: "#c9a982" },
  { name: "gray", value: "#555656" },
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function StoreSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] px-[38px] py-10">
      <div className="h-[260px] w-full animate-pulse rounded-[16px] bg-[#e4ded6]" />
      <div className="mt-8 flex gap-7">
        <div className="hidden h-[500px] w-[280px] animate-pulse rounded-[15px] bg-[#ebe5dc] md:block" />
        <div className="flex-1 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[360px] animate-pulse rounded-[15px] bg-[#ebe5dc]" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StoreContent />
    </Suspense>
  );
}

function StoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState(fallbackCategories);
  const [roomFilters, setRoomFilters] = useState(fallbackRooms);
  const [colorFilters, setColorFilters] = useState(fallbackColors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // --- Derive filter values directly from URL searchParams (Single Source of Truth) ---
  const categoriesSelected = useMemo(() => {
    const param = searchParams.get("category");
    return param ? param.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [searchParams]);

  const roomsSelected = useMemo(() => {
    const param = searchParams.get("room");
    return param ? param.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [searchParams]);

  const materialsSelected = useMemo(() => {
    const param = searchParams.get("material");
    return param ? param.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [searchParams]);

  const selectedColors = useMemo(() => {
    const param = searchParams.get("color");
    return param ? param.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [searchParams]);

  const availability = useMemo(() => {
    const param = searchParams.get("availability");
    return param ? param.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [searchParams]);

  const rating = useMemo(() => {
    const param = searchParams.get("rating");
    return param ? Number(param) || 0 : 0;
  }, [searchParams]);

  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "Featured";
  const searchParam = searchParams.get("search") || "";
  const page = useMemo(() => {
    const p = searchParams.get("page");
    return p ? Math.max(1, parseInt(p, 10) || 1) : 1;
  }, [searchParams]);

  // Local state for smooth typing in search and price inputs without input lag
  const [searchInput, setSearchInput] = useState(searchParam);
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

  // Keep local inputs in sync when URL changes externally (e.g. Back/Forward button, link clicks)
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setMinPriceInput(minPriceParam);
  }, [minPriceParam]);

  useEffect(() => {
    setMaxPriceInput(maxPriceParam);
  }, [maxPriceParam]);

  // Central function to update URL query params cleanly
  const updateFilters = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page to 1 whenever any filter changes, unless page itself is explicitly specified
      if (!("page" in updates)) {
        params.delete("page");
      }

      const queryString = params.toString();
      router.replace(queryString ? `/store?${queryString}` : "/store", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  // Debounced update for search typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchParam.trim()) {
        updateFilters({ search: searchInput.trim() || null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, updateFilters]);

  // Debounced update for price range inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanedMin = minPriceInput ? String(minPriceInput).trim() : "";
      const cleanedMax = maxPriceInput ? String(maxPriceInput).trim() : "";

      if (cleanedMin !== minPriceParam || cleanedMax !== maxPriceParam) {
        updateFilters({
          minPrice: cleanedMin || null,
          maxPrice: cleanedMax || null,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [minPriceInput, maxPriceInput, minPriceParam, maxPriceParam, updateFilters]);

  // Fetch products and categories from backend
  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productRes, categoryRes, roomRes, colorRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/product`),
        axios.get(`${API_BASE}/category`),
        axios.get(`${API_BASE}/rooms`),
        axios.get(`${API_BASE}/colors`),
      ]);

      let backendProducts = [];
      if (productRes.status === "fulfilled" && productRes.value.data?.products) {
        backendProducts = productRes.value.data.products;
        setProducts(backendProducts);
      } else {
        throw new Error(productRes.reason?.message || "Failed to load products");
      }

      // Populate dynamic categories list from category API + loaded products
      const dynamicCatSet = new Set();

      if (categoryRes.status === "fulfilled" && categoryRes.value.data?.category) {
        categoryRes.value.data.category
          .filter((cat) => cat.status !== false)
          .forEach((cat) => dynamicCatSet.add(cat.name));
      }

      backendProducts.forEach((p) => {
        if (p.category) {
          const cName = typeof p.category === "object" ? p.category.name : p.category;
          if (cName) dynamicCatSet.add(cName);
        }
      });

      if (dynamicCatSet.size > 0) {
        setCategoriesList(Array.from(dynamicCatSet));
      }

      // Populate room filters from the room API + loaded products
      const dynamicRoomSet = new Set();

      if (roomRes.status === "fulfilled" && roomRes.value.data?.rooms) {
        roomRes.value.data.rooms
          .filter((room) => room.status !== false)
          .forEach((room) => dynamicRoomSet.add(room.name));
      }

      backendProducts.forEach((product) => {
        if (product.room) {
          const roomName = typeof product.room === "object" ? product.room.name : product.room;
          if (roomName) dynamicRoomSet.add(roomName);
        }
      });

      if (dynamicRoomSet.size > 0) {
        setRoomFilters(Array.from(dynamicRoomSet));
      }

      // Populate color filters from the color API
      if (colorRes.status === "fulfilled" && colorRes.value.data?.colors) {
        const activeColors = colorRes.value.data.colors
          .filter((color) => color.status !== false)
          .map((color) => ({ name: color.name, value: color.value }));

        if (activeColors.length > 0) {
          setColorFilters(activeColors);
        }
      }
    } catch (err) {
      console.error("Store fetch error:", err);
      setError("Unable to connect to backend server. Make sure the backend is running on port 5000.");
      toast.error("Failed to load products from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Toggle Handlers that send queries to the URL
  const toggleCategory = (value) => {
    const next = categoriesSelected.includes(value)
      ? categoriesSelected.filter((item) => item !== value)
      : [...categoriesSelected, value];
    updateFilters({ category: next });
  };

  const toggleRoom = (value) => {
    const next = roomsSelected.includes(value)
      ? roomsSelected.filter((item) => item !== value)
      : [...roomsSelected, value];
    updateFilters({ room: next });
  };

  const toggleMaterial = (value) => {
    const next = materialsSelected.includes(value)
      ? materialsSelected.filter((item) => item !== value)
      : [...materialsSelected, value];
    updateFilters({ material: next });
  };

  const toggleColor = (value) => {
    const next = selectedColors.includes(value)
      ? selectedColors.filter((item) => item !== value)
      : [...selectedColors, value];
    updateFilters({ color: next });
  };

  const toggleAvailability = (value) => {
    const next = availability.includes(value)
      ? availability.filter((item) => item !== value)
      : [...availability, value];
    updateFilters({ availability: next });
  };

  const toggleRating = (value) => {
    const next = rating === value ? 0 : value;
    updateFilters({ rating: next || null });
  };

  const handleSortChange = (value) => {
    updateFilters({ sort: value === "Featured" ? null : value });
  };

  const clearAll = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    router.replace("/store", { scroll: false });
  };

  const removeFilter = (filter) => {
    if (filter.includes("★")) {
      updateFilters({ rating: null });
      return;
    }
    if (categoriesSelected.includes(filter)) {
      updateFilters({
        category: categoriesSelected.filter((item) => item !== filter),
      });
    } else if (roomsSelected.includes(filter)) {
      updateFilters({
        room: roomsSelected.filter((item) => item !== filter),
      });
    } else if (materialsSelected.includes(filter)) {
      updateFilters({
        material: materialsSelected.filter((item) => item !== filter),
      });
    } else if (selectedColors.includes(filter)) {
      updateFilters({
        color: selectedColors.filter((item) => item !== filter),
      });
    } else if (availability.includes(filter)) {
      updateFilters({
        availability: availability.filter((item) => item !== filter),
      });
    }
  };

  // --- Dynamic Filtering and Sorting of Products based on active URL queries ---
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Exclude products explicitly deactivated
        if (product.status === false) return false;

        const catName =
          typeof product.category === "object" && product.category !== null
            ? product.category.name
            : product.category || "General";

        // 1. Category Matching
        const categoryMatch =
          categoriesSelected.length === 0 ||
          categoriesSelected.some(
            (c) => c.toLowerCase() === catName.toLowerCase()
          );

        const descAndName = `${product.name} ${product.description || ""}`.toLowerCase();
        const roomName = String(
          typeof product.room === "object" && product.room !== null
            ? product.room.name || ""
            : product.room || ""
        ).toLowerCase();
        const colorName = String(
          typeof product.color === "object" && product.color !== null
            ? product.color.name || ""
            : product.color || ""
        ).toLowerCase();

        // 2. Room Matching (matches linked room or mentioned keywords in product name/desc)
        const roomMatch =
          roomsSelected.length === 0 ||
          roomsSelected.some((r) => {
            const rLower = r.toLowerCase();
            return roomName === rLower || descAndName.includes(rLower);
          });

        // 3. Material Matching (matches field or mentioned keywords)
        const materialMatch =
          materialsSelected.length === 0 ||
          materialsSelected.some((m) => {
            const mLower = m.toLowerCase();
            return (
              (product.material && product.material.toLowerCase() === mLower) ||
              descAndName.includes(mLower)
            );
          });

        // 4. Color Matching (matches linked color or mentioned keywords)
        const colorMatch =
          selectedColors.length === 0 ||
          selectedColors.some((c) => {
            const cLower = c.toLowerCase();
            return colorName === cLower || descAndName.includes(cLower);
          });

        // 5. Availability Matching
        const stockCount = Number(product.stock ?? 0);
        const stockMatch =
          availability.length === 0 ||
          (availability.includes("In Stock") && stockCount > 0) ||
          (availability.includes("Made to Order") && stockCount <= 0);

        // 6. Rating Matching
        const productRating = product.rating || 5;
        const ratingMatch = rating === 0 || productRating >= rating;

        // 7. Price Matching
        const currentPrice = Number(product.salePrice ?? product.price ?? 0);
        const minMatch = minPriceParam === "" || currentPrice >= Number(minPriceParam);
        const maxMatch = maxPriceParam === "" || currentPrice <= Number(maxPriceParam);

        // 8. Search Matching
        const searchMatch =
          !searchParam.trim() ||
          product.name.toLowerCase().includes(searchParam.toLowerCase().trim()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchParam.toLowerCase().trim())) ||
          catName.toLowerCase().includes(searchParam.toLowerCase().trim());

        return (
          categoryMatch &&
          roomMatch &&
          materialMatch &&
          colorMatch &&
          stockMatch &&
          ratingMatch &&
          minMatch &&
          maxMatch &&
          searchMatch
        );
      })
      .sort((a, b) => {
        const priceA = Number(a.salePrice ?? a.price ?? 0);
        const priceB = Number(b.salePrice ?? b.price ?? 0);

        if (sort === "Price: Low to High") {
          return priceA - priceB;
        }
        if (sort === "Price: High to Low") {
          return priceB - priceA;
        }
        if (sort === "New Arrivals") {
          if (a.newArrival && !b.newArrival) return -1;
          if (!a.newArrival && b.newArrival) return 1;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sort === "Bestsellers") {
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return 0;
        }
        if (sort === "Rating") {
          const ratingA = a.rating || 5;
          const ratingB = b.rating || 5;
          return ratingB - ratingA;
        }
        // Default: Featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [
    products,
    categoriesSelected,
    roomsSelected,
    materialsSelected,
    selectedColors,
    availability,
    rating,
    minPriceParam,
    maxPriceParam,
    sort,
    searchParam,
  ]);

  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const visibleProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const activeFilters = [
    ...categoriesSelected,
    ...roomsSelected,
    ...materialsSelected,
    ...selectedColors,
    ...availability,
    ...(rating ? [`${rating}★ & up`] : []),
  ];

  const handleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast.success(
      liked.includes(id)
        ? "Removed from your wishlist"
        : "Added to your wishlist"
    );
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#292929]">
      {/* Banner */}
      <section className="px-4 sm:px-[38px] pt-[16px]">
        <div className="relative flex min-h-[260px] md:h-[300px] flex-col justify-center overflow-hidden rounded-[16px] bg-[#3b2819] px-6 md:px-[52px] py-8">
          <div className="relative z-10 max-w-[540px]">
            <p className="mb-[12px] text-[11px] font-medium tracking-[3px] text-[#bd9a78]">
              CATALOGUE 2026
            </p>

            <h1 className="text-[28px] md:text-[36px] font-normal leading-[1.1] tracking-[-1px] text-white">
              Curated Furniture
              <br />
              <em className="font-normal text-[#d6b89a]">Collection</em>
            </h1>

            <p className="mt-[14px] text-[13px] leading-[1.6] text-white/70">
              Hand-crafted designs created with intention and built to endure.
              Discover authentic pieces added directly from our craft studio.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[#e4cebb]">
                {products.length} Products in Store
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[#e4cebb]">
                {categoriesList.length} Categories
              </span>
            </div>
          </div>

          <div className="hidden lg:block absolute right-[42px] top-[32px] h-[234px] w-[42%] overflow-hidden rounded-[14px]">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
              alt="Modern living room"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 sm:px-[38px] pt-[20px] pb-[40px]">
        {/* Search and Quick Filters Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[15px] border border-[#e6e0da] bg-white p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8d90]"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilters({ search: searchInput.trim() || null });
                }
              }}
              placeholder="Search products by name, category, or material..."
              className="h-[42px] w-full rounded-[10px] border border-[#e2ddd7] pl-10 pr-10 text-[13px] outline-none transition focus:border-[#8d6b51]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ search: null });
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex md:hidden items-center gap-2 rounded-[9px] border border-[#e1dcd6] px-4 py-2.5 text-[13px] font-medium text-[#77797d]"
            >
              <SlidersHorizontal size={16} />
              Filters ({activeFilters.length})
            </button>

            <label className="flex items-center gap-2 text-[13px] text-[#77797d]">
              <span className="hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-[42px] min-w-[170px] appearance-none rounded-[10px] border border-[#e1dcd6] bg-white pl-3.5 pr-8 text-[13px] outline-none focus:border-[#8d6b51]"
                >
                  <option value="Featured">Featured</option>
                  <option value="New Arrivals">New Arrivals</option>
                  <option value="Bestsellers">Bestsellers</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Rating">Rating</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-[28px]">
          {/* Sidebar Filters */}
          <aside
            className={`${
              mobileFilterOpen ? "block" : "hidden"
            } md:block w-full md:w-[280px] shrink-0 rounded-[15px] border border-[#e6e0da] bg-white px-[25px] py-[25px] h-fit`}
          >
            <div className="mb-[20px] flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#18110b]">Filters</h2>

              <button
                type="button"
                onClick={clearAll}
                className="text-[13px] font-medium text-[#8c6c54] transition hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <FilterGroup
              title="CATEGORY"
              values={categoriesList}
              selected={categoriesSelected}
              onToggle={toggleCategory}
            />

            {/* Price Filter */}
            <div className="mb-[25px] border-t border-[#eee8e1] pt-[19px]">
              <h3 className="mb-[13px] text-[13px] font-medium text-[#18110b]">
                Price Range
              </h3>

              <div className="flex items-center gap-[7px]">
                <input
                  type="number"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  onBlur={() => {
                    updateFilters({
                      minPrice: minPriceInput ? minPriceInput.trim() : null,
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFilters({
                        minPrice: minPriceInput ? minPriceInput.trim() : null,
                        maxPrice: maxPriceInput ? maxPriceInput.trim() : null,
                      });
                    }
                  }}
                  placeholder="Min ₹"
                  className="h-[34px] w-full rounded-[6px] border border-[#e2ddd7] px-[10px] text-[12px] outline-none focus:border-[#a47a59]"
                />

                <span className="text-[#999]">—</span>

                <input
                  type="number"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  onBlur={() => {
                    updateFilters({
                      maxPrice: maxPriceInput ? maxPriceInput.trim() : null,
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFilters({
                        minPrice: minPriceInput ? minPriceInput.trim() : null,
                        maxPrice: maxPriceInput ? maxPriceInput.trim() : null,
                      });
                    }
                  }}
                  placeholder="Max ₹"
                  className="h-[34px] w-full rounded-[6px] border border-[#e2ddd7] px-[10px] text-[12px] outline-none focus:border-[#a47a59]"
                />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-[25px] border-t border-[#eee8e1] pt-[19px]">
              <h3 className="mb-[14px] text-[13px] font-medium text-[#18110b]">
                Availability
              </h3>

              <div className="space-y-[10px]">
                {["In Stock", "Made to Order"].map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-[9px] text-[12px] text-[#555] hover:text-[#18110b]"
                  >
                    <input
                      type="checkbox"
                      checked={availability.includes(value)}
                      onChange={() => toggleAvailability(value)}
                      className="h-[15px] w-[15px] rounded accent-[#8d6b51]"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>

            {/* Room Filter */}
            <FilterGroup
              title="ROOM"
              values={roomFilters}
              selected={roomsSelected}
              onToggle={toggleRoom}
            />

            {/* Material Filter */}
            <FilterGroup
              title="MATERIAL"
              values={materials}
              selected={materialsSelected}
              onToggle={toggleMaterial}
            />

            {/* Color Filter */}
            <div className="mb-[25px] border-t border-[#eee8e1] pt-[19px]">
              <h3 className="mb-[14px] text-[13px] font-medium text-[#18110b]">
                Color
              </h3>

              <div className="flex flex-wrap gap-[9px]">
                {colorFilters.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color.name)}
                    aria-label={color.name}
                    className={`h-[24px] w-[24px] rounded-full border-2 transition ${
                      selectedColors.includes(color.name)
                        ? "border-[#8d6b51] scale-110 shadow-sm"
                        : "border-[#ddd5cc]"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="border-t border-[#eee8e1] pt-[19px]">
              <h3 className="mb-[14px] text-[13px] font-medium text-[#18110b]">
                Rating
              </h3>

              <div className="space-y-[9px]">
                {[5, 4].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleRating(value)}
                    className={`flex items-center gap-[7px] text-[12px] transition ${
                      rating === value
                        ? "font-semibold text-[#8d6b51]"
                        : "text-[#8c8c8c] hover:text-[#18110b]"
                    }`}
                  >
                    <span className="tracking-[2px] text-[#c49b75]">
                      {"★".repeat(value)}
                    </span>
                    <span>& up</span>
                    {rating === value && (
                      <span className="ml-1 text-[11px] font-semibold text-[#8d6b51]">
                        (active)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="min-w-0 flex-1">
            {/* Active Filters Display */}
            <div className="mb-[22px] flex min-h-[56px] flex-wrap items-center justify-between gap-3 rounded-[15px] border border-[#e6e0da] bg-white px-[19px] py-2.5">
              <div className="flex flex-wrap items-center gap-[8px]">
                <span className="text-[14px] font-semibold text-[#18110b]">
                  {filteredProducts.length}
                </span>

                <span className="text-[14px] text-[#7c7e83]">
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </span>

                {activeFilters.length > 0 && (
                  <div className="ml-2 flex flex-wrap gap-[7px]">
                    {activeFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => removeFilter(filter)}
                        className="flex items-center gap-[6px] rounded-full bg-[#f1e9e0] px-[12px] py-[4px] text-[12px] text-[#725943] transition hover:bg-[#e6dcd0]"
                      >
                        {filter}
                        <X size={12} />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-[12px] text-[#8c6c54] underline hover:text-[#5a3f2b]"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message if backend connection failed */}
            {error && (
              <div className="mb-6 rounded-[12px] border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
                <p className="font-medium">Notice: {error}</p>
                <button
                  type="button"
                  onClick={fetchData}
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#8d6b51] underline hover:opacity-80"
                >
                  <RotateCcw size={14} /> Retry loading products
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-[380px] animate-pulse rounded-[15px] border border-[#e6e0da] bg-white p-4"
                  >
                    <div className="aspect-[1.5/1] rounded-[10px] bg-[#ece7df]" />
                    <div className="mt-4 h-4 w-1/3 rounded bg-[#ece7df]" />
                    <div className="mt-2 h-5 w-3/4 rounded bg-[#ece7df]" />
                    <div className="mt-3 h-4 w-1/4 rounded bg-[#ece7df]" />
                  </div>
                ))}
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    liked={liked.includes(product._id)}
                    onLike={(e) => handleLike(product._id, e)}
                    onAdd={(e) => handleAddToCart(product, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-[360px] flex-col items-center justify-center rounded-[15px] border border-[#e6e0da] bg-white px-6 text-center">
                <Package size={44} className="text-[#a49a8e] mb-3" />
                <p className="text-[18px] font-medium text-[#18110b]">
                  No products found
                </p>
                <p className="mt-2 max-w-[340px] text-[13px] text-[#7a7772]">
                  {products.length === 0
                    ? "Your catalog currently has no active products. Add new products in the admin panel to view them here."
                    : "No products matched your active filters or search criteria."}
                </p>
                {products.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => router.push("/admin/products/add")}
                    className="mt-5 rounded-[8px] bg-[#8d6b51] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#72543d]"
                  >
                    Add Product in Admin
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-5 rounded-[8px] bg-[#8d6b51] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#72543d]"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Promo banner */}
            <div className="mt-[32px] rounded-[12px] bg-[#302116] px-[22px] py-[20px] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="mb-[4px] text-[11px] tracking-[1px] text-[#c6a27e]">
                    SPECIAL SERVICE
                  </p>
                  <p className="text-[15px] font-medium text-white">
                    Free White Glove Delivery & Assembly on orders above ₹75,000
                  </p>
                </div>
                <Link
                  href="/store"
                  className="w-fit rounded-[6px] bg-[#9a6b48] px-[20px] py-[10px] text-[12px] font-semibold text-white transition hover:bg-[#ad7952]"
                >
                  Shop Best Pieces →
                </Link>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center py-[32px]">
                <div className="flex items-center gap-[8px]">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[7px] border border-[#e3ddd6] text-[#8a8a8a] transition hover:bg-white disabled:opacity-30"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateFilters({ page: num })}
                        className={`flex h-[36px] w-[36px] items-center justify-center rounded-[7px] text-[13px] transition ${
                          page === num
                            ? "bg-[#916847] font-semibold text-white shadow-sm"
                            : "border border-[#e3ddd6] hover:bg-white text-[#555]"
                        }`}
                      >
                        {num}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => updateFilters({ page: Math.min(totalPages, page + 1) })}
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[7px] border border-[#e3ddd6] text-[#8a8a8a] transition hover:bg-white disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>

                {page < totalPages && (
                  <button
                    type="button"
                    onClick={() => updateFilters({ page: Math.min(totalPages, page + 1) })}
                    className="mt-[16px] h-[40px] px-6 rounded-[6px] border border-[#b99577] text-[12px] font-medium tracking-[1px] text-[#9a7355] transition hover:bg-[#f2ebe4]"
                  >
                    LOAD NEXT PAGE
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({ title, values, selected, onToggle }) {
  if (!values || values.length === 0) return null;

  return (
    <div className="mb-[25px]">
      <h3 className="mb-[14px] text-[11px] font-semibold tracking-[1.5px] text-[#777b80]">
        {title}
      </h3>

      <div className="space-y-[10px] max-h-[220px] overflow-y-auto pr-1">
        {values.map((value) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-[10px] text-[13px] text-[#4d4d4d] hover:text-[#18110b]"
          >
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
              className="peer sr-only"
            />

            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border border-[#9da0a1] bg-white transition peer-checked:border-[#8d6b51] peer-checked:bg-[#8d6b51]">
              <svg
                viewBox="0 0 20 20"
                className={`h-[12px] w-[12px] text-white ${
                  selected.includes(value) ? "block" : "hidden"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m4 10 4 4 8-8" />
              </svg>
            </span>

            <span className="truncate">{value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, liked, onLike, onAdd }) {
  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : product.category || "Collection";

  const price = Number(product.salePrice ?? product.price ?? 0);
  const oldPrice =
    product.originalPrice && Number(product.originalPrice) > price
      ? Number(product.originalPrice)
      : null;

  const discountPercent =
    product.discount ||
    (oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);

  // Badge determination
  let badgeText = null;
  let badgeColor = "bg-[#806149]";

  if (product.stock <= 0) {
    badgeText = "OUT OF STOCK";
    badgeColor = "bg-stone-600";
  } else if (discountPercent > 0) {
    badgeText = `${discountPercent}% OFF`;
    badgeColor = "bg-[#a35232]";
  } else if (product.newArrival) {
    badgeText = "NEW";
    badgeColor = "bg-[#3e5f49]";
  } else if (product.bestseller) {
    badgeText = "BESTSELLER";
    badgeColor = "bg-[#806149]";
  } else if (product.featured) {
    badgeText = "FEATURED";
    badgeColor = "bg-[#544131]";
  }

  const imageUrl =
    product.image ||
    (product.images && product.images[0]) ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";

  // Use product slug or _id for route
  const detailRoute = `/store/${product.slug || product._id}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[15px] border border-[#eee8e0] bg-white transition duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      {/* Clickable Card Link */}
      <Link href={detailRoute} className="block relative aspect-[1.5/1] overflow-hidden bg-[#efede9]">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />

        {badgeText && (
          <span
            className={`absolute left-[14px] top-[14px] rounded-[6px] ${badgeColor} px-[9px] py-[4px] text-[10px] font-semibold tracking-[0.8px] text-white shadow-sm`}
          >
            {badgeText}
          </span>
        )}

        <button
          type="button"
          onClick={onLike}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-[14px] top-[14px] z-10 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#e0ddd8] bg-white/95 shadow-sm transition hover:scale-105 ${
            liked ? "text-[#8e6549]" : "text-[#94785f]"
          }`}
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-[18px]">
        <div className="mb-[6px] text-[11px] font-medium tracking-[1.4px] text-[#8a8d91] uppercase">
          {categoryName}
        </div>

        <Link
          href={detailRoute}
          className="line-clamp-2 min-h-[40px] text-[15px] font-medium leading-[1.35] text-[#1c1815] transition hover:text-[#916847]"
        >
          {product.name}
        </Link>

        {/* Rating and review indication */}
        <div className="mt-[8px] flex items-center gap-[6px]">
          <span className="text-[12px] tracking-[1px] text-[#ad8b68]">
            {"★".repeat(5)}
          </span>
          <span className="text-[11px] text-[#8c8d90]">
            ({product.stock > 0 ? `${product.stock} in stock` : "Made to order"})
          </span>
        </div>

        {/* Price Area */}
        <div className="mt-[12px] flex items-baseline gap-[10px]">
          <span className="text-[17px] font-semibold text-[#18110b]">
            {money.format(price)}
          </span>

          {oldPrice && (
            <span className="text-[13px] text-[#9b9b9b] line-through">
              {money.format(oldPrice)}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="text-[11px] font-medium text-emerald-700">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          <Link
            href={detailRoute}
            className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#ded6ce] text-[12px] font-medium text-[#765b46] transition group-hover:bg-[#8d6b51] group-hover:text-white group-hover:border-[#8d6b51]"
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
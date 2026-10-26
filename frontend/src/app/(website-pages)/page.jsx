"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
  IconQuote,
  IconTruckDelivery,
} from "@tabler/icons-react";
import axios from "axios";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85",
    label: "SUMMER COLLECTION 2026",
    title: "Where Comfort",
    italic: "Meets Craft",
    text: "Scandinavian-inspired furniture for modern living. Curated pieces that endure seasons.",
    button: "Shop Collection",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
    label: "BEDROOM EDIT",
    title: "Rest,",
    italic: "Reimagined",
    text: "Soft textures and calm tones for a bedroom that feels like a retreat.",
    button: "Shop Bedroom",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85",
    label: "NEW ARRIVALS",
    title: "Gather Around",
    italic: "Good Wood",
    text: "Solid-wood dining sets built for long dinners and longer conversations.",
    button: "Shop Dining",
  },
];

const fallbackCategories = [
  {
    name: "Sofas",
    count: "42 pieces",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=85",
  },
  {
    name: "Bedroom",
    count: "31 pieces",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=85",
  },
  {
    name: "Tables",
    count: "28 pieces",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=85",
  },
  {
    name: "Chairs",
    count: "56 pieces",
    image:
      "https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=400&q=85",
  },
  // {
  //   name: "Storage",
  //   count: "19 pieces",
  //   image:
  //     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=85",
  // },
  // {
  //   name: "Lighting",
  //   count: "37 pieces",
  //   image:
  //     "https://images.unsplash.com/photo-1748679979601-dc9ec43d900d?auto=format&fit=crop&w=400&q=85",
  // },
  // {
  //   name: "Décor",
  //   count: "64 pieces",
  //   image:
  //     "https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=400&q=85",
  // },
];

const bestSellers = [
  {
    badge: "SALE",
    category: "SOFAS",
    name: "Ember Velvet 3-Seater",
    price: "₹89,000",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=700&q=80",
  },
  {
    badge: null,
    category: "STORAGE",
    name: "Nordic Oak Bookcase",
    price: "₹42,500",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=700&q=80",
  },
  {
    badge: null,
    category: "TABLES",
    name: "Travertine Side Table",
    price: "₹28,000",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=700&q=80",
  },
  {
    badge: "HOT",
    category: "CHAIRS",
    name: "Aura Bouclé Armchair",
    price: "₹54,000",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=700&q=80",
  },
];

const justLanded = [
  {
    category: "Bedroom",
    name: "Linen Wardrobe",
    price: "₹1,18,000",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Media",
    name: "Walnut TV Console",
    price: "₹67,000",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=900&q=85",
  },
];

const fallbackShopRooms = [
  {
    name: "Living Room",
    count: "98 pieces",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Bedroom",
    count: "31 pieces",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Study & Storage",
    count: "19 pieces",
    image:
      "https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Dining Room",
    count: "28 pieces",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Home Office",
    count: "24 pieces",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=85",
  },
];

const testimonials = [
  {
    initials: "PR",
    name: "Priya Rao",
    city: "Mumbai",
    text: "The Ember Velvet sofa is absolutely stunning. Delivery was flawless and the quality is beyond what I expected.",
  },
  {
    initials: "AS",
    name: "Arjun Sharma",
    city: "Bangalore",
    text: "Nestro transformed our living room. Every piece feels like it belongs — timeless and beautifully crafted.",
  },
  {
    initials: "NK",
    name: "Neha Kapoor",
    city: "Delhi",
    text: "Premium quality at a fair price. The travertine side table is a conversation starter every time.",
  },
];

const benefits = [
  {
    title: "Free Delivery",
    text: "On all orders above ₹50,000",
  },
  {
    title: "30-Day Returns",
    text: "Hassle-free return policy",
  },
  {
    title: "Expert Assembly",
    text: "Professional setup at home",
  },
  {
    title: "5-Year Warranty",
    text: "On all furniture items",
  },
];

function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[10px] border border-[#e7dfd5] bg-[#f9f7f4]">
      <div className="relative h-[210px] overflow-hidden bg-[#ebe5df]">
        {product.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-[4px] bg-[#4d3a2b] px-2.5 py-1 text-[10px] font-medium tracking-[1px] text-white">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="px-4 pb-5 pt-4">
        <p className="mb-2 text-[9px] font-medium tracking-[2px] text-[#6b635d]">
          {product.category}
        </p>

        <h3 className="mb-3 text-[15px] font-normal tracking-[-0.3px] text-[#1a1714]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-0.5 text-[12px] text-[#d6a56a]">
            {Array.from({ length: product.rating }).map((_, index) => (
              <span key={`${product.name}-${index}`}>★</span>
            ))}
          </div>
          <p className="text-[13px] font-medium text-[#18110b]">{product.price}</p>
        </div>
      </div>
    </article>
  );
}

function RoomCard({ room, className = "h-[300px]" }) {
  return (
    <Link
      href={`/store?room=${encodeURIComponent(room.name)}`}
      className={`group relative block overflow-hidden rounded-[10px] ${className}`}
    >
      <img
        src={room.image}
        alt={room.name}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute bottom-5 left-5 text-white">
        <h3 className="text-[20px] font-normal max-sm:text-[18px]">{room.name}</h3>
        <p className="mt-1 text-[12px] text-white/70">{room.count}</p>
      </div>
    </Link>
  );
}

function Page() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [categories, setCategories] = useState(fallbackCategories);
  const [rooms, setRooms] = useState(fallbackShopRooms);

  const previous = () => {
    setCurrent((current) => (current - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setCurrent((current) => (current + 1) % slides.length);
  };

  const slide = slides[current];

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setCurrent((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [current, isPaused]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/category");
        const activeCategories = (response.data.category || [])
          .filter((category) => category.status !== false)
          .map((category, index) => ({
            name: category.name,
            count: category.quantity + " pieces",
            price: "₹ " + category.price,
            image:
              category.image ||
              fallbackCategories[index % fallbackCategories.length].image,
          }));

        if (activeCategories.length > 0) {
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Failed to fetch website categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms");
        const activeRooms = (response.data.rooms || [])
          .filter((room) => room.status !== false)
          .map((room, index) => ({
            name: room.name,
            count: `${room.count ?? 0} pieces`,
            image:
              room.image ||
              fallbackShopRooms[index % fallbackShopRooms.length].image,
          }));

        if (activeRooms.length > 0) {
          setRooms(activeRooms);
        }
      } catch (error) {
        console.error("Failed to fetch website rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <main className="w-full overflow-hidden bg-[#f7f5f1] px-5 pb-16 max-sm:px-2.5">
      <section
        className="relative flex h-[440px] w-full items-center overflow-hidden rounded-[18px] bg-cover bg-center max-sm:h-[590px] max-sm:items-end"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#18110bcc] via-[#18110b99] to-[#18110b14] max-sm:bg-gradient-to-t max-sm:from-[#140e0ae6] max-sm:via-[#140e0a80] max-sm:to-[#140e0a1a]" />

        <button
          onClick={previous}
          aria-label="Previous slide"
          className="absolute left-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 max-sm:left-5 max-sm:top-6 max-sm:translate-y-0"
        >
          <IconChevronLeft size={20} stroke={1.5} />
        </button>

        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-6 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 max-sm:right-5 max-sm:top-6 max-sm:translate-y-0"
        >
          <IconChevronRight size={20} stroke={1.5} />
        </button>

        <div className="relative z-10 ml-20 w-[470px] py-10 text-white max-sm:mb-[90px] max-sm:ml-6 max-sm:mr-6 max-sm:w-auto">
          <p className="mb-5 text-[12px] font-medium tracking-[3px] text-[#d89a61] max-sm:text-[10px]">
            {slide.label}
          </p>

          <h1 className="w-[480px] text-[48px] font-normal leading-[1.08] tracking-[-2px] max-sm:w-auto max-sm:text-[39px] max-sm:tracking-[-1px]">
            {slide.title}
            <em className="pl-2 font-serif font-normal text-[#d9b895]">
              {slide.italic}
            </em>
          </h1>

          <p className="mb-9 mt-5 w-[315px] text-[13px] leading-6 text-white/70">
            {slide.text}
          </p>

          <div className="flex gap-3 max-sm:flex-col">
            <Link
              href="/store"
              className="flex h-11 items-center justify-center rounded-[5px] border border-[#a56d43] bg-[#a56d43] px-7 text-[14px] text-white transition hover:bg-[#b87c4d]"
            >
              {slide.button}
              <span className="ml-2">→</span>
            </Link>

            <Link
              href="/store"
              className="flex h-11 items-center justify-center rounded-[5px] border border-white/35 bg-transparent px-7 text-[14px] text-white transition hover:bg-white/10"
            >
              View Lookbook
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-20 z-10 flex items-center gap-2.5 max-sm:bottom-7.5 max-sm:left-6">
          <div className="flex gap-2.5">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative h-1 w-7 overflow-hidden rounded-full bg-white/35"
              >
                <span
                  key={`${current}-${index}`}
                  className={`absolute inset-y-0 left-0 bg-[#d9a06c] ${
                    index < current
                      ? "w-full"
                      : index > current
                        ? "w-0"
                        : "slide-progress"
                  } ${isPaused && index === current ? "slide-progress-paused" : ""}`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((isPaused) => !isPaused)}
            aria-label={isPaused ? "Resume automatic slides" : "Pause automatic slides"}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/70 transition hover:bg-white/20"
          >
            {isPaused ? (
              <IconPlayerPlay size={11} stroke={1.5} />
            ) : (
              <IconPlayerPause size={11} stroke={1.5} />
            )}
          </button>
        </div>
      </section>

      <section className="mt-8 max-sm:mt-12">
        <div className="mb-2 max-sm:mb-8">
          <p className="mb-1.5 text-[10px] font-medium tracking-[3px] text-[#a56d43] max-sm:text-[10px]">
            BROWSE
          </p>
          <h2 className="text-[18px] font-normal tracking-[-1px] text-[#18110b] max-sm:text-[28px]">
            Shop by Category
          </h2>
        </div>

        <div className="flex gap-8 ml-6 mt-4">
          {categories.map((category) => (
            <Link
              href={`/store?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="flex cursor-pointer flex-col items-center gap-2 transition hover:opacity-80"
            >
              <div className="relative h-22 w-22 overflow-hidden rounded-full bg-[#ebe5df]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-medium text-[#18110b]">
                  {category.name}
                </p>
                <p className="text-[12px] text-[#7a7a7a]">{category.count}</p>
                {/* <p className="text-[12px] text-[#7a7a7a]">{category.price}</p> */}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 max-sm:mt-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[10px] font-medium tracking-[3px] text-[#a56d43] max-sm:text-[10px]">
              HANDPICKED FOR YOU
            </p>
            <h2 className="text-[18px] font-normal tracking-[-1px] text-[#18110b] max-sm:text-[28px]">
              Best Sellers
            </h2>
          </div>

          <Link
            href="/store"
            className="flex items-center gap-2 text-[11px] font-medium underline underline-offset-4 text-[#8b5e3c] opacity-75 transition hover:opacity-100"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {bestSellers.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-20 max-sm:mt-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[10px] font-medium tracking-[3px] text-[#a56d43] max-sm:text-[10px]">
              NEW ARRIVALS
            </p>
            <h2 className="text-[18px] font-normal tracking-[-1px] text-[#18110b] max-sm:text-[28px]">
              Just Landed
            </h2>
          </div>

         <Link
            href="/store"
            className="flex items-center gap-2 text-[11px] font-medium underline underline-offset-4 text-[#8b5e3c] opacity-75 transition hover:opacity-100"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-[1.7fr_1fr_1fr] gap-3 max-lg:grid-cols-1">
          <article className="relative min-h-[390px] overflow-hidden rounded-[10px] bg-[#e8e0d6]">
            <img
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85"
              alt="Scandinavian Dining Set"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="relative flex min-h-[390px] flex-col justify-end p-7 text-white">
              <span className="mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-[10px] font-medium tracking-[1.5px] backdrop-blur">
                FEATURED
              </span>
              <h3 className="text-[29px] font-normal leading-tight">
                Scandinavian
                <br />
                Dining Set
              </h3>
              <p className="mt-3 text-[12px] text-white/70">
                Ash wood + linen chairs. Set of 4.
              </p>
              <p className="mt-4 text-[16px] font-medium">₹1,24,000</p>
              <Link
                href="/store"
                className="mt-5 flex h-10 w-fit items-center gap-2 rounded-[5px] bg-[#a56d43] px-5 text-[12px] text-white"
              >
                View in Store
                <IconArrowRight size={14} />
              </Link>
            </div>
          </article>

          {justLanded.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3 max-md:grid-cols-1">
        <div className="flex min-h-[190px] flex-col justify-center rounded-[10px] border border-[#E8E0D5] bg-[#f5ede4] px-9 py-8">
          <p className="mb-2 text-[10px] font-medium tracking-[3px] text-[#8d5d3d]">
            OFFER
          </p>
          <h3 className="text-[27px] font-normal text-[#241810]">
            First order 15% off
          </h3>
          <p className="mt-2 text-[13px] text-[#66544a]">
            Use code <span className="font-medium text-[#241810]">Nestro15</span>{" "}
            at checkout
          </p>
          <Link
            href="/store"
            className="mt-5 flex w-fit items-center gap-2 rounded-[5px] bg-[#a56d43] px-5 py-2.5 text-[12px] text-white"
          >
            Shop Now
            <IconArrowRight size={14} />
          </Link>
        </div>

        <div className="flex min-h-[190px] flex-col justify-center rounded-[10px] border border-[#e4d9cd] bg-[#fbf8f4] px-9 py-8">
          <p className="mb-2 text-[10px] font-medium tracking-[3px] text-[#a56d43]">
            FREE DELIVERY
          </p>
          <h3 className="text-[27px] font-normal text-[#18110b]">
            On orders above ₹50,000
          </h3>
          <p className="mt-1.5 text-[13px] text-[#7a7069]">
            White glove service. Assembly included.
          </p>

        <div>
        <IconTruckDelivery stroke={2} size={36} color="#a56d43" className="mt-6" />
        </div>
        </div>
      </section>

      <section className="mt-20 max-sm:mt-14">
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-medium tracking-[3px] text-[#a56d43]">
            CURATED BY SPACE
          </p>

          <h2 className="text-[18px] font-normal tracking-[-1px] text-[#18110b]">
            Shop by Room
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div className="h-[380px] max-sm:h-[260px]">
            <RoomCard room={rooms[0]} className="h-full" />
          </div>

          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            {rooms.slice(1, 5).map((room) => (
              <div key={room.name} className="h-[180px] max-sm:h-[200px]">
                <RoomCard room={room} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 overflow-hidden rounded-[12px] bg-[#e9e0d5] max-sm:mt-14">
        <div className="grid min-h-[470px] grid-cols-2 max-lg:grid-cols-1">
          <div className="flex flex-col justify-center px-12 py-14 max-md:px-7">
            <p className="mb-5 text-[11px] font-medium tracking-[3px] text-[#a56d43]">
              OUR CRAFT
            </p>

            <h2 className="max-w-[520px] text-[42px] font-normal leading-[1.1] tracking-[-1.5px] text-[#18110b] max-sm:text-[31px]">
              Built by artisans who
              <br />
              still use their hands
            </h2>

            <p className="mt-6 max-w-[520px] text-[14px] leading-7 text-[#665c54]">
              Every Nestro piece passes through a small workshop in Jodhpur
              before it reaches your home — solid joinery, hand-finished
              grains, and fabrics tested for years of daily life, not just a
              showroom photo.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-6 max-sm:grid-cols-1">
              <div>
                <p className="text-[25px] font-normal text-[#18110b]">12,000+</p>
                <p className="mt-1 text-[11px] text-[#766b62]">
                  Homes furnished
                </p>
              </div>
              <div>
                <p className="text-[25px] font-normal text-[#18110b]">18 yrs</p>
                <p className="mt-1 text-[11px] text-[#766b62]">
                  Of craftsmanship
                </p>
              </div>
              <div>
                <p className="text-[25px] font-normal text-[#18110b]">4.8/5</p>
                <p className="mt-1 text-[11px] text-[#766b62]">
                  Average rating
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[470px]">
            <img
              src="https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=1200&q=85"
              alt="Nestro craftsmanship"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-4 gap-3 rounded-[10px] border border-[#e6ddd3] bg-[#fbf9f6] px-8 py-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {benefits.map((benefit) => (
          <div key={benefit.title}>
            <h3 className="text-[14px] font-medium text-[#18110b]">
              {benefit.title}
            </h3>
            <p className="mt-1.5 text-[12px] leading-5 text-[#7a7069]">
              {benefit.text}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-20 max-sm:mt-14">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[12px] font-medium tracking-[3px] text-[#a56d43] max-sm:text-[10px]">
            WHAT OUR CUSTOMERS SAY
          </p>
          <h2 className="text-[36px] font-normal tracking-[-1px] text-[#18110b] max-sm:text-[28px]">
            Loved by 12,000+ homes
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[10px] border border-[#e6ddd3] bg-[#fbf9f6] p-7"
            >
              <div className="flex items-center gap-1 text-[13px] text-[#d6a56a]">
                ★★★★★
              </div>

              <p className="mt-5 text-[14px] leading-7 text-[#4e4640]">
                “{testimonial.text}”
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7d9ca] text-[10px] font-medium text-[#8d5d3d]">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#18110b]">
                    {testimonial.name}
                  </p>
                  <p className="text-[11px] text-[#8a8078]">
                    {testimonial.city}
                  </p>
                </div>
                <IconQuote
                  size={20}
                  stroke={1}
                  className="ml-auto text-[#c7b3a0]"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <style jsx>{`
        .slide-progress {
          animation: slide-progress 5s linear forwards;
        }

        .slide-progress-paused {
          animation-play-state: paused;
        }

        @keyframes slide-progress {
          from {
            width: 0;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default Page;

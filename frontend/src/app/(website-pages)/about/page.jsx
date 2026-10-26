import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

const stats = [
  { value: "12,000+", label: "Homes furnished" },
  { value: "18 yrs", label: "Of craftsmanship" },
  { value: "4.8/5", label: "Average rating" },
];

const values = [
  {
    number: "01",
    title: "Honest materials",
    text: "Solid wood, natural stone, and responsibly sourced fabrics. We choose materials for how they age, not just how they photograph.",
  },
  {
    number: "02",
    title: "Human craft",
    text: "Every piece passes through the hands of artisans in our Jodhpur workshop — joined, sanded, and finished with care.",
  },
  {
    number: "03",
    title: "Built to endure",
    text: "Timeless proportions and repairable construction. Furniture made to stay with you through seasons, moves, and growing families.",
  },
];

const process = [
  {
    step: "Design",
    text: "We begin with how a room should feel — calm, useful, and quietly beautiful.",
  },
  {
    step: "Craft",
    text: "Local artisans shape each piece using traditional joinery and hand finishing.",
  },
  {
    step: "Deliver",
    text: "White-glove delivery and assembly bring the finished piece into your home.",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full overflow-hidden bg-[#f7f5f1] px-5 pb-16 max-sm:px-2.5">
      <section className="relative mt-4 grid min-h-[440px] grid-cols-2 overflow-hidden rounded-[18px] bg-[#1A1208] max-lg:grid-cols-1">
        <div className="relative z-10 flex flex-col justify-center px-14 py-16 text-white max-md:px-7">
          <p className="mb-5 text-[11px] font-medium tracking-[3px] text-[#d89a61]">
            OUR STORY
          </p>

          <h1 className="max-w-[520px] text-[48px] font-normal leading-[1.08] tracking-[-2px] max-sm:text-[37px] max-sm:tracking-[-1px]">
            Considered furniture,
            <br />
            <em className="font-serif text-[#d9b895]">made to last.</em>
          </h1>

          <p className="mt-6 max-w-[430px] text-[14px] leading-7 text-white/65">
            Nestro began with a simple belief: the pieces you live with should
            be made slowly, honestly, and well enough to keep for years.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/store"
              className="flex h-11 items-center gap-2 rounded-[5px] bg-[#a56d43] px-6 text-[13px] text-white transition hover:bg-[#b87c4d]"
            >
              Explore the collection
              <IconArrowRight size={15} />
            </Link>

            <Link
              href="/contact"
              className="flex h-11 items-center rounded-[5px] border border-white/30 px-6 text-[13px] text-white transition hover:bg-white/10"
            >
              Talk to us
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85"
            alt="Warm, considered interior by Nestro"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208]/50 to-transparent max-lg:bg-gradient-to-t" />
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-[1180px] grid-cols-3 gap-3 rounded-[10px] border border-[#e6ddd3] bg-[#fbf9f6] px-8 py-7 max-sm:grid-cols-1">
        {stats.map((item) => (
          <div key={item.label}>
            <p className="text-[28px] font-normal text-[#18110b]">{item.value}</p>
            <p className="mt-1 text-[11px] tracking-[0.06em] text-[#7a7069]">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 grid max-w-[1180px] grid-cols-2 items-center gap-12 max-lg:grid-cols-1">
        <div className="relative h-[480px] overflow-hidden rounded-[14px] bg-[#e8e0d6] max-sm:h-[340px]">
          <img
            src="https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=1100&q=85"
            alt="Nestro workshop detail"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="max-w-[500px]">
          <p className="mb-4 text-[10px] font-medium tracking-[3px] text-[#a56d43]">
            FROM OUR WORKSHOP
          </p>

          <h2 className="text-[36px] font-normal leading-[1.12] tracking-[-1px] text-[#18110b] max-sm:text-[29px]">
            A small workshop,
            <br />
            <em className="font-serif text-[#8d5d3d]">a long point of view.</em>
          </h2>

          <p className="mt-6 text-[14px] leading-7 text-[#665c54]">
            Every Nestro piece passes through a small workshop in Jodhpur before
            it reaches your home. There, solid joinery, hand-finished grains, and
            fabrics tested for real life come together — not just for a showroom
            photograph, but for the way you actually live.
          </p>

          <p className="mt-4 text-[14px] leading-7 text-[#665c54]">
            We work in small batches, keep our material choices honest, and
            design with restraint. The result is furniture that feels settled in
            a room from the day it arrives.
          </p>

          <Link
            href="/store"
            className="mt-8 inline-flex items-center gap-2 border-b border-[#a56d43] pb-1 text-[12px] font-medium text-[#8d5d3d] transition hover:gap-3"
          >
            Browse our pieces
            <IconArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1180px]">
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-medium tracking-[3px] text-[#a56d43]">
            WHAT WE BELIEVE
          </p>
          <h2 className="text-[32px] font-normal tracking-[-1px] text-[#18110b] max-sm:text-[27px]">
            A quieter way to furnish a home
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {values.map((value) => (
            <article
              key={value.number}
              className="rounded-[10px] border border-[#e6ddd3] bg-[#fbf9f6] p-7"
            >
              <p className="text-[11px] font-medium tracking-[2px] text-[#b08a64]">
                {value.number}
              </p>
              <h3 className="mt-5 text-[19px] font-normal text-[#18110b]">
                {value.title}
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-[#665c54]">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1180px] rounded-[12px] bg-[#e9e0d5] px-10 py-12 max-sm:px-6">
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
          {process.map((item, index) => (
            <div key={item.step} className="relative">
              <span className="text-[11px] font-medium tracking-[2px] text-[#a56d43]">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-[22px] font-normal text-[#18110b]">
                {item.step}
              </h3>
              <p className="mt-3 max-w-[300px] text-[13px] leading-6 text-[#665c54]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1180px] rounded-[12px] bg-[#1A1208] px-10 py-14 text-center max-sm:px-6">
        <p className="mb-4 text-[10px] font-medium tracking-[3px] text-[#d89a61]">
          COME SAY HELLO
        </p>
        <h2 className="text-[34px] font-normal tracking-[-1px] text-white max-sm:text-[27px]">
          Find something that feels like home.
        </h2>
        <p className="mx-auto mt-4 max-w-[470px] text-[13px] leading-6 text-white/55">
          Visit our showroom, browse the collection, or write to us — we are
          always happy to talk about the room you have in mind.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/store"
            className="flex h-11 items-center gap-2 rounded-[5px] bg-[#a56d43] px-6 text-[13px] text-white transition hover:bg-[#b87c4d]"
          >
            Shop the collection
            <IconArrowRight size={15} />
          </Link>
          <Link
            href="/contact"
            className="flex h-11 items-center rounded-[5px] border border-white/25 px-6 text-[13px] text-white transition hover:bg-white/10"
          >
            Contact Nestro
          </Link>
        </div>
      </section>
    </main>
  );
}

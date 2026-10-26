"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "../../components/website/SiteSettingsProvider";

const faqs = [
  {
    question: "Can I see pieces in person before ordering?",
    answer:
      "Yes. Our Jodhpur showroom displays a rotating selection of the collection. Write to us and we will arrange a private viewing.",
  },
  {
    question: "Do you deliver outside Jodhpur?",
    answer:
      "We deliver across India with white-glove service. Delivery timelines and charges depend on your city and the pieces you choose.",
  },
  {
    question: "Can I request a custom size or finish?",
    answer:
      "Many of our designs can be adapted in size, timber, or upholstery. Share your requirements and our team will guide you.",
  },
];

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General enquiry",
    message: "",
  });
  const [status, setStatus] = useState("");

  const details = [
    {
      icon: MapPin,
      label: "Visit the showroom",
      value: settings.supportAddress,
      hint: "Private viewings available on request",
    },
    {
      icon: Phone,
      label: "Call us",
      value: settings.supportPhone,
      hint: settings.supportHours,
      href: `tel:${settings.supportPhone.replace(/[^\d+]/g, "")}`,
    },
    {
      icon: Mail,
      label: "Write to us",
      value: settings.supportEmail,
      hint: "We reply within one working day",
      href: `mailto:${settings.supportEmail}`,
    },
    {
      icon: Clock,
      label: "Studio hours",
      value: settings.supportHours,
      hint: "Closed on Sundays and public holidays",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = `Nestro enquiry: ${formData.subject}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      formData.message,
    ].join("\n");

    setStatus("Your email app should now be open with your message ready to send.");
    window.location.href = `mailto:${settings.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="w-full overflow-hidden bg-[#f7f5f1] px-5 pb-16 max-sm:px-2.5">
      <section className="mx-auto max-w-[1180px] px-1 pt-14 max-sm:pt-10">
        <p className="mb-4 text-[10px] font-medium tracking-[3px] text-[#a56d43]">
          CONTACT NESTRO
        </p>
        <div className="flex items-end justify-between gap-8 max-lg:flex-col max-lg:items-start">
          <h1 className="max-w-[620px] text-[48px] font-normal leading-[1.08] tracking-[-2px] text-[#18110b] max-sm:text-[37px] max-sm:tracking-[-1px]">
            We would love to
            <br />
            <em className="font-serif text-[#8d5d3d]">hear from you.</em>
          </h1>

          <p className="max-w-[380px] pb-2 text-[13px] leading-6 text-[#665c54]">
            Questions about a piece, a delivery, or a room you are planning —
            write to us or visit the studio. We are always happy to help.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-[1180px] grid-cols-[0.85fr_1.15fr] gap-4 max-lg:grid-cols-1">
        <div className="flex flex-col gap-3">
          {details.map((detail) => {
            const Icon = detail.icon;

            return (
              <article
                key={detail.label}
                className="rounded-[12px] border border-[#e6ddd3] bg-[#fbf9f6] p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee3d5] text-[#8d5d3d]">
                    <Icon size={17} strokeWidth={1.7} />
                  </span>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#a56d43]">
                      {detail.label}
                    </p>
                    {detail.href ? (
                      <a href={detail.href} className="mt-2 block text-[14px] font-medium text-[#18110b] transition hover:text-[#a56d43]">
                        {detail.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-[14px] font-medium text-[#18110b]">
                        {detail.value}
                      </p>
                    )}
                    <p className="mt-1 text-[12px] text-[#8a8078]">
                      {detail.hint}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-[14px] border border-[#e6ddd3] bg-[#fffdfa] p-8 max-sm:p-6">
          <h2 className="text-[25px] font-normal text-[#18110b]">
            Send us a note
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#7a7069]">
            Share a few details and we will get back to you within one working
            day.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <label className="block">
                <span className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#4e4640]">
                  Your name
                </span>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="h-[46px] w-full rounded-[8px] border border-[#ded5ca] bg-white px-4 text-[13px] text-[#18110b] outline-none transition placeholder:text-[#b3a99e] focus:border-[#a56d43]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#4e4640]">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-[46px] w-full rounded-[8px] border border-[#ded5ca] bg-white px-4 text-[13px] text-[#18110b] outline-none transition placeholder:text-[#b3a99e] focus:border-[#a56d43]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#4e4640]">
                What is this about?
              </span>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="h-[46px] w-full cursor-pointer rounded-[8px] border border-[#ded5ca] bg-white px-4 text-[13px] text-[#18110b] outline-none transition focus:border-[#a56d43]"
              >
                <option>General enquiry</option>
                <option>Order and delivery</option>
                <option>Product and materials</option>
                <option>Custom furniture</option>
                <option>Trade and partnerships</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium tracking-[0.05em] text-[#4e4640]">
                Your message
              </span>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us what you are looking for..."
                className="w-full resize-none rounded-[8px] border border-[#ded5ca] bg-white px-4 py-3 text-[13px] leading-6 text-[#18110b] outline-none transition placeholder:text-[#b3a99e] focus:border-[#a56d43]"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-[#8a8078]">
                This opens your email app so you can send the message directly.
              </p>

              <button
                type="submit"
                className="flex h-11 items-center gap-2 rounded-[6px] bg-[#a56d43] px-6 text-[12px] font-medium tracking-[0.03em] text-white transition hover:bg-[#8d5d3d]"
              >
                Send message
                <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {status && (
            <div className="mt-5 flex items-start gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] leading-5 text-emerald-800">
              <Check size={15} className="mt-0.5 shrink-0" />
              <span>{status}</span>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1180px]">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-medium tracking-[3px] text-[#a56d43]">
              GOOD TO KNOW
            </p>
            <h2 className="text-[32px] font-normal tracking-[-1px] text-[#18110b] max-sm:text-[27px]">
              Common questions
            </h2>
          </div>

          <Link
            href="/about"
            className="flex items-center gap-2 text-[11px] font-medium text-[#8d5d3d] underline underline-offset-4 transition hover:text-[#5a3f2b] max-sm:hidden"
          >
            Read our story
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-[10px] border border-[#e6ddd3] bg-[#fbf9f6] p-6"
            >
              <h3 className="text-[15px] font-medium leading-6 text-[#18110b]">
                {faq.question}
              </h3>
              <p className="mt-3 text-[12px] leading-6 text-[#665c54]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

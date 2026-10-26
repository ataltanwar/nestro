"use client";

import React, { useState } from 'react'
import Link from 'next/link';
import axios from 'axios';
import { IconBrandInstagram, IconBrandPinterest, IconBrandYoutube } from '@tabler/icons-react';
import { useSiteSettings } from './SiteSettingsProvider';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Footer() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await axios.post(`${API_BASE}/subscribe`, { email });
      setStatus({
        type: "success",
        text: response.data?.message || "Subscribed successfully.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        text: error?.response?.data?.message || "Subscription failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className=" h-65 bg-wood text-gray-300 mt-auto">

      <div className='flex justify-center border-b mx-4 border-[#C6A27E]/10  '>

        <div className='flex flex-col pl-2 py-9'>
          <h4 className='text-golden font-medium text-[14px] tracking-widest'>{settings.storeName.toUpperCase()}.</h4>
          <p className='text-[11px] text-amber-50/40 mt-2 max-w-[480px]'>{settings.tagline}</p>
          <a href={`mailto:${settings.supportEmail}`} className='mt-2 text-[11px] text-golden/60 hover:text-golden'>{settings.supportEmail}</a>
          {settings.newsletterEnabled && (
            <>
              <form onSubmit={handleSubscribe} className='relative'>
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder='Your email address' disabled={submitting} className='w-136 h-7.5 bg-[#d6bfa71b] border border-accent/30 rounded-sm text-white/60 px-3 py-2 my-4 text-[11px] focus:outline-0 disabled:opacity-60' />
                <button type="submit" disabled={submitting} className='w-20 h-7.5 text-center text-[11px] text-white bg-accent absolute bottom-4 right-0 rounded-br-sm rounded-tr-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'>{submitting ? "Sending" : "Subscribe"}</button>
              </form>
              {status && <p className={`text-[10px] ${status.type === "success" ? "text-emerald-400/80" : "text-red-300/80"}`}>{status.text}</p>}
            </>
          )}
        </div>

        <div className='flex flex-row gap-35'>

          <div className='p-10 flex flex-col gap-2.5'>
          <h6 className='text-[#C6A27E] text-[9px] font-medium tracking-widest'>COMPANY</h6>
          <ul className='text-[11px] text-white/30 font-medium flex flex-col gap-1.5'>
            <li className='cursor-pointer hover:text-golden'><Link href="/about">Our Story</Link></li>
            <li className='cursor-pointer hover:text-golden'>Sustainability</li>
            <li className='cursor-pointer hover:text-golden'><Link href="/contact">Showrooms</Link></li>
            <li className='cursor-pointer hover:text-golden' >Careers</li>
          </ul>
        </div>

        <div className='p-10 flex flex-col gap-2.5'>
          <h6 className='text-[#C6A27E] text-[9px] font-medium tracking-widest'>SUPPORT</h6>
          <ul className='text-[11px] text-white/30 font-medium flex flex-col gap-1.5'>
            <li className= 'cursor-pointer hover:text-golden'  > Track Order</li>
            <li className= 'cursor-pointer hover:text-golden' >Returns & Exchange</li>
            <li className= 'cursor-pointer hover:text-golden' >Assembly Help</li>
            <li className='cursor-pointer hover:text-golden'><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

         <div className='p-10 flex flex-col gap-2.5'>
          <h6 className='text-[#C6A27E] text-[9px] font-medium tracking-widest'>FOLLOW US</h6>
          <ul className='text-[11px] text-white/30 font-medium flex flex-col gap-1.5'>
            <li><FooterSocialLink href={settings.instagramUrl}>Instagram</FooterSocialLink></li>
            <li><FooterSocialLink href={settings.pinterestUrl}>Pinterest</FooterSocialLink></li>
            <li><FooterSocialLink href={settings.youtubeUrl}>YouTube</FooterSocialLink></li>
          </ul>

          <div className="flex gap-2">
            <SocialIcon href={settings.instagramUrl} label="Instagram">
              <IconBrandInstagram stroke={2} size={30} />
            </SocialIcon>
            <SocialIcon href={settings.pinterestUrl} label="Pinterest">
              <IconBrandPinterest stroke={2} size={30} />
            </SocialIcon>
            <SocialIcon href={settings.youtubeUrl} label="YouTube">
              <IconBrandYoutube stroke={2} size={30} />
            </SocialIcon>
          </div>
        </div>

        </div>
        
      </div>

      <div className='px-6 py-5 text-white/30 text-[10px] flex justify-center gap-250'>
         <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
         <p>Privacy · Terms · Sitemap</p>
      </div>
     




    </footer>
  )
}

function FooterSocialLink({ href, children }) {
  if (!href) return <span className="cursor-default">{children}</span>;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="cursor-pointer hover:text-golden">
      {children}
    </a>
  );
}

function SocialIcon({ href, label, children }) {
  const className = "flex text-[#C6A27E] border border-[#C6A27E]/30 p-2 rounded-full transition hover:bg-[#C6A27E]/10";

  if (!href) {
    return <span className={className} title={`${label} link not configured`}>{children}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={className}>
      {children}
    </a>
  );
}

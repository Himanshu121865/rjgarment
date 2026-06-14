"use client";

import { useState } from "react";
import { Phone, MessageCircle, Check, ScanFaceIcon } from "lucide-react";

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9953394515",
    href: "tel:+919953394515",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 9953394515",
    href: "https://wa.me/9953394515",
  },
  {
    icon: ScanFaceIcon,
    label: "Facebook",
    value: "Rajesh Jha",
    href: "https://www.facebook.com/rajesh.jha.12979431",
  },
  {
    icon: ScanFaceIcon,
    label: "Instagram",
    value: "jha2248",
    href: "https://www.instagram.com/jha2248?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
];

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyPhone = () => {
    navigator.clipboard.writeText("+919953394515");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#E0E0E0] text-black pt-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12 border-b-8 border-black pb-6">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
            Contact
          </h1>
          <p className="font-mono text-xs md:text-sm text-gray-500 mt-2 uppercase tracking-widest">
            Get in touch
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              onClick={c.label === "Phone" ? copyPhone : undefined}
              className="flex items-center gap-4 md:gap-6 border-4 border-black bg-white p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="border-2 border-black bg-[#ff4800] p-3 md:p-4 flex-shrink-0">
                <c.icon size={24} className="text-black" />
              </div>
              <div>
                <p className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                  {c.value}
                </p>
                <p className="font-black text-lg md:text-2xl uppercase tracking-tighter text-black">
                  {c.label}
                </p>
              </div>
              {c.label === "Phone" && copied && (
                <div className="flex items-center gap-1 ml-auto border-2 border-black bg-green-100 px-2 py-1">
                  <Check size={12} />
                  <span className="font-mono text-[10px] font-bold uppercase">
                    Copied
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

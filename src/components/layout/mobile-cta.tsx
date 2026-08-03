"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <Link
        href="/free-trial"
        className="flex h-12 w-full items-center justify-center rounded-lg bg-gold font-medium text-night focus-ring"
      >
        Book Free Trial
      </Link>
    </div>
  );
}

export function WhatsAppBubble() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "1234567890";
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Assalamu alaikum, I'd like to learn about Quran classes.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-white shadow-lg hover:bg-emerald/90 focus-ring md:bottom-6"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

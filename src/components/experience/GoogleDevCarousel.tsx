"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IO_ITEMS = [
  { yr: "2025", img: "/io/1.jpg",           badge: "/io/badge_2025.svg", href: "https://developers.google.com/profile/badges/events/io/2025/registered" },
  { yr: "2024", img: "/io/2.jpg",           badge: "/io/badge_2024.svg", href: "https://developers.google.com/profile/badges/events/io/2024/registered" },
  { yr: "2023", img: "/io/3.jpg",           badge: "/io/badge_2023.svg", href: "https://developers.google.com/profile/badges/events/io/2023/attendee"   },
  { yr: "2022", img: "/io/google-2022.png", badge: "/io/badge_2022.svg", href: "https://developers.google.com/profile/badges/events/io/2022/attendee"   },
];

export function GoogleDevCarousel() {
  const reelRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const reel = reelRef.current;
    if (!reel) return;
    setCanScrollLeft(reel.scrollLeft > 10);
    setCanScrollRight(reel.scrollLeft + reel.clientWidth < reel.scrollWidth - 10);
  };

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    reel.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => reel.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollReel = (direction: "left" | "right") => {
    reelRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="w-full relative group/reel">
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            key="left"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => scrollReel("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600/80 transition-all shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}
        {canScrollRight && (
          <motion.button
            key="right"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scrollReel("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600/80 transition-all shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={reelRef}
        className="flex flex-row overflow-x-auto gap-4 snap-x snap-mandatory py-2 custom-scrollbar items-center scroll-smooth"
      >
        {IO_ITEMS.map((item) => (
          <a
            key={item.yr}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="relative w-40 h-52 min-w-[10rem] flex-shrink-0 rounded-xl border-2 border-zinc-800 bg-zinc-900 snap-center group shadow-lg overflow-hidden"
          >
            <Image
              src={item.img}
              alt={`Google I/O ${item.yr}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="160px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none" />
            <div className="absolute top-2 left-3 px-1.5 py-0.5 rounded-md bg-black/80 t-label font-black text-white uppercase tracking-widest shadow-sm">
              {item.yr}
            </div>
            <div className="absolute -bottom-1 -right-1 w-12 h-12 z-20">
              <Image src={item.badge} alt={`I/O ${item.yr} badge`} width={48} height={48} className="object-contain" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

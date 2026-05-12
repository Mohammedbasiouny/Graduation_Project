import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import {
  User, CalendarRange, FileCheck, Utensils, Home, ClipboardList,
  AlertTriangle, MessageSquare, Wrench, BookOpen, Bell, CreditCard, DoorOpen,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { Button } from "@/components/ui/Button";

const CARD_WIDTH = 360; // fixed width
const GAP = 24;
const AUTO_ADVANCE_MS = 5000; // 5 seconds

export default function StudentServices() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const isRTL = i18n.dir() === "rtl";

  const services = useMemo(() => ([
    { icon: User, key: "profile" },
    { icon: CalendarRange, key: "application_dates" },
    { icon: FileCheck, key: "apply_or_renew" },
    { icon: Utensils, key: "meals" },
    { icon: Home, key: "room_details" },
    { icon: ClipboardList, key: "application_status" },
    { icon: AlertTriangle, key: "violations" },
    { icon: MessageSquare, key: "complaints" },
    { icon: Wrench, key: "maintenance" },
    { icon: BookOpen, key: "rules" },
    { icon: Bell, key: "notifications" },
    { icon: CreditCard, key: "fees" },
    { icon: DoorOpen, key: "visit_request" },
  ]), []);

  const looped = [...services];
  const middleIndex = Math.floor(services.length / 2);

  // Scroll function that keeps the active card centered
  const scrollTo = useCallback((i, smooth = true) => {
    const el = containerRef.current;
    if (!el) return;

    const offset = (el.clientWidth - CARD_WIDTH) / 2;
    const base = i * (CARD_WIDTH + GAP) - offset;

    let targetLeft = base;

    if (isRTL) {
      targetLeft = -base;
    }

    el.scrollTo({
      left: targetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [isRTL]);

  const next = useCallback(() => {
    setIndex((current) => {
      const newIndex = current < looped.length - 1 ? current + 1 : 0;
      scrollTo(newIndex);
      return newIndex;
    });
  }, [looped.length, scrollTo]);

  const prev = useCallback(() => {
    setIndex((current) => {
      const newIndex = current > 0 ? current - 1 : looped.length - 1;
      scrollTo(newIndex);
      return newIndex;
    });
}, [looped.length, scrollTo]);

  // Initial center
  useEffect(() => {
    setIndex(middleIndex);
    requestAnimationFrame(() => {
      scrollTo(middleIndex, false);
    });
  }, [i18n.language, middleIndex, scrollTo]);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [index, next]);


  return (
    <section id="student-services" className="w-full mx-auto flex flex-col items-center px-4 sm:px-6 py-16 bg-linear-to-b from-white to-gray-50">
      <Heading
        title={t("home:student_services_section.heading.title")}
        subtitle={t("home:student_services_section.heading.subtitle")}
      />

      {/* Slider */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        <div className={`flex gap-6 py-10`}>
          {looped.map((item, i) => {
            const isActive = i === index;

            return (
              <div
                key={i}
                className={`snap-center transition-transform duration-300
                  ${isActive ? "md:scale-110" : "scale-90 opacity-60"}
                `}
                style={{ width: CARD_WIDTH }}
              >
                <ServiceCard
                  maxWidth={CARD_WIDTH}
                  icon={item.icon}
                  title={t(`home:student_services_section.cards.${item.key}.title`)}
                  subtitle={t(`home:student_services_section.cards.${item.key}.subtitle`)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          size="md"
          onClick={prev}
          variant="outline"
          icon={isRTL ? <ChevronRight /> : <ChevronLeft />}
          iconInLeft
        >
          {t("buttons:previous")}
        </Button>
        <Button
          size="md"
          onClick={next}
          variant="outline"
          icon={isRTL ? <ChevronLeft /> : <ChevronRight />}
        >
          {t("buttons:next")}
        </Button>
      </div>
    </section>
  );
}

// ============================================================
// BEZMASAJIDLA.CZ — MATOUŠ SIGNATURE B2B CATERING FUNNEL (EN)
// Premium Corporate Sales Page & Conversion Engine
// Matouš Signature: from CZK 1,190 / person excl. VAT (12–80 guests)
// Staff, tableware and complete service included
// ============================================================

import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  UtensilsCrossed,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  Mail,
  ArrowRight,
  ChefHat,
  Leaf,
  Send,
  Calculator,
  Wine,
  Check,
  MapPin,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Camera,
  Eye,
  Menu,
  X,
} from "lucide-react";
import { trackCateringEvent } from "@/lib/cateringTracking";

// ── B2B Event Types ──────────────────────────────────────────
const EVENT_TYPES = [
  { id: "workshop", label: "Workshop" },
  { id: "board-lunch", label: "Board lunch" },
  { id: "client-raut", label: "Client buffet" },
  { id: "jina-akce", label: "Other event" },
] as const;

type EventTypeId = (typeof EVENT_TYPES)[number]["id"];

// ── Venue Types ──────────────────────────────────────────────
const VENUE_TYPES = [
  "Meeting room (no kitchen)",
  "Executive office / open space",
  "Conference / event hall",
  "Terrace / outdoor venue",
  "We are still looking for a suitable venue",
] as const;

const CATERING_HREFLANG = [
  { hreflang: "cs", href: "https://www.bezmasajidla.cz/catering" },
  { hreflang: "en", href: "https://www.bezmasajidla.cz/en/catering" },
  { hreflang: "x-default", href: "https://www.bezmasajidla.cz/catering" },
];

// ── Matouš portfolio gallery ─────────────────────────────────
type GalleryCategory = "raut" | "teple" | "tapas" | "dezerty" | "polevky";
type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  image: string;
  description: string;
};

const GALLERY_CATEGORIES = [
  { id: "all", label: "All dishes" },
  { id: "raut", label: "Buffet & fingerfood" },
  { id: "teple", label: "Hot courses" },
  { id: "tapas", label: "Starters & tapas" },
  { id: "dezerty", label: "Signature desserts" },
  { id: "polevky", label: "Soups & drinks" },
] as const;

const MATOUS_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "rostlinny-tatarak",
    title: "Signature plant-based tartare",
    category: "tapas",
    categoryLabel: "Starters & tapas",
    image: "/images/catering/matous-rostlinny-tatarak-toast.jpg",
    description: "Plant-based tartare with mustard seeds, fresh herbs, pearls and crispy sourdough toast.",
  },
  {
    id: "glazovany-steak",
    title: "Glazed steak on beetroot purée",
    category: "teple",
    categoryLabel: "Hot courses",
    image: "/images/catering/matous-glazovany-steak-repne-pyre.jpg",
    description: "A bold hot signature course with velvety beetroot purée, roasted vegetables and crispy shallots.",
  },
  {
    id: "mezze-labneh",
    title: "Creamy mezze with chickpeas",
    category: "tapas",
    categoryLabel: "Starters & tapas",
    image: "/images/catering/matous-mezze-labneh-cizrna.jpg",
    description: "Creamy base with marinated chickpeas, fresh pomegranate seeds, herbs and extra virgin olive oil.",
  },
  {
    id: "raut-kanapky",
    title: "Catering buffet platter",
    category: "raut",
    categoryLabel: "Buffet & fingerfood",
    image: "/images/catering/matous-cateringovy-raut-kanapky.jpg",
    description: "A colourful buffet with bruschetta, house-made spreads, marinated vegetables and seasonal toppings.",
  },
  {
    id: "seitanove-medailonky",
    title: "Seitan medallions with purée",
    category: "teple",
    categoryLabel: "Hot courses",
    image: "/images/catering/matous-seitanove-medailonky-kase.jpg",
    description: "Crispy medallions, delicate potato-parsnip purée and seasonal roasted vegetables in a contemporary presentation.",
  },
  {
    id: "seitan-dynovy-krem",
    title: "Seared seitan on pumpkin cream",
    category: "teple",
    categoryLabel: "Hot courses",
    image: "/images/catering/matous-seitan-dynovy-krem.jpg",
    description: "Juicy seitan on fragrant butternut squash cream with micro-greens and toasted pumpkin seeds.",
  },
  {
    id: "pecena-kukurice-kvetak",
    title: "Roasted baby corn and cauliflower",
    category: "teple",
    categoryLabel: "Hot courses",
    image: "/images/catering/matous-pecena-kukurice-kvetak-pyre.jpg",
    description: "Roasted baby corn and caramelized cauliflower on a smooth purée with a crisp seasonal salad.",
  },
  {
    id: "dezerty-violky",
    title: "Dessert jars with edible violets",
    category: "dezerty",
    categoryLabel: "Signature desserts",
    image: "/images/catering/matous-dezerty-violky-sklenicky.jpg",
    description: "Delicate vanilla bean cream in glass jars with dark chocolate crumble and fresh edible flowers.",
  },
  {
    id: "brownies-zmrzlina",
    title: "Dark brownies with fruit & ice cream",
    category: "dezerty",
    categoryLabel: "Signature desserts",
    image: "/images/catering/matous-brownies-zmrzlina-hruska.jpg",
    description: "Rich dark chocolate dessert made with premium cocoa, vanilla bean ice cream, poached pear and toasted seeds.",
  },
  {
    id: "brownies-raut",
    title: "Tasting brownies for buffet",
    category: "dezerty",
    categoryLabel: "Signature desserts",
    image: "/images/catering/matous-cokoladove-brownies-raut.jpg",
    description: "Bite-sized buffet portions of dark brownies with wild berries and a delicate cocoa glaze.",
  },
  {
    id: "peceny-syr",
    title: "Baked artisan cheese with seeds",
    category: "tapas",
    categoryLabel: "Starters & tapas",
    image: "/images/catering/matous-peceny-syr-hermelin.jpg",
    description: "Warm baked cheese with a crunchy pumpkin and sunflower seed crust, baby spinach and rustic bread.",
  },
  {
    id: "kulajda",
    title: "Traditional Bohemian kulajda soup",
    category: "polevky",
    categoryLabel: "Soups & drinks",
    image: "/images/catering/matous-staroceska-kulajda.jpg",
    description: "Creamy traditional kulajda soup with forest mushrooms, fresh dill, poached egg and a smooth sour cream finish.",
  },
  {
    id: "dynovy-krem",
    title: "Velvety butternut squash soup",
    category: "polevky",
    categoryLabel: "Soups & drinks",
    image: "/images/catering/matous-dynovy-krem-seminka.jpg",
    description: "Silky roasted butternut soup infused with coconut milk, toasted seeds and a splash of fresh lime.",
  },
  {
    id: "signature-drink",
    title: "Signature summer aperitif",
    category: "polevky",
    categoryLabel: "Soups & drinks",
    image: "/images/catering/matous-signature-letni-drink.jpg",
    description: "Bespoke zero-proof aperitif with fresh citrus, cape gooseberry, house syrup and a sprig of mountain lavender.",
  },
];

// ── Pricing Constants ────────────────────────────────────────
const SIGNATURE_PRICE_PER_PERSON = 1190;
const MIN_GUESTS = 12;
const MAX_SIGNATURE_GUESTS = 80;

export default function CateringPageEn() {
  // Navigation & Scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Form & Calculator State
  const [eventType, setEventType] = useState<EventTypeId>("client-raut");
  const [guestCount, setGuestCount] = useState<number>(25);
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("16:00 – 20:00");
  const [location, setLocation] = useState<string>("Prague 8");
  const [venueType, setVenueType] = useState<string>(VENUE_TYPES[0]);

  // Company & Contact State
  const [companyName, setCompanyName] = useState<string>("");
  const [ico, setIco] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("+420 ");

  // Diets & Add-ons State
  const [dietNotes, setDietNotes] = useState<string>("");
  const [addonTasting, setAddonTasting] = useState<boolean>(false);
  const [addonWine, setAddonWine] = useState<boolean>(false);
  const [addonLateService, setAddonLateService] = useState<boolean>(false);

  // Submission & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [leadCode, setLeadCode] = useState<string>("");
  const [mailStatus, setMailStatus] = useState<"sent" | "failed" | "not_configured" | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasStartedInquiry, setHasStartedInquiry] = useState(false);

  // Gallery state
  const [activeGalleryCategory, setActiveGalleryCategory] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const filteredGalleryItems =
    activeGalleryCategory === "all"
      ? MATOUS_GALLERY_ITEMS
      : MATOUS_GALLERY_ITEMS.filter((item) => item.category === activeGalleryCategory);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // UTM / Attribution tracking
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const trackedStep1Ref = useRef(false);
  const trackedStep2Ref = useRef(false);
  const trackedStep3Ref = useRef(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const search = new URLSearchParams(window.location.search);
    const attribution = {
      utmSource: search.get("utm_source") || "",
      utmMedium: search.get("utm_medium") || "",
      utmCampaign: search.get("utm_campaign") || "",
      gclid: search.get("gclid") || "",
      gbraid: search.get("gbraid") || "",
      wbraid: search.get("wbraid") || "",
    };
    setUtmParams(attribution);

    const pagePayload = {
      language: "en" as const,
      source_section: "page",
      packageId: "signature",
      packageName: "MATOUŠ SIGNATURE",
      ...attribution,
    };
    trackCateringEvent("catering_page_view", pagePayload);
    trackCateringEvent("catering_view", pagePayload);

    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isIndividualCalculation = guestCount > MAX_SIGNATURE_GUESTS;
  const estimatedTotal = isIndividualCalculation
    ? null
    : guestCount * SIGNATURE_PRICE_PER_PERSON;

  useEffect(() => {
    if (
      !trackedStep1Ref.current &&
      Boolean(eventDate) &&
      Boolean(eventTime.trim()) &&
      Boolean(location.trim()) &&
      Boolean(venueType)
    ) {
      trackedStep1Ref.current = true;
      trackCateringEvent("catering_form_step_1_complete", {
        language: "en",
        event_type: eventType,
        guest_count: guestCount,
        source_section: "calculator_form",
        ...utmParams,
      });
    }
  }, [eventDate, eventTime, location, venueType, eventType, guestCount, utmParams]);

  useEffect(() => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneDigits = phone.replace(/\D/g, "");
    if (
      !trackedStep2Ref.current &&
      Boolean(companyName.trim()) &&
      Boolean(contactPerson.trim()) &&
      validEmail &&
      phoneDigits.length >= 6
    ) {
      trackedStep2Ref.current = true;
      trackCateringEvent("catering_form_step_2_complete", {
        language: "en",
        event_type: eventType,
        guest_count: guestCount,
        source_section: "calculator_form",
        ...utmParams,
      });
    }
  }, [companyName, contactPerson, email, phone, eventType, guestCount, utmParams]);

  useEffect(() => {
    if (!lightboxItem || typeof document === "undefined") return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        lightboxRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || []
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setLightboxItem(null);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => getFocusable()[0]?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [lightboxItem]);

  const scrollToCalculator = (
    sourceSection = "page",
    intent: "calculator" | "date" = "calculator"
  ) => {
    trackCateringEvent(
      intent === "date" ? "catering_cta_date_click" : "catering_cta_calculator_click",
      {
        language: "en",
        event_type: eventType,
        guest_count: guestCount,
        source_section: sourceSection,
        ...utmParams,
      }
    );
    setMobileMenuOpen(false);
    const el = document.getElementById("kalkulacka");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormInteraction = () => {
    if (!hasStartedInquiry) {
      setHasStartedInquiry(true);
      const startPayload = {
        language: "en" as const,
        event_type: eventType,
        guest_count: guestCount,
        source_section: "calculator_form",
        packageId: "signature",
        packageName: "MATOUŠ SIGNATURE (EN)",
        guestCount,
        estimatedRevenue: estimatedTotal || 0,
        ...utmParams,
      };
      trackCateringEvent("catering_form_start", startPayload);
      trackCateringEvent("inquiry_started", startPayload);
    }
  };

  const handleGuestCountChange = (delta: number) => {
    handleFormInteraction();
    setGuestCount((prev) => Math.max(MIN_GUESTS, Math.min(250, prev + delta)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!trackedStep3Ref.current) {
      trackedStep3Ref.current = true;
      trackCateringEvent("catering_form_step_3_complete", {
        language: "en",
        event_type: eventType,
        guest_count: guestCount,
        source_section: "calculator_form",
        ...utmParams,
      });
    }
    trackCateringEvent("catering_form_submit_attempt", {
      language: "en",
      event_type: eventType,
      guest_count: guestCount,
      source_section: "calculator_form",
      ...utmParams,
    });

    setIsSubmitting(true);
    setServerError(null);

    const addonsList: string[] = [];
    if (addonWine) addonsList.push("Wine / craft alcohol");
    if (addonTasting) addonsList.push("Pre-event menu tasting");
    if (addonLateService) addonsList.push("Late service after 23:00");

    const calculatedRevenue = isIndividualCalculation ? 0 : guestCount * SIGNATURE_PRICE_PER_PERSON;

    const payload = {
      name: `${contactPerson}${companyName ? ` (${companyName})` : ""}`,
      companyName,
      ico,
      contactPerson,
      email,
      phone,
      guestCount,
      eventDate: eventDate || "To be arranged",
      eventTime,
      location,
      venueType,
      eventType: EVENT_TYPES.find((t) => t.id === eventType)?.label || eventType,
      dietNotes,
      addons: addonsList,
      notes: `[EN inquiry] Company: ${companyName || "N/A"}, Reg No: ${ico || "N/A"}, Event: ${eventType}, Venue: ${venueType}, Time: ${eventTime}, Location: ${location}. Diets: ${dietNotes || "none"}. Addons: ${addonsList.join(", ") || "none"}.`,
      packageId: "signature",
      packageName: "MATOUŠ SIGNATURE (EN)",
      includeDrinks: true,
      includeGlassware: true,
      includeStaff: true,
      estimatedRevenue: calculatedRevenue,
      ...utmParams,
    };

    try {
      const res = await fetch("/api/catering-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok || !data?.success || !data?.leadCode) {
        throw new Error(data?.error || "We could not save your inquiry securely. Please try again.");
      }

      const confirmedLeadCode = String(data.leadCode);
      setLeadCode(confirmedLeadCode);
      setMailStatus(data?.mailStatus || null);
      setSubmissionSuccess(true);

      trackCateringEvent("catering_form_submit_success", {
        language: "en",
        event_type: eventType,
        guest_count: guestCount,
        source_section: "calculator_form",
        leadCode: confirmedLeadCode,
        transaction_id: confirmedLeadCode,
        packageId: "signature",
        packageName: "MATOUŠ SIGNATURE (EN)",
        guestCount,
        value: 1,
        estimated_pipeline_value: calculatedRevenue,
        ...utmParams,
      });

      trackCateringEvent("inquiry_submitted", {
        leadCode: confirmedLeadCode,
        transaction_id: confirmedLeadCode,
        packageId: "signature",
        packageName: "MATOUŠ SIGNATURE (EN)",
        guestCount,
        value: 1,
        estimated_pipeline_value: calculatedRevenue,
        ...utmParams,
      });

      const el = document.getElementById("kalkulacka");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      trackCateringEvent("catering_form_submit_error", {
        language: "en",
        event_type: eventType,
        guest_count: guestCount,
        source_section: "calculator_form",
        error_kind: err instanceof Error ? "request_error" : "unknown_error",
        ...utmParams,
      });
      console.error("Inquiry submit error", err);
      setSubmissionSuccess(false);
      setLeadCode("");
      setMailStatus(null);
      setServerError(
        err instanceof Error
          ? err.message
          : "We could not send your inquiry. Please try again or reach out to us."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventLabel = EVENT_TYPES.find((t) => t.id === eventType)?.label || "Client buffet";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#FBF8F1] text-[#152018] font-sans selection:bg-[#E9B949]/30 selection:text-[#071710]">
      <SEOHead
        title="Corporate Catering Prague | Matouš Signature | BezmasáJídla"
        description="Premium meat-free corporate catering in Prague by Chef Matouš. Contemporary vegetarian menus for client buffets, workshops and board lunches. Full staff, tableware and transport included from CZK 1,190/person."
        ogType="website"
        ogUrl="https://www.bezmasajidla.cz/en/catering"
        ogImage="https://www.bezmasajidla.cz/images/catering/matous-catering-og.jpg"
        canonicalUrl="https://www.bezmasajidla.cz/en/catering"
        locale="en_US"
        hreflangAlternates={CATERING_HREFLANG}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Catering", url: "/en/catering" },
        ]}
      />

      {/* ── 1. STICKY PREMIUM HEADER ────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#071710]/95 backdrop-blur-md border-b border-white/10 text-white transition-all shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between flex-nowrap">
          {/* Logo — Always links to / */}
          <a
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B949] rounded-lg group"
            title="BezmasáJídla.cz — Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E9B949] flex items-center justify-center text-[#E9B949] shrink-0 group-hover:bg-[#E9B949]/10 transition-colors">
              <Leaf className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="leading-none">
              <span className="text-[14px] sm:text-[16px] tracking-[0.18em] font-bold uppercase text-white whitespace-nowrap">
                BezmasáJídla
              </span>
              <span className="hidden xl:block mt-0.5 text-[8px] tracking-[0.32em] font-medium uppercase text-stone-300">
                Catering
              </span>
            </div>
          </a>

          {/* Desktop Navigation (>= 1280px) */}
          <nav className="hidden xl:flex items-center gap-7 text-[13px] font-medium text-white/90">
            <a href="#proc-matous" className="hover:text-[#E9B949] transition-colors">For companies</a>
            <a href="#signature-menu" className="hover:text-[#E9B949] transition-colors">Signature</a>
            <a href="#kalkulacka" className="hover:text-[#E9B949] transition-colors">Calculator</a>
            <a href="#jak-to-funguje" className="hover:text-[#E9B949] transition-colors">How it works</a>
            <a href="#sef-kuchar" className="hover:text-[#E9B949] transition-colors">Chef Matouš</a>
            <a href="#galerie" className="hover:text-[#E9B949] transition-colors">Portfolio</a>
            <a href="#faq" className="hover:text-[#E9B949] transition-colors">FAQ</a>
          </nav>

          {/* Desktop Right CTAs (>= 1280px) */}
          <div className="hidden xl:flex items-center gap-4">
            <a
              href="/catering"
              onClick={() =>
                trackCateringEvent("catering_language_switch", {
                  language: "en",
                  source_section: "header",
                  target_language: "cz",
                  ...utmParams,
                })
              }
              className="text-[12px] font-semibold tracking-[0.16em] text-white/80 hover:text-[#E9B949] transition-colors"
            >
              CZ
            </a>
            <button
              onClick={() => scrollToCalculator("header", "date")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-[13px] shadow-[0_4px_15px_rgba(233,185,73,0.25)] transition-all cursor-pointer"
            >
              <span>Request a date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tablet & Mobile Right Controls (768–1199px tablet requirement: Single row, no wrap!) */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
            <a
              href="/catering"
              onClick={() =>
                trackCateringEvent("catering_language_switch", {
                  language: "en",
                  source_section: "header",
                  target_language: "cz",
                  ...utmParams,
                })
              }
              className="px-2 py-1 text-xs font-bold tracking-wider text-white/80 hover:text-[#E9B949] transition-colors"
            >
              CZ
            </a>
            <button
              onClick={() => scrollToCalculator("header", "date")}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#E9B949] hover:bg-[#F2C75C] text-[#071710] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              Request a date
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-white hover:text-[#E9B949] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mx-4 my-2 rounded-2xl border border-white/10 bg-[#071710]/98 backdrop-blur-xl px-6 py-6 shadow-2xl">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm font-medium text-stone-100">
              <a href="#proc-matous" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">For companies</a>
              <a href="#signature-menu" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Signature</a>
              <a href="#kalkulacka" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Calculator</a>
              <a href="#jak-to-funguje" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">How it works</a>
              <a href="#sef-kuchar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Chef Matouš</a>
              <a href="#galerie" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Portfolio</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">FAQ</a>
              <a
                href="/catering"
                onClick={() => {
                  trackCateringEvent("catering_language_switch", {
                    language: "en",
                    source_section: "header_drawer",
                    target_language: "cz",
                    ...utmParams,
                  });
                  setMobileMenuOpen(false);
                }}
                className="text-[#E9B949] font-bold"
              >
                Čeština (CZ)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO — DESKTOP / ULTRAWIDE & DEDICATED MOBILE ─────── */}
      <section className="relative overflow-hidden bg-[#071710] text-white border-b border-[#142C20]">
        
        {/* Desktop & Tablet Background / Image Layer anchored within max-w-[1440px] */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none">
          <div className="relative h-full max-w-[1440px] mx-auto overflow-hidden">
            {/* Matouš wide photo anchored to the right side of the 1440px frame */}
            <img
              src="/images/catering/matous-hero-wide-clean.jpg"
              alt="Chef Matouš — catering presentation"
              className="absolute inset-y-0 right-0 h-full w-auto max-w-[62%] xl:max-w-[58%] object-cover object-right select-none"
            />
            {/* Seamless left-to-right gradient within the 1440px container so the image blends into #071710 */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, #071710 0%, #071710 40%, rgba(7,23,16,0.95) 50%, rgba(7,23,16,0.30) 65%, rgba(7,23,16,0) 80%)",
              }}
            />
            {/* Bottom subtle gradient */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071710] to-transparent" />

            {/* Experience Floating Badge */}
            <div className="hidden xl:block absolute right-[18%] top-[56%] z-20 bg-[#FBF8F1]/95 text-[#152018] px-5 py-4 shadow-2xl rounded-sm border border-[#E9B949]/30">
              <div className="text-[10px] uppercase tracking-[0.25em] font-semibold leading-relaxed font-sans">
                Experience<br />from Norway,<br />Iceland<br />& New Zealand.
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP / TABLET HERO CONTENT (sm:block) ────────── */}
        <div className="hidden sm:flex relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-12 lg:pb-16 min-h-[660px] lg:min-h-[720px] flex-col justify-between">
          <div className="w-full sm:max-w-[520px] lg:max-w-[640px] xl:max-w-[680px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-xs tracking-[0.28em] uppercase font-semibold text-[#E9B949]">
              <span className="w-7 h-px bg-[#E9B949]" />
              <span>CORPORATE CATERING IN PRAGUE</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="mt-3 lg:mt-4 leading-[0.98]">
              <span className="block font-signature text-[32px] sm:text-[44px] lg:text-[50px] xl:text-[56px] text-[#E9B949] leading-tight">
                Matouš Signature
              </span>
              <span className="block font-editorial text-[38px] sm:text-[48px] lg:text-[58px] xl:text-[66px] font-semibold text-white leading-[1.02] tracking-tight mt-1">
                Corporate catering
              </span>
              <span className="block font-editorial text-[38px] sm:text-[52px] lg:text-[62px] xl:text-[70px] font-semibold text-[#E9B949] leading-[0.96] tracking-tight">
                meat-free.
              </span>
              <span className="block font-editorial text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[64px] font-semibold text-[#F2C75C] leading-[0.96] tracking-tight">
                Without compromise.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-6 max-w-xl text-[16px] sm:text-[18px] lg:text-[19px] leading-relaxed text-[#F8F5EE]/90 font-normal">
              Contemporary plant-forward gastronomy for companies that demand an exceptional culinary experience, flawless service, and transparent pricing.
            </p>

            {/* Desktop CTAs */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              <button
                onClick={() => scrollToCalculator("hero", "calculator")}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-[15px] shadow-[0_8px_25px_rgba(233,185,73,0.3)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Calculator className="w-5 h-5 text-[#071710]" />
                <span>CALCULATE EVENT</span>
                <ArrowRight className="w-4 h-4 text-[#071710]" />
              </button>
              <button
                onClick={() => scrollToCalculator("hero", "date")}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[#E9B949]/70 bg-[#0B241A]/70 hover:bg-[#103426] text-white font-semibold text-[14px] tracking-[0.05em] transition-colors cursor-pointer"
              >
                REQUEST A DATE
              </button>
            </div>
          </div>

          {/* Desktop Trust Bar under CTA */}
          <div className="pt-10 lg:pt-14 w-full lg:w-[65%] grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 text-[12px] sm:text-[13px] text-[#F8F5EE]/90 font-medium">
            <div className="flex items-center gap-2.5 pr-3">
              <MapPin className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Prague & surroundings</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-3 sm:border-l border-white/15">
              <Users className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>12–80 guests Signature</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-3 sm:border-l border-white/15">
              <Clock className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Reply within 24 hrs</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:pl-3 sm:border-l border-white/15">
              <FileText className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Corporate invoicing</span>
            </div>
          </div>
        </div>

        {/* ── DEDICATED MOBILE HERO (sm:hidden) ────────────────── */}
        <div className="sm:hidden relative z-10 px-5 pt-8 pb-10 flex flex-col min-h-[580px]">
          {/* Matouš photo in top-right with face fully visible and localized fade */}
          <div className="absolute top-4 right-[-10px] w-[180px] h-[230px] pointer-events-none overflow-hidden z-0">
            <img
              src="/images/catering/matous-chef-profil.jpg"
              alt="Chef Matouš"
              className="w-full h-full object-cover object-top rounded-bl-[36px] opacity-85 shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071710] via-[#071710]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071710] via-transparent to-transparent" />
          </div>

          {/* Left-aligned headline block strictly within safe width (no text over face) */}
          <div className="relative z-10 max-w-[210px]">
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#E9B949]">
              CORPORATE CATERING
            </div>
            <div className="font-signature text-[24px] text-[#E9B949] leading-tight mt-1">
              Matouš Signature
            </div>
            <div className="font-editorial text-[27px] font-semibold text-white leading-[1.02] tracking-tight mt-0.5">
              Corporate catering
            </div>
            <div className="font-editorial text-[29px] font-semibold text-[#E9B949] leading-[0.98] tracking-tight">
              meat-free.
            </div>
            <div className="font-editorial text-[25px] font-semibold text-[#F2C75C] leading-[0.98] tracking-tight">
              Without compromise.
            </div>
          </div>

          {/* Subtitle below photo fade */}
          <p className="relative z-10 mt-6 text-[14px] leading-relaxed text-[#F8F5EE]/90">
            Contemporary plant-forward gastronomy for companies. Exceptional culinary standard, full service included.
          </p>

          {/* Full-width Mobile CTAs */}
          <div className="relative z-10 mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => scrollToCalculator("hero", "calculator")}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] text-[#071710] font-bold text-[14px] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#071710]" />
              <span>CALCULATE EVENT</span>
              <ArrowRight className="w-4 h-4 text-[#071710]" />
            </button>
            <button
              onClick={() => scrollToCalculator("hero", "date")}
              className="w-full py-3.5 px-5 rounded-xl border border-[#E9B949]/70 bg-[#0B241A]/80 text-white font-semibold text-[13px] tracking-wide text-center cursor-pointer"
            >
              REQUEST A DATE
            </button>
          </div>

          {/* 2x2 Trust Grid on Mobile */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] text-[#F8F5EE]/90 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Prague & surroundings</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>12–80 guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Reply in 24 hrs</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Corporate invoice</span>
            </div>
          </div>
        </div>

      </section>

      {/* ── 3. BENEFIT STRIP POD HERO (WARM CREAM) ──────────────── */}
      <section id="proc-matous" className="bg-[#F7F2E8] border-b border-[#E8E2D5]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:pr-8">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Signature menu</div>
                <div className="text-[12px] text-stone-600">from seasonal ingredients</div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-[#E8E2D5]">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Service staff, tableware</div>
                <div className="text-[12px] text-stone-600">& transport included</div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-[#E8E2D5]">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Buffets, workshops</div>
                <div className="text-[12px] text-stone-600">& board lunches</div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 lg:py-6 lg:pl-8 lg:border-l border-[#E8E2D5]">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Meat-free, full flavour</div>
                <div className="text-[12px] text-stone-600">creative plant-forward cuisine</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. B2B CALCULATOR & INQUIRY FORM ─────────────────────── */}
      <section id="kalkulacka" className="py-14 lg:py-20 bg-[#FBF8F1] scroll-mt-20 border-b border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#177A55] block mb-1.5">
              Transparent corporate quote online
            </span>
            <h2 className="font-editorial text-[34px] sm:text-[44px] font-semibold tracking-[-0.02em] leading-tight text-[#152018]">
              Calculate your event
            </h2>
            <p className="text-stone-600 mt-2 text-[16px] sm:text-[17px]">
              Receive an indicative calculation online in 60 seconds.
            </p>
          </div>

          {/* Submission Success State */}
          {submissionSuccess ? (
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-emerald-200 max-w-3xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wider uppercase border border-emerald-200">
                  Inquiry successfully received
                </span>
                <h3 className="font-editorial text-3xl font-bold text-stone-900">
                  Thank you for your inquiry, {contactPerson}!
                </h3>
                <p className="text-stone-600 text-sm max-w-lg mx-auto">
                  We have registered your request. Within 24 hours, we will verify Chef Matouš's availability and send you a detailed itemized quote.
                </p>
              </div>

              <div className="bg-[#F7F2E8] border border-stone-200 rounded-2xl p-4 max-w-md mx-auto">
                <div className="text-xs text-stone-500 font-medium">Your inquiry reference code</div>
                <div className="font-mono text-xl font-bold text-emerald-900 tracking-wider mt-1">
                  #{leadCode}
                </div>
              </div>

              <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left border border-stone-200 text-sm space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Company:</span>
                  <span className="font-semibold text-stone-900">{companyName || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Event type:</span>
                  <span className="font-semibold text-stone-900">{selectedEventLabel}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Guest count:</span>
                  <span className="font-semibold text-stone-900">{guestCount} guests</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Date & time:</span>
                  <span className="font-semibold text-stone-900">
                    {eventDate || "To be arranged"} ({eventTime})
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500">Estimated budget:</span>
                  <span className="font-bold text-emerald-800">
                    {estimatedTotal
                      ? `CZK ${estimatedTotal.toLocaleString("en-US")} excl. VAT`
                      : "Custom production quote"}
                  </span>
                </div>
              </div>

              <div className="text-left max-w-lg mx-auto bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-5 space-y-2 text-xs text-emerald-950">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Next steps:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li>Within 24 hours we verify capacity for your chosen date.</li>
                  <li>We prepare a personalized menu proposal and itemized cost breakdown.</li>
                  {mailStatus === "sent" ? (
                    <li>A summary has been dispatched to <strong>{email}</strong>.</li>
                  ) : (
                    <li>Your inquiry is safely stored in our system. Email notification will follow shortly.</li>
                  )}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmissionSuccess(false)}
                  className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-900 text-sm font-semibold cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── Left Column: Form (7 cols) ───────────────────────── */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D5] space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: About the event */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0B241A] text-white font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h3 className="font-bold text-lg text-[#152018]">About the event</h3>
                    </div>

                    {/* Segmented controls for event type */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-stone-600">
                        Event type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EVENT_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              handleFormInteraction();
                              setEventType(type.id);
                            }}
                            className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center cursor-pointer ${
                              eventType === type.id
                                ? "bg-[#0B241A] border-[#0B241A] text-[#F8F5EE] shadow-sm"
                                : "bg-[#F7F2E8] border-stone-200 text-[#152018] hover:bg-[#EFEAE0]"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guest count stepper & slider */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-stone-600">
                          Number of guests
                        </label>
                        <span className="text-xs text-stone-500 font-medium">
                          Signature model: 12 to 80 guests
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(-5)}
                          className="w-11 h-11 rounded-xl border border-stone-200 bg-[#F7F2E8] text-[#152018] hover:bg-stone-200 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center py-2.5 bg-[#F7F2E8] border border-stone-200 rounded-xl font-bold text-[#152018] text-base">
                          {guestCount} guests
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(5)}
                          className="w-11 h-11 rounded-xl border border-stone-200 bg-[#F7F2E8] text-[#152018] hover:bg-stone-200 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min="12"
                        max="120"
                        step="1"
                        value={guestCount}
                        onChange={(e) => {
                          handleFormInteraction();
                          setGuestCount(Number(e.target.value));
                        }}
                        className="w-full accent-[#E9B949] cursor-pointer"
                      />

                      {guestCount > MAX_SIGNATURE_GUESTS && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            For events over 80 guests, we compile a tailored large-scale production plan, expanded staffing and a custom budget.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Event date
                        </label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => {
                            handleFormInteraction();
                            setEventDate(e.target.value);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Time
                        </label>
                        <div className="relative">
                          <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={eventTime}
                            onChange={(e) => {
                              handleFormInteraction();
                              setEventTime(e.target.value);
                            }}
                            placeholder="E.g. 16:00 – 20:00"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location & Venue type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => {
                              handleFormInteraction();
                              setLocation(e.target.value);
                            }}
                            placeholder="E.g. Prague 8 / Karlín / Company HQ"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Venue type
                        </label>
                        <select
                          value={venueType}
                          onChange={(e) => {
                            handleFormInteraction();
                            setVenueType(e.target.value);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        >
                          {VENUE_TYPES.map((vt) => (
                            <option key={vt} value={vt}>
                              {vt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Company & contact */}
                  <div className="space-y-4 pt-5 border-t border-[#E8E2D5]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0B241A] text-white font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h3 className="font-bold text-lg text-[#152018]">Company & contact</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Company name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => {
                            handleFormInteraction();
                            setCompanyName(e.target.value);
                          }}
                          placeholder="Your Company Ltd."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Tax ID / Reg. No. (optional)
                        </label>
                        <input
                          type="text"
                          value={ico}
                          onChange={(e) => {
                            handleFormInteraction();
                            setIco(e.target.value);
                          }}
                          placeholder="CZ12345678"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Contact person <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactPerson}
                          onChange={(e) => {
                            handleFormInteraction();
                            setContactPerson(e.target.value);
                          }}
                          placeholder="Jane Doe"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Work email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            handleFormInteraction();
                            setEmail(e.target.value);
                          }}
                          placeholder="jane.doe@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Phone number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          handleFormInteraction();
                          setPhone(e.target.value);
                        }}
                        placeholder="+420 XXX XXX XXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Step 3: Dietary requirements & add-ons */}
                  <div className="space-y-4 pt-5 border-t border-[#E8E2D5]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0B241A] text-white font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h3 className="font-bold text-lg text-[#152018]">Dietary needs & add-ons</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Dietary restrictions / allergies in the team (optional)
                      </label>
                      <input
                        type="text"
                        value={dietNotes}
                        onChange={(e) => {
                          handleFormInteraction();
                          setDietNotes(e.target.value);
                        }}
                        placeholder="E.g. 3× gluten-free, 2× nut allergy, 1× celiac..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="text-xs font-semibold text-stone-600">
                        Optional premium upgrades:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-[#F7F2E8] hover:bg-[#EFEAE0] cursor-pointer text-xs font-medium text-stone-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={addonTasting}
                            onChange={(e) => {
                              handleFormInteraction();
                              setAddonTasting(e.target.checked);
                            }}
                            className="rounded text-[#E9B949] focus:ring-[#E9B949] w-4 h-4 cursor-pointer"
                          />
                          <span>Pre-event tasting</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-[#F7F2E8] hover:bg-[#EFEAE0] cursor-pointer text-xs font-medium text-stone-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={addonWine}
                            onChange={(e) => {
                              handleFormInteraction();
                              setAddonWine(e.target.checked);
                            }}
                            className="rounded text-[#E9B949] focus:ring-[#E9B949] w-4 h-4 cursor-pointer"
                          />
                          <span>Wine / craft alcohol</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-[#F7F2E8] hover:bg-[#EFEAE0] cursor-pointer text-xs font-medium text-stone-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={addonLateService}
                            onChange={(e) => {
                              handleFormInteraction();
                              setAddonLateService(e.target.checked);
                            }}
                            className="rounded text-[#E9B949] focus:ring-[#E9B949] w-4 h-4 cursor-pointer"
                          />
                          <span>Service after 23:00</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {serverError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
                      {serverError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="space-y-3 pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F2C75C] via-[#E9B949] to-[#DFAC34] hover:from-[#F7D47C] hover:to-[#E9B949] text-[#071710] font-bold text-base shadow-xl shadow-[#E9B949]/20 transition-all transform active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 text-[#071710]" />
                      <span>{isSubmitting ? "Submitting inquiry..." : "SEND INQUIRY →"}</span>
                    </button>
                    <p className="text-center text-xs text-stone-500 leading-normal">
                      This is not a binding booking. Within 24 hours we verify date availability and send you an itemized quote.
                    </p>
                  </div>
                </form>
              </div>

              {/* ── Right Column: Sticky Live Summary Card (5 cols) ─── */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E8E2D5] divide-y divide-[#E8E2D5]">
                  
                  {/* Card Header with Signature Food Photo Thumbnail */}
                  <div className="relative bg-[#071710] text-white p-5">
                    <div className="flex items-center justify-between z-10 relative">
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#E9B949] block">
                          MATOUŠ SIGNATURE
                        </span>
                        <h4 className="font-editorial text-2xl font-bold text-white mt-0.5">
                          {selectedEventLabel}
                        </h4>
                      </div>
                      <div className="w-28 h-22 rounded-2xl overflow-hidden border border-[#E9B949]/50 shrink-0 shadow-lg">
                        <img
                          src="/images/catering/matous-glazovany-steak-repne-pyre.jpg"
                          alt="Glazed signature dish by Chef Matouš"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Parameters Summary */}
                  <div className="p-5 space-y-2.5 text-xs text-stone-700 bg-[#FAF8F5]">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span className="font-medium">
                        <strong>{guestCount}</strong> guests
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span>{eventDate ? new Date(eventDate).toLocaleDateString("en-US") : "To be arranged"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span>{location || "Prague & surroundings"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span>{eventTime || "Time to be arranged"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span className="truncate">{venueType}</span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-5 bg-white space-y-1">
                    {isIndividualCalculation ? (
                      <div>
                        <div className="font-editorial text-2xl font-bold text-[#152018]">
                          Custom production quote
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          For events over 80 guests we assemble bespoke logistics, crew and tailored pricing.
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <div className="font-editorial text-3xl font-bold text-[#152018]">
                            CZK 1,190{" "}
                            <span className="text-xs font-sans font-normal text-stone-500">
                              / person
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-[#177A55] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block mt-2">
                          Approx:{" "}
                          <span className="font-bold text-emerald-950">
                            CZK {estimatedTotal?.toLocaleString("en-US")} excl. VAT
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inclusions Checklist */}
                  <div className="p-5 space-y-3 bg-white text-xs">
                    <div className="font-bold tracking-wide uppercase text-[11px] text-stone-500">
                      Included in Signature:
                    </div>
                    <ul className="space-y-2 text-stone-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Signature menu crafted from seasonal ingredients</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Non-alcoholic bar (fresh herbal lemonades & infusions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Full professional service team throughout the event</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Chef on site for hot signature waves & finishing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Premium tableware (glassware, porcelain, cutlery)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Delivery and logistics across Prague</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Ongoing table clearing and final clean-up</span>
                      </li>
                    </ul>
                  </div>

                  {/* Synchronized Add-ons */}
                  <div className="p-5 bg-[#FAF8F5] space-y-2 text-xs text-stone-700">
                    <div className="font-bold tracking-wide uppercase text-[11px] text-stone-500">
                      Optional upgrades:
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonWine ? "bg-[#E9B949]" : "bg-stone-300"}`} />
                        <span className={addonWine ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Wine / craft alcohol
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonTasting ? "bg-[#E9B949]" : "bg-stone-300"}`} />
                        <span className={addonTasting ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Pre-event tasting
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonLateService ? "bg-[#E9B949]" : "bg-stone-300"}`} />
                        <span className={addonLateService ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Service after 23:00
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ── 5. PORTFOLIO GALLERY & ACTUAL EVENT DISHES ───────────── */}
      <section id="galerie" className="py-16 lg:py-24 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#177A55]/10 text-[#177A55] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Portfolio & Realizations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#152018]">
            Culinary Craft by Chef Matouš
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Explore authentic dishes, buffets, and plating from our plant-forward corporate caterings and tasting dinners.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveGalleryCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeGalleryCategory === cat.id
                    ? "bg-[#0B241A] text-white shadow-sm"
                    : "bg-[#F7F2E8] text-stone-700 hover:bg-[#EFEAE0]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 max-w-[1180px] mx-auto">
          {filteredGalleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                trackCateringEvent("catering_gallery_open", {
                  language: "en",
                  event_type: eventType,
                  guest_count: guestCount,
                  source_section: "gallery",
                  gallery_item: item.id,
                  ...utmParams,
                });
                setLightboxItem(item);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  trackCateringEvent("catering_gallery_open", {
                    language: "en",
                    event_type: eventType,
                    guest_count: guestCount,
                    source_section: "gallery",
                    gallery_item: item.id,
                    ...utmParams,
                  });
                  setLightboxItem(item);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open detail: ${item.title}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D5] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#152018] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  {item.categoryLabel}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/95 text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View dish</span>
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#177A55] transition-colors leading-snug mb-1 font-editorial">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#177A55] mt-3 inline-flex items-center gap-1">
                  ✨ Matouš × BezmasáJídla.cz
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catering-lightbox-title"
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-white/20 relative"
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-auto max-h-[65vh] object-contain"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-[#177A55] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {lightboxItem.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-400">Signature dish by Chef Matouš</span>
                </div>
                <h3 id="catering-lightbox-title" className="text-2xl font-bold text-stone-900 mb-2 font-editorial">
                  {lightboxItem.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  {lightboxItem.description}
                </p>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Interested in featuring this course at your event?</span>
                  <button
                    onClick={() => {
                      setLightboxItem(null);
                      scrollToCalculator("gallery_lightbox", "calculator");
                    }}
                    className="px-4 py-2 bg-[#0B241A] hover:bg-[#103426] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 6. HOW IT WORKS (3 STEPS) ───────────────────────────── */}
      <section id="jak-to-funguje" className="py-16 lg:py-24 bg-white border-y border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#177A55] block mb-2">
              Straightforward process
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#152018]">
              How it works
            </h2>
            <p className="text-stone-600 mt-2 text-base">
              From inquiry to a memorable corporate event in 3 clear steps. Zero stress, zero tableware worries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-3xl bg-[#F7F2E8] border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9B949] text-[#071710] font-bold text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-bold text-xl text-[#152018]">Send your inquiry</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Fill in the short online form in our calculator above. It takes exactly 60 seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F7F2E8] border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9B949] text-[#071710] font-bold text-lg flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-bold text-xl text-[#152018]">We prepare the proposal</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Within 24 hours we verify capacity and send you an itemized quote along with a curated menu proposal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F7F2E8] border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9B949] text-[#071710] font-bold text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-bold text-xl text-[#152018]">Enjoy your event</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We deliver tableware, food and the culinary crew. We manage table service, clearing and final clean-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SIGNATURE MENU BREAKDOWN ──────────────────────────── */}
      <section id="signature-menu" className="py-16 lg:py-24 bg-[#FBF8F1] border-b border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#177A55] block mb-2">
              Culinary experience
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#152018]">
              What Matouš Signature includes
            </h2>
            <p className="text-stone-600 mt-2 text-base">
              A balanced combination of finger food, hot signature courses, artisanal desserts and a zero-proof bar for CZK 1,190 / person excl. VAT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Course 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-[#177A55]" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Finger food & tapas</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                6 varieties of canapés, bruschetta and tartlets. Roasted root vegetables, almond ricotta, spiced hummus and smoked marinades.
              </p>
              <div className="text-[11px] font-semibold text-[#177A55] bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                Continuous cold buffet
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Hot signature courses</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                3 warm signature courses served in timed waves by the chef. Glazed plant steaks, silky pumpkin creams, crispy seitan and ragout.
              </p>
              <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                Chef live on site
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Artisanal desserts</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                2 varieties of delicate desserts served in jars with edible flowers and wild berries. Rich brownies, apricot mousse and praline.
              </p>
              <div className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md inline-block">
                Sweet grand finale
              </div>
            </div>

            {/* Course 4 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Wine className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Signature zero-proof bar</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                House-made botanical sodas, infused spring waters, artisan fruit juices, specialty batch-brew coffee and loose-leaf teas without limits.
              </p>
              <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                Unlimited beverages
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. CHEF MATOUŠ (AUTHORITY BLOCK) ─────────────────────── */}
      <section id="sef-kuchar" className="py-16 lg:py-24 bg-[#071710] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Chef Portrait */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                <img
                  src="/images/catering/matous-chef-profil.jpg"
                  alt="Chef Matouš in uniform"
                  className="w-full h-auto object-cover object-top"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#071710]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="font-signature text-2xl text-[#E9B949]">
                    Matouš
                  </div>
                  <div className="text-xs text-stone-300 font-sans">
                    Executive Chef & Author of Signature Catering
                  </div>
                </div>
              </div>
            </div>

            {/* Chef Story & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#E9B949] uppercase">
                <Award className="w-4 h-4 text-[#E9B949]" />
                <span>Culinary craftsmanship without compromise</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
                “Meat-free cuisine should never be a substitute. It is a complete culinary experience in its own right.”
              </h2>

              <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  My gastronomic path wound through kitchens in <strong>Norway, Iceland, and New Zealand</strong>. Working in Nordic and Pacific restaurants instilled a profound respect for purity of ingredients, wood smoke techniques, slow marinades, and the careful balancing of acid and texture.
                </p>
                <p>
                  With <strong>Matouš Signature</strong>, I bring this culinary perspective to corporate events. We never imitate meat with processed meat analogues. We work with honest root vegetables, fermentation, toasted nuts, fresh herbs and heritage legumes so that every course sparks lively conversation at the table.
                </p>
                <p className="text-[#E9B949] font-normal">
                  At each event, I personally oversee the warm waves and final service. Your colleagues and international clients will enjoy a dining experience they will talk about for weeks.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => scrollToCalculator("chef", "date")}
                  className="px-8 py-4 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-sm shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  Request a date with Chef Matouš →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 9. B2B FAQ ───────────────────────────────────────────── */}
      <section id="faq" className="py-16 lg:py-24 bg-white border-b border-[#E8E2D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#177A55] block mb-2">
              Event planners' guide
            </span>
            <h2 className="font-editorial text-3xl font-bold tracking-tight text-[#152018]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How far in advance should we secure our date?",
                a: "We recommend getting in touch 2 to 4 weeks before your event. For urgent requests within 7 days, please submit your inquiry through our calculator and we will promptly confirm crew and chef availability.",
              },
              {
                q: "How do you accommodate specific dietary needs (gluten-free, allergies, lactose)?",
                a: "All courses are prepared completely from scratch. Simply specify the count of gluten-free guests or nut/lactose intolerances in your inquiry. We provide equally stunning, tailored alternatives for those guests.",
              },
              {
                q: "What is genuinely included in the price of CZK 1,190 / person excl. VAT?",
                a: "The pricing is comprehensive: all food courses (6 finger food items, 3 warm signature waves, 2 desserts), unlimited zero-proof bar, full service staff, on-site chef, full tableware hire (porcelain plates, glassware, cutlery), delivery across Prague, and continuous clearing with final venue cleanup.",
              },
              {
                q: "How does corporate invoicing and payment work?",
                a: "We issue a standard tax invoice to your company ID / EU VAT number. Advance payment details, payment deadlines and terms are always clearly itemized in our written offer.",
              },
              {
                q: "What if our corporate gathering exceeds 80 guests?",
                a: "For events exceeding 80 guests, we bring an expanded culinary and hospitality crew and draft a large-scale logistics plan. Enter your guest number in the calculator and we will prepare a tailored corporate package.",
              },
            ].map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-[#E8E2D5] overflow-hidden bg-[#FAF8F5] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#152018] text-sm sm:text-base hover:text-[#177A55] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CONVERSION BANNER ──────────────────────────── */}
      <section className="py-16 lg:py-20 bg-[#071710] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#E9B949] block">
            Non-binding estimate in 60 seconds
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Treat your team to an experience they will truly remember.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-light">
            Matouš Signature is next-generation corporate catering. Plant-forward, uncompromising quality, and full service included.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToCalculator("final_cta", "calculator")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-base shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Calculate event online →
            </button>
            <button
              onClick={() => scrollToCalculator("final_cta", "date")}
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/20 text-stone-200 hover:text-white hover:bg-white/5 text-base font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#E9B949]" />
              <span>Request a date</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 11. FLOATING BACK-TO-TOP BUTTON ─────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#071710]/95 hover:bg-[#103426] text-[#E9B949] border border-[#E9B949]/50 shadow-2xl transition-all transform hover:scale-105 cursor-pointer backdrop-blur-sm"
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      <Footer />
    </div>
  );
}

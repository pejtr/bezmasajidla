// ============================================================
// BEZMASAJIDLA.CZ — MATOUŠ SIGNATURE B2B CATERING FUNNEL
// Premium Corporate Sales Page & Conversion Engine
// Matouš Signature: od CZK 1,190 / person bez DPH (12–80 guests)
// Obsluha, inventář a kompletní servis v ceně
// ============================================================

import { useState, useId, useEffect } from "react";
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
  ShieldCheck,
  Check,
  MapPin,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeCheck,
  Award,
  Globe2,
  HelpCircle,
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
  { id: "raut", label: "Raut & kanapky" },
  { id: "teple", label: "Hot courses" },
  { id: "tapas", label: "Starters & tapas" },
  { id: "dezerty", label: "Signature desserts" },
  { id: "polevky", label: "Soups & drinks" },
] as const;

const MATOUS_GALLERY_ITEMS: GalleryItem[] = [
  { id: "raut-kanapky", title: "Catering buffet platter", category: "raut", categoryLabel: "Raut & fingerfood", image: "/images/catering/matous-cateringovy-raut-kanapky.jpg", description: "A colourful buffet with bruschetta, house-made spreads, marinated vegetables and seasonal toppings." },
  { id: "rostlinny-tatarak", title: "Signature plant-based tartare", category: "tapas", categoryLabel: "Starters & tapas", image: "/images/catering/matous-rostlinny-tatarak-toast.jpg", description: "Plant-based tartare with mustard seeds, herbs, pearls and crisp bread." },
  { id: "glazovany-steak", title: "Glazed steak on beetroot purée", category: "teple", categoryLabel: "Hot courses", image: "/images/catering/matous-glazovany-steak-repne-pyre.jpg", description: "A bold hot signature course with beetroot purée, roasted vegetables and crispy onions." },
  { id: "mezze-labneh", title: "Creamy mezze with chickpeas", category: "tapas", categoryLabel: "Starters & tapas", image: "/images/catering/matous-mezze-labneh-cizrna.jpg", description: "Creamy base with chickpeas, pomegranate, herbs and olive oil." },
  { id: "seitanove-medailonky", title: "Seitan medallions with mash", category: "teple", categoryLabel: "Hot courses", image: "/images/catering/matous-seitanove-medailonky-kase.jpg", description: "Crisp medallions, smooth mash and seasonal vegetables in a modern Czech style." },
  { id: "seitan-dynovy-krem", title: "Seared seitan on pumpkin cream", category: "teple", categoryLabel: "Hot courses", image: "/images/catering/matous-seitan-dynovy-krem.jpg", description: "Juicy seitan on fragrant pumpkin cream with a fresh salad and toasted seeds." },
  { id: "pecena-kukurice-kvetak", title: "Roasted baby corn and cauliflower", category: "teple", categoryLabel: "Hot courses", image: "/images/catering/matous-pecena-kukurice-kvetak-pyre.jpg", description: "Roasted corn and cauliflower on a smooth purée with a fresh crunchy salad." },
  { id: "dezerty-violky", title: "Dessert jars with violets", category: "dezerty", categoryLabel: "Signature desserts", image: "/images/catering/matous-dezerty-violky-sklenicky.jpg", description: "Light cream in jars with chocolate crumble and edible flowers." },
  { id: "brownies-zmrzlina", title: "Brownies with fruit and ice cream", category: "dezerty", categoryLabel: "Signature desserts", image: "/images/catering/matous-brownies-zmrzlina-hruska.jpg", description: "Rich chocolate dessert with vanilla ice cream, fruit and toasted seeds." },
  { id: "brownies-raut", title: "Tasting brownies for a buffet", category: "dezerty", categoryLabel: "Signature desserts", image: "/images/catering/matous-cokoladove-brownies-raut.jpg", description: "Small buffet portions of brownies with fruit and cocoa sauce." },
  { id: "peceny-syr", title: "Baked cheese with seeds", category: "tapas", categoryLabel: "Starters & tapas", image: "/images/catering/matous-peceny-syr-hermelin.jpg", description: "Baked cheese with crunchy seeds, peppers, baby spinach and toasted bread." },
  { id: "kulajda", title: "Traditional Czech vegetarian kulajda", category: "polevky", categoryLabel: "Soups & drinks", image: "/images/catering/matous-staroceska-kulajda.jpg", description: "Creamy kulajda with mushrooms, dill, egg and a delicate cream finish." },
  { id: "dynovy-krem", title: "Velvety pumpkin soup", category: "polevky", categoryLabel: "Soups & drinks", image: "/images/catering/matous-dynovy-krem-seminka.jpg", description: "Thick pumpkin soup with toasted seeds and lime." },
  { id: "signature-drink", title: "Signature summer drink", category: "polevky", categoryLabel: "Soups & drinks", image: "/images/catering/matous-signature-letni-drink.jpg", description: "A signature alcohol-free aperitif with citrus, physalis and lavender." },
];

// ── Pricing Constants ────────────────────────────────────────
const SIGNATURE_PRICE_PER_PERSON = 1190;
const MIN_GUESTS = 12;
const MAX_SIGNATURE_GUESTS = 80;

export default function CateringPageEn() {
  // Navigation / Scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    trackCateringEvent("catering_view", {
      packageId: "signature",
      packageName: "MATOUŠ SIGNATURE",
    });

    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      setUtmParams({
        utmSource: search.get("utm_source") || "",
        utmMedium: search.get("utm_medium") || "",
        utmCampaign: search.get("utm_campaign") || "",
        gclid: search.get("gclid") || "",
        gbraid: search.get("gbraid") || "",
        wbraid: search.get("wbraid") || "",
      });
    }
  }, []);

  const isIndividualCalculation = guestCount > MAX_SIGNATURE_GUESTS;
  const estimatedTotal = isIndividualCalculation
    ? null
    : guestCount * SIGNATURE_PRICE_PER_PERSON;

  const scrollToCalculator = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById("kalkulacka");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormInteraction = () => {
    if (!hasStartedInquiry) {
      setHasStartedInquiry(true);
      trackCateringEvent("inquiry_started", {
        packageId: "signature",
        packageName: "MATOUŠ SIGNATURE",
        guestCount,
        estimatedRevenue: estimatedTotal || 0,
      });
    }
  };

  const handleGuestCountChange = (delta: number) => {
    handleFormInteraction();
    setGuestCount(prev => Math.max(MIN_GUESTS, Math.min(250, prev + delta)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    const addonsList: string[] = [];
    if (addonWine) addonsList.push("Wine / alcohol");
    if (addonTasting) addonsList.push("Pre-event tasting");
    if (addonLateService) addonsList.push("Servis po 23:00");

    const calculatedRevenue = isIndividualCalculation ? 0 : guestCount * SIGNATURE_PRICE_PER_PERSON;

    const payload = {
      name: `${contactPerson}${companyName ? ` (${companyName})` : ""}`,
      companyName,
      ico,
      contactPerson,
      email,
      phone,
      guestCount,
      eventDate: eventDate || "Dle dohody",
      eventTime,
      location,
      venueType,
      eventType: EVENT_TYPES.find(t => t.id === eventType)?.label || eventType,
      dietNotes,
      addons: addonsList,
      notes: `Company: ${companyName || "not provided"}, Company ID: ${ico || "not provided"}, Event type: ${eventType}, Venue type: ${venueType}, Time: ${eventTime}, Venue: ${location}. Dietary needs: ${dietNotes || "none"}. Extras: ${addonsList.join(", ") || "none"}.`,
      packageId: "signature",
      packageName: "MATOUŠ SIGNATURE",
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
        throw new Error(data?.error || "We could not save your enquiry safely.");
      }

      const confirmedLeadCode = String(data.leadCode);
      setLeadCode(confirmedLeadCode);
      setMailStatus(data?.mailStatus || null);
      setSubmissionSuccess(true);

      trackCateringEvent("inquiry_submitted", {
        leadCode: confirmedLeadCode,
        transaction_id: confirmedLeadCode,
        packageId: "signature",
        packageName: "MATOUŠ SIGNATURE",
        guestCount,
        value: 1,
        estimated_pipeline_value: calculatedRevenue,
        ...utmParams,
      });

      const el = document.getElementById("kalkulacka");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Inquiry submit error", err);
      setSubmissionSuccess(false);
      setLeadCode("");
      setMailStatus(null);
      setServerError(
        err instanceof Error
          ? err.message
          : "We could not send your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventLabel = EVENT_TYPES.find(t => t.id === eventType)?.label || "Client buffet";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#FDFCF8] text-stone-800 font-sans selection:bg-amber-200 selection:text-stone-900">
      <SEOHead
        title="Corporate catering Prague | Matouš Signature | BezmasáJídla"
        description="Corporate catering in Prague by chef Matouš. Signature meat-free menus for buffets, workshops and board lunches. Service, equipment and Prague delivery included in Signature from CZK 1,190 per person."
        ogType="website"
        ogUrl="https://www.bezmasajidla.cz/en/catering"
        ogImage="https://www.bezmasajidla.cz/images/catering/matous-catering-og.jpg"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Catering", url: "/en/catering" },
        ]}
      />

      {/* ── 1. PREMIUM CATERING HEADER — OVER HERO ──────────────── */}
      <header className="absolute inset-x-0 top-0 z-50 text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 lg:h-24 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-amber-400/70 flex items-center justify-center text-amber-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.35} />
            </div>
            <div className="leading-none">
              <div className="text-[12px] sm:text-[17px] tracking-[0.17em] sm:tracking-[0.24em] font-medium uppercase text-white">
                BezmasáJídla
              </div>
              <div className="mt-1 text-[7px] sm:mt-1.5 sm:text-[9px] tracking-[0.32em] sm:tracking-[0.38em] font-medium uppercase text-stone-300">
                Catering
              </div>
            </div>
          </a>

          <nav className="hidden xl:flex items-center gap-7 text-[12px] font-medium text-white/90">
            <a href="#proc-matous" className="hover:text-amber-300 transition-colors">For companies</a>
            <a href="#signature-menu" className="hover:text-amber-300 transition-colors">Signature</a>
            <a href="#kalkulacka" className="hover:text-amber-300 transition-colors">Calculator</a>
            <a href="#jak-to-funguje" className="hover:text-amber-300 transition-colors">How it works</a>
            <a href="#sef-kuchar" className="hover:text-amber-300 transition-colors">Matouš</a>
            <a href="#galerie" className="hover:text-amber-300 transition-colors">Gallery</a>
            <a href="#faq" className="hover:text-amber-300 transition-colors">FAQ</a>
          </nav>

          <div className="hidden xl:flex items-center gap-4">
            <a href="/catering" className="text-[11px] font-semibold tracking-[0.16em] text-white/75 hover:text-amber-300 transition-colors">CZ</a>
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-b from-[#FFD65A] to-[#F1B829] hover:from-[#FFE078] hover:to-[#F5C23E] text-[#142018] font-bold text-[13px] shadow-[0_8px_25px_rgba(0,0,0,.22)] transition-all"
            >
              Check availability
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute right-3 sm:right-5 top-5 flex xl:hidden items-center gap-1.5 sm:gap-3">
            <a href="/catering" className="px-2 py-2 text-[10px] font-bold tracking-[0.14em] text-white/80">CZ</a>
            <button
              onClick={scrollToCalculator}
              className="hidden sm:inline-flex px-3 sm:px-4 py-2 rounded-md bg-amber-400 text-stone-950 font-bold text-[11px] sm:text-xs"
            >
              <span className="sm:hidden">Enquire</span>
              <span className="hidden sm:inline">Check availability</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden mx-4 sm:ml-auto sm:mr-5 sm:w-[380px] rounded-2xl border border-white/10 bg-[#071710]/95 backdrop-blur-xl px-5 py-5 shadow-2xl">
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm text-stone-100">
              <a href="#proc-matous" onClick={() => setMobileMenuOpen(false)}>For companies</a>
              <a href="#signature-menu" onClick={() => setMobileMenuOpen(false)}>Signature</a>
              <a href="#kalkulacka" onClick={() => setMobileMenuOpen(false)}>Calculator</a>
              <a href="#jak-to-funguje" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#sef-kuchar" onClick={() => setMobileMenuOpen(false)}>Matouš</a>
              <a href="#galerie" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO — 1:1 PREMIUM COMPOSITION ───────────────────── */}
      <section className="relative overflow-hidden bg-[#071710] text-white min-h-[700px] sm:min-h-[690px] lg:min-h-[720px] border-b border-[#152b21]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative h-full max-w-[1440px] mx-auto">
            <img
              src="/images/catering/matous-hero-clean.jpg"
              alt=""
              aria-hidden="true"
              className="absolute sm:hidden top-0 right-[-76px] h-[470px] w-auto max-w-none object-contain opacity-70"
            />
            <img
              src="/images/catering/matous-hero-wide-clean.jpg"
              alt=""
              aria-hidden="true"
              className="hidden sm:block absolute inset-y-0 right-0 h-full w-auto max-w-none object-contain object-right opacity-75 lg:opacity-100"
            />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none sm:hidden bg-[linear-gradient(90deg,#071710_0%,rgba(7,23,16,.98)_52%,rgba(7,23,16,.72)_74%,rgba(7,23,16,.18)_100%)]" />
        <div
          className="hidden sm:block absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #071710 0%, #071710 41%, rgba(7,23,16,.90) 50%, rgba(7,23,16,.30) 63%, rgba(7,23,16,0) 76%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071710]/20 via-transparent to-[#071710]/10 pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-36 pb-10 min-h-[700px] sm:min-h-[690px] lg:min-h-[720px] flex flex-col">
          <div className="w-full max-w-[290px] sm:max-w-[490px] lg:max-w-none lg:w-[56%] xl:w-[49%]">
            <div className="flex items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[12px] tracking-[0.28em] sm:tracking-[0.40em] uppercase font-medium text-amber-300">
              <span className="w-7 h-px bg-amber-400/80" />
              <span>Corporate catering in Prague</span>
            </div>

            <h1 className="mt-4 sm:mt-5 leading-[0.98]">
              <span
                className="block text-[27px] sm:text-[46px] lg:text-[48px] xl:text-[58px] leading-[1.05] font-light tracking-[-0.02em] text-[#E3C07A]"
                style={{ fontFamily: '"Segoe Script", "Brush Script MT", cursive' }}
              >
                Matouš Signature
              </span>
              <span className="block mt-1 font-serif text-[30px] sm:text-[47px] lg:text-[50px] xl:text-[64px] leading-[0.98] tracking-[-0.03em] font-semibold text-white">
                Corporate catering
              </span>
              <span className="block mt-1 font-serif text-[36px] sm:text-[52px] lg:text-[56px] xl:text-[68px] leading-[0.96] tracking-[-0.035em] font-semibold text-amber-300">
                meat-free.
              </span>
              <span className="block font-serif text-[32px] sm:text-[50px] lg:text-[54px] xl:text-[68px] leading-[0.96] tracking-[-0.035em] font-semibold text-amber-300">
                No compromises.
              </span>
            </h1>

            <p className="mt-5 sm:mt-6 max-w-[330px] sm:max-w-xl text-[15px] sm:text-[18px] lg:text-[20px] leading-relaxed text-stone-100/90 font-light">
              Modern vegetarian gastronomy for companies that want a memorable experience, professional service and a transparent budget.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center gap-3 min-w-[218px] px-7 py-4 rounded-md bg-gradient-to-b from-[#FFD65A] to-[#F2B92B] hover:from-[#FFE078] hover:to-[#F7C542] text-[#122019] font-bold text-[15px] shadow-[0_12px_30px_rgba(0,0,0,.28)] transition-all"
              >
                <Calculator className="w-5 h-5" />
                CALCULATE EVENT
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center min-w-[176px] px-7 py-4 rounded-md border border-amber-300/80 bg-[#0b2018]/60 text-white font-semibold text-[14px] tracking-[0.08em] hover:bg-[#173528]/80 transition-colors"
              >
                CHECK AVAILABILITY
              </button>
            </div>
          </div>

          <div className="mt-auto pt-8 lg:pt-12 w-full lg:w-[55%] grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-[11px] sm:text-[12px] text-stone-100">
            <div className="flex items-center gap-2.5 pr-4">
              <MapPin className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>Prague and surroundings</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-4 sm:border-l border-white/15">
              <Users className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>12–80 guests Signature</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-4 sm:border-l border-white/15">
              <Clock className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>Reply within 24 h</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:pl-4 sm:border-l border-white/15">
              <FileText className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>Business invoicing</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute inset-0 pointer-events-none">
          <div className="relative h-full max-w-[1440px] mx-auto">
            <div className="absolute right-[20%] top-[58%] z-20 bg-white/92 backdrop-blur-sm text-[#152018] px-5 py-4 shadow-xl">
              <div className="text-[10px] uppercase tracking-[0.28em] leading-relaxed">
                Experience<br />from Norway,<br />Iceland<br />and New Zealand.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. VALUE STRIP — COMPACT LIKE REFERENCE ─────────────── */}
      <section id="proc-matous" className="bg-[#F7F3E9] border-b border-stone-200">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:pr-8">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Signature menu</div>
                <div className="text-[12px] text-stone-600">from quality ingredients</div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-stone-300/80">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Service team & equipment</div>
                <div className="text-[12px] text-stone-600">and delivery included in Signature</div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-stone-300/80">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Corporate buffets & workshops</div>
                <div className="text-[12px] text-stone-600">and board lunches</div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:pl-8 lg:border-l border-stone-300/80">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Meat-free, full of flavour</div>
                <div className="text-[12px] text-stone-600">modern vegetarian menu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. INTERACTIVE B2B CALCULATOR & FORM + STICKY CARD ────── */}
      <section id="kalkulacka" className="py-14 lg:py-20 bg-[#F4F1EA]/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-8">
            <h2 className="font-serif text-[38px] sm:text-[46px] font-semibold tracking-[-0.025em] leading-tight text-[#171d19]">
              Calculate your event
            </h2>
            <p className="text-stone-600 mt-2 text-[17px]">
              Get an indicative quote online in 60 seconds.
            </p>
          </div>

          {/* If form already successfully submitted, show rich confirmation */}
          {submissionSuccess ? (
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-emerald-200 max-w-3xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wider uppercase border border-emerald-200">
                  Enquiry received
                </span>
                <h3 className="font-serif text-3xl font-bold text-stone-900">
                  Thank you for your enquiry, {contactPerson}!
                </h3>
                <p className="text-stone-600 text-sm max-w-lg mx-auto">
                  We have recorded your request. Within 24 hours we will confirm chef Matouš's availability and send you a detailed itemised quote.
                </p>
              </div>

              {/* Lead Code Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 max-w-md mx-auto">
                <div className="text-xs text-stone-500 font-medium">Your enquiry code</div>
                <div className="font-mono text-xl font-bold text-emerald-900 tracking-wider mt-1">
                  #{leadCode}
                </div>
              </div>

              {/* Summary Table */}
              <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left border border-stone-200 text-sm space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Company:</span>
                  <span className="font-semibold text-stone-900">{companyName || "not provided"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Event type:</span>
                  <span className="font-semibold text-stone-900">{selectedEventLabel}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Guest count:</span>
                  <span className="font-semibold text-stone-900">{guestCount} osob</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Date and time:</span>
                  <span className="font-semibold text-stone-900">
                    {eventDate || "Dle dohody"} ({eventTime})
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500">Indicative budget estimate:</span>
                  <span className="font-bold text-emerald-800">
                    {estimatedTotal
                      ? `${estimatedTotal.toLocaleString("en-GB")} CZK excl. VAT`
                      : "Custom quote"}
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="text-left max-w-lg mx-auto bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-5 space-y-2 text-xs text-emerald-950">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>What happens next:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li>Within 24 hours we will confirm availability for your date.</li>
                  <li>We will prepare a specific menu proposal and price quote.</li>
                  {mailStatus === "sent" ? (
                    <li>We sent an enquiry summary to <strong>{email}</strong>.</li>
                  ) : (
                    <li>Your enquiry is safely stored. The email confirmation has not been sent yet.</li>
                  )}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmissionSuccess(false)}
                  className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-900 text-sm font-semibold"
                >
                  Submit another enquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── Left Column: 3 Clean Form Steps (7 Cols) ────────── */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: O akci */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h3 className="font-bold text-lg text-stone-900">Event details</h3>
                    </div>

                    {/* Event type pills */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-stone-600">
                        Event type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EVENT_TYPES.map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              handleFormInteraction();
                              setEventType(type.id);
                            }}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                              eventType === type.id
                                ? "bg-stone-900 border-stone-900 text-white shadow-sm"
                                : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Number of guests stepper & slider */}
                    <div className="space-y-2">
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
                          className="w-11 h-11 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base">
                          {guestCount} guests
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(5)}
                          className="w-11 h-11 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Range slider for smooth adjustment */}
                      <input
                        type="range"
                        min="12"
                        max="120"
                        step="1"
                        value={guestCount}
                        onChange={e => {
                          handleFormInteraction();
                          setGuestCount(Number(e.target.value));
                        }}
                        className="w-full accent-amber-500 cursor-pointer"
                      />

                      {guestCount > MAX_SIGNATURE_GUESTS && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            For events above 80 guests we create a custom production plan, staffing plan and quote.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Datum & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Event date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={eventDate}
                            onChange={e => {
                              handleFormInteraction();
                              setEventDate(e.target.value);
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                          />
                        </div>
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
                            onChange={e => {
                              handleFormInteraction();
                              setEventTime(e.target.value);
                            }}
                            placeholder="e.g. 16:00 – 20:00"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Venue & Venue type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Venue
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={location}
                            onChange={e => {
                              handleFormInteraction();
                              setLocation(e.target.value);
                            }}
                            placeholder="e.g. Prague 8 / Karlín / Company HQ"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Venue type
                        </label>
                        <select
                          value={venueType}
                          onChange={e => {
                            handleFormInteraction();
                            setVenueType(e.target.value);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        >
                          {VENUE_TYPES.map(vt => (
                            <option key={vt} value={vt}>
                              {vt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Company & contact */}
                  <div className="space-y-4 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h3 className="font-bold text-lg text-stone-900">Company & contact</h3>
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
                          onChange={e => {
                            handleFormInteraction();
                            setCompanyName(e.target.value);
                          }}
                          placeholder="Your Company Ltd."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Company ID (optional)
                        </label>
                        <input
                          type="text"
                          value={ico}
                          onChange={e => {
                            handleFormInteraction();
                            setIco(e.target.value);
                          }}
                          placeholder="12345678"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
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
                          onChange={e => {
                            handleFormInteraction();
                            setContactPerson(e.target.value);
                          }}
                          placeholder="John Smith"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
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
                          onChange={e => {
                            handleFormInteraction();
                            setEmail(e.target.value);
                          }}
                          placeholder="john.smith@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => {
                            handleFormInteraction();
                            setPhone(e.target.value);
                          }}
                          placeholder="+420 XXX XXX XXX"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Dietary needs & extras */}
                  <div className="space-y-4 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h3 className="font-bold text-lg text-stone-900">Dietary needs & extras</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Dietary needs / allergies (optional)
                      </label>
                      <input
                        type="text"
                        value={dietNotes}
                        onChange={e => {
                          handleFormInteraction();
                          setDietNotes(e.target.value);
                        }}
                        placeholder="e.g. 3× gluten-free, 2× nut-free, 1× coeliac..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="text-xs font-semibold text-stone-600">
                        Optional premium extras:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 cursor-pointer text-xs font-medium text-stone-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={addonTasting}
                            onChange={e => {
                              handleFormInteraction();
                              setAddonTasting(e.target.checked);
                            }}
                            className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                          />
                          <span>Pre-event tasting</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 cursor-pointer text-xs font-medium text-stone-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={addonWine}
                            onChange={e => {
                              handleFormInteraction();
                              setAddonWine(e.target.checked);
                            }}
                            className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                          />
                          <span>Wine / alcohol</span>
                        </label>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 cursor-pointer text-xs font-medium text-stone-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={addonLateService}
                            onChange={e => {
                              handleFormInteraction();
                              setAddonLateService(e.target.checked);
                            }}
                            className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                          />
                          <span>Servis po 23:00</span>
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
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-900/10 hover:shadow-amber-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 text-stone-900" />
                      <span>{isSubmitting ? "Sending enquiry..." : "SEND ENQUIRY →"}</span>
                    </button>
                    <p className="text-center text-xs text-stone-500 leading-normal">
                      This is not a confirmed booking. Within 24 hours we will verify availability and send you an itemised quote.
                    </p>
                  </div>
                </form>
              </div>

              {/* ── Right Column: Sticky Live Summary Card (5 Cols) ─── */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 divide-y divide-stone-100">
                  
                  {/* Card Header with Canapés Image Thumbnail */}
                  <div className="relative bg-[#0F261E] text-white p-5">
                    <div className="flex items-center justify-between z-10 relative">
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-400 block">
                          MATOUŠ SIGNATURE
                        </span>
                        <h4 className="font-serif text-xl font-bold text-white mt-0.5">
                          {selectedEventLabel}
                        </h4>
                      </div>
                      <div className="w-28 h-24 rounded-2xl overflow-hidden border border-amber-400/40 shrink-0 shadow-lg">
                        <img
                          src="/images/catering/matous-glazovany-steak-repne-pyre.jpg"
                          alt="Matouš glazed signature course"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Parameters Summary */}
                  <div className="p-5 space-y-2.5 text-xs text-stone-700 bg-[#FAF8F5]">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-medium">
                        <strong>{guestCount}</strong> guests
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{eventDate ? new Date(eventDate).toLocaleDateString("en-GB") : "Date to be agreed"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{location || "Prague and surroundings"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{eventTime || "Time to be agreed"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="truncate">{venueType}</span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-5 bg-white space-y-1">
                    {isIndividualCalculation ? (
                      <div>
                        <div className="font-serif text-2xl font-bold text-stone-900">
                          Custom budget
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          For more than 80 guests we prepare a tailored large-event quote.
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                            CZK 1,190{" "}
                            <span className="text-xs font-sans font-normal text-stone-500">
                              / person
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block mt-1.5">
                          Estimated:{" "}
                          <span className="font-bold text-emerald-900">
                            {estimatedTotal?.toLocaleString("en-GB")} CZK excl. VAT
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inclusions Checklist */}
                  <div className="p-5 space-y-3 bg-white text-xs">
                    <div className="font-bold text-stone-900 tracking-wide uppercase text-[11px] text-stone-500">
                      Included in Signature:
                    </div>
                    <ul className="space-y-2 text-stone-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Signature menu from seasonal ingredients</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Alcohol-free drinks (house lemonades & infusions)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Full service team throughout the event</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Chef for hot service waves & final plating</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Premium equipment (glassware, porcelain, cutlery)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Doprava a logistika po Praze</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>Continuous clearing and final clean-up</span>
                      </li>
                    </ul>
                  </div>

                  {/* Synchronized Add-ons */}
                  <div className="p-5 bg-stone-50/60 space-y-2.5 text-xs text-stone-700">
                    <div className="font-bold text-stone-900 tracking-wide uppercase text-[11px] text-stone-500">
                      Optional extras:
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonWine ? "bg-amber-500" : "bg-stone-300"}`} />
                        <span className={addonWine ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Wine / alcohol
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonTasting ? "bg-amber-500" : "bg-stone-300"}`} />
                        <span className={addonTasting ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Pre-event tasting
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonLateService ? "bg-amber-500" : "bg-stone-300"}`} />
                        <span className={addonLateService ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Servis po 23:00
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

        {/* Section: Autorská Galerie & Skutečné Realizace Šéfkuchaře Matouše */}
        <section id="galerie" className="mb-20 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100/60 text-[#4A7C59] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Portfolio & Realizace</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#1C2826] font-serif">
              Chef Matouš's signature creations
            </h2>
            <p className="text-sm text-[#5A685D] mt-2">
              Explore real dishes, buffets and plating from our meat-free catering events and tastings.
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveGalleryCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeGalleryCategory === cat.id
                      ? "bg-[#4A7C59] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                onClick={() => setLightboxItem(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#1C2826] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    {item.categoryLabel}
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/95 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View detail</span>
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#4A7C59] transition-colors leading-snug mb-1 font-serif">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#4A7C59] mt-3 inline-flex items-center gap-1">
                    ✨ Matouš × BezmasáJídla.cz
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {lightboxItem && (
            <div
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-white/20 relative"
              >
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
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
                    <span className="bg-emerald-100 text-[#4A7C59] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {lightboxItem.categoryLabel}
                    </span>
                    <span className="text-xs text-gray-400">Chef Matouš's signature creations</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
                    {lightboxItem.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {lightboxItem.description}
                  </p>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Would you like this dish at your event?</span>
                    <a
                      href="#kalkulacka"
                      onClick={() => setLightboxItem(null)}
                      className="px-4 py-2 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Go to calculator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>



      {/* ── 6. JAK TO FUNGUJE (3 KROKY) ─────────────────────────── */}
      <section id="jak-to-funguje" className="py-16 lg:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              How it works
            </h2>
            <p className="text-stone-600 mt-2 text-base">
              From enquiry to a successful event in 3 steps. No stress, no equipment worries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-bold text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-bold text-xl text-stone-900">Send an enquiry</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Complete the short online form in the calculator above. It takes about one minute.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-bold text-lg flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-bold text-xl text-stone-900">We prepare the proposal</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Within 24 hours we verify availability and send you a detailed itemised quote and menu composition.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-bold text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-bold text-xl text-stone-900">Enjoy your event</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We bring the equipment, food and chef. We take care of service, clearing and final clean-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SIGNATURE MENU BREAKDOWN ──────────────────────────── */}
      <section id="signature-menu" className="py-16 lg:py-24 bg-[#F4F1EA]/50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800 block mb-2">
              Experience-led gastronomy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              What Matouš Signature includes
            </h2>
            <p className="text-stone-600 mt-2 text-base">
              A balanced combination of finger food, hot signature waves, desserts and an alcohol-free bar for CZK 1,190 per person excl. VAT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Chod 1: Studený Finger Food */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Finger food & tapas</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Six types of signature canapés, bruschetta and tartlets. Roasted root vegetables, almond ricotta, hummus and smoked marinades.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                Continuous cold buffet
              </div>
            </div>

            {/* Chod 2: Teplé Signature Vlny */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Hot signature courses</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Three hot courses served by the chef in timed waves. Glazed vegetable steak, smooth pumpkin purées, crispy tempeh and ragout.
              </p>
              <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                Chef on site
              </div>
            </div>

            {/* Chod 3: Autorské Dezerty */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Signature desserts</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Two delicate desserts in jars with edible flowers and forest berries. Cocoa brownies, apricot mousse and nut praline.
              </p>
              <div className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md inline-block">
                Sweet finish
              </div>
            </div>

            {/* Chod 4: Signature Nealko Bar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/90 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Wine className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Signature nealko bar</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fresh herb lemonades, infused spring water, craft juices, specialty filter coffee and loose-leaf teas in unlimited quantities.
              </p>
              <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                Alcohol-free drinks included
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. ŠÉFKUCHAŘ MATOUŠ (AUTHORITY BLOCK) ────────────────── */}
      <section id="sef-kuchar" className="py-16 lg:py-24 bg-[#0B1E17] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Chef Portrait */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-800/40 relative">
                <img
                  src="/images/catering/matous-chef-profil.jpg"
                  alt="Chef Matouš in chef whites"
                  className="w-full h-auto object-cover object-top"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-stone-950/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="font-serif italic text-lg text-amber-300">
                    Matouš
                  </div>
                  <div className="text-xs text-stone-300">
                    Chef & creator of Signature catering
                  </div>
                </div>
              </div>
            </div>

            {/* Chef Story & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Craftsmanship without compromise</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight">
                “Meat-free food does not have to be a substitute. It can be a complete culinary experience.”
              </h2>

              <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  My culinary journey has taken me through kitchens in <strong>Norway, Iceland and New Zealand</strong>. In Nordic and Pacific restaurants I learned a deep respect for ingredient purity, smoke techniques, marination and balancing acidity and texture.
                </p>
                <p>
                  In <strong>Matouš Signature</strong> I bring that experience into corporate catering. We do not try to imitate meat with processed substitutes. We work with honest root vegetables, fermentation, nuts, herbs and legumes so that every course sparks conversation and excitement at the table.
                </p>
                <p className="text-amber-300 font-normal">
                  At every event I personally oversee the hot service waves and final presentation. Your colleagues and clients will have an experience people will still be talking about the following week.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={scrollToCalculator}
                  className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-lg transition-colors"
                >
                  Check a date with Matouš →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 9. B2B FAQ ───────────────────────────────────────────── */}
      <section id="faq" className="py-16 lg:py-24 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800 block mb-2">
              Answers for event organisers
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How far in advance should we enquire?",
                a: "Ideally, enquire 2 to 4 weeks in advance. For urgent dates within a week, send the form and we will check whether production can be arranged.",
              },
              {
                q: "How do you handle specific allergies and diets (gluten, nuts, lactose)?",
                a: "All dishes are prepared fresh and in-house. Just tell us how many guests require gluten-free food, have nut allergies or other intolerances. We prepare complete alternatives that are comparable in both presentation and flavour.",
              },
              {
                q: "What is actually included in CZK 1,190 per person excl. VAT?",
                a: "The Signature price is all-inclusive: complete food service (finger food, 3 hot waves, 2 desserts), an alcohol-free bar throughout the event, service staff, chef, full equipment hire (plates, glassware and cutlery), delivery within Prague, continuous clearing and final clean-up.",
              },
              {
                q: "How do invoicing and payment terms work for corporate clients?",
                a: "We issue a standard tax invoice to your company. The deposit amount, due date and payment terms are always specified in the proposal for your event.",
              },
              {
                q: "What if our event has more than 80 guests?",
                a: "For events above 80 guests we add an expanded kitchen and service team and create a custom large-scale logistics plan. Enter the real guest count in the calculator and we will prepare a tailored quote.",
              },
            ].map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-200/90 overflow-hidden bg-[#FAF8F5] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-stone-900 text-sm sm:text-base hover:text-emerald-800"
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
      <section className="py-16 bg-[#0F261E] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 block">
            Indicative quote in 60 seconds
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Create an experience your team will remember.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
            Matouš Signature is next-generation corporate catering. Meat-free, uncompromising, with full service included.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCalculator}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-base shadow-xl transition-all transform active:scale-95"
            >
              Calculate your event online →
            </button>
            <button
              onClick={scrollToCalculator}
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-emerald-700 text-stone-200 hover:text-white hover:bg-emerald-900/40 text-base font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Check availability</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

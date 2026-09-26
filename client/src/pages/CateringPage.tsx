// ============================================================
// BEZMASAJIDLA.CZ — MATOUŠ SIGNATURE B2B CATERING FUNNEL
// Premium Corporate Sales Page & Conversion Engine
// Matouš Signature: od 1 190 Kč / osoba bez DPH (12–80 hostů)
// Obsluha, inventář a kompletní servis v ceně
// ============================================================

import { useState, useEffect } from "react";
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
  { id: "client-raut", label: "Client raut" },
  { id: "jina-akce", label: "Jiná akce" },
] as const;

type EventTypeId = (typeof EVENT_TYPES)[number]["id"];

// ── Venue Types ──────────────────────────────────────────────
const VENUE_TYPES = [
  "Meeting room (bez kuchyně)",
  "Reprezentativní kancelář / open-space",
  "Konferenční / Eventový sál",
  "Terasa / Venkovní prostor",
  "Zatím hledáme vhodné prostory",
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
  { id: "all", label: "Všechny ukázky" },
  { id: "raut", label: "Raut & kanapky" },
  { id: "teple", label: "Teplé chody" },
  { id: "tapas", label: "Předkrmy & tapas" },
  { id: "dezerty", label: "Autorské dezerty" },
  { id: "polevky", label: "Polévky & nápoje" },
] as const;

const MATOUS_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "raut-kanapky",
    title: "Cateringový rautový podnos",
    category: "raut",
    categoryLabel: "Raut & fingerfood",
    image: "/images/catering/matous-cateringovy-raut-kanapky.jpg",
    description: "Pestrý raut s bruschettami, domácími pomazánkami, marinovanou zeleninou a sezónními toppingy.",
  },
  {
    id: "rostlinny-tatarak",
    title: "Autorský rostlinný tatarák",
    category: "tapas",
    categoryLabel: "Předkrmy & tapas",
    image: "/images/catering/matous-rostlinny-tatarak-toast.jpg",
    description: "Rostlinný tatarák s hořčičným semínkem, bylinkami, perličkami a křupavým kváskovým chlebem.",
  },
  {
    id: "glazovany-steak",
    title: "Glazovaný steak na řepném pyré",
    category: "teple",
    categoryLabel: "Teplé chody",
    image: "/images/catering/matous-glazovany-steak-repne-pyre.jpg",
    description: "Výrazný teplý signature chod s řepným pyré, pečenou zeleninou a křupavou šalotkou.",
  },
  {
    id: "mezze-labneh",
    title: "Krémové mezze s cizrnou",
    category: "tapas",
    categoryLabel: "Předkrmy & tapas",
    image: "/images/catering/matous-mezze-labneh-cizrna.jpg",
    description: "Krémový základ s marinovanou cizrnou, granátovým jablkem, bylinkami a panenským olivovým olejem.",
  },
  {
    id: "seitanove-medailonky",
    title: "Seitanové medailonky s kaší",
    category: "teple",
    categoryLabel: "Teplé chody",
    image: "/images/catering/matous-seitanove-medailonky-kase.jpg",
    description: "Křupavé medailonky, jemná bramborovo-pastináková kaše a sezónní zelenina v moderním pojetí.",
  },
  {
    id: "seitan-dynovy-krem",
    title: "Orestovaný seitan na dýňovém krému",
    category: "teple",
    categoryLabel: "Teplé chody",
    image: "/images/catering/matous-seitan-dynovy-krem.jpg",
    description: "Šťavnatý seitan na voňavém dýňovém krému se svěžím mikrosalátem a praženými dýňovými semínky.",
  },
  {
    id: "pecena-kukurice-kvetak",
    title: "Pečená baby kukuřice a květák",
    category: "teple",
    categoryLabel: "Teplé chody",
    image: "/images/catering/matous-pecena-kukurice-kvetak-pyre.jpg",
    description: "Pečená kukuřice a karamelizovaný květák na jemném pyré se svěžím křupavým salátkem.",
  },
  {
    id: "dezerty-violky",
    title: "Skleničkové dezerty s violkami",
    category: "dezerty",
    categoryLabel: "Autorské dezerty",
    image: "/images/catering/matous-dezerty-violky-sklenicky.jpg",
    description: "Lehký vanilkový krém ve skleničkách s čokoládovým crumblem a čerstvými jedlými květy.",
  },
  {
    id: "brownies-zmrzlina",
    title: "Brownies s ovocem a zmrzlinou",
    category: "dezerty",
    categoryLabel: "Autorské dezerty",
    image: "/images/catering/matous-brownies-zmrzlina-hruska.jpg",
    description: "Hutný čokoládový dezert z výběrového kakaa s vanilkovou zmrzlinou, pečenou hruškou a semínky.",
  },
  {
    id: "brownies-raut",
    title: "Degustační brownies pro raut",
    category: "dezerty",
    categoryLabel: "Autorské dezerty",
    image: "/images/catering/matous-cokoladove-brownies-raut.jpg",
    description: "Rautové porce brownies s lesním ovocem a jemným kakaovým přelivem pro snadné servírování.",
  },
  {
    id: "peceny-syr",
    title: "Pečený sýr se semínky",
    category: "tapas",
    categoryLabel: "Předkrmy & tapas",
    image: "/images/catering/matous-peceny-syr-hermelin.jpg",
    description: "Pečený sýr s křupavou krustou z dýňových a slunečnicových semínek, baby špenátem a pečivem.",
  },
  {
    id: "kulajda",
    title: "Staročeská vegetariánská kulajda",
    category: "polevky",
    categoryLabel: "Polévky & nápoje",
    image: "/images/catering/matous-staroceska-kulajda.jpg",
    description: "Krémová kulajda s lesními houbami, čerstvým koprem, pošírovaným vejcem a jemnou zakysanou smetanou.",
  },
  {
    id: "dynovy-krem",
    title: "Sametový dýňový krém",
    category: "polevky",
    categoryLabel: "Polévky & nápoje",
    image: "/images/catering/matous-dynovy-krem-seminka.jpg",
    description: "Hustý krém z pečené máslové dýně s kokosovým mlékem, praženými semínky a limetkovou šťávou.",
  },
  {
    id: "signature-drink",
    title: "Signature letní drink",
    category: "polevky",
    categoryLabel: "Polévky & nápoje",
    image: "/images/catering/matous-signature-letni-drink.jpg",
    description: "Autorský nealko aperitiv s citrusy, physalisem, domácím sirupem a snítkou horské levandule.",
  },
];

// ── Pricing Constants ────────────────────────────────────────
const SIGNATURE_PRICE_PER_PERSON = 1190;
const MIN_GUESTS = 12;
const MAX_SIGNATURE_GUESTS = 80;

export default function CateringPage() {
  // Navigation & Scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Form & Calculator State
  const [eventType, setEventType] = useState<EventTypeId>("client-raut");
  const [guestCount, setGuestCount] = useState<number>(25);
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("16:00 – 20:00");
  const [location, setLocation] = useState<string>("Praha 8");
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

      const handleScroll = () => {
        setShowBackToTop(window.scrollY > 400);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setGuestCount((prev) => Math.max(MIN_GUESTS, Math.min(250, prev + delta)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    const addonsList: string[] = [];
    if (addonWine) addonsList.push("Víno / alkohol");
    if (addonTasting) addonsList.push("Degustace před akcí");
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
      eventType: EVENT_TYPES.find((t) => t.id === eventType)?.label || eventType,
      dietNotes,
      addons: addonsList,
      notes: `Firma: ${companyName || "neuvedeno"}, IČO: ${ico || "neuvedeno"}, Typ akce: ${eventType}, Prostor: ${venueType}, Čas: ${eventTime}, Místo: ${location}. Diety: ${dietNotes || "žádné"}. Doplňky: ${addonsList.join(", ") || "žádné"}.`,
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
        throw new Error(data?.error || "Poptávku se nepodařilo bezpečně uložit.");
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
          : "Poptávku se nepodařilo odeslat. Zkuste to prosím znovu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventLabel = EVENT_TYPES.find((t) => t.id === eventType)?.label || "Client raut";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#FBF8F1] text-[#152018] font-sans selection:bg-[#E9B949]/30 selection:text-[#071710]">
      <SEOHead
        title="Firemní catering Praha | Matouš Signature | BezmasáJídla"
        description="Firemní catering v Praze od šéfkuchaře Matouše. Autorské bezmasé menu pro rauty, workshopy a board lunch. Obsluha, inventář a doprava po Praze v ceně Signature od 1 190 Kč/os."
        ogType="website"
        ogUrl="https://www.bezmasajidla.cz/catering"
        ogImage="https://www.bezmasajidla.cz/images/catering/matous-catering-og.jpg"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Catering", url: "/catering" },
        ]}
      />

      {/* ── 1. STICKY PREMIUM HEADER ────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#071710]/95 backdrop-blur-md border-b border-white/10 text-white transition-all shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-18 sm:h-20 flex items-center justify-between flex-nowrap">
          {/* Logo — Always links to / */}
          <a
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E9B949] rounded-lg group"
            title="BezmasáJídla.cz — Zpět na úvod"
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
            <a href="#proc-matous" className="hover:text-[#E9B949] transition-colors">Pro firmy</a>
            <a href="#signature-menu" className="hover:text-[#E9B949] transition-colors">Signature</a>
            <a href="#kalkulacka" className="hover:text-[#E9B949] transition-colors">Kalkulačka</a>
            <a href="#jak-to-funguje" className="hover:text-[#E9B949] transition-colors">Jak to funguje</a>
            <a href="#sef-kuchar" className="hover:text-[#E9B949] transition-colors">Matouš</a>
            <a href="#galerie" className="hover:text-[#E9B949] transition-colors">Reference</a>
            <a href="#faq" className="hover:text-[#E9B949] transition-colors">FAQ</a>
          </nav>

          {/* Desktop Right CTAs (>= 1280px) */}
          <div className="hidden xl:flex items-center gap-4">
            <a
              href="/en/catering"
              className="text-[12px] font-semibold tracking-[0.16em] text-white/80 hover:text-[#E9B949] transition-colors"
            >
              EN
            </a>
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-[13px] shadow-[0_4px_15px_rgba(233,185,73,0.25)] transition-all cursor-pointer"
            >
              <span>Poptat termín</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tablet & Mobile Right Controls (768–1199px tablet requirement: Single row, no wrap!) */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
            <a
              href="/en/catering"
              className="px-2 py-1 text-xs font-bold tracking-wider text-white/80 hover:text-[#E9B949] transition-colors"
            >
              EN
            </a>
            <button
              onClick={scrollToCalculator}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#E9B949] hover:bg-[#F2C75C] text-[#071710] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              Poptat termín
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
              <a href="#proc-matous" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Pro firmy</a>
              <a href="#signature-menu" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Signature</a>
              <a href="#kalkulacka" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Kalkulačka</a>
              <a href="#jak-to-funguje" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Jak to funguje</a>
              <a href="#sef-kuchar" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Matouš</a>
              <a href="#galerie" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">Reference</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E9B949]">FAQ</a>
              <a href="/en/catering" onClick={() => setMobileMenuOpen(false)} className="text-[#E9B949] font-bold">English (EN)</a>
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
              alt="Šéfkuchař Matouš — cateringová prezentace"
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
                Zkušenosti<br />z Norska,<br />Islandu<br />a Nového Zélandu.
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
              <span>FIREMNÍ CATERING V PRAZE</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="mt-3 lg:mt-4 leading-[0.98]">
              <span className="block font-signature text-[32px] sm:text-[44px] lg:text-[50px] xl:text-[56px] text-[#E9B949] leading-tight">
                Matouš Signature
              </span>
              <span className="block font-editorial text-[38px] sm:text-[48px] lg:text-[58px] xl:text-[66px] font-semibold text-white leading-[1.02] tracking-tight mt-1">
                Firemní catering
              </span>
              <span className="block font-editorial text-[38px] sm:text-[52px] lg:text-[62px] xl:text-[70px] font-semibold text-[#E9B949] leading-[0.96] tracking-tight">
                bez masa.
              </span>
              <span className="block font-editorial text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[64px] font-semibold text-[#F2C75C] leading-[0.96] tracking-tight">
                Bez kompromisu.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-6 max-w-xl text-[16px] sm:text-[18px] lg:text-[19px] leading-relaxed text-[#F8F5EE]/90 font-normal">
              Moderní vegetariánská gastronomie pro firmy, které chtějí skvělý zážitek, profesionální servis a transparentní rozpočet.
            </p>

            {/* Desktop CTAs */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-[15px] shadow-[0_8px_25px_rgba(233,185,73,0.3)] transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Calculator className="w-5 h-5 text-[#071710]" />
                <span>SPOČÍTAT AKCI</span>
                <ArrowRight className="w-4 h-4 text-[#071710]" />
              </button>
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[#E9B949]/70 bg-[#0B241A]/70 hover:bg-[#103426] text-white font-semibold text-[14px] tracking-[0.05em] transition-colors cursor-pointer"
              >
                POPTAT TERMÍN
              </button>
            </div>
          </div>

          {/* Desktop Trust Bar under CTA */}
          <div className="pt-10 lg:pt-14 w-full lg:w-[65%] grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 text-[12px] sm:text-[13px] text-[#F8F5EE]/90 font-medium">
            <div className="flex items-center gap-2.5 pr-3">
              <MapPin className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Praha a okolí</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-3 sm:border-l border-white/15">
              <Users className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>12–80 hostů Signature</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-3 sm:border-l border-white/15">
              <Clock className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Odpověď do 24 h</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:pl-3 sm:border-l border-white/15">
              <FileText className="w-4 h-4 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Fakturace na IČO</span>
            </div>
          </div>
        </div>

        {/* ── DEDICATED MOBILE HERO (sm:hidden) ────────────────── */}
        <div className="sm:hidden relative z-10 px-5 pt-8 pb-10 flex flex-col min-h-[580px]">
          {/* Matouš photo in top-right with face fully visible and localized fade */}
          <div className="absolute top-4 right-[-10px] w-[180px] h-[230px] pointer-events-none overflow-hidden z-0">
            <img
              src="/images/catering/matous-chef-profil.jpg"
              alt="Šéfkuchař Matouš"
              className="w-full h-full object-cover object-top rounded-bl-[36px] opacity-85 shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071710] via-[#071710]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071710] via-transparent to-transparent" />
          </div>

          {/* Left-aligned headline block strictly within safe width (no text over face) */}
          <div className="relative z-10 max-w-[210px]">
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#E9B949]">
              FIREMNÍ CATERING
            </div>
            <div className="font-signature text-[24px] text-[#E9B949] leading-tight mt-1">
              Matouš Signature
            </div>
            <div className="font-editorial text-[27px] font-semibold text-white leading-[1.02] tracking-tight mt-0.5">
              Firemní catering
            </div>
            <div className="font-editorial text-[29px] font-semibold text-[#E9B949] leading-[0.98] tracking-tight">
              bez masa.
            </div>
            <div className="font-editorial text-[25px] font-semibold text-[#F2C75C] leading-[0.98] tracking-tight">
              Bez kompromisu.
            </div>
          </div>

          {/* Subtitle below photo fade */}
          <p className="relative z-10 mt-6 text-[14px] leading-relaxed text-[#F8F5EE]/90">
            Moderní vegetariánská gastronomie pro firmy. Skvělý zážitek, profesionální servis a transparentní rozpočet.
          </p>

          {/* Full-width Mobile CTAs */}
          <div className="relative z-10 mt-6 flex flex-col gap-2.5">
            <button
              onClick={scrollToCalculator}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] text-[#071710] font-bold text-[14px] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#071710]" />
              <span>SPOČÍTAT AKCI</span>
              <ArrowRight className="w-4 h-4 text-[#071710]" />
            </button>
            <button
              onClick={scrollToCalculator}
              className="w-full py-3.5 px-5 rounded-xl border border-[#E9B949]/70 bg-[#0B241A]/80 text-white font-semibold text-[13px] tracking-wide text-center cursor-pointer"
            >
              POPTAT TERMÍN
            </button>
          </div>

          {/* 2x2 Trust Grid on Mobile */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] text-[#F8F5EE]/90 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Praha a okolí</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>12–80 hostů</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Odpověď do 24 h</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#E9B949] shrink-0" strokeWidth={2} />
              <span>Fakturace na IČO</span>
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
                <div className="font-bold text-[13px] text-[#152018]">Autorské menu</div>
                <div className="text-[12px] text-stone-600">z kvalitních surovin</div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-[#E8E2D5]">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Servisní tým, inventář</div>
                <div className="text-[12px] text-stone-600">a doprava v ceně Signature</div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-[#E8E2D5]">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Firemní rauty, workshopy</div>
                <div className="text-[12px] text-stone-600">a board lunch</div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 lg:py-6 lg:pl-8 lg:border-l border-[#E8E2D5]">
              <div className="w-10 h-10 rounded-full border border-[#103426]/30 bg-[#103426]/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#103426]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-[13px] text-[#152018]">Bez masa, plná chuť</div>
                <div className="text-[12px] text-stone-600">moderní vegetariánské menu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. B2B KALKULAČKA / FORMULÁŘ + STICKY KARTA ─────────── */}
      <section id="kalkulacka" className="py-14 lg:py-20 bg-[#FBF8F1] scroll-mt-20 border-b border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#177A55] block mb-1.5">
              Transparentní rozpočet online
            </span>
            <h2 className="font-editorial text-[34px] sm:text-[44px] font-semibold tracking-[-0.02em] leading-tight text-[#152018]">
              Spočítejte si svou akci
            </h2>
            <p className="text-stone-600 mt-2 text-[16px] sm:text-[17px]">
              Získejte orientační kalkulaci online za 60 sekund.
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
                  Poptávka úspěšně přijata
                </span>
                <h3 className="font-editorial text-3xl font-bold text-stone-900">
                  Děkujeme za poptávku, {contactPerson}!
                </h3>
                <p className="text-stone-600 text-sm max-w-lg mx-auto">
                  Váš požadavek jsme zaevidovali. Do 24 hodin ověříme kapacitu šéfkuchaře Matouše a pošleme vám detailní položkový rozpočet.
                </p>
              </div>

              <div className="bg-[#F7F2E8] border border-stone-200 rounded-2xl p-4 max-w-md mx-auto">
                <div className="text-xs text-stone-500 font-medium">Kód vaší poptávky</div>
                <div className="font-mono text-xl font-bold text-emerald-900 tracking-wider mt-1">
                  #{leadCode}
                </div>
              </div>

              <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left border border-stone-200 text-sm space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Společnost:</span>
                  <span className="font-semibold text-stone-900">{companyName || "neuvedeno"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Typ akce:</span>
                  <span className="font-semibold text-stone-900">{selectedEventLabel}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Počet hostů:</span>
                  <span className="font-semibold text-stone-900">{guestCount} osob</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Termín a čas:</span>
                  <span className="font-semibold text-stone-900">
                    {eventDate || "Dle dohody"} ({eventTime})
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500">Orientační odhad rozpočtu:</span>
                  <span className="font-bold text-emerald-800">
                    {estimatedTotal
                      ? `${estimatedTotal.toLocaleString("cs-CZ")} Kč bez DPH`
                      : "Individuální kalkulace"}
                  </span>
                </div>
              </div>

              <div className="text-left max-w-lg mx-auto bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-5 space-y-2 text-xs text-emerald-950">
                <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Co se bude dít dál:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li>Do 24 hodin ověříme kapacitu pro váš termín.</li>
                  <li>Připravíme konkrétní návrh menu a cenovou nabídku.</li>
                  {mailStatus === "sent" ? (
                    <li>Souhrn poptávky jsme poslali na <strong>{email}</strong>.</li>
                  ) : (
                    <li>Poptávka je bezpečně uložená. E-mailové potvrzení bude brzy doručeno.</li>
                  )}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmissionSuccess(false)}
                  className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-900 text-sm font-semibold cursor-pointer"
                >
                  Zadat další poptávku
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ── Left Column: Form (7 cols) ───────────────────────── */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D5] space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: O akci */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0B241A] text-white font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h3 className="font-bold text-lg text-[#152018]">O akci</h3>
                    </div>

                    {/* Segmented controls pro typ akce */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-stone-600">
                        Typ akce
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

                    {/* Počet hostů stepper & slider */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-stone-600">
                          Počet hostů
                        </label>
                        <span className="text-xs text-stone-500 font-medium">
                          Signature model: 12 až 80 osob
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
                          {guestCount} hostů
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
                            Pro akce nad 80 hostů sestavujeme individuální produkční plán, personální zajištění a kalkulaci na míru.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Datum & Čas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Datum akce
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
                          Čas
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
                            placeholder="Např. 16:00 – 20:00"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Místo konání & Typ prostoru */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Místo konání
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
                            placeholder="Např. Praha 8 / Karlín / V sídle firmy"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Typ prostoru
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

                  {/* Step 2: Firma a kontakt */}
                  <div className="space-y-4 pt-5 border-t border-[#E8E2D5]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0B241A] text-white font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h3 className="font-bold text-lg text-[#152018]">Firma a kontakt</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Název firmy <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => {
                            handleFormInteraction();
                            setCompanyName(e.target.value);
                          }}
                          placeholder="Vaše firma s.r.o."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          IČO (volitelné)
                        </label>
                        <input
                          type="text"
                          value={ico}
                          onChange={(e) => {
                            handleFormInteraction();
                            setIco(e.target.value);
                          }}
                          placeholder="12345678"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Kontaktní osoba <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactPerson}
                          onChange={(e) => {
                            handleFormInteraction();
                            setContactPerson(e.target.value);
                          }}
                          placeholder="Jan Novák"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Pracovní e-mail <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            handleFormInteraction();
                            setEmail(e.target.value);
                          }}
                          placeholder="jan.novak@firma.cz"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Telefon <span className="text-red-500">*</span>
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

                  {/* Step 3: Diety a doplňky */}
                  <div className="space-y-4 pt-5 border-t border-[#E8E2D5]">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0B241A] text-white font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h3 className="font-bold text-lg text-[#152018]">Diety a doplňky</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Diety / alergie v týmu (volitelné)
                      </label>
                      <input
                        type="text"
                        value={dietNotes}
                        onChange={(e) => {
                          handleFormInteraction();
                          setDietNotes(e.target.value);
                        }}
                        placeholder="Např. 3× bez lepku, 2× bez ořechů, 1× celiakie..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FBF8F1] text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E9B949] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="text-xs font-semibold text-stone-600">
                        Volitelné prémiové doplňky:
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
                          <span>Degustace před akcí</span>
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
                          <span>Víno / alkohol</span>
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
                  <div className="space-y-3 pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F2C75C] via-[#E9B949] to-[#DFAC34] hover:from-[#F7D47C] hover:to-[#E9B949] text-[#071710] font-bold text-base shadow-xl shadow-[#E9B949]/20 transition-all transform active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 text-[#071710]" />
                      <span>{isSubmitting ? "Odesílám poptávku..." : "ODESLAT POPTÁVKU →"}</span>
                    </button>
                    <p className="text-center text-xs text-stone-500 leading-normal">
                      Nejde o závaznou rezervaci. Do 24 hodin ověříme volnou kapacitu a pošleme vám položkový rozpočet.
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
                          alt="Glazovaný signature chod Matouše"
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
                        <strong>{guestCount}</strong> hostů
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span>{eventDate ? new Date(eventDate).toLocaleDateString("cs-CZ") : "Termín dle dohody"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span>{location || "Praha a okolí"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#177A55] shrink-0" />
                      <span>{eventTime || "Čas dle dohody"}</span>
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
                          Individuální rozpočet
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          Nad 80 hostů připravujeme velkokapacitní kalkulaci a produkci na míru.
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <div className="font-editorial text-3xl font-bold text-[#152018]">
                            1 190 Kč{" "}
                            <span className="text-xs font-sans font-normal text-stone-500">
                              / osoba
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-[#177A55] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block mt-2">
                          Orientačně:{" "}
                          <span className="font-bold text-emerald-950">
                            {estimatedTotal?.toLocaleString("cs-CZ")} Kč bez DPH
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inclusions Checklist */}
                  <div className="p-5 space-y-3 bg-white text-xs">
                    <div className="font-bold tracking-wide uppercase text-[11px] text-stone-500">
                      V ceně Signature:
                    </div>
                    <ul className="space-y-2 text-stone-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Autorské menu ze sezónních surovin</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Nealko nápoje (domácí limonády & infuze)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Kompletní servisní tým po celou dobu akce</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Šéfkuchař na teplé vlny & finální servis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Prémiový inventář (sklo, porcelán, příbory)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Doprava a logistika po Praze</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#177A55] shrink-0 stroke-[2.5]" />
                        <span>Průběžný debaras a finální úklid</span>
                      </li>
                    </ul>
                  </div>

                  {/* Synchronized Add-ons */}
                  <div className="p-5 bg-[#FAF8F5] space-y-2 text-xs text-stone-700">
                    <div className="font-bold tracking-wide uppercase text-[11px] text-stone-500">
                      Volitelné doplňky:
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonWine ? "bg-[#E9B949]" : "bg-stone-300"}`} />
                        <span className={addonWine ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Víno / alkohol
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonTasting ? "bg-[#E9B949]" : "bg-stone-300"}`} />
                        <span className={addonTasting ? "font-semibold text-stone-900" : "text-stone-500"}>
                          Degustace před akcí
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${addonLateService ? "bg-[#E9B949]" : "bg-stone-300"}`} />
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

      {/* ── 5. AUTORSKÁ GALERIE & SKUTEČNÉ REALIZACE ─────────────── */}
      <section id="galerie" className="py-16 lg:py-24 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#177A55]/10 text-[#177A55] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Portfolio & Realizace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#152018]">
            Autorská tvorba šéfkuchaře Matouše
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Podívejte se na reálné pokrmy, rauty a servírování z našich bezmasých cateringů a firemních akcí.
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
              onClick={() => setLightboxItem(item)}
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
                    <span>Zvětšit detail</span>
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
                aria-label="Zavřít"
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
                  <span className="text-xs text-stone-400">Autorská tvorba šéfkuchaře Matouše</span>
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2 font-editorial">
                  {lightboxItem.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  {lightboxItem.description}
                </p>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Máte zájem o tento chod na vaší akci?</span>
                  <button
                    onClick={() => {
                      setLightboxItem(null);
                      scrollToCalculator();
                    }}
                    className="px-4 py-2 bg-[#0B241A] hover:bg-[#103426] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Přejít ke kalkulaci</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 6. JAK TO FUNGUJE (3 KROKY) ─────────────────────────── */}
      <section id="jak-to-funguje" className="py-16 lg:py-24 bg-white border-y border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#177A55] block mb-2">
              Jednoduchý proces
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#152018]">
              Jak to funguje
            </h2>
            <p className="text-stone-600 mt-2 text-base">
              Od poptávky k úspěšné akci ve 3 krocích. Žádný stres, žádné starosti s inventářem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-3xl bg-[#F7F2E8] border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9B949] text-[#071710] font-bold text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-bold text-xl text-[#152018]">Pošlete poptávku</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Vyplníte online formulář v kalkulačce výše. Zabere vám to přesně 1 minutu.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F7F2E8] border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9B949] text-[#071710] font-bold text-lg flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-bold text-xl text-[#152018]">Připravíme nabídku</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Do 24 hodin ověříme volnou kapacitu a pošleme vám detailní položkový rozpočet a složení menu.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F7F2E8] border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E9B949] text-[#071710] font-bold text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-bold text-xl text-[#152018]">Už jen si užít akci</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Přivezeme inventář, jídlo i kuchaře. Postaráme se o kompletní servis, debaras i závěrečný úklid.
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
              Zážitková gastronomie
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#152018]">
              Co přesně obsahuje Matouš Signature
            </h2>
            <p className="text-stone-600 mt-2 text-base">
              Vyvážená kombinace finger foodu, teplých signature vln, dezertů a nealko baru za 1 190 Kč / osoba bez DPH.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Chod 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-[#177A55]" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Finger food & tapas</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                6 druhů autorských kanapek, bruschett a tartaletek. Pečená kořenová zelenina, mandlové ricotty, hummusy a uzené marinády.
              </p>
              <div className="text-[11px] font-semibold text-[#177A55] bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                Průběžný studený raut
              </div>
            </div>

            {/* Chod 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Teplé signature chody</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                3 teplé chody servírované kuchařem v časových vlnách. Glazovaný zeleninový steak, jemná dýňová pyré, křupavý seitan a ragú.
              </p>
              <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                Šéfkuchař na place
              </div>
            </div>

            {/* Chod 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Autorské dezerty</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                2 druhy jemných dezertů ve skleničkách s jedlými květy a lesním ovocem. Kakaové brownies, meruňkový mousse a oříškové praliné.
              </p>
              <div className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md inline-block">
                Sladká tečka
              </div>
            </div>

            {/* Chod 4 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Wine className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Signature nealko bar</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Čerstvé bylinkové limonády, infuzované pramenité vody, řemeslné mošty, výběrová filtrovaná káva a sypané čaje v neomezeném množství.
              </p>
              <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                Nealko v ceně
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 8. ŠÉFKUCHAŘ MATOUŠ (AUTHORITY BLOCK) ────────────────── */}
      <section id="sef-kuchar" className="py-16 lg:py-24 bg-[#071710] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Chef Portrait */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                <img
                  src="/images/catering/matous-chef-profil.jpg"
                  alt="Šéfkuchař Matouš v kuchařském rondonu"
                  className="w-full h-auto object-cover object-top"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#071710]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="font-signature text-2xl text-[#E9B949]">
                    Matouš
                  </div>
                  <div className="text-xs text-stone-300 font-sans">
                    Šéfkuchař & autor Signature cateringu
                  </div>
                </div>
              </div>
            </div>

            {/* Chef Story & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#E9B949] uppercase">
                <Award className="w-4 h-4 text-[#E9B949]" />
                <span>Kuchařské řemeslo bez kompromisů</span>
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
                „Jídlo bez masa nemusí být náhražka. Je to plnohodnotný kulinářský zážitek.“
              </h2>

              <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  Moje gastronomická cesta vedla přes kuchyně v <strong>Norsku, na Islandu i na Novém Zélandu</strong>. V severských a tichomořských restauracích jsem se naučil hlubokému respektu k čistotě surovin, technice kouře, marinování a vyvažování kyselin a textur.
                </p>
                <p>
                  V projektu <strong>Matouš Signature</strong> přenáším tuto zkušenost do firemního cateringu. Nechceme napodobovat maso polotovary. Pracujeme s poctivou kořenovou zeleninou, fermentací, ořechy, bylinkami a luštěninami tak, aby každý chod vyvolal u stolu živou debatu a nadšení.
                </p>
                <p className="text-[#E9B949] font-normal">
                  Na každé akci ručně dohlížím na teplé vlny a finální prezentaci. Vaši kolegové a klienti budou mít zážitek, o kterém se bude mluvit ještě další týden v kanceláři.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={scrollToCalculator}
                  className="px-8 py-4 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-sm shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  Poptat termín s Matoušem →
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
              Odpovědi na otázky organizátorů
            </span>
            <h2 className="font-editorial text-3xl font-bold tracking-tight text-[#152018]">
              Často kladené dotazy
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Kdy nejpozději musíme termín závazně poptat?",
                a: "Ideální je poptat termín 2 až 4 týdny předem. U urgentních termínů do týdne pošlete poptávku přes formulář a ověříme, zda je možné akci produkčně zajistit.",
              },
              {
                q: "Jak řešíte specifické alergie a diety (lepek, ořechy, laktóza)?",
                a: "Všechna jídla připravujeme čerstvá a autorsky. Stačí nám v poptávce uvést počet osob s bezlepkovou dietou, alergií na ořechy či jiné intolerance. Pro tyto hosty připravujeme plnohodnotné, vizuálně i chuťově srovnatelné alternativy.",
              },
              {
                q: "Co všechno je skutečně v ceně 1 190 Kč / osoba bez DPH?",
                a: "Cena je all-inclusive pro model Signature: kompletní jídlo (finger food, 3 teplé vlny, 2 dezerty), nealko bar po celou dobu akce, obsluhující personál, kuchař, zapůjčení kompletního inventáře (talíře, sklo na nealko, příbory), doprava v Praze a průběžný debaras s finálním úklidem.",
              },
              {
                q: "Jak probíhá fakturace a splatnost pro firemní klienty?",
                a: "Vystavujeme standardní daňový doklad na IČO vaší společnosti. Konkrétní výše zálohy, splatnost a platební podmínky budou vždy uvedené v nabídce pro danou akci.",
              },
              {
                q: "Co když máme akci pro více než 80 hostů?",
                a: "Pro akce nad 80 hostů zapojujeme rozšířený kuchařský a servisní tým a připravujeme velkokapacitní logistický plán na míru. V kalkulačce stačí zadat reálný počet hostů a my vám připravíme individuální cenovou nabídku.",
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
            Nezávazná kalkulace za 60 sekund
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Připravte pro svůj tým zážitek, který si budou pamatovat.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-light">
            Matouš Signature je firemní catering nové generace. Bez masa, bez kompromisů, s kompletním servisem v ceně.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCalculator}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-b from-[#F2C75C] to-[#E9B949] hover:from-[#F7D47C] hover:to-[#F2C75C] text-[#071710] font-bold text-base shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Spočítat akci online →
            </button>
            <button
              onClick={scrollToCalculator}
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/20 text-stone-200 hover:text-white hover:bg-white/5 text-base font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#E9B949]" />
              <span>Poptat termín</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 11. FLOATING BACK-TO-TOP BUTTON ─────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#071710]/95 hover:bg-[#103426] text-[#E9B949] border border-[#E9B949]/50 shadow-2xl transition-all transform hover:scale-105 cursor-pointer backdrop-blur-sm"
          aria-label="Zpět nahoru"
          title="Zpět nahoru"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      <Footer />
    </div>
  );
}

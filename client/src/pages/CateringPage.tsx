[Reading 1000 lines from start (total: 1407 lines, 407 remaining)]

// ============================================================
// BEZMASAJIDLA.CZ — MATOUŠ SIGNATURE B2B CATERING FUNNEL
// Premium Corporate Sales Page & Conversion Engine
// Matouš Signature: od 1 190 Kč / osoba bez DPH (12–80 hostů)
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

// ── Pricing Constants ────────────────────────────────────────
const SIGNATURE_PRICE_PER_PERSON = 1190;
const MIN_GUESTS = 12;
const MAX_SIGNATURE_GUESTS = 80;

export default function CateringPage() {
  // Navigation / Scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      eventType: EVENT_TYPES.find(t => t.id === eventType)?.label || eventType,
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

  const selectedEventLabel = EVENT_TYPES.find(t => t.id === eventType)?.label || "Client raut";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-stone-800 font-sans selection:bg-amber-200 selection:text-stone-900">
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

      {/* ── 1. PREMIUM CATERING HEADER — OVER HERO ──────────────── */}
      <header className="absolute inset-x-0 top-0 z-50 text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-20 lg:h-24 flex items-center justify-between">
          <a
            href="/catering"
            className="flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
          >
            <div className="w-11 h-11 rounded-full border border-amber-400/70 flex items-center justify-center text-amber-300">
              <Leaf className="w-6 h-6" strokeWidth={1.35} />
            </div>
            <div className="leading-none">
              <div className="text-[15px] sm:text-[17px] tracking-[0.24em] font-medium uppercase text-white">
                BezmasáJídla
              </div>
              <div className="mt-1.5 text-[9px] tracking-[0.38em] font-medium uppercase text-stone-300">
                Catering
              </div>
            </div>
          </a>

          <nav className="hidden xl:flex items-center gap-7 text-[12px] font-medium text-white/90">
            <a href="#proc-matous" className="hover:text-amber-300 transition-colors">Pro firmy</a>
            <a href="#signature-menu" className="hover:text-amber-300 transition-colors">Signature</a>
            <a href="#kalkulacka" className="hover:text-amber-300 transition-colors">Kalkulačka</a>
            <a href="#jak-to-funguje" className="hover:text-amber-300 transition-colors">Jak to funguje</a>
            <a href="#sef-kuchar" className="hover:text-amber-300 transition-colors">Matouš</a>
            <a href="#galerie" className="hover:text-amber-300 transition-colors">Reference</a>
            <a href="#faq" className="hover:text-amber-300 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-b from-[#FFD65A] to-[#F1B829] hover:from-[#FFE078] hover:to-[#F5C23E] text-[#142018] font-bold text-[13px] shadow-[0_8px_25px_rgba(0,0,0,.22)] transition-all"
            >
              Poptat termín
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={scrollToCalculator}
              className="px-4 py-2 rounded-md bg-amber-400 text-stone-950 font-bold text-xs"
            >
              Poptat
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white"
              aria-label="Přepnout menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mx-4 rounded-2xl border border-white/10 bg-[#071710]/95 backdrop-blur-xl px-5 py-5 shadow-2xl">
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm text-stone-100">
              <a href="#proc-matous" onClick={() => setMobileMenuOpen(false)}>Pro firmy</a>
              <a href="#signature-menu" onClick={() => setMobileMenuOpen(false)}>Signature</a>
              <a href="#kalkulacka" onClick={() => setMobileMenuOpen(false)}>Kalkulačka</a>
              <a href="#jak-to-funguje" onClick={() => setMobileMenuOpen(false)}>Jak to funguje</a>
              <a href="#sef-kuchar" onClick={() => setMobileMenuOpen(false)}>Matouš</a>
              <a href="#galerie" onClick={() => setMobileMenuOpen(false)}>Reference</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO — 1:1 PREMIUM COMPOSITION ───────────────────── */}
      <section className="relative overflow-hidden bg-[#071710] text-white min-h-[690px] lg:min-h-[720px] border-b border-[#152b21]">
        <img
          src="/images/catering/matous-catering-og.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 h-full w-full lg:w-[59%] object-cover object-right opacity-40 lg:opacity-100"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #071710 0%, #071710 41%, rgba(7,23,16,.90) 50%, rgba(7,23,16,.30) 63%, rgba(7,23,16,0) 76%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071710]/20 via-transparent to-[#071710]/10 pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 lg:pt-36 pb-10 min-h-[690px] lg:min-h-[720px] flex flex-col">
          <div className="w-full lg:w-[51%] xl:w-[49%]">
            <div className="flex items-center gap-3 text-[11px] sm:text-[12px] tracking-[0.40em] uppercase font-medium text-amber-300">
              <span className="w-7 h-px bg-amber-400/80" />
              <span>Firemní catering v Praze</span>
            </div>

            <h1 className="mt-5 font-serif text-[46px] sm:text-[58px] lg:text-[62px] xl:text-[68px] leading-[0.96] tracking-[-0.035em] font-semibold">
              <span className="block text-white">Matouš Signature</span>
              <span className="block mt-1 text-white">Firemní catering</span>
              <span className="block mt-1 text-amber-300">bez masa.</span>
              <span className="block text-amber-300">Bez kompromisu.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] sm:text-[20px] leading-relaxed text-stone-100/90 font-light">
              Moderní vegetariánská gastronomie pro firmy, které chtějí skvělý zážitek, profesionální servis a transparentní rozpočet.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center gap-3 min-w-[218px] px-7 py-4 rounded-md bg-gradient-to-b from-[#FFD65A] to-[#F2B92B] hover:from-[#FFE078] hover:to-[#F7C542] text-[#122019] font-bold text-[15px] shadow-[0_12px_30px_rgba(0,0,0,.28)] transition-all"
              >
                <Calculator className="w-5 h-5" />
                SPOČÍTAT AKCI
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToCalculator}
                className="inline-flex items-center justify-center min-w-[176px] px-7 py-4 rounded-md border border-amber-300/80 bg-[#0b2018]/60 text-white font-semibold text-[14px] tracking-[0.08em] hover:bg-[#173528]/80 transition-colors"
              >
                POPTAT TERMÍN
              </button>
            </div>
          </div>

          <div className="mt-auto pt-8 lg:pt-12 w-full lg:w-[55%] grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-[11px] sm:text-[12px] text-stone-100">
            <div className="flex items-center gap-2.5 pr-4">
              <MapPin className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>Praha a okolí</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-4 sm:border-l border-white/15">
              <Users className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>12–80 hostů Signature</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:px-4 sm:border-l border-white/15">
              <Clock className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>Odpověď do 24 h</span>
            </div>
            <div className="flex items-center gap-2.5 px-0 sm:pl-4 sm:border-l border-white/15">
              <FileText className="w-5 h-5 text-amber-300 shrink-0" strokeWidth={1.7} />
              <span>Fakturace na IČO</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-[4.5%] top-[31%] z-20 bg-white/92 backdrop-blur-sm text-[#152018] px-5 py-4 shadow-xl">
          <div className="text-[10px] uppercase tracking-[0.28em] leading-relaxed">
            Zkušenosti<br />z Norska,<br />Islandu<br />a Nového Zélandu.
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
                <div className="font-semibold text-[13px] text-[#18221c]">Autorské menu</div>
                <div className="text-[12px] text-stone-600">z kvalitních surovin</div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-stone-300/80">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Servisní tým, inventář</div>
                <div className="text-[12px] text-stone-600">a doprava v ceně Signature</div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:px-8 lg:border-l border-stone-300/80">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Firemní rauty, workshopy</div>
                <div className="text-[12px] text-stone-600">a board lunch</div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 lg:py-6 lg:pl-8 lg:border-l border-stone-300/80">
              <div className="w-10 h-10 rounded-full border border-[#173226] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#173226]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-[13px] text-[#18221c]">Bez masa, plná chuť</div>
                <div className="text-[12px] text-stone-600">moderní vegetariánské menu</div>
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
              Spočítejte si svou akci
            </h2>
            <p className="text-stone-600 mt-2 text-[17px]">
              Získejte orientační kalkulaci online za 60 sekund.
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
                  Poptávka úspěšně přijata
                </span>
                <h3 className="font-serif text-3xl font-bold text-stone-900">
                  Děkujeme za poptávku, {contactPerson}!
                </h3>
                <p className="text-stone-600 text-sm max-w-lg mx-auto">
                  Váš požadavek jsme zaevidovali. Do 24 hodin ověříme kapacitu šéfkuchaře Matouše a pošleme vám detailní položkový rozpočet.
                </p>
              </div>

              {/* Lead Code Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 max-w-md mx-auto">
                <div className="text-xs text-stone-500 font-medium">Kód vaší poptávky</div>
                <div className="font-mono text-xl font-bold text-emerald-900 tracking-wider mt-1">
                  #{leadCode}
                </div>
              </div>

              {/* Summary Table */}
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

              {/* Next Steps */}
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
                    <li>Poptávka je bezpečně uložená. E-mailové potvrzení zatím nebylo odesláno.</li>
                  )}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmissionSuccess(false)}
                  className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-stone-900 text-sm font-semibold"
                >
                  Zadat další poptávku
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
                      <h3 className="font-bold text-lg text-stone-900">O akci</h3>
                    </div>

                    {/* Typ akce pills */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-stone-600">
                        Typ akce
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

                    {/* Počet hostů stepper & slider */}
                    <div className="space-y-2">
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
                          className="w-11 h-11 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100 font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 text-base">
                          {guestCount} hostů
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
                          Čas
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
                            placeholder="Např. 16:00 – 20:00"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
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
                            onChange={e => {
                              handleFormInteraction();
                              setLocation(e.target.value);
                            }}
                            placeholder="Např. Praha 8 / Karlín / V sídle firmy"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Typ prostoru
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

                  {/* Step 2: Firma a kontakt */}
                  <div className="space-y-4 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h3 className="font-bold text-lg text-stone-900">Firma a kontakt</h3>
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
                          onChange={e => {
                            handleFormInteraction();
                            setCompanyName(e.target.value);
                          }}
                          placeholder="Vaše firma s.r.o."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          IČO (volitelné)
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
                          Kontaktní osoba <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactPerson}
                          onChange={e => {
                            handleFormInteraction();
                            setContactPerson(e.target.value);
                          }}
                          placeholder="Jan Novák"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
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
                          onChange={e => {
                            handleFormInteraction();
                            setEmail(e.target.value);
                          }}
                          placeholder="jan.novak@firma.cz"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Telefon <span className="text-red-500">*</span>
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

                  {/* Step 3: Diety a doplňky */}
                  <div className="space-y-4 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h3 className="font-bold text-lg text-stone-900">Diety a doplňky</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        Diety / alergie v týmu (volitelné)
                      </label>
                      <input
                        type="text"
                        value={dietNotes}
                        onChange={e => {
                          handleFormInteraction();
                          setDietNotes(e.target.value);
                        }}
                        placeholder="Např. 3× bez lepku, 2× bez ořechů, 1× celiakie..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="text-xs font-semibold text-stone-600">
                        Volitelné prémiové doplňky:
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
                          <span>Degustace před akcí</span>
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
                          <span>Víno / alkohol</span>
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
                      <span>{isSubmitting ? "Odesílám poptávku..." : "ODESLAT POPTÁVKU →"}</span>
                    </button>
                    <p className="text-center text-xs text-stone-500 leading-normal">
                      Nejde o rezervaci termínu. Do 24 hodin ověříme volnou kapacitu a pošleme vám položkový rozpočet.
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
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-400/40 shrink-0 shadow-md">
                        <img
                          src="/images/catering/matous-cateringovy-raut-kanapky.jpg"
                          alt="Matouš kanapky"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Parameters Summary */}
                  <div className="p-5 space-y-2.5 text-xs text-stone-700 bg-[#FAF8F5]">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="font-medium">
                        <strong>{guestCount}</strong> hostů
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{eventDate ? new Date(eventDate).toLocaleDateString("cs-CZ") : "Termín dle dohody"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{location || "Praha a okolí"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{eventTime || "Čas dle dohody"}</span>
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
                          Individuální rozpočet
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          Nad 80 hostů připravujeme velkokapacitní kalkulaci na klíč.
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                            1 190 Kč{" "}
                            <span className="text-xs font-sans font-normal text-stone-500">
                              / osoba
                            </span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block mt-1.5">
                          Orientačně:{" "}
                          <span className="font-bold text-emerald-900">
                            {estimatedTotal?.toLocaleString("cs-CZ")} Kč bez DPH
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

[executed on device: DESKTOP-ALZABOX (7e869a05-3e3d-4dd2-adbd-ebf450ac342d)]
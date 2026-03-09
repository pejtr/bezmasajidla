// ============================================================
// BEZMASAJIDLA.CZ — Kontakt
// Kontaktní formulář s odesíláním přes tRPC → notifyOwner
// ============================================================

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";

const contactInfo = [
  {
    icon: Mail,
    label: "E-mail",
    value: "petr.matej@gmail.com",
    href: "mailto:petr.matej@gmail.com",
  },
  {
    icon: MapPin,
    label: "Lokalita",
    value: "Praha, Česká republika",
    href: null,
  },
  {
    icon: Clock,
    label: "Odpověď do",
    value: "24–48 hodin",
    href: null,
  },
];

const topics = [
  "Přidání restaurace",
  "Oprava informací",
  "Spolupráce / inzerce",
  "Technický problém",
  "Jiné",
];

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const sendContact = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message || "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Vyplňte prosím všechna pole.");
      return;
    }
    sendContact.mutate({ name, email, subject, message });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Kontakt — Bezmasá Jídla"
        description="Máte dotaz, chcete přidat restauraci nebo nahlásit chybu? Napište nám přes kontaktní formulář. Odpovídáme do 24–48 hodin."
        ogImage="https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/hero-bg-8DsoJ9QpVxJTndww9Yv7SZ.webp"
      />
      <Header />

      {/* ── HERO ── */}
      <section className="bg-emerald-800 py-14">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-700/50 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            <Mail className="w-3.5 h-3.5" />
            Kontakt
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Napište nám
          </h1>
          <p className="text-emerald-200 text-lg max-w-xl mx-auto">
            Máte dotaz, chcete přidat restauraci nebo nahlásit chybu? Rádi vám odpovíme.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-14 container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">

          {/* ── CONTACT INFO ── */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Kontaktní informace
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Provozujeme největší český adresář veganských a vegetariánských restaurací v Praze. Jsme tým nadšenců, kteří věří, že bezmasé stravování může být chutné, dostupné a radostné.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-gray-800 hover:text-emerald-700 transition-colors font-medium">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-800 font-medium">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Topic quick-select */}
            <div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Nejčastější témata</div>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSubject(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      subject === t
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── FORM ── */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Zpráva odeslána!
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Děkujeme za vaši zprávu. Odpovíme vám do 24–48 hodin na zadaný e-mail.
                </p>
                <Button
                  variant="outline"
                  className="mt-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setSent(false)}
                >
                  Odeslat další zprávu
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Jméno <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Vaše jméno"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      E-mail <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vas@email.cz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Předmět <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="O čem nám chcete napsat?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Zpráva <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Napište nám svůj dotaz, návrh nebo zprávu..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-gray-400">
                    Odpovídáme do 24–48 hodin. Váš e-mail nebudeme sdílet s třetími stranami.
                  </p>
                  <Button
                    type="submit"
                    disabled={sendContact.isPending}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 gap-2 flex-shrink-0"
                  >
                    {sendContact.isPending ? (
                      <>Odesílám...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Odeslat zprávu
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

# Bezmasajidla.cz — Design Brainstorm

## Tři designové koncepty

<response>
<text>
## Koncept A: "Farmářský Trh" — Organický Modernismus
**Design Movement:** Organic Modernism meets Editorial Food Photography

**Core Principles:**
- Zemitá, teplá paleta evokující přírodu a čerstvé suroviny
- Silná typografie s kontrastem serif nadpisů a sans-serif textu
- Asymetrické layouty s velkými fotografiemi jako dominantou
- Pocit autenticity a lokálnosti — ne sterilní tech startup

**Color Philosophy:**
- Primární: hluboká lesní zelená `#2D5016` — síla, příroda, důvěra
- Sekundární: teplá krémová `#F5EDD8` — organičnost, teplo, pozvání
- Akcent: terakota `#C4622D` — energie, chuť, vitalita
- Text: tmavě hnědá `#1A1208` — čitelnost, zemitost

**Layout Paradigm:**
- Homepage: fullscreen hero s fotografií jídla, překrytý titulek
- Listing: asymetrický grid (1 velká karta vlevo + 2 menší vpravo)
- Sticky sidebar s mapou při scrollování
- Horizontální scroll pro kategorie

**Signature Elements:**
- Ručně kreslené ikony (list, mrkev, semínko)
- Texturované pozadí (jemný papírový noise)
- Zaoblené rohy karet s výrazným stínem

**Interaction Philosophy:**
- Hover efekty s jemným přiblížením fotografií
- Plynulé přechody mezi stránkami
- Filtry jako vizuální tagy, ne dropdown menu

**Animation:**
- Entrance: fade-in + slight translateY pro karty
- Hover: scale(1.02) na kartách restaurací
- Map markers: pulse animace pro aktivní restauraci

**Typography System:**
- Nadpisy: Playfair Display (serif) — elegance, food editorial feel
- Tělo: Source Sans Pro — čitelnost, modernost
- Akcent: Playfair Display Italic pro citáty a popisky
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Koncept B: "Zelená Metropole" — Urban Botanical
**Design Movement:** Urban Botanical / Contemporary Czech Design

**Core Principles:**
- Čistý, vzdušný layout s botanickými akcenty
- Silná zelená identita bez klišé "eko" designu
- Datová přehlednost — web jako nástroj, ne jen inspirace
- Moderní česká estetika — střídmá, funkční, elegantní

**Color Philosophy:**
- Primární: sytá smaragdová `#1B6B45` — vitalita, svěžest
- Sekundární: téměř bílá `#F8FAF6` — čistota, vzduch
- Akcent: zlatavá `#E8B84B` — prémiové označení, hvězdičky
- Tmavá: `#0F2419` — pro texty a footer

**Layout Paradigm:**
- Horizontální navigace s výrazným logem vlevo
- Dvousloupcový listing: levý sloupec filtry, pravý výsledky
- Mapa jako plnohodnotná alternativa k listingu (toggle)
- Sticky header s vyhledávacím polem

**Signature Elements:**
- Tenké zelené linky jako dekorativní prvky
- Barevné tagy pro kategorie (veganský = tmavě zelená, vegetariánský = světle zelená, vegan-friendly = žlutá)
- Číslované TOP listy s výraznou typografií

**Interaction Philosophy:**
- Filtry se aplikují okamžitě (no submit button)
- Hover na kartě zobrazí quick-info overlay
- Mapa a listing jsou synchronizované

**Animation:**
- Filtry: smooth height transition při zobrazení/skrytí
- Karty: staggered entrance animation (každá karta s 50ms zpožděním)
- Mapa markery: bounce při hover na kartě

**Typography System:**
- Nadpisy: DM Serif Display — moderní serif s charakterem
- Tělo: DM Sans — párový font, konzistentní rodina
- Monospace: JetBrains Mono pro čísla a hodnocení
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Koncept C: "Přírodní Manifest" — Raw Editorial
**Design Movement:** Raw Editorial / Brutalist Food

**Core Principles:**
- Odvážná, neomluvená typografie jako hlavní designový prvek
- Minimální dekorace — obsah je design
- Silný kontrast černé a zelené
- Novinový/magazínový feeling

**Color Philosophy:**
- Primární: téměř černá `#111111`
- Akcent: výrazná zelená `#4CAF50`
- Pozadí: čistá bílá `#FFFFFF`
- Sekundární akcent: světle zelená `#E8F5E9`

**Layout Paradigm:**
- Masonry grid pro restaurace
- Velké typografické nadpisy přes celou šířku
- Minimální padding, maximální hustota obsahu

**Typography System:**
- Nadpisy: Bebas Neue — výrazný, silný
- Tělo: Roboto Mono — technický, přesný
</text>
<probability>0.05</probability>
</response>

---

## Zvolený Koncept: **B — "Zelená Metropole"**

Tento koncept nejlépe kombinuje:
- Profesionalitu a důvěryhodnost (pro B2B restaurace)
- Uživatelskou přehlednost (pro hledání restaurací)
- Moderní českou estetiku (bez přehnaného "eko" klišé)
- Škálovatelnost pro budoucí funkce (mapa, recepty, filtry)

**Barvy:** Smaragdová `#1B6B45` + krémová `#F8FAF6` + zlatá `#E8B84B`
**Fonty:** DM Serif Display (nadpisy) + DM Sans (tělo)
**Layout:** Dvousloupcový listing s sticky mapou

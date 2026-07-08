# Performance Improvements

## Overview
Vite build pipeline reports that some chunks exceed the 500kB warning threshold after minification. The primary issue is eager importation of heavy dependencies on the main bundle.

### 1. Eagerly imported `mermaid`, `cytoscape`, `wolfram`
**Zdroj:** `index-[hash].js` a specifické assets (`mermaid.core-[hash].js`, `cytoscape.esm-[hash].js`).
Některé komponenty nebo utility importují masivní frontend knihovny, pravděpodobně Markdown komponenta nebo grafové shadery v admin panelu.

**Doporučené řešení:** 
- Nativní lazy loading (`React.lazy()` a `Suspense`) pro jakoukoliv komponentu, která tyto moduly využívá (např. vizualizační prvky, markdown bloky).
- Použít `vite` `manualChunks` (v `vite.config.ts`) a oddělit `mermaid` a `cytoscape` do vlastních vendor chunků namísto svazování s `index`.

**Priorita:** Vysoká (pokud jsou načítány na Home.tsx, Recepty nebo restaurace).
**Riziko pro Core Web Vitals (CWV):** Extrémní riziko pro TBT (Total Blocking Time) a LCP (Largest Contentful Paint) kvůli silnému parsování JS vláknem v prohlížeči.

### 2. Zbytečné language loadery / highlight bundles (e.g. `emacs-lisp`, `cpp`, `typescript`)
**Zdroj:** Code-block / syntax highlighter, který se používá na blogu nebo v administraci.

**Doporučené řešení:**
- Místo importu celého baličku (např. z `prismjs` nebo `highlight.js`) explicitně importovat jen podmnožinu jazyků, která na receptovém portálu reálně dává smysl, případně kompletně vyříznout z frontendu a nechat highlighter běžet na serveru.

**Priorita:** Střední.
**Riziko pro CWV:** Střední riziko, ucpává network thread a zvyšuje first load payload, nicméně kód s jazyky je typicky rychlý na parse.

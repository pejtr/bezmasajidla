# Performance Improvements

## Overview
Vite build pipeline reports that some chunks exceed the 500kB warning threshold after minification. The primary issue is eager importation of heavy dependencies on the main bundle.

> **Note:** The libraries `mermaid`, `cytoscape`, `wolfram`, and syntax highlighters (`prismjs`/`highlight.js`) are no longer imported in the current codebase. The issues below are historical and may no longer apply. Verify with `pnpm build` before investing time here.

### 1. Large chunk warnings
**Zdroj:** `index-[hash].js` a specifické assets.

**Doporučené řešení:** 
- Použít `vite` `manualChunks` (v `vite.config.ts`) a oddělit těžké knihovny do vlastních vendor chunků.
- Zkontrolovat `pnpm build` output pro aktuální seznam chunků překračujících 500kB.

**Priorita:** Nízká (zkontrolovat při příštím buildu).
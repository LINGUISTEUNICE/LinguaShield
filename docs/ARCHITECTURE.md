# LinguaShield — Architecture Overview

## Design Philosophy

LinguaShield is a single-file web application with zero runtime dependencies beyond a CDN-hosted charting library. This architecture was chosen deliberately:

1. **Privacy** — No server means no data transmission risk
2. **Deployability** — Works on any static host, including humanitarian environments with limited infrastructure
3. **Transparency** — All logic is readable in one file; no black boxes
4. **Reliability** — No API calls means no external points of failure

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │   HTML/CSS  │  │  JS Engine   │  │ Chart.js  │  │
│  │  (UI layer) │  │  (analysis)  │  │ (charts)  │  │
│  └─────────────┘  └──────────────┘  └───────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           Translation System (T object)      │   │
│  │    EN | FR | AR | ES | PT — 299 strings      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           localStorage (lang only)           │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         ↕ No server communication ↕
┌─────────────────────────────────────────────────────┐
│              CDN (read-only, no data sent)          │
│  Chart.js 4.4  ·  Google Fonts (Inter)              │
└─────────────────────────────────────────────────────┘
```

## Detection Engine

```
analyzeText(inputString)
│
├── For each of 8 SIGNAL_DEFINITIONS:
│   ├── Run each pattern against inputString
│   ├── Collect matches: {start, end, text, weight}
│   ├── Deduplicate overlapping matches (keep highest weight)
│   └── Compute star rating: 0 matches=0★, weight/3 capped at 5★
│
├── Global deduplication across all signals
│
├── riskScore = sum(risk match weights × 6), capped 100
├── trustScore = sum(trust match weights × 5), capped 100
├── netSignal = riskScore - trustScore
│
├── Classification:
│   ├── no signals → 'none'
│   ├── riskScore≥55 AND netSignal>15 → 'high'
│   ├── trustScore≥45 AND netSignal<-10 → 'legit'
│   └── else → 'verify'
│
├── confidence = f(score magnitude, match count)
│
├── Build highlightHtml:
│   └── Walk original text, inject <mark class="hh|hm|hg"> at match positions
│
└── Return: {classification, confidence, signalResults,
             riskSpans, trustSpans, highlightHtml, scores}
```

## Module Architecture

Each module is a `<div id="page-X">` element. Navigation is handled by `showPage(name)`:

```javascript
function showPage(name) {
  // 1. Hide all .page elements
  // 2. Show target page
  // 3. Update sidebar active state  
  // 4. Update currentPage (for Guide context-awareness)
  // 5. Update journey step indicator
}
```

## File Structure

```
linguashield/
├── index.html          # Entire application (HTML + CSS + JS)
├── src/engine/
│   └── engine.js       # Extracted standalone engine (testable)
├── docs/
│   ├── ARCHITECTURE.md # This file
│   ├── ETHICS.md       # Responsible AI assessment
│   └── RESEARCH.md     # Citations and research basis
└── README.md
```

## Production Upgrade Path

The prototype is designed so that production upgrades slot in without restructuring:

| Component | Prototype | Production |
|-----------|-----------|------------|
| Detection | Weighted regex lexicon | Fine-tuned multilingual BERT/XLM-RoBERTa |
| Storage | None (client-only) | PostgreSQL + RLS, zero PII |
| Community Intel | Static examples | Encrypted anonymized DB |
| Deployment | Static Vercel | AWS/GCP serverless, multi-region CDN |
| Languages | 5 languages UI | Native-speaker reviewed lexicons |
| File parsing | FileReader (TXT) | Client-side PDF.js + OCR |

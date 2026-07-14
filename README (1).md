<div align="center">

<img src="assets/cover.png" alt="LinguaShield Cover" width="100%"/>

# LinguaShield
### *Detecting Trafficking Before Exploitation Begins*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lingua--shield.vercel.app-0D9488?style=for-the-badge&logo=vercel&logoColor=white)](https://lingua-shield.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Austin%20AI%20Hub-Anti--Trafficking%20Hackathon-0F1F3D?style=for-the-badge)](https://lingua-shield.vercel.app)
[![Track](https://img.shields.io/badge/Track-Anticipate%20%26%20Disrupt-0D9488?style=for-the-badge)](https://lingua-shield.vercel.app)
[![Ethics](https://img.shields.io/badge/Ethics-Privacy%20by%20Design-5EEAD4?style=for-the-badge)](docs/ETHICS.md)

**Built by [Eunice Esi Essuman](https://github.com/yourusername) 🇬🇭 · [Nourhan Ameen](https://github.com/nourhanameen) 🇪🇬**

</div>

---

## The Problem

Human trafficking rarely begins with force. It begins with **language**.

A job offer. A recruitment message. A housing ad. A WhatsApp opportunity. Each one carefully worded to build trust, create urgency, extract documents and fees, and establish control — before the victim realises what is happening.

**40.3 million people** are estimated to be in modern slavery globally (ILO, 2022). The majority were recruited through **deceptive language** — not force at the point of initial contact. Existing tools activate *after* harm occurs: hotlines, shelters, case management. Almost nothing helps a job seeker, student, or migrant recognise exploitation language in real time, *before they respond*.

That gap is what LinguaShield addresses.

---

## The Solution

**LinguaShield** is a Linguistic Exploitation Early Warning System (LEEWS) — a 7-module platform that uses linguistic pattern analysis, interactive awareness storytelling, and evidence organisation tools to protect communities *before harm occurs*.

It runs entirely in the browser. No installation. No backend. No personal data ever leaves the user's device.

**→ [Try the live prototype](https://lingua-shield.vercel.app)**

---

## Screenshots

### Homepage
![Homepage](assets/screenshots/homepage.png)

### Risk Detector
![Risk Detector](assets/screenshots/risk-detector.png)

### Interactive Story
![Interactive Story](assets/screenshots/interactive-story.png)

### Evidence Timeline
![Evidence Timeline](assets/screenshots/evidence-timeline.png)

### Pattern Explorer
![Pattern Explorer](assets/screenshots/patterns.png)

### Community Intelligence
![Community Intel](assets/screenshots/community-intel.png)

### Awareness Spotlight
![Spotlight](assets/screenshots/spotlight.png)

### AI Guide Chatbot
![Guide](assets/screenshots/guide.png)

### Dashboard
![Dashboard](assets/screenshots/dashboard.png)

### Safety Center
![Safety Center](assets/screenshots/safety-center.png)

---

## Features

### 🔍 Risk Detector
Paste any job offer, recruitment message, or housing ad. LinguaShield analyzes it against **8 documented linguistic signal categories** derived from ILO Forced Labour Indicators, UNODC research, and Polaris Project documentation. Returns a risk classification (High Risk / Needs Verification / Likely Legitimate), confidence score, 6-stage **Recruitment Narrative Progression**, **Next-Step Forecast**, safer rewrite, and verification questions.

### 📖 Interactive Awareness Story
Branching narrative across **5 perspectives** — Student, Migrant Worker, Recruiter Tactics, NGO Caseworker, Labor Inspector. Wrong choices **block story progression** and explain the manipulation tactic. Only protective choices advance the story.

### 🗂️ Evidence Timeline
Upload real documents (TXT, EML). Client-side keyword extraction builds a structured chronological timeline with entity summaries, **passport warnings**, evidence gap alerts, and direct links to NGO support and legal aid.

### ✨ Awareness Spotlight
6 museum-style awareness cards covering passport rights, ILO Employer Pays Principle, warning signs, worker rights, verification checks, and how language evolves into exploitation. Grounded in ILO, UNODC, and Polaris Project research.

### 🕸️ Linguistic Pattern Explorer
4 tabs: Phrase Clusters (similarity scores), Frequency trends (Chart.js), **Language Evolution** (6-stage documented pathway), Network Map. Shows how exploitation language scales across community reports.

### 🌍 Community Intelligence
Anonymous report submission that feeds directly into the Pattern Explorer cluster counts — live session updates. Human moderation pipeline. No personal data stored.

### 🤖 AI Guide Chatbot
Context-aware floating assistant available on every page. Switches knowledge base per module. Ethical guardrails: never accuses individuals, never provides legal advice, always directs to trusted resources.

### 🛡️ Safety Center
Country-specific helplines, rights, NGO directory, and reporting guidance for 8 countries: Ghana, Nigeria, Kenya, South Africa, USA, UK, Philippines, India.

---

## Architecture

```
User Input (text / document upload)
            │
            ▼
┌─────────────────────────────────────┐
│     Client-Side Analysis Engine     │
│  Rule-based lexicon pattern match   │
│  8 signal categories (ILO-derived)  │
│  Weighted regex scoring             │
└──────────────┬──────────────────────┘
               │
       ┌───────┼────────────┐
       ▼       ▼            ▼
    Score   Classify   Narrative
   (0-100)  (3 tiers)  Progression
       │       │            │
       └───────┴────────────┘
                   │
                   ▼
         Advisory Output
   (verdict · forecast · rewrite
    · verification questions)

Everything runs in the browser.
Zero data leaves the user's device.
```

**Production Roadmap (V2+):**
- Fine-tuned **XLM-RoBERTa** multilingual transformer (100+ languages)
- **ONNX** export for on-device edge inference (offline-capable)
- **WebXR** VR awareness module
- Docker + Kubernetes containerisation
- End-to-end encrypted zero-knowledge evidence storage

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla JavaScript, CSS3 |
| Visualisation | Chart.js 4.4.1 |
| Document processing | FileReader API (client-side only) |
| NLP approach | Rule-based lexicon matching (8 signal categories) |
| Languages | English, French, Spanish, Portuguese, Arabic (RTL) |
| Deployment | Vercel (static, no backend) |
| Infrastructure | 100% client-side — no server, no database |

---

## Research Foundation

| Organisation | Source |
|---|---|
| **ILO** | Forced Labour Indicators (2012); Employer Pays Principle |
| **UNODC** | Global Report on Trafficking in Persons |
| **Polaris Project** | Human Trafficking Trends; Recruitment Fraud Research |
| **IOM** | Safe Migration Guidance; Ethical Recruitment Standards |
| **Walk Free** | Global Slavery Index |
| **Stop The Traffik** | Community awareness materials |

---

## Ethics & Privacy

| Commitment | Implementation |
|---|---|
| No victim identification | System never attempts to identify individuals |
| No accusations | No person or organisation named or implied guilty |
| No legal determinations | All output explicitly advisory only |
| No personal data collected | Zero storage, zero logging, zero tracking |
| No facial recognition | Not used — not permitted |
| Consent-first design | Consent gates on Evidence Timeline and Community Intel |
| Honest AI labeling | "Linguistic pattern analysis" — not "AI verdict" |
| False positive disclosure | Disclosed on every analysis output |

---

## Running Locally

LinguaShield requires **no installation, no dependencies, and no build step.**

```bash
# Clone the repository
git clone https://github.com/yourusername/linguashield.git

# Enter the project folder
cd linguashield

# Open in your browser — that is all
open index.html
```

Or visit the **[live prototype](https://lingua-shield.vercel.app)** — no setup required.

---

## Environment Variables

The current V1 prototype requires no environment variables — it is fully client-side.

For V2 production deployment:

```env
# V2 Production (not required for current prototype)
NEXT_PUBLIC_API_URL=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
ENCRYPTION_KEY=
```

---

## Repository Structure

```
linguashield/
├── index.html              # Complete application — single file, self-contained
├── README.md               # This file
├── LICENSE                 # MIT License
├── .gitignore
│
├── assets/
│   ├── cover.png           # Competition hero banner
│   ├── screenshots/        # All 10 module screenshots (real prototype renders)
│   │   ├── homepage.png
│   │   ├── risk-detector.png
│   │   ├── interactive-story.png
│   │   ├── evidence-timeline.png
│   │   ├── dashboard.png
│   │   ├── patterns.png
│   │   ├── community-intel.png
│   │   ├── spotlight.png
│   │   ├── guide.png
│   │   └── safety-center.png
│
└── docs/
    ├── ETHICS.md           # Full ethical framework
    ├── ARCHITECTURE.md     # Technical architecture & AI pipeline
    ├── PRIVACY.md          # Data handling & privacy policy
    ├── ROADMAP.md          # V2, V3, V4 development plan
    ├── pitch-deck.pdf      # Competition pitch deck
    └── demo-script.pdf     # Video production guide
```

---

## Roadmap

| Timeline | Version | Milestones |
|---|---|---|
| **Now** | V1 Prototype | Rule-based detector · 7 modules · 5 languages · No backend |
| 6 months | V2 Validated | XLM-RoBERTa ML model · NGO pilots · Secure backend |
| 12 months | V3 Deployable | VR module (WebXR) · Offline edge inference · 10 countries |
| 24 months | V4 Scale | WhatsApp/SMS layer · 50+ countries · IOM curriculum |

---

## Future Work

- Multilingual NLP model (XLM-RoBERTa fine-tuned on ILO/NGO datasets)
- NGO caseworker dashboard with secure evidence management
- WhatsApp and SMS detection layer for feature phone users
- Mobile application (Progressive Web App, offline-capable)
- WebXR VR awareness module for training centres
- IOM Safe Migration curriculum integration
- Survivor co-design process for V2 UX review
- Formal bias audit published before any production deployment

---

## Demo Video

**→ [Watch the 3-minute prototype demo](https://youtu.be/xxxxx)**

*Replace with your YouTube link after uploading.*

---

## Team

**Eunice Esi Essuman** 🇬🇭 — *Lead · Linguist · Prototype Builder*
BA in Linguistics & French. Language expert at the intersection of data science and natural language. Designed the full linguistic signal taxonomy and built the complete prototype from the ground up.

**Nourhan Ameen** 🇪🇬 — *ML Architecture · VR Design · Cloud Infrastructure*
General Computer Science, Cairo University, specialising in Artificial Intelligence. Designed the production ML pipeline (XLM-RoBERTa), VR awareness module (WebXR), and cloud deployment architecture.

---

## Competition

**Austin AI Hub — Anti-Trafficking AI Hackathon**
- Track: *Anticipate & Disrupt*
- Cross-track recognition: *Art Against Trafficking*

---

## Acknowledgements

Built on the research and documentation of the ILO, UNODC, IOM, Polaris Project, Walk Free Foundation, and Stop The Traffik. We are grateful to the NGO workers, caseworkers, labor inspectors, and survivors whose documented experiences made this signal taxonomy possible.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Exploitation begins with language. LinguaShield helps communities read it.**

[🌐 Live Demo](https://lingua-shield.vercel.app) · [⚖️ Ethics](docs/ETHICS.md) · [🏗️ Architecture](docs/ARCHITECTURE.md) · [🗺️ Roadmap](docs/ROADMAP.md)

*LinguaShield is an educational prototype. All output is advisory only. Always consult a qualified professional, NGO, or labor authority before acting on any analysis.*

</div>

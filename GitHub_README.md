<div align="center">

# 🛡️ LinguaShield
### *Where language becomes an early warning system*

**Exploitation begins with language. LinguaShield helps communities read it.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lingua--shield.vercel.app-0D9488?style=for-the-badge&logo=vercel)](https://lingua-shield.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Track](https://img.shields.io/badge/Austin%20AI%20Hub-Anticipate%20%26%20Disrupt-0F1F3D?style=for-the-badge)](https://lingua-shield.vercel.app)
[![Ethics](https://img.shields.io/badge/Ethics-Privacy%20by%20Design-0D9488?style=for-the-badge)](ETHICS.md)

---


*Austin AI Hub · Anti-Trafficking AI Hackathon · Track: Anticipate & Disrupt*

</div>

---

## The Problem

When we think about human trafficking, we tend to picture force.

But for most people, it begins much earlier — with **a message**.

A job offer. A housing ad. A travel opportunity. A recruitment message on WhatsApp. Each one carefully worded to build trust, create urgency, extract documents and fees, and establish control — before the victim realizes what is happening.

**40.3 million people** are estimated to be in modern slavery globally (ILO, 2022). The majority were recruited through **deceptive language** — not through force at the point of initial contact.

Existing tools — hotlines, shelters, case management systems — activate *after* harm occurs. There is almost nothing that helps a job seeker, student, or migrant recognize exploitation language **in real time, before they respond**.

LinguaShield addresses that gap.

---

## What It Does

LinguaShield is a **Linguistic Exploitation Early Warning System (LEEWS)** — a 7-module web application that uses linguistic pattern analysis, interactive awareness storytelling, and evidence organization tools.

It runs entirely in the browser. No installation. No backend. No personal data ever leaves the user's device.

**[→ Try the live prototype](https://lingua-shield.vercel.app)**

---

## Modules

### 🔍 Risk Detector

Paste any job offer, recruitment message, housing ad, or travel opportunity. LinguaShield analyzes it against **8 documented linguistic signal categories** derived from ILO Forced Labour Indicators, UNODC research, and Polaris Project documentation.

**What you get:**
- Risk classification: High Risk / Needs Verification / Likely Legitimate
- Confidence score with transparent reasoning
- **Recruitment Narrative Progression** — a 6-stage escalation map showing where the message sits on the documented exploitation pathway
- **Next-Step Forecast** — what tactics are likely to follow based on detected patterns
- Safer rewrite of the message
- Verification questions to send back to the recruiter

**The 8 signal categories:**

| Category | What it detects |
|---|---|
| Urgency Pressure | Artificial time pressure to prevent research |
| Authority Manipulation | Unverifiable authority claims, false normalization |
| Document Control | Passport and ID requests before contracts |
| Financial Pressure | Upfront fees violating ILO Employer Pays Principle |
| Dependency Creation | Housing/income tied to employer for leverage |
| Isolation Tactics | Discouraging consultation with trusted people |
| Emotional Manipulation | False social proof, dream-job framing |
| Verification Transparency | Positive signals indicating legitimate structure |

---

### 📖 Awareness Story

A branching visual narrative across **5 perspectives**:

| Perspective | Focus |
|---|---|
| Student (Amara) | Recognizing recruitment fraud before travelling |
| Migrant Worker (Tunde) | International labor recruitment risks and rights |
| Recruiter Tactics | Educational deconstruction of manipulation scripts |
| NGO Caseworker (Folasade) | Trauma-informed intake and evidence triage |
| Labor Inspector | Evidence-based investigation from aggregated reports |

Wrong choices **block story progression** and explain the manipulation tactic used. Only protective choices unlock the next scene. Every perspective ends with a learning summary and reflection questions.

---

### 🗂️ Evidence Timeline Builder

Upload real TXT or EML files. LinguaShield performs **client-side keyword extraction** — no document content is ever transmitted — and builds a structured chronological timeline with:

- Entity summary: events, organizations, payments, documents, gaps
- Automatic **passport warning** when document control language is detected
- **Evidence gap alerts** flagging undocumented time periods
- Action buttons linking directly to NGO support, legal aid, and labor rights resources

*All processing happens entirely on the user's device. Nothing is transmitted.*

---

### 🕸️ Linguistic Pattern Explorer

Four tabs visualizing exploitation language at scale:

- **Phrase Clusters** — similarity scores, report counts, frequency bars, stage labels
- **Frequency Trends** — Chart.js visualization of phrase patterns over time
- **Language Evolution** — 6-stage visual flow showing how language escalates toward control
- **Network Map** — SVG visualization of scam network node structures

---

### 🌍 Community Intelligence

Anonymous report submission that feeds directly into the Pattern Explorer:
- Reports appear immediately in the visible community feed (session-only, clearly labeled)
- Matching pattern cluster report counts update live
- All submissions labeled as prototype simulation — no false persistence claimed

---

### 🛡️ Safety Center

Country-specific resources for **8 countries**: Ghana, Nigeria, Kenya, South Africa, USA, UK, Philippines, India.

Tabs: Emergency · Report · Rights · Workers · Transparency

Includes helplines, NGO directory, worker rights (ILO standards), reporting guidance, and full transparency statement.

---

### 🤖 LinguaShield Guide

Context-aware floating chatbot available on every page. Switches knowledge base based on current module. Covers 8 page contexts. Ethical guardrails prevent legal advice, accusations, or false certainty.

---

## Research Foundation

LinguaShield's signal taxonomy and ethical framework are grounded in:

| Organization | Source Used |
|---|---|
| **ILO** | Forced Labour Indicators (2012); Employer Pays Principle |
| **UNODC** | Global Report on Trafficking in Persons |
| **Polaris Project** | Human Trafficking Trends; Recruitment Fraud Research |
| **IOM** | Safe Migration Guidance; Ethical Recruitment Standards |
| **Walk Free** | Global Slavery Index |
| **Stop The Traffik** | Community awareness materials |

---

## AI Pipeline

### V1 (Current Prototype)
```
Input text
    │
    ▼
Client-side lexicon scan
8 signal category patterns
Derived from ILO/UNODC/Polaris
    │
    ├── Score (0–100 per category)
    ├── Classify (3 tiers + confidence)
    ├── Narrative progression (6-stage map)
    └── Advisory output (verdict + forecast + rewrite)

Everything runs in the browser.
No data ever leaves the user's device.
```

**Approach:** Rule-based NLP (lexicon matching). Deliberately chosen because:
- Every flagged phrase is explainable — the system can say exactly why
- No black box, no proprietary model — fully auditable
- No training data privacy risk
- Appropriate for a high-stakes advisory context

### V2 (Production Roadmap)
- Fine-tuned **XLM-RoBERTa** — multilingual transformer, 100+ languages
- Training data: ILO case documentation + anonymized NGO messages + synthetic augmentation
- **ONNX export** for on-device edge inference — works offline in low-bandwidth regions
- Confidence calibration via **Platt scaling** — honest uncertainty quantification
- Rule-based system maintained as explainability cross-check alongside ML model

### V3 (12-month roadmap)
- **WebXR VR awareness module** — browser-native, no headset required
- Immersive exploitation scenario mapped to 6-stage narrative progression
- Docker + Kubernetes containerization
- End-to-end encrypted evidence storage (zero-knowledge architecture)

---

## Ethics & Privacy

LinguaShield was designed with a **prevention-first, survivor-centered, privacy-by-design** approach. These are not features. They are constraints.

| Commitment | Implementation |
|---|---|
| No victim identification | System never attempts to identify individuals |
| No accusations | No individual or organization is named or implied guilty |
| No legal determinations | All output is explicitly advisory only |
| No personal data collected | Zero storage, zero logging, zero tracking |
| No facial recognition | Not used — not permitted in this system |
| No surveillance | Prevention only — not monitoring |
| Consent-first design | Consent gates on Evidence Timeline and Community Intel |
| Transparent limitations | False positive risk disclosed on every analysis |
| Human oversight required | Every output recommends independent verification |
| Honest AI labeling | "Linguistic pattern analysis" — never "AI verdict" |

**→ See [ETHICS.md](ETHICS.md) for full ethical framework**
**→ See [PRIVACY.md](PRIVACY.md) for data handling details**

---

## Tech Stack

### V1 Prototype
```
Frontend:       HTML5, Vanilla JavaScript, CSS3
Visualization:  Chart.js 4.4.1
File handling:  FileReader API (client-side only)
NLP:            Rule-based lexicon matching
Languages:      English, French, Spanish, Portuguese, Arabic (RTL)
Infrastructure: Client-side only — no backend, no database, no API keys
Deployment:     Any static host (Vercel, GitHub Pages, Netlify)
```

### V2 Production (Planned)
```
ML model:       Fine-tuned XLM-RoBERTa (multilingual transformer)
Inference:      ONNX export — on-device, offline-capable
Backend:        Docker + Kubernetes (containerized, portable)
Storage:        End-to-end encrypted, zero-knowledge architecture
Cloud:          AWS / Azure multi-region with data residency controls
VR:             WebXR — browser-native, no app required
```

---

## Installation

LinguaShield requires no installation, no dependencies, and no build step.

```bash
# Clone the repository
git clone https://github.com/yourusername/linguashield.git

# Enter the project folder
cd linguashield

# Open in browser — that is all
open index.html
```

Or visit the **[live prototype](https://lingua-shield.vercel.app)** — no setup required.

---

## Repository Structure

```
linguashield/
│
├── index.html              # Complete application — single file, self-contained
├── README.md               # This file
├── LICENSE                 # MIT License
├── ETHICS.md               # Full ethical framework and commitments
├── PRIVACY.md              # Data handling and privacy architecture
├── SECURITY.md             # Security model and disclosure policy
├── ARCHITECTURE.md         # Technical architecture and AI pipeline
├── RESEARCH.md             # Research foundation and signal taxonomy sources
├── ROADMAP.md              # V2, V3, V4 development plan
├── CONTRIBUTING.md         # How to contribute
├── CODE_OF_CONDUCT.md      # Community standards
├── CHANGELOG.md            # Version history
│
├── docs/
│   ├── demo_video_script.md    # Full video production guide
│   ├── signal_taxonomy.md      # 8 signal categories with sources
│   └── deployment_guide.md     # How to deploy for NGO use
│
├── assets/
│   ├── logo/
│   │   ├── linguashield_logo.png
│   │   └── linguashield_logo.svg
│   ├── screenshots/
│   │   ├── 01_homepage.png
│   │   ├── 02_risk_detector.png
│   │   ├── 03_awareness_story.png
│   │   ├── 04_evidence_timeline.png
│   │   └── 05_safety_center.png
│   └── cover/
│       └── linguashield_cover.png
│
└── media/
    ├── pitch_deck.pdf
    └── demo_video_link.txt
```

---

## Screenshots

| Module | Preview |
|---|---|
| Homepage | ![Homepage](assets/screenshots/01_homepage.png) |
| Risk Detector | ![Risk Detector](assets/screenshots/02_risk_detector.png) |
| Awareness Story | ![Story](assets/screenshots/03_awareness_story.png) |
| Evidence Timeline | ![Timeline](assets/screenshots/04_evidence_timeline.png) |
| Safety Center | ![Safety](assets/screenshots/05_safety_center.png) |

---

## Roadmap

| Timeline | Version | Key Milestones |
|---|---|---|
| **Now** | V1 Prototype | Rule-based detection · 7 modules · 5 languages · No backend |
| 6 months | V2 Validated | XLM-RoBERTa ML model · NGO pilot deployments · Secure backend |
| 12 months | V3 Deployable | VR module (WebXR) · Offline edge inference · 10 country deployments |
| 24 months | V4 Scale | WhatsApp/SMS layer · 50+ countries · IOM curriculum integration |

**→ See [ROADMAP.md](ROADMAP.md) for detailed milestone breakdown**

---

## Team

**Eunice Esi Essuman** 🇬🇭
BA in Linguistics & French. Language expert working at the intersection of data science and natural language. Designed the linguistic signal taxonomy and built the complete prototype. The signal categories, narrative progression framework, and educational story module are grounded in her linguistics background.



---

## Acknowledgements

This project stands on the research and documentation of organizations that have spent decades understanding how exploitation operates:

- **International Labour Organization (ILO)** — Forced Labour Indicators and Employer Pays Principle
- **UNODC** — Global Report on Trafficking in Persons
- **Polaris Project** — Human Trafficking Trends and Recruitment Fraud Research
- **International Organization for Migration (IOM)** — Safe Migration Guidance
- **Walk Free Foundation** — Global Slavery Index
- **Stop The Traffik** — Community awareness methodologies

I am grateful to the NGO workers, caseworkers, labor inspectors, and survivors whose documented experiences made this signal taxonomy possible.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Demo Video

**→ [Watch the 3-minute prototype demo](https://youtu.be/MZ2L1kvqmp4?si=zRjiwLUmlPq2gh6C)**

---

<div align="center">

**Exploitation begins with language. LinguaShield helps communities read it.**

[🌐 Live Demo](https://lingua-shield.vercel.app) · [⚖️ Ethics](ETHICS.md) · [🏗️ Architecture](ARCHITECTURE.md) · [🗺️ Roadmap](ROADMAP.md)

*LinguaShield is an educational prototype. All output is advisory only. Always consult a qualified professional, NGO, or labor authority before acting on any analysis.*

</div>

# Ethics & Responsible AI — LinguaShield

## Alignment with UN Guiding Principles on Business and Human Rights

LinguaShield is designed against the UN Guiding Principles on Business and Human Rights, specifically:
- **Pillar 1** (State duty to protect): Tool supports government and NGO enforcement capacity
- **Pillar 2** (Corporate responsibility to respect): No harm through data collection, false accusation, or re-identification  
- **Pillar 3** (Access to remedy): Safety Center connects users to real support pathways

## What LinguaShield Will Never Do

| Prohibition | Reason |
|-------------|--------|
| Identify victims or survivors | Re-identification causes direct harm and chills reporting |
| Accuse named individuals or organizations | Tool is advisory only — determinations require human judgment and legal process |
| Determine criminal guilt | Not within the scope of linguistic pattern analysis |
| Provide legal advice | Requires qualified professionals with jurisdiction-specific knowledge |
| Replace emergency services | Technical tools cannot substitute for crisis response |
| Expose personal data | Privacy is a non-negotiable human right |
| Perform facial recognition | Explicitly prohibited in design |

## Privacy by Design — 7 Principles Applied

1. **Proactive, not reactive** — Privacy protections built before any data flows, not added after
2. **Privacy as default** — No data is collected unless user explicitly consents and submits
3. **Privacy embedded in design** — 100% client-side processing; no server endpoint exists to receive data
4. **Full functionality** — Privacy protections do not reduce features
5. **End-to-end security** — Community submissions are anonymized before any storage occurs
6. **Visibility and transparency** — All limitations disclosed in-app; source code is open
7. **Respect for user privacy** — Users control all their data; nothing is retained after session ends

## Survivor-Centered Design Principles

- No gratuitous depictions of harm or exploitation
- Educational reconstructions clearly labeled as fictional
- No real case data used without explicit verified consent
- Dignity-first language throughout all content
- Trauma-informed phrasing in all educational content
- Users are framed as agents of protection, not passive victims

## Known Limitations — Disclosed Honestly

| Limitation | Severity | Mitigation |
|------------|----------|------------|
| False positives possible | Medium | Balanced scoring; explicit in-app disclosure; human review recommended |
| Non-English detection lower accuracy | Medium | Disclosed in-app; Phase 1 roadmap includes native-speaker lexicon review |
| Rule-based, not trained ML | Low for prototype | Production roadmap includes supervised multilingual BERT model |
| Cultural context incomplete | Medium | Community Intelligence captures regional patterns; bias review planned |
| 5 modules English-only UI | Low | Disclosed with translated notice; full translation in Phase 2 |

## Bias Assessment

The current lexicon is strongest for English-language recruitment fraud in West African and Western contexts. It may:
- Under-detect manipulation language in Arabic, French, Portuguese, Spanish
- Over-detect legitimate formal language in some professional sectors
- Miss culturally specific manipulation patterns not documented in English-language research

**Mitigation plan:** Native-speaker lexicon review in Phase 1; community reports in additional languages feed lexicon expansion.

## Data Governance

| Data type | Collection | Storage | Retention |
|-----------|-----------|---------|-----------|
| Detector input text | None — client-side only | Never stored | N/A |
| Uploaded evidence files | None — FileReader API only | Never stored | N/A |
| Community submissions | With explicit consent | Anonymized only | Until withdrawn |
| User preferences (language) | localStorage only | Device only | User-controlled |

## Research Ethics

All story content, educational reconstructions, and awareness materials:
- Are clearly labeled as fictional/educational
- Do not represent specific real individuals
- Are inspired by documented patterns from published institutional research (ILO, UNODC, Polaris)
- Have been designed to build awareness without sensationalizing or retraumatizing

## Contact

For ethics concerns, responsible disclosure, or survivor feedback:  
Open an issue on this repository with the label `ethics`.

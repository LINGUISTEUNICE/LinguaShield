# LinguaShield Research Foundation
## Evidence-Based Design Document

**Prepared for:** LinguaShield AI — Datathon Prototype  
**Review Panel:** Anti-trafficking researchers, human-rights lawyers, NGO practitioners, survivor-centered design specialists, linguists, AI ethics researchers  
**Date:** June 2026  
**Classification:** Educational prototype documentation

---

## Executive Summary

LinguaShield is designed as a Linguistic Exploitation Early Warning System (LEEWS) — a prevention and education platform that helps people recognize the linguistic markers of recruitment fraud, labor trafficking, housing scams, and coercive communication before harm occurs.

This research review draws on peer-reviewed literature, UN agency reports, and practitioner evidence to establish the design requirements, known risks, and ethical constraints that must govern the system's architecture. The core finding is that language analysis for exploitation prevention is both valuable and risky — valuable because exploitation reliably begins with deceptive communication, risky because automated classification can produce false positives that harm legitimate workers, recruiters, and organizations.

The central design principle that follows from this research: **LinguaShield must function as an educational aid to human judgment, not a replacement for it.**

---

## Key Research Findings

### 1. Exploitation Begins With Language — and Specific Linguistic Patterns Are Documentable

The International Labour Organization (ILO) 2022 Global Estimates of Modern Slavery identifies **49.6 million people living in modern slavery** on any given day in 2021 — 27.6 million in forced labour. Critically for LinguaShield's design, the ILO documents that **recruitment is the primary entry point** for labour trafficking across all major sectors.

The Polaris Project's "The Typology of Modern Slavery" (2017) — analyzing 32,000+ cases — identifies distinct linguistic recruitment patterns by industry, including:
- Hospitality: "All-inclusive" offers with accommodation tied to employment
- Agriculture: Vague location descriptions, transport controlled by recruiter  
- Domestic work: Informal contracts, "family member" framing to normalize control
- Event work: Artificial urgency tied to major events (sports, festivals)

**ILO Indicators of Forced Labour (2012, updated 2014)** identify 11 key indicators, several of which are detectable through language analysis:
- Deceptive recruitment (false promises about work, location, salary)
- Debt bondage framing in written communications  
- Document retention threats embedded in contract language
- Restriction of movement embedded in accommodation terms

*Source: ILO, "Hard to See, Harder to Count: Survey Guidelines to Estimate Forced Labour of Adults and Children" (2012). https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---declaration/documents/publication/wcms_182096.pdf*

### 2. Fee-Charging Is the Single Most Consistent Indicator — But Context Matters

The ILO's "Eliminating Recruitment Fees Charged to Workers" (2018) establishes that **recruitment fee charging is the most consistent predictor of subsequent exploitation** across regions and sectors. The document notes that in migration corridors from South and Southeast Asia to the Gulf states, 80–90% of trafficked workers paid recruitment fees prior to departure.

However — and this is critical for LinguaShield's classifier — **not all recruitment fees are illegal or exploitative in all jurisdictions.** Some countries permit specific, regulated fees for specific services. The ILO Dhaka Principles and the ILO General Principles and Operational Guidelines for Fair Recruitment (2016) define the "employer pays" principle as the global standard, but implementation varies.

**Design implication:** The system must NOT automatically classify any mention of fees as high-risk. It must consider: fee amount relative to salary, what service the fee claims to cover, whether a receipt and refund policy are stated, and whether the fee is disclosed transparently before commitment.

*Source: ILO, "General Principles and Operational Guidelines for Fair Recruitment and Definition of Recruitment Fees and Related Costs" (2019). https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---declaration/documents/publication/wcms_536755.pdf*

### 3. Passport/Document Control Is a Near-Universal Trafficking Indicator

Across the UNODC Global Report on Trafficking in Persons (2022), document confiscation appears in the top five control methods used across all major destination regions. The report notes that document confiscation often begins **before departure** — through digital document requests in recruitment messages.

The Walk Free Foundation Global Slavery Index 2023 identifies passport confiscation as particularly prevalent in domestic work, construction, and hospitality sectors in Gulf Cooperation Council countries and in event-based work globally.

**For LinguaShield:** A request for passport documents before a formal employment contract is signed represents a documentable linguistic exploitation indicator. However, the system must note that some visa application processes legitimately require passport details early — the distinction is whether the employer or a licensed visa agency (not the recruiter personally) is receiving the document.

*Source: UNODC, "Global Report on Trafficking in Persons 2022." https://www.unodc.org/unodc/data-and-analysis/glotip.html*

### 4. Urgency Language Is a Documented Manipulation Tactic

Stop The Traffik's intelligence reporting and Polaris Project case analyses both document that **artificial urgency is one of the most consistently used psychological pressure tactics** in recruitment fraud. Phrases like "decide today," "limited spots," "position fills fast," and "final opportunity" appear in documented recruitment scam communications across all sectors analyzed.

Academic research supports this finding: Cialdini's research on influence (updated meta-analysis: Milkman et al., 2022, PNAS) confirms that artificial scarcity and urgency are reliable manipulation vectors. Exploitation-specific applications are documented in:

- Zimmerman & Kiss (2017): "Human Trafficking and Exploitation: A Global Health Concern." PLOS Medicine.
- Hahn & Kang (2019): "Linguistic Markers of Deception in Recruitment Communications." Journal of Applied Linguistics.

**For LinguaShield:** Urgency language should increase a risk score but should not be determinative. Many legitimate seasonal or event-based recruitment campaigns also use urgency language.

### 5. Language Bias in Automated Risk Classification Is a Documented Harm

This is the most important ethical finding for LinguaShield's design.

Mehrabi et al. (2021), "A Survey on Bias and Fairness in Machine Learning" (ACM Computing Surveys), documents that NLP systems trained primarily on English text systematically misclassify:
- Non-standard English dialects (AAVE, South Asian English, African English varieties)
- Code-switched multilingual text
- Culturally specific communication norms that differ from Anglo-American professional standards

For trafficking prevention specifically: **a system that over-classifies informal or non-standard communication as "suspicious" may discourage legitimate economic opportunities for the exact communities it aims to protect.** If every recruitment message from a small local employer using informal language is flagged as high-risk, the system becomes a barrier to labor market participation rather than a protection tool.

**Design implication:** The classification system must:
1. Look actively for positive trust signals, not just negative risk signals
2. Acknowledge that informal language ≠ deceptive language
3. Apply higher confidence thresholds before displaying high-risk classifications
4. Display bias warnings prominently for all non-English analysis

*Source: Mehrabi, N. et al. (2021). "A Survey on Bias and Fairness in Machine Learning." ACM Computing Surveys, 54(6). https://dl.acm.org/doi/10.1145/3457607*

### 6. Survivor-Centered Design Principles Are Established in the Literature

The International Organization for Migration's "IOM Handbook on Protection and Assistance for Migrants Vulnerable to Violence, Exploitation and Trafficking" (2022) establishes the following survivor-centered design principles relevant to digital tools:

1. **Agency preservation:** Tools should support autonomous decision-making, not make decisions for users
2. **Non-stigmatization:** Classification systems must not label individuals as victims or potential victims
3. **Confidentiality by default:** All interaction data must be treated as sensitive
4. **Trauma-informed presentation:** Content must not be sensationalized or retraumatizing
5. **Accessible across literacy levels:** Language should be clear for users with limited formal education
6. **Cultural competency:** Tools should acknowledge cultural differences in communication norms

*Source: IOM, "Handbook on Protection and Assistance for Migrants Vulnerable to Violence, Exploitation and Trafficking" (2022). https://publications.iom.int/books/iom-handbook-protection-and-assistance-migrants-vulnerable-violence-exploitation-and-trafficking*

---

## Top Three Research Questions

**Q1: Does automated linguistic risk classification of job offers create more harm than benefit through false positives?**

*Finding:* The evidence suggests that without balanced scoring (looking for trust signals alongside risk signals), automated classification creates meaningful harm by flagging legitimate opportunities — particularly from informal employers and in non-English languages. The solution is a three-category classification system (Likely Legitimate / Needs Verification / High Risk) that actively weights positive evidence.

**Q2: What are the safest and most effective ways to present risk information to vulnerable users without causing anxiety, stigma, or inappropriate action?**

*Finding:* IOM and Polaris practitioner guidance consistently recommends: framing around questions to ask rather than accusations to make; providing verification pathways rather than binary verdicts; emphasizing user agency throughout; and always directing to human support alongside any automated output.

**Q3: How can a multilingual platform address language bias while still providing useful analysis across languages?**

*Finding:* Honest disclosure of limitations is more protective than false confidence. The system should display language-specific confidence scores, explicitly note that accuracy is lower in non-English languages, and recommend human review for all non-English assessments. This is more ethical and more useful than pretending parity exists.

---

## Design Recommendations from Research

1. **Implement three-category balanced classification** — never default to "high risk" for all submissions
2. **Weight trust signals equally with risk signals** — actively look for legitimacy indicators
3. **Display confidence percentages with every classification** — users deserve to know the system's certainty level
4. **Require human review warning on every risk output** — no automated output should be treated as definitive
5. **Prominent language bias disclosure for non-English** — more prominent than current implementation
6. **Verification pathways over verdicts** — frame all outputs around "here's how to check" not "this is bad"
7. **Community intelligence must have explicit anonymization and moderation disclosure** — users submitting must know what happens to their submission
8. **Evidence timeline must operate offline/locally where possible** — document organization for vulnerable users should not require cloud connectivity
9. **Safety center resources must carry explicit "verify before use" warnings** — resources change and incorrect numbers cause harm
10. **Story module must not depict survivors as passive victims** — Amara should have agency throughout

---

## Citations

- ILO (2022). *Global Estimates of Modern Slavery: Forced Labour and Forced Marriage.* Geneva: ILO. https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---ipec/documents/publication/wcms_854733.pdf
- UNODC (2022). *Global Report on Trafficking in Persons.* Vienna: UNODC. https://www.unodc.org/unodc/data-and-analysis/glotip.html
- Polaris Project (2017). *The Typology of Modern Slavery.* Washington DC: Polaris. https://polarisproject.org/resources/the-typology-of-modern-slavery/
- ILO (2014). *Indicators of Forced Labour.* Geneva: ILO. https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---declaration/documents/publication/wcms_203832.pdf
- ILO (2019). *General Principles and Operational Guidelines for Fair Recruitment.* Geneva: ILO. https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---declaration/documents/publication/wcms_536755.pdf
- Walk Free Foundation (2023). *Global Slavery Index 2023.* Perth: Minderoo Foundation. https://www.walkfree.org/global-slavery-index/
- IOM (2022). *Handbook on Protection and Assistance for Migrants Vulnerable to Violence, Exploitation and Trafficking.* Geneva: IOM. https://publications.iom.int
- Mehrabi, N. et al. (2021). "A Survey on Bias and Fairness in Machine Learning." *ACM Computing Surveys,* 54(6). https://dl.acm.org/doi/10.1145/3457607
- Zimmerman, C. & Kiss, L. (2017). "Human Trafficking and Exploitation: A Global Health Concern." *PLOS Medicine* 14(11). https://doi.org/10.1371/journal.pmed.1002437
- U.S. Department of State (2023). *Trafficking in Persons Report.* Washington DC: DoS. https://www.state.gov/trafficking-in-persons-report/

---

*This document is part of the LinguaShield datathon prototype documentation. All design decisions in the prototype are traceable to findings in this research review.*

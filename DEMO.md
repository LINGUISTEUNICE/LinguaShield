# Demo Guide — LinguaShield

Live: **https://lingua-shield.vercel.app**

## Quick Test Cases

### Test 1 — High Risk Detection
Paste into Risk Detector:
```
Urgent overseas job. No experience needed. Send passport copy. Registration fee required.
```
Expected: HIGH RISK, ~84% confidence. Document Control ★★★★, Financial Pressure ★★★, Urgency ★★

### Test 2 — Legitimate Detection  
Paste into Risk Detector:
```
Oxfam is recruiting a Program Officer. No fees required at any stage. Registration number: UK-CH-202918. Apply via careers.oxfam.org by July 31.
```
Expected: LIKELY LEGITIMATE, ~80% confidence. Verification Transparency ★★★★★

### Test 3 — No Indicators
Paste into Risk Detector:
```
Bananas are blue and elephants work in hospitals.
```
Expected: NO EXPLOITATION INDICATORS DETECTED

### Test 4 — Balanced/Borderline
Paste into Risk Detector:
```
Hospitality roles available. Salary $1,800-2,200/month. Accommodation provided, cost deducted from paycheck. Apply by emailing jobs@festivalstaffing.com. Decision needed within 48 hours.
```
Expected: NEEDS VERIFICATION — positive salary signal offset by accommodation dependency and urgency

## Module Walkthrough

1. **Risk Detector** → paste any text → analyze → check Linguistic Signals panel → expand Input Verification
2. **Awareness Stories** → choose Student → make a wrong choice → observe Risk Alert → choose correctly → complete
3. **Evidence Timeline** → accept consent → upload any .txt file → observe content-aware extraction
4. **Community Intel** → browse feed → note intelligence pipeline visualization
5. **Patterns** → paste job ad in Similarity Engine → compare against clusters
6. **AI Guide** → click floating bubble → ask "Why was this flagged?"
7. **Safety Center** → change country selector → observe resources update

## Language Switching

1. Click language selector (top right)
2. Select FR, AR, ES, or PT
3. Full UI switches — detector, navigation, safety resources, story labels
4. Language persists across page navigation

/**
 * LinguaShield Detection Engine — Standalone
 * Austin AI Anti-Trafficking Competition 2025
 * Eunice Esi Essuman — Solo Submission
 *
 * Usage (Node.js):
 *   const { analyzeText } = require('./engine.js');
 *   const result = analyzeText("Send passport copy. Registration fee required.");
 *   console.log(result.classification); // 'high'
 *   console.log(result.confidence);     // 84
 */

const SIGNAL_DEFINITIONS = {
  urgency: {
    label: 'Urgency Language', kind: 'risk',
    desc: 'Pressure to act within an artificially short window, designed to prevent research or consultation with trusted people.',
    patterns: [
      { re: /\b(urgent|urgently|immediately|asap|right away|act now|hurry)\b/gi, w: 2 },
      { re: /\b(within|in)\s+(\d{1,2})\s*(hour|hr)s?\b/gi, w: 3 },
      { re: /\bdecide (now|today)\b/gi, w: 3 },
      { re: /\b(limited (spots|positions|slots|time)|positions? (filling|almost full)|first come)\b/gi, w: 2 },
      { re: /\bdon.t (wait|miss|delay)\b/gi, w: 2 },
    ]
  },
  authority: {
    label: 'Authority Manipulation', kind: 'risk',
    desc: 'Invoking unverifiable authority, official-sounding procedure, or institutional language to discourage questioning.',
    patterns: [
      { re: /\b(standard procedure|company policy|official process|required by (law|regulation|government))\b/gi, w: 3 },
      { re: /\b(every (company|employer) does this|this is normal|don.t overthink)\b/gi, w: 3 },
      { re: /\bnew (government )?regulation\b/gi, w: 3 },
      { re: /\b(authorized|certified|approved by)\b/gi, w: 1 },
    ]
  },
  dependency: {
    label: 'Dependency Creation', kind: 'risk',
    desc: 'Language that ties housing, income, immigration status, or basic needs to continued compliance — building leverage over the person.',
    patterns: [
      { re: /\b(accommodation|housing) (is )?(tied to|provided by|deducted from)\b/gi, w: 3 },
      { re: /\b(penalty rent|owe.{0,15}(month|rent)|leave early)\b/gi, w: 3 },
      { re: /\btraining bond\b/gi, w: 3 },
      { re: /\b(no contract (needed|required)|without a contract)\b/gi, w: 2 },
      { re: /\byou.ve already (invested|come this far|paid)\b/gi, w: 3 },
    ]
  },
  isolation: {
    label: 'Isolation Tactics', kind: 'risk',
    desc: 'Language discouraging the person from consulting others, seeking second opinions, or involving outside parties.',
    patterns: [
      { re: /\b(don.t tell|keep this (private|between us|confidential)|just between)\b/gi, w: 4 },
      { re: /\b(no need to (ask|check with)|you don.t need (anyone|permission))\b/gi, w: 4 },
      { re: /\bwhatsapp only\b/gi, w: 1 },
      { re: /\b(trust me|just trust)\b/gi, w: 2 },
    ]
  },
  documentControl: {
    label: 'Document Control Risk', kind: 'risk',
    desc: 'Requests to surrender identity documents, passports, or originals before any formal agreement exists — a core trafficking and coercion indicator.',
    patterns: [
      { re: /\b(send|provide|submit|scan of|copy of)\s+(your\s+)?(passport|national id|nin|identity card)/gi, w: 4 },
      { re: /\b(hold|holds|holding|retain|keep)\s+(your\s+)?passport/gi, w: 5 },
      { re: /\bbirth certificate\b/gi, w: 2 },
      { re: /\boriginal documents?\b/gi, w: 3 },
    ]
  },
  financialPressure: {
    label: 'Financial Pressure', kind: 'risk',
    desc: 'Requests for payment, fees, or deposits before employment or services are confirmed — contrary to the ILO Employer Pays Principle.',
    patterns: [
      { re: /(?<!no\s)(?<!any\s)\b(registration|processing|application|visa|medical|clearance|equipment|training)\s+fee/gi, w: 4 },
      { re: /\bpay\s+(a|an|\$|\d|GH₵|€|£)/gi, w: 3 },
      { re: /\b(refundable|non-refundable)\s+(deposit|fee)/gi, w: 3 },
      { re: /\bsecurity deposit\b/gi, w: 2 },
      { re: /\$\s?\d{3,}\s?\/\s?(day|daily)/gi, w: 3 },
    ]
  },
  emotionalManipulation: {
    label: 'Emotional Manipulation', kind: 'risk',
    desc: 'Appeals to excitement, fear of missing out, gratitude, or guilt designed to override careful judgment.',
    patterns: [
      { re: /\b(once.in.a.lifetime|life.changing|dream (job|opportunity))\b/gi, w: 3 },
      { re: /\b(guaranteed|guarantee)\s+(income|employment|job|earnings)/gi, w: 2 },
      { re: /\bno experience (needed|required|necessary)\b/gi, w: 1 },
      { re: /\b(lucky|chosen|selected) (one|few|candidates?)\b/gi, w: 2 },
    ]
  },
  verificationTransparency: {
    label: 'Verification Transparency', kind: 'trust',
    desc: 'Concrete, independently checkable details — registration numbers, official domains, named contacts — that support legitimacy.',
    patterns: [
      { re: /\bregistration (number|no\.?)\s*[:#]?\s*[A-Z0-9\-]{4,}/gi, w: 5 },
      { re: /\bcareers?\.[a-z0-9\-]+\.(com|org|gov)\b/gi, w: 4 },
      { re: /@([a-z0-9\-]+)\.(org|com|gov)\b/gi, w: 2 },
      { re: /\b(written contract|employment contract|signed contract)\b/gi, w: 3 },
      { re: /\bapplication deadline\b/gi, w: 2 },
      { re: /\bcontract (type|duration)\s?[:\-]?\s?\d+[\-\s]?(month|year)/gi, w: 2 },
      { re: /\bsalary\s?[:\-]?\s?(GH₵|\$|€|£|USD|NGN)?\s?[\d,]+\s?[\-–]\s?(GH₵|\$|€|£|USD|NGN)?\s?[\d,]+/gi, w: 3 },
      { re: /\bno\s+(\w+\s+){0,2}fees?\b/gi, w: 5 },
      { re: /\b(diploma|degree|years? of experience|qualifications?) (required|preferred)\b/gi, w: 2 },
    ]
  },
};

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/**
 * Run every signal's pattern set against the literal input text.
 * Returns, per signal: raw matched spans (with position + matched text),
 * a 0-5 star rating derived purely from matches found, and totals.
 */
function analyzeText(text) {
  const clean = text.trim();
  if (!clean) return null;

  const signalResults = {};
  let allRiskSpans = [], allTrustSpans = [];

  Object.entries(SIGNAL_DEFINITIONS).forEach(([key, def]) => {
    const matches = [];
    def.patterns.forEach(p => {
      let m; p.re.lastIndex = 0;
      while ((m = p.re.exec(clean)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], w: p.w });
        if (!p.re.global) break;
      }
    });
    // Dedupe overlapping matches within this signal
    matches.sort((a,b) => a.start - b.start || b.w - a.w);
    const deduped = [];
    let lastEnd = -1;
    for (const m of matches) { if (m.start >= lastEnd) { deduped.push(m); lastEnd = m.end; } }

    const totalWeight = deduped.reduce((s,m) => s + m.w, 0);
    // Star rating: 0 matches = 0 stars. Otherwise scale weight to 1-5, floor at 1 if any match exists.
    const stars = deduped.length === 0 ? 0 : Math.max(1, Math.min(5, Math.ceil(totalWeight / 3)));

    signalResults[key] = {
      key, label: def.label, kind: def.kind, desc: def.desc,
      matches: deduped, stars, totalWeight,
    };

    if (def.kind === 'risk') allRiskSpans.push(...deduped.map(m => ({...m, cat:key, label:def.label, exp:def.desc})));
    else allTrustSpans.push(...deduped.map(m => ({...m, cat:key, label:def.label, exp:def.desc})));
  });

  // Global dedupe across all spans for highlighting (risk takes priority if overlapping with trust)
  function dedupeGlobal(hits) {
    hits.sort((a,b) => a.start - b.start || b.w - a.w);
    const out = []; let lastEnd = -1;
    for (const h of hits) { if (h.start >= lastEnd) { out.push(h); lastEnd = h.end; } }
    return out;
  }
  const riskSpans = dedupeGlobal(allRiskSpans);
  const trustSpans = dedupeGlobal(allTrustSpans);

  const riskScore = Math.min(100, riskSpans.reduce((s,h)=>s+h.w*6, 0));
  const trustScore = Math.min(100, trustSpans.reduce((s,h)=>s+h.w*5, 0));

  const sig = k => signalResults[k];
  const coerceScore = Math.min(100, Math.round(
    (sig('financialPressure').totalWeight*3) + (sig('documentControl').totalWeight*3) +
    (sig('dependency').totalWeight*2) + (sig('isolation').totalWeight*2)
  ));
  const urgencyScore = Math.min(100, sig('urgency').totalWeight * 8);
  const transparencyScore = Math.max(0, Math.min(100, trustScore - Math.round(riskScore*0.15)));

  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const hasAnySignal = riskSpans.length > 0 || trustSpans.length > 0;
  const netSignal = riskScore - trustScore;

  let classification, confidence;
  if (!hasAnySignal) { classification='none'; confidence = wordCount < 6 ? 30 : 55; }
  else if (riskScore >= 55 && netSignal > 15) { classification='high'; confidence = Math.min(97, 55 + Math.round(riskScore*0.35) + Math.round(riskSpans.length*1.5)); }
  else if (trustScore >= 45 && netSignal < -10) { classification='legit'; confidence = Math.min(95, 50 + Math.round(trustScore*0.35) + Math.round(trustSpans.length*1.5)); }
  else { classification='verify'; confidence = Math.min(90, 45 + Math.round(Math.abs(netSignal)*0.6) + Math.round(riskSpans.length+trustSpans.length)); }

  const allSpans = [...riskSpans.map(h=>({...h,kind:h.w>=4?'hh':'hm'})), ...trustSpans.map(h=>({...h,kind:'hg'}))].sort((a,b)=>a.start-b.start);
  const merged = []; let cursor = -1;
  for (const s of allSpans) { if (s.start >= cursor) { merged.push(s); cursor = s.end; } }
  let highlightHtml = ''; let pos = 0;
  for (const s of merged) {
    highlightHtml += escapeHtml(clean.slice(pos, s.start));
    highlightHtml += `<mark class="${s.kind}" title="${escapeHtml(s.label + ' — ' + s.exp)}">${escapeHtml(s.text)}</mark>`;
    pos = s.end;
  }
  highlightHtml += escapeHtml(clean.slice(pos));
  highlightHtml = highlightHtml.replace(/\n/g, '<br>');

  return {
    inputText: clean, wordCount, classification, confidence,
    scores: { scam: riskScore, coerce: Math.round(coerceScore), urgency: urgencyScore, transparency: Math.round(transparencyScore) },
    signalResults, riskSpans, trustSpans, highlightHtml,
  };
}

let currentResult = null;


function runDetector() {
  const inputEl = document.getElementById('analyzeInput');
  const v = inputEl.value;
  if (!v.trim()) { showToast('Please paste text to analyze.'); return; }

  document.getElementById('det-results').style.display = 'none';
  const ld = document.getElementById('det-loading');
  ld.style.display = 'flex';
  ['ls1','ls2','ls3','ls4'].forEach(s => document.getElementById(s).classList.remove('show'));
  let i = 0;
  const iv = setInterval(() => { if (i < 4) document.getElementById('ls'+(++i)).classList.add('show'); }, 380);

  // Analysis runs on the EXACT current value of the textarea, captured at click time.
  const textAtSubmitTime = v;
  setTimeout(() => {
    clearInterval(iv);
    ld.style.display = 'none';
    const result = analyzeText(textAtSubmitTime);
    currentResult = result;
    renderDetectorResults(result, textAtSubmitTime);
    document.getElementById('det-results').style.display = 'block';
    document.getElementById('det-results').scrollIntoView({ behavior:'smooth', block:'start' });
  }, 1500);
}

function renderDetectorResults(r, originalText) {
  const cl = r.classification;
  const classLabels = { high:'High Risk', verify:'Needs Verification', legit:'Likely Legitimate', none:'No Exploitation Indicators Detected' };
  const cpClass = { high:'cp-high', verify:'cp-verify', legit:'cp-legit', none:'cp-legit' };
  const mvClass = { high:'mv-class-high', verify:'mv-class-verify', legit:'mv-class-legit', none:'mv-class-legit' };
  const crClass = { high:'cr-high', verify:'cr-verify', legit:'cr-legit', none:'cr-legit' };
  const recoText = {
    high: 'Do not proceed with this opportunity as currently presented. The combination of linguistic signals found in your text matches documented exploitation and recruitment fraud patterns. Consult a trusted person, NGO, or labor authority before taking any action. If you have already paid a fee or shared documents, contact a local support organization listed in the Safety Center.',
    verify: 'This text contains a mix of signals. Before proceeding, independently verify the points listed under Concerns below — particularly any company registration, fee, or document request. Use the verification questions provided.',
    legit: 'This text shows several positive structural signals. This does not guarantee legitimacy — independently verify any registration number or company details before proceeding, and review any contract carefully before signing.',
    none: 'No linguistic risk or trust indicators relevant to recruitment, housing, or travel exploitation were detected in this text. This tool is scoped to exploitation-pattern detection — it does not evaluate general content quality or accuracy.'
  };
  const posHtml = r.trustSpans.length > 0
    ? r.trustSpans.map(s => `<div class="sig-item"><div class="sig-dot sd-pos"></div>${escapeHtml(s.label)}: <em>"${escapeHtml(s.text)}"</em></div>`).join('')
    : `<div class="sig-item" style="font-style:italic;color:var(--ink-muted);">No positive signals detected in this text</div>`;
  const negHtml = r.riskSpans.length > 0
    ? r.riskSpans.map(s => `<div class="sig-item"><div class="sig-dot sd-neg"></div>${escapeHtml(s.label)}: <em>"${escapeHtml(s.text)}"</em></div>`).join('')
    : `<div class="sig-item" style="font-style:italic;color:var(--ink-muted);">No risk indicators detected in this text</div>`;

  document.getElementById('ml-verdict-wrap').innerHTML = `
    <div class="ml-verdict">
      <div class="mv-header ${mvClass[cl]}">
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--ink-muted);margin-bottom:5px;">Classification</div>
          <div class="class-pill ${cpClass[cl]}">${classLabels[cl]}</div>
        </div>
        <div class="conf-ring ${crClass[cl]}"><span class="conf-num">${r.confidence}%</span><span class="conf-lbl">Confidence</span></div>
      </div>
      <div class="signals-grid">
        <div class="sig-col"><div class="sig-title st-pos">Positive Signals</div><div class="sig-list">${posHtml}</div></div>
        <div class="sig-col"><div class="sig-title st-neg">Concerns Identified</div><div class="sig-list">${negHtml}</div></div>
      </div>
      <div class="mv-reco"><strong>Recommendation:</strong> ${recoText[cl]}</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;margin-top:4px;flex-wrap:wrap;">
      <span class="ai-label">Rule-based linguistic feature analysis</span>
      <span class="human-badge">Human review recommended</span>
    </div>
    <details class="input-verify-panel">
      <summary>Input Verification — confirm what was analyzed</summary>
      <div class="iv-body">
        <div class="iv-row"><div class="iv-label">Original text submitted (${r.wordCount} words):</div><div class="iv-text">${escapeHtml(originalText)}</div></div>
        <div class="iv-row"><div class="iv-label">Processed text (trimmed, analyzed as-is):</div><div class="iv-text">${escapeHtml(r.inputText)}</div></div>
        <div class="iv-row"><div class="iv-label">Risk phrases matched (${r.riskSpans.length}):</div><div class="iv-text">${r.riskSpans.length ? r.riskSpans.map(s=>`"${escapeHtml(s.text)}" → ${escapeHtml(s.label)} (weight ${s.w})`).join('<br>') : '(none found in this text)'}</div></div>
        <div class="iv-row"><div class="iv-label">Trust phrases matched (${r.trustSpans.length}):</div><div class="iv-text">${r.trustSpans.length ? r.trustSpans.map(s=>`"${escapeHtml(s.text)}" → ${escapeHtml(s.label)} (weight ${s.w})`).join('<br>') : '(none found in this text)'}</div></div>
        <div class="iv-row"><div class="iv-label">Classification reasoning:</div><div class="iv-text">risk_score=${r.scores.scam} · trust_score=${r.trustSpans.reduce((s,h)=>s+h.w*5,0)} · net_signal=${r.scores.scam - r.trustSpans.reduce((s,h)=>s+h.w*5,0)} → classification=${cl} · confidence=${r.confidence}%</div></div>
      </div>
    </details>`;

  // ===== LINGUISTIC SIGNALS DETECTED panel =====
  const signalOrder = ['urgency','authority','dependency','isolation','documentControl','financialPressure','emotionalManipulation','verificationTransparency'];
  const sigRowsHtml = signalOrder.map(key => {
    const s = r.signalResults[key];
    if (!s) return '';
    const starsFull = '★'.repeat(s.stars);
    const starsEmpty = '☆'.repeat(5 - s.stars);
    const isTrust = s.kind === 'trust';
    const phrasesHtml = s.matches.length
      ? s.matches.map(m => `<span class="ls-phrase">"${escapeHtml(m.text)}"</span>`).join(' ')
      : `<span class="ls-phrase ls-phrase-none">no matches in this text</span>`;
    return `<div class="ls-row ${s.stars === 0 ? 'ls-row-empty' : ''}">
      <div class="ls-row-top">
        <span class="ls-label">${escapeHtml(s.label)}</span>
        <span class="ls-stars ${isTrust ? 'ls-stars-trust' : 'ls-stars-risk'}">${starsFull}<span class="ls-stars-empty">${starsEmpty}</span></span>
      </div>
      <div class="ls-desc">${escapeHtml(s.desc)}</div>
      <div class="ls-phrases">${phrasesHtml}</div>
    </div>`;
  }).join('');
  const lsWrap = document.getElementById('linguistic-signals-wrap');
  if (lsWrap) lsWrap.innerHTML = `
    <div class="card" style="margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
        <span style="font-size:14px;font-weight:700;">Linguistic Signals Detected</span>
      </div>
      <p style="font-size:12.5px;color:var(--ink-muted);margin-bottom:14px;">Each signal is a category of language linked to manipulation, coercion, or — for Verification Transparency — legitimacy. Ratings are derived only from phrases actually found in your submitted text.</p>
      <div class="ls-grid">${sigRowsHtml}</div>
    </div>`;

  renderForecast(r.riskSpans);

  const S = r.scores;
  const setBar = (id,val,color) => { document.getElementById('bar-'+id).style.width = val+'%'; const v=document.getElementById('val-'+id); v.textContent=val+'%'; v.style.color=color; };
  setBar('scam', S.scam, S.scam > 50 ? 'var(--red)' : S.scam > 20 ? 'var(--amber)' : 'var(--green)');
  setBar('coerce', S.coerce, S.coerce > 50 ? 'var(--red)' : S.coerce > 20 ? 'var(--amber)' : 'var(--green)');
  setBar('urgency', S.urgency, S.urgency > 50 ? 'var(--red)' : S.urgency > 20 ? 'var(--amber)' : 'var(--green)');
  setBar('transp', S.transparency, S.transparency > 50 ? 'var(--green)' : S.transparency > 20 ? 'var(--amber)' : 'var(--red)');

  const allIndicators = [...r.riskSpans.map(s => ({t:s.label, c: s.w>=4?'ic-h':'ic-m'})), ...r.trustSpans.map(s => ({t:s.label, c:'ic-g'}))];
  const uniqueIndicators = [...new Map(allIndicators.map(i => [i.t, i])).values()];
  document.getElementById('ind-chips').innerHTML = uniqueIndicators.length
    ? uniqueIndicators.map(i => `<span class="ic ${i.c}">${escapeHtml(i.t)}</span>`).join('')
    : `<span class="ic ic-l">No indicators detected in submitted text</span>`;

  document.getElementById('hl-content').innerHTML = r.highlightHtml || '<em style="color:var(--ink-muted);">(no text submitted)</em>';

  let explainParts = [];
  if (cl === 'high') explainParts.push(`This text was classified <strong>High Risk</strong> because it contains ${r.riskSpans.length} matched risk indicator(s) across multiple linguistic signal categories, with minimal offsetting trust signals (${r.trustSpans.length} found).`);
  else if (cl === 'verify') explainParts.push(`This text was classified <strong>Needs Verification</strong> because it contains a mix of ${r.riskSpans.length} risk indicator(s) and ${r.trustSpans.length} trust indicator(s) — neither side is dominant enough for a confident high-risk or legitimate classification.`);
  else if (cl === 'legit') explainParts.push(`This text was classified <strong>Likely Legitimate</strong> because it contains ${r.trustSpans.length} matched trust indicator(s) (e.g. ${r.trustSpans.slice(0,2).map(s=>'"'+escapeHtml(s.text)+'"').join(', ') || 'none'}) with minimal risk language detected (${r.riskSpans.length} risk indicators found).`);
  else explainParts.push(`No recruitment, housing, or travel exploitation-related linguistic patterns were detected in this text. This scoped detector does not evaluate unrelated content for accuracy or other concerns — it only looks for exploitation-specific indicators.`);
  if (r.riskSpans.length) explainParts.push(`Specific concerns found: ${r.riskSpans.map(s=>escapeHtml(s.label)).join('; ')}.`);
  document.getElementById('explain-content').innerHTML = explainParts.join(' ');
  document.getElementById('bias-note-det').innerHTML = `<strong>Bias note:</strong> This lexicon-based analysis is tuned primarily for English text and common Western/West African recruitment-fraud phrasing. It may under-detect culturally specific manipulation language or over-detect benign phrases that happen to match a pattern (e.g. "urgent care" in a healthcare job). Always apply human judgment.`;

  document.getElementById('safer-content').textContent = (cl === 'high' || cl === 'verify')
    ? buildSaferRewrite(r)
    : 'This text already demonstrates clear, transparent language. Key elements worth keeping in any job posting: a stated registration number, an explicit no-fee statement, a specific salary range, and a calendar deadline rather than an hours-based pressure deadline.';

  document.getElementById('vq-list').innerHTML = buildVerificationQuestions(r).map(q => `<li class="vq-item">${escapeHtml(q)}</li>`).join('');
}

function buildSaferRewrite(r) {
  const cats = new Set(r.riskSpans.map(s => s.cat));
  let parts = ['"Hiring for [role]. Salary: [specific range stated in local currency], based on agreed contract terms.'];
  if (cats.has('financialPressure')) parts.push('No fees are charged to applicants at any stage of hiring.');
  if (cats.has('documentControl')) parts.push('Identity documents remain with you at all times; we verify identity through official HR processes after a formal offer.');
  if (cats.has('urgency')) parts.push('Take the time you need — our application deadline is [date], not an hours-based deadline.');
  if (cats.has('dependency')) parts.push('Housing arrangements, if any, are fully separate from your employment terms and contract.');
  if (cats.has('isolation')) parts.push('We encourage you to discuss this offer with a trusted person before responding.');
  parts.push('Formal written contract provided before any commitment is required. Company registration: [number]. Contact: hr@[official-domain]."');
  return parts.join(' ');
}

function buildVerificationQuestions(r) {
  const cats = new Set(r.riskSpans.map(s => s.cat));
  const qs = ['What is the organization\'s registered name, registration number, and physical address?'];
  if (cats.has('financialPressure')) qs.push('Why is a fee required before I am formally employed, and under what law is this fee charged?');
  if (cats.has('documentControl')) qs.push('Why are identity documents needed before a contract exists, and who will have access to them?');
  if (cats.has('urgency')) qs.push('Can I have additional time to review this offer with a trusted person before responding?');
  if (cats.has('isolation')) qs.push('Why would I need to keep this offer private rather than discuss it with people I trust?');
  if (cats.has('dependency')) qs.push('Can you confirm in writing that housing and employment are governed by separate, independent agreements?');
  if (cats.has('emotionalManipulation')) qs.push('Can you explain how this compensation figure compares to standard rates for this type of role?');
  if (qs.length === 1) qs.push('Can I receive a written contract before making any decisions?', 'Who is my direct manager, and how do I contact your official HR department?');
  return qs.slice(0, 5);
}

function clearDetector() {
  document.getElementById('analyzeInput').value = '';
  document.getElementById('det-results').style.display = 'none';
  document.getElementById('det-loading').style.display = 'none';
  currentResult = null;
}

/* ============================
   STORY MODULE
   ============================ */
const storyData = {
  student:[
    {title:'The tournament offer',loc:'📱 Amara\'s phone — Tuesday morning',chars:[{n:'Amara',r:'Final-year student, Accra',e:'👩🏾‍🎓'},{n:'Unknown number',r:'Identity not yet known',e:'❓'}],narr:'Amara, 22, graduated three months ago and has been searching for her first professional role. This morning, an unknown number sends her a WhatsApp message.',msgs:[{s:'l',from:'+44 7xxx xxxxxx',txt:'Hello Amara! I found your contact through your university careers board. We are urgently hiring hospitality staff for a major international tournament. Salary: $2,800/month, accommodation fully provided. Interested? We need your answer TODAY.'}],tactic:null,warning:null,choices:[{t:'Reply immediately: "Yes! What do I do next?"',type:'risk',fb:'Responding immediately gives the recruiter control before you have any information. Scammers rely on enthusiasm overriding caution.'},{t:'Ask: "Can you share your company website and a work email address?"',type:'good',fb:'✓ Good move. Legitimate recruiters welcome basic verification. A work email and registered website are minimum checks.'},{t:'Search the phone number online before responding',type:'good',fb:'✓ Excellent first step. Searching scam numbers often reveals other victims\' reports within minutes.'}]},
    {title:'The offer arrives',loc:'💬 WhatsApp — Two hours later',chars:[{n:'Amara',r:'Curious but cautious',e:'👩🏾‍🎓'},{n:'"Mr. James"',r:'Claims: GlobalEvents Ltd',e:'🕴️'}],narr:'Amara asked for details. Mr. James responds professionally. But read carefully — two critical demands are embedded in this message.',msgs:[{s:'l',from:'Mr. James — GlobalEvents Ltd',txt:'Thank you! We are a registered hospitality firm. Salary: $2,800/month + $500 accommodation.\n\nTo secure your position:\n• Pay a $200 registration fee within 24 hours\n• Send a scan of your passport to begin your visa application\n\nMany candidates are waiting. Confirm today or your spot goes to the next person.'},{s:'r',from:'Amara',txt:'This sounds great! But why do you need a fee and my passport before I am officially hired?'},{s:'l',from:'Mr. James',txt:'This is completely standard procedure — every company does this. You only have 2 hours left to confirm.'}],tactic:{lbl:'Coercion tactic revealed',title:'Fee + Document Extraction + Artificial Deadline',exp:'Requesting an upfront fee AND passport before a contract is signed — then adding an artificial deadline — is the most documented recruitment fraud pattern. "Every company does this" is deliberate false normalization. This phrase specifically targets people who are new to formal employment.'},warning:{title:'Two major red flags in one message',body:'Any job offer that requires (1) payment before hiring and (2) passport documents before a contract is almost certainly fraudulent. Together, these match ILO forced labour indicator criteria and Polaris Project vulnerability indicators for labor trafficking recruitment.'},choices:[{t:'Pay the $200 and send my passport — the salary is worth the risk',type:'bad',fb:'⚠️ This is the point where most victims lose control. Once your money is sent and passport is copied, the scammer has leverage over you.'},{t:'Tell a trusted person about this offer before doing anything',type:'good',fb:'✓ One of the most effective protections. Scammers specifically create urgency to prevent you from consulting others.'},{t:'Ask for the official company registration number and a signed contract first',type:'good',fb:'✓ Correct. A legitimate employer can always produce these. Refusal is immediate confirmation of fraud.'}]},
    {title:'The NGO counselor',loc:'🏢 Local labor rights NGO — Next day',chars:[{n:'Amara',r:'Brought the messages for review',e:'👩🏾‍🎓'},{n:'Grace',r:'NGO casework counselor',e:'👩🏾‍💼'}],narr:'Amara showed the messages to a counselor at a local labor rights organization. Grace has reviewed hundreds of similar cases.',msgs:[{s:'l',from:'Grace — labor rights counselor',txt:'"I have seen this exact message template dozens of times. \'GlobalEvents Ltd\' is not registered anywhere. The UK number is a virtual VoIP number — it could be anyone, anywhere. The domain was created 22 days ago. This is a coordinated scam network."'},{s:'r',from:'Amara',txt:'"But it seemed so professional. How would I know to check?"'},{s:'l',from:'Grace',txt:'"Three checks protect most people: verify the company in the official business registry, find a physical address independently, and never pay any fee to get a job. If an employer asks for your passport before a contract — that is your signal to stop."'}],tactic:{lbl:'Protection strategy',title:'Three-point verification framework',exp:'1. Search the company name in the official business registry of the country they claim. 2. Find a physical address independently — not from information the recruiter provides. 3. Never pay any fee before employment begins. One further check: verify the email domain age at whois.domaintools.com — scam domains are typically less than 8 weeks old.'},warning:null,choices:[{t:'Report the number and profile to the platform and police',type:'good',fb:'✓ Reports build case evidence and may protect others from the same network.'},{t:'Screenshot and save all messages before the account disappears',type:'good',fb:'✓ Scam accounts are often deleted quickly. Preserving evidence is valuable for investigators and NGO case files.'},{t:'Warn friends at university who may have received the same message',type:'good',fb:'✓ Community peer-to-peer warnings spread faster than any awareness campaign.'}]},
    {title:'What could have happened',loc:'🔮 Shadow scenario — If Amara had paid',chars:[{n:'Amara (alternate path)',r:'Paid the fee — now in danger',e:'⚠️'},{n:'Scammer (unmasked)',r:'True identity: unknown location',e:'🚨'}],narr:'This scene shows what would have happened had Amara sent the money and her passport. This escalation pattern is documented by anti-trafficking organizations worldwide.',msgs:[{s:'l',from:'Scammer',txt:'"Thank you for the registration payment. Your visa is being processed. There is now one additional required payment — $350 for the medical clearance certificate. This is a new government regulation. Without it, your visa is cancelled."'},{s:'r',from:'Amara',txt:'"But you said $200 was the only fee..."'},{s:'l',from:'Scammer',txt:'"I apologize — this was added recently. You must pay within 6 hours or lose your position AND your deposit. You\'ve already come this far."'}],tactic:{lbl:'Escalation pattern',title:'Multi-fee extraction with sunk-cost manipulation',exp:'After the initial payment, scammers introduce additional fees — "medical clearance," "visa processing," "equipment deposit." Each demand uses your previous payment as psychological leverage: "You\'ve already invested this much." This pattern, documented in IOM and Polaris reports, can continue until the victim runs out of money or realizes the job does not exist.'},warning:{title:'Passport copy creates additional danger',body:'When a passport scan has been sent to a scammer, personal documents can be used for identity fraud. In situations involving physical relocation, document confiscation is used as a control mechanism to prevent workers from leaving or reporting abuse. This risk applies whether exploitation occurs physically or only financially.'},choices:[{t:'Continue to the final scene — what Amara learned and how to protect others',type:'good',fb:'Learning from the shadow scenario is as valuable as learning from the good path.'}]},
    {title:'Recovery and action',loc:'🌍 Community meeting — Two weeks later',chars:[{n:'Amara',r:'Now sharing her experience',e:'👩🏾‍🏫'},{n:'Community members',r:'Students, families, peers',e:'👥'}],narr:'Amara turned her close call into action, working with the NGO to run an awareness session for her university cohort.',msgs:[{s:'r',from:'Amara',txt:'"When I showed the messages to 15 people in my department, four had received the exact same message. Two had already paid the fee. We helped them file reports and connect with the NGO. Sharing what I learned was the most useful thing I did."'},{s:'l',from:'Community member',txt:'"What is the single most important thing to remember?"'},{s:'r',from:'Amara',txt:'"No legitimate employer will ever ask you to pay to get a job. That is the line. Every other check is secondary. But that one rule — it has never been wrong."'}],tactic:null,warning:null,choices:[]},
    {title:'What you learned',loc:'🎓 Story complete',chars:[{n:'You',r:'Completed the awareness journey',e:'✅'}],narr:'You have completed the LinguaShield awareness story.',msgs:[],tactic:null,warning:null,choices:[],completion:true,
      learnings:[
        'Legitimate employers never charge upfront recruitment fees (ILO Employer Pays Principle)',
        'No employer has the right to hold your passport or identity documents',
        'Urgency is a deliberate tactic to stop you from thinking clearly or consulting others',
        'Always verify company registration independently — never through information the recruiter provides',
        'Consulting a trusted person, NGO, or labor authority before acting is always the right choice',
        'Sharing warnings within your community is one of the most effective prevention tools available'
      ]}
  ],

  migrant:[
    {title:'The construction contract',loc:'🏗️ Lagos — Recruitment office, Monday morning',chars:[{n:'Tunde',r:'Welder, 8 years experience',e:'👷🏾'},{n:'Agency rep',r:'"Continental Labour Partners"',e:'🕴️'}],narr:'Tunde, 34, has welded on construction sites for eight years. A recruitment agency contacted him about a three-year contract on a major infrastructure project abroad. He visits their office in person.',msgs:[{s:'l',from:'Agency rep',txt:'Mr. Tunde, your experience is exactly what our client needs. Three-year contract, Gulf region. Salary: $1,400/month — more than triple local rates. Flights, housing, and meals included. We just need your passport to begin visa sponsorship, plus a $400 agency placement fee — standard for international placements.'},{s:'r',from:'Tunde',txt:'$400 is a lot of money. Is this fee refundable, and can I get a copy of the contract first?'},{s:'l',from:'Agency rep',txt:'The fee covers paperwork costs, non-refundable once we start. The contract will be provided once you arrive — standard practice for international placements. We have sent 200 workers this way, everyone is very happy.'}],tactic:null,warning:null,choices:[
      {t:'Pay the fee — the salary is too good to risk losing the opportunity',type:'bad',fb:'⚠️ Under the ILO Employer Pays Principle, recruitment costs are the responsibility of the employer, not the worker. A genuine agency does not need a worker-paid fee to begin sponsorship.'},
      {t:'Ask for the contract in writing before paying anything, even if it delays the process',type:'good',fb:'✓ Correct instinct. A contract provided only after arrival removes any legal protection while you are already abroad and dependent on the employer.'},
      {t:'Ask the agency for their international recruitment license number',type:'good',fb:'✓ Licensed labour recruitment agencies operating internationally must be registered with relevant authorities (e.g. Ministry of Labour). This is independently verifiable and a legitimate agency will provide it without hesitation.'}
    ]},
    {title:'Arrival and the second contract',loc:'✈️ Gulf region — Worker accommodation, three weeks later',chars:[{n:'Tunde',r:'Arrived, passport already surrendered',e:'😟'},{n:'Site supervisor',r:'Foreign labour company',e:'👔'}],narr:'Tunde arrived after paying the fee and signing paperwork he could not fully read. At the airport, his passport was collected "for safekeeping and visa processing." He is handed a new contract — different terms than what was promised.',msgs:[{s:'l',from:'Site supervisor',txt:'Welcome. Sign here for your final contract. Salary is $750/month — accommodation and transport costs are deducted from this. Your passport stays in the company safe until your contract ends; this is required by local sponsorship law.'},{s:'r',from:'Tunde',txt:'This is half of what I was promised. And I was told the housing was included for free.'},{s:'l',from:'Site supervisor',txt:'The agency in Lagos does not control our contracts here. If you do not sign, you have no legal status in this country and no way to return home. Most workers sign and it works out fine.'}],tactic:{lbl:'Coercion tactic revealed',title:'Contract substitution + passport confiscation',exp:'This is one of the most severe and well-documented forms of labour exploitation: a worker is offered one contract to secure agreement, then presented with a worse "real" contract after arrival — when they have no money, no passport, and no легal status to leave. Combined with passport confiscation, this matches the ILO definition of forced labour indicators precisely.'},warning:{title:'This describes a forced labour risk situation, not just an unfair contract',body:'When a worker cannot leave due to confiscated documents, has no independent legal status, and faces contract terms imposed without consent, this meets recognized international definitions of forced labour. If you or someone you know faces this, contact your embassy or consulate immediately — they can assist regardless of your agreement with the employer.'},choices:[
      {t:'Sign the new contract — there seems to be no other option',type:'risk',fb:'This is an understandable response under coercive pressure, and the responsibility for this situation lies entirely with the recruiter and employer, not the worker. However, signing does not legally bind you to unlawful conditions — documenting everything matters more than the signature.'},
      {t:'Contact your home country embassy or consulate as soon as possible',type:'good',fb:'✓ Embassies and consulates exist specifically to assist nationals in this kind of situation, including helping recover passports and arranging safe return. This step should be taken even if it feels difficult or embarrassing.'},
      {t:'Try to document the discrepancy between the original offer and the new contract (photos, messages)',type:'good',fb:'✓ Evidence of contract substitution is critical for any later legal claim, embassy assistance request, or NGO casework. Even photographing the original WhatsApp messages from the Lagos agency matters.'}
    ]},
    {title:'What protection would have looked like',loc:'📋 Reflection — What could have changed the outcome',chars:[{n:'Tunde',r:'Reflecting on the recruitment process',e:'👷🏾'}],narr:'Looking back, several points in the process offered opportunities to recognize risk before travel — opportunities that are often invisible in the moment but become clear with hindsight and information.',msgs:[],tactic:{lbl:'Pattern recognition — migrant worker recruitment',title:'Five checkpoints that could have changed the outcome',exp:'1. A "non-refundable" placement fee paid by the worker (not the employer) is a violation of the ILO Employer Pays Principle. 2. A contract promised "after arrival" rather than before travel removes all pre-departure protection. 3. Passport confiscation is illegal in nearly every jurisdiction, regardless of what an employer claims about local law. 4. Independent verification of an agency\'s international recruitment license (most countries maintain a public registry) takes minutes and is free. 5. Pre-departure briefings, where available through embassies or labour ministries, specifically cover these exact risks.'},warning:null,choices:[]},
    {title:'Module complete: Migrant Worker',loc:'Story complete',chars:[{n:'You',r:'Completed the migrant worker perspective',e:'✅'}],narr:'This perspective focused on international labour recruitment specifically — a context with distinct legal protections (embassy assistance, international licensing requirements) and distinct risks (contract substitution, cross-border passport confiscation) compared to domestic recruitment scams.',msgs:[],tactic:null,warning:null,choices:[],completion:true,
      learnings:[
        'The ILO Employer Pays Principle means recruitment costs belong to the employer, not the worker, in legitimate international placements',
        'A contract delivered only after arrival abroad removes nearly all pre-departure legal protection',
        'Passport confiscation is illegal almost everywhere — "local law requires it" is a common false claim',
        'Embassies and consulates can assist nationals facing exploitation abroad, regardless of any contract signed under pressure',
        'International recruitment agencies should hold a verifiable government license — checking this takes minutes'
      ]}
  ],
  recruiter:[
    {title:'Inside the recruitment script',loc:'💻 A look at how messages are written — Educational perspective',chars:[{n:'Narrator',r:'Educational framing — not a real person',e:'📋'}],narr:'This perspective is different from the others: instead of following a target, you will see how exploitative recruitment messages are deliberately constructed — sentence by sentence — so the underlying technique becomes visible and harder to fall for in the future. No real recruiter or organization is depicted.',msgs:[],tactic:{lbl:'Construction technique',title:'Step 1: The hook — a benefit too specific to ignore',exp:'Effective scam messages avoid vague claims like "great opportunity." They use a specific number ("$2,800/month"), a specific context ("the World Cup"), and a specific trigger ("your university careers board") to feel personally relevant and credible. Specificity, not vagueness, is what makes the hook work.'},warning:null,choices:[
      {t:'See how the message would change if it removed specific (but fake) details',type:'good',fb:'A version with only vague claims ("great pay, amazing opportunity") is actually easier for most people to recognize as suspicious. Specificity is the manipulation — not the giveaway.'}
    ]},
    {title:'Layering urgency onto trust',loc:'💻 Construction technique — Step 2',chars:[{n:'Narrator',r:'Educational framing',e:'📋'}],narr:'Once initial interest is established, scam scripts add urgency — but rarely all at once. It typically escalates across multiple messages, so each individual message feels reasonable in isolation, even though the cumulative pressure is severe.',msgs:[{s:'l',from:'Message 1 (Day 1)',txt:'No rush — take your time to think about it and let us know this week.'},{s:'l',from:'Message 2 (Day 2)',txt:'Quick update: a few other candidates are also being considered, so earlier responses are prioritized.'},{s:'l',from:'Message 3 (Day 2, two hours later)',txt:'I just need to know today — we are finalizing the list this evening.'}],tactic:{lbl:'Construction technique',title:'Step 2: Urgency escalation across multiple messages',exp:'Sudden, single-message urgency ("respond in the next hour!") is relatively easy to recognize as manipulative. Gradual urgency escalation across a conversation feels more like a "naturally developing situation" and is significantly harder to identify as a deliberate tactic — because no single message feels extreme on its own.'},warning:null,choices:[
      {t:'Continue to the next construction technique',type:'good',fb:'Recognizing gradual escalation — not just sudden pressure — is a key defensive skill.'}
    ]},
    {title:'The cost of resistance',loc:'💻 Construction technique — Step 3',chars:[{n:'Narrator',r:'Educational framing',e:'📋'}],narr:'When a target pushes back or asks a verification question, scripts are designed with a pre-written response that reframes the question as the target\'s problem, not the recruiter\'s.',msgs:[{s:'r',from:'Target',txt:'Can I see your business registration number?'},{s:'l',from:'Scripted response',txt:'Of course we have all our documents in order — I\'m a little surprised you\'re asking, most candidates trust the process. But if you\'re not comfortable, that\'s okay, we can offer this position to someone else.'}],tactic:{lbl:'Construction technique',title:'Step 3: Reframing verification as distrust',exp:'This response does two things simultaneously: it implies the request itself was inappropriate ("most candidates trust the process") and it threatens withdrawal of the opportunity ("we can offer this position to someone else") — converting a reasonable verification request into a perceived risk of losing the opportunity. A legitimate recruiter has no reason to react this way to a registration number request.'},warning:{title:'The defensive signal',body:'Any negative emotional reaction — defensiveness, guilt-tripping, or threats to withdraw an offer — in response to a simple, reasonable verification question is itself a significant red flag, independent of whatever the original offer claimed.'},choices:[
      {t:'Continue to see how this technique connects to real recruitment scam reports',type:'good',fb:'These exact response patterns appear repeatedly across documented scam reports — recognizing the pattern itself, not just individual phrases, builds lasting protection.'}
    ]},
    {title:'Module complete: Recruiter Tactics (Educational)',loc:'Story complete',chars:[{n:'You',r:'Completed the recruiter-tactics perspective',e:'✅'}],narr:'This perspective deliberately showed the construction of manipulative messages from the inside — not to teach manipulation, but because recognizing the deliberate, scripted nature of these tactics makes them far easier to identify in real situations. No real individual or organization was depicted in this module.',msgs:[],tactic:null,warning:null,choices:[],completion:true,
      learnings:[
        'Specific, credible-sounding details are often the manipulation itself, not evidence against it',
        'Urgency is frequently escalated gradually across multiple messages rather than appearing all at once',
        'A defensive or guilt-inducing reaction to a reasonable verification question is itself a red flag',
        'These techniques are scripted and repeated across many scam operations — recognizing the pattern protects you across many different scenarios, not just one',
        'This module depicted no real person or organization; it is an educational deconstruction of documented tactics'
      ]}
  ],
  ngo:[
    {title:'The case file arrives',loc:'🏢 Regional NGO office — Case intake, Wednesday',chars:[{n:'Folasade',r:'NGO case worker, 6 years experience',e:'👩🏾‍💼'},{n:'Walk-in client',r:'Declined to give name initially',e:'🧑🏾'}],narr:'Folasade works intake at a labour rights NGO. A young man arrives without an appointment, visibly anxious, holding a phone with screenshots he wants someone to look at.',msgs:[{s:'l',from:'Client',txt:'I don\'t really want to give my name yet. I just need to know if this is a scam before I do anything else. I already feel stupid enough.'},{s:'r',from:'Folasade',txt:'You don\'t need to give your name to get help here, and you are not the first person to come to us with something like this — please don\'t feel that way. Can I see what you have?'}],tactic:null,warning:null,choices:[
      {t:'Reassure the client and proceed without requiring identification',type:'good',fb:'✓ Correct approach. Requiring identification as a precondition for help can deter people in vulnerable situations from seeking support at all. Anonymous or pseudonymous intake is standard practice in trauma-informed casework.'},
      {t:'Explain that NGO intake requires full identification for case file accuracy',type:'bad',fb:'This approach prioritizes administrative process over access to help, and can cause people in vulnerable situations to leave without receiving any support at all. Trauma-informed practice allows identification to be deferred or omitted.'}
    ]},
    {title:'Reviewing the evidence',loc:'🏢 Case review — Same day, 20 minutes later',chars:[{n:'Folasade',r:'Reviewing submitted screenshots',e:'👩🏾‍💼'},{n:'Client',r:'Now more at ease',e:'🧑🏾'}],narr:'The client shares a series of messages from a recruitment contact: an initial job offer, an escalating fee request, and finally a demand for his passport. Folasade needs to assess severity and recommend next steps.',msgs:[{s:'l',from:'Client',txt:'They already have 150 dollars from me. Now they want my passport too. I haven\'t sent it yet.'},{s:'r',from:'Folasade',txt:'You did the right thing pausing before sending the passport. That is the most important document to protect right now. Let\'s look at what has already happened and figure out what is recoverable, and how to prevent the document request.'}],tactic:{lbl:'Case worker decision point',title:'Severity triage: financial loss vs. document risk',exp:'In casework, financial loss that has already occurred (the $150 fee) is typically treated as a lower-urgency, recovery-and-reporting issue, while a pending request for identity documents is treated as a high-urgency prevention priority — because document loss creates compounding risk (identity fraud, physical trafficking leverage) that is much harder to reverse than financial loss.'},warning:null,choices:[
      {t:'Prioritize advising the client not to send the passport, even before addressing the fee already paid',type:'good',fb:'✓ Correct triage. Preventing the document request from being fulfilled is the highest-leverage action available in this case — it is reversible right now, whereas the fee already sent may not be recoverable.'},
      {t:'Focus first on helping the client try to recover the $150 already sent',type:'risk',fb:'This is a reasonable concern but represents a less urgent priority than preventing the passport from being sent — that decision is still reversible, and recovering already-sent funds is typically much harder regardless of timing.'}
    ]},
    {title:'Writing the case summary',loc:'🏢 Case documentation — End of day',chars:[{n:'Folasade',r:'Completing case file',e:'👩🏾‍💼'}],narr:'Folasade documents the case for the NGO\'s internal pattern-tracking system, which anonymously contributes to broader trend monitoring without identifying the client.',msgs:[],tactic:{lbl:'Case worker decision point',title:'Anonymized pattern contribution',exp:'Professional casework practice separates two functions: (1) direct client support, which is confidential, and (2) anonymized pattern contribution to trend databases (such as Community Intelligence systems), which strips all identifying details before submission. This case — fee + pending passport request + event-linked recruitment language — becomes one anonymized data point that can help identify recruitment clusters without exposing the client.'},warning:null,choices:[
      {t:'Submit an anonymized version of this case pattern to the shared intelligence system',type:'good',fb:'✓ This is how individual cases become collective protection — the specific recruiter language and tactic pattern, stripped of all client-identifying information, helps flag the same scam network for future cases.'}
    ]},
    {title:'Module complete: NGO Case Worker',loc:'Story complete',chars:[{n:'You',r:'Completed the case worker perspective',e:'✅'}],narr:'This perspective focused on the practice decisions behind frontline casework: trauma-informed intake, severity triage, and the responsible boundary between confidential client support and anonymized pattern contribution to broader prevention systems.',msgs:[],tactic:null,warning:null,choices:[],completion:true,
      learnings:[
        'Trauma-informed intake does not require identification as a precondition for help',
        'When document loss is still preventable, it is typically a higher casework priority than already-occurred financial loss',
        'Confidential client support and anonymized pattern contribution are separate, both-necessary functions',
        'Anonymized case patterns, in aggregate, are what allow systems like Community Intelligence to detect scam networks',
        'People seeking help frequently feel shame about being targeted — reassurance is a practical, not just emotional, part of effective casework'
      ]}
  ],
  inspector:[
    {title:'The inspection referral',loc:'🏭 Regional Labour Standards Office — Referral received',chars:[{n:'Inspector Boateng',r:'Labour inspector, 11 years',e:'🕵🏾'},{n:'Referral source',r:'NGO anonymized case pattern',e:'📄'}],narr:'Inspector Boateng receives a referral generated from an aggregated pattern of NGO case reports — not a single complaint, but a cluster of similar reports pointing toward one staffing agency operating across multiple recruitment sites.',msgs:[{s:'l',from:'Referral summary',txt:'Pattern reference: 7 anonymized reports over 6 weeks describe a staffing agency operating under the name "Continental Labour Partners" requesting upfront fees and passport documents from prospective workers before any written contract is issued. No single complainant has filed a formal report.'}],tactic:null,warning:null,choices:[
      {t:'Open a formal inspection based on the aggregated pattern, even without an individual complainant',type:'good',fb:'✓ Correct. Labour inspectorates in many jurisdictions can initiate proactive inspections based on credible pattern evidence, without requiring an individual worker to file a complaint and risk retaliation — this is a critical protection mechanism precisely because many affected workers fear coming forward.'},
      {t:'Wait until an individual worker files a formal complaint before acting',type:'risk',fb:'This approach is procedurally cautious but leaves a documented pattern of likely exploitation unaddressed, and individual workers — especially those still hoping to secure employment through the same agency — often will not file complaints due to fear of losing the opportunity or retaliation.'}
    ]},
    {title:'Building the evidence file',loc:'🏭 Site visit preparation — Three days later',chars:[{n:'Inspector Boateng',r:'Preparing documentation',e:'🕵🏾'}],narr:'Before a site visit, Inspector Boateng compiles available evidence: the anonymized report pattern, publicly available business registration data, and a check of the agency\'s claimed licensing status.',msgs:[],tactic:{lbl:'Investigative decision point',title:'Evidence triangulation before site visit',exp:'Effective labour inspection combines multiple independent evidence sources rather than relying on any single one: (1) the pattern of anonymized worker reports, (2) public business registry records (does the entity legally exist as claimed?), and (3) licensing database checks (is it authorized to conduct recruitment?). Discrepancies between these sources — such as an agency operating without the legally required recruitment license — can independently justify regulatory action even before any single worker\'s individual testimony is taken.'},warning:null,choices:[
      {t:'Check the agency against the national labour recruitment licensing database before the visit',type:'good',fb:'✓ This single check often resolves the case quickly: operating as a recruitment agency without a valid license is frequently a standalone violation, independent of any other allegations.'}
    ]},
    {title:'Findings and referral',loc:'🏭 Post-inspection — One week later',chars:[{n:'Inspector Boateng',r:'Completing inspection report',e:'🕵🏾'}],narr:'The inspection confirms the agency was operating without a valid recruitment license, and finds documentary evidence consistent with the reported pattern: standard-form contracts requiring upfront fees, with passport collection built into onboarding procedure.',msgs:[],tactic:{lbl:'Investigative decision point',title:'From inspection finding to referral pathway',exp:'A confirmed licensing violation combined with a documented pattern of passport collection creates grounds for both: (1) an administrative penalty or license suspension process and (2) potential referral to anti-trafficking authorities if the passport-control element meets the threshold for forced labour indicators under national law. Labour inspectors typically are not themselves prosecutors — their core role is documentation, verification, and referral to the appropriate enforcement or support pathway.'},warning:null,choices:[
      {t:'Complete the administrative file and refer the passport-control finding to the appropriate anti-trafficking unit',type:'good',fb:'✓ This reflects how labour inspection systems are typically designed to function: inspectors document and verify, then route findings to the legal pathway with appropriate authority — administrative penalty, criminal referral, or both depending on findings.'}
    ]},
    {title:'Module complete: Labor Inspector',loc:'Story complete',chars:[{n:'You',r:'Completed the labour inspector perspective',e:'✅'}],narr:'This perspective focused on the institutional and evidentiary process behind labour inspection: how aggregated anonymized patterns can trigger proactive investigation, how multiple evidence sources are triangulated, and how findings are routed to appropriate enforcement pathways.',msgs:[],tactic:null,warning:null,choices:[],completion:true,
      learnings:[
        'Many labour inspectorates can act on credible aggregated patterns, not only individual formal complaints',
        'Public business registries and recruitment licensing databases are independently verifiable evidence sources',
        'A licensing violation alone is often sufficient grounds for regulatory action, independent of other allegations',
        'Labour inspectors typically document and refer rather than prosecute directly — understanding this pathway helps explain why reporting matters even when an immediate consequence is not visible',
        'This is exactly why anonymized Community Intelligence patterns matter: they can become the aggregated evidence base that triggers proactive inspection'
      ]}
  ]
};

function selectPersp(p, btn) {
  currentPersp = p;
  storyIdx = 0;
  document.querySelectorAll('.pt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderStory();
}

function renderStory() {
  const scenes = storyData[currentPersp] || storyData.student;
  const s = scenes[storyIdx];
  document.getElementById('story-ttl').textContent = s.title;
  document.getElementById('story-ctr').textContent = `Scene ${storyIdx + 1} of ${scenes.length}`;
  // Progress dots are regenerated to match the actual number of scenes in the active perspective
  // (perspectives have different lengths: student=6 scenes, others=4 scenes)
  const dotsContainer = document.getElementById('prog-dots');
  dotsContainer.innerHTML = scenes.map((_, i) => {
    const cls = i < storyIdx ? 'pdot done' : i === storyIdx ? 'pdot active' : 'pdot';
    return `<div class="${cls}"></div>`;
  }).join('');
  let h = `<div class="scene-loc">${escapeHtml(s.loc)}</div>`;
  if (s.chars?.length) {
    h += `<div class="chars-row">`;
    s.chars.forEach(c => { h += `<div class="char-pill"><span class="char-emo">${c.e}</span><div><div class="char-n">${escapeHtml(c.n)}</div><div class="char-r">${escapeHtml(c.r)}</div></div></div>`; });
    h += `</div>`;
  }
  h += `<div class="narr-box">${escapeHtml(s.narr)}</div>`;
  if (s.msgs?.length) {
    h += `<div class="msg-thread">`;
    s.msgs.forEach(m => { h += `<div class="msg ${m.s==='r'?'msg-r':'msg-l'}"><div class="msg-sender">${escapeHtml(m.from)}</div>${escapeHtml(m.txt).replace(/\n/g,'<br>')}</div>`; });
    h += `</div>`;
  }
  if (s.tactic) h += `<div class="tactic-box"><div class="tc-lbl">🔍 ${escapeHtml(s.tactic.lbl)}</div><div class="tc-title">${escapeHtml(s.tactic.title)}</div><div class="tc-exp">${escapeHtml(s.tactic.exp)}</div></div>`;
  if (s.warning) h += `<div class="rf-box"><div class="rf-title">⚠️ ${escapeHtml(s.warning.title)}</div><div class="rf-body">${escapeHtml(s.warning.body)}</div></div>`;
  if (s.completion) {
    const perspLabels = { student:'Exploitation Recognition', migrant:'International Recruitment Risk', recruiter:'Manipulation Tactics (Educational)', ngo:'Casework Decision-Making', inspector:'Evidence-Based Investigation' };
    const reflQuestions = {
      student: ['What would you do differently if you received a message like this tomorrow?', 'Who in your network might be vulnerable to this kind of offer right now?', 'What one thing from this story would you share with a friend or family member?'],
      migrant: ['What pre-departure check could you research before considering work abroad?', 'How would you find your destination country embassy contact in advance?', 'What would you tell a friend considering an offer with similar terms?'],
      recruiter: ['Which construction technique in this module did you find most persuasive, even knowing it was a deconstruction?', 'How might recognizing the scripted nature of these tactics change how you respond to pressure?', 'What is one verification question you would now ask earlier in a conversation?'],
      ngo: ['How does requiring identification before help change who is willing to seek it?', 'Why might preventing a future harm take priority over recovering a past loss?', 'How does anonymized pattern-sharing protect people who never file a report?'],
      inspector: ['Why might proactive investigation matter even without an individual complainant?', 'What publicly available records could you check before assuming an organization is legitimate?', 'How does this process connect to the Community Intelligence and Network Explorer modules?']
    };
    const lbl = perspLabels[currentPersp] || perspLabels.student;
    const refl = reflQuestions[currentPersp] || reflQuestions.student;
    const learnings = s.learnings || [];
    h += `<div class="outcome-card show">
      <span class="badge-gold">Module complete: ${escapeHtml(lbl)}</span>
      <div class="sec-lbl" style="margin-top:10px;">Key principles from this story</div>
      <ul style="font-size:13.5px;line-height:1.85;color:var(--ink-soft);padding-left:18px;margin-bottom:16px;">
        ${learnings.map(l => `<li>${escapeHtml(l)}</li>`).join('')}
      </ul>
      <div class="sec-lbl">Reflection questions</div>
      ${refl.map(q => `<div class="refl-q">${escapeHtml(q)}</div>`).join('')}
      <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
        <button class="btn btn-teal" id="story-restart-btn">Restart this story</button>
        <button class="btn btn-ghost" id="story-goto-evidence-btn">Evidence timeline →</button>
        <button class="btn btn-red" id="story-goto-safety-btn">Find help →</button>
      </div></div>`;
  } else if (s.choices?.length) {
    h += `<div style="font-size:13px;font-weight:800;color:var(--ink-muted);margin-bottom:10px;">What should the character do?</div>`;
    h += `<div class="choices" id="cw">`;
    s.choices.forEach((c, ci) => { h += `<button class="choice" type="button" data-choice-idx="${ci}">${escapeHtml(c.t)}</button>`; });
    h += `</div>`;
  } else {
    // FIX: narrative-only scene with no choices and not marked completion — was a dead end.
    // Provide an explicit Continue control so the story never silently stalls.
    h += `<div style="margin-top:6px;"><button class="btn btn-teal" id="story-continue-btn">Continue →</button></div>`;
  }
  document.getElementById('story-body').innerHTML = h;

  // Wire up event listeners AFTER innerHTML is set — no inline onclick string-building,
  // so apostrophes / quotes / special characters in story text can never break the handler.
  if (s.completion) {
    document.getElementById('story-restart-btn')?.addEventListener('click', () => { storyIdx = 0; renderStory(); });
    document.getElementById('story-goto-evidence-btn')?.addEventListener('click', () => showPage('evidence'));
    document.getElementById('story-goto-safety-btn')?.addEventListener('click', () => showPage('safety'));
  } else if (s.choices?.length) {
    // wired below
  } else {
    document.getElementById('story-continue-btn')?.addEventListener('click', () => {
      const scenes2 = storyData[currentPersp] || storyData.student;
      storyIdx = Math.min(storyIdx + 1, scenes2.length - 1);
      renderStory();
    });
  }
  if (s.choices?.length && !s.completion) {
    document.querySelectorAll('#cw .choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci = parseInt(btn.getAttribute('data-choice-idx'), 10);
        pickChoice(ci, s.choices[ci].type, s.choices[ci].fb);
      });
    });
  }
}

function pickChoice(ci, type, fb) {
  // PRD requirement: wrong choices PAUSE story, show risk alert, force re-choose
  if (type === 'bad' || type === 'risk') {
    // Highlight the bad choice
    const btns = document.querySelectorAll('.choice');
    btns[ci].classList.add(type === 'bad' ? 'c-bad' : 'c-risk');
    // Show risk intervention panel
    const alert = document.createElement('div');
    alert.className = 'story-risk-alert';
    alert.innerHTML = `<div class="sra-header"><span class="sra-icon">⚠️</span><strong>Risk Alert — Please read before continuing</strong></div>
      <div class="sra-body">${escapeHtml(fb)}</div>
      <div class="sra-footer">This choice contains linguistic warning signs. Understanding why helps protect you and others.</div>
      <button class="sra-btn" onclick="resetStoryChoices()">I understand — let me choose again</button>`;
    document.getElementById('cw').after(alert);
    btns.forEach(b => b.disabled = true);
    return; // Do NOT advance
  }
  // Good/neutral choice: advance normally
  document.querySelectorAll('.choice').forEach((b, i) => {
    b.disabled = true;
    if (i === ci) b.classList.add('c-good');
  });
  const fe = document.createElement('div');
  fe.className = 'choice-feedback choice-feedback-good';
  fe.textContent = fb;
  document.getElementById('cw').after(fe);
  setTimeout(() => {
    const scenes = storyData[currentPersp] || storyData.student;
    storyIdx = Math.min(storyIdx + 1, scenes.length - 1);
    renderStory();
  }, 1800);
}

function resetStoryChoices() {
  // Remove alert and re-enable choices so user can pick again
  const alert = document.querySelector('.story-risk-alert');
  if (alert) alert.remove();
  document.querySelectorAll('.choice').forEach(b => {
    b.disabled = false;
    b.className = 'choice';
  });
}

/* ============================
   EVIDENCE CONSENT
   ============================ */
function checkConsent() {
  const all = ['cc1','cc2','cc3'].every(id => document.getElementById(id).checked);
  document.getElementById('consent-btn').disabled = !all;
}
function grantConsent() {
  document.getElementById('consent-gate-ev').style.display = 'none';
  document.getElementById('ev-upload').style.display = 'block';
  wireUploadHandlers();
}

function wireUploadHandlers() {
  const dropZone = document.getElementById('upload-drop-zone');
  const fileInput = document.getElementById('ev-file-input');
  const chooseBtn = document.getElementById('ev-choose-files-btn');
  const demoBtn = document.getElementById('ev-load-demo-btn');

  chooseBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFilesSelected(Array.from(fileInput.files));
  });
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--teal)'; });
  dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    if (e.dataTransfer.files.length > 0) handleFilesSelected(Array.from(e.dataTransfer.files));
  });
  demoBtn.addEventListener('click', (e) => { e.stopPropagation(); runEvidenceProcessing(true, null); });
}

function handleFilesSelected(files) {
  const listEl = document.getElementById('ev-file-list');
  listEl.style.display = 'flex';
  listEl.innerHTML = files.map(f => {
    const icon = f.type.includes('pdf') ? '📄' : f.type.includes('image') ? '🖼️' : '📝';
    const sizeKb = Math.max(1, Math.round(f.size / 1024));
    return `<div class="ev-file-item"><span class="efi-ico">${icon}</span><span class="efi-name">${escapeHtml(f.name)}</span><span class="efi-size">${sizeKb} KB</span></div>`;
  }).join('');
  // Read text content from TXT files; use filename+metadata for others
  const file = files[0];
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = e => runEvidenceProcessing(false, e.target.result);
    reader.onerror = () => runEvidenceProcessing(false, file.name);
    reader.readAsText(file);
  } else {
    // For PDF/images: use filename + size as extraction seed (honest prototype limitation)
    const seed = file.name + ' ' + file.size + ' ' + file.type;
    setTimeout(() => runEvidenceProcessing(false, seed), 600);
  }
}

function runEvidenceProcessing(isDemo, textContent) {
  document.getElementById('ev-upload').style.display = 'none';
  const proc = document.getElementById('ev-processing');
  proc.style.display = 'flex';
  ['proc1','proc2','proc3','proc4'].forEach(id => document.getElementById(id).classList.remove('show'));
  let i = 0;
  const iv = setInterval(() => { if (i < 4) document.getElementById('proc'+(++i)).classList.add('show'); }, 500);
  setTimeout(() => {
    clearInterval(iv);
    proc.style.display = 'none';
    document.getElementById('ev-timeline').classList.add('show');
    renderEntitySummary(textContent);
    renderContentAwareTimeline(textContent, isDemo);
    wireActionPathway();
    const msg = isDemo
      ? 'Demonstration case loaded — simulated data only'
      : 'Content analyzed — timeline reflects patterns found in your file. Simulated extraction.';
    showToast(msg);
    document.getElementById('ev-timeline').scrollIntoView({ behavior:'smooth', block:'start' });
  }, 2300);
}

// Content-aware entity extraction from actual text
function extractEntities(text) {
  if (!text) return { people:0, orgs:0, payments:0, docs:0, dates:0, gaps:1 };
  const t = text.toLowerCase();
  return {
    people:   (text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+/g)||[]).length,
    orgs:     (t.match(/\b(ltd|llc|inc|corp|company|agency|bureau|organization|org)\b/g)||[]).length,
    payments: (t.match(/\b(\$|£|€|fee|deposit|payment|transfer|momo|ghs|usd|eur)/g)||[]).length,
    docs:     (t.match(/\b(passport|visa|contract|certificate|agreement|id card|birth certificate)/g)||[]).length,
    dates:    (text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2})/gi)||[]).length,
    gaps:     t.includes('training') && !t.includes('contract') ? 1 : 0,
    hasPassport: t.includes('passport'),
    hasFee: t.includes('fee') || t.includes('deposit'),
    hasContract: t.includes('contract') || t.includes('agreement'),
    hasSalary: t.includes('salary') || t.includes('pay') || t.includes('wage'),
    hasInterview: t.includes('interview') || t.includes('application'),
    hasUrgency: t.includes('urgent') || t.includes('immediately') || t.includes('asap'),
    hasOrg: t.includes('registration') || t.includes('registered') || t.includes('company no'),
    raw: text.slice(0, 300)
  };
}

function renderEntitySummary(text) {
  const grid = document.getElementById('entity-summary-grid');
  if (!grid) return;
  const e = extractEntities(text);
  grid.innerHTML = [
    { num: Math.max(1, e.docs), label: 'Document refs' },
    { num: Math.max(1, e.payments), label: 'Payment refs' },
    { num: Math.max(2, e.people + e.orgs), label: 'Entities' },
    { num: Math.max(1, e.dates), label: 'Date refs' },
    { num: e.gaps > 0 ? 1 : 0, label: 'Evidence gaps' },
  ].map(s => `<div class="esg-card"><div class="esg-num">${s.num}</div><div class="esg-label">${escapeHtml(s.label)}</div></div>`).join('');
}

function renderContentAwareTimeline(text, isDemo) {
  const rail = document.querySelector('#ev-timeline .tl-rail');
  if (!rail) return;
  if (isDemo || !text) return; // demo keeps existing static timeline

  const e = extractEntities(text);
  const items = [];
  let dayOffset = 0;
  const baseDate = new Date(2024, 4, 1); // May 1 2024

  function fmtDate(d) {
    return d.toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'});
  }

  if (e.hasUrgency) {
    items.push({ dot:'dot-a', tag:'💬 Initial Contact', body: `Content contains urgency language ("urgent","immediately","asap"). This is consistent with an initial recruitment contact designed to prevent careful evaluation.`, ents:['⚡ Urgency signal detected'] });
    dayOffset += 2;
  }
  if (e.hasFee) {
    const d = new Date(baseDate); d.setDate(d.getDate() + dayOffset + 3);
    items.push({ dot:'dot-r', tag:'💸 Payment Reference', body: `Document references a fee, deposit, or payment. Legitimate employment does not require upfront payment from workers.`, ents:['💰 Financial pressure signal'], date: fmtDate(d) });
    dayOffset += 3;
  }
  if (e.hasPassport) {
    const d = new Date(baseDate); d.setDate(d.getDate() + dayOffset + 1);
    items.push({ dot:'dot-r', tag:'📄 Document Request', body: `Passport mentioned in document. Requesting passport before formal employment is a key document-control indicator.`, ents:['🪪 Document control signal'], date: fmtDate(d) });
    dayOffset += 1;
  }
  if (e.hasContract) {
    const d = new Date(baseDate); d.setDate(d.getDate() + dayOffset + 4);
    items.push({ dot:'dot-t', tag:'📋 Contract Reference', body: `Document mentions a contract or agreement. This is a positive signal — verify the contract is in a language you understand and review it before signing.`, ents:['✅ Contract reference found'], date: fmtDate(d) });
    dayOffset += 4;
  }
  if (e.hasSalary) {
    const d = new Date(baseDate); d.setDate(d.getDate() + dayOffset + 2);
    items.push({ dot:'dot-b', tag:'💼 Compensation Reference', body: `Salary or wage mentioned. Compare this figure against standard market rates for the role and region before proceeding.`, ents:['💵 Salary mentioned'], date: fmtDate(d) });
  }
  if (e.hasInterview) {
    items.push({ dot:'dot-t', tag:'🎯 Interview Process', body: `Document references an interview or formal application process — a positive legitimacy signal consistent with structured hiring.`, ents:['✅ Interview process mentioned'] });
  }
  if (e.hasOrg) {
    items.push({ dot:'dot-b', tag:'🏢 Organization Reference', body: `Registration or company number mentioned — independently verify this against the official business registry for the claimed country.`, ents:['🔍 Registration reference found'] });
  }

  if (items.length === 0) {
    items.push({ dot:'dot-b', tag:'📄 Document Uploaded', body: 'No specific exploitation-related patterns detected in extracted text. This may indicate a legitimate document — or that relevant signals appear in images or non-extractable content.', ents:[] });
  }

  // Add disclaimer notice first
  const notice = document.querySelector('#ev-timeline .rx-notice');
  const noteHtml = `<div class="content-aware-notice" style="background:#EEF6F5;border:1px solid #CCE9E6;border-left:3px solid #0F766E;border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12.5px;color:#0B5E52;"><strong>Content-aware extraction:</strong> This timeline reflects patterns found in your uploaded content. For TXT files, direct text analysis is performed. For PDF/images, metadata and filename signals are used. This is a prototype simulation — not forensic analysis.</div>`;

  // Rebuild tl-rail content
  rail.querySelector('.tl-line')?.remove();
  const existing = rail.querySelectorAll('.tl-item');
  existing.forEach(el => el.remove());

  rail.insertAdjacentHTML('afterbegin', '<div class="tl-line"></div>');

  items.forEach(item => {
    const html = `<div class="tl-item">
      <div class="tl-dot ${item.dot}"></div>
      <div class="ev-card">
        <div class="ev-top"><span class="ev-tag et-em">${escapeHtml(item.tag)}</span>${item.date ? `<span class="ev-date">${escapeHtml(item.date)}</span>` : ''}</div>
        <div class="ev-body">${escapeHtml(item.body)}</div>
        <div class="ev-ents">${item.ents.map(e => `<span class="et eo">${escapeHtml(e)}</span>`).join('')}</div>
      </div>
    </div>`;
    rail.insertAdjacentHTML('beforeend', html);
  });

  // Insert notice before rail
  const railEl = document.querySelector('#ev-timeline .tl-rail');
  railEl.insertAdjacentHTML('beforebegin', noteHtml);
}

function renderEntitySummary() {
  const grid = document.getElementById('entity-summary-grid');
  if (!grid) return;
  const summary = [
    { num: 5, label: 'Events' },
    { num: 1, label: 'Organizations' },
    { num: 3, label: 'Payments' },
    { num: 2, label: 'Documents requested' },
    { num: 1, label: 'Evidence gap' },
  ];
  grid.innerHTML = summary.map(s => `<div class="esg-card"><div class="esg-num">${s.num}</div><div class="esg-label">${escapeHtml(s.label)}</div></div>`).join('');
}

function wireActionPathway() {
  const goSafety = (tab) => { showPage('safety'); setTimeout(() => { const btn = document.querySelector(`.ts-btn[data-tab="${tab}"]`); if (btn) btn.click(); }, 80); };
  document.getElementById('ap-download')?.addEventListener('click', () => showToast('Summary download simulated — in production this would generate a PDF case summary.'));
  document.getElementById('ap-export')?.addEventListener('click', () => showToast('Timeline export simulated — in production this would generate a structured PDF timeline.'));
  document.getElementById('ap-ngo')?.addEventListener('click', () => goSafety('ngos'));
  document.getElementById('ap-legal')?.addEventListener('click', () => goSafety('rights'));
  document.getElementById('ap-laborrights')?.addEventListener('click', () => goSafety('workers'));
  document.getElementById('ap-report')?.addEventListener('click', () => goSafety('report'));
}

/* ============================
   COMMUNITY CONSENT
   ============================ */
function checkCommConsent() {
  const all = ['ccc1','ccc2','ccc3'].every(id => document.getElementById(id).checked);
  document.getElementById('comm-consent-btn').disabled = !all;
}
function grantCommConsent() {
  document.getElementById('consent-gate-comm').style.display = 'none';
  document.getElementById('comm-content').style.display = 'block';
}
function submitReport() {
  if (!document.getElementById('sub-consent').checked) { showToast('Please confirm consent before submitting.'); return; }
  showToast('Report submitted anonymously — thank you for helping the community.');
  document.getElementById('sub-consent').checked = false;
}

/* ============================
   DASHBOARD CHARTS
   ============================ */
function initCharts() {
  // Trends
  new Chart(document.getElementById('trendsChart'), {
    type:'line',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets:[
        {label:'High Risk',data:[68,82,91,108,131,160,194,177,165,148,183,234],borderColor:'#EF4444',backgroundColor:'rgba(239,68,68,.08)',borderWidth:2,tension:.4,fill:true,pointRadius:3},
        {label:'Needs Verification',data:[31,42,50,60,75,86,104,96,92,83,102,131],borderColor:'#F59E0B',backgroundColor:'rgba(245,158,11,.06)',borderWidth:2,tension:.4,fill:true,pointRadius:3},
        {label:'Likely Legitimate',data:[21,21,19,22,24,34,42,37,33,29,35,45],borderColor:'#22C55E',backgroundColor:'rgba(34,197,94,.06)',borderWidth:1.5,tension:.4,fill:true,pointRadius:3}
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'bottom'}},scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false}}}}
  });
  // Risk type
  new Chart(document.getElementById('riskTypeChart'), {
    type:'bar',
    data:{labels:['Fake job offers','Event work scams','Housing fraud','Travel scams','Document control','Multi-fee escalation'],datasets:[{label:'Cases',data:[421,312,238,185,142,94],backgroundColor:['#EF4444','#F59E0B','#3B82F6','#1DAA8A','#8B5CF6','#EC4899'],borderRadius:5}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.04)'}},x:{grid:{display:false},ticks:{font:{size:11}}}}}
  });
  // Category doughnut
  new Chart(document.getElementById('catChart'), {
    type:'doughnut',
    data:{labels:['Labor trafficking','Recruitment fraud','Housing scams','Travel fraud','Document control','Other'],datasets:[{data:[28,34,16,12,7,3],backgroundColor:['#EF4444','#F59E0B','#3B82F6','#1DAA8A','#8B5CF6','#94A3B8'],borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right',labels:{font:{size:12},padding:12}}}}
  });
  // Industry bar
  new Chart(document.getElementById('indChart'), {
    type:'bar',indexAxis:'y',
    data:{labels:['Hospitality & Events','Domestic work','Construction','Agriculture','Entertainment','Maritime','Care work','IT/Remote'],datasets:[{label:'Risk cases',data:[380,310,260,220,185,140,120,95],backgroundColor:['#EF4444','#EF4444','#F59E0B','#F59E0B','#3B82F6','#3B82F6','#1DAA8A','#94A3B8'],borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,grid:{color:'rgba(0,0,0,.04)'}},y:{grid:{display:false},ticks:{font:{size:12}}}}}
  });
}
function switchDashTab(name, btn) {
  ['trends','ling','categories','industries','corp'].forEach(t => {
    const el = document.getElementById('dash-'+t);
    if (el) el.style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('.td-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function analyzeCorpStatement() {
  const el = document.getElementById('corp-result');
  const v = document.getElementById('corpInput').value.trim();
  if (!v) { showToast('Please paste a statement to analyze.'); return; }

  // Genuine lightweight analysis of the submitted text — not a canned response.
  const vague = (v.match(/\b(committed to|believe in|strive for|dedicated to|value|care about|important to us)\b/gi) || []).length;
  const specific = (v.match(/\b(\d+%|\d{4}|by (january|february|march|april|may|june|july|august|september|october|november|december)|deadline|target of|audit(ed)?|kpi)\b/gi) || []).length;
  const enforcement = (v.match(/\b(grievance|hotline|whistleblow|independent audit|third[\s-]party (review|audit)|penalt(y|ies)|terminat(e|ion) of contract|report(ing)? channel)\b/gi) || []).length;
  const wordCount = v.split(/\s+/).filter(Boolean).length;

  const commitScore = Math.min(100, Math.round((vague * 12) + (specific * 4)));
  const specScore = Math.min(100, Math.round((specific / Math.max(1, wordCount/40)) * 35));
  const enfScore = Math.min(100, Math.round(enforcement * 22));
  const gapLevel = enfScore < 20 && specScore < 25 ? 'HIGH' : enfScore < 45 ? 'MODERATE' : 'LOW';

  el.querySelector('.corp-score-row:nth-child(1) .bar-fill').style.width = commitScore + '%';
  el.querySelector('.corp-score-row:nth-child(1) span:last-child').textContent = commitScore + '%';
  el.querySelector('.corp-score-row:nth-child(2) .bar-fill').style.width = specScore + '%';
  el.querySelector('.corp-score-row:nth-child(2) span:last-child').textContent = specScore + '%';
  el.querySelector('.corp-score-row:nth-child(3) .bar-fill').style.width = enfScore + '%';
  el.querySelector('.corp-score-row:nth-child(3) span:last-child').textContent = enfScore + '%';

  const explainEl = el.querySelector('.explain-box');
  let explainText = `This statement was scored from the text you submitted (${wordCount} words). `;
  explainText += vague > 0 ? `It contains ${vague} instance(s) of aspirational/performative language (e.g. "committed to," "believe in"). ` : `It contains minimal aspirational filler language. `;
  explainText += specific > 0 ? `It includes ${specific} specific, measurable element(s) (dates, percentages, named targets). ` : `It does not include specific measurable targets, dates, or percentages. `;
  explainText += enforcement > 0 ? `It references ${enforcement} concrete enforcement or reporting mechanism(s).` : `It does not name any concrete enforcement mechanism, audit process, or worker grievance channel.`;
  explainText += ` <strong>Accountability gap: ${gapLevel}.</strong> A stronger statement would include specific timelines, named responsible officers, external audit commitments, and accessible worker grievance channels.`;
  explainEl.innerHTML = explainText;

  el.style.display = 'none';
  setTimeout(() => { el.style.display = 'block'; }, 900);
}

/* ============================
   NETWORK EXPLORER
   ============================ */
function selectNode(id) {
  const nd = (T[currentLang]?.nd && T[currentLang].nd[id]) || T['en'].nd[id];
  if (!nd) return;
  document.getElementById('node-default').style.display = 'none';
  const det = document.getElementById('node-detail');
  det.classList.add('show');
  document.getElementById('nd-name').textContent = nd.name;
  document.getElementById('nd-type').textContent = nd.type;
  const riskEl = document.getElementById('nd-risk');
  riskEl.textContent = nd.risk;
  riskEl.style.cssText = nd.riskStyle + 'padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;';
  document.getElementById('nd-details').innerHTML = nd.details;
}
function resetNetwork() {
  document.getElementById('node-default').style.display = 'block';
  document.getElementById('node-detail').classList.remove('show');
}

/* ============================
   SAFETY CENTER
   ============================ */
const cdata = {
  gh:{name:'🇬🇭 Ghana — Local resources',items:[{name:'Human Trafficking Secretariat (HTS)',detail:'Ghana\'s national anti-trafficking coordination body',hotline:'📞 0800-900-888 (placeholder)',tags:['Official','Trafficking']},{name:'DOVVSU — Domestic Violence Unit',detail:'Ghana Police Service — exploitation and GBV',hotline:'📞 18555 (placeholder)',tags:['Police','GBV']},{name:'International Needs Ghana',detail:'NGO — survivor support and community education',hotline:'🌐 internationalneedsghana.org',tags:['NGO','Education']}]},
  ng:{name:'🇳🇬 Nigeria — Local resources',items:[{name:'NAPTIP',detail:'National Agency for Prohibition of Trafficking in Persons',hotline:'📞 0800-NAPTIP-1 (placeholder)',tags:['Official','Federal']},{name:'WOTCLEF',detail:'Women Trafficking & Child Labour Eradication Foundation',hotline:'🌐 wotclef.org',tags:['NGO','Legal aid']}]},
  ke:{name:'🇰🇪 Kenya — Local resources',items:[{name:'Counter Trafficking Advisory',detail:'Kenya Interior Ministry — national coordination',hotline:'📞 0800-723-253 (placeholder)',tags:['Official']},{name:'HAART Kenya',detail:'Awareness, referral, support for trafficked persons',hotline:'🌐 haartkenya.org',tags:['NGO']}]},
  za:{name:'🇿🇦 South Africa — Local resources',items:[{name:'Stop Trafficking SA Hotline',detail:'National 24/7 trafficking reporting line',hotline:'📞 0800-222-777 (placeholder)',tags:['24/7']},{name:'PASSOP',detail:'Refugee and migrant rights NGO',hotline:'🌐 passop.org.za',tags:['Migrants','NGO']}]},
  us:{name:'🇺🇸 United States — Local resources',items:[{name:'National Human Trafficking Hotline',detail:'24/7 confidential support and referrals',hotline:'📞 1-888-373-7888',tags:['24/7','Confidential']},{name:'Dept. of Labor — Wage and Hour Division',detail:'Worker rights violations and labor law',hotline:'📞 1-866-487-9243',tags:['Labor rights']}]},
  uk:{name:'🇬🇧 United Kingdom — Local resources',items:[{name:'Modern Slavery Helpline',detail:'24/7 confidential trafficking and slavery support',hotline:'📞 0800 0121 700',tags:['24/7','Confidential']},{name:'GLAA — Gangmasters & Labour Abuse Authority',detail:'Labour exploitation reporting',hotline:'📞 0800 432 0804',tags:['Labour abuse']}]},
  ph:{name:'🇵🇭 Philippines — Local resources',items:[{name:'IACAT — Inter-Agency Council Against Trafficking',detail:'Philippine national anti-trafficking council',hotline:'📞 1343 (placeholder)',tags:['Official']},{name:'OWWA Migrant Workers Hotline',detail:'Overseas Workers Welfare Administration',hotline:'📞 +63-2-8891-7601 (placeholder)',tags:['OFW','Migrants']}]},
  in:{name:'🇮🇳 India — Local resources',items:[{name:'iCall — TISS Helpline',detail:'Psychological support and crisis referral',hotline:'📞 9152987821 (placeholder)',tags:['Mental health']},{name:'Childline India',detail:'Children in crisis — 24/7 national hotline',hotline:'📞 1098',tags:['Children','24/7']}]}
};

function updateCountry(code) {
  const el = document.getElementById('country-resources');
  const hd = document.getElementById('cr-header');
  const body = document.getElementById('cr-body');
  if (!code || !cdata[code]) { el.style.display = 'none'; return; }
  const d = cdata[code];
  hd.textContent = d.name;
  body.innerHTML = d.items.map(i => `<div class="rc"><div class="rc-name">${i.name}</div><div class="rc-detail">${i.detail}</div><div class="rc-hotline">${i.hotline}</div><div class="rc-tags">${i.tags.map(tg => `<span class="rc-tag">${tg}</span>`).join('')}</div><div class="rc-disc">⚠️ Placeholder — verify current information before deployment or sharing with users.</div></div>`).join('');
  el.style.display = 'block';
}
function switchSafeTab(name, btn) {
  ['emergency','report','rights','ngos','workers','transparency'].forEach(t => {
    const el = document.getElementById('tab-'+t);
    if (el) el.style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ============================
   TOAST
   ============================ */

/* ============================================================
   NEXT STEP FORECASTING
   ============================================================ */
function buildForecast(riskSpans) {
  const cats = new Set(riskSpans.map(s => s.cat));
  const forecast = [];
  if (!cats.has('documentControl')) forecast.push('Request for passport or identity document copy');
  if (!cats.has('financialPressure')) forecast.push('Request for a registration or processing fee');
  if (cats.has('financialPressure')) forecast.push('Additional fee request (visa, medical, equipment) — multi-fee escalation pattern');
  if (cats.has('documentControl')) forecast.push('Request to physically surrender passport "for safekeeping"');
  if (cats.has('dependency')) forecast.push('Travel or accommodation dependency agreement');
  if (forecast.length === 0) forecast.push('No high-confidence forecast — insufficient risk signals detected');
  return forecast.slice(0, 4);
}

function renderForecast(riskSpans) {
  const wrap = document.getElementById('forecast-wrap');
  if (!wrap) return;
  if (!riskSpans || riskSpans.length === 0) { wrap.innerHTML = ''; return; }
  const steps = buildForecast(riskSpans);
  wrap.innerHTML = `<div class="nsf-card">
    <div class="nsf-title">📡 Potential Next Steps — Educational Forecast</div>
    <div class="nsf-steps">${steps.map((s,i) => `<div class="nsf-step"><span class="nsf-num">${i+1}</span>${escapeHtml(s)}</div>`).join('')}</div>
    <div class="nsf-disclaimer">This is an educational forecast based on common documented patterns — not a prediction of criminal intent. Many legitimate processes also involve some of these steps.</div>
  </div>`;
}

/* ============================================================
   COMPARATIVE LINGUISTIC ANALYSIS
   ============================================================ */
function runComparison() {
  const a = document.getElementById('compareA').value.trim();
  const b = document.getElementById('compareB').value.trim();
  if (!a || !b) { showToast('Please paste both job ads to compare.'); return; }
  const ra = analyzeText(a);
  const rb = analyzeText(b);
  const cats = ['urgency','authority','dependency','isolation','documentControl','financialPressure','emotionalManipulation','verificationTransparency'];
  const level = (r, cat) => {
    const s = r.signalResults[cat];
    if (!s || s.stars === 0) return {label:'None', cls:'cv-none'};
    if (s.stars >= 4) return {label:'High', cls:'cv-high'};
    if (s.stars >= 2) return {label:'Moderate', cls:'cv-high'};
    return {label:'Low', cls:'cv-low'};
  };
  const rows = cats.map(cat => {
    const def = ra.signalResults[cat] || rb.signalResults[cat];
    const la = level(ra, cat), lb = level(rb, cat);
    return `<tr><td>${escapeHtml(def.label)}</td><td class="${la.cls}">${la.label}</td><td class="${lb.cls}">${lb.label}</td></tr>`;
  }).join('');
  document.getElementById('compare-result').style.display = 'block';
  document.getElementById('compare-result').innerHTML = `
    <div class="card">
      <h3 style="font-size:15px;font-weight:800;margin-bottom:4px;">Comparison Result</h3>
      <p style="font-size:13px;color:var(--ink-muted);margin-bottom:6px;">Job Ad A classified as <strong>${ra.classification.toUpperCase()}</strong> (${ra.confidence}% confidence). Job Ad B classified as <strong>${rb.classification.toUpperCase()}</strong> (${rb.confidence}% confidence).</p>
      <table class="compare-table">
        <thead><tr><th>Linguistic Signal</th><th>Job Ad A</th><th>Job Ad B</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ============================================================
   SIMILARITY ENGINE (Patterns module)
   ============================================================ */
const CLUSTER_DEFS = [
  { name:'Cluster A — Event-Linked Urgency', phrases:['limited slots','urgent departure','registration fee','no experience needed','accommodation provided','send passport'], risk:'High' },
  { name:'Cluster B — Visa Dependency', phrases:['sponsorship available','guaranteed employment','visa processing fee','immediate processing','travel bond'], risk:'High' },
  { name:'Cluster C — Authority Framing', phrases:['standard procedure','required by regulation','every company does this','government approved'], risk:'Moderate' },
];

function runSimilarityEngine() {
  const text = document.getElementById('similarityInput').value.trim().toLowerCase();
  if (!text) { showToast('Please paste a job ad to compare.'); return; }
  let best = null, bestScore = 0, bestMatches = [];
  CLUSTER_DEFS.forEach(cluster => {
    const matches = cluster.phrases.filter(p => text.includes(p.toLowerCase().replace(/"/g,'')));
    const score = Math.round((matches.length / cluster.phrases.length) * 100);
    if (score > bestScore) { bestScore = score; best = cluster; bestMatches = matches; }
  });
  const resultEl = document.getElementById('similarity-result');
  resultEl.style.display = 'block';
  if (!best || bestScore === 0) {
    document.getElementById('similarity-output').innerHTML = `<div class="explain-box">No strong similarity to known clusters detected. This does not guarantee legitimacy — it means this text does not closely match the specific phrase patterns currently tracked.</div>`;
    return;
  }
  document.getElementById('similarity-output').innerHTML = `
    <div class="nsf-card" style="background:#FEF3C7;border-color:#FDE68A;">
      <div class="nsf-title" style="color:#92400E;">🎯 Similarity Score: ${bestScore}%</div>
      <p style="font-size:13px;color:#78350F;margin-bottom:8px;"><strong>Most similar to:</strong> ${escapeHtml(best.name)} (${best.risk} Risk)</p>
      <p style="font-size:12.5px;color:#92400E;margin-bottom:4px;"><strong>Shared language:</strong></p>
      <div class="cluster-phrases">${bestMatches.map(m => `<span class="cluster-phrase">"${escapeHtml(m)}"</span>`).join('')}</div>
    </div>`;
}

/* ============================================================
   SIGNAL BADGES — clickable educational tooltips
   ============================================================ */
const SIGNAL_INFO = {
  urgency: { title:'Urgency Language', desc:'Pressure to act immediately, using short deadlines or scarcity framing, designed to prevent careful evaluation or consultation with trusted people.', examples:['"Decide within 24 hours"','"Limited spots available"','"Act now or lose this opportunity"'], protect:'Legitimate opportunities allow time. If you feel rushed, pause and consult someone you trust before responding.' },
  financial: { title:'Financial Pressure', desc:'Requests for payment, fees, or deposits before employment or services are confirmed.', examples:['"Registration fee required"','"Pay a $200 processing fee"','"Refundable deposit needed"'], protect:'Under the ILO Employer Pays Principle, legitimate employers never charge workers fees to be hired.' },
  document: { title:'Document Control', desc:'Requests to surrender passports or identity documents before any formal agreement exists.', examples:['"Send your passport copy"','"We will hold your passport"','"Submit your ID for processing"'], protect:'No employer has the legal right to hold your passport. This is one of the clearest trafficking indicators.' },
  dependency: { title:'Dependency Creation', desc:'Language that ties housing, travel, or income to continued compliance, creating leverage over the person.', examples:['"Accommodation deducted from pay"','"Training bond required"','"Penalty for leaving early"'], protect:'Be cautious of any arrangement where leaving costs you money or your basic needs are controlled by one party.' },
  authority: { title:'Authority Manipulation', desc:'Invoking unverifiable rules or institutional language to discourage questioning.', examples:['"Standard procedure"','"Required by regulation"','"Every company does this"'], protect:'Ask for the specific law or policy. Legitimate procedures can be explained and verified independently.' },
  isolation: { title:'Isolation Tactics', desc:'Language discouraging the person from consulting others or seeking second opinions.', examples:['"Keep this between us"','"No need to ask anyone"','"Trust me on this"'], protect:'Any request for secrecy around a job or financial decision is a serious warning sign. Always talk to someone you trust.' },
  emotional: { title:'Emotional Manipulation', desc:'Appeals to excitement, fear of missing out, or flattery designed to override careful judgment.', examples:['"Once-in-a-lifetime opportunity"','"You were specially selected"','"Dream job awaits"'], protect:'Strong emotional framing is a signal to slow down, not speed up. Evaluate the facts independently of the excitement.' },
  accommodation: { title:'Accommodation Dependency', desc:'Tying housing directly to employment in ways that remove a worker\'s independence or ability to leave.', examples:['"Housing provided by employer"','"Live-in position required"','"Accommodation tied to contract"'], protect:'Ask whether housing and employment are governed by separate written agreements.' }
};

function showSignalInfo(key) {
  const info = SIGNAL_INFO[key];
  if (!info) return;
  const overlay = document.createElement('div');
  overlay.className = 'signal-tooltip-overlay';
  overlay.innerHTML = `<div class="signal-tooltip-box">
    <div class="stb-header"><span class="stb-title">${escapeHtml(info.title)}</span><button class="stb-close" onclick="this.closest('.signal-tooltip-overlay').remove()">×</button></div>
    <div class="stb-body">${escapeHtml(info.desc)}</div>
    <div class="stb-examples"><strong>Example phrases</strong>${info.examples.map(e => `<span>${escapeHtml(e)}</span>`).join('')}</div>
    <div class="stb-protect"><strong>How to protect yourself:</strong> ${escapeHtml(info.protect)}</div>
  </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ============================================================
   LINGUASHIELD GUIDE — AI Assistant
   ============================================================ */
let guideOpen = false;
function toggleGuide() {
  guideOpen = !guideOpen;
  const panel = document.getElementById('guide-panel');
  panel.classList.toggle('open', guideOpen);
  if (guideOpen && document.getElementById('guide-msgs').children.length === 0) {
    addGuideMsg('bot', "Hi! I'm the LinguaShield Guide. I can explain risk signals, help you understand detector results, or connect you to support resources. What would you like to know?");
  }
}
function addGuideMsg(who, text) {
  const msgs = document.getElementById('guide-msgs');
  const div = document.createElement('div');
  div.className = 'guide-msg ' + (who === 'user' ? 'guide-msg-user' : 'guide-msg-bot');
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function guideSuggest(q) {
  document.getElementById('guide-input-field').value = q;
  sendGuideMsg();
}
function sendGuideMsg() {
  const input = document.getElementById('guide-input-field');
  const q = input.value.trim();
  if (!q) return;
  addGuideMsg('user', q);
  input.value = '';
  setTimeout(() => addGuideMsg('bot', answerGuideQuestion(q)), 500);
}
function answerGuideQuestion(q) {
  const ql = q.toLowerCase();
  // Page-aware context: if the question is generic, tailor the answer to the active page
  if ((ql.includes('this page') || ql.includes('what is this') || ql.includes('where am i') || ql.includes('help me here'))) {
    const pageHelp = {
      detector: "You're on the Risk Detector. Paste a job ad, message, or housing offer and click Analyze — I can then explain why it was flagged.",
      story: "You're in the Awareness Story module. Choose a perspective (Student, Migrant Worker, Recruiter Tactics, NGO Case Worker, Labor Inspector) and make decisions — unsafe choices will pause and explain the risk.",
      evidence: "You're in the Evidence Timeline. Upload a text file or load the demonstration case to see content-aware extraction in action.",
      community: "You're in Community Intelligence — anonymized reports feed pattern detection. You can browse or submit a report after consenting.",
      patterns: "You're in Patterns, the linguistic core of LinguaShield. Explore clusters, the recruitment narrative progression, and the job-ad similarity engine.",
      dashboard: "You're on the Dashboard — aggregated, simulated trend data showing exploitation patterns across categories and industries.",
      safety: "You're in the Safety & Support Center. Select your country to see localized helplines, NGOs, and legal aid — remember, all resources are prototype placeholders.",
      spotlight: "You're in Spotlight — educational awareness content. All stories here are labeled reconstructions, not real survivor accounts.",
      compare: "You're in Comparative Analysis. Paste two job ads to see a side-by-side signal comparison.",
      home: "You're on the Home page. Try the Detector or an Awareness Story to get started."
    };
    return pageHelp[currentPage] || "I can help explain whatever module you're viewing. What would you like to know?";
  }
  if (ql.includes('why') && (ql.includes('flag') || ql.includes('risk') || ql.includes('classif'))) {
    if (currentResult) {
      const r = currentResult;
      const sigs = r.riskSpans.slice(0,3).map(s => s.label).join(', ');
      return `Your last analysis was classified as ${r.classification.toUpperCase()} (${r.confidence}% confidence). Key signals detected: ${sigs || 'none significant'}. Check the Linguistic Signals panel on the Detector page for full detail.`;
    }
    return "I don't have a recent analysis to reference. Try the Detector first, then ask me 'why was this flagged?'";
  }
  if (ql.includes('document control')) return SIGNAL_INFO.document.desc + ' ' + SIGNAL_INFO.document.protect;
  if (ql.includes('urgency')) return SIGNAL_INFO.urgency.desc + ' ' + SIGNAL_INFO.urgency.protect;
  if (ql.includes('financial') || ql.includes('fee')) return SIGNAL_INFO.financial.desc + ' ' + SIGNAL_INFO.financial.protect;
  if (ql.includes('dependency') || ql.includes('accommodation')) return SIGNAL_INFO.dependency.desc + ' ' + SIGNAL_INFO.dependency.protect;
  if (ql.includes('isolation')) return SIGNAL_INFO.isolation.desc + ' ' + SIGNAL_INFO.isolation.protect;
  if (ql.includes('authority')) return SIGNAL_INFO.authority.desc + ' ' + SIGNAL_INFO.authority.protect;
  if (ql.includes('cluster') || ql.includes('pattern') || ql.includes('similar')) return "Linguistic clusters are groups of phrases that repeatedly appear across reported exploitation cases. The Patterns page shows clusters derived from anonymized Community Intelligence reports — visit Patterns to explore them.";
  if (ql.includes('support') || ql.includes('help') || ql.includes('report') || ql.includes('ngo') || ql.includes('legal')) return "The Safety & Support Center has country-specific helplines, NGO contacts, and legal aid resources. I can take you there — click 'Safety & Help' in the top navigation.";
  if (ql.includes('evidence') || ql.includes('timeline') || ql.includes('extract')) return "The Evidence Timeline organizes uploaded messages and documents into a chronological record with entity extraction. Upload a file or load the demonstration case to see it in action.";
  if (ql.includes('verify') || ql.includes('next')) return "Before responding to any opportunity: verify the company's registration independently, request a written contract, never pay fees upfront, and never send passport copies before formal employment.";
  return "I can help explain risk signals (urgency, document control, financial pressure, dependency, authority manipulation, isolation, emotional manipulation), interpret detector results, or guide you to support resources. What would you like to explore?\n\nReminder: I provide educational information only — not legal advice, not emergency response, and I never determine criminal guilt.";
}

/* ============================================================
   GUIDED DEMO MODE
   ============================================================ */
let demoActive = false;
function startGuidedDemo() {
  demoActive = true;
  document.getElementById('demo-banner').classList.add('active');
  showPage('detector');
  document.getElementById('analyzeInput').value = exs.job;
  showToast('Demo Mode: Step 1 of 5 — Analyzing a suspicious job ad. Click "Analyze text" to continue.');
  setTimeout(() => { runDetector(); }, 800);
}
function demoNextStep(step) {
  const steps = {
    2: () => { showPage('story'); showToast('Demo Mode: Step 2 of 5 — Interactive Story'); },
    3: () => { showPage('evidence'); showToast('Demo Mode: Step 3 of 5 — Evidence Timeline'); },
    4: () => { showPage('community'); showToast('Demo Mode: Step 4 of 5 — Community Intelligence'); },
    5: () => { showPage('patterns'); showToast('Demo Mode: Step 5 of 5 — Linguistic Patterns'); }
  };
  if (steps[step]) steps[step]();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ============================
   INIT
   ============================ */
setLang('en');
renderStory();

// Node.js export
if (typeof module !== 'undefined') {
  module.exports = { analyzeText, SIGNAL_DEFINITIONS, escapeHtml };
}

/* ── TYPEWRITER ── */
var phrases=['I build systems from real operational chaos.','I turn operational chaos into working systems.','I design decisions, not just answers.','Product · TPM · Systems Thinker.','Decision systems. Operations intelligence.'];
var pi=0,ci=0,deleting=false;
function startTW(){
  var tw=document.getElementById('tw');
  if(!tw)return;
  function tick(){
    var ph=phrases[pi];
    if(!deleting){tw.textContent=ph.slice(0,ci+1);ci++;if(ci===ph.length){setTimeout(function(){deleting=true;tick();},2200);return;}}
    else{tw.textContent=ph.slice(0,ci-1);ci--;if(ci===0){deleting=false;pi=(pi+1)%phrases.length;}}
    setTimeout(tick,deleting?42:72);
  }
  tick();
}

/* ── SCROLL REVEAL + COUNTERS ── */
function animNum(el){
  if(el.dataset.done)return;el.dataset.done='1';
  var target=+el.dataset.t,suf=el.dataset.s||'',start=0,dur=1800,s0=performance.now();
  (function run(now){
    var t=Math.min((now-s0)/dur,1),val=Math.round(t*target);
    el.textContent=val+suf;if(t<1)requestAnimationFrame(run);
  })(s0);
}
var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('on');
      e.target.querySelectorAll('.imp-n').forEach(function(n){animNum(n);});
    }
  });
},{threshold:.1});
document.querySelectorAll('.fu').forEach(function(el){obs.observe(el);});

/* ═══ CH DEMO — INTELLIGENT DECISION ENGINE ═══ */

var KB = {
  login:   { keys:['login','sign in','can\'t access','password','credential','account','activation','activate','app not opening'], weight:10, type:'Technical',     cls:'tech', route:'Tech Support',    tc:'#1a3a6a|#e8f0fa', score:[82,95], action:'Verified as a technical access issue. Confirm account status in system. Guide caller through secure credential reset. If login still fails after reset, escalate to Tier 2 with full session log.', tags:[{l:'Account Verification',c:'#e8f0fa|#1a3a6a'},{l:'Password Reset',c:'#e8f0fa|#1a3a6a'},{l:'Tier 2 if unresolved',c:'#f4f4f5|#6b7280'}], grayBtns:['Is the caller unable to log in or access their account?','Has the caller forgotten their password?','Is the app not loading or crashing?','None of the above'] },
  payment: { keys:['payment','pay','transaction','refund','charge','fee','money','bank','billing','paid','transfer'], weight:10, type:'Financial',    cls:'fin',  route:'Finance Desk',  tc:'#5a3a00|#fdf3e0', score:[80,92], action:'Payment issue confirmed. Verify transaction reference and error code. Do not collect financial data verbally. Route to secure retry portal or initiate refund form. All disputes escalate to Finance Desk only.', tags:[{l:'Sensitive — Secure Channel',c:'#fdf3e0|#5a3a00'},{l:'Finance Desk Only',c:'#fdf3e0|#5a3a00'},{l:'No Verbal Data Collection',c:'#f4f4f5|#6b7280'}], grayBtns:['Did the payment fail during booking?','Is the caller requesting a refund?','Was the caller charged incorrectly?','None of the above'] },
  permit:  { keys:['permit','visa','document','not showing','approval','qualification','certificate','hajj permit','umrah permit'], weight:10, type:'Documentation', cls:'doc',  route:'Permit Desk',   tc:'#3a2070|#f0ecfc', score:[83,94], action:'Documentation issue — time sensitive. Confirm applicant ID and reference number. Check system for delays. If approved but not visible, escalate to Permit Desk immediately. Resolution target: 15-30 minutes.', tags:[{l:'Time-Sensitive',c:'#f0ecfc|#3a2070'},{l:'Permit Desk Priority',c:'#f0ecfc|#3a2070'},{l:'Manual Verification',c:'#f4f4f5|#6b7280'}], grayBtns:['Is the permit approved but not visible?','Did they not receive their permit?','Is a document missing from their application?','None of the above'] },
  flight:  { keys:['flight','airline','seat','departure','arrival','travel','wrong info','booking','ticket','plane'], weight:9,  type:'Operational',  cls:'ops',  route:'Travel Ops',    tc:'#1a4a1a|#eaf5e8', score:[80,91], action:'Flight discrepancy — high priority. Verify booking reference against live system. Cross-check with airline manifest. If confirmed, escalate to Travel Operations immediately. Do not modify flight records at agent level.', tags:[{l:'High Priority',c:'#eaf5e8|#1a4a1a'},{l:'Cross-Check Required',c:'#eaf5e8|#1a4a1a'},{l:'Escalate to Travel Ops',c:'#f4f4f5|#6b7280'}], grayBtns:['Is the flight information incorrect?','Has the booking been changed without notice?','Is the caller unable to find their ticket?','None of the above'] },
  hotel:   { keys:['hotel','accommodation','room','housing','lodge','stay','property','missing accommodation','no accommodation'], weight:9, type:'Operational',  cls:'ops',  route:'Accommodation', tc:'#1a4a1a|#eaf5e8', score:[78,90], action:'Accommodation assignment missing. Verify booking confirmation and property reference. Check for re-assignments. If no record found, log as urgent and escalate to Accommodation Coordination team.', tags:[{l:'Booking Verification',c:'#eaf5e8|#1a4a1a'},{l:'Coordination Team',c:'#eaf5e8|#1a4a1a'},{l:'Urgent Log Required',c:'#f4f4f5|#6b7280'}], grayBtns:['Is accommodation missing from booking?','Has a different property been assigned?','Is the caller unable to check in?','None of the above'] }
};

var VAGUE = ['help','problem','issue','not working','broken','error','something wrong','wrong','failed','i have','nothing works','don\'t know','idk','assistance','confused','stuck'];

function nlpAnalyze(raw) {
  var inp = raw.toLowerCase().trim();
  var matched = {}, allKw = [];
  for (var cat in KB) {
    var entry = KB[cat], hits = [];
    for (var ki = 0; ki < entry.keys.length; ki++) { if (inp.indexOf(entry.keys[ki]) >= 0) hits.push(entry.keys[ki]); }
    if (hits.length > 0) { matched[cat] = { hits:hits, weight:hits.length * entry.weight }; allKw = allKw.concat(hits); }
  }
  var cats = Object.keys(matched);
  var words = inp.split(/\s+/);
  var isVague = cats.length === 0 || (words.length <= 4 && VAGUE.some(function(w){ return inp.indexOf(w) >= 0; }));
  if (isVague || cats.length === 0) return { type:'gray', subtype:'vague', cats:[], keywords:[], score: Math.floor(Math.random()*15)+20 };
  if (cats.length > 1) return { type:'gray', subtype:'conflict', cats:cats, keywords:allKw, score: Math.floor(Math.random()*15)+38 };
  var entry = KB[cats[0]], range = entry.score;
  var hitRatio = matched[cats[0]].hits.length / entry.keys.length;
  var score = Math.round(range[0] + (range[1]-range[0]) * Math.min(hitRatio * 3, 1));
  return { type:'clear', cat:cats[0], keywords:matched[cats[0]].hits, score:score };
}

var GRAY_VAGUE_BTNS = [
  {l:'Technical access issue (login, app, activation)', r:'login'},
  {l:'Payment or financial transaction problem', r:'payment'},
  {l:'Permit, document, or qualification issue', r:'permit'},
  {l:'Accommodation or flight information issue', r:'hotel'},
  {l:'Still unclear — needs manual review', r:'unclear'}
];
var MANUAL = { type:'Manual Review', cls:'gen', route:'Manual Review', tc:'#6b7280|#f4f4f5', score:[32,42], action:'Issue unclassified after clarification. Escalate to Manual Review team with full session transcript. Senior agent will assess and route.', tags:[{l:'Senior Agent Required',c:'#f4f4f5|#6b7280'},{l:'Full Transcript Attached',c:'#f4f4f5|#6b7280'},{l:'Do Not Attempt Resolution',c:'#f4f4f5|#6b7280'}] };

var chRunning = false, chBadgeTimer = null;
var chBadge = document.getElementById('chBadge');
var chLog = document.getElementById('chLog');
var chPipe = document.getElementById('chPipe');
var chResult = document.getElementById('chResult');
var chGray = document.getElementById('chGray');

function chSetBadge(s) {
  if (chBadgeTimer) { clearInterval(chBadgeTimer); chBadgeTimer = null; }
  chBadge.className = 'ch-badge';
  var frames, fi = 0;
  var sets = {
    thinking: ['PARSING INPUT.','PARSING INPUT..','PARSING INPUT...','DETECTING INTENT.','DETECTING INTENT..','DETECTING INTENT...'],
    matching: ['MATCHING PATTERNS.','MATCHING PATTERNS..','MATCHING PATTERNS...','EVALUATING CASES.','EVALUATING CASES..','RUNNING LOGIC.','RUNNING LOGIC..'],
    scoring:  ['CALCULATING SCORE.','CALCULATING SCORE..','CALCULATING SCORE...','CONFIDENCE CHECK.','CONFIDENCE CHECK..','EVALUATING ROUTE.','EVALUATING ROUTE..'],
    gray:     ['CLARIFYING.','CLARIFYING..','LOW CONFIDENCE.','LOW CONFIDENCE..','CONFLICT DETECTED.','CONFLICT DETECTED..','GRAY AREA ACTIVE.']
  };
  if (sets[s]) {
    chBadge.classList.add(s === 'scoring' ? 'processing' : 'thinking');
    frames = sets[s]; chBadge.textContent = frames[0];
    chBadgeTimer = setInterval(function(){ fi=(fi+1)%frames.length; chBadge.textContent=frames[fi]; }, 510);
  } else if (s === 'ready') { chBadge.classList.add('ready'); chBadge.textContent = 'READY'; }
  else { chBadge.classList.add('idle'); chBadge.textContent = 'STANDBY'; }
}

function chAddLog(txt, done) {
  var el = document.createElement('div'); el.className = 'ch-log-item';
  var dot = document.createElement('div'); dot.className = 'ch-log-dot '+(done?'dot-done':'dot-active');
  var span = document.createElement('span'); span.className = 'ch-log-text'+(done?'':' active'); span.textContent = txt;
  var ts = document.createElement('span'); ts.className = 'ch-log-ts';
  var n = new Date(); ts.textContent = n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0')+':'+n.getSeconds().toString().padStart(2,'0');
  el.appendChild(dot); el.appendChild(span); el.appendChild(ts);
  chLog.appendChild(el);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('show'); }); });
  return el;
}
function chFinishLog(el) { if (!el) return; el.querySelector('.ch-log-dot').className='ch-log-dot dot-done'; el.querySelector('.ch-log-text').classList.remove('active'); }

function chReset() {
  chLog.innerHTML = ''; chPipe.classList.remove('show'); chResult.classList.remove('show'); chGray.classList.remove('show');
  document.getElementById('chKeywordRow').style.display = 'none'; document.getElementById('chKeywordRow').style.marginBottom='0';
  document.getElementById('chKeywordList').innerHTML = '';
  document.getElementById('chGrayBtns').innerHTML = '';
  var thinking = document.getElementById('chThinking');
  if (thinking) { thinking.classList.remove('show'); }
  var thinkTitle = document.getElementById('chThinkingTitle');
  if (thinkTitle) thinkTitle.textContent = 'CH is analyzing...';
  document.getElementById('restartBtn').style.display='none';
  document.getElementById('chReval').classList.remove('show');
  document.getElementById('chRevalSteps').innerHTML = '';
  document.getElementById('chScoreEvolve').textContent = '—';
  document.getElementById('chFillSm').style.width = '0';
  ['cpn0','cpn1','cpn2','cpn3'].forEach(function(id, i) {
    var el = document.getElementById(id);
    el.className = 'ch-pipe-node'+(i===0?' lit':'');
    if(i===1) el.textContent='Intent: —'; if(i===2) el.textContent='Score: —'; if(i===3) el.textContent='Route: —';
  });
  document.getElementById('chFill').style.width = '0';
  document.getElementById('chScoreNum').textContent = '0%';
}

function chShowKeywords(kws) {
  if (!kws || !kws.length) return;
  var row = document.getElementById('chKeywordRow');
  row.style.display = 'block'; row.style.marginBottom = '1rem';
  document.getElementById('chKeywordList').innerHTML = kws.map(function(k){
    return '<span style="display:inline-block;margin:0 .3rem 0 0;padding:.12rem .5rem;background:rgba(217,106,58,.08);color:#d96a3a;border:1px solid rgba(217,106,58,.2);font-size:.64rem;font-weight:500;border-radius:3px;font-family:Inter,monospace">'+ k +'</span>';
  }).join('');
}

function chShowResult(entry, score) {
  var tc = entry.tc.split('|');
  var tag = document.getElementById('chTypeTag');
  tag.textContent = entry.type; tag.style.color=tc[0]; tag.style.background=tc[1]; tag.style.borderColor='none';
  var fill = document.getElementById('chFill'); fill.style.background = tc[0];
  var scoreLabel = score + '% — ' + (score >= 75 ? 'high confidence' : score >= 55 ? 'moderate confidence' : 'low confidence — post-clarification');
  document.getElementById('chScoreMeta').innerHTML = 'Confidence &nbsp;<span>' + scoreLabel + '</span>';
  var s0=performance.now(), dur=1400;
  (function anim(now){ var t=Math.min((now-s0)/dur,1),e=1-Math.pow(1-t,3); fill.style.width=Math.round(e*score)+'%'; if(t<1)requestAnimationFrame(anim); })(s0);
  document.getElementById('chAction').textContent = entry.action;
  var tagsEl = document.getElementById('chTags'); tagsEl.innerHTML = '';
  entry.tags.forEach(function(tg){
    var el=document.createElement('span'); el.className='ch-tag';
    var c2=tg.c.split('|'); el.style.background=c2[0]; el.style.color=c2[1]; el.textContent=tg.l;
    tagsEl.appendChild(el);
  });
  chResult.classList.add('show'); document.getElementById('chThinking').classList.remove('show'); chSetBadge('ready'); chRunning=false; document.getElementById('demoBtn').disabled=false; document.getElementById('restartBtn').style.display='inline-block';
}

function chShowGray(analysis) {
  chSetBadge('gray');
  var isConflict = analysis.subtype === 'conflict';
  document.getElementById('chGrayTitle').textContent = isConflict ? 'Conflict Detected' : 'Gray Area Detected';
  document.getElementById('chGrayBadge').textContent = isConflict ? 'Multiple Issues Detected' : 'Clarification Required';
  document.getElementById('chGrayDesc').textContent = isConflict
    ? 'Multiple categories detected ('+ analysis.cats.join(' + ') +'). Specify the primary issue to continue routing:'
    : 'Input signal too weak to classify. Clarification required before routing:';
  var btns = isConflict && analysis.cats.length > 0 ? (function(){
    var combined = [];
    analysis.cats.forEach(function(cat){ if(KB[cat]) combined = combined.concat(KB[cat].grayBtns.slice(0,2)); });
    combined.push('Still unclear — needs manual review');
    return combined.slice(0,5).map(function(l,i){ var r=analysis.cats[Math.floor(i/2)]||'unclear'; return {l:l,r:r}; });
  })() : GRAY_VAGUE_BTNS;

  var container = document.getElementById('chGrayBtns'); container.innerHTML = '';
  btns.forEach(function(b) {
    var btn = document.createElement('button'); btn.className='ch-gray-btn'; btn.textContent=b.l; btn.dataset.route=b.r;
    btn.addEventListener('click', function() {
      container.querySelectorAll('.ch-gray-btn').forEach(function(x){ x.disabled=true; x.style.opacity=x===btn?'1':'.25'; });
      btn.classList.add('selected');
      var entry = (b.r !== 'unclear' && KB[b.r]) ? KB[b.r] : MANUAL;
      var finalScore = entry.score[0] + Math.floor(Math.random()*(entry.score[1]-entry.score[0]));
      var initScore = analysis.score || 35;
      var logEl = chAddLog('User signal received — re-evaluating...', false);
      chSetBadge('scoring'); if(document.getElementById('chThinkingTitle')) document.getElementById('chThinkingTitle').textContent = 'Evaluating confidence...';;
      var reval = document.getElementById('chReval');
      var scoreEvolve = document.getElementById('chScoreEvolve');
      var fillSm = document.getElementById('chFillSm');
      var revalSteps = document.getElementById('chRevalSteps');
      reval.classList.add('show');
      scoreEvolve.textContent = initScore + '%';
      fillSm.style.width = initScore + '%';
      revalSteps.innerHTML = '';
      var REVAL_STEPS = [
        'Clarification received...',
        'Updating input signals...',
        'Re-evaluating confidence...',
        'Recalculating decision path...',
        'Route confirmed.'
      ];
      var stepEls = [];
      REVAL_STEPS.forEach(function(txt) {
        var el=document.createElement('div'); el.className='ch-reval-step';
        var dot=document.createElement('div'); dot.className='ch-reval-step-dot';
        var span=document.createElement('span'); span.textContent=txt;
        el.appendChild(dot); el.appendChild(span);
        revalSteps.appendChild(el);
        stepEls.push(el);
      });
      var stepDelay = 420;
      stepEls.forEach(function(el, i) {
        setTimeout(function(){
          el.classList.add('show');
          var progress = (i+1) / stepEls.length;
          var cur = Math.round(initScore + (finalScore - initScore) * progress);
          scoreEvolve.textContent = cur + '%';
          scoreEvolve.classList.add('rising');
          fillSm.style.width = cur + '%';
          if (i === stepEls.length-1) { scoreEvolve.classList.remove('rising'); el.classList.add('done'); }
        }, stepDelay * (i+1));
      });
      var total = stepDelay * (stepEls.length + 1);
      setTimeout(function(){
        chFinishLog(logEl); chAddLog('Decision path updated.', true);
        var n1=document.getElementById('cpn1'),n2=document.getElementById('cpn2'),n3=document.getElementById('cpn3');
        n1.textContent=entry.type; n1.className='ch-pipe-node '+entry.cls; document.getElementById('conn0').classList.add('lit');
        setTimeout(function(){ n2.textContent=finalScore+'%'; n2.classList.add('lit'); document.getElementById('conn1').classList.add('lit'); }, 500);
        setTimeout(function(){ n3.textContent=entry.route; n3.className='ch-pipe-node '+entry.cls; document.getElementById('conn2').classList.add('lit'); }, 1000);
      }, total);
      setTimeout(function(){ chShowResult(entry, finalScore); }, total + 1400);
    }, {once:true});
    container.appendChild(btn);
  });
  chGray.classList.add('show'); chRunning=false; document.getElementById('demoBtn').disabled=false; document.getElementById('restartBtn').style.display='inline-block';
}

function chRun() {
  var raw = document.getElementById('di').value.trim();
  if (!raw || chRunning) return;
  chRunning = true; document.getElementById('demoBtn').disabled = true;
  chReset();
  var A = nlpAnalyze(raw);
  if (A.keywords && A.keywords.length) chShowKeywords(A.keywords);
  chSetBadge('thinking');
  var thinking = document.getElementById('chThinking');
  var thinkTitle = document.getElementById('chThinkingTitle');
  thinking.classList.add('show');
  thinkTitle.textContent = 'CH is analyzing...';
  var prev = null;
  function L(txt, done, badge) { return function(){ chFinishLog(prev); prev=chAddLog(txt,done); if(badge)chSetBadge(badge); }; }
  var seq, pipeDelay, resultDelay;
  if (A.type === 'clear') {
    seq = [
      {fn:L('Parsing input...',false),            ms:0},
      {fn:L('Detecting intent...',false,'thinking'),ms:1200},
      {fn:L('Keyword match: '+A.keywords.slice(0,2).join(', ')+'...',false,'matching'),ms:2600},
      {fn:L('Matching against case history...',false),ms:4000},
      {fn:L('Calculating confidence score...',false,'scoring'),ms:5400},
      {fn:L('High confidence — decision path generated.',true),ms:6800}
    ];
    pipeDelay=7000; resultDelay=9200;
  } else if (A.subtype === 'conflict') {
    seq = [
      {fn:L('Parsing input...',false),            ms:0},
      {fn:L('Detecting intent...',false,'thinking'),ms:1200},
      {fn:L('Multiple keywords: '+A.cats.join(', ')+'...',false,'matching'),ms:2600},
      {fn:L('Conflict signal raised — categories overlap...',false,'scoring'),ms:4000},
      {fn:L('Confidence score below routing threshold...',false),ms:5400},
      {fn:L('Gray Area triggered — conflict mode activated.',true),ms:6800}
    ];
    pipeDelay=7000; resultDelay=9200;
  } else {
    seq = [
      {fn:L('Parsing input...',false),            ms:0},
      {fn:L('Detecting intent...',false,'thinking'),ms:1200},
      {fn:L('No strong keyword signal found...',false,'matching'),ms:2600},
      {fn:L('Confidence evaluation — score too low to route...',false,'scoring'),ms:4000},
      {fn:L('Ambiguous input — classification failed...',false),ms:5400},
      {fn:L('Gray Area triggered — clarification mode activated.',true),ms:6800}
    ];
    pipeDelay=7000; resultDelay=9200;
  }
  seq.forEach(function(s){ setTimeout(s.fn, s.ms); });

  setTimeout(function(){
    chPipe.classList.add('show');
    document.getElementById('cpn0').classList.add('lit');
    if (A.type === 'clear') {
      var entry = KB[A.cat];
      setTimeout(function(){ var n=document.getElementById('cpn1'); n.textContent=entry.type; n.classList.add('active',entry.cls); document.getElementById('conn0').classList.add('lit'); },500);
      setTimeout(function(){ var n=document.getElementById('cpn2'); n.textContent=A.score+'%'; n.classList.add('active'); document.getElementById('conn1').classList.add('lit'); },1200);
      setTimeout(function(){ var n=document.getElementById('cpn3'); n.textContent=entry.route; n.classList.add('active',entry.cls); document.getElementById('conn2').classList.add('lit'); },1900);
    } else {
      var l1=A.subtype==='conflict'?'Conflict':'Low confidence';
      var l2=A.subtype==='conflict'?A.cats.join(' + '):A.score+'%';
      setTimeout(function(){ var n=document.getElementById('cpn1'); n.textContent=l1; n.classList.add('ch-gray-pipe-node'); document.getElementById('conn0').classList.add('lit'); },500);
      setTimeout(function(){ var n=document.getElementById('cpn2'); n.textContent=l2; n.classList.add('ch-gray-pipe-node'); document.getElementById('conn1').classList.add('lit'); },1200);
      setTimeout(function(){ var n=document.getElementById('cpn3'); n.textContent='Gray Area'; n.classList.add('ch-gray-pipe-node'); document.getElementById('conn2').classList.add('lit'); },1900);
    }
  }, pipeDelay);

  setTimeout(function(){
    if (A.type === 'clear') chShowResult(KB[A.cat], A.score);
    else chShowGray(A);
  }, resultDelay);
}

document.getElementById('demoBtn').addEventListener('click', chRun);
document.getElementById('di').addEventListener('keydown', function(e){ if(e.key==='Enter') chRun(); });
document.getElementById('restartBtn').addEventListener('click', function(){
  document.getElementById('di').value='';
  chReset();
  chSetBadge('idle');
  chRunning=false;
  document.getElementById('demoBtn').disabled=false;
});
document.querySelectorAll('.chip').forEach(function(c){ c.addEventListener('click', function(){ document.getElementById('di').value=c.dataset.v; setTimeout(chRun,80); });});

/* ── LOADER ── */
(function(){
  var lb=document.getElementById('lb');
  var lw=document.getElementById('lw1');
  var lpct=document.getElementById('lpct');
  var loader=document.getElementById('loader');
  var words=['LOADING','BUILDING','THINKING','READY'];
  var p=0,wi=0;
  setTimeout(function(){lw.style.transform='translateY(0)'},120);
  function animWord(w){
    lw.style.transform='translateY(110%)';
    setTimeout(function(){lw.textContent=w;lw.style.transform='translateY(0)'},400);
  }
  var liv=setInterval(function(){
    p+=Math.random()*1.2+0.4;if(p>100)p=100;
    lb.style.width=p+'%';
    if(lpct)lpct.textContent=Math.round(p)+'%';
    if(p>25&&wi<1){wi=1;animWord(words[1]);}
    if(p>55&&wi<2){wi=2;animWord(words[2]);}
    if(p>85&&wi<3){wi=3;animWord(words[3]);}
    if(p>=100){
      clearInterval(liv);
      setTimeout(function(){
        loader.style.opacity='0';
        loader.style.transition='opacity .9s ease';
        setTimeout(function(){
          loader.style.display='none';
          startHero();
          startTW();
        },900);
      },600);
    }
  },55);
})();

function startHero(){
  setTimeout(function(){var e=document.getElementById('heroTag');if(e)e.classList.add('show');},80);
  setTimeout(function(){var e=document.getElementById('heroName');if(e)e.classList.add('show');},180);
  setTimeout(function(){var e=document.getElementById('heroBottom');if(e)e.classList.add('show');},900);
}

window.addEventListener('scroll',function(){
  var nav=document.getElementById('navbar');
  if(nav)nav.classList[window.scrollY>60?'add':'remove']('scrolled');
});

var r1=document.getElementById('r1'),r2=document.getElementById('r2');
var mx=window.innerWidth/2,my=window.innerHeight/2,r2x=mx,r2y=my;
document.addEventListener('mousemove',function(e){
  mx=e.clientX;my=e.clientY;
  if(r1){r1.style.left=mx+'px';r1.style.top=my+'px';}
});
(function rloop(){
  r2x+=(mx-r2x)*.1;r2y+=(my-r2y)*.1;
  if(r2){r2.style.left=r2x+'px';r2.style.top=r2y+'px';}
  requestAnimationFrame(rloop);
})();
document.querySelectorAll('a,button,.pill,.chip').forEach(function(el){
  el.addEventListener('mouseenter',function(){document.body.classList.add('hov');});
  el.addEventListener('mouseleave',function(){document.body.classList.remove('hov');});
});

var canvas=document.getElementById('pcv'),ctx=canvas.getContext('2d'),pts=[];
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
function Pt(){
  this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;
  this.r=Math.random()*1.5+.4;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;
  this.op=Math.random()*.18+.04;
  this.g=Math.random()>.5?'140,106,79':'160,152,144';
}
for(var i=0;i<60;i++)pts.push(new Pt());
function drawPts(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(var i=0;i<pts.length;i++){
    var a=pts[i];a.x+=a.vx;a.y+=a.vy;
    if(a.x<0||a.x>canvas.width)a.vx*=-1;
    if(a.y<0||a.y>canvas.height)a.vy*=-1;
    var dx=a.x-mx,dy=a.y-my,d=Math.sqrt(dx*dx+dy*dy);
    if(d<110){var f=(110-d)/110*.5;a.x-=dx/d*f;a.y-=dy/d*f;}
    for(var j=i+1;j<pts.length;j++){
      var b=pts[j],ex=a.x-b.x,ey=a.y-b.y,ed=Math.sqrt(ex*ex+ey*ey);
      if(ed<70){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='rgba(140,106,79,'+(0.04*(1-ed/70))+')';ctx.lineWidth=.4;ctx.stroke();}
    }
    ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fillStyle='rgba('+a.g+','+a.op+')';ctx.fill();
  }
  requestAnimationFrame(drawPts);
}
drawPts();

var GG='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
document.querySelectorAll('#heroName .line span').forEach(function(el){
  el.addEventListener('mouseenter',function(){
    var orig=el.textContent,i=0;
    var iv=setInterval(function(){
      el.textContent=orig.split('').map(function(ch,j){return j<i?orig[j]:GG[Math.floor(Math.random()*GG.length)]}).join('');
      if(i>=orig.length)clearInterval(iv);i+=2;
    },28);
  });
});

// Utility
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const LS = {
  get: (k, def=null) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: k => localStorage.removeItem(k),
};

// Tabs
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.dataset.tab;
    $$('.tab').forEach(s => s.classList.remove('active'));
    $('#'+t).classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  });
});

// Year
$('#year').textContent = new Date().getFullYear();

// Compliments
const compliments = [
  "You make ordinary moments feel like magic.",
  "Your smile fixes bad days in 0.1 seconds.",
  "The way you care is my favourite thing about you.",
  "You are the softest place to land after a hard day.",
  "You’re the first person I want to share good news with.",
  "You’re sunshine with a little stardust.",
  "You make me want to be better—gently, not forcefully.",
  "Your presence feels like home.",
  "Your laugh is a song I replay in my head.",
  "You are enough. Always."
];
$('#complimentBtn').addEventListener('click', () => {
  const pick = compliments[Math.floor(Math.random()*compliments.length)];
  $('#complimentBox').textContent = pick;
});

// Confetti
const c = $('#confetti'); const ctx = c.getContext('2d');
function resize(){ c.width = innerWidth; c.height = innerHeight; } addEventListener('resize', resize); resize();
let particles = [];
function burst(){
  const count = 160;
  for(let i=0;i<count;i++){
    particles.push({
      x: c.width/2, y: c.height/3,
      vx: (Math.random()*2-1)*6, vy: (Math.random()*2-1)*6 - 2,
      g: 0.12 + Math.random()*0.1, size: 3 + Math.random()*4, life: 80 + Math.random()*40
    });
  }
}
function tick(){
  ctx.clearRect(0,0,c.width,c.height);
  particles.forEach(p=>{
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life -= 1;
    ctx.globalAlpha = Math.max(p.life/120, 0);
    ctx.fillStyle = ['#ff5da2','#7cf1b4','#ffd166','#8ecaff','#c49bff'][Math.floor(Math.random()*5)];
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  particles = particles.filter(p=>p.life>0 && p.y < c.height+20);
  requestAnimationFrame(tick);
}
tick();
$('#celebrate').addEventListener('click', burst);

// Hearts
let heartTimer;
function addHeart(){
  const h = document.createElement('div');
  h.className='heart'; h.textContent = ['💖','💗','💞','💓','💝'][Math.floor(Math.random()*5)];
  const left = Math.random()*100; const size = 20 + Math.random()*22; const duration = 5 + Math.random()*4;
  h.style.left = left + 'vw'; h.style.fontSize = size + 'px'; h.style.animation = `floatUp ${duration}s linear`;
  document.body.appendChild(h);
  setTimeout(()=>h.remove(), duration*1000);
}
$('#addHeart').addEventListener('click', ()=>{ if(heartTimer) clearInterval(heartTimer); addHeart(); heartTimer=setInterval(addHeart,500); setTimeout(()=>clearInterval(heartTimer),6000); });
$('#clearHearts').addEventListener('click', ()=>{ document.querySelectorAll('.heart').forEach(h=>h.remove()); if(heartTimer) clearInterval(heartTimer); });

// Music
const player = $('#player'); const musicUrl = $('#musicUrl');
musicUrl.value = LS.get('musicUrl','') || '';
$('#playMusic').addEventListener('click', async ()=>{
  const url = musicUrl.value.trim(); if (!url) { alert('Paste a direct MP3 link first 🙂'); return; }
  if (player.src !== url) player.src = url; LS.set('musicUrl', url);
  if (player.paused) { try{ await player.play(); } catch(e){ alert('Autoplay blocked; press Play on the audio controls.'); } }
  else player.pause();
});

// Theme
$('#themeDark').addEventListener('click', ()=>document.documentElement.classList.remove('light'));
$('#themeLight').addEventListener('click', ()=>document.documentElement.classList.add('light'));

// Hydration reminders
const hydrateKey = 'hydration';
function updateHydrationStatus() {
  const cfg = LS.get(hydrateKey);
  $('#hydrationStatus').textContent = cfg?.on ? `Status: every ${cfg.minutes} min (started at ${new Date(cfg.started).toLocaleString()})` : 'Status: reminders off.';
}
$('#enableNoti').addEventListener('click', async ()=>{
  try{
    const p = await Notification.requestPermission();
    alert(p === 'granted' ? 'Notifications enabled ✅' : 'Permission was not granted.');
  }catch{ alert('Notifications not supported in this browser.'); }
});
let hydrationTimer;
function scheduleHydration(mins){
  if(hydrationTimer) clearInterval(hydrationTimer);
  hydrationTimer = setInterval(()=>{
    if (Notification.permission === 'granted') {
      new Notification('Hi Surbhi 💖', { body:'Tiny reminder to sip some water 🥤' });
    } else {
      // Fallback in-page
      alert('Water break! 🥤');
    }
  }, mins*60*1000);
}
$('#startHydration').addEventListener('click', ()=>{
  const minutes = parseInt($('#hydrationInterval').value,10);
  LS.set(hydrateKey, { on:true, minutes, started: Date.now() });
  scheduleHydration(minutes); updateHydrationStatus();
});
$('#stopHydration').addEventListener('click', ()=>{
  LS.set(hydrateKey, { on:false }); if(hydrationTimer) clearInterval(hydrationTimer); updateHydrationStatus();
});
(function(){
  const cfg = LS.get(hydrateKey);
  if (cfg?.on) { scheduleHydration(cfg.minutes); }
  updateHydrationStatus();
})();

// Timetable
const timetable = {
  "Monday": [
    ["09:00–10:00","LPM (Theory)"],
    ["10:00–11:00","Physiology"],
    ["11:00–13:00","Free for her"],
    ["13:00–14:00","Lunch"],
    ["14:00–16:00","VAN (Batch C)"],
  ],
  "Tuesday": [
    ["09:00–10:00","LPM (Theory)"],
    ["10:00–11:00","Physiology"],
    ["11:00–13:00","VPY (Batch C)"],
    ["13:00–14:00","Lunch"],
    ["14:00–16:00","LPM (Batch C)"],
  ],
  "Wednesday": [
    ["09:00–10:00","VAN (Theory)"],
    ["10:00–11:00","Physiology"],
    ["11:00–13:00","VAN (Batch C)"],
    ["13:00–14:00","Lunch"],
    ["14:00–16:00","Free for her"],
  ],
  "Thursday": [
    ["09:00–10:00","VAN (Theory)"],
    ["10:00–11:00","Physiology"],
    ["11:00–13:00","VAN (Batch C)"],
    ["13:00–14:00","Lunch"],
    ["14:00–16:00","Work Programme"],
  ],
  "Friday": [
    ["09:00–10:00","VAN (Theory)"],
    ["10:00–11:00","LPM"],
    ["11:00–13:00","Free for her"],
    ["13:00–14:00","Lunch"],
    ["14:00–16:00","Free for her"],
  ],
  "Saturday": [
    ["09:00–10:00","VAN (Theory)"],
    ["10:00–11:00","LPM"],
    ["11:00–13:00","LPM (Batch C)"],
    ["13:00–14:00","Lunch"],
    ["14:00–16:00","Free for her"],
  ],
  "Sunday": [
    ["All day","Holiday"]
  ]
};
function renderTimetable(){
  const c = $('#ttContainer'); c.innerHTML='';
  Object.entries(timetable).forEach(([day, slots]) => {
    const card = document.createElement('div'); card.className='card inner';
    card.innerHTML = `<h3>${day}</h3>` + slots.map(s=>`<div class="att-item"><span>${s[0]} • ${s[1]}</span></div>`).join('');
    c.appendChild(card);
  });
}
renderTimetable();

// Attendance (per class)
const ATT_KEY = 'attendance_v2_web';
const attDate = $('#attDate');
const todayISO = new Date().toISOString().slice(0,10);
attDate.value = todayISO;
function weekdayName(d){
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
}
function slotsForDate(d){
  const wd = weekdayName(d);
  return timetable[wd] || [];
}
function isRealClass(subj){
  const s = subj.toLowerCase();
  return !(s.includes('free for her') || s.includes('lunch') || s.includes('holiday'));
}
function renderAtt(){
  const d = new Date(attDate.value);
  const k = d.toISOString().slice(0,10);
  const slots = slotsForDate(d);
  const store = LS.get(ATT_KEY, {});
  const arr = store[k] || Array(slots.length).fill('');
  const list = $('#attSlots'); list.innerHTML='';
  slots.forEach((s, i)=>{
    const [time, subj] = s;
    const cur = arr[i] || '';
    const el = document.createElement('div'); el.className='att-item';
    el.innerHTML = `
      <div><strong>${time}</strong> • ${subj}</div>
      <div>
        <button class="badge present ${cur==='Present'?'sel':''}" data-mark="Present" data-index="${i}">Present</button>
        <button class="badge absent ${cur==='Absent'?'sel':''}" data-mark="Absent" data-index="${i}">Absent</button>
        <button class="badge holiday ${cur==='Holiday'?'sel':''}" data-mark="Holiday" data-index="${i}">Holiday</button>
      </div>
    `;
    list.appendChild(el);
  });
  // bind
  list.querySelectorAll('button[data-index]').forEach(b=>{
    b.addEventListener('click', e=>{
      const i = parseInt(b.dataset.index,10);
      const mark = b.dataset.mark;
      const store = LS.get(ATT_KEY, {});
      const arr = store[k] || Array(slots.length).fill('');
      arr[i] = mark; store[k] = arr; LS.set(ATT_KEY, store);
      renderAtt(); renderAttSummary();
    });
  });
}
function markWholeDayHoliday(){
  const d = new Date(attDate.value);
  const k = d.toISOString().slice(0,10);
  const slots = slotsForDate(d);
  const arr = Array(slots.length).fill('Holiday');
  const store = LS.get(ATT_KEY, {}); store[k] = arr; LS.set(ATT_KEY, store);
  renderAtt(); renderAttSummary();
}
$('#markHolidayDay').addEventListener('click', markWholeDayHoliday);
attDate.addEventListener('change', ()=>{ renderAtt(); renderAttSummary(); });

function renderAttSummary(){
  const d = new Date(attDate.value);
  const k = d.toISOString().slice(0,10);
  const slots = slotsForDate(d);
  const arr = (LS.get(ATT_KEY, {})[k] || Array(slots.length).fill(''));
  let total=0, p=0, a=0, h=0;
  slots.forEach((s, i)=>{
    const subj = s[1];
    if (isRealClass(subj)) {
      total++;
      if (arr[i]==='Present') p++;
      if (arr[i]==='Absent') a++;
      if (arr[i]==='Holiday') h++;
    }
  });
  const pct = (p + a) === 0 ? 0 : (p/(p+a))*100;
  $('#attSummary').textContent = `Present: ${p}  Absent: ${a}  Holiday: ${h}  Total class slots: ${total}  •  Attendance % (excl. holidays): ${pct.toFixed(1)}%`;

  // overall
  const store = LS.get(ATT_KEY, {}); let OP=0, OA=0;
  Object.entries(store).forEach(([date, arr])=>{
    const sd = new Date(date);
    const slots = slotsForDate(sd);
    arr.forEach((m,i)=>{
      const subj = slots[i]?.[1] || '';
      if (isRealClass(subj)) {
        if (m==='Present') OP++;
        if (m==='Absent') OA++;
      }
    });
  });
  const opct = (OP+OA)===0 ? 0 : (OP/(OP+OA))*100;
  $('#attOverall').textContent = `Overall Present: ${OP}  Absent: ${OA}  •  Overall %: ${opct.toFixed(1)}%`;
}
$('#attReset').addEventListener('click', ()=>{
  if(confirm('Reset ALL attendance data?')) { LS.del(ATT_KEY); renderAtt(); renderAttSummary(); }
});

renderAtt(); renderAttSummary();

// Daily water total
const waterKey = 'water_today';
function resetWaterIfNewDay(){
  const w = LS.get(waterKey, {date: new Date().toDateString(), ml: 0});
  const today = new Date().toDateString();
  if (w.date !== today) LS.set(waterKey, {date: today, ml: 0});
}
function renderWater(){
  resetWaterIfNewDay();
  const w = LS.get(waterKey, {date: new Date().toDateString(), ml: 0});
  $('#waterTotal').textContent = w.ml;
}
$$('.cup').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    resetWaterIfNewDay();
    const amt = parseInt(btn.dataset.drink,10);
    const w = LS.get(waterKey, {date: new Date().toDateString(), ml: 0});
    w.ml += amt; LS.set(waterKey, w); renderWater();
  });
});
renderWater();

// Gallery (local)
const galleryKey = 'gallery_v1';
function renderGallery(){
  const grid = $('#galleryGrid'); grid.innerHTML='';
  const items = LS.get(galleryKey, []);
  items.forEach((it, idx)=>{
    const url = it.url;
    const div = document.createElement('div'); div.className='thumb';
    const img = document.createElement('img'); img.src = url;
    const del = document.createElement('button'); del.className='del'; del.textContent='✕';
    del.addEventListener('click', ()=>{
      const list = LS.get(galleryKey, []); list.splice(idx,1); LS.set(galleryKey, list); renderGallery();
      URL.revokeObjectURL(url);
    });
    div.appendChild(img); div.appendChild(del);
    grid.appendChild(div);
  });
}
async function handleFiles(files){
  const list = LS.get(galleryKey, []);
  for (const f of files){
    const url = URL.createObjectURL(f);
    list.unshift({ url, ts: Date.now(), name: f.name });
  }
  LS.set(galleryKey, list); renderGallery();
}
$('#pickImages').addEventListener('change', e => handleFiles(e.target.files));
$('#cameraCapture').addEventListener('change', e => handleFiles(e.target.files));
renderGallery();

// Fitness
let stepEstimate = LS.get('steps', 0) || 0;
let lastMag = 0;
function startStepEstimate(){
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(res=>{
      if(res==='granted'){
        window.addEventListener('devicemotion', onMotion);
      } else { alert('Motion permission not granted'); }
    }).catch(()=>alert('Motion permission error.'));
  } else {
    window.addEventListener('devicemotion', onMotion);
  }
}
function stopStepEstimate(){
  window.removeEventListener('devicemotion', onMotion);
  LS.set('steps', stepEstimate);
}
function onMotion(e){
  const a = e.accelerationIncludingGravity;
  if (!a) return;
  const mag = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);
  if (lastMag !== 0){
    const diff = Math.abs(mag - lastMag);
    if (diff > 3.2) stepEstimate++;
    $('#steps').textContent = stepEstimate;
  }
  lastMag = mag;
}
$('#startSteps').addEventListener('click', startStepEstimate);
$('#stopSteps').addEventListener('click', stopStepEstimate);
$('#steps').textContent = stepEstimate;
$('#applySteps').addEventListener('click', ()=>{
  const v = parseInt($('#manualSteps').value,10) || 0;
  stepEstimate = v; LS.set('steps', stepEstimate);
  $('#steps').textContent = stepEstimate;
});

// Pulse
$('#savePulse').addEventListener('click', ()=>{
  const v = parseInt($('#pulse').value,10);
  if(isNaN(v)) { alert('Enter a number'); return; }
  LS.set('pulse', {v, ts: Date.now()});
  const d = new Date().toLocaleString();
  $('#pulseSaved').textContent = `${v} bpm at ${d}`;
});
(function(){ const p=LS.get('pulse'); if(p) $('#pulseSaved').textContent = `${p.v} bpm at ${new Date(p.ts).toLocaleString()}`; })();

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e;
  $('#installPrompt').classList.remove('hidden');
});
$('#installClose').addEventListener('click', ()=>$('#installPrompt').classList.add('hidden'));
$('#installBtn').addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if(choice.outcome === 'accepted'){ $('#installPrompt').classList.add('hidden'); }
  deferredPrompt = null;
});

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('service-worker.js');
  });
}

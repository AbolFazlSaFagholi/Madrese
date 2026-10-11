(() => {
"use strict";
const $=id=>document.getElementById(id), USER="schoolElectionUser", KEY="schoolElectionDataV3";
let user;try{user=JSON.parse(localStorage.getItem(USER)||"null");}catch{user=null;}if(!user||!user.name){location.replace("login.html");return;}
const seed={title:"انتخابات انجمن اولیا و مربیان",status:"open",candidates:[
{id:1,name:"مریم احمدی",role:"مادر دانش‌آموز",bio:"تلاش برای تقویت ارتباط خانواده‌ها و مدرسه."},
{id:2,name:"علی محمدی",role:"ولی دانش‌آموز",bio:"همکاری برای بهبود برنامه‌های آموزشی و فرهنگی."},
{id:3,name:"زهرا کریمی",role:"مادر دانش‌آموز",bio:"پشتیبانی از فعالیت‌های پرورشی و مشارکت خانواده‌ها."},
{id:4,name:"حسین رضایی",role:"ولی دانش‌آموز",bio:"پیگیری پیشنهادها و نیازهای خانواده‌های مدرسه."},
{id:5,name:"فاطمه موسوی",role:"مادر دانش‌آموز",bio:"توجه به فضای آموزشی بهتر و فعالیت‌های دانش‌آموزی."},
{id:6,name:"سعید نادری",role:"ولی دانش‌آموز",bio:"کمک به ارتباط شفاف‌تر میان اولیا و مدرسه."}],votes:{},voters:[]};
let data;try{const d=JSON.parse(localStorage.getItem(KEY)||"null");data=d&&Array.isArray(d.candidates)&&d.votes&&Array.isArray(d.voters)?d:JSON.parse(JSON.stringify(seed));}catch{data=JSON.parse(JSON.stringify(seed));}
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n).toLocaleString("fa-IR");const total=()=>Object.values(data.votes).reduce((a,b)=>a+Number(b||0),0);
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}render();}
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2600);}
const pages={overview:"داشبورد انتخابات",candidates:"کاندیداهای انجمن",vote:"رأی‌گیری",results:"نتایج انتخابات",admin:"مدیریت انتخابات"};
function page(p){if(p==="admin"&&user.role!=="admin"){toast("بخش مدیریت در این نسخه نمایشی باز است؛ دسترسی واقعی پیاده نشده.");}document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));$("page-"+p).classList.remove("hidden");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("crumb").textContent=pages[p];$("title").textContent=pages[p];render();window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>page(b.dataset.page)));document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>page(b.dataset.goto)));
$("headerName").textContent=user.name;$("sideName").textContent=user.name;$("welcomeName").textContent=user.name;$("headerAvatar").textContent=$("sideAvatar").textContent=user.name.charAt(0);
$("logout").addEventListener("click",()=>{localStorage.removeItem(USER);location.href="login.html";});
function card(c, voting=false){const v=Number(data.votes[c.id]||0);return `<article class="candidate-card"><div class="candidate-top"><div class="person-avatar">${esc(c.name.charAt(0))}</div><span class="candidate-live"><i class="pulse-dot"></i> نامزد</span></div><h3>${esc(c.name)}</h3><div class="role">${esc(c.role||"کاندیدای انجمن")}</div><p>${esc(c.bio||"معرفی ثبت نشده است.")}</p>${voting?`<button class="primary-btn full-btn" data-vote="${c.id}">انتخاب این کاندیدا <b>←</b></button>`:`<div class="candidate-foot"><span>آرای نمایشی</span><b>${fa(v)} رأی</b></div>`}</article>`;}
function confirmVote(c){$("modalTitle").textContent="تأیید رأی";$("modalText").textContent=`آیا مطمئن هستید که می‌خواهید به ${c.name} رأی بدهید؟ در این نسخه امکان رأی مجدد وجود ندارد.`;$("modal").classList.remove("hidden");$("modalCancel").onclick=()=>$("modal").classList.add("hidden");$("modalOK").onclick=()=>{$("modal").classList.add("hidden");if(data.status!=="open")return toast("رأی‌گیری بسته است.");if(data.voters.includes(user.phone))return toast("این شماره قبلاً رأی داده است.");data.votes[c.id]=Number(data.votes[c.id]||0)+1;data.voters.push(user.phone);save();toast("رأی آزمایشی ثبت شد.");};}
function bind(){document.querySelectorAll("[data-vote]").forEach(b=>b.addEventListener("click",()=>{const c=data.candidates.find(c=>c.id===Number(b.dataset.vote));if(c)confirmVote(c);}));document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{data.candidates=data.candidates.filter(c=>c.id!==Number(b.dataset.delete));save();toast("کاندیدا حذف شد.");}));}
function render(){
$("candidateCount").textContent=fa(data.candidates.length);$("voteCount").textContent=fa(total());$("voterCount").textContent=fa(data.voters.length);$("statusValue").textContent=data.status==="open"?"فعال":"بسته";$("statusHint").textContent=data.status==="open"?"رأی‌گیری باز است":"رأی‌گیری پایان یافته";$("headerStatus").textContent=data.status==="open"?"انتخابات فعال":"انتخابات بسته";$("voteStatus").textContent=$("headerStatus").textContent;
$("overviewCandidates").innerHTML=data.candidates.slice(0,4).map(c=>`<div class="compact-row"><span class="person-avatar">${esc(c.name.charAt(0))}</span><span><b>${esc(c.name)}</b><small>${esc(c.role)}</small></span><strong>${fa(data.votes[c.id]||0)} رأی</strong></div>`).join("")||"<p>کاندیدایی ثبت نشده است.</p>";
$("candidateGrid").innerHTML=data.candidates.map(c=>card(c)).join("")||"<div class='panel'>کاندیدایی ثبت نشده است.</div>";
const voted=data.voters.includes(user.phone);$("voteMessage").classList.toggle("hidden",data.status==="open"&&!voted);$("voteMessage").textContent=data.status!=="open"?"رأی‌گیری پایان یافته است.":voted?"رأی شما قبلاً در این مرورگر ثبت شده است.":"";$("voteGrid").innerHTML=data.status==="open"&&!voted?data.candidates.map(c=>card(c,true)).join(""):"";
$("totalChip").textContent=fa(total())+" رأی";$("resultsList").innerHTML=data.candidates.map(c=>{const n=Number(data.votes[c.id]||0),p=total()?Math.round(n/total()*100):0;return `<div class="result-item"><div class="result-head"><b>${esc(c.name)}</b><span>${fa(n)} رأی · ${fa(p)}٪</span></div><div class="bar"><span style="width:${p}%"></span></div></div>`;}).join("")||"نتیجه‌ای وجود ندارد.";
$("electionTitle").value=data.title;$("electionStatus").value=data.status;$("adminCandidates").innerHTML=data.candidates.map(c=>`<div class="admin-row"><span class="person-avatar">${esc(c.name.charAt(0))}</span><span><b>${esc(c.name)}</b><small>${esc(c.role)}</small></span><button class="delete-btn" data-delete="${c.id}">حذف</button></div>`).join("");bind();
}
$("addForm").addEventListener("submit",e=>{e.preventDefault();const name=$("newName").value.trim();if(name.length<2)return toast("نام کاندیدا را وارد کنید.");data.candidates.push({id:Date.now(),name,role:$("newRole").value.trim(),bio:$("newBio").value.trim()});e.target.reset();save();toast("کاندیدا اضافه شد.");});
$("saveElection").addEventListener("click",()=>{data.title=$("electionTitle").value.trim()||"انتخابات انجمن اولیا و مربیان";data.status=$("electionStatus").value;save();toast("تنظیمات انتخابات ذخیره شد.");});
render();
})();
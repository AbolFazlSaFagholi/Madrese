(() => {
"use strict"; const $=id=>document.getElementById(id); const inputs=[...document.querySelectorAll(".otp")];
const digits=s=>String(s).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));
let pending; try{pending=JSON.parse(sessionStorage.getItem("schoolElectionPending")||"null");}catch{pending=null;}
if(!pending||!pending.name||!pending.phone){location.replace("login.html");return;}
$("phoneText").textContent=pending.phone;
inputs.forEach((input,i)=>{input.addEventListener("input",()=>{input.value=digits(input.value).replace(/\D/g,"").slice(-1);if(input.value&&i<inputs.length-1)inputs[i+1].focus();$("verifyError").textContent="";});input.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!input.value&&i>0)inputs[i-1].focus();});input.addEventListener("paste",e=>{const txt=digits((e.clipboardData||window.clipboardData).getData("text")).replace(/\D/g,"").slice(0,4);if(txt){e.preventDefault();txt.split("").forEach((d,j)=>{if(inputs[j])inputs[j].value=d;});inputs[Math.min(txt.length,3)].focus();}});});
$("resendCode").addEventListener("click",()=>{$("demoCode").classList.remove("hidden");$("verifyError").textContent="کد پیامکی واقعی ارسال نمی‌شود؛ برای تست از ۱۲۳۴ استفاده کنید.";});
$("backBtn").addEventListener("click",()=>location.href="login.html");
$("verifyForm").addEventListener("submit",e=>{e.preventDefault();const code=inputs.map(i=>i.value).join("");if(digits(code)!=="1234"){$("verifyError").textContent="کد واردشده صحیح نیست. کد آزمایشی ۱۲۳۴ است.";inputs.forEach(i=>{i.classList.add("wrong");setTimeout(()=>i.classList.remove("wrong"),550);});return;}try{localStorage.setItem("schoolElectionUser",JSON.stringify({name:pending.name,phone:pending.phone,role:"voter"}));sessionStorage.removeItem("schoolElectionPending");location.href="index.html";}catch{$("verifyError").textContent="ذخیره‌سازی مرورگر در دسترس نیست.";}});
inputs[0].focus();
})();
(() => {
"use strict";
const $=id=>document.getElementById(id);
const digits=s=>String(s).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));
$("phoneForm").addEventListener("submit",e=>{
 e.preventDefault(); const name=$("fullName").value.trim().replace(/\s+/g," "); const phone=digits($("phone").value).replace(/[^\d+]/g,"");
 const err=$("phoneError"); err.textContent="";
 if(name.length<2){err.textContent="نام و نام خانوادگی را کامل وارد کنید.";return;}
 if(!/^\+?\d{10,14}$/.test(phone)){err.textContent="شماره تماس را با فرمت درست وارد کنید (حداقل ۱۰ رقم).";return;}
 try{sessionStorage.setItem("schoolElectionPending",JSON.stringify({name,phone}));location.href="verify.html";}
 catch{err.textContent="ذخیره‌سازی مرورگر در دسترس نیست. با Live Server اجرا کنید.";}
});
})();
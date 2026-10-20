(() => {
  const $ = window.PF.$, form = $("#authForm");
  let mode = "login";
  function setMode(next) {
    mode = next;
    document.querySelectorAll(".auth-tab").forEach(tab=>tab.classList.toggle("active",tab.dataset.mode===mode));
    $("#nameField").classList.toggle("hidden",mode==="login");
    $("#roleField").classList.toggle("hidden",mode==="login");
    $("#authHeading").textContent = mode==="login" ? "A fresh start." : "Let's grow together.";
    $("#authSubheading").textContent = mode==="login" ? "Sign in to keep your flower business blooming." : "Create your Pure Flora demo profile.";
    $("#authSubmit").innerHTML = (mode==="login" ? "Sign in" : "Create my account")+" <span>↗</span>";
    $("#authMessage").textContent = "";
  }
  document.querySelectorAll(".auth-tab").forEach(tab=>tab.addEventListener("click",()=>setMode(tab.dataset.mode)));
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const email=$("#email").value.trim().toLowerCase(), password=$("#password").value;
    if(password.length<6){$("#authMessage").textContent="Please use at least 6 characters for this demo.";return;}
    const users=window.PF.get("users",[]);
    if(mode==="register"){
      if(users.some(user=>user.email===email)){ $("#authMessage").textContent="This demo email already has a profile. Try signing in."; return; }
      const user={name:$("#fullName").value.trim(),email,role:$("#accountRole").value};
      users.push({...user,password}); window.PF.set("users",users); window.PF.set("currentUser",user);
      $("#authMessage").textContent=`Welcome, ${user.name || "flower friend"}! Your ${user.role} demo profile is ready. Opening your workspace…`;
      setTimeout(()=>location.href=user.role==='grower'?'dashboard.html':'index.html',700);
    }else{
      const user=users.find(user=>user.email===email&&user.password===password);
      if(!user){$("#authMessage").textContent="No matching demo profile found. Create an account first, or use the same details you registered with.";return;}
      window.PF.set("currentUser",{name:user.name,email:user.email,role:user.role});
      $("#authMessage").textContent=`Welcome back, ${user.name || "flower friend"}! Opening your ${user.role} workspace…`;
      setTimeout(()=>location.href=user.role==='grower'?'dashboard.html':'index.html',700);
    }
  });
})();

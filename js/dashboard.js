(() => {
  const $=window.PF.$;
  const tbody=$("#listingTable"), modal=$("#listingModal"), form=$("#listingForm");
  function render() {
    const currentUser=window.PF.get("currentUser",null);
    const products=window.PF.get("customProducts",[]).filter(p=>!currentUser || !p.ownerEmail || p.ownerEmail===currentUser.email);
    if(!products.length){tbody.innerHTML='<tr><td colspan="4"><div class="listing-empty">You have no flower listings yet. Select <strong>＋ Add a listing</strong> to add your first flowers. Your own listings will appear here and in the Shop Flowers marketplace on this browser.</div></td></tr>'; $("#listingCount").textContent='00'; return;}
    tbody.innerHTML=products.map(p=>`<tr><td><div class="table-flower"><img src="${p.image}" alt="" onerror="this.style.opacity='.2'"><div><strong>${p.name}</strong><small>${p.category}</small></div></div></td><td>${window.PF.format(p.price)}</td><td>${p.stock} bunches</td><td><span class="table-status ${p.stock?"available":"unavailable"}">${p.stock?"Active":"Out of stock"}</span></td></tr>`).join("");
    $("#listingCount").textContent=String(products.length).padStart(2,"0");
  }
  $("#addListingButton").addEventListener("click",()=>modal.classList.remove("hidden"));
  $("#closeListingModal").addEventListener("click",()=>modal.classList.add("hidden"));
  modal.addEventListener("click",event=>{if(event.target===modal)modal.classList.add("hidden");});
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const name=$("#listingName").value.trim(), category=$("#listingCategory").value, price=Number($("#listingPrice").value), stock=Number($("#listingStock").value);
    const products=window.PF.get("customProducts",[]);
    const currentUser=window.PF.get("currentUser",null);
    products.push({id:"custom-"+Date.now(),name,category,price,unit:"bunch",stock,grower:currentUser?.name ? `${currentUser.name}'s farm` : "Your demo farm",ownerEmail:currentUser?.email || "",tag:"Grower listing",color:"pink",image:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",description:"Fresh flowers listed directly by a Pure Flora grower."});
    window.PF.set("customProducts",products); modal.classList.add("hidden"); form.reset(); render(); window.PF.toast(`${name} added to your demo catalogue.`);
  });
  render();
})();

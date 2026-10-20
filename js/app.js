/* Shared UI helpers and browser-local demo state. */
(() => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  window.PF = {
    $,$$,
    format: window.PF_FORMAT,
    get(key, fallback) {
      try { const value = localStorage.getItem("pf_"+key); return value === null ? fallback : JSON.parse(value); }
      catch { return fallback; }
    },
    set(key, value) { try { localStorage.setItem("pf_"+key, JSON.stringify(value)); } catch {} },
    toast(message) {
      const el = $("#toast");
      if (!el) return;
      el.textContent = message;
      el.classList.add("show");
      clearTimeout(window.PF.toastTimer);
      window.PF.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
    },
    products() {
      const extra = this.get("customProducts", []);
      return [...window.PF_PRODUCTS, ...extra];
    },
    cart() { return this.get("cart", []); },
    updateCart(cart) { this.set("cart", cart); this.updateCartCount(); },
    addToCart(id, qty=1) {
      const product = this.products().find(p => p.id === id);
      if (!product) return;
      if (product.stock < 1) { this.toast("This bloom is currently out of stock."); return; }
      const cart = this.cart();
      const item = cart.find(x => x.id === id);
      if (item) item.qty = Math.min(item.qty + qty, product.stock);
      else cart.push({id,qty:Math.min(qty,product.stock)});
      this.updateCart(cart);
      this.toast(`${product.name} added to your bag.`);
    },
    updateCartCount() {
      const count = this.cart().reduce((sum,item) => sum + item.qty, 0);
      $$("[data-cart-count]").forEach(el => el.textContent = count);
    },
    wishlist() { return this.get("wishlist", []); },
    toggleWishlist(id) {
      const list = this.wishlist();
      const added = !list.includes(id);
      this.set("wishlist", added ? [...list,id] : list.filter(x => x !== id));
      this.toast(added ? "Saved to your favourites." : "Removed from your favourites.");
      return added;
    },
    productCard(product) {
      const saved = this.wishlist().includes(product.id);
      return `<article class="product-card">
        <div class="product-image-wrap"><a href="#product-${product.id}" class="product-image-link" data-product-details="${product.id}" aria-label="View details for ${product.name}"><img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-fallback')"></a>
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="wishlist-button ${saved?'saved':''}" data-wishlist="${product.id}" aria-label="${saved?'Remove from':'Add to'} favourites">${saved?'♥':'♡'}</button>
        </div><div class="product-info"><div class="product-meta"><span>${product.category}</span><span class="${product.stock?'stock-in':'stock-out'}">${product.stock ? '● In stock' : '● Sold out'}</span></div>
        <h3><a class="product-title-link" href="#product-${product.id}" data-product-details="${product.id}">${product.name}</a></h3><p class="product-grower">Grown by ${product.grower}</p><div class="product-bottom"><div><strong>${this.format(product.price)}</strong><small> / ${product.unit}</small></div><button class="add-button" data-add="${product.id}" ${product.stock?'':'disabled'} aria-label="Add ${product.name} to bag">＋</button></div></div></article>`;
    },
    showProductDetails(id) {
      const p = this.products().find(item => item.id === id); if (!p) return;
      let modal = document.getElementById('productDetailsModal');
      if (!modal) { modal = document.createElement('div'); modal.id='productDetailsModal'; modal.className='product-details-modal hidden'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label','Flower details'); document.body.appendChild(modal); }
      modal.innerHTML = `<div class="product-details-card"><button class="product-details-close" aria-label="Close details">×</button><img src="${p.image}" alt="${p.name}" onerror="this.style.opacity='.3'"><div class="product-details-copy"><span class="eyebrow">${p.tag || 'PURE FLORA SELECTION'} · ${p.category}</span><h2>${p.name}</h2><p>${p.description || 'Fresh flowers carefully sourced from growers.'}</p><div class="product-details-price">${this.format(p.price)} <span style="font-size:14px;font-weight:500;color:#796c72">/ ${p.unit || 'bunch'}</span></div><div class="detail-meta">Grown by <strong>${p.grower || 'Pure Flora grower'}</strong></div><div class="detail-meta">${p.stock > 0 ? `✓ ${p.stock} bunches currently available` : 'Currently sold out'}</div><div class="detail-meta">Wholesale note: minimum order is one listed unit for this demo.</div><div class="product-details-actions"><input class="product-detail-qty" aria-label="Quantity" type="number" min="1" max="${Math.max(1,p.stock)}" value="1"><button class="button button-dark" data-detail-add="${p.id}" ${p.stock > 0 ? '' : 'disabled'}>Add to cart</button><button class="button" data-detail-wish="${p.id}">♡ Favourite</button></div></div></div>`;
      modal.classList.remove('hidden');
      modal.querySelector('.product-details-close').addEventListener('click', () => modal.classList.add('hidden'));
      modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); }, {once:true});
      modal.querySelector('[data-detail-add]')?.addEventListener('click', e => { const qty=Math.max(1,Number(modal.querySelector('.product-detail-qty').value)||1); this.addToCart(p.id,qty); });
      modal.querySelector('[data-detail-wish]')?.addEventListener('click', () => { this.toggleWishlist(p.id); });
      document.onkeydown = e => { if(e.key==='Escape') modal.classList.add('hidden'); };
    },
    bindProductActions(root=document) {
      $$("[data-product-details]", root).forEach(link => link.addEventListener("click", event => { event.preventDefault(); this.showProductDetails(link.dataset.productDetails); }));
      $$("[data-add]", root).forEach(button => button.addEventListener("click", () => this.addToCart(button.dataset.add)));
      $$("[data-wishlist]", root).forEach(button => button.addEventListener("click", () => {
        const added = this.toggleWishlist(button.dataset.wishlist);
        button.classList.toggle("saved", added);
        button.textContent = added ? "♥" : "♡";
        button.setAttribute("aria-label", added ? "Remove from favourites" : "Add to favourites");
      }));
    }
  };
  const menu = $("#menuToggle"), nav = $("#mainNav");
  if (menu && nav) menu.addEventListener("click", () => nav.classList.toggle("open"));
  const searchButton = $("#headerSearch");
  if (searchButton) { searchButton.innerHTML = '<span class="action-icon">⌕</span><span class="action-label">Search</span>'; searchButton.setAttribute('aria-label','Search flowers'); }
  const accountLink = $('.header-actions a[href="auth.html"]');
  if (accountLink) { accountLink.innerHTML = '<span class="action-icon">♙</span><span class="action-label">Account</span>'; accountLink.classList.add('icon-button'); }
  const bagLink = $('.header-actions .cart-link');
  if (bagLink) bagLink.firstChild.textContent = 'Cart ';
  if (searchButton) searchButton.addEventListener("click", () => {
    if (location.pathname.endsWith("products.html")) {
      const search = $("#productSearch"); if (search) { search.focus(); search.scrollIntoView({behavior:"smooth",block:"center"}); }
    } else location.href = "products.html#catalog";
  });
  const wishlistLink = document.createElement("a");
  wishlistLink.href = "wishlist.html"; wishlistLink.className = "icon-button wishlist-nav"; wishlistLink.setAttribute("aria-label","Favourites"); wishlistLink.innerHTML = '<span class="action-icon">♡</span><span class="action-label">Favorites</span>';
  const actions = $(".header-actions");
  if (actions && !$(".wishlist-nav",actions)) actions.insertBefore(wishlistLink, actions.firstChild);
  window.PF.updateCartCount();
})();

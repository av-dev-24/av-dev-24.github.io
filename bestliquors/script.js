const landingProducts = [
  {id:1, name:"Aurelia Cabernet Reserve", unit:"750 ml · Red Wine", price:1295, img:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80", type:"wine"},
  {id:2, name:"North Coast Sauvignon Blanc", unit:"750 ml · White Wine", price:995, img:"https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=700&q=80", type:"wine"},
  {id:3, name:"Oakline Small Batch Gin", unit:"700 ml · Gin", price:1495, img:"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=700&q=80", type:"spirits"},
  {id:4, name:"Black Harbor Vodka", unit:"700 ml · Vodka", price:1095, img:"https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=700&q=80", type:"spirits"},
  {id:5, name:"Redwood Bourbon No. 4", unit:"750 ml · Bourbon", price:1895, img:"https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=700&q=80", type:"spirits"},
  {id:6, name:"Crown Valley Lager", unit:"330 ml · Bottle", price:85, img:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80", type:"beer"},
  {id:7, name:"Harbor Haze IPA", unit:"330 ml · Craft Beer", price:135, img:"https://images.unsplash.com/photo-1567696911980-2eed69a89644?auto=format&fit=crop&w=700&q=80", type:"beer"},
  {id:8, name:"Solstice Sparkling Brut", unit:"750 ml · Sparkling", price:1595, img:"https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=700&q=80", type:"wine"},
  {id:9, name:"Casa Verde Rosé", unit:"750 ml · Rosé", price:895, img:"https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80", type:"wine"},
  {id:10, name:"Ridge & Pine Rum", unit:"700 ml · Rum", price:1195, img:"https://images.unsplash.com/photo-1572569918794-504d2d0b0dcf?auto=format&fit=crop&w=700&q=80", type:"spirits"},
  {id:11, name:"Verde Citrus Aperitif", unit:"700 ml · Aperitif", price:1395, img:"https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80", type:"spirits"},
  {id:12, name:"Golden Mile Pilsner", unit:"330 ml · Bottle", price:78, img:"https://images.unsplash.com/photo-1566633806327-68e152a6f2fa?auto=format&fit=crop&w=700&q=80", type:"beer"},
  {id:13, name:"Black Label Reserve", unit:"750 ml · Whisky", price:2195, img:"https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&w=700&q=80", type:"spirits"},
  {id:14, name:"Maison Clair Chardonnay", unit:"750 ml · White Wine", price:1195, img:"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80", type:"wine"},
  {id:15, name:"Stonebridge Pale Ale", unit:"330 ml · Craft Beer", price:145, img:"https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=80", type:"beer"}
];

let cart = 0;
// Inayos: Local variable imbes na sa window
let globalToastTimer; 
// Object para itago ang quantity ng bawat item (id -> quantity)
const cartData = {}; 
// Object para sa mga auto-collapse timers ng bawat card
const pillTimers = {};

function productCard(p) {
  // Dahil mas kaunti ang data ng landing page items kumpara sa catalog, 
  // gagawa tayo ng formatting para pumasa nang maayos sa Modal natin.
  const unitParts = p.unit.split(' · ');
  const itemSize = unitParts[0] || '750 ml';
  const itemCat = unitParts[1] || p.type;
  
  const modalData = {
    id: p.id,
    name: p.name,
    price: p.price,
    img: p.img,
    size: itemSize,
    category: itemCat,
    brand: 'Vintara Collection', // Default fallback
    stock: 'In stock',           // Default fallback
    origin: 'Imported',          // Default fallback
    badge: ''
  };
  
  // I-encode para safe ipasa sa onclick
  const productDataStr = encodeURIComponent(JSON.stringify(modalData));
  
  // Kunin ang current quantity mula sa ating cartData state
  const currentQty = cartData[p.id] || 0;
  const escapedName = p.name.replace(/'/g, "\\'"); 
  
  // Default icon kapag 0 ang qty, o kaya ay bilang kung > 0
  const centerContent = currentQty > 0 ? currentQty : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

  // Binalot natin ang card ng onclick="openProductModal(...)"
  return `
  <article class="product-card" data-name="${p.name.toLowerCase()}" onclick="openProductModal('${productDataStr}')">
    <div class="product-img">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      
      <!-- EXPANDABLE BUTTON NA PAREHAS SA CATALOG PAGE -->
      <div class="qty-pill" id="pill-${p.id}" onclick="event.stopPropagation(); triggerAddOrExpand(${p.id}, '${escapedName}')">
        <button class="qty-pill-minus" onclick="event.stopPropagation(); changeGridQty(${p.id}, -1, '${escapedName}')">−</button>
        <div class="qty-pill-center" id="pill-lbl-${p.id}">
          ${centerContent}
        </div>
        <button class="qty-pill-plus" onclick="event.stopPropagation(); changeGridQty(${p.id}, 1, '${escapedName}')">+</button>
      </div>

    </div>
    
    <div class="product-body">
      <div class="product-name">${p.name}</div>
      <div class="unit">${p.unit}</div>
      <div class="price">₱${p.price.toLocaleString()}</div>
    </div>
  </article>`;
}

function fill(id, list) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = list.map(productCard).join("");
  }
}

fill("bestRail", landingProducts.slice(0,5));
fill("trendRail", landingProducts.slice(5,10));
fill("spiritsRail", landingProducts.filter(p=>p.type==="spirits").slice(0,5));
fill("wineRail", landingProducts.filter(p=>p.type==="wine").slice(0,5));
fill("beerRail", landingProducts.filter(p=>p.type==="beer").slice(0,5));

function scrollRail(id, dir) {
  const el = document.getElementById(id);
  el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: "smooth" });
}

function addToCart(name) {
  cart++;
  document.getElementById("cartCount").textContent = cart;
  showToast(name + " added to cart");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(globalToastTimer);
  globalToastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

function openCart() {
  showToast(cart ? `Cart has ${cart} item${cart > 1 ? "s" : ""}` : "Your cart is empty");
}

function toggleChat() { document.getElementById("chatPanel").classList.toggle("open"); }
function sendChat() { showToast("Message sent to support"); document.querySelector(".chat-input input").value = ""; }
function toggleMobileMenu() { document.getElementById("mobileMenu").classList.toggle("open"); }
function closeMobileMenu() { document.getElementById("mobileMenu").classList.remove("open"); }
function toggleSub(btn) { btn.nextElementSibling.classList.toggle("open"); }

function setupSearch(inputId) {
  const input = document.getElementById(inputId); 
  if(!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
      card.style.display = (!q || card.dataset.name.includes(q)) ? "" : "none";
    });
  });
}

setupSearch("searchInput"); 
setupSearch("mobileSearch");

/* ==============================================================
   CATALOG PAGE FEATURES (Filters, Grid/List, Pagination, Sorting)
   ============================================================== */

// Dummy data na na-generate ni AI (formatted na)
const catalogProducts = window.PAGE_CATALOG_DATA || [];

let currentPage = 1;
const itemsPerPage = 10;

// Filter at Sort Functions
function getCheckedFilters(key) {
  const checkboxes = document.querySelectorAll(`input[data-filter="${key}"]:checked`);
  return Array.from(checkboxes).map(box => box.value);
}

function filterProducts() {
  const searchInput = document.getElementById('searchInput') || document.getElementById('search');
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || 999999;

  const activeFilters = {
    stock: getCheckedFilters('stock'),
    brand: getCheckedFilters('brand'),
    origin: getCheckedFilters('origin'),
    category: getCheckedFilters('category'),
    size: getCheckedFilters('size')
  };

  return catalogProducts.filter(p => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery);
    const matchesFilters = Object.entries(activeFilters).every(([key, values]) => {
      return values.length === 0 || values.includes(p[key]);
    });
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    
    return matchesSearch && matchesFilters && matchesPrice;
  });
}

function sortProducts(array) {
  const sortMethod = document.getElementById('sortSelect')?.value || 'relevant';
  const sortedArray = [...array];

  switch(sortMethod) {
    case 'best': case 'relevant':
      sortedArray.sort((a, b) => b.best - a.best); break;
    case 'pl':
      sortedArray.sort((a, b) => a.price - b.price); break;
    case 'ph':
      sortedArray.sort((a, b) => b.price - a.price); break;
    case 'az':
      sortedArray.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'za':
      sortedArray.sort((a, b) => b.name.localeCompare(a.name)); break;
    case 'new':
      sortedArray.sort((a, b) => b.created - a.created); break;
    case 'old':
      sortedArray.sort((a, b) => a.created - b.created); break;
  }
  return sortedArray;
}

/* ==============================================================
   CART & EXPANDABLE BUTTON LOGIC
   ============================================================== */

function generateCatalogCard(p) {
  const productData = encodeURIComponent(JSON.stringify(p));
  const currentQty = cartData[p.id] || 0;
  
  // Escaped name para safe ipasa sa functions
  const escapedName = p.name.replace(/'/g, "\\'"); 
  
  const centerContent = currentQty > 0 ? currentQty : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

  return `
  <article class="product-card" data-name="${p.name.toLowerCase()}" onclick="openProductModal('${productData}')">
    
    <div class="product-img">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      
      <!-- GRID VIEW: EXPANDABLE BUTTON -->
      <div class="qty-pill" id="pill-${p.id}" onclick="event.stopPropagation(); triggerAddOrExpand(${p.id}, '${escapedName}')">
        <button class="qty-pill-minus" onclick="event.stopPropagation(); changeGridQty(${p.id}, -1, '${escapedName}')">−</button>
        <div class="qty-pill-center" id="pill-lbl-${p.id}">
          ${centerContent}
        </div>
        <button class="qty-pill-plus" onclick="event.stopPropagation(); changeGridQty(${p.id}, 1, '${escapedName}')">+</button>
      </div>
    </div>
    
    <div class="product-body">
      <div class="product-name">${p.name}</div>
      <div class="unit">${p.size} · ${p.category}</div>
      <div class="price">₱${p.price.toLocaleString()}</div>
    </div>

    <!-- LIST VIEW: ACTION AREA (Right Side) -->
    <div class="list-action-area" onclick="event.stopPropagation();">
      <div id="list-ui-${p.id}" style="width: 100%; max-width: 160px;">
        ${generateListActionUI(p.id, escapedName)}
      </div>
    </div>
    
  </article>`;
}

function generateListActionUI(id, name) {
  const qty = cartData[id] || 0;
  if (qty === 0) {
    // Ipakita ang Add to Cart button kung walang laman
    return `<button class="list-add-btn" onclick="changeGridQty(${id}, 1, '${name}')">Add to Cart</button>`;
  } else {
    // Ipakita ang Quantity Controller kung merong laman
    return `
      <div class="list-qty-wrap">
        <button class="list-qty-btn" onclick="changeGridQty(${id}, -1, '${name}')">−</button>
        <span class="list-qty-val">${qty}</span>
        <button class="list-qty-btn" onclick="changeGridQty(${id}, 1, '${name}')">+</button>
      </div>
    `;
  }
}

// Function kapag na-click ang mismong pill (center part)
function triggerAddOrExpand(id, name) {
  const qty = cartData[id] || 0;
  if (qty === 0) {
    // Kung 0 ang quantity, mag a-add ng +1 saka mag e-expand
    changeGridQty(id, 1, name);
  } else {
    // Kung may laman na, i-expand lang para makita yung plus/minus
    expandPill(id);
  }
}

// Function para mag bago ang value (-1 or +1)
function changeGridQty(id, change, name) {
  let qty = cartData[id] || 0;
  qty += change;
  if (qty < 0) qty = 0; 
  
  cartData[id] = qty;
  updateCartTotal();
  
  // Update Grid Pill UI
  renderPillContent(id);
  if (qty > 0) {
    expandPill(id);
  } else {
    collapsePill(id);
  }

  // Update List View UI
  const listUI = document.getElementById(`list-ui-${id}`);
  if (listUI) {
    listUI.innerHTML = generateListActionUI(id, name);
  }

  if (change > 0) {
    showToast(`Updated ${name} in cart`);
  }
}

// Update the icon or number sa center ng pill
function renderPillContent(id) {
  const lbl = document.getElementById(`pill-lbl-${id}`);
  if (!lbl) return;

  const qty = cartData[id] || 0;
  if (qty === 0) {
    lbl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  } else {
    lbl.textContent = qty;
  }
}

// Smooth Expand Animation & Auto Collapse Timer
function expandPill(id) {
  const pill = document.getElementById(`pill-${id}`);
  if (pill) pill.classList.add('expanded');
  
  // I-reset ang countdown timer tuwing may interaction
  if (pillTimers[id]) clearTimeout(pillTimers[id]);
  
  // Mag automatic collapse makalipas ang 2.5 segundo (kung walang pinipindot)
  pillTimers[id] = setTimeout(() => {
    collapsePill(id);
  }, 2500); 
}

function collapsePill(id) {
  const pill = document.getElementById(`pill-${id}`);
  if (pill) pill.classList.remove('expanded');
}

// Total counter update para sa global navbar cart
function updateCartTotal() {
  let total = 0;
  for (let key in cartData) {
    total += cartData[key];
  }
  cart = total; // Sync natin sa global 'cart' variable mo
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = cart;
}

function renderCatalog() {
  const gridContainer = document.getElementById('catalogGrid');
  if (!gridContainer) return; // Pigilan kung wala sa catalog page

  const filteredAndSorted = sortProducts(filterProducts());
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / itemsPerPage));
  currentPage = Math.min(currentPage, totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredAndSorted.slice(startIndex, startIndex + itemsPerPage);

  // Render Grid
  if (pageItems.length > 0) {
    gridContainer.innerHTML = pageItems.map(generateCatalogCard).join('');
  } else {
    gridContainer.innerHTML = '<div style="grid-column:1/-1;padding:50px;text-align:center;color:#777">No products found matching your criteria.</div>';
  }

  // Render Result Count
  document.getElementById('resultsCount').innerHTML = `Showing <strong>${pageItems.length ? startIndex + 1 : 0}–${Math.min(startIndex + itemsPerPage, filteredAndSorted.length)} of ${filteredAndSorted.length} products</strong>`;

  // Render Pagination with SVG chevrons
  let paginationHTML = `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="goToPage(${currentPage - 1})">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  </button>`;
  
  const pageNumbers = [...new Set([1, 2, 3, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(n => n >= 1 && n <= totalPages))].sort((a, b) => a - b);
  let lastNum = 0;
  
  pageNumbers.forEach(n => {
    if (lastNum && n - lastNum > 1) { paginationHTML += '<span class="dots">…</span>'; }
    paginationHTML += `<button class="page-btn ${n === currentPage ? 'active' : ''}" onclick="goToPage(${n})">${n}</button>`;
    lastNum = n;
  });

  paginationHTML += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="goToPage(${currentPage + 1})">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  </button>`;
  
  document.getElementById('paginationWrap').innerHTML = paginationHTML;
}

// UI Interactions for Catalog
function goToPage(n) {
  const totalPages = Math.max(1, Math.ceil(filterProducts().length / itemsPerPage));
  currentPage = Math.max(1, Math.min(n, totalPages));
  renderCatalog();
}

function setCatalogView(mode) {
  document.getElementById('catalogGrid').classList.toggle('list', mode === 'list');
  document.getElementById('gridBtn').classList.toggle('active', mode === 'grid');
  document.getElementById('listBtn').classList.toggle('active', mode === 'list');
}

function toggleFilterGroup(button) {
  button.parentElement.classList.toggle('open');
}

function openFilters() {
  if (window.innerWidth <= 720) {
    document.getElementById('filters').classList.add('mobile-open');
    document.getElementById('filterOverlay').classList.add('show');
    // Prevent scrolling on background
    document.body.style.overflow = 'hidden'; 
  }
}

function closeFilters() {
  if (window.innerWidth <= 720) {
    document.getElementById('filters').classList.remove('mobile-open');
    document.getElementById('filterOverlay').classList.remove('show');
    // Restore scrolling
    document.body.style.overflow = ''; 
  }
}

// In-update na clearFilters para i-close din ang drawer pagka-clear
function clearFilters(e) {
  e.stopPropagation();
  document.querySelectorAll('input[data-filter]').forEach(el => el.checked = false);
  
  const minInput = document.getElementById('minPrice');
  const maxInput = document.getElementById('maxPrice');
  const rangeInput = document.getElementById('priceRange');
  const maxLabel = document.getElementById('maxLabel');
  
  if(minInput) minInput.value = 100;
  if(maxInput) maxInput.value = 3500;
  if(rangeInput) rangeInput.value = 3500;
  if(maxLabel) maxLabel.textContent = '₱3,500';
  
  currentPage = 1;
  renderCatalog();

  // (Optional) Isara din ang menu pagkatapos mag-clear sa mobile
  closeFilters(); 
}

// Event Listeners for Filters
document.addEventListener('DOMContentLoaded', () => {
  const rangeSlider = document.getElementById('priceRange');
  if (rangeSlider) {
    rangeSlider.addEventListener('input', (e) => {
      document.getElementById('maxPrice').value = e.target.value;
      document.getElementById('maxLabel').textContent = '₱' + Number(e.target.value).toLocaleString();
      currentPage = 1;
      renderCatalog();
    });
  }

  document.querySelectorAll('input[data-filter]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      currentPage = 1;
      renderCatalog();
    });
  });

  // Kung nasa catalog page, i-render na ang initial state.
  if (document.getElementById('catalogGrid')) {
    renderCatalog();
  }
});

/* ==============================================================
   MODAL LOGIC
   ============================================================== */

let currentModalProduct = null;

function openProductModal(encodedProductData) {
  // Decode at i-parse ang product data na ipinasa mula sa card
  const product = JSON.parse(decodeURIComponent(encodedProductData));
  currentModalProduct = product;

  // Populate Header Info
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductMeta').textContent = `${product.brand} · ${product.size}`;
  
  // Stock Status styling
  const stockBadge = document.getElementById('modalProductStock');
  stockBadge.textContent = product.stock;
  if (product.stock.toLowerCase().includes('in stock')) {
    stockBadge.className = 'modal-stock-badge instock';
  } else {
    stockBadge.className = 'modal-stock-badge';
  }

  // Populate Image & Price
  document.getElementById('modalProductImg').src = product.img;
  document.getElementById('modalProductPrice').textContent = `₱${product.price.toLocaleString()}`;

  // Populate Details
  document.getElementById('modalTypeInfo').textContent = `${product.category} · ${product.size}`;
  document.getElementById('modalCatDetail').textContent = product.category;
  document.getElementById('modalSizeDetail').textContent = product.size;
  
  document.getElementById('modalOriginInfo').textContent = product.origin;
  document.getElementById('modalOriginDetail').textContent = `Imported from ${product.origin}.`;

  // Reset Quantity
  document.getElementById('modalQty').value = 1;
  updateModalButtonPrice();

  // I-reset ang accordion state (isara lahat)
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach(acc => acc.classList.remove('open'));

  // Buksan ang modal
  document.getElementById('productModal').classList.add('show');
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('show');
  document.body.style.overflow = '';
}

// Close modal if clicked outside the container
document.getElementById('productModal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeProductModal();
  }
});

function toggleAccordion(button) {
  const item = button.parentElement;
  // Optional: Kung gusto mo isa lang ang nakabukas at a time, uncomment ang susunod na 3 linya:
  // const allItems = document.querySelectorAll('.accordion-item');
  // allItems.forEach(i => { if (i !== item) i.classList.remove('open'); });
  
  item.classList.toggle('open');
}

function updateModalQuantity(change) {
  const input = document.getElementById('modalQty');
  let currentVal = parseInt(input.value) || 1;
  let newVal = currentVal + change;
  
  if (newVal >= 1) {
    input.value = newVal;
    updateModalButtonPrice();
  }
}

function updateModalButtonPrice() {
  if (!currentModalProduct) return;
  const qty = parseInt(document.getElementById('modalQty').value) || 1;
  const total = currentModalProduct.price * qty;
  document.getElementById('modalBtnPrice').textContent = `₱${total.toLocaleString()}`;
}

function addFromModal() {
  if (!currentModalProduct) return;
  const id = currentModalProduct.id;
  const addedQty = parseInt(document.getElementById('modalQty').value) || 1;
  
  // Idagdag ang value galing sa modal papunta sa kasalukuyang quantity ng grid item
  cartData[id] = (cartData[id] || 0) + addedQty;
  
  updateCartTotal();
  renderPillContent(id); // Para mag-update agad ang nakasulat sa product card grid kung kita ito sa page

  const listUI = document.getElementById(`list-ui-${id}`);
  if (listUI) {
    listUI.innerHTML = generateListActionUI(id, currentModalProduct.name.replace(/'/g, "\\'"));
  }
  
  showToast(`${addedQty}x ${currentModalProduct.name} added to cart`);
  closeProductModal();
}

// Make sure may showToast function ka globally (either yung galing landing page o sa catalog)
if (typeof showToast !== 'function') {
  function showToast(msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }
}

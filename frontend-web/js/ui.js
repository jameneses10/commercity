import { currentUser, clearSession } from './api.js';
import { UPLOADS_BASE_URL } from './config.js';
export const money = (value)=> new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(Number(value)||0);
export const icon = (name, label='') => `<img class="cc-icon" src="assets/icons/${name}" alt="${label}">`;
function accountHref(user){ if(!user) return 'login.html'; if(user.rol==='administrador') return 'admin.html'; if(user.rol==='vendedor') return 'vendedor.html'; return 'comprador.html'; }
function iconButton({ href, icon, label, active=false, extra='' }){
  const cls = `cc-icon-btn${active ? ' active' : ''}`;
  if (href) return `<a class="${cls}" href="${href}" title="${label}" aria-label="${label}" ${extra}><img class="cc-icon" src="assets/icons/${icon}" alt=""></a>`;
  return `<button class="${cls}" type="button" title="${label}" aria-label="${label}" ${extra}><img class="cc-icon" src="assets/icons/${icon}" alt=""></button>`;
}
export function applyTheme(){
  const mode=localStorage.getItem('cc_theme') || 'day';
  document.body.classList.toggle('cc-night', mode==='night');
  document.querySelectorAll('[data-theme-toggle] img').forEach(img=>{
    img.src = mode==='night' ? 'assets/icons/cc-light-mode.svg' : 'assets/icons/cc-dark-mode.svg';
  });
}
export function toggleTheme(){ const next=document.body.classList.contains('cc-night')?'day':'night'; localStorage.setItem('cc_theme',next); applyTheme(); }
export function header(active='home'){
  const user=currentUser(); const account=accountHref(user);
  const sessionActions = user
    ? `${iconButton({href:account, icon:'cc-user-profile.svg', label:'Mi cuenta'})}${iconButton({icon:'cc-logout.svg', label:'Cerrar sesión', extra:'data-logout'})}`
    : iconButton({href:'login.html', icon:'cc-login.svg', label:'Ingresar'});
  return `<header class="cc-header"><div class="cc-container cc-header-row"><a class="cc-brand" href="index.html"><img class="cc-logo" src="assets/img/Logo - Commercity.png" alt="Logo CommerCity"><span><span class="cc-brand-word"><span class="cc-brand-commer">Commer</span><span class="cc-brand-city">City</span></span><span class="cc-slogan block">Conectando compras, creando oportunidades</span></span></a><form class="cc-search" action="productos.html"><img class="cc-icon mr-2" src="assets/icons/cc-search.svg" alt=""><input name="q" aria-label="Buscar" placeholder="Buscar productos, tiendas o categorías"></form><nav class="cc-nav" aria-label="Navegación principal">${iconButton({href:'productos.html', icon:'cc-categories.svg', label:'Catálogo y productos', active:active==='productos'})}${iconButton({href:'categorias.html', icon:'cc-product-grid.svg', label:'Categorías'})}${iconButton({href:'carrito.html', icon:'cc-shopping-cart.svg', label:'Carrito', active:active==='carrito'})}${iconButton({href:'chat.html', icon:'cc-chat-messages.svg', label:'Mensajes'})}${iconButton({href:'soporte.html', icon:'cc-support-incident-resolution.svg', label:'Soporte'})}${iconButton({href:'notificaciones.html', icon:'cc-notifications.svg', label:'Notificaciones'})}${iconButton({icon:'cc-dark-mode.svg', label:'Cambiar modo visual', extra:'data-theme-toggle'})}${sessionActions}</nav></div></header>`;
}

export function initHomeCarousel(){
  const carousel=document.querySelector('[data-carousel]');
  if(!carousel) return;
  const slides=Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const dots=Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  const prev=carousel.querySelector('[data-carousel-prev]');
  const next=carousel.querySelector('[data-carousel-next]');
  let current=0;
  let timer=null;
  const show=(index)=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      slide.classList.toggle('active',i===current);
      slide.setAttribute('aria-hidden',i===current?'false':'true');
    });
    dots.forEach((dot,i)=>{
      dot.classList.toggle('active',i===current);
      dot.setAttribute('aria-selected',i===current?'true':'false');
    });
  };
  const restart=()=>{
    if(timer) window.clearInterval(timer);
    timer=window.setInterval(()=>show(current+1),5000);
  };
  prev?.addEventListener('click',()=>{show(current-1);restart();});
  next?.addEventListener('click',()=>{show(current+1);restart();});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);restart();}));
  carousel.addEventListener('keydown',(event)=>{
    if(event.key==='ArrowLeft'){show(current-1);restart();}
    if(event.key==='ArrowRight'){show(current+1);restart();}
  });
  show(0);
  restart();
}

export function footer(){ return `<footer class="cc-footer"><div class="cc-container grid md:grid-cols-3 gap-6"><div><h3 class="text-xl font-bold">CommerCity</h3><p>Marketplace académico y comercial para compradores, vendedores y administradores.</p></div><div><h3 class="font-bold">Ayuda</h3><p><a href="help.html">Centro de ayuda</a> · <a href="soporte.html">Soporte</a> · <a href="terms.html">Términos</a> · <a href="privacy.html">Privacidad</a> · <a href="recovery-password.html">Recuperar acceso</a></p></div><div><h3 class="font-bold">Navegación</h3><p><a href="productos.html">Productos</a> · <a href="categorias.html">Categorías</a> · <a href="carrito.html">Carrito</a> · <a href="chat.html">Chat</a></p></div></div></footer>`; }
export function mountShell(active){ applyTheme(); document.body.insertAdjacentHTML('afterbegin', header(active)); document.body.insertAdjacentHTML('beforeend', footer()); bindHeaderActions(); applyTheme(); }
export function bindHeaderActions(){ document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',toggleTheme)); document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{clearSession(); location.href='login.html';})); }
export function productCard(p){
  const id=p.id || p.producto_id || p.product_id || 0;
  const name=p.nombre || p.name || 'Producto CommerCity';
  const category=p.categoria_nombre || p.category_name || p.categoria || p.categoria_slug || 'Marketplace';
  const store=p.tienda_nombre || p.store_name || p.vendedor_nombre || 'Tienda CommerCity';
  const price=p.precio_final || p.precio || p.price || 0;
  const firstImage=Array.isArray(p.imagenes) ? p.imagenes[0] : null;
  const rawImage=p.imagen_url || p.image_url || firstImage?.url || firstImage?.ruta || 'assets/icons/cc-product-card.svg';
  const image=String(rawImage).startsWith('/uploads') ? `${UPLOADS_BASE_URL}${String(rawImage).replace('/uploads','')}` : String(rawImage).startsWith('/') ? `${UPLOADS_BASE_URL}/${String(rawImage).replace(/^\/+/, '')}` : rawImage;
  return `<article class="cc-product"><div class="cc-product-media"><img src="${image}" alt="${name}"></div><div class="cc-product-body"><span class="cc-chip">${category}</span><h3 class="text-xl font-bold">${name}</h3><p class="cc-muted">${store}</p><p class="cc-price">${money(price)}</p><div class="grid md:grid-cols-3 gap-2 mt-auto"><a class="cc-btn outline" href="producto-detalle.html?id=${id}">Ver</a><button class="cc-btn" data-cart="${id}"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-shopping-cart.svg" alt=""></span>Añadir</button><button class="cc-btn secondary" data-favorite="${id}" type="button"><span class="cc-btn-icon"><img class="cc-icon" src="assets/icons/cc-favorites-wishlist.svg" alt=""></span>Favorito</button></div></div></article>`;
}
export function showMessage(target, message, ok=false){ const el=document.querySelector(target); if(el) el.innerHTML=`<div class="cc-alert ${ok?'ok':'bad'}">${message}</div>`; }
export function guardRole(allowed=[]){ const user=currentUser(); if(!user){ location.href='login.html'; return null; } if(allowed.length && !allowed.includes(user.rol)){ location.href='index.html'; return null; } return user; }
export function bindLogout(){ document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{clearSession(); location.href='login.html';})); }

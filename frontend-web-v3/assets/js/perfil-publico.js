
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, money, toast, h, emptyState} from './ui.js';
import {currentUser} from './auth.js';

const id = new URLSearchParams(location.search).get('id');
let profile = null;
let followers = [];
let following = [];

async function render() {
  app.innerHTML = await shell('perfil') + `<main class="container"><section id="profileBox" class="card">Cargando perfil público...</section><section class="grid lg:grid-cols-2 gap-6 mt-6"><div class="card"><h2 class="text-2xl font-bold mb-3">Seguidores</h2><div id="followersBox"></div></div><div class="card"><h2 class="text-2xl font-bold mb-3">Seguidos</h2><div id="followingBox"></div></div></section><section class="card mt-6"><h2 class="text-2xl font-bold mb-3">Productos publicados</h2><div id="productsBox" class="grid-products"></div></section><dialog id="reportDialog" class="card w-[min(92vw,520px)]"><form id="reportForm" class="grid gap-3"><h2 class="text-2xl font-bold">Reportar usuario</h2><label>Motivo<select class="select" name="motivo" required><option value="comportamiento inapropiado">Comportamiento inapropiado</option><option value="fraude">Fraude</option><option value="spam">Spam</option><option value="otro">Otro</option></select></label><textarea class="input" name="descripcion" rows="4" maxlength="1000" placeholder="Describe el problema"></textarea><div class="flex gap-2 justify-end"><button id="cancelReport" class="btn btn-ghost" type="button">Cancelar</button><button class="btn btn-danger" type="submit">Enviar reporte</button></div></form></dialog></main>`;
  bindShell();
  cancelReport.onclick = () => reportDialog.close();
  reportForm.onsubmit = reportUser;
  await load();
}

async function load() {
  try {
    const [p, f1, f2] = await Promise.all([
      api.get(`/profiles/${id}`),
      api.get(`/profiles/${id}/followers`, {auth: false}).catch(() => ({followers: []})),
      api.get(`/profiles/${id}/following`, {auth: false}).catch(() => ({following: []})),
    ]);
    profile = p.profile || p;
    followers = f1.followers || f1.users || [];
    following = f2.following || f2.users || [];
    draw();
  } catch (e) {
    profileBox.innerHTML = `<h1 class="text-2xl font-bold">Perfil no encontrado</h1><p class="muted mt-2">${h(e.message)}</p>`;
  }
}

function draw() {
  const me = currentUser();
  profileBox.innerHTML = `<div class="flex flex-wrap gap-6 items-start"><img src="${assetUrl(profile.foto_perfil_url || profile.foto_url)}" class="w-28 h-28 rounded-full object-cover" alt="Foto ${h(profile.nombre)}"><div class="flex-1"><h1 class="text-4xl font-extrabold">${h(profile.nombre)}</h1><p class="pill mt-2">${h(profile.rol)}</p><p class="muted mt-4">${h(profile.descripcion_personal || profile.descripcion || 'Sin descripción pública.')}</p><p class="mt-4">Seguidores: <b>${Number(profile.total_seguidores) || followers.length}</b> · Siguiendo: <b>${Number(profile.total_siguiendo) || following.length}</b></p><div class="flex gap-2 flex-wrap mt-5">${me?.id != profile.id ? `<button id="followBtn" class="btn btn-primary" type="button">${profile.is_following ? 'Dejar de seguir' : 'Seguir'}</button><button id="messageBtn" class="btn btn-secondary" type="button">Enviar mensaje</button><button id="reportBtn" class="btn btn-danger" type="button">Reportar usuario</button>` : '<a class="btn btn-secondary" href="perfil.html">Editar mi perfil</a>'}${profile.tienda?.id ? `<a class="btn btn-ghost" href="tienda.html?id=${Number(profile.tienda.id)}">Ver tienda</a>` : ''}</div></div></div>`;
  $('#followBtn')?.addEventListener('click', toggleFollow);
  $('#messageBtn')?.addEventListener('click', startMessage);
  $('#reportBtn')?.addEventListener('click', () => reportDialog.showModal());
  followersBox.innerHTML = listPeople(followers, 'Sin seguidores todavía');
  followingBox.innerHTML = listPeople(following, 'No sigue a nadie todavía');
  productsBox.innerHTML = (profile.productos_publicados || []).length ? profile.productos_publicados.map(productCard).join('') : emptyState('Sin productos publicados', 'Este usuario no tiene productos visibles.');
}

function listPeople(rows, empty) {
  return rows.length ? `<div class="grid gap-2">${rows.map((u) => `<a class="p-3 rounded-2xl bg-white" href="perfil-publico.html?id=${Number(u.id) || ''}"><b>${h(u.nombre)}</b><p class="muted text-sm">${h(u.rol || '')}</p></a>`).join('')}</div>` : emptyState(empty, 'La lista se actualizará cuando existan seguimientos.');
}

function productCard(p) {
  return `<article class="product-card"><a href="producto.html?id=${Number(p.id) || ''}"><img src="${assetUrl(p.imagen_url)}" alt="${h(p.nombre)}"></a><div class="mt-4"><h3 class="font-bold text-xl">${h(p.nombre)}</h3><p class="price mt-2">${money(p.precio_final || p.precio)}</p><p class="muted">★ ${h(p.calificacion_promedio || 'Nuevo')} · ${Number(p.total_resenas) || 0} reseñas</p><a class="btn btn-secondary mt-4 w-full" href="producto.html?id=${Number(p.id) || ''}">Ver producto</a></div></article>`;
}

async function toggleFollow() {
  try {
    if (profile.is_following) await api.delete(`/profiles/${profile.id}/follow`);
    else await api.post(`/profiles/${profile.id}/follow`, {});
    profile.is_following = !profile.is_following;
    toast(profile.is_following ? 'Usuario seguido' : 'Dejaste de seguir al usuario');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function startMessage() {
  try {
    const body = profile.rol === 'vendedor' ? {vendedor_id: profile.id} : {comprador_id: profile.id};
    const d = await api.post('/chat/conversations', body);
    location.href = `chat.html?id=${d.conversation.id}`;
  } catch (e) {
    toast(e.message || 'No se pudo iniciar conversación.', 'error');
  }
}

async function reportUser(e) {
  e.preventDefault();
  const btn = reportForm.querySelector('button[type="submit"]');
  await (async () => {
    btn.disabled = true;
    try {
      await api.post(`/users/${profile.id}/report`, Object.fromEntries(new FormData(reportForm)));
      toast('Reporte de usuario enviado');
      reportForm.reset();
      reportDialog.close();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  })();
}

render();


import {api, assetUrl} from './api.js';
import {shell, bindShell, $, $$, toast, preview, h, withButtonLoading} from './ui.js';
import {requireAuth} from './auth.js';

let convs = [];
let active = null;
let user = null;
let pollTimer = null;
let lastMessageSignature = '';
const EMOJIS = ['😊','👍','🔥','❤️','🙏','😂','😮','✅','📦','💬','⭐','🚚'];

async function render() {
  app.innerHTML = await shell('chat') + `<main class="container"><section class="chat-layout glass"><aside class="conversation-list"><div class="p-4"><label class="search-pill">⌕<input id="chatSearch" class="bg-transparent outline-none" placeholder="Buscar chats..."></label></div><div id="list"><p class="p-4 muted">Cargando conversaciones...</p></div></aside><section class="flex flex-col"><header id="chatHead" class="p-4 border-b border-orange-100 font-bold">Selecciona una conversación</header><div id="msgs" class="messages"></div><div id="emojiPanel" class="hidden px-4 py-2 border-t border-orange-100 bg-white/70">${EMOJIS.map((e) => `<button type="button" class="emoji-choice text-2xl p-2" data-emoji="${e}">${e}</button>`).join('')}</div><form id="msgForm" class="p-4 flex gap-2 border-t border-orange-100"><button type="button" id="emoji" class="btn btn-secondary">😊</button><textarea class="input min-h-12" name="mensaje" placeholder="Escribe un mensaje..."></textarea><input type="file" id="files" name="files" multiple class="hidden"><button type="button" id="attach" class="btn btn-secondary">＋</button><button class="btn btn-primary">Enviar</button></form><div id="filePreview" class="thumbs px-4 pb-3"></div></section></section></main>`;
  bindShell();
  user = await requireAuth(api);
  attach.onclick = () => files.click();
  emoji.onclick = () => emojiPanel.classList.toggle('hidden');
  $$('.emoji-choice').forEach((b) => { b.onclick = () => insertEmoji(b.dataset.emoji); });
  preview(files, '#filePreview');
  msgForm.onsubmit = send;
  chatSearch.oninput = drawConversations;
  await load();
  const wanted = new URLSearchParams(location.search).get('id');
  if (wanted) await select(wanted);
  startPolling();
}

async function load() {
  const d = await api.get('/chat/conversations');
  convs = d.conversations || [];
  drawConversations();
}

function drawConversations() {
  const q = (chatSearch?.value || '').toLowerCase();
  const view = convs.filter((c) => participantName(c).toLowerCase().includes(q) || String(c.ultimo_mensaje || '').toLowerCase().includes(q));
  list.innerHTML = view.map((c) => `<div class="conversation-item ${active == c.id ? 'active' : ''}" data-id="${Number(c.id) || ''}"><b>${h(participantName(c))}</b><p class="text-sm muted">${h(c.ultimo_mensaje || 'Sin mensajes')}</p><p class="text-xs muted">${onlineLabel(c)}</p></div>`).join('') || '<p class="p-4 muted">Sin conversaciones. Abre un producto, tienda o perfil y chatea con el vendedor.</p>';
  $$('.conversation-item').forEach((x) => { x.onclick = () => select(x.dataset.id); });
}

function participantName(c) { return c.comprador_id === user.id ? (c.vendedor_nombre || 'Vendedor') : (c.comprador_nombre || 'Comprador'); }
function onlineLabel(c) { return c.en_linea ? 'En línea' : (c.ultima_conexion ? `Última conexión ${formatDate(c.ultima_conexion)}` : 'Última conexión no disponible'); }

async function select(id) {
  active = id;
  $$('.conversation-item').forEach((x) => x.classList.toggle('active', x.dataset.id == id));
  await api.patch(`/chat/conversations/${id}/read`, {}).catch(() => {});
  await loadMessages(true);
}

async function loadMessages(force = false) {
  if (!active) return;
  const d = await api.get(`/chat/conversations/${active}/messages`);
  const signature = (d.messages || []).map((m) => `${m.id}:${m.deleted_at || ''}:${m.reportado || ''}`).join('|');
  if (!force && signature === lastMessageSignature) return;
  lastMessageSignature = signature;
  chatHead.innerHTML = `<div><b>${h(d.conversation.comprador_id === user.id ? d.conversation.vendedor_nombre : d.conversation.comprador_nombre)}</b><p class="text-sm muted">${onlineLabel(d.conversation)} · Polling activo cada 8 segundos</p></div>`;
  msgs.innerHTML = (d.messages || []).map(messageBubble).join('') || '<p class="muted p-4">Sin mensajes en esta conversación.</p>';
  msgs.scrollTop = msgs.scrollHeight;
  $$('.report').forEach((b) => { b.onclick = () => reportMessage(b.dataset.id); });
  $$('.del').forEach((b) => { b.onclick = () => deleteMessage(b.dataset.id); });
}

function messageBubble(m) {
  const mine = m.emisor_id === user.id;
  const deleted = m.estado === 'eliminado' || m.deleted_at;
  return `<div class="bubble ${mine ? 'mine' : ''}"><p>${deleted ? '<i>Mensaje eliminado</i>' : h(m.mensaje || m.contenido || '')}</p>${deleted ? '' : (m.archivos || []).map(fileLink).join('')}<div class="text-xs opacity-70 mt-2">${formatDate(m.created_at)} · ${m.reportado ? 'Reportado · ' : ''}<button class="report" data-id="${Number(m.id) || ''}" type="button">Reportar</button> · <button class="del" data-id="${Number(m.id) || ''}" type="button">Eliminar</button></div></div>`;
}

function fileLink(f) { return f.mime_type?.startsWith('image/') ? `<img src="${assetUrl(f.url_archivo)}" class="rounded-2xl mt-2 max-w-xs" alt="${h(f.nombre_original || 'Adjunto')}">` : `<a class="underline" href="${assetUrl(f.url_archivo)}" target="_blank" rel="noopener noreferrer">📎 ${h(f.nombre_original || 'Archivo adjunto')}</a>`; }
function insertEmoji(e) { msgForm.mensaje.value += e; msgForm.mensaje.focus(); }

async function reportMessage(id) { try { await api.patch(`/chat/messages/${id}/report`, {}); toast('Mensaje reportado'); await loadMessages(true); } catch (e) { toast(e.message, 'error'); } }
async function deleteMessage(id) { if (!confirm('¿Eliminar este mensaje?')) return; try { await api.delete(`/chat/messages/${id}`); toast('Mensaje eliminado'); await loadMessages(true); } catch (e) { toast(e.message, 'error'); } }

async function send(e) {
  e.preventDefault();
  if (!active) return toast('Selecciona una conversación', 'error');
  const btn = msgForm.querySelector('button.btn-primary');
  const fd = new FormData(msgForm);
  await withButtonLoading(btn, async () => {
    try {
      await api.form(`/chat/conversations/${active}/messages`, fd);
      msgForm.reset(); filePreview.innerHTML = ''; emojiPanel.classList.add('hidden');
      await loadMessages(true); await load();
    } catch (err) { toast(err.message, 'error'); }
  }, 'Enviando...');
}

function startPolling() { clearInterval(pollTimer); pollTimer = setInterval(async () => { try { await load(); await loadMessages(false); } catch {} }, 8000); window.addEventListener('beforeunload', () => clearInterval(pollTimer)); }
function formatDate(v) { if (!v) return ''; const d = new Date(v); return Number.isNaN(d.getTime()) ? h(v) : d.toLocaleString('es-CO'); }
render();

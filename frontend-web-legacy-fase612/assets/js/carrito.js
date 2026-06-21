
import {api, assetUrl} from './api.js';
import {shell, bindShell, $, money, toast, h, withButtonLoading} from './ui.js';
import {cart, saveCart, clearCart} from './cart-store.js';
import {requireAuth} from './auth.js';

let items = cart();
let user = null;
let validated = null;
let addresses = [];
let selectedAddressId = '';
let validationBlocksPayment = false;
let lastReceipt = null;

async function render() {
  app.innerHTML = await shell('carrito') + `<main class="container"><h1 class="text-4xl font-extrabold mb-2">Detalles de Pago</h1><p class="muted mb-8">Carrito multi-tienda, validación de stock y pago sandbox.</p><section class="two-col"><div class="grid gap-6"><div class="card" id="cartBox"></div><section class="card" id="validationBox"></section><section class="card" id="addressBook"></section><form id="addrForm" class="card grid gap-3"><h2 class="text-2xl font-bold">Nueva dirección de envío</h2><div class="grid md:grid-cols-2 gap-3"><input class="input" name="departamento" placeholder="Departamento" required><input class="input" name="ciudad" placeholder="Ciudad" required></div><input class="input" name="direccion" placeholder="Dirección" required><div class="grid md:grid-cols-2 gap-3"><input class="input" name="telefono" placeholder="Teléfono" required><input class="input" name="codigo_postal" placeholder="Código postal"></div><label><input type="checkbox" name="es_principal" checked> Dirección principal</label><button class="btn btn-secondary" type="submit">Guardar dirección</button></form><section class="card hidden" id="receiptBox"></section></div><aside class="grid gap-6"><div class="card" id="summary"></div><form id="payForm" class="card grid gap-3"><h2 class="text-2xl font-bold">Pasarela de Pago <span class="pill orange">Sandbox</span></h2><input class="input" name="card_holder" value="Juan Pérez" placeholder="Titular"><input class="input" name="card_number" value="4111111111111111" placeholder="Tarjeta"><div class="grid grid-cols-3 gap-2"><input class="input" name="exp_month" value="12"><input class="input" name="exp_year" value="2030"><input class="input" name="cvv" value="123"></div><button id="payBtn" class="btn btn-primary" type="submit">Finalizar Compra 🔒</button></form></aside></section></main>`;
  bindShell();
  try {
    user = await requireAuth(api, ['comprador']);
  } catch {}
  addrForm.onsubmit = createAddress;
  payForm.onsubmit = pay;
  await loadAddresses();
  draw();
  validateCart().catch(() => {});
}

function group() {
  return items.reduce((a, i) => {
    (a[i.tienda] ??= []).push(i);
    return a;
  }, {});
}

function total() {
  return items.reduce((s, i) => s + Number(i.precio || 0) * Number(i.cantidad || 0), 0);
}

function draw() {
  drawCart();
  drawSummary();
  drawAddresses();
  drawValidation();
}

function drawCart() {
  cartBox.innerHTML = `<h2 class="text-2xl font-bold mb-4">Carrito</h2>${Object.entries(group()).map(([t, arr]) => `<div class="mb-5"><h3 class="font-bold mb-2">▤ ${h(t)}</h3>${arr.map((i) => `<div class="flex gap-4 items-center border-t border-orange-100 py-4"><img src="${assetUrl(i.imagen_url)}" class="w-20 h-20 rounded-2xl object-cover" alt="${h(i.nombre)}"><div class="flex-1"><b>${h(i.nombre)}</b><p>${money(i.precio)} x <button data-id="${Number(i.producto_id) || ''}" class="dec" type="button">−</button> <b>${Number(i.cantidad) || 0}</b> <button data-id="${Number(i.producto_id) || ''}" class="inc" type="button">+</button></p></div><b>${money(Number(i.precio || 0) * Number(i.cantidad || 0))}</b><button class="rm text-red-600" type="button" data-id="${Number(i.producto_id) || ''}">Eliminar</button></div>`).join('')}</div>`).join('') || '<p class="muted">Carrito vacío.</p>'}`;
  document.querySelectorAll('.inc').forEach((b) => { b.onclick = () => upd(b.dataset.id, 1); });
  document.querySelectorAll('.dec').forEach((b) => { b.onclick = () => upd(b.dataset.id, -1); });
  document.querySelectorAll('.rm').forEach((b) => {
    b.onclick = () => {
      items = items.filter((i) => i.producto_id != b.dataset.id);
      saveCart(items);
      validated = null;
      draw();
    };
  });
}

function drawSummary() {
  summary.innerHTML = `<h2 class="text-2xl font-bold mb-4">Resumen del Pedido</h2><p>Subtotal local: <b>${money(total())}</b></p><p>Envío: <b class="text-green-600">Gratis</b></p><div class="p-4 bg-orange-100 rounded-2xl my-4"><p>Comisión plataforma estimada (10%): <b>${money(total() * .1)}</b></p><p>Pago vendedores estimado (90%): <b class="text-blue-600">${money(total() * .9)}</b></p></div><p class="price">${money(validated?.total ?? total())}</p><button id="validate" class="btn btn-secondary w-full mt-3" type="button">Validar carrito</button>${lastReceipt ? '<button id="showReceipt" class="btn btn-ghost w-full mt-3" type="button">Ver comprobante</button>' : ''}`;
  validate.onclick = () => validateCart();
  $('#showReceipt')?.addEventListener('click', () => receiptBox.scrollIntoView({behavior: 'smooth'}));
}

function drawAddresses() {
  addressBook.innerHTML = `<h2 class="text-2xl font-bold mb-4">Direcciones guardadas</h2>${addresses.length ? `<label>Selecciona dirección antes de pagar<select id="addressSelect" class="select mt-2"><option value="">Selecciona una dirección</option>${addresses.map((a) => `<option value="${Number(a.id) || ''}" ${String(selectedAddressId) === String(a.id) ? 'selected' : ''}>${h(a.direccion)}, ${h(a.ciudad)} - ${h(a.departamento)} (${h(a.telefono || 'sin teléfono')})</option>`).join('')}</select></label>` : '<p class="muted">No tienes direcciones guardadas. Crea una nueva dirección para continuar.</p>'}`;
  $('#addressSelect')?.addEventListener('change', (e) => { selectedAddressId = e.target.value; });
}

function drawValidation() {
  validationBlocksPayment = false;
  if (!validated) {
    validationBox.innerHTML = '<h2 class="text-2xl font-bold mb-3">Validación del carrito</h2><p class="muted">Ejecuta la validación para confirmar precios y stock actuales antes de pagar.</p>';
    return;
  }
  const valid = validated.valid_items || [];
  const invalid = validated.invalid_items || [];
  const localMap = new Map(items.map((i) => [String(i.producto_id), i]));
  const priceChanges = valid.filter((v) => {
    const local = localMap.get(String(v.producto_id));
    return local && Number(local.precio || 0) !== Number(v.precio_unitario || 0);
  });
  validationBlocksPayment = invalid.length > 0 || priceChanges.length > 0;
  validationBox.innerHTML = `<div class="flex justify-between gap-3 items-start"><div><h2 class="text-2xl font-bold mb-3">Validación del carrito</h2><p class="muted">${validationBlocksPayment ? 'Hay cambios que debes corregir antes de pagar.' : 'Carrito validado correctamente.'}</p></div>${validationBlocksPayment ? '<button id="syncCart" class="btn btn-primary" type="button">Actualizar carrito validado</button>' : ''}</div><div class="grid gap-3 mt-4">${valid.map((v) => validationValidRow(v, localMap.get(String(v.producto_id)))).join('')}${invalid.map(validationInvalidRow).join('')}</div>`;
  $('#syncCart')?.addEventListener('click', syncCartWithValidation);
}

function validationValidRow(v, local) {
  const changed = local && Number(local.precio || 0) !== Number(v.precio_unitario || 0);
  return `<div class="p-3 rounded-2xl ${changed ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}"><b>${h(v.nombre || local?.nombre || 'Producto')}</b><p class="text-sm">Cantidad: ${Number(v.cantidad) || 0} · Stock actual: ${Number(v.stock_actual) || 0}</p><p class="text-sm">Precio local: <b>${money(local?.precio || 0)}</b> · Precio actual: <b>${money(v.precio_unitario || 0)}</b></p>${changed ? '<p class="text-sm text-amber-700 font-bold">El precio cambió. Actualiza el carrito para continuar.</p>' : '<p class="text-sm text-green-700 font-bold">Disponible y precio vigente.</p>'}</div>`;
}

function validationInvalidRow(i) {
  return `<div class="p-3 rounded-2xl bg-red-50 border border-red-200"><b>Producto #${h(i.producto_id)}</b><p class="text-sm text-red-700 font-bold">${h(i.reason || 'Producto inválido')}</p>${i.stock_actual !== undefined ? `<p class="text-sm">Stock actual: ${Number(i.stock_actual) || 0}. Cantidad solicitada: ${Number(i.cantidad) || 0}</p>` : ''}${i.estado ? `<p class="text-sm">Estado: ${h(i.estado)}</p>` : ''}</div>`;
}

function syncCartWithValidation() {
  const valid = validated?.valid_items || [];
  if (!valid.length) {
    items = [];
  } else {
    const localMap = new Map(items.map((i) => [String(i.producto_id), i]));
    items = valid.map((v) => {
      const local = localMap.get(String(v.producto_id)) || {};
      return {
        producto_id: v.producto_id,
        nombre: v.nombre || local.nombre,
        precio: Number(v.precio_unitario || 0),
        imagen_url: local.imagen_url,
        tienda: v.tienda_nombre || local.tienda || 'Tienda',
        cantidad: Math.min(Number(v.cantidad || 1), Number(v.stock_actual || v.cantidad || 1)),
      };
    });
  }
  saveCart(items);
  validated = null;
  toast('Carrito actualizado con datos vigentes. Valídalo nuevamente antes de pagar.');
  draw();
  validateCart().catch(() => {});
}

function upd(id, delta) {
  items = items.map((i) => i.producto_id == id ? {...i, cantidad: Math.max(1, Number(i.cantidad || 1) + delta)} : i);
  saveCart(items);
  validated = null;
  draw();
}

async function loadAddresses() {
  try {
    const d = await api.get('/addresses');
    addresses = d.addresses || [];
    const main = addresses.find((a) => a.es_principal) || addresses[0];
    selectedAddressId = selectedAddressId || main?.id || '';
  } catch (e) {
    addresses = [];
    toast(e.message, 'error');
  }
}

async function createAddress(e) {
  e.preventDefault();
  const btn = addrForm.querySelector('button');
  await withButtonLoading(btn, async () => {
    try {
      const data = Object.fromEntries(new FormData(addrForm));
      data.es_principal = addrForm.es_principal.checked;
      const d = await api.post('/addresses', data);
      selectedAddressId = d.address?.id || '';
      addrForm.reset();
      addrForm.es_principal.checked = true;
      toast('Dirección guardada');
      await loadAddresses();
      draw();
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 'Guardando...');
}

async function validateCart() {
  if (!items.length) {
    validated = null;
    drawValidation();
    return null;
  }
  try {
    validated = await api.post('/cart/validate', {items: items.map((i) => ({producto_id: i.producto_id, cantidad: i.cantidad}))});
    drawValidation();
    drawSummary();
    toast(validationBlocksPayment ? 'Carrito validado con cambios por revisar' : 'Carrito validado');
    return validated;
  } catch (e) {
    validated = null;
    validationBlocksPayment = true;
    validationBox.innerHTML = `<h2 class="text-2xl font-bold mb-3">Validación del carrito</h2><p class="text-red-700 font-bold">${h(e.message)}</p>`;
    throw e;
  }
}

async function pay(e) {
  e.preventDefault();
  if (!items.length) return toast('Carrito vacío', 'error');
  if (!selectedAddressId) return toast('Selecciona o crea una dirección antes de pagar.', 'error');
  const btn = payForm.querySelector('button[type="submit"]');
  await withButtonLoading(btn, async () => {
    try {
      await validateCart();
      if (validationBlocksPayment) return toast('Corrige los cambios del carrito antes de pagar.', 'error');
      const order = await api.post('/orders', {direccion_id: Number(selectedAddressId), items: items.map((i) => ({producto_id: i.producto_id, cantidad: i.cantidad}))});
      const fd = Object.fromEntries(new FormData(payForm));
      fd.pedido_id = order.order.id;
      const p = await api.post('/payments/sandbox', fd);
      lastReceipt = buildReceipt(order.order, p.payment);
      showReceipt(lastReceipt);
      toast('Pago procesado: ' + (p.payment?.estado || 'OK'));
      if (p.payment?.estado === 'aprobado') {
        clearCart();
        items = [];
        validated = null;
        drawCart();
        drawSummary();
      }
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 'Procesando pago...');
}

function buildReceipt(order, payment) {
  return {
    orderId: order.id,
    total: order.total ?? validated?.total ?? total(),
    estado: payment?.estado === 'aprobado' ? 'pagado' : payment?.estado || order.estado_pago || 'pendiente',
    fecha: new Date().toLocaleString('es-CO'),
    paymentMessage: payment?.mensaje || '',
    envios: payment?.envios_creados,
    items: [...items],
  };
}

function showReceipt(receipt) {
  receiptBox.classList.remove('hidden');
  receiptBox.innerHTML = `<h2 class="text-2xl font-bold mb-3">Comprobante de pago simulado</h2><div class="grid gap-2"><p>Número de orden: <b>#${h(receipt.orderId)}</b></p><p>Total: <b>${money(receipt.total)}</b></p><p>Estado: <b class="${receipt.estado === 'pagado' ? 'text-green-700' : 'text-red-700'}">${h(receipt.estado)}</b></p><p>Fecha/hora: <b>${h(receipt.fecha)}</b></p>${receipt.paymentMessage ? `<p>Mensaje: ${h(receipt.paymentMessage)}</p>` : ''}${receipt.envios !== undefined ? `<p>Envíos generados: <b>${Number(receipt.envios) || 0}</b></p>` : ''}<h3 class="font-bold mt-3">Productos</h3>${receipt.items.map((i) => `<p>• ${h(i.nombre)} — ${Number(i.cantidad)} x ${money(i.precio)} — ${h(i.tienda)}</p>`).join('')}</div><div class="flex gap-2 mt-4"><button id="copyReceipt" class="btn btn-secondary" type="button">Copiar resumen</button><button id="hideReceipt" class="btn btn-ghost" type="button">Cerrar</button></div>`;
  copyReceipt.onclick = copyReceiptText;
  hideReceipt.onclick = () => receiptBox.classList.add('hidden');
  receiptBox.scrollIntoView({behavior: 'smooth', block: 'start'});
}

async function copyReceiptText() {
  if (!lastReceipt) return;
  const text = `Comprobante CommerCity\nOrden: #${lastReceipt.orderId}\nTotal: ${money(lastReceipt.total)}\nEstado: ${lastReceipt.estado}\nFecha: ${lastReceipt.fecha}`;
  try {
    await navigator.clipboard.writeText(text);
    toast('Resumen copiado');
  } catch {
    toast(text);
  }
}

render();

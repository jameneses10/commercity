
import {api} from './api.js';
import {setToken, saveUser, redirectByRole} from './auth.js';
import {$, toast, withButtonLoading} from './ui.js';

app.innerHTML = `<main class="auth-shell"><section class="auth-card glass"><div class="text-center mb-7"><img src="assets/img/logo-commercity.png" class="auth-logo mx-auto" alt="Logo CommerCity" onerror="this.remove()"><h1 id="authTitle" class="text-4xl font-extrabold mt-4">Bienvenido a CommerCity</h1><p id="authSubtitle" class="muted mt-2">Inicia sesión para comprar, vender y gestionar tu tienda.</p></div><div class="tabs mb-6" role="tablist" aria-label="Acceso a CommerCity"><button id="loginTab" class="active" type="button" role="tab" aria-controls="loginForm" aria-selected="true">Iniciar sesión</button><button id="regTab" type="button" role="tab" aria-controls="regForm" aria-selected="false">Registro</button></div><form id="loginForm" class="grid gap-4"><label>Correo electrónico<input class="input" name="correo" type="email" required autocomplete="email" placeholder="ejemplo@commercity.com"></label><label>Contraseña<input class="input" name="password" type="password" required autocomplete="current-password" placeholder="Tu contraseña"></label><div class="auth-helper"><a id="forgotLink" class="auth-link" href="pages/forgot-password.html">¿Olvidaste tu contraseña?</a></div><button class="btn btn-primary w-full" type="submit">Iniciar sesión</button><p class="text-center text-sm muted">¿No tienes cuenta? <button id="showRegister" class="auth-link" type="button">Regístrate</button></p></form><form id="regForm" class="grid gap-4 hidden"><div class="grid md:grid-cols-2 gap-3"><label>Nombre completo<input class="input" name="nombre" required autocomplete="name" placeholder="Tu nombre"></label><label>Correo electrónico<input class="input" name="correo" type="email" required autocomplete="email" placeholder="correo@ejemplo.com"></label></div><div class="grid md:grid-cols-2 gap-3"><label>Contraseña<input class="input" name="password" type="password" minlength="8" required autocomplete="new-password" placeholder="Mínimo 8 caracteres"><p class="field-hint">Usa una clave segura de mínimo 8 caracteres.</p></label><label>Confirmar contraseña<input class="input" name="confirmPassword" type="password" minlength="8" required autocomplete="new-password" placeholder="Repite la contraseña"></label></div><fieldset><legend class="mb-2 font-bold muted">Tipo de cuenta</legend><div class="role-options"><label class="role-card"><input type="radio" name="rol" value="comprador" checked> <span><b>Comprador</b><br><small class="muted">Compra productos y gestiona pedidos.</small></span></label><label class="role-card"><input type="radio" name="rol" value="vendedor"> <span><b>Vendedor</b><br><small class="muted">Publica productos y administra tu tienda.</small></span></label></div></fieldset><label id="birthWrap" class="hidden">Fecha de nacimiento del vendedor<input class="input" name="fecha_nacimiento" type="date"><p class="field-hint">Campo obligatorio para vendedores. Debes ser mayor de 18 años.</p></label><label class="flex gap-3 items-start rounded-2xl bg-white/60 border border-white/70 p-3"><input class="mt-1" type="checkbox" name="acepta_terminos" required> <span>Acepto los términos y condiciones de CommerCity.</span></label><input type="hidden" name="terminos_version" value="2026-06"><button class="btn btn-primary w-full" type="submit">Crear cuenta</button><p class="text-center text-sm muted">¿Ya tienes cuenta? <button id="showLogin" class="auth-link" type="button">Inicia sesión</button></p></form><p class="text-center mt-6 text-sm muted">Privacidad · Términos · Ayuda</p></section></main>`;

const authTitle = $('#authTitle');
const authSubtitle = $('#authSubtitle');
const roleInputs = [...regForm.querySelectorAll('input[name="rol"]')];
const birthInput = birthWrap.querySelector('input');

function setMode(mode) {
  const isRegister = mode === 'register';
  loginTab.classList.toggle('active', !isRegister);
  regTab.classList.toggle('active', isRegister);
  loginTab.setAttribute('aria-selected', String(!isRegister));
  regTab.setAttribute('aria-selected', String(isRegister));
  loginForm.classList.toggle('hidden', isRegister);
  regForm.classList.toggle('hidden', !isRegister);
  authTitle.textContent = isRegister ? 'Crea tu cuenta' : 'Bienvenido a CommerCity';
  authSubtitle.textContent = isRegister ? 'Únete a CommerCity como comprador o vendedor.' : 'Inicia sesión para comprar, vender y gestionar tu tienda.';
  (isRegister ? regForm.nombre : loginForm.correo).focus();
}

function updateSellerFields() {
  const selectedRole = regForm.querySelector('input[name="rol"]:checked')?.value || 'comprador';
  birthWrap.classList.toggle('hidden', selectedRole !== 'vendedor');
  birthInput.required = selectedRole === 'vendedor';
}

loginTab.onclick = () => setMode('login');
regTab.onclick = () => setMode('register');
showRegister.onclick = () => setMode('register');
showLogin.onclick = () => setMode('login');
roleInputs.forEach((input) => input.addEventListener('change', updateSellerFields));
forgotLink.addEventListener('click', () => toast('Puedes solicitar la recuperación de contraseña en el siguiente formulario.', 'ok'));
updateSellerFields();

loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const btn = loginForm.querySelector('button[type="submit"]');
  await withButtonLoading(btn, async () => {
    try {
      const d = await api.post('/auth/login', Object.fromEntries(new FormData(loginForm)), {auth: false});
      setToken(d.token);
      saveUser(d.user);
      toast('Bienvenido');
      redirectByRole(d.user);
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 'Entrando...');
};

regForm.onsubmit = async (e) => {
  e.preventDefault();
  const btn = regForm.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(regForm));
  data.acepta_terminos = regForm.acepta_terminos.checked;

  if (data.password !== data.confirmPassword) return toast('Las contraseñas no coinciden.', 'error');
  if (!data.acepta_terminos) return toast('Debes aceptar los términos y condiciones.', 'error');
  if (data.rol === 'vendedor' && !data.fecha_nacimiento) return toast('La fecha de nacimiento es obligatoria para vendedores.', 'error');

  await withButtonLoading(btn, async () => {
    try {
      await api.post('/auth/register', data, {auth: false});
      toast('Registro exitoso. Inicia sesión.');
      setMode('login');
      loginForm.correo.value = data.correo;
    } catch (err) {
      toast(err.message, 'error');
    }
  }, 'Creando cuenta...');
};

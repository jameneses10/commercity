const form=document.querySelector('[data-chat-form]');
const input=document.querySelector('[data-chat-input]');
const messages=document.querySelector('[data-chat-messages]');
const alertBox=document.querySelector('[data-chat-alert]');
const emojiPanel=document.querySelector('[data-emoji-panel]');
const fileInput=document.querySelector('[data-file-input]');
const fileState=document.querySelector('[data-file-state]');
let selectedFile='';
function stamp(){return new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});}
function hideAlert(){alertBox?.classList.add('cc-hidden');}
document.querySelector('[data-emoji-toggle]')?.addEventListener('click',()=>emojiPanel?.classList.toggle('cc-hidden'));
emojiPanel?.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{input.value+=btn.textContent;input.focus();emojiPanel.classList.add('cc-hidden');hideAlert();}));
document.querySelector('[data-file-button]')?.addEventListener('click',()=>fileInput?.click());
fileInput?.addEventListener('change',()=>{selectedFile=fileInput.files?.[0]?.name||'';fileState.textContent=selectedFile?`Archivo listo para enviar: ${selectedFile}`:'';hideAlert();});
document.querySelectorAll('[data-chat-contact]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-chat-contact]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelector('[data-chat-title]').textContent=btn.dataset.chatContact;document.querySelector('[data-chat-state]').textContent=btn.dataset.chatStatus;}));
form?.addEventListener('submit',(event)=>{event.preventDefault();const text=input.value.trim();if(!text&&!selectedFile){alertBox?.classList.remove('cc-hidden');return;}const fileText=selectedFile?`<p class="cc-attachment-note">Adjunto preparado: ${selectedFile}</p>`:'';messages.insertAdjacentHTML('beforeend',`<div class="cc-message-row mine"><article class="cc-message mine"><p>${text||'Archivo adjunto preparado para envío.'}</p>${fileText}<time>${stamp()}</time></article></div>`);input.value='';selectedFile='';if(fileInput) fileInput.value='';fileState.textContent='';hideAlert();messages.scrollTop=messages.scrollHeight;});

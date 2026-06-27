export function initChat(){ const form=document.querySelector('#chatForm'); if(form) form.addEventListener('submit',e=>{e.preventDefault(); const input=form.querySelector('input'); const box=document.querySelector('#chatMessages'); if(input.value.trim()) box.insertAdjacentHTML('beforeend',`<div class="cc-message mine">${input.value}</div>`); input.value='';}); }
initChat();

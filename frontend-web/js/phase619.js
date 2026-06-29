import { showMessage } from './ui.js';

function initAdminFilters(){
  document.querySelectorAll('[data-admin-filter-group]').forEach(group=>{
    const scope=group.dataset.adminFilterGroup;
    const items=[...document.querySelectorAll(`[data-admin-item="${scope}"]`)];
    const empty=document.querySelector(`[data-admin-empty="${scope}"]`);
    const apply=(filter, query='')=>{
      let visible=0;
      items.forEach(item=>{
        const status=item.dataset.status || '';
        const byStatus=filter==='all' || status===filter || item.innerText.toLowerCase().includes(filter);
        const bySearch=!query || item.innerText.toLowerCase().includes(query);
        const show=byStatus && bySearch;
        item.classList.toggle('hidden', !show);
        if(show) visible+=1;
      });
      if(empty) empty.classList.toggle('hidden', visible>0);
    };
    group.addEventListener('click', event=>{
      const btn=event.target.closest('[data-filter]');
      if(!btn) return;
      group.querySelectorAll('[data-filter]').forEach(item=>item.classList.remove('active'));
      btn.classList.add('active');
      const input=document.querySelector(`[data-admin-search="${scope}"]`);
      apply(btn.dataset.filter, input?.value.trim().toLowerCase() || '');
    });
    const input=document.querySelector(`[data-admin-search="${scope}"]`);
    input?.addEventListener('input',()=>{
      const active=group.querySelector('[data-filter].active')?.dataset.filter || 'all';
      apply(active, input.value.trim().toLowerCase());
    });
  });
}

function initAdminForms(){
  document.querySelectorAll('[data-admin-form]').forEach(form=>{
    form.addEventListener('submit', event=>{
      event.preventDefault();
      const target=form.dataset.adminForm;
      const invalid=[...form.querySelectorAll('[required]')].some(input=>!String(input.value||'').trim());
      if(invalid){ showMessage(`#${target}`,'Completa los campos obligatorios para continuar.'); return; }
      showMessage(`#${target}`,'Funcionalidad administrativa en preparación. Validación visual correcta.',true);
      form.reset();
    });
  });
}

initAdminFilters();
initAdminForms();

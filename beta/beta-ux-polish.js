/* Beta v0.8.9.4 — aprimoramentos de interface, sem alterar estruturas de dados. */
(() => {
  'use strict';

  let scheduled = false;
  let clientLabelChecked = false;

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    const run=()=>{scheduled=false;applyPolish();};
    if('requestAnimationFrame' in window)requestAnimationFrame(run);else setTimeout(run,16);
  }

  function migrateDefaultClientLabel(){
    if(clientLabelChecked||typeof data==='undefined'||!data?.settings||typeof persistSettings!=='function')return;
    clientLabelChecked=true;
    const label=String(data.settings.clientEmptyLabel??'').trim();
    if(label===''||label==='Sem cliente'){
      data.settings.clientEmptyLabel='Selecionar cliente';
      Promise.resolve(persistSettings()).catch(error=>console.warn('Não foi possível atualizar o texto padrão de cliente.',error)).finally(schedule);
    }
  }

  function enhanceTimerScreen(){
    const header=document.querySelector('.timer-topbar');
    if(!header)return;

    const modelName=header.querySelector('.current-model-name');
    if(modelName&&!header.querySelector('.model-selected-kicker')){
      const kicker=document.createElement('div');
      kicker.className='model-selected-kicker';
      kicker.textContent='Modelo selecionado';
      modelName.before(kicker);
    }

    const modelsButton=header.querySelector('#modelsBack');
    if(modelsButton){
      modelsButton.setAttribute('aria-label','Trocar modelo');
      modelsButton.title='Trocar modelo';
    }

    if(modelName&&modelsButton&&!header.querySelector('.beta-model-switch')){
      const switcher=document.createElement('button');
      switcher.type='button';
      switcher.className='beta-model-switch';
      switcher.textContent='Trocar modelo';
      switcher.addEventListener('click',()=>modelsButton.click());
      modelName.after(switcher);
    }

    const title=header.querySelector('#currentTitleButton');
    if(title){
      title.title=title.classList.contains('untitled')?'Selecionar cliente ou título':'Editar identificação do registro';
      if(title.classList.contains('untitled')&&['','Sem cliente'].includes(title.textContent.trim()))title.textContent='Selecionar cliente';
    }
  }

  function enhanceHistory(){
    const filters=document.querySelector('.history-filters');
    if(!filters)return;
    filters.classList.add('beta-compact-filters');
    const search=filters.querySelector('#historySearch');
    if(search)search.setAttribute('aria-label','Buscar no histórico');

    let toggle=filters.querySelector('.history-filter-toggle');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='history-filter-toggle';
      toggle.textContent='Filtros';
      toggle.setAttribute('aria-expanded','false');
      toggle.addEventListener('click',()=>{
        const open=filters.classList.toggle('is-open');
        toggle.textContent=open?'Ocultar':'Filtros';
        toggle.setAttribute('aria-expanded',String(open));
      });
      const searchWrap=filters.querySelector('.history-search-wrap');
      if(searchWrap)searchWrap.after(toggle);else filters.prepend(toggle);
    }
  }

  function syncTabPill(){
    const bar=document.querySelector('.tabbar');
    const active=bar?.querySelector('button.active');
    if(!bar||!active)return;
    const barBox=bar.getBoundingClientRect();
    const activeBox=active.getBoundingClientRect();
    if(!barBox.width||!activeBox.width)return;
    bar.style.setProperty('--beta-tab-pill-x',`${Math.round(activeBox.left-barBox.left)}px`);
    bar.style.setProperty('--beta-tab-pill-y',`${Math.round(activeBox.top-barBox.top)}px`);
    bar.style.setProperty('--beta-tab-pill-width',`${Math.round(activeBox.width)}px`);
    bar.style.setProperty('--beta-tab-pill-height',`${Math.round(activeBox.height)}px`);
    if(!bar.dataset.betaPillBound){
      bar.dataset.betaPillBound='true';
      bar.addEventListener('click',()=>setTimeout(syncTabPill,0));
      window.addEventListener('resize',syncTabPill,{passive:true});
    }
  }

  function applyPolish(){
    document.body.classList.add('beta-ux-polished');
    migrateDefaultClientLabel();
    enhanceTimerScreen();
    enhanceHistory();
    syncTabPill();
  }

  applyPolish();
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  [80,300,900,1800].forEach(delay=>setTimeout(schedule,delay));

  const app=document.getElementById('app');
  if(app){
    const observer=new MutationObserver(schedule);
    observer.observe(app,{childList:true,subtree:true});
  }
})();

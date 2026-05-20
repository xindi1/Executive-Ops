const KEY='executive-ops-os-v1';let data={loops:[],stakeholders:[],threads:[],pulses:[]};const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];function load(){data=JSON.parse(localStorage.getItem(KEY)||JSON.stringify(data));render()}function save(){localStorage.setItem(KEY,JSON.stringify(data))}function nav(view){$$('.view').forEach(v=>v.classList.remove('active'));$('#'+view+'View').classList.add('active');$$('.navBtn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));render()}function addLoop(){const title=$('#loopTitle').value.trim();if(!title)return;data.loops.unshift({title,type:$('#loopType').value,pressure:Number($('#loopPressure').value),owner:$('#loopOwner').value.trim()||'Unassigned',due:$('#loopDue').value,done:false,created:new Date().toLocaleString()});$('#loopTitle').value='';$('#loopOwner').value='';$('#loopDue').value='';save();render()}function quickLoop(title,type,pressure){data.loops.unshift({title,type,pressure,owner:'Unassigned',due:'',done:false,created:new Date().toLocaleString()});save();render();nav('loops')}function addStakeholder(){const name=$('#stakeName').value.trim();if(!name)return;data.stakeholders.unshift({name,category:$('#stakeCategory').value,temp:$('#stakeTemperature').value,note:$('#stakeNote').value.trim(),created:new Date().toLocaleString()});$('#stakeName').value='';$('#stakeNote').value='';save();render()}function addThread(){const title=$('#threadTitle').value.trim();if(!title)return;data.threads.unshift({title,stage:$('#threadStage').value,note:$('#threadNote').value.trim(),created:new Date().toLocaleString()});$('#threadTitle').value='';$('#threadNote').value='';save();render()}function savePulse(){data.pulses.unshift({state:$('#pulseInput').value,note:$('#pulseNote').value.trim(),time:new Date().toLocaleString()});$('#pulseNote').value='';save();render()}function toggleLoop(i){data.loops[i].done=!data.loops[i].done;save();render()}function removeLoop(i){data.loops.splice(i,1);save();render()}function removeStakeholder(i){data.stakeholders.splice(i,1);save();render()}function removeThread(i){data.threads.splice(i,1);save();render()}function render(){const open=data.loops.filter(x=>!x.done);$('#openCount').textContent=open.length;$('#highCount').textContent=open.filter(x=>x.pressure===3).length;$('#stakeholderCount').textContent=data.stakeholders.length;$('#pulseState').textContent=data.pulses[0]?.state||'Calm';const next=open.slice().sort((a,b)=>b.pressure-a.pressure)[0];$('#nextMove').innerHTML=next?loopCard(next,data.loops.indexOf(next)):`<div class="empty">No high-pressure loops yet.</div>`;$('#loopsList').innerHTML=data.loops.length?data.loops.map((x,i)=>loopCard(x,i)).join(''):`<div class="empty">No open loops yet.</div>`;$('#stakeholderList').innerHTML=data.stakeholders.length?data.stakeholders.map((x,i)=>stakeCard(x,i)).join(''):`<div class="empty">No stakeholders mapped yet.</div>`;$('#threadsList').innerHTML=data.threads.length?data.threads.map((x,i)=>threadCard(x,i)).join(''):`<div class="empty">No priority threads yet.</div>`;$('#pulseHistory').innerHTML=data.pulses.length?data.pulses.map(x=>`<div class="card"><div class="cardTitle">${escapeHtml(x.state)}</div><div class="cardMeta">${escapeHtml(x.time)}</div>${x.note?`<p>${escapeHtml(x.note)}</p>`:''}</div>`).join(''):`<div class="empty">No pulse notes yet.</div>`}function loopCard(x,i){const p=['','Low','Medium','High'][x.pressure]||'Medium';return `<div class="card"><div class="cardTop"><div><div class="cardTitle" style="${x.done?'text-decoration:line-through;opacity:.6':''}">${escapeHtml(x.title)}</div><div class="cardMeta">${escapeHtml(x.type)} · ${escapeHtml(x.owner)} ${x.due?'· Due '+escapeHtml(x.due):''}</div></div><span class="badge gold">${p}</span></div><div class="badges"><span class="badge">${x.done?'Closed':'Open'}</span><span class="badge gray">${escapeHtml(x.created||'')}</span></div><div class="cardBtns"><button onclick="toggleLoop(${i})">${x.done?'Reopen':'Close'}</button><button onclick="removeLoop(${i})">Remove</button></div></div>`}function stakeCard(x,i){return `<div class="card"><div class="cardTop"><div><div class="cardTitle">${escapeHtml(x.name)}</div><div class="cardMeta">${escapeHtml(x.category)} · ${escapeHtml(x.temp)}</div></div><span class="badge gold">${escapeHtml(x.temp)}</span></div>${x.note?`<p>${escapeHtml(x.note)}</p>`:''}<div class="cardBtns"><button onclick="removeStakeholder(${i})">Remove</button></div></div>`}function threadCard(x,i){return `<div class="card"><div class="cardTop"><div><div class="cardTitle">${escapeHtml(x.title)}</div><div class="cardMeta">${escapeHtml(x.stage)} · ${escapeHtml(x.created)}</div></div><span class="badge">${escapeHtml(x.stage)}</span></div>${x.note?`<p>${escapeHtml(x.note)}</p>`:''}<div class="cardBtns"><button onclick="removeThread(${i})">Remove</button></div></div>`}function exportJSON(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='executive-ops-export.json';a.click();URL.revokeObjectURL(a.href)}function resetAll(){if(confirm('Reset local Executive Ops data?')){data={loops:[],stakeholders:[],threads:[],pulses:[]};save();render()}}function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}$('#themeBtn').addEventListener('click',()=>{const dark=document.documentElement.getAttribute('data-theme')==='dark';document.documentElement.setAttribute('data-theme',dark?'':'dark');localStorage.setItem('execops-theme',dark?'':'dark')});const theme=localStorage.getItem('execops-theme');if(theme)document.documentElement.setAttribute('data-theme',theme);if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');load();

function generateExecutiveBrief(){
  const critical = data.loops.filter(x=>!x.done && x.pressure===3).length;
  const active = data.loops.filter(x=>!x.done).length;
  const sensitive = data.stakeholders.filter(x=>['Sensitive','Escalating','Needs Attention','High Stakes'].includes(x.temp)).length;
  const blocked = data.threads.filter(x=>['Blocked','Needs Decision','Decision Required','Delayed'].includes(x.stage)).length;

  let climate = 'Stable';
  if(critical >=2 || sensitive >=2 || blocked >=2){ climate = 'Elevated'; }
  if(critical >=4 || sensitive >=3){ climate = 'High Attention'; }

  let summary = [];

  if(active===0){
    summary.push('Operational environment currently stable with no active priority actions requiring immediate intervention.');
  } else {
    summary.push(`${active} active priority actions currently require executive visibility.`);
  }

  if(critical>0){
    summary.push(`${critical} critical items may create coordination or decision pressure.`);
  }

  if(sensitive>0){
    summary.push(`${sensitive} stakeholder relationships warrant monitoring or follow-up.`);
  }

  if(blocked>0){
    summary.push(`${blocked} strategic priorities are awaiting movement or executive decision support.`);
  }

  summary.push(`Current strategic climate: ${climate}.`);

  document.getElementById('executiveBrief').innerHTML =
    '<strong>AI Executive Brief</strong><br><br>' + summary.join(' ');
}

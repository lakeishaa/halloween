'use strict';
const $ = id => document.getElementById(id);
const config = window.PARTY_CONFIG;
const db = window.supabase?.createClient(config.url, config.key);
let status = null, plus = 0, channel = null, saving = false;
function show(id){document.querySelectorAll('.step').forEach(el=>el.classList.toggle('active',el.id===id));}
function substep(id){['name-step','status-step','plus-step'].forEach(x=>$(x).hidden=x!==id);$('form-error').textContent='';}
function errorText(err){return err?.message || 'Something went wrong. Please try again.';}
$('start').onclick=()=>{show('rsvp-form');substep('name-step');};
$('view-early').onclick=()=>openList();
$('to-status').onclick=()=>{if(!$('guest-name').value.trim()){$('form-error').textContent='Please enter your name.';return;}substep('status-step');};
$('back-name').onclick=()=>substep('name-step');
$('back-status').onclick=()=>substep('status-step');
$('status-choices').onclick=async e=>{
  const button=e.target.closest('[data-status]');if(!button||saving)return;
  status=button.dataset.status;
  if(status==='no'){plus=0;await save();}else{substep('plus-step');}
};
$('plus-choices').onclick=async e=>{
  const button=e.target.closest('[data-plus]');if(!button||saving)return;
  plus=Number(button.dataset.plus);await save();
};
async function save(){
  if(!db){$('form-error').textContent='Configure Supabase in config.js first.';return;}
  saving=true;document.querySelectorAll('.choices button').forEach(b=>b.disabled=true);
  try{
    const name=$('guest-name').value.trim();
    if(!name||name.length>60)throw Error('Please enter a name (max 60 characters).');
    const {error}=await db.from('rsvps').insert({name,status,plus_ones:plus});
    if(error)throw error;
    $('confirmation-title').textContent=status==='no'?"We'll miss you! ♡":'See you there! ♡';
    show('confirmation');
  }catch(err){$('form-error').textContent=errorText(err);}
  finally{saving=false;document.querySelectorAll('.choices button').forEach(b=>b.disabled=false);}
}
$('to-list').onclick=()=>openList();
$('new-rsvp').onclick=()=>{status=null;plus=0;$('guest-name').value='';show('rsvp-form');substep('name-step');};
async function openList(){show('guest-list');await loadGuests();if(db&&!channel){channel=db.channel('party-rsvp-updates').on('postgres_changes',{event:'INSERT',schema:'public',table:'rsvps'},()=>loadGuests()).subscribe();}}
async function loadGuests(){
  if(!db){$('list-error').textContent='Configure Supabase in config.js first.';return;}
  const {data,error}=await db.from('rsvps').select('name,status,plus_ones').order('created_at',{ascending:true}).limit(1000);
  if(error){$('list-error').textContent=errorText(error);return;}
  $('list-error').textContent='';$('guests').replaceChildren();
  const going=data.filter(x=>x.status==='yes').reduce((n,x)=>n+1+x.plus_ones,0);
  const maybe=data.filter(x=>x.status==='maybe').length;
  $('summary').textContent=`${going} attending (including plus-ones) · ${maybe} maybe`;
  for(const guest of data){
    const row=document.createElement('div');row.className='guest';
    const name=document.createElement('strong');name.textContent=guest.name;
    const detail=document.createElement('span');detail.textContent=`${guest.status.toUpperCase()} · +${guest.plus_ones}`;
    row.append(name,detail);$('guests').append(row);
  }
}
// Refresh as a fallback if realtime is disconnected or unavailable.
setInterval(()=>{if($('guest-list').classList.contains('active'))loadGuests();},15000);

import { saveRSVP, listenToRSVPs, isConfigured } from './firebase.js';
const $ = id => document.getElementById(id);
let status = null, plus = 0, unsubscribe = null, saving = false;
function show(id) {
  document.querySelectorAll('.step').forEach(el => el.classList.toggle('active', el.id === id));
  if (id !== 'guest-list' && unsubscribe) { unsubscribe(); unsubscribe = null; }
}
function substep(id) {
  ['name-step', 'status-step', 'plus-step'].forEach(x => $(x).hidden = x !== id);
  $('form-error').textContent = '';
}
function errorText(err) { return err?.message || 'Something went wrong. Please try again.'; }
$('start').onclick = () => { show('rsvp-form'); substep('name-step'); };
$('view-early').onclick = openList;
$('to-status').onclick = () => {
  if (!$('guest-name').value.trim()) { $('form-error').textContent = 'Please enter your name.'; return; }
  substep('status-step');
};
$('back-name').onclick = () => substep('name-step');
$('back-status').onclick = () => substep('status-step');
$('status-choices').onclick = async e => {
  const button = e.target.closest('[data-status]');
  if (!button || saving) return;
  status = button.dataset.status;
  if (status === 'no') { plus = 0; await save(); } else substep('plus-step');
};
$('plus-choices').onclick = async e => {
  const button = e.target.closest('[data-plus]');
  if (!button || saving) return;
  plus = Number(button.dataset.plus);
  await save();
};
async function save() {
  if (!isConfigured) { $('form-error').textContent = 'Replace the XXXX values in firebase.js first.'; return; }
  saving = true;
  document.querySelectorAll('.choices button').forEach(b => b.disabled = true);
  try {
    const name = $('guest-name').value.trim();
    if (!name || name.length > 60) throw Error('Please enter a name (max 60 characters).');
    await saveRSVP(name, status, plus);
    $('confirmation-title').textContent = status === 'no' ? "We'll miss you! ♡" : 'See you there! ♡';
    show('confirmation');
  } catch (err) { $('form-error').textContent = errorText(err); }
  finally { saving = false; document.querySelectorAll('.choices button').forEach(b => b.disabled = false); }
}
$('to-list').onclick = openList;
$('new-rsvp').onclick = () => { status = null; plus = 0; $('guest-name').value = ''; show('rsvp-form'); substep('name-step'); };
function openList() {
  show('guest-list');
  if (!isConfigured) { $('summary').textContent = ''; $('list-error').textContent = 'Replace the XXXX values in firebase.js first.'; return; }
  $('summary').textContent = 'Loading guests…';
  $('list-error').textContent = '';
  unsubscribe = listenToRSVPs(guests => {
    $('list-error').textContent = '';
    $('guests').replaceChildren();
    const going = guests.filter(x => x.status === 'yes').reduce((n, x) => n + 1 + Number(x.plusOnes || 0), 0);
    const maybe = guests.filter(x => x.status === 'maybe').length;
    $('summary').textContent = `${going} attending (including plus-ones) · ${maybe} maybe`;
    guests.sort((a, b) => a.name.localeCompare(b.name));
    for (const guest of guests) {
      const row = document.createElement('div'); row.className = 'guest';
      const name = document.createElement('strong'); name.textContent = guest.name;
      const detail = document.createElement('span'); detail.textContent = `${String(guest.status).toUpperCase()} · +${Number(guest.plusOnes || 0)}`;
      row.append(name, detail); $('guests').append(row);
    }
  }, err => { $('summary').textContent = 'Could not load guests.'; $('list-error').textContent = errorText(err); });
}

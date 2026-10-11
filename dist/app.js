const certificates = window.CERTIFICATES;
const cards = document.querySelector('#cards');
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
const viewer = document.querySelector('#viewer');
let issuer = 'all';
let returnFocus = null;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const dateText = value => new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric', timeZone:'UTC'});

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = certificates.filter(c => (issuer === 'all' || c.issuer === issuer) &&
    `${c.title} ${c.issuer} ${c.credentialId}`.toLowerCase().includes(query));
  visible.sort((a,b) => sort.value === 'title' ? a.title.localeCompare(b.title) :
    sort.value === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  cards.innerHTML = visible.map(c => `
    <article class="card" id="${c.id}">
      <button class="preview" type="button" data-view="${c.id}" aria-label="View ${escapeHtml(c.title)}">
        <img src="${c.image}" alt="${escapeHtml(c.title)} certificate" loading="lazy" width="1100" height="850">
      </button>
      <div class="card-body">
        <div class="card-top"><span class="issuer">${escapeHtml(c.issuer)}</span><time datetime="${c.date}">${dateText(c.date)}</time></div>
        <h3>${escapeHtml(c.title)}</h3>
        <p class="credential-id">Credential ID: ${escapeHtml(c.credentialId)}</p>
        <div class="card-actions"><button class="view" type="button" data-view="${c.id}">View certificate ↗</button>
          ${c.verification ? `<a class="verify" href="${c.verification}" target="_blank" rel="noopener">Verify ↗</a>` : ''}
        </div>
      </div>
    </article>`).join('');
  document.querySelector('#result-count').textContent = `${visible.length} ${visible.length === 1 ? 'certificate' : 'certificates'}`;
  document.querySelector('#empty').hidden = visible.length !== 0;
}

function openCertificate(id, source) {
  const c = certificates.find(item => item.id === id);
  if (!c) return;
  returnFocus = source;
  document.querySelector('#viewer-title').textContent = c.title;
  document.querySelector('#viewer-issuer').textContent = c.issuer;
  document.querySelector('#viewer-meta').textContent = `Issued ${dateText(c.date)} · Credential ID: ${c.credentialId}`;
  const image = document.querySelector('#viewer-image');
  image.src = c.image;
  image.alt = `Original ${c.title} certificate`;
  document.querySelector('#viewer-pdf').href = c.pdf;
  document.querySelector('#viewer-download').href = c.pdf;
  const verify = document.querySelector('#viewer-verify');
  verify.hidden = !c.verification;
  if (c.verification) verify.href = c.verification;
  const badge = document.querySelector('#viewer-badge');
  badge.hidden = !c.badge;
  if (c.badge) badge.href = c.badge;
  viewer.showModal();
  viewer.scrollTop = 0;
}

cards.addEventListener('click', event => {
  const button = event.target.closest('[data-view]');
  if (button) openCertificate(button.dataset.view, button);
});
document.querySelectorAll('[data-issuer]').forEach(button => button.addEventListener('click', () => {
  issuer = button.dataset.issuer;
  document.querySelectorAll('[data-issuer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  render();
}));
search.addEventListener('input', render);
sort.addEventListener('change', render);
document.querySelector('#reset').addEventListener('click', () => {
  search.value = '';
  document.querySelector('[data-issuer="all"]').click();
  search.focus();
});
document.querySelector('#close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target === viewer) {
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  }
});
viewer.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus(); });
render();

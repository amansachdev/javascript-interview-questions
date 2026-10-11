const PROGRESS_KEY = 'javascript-interview-study-progress-v1';
const list = document.querySelector('#question-list');
const query = document.querySelector('#search');
const hideDone = document.querySelector('#hide-done');
const empty = document.querySelector('#empty-state');
let questions = [];
let answers = {};
let activeTier = 'all';
let completed = readProgress();

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    return new Set(Array.isArray(value) ? value : []);
  } catch { return new Set(); }
}
function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed])); } catch { /* Storage may be disabled. */ }
}
function updateProgress() {
  const count = completed.size;
  const total = questions.length;
  document.querySelector('#progress-count').textContent = `${count} / ${total} done`;
  document.querySelector('#progress-bar').style.width = `${total ? Math.min(100, count / total * 100) : 0}%`;
  document.querySelector('#progress-bar').setAttribute('aria-label', `${count} of ${total} questions completed`);
  document.querySelector('#count-all').textContent = total;
  for (const tier of [1, 2, 3]) {
    document.querySelector(`#count-${tier}`).textContent = questions.filter(q => q.tier === tier).length;
  }
}
function safeAnswer(html) {
  const template = document.createElement('template');
  template.innerHTML = html || '<p>Answer not available in the source README.</p>';
  template.content.querySelectorAll('script, iframe, object, embed').forEach(node => node.remove());
  template.content.querySelectorAll('*').forEach(node => {
    for (const attr of [...node.attributes]) {
      if (/^on/i.test(attr.name) || ((attr.name === 'href' || attr.name === 'src') && /^\s*javascript:/i.test(attr.value))) node.removeAttribute(attr.name);
    }
  });
  return template.content;
}
function render() {
  const term = query.value.trim().toLocaleLowerCase();
  const visible = questions.filter(q => {
    const matchTier = activeTier === 'all' || q.tier === Number(activeTier);
    const matchQuery = !term || `${q.title} ${q.section}`.toLocaleLowerCase().includes(term);
    return matchTier && matchQuery && !(hideDone.checked && completed.has(q.id));
  });
  list.replaceChildren();
  let previousTier = null;
  for (const q of visible) {
    if (activeTier === 'all' && previousTier !== q.tier) {
      const heading = document.createElement('div');
      heading.className = 'tier-heading';
      heading.textContent = ({1:'01 · Core — recurring concepts and common coding patterns',2:'02 · Next — useful depth and practical role-specific topics',3:'03 · Optional — narrower, legacy, or puzzle-focused questions'})[q.tier];
      list.append(heading);
      previousTier = q.tier;
    }
    const row = document.createElement('article');
    row.className = `question${completed.has(q.id) ? ' completed' : ''}`;
    const checkLabel = document.createElement('label');
    checkLabel.className = 'check-wrap';
    checkLabel.title = completed.has(q.id) ? 'Mark as not done' : 'Mark as done';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'question-check';
    check.checked = completed.has(q.id);
    check.setAttribute('aria-label', `Mark “${q.title}” as done`);
    check.addEventListener('change', () => {
      if (check.checked) completed.add(q.id); else completed.delete(q.id);
      saveProgress(); updateProgress(); render();
    });
    checkLabel.append(check);
    const main = document.createElement('div');
    main.className = 'question-main';
    const title = document.createElement('div');
    title.className = 'question-title';
    title.textContent = q.title;
    const details = document.createElement('div');
    details.className = 'question-details';
    const number = document.createElement('span');
    number.className = 'question-number';
    number.textContent = `Rank ${q.globalRank} · source #${q.id}`;
    const section = document.createElement('span');
    section.className = 'section-tag';
    section.textContent = q.section;
    details.append(number, section);
    main.append(title, details);
    const disclosure = document.createElement('details');
    disclosure.className = 'answer-details';
    const summary = document.createElement('summary');
    summary.textContent = 'Show answer';
    const answer = document.createElement('div');
    answer.className = 'answer-content';
    disclosure.addEventListener('toggle', () => {
      if (disclosure.open && !answer.hasChildNodes()) answer.append(safeAnswer(answers[String(q.id)]));
    });
    disclosure.append(summary, answer);
    row.append(checkLabel, main, disclosure);
    list.append(row);
  }
  empty.hidden = visible.length !== 0;
  document.querySelector('#list-meta').textContent = `${visible.length} ${visible.length === 1 ? 'question' : 'questions'} shown`;
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeTier = button.dataset.tier;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  render();
}));
query.addEventListener('input', render);
hideDone.addEventListener('change', render);
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault(); query.focus();
  }
  if (event.key === 'Escape' && document.activeElement === query) { query.value = ''; render(); query.blur(); }
});
Promise.all([fetch('./questions.json'), fetch('./answers.json')]).then(async ([questionResponse, answerResponse]) => {
  if (!questionResponse.ok || !answerResponse.ok) throw new Error('Could not load the study guide.');
  return Promise.all([questionResponse.json(), answerResponse.json()]);
}).then(([questionData, answerData]) => {
  questions = questionData.sort((a,b) => a.globalRank - b.globalRank);
  answers = answerData;
  updateProgress(); render();
}).catch(() => {
  document.querySelector('#list-meta').textContent = 'Could not load the study guide. Run the local server from the repository root.';
});

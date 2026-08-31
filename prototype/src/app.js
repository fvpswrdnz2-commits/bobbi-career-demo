import { pageGroups, pages } from './data.js';
import { renderMobilePage, selectProfile, setSearchQuery } from './mobile-pages.js';
import { renderAdminPage } from './admin-pages.js';
import { icon } from './icons.js';

const app = document.querySelector('#app');
const validPage = id => pages[id] ? id : 'student-home';
const currentPage = () => validPage(location.hash.replace('#/', '') || 'student-home');

function roleLabel(group) {
  return { student: '预约咨询', senior: '提供咨询', admin: '运营视角' }[group] || group;
}

function conceptFor(group) {
  const key = group === 'admin' ? 'admin' : group === 'senior' ? 'senior' : 'student';
  return `./assets/concept-${key}.png`;
}

function leftNavigation(activeId) {
  return `<aside class="studio-sidebar">
    <div class="sidebar-heading"><span>${icon('filter', 17)}</span><b>页面目录</b><em>${Object.keys(pages).length}</em></div>
    <nav class="page-tree">
      ${pageGroups.map(group => `<section class="tree-group">
        <button class="tree-group-title ${pages[activeId]?.group === group.id ? 'open' : ''}" data-nav="${group.pages[0].id}">
          <span>${icon(group.icon, 17)}${group.label}</span><small>${group.pages.length}</small>
        </button>
        <div>${group.pages.map(page => `<button class="tree-page ${activeId === page.id ? 'active' : ''}" data-nav="${page.id}">${page.label}</button>`).join('')}</div>
      </section>`).join('')}
    </nav>
    <div class="sidebar-footnote"><b>原型说明</b><p>点击页面、按钮和流程节点，可沿真实业务路径浏览。</p></div>
  </aside>`;
}

function topbar(activeId) {
  const activeGroup = pages[activeId]?.group || 'student';
  return `<header class="studio-topbar">
    <button class="studio-brand" data-nav="student-home"><span>B</span><b>熬夜波比</b><em>产品页面原型</em></button>
    <nav class="scope-switch">${pageGroups.map(group => `<button data-nav="${group.pages[0].id}" class="${activeGroup === group.id ? 'active' : ''}">${icon(group.icon, 16)}${group.label}</button>`).join('')}</nav>
    <div class="topbar-actions"><button data-action="fullscreen">${icon('external', 17)} 专注预览</button></div>
  </header>`;
}

function inspector(activeId) {
  const page = pages[activeId];
  return `<aside class="studio-inspector">
    <div class="inspector-eyebrow">${roleLabel(page.group)}</div>
    <h2>${page.label}</h2>
    <p class="inspector-goal">${page.goal}</p>
    <section><h3>这个页面解决什么</h3><p>${page.goal}</p></section>
    <section><h3>用户可以做什么</h3><ul>${page.actions.map(action => `<li>${icon('check', 15)}<span>${action}</span></li>`).join('')}</ul></section>
    <section><h3>下一步去哪里</h3><p class="next-step">${icon('send', 16)}${page.next}</p></section>
    <section class="style-note"><h3>统一风格</h3><div><i class="swatch navy"></i><i class="swatch orange"></i><i class="swatch lilac"></i></div><p>简历批注感、开放列表、少卡片、不做电商式销量与评分。</p></section>
  </aside>`;
}

function stage(activeId) {
  const page = pages[activeId];
  let preview;
  if (page.group === 'admin') preview = `<div class="desktop-frame"><div class="desktop-screen">${renderAdminPage(activeId)}</div></div>`;
  else preview = `<div class="phone-frame"><div class="phone-speaker"></div><div class="phone-screen">${renderMobilePage(activeId)}</div></div>`;
  return `<main class="studio-stage">
    <div class="stage-canvas ${page.group === 'admin' ? 'admin-canvas' : ''}">${preview}</div>
  </main>`;
}

function render() {
  const activeId = currentPage();
  app.innerHTML = `${topbar(activeId)}<div class="studio-layout">${leftNavigation(activeId)}${stage(activeId)}${inspector(activeId)}</div><div class="toast" role="status"></div>`;
  document.title = `${pages[activeId].label} · 熬夜波比产品原型`;
}

function navigate(id) {
  if (!pages[id]) return;
  location.hash = `/${id}`;
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function openConcept() {
  const page = pages[currentPage()];
  const group = page.group;
  const title = group === 'admin' ? '波比后台视觉概念' : group === 'senior' ? '前辈端视觉概念' : '学生端视觉概念';
  const modal = document.createElement('div');
  modal.className = 'concept-modal';
  modal.innerHTML = `<button class="modal-close" aria-label="关闭">${icon('close', 25)}</button><figure><img src="${conceptFor(group)}" alt="${title}"><figcaption><b>${title}</b><span>已据此提取颜色、排版、留白与信息密度</span></figcaption></figure>`;
  modal.addEventListener('click', event => { if (event.target === modal || event.target.closest('.modal-close')) modal.remove(); });
  document.body.append(modal);
}

document.addEventListener('click', async event => {
  const nav = event.target.closest('[data-nav]');
  if (nav) {
    if (nav.dataset.profileId) selectProfile(nav.dataset.profileId);
    if (nav.dataset.searchValue) setSearchQuery(nav.dataset.searchValue);
    navigate(nav.dataset.nav);
    return;
  }

  const action = event.target.closest('[data-action]');
  if (action) {
    const name = action.dataset.action;
    if (name === 'back') history.length > 1 ? history.back() : navigate('student-home');
    else if (name === 'concept') openConcept();
    else if (name === 'fullscreen') document.body.classList.toggle('presentation-mode');
    else if (name === 'copy' || name === 'copy-wechat') {
      const value = name === 'copy-wechat' ? 'b1025493856' : '123 456 789';
      try { await navigator.clipboard.writeText(value); } catch {}
      showToast('已复制');
    } else if (name === 'meeting-save') { action.textContent = '已保存并通知双方'; action.disabled = true; showToast('会议信息已更新，双方已收到通知'); }
    else if (name === 'upload') showToast('文件已选择');
    else if (name === 'search') { setSearchQuery(document.querySelector('#prototype-search')?.value || ''); navigate('student-search'); render(); }
    else if (name === 'quick-search') { setSearchQuery(action.dataset.searchValue || ''); render(); }
    else showToast('操作已完成');
    return;
  }

  const selectable = event.target.closest('[data-select]');
  if (selectable) {
    const type = selectable.dataset.select;
    if (type === 'candidate') {
      const selected = document.querySelectorAll(`[data-select="${type}"].selected`);
      if (!selectable.classList.contains('selected') && selected.length >= 3) { showToast('最多选择 3 个候选时间'); return; }
      selectable.classList.toggle('selected');
    } else if (type === 'slot') selectable.classList.toggle('open');
    else {
      selectable.parentElement.querySelectorAll(`[data-select="${type}"]`).forEach(item => item.classList.remove('selected'));
      selectable.classList.add('selected');
    }
    return;
  }

  const tab = event.target.closest('.tab-bar button, .admin-tabs button, .filter-row button, .sort-row button, .settlement-tabs button, .meeting-summary button');
  if (tab) {
    tab.parentElement.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    tab.classList.add('active');
  }
});

window.addEventListener('hashchange', render);
window.addEventListener('keydown', event => { if (event.key === 'Escape') document.querySelector('.concept-modal')?.remove(); });
render();

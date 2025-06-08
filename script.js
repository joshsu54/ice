document.addEventListener('DOMContentLoaded', () => {
  const header        = document.querySelector('header');
  const toggleBtn     = document.getElementById('nav-toggle');
  const sections      = document.querySelectorAll('.section');
  const navLinks      = document.querySelectorAll('.nav-list li');
  const featureCards  = document.querySelectorAll('.feature-card');
  const settingsForm  = document.querySelector('.settings-form');
  const addBtn        = document.getElementById('btn-add');
  const addForm       = document.getElementById('add-form');
  const cancelBtn     = document.getElementById('add-cancel');
  const inventoryTbody= document.querySelector('#inventory .inventory-table tbody');

  // 切換顯示區段
  function showSection(id) {
    sections.forEach(sec => {
      sec.id === id
        ? sec.classList.add('active')
        : sec.classList.remove('active');
    });
  }

  // 更新首頁概覽 & 通知中心
  function updateOverview() {
    const rows    = Array.from(inventoryTbody.querySelectorAll('tr'));
    const total   = rows.length;
    const today   = new Date();
    let soonCount = 0;

    rows.forEach(r => {
      const exp  = new Date(r.cells[2].innerText);
      const diff = Math.ceil((exp - today) / (1000 * 3600 * 24));
      if (diff <= 3) soonCount++;
    });

    // 概覽文字
    document.querySelector('#home .overview-card:nth-child(1) p')
      .innerText = `目前共 ${total} 項食材，${soonCount} 項即將到期`;

    // 首頁提醒列表
    const list = document.querySelector('#home .overview-card:nth-child(2) ul');
    list.innerHTML = '';
    rows.forEach(r => {
      const name = r.cells[0].innerText;
      const exp  = new Date(r.cells[2].innerText);
      const diff = Math.ceil((exp - today) / (1000 * 3600 * 24));
      const text = diff > 0 ? `${name}：${diff} 天後過期` : `${name}：今日過期`;
      const li   = document.createElement('li');
      li.innerText = text;
      list.appendChild(li);
    });

    // 通知中心
    const notif = document.querySelector('#notifications .notifications-list');
    notif.innerHTML = '';
    rows.forEach(r => {
      const name = r.cells[0].innerText;
      const exp  = new Date(r.cells[2].innerText);
      const diff = Math.ceil((exp - today) / (1000 * 3600 * 24));
      const text = diff > 0
        ? `📢 ${name} ${diff} 天後過期`
        : `📢 ${name} 今日或已過期`;
      const li   = document.createElement('li');
      li.innerText = text;
      notif.appendChild(li);
    });
  }

  // ── 導覽列切換 ──────────────────────────
  navLinks.forEach(li => {
    const link = li.querySelector('a');
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      showSection(id);
      navLinks.forEach(i => i.classList.remove('active'));
      li.classList.add('active');
    });
  });

  // ── 功能卡片點擊 ──────────────────────────
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.target;
      if (!id) return;
      showSection(id);
      navLinks.forEach(li => {
        const h = li.querySelector('a').getAttribute('href').slice(1);
        li.classList.toggle('active', h === id);
      });
    });
  });

  // ── 新增食材按鈕 ──────────────────────────
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      showSection('add');
      navLinks.forEach(li => li.classList.remove('active'));
    });
  }

  // ── 新增食材表單提交 ───────────────────────
  if (addForm) {
    addForm.addEventListener('submit', e => {
      e.preventDefault();
      const name   = document.getElementById('item-name').value.trim();
      const qty    = document.getElementById('item-qty').value.trim();
      const expiry = document.getElementById('item-expiry').value;
      // 新增一行到表格
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${name}</td><td>${qty}</td><td>${expiry}</td>`;
      inventoryTbody.appendChild(tr);
      // 更新概覽
      updateOverview();
      // 切回庫存列表
      showSection('inventory');
      navLinks.forEach(li => {
        const h = li.querySelector('a').getAttribute('href').slice(1);
        li.classList.toggle('active', h === 'inventory');
      });
      addForm.reset();
    });
  }

  // ── 取消新增 ───────────────────────────────
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      showSection('home');
      navLinks.forEach(li => {
        const h = li.querySelector('a').getAttribute('href').slice(1);
        li.classList.toggle('active', h === 'home');
      });
    });
  }

  // ── 設定表單提示 ───────────────────────────
  if (settingsForm) {
    settingsForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('設定已儲存！');
    });
  }

  // ── 行動版：切換導航收合 ───────────────────
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      header.classList.toggle('collapsed');
    });
    if (window.innerWidth <= 600) {
      header.classList.add('collapsed');
    }
  }

  // 初始化
  showSection('home');
  updateOverview();
});

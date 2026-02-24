// ============================================================
// Innovative X — SuperAdmin Dashboard
// FILE: dashboard.js
// DESCRIPTION: All UI logic and interactions for the dashboard
// TEAM: Replace dummy data / alerts with real API fetch() calls
//       API endpoints are marked with: // Team: 
// ============================================================

// ============================================================
    // CLOCK — updates every second in the header
    // ============================================================
    function updateClock() {
      document.getElementById('headerClock').textContent = new Date().toLocaleTimeString('en-IN');
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ============================================================
    // SIDEBAR TOGGLE — mobile hamburger menu
    // ============================================================
    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebarOverlay').classList.toggle('show');
    }

    // ============================================================
    // NAVIGATION — expand/collapse sidebar menu items
    // ============================================================
    function toggleNav(navId) {
      const item = document.getElementById(navId);
      const wasOpen = item.classList.contains('open');
      // Close all nav items first
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      // Open clicked item if it was closed
      if (!wasOpen) {
        item.classList.add('open');
        item.querySelector('.nav-link').classList.add('active');
      }
    }

    // ============================================================
    // PANEL SWITCHER — shows the correct content panel
    // Team: add any data-fetch calls here when switching panels
    // ============================================================
    function showPanel(name) {
      // Hide all panels
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      // Remove active from all sub-links
      document.querySelectorAll('.sub-link').forEach(l => l.classList.remove('active'));
      // Show selected panel
      const panel = document.getElementById('panel-' + name);
      if (panel) panel.classList.add('active');
      // Highlight matching sub-link
      document.querySelectorAll('.sub-link').forEach(l => {
        if (l.getAttribute('onclick') && l.getAttribute('onclick').includes("'" + name + "'")) {
          l.classList.add('active');
        }
      });
      // API Logs panel is inside Configuration panel — no need to show/hide separately
      // Close sidebar on mobile after selection
      if (window.innerWidth <= 900) toggleSidebar();
    }

    // ============================================================
    // MODAL SYSTEM
    // ============================================================
    function openModal(id) { document.getElementById(id).classList.add('active'); }
    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    // Close modal on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    // ============================================================
    // CONTEXT MENU — Right-click on Market Watch rows
    // ============================================================
    let activeCtxRow = null;

    function showCtxMenu(e, row) {
      e.preventDefault();
      activeCtxRow = row;
      const menu = document.getElementById('ctxMenu');
      menu.style.left = e.pageX + 'px';
      menu.style.top  = e.pageY + 'px';
      menu.classList.add('show');
    }
    document.addEventListener('click', () => {
      document.getElementById('ctxMenu').classList.remove('show');
    });

    function ctxAdd()    { openModal('modal-add-script'); }
    function ctxEdit()   {
      if (!isRowChecked(activeCtxRow)) { alert('Please tick the checkbox on this row first.'); return; }
      prefillEditScript(activeCtxRow);
      openModal('modal-edit-script');
    }
    function ctxDelete() {
      if (!isRowChecked(activeCtxRow)) { alert('Please tick the checkbox on this row first.'); return; }
      confirmDeleteScript();
    }

    function isRowChecked(row) {
      return row && row.querySelector('.mw-check') && row.querySelector('.mw-check').checked;
    }

    // ============================================================
    // MARKET WATCH — Checkbox logic
    // ============================================================
    function mwCheckChange() {
      const checks  = document.querySelectorAll('.mw-check');
      const selected = [...checks].filter(c => c.checked);
      const count    = selected.length;

      document.getElementById('mwSelCount').textContent = count + ' selected';
      document.getElementById('editScriptBtn').disabled   = count !== 1;
      document.getElementById('deleteScriptBtn').disabled = count === 0;

      // Highlight selected rows
      checks.forEach(c => c.closest('tr').classList.toggle('selected', c.checked));

      // Pre-fill edit modal when exactly 1 row selected
      if (count === 1) prefillEditScript(selected[0].closest('tr'));
    }

    function mwToggleAll(masterCheckbox) {
      document.querySelectorAll('.mw-check').forEach(c => c.checked = masterCheckbox.checked);
      mwCheckChange();
    }

    function prefillEditScript(row) {
      if (!row) return;
      const cells = row.querySelectorAll('td');
      document.getElementById('edit-script-name').value       = cells[1] ? cells[1].textContent.trim() : '';
      document.getElementById('edit-script-instrument').value  = 'MCX:' + (cells[1] ? cells[1].textContent.trim() : '') + 'NOVFUT';
    }

    // ============================================================
    // DELETE SCRIPT — with confirmation modal
    // ============================================================
    function confirmDeleteScript() {
      const sel = document.querySelector('.mw-check:checked');
      if (!sel) { alert('Please select a script first.'); return; }
      const scriptName = sel.closest('tr').querySelectorAll('td')[1].textContent.trim();
      document.getElementById('deleteScriptLabel').textContent = scriptName;
      openModal('modal-delete-script');
    }

    function executeDeleteScript() {
      // Team: call DELETE /api/market-watch/scripts/:id here
      const sel = document.querySelector('.mw-check:checked');
      if (sel) sel.closest('tr').remove();
      closeModal('modal-delete-script');
      mwCheckChange();
    }

    // ============================================================
    // API STATUS TOGGLE LABELS
    // ============================================================
    function updateApiToggleLabel(checkbox) {
      const label = checkbox.closest('.toggle-wrap') && checkbox.closest('.toggle-wrap').querySelector('.toggle-label');
      if (label) label.textContent = checkbox.checked ? 'ON' : 'OFF';
      // Handle config card active label
      const activeLabel = checkbox.closest('.toggle-wrap') && checkbox.closest('.toggle-wrap').querySelector('.toggle-label');
      if (activeLabel && activeLabel.textContent !== 'ON' && activeLabel.textContent !== 'OFF') {
        activeLabel.textContent = checkbox.checked ? 'Active' : 'Inactive';
      }
    }

    // ============================================================
    // COIN DEALERS — Show/hide based on Coins toggle
    // ============================================================
    function toggleCoinDealers(formType, checkbox) {
      const sectionId = formType === 'add' ? 'add-coin-dealers' : 'edit-coin-dealers';
      document.getElementById(sectionId).style.display = checkbox.checked ? 'block' : 'none';
    }

    // ============================================================
    // SOCIAL MEDIA — Show/hide URL input + highlight card
    // ============================================================
    function toggleSocialUrl(checkbox, cardId) {
      const card     = document.getElementById(cardId);
      const urlInput = card.querySelector('.social-url-input');
      urlInput.style.display = checkbox.checked ? 'block' : 'none';
      card.classList.toggle('enabled', checkbox.checked);
    }

    // ============================================================
    // LIVE COLOR PREVIEW — Updates color swatch as hex is typed
    // ============================================================
    function liveColorPreview(inputId, previewId) {
      const hex     = document.getElementById(inputId).value;
      const preview = document.getElementById(previewId);
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) preview.style.background = hex;
    }

    // ============================================================
    // EDIT CLIENT — Load client data into form
    // Team: replace dummy data with GET /api/clients/:id response
    // ============================================================
    const DUMMY_CLIENTS = {
      '1': {
        company: 'Bullion Hub Pvt. Ltd.', email: 'info@bullionhub.com', mobile: '+91 98765 43210', domain: 'bullionhub.in', client_id: 'CLT001',
        bullion_gst: true, bullion_nogst: false, coins: false, header: true, mcx: true,
        dealer1: 'KUNDAN', dealer2: 'MMTC PAMP', dealer3: 'ELITE',
        bank: true, about: true, contact: true, booking: false,
        web_company: 'Bullion Hub', em1: 'info@bullionhub.com', em2: '', mob1: '+91 98765 43210', mob2: '',
        primary: '#0f8fff', secondary: '#aaee00',
        yt: false, fb: true, ig: true, li: false, gg: false,
        fb_url: 'https://facebook.com/bullionhub', ig_url: 'https://instagram.com/bullionhub'
      },
      '2': {
        company: 'Gold Mart Traders', email: 'contact@goldmart.in', mobile: '+91 87654 32109', domain: 'goldmart.in', client_id: 'CLT002',
        bullion_gst: true, bullion_nogst: true, coins: true, header: true, mcx: true,
        dealer1: 'KUNDAN', dealer2: 'MMTC PAMP', dealer3: 'ELITE',
        bank: true, about: true, contact: false, booking: true,
        web_company: 'Gold Mart', em1: 'contact@goldmart.in', em2: 'support@goldmart.in', mob1: '+91 87654 32109', mob2: '+91 76543 21098',
        primary: '#ff8c00', secondary: '#ffd700',
        yt: true, fb: true, ig: false, li: false, gg: true,
        yt_url: 'https://youtube.com/@goldmart', fb_url: 'https://facebook.com/goldmart', gg_url: 'https://g.page/goldmart'
      },
      '3': {
        company: 'Silver Palace Jewellers', email: 'hello@silverpalace.com', mobile: '+91 76543 21098', domain: 'silverpalace.in', client_id: 'CLT003',
        bullion_gst: false, bullion_nogst: true, coins: false, header: false, mcx: true,
        dealer1: 'KUNDAN', dealer2: 'MMTC PAMP', dealer3: 'ELITE',
        bank: true, about: false, contact: true, booking: false,
        web_company: 'Silver Palace', em1: 'hello@silverpalace.com', em2: '', mob1: '+91 76543 21098', mob2: '',
        primary: '#aaaaaa', secondary: '#cccccc',
        yt: false, fb: false, ig: true, li: true, gg: false,
        ig_url: 'https://instagram.com/silverpalace', li_url: 'https://linkedin.com/company/silverpalace'
      }
    };

    function loadClientData(clientId) {
      const formWrap = document.getElementById('editClientFormWrap');
      if (!clientId) { formWrap.style.display = 'none'; return; }

      const d = DUMMY_CLIENTS[clientId];
      if (!d) return;

      formWrap.style.display = 'block';

      // Basic Info
      document.getElementById('e-company').value   = d.company;
      document.getElementById('e-email').value     = d.email;
      document.getElementById('e-mobile').value    = d.mobile;
      document.getElementById('e-domain').value = d.domain;

      // Admin Features
      document.getElementById('e-bullion-gst').checked  = d.bullion_gst;
      document.getElementById('e-bullion-nogst').checked = d.bullion_nogst;
      document.getElementById('e-coins').checked         = d.coins;
      document.getElementById('e-header').checked        = d.header;
      document.getElementById('e-mcx').checked           = d.mcx;
      document.getElementById('edit-coin-dealers').style.display = d.coins ? 'block' : 'none';

      // Coin Dealers
      document.getElementById('e-dealer1').value = d.dealer1;
      document.getElementById('e-dealer2').value = d.dealer2;
      document.getElementById('e-dealer3').value = d.dealer3;

      // Frontend Pages
      document.getElementById('e-bank').checked    = d.bank;
      document.getElementById('e-about').checked   = d.about;
      document.getElementById('e-contact').checked = d.contact;
      document.getElementById('e-booking').checked = d.booking;

      // Website Contact Details
      document.getElementById('e-web-company').value = d.web_company;
      document.getElementById('e-em1').value  = d.em1;
      document.getElementById('e-em2').value  = d.em2;
      document.getElementById('e-mob1').value = d.mob1;
      document.getElementById('e-mob2').value = d.mob2;

      // Theme Colors — 5 fields
      // Team: map these to actual color fields from API response
      const colors = [
        { hex: 'edit-header-color-hex',   preview: 'edit-header-color-preview',   val: d.color_header   || '#0f8fff' },
        { hex: 'edit-footer-color-hex',   preview: 'edit-footer-color-preview',   val: d.color_footer   || '#080f16' },
        { hex: 'edit-bg-color-hex',       preview: 'edit-bg-color-preview',       val: d.color_bg       || '#ffffff' },
        { hex: 'edit-heading-color-hex',  preview: 'edit-heading-color-preview',  val: d.color_heading  || '#aaee00' },
        { hex: 'edit-btn-color-hex',      preview: 'edit-btn-color-preview',      val: d.color_btn      || '#1a6bff' },
      ];
      colors.forEach(c => {
        document.getElementById(c.hex).value = c.val;
        document.getElementById(c.preview).style.background = c.val;
      });

      // Social Media
      const socials = [
        { toggle: 'e-yt-on', url: 'e-yt-url', card: 'social-edit-yt', on: d.yt, val: d.yt_url || '' },
        { toggle: 'e-fb-on', url: 'e-fb-url', card: 'social-edit-fb', on: d.fb, val: d.fb_url || '' },
        { toggle: 'e-ig-on', url: 'e-ig-url', card: 'social-edit-ig', on: d.ig, val: d.ig_url || '' },
        { toggle: 'e-li-on', url: 'e-li-url', card: 'social-edit-li', on: d.li, val: d.li_url || '' },
        { toggle: 'e-gg-on', url: 'e-gg-url', card: 'social-edit-gg', on: d.gg, val: d.gg_url || '' },
      ];
      socials.forEach(s => {
        document.getElementById(s.toggle).checked = s.on;
        const urlEl = document.getElementById(s.url);
        urlEl.value = s.val;
        urlEl.style.display = s.on ? 'block' : 'none';
        document.getElementById(s.card).classList.toggle('enabled', s.on);
      });
    }

    // ============================================================
    // DELETE CLIENT OTP — timer + verify
    // Team: connect to POST /api/clients/:id/send-delete-otp
    // Team: connect to DELETE /api/clients/:id with OTP
    // ============================================================
    let deleteOtpTimerInterval;

    document.getElementById('modal-delete-otp').addEventListener('click', function(e) {
      if (e.target === this) return;
    });

    // Start resend timer when modal opens
    document.getElementById('modal-delete-otp').addEventListener('transitionend', function() {
      if (this.classList.contains('active')) startDeleteOtpTimer();
    });

    function startDeleteOtpTimer() {
      let secs = 30;
      const el  = document.getElementById('delete-otp-timer');
      const btn = document.getElementById('deleteOtpResendBtn');
      btn.disabled = true;
      clearInterval(deleteOtpTimerInterval);
      deleteOtpTimerInterval = setInterval(() => {
        secs--;
        el.textContent = secs + 's';
        if (secs <= 0) { clearInterval(deleteOtpTimerInterval); btn.disabled = false; }
      }, 1000);
    }

    function resendDeleteOtp() {
      // Team: POST /api/clients/:id/send-delete-otp
      document.querySelectorAll('#modal-delete-otp .otp-box').forEach(b => b.value = '');
      document.querySelectorAll('#modal-delete-otp .otp-box')[0].focus();
      startDeleteOtpTimer();
    }

    function verifyDeleteOtp() {
      const otp = [...document.querySelectorAll('#modal-delete-otp .otp-box')].map(b => b.value).join('');
      if (otp.length < 6) { alert('Please enter the full 6-digit OTP.'); return; }
      // Team: DELETE /api/clients/:id with body { otp } — on success remove client from list
      alert('✅ Client deleted successfully.');
      closeModal('modal-delete-otp');
      showPanel('welcome');
      document.getElementById('editClientSelect').value = '';
      document.getElementById('editClientFormWrap').style.display = 'none';
    }

    // OTP box auto-jump (shared logic for delete OTP)
    document.querySelectorAll('#modal-delete-otp .otp-box').forEach((box, idx, boxes) => {
      box.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        if (e.target.value && idx < boxes.length - 1) boxes[idx + 1].focus();
      });
      box.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) boxes[idx - 1].focus();
      });
    });

    // ============================================================
    // SIDEBAR — setNavActive for single-click nav items (no sub-menu)
    // ============================================================
    function setNavActive(navId) {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.sub-link').forEach(l => l.classList.remove('active'));
      const item = document.getElementById(navId);
      if (item) item.querySelector('.nav-link').classList.add('active');
      if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('show');
      }
    }

    // ============================================================
    // FRONTEND SETTINGS — Client & Section selectors
    // ============================================================
    function fsOnClientChange() {
      const clientVal = document.getElementById('fs-client-select').value;
      const sectionSel = document.getElementById('fs-section-select');
      sectionSel.disabled = !clientVal;
      sectionSel.value = '';
      document.getElementById('fs-form-area').innerHTML = '';
    }

    function fsLoadSection() {
      const section  = document.getElementById('fs-section-select').value;
      const clientId = document.getElementById('fs-client-select').value;
      const area     = document.getElementById('fs-form-area');
      if (!section || !clientId) { area.innerHTML = ''; return; }
      // Team: fetch saved data from GET /api/frontend/:clientId/:section
      // then pass it into the build function below
      const builders = {
        'about-us':      buildAboutUsForm,
        'contact-us':    buildContactUsForm,
        'privacy-terms': buildPrivacyTermsForm,
      };
      if (builders[section]) area.innerHTML = builders[section]();
      bindImageUploads();
    }

    // ============================================================
    // IMAGE UPLOAD — show filename on selection
    // ============================================================
    function bindImageUploads() {
      document.querySelectorAll('.img-upload-area input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
          const nameEl = this.closest('.img-upload-area').querySelector('.img-upload-name');
          nameEl.textContent = this.files[0] ? this.files[0].name : '';
        });
      });
    }

    // ============================================================
    // BULLET POINTS — Dynamic add/remove
    // ============================================================
    function addBullet(listId) {
      const list = document.getElementById(listId);
      const row  = document.createElement('div');
      row.className = 'bullet-row';
      row.innerHTML = `<input class="form-input" type="text" placeholder="Enter point..."/>
                       <button class="btn-remove-bullet" onclick="this.closest('.bullet-row').remove()">✕</button>`;
      list.appendChild(row);
      row.querySelector('input').focus();
    }

    // ============================================================
    // BANK SLOT TOGGLE — disable/enable bank form
    // ============================================================
    function toggleBankSlot(checkbox, slotId) {
      const slot = document.getElementById(slotId);
      slot.classList.toggle('disabled', !checkbox.checked);
    }

    // ============================================================
    // CONTACT US — Info section toggle
    // ============================================================
    function toggleInfoSection(checkbox, bodyId) {
      document.getElementById(bodyId).style.display = checkbox.checked ? 'block' : 'none';
    }

    // ============================================================
    // ADDRESS SLOT TOGGLE
    // ============================================================
    function toggleAddressSlot(checkbox, bodyId) {
      document.getElementById(bodyId).style.display = checkbox.checked ? 'block' : 'none';
    }

    // ============================================================
    // FORM BUILDER — ABOUT US
    // Team: pre-fill values from GET /api/frontend/:clientId/about-us
    // ============================================================
    function buildAboutUsForm() {
      return `
      <div class="scrollable-content">

        <!-- Page Title -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Page Title</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Page Heading *</label>
              <input class="form-input" type="text" name="about_page_title" placeholder="e.g. About Bullion Hub"/>
            </div>
          </div>
        </div>

        <!-- Our Story -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Our Story Section</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Section Heading *</label>
              <input class="form-input" type="text" name="story_heading" value="Our Story" placeholder="Section heading"/>
            </div>
            <div class="form-group">
              <label class="form-label">Story Content *</label>
              <textarea class="form-input" name="story_content" rows="5" placeholder="Write your company story here..." style="resize:vertical;"></textarea>
            </div>
          </div>
        </div>

        <!-- Our Commitment -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Our Commitment Section</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Section Heading *</label>
              <input class="form-input" type="text" name="commitment_heading" value="Our Commitment" placeholder="Section heading"/>
            </div>
            <div class="form-group">
              <label class="form-label">Bullet Points *</label>
              <div class="bullet-list" id="commitment-list">
                <div class="bullet-row">
                  <input class="form-input" type="text" name="commitment_point[]" placeholder="Enter point..."/>
                  <button class="btn-remove-bullet" onclick="this.closest('.bullet-row').remove()">✕</button>
                </div>
                <div class="bullet-row">
                  <input class="form-input" type="text" name="commitment_point[]" placeholder="Enter point..."/>
                  <button class="btn-remove-bullet" onclick="this.closest('.bullet-row').remove()">✕</button>
                </div>
              </div>
              <button class="btn-add-bullet" onclick="addBullet('commitment-list')">+ Add Point</button>
            </div>
          </div>
        </div>

        <!-- Our Products -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Our Products Section</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Section Heading *</label>
              <input class="form-input" type="text" name="products_heading" value="Our Products" placeholder="Section heading"/>
            </div>
            <div class="form-group">
              <label class="form-label">Bullet Points *</label>
              <div class="bullet-list" id="products-list">
                <div class="bullet-row">
                  <input class="form-input" type="text" name="product_point[]" placeholder="Enter point..."/>
                  <button class="btn-remove-bullet" onclick="this.closest('.bullet-row').remove()">✕</button>
                </div>
                <div class="bullet-row">
                  <input class="form-input" type="text" name="product_point[]" placeholder="Enter point..."/>
                  <button class="btn-remove-bullet" onclick="this.closest('.bullet-row').remove()">✕</button>
                </div>
              </div>
              <button class="btn-add-bullet" onclick="addBullet('products-list')">+ Add Point</button>
            </div>
          </div>
        </div>

        <!-- Certification Details -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Certification Details Section</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Section Heading *</label>
              <input class="form-input" type="text" name="cert_section_heading" value="CERTIFICATION DETAILS" placeholder="Section heading"/>
            </div>
            <div class="cert-grid">

              <!-- Certi 1 -->
              <div class="cert-card">
                <div class="cert-card-header">📜 Certificate 1</div>
                <div class="cert-card-body">
                  <div class="form-group">
                    <label class="form-label">Heading</label>
                    <input class="form-input" type="text" name="cert1_heading" placeholder="e.g. BIS Hallmark"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certificate Image</label>
                    <div class="img-upload-area">
                      <input type="file" accept="image/*" name="cert1_image"/>
                      <div class="img-upload-icon">🖼️</div>
                      <div class="img-upload-label">CLICK TO UPLOAD · cert1.png</div>
                      <div class="img-upload-name"></div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certificate Details</label>
                    <textarea class="form-input" name="cert1_details" rows="3" placeholder="e.g. XXX00XX000" style="resize:vertical;"></textarea>
                  </div>
                </div>
              </div>

              <!-- Certi 2 -->
              <div class="cert-card">
                <div class="cert-card-header">📜 Certificate 2</div>
                <div class="cert-card-body">
                  <div class="form-group">
                    <label class="form-label">Heading</label>
                    <input class="form-input" type="text" name="cert2_heading" placeholder="e.g. Trade Mark"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certificate Image</label>
                    <div class="img-upload-area">
                      <input type="file" accept="image/*" name="cert2_image"/>
                      <div class="img-upload-icon">🖼️</div>
                      <div class="img-upload-label">CLICK TO UPLOAD · cert2.png</div>
                      <div class="img-upload-name"></div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certificate Details</label>
                    <textarea class="form-input" name="cert2_details" rows="3" placeholder="e.g. Trade Mark Number: XXX00XX000" style="resize:vertical;"></textarea>
                  </div>
                </div>
              </div>

              <!-- Certi 3 -->
              <div class="cert-card">
                <div class="cert-card-header">📜 Certificate 3</div>
                <div class="cert-card-body">
                  <div class="form-group">
                    <label class="form-label">Heading</label>
                    <input class="form-input" type="text" name="cert3_heading" placeholder="e.g. IBJA Membership"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certificate Image</label>
                    <div class="img-upload-area">
                      <input type="file" accept="image/*" name="cert3_image"/>
                      <div class="img-upload-icon">🖼️</div>
                      <div class="img-upload-label">CLICK TO UPLOAD · cert3.png</div>
                      <div class="img-upload-name"></div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Certificate Details</label>
                    <textarea class="form-input" name="cert3_details" rows="3" placeholder="e.g. IBJA Membership: XXX00XX000" style="resize:vertical;"></textarea>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="form-actions">
          <button class="btn btn-outline" onclick="fsReset()">Cancel</button>
          <!-- Team: PUT /api/frontend/:clientId/about-us with form data -->
          <button class="btn btn-success">✓ Save About Us</button>
        </div>

      </div>`;
    }

    // ============================================================
    // FORM BUILDER — CONTACT US
    // Team: pre-fill from GET /api/frontend/:clientId/contact-us
    // ============================================================
    function buildContactUsForm() {
      return `
      <div class="scrollable-content">

        <!-- Page Description -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Page Description</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Description Text *</label>
              <textarea class="form-input" name="contact_description" rows="3" placeholder="e.g. Need assistance? Reach out to us for any inquiries..." style="resize:vertical;"></textarea>
            </div>
          </div>
        </div>

        <!-- Info Sections — Toggle On/Off -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Info Sections</div></div>
          <div class="form-section-body">

            <!-- Section 1: Customer Support -->
            <div class="toggle-section-bar">
              <span class="toggle-section-label">Customer Support</span>
              <div class="toggle-wrap">
                <label class="toggle"><input type="checkbox" checked onchange="toggleInfoSection(this, 'info-body-1')"/><span class="toggle-slider"></span></label>
                <span class="toggle-label">ON</span>
              </div>
            </div>
            <div id="info-body-1" style="margin-bottom:16px;">
              <div class="form-group">
                <label class="form-label">Section Heading</label>
                <input class="form-input" type="text" name="info1_heading" value="Customer Support" placeholder="Section heading"/>
              </div>
              <div class="form-group">
                <label class="form-label">Section Content</label>
                <textarea class="form-input" name="info1_content" rows="4" placeholder="Write customer support content..." style="resize:vertical;"></textarea>
              </div>
            </div>

            <!-- Section 2: Feedback & Suggestions -->
            <div class="toggle-section-bar">
              <span class="toggle-section-label">Feedback & Suggestions</span>
              <div class="toggle-wrap">
                <label class="toggle"><input type="checkbox" checked onchange="toggleInfoSection(this, 'info-body-2')"/><span class="toggle-slider"></span></label>
                <span class="toggle-label">ON</span>
              </div>
            </div>
            <div id="info-body-2" style="margin-bottom:16px;">
              <div class="form-group">
                <label class="form-label">Section Heading</label>
                <input class="form-input" type="text" name="info2_heading" value="Feedback and Suggestions" placeholder="Section heading"/>
              </div>
              <div class="form-group">
                <label class="form-label">Section Content</label>
                <textarea class="form-input" name="info2_content" rows="4" placeholder="Write feedback section content..." style="resize:vertical;"></textarea>
              </div>
            </div>

            <!-- Section 3: Media Inquiries -->
            <div class="toggle-section-bar">
              <span class="toggle-section-label">Media Inquiries</span>
              <div class="toggle-wrap">
                <label class="toggle"><input type="checkbox" checked onchange="toggleInfoSection(this, 'info-body-3')"/><span class="toggle-slider"></span></label>
                <span class="toggle-label">ON</span>
              </div>
            </div>
            <div id="info-body-3">
              <div class="form-group">
                <label class="form-label">Section Heading</label>
                <input class="form-input" type="text" name="info3_heading" value="Media Inquiries" placeholder="Section heading"/>
              </div>
              <div class="form-group">
                <label class="form-label">Section Content</label>
                <textarea class="form-input" name="info3_content" rows="4" placeholder="Write media inquiries content..." style="resize:vertical;"></textarea>
              </div>
            </div>

          </div>
        </div>

        <!-- Address / Location Slots -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Location & Map</div></div>
          <div class="form-section-body">

            <!-- Google Maps Embed -->
            <div class="form-group">
              <label class="form-label">Google Maps Embed URL *</label>
              <input class="form-input" type="url" name="map_embed_url" placeholder="https://www.google.com/maps/embed?pb=..."/>
              <div style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); margin-top:6px; letter-spacing:0.05em;">
                💡 Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code
              </div>
            </div>

            <div class="section-divider"></div>

            <!-- Address Slot 1 -->
            <div class="toggle-section-bar">
              <span class="toggle-section-label">Address Slot 1</span>
              <div class="toggle-wrap">
                <label class="toggle"><input type="checkbox" checked onchange="toggleAddressSlot(this, 'addr-body-1')"/><span class="toggle-slider"></span></label>
                <span class="toggle-label">ON</span>
              </div>
            </div>
            <div id="addr-body-1" style="margin-bottom:16px;">
              <div class="form-group">
                <label class="form-label">Address Label / Heading</label>
                <input class="form-input" type="text" name="addr1_heading" value="Head Office" placeholder="e.g. Head Office, Warehouse..."/>
              </div>
              <div class="form-group">
                <label class="form-label">Full Address</label>
                <textarea class="form-input" name="addr1_address" rows="3" placeholder="Street, City, State, PIN..." style="resize:vertical;"></textarea>
              </div>
            </div>

            <!-- Address Slot 2 -->
            <div class="toggle-section-bar">
              <span class="toggle-section-label">Address Slot 2</span>
              <div class="toggle-wrap">
                <label class="toggle"><input type="checkbox" onchange="toggleAddressSlot(this, 'addr-body-2')"/><span class="toggle-slider"></span></label>
                <span class="toggle-label">OFF</span>
              </div>
            </div>
            <div id="addr-body-2" style="display:none;">
              <div class="form-group">
                <label class="form-label">Address Label / Heading</label>
                <input class="form-input" type="text" name="addr2_heading" value="Branch Office" placeholder="e.g. Branch Office, Showroom..."/>
              </div>
              <div class="form-group">
                <label class="form-label">Full Address</label>
                <textarea class="form-input" name="addr2_address" rows="3" placeholder="Street, City, State, PIN..." style="resize:vertical;"></textarea>
              </div>
            </div>

          </div>
        </div>

        <!-- Form Buttons -->
        <div class="form-actions">
          <button class="btn btn-outline" onclick="fsReset()">Cancel</button>
          <!-- Team: PUT /api/frontend/:clientId/contact-us -->
          <button class="btn btn-success">✓ Save Contact Us</button>
        </div>

      </div>`;
    }

    // ============================================================
    // FORM BUILDER — PRIVACY POLICY & TERMS OF SERVICE
    // Team: pre-fill from GET /api/frontend/:clientId/privacy-terms
    // ============================================================
    function buildPrivacyTermsForm() {
      return `
      <div class="scrollable-content">

        <!-- Privacy Policy -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Privacy Policy</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Page Heading *</label>
              <input class="form-input" type="text" name="privacy_heading" value="Privacy Policy" placeholder="Page heading"/>
            </div>
            <div class="form-group">
              <label class="form-label">Content *</label>
              <textarea class="form-input" name="privacy_content" rows="10"
                placeholder="At [Company Name], we value your privacy and are committed to protecting your personal information..."
                style="resize:vertical; line-height:1.7;"></textarea>
              <div style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); margin-top:6px; letter-spacing:0.05em;">
                💡 Plain text only — use new lines to separate paragraphs
              </div>
            </div>
          </div>
        </div>

        <!-- Terms of Service -->
        <div class="form-section">
          <div class="form-section-header"><div class="form-section-title">Terms of Service</div></div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label">Page Heading *</label>
              <input class="form-input" type="text" name="terms_heading" value="Terms of Service" placeholder="Page heading"/>
            </div>
            <div class="form-group">
              <label class="form-label">Content *</label>
              <textarea class="form-input" name="terms_content" rows="10"
                placeholder="Welcome to [Company Name]. By using our website and services, you agree to comply with our terms and conditions..."
                style="resize:vertical; line-height:1.7;"></textarea>
              <div style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); margin-top:6px; letter-spacing:0.05em;">
                💡 Plain text only — use new lines to separate paragraphs
              </div>
            </div>
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="form-actions">
          <button class="btn btn-outline" onclick="fsReset()">Cancel</button>
          <!-- Team: PUT /api/frontend/:clientId/privacy-terms -->
          <button class="btn btn-success">✓ Save Privacy & Terms</button>
        </div>

      </div>`;
    }

    // ============================================================
    // FRONTEND SETTINGS — Reset (cancel)
    // ============================================================
    function fsReset() {
      document.getElementById('fs-client-select').value  = '';
      document.getElementById('fs-section-select').value = '';
      document.getElementById('fs-section-select').disabled = true;
      document.getElementById('fs-form-area').innerHTML  = '';
    }

    // ============================================================
    // INACTIVE CLIENTS — Reactivate client
    // Team: POST /api/clients/:id/reactivate on click
    // ============================================================
    function reactivateClient(btn) {
      const row         = btn.closest('tr');
      const clientName  = row.querySelectorAll('td')[0].textContent.trim();
      if (!confirm('Reactivate client: ' + clientName + '?\nTheir website will come back online immediately.')) return;
      // Team: POST /api/clients/:id/reactivate — on success remove row from inactive table
      row.remove();
    }

    // ============================================================
    // META SETTINGS — Load client meta data
    // Team: replace dummy data with GET /api/meta/:clientId
    // ============================================================
    const DUMMY_META = {
      '1': {
        home_title:    'Bullion Hub — Live Gold & Silver Rates',
        home_desc:     'Get real-time gold and silver rates from Bullion Hub. Trusted bullion dealer in Ludhiana.',
        about_title:   'About Us — Bullion Hub',
        about_desc:    'Learn about Bullion Hub, our story, commitment to quality and certified precious metals.',
        contact_title: 'Contact Us — Bullion Hub',
        contact_desc:  'Get in touch with Bullion Hub for any inquiries about gold, silver and investment options.',
        bank_title:    'Bank Details — Bullion Hub',
        bank_desc:     'Verified bank details for secure transactions with Bullion Hub.',
        booking_title: 'Booking Desk — Bullion Hub',
        booking_desc:  'Book your order with Bullion Hub easily through our booking desk.',
      },
      '2': {
        home_title:    'Gold Mart — Live Bullion Rates',
        home_desc:     'Gold Mart provides live gold and silver rates with trusted and verified quality.',
        about_title:   'About Us — Gold Mart',
        about_desc:    'Discover the story behind Gold Mart and our commitment to premium bullion products.',
        contact_title: 'Contact Us — Gold Mart',
        contact_desc:  'Reach out to Gold Mart for all your precious metals and investment queries.',
        bank_title:    'Bank Details — Gold Mart',
        bank_desc:     'Secure and verified bank details for Gold Mart transactions.',
        booking_title: 'Booking Desk — Gold Mart',
        booking_desc:  'Place your bullion order easily through Gold Mart booking desk.',
      },
      '3': {
        home_title:    'Silver Palace — Live Silver & Gold Rates',
        home_desc:     'Silver Palace offers premium silver and gold bullion with live market rates.',
        about_title:   'About Us — Silver Palace',
        about_desc:    'Know more about Silver Palace Jewellers and our certified precious metals.',
        contact_title: 'Contact Us — Silver Palace',
        contact_desc:  'Contact Silver Palace for all enquiries related to silver and gold products.',
        bank_title:    'Bank Details — Silver Palace',
        bank_desc:     'Verified bank account details for Silver Palace payments.',
        booking_title: 'Booking Desk — Silver Palace',
        booking_desc:  'Book your silver and gold orders with Silver Palace easily.',
      }
    };

    function loadMetaSettings(clientId) {
      const wrap = document.getElementById('meta-form-wrap');
      if (!clientId) { wrap.style.display = 'none'; return; }
      wrap.style.display = 'block';

      const d = DUMMY_META[clientId];
      if (!d) return;

      // Team: replace below with actual API response fields
      document.querySelector('[name="home_meta_title"]').value    = d.home_title;
      document.querySelector('[name="home_meta_desc"]').value     = d.home_desc;
      document.querySelector('[name="about_meta_title"]').value   = d.about_title;
      document.querySelector('[name="about_meta_desc"]').value    = d.about_desc;
      document.querySelector('[name="contact_meta_title"]').value = d.contact_title;
      document.querySelector('[name="contact_meta_desc"]').value  = d.contact_desc;
      document.querySelector('[name="bank_meta_title"]').value    = d.bank_title;
      document.querySelector('[name="bank_meta_desc"]').value     = d.bank_desc;
      document.querySelector('[name="booking_meta_title"]').value = d.booking_title;
      document.querySelector('[name="booking_meta_desc"]').value  = d.booking_desc;
    }

    function resetMetaSettings() {
      document.getElementById('meta-client-select').value = '';
      document.getElementById('meta-form-wrap').style.display = 'none';
    }

    // ============================================================
    // EDIT CLIENT — Update loadClientData for new theme color fields
    // (removed client_id, added 5 color fields)
    // ============================================================

    // ============================================================
    // RECAPTCHA SETTINGS — Load + Reset
    // Team: GET /api/recaptcha/:clientId to load keys
    // ============================================================
    function loadRecaptchaSettings(clientId) {
      const wrap = document.getElementById('recaptcha-form-wrap');
      if (!clientId) { wrap.style.display = 'none'; return; }
      wrap.style.display = 'block';
      // Team: replace with real API call GET /api/recaptcha/:clientId
      document.getElementById('recaptcha-site-id').value   = '';
      document.getElementById('recaptcha-secret-key').value = '';
    }

    function resetRecaptchaSettings() {
      document.getElementById('recaptcha-client-select').value = '';
      document.getElementById('recaptcha-form-wrap').style.display = 'none';
    }

    // ============================================================
    // SMTP — Send test email
    // Team: POST /api/smtp/test with { to: email }
    // ============================================================
    function sendSmtpTest() {
      const email  = document.getElementById('smtp-test-email').value.trim();
      const result = document.getElementById('smtp-test-result');
      if (!email) { alert('Please enter a test email address.'); return; }
      result.style.display = 'block';
      result.className     = 'smtp-result-ok';
      result.textContent   = '✓ Test email sent to ' + email + ' — check your inbox!';
      // Team: POST /api/smtp/test { to: email } — update result box based on API response
    }

    // ============================================================
    // API LOGS — Floating terminal
    // Team: call addLog() when connect/disconnect API calls happen
    // ============================================================
    let logsEnabled  = true;
    let logsMinimized = false;
    let logCount     = 0;

    function toggleLogsEnabled(checkbox) {
      logsEnabled = checkbox.checked;
      document.getElementById('logsToggleLabel').textContent = logsEnabled ? 'ON' : 'OFF';
      const dot = document.querySelector('.logs-dot');
      if (logsEnabled) {
        dot.classList.remove('logs-dot-grey');
        dot.classList.add('logs-dot-green');
      } else {
        dot.classList.remove('logs-dot-green');
        dot.classList.add('logs-dot-grey');
      }
      if (logsEnabled) addLog('INFO', 'Logging enabled');
    }

    function clearLogs() {
      document.getElementById('logsContent').innerHTML = '';
      logCount = 0;
      updateLogsCount();
      addLog('INFO', 'Logs cleared');
    }

    function updateLogsCount() {
      document.getElementById('logsCount').textContent = logCount + (logCount === 1 ? ' entry' : ' entries');
    }

    // addLog(type, message) — type: 'SUCCESS' | 'ERROR' | 'WARN' | 'INFO'
    // Team: call this after every connect/disconnect API response
    // Example: addLog('SUCCESS', 'Client A — UPSTOX connected successfully')
    //          addLog('ERROR',   'Client B — GDF connection failed: timeout')
    function addLog(type, message) {
      if (!logsEnabled) return;
      logCount++;
      updateLogsCount();

      const now     = new Date().toLocaleTimeString('en-IN');
      const typeMap = {
        SUCCESS: { cls: 'log-success', badge: 'log-badge-success' },
        ERROR:   { cls: 'log-error',   badge: 'log-badge-error' },
        WARN:    { cls: 'log-warn',    badge: 'log-badge-warn' },
        INFO:    { cls: 'log-info',    badge: 'log-badge-info' },
      };
      const t = typeMap[type] || typeMap['INFO'];

      const entry = document.createElement('div');
      entry.className = 'log-entry ' + t.cls;
      entry.innerHTML = `
        <span class="log-time">${now}</span>
        <span class="log-badge ${t.badge}">${type}</span>
        <span class="log-msg">${message}</span>
      `;

      const content = document.getElementById('logsContent');
      content.prepend(entry); // newest on top

      // Auto-expand logs if minimized and new entry arrives
      if (logsMinimized && type !== 'INFO') toggleLogs();
    }

    // Demo log entries on load — Team: remove these in production
    window.addEventListener('load', () => {
      setTimeout(() => addLog('SUCCESS', 'UPSTOX — Market Watch connected successfully'), 800);
      setTimeout(() => addLog('INFO',    'GDF — Waiting for connection...'), 1400);
      setTimeout(() => addLog('WARN',    'SAMCO — Reconnect attempt 1/3'), 2000);
      setTimeout(() => addLog('ERROR',   'SAMCO — Connection failed: authentication error'), 2600);
    });

// ============================================================
// Innovative X — SuperAdmin Login
// FILE: index.js
// DESCRIPTION: OTP logic and login flow
// TEAM: Replace OTP verification with real API call
//       POST /api/auth/login  →  then POST /api/auth/verify-otp
// ============================================================

function togglePass() {
      const p = document.getElementById('password');
      const b = document.getElementById('passToggle');
      p.type = p.type === 'password' ? 'text' : 'password';
      b.textContent = p.type === 'password' ? '👁' : '🙈';
    }

    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      openModal();
    });

    function openModal() {
      document.getElementById('otpModal').classList.add('active');
      startResendTimer(); startExpireTimer();
      setTimeout(() => document.querySelectorAll('.otp-input')[0].focus(), 350);
    }

    function closeModal() {
      document.getElementById('otpModal').classList.remove('active');
    }

    // OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((inp, idx) => {
      inp.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/[^0-9]/g,'');
        if (e.target.value) {
          e.target.classList.add('filled');
          if (idx < otpInputs.length - 1) otpInputs[idx+1].focus();
        } else {
          e.target.classList.remove('filled');
        }
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
          otpInputs[idx-1].focus();
          otpInputs[idx-1].classList.remove('filled');
        }
      });
      inp.addEventListener('paste', e => {
        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g,'');
        otpInputs.forEach((i, n) => { i.value = pasted[n]||''; i.classList.toggle('filled', !!pasted[n]); });
        otpInputs[Math.min(pasted.length, otpInputs.length-1)].focus();
        e.preventDefault();
      });
    });

    let ri, ei;
    function startResendTimer() {
      let s = 30;
      const el = document.getElementById('resendTimer');
      const btn = document.getElementById('resendBtn');
      btn.disabled = true; clearInterval(ri);
      ri = setInterval(() => { s--; el.textContent = s+'s'; if(s<=0){clearInterval(ri);btn.disabled=false;} }, 1000);
    }

    function startExpireTimer() {
      let t = 600;
      const el = document.getElementById('expireTimer');
      clearInterval(ei);
      ei = setInterval(() => {
        t--;
        el.textContent = String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
        if(t<=0){clearInterval(ei);el.textContent='EXPIRED';}
      }, 1000);
    }

    function resendOTP() {
      otpInputs.forEach(i => { i.value=''; i.classList.remove('filled'); });
      otpInputs[0].focus();
      startResendTimer(); startExpireTimer();
    }

    function verifyOTP() {
      const otp = [...otpInputs].map(i=>i.value).join('');
      if(otp.length < 6){ alert('Please enter all 6 digits.'); return; }
      window.location.href = 'dashboard.html';
    }

    document.getElementById('otpModal').addEventListener('click', e => {
      if(e.target === document.getElementById('otpModal')) closeModal();
    });
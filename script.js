// ==========================================
// 4. RSVP Handling and API Submission (بدون الرسمة)
// ==========================================
(function() {
  // تفعيل الـ Reveal للأقسام مع دعم الـ Delay التتابعي
  var revealElements = document.querySelectorAll('.reveal-section');
  if (revealElements.length) {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function(el) { el.classList.add('in-view'); });
    } else {
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = el.getAttribute('data-delay') || 0;
            setTimeout(function() {
              el.classList.add('in-view');
            }, delay);
            revealObserver.unobserve(el);
          }
        });
      }, { threshold: 0.15 });

      revealElements.forEach(function(el) { revealObserver.observe(el); });
    }
  }

  // منطق وإدارة عناصر الفورم
  var form = document.getElementById('weddingRsvpForm');
  if (!form) return;

  var btnComing = document.getElementById('btnComing');
  var btnSending = document.getElementById('btnSending');
  var inputAttendance = document.getElementById('rsvpAttendance');
  var inputName = document.getElementById('rsvpName');
  var btnSubmit = document.getElementById('btnRsvpSubmit');
  var msgSuccess = document.getElementById('rsvpSuccessMsg');

  function selectPill(type) {
    if (type === 'coming') {
      btnComing.classList.add('selected', 'coming');
      btnSending.classList.remove('selected', 'sending');
      inputAttendance.value = 'coming';
    } else {
      btnSending.classList.add('selected', 'sending');
      btnComing.classList.remove('selected', 'coming');
      inputAttendance.value = 'sending';
    }
    checkValidation();
  }

  if(btnComing) btnComing.addEventListener('click', function() { selectPill('coming'); });
  if(btnSending) btnSending.addEventListener('click', function() { selectPill('sending'); });

  function checkValidation() {
    var isNameFilled = inputName.value.trim().length > 0;
    var isAttendanceSelected = inputAttendance.value !== "";
    btnSubmit.disabled = !(isNameFilled && isAttendanceSelected);
  }
  if(inputName) inputName.addEventListener('input', checkValidation);

  // إرسال الفورم لـ Web3Forms عبر الـ API مباشرة
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Sending...";

    var formData = new FormData(form);
    var object = Object.fromEntries(formData);
    var json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async function(response) {
        var res = await response.json();
        if (response.status == 200) {
            btnSubmit.style.display = 'none';
            msgSuccess.style.display = 'block';
        } else {
            console.log(res);
            alert("Something went wrong. Please try again!");
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Confirm With Love";
        }
    })
    .catch(function(error) {
        console.log(error);
        alert("Network error. Please check your connection.");
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Confirm With Love";
    });
  });
})();
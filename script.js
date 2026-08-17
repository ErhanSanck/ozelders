// 1. Firebase Konfigürasyonu
const firebaseConfig = {
  apiKey: "AIz*****2c",
  authDomain: "isimsehir-df058.firebaseapp.com",
  databaseURL: "https://isimsehir-df058-default-rtdb.firebaseio.com",
  projectId: "isimsehir-df058",
  storageBucket: "isimsehir-df058.firebasestorage.app",
  messagingSenderId: "186618648111",
  appId: "1:186618648111:web:3e256d5b146f5b7fa1d8da",
  measurementId: "G-N4RPKGCH5S"
};

// Firebase Uygulamasını Başlat
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

document.addEventListener('DOMContentLoaded', () => {
  // --- A. İnteraktif Görsel Galeri (Bento Grid & Lightbox) Mantığı ---
  const bentoItems = document.querySelectorAll('.bento-item');
  const galleryModal = document.getElementById('gallery-modal');
  const galleryModalImg = document.getElementById('gallery-modal-img');
  const galleryModalTitle = document.getElementById('gallery-modal-title');
  const closeGalleryBtn = document.getElementById('close-gallery-btn');
  const closeGalleryBackdrop = document.getElementById('close-gallery-backdrop');

  if (bentoItems.length > 0 && galleryModal) {
    bentoItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        const title = item.getAttribute('data-title');
        
        if (galleryModalImg && galleryModalTitle) {
          galleryModalImg.src = imgSrc;
          galleryModalTitle.textContent = title;
          galleryModal.classList.remove('hidden');
        }
      });
    });

    const closeLightbox = () => galleryModal.classList.add('hidden');

    if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeLightbox);
    if (closeGalleryBackdrop) closeGalleryBackdrop.addEventListener('click', closeLightbox);
  }

  // --- B. Modal (Başvuru Formu) Mantığı ---
  const modal = document.getElementById('application-modal');
  const openModalBtns = document.querySelectorAll('.open-application');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => modal && modal.classList.remove('hidden'));
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => modal && modal.classList.add('hidden'));
  });

  // --- C. Form Gönderimi ve Firebase Kaydı ---
  const appForm = document.getElementById('application-form');
  const successMsg = document.getElementById('application-success');

  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('full-name').value.trim();
      const parentPhone = document.getElementById('parent-phone').value.trim();
      const gradeLevel = document.getElementById('grade-level').value;
      const consent = document.getElementById('consent').checked;

      if (!fullName || !parentPhone || !gradeLevel || !consent) {
        alert('Lütfen tüm zorunlu alanları doldurun ve onay kutusunu işaretleyin.');
        return;
      }

      const applicationData = {
        fullName: fullName,
        parentPhone: parentPhone,
        gradeLevel: gradeLevel,
        createdAt: new Date().toLocaleString('tr-TR')
      };

      if (typeof firebase !== 'undefined') {
        firebase.database().ref('basvurular').push(applicationData)
          .then(() => {
            if (successMsg) successMsg.classList.remove('hidden');
            appForm.reset();
            setTimeout(() => {
              if (modal) modal.classList.add('hidden');
              if (successMsg) successMsg.classList.add('hidden');
            }, 3000);
          })
          .catch(err => {
            alert('Başvuru gönderilirken hata oluştu: ' + err.message);
          });
      }
    });
  }

  // --- D. Admin Paneli Mantığı (admin.html için) ---
  const applicationsTable = document.getElementById('applications-table');
  const metricTotal = document.getElementById('metric-total');
  const searchInput = document.getElementById('application-search');
  const emptyState = document.getElementById('empty-applications');

  if (applicationsTable && typeof firebase !== 'undefined') {
    const dbRef = firebase.database().ref('basvurular');

    dbRef.on('value', (snapshot) => {
      applicationsTable.innerHTML = '';
      const data = snapshot.val();

      if (!data) {
        if (metricTotal) metricTotal.textContent = '0';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');
      const items = Object.keys(data).map(key => data[key]).reverse();
      if (metricTotal) metricTotal.textContent = items.length;

      function renderTable(filterText = '') {
        applicationsTable.innerHTML = '';
        const filteredItems = items.filter(item => 
          item.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
          item.gradeLevel.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredItems.length === 0) {
          applicationsTable.innerHTML = '<tr><td colspan="4" class="text-center">Eşleşen başvuru bulunamadı.</td></tr>';
          return;
        }

        filteredItems.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.createdAt || '-'}</td>
            <td><strong>${item.fullName}</strong></td>
            <td><a href="tel:${item.parentPhone}">${item.parentPhone}</a></td>
            <td>${item.gradeLevel}</td>
          `;
          applicationsTable.appendChild(tr);
        });
      }

      renderTable();

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          renderTable(e.target.value.trim());
        });
      }
    });
  }

  // --- E. Mini Seviye Testi Mantığı ---
  const startTestBtn = document.getElementById('start-test');
  const quizCard = document.getElementById('quiz-card');
  const testLauncher = document.getElementById('test-launcher');

  if (startTestBtn) {
    startTestBtn.addEventListener('click', () => {
      const level = document.getElementById('test-level').value;
      if (testLauncher) testLauncher.classList.add('hidden');
      if (quizCard) {
        quizCard.classList.remove('hidden');
        quizCard.innerHTML = `
          <div style="background: white; padding: 2rem; border-radius: 12px; color: #0f172a;">
            <h3>Soru 1 (Seviye: ${level})</h3>
            <p style="margin: 1rem 0;">3x + 12 = 27 ise x kaçtır?</p>
            <button class="button button-small" onclick="alert('Tebrikler! Doğru cevap.')">A) 5</button>
            <button class="button button-small button-outline" onclick="alert('Yanlış cevap.')">B) 4</button>
          </div>
        `;
      }
    });
  }
});
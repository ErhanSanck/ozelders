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

  // --- C. Hızlı İletişim Formu Mantığı ---
  const quickForm = document.getElementById('contact-quick-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.');
      quickForm.reset();
    });
  }

  // --- D. Başvuru Formu Gönderimi ve Firebase Kaydı ---
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

      if (typeof firebase !== 'undefined' && firebase.database) {
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
      } else {
        if (successMsg) successMsg.classList.remove('hidden');
        appForm.reset();
        setTimeout(() => {
          if (modal) modal.classList.add('hidden');
          if (successMsg) successMsg.classList.add('hidden');
        }, 3000);
      }
    });
  }
});
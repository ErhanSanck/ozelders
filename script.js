// 1. Firebase Yapılandırması
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

// Firebase Başlat
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. Slider Mantığı
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 5000;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    setInterval(nextSlide, slideInterval);
}

// 3. Form Gönderimi (Firebase Realtime Database)
const studentForm = document.getElementById('student-form');
const formStatus = document.getElementById('form-status');

if (studentForm) {
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const grade = document.getElementById('grade').value;
        const notes = document.getElementById('notes').value.trim();
        const date = new Date().toLocaleString('tr-TR');

        formStatus.textContent = "Gönderiliyor...";
        formStatus.style.color = "blue";

        // Firebase'e veri ekleme
        const newApplicationRef = database.ref('basvurular').push();
        newApplicationRef.set({
            fullName: fullName,
            phone: phone,
            grade: grade,
            notes: notes || "Yok",
            createdAt: date
        }).then(() => {
            formStatus.textContent = "Başvurunuz başarıyla alındı! En kısa sürede dönüş yapacağız.";
            formStatus.style.color = "green";
            studentForm.reset();
        }).catch((error) => {
            formStatus.textContent = "Hata oluştu: " + error.message;
            formStatus.style.color = "red";
        });
    });
}

// 4. Admin Paneli - Verileri Okuma
const tableBody = document.getElementById('applications-table-body');

if (tableBody) {
    const applicationsRef = database.ref('basvurular');
    
    applicationsRef.on('value', (snapshot) => {
        tableBody.innerHTML = '';
        const data = snapshot.val();

        if (!data) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Henüz başvuru bulunmamaktadır.</td></tr>';
            return;
        }

        // Verileri diziye çevirip en yeniden en eskiye sıralama
        const applicationList = Object.keys(data).map(key => data[key]).reverse();

        applicationList.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.createdAt}</td>
                <td>${app.fullName}</td>
                <td><a href="tel:${app.phone}">${app.phone}</a></td>
                <td>${app.grade}</td>
                <td>${app.notes}</td>
            `;
            tableBody.appendChild(row);
        });
    });
}
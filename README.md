# 📐 Matematik Atölyesi — Özel Ders & Başvuru Platformu

**Matematik Atölyesi**, LGS, TYT ve AYT sınavlarına hazırlanan öğrenciler için tasarlanmış; modern arayüzlü, responsive (mobil uyumlu) ve Firebase entegrasyonuna sahip bir web platformudur.

Proje; dinamik başvuru yönetimi, interaktif seviye testi ve Bento-Grid yapısında modern bir visual galeri (Lightbox) sunmaktadır.

---

## 🚀 Öne Çıkan Özellikler

* **🎨 Modern ve Renkli Tasarım:**
  * Yumuşak gradyanlar, arka plan görselleri ve estetik tipografi.
  * Tam mobil uyumlu (Responsive) duyarlı tasarım.
* **🖼️ Bento-Grid Görsel Galeri (Slider Yerine):**
  * Eski slayt yapısı yerine responsive ve interaktif Bento-Grid düzeni.
  * Tıklanan görselleri detaylı inceleme olanağı sağlayan **Lightbox (Modal)** altyapısı.
* **📝 Canlı Başvuru Formu & Firebase Entegrasyonu:**
  * Öğrenci ve veli başvurularını toplayan dinamik açılır pencere (Modal).
  * Gönderilen verilerin **Firebase Realtime Database** üzerine anlık kaydı.
* **📊 Admin Yönetim Paneli (`admin.html`):**
  * Firebase'e düşen başvuruları anlık (real-time) listeleme.
  * İsim veya ders seviyesine göre canlı arama/filtreleme.
  * Toplam başvuru sayısı metriği.
* **🧠 İnteraktif Mini Seviye Testi:**
  * Sınıf ve sınav düzeyine (LGS, TYT-AYT, Ara Sınıf) göre soru sunan pratik test modülü.

---

## 📂 Proje Yapısı

```text
.
├── index.html          # Ana sayfa (Hero, Program, Bento Galeri, Test, Başvuru Modalı)
├── admin.html          # Yönetici paneli (Gelen başvuruları görüntüleme ve filtreleme)
├── style.css           # Global stil dosyası (Renk paleti, Bento-Grid, Modal ve Medya sorguları)
├── script.js           # Uygulama mantığı (Firebase bağlantısı, Galeri Lightbox, Form & Admin)

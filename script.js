// =========================================================================
// 1. PENGATURAN WAKTU UTAMA (TARGET FESTIVAL)
// =========================================================================
// Menentukan tanggal dan waktu spesifik kapan festival akan dimulai 
// Format: "Bulan Tanggal, Tahun Jam:Menit:Detik"
// .getTime() digunakan untuk mengubah objek tanggal menjadi angka milidetik UNIX agar bisa dihitung secara matematis
const tanggalAcara = new Date("Dec 31, 2026 18:00:00").getTime();


// =========================================================================
// 2. MESIN HITUNG MUNDUR (COUNTDOWN ENGINE)
// =========================================================================
// setInterval digunakan untuk menjalankan blok fungsi di dalamnya secara berulang-ulang 
// dengan jeda waktu yang konsisten setiap 1000 milidetik (1 detik)
const hitungMundur = setInterval(function() {

    // Mengambil waktu saat ini (detik ini juga ketika user membuka web) dalam format milidetik
    const sekarang = new Date().getTime();
    
    // Menghitung sisa jarak waktu (selisih) antara target acara dengan waktu sekarang
    const selisihWaktu = tanggalAcara - sekarang;
    
    // --- FORMULA KONVERSI MATEMATIKA (Milidetik ke Waktu Manusia) ---
    // 1 Hari = 24 jam x 60 menit x 60 detik x 1000 milidetik
    const hari  = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
    
    // Sisa milidetik dari pembagian hari, dikonversi menjadi satuan Jam
    const jam   = Math.floor((selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Sisa milidetik dari pembagian jam, dikonversi menjadi satuan Menit
    const menit = Math.floor((selisihWaktu % (1000 * 60 * 60)) / (1000 * 60));
    
    // Sisa milidetik dari pembagian menit, dikonversi menjadi satuan Detik
    const detik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);
    
    // --- MENYUNTIKKAN ANGKA KE ANTARMUKA (HTML DOM Injection) ---
    // Mengirimkan hasil hitungan yang sudah diformat ke elemen teks masing-masing kotak di HTML
    document.getElementById("days").innerHTML    = formatAngka(hari);
    document.getElementById("hours").innerHTML   = formatAngka(jam);
    document.getElementById("minutes").innerHTML = formatAngka(menit);
    document.getElementById("seconds").innerHTML = formatAngka(detik);
    
    // --- KONDISI APABILA WAKTU TELAH HABIS ---
    // Jika selisih waktu sudah menyentuh angka 0 atau minus, berarti konser sudah dimulai
    if (selisihWaktu < 0) {
        // Menghentikan interval detakan timer agar tidak memakan memori browser performa web
        clearInterval(hitungMundur);
        
        // Merombak isi kontainer timer di HTML dan menggantinya dengan teks pengumuman
        document.querySelector(".countdown-container").innerHTML = "<h3>ACARA TELAH DIMULAI!</h3>";
    }

}, 1000); // 1000 milidetik = 1 detik


// =========================================================================
// 3. FUNGSI UTILITY & NAVIGASI (PENGIRIM DATA TIKET)
// =========================================================================
/**
 * Memformat tampilan angka agar selalu memiliki dua digit (Padding Zero)
 * Contoh: Angka 5 akan diubah menjadi string "05", Angka 12 tetap "12"
 * @param {number} angka - Input angka mentah hasil kalkulasi matematika
 */
function formatAngka(angka) {
    return angka < 10 ? "0" + angka : angka;
}

/**
 * Mengarahkan user dari Halaman Utama ke Halaman Pembayaran secara dinamis
 * membawa query parameter berdasarkan jenis tiket yang di-klik user.
 * * Contoh Penggunaan di HTML: <button onclick="pesanTiket('vip')">Beli Tiket VIP</button>
 * @param {string} namaTier - Kode string tiket ('earlybird', 'vip', atau 'streaming')
 */
function pesanTiket(namaTier) {
    // Memindahkan halaman browser ke payment.html sambil menyelipkan teks data tiket dibelakang URL (?ticket=...)
    // Trik ini membuat halaman payment bisa membaca tiket apa yang baru saja diklik oleh user
    window.location.href = `payment.html?ticket=${namaTier}`;
}

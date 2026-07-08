// =========================================================================
// VARIABLE GLOBAL
// =========================================================================
// Menyimpan instance penunjuk waktu agar bisa dihentikan/dibersihkan dari fungsi mana pun
let intervalBatasBayar; 


// =========================================================================
// 1. AMBIL DATA TIKET SECARA DINAMIS DARI URL (Parsing URL)
// =========================================================================
// Membaca parameter query yang dikirim dari index.html (contoh: payment.html?ticket=earlybird)
const parameterURL   = new URLSearchParams(window.location.search);
const tipeTiketDariURL = parameterURL.get('ticket'); 

// Menyiapkan wadah data tiket dengan nilai bawaan (Default) jika user masuk tanpa parameter
let namaTiketTerpilih = "VIP Pass"; 
let hargaDasarTiket   = 850000;

// Menentukan nama tiket dan harga dasar berdasarkan parameter URL yang ditangkap
if (tipeTiketDariURL === "earlybird") {
    namaTiketTerpilih = "Early Bird";
    hargaDasarTiket   = 350000;
} else if (tipeTiketDariURL === "vip") {
    namaTiketTerpilih = "VIP Pass";
    hargaDasarTiket   = 850000;
} else if (tipeTiketDariURL === "streaming") {
    namaTiketTerpilih = "Streaming Access";
    hargaDasarTiket   = 250000;
}


// =========================================================================
// 2. DEKLARASI ELEMEN DOM (Penghubung HTML & JavaScript)
// =========================================================================
// Mengambil kontainer pembungkus dari setiap tahapan formulir
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');

// Mengambil elemen lingkaran indikator alur di bagian atas halaman
const indicator2 = document.getElementById('step-2-indicator');
const indicator3 = document.getElementById('step-3-indicator');
const indicator4 = document.getElementById('step-4-indicator');

// Mengambil seluruh elemen kotak isian data pelanggan di Tahap 1
const inputNama  = document.getElementById('fullName');
const inputID    = document.getElementById('idNumber');
const inputPhone = document.getElementById('phoneNumber');
const inputEmail = document.getElementById('emailAddress');

// Mengambil tombol navigasi utama maju ke depan
const btnToStep2 = document.getElementById('btn-to-step2');
const btnToStep3 = document.getElementById('btn-to-step3');
const btnToStep4 = document.getElementById('btn-to-step4');

// Mengambil tempat penyuntikan teks dinamis pada formulir Tahap 3
const selectedProviderText  = document.getElementById('selected-provider-text');
const dynamicPaymentContent = document.getElementById('dynamic-payment-content');


// =========================================================================
// 3. LOGIKA ALUR TAHAP 1 KE TAHAP 2 (Validasi Identitas)
// =========================================================================
btnToStep2.addEventListener('click', function() {
    // Memeriksa dan membersihkan spasi (.trim()) untuk memastikan form tidak kosong atau diisi spasi saja
    if (inputNama.value.trim() === "" || inputID.value.trim() === "" || inputPhone.value.trim() === "" || inputEmail.value.trim() === "") {
        alert("⚠️ Mohon lengkapi seluruh data identitas Anda terlebih dahulu.");
        return; // Menghentikan fungsi agar tidak berpindah halaman
    }

    // Menyembunyikan Tahap 1 dan memunculkan Tahap 2 ke layar
    step1.classList.remove('active');
    step2.classList.add('active');
    
    // Menyalakan lampu ungu indikator langkah ke-2 di bagian atas
    indicator2.classList.add('active');
});


// =========================================================================
// 4. LOGIKA ALUR TAHAP 2 KE TAHAP 3 (Pemilihan Penyedia Layanan)
// =========================================================================
// Menangkap seluruh elemen kartu perbankan/e-wallet di dalam halaman
const providerCards = document.querySelectorAll('.provider-card');

providerCards.forEach(card => {
    card.addEventListener('click', function() {
        // Mengambil meta data dari atribut elemen kartu yang sedang di-klik user
        const providerName = this.getAttribute('data-name');
        const paymentType  = this.getAttribute('data-type'); 

        // Memunculkan kotak dialog konfirmasi browser bawaan
        const yakin = confirm(`Apakah Anda yakin ingin melanjutkan pembayaran menggunakan [ ${providerName} ]?`);
        
        if (yakin) {
            // Memproses hitungan matematika tagihan dan membuat konten instruksinya
            prosesMasukTahapTiga(providerName, paymentType);
            
            // Memicu hitung mundur batas pembayaran selama 10 menit penuh saat Tahap 3 aktif
            mulaiTimerBatasPembayaran(10); 
        }
    });
});

/**
 * Fungsi inti untuk memproses hitungan kalkulasi harga tiket dan merender interface Tahap 3
 */
function prosesMasukTahapTiga(namaPenyedia, tipePembayaran) {
    // Menampilkan nama bank/dompet digital terpilih pada bagian tajuk detail pembayaran
    selectedProviderText.innerText = namaPenyedia;

    // --- KALKULASI TAGIHAN (DIREVISI: Sekarang menggunakan data dinamis dari URL) ---
    const biayaAdmin   = 5000;
    const pajakPPN     = hargaDasarTiket * 0.12; // Menghitung Pajak Pertambahan Nilai sebesar 12%
    const totalTagihan = hargaDasarTiket + biayaAdmin + pajakPPN;

    // Menyuntikkan hasil kalkulasi nominal ke dalam tabel invoice ringkasan di HTML
    document.getElementById('invoice-ticket-name').innerText = namaTiketTerpilih;
    document.getElementById('invoice-base-price').innerText = formatRupiah(hargaDasarTiket);
    document.getElementById('invoice-tax').innerText        = formatRupiah(pajakPPN);
    document.getElementById('invoice-total-price').innerText = formatRupiah(totalTagihan);

    // Mengosongkan area instruksi lama sebelum diisi oleh skema baru
    dynamicPaymentContent.innerHTML = "";

    // Memeriksa tipe pembayaran untuk menentukan visualisasi instruksi transaksi
    if (tipePembayaran === "va") {
        // Membuat simulasi susunan nomor Virtual Account acak sepanjang 12 digit angka
        const nomorVA = Math.floor(100000000000 + Math.random() * 900000000000);
        
        dynamicPaymentContent.innerHTML = `
            <p>Salin nomor Virtual Account berikut:</p>
            <div class="va-copy-wrapper">
                <div class="va-number-display" id="target-va">${nomorVA}</div>
                <button type="button" class="btn-copy" onclick="salinNomorVA()">
                    <i class="fa-regular fa-copy"></i><span>Salin</span>
                </button>
            </div>
            <p style="font-size:0.85rem; color:#888; margin-top: 10px;">
                ⚠️ Transfer tepat sebesar <strong style="color:#ffffff;">${formatRupiah(totalTagihan)}</strong> agar sistem otomatis mengenali pembayaran Anda.
            </p>
        `;
    } else if (tipePembayaran === "wallet") {
        dynamicPaymentContent.innerHTML = `
            <p style="margin-bottom: 15px;">Aplikasi ${namaPenyedia} akan otomatis meminta konfirmasi pembayaran sebesar <strong>${formatRupiah(totalTagihan)}</strong></p>
            <button type="button" class="btn-action" style="background-color:#9d4edd; color:white; width:auto; padding: 10px 25px; margin-top:0;" onclick="alert('Simulasi: Mengalihkan langsung ke aplikasi ponsel...')">
                <i class="fa-solid fa-external-link"></i> Buka Aplikasi ${namaPenyedia}
            </button>
        `;
    } else if (tipePembayaran === "qris") {
        dynamicPaymentContent.innerHTML = `
            <p>Silakan scan kode QRIS sebesar <strong>${formatRupiah(totalTagihan)}</strong>:</p>
            <div class="barcode-simulasi">
                <i class="fa-solid fa-qrcode"></i>
            </div>
            <p style="font-size:0.85rem; color:#888;">Mendukung seluruh aplikasi dompet digital nasional.</p>
        `;
    }

    // Melakukan perpindahan visual panel halaman ke Tahap 3
    step2.classList.remove('active');
    step3.classList.add('active');
    indicator3.classList.add('active');
}


// =========================================================================
// 5. FITUR UTILITY & PENDUKUNG (Format Rupiah & Copy Clipboard)
// =========================================================================
/**
 * Mengubah angka integer murni menjadi string berformat rupiah (e.g., Rp 850.000)
 */
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString('id-ID');
}

/**
 * Menyalin teks nomor Virtual Account langsung ke dalam sistem clipboard perangkat
 */
function salinNomorVA() {
    const teksVA = document.getElementById('target-va').innerText;
    
    // Menjalankan Clipboard API modern browser web
    navigator.clipboard.writeText(teksVA).then(() => {
        const btnCopy = document.querySelector('.btn-copy');
        // Memberikan feedback visual instant jika proses penyalinan berhasil dilakukan
        btnCopy.innerHTML = `<i class="fa-solid fa-check" style="color: #00e676;"></i><span style="color: #00e676;">Tersalin!</span>`;
        
        // Mengembalikan teks tombol ke default semula setelah jeda 2 detik
        setTimeout(() => {
            btnCopy.innerHTML = `<i class="fa-regular fa-copy"></i><span>Salin</span>`;
        }, 2000);
    }).catch(err => {
        console.error("Gagal menyalin teks: ", err);
    });
}


// =========================================================================
// 6. LOGIKA ALUR TAHAP 3 KE TAHAP 4 (Konfirmasi Selesai & Kirim Tiket)
// =========================================================================
btnToStep4.addEventListener('click', function() {
    // Menonaktifkan mesin hitung mundur agar tidak terus berjalan di latar belakang halaman
    clearInterval(intervalBatasBayar);
    
    // Memindahkan teks data kontak dari input awal ke dalam rangkuman pengiriman di Tahap 4
    document.getElementById('dest-wa').innerText   = `${inputPhone.value} (WhatsApp)`;
    document.getElementById('dest-email').innerText = inputEmail.value;

    // Menyembunyikan Tahap 3 dan menampilkan nota pengiriman sukses Tahap 4
    step3.classList.remove('active');
    step4.classList.add('active');
    indicator4.classList.add('active');
});


// =========================================================================
// 7. LOGIKA TIMER COUNTDOWN (Batas Waktu Transaksi)
// =========================================================================
/**
 * Mengelola jam digital hitung mundur dinamis per detik
 */
function mulaiTimerBatasPembayaran(menitDurasi) {
    // Memastikan tidak ada interval ganda yang bocor atau berjalan bersamaan
    clearInterval(intervalBatasBayar);

    let totalDetik = menitDurasi * 60;
    const displayTimer = document.getElementById('payment-countdown');

    intervalBatasBayar = setInterval(function() {
        let menit = Math.floor(totalDetik / 60);
        let detik = totalDetik % 60;

        // Menambahkan digit angka nol bantuan di depan jika nilai di bawah angka 10
        menit = menit < 10 ? "0" + menit : menit;
        detik = detik < 10 ? "0" + detik : detik;

        // Memasukkan update string timer ke komponen HTML
        displayTimer.innerText = `${menit}:${detik}`;

        // Memeriksa kondisi apabila batas durasi waktu transaksi telah menyentuh angka nol
        if (totalDetik <= 0) {
            clearInterval(intervalBatasBayar);
            handlePembayaranKedaluwarsa(); // Mengunci formulir transaksi
        }

        totalDetik--; // Mengurangi kalkulasi sisa detik
    }, 1000); // Diulang secara konsisten setiap 1000 milidetik (1 detik)
}

/**
 * Mengunci antarmuka aplikasi secara sepihak apabila waktu pengisian/pembayaran habis
 */
function handlePembayaranKedaluwarsa() {
    // Merombak visual kotak waktu menjadi indikator bahaya merah
    const boxTimer = document.querySelector('.timer-box-step3');
    boxTimer.style.backgroundColor = 'rgba(234, 67, 53, 0.1)';
    boxTimer.style.borderColor = '#ea4335';
    boxTimer.style.color = '#ea4335';
    boxTimer.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>Waktu pembayaran telah habis! Transaksi Anda dibatalkan otomatis.</span>`;

    // Menyuntikkan kelas pembeku aksi formulir via manipulasi pointer-events CSS
    step3.classList.add('disabled-step');

    // Mengalihfungsikan tombol bayar menjadi pemicu muat ulang halaman dari awal
    const btnBayar = document.getElementById('btn-to-step4');
    btnBayar.innerText = "Ulangi Pemesanan (Halaman akan memuat ulang)";
    btnBayar.style.backgroundColor = "#ea4335";
    btnBayar.style.color = "#ffffff";
    
    // Memberikan pengecualian akses klik khusus untuk tombol restart pemesanan ini
    step3.style.pointerEvents = "auto"; 
    btnBayar.onclick = function() {
        window.location.reload(); 
    };

    alert("⚠️ Batas waktu pembayaran telah habis. Sesi transaksi Anda telah kedaluwarsa.");
}


// =========================================================================
// 8. LOGIKA NAVIGASI MUNDUR / KEMBALI (Ubah Metode / Data)
// =========================================================================
// Tombol Mundur Tahap 2: Kembali mengisi kelengkapan identitas diri
document.getElementById('btn-back-to-step1').addEventListener('click', function() {
    step2.classList.remove('active');
    step1.classList.add('active');
    indicator2.classList.remove('active');
});

// Tombol Mundur Tahap 3: Kembali membatalkan opsi bank untuk menukar metode payment lain
document.getElementById('btn-back-to-step2').addEventListener('click', function() {
    // A. Hentikan timer hitung mundur agar tidak berjalan di latar belakang
    clearInterval(intervalBatasBayar);
    
    // B. Reset variabel pilihan agar user wajib memilih ulang kartu di Tahap 2
    providerTerpilih = null;
    tipeTerpilih = null;

    // C. Bersihkan border oranye dari semua kartu penyedia di Tahap 2
    providerCards.forEach(card => {
        card.style.borderColor = "#3d3d5c";
    });

    // D. Kembalikan visual halaman ke Tahap 2
    step3.classList.remove('active');
    step2.classList.add('active');
    
    // E. Matikan indikator progres ke-3 di bagian atas halaman
    indicator3.classList.remove('active');
});
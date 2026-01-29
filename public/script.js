// Konfigurasi API - Jangan diubah
const API_URL = '/api/screenshot';

// Element Selection
const form = document.getElementById('ss-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('result-area');
const resultImg = document.getElementById('result-img');
const downloadBtn = document.getElementById('download-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// Event Listener Form
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI State: Loading
    setLoading(true);
    resultArea.style.display = 'none';

    // Persiapkan Data
    const payload = {
        url: document.getElementById('url').value,
        width: parseInt(document.getElementById('width').value) || 1280,
        height: parseInt(document.getElementById('height').value) || 720,
        device_scale: parseInt(document.getElementById('scale').value) || 1,
        full_page: document.getElementById('fullpage').checked
    };

    try {
        // Melakukan Request ke Backend (JANGAN DIUBAH)
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            handleSuccess(data.image_url);
        } else {
            alert('Gagal mengambil screenshot. Silakan coba lagi.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
    } finally {
        setLoading(false);
    }
});

// Fungsi UI Helper
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        loader.style.display = 'block';
        btnText.textContent = 'PROSES...';
    } else {
        submitBtn.disabled = false;
        loader.style.display = 'none';
        btnText.textContent = 'AMBIL SCREENSHOT';
    }
}

// Menampilkan Hasil
function handleSuccess(url) {
    resultImg.src = url;
    resultArea.style.display = 'block';
    
    // Scroll ke hasil
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ----------------------------------------------
// UPDATE FITUR DOWNLOAD OTOMATIS
// ----------------------------------------------
downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const imageUrl = resultImg.src;
    
    // Ubah text tombol sementara
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = `<div class="loader" style="display:inline-block; border-color: black; border-bottom-color: transparent;"></div> SEDANG MENDOWNLOAD...`;
    
    try {
        // 1. Fetch gambar sebagai Blob (Binary Large Object)
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // 2. Buat URL objek sementara di browser
        const tempUrl = window.URL.createObjectURL(blob);
        
        // 3. Buat elemen anchor tersembunyi untuk trigger download
        const a = document.createElement('a');
        a.href = tempUrl;
        
        // Generate nama file unik berdasarkan waktu
        const timestamp = new Date().getTime();
        a.download = `sann404-capture-${timestamp}.png`;
        
        // Tambahkan ke body, klik, lalu hapus
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Hapus URL objek untuk hemat memori
        window.URL.revokeObjectURL(tempUrl);
        
    } catch (err) {
        console.error("Gagal auto-download, fallback ke tab baru", err);
        // Fallback jika CORS memblokir fetch blob: Buka di tab baru
        window.open(imageUrl, '_blank');
    } finally {
        // Kembalikan text tombol
        downloadBtn.innerHTML = originalText;
    }
});

// Sidebar Toggle Logic
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Toggle Sidebar Function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Scroll Helper
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Force Auto Download Function (Tanpa tab baru)
async function forceDownload(imageUrl) {
    const downloadBtn = document.getElementById('download-btn');
    const originalText = downloadBtn.innerHTML;
    
    // Feedback visual
    downloadBtn.innerHTML = '<i class="ri-loader-4-line"></i> Downloading...';
    downloadBtn.disabled = true;

    try {
        // 1. Fetch gambar sebagai Blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // 2. Buat URL objek sementara
        const blobUrl = window.URL.createObjectURL(blob);
        
        // 3. Buat elemen anchor tersembunyi
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `SANN404_Screenshot_${Date.now()}.png`; // Nama file otomatis
        document.body.appendChild(a);
        
        // 4. Klik otomatis
        a.click();
        
        // 5. Bersihkan
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        
    } catch (error) {
        console.error('Download failed:', error);
        alert("Gagal mengunduh otomatis. Membuka di tab baru...");
        window.open(imageUrl, '_blank');
    } finally {
        // Kembalikan tombol ke semula
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
}

// Handle Form Submit
document.getElementById('ss-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // UI Elements
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('result-area');
    const resultImg = document.getElementById('result-img');
    const downloadBtn = document.getElementById('download-btn');

    // Get Values
    const url = document.getElementById('url').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const device_scale = document.getElementById('scale').value;
    const full_page = document.getElementById('fullpage').checked;

    // Set Loading State
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'block'; // Show rotating squares
    resultArea.style.display = 'none';

    try {
        const response = await fetch('/api/screenshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                width: parseInt(width),
                height: parseInt(height),
                device_scale: parseInt(device_scale),
                full_page
            })
        });

        const data = await response.json();

        if (data.success) {
            // Set image source
            resultImg.src = data.image_url;
            resultArea.style.display = 'block';
            
            // Setup Download Button Event
            // Kita hapus listener lama (cloning node) agar tidak menumpuk
            const newDownloadBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
            
            newDownloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                forceDownload(data.image_url);
            });
            
            // Scroll to result smoothly
            setTimeout(() => {
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            alert('Gagal: ' + (data.message || 'Terjadi kesalahan tidak diketahui'));
        }

    } catch (error) {
        alert('Error Connection: ' + error.message);
    } finally {
        // Reset State
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        loader.style.display = 'none';
    }
});

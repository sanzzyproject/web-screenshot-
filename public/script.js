function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

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

    // Loading State
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'block';
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
            resultImg.src = data.image_url;
            downloadBtn.href = data.image_url;
            resultArea.style.display = 'block';
            
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

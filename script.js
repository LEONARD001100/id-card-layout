document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const leftImageInput = document.getElementById('leftImage');
    const rightImageInput = document.getElementById('rightImage');
    const leftPreview = document.getElementById('leftPreview');
    const rightPreview = document.getElementById('rightPreview');
    const downloadBtn = document.getElementById('downloadBtn');

    // Get slider controls
    const leftBrightness = document.getElementById('leftBrightness');
    const leftContrast = document.getElementById('leftContrast');
    const rightBrightness = document.getElementById('rightBrightness');
    const rightContrast = document.getElementById('rightContrast');

    // Handle image uploads
    function handleImageUpload(input, previewImg) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                updateImageFilters(previewImg);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Update image filters based on slider values
    function updateImageFilters(img) {
        if (img === leftPreview) {
            img.style.filter = `brightness(${leftBrightness.value}%) contrast(${leftContrast.value}%)`;
        } else if (img === rightPreview) {
            img.style.filter = `brightness(${rightBrightness.value}%) contrast(${rightContrast.value}%)`;
        }
    }

    // Event listeners for file inputs
    leftImageInput.addEventListener('change', () => handleImageUpload(leftImageInput, leftPreview));
    rightImageInput.addEventListener('change', () => handleImageUpload(rightImageInput, rightPreview));

    // Event listeners for sliders
    leftBrightness.addEventListener('input', () => updateImageFilters(leftPreview));
    leftContrast.addEventListener('input', () => updateImageFilters(leftPreview));
    rightBrightness.addEventListener('input', () => updateImageFilters(rightPreview));
    rightContrast.addEventListener('input', () => updateImageFilters(rightPreview));

    // Handle download
    downloadBtn.addEventListener('click', () => {
        const layout = document.getElementById('a5Preview');
        
        // Show loading state
        downloadBtn.textContent = 'Generating High Quality Image...';
        downloadBtn.disabled = true;

        // Calculate high-resolution dimensions (4x the display size)
        const scale = 4;
        const width = layout.offsetWidth * scale;
        const height = layout.offsetHeight * scale;
        
        html2canvas(layout, {
            scale: scale, // Increased scale factor for higher quality
            backgroundColor: '#ffffff',
            useCORS: true, // Enable cross-origin image loading
            allowTaint: true,
            logging: false,
            imageTimeout: 0, // No timeout for image loading
            onclone: (documentClone) => {
                // Get the cloned layout element
                const clonedLayout = documentClone.getElementById('a5Preview');
                const leftPreview = documentClone.getElementById('leftPreview');
                const rightPreview = documentClone.getElementById('rightPreview');
                
                // Copy the current filters to the cloned elements
                leftPreview.style.filter = document.getElementById('leftPreview').style.filter;
                rightPreview.style.filter = document.getElementById('rightPreview').style.filter;
                
                // Ensure the cloned images maintain object-fit contain
                leftPreview.style.objectFit = 'contain';
                rightPreview.style.objectFit = 'contain';

                // Apply crisp rendering
                clonedLayout.style.imageRendering = 'crisp-edges';
                leftPreview.style.imageRendering = 'crisp-edges';
                rightPreview.style.imageRendering = 'crisp-edges';
            }
        }).then(canvas => {
            // Create a new canvas with high resolution dimensions
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = width;
            finalCanvas.height = height;
            const ctx = finalCanvas.getContext('2d');
            
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            
            // Draw the captured content at high resolution
            ctx.drawImage(canvas, 0, 0, width, height);
            
            // Create download link with maximum quality PNG
            const link = document.createElement('a');
            link.download = 'id-card-layout.png';
            link.href = finalCanvas.toDataURL('image/png', 1.0);
            
            // Trigger download
            link.click();
            
            // Reset button state
            downloadBtn.textContent = 'Download Layout';
            downloadBtn.disabled = false;
        }).catch(error => {
            console.error('Error generating image:', error);
            downloadBtn.textContent = 'Download Layout';
            downloadBtn.disabled = false;
            alert('Error generating image. Please try again.');
        });
    });
});

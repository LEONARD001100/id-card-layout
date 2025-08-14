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
        
        html2canvas(layout, {
            scale: 2, // Higher quality
            backgroundColor: '#ffffff',
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
            }
        }).then(canvas => {
            // Calculate dimensions that maintain the A5 ratio but match preview size
            const previewWidth = layout.offsetWidth;
            const previewHeight = layout.offsetHeight;
            
            // Create a new canvas with preview dimensions
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = previewWidth * 2; // Double size for better quality
            finalCanvas.height = previewHeight * 2;
            const ctx = finalCanvas.getContext('2d');
            
            // Draw with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
            
            // Draw the captured content at the same proportions as preview
            ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
            
            const link = document.createElement('a');
            link.download = 'a5-layout.png';
            link.href = finalCanvas.toDataURL('image/png', 1.0);
            link.click();
        });
    });
});

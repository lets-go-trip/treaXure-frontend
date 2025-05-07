/**
 * Handle image load errors and apply styling for missing images
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all images in the document
    const images = document.querySelectorAll('img');
    
    // For each image, add an error handler
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Add error class to apply CSS styling
            this.classList.add('error');
            
            // Remove src and srcset to prevent broken image icon
            this.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
            if (this.hasAttribute('srcset')) {
                this.removeAttribute('srcset');
            }
            
            // Set alt text to empty if it doesn't exist
            if (!this.hasAttribute('alt') || this.getAttribute('alt') === "") {
                this.setAttribute('alt', ' ');
            }
        });
    });
}); 
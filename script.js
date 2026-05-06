/**
 * ECOCLOSET CORE LOGIC
 * Replace placeholders with your ACTUAL Unsigned credentials from Cloudinary.
 */
const cloudName = "dmvuzwlxs"; 
const uploadPreset = "ecocloset"; 

// 1. Initialize the Widget configuration
const myWidget = cloudinary.createUploadWidget({
    cloudName: cloudName, 
    uploadPreset: uploadPreset,
    sources: ['local', 'url', 'camera'], // Adds flexibility for the user
    multiple: false,
    cropping: true, 
    theme: "minimal",
    clientAllowedFormats: ["jpg", "png", "jpeg"],
    // Visual transformation settings
    thumbnailTransformation: [{ width: 200, height: 200, crop: 'fit' }]
}, (error, result) => { 
    if (!error && result && result.event === "success") { 
        console.log("Success! Image data:", result.info);
        addItemToGrid(result.info);
    } else if (error) {
        console.error("Cloudinary Widget Error:", error);
    }
});

// 2. Attach Click Listener with a Safety Check
document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.getElementById("upload_widget");
    
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            // Check if Cloudinary library loaded successfully
            if (typeof cloudinary !== 'undefined') {
                myWidget.open();
            } else {
                alert("Cloudinary library is still loading. Please refresh the page.");
            }
        }, false);
    } else {
        console.error("Button with ID 'upload_widget' not found in HTML.");
    }
});

/**
 * UI FUNCTION: Adds the AI-processed image to the grid
 */
function addItemToGrid(info) {
    const grid = document.getElementById("closet-grid");
    
    // CLOUDINARY AI TRANSFORMATIONS
    // e_background_removal: Strips messy backgrounds for a clean lookbook feel
    // f_auto,q_auto: Ensures sustainability by minimizing data transfer
    const aiUrl = info.secure_url.replace(
        "/upload/", 
        "/upload/e_background_removal/f_auto,q_auto,c_pad,h_400,w_400/"
    );

    const card = document.createElement("article");
    card.className = "clothing-card";
    
    const dateAdded = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    card.innerHTML = `
        <img src="${aiUrl}" alt="Closet Item" loading="lazy" onerror="this.src='${info.secure_url}';">
        <p><small>Added: ${dateAdded}</small></p>
        <p class="carbon-stat">🌱 2.5kg CO2 Prevented</p>
    `;
    
    grid.prepend(card);
}
function addItemToGrid(info) {
    const grid = document.getElementById("closet-grid");
    
    // Cloudinary AI Transformation
    const aiUrl = info.secure_url.replace(
        "/upload/", 
        "/upload/e_background_removal/f_auto,q_auto,c_pad,h_400,w_400/"
    );

    const card = document.createElement("article");
    card.className = "clothing-card";
    
    // Calculation: Standard Denim Jeans save ~25kg of CO2
    const co2Saved = 25.0; 

    card.innerHTML = `
        <img src="${aiUrl}" alt="Closet Item" loading="lazy">
        <div class="card-info">
            <p class="carbon-stat">🌱 ${co2Saved}kg CO₂ Avoided</p>
            <p><small>By cataloging this item, you've prevented a duplicate purchase and the carbon cost of new denim production.</small></p>
        </div>
    `;
    
    grid.prepend(card);
    
    // Optional: Call a function to update a total counter on the page
    updateTotalImpact(co2Saved);
}
let totalCO2Saved = 0;

function updateTotalImpact(amount) {
    totalCO2Saved += amount;
    const counterDisplay = document.getElementById("total-co2");
    if (counterDisplay) {
        counterDisplay.innerText = totalCO2Saved.toFixed(1);
    }
}

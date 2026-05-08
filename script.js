// --- 1. CONFIGURATION ---
const CLOUD_NAME = "dmvuzwlxs"; 
const UPLOAD_PRESET = "ecocloset"; 

let currentSelectedItemIndex = null;

// --- 2. IMPACT & RENDER LOGIC ---
const updateImpact = (count) => {
    const totalDisplay = document.getElementById('total-co2');
    if (totalDisplay) {
        totalDisplay.innerText = (count * 2.5).toFixed(1);
    }
};

const renderCard = (item, index) => {
    const grid = document.getElementById('wardrobe-grid');
    if (!grid) {
        console.error("Grid element not found! Check your HTML for id='wardrobe-grid'");
        return;
    }

    // Apply AI background removal transformation
    const processedUrl = item.url.replace("/upload/", "/upload/e_background_removal/");

    const card = `
        <div class="clothing-card" onclick="openItem(${index})" data-category="${item.category}">
            <img src="${processedUrl}" alt="${item.category}">
            <div class="card-info">
                <p class="carbon-stat">Saved 2.5kg CO₂</p>
                <small>${item.category.toUpperCase()}</small>
            </div>
        </div>
    `;
    grid.innerHTML += card; // Simplified injection
};

// --- 3. MODAL FUNCTIONS ---
window.openItem = (index) => {
    const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
    const item = saved[index];
    currentSelectedItemIndex = index;

    const modalImg = document.getElementById('modal-img');
    const modalLabel = document.getElementById('modal-label');
    const modal = document.getElementById('item-modal');

    if (modalImg && modalLabel && modal) {
        modalImg.src = item.url.replace("/upload/", "/upload/e_background_removal/");
        modalLabel.innerText = `Type: ${item.category.toUpperCase()}`;
        modal.style.display = "block";
    }
};

window.closeModal = () => {
    const modal = document.getElementById('item-modal');
    if (modal) modal.style.display = "none";
};

// --- 4. DELETE FUNCTION ---
const deleteBtn = document.getElementById('delete-btn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        let saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
        saved.splice(currentSelectedItemIndex, 1);
        localStorage.setItem("arcaWardrobe", JSON.stringify(saved));
        closeModal();
        loadGallery(); 
    });
}

// --- 5. INITIALIZE GALLERY ---
const loadGallery = () => {
    console.log("Attempting to load gallery...");
    const grid = document.getElementById('wardrobe-grid');
    if (grid) {
        grid.innerHTML = ''; // Clear current grid
        const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
        console.log("Found " + saved.length + " items in storage.");
        saved.forEach((item, index) => renderCard(item, index));
        updateImpact(saved.length);
    }
};

// --- 6. CLOUDINARY WIDGET SETUP ---
window.onload = () => {
    if (typeof cloudinary !== 'undefined') {
        const myWidget = cloudinary.createUploadWidget({
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,
            sources: ['local', 'camera'],
            cropping: true,
            multiple: false
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                const category = prompt("Folder? (dresses, casuals, home)") || 'casuals';
                const newItem = { url: result.info.secure_url, category: category.toLowerCase() };
                
                const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
                saved.push(newItem);
                localStorage.setItem("arcaWardrobe", JSON.stringify(saved));

                loadGallery();
            }
        });

        const uploadBtn = document.getElementById("upload_widget");
        if (uploadBtn) {
            uploadBtn.addEventListener("click", () => myWidget.open(), false);
        }
    }
    loadGallery(); // Initial load
};
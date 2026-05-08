// --- CONFIGURATION ---
const cloudName = "YOUR_CLOUD_NAME"; // Replace with your Cloudinary name
const uploadPreset = "YOUR_PRESET";  // Replace with your unsigned preset

// --- UI ELEMENTS ---
const grid = document.getElementById('wardrobe-grid');
const totalDisplay = document.getElementById('total-co2');

// --- IMPACT LOGIC ---
function updateImpact() {
    // Count how many clothing cards are currently in the grid
    const itemCount = grid.getElementsByClassName('clothing-card').length;
    
    // Logic: Every item = 2.5kg saved
    const totalSaved = (itemCount * 2.5).toFixed(1);
    
    // Update the dashboard number
    totalDisplay.innerText = totalSaved;
}

// --- CLOUDINARY WIDGET ---
const myWidget = cloudinary.createUploadWidget({
    cloudName: "dmvuzwlxs", 
    uploadPreset:"ecocloset" ,
    sources: ['local', 'camera'],
    multiple: false,
    cropping: true, // Helps keep card images looking uniform
    clientAllowedFormats: ["png", "jpg", "jpeg"]
}, (error, result) => { 
    if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        
        // 1. Get the image URL
        const imageUrl = result.info.secure_url;

        // 2. Create the HTML for the new card
        const cardHTML = `
            <div class="clothing-card">
                <img src="${imageUrl}" alt="Clothing Item">
                <div class="card-info">
                    <p class="carbon-stat">Saved 2.5kg CO₂</p>
                    <small>Added to Arca</small>
                </div>
            </div>
        `;

        // 3. Inject into the grid
        grid.insertAdjacentHTML('afterbegin', cardHTML);

        // 4. Update the impact counter immediately
        updateImpact();
    }
});

// Open widget on button click
document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
}, false)
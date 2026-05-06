// Replace with your actual Unsigned Cloudinary credentials
const cloudName = "dmvuzwlxs";
const uploadPreset = "ecofriendly";

const myWidget = cloudinary.createUploadWidget({
  cloudName: cloudName,
  uploadPreset: uploadPreset,
  cropping: true,
  multiple: false,
  clientAllowedFormats: ["jpg", "png", "jpeg"],
  theme: "minimal",
  // Adding a transformation to the thumbnail inside the widget itself
  thumbnailTransformation: [{ width: 200, height: 200, crop: 'fit' }]
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log("Done! Here is the image info: ", result.info);
    addItemToGrid(result.info);
  }
});

// Trigger Widget
document.getElementById("upload_widget").addEventListener("click", () => {
  myWidget.open();
}, false);

function addItemToGrid(info) {
  const grid = document.getElementById("closet-grid");

  /**
   * CLOUDINARY AI TRANSFORMATION:
   * e_background_removal -> Uses AI to strip the photo background
   * f_auto,q_auto -> Optimization for speed and sustainability
   * c_pad,h_400,w_400 -> Pads the item into a consistent square aspect ratio
   */
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
        <img src="${aiUrl}" alt="Closet Item" loading="lazy">
        <p><small>Added: ${dateAdded}</small></p>
        <p class="carbon-stat">🌱 2.5kg CO2 Prevented</p>
    `;

  // Use prepend so new items appear at the start of the grid
  grid.prepend(card);
}
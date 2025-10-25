let appendedCanvases = []; 
let rotationDirection = 'clockwise'; 

function doImages() {
  const upperImage = selection.upper.image;
  const lowerImage = selection.lower.image;

  // Check if the images are loaded
  if (!upperImage.complete || !lowerImage.complete) {
    console.error("One or both images are not fully loaded.");
    return;
  }

  const upperPageNum = selection.upper.pageNumber;
  const lowerPageNum = selection.lower.pageNumber;

  // Create a canvas element to stitch the images
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Define the canvas width and height dynamically based on images
  let totalWidth = 0;
  let totalHeight = 0;

  const fullWidth = window.outerWidth;

  scaleFactor = 1


  // Check if upper and lower are the same page
  if (upperPageNum === lowerPageNum) {
    // If same page, just use the full image for upper and lower
    const img = selection.upper.image;
    imageWidth = img.width;
    imageHeight = selection.lower.y - selection.upper.y 

    totalWidth = imageWidth;
    totalHeight = imageHeight;
    
    if (totalHeight > fullWidth) {
          scaleFactor = fullWidth / totalHeight;
          totalHeight = totalHeight * scaleFactor; 
          totalWidth =  totalWidth  * scaleFactor;
    } 

    canvas.width = totalWidth;
    canvas.height = totalHeight;
    
    ctx.drawImage(img, 0, selection.upper.y, imageWidth, imageHeight, 0, 0, imageWidth * scaleFactor , imageHeight * scaleFactor);

  }
  // -----------------------------------
  else {
    // If different pages, calculate the range of pages
    const startPage = upperPageNum;
    const endPage =   lowerPageNum;
    
    totalWidth = Math.max(upperImage.width, lowerImage.width);

    const s_height = upperImage.height - selection.upper.y
    totalHeight = s_height // then we grow this

    const lower_s_height = selection.lower.y;
    totalHeight += lower_s_height

  


    // Adjusting totalHeight if it exceeds screen size
    if (totalHeight > fullWidth) {
          scaleFactor = fullWidth / totalHeight;
          totalHeight = totalHeight * scaleFactor; 
          totalWidth =  totalWidth  * scaleFactor;
        } 



    canvas.width = totalWidth;
    canvas.height = totalHeight;


    // Draw the upper image with scaling
    ctx.drawImage(upperImage, 0, selection.upper.y, upperImage.width, s_height, 0, 0, upperImage.width * scaleFactor, s_height * scaleFactor);

    // Current position to start drawing next image(s)
    let currentYPosition = s_height * scaleFactor; // Adjust currentYPosition based on scaleFactor

    // Draw the lower image with scaling
    ctx.drawImage(lowerImage, 0, 0, upperImage.width, lower_s_height, 0, currentYPosition, upperImage.width * scaleFactor, lower_s_height * scaleFactor);

  }


  

  const rotatedCanvas = document.createElement('canvas');
  const rotatedCtx = rotatedCanvas.getContext('2d');


  rotatedCanvas.width = totalHeight;  // After rotation, the height becomes the width
  rotatedCanvas.height = totalWidth;  // After rotation, the width becomes the height
  


  rotatedCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);  // Move to the center of the canvas
  //rotatedCtx.rotate(Math.PI / 2);  // Rotate 90 degrees clockwise
  // Rotate based on direction
    if (rotationDirection === 'clockwise') {
        rotatedCtx.rotate(Math.PI / 2);  // 90 degrees clockwise
    } else {
        rotatedCtx.rotate(-Math.PI / 2);  // 90 degrees counterclockwise
    } 

  rotatedCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);


  // Apply styles to position the canvas
  rotatedCanvas.style.position = 'absolute';  // Position the canvas absolutely


  //let centerX = (upperDiv.offsetWidth - rotatedCanvas.width) / 2;
  let centerX = (fullWidth - rotatedCanvas.width) / 2;

  rotatedCanvas.style.left = `${centerX}px`;
  
  let positionOffset = selection.lower.y ;

  rotatedCanvas.style.top = `${lowerImage.offsetTop + positionOffset - (rotatedCanvas.height)}px`;   // Align it based on where the lower click is 
  // rotatedCanvas.style.top = `${lowerImage.offsetTop + positionOffset - (rotatedCanvas.height/2)}px`; 
  rotatedCanvas.style.zIndex = '100';  

  document.body.appendChild(rotatedCanvas);  
  appendedCanvases.push(rotatedCanvas);

  
  rotatedCanvas.style.marginTop = '20px';
  rotatedCanvas.style.border = '1px solid #000'; 
  rotatedCanvas.style.overflowX = "scroll"; // Horizontal scroll if the width exceeds screen
  rotatedCanvas.style.whiteSpace = "nowrap"; 

  console.log('Canvas rendered.');
}



selection = {
        upper: null,
        lower: null,
    };



function start() {

    // Click Event for Image Selection
    function selectRegion(event) {
        const img = event.target; // Get the image
        const imageHeight = img.naturalHeight;
        const rect = img.getBoundingClientRect();
        const imgNumber = img.alt.match(/\d+/)[0];

        const yOffset = event.clientY - rect.top;  // Get the click position relative to the div


        if (!selection.upper) {
            // First click: set upper bound
            selection.upper = { image:img, pageNumber: imgNumber, y: yOffset, height: imageHeight };
        } else
        if (!selection.lower) {
            selection.lower = { image:img, pageNumber: imgNumber, y: yOffset, height: imageHeight };
            if (selection.lower.pageNumber < selection.upper.pageNumber || (selection.lower.pageNumber === selection.upper.pageNumber && selection.lower.y < selection.upper.y)) {
                // Swap the selections if the lower page number is less than the upper, or if the page numbers are the same but the yOffset is less
                const temp = selection.upper;
                selection.upper = selection.lower;
                selection.lower = temp;
            }


            doImages();

            // Clear selection after processing
            selection = { upper: null, lower: null };
        }
    }

    // Initialize image click listeners
    function initSelection() {
        // Step 1: Get all images inside divs with class 'w-full mx-auto center'
        const images = document.querySelectorAll('div.w-full.mx-auto.center img');

        // Step 2: Iterate through each image and add a click event listener
        images.forEach(img => {
            img.removeEventListener('click', selectRegion); 
            img.addEventListener('click', selectRegion );
        });

    }

    initSelection();

    // Function to undo (remove the last appended canvas)
    function undo() {
      if (appendedCanvases.length > 0) {
        const lastCanvas = appendedCanvases.pop();  // Remove the last canvas from the array
        document.body.removeChild(lastCanvas);  // Remove it from the DOM
      }
    }

    // Toggle the rotation direction
    function toggleRotationDirection() {
        rotationDirection = (rotationDirection === 'clockwise') ? 'counterclockwise' : 'clockwise';
        if (rotationDirection === 'clockwise') {
        rotateButton.textContent = 'Toggle Rotation Direction ↻';
        } else {
            rotateButton.textContent = 'Toggle Rotation Direction ↺';
        }
    }


    // Create the container div to hold the buttons
    let buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.left = '20px';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.zIndex = '9999';  // Ensure it stays on top of other elements
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'flex-start';  // Align buttons to the left
    buttonContainer.style.gap = '15px';  // Add gap between buttons

    // Create the GitHub button
    let githubButton = document.createElement('button');
    githubButton.textContent = 'GitHub';
    githubButton.style.padding = '12px 24px';
    githubButton.style.backgroundColor = '#24292f';  // GitHub dark blue
    githubButton.style.color = '#fff';
    githubButton.style.border = 'none';
    githubButton.style.borderRadius = '8px';
    githubButton.style.fontSize = '16px';
    githubButton.style.fontWeight = 'bold';
    githubButton.style.cursor = 'pointer';
    githubButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    githubButton.onclick = function() {
        window.open('https://github.com/HorizontalEnjoyer/HorizontalReading', '_blank');
    };

    // Create the Discord button
    let discordButton = document.createElement('button');
    discordButton.textContent = 'Discord';
    discordButton.style.padding = '12px 24px';
    discordButton.style.backgroundColor = '#7289da';  // Discord blue
    discordButton.style.color = '#fff';
    discordButton.style.border = 'none';
    discordButton.style.borderRadius = '8px';
    discordButton.style.fontSize = '16px';
    discordButton.style.fontWeight = 'bold';
    discordButton.style.cursor = 'pointer';
    discordButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    discordButton.onclick = function() {
        window.open('https://discord.gg/FdN9NsSZ', '_blank');
    };

    // Create the Undo button
    let undoButton = document.createElement('button');
    undoButton.textContent = 'Undo ↩';
    undoButton.style.padding = '12px 24px';
    undoButton.style.backgroundColor = '#007bff';  // Blue
    undoButton.style.color = '#fff';
    undoButton.style.border = 'none';
    undoButton.style.borderRadius = '8px';
    undoButton.style.fontSize = '16px';
    undoButton.style.fontWeight = 'bold';
    undoButton.style.cursor = 'pointer';
    undoButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    undoButton.onclick = undo;

    let rotateButton = document.createElement('button');
    rotateButton.textContent = 'Toggle Rotation Direction';
    rotateButton.style.padding = '12px 24px';
    rotateButton.style.backgroundColor = '#28a745'; // Green
    rotateButton.style.color = '#fff';
    rotateButton.style.border = 'none';
    rotateButton.style.borderRadius = '8px';
    rotateButton.style.fontSize = '16px';
    rotateButton.style.cursor = 'pointer';
    rotateButton.onclick = toggleRotationDirection;



    // Append buttons to the container
    buttonContainer.appendChild(githubButton);
    buttonContainer.appendChild(discordButton);
    buttonContainer.appendChild(undoButton);
    buttonContainer.appendChild(rotateButton);

    // Append the container to the body
    document.body.appendChild(buttonContainer);
}

start()
//document.addEventListener('DOMContentLoaded', start);



// ------------- canvas --------------
var canvas = new fabric.Canvas("canvas", {
  width: 800,
  height: 400,
});

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: "green",
  width: 20,
  height: 20,
});

const handleOpenTab = async (tabId) => {
  try {
    const tabElements = document.querySelectorAll(".tab_content");
    tabElements.forEach((tab) => tab.classList.add("hidden"));

    if (tabId.toLowerCase() === "images") {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            // Render images
            const imageContainer = document.getElementById("images");
            imageContainer.innerHTML = ""; // Clear existing content
            data.forEach(function (image) {
              const img = document.createElement("img");
              img.src = image.download_url;
              img.alt = image.author;
              img.classList.add("cursor-pointer");
              img.onclick = function () {
                imageAdd(img);
              };
              imageContainer.appendChild(img);
            });
          } else {
            throw new Error("Failed to fetch images");
          }
        }
      };
      xhr.open("GET", "https://picsum.photos/v2/list", true);
      xhr.send();
    }

    // Show the clicked tab content
    document.getElementById(tabId).classList.remove("hidden");
  } catch (error) {
    console.error("Error handling tab:", error);
  }
};

// Function to delete selected objects from the canvas
const deleteSelected = () => {
  const activeObjects = canvas.getActiveObjects();
  activeObjects.forEach((object) => {
    canvas.remove(object);
  });
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

// handling (display/hide) the select and the delete button
const handleSelectionChange = () => {
  try {
    const deleteButton = document.getElementById("deleteButton");
    const fontSize_dropdown = document.getElementById("font_size_select");
    if (canvas.getActiveObject()) {
      deleteButton.classList.remove("hidden");
      if (canvas.getActiveObject().type === "textbox") {
        fontSize_dropdown.classList.remove("hidden");
      } else {
        fontSize_dropdown.classList.add("hidden");
      }
    } else {
      deleteButton.classList.add("hidden");
      fontSize_dropdown.classList.add("hidden");
    }
  } catch (error) {
    console.log("handleSelectionChange->>", error);
  }
};

// Add event listener for selection changes on the canvas
canvas.on("selection:created", handleSelectionChange);
canvas.on("selection:updated", handleSelectionChange);
canvas.on("selection:cleared", handleSelectionChange);

const imageAdd = (imgElement) => {
  try {
    const img = new Image();
    img.src = imgElement.src;
    img.onload = function () {
      const imgInstance = new fabric.Image(img, {
        left: canvas.width / 2 - img.width / 2,
        top: canvas.height / 2 - img.height / 2,
      });
      canvas.add(imgInstance);
    };
  } catch (error) {
    console.log("imageAdd->>", error);
  }
};

const addText = (textValue, fontSize) => {
  try {
    const text = new fabric.Textbox(textValue, {
      left: 300,
      top: 200,
      width: 200,
      fontSize: fontSize,
      fill: "black",
      opacity: 1,
    });
    canvas.add(text);
  } catch (error) {
    console.log("addText->>", error);
  }
};

const updateTextboxFontSize = () => {
  try {
    const fontSizeSelect = document.getElementById("font_size_select");
    const selectedFontSize = document.getElementById("font_size_select").value;
    const textbox = canvas.getActiveObject();

    if (textbox && textbox.type === "textbox" && selectedFontSize) {
      textbox.set("fontSize", parseInt(selectedFontSize));
      canvas.renderAll();
    }
  } catch (error) {
    console.log("updateTextBoxFontSize->>", error);
  }
};

const changeCanvasBackgroundColor = (color) => {
  try {
    canvas.backgroundColor = color;
    canvas.renderAll();
  } catch (error) {
    console.log("changeCanvasBackgroundColor->>", error);
  }
};

const downloadCanvas = () => {
  try {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas_image.png";
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.log("downloadCanvas->>", error);
  }
};

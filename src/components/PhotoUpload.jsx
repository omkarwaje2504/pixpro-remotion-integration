"use client";
import { useState, useRef, useEffect } from "react";
import {
  FaUpload,
  FaTrashAlt,
  FaRedo,
  FaSearchPlus,
  FaSearchMinus,
  FaCrop,
  FaRegImage,
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaSave,
  FaSlidersH,
  FaArrowsAlt,
} from "react-icons/fa";

export default function PhotoUploadEditor() {
  // States for the photo editor
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState("none");
  const [editMode, setEditMode] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [cropArea, setCropArea] = useState({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setFilename(file.name);
        // Reset all edit states when a new image is uploaded
        setRotation(0);
        setZoom(1);
        setFilter("none");
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image rotation
  const rotateImage = (direction = 1) => {
    setRotation((prev) => (prev + 90 * direction) % 360);
  };

  // Handle zoom in/out
  const handleZoom = (direction) => {
    setZoom((prev) => {
      const newZoom = direction > 0 ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newZoom, 0.5), 3); // Limit zoom between 0.5x and 3x
    });
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setImage(null);
    setFilename("");
    setRotation(0);
    setZoom(1);
    setFilter("none");
    setEditMode(null);
    setPosition({ x: 0, y: 0 });
  };

  // Handle crop mode toggle
  const toggleCropMode = () => {
    if (editMode === "crop") {
      setEditMode(null);
    } else {
      setEditMode("crop");
      setCropArea({ x: 10, y: 10, width: 80, height: 80 }); // Default to 80% crop area
    }
  };

const applyCrop = () => {
  if (!imageRef.current) return;

  const img = imageRef.current;
  const canvas = document.createElement("canvas");

  const naturalWidth = img.naturalWidth;
  const naturalHeight = img.naturalHeight;

  const displayWidth = img.clientWidth;
  const displayHeight = img.clientHeight;

  const scaleX = naturalWidth / displayWidth;
  const scaleY = naturalHeight / displayHeight;

  // Get crop area in percent of the visible container
  const cropLeftPx = (cropArea.x / 100) * displayWidth;
  const cropTopPx = (cropArea.y / 100) * displayHeight;
  const cropWidthPx = (cropArea.width / 100) * displayWidth;
  const cropHeightPx = (cropArea.height / 100) * displayHeight;

  // Adjust for image movement (marginLeft/marginTop)
  const cropX = (cropLeftPx - position.x) * scaleX;
  const cropY = (cropTopPx - position.y) * scaleY;
  const cropW = cropWidthPx * scaleX;
  const cropH = cropHeightPx * scaleY;

  // Guard: Prevent invalid values
  if (cropX < 0 || cropY < 0 || cropX + cropW > naturalWidth || cropY + cropH > naturalHeight) {
    alert("Crop area is outside the image bounds.");
    return;
  }

  canvas.width = cropW;
  canvas.height = cropH;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  canvas.toBlob((blob) => {
    if (blob) {
      const croppedUrl = URL.createObjectURL(blob);
      setImage(croppedUrl);
      setEditMode(null);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      // Optional: emit blob to parent here if needed
    }
  }, "image/png");
};


  // Handle image dragging for positioning
  const handleMouseDown = (e) => {
    if (editMode !== "crop" && image) {
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (dragStart && editMode !== "crop") {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  // Reset all edits
  const resetEdits = () => {
    setRotation(0);
    setZoom(1);
    setFilter("none");
    setPosition({ x: 0, y: 0 });
    setEditMode(null);
  };

  // Set up event listeners for mouse move and up
  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (dragStart) {
        handleMouseMove(e);
      }
    };

    const handleMouseUpGlobal = () => {
      if (dragStart) {
        handleMouseUp();
      }
    };

    window.addEventListener("mousemove", handleMouseMoveGlobal);
    window.addEventListener("mouseup", handleMouseUpGlobal);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [dragStart]);

  // Filters available for the image
  const filters = [
    { name: "None", value: "none", style: {} },
    {
      name: "Grayscale",
      value: "grayscale",
      style: { filter: "grayscale(100%)" },
    },
    { name: "Sepia", value: "sepia", style: { filter: "sepia(100%)" } },
    {
      name: "Contrast",
      value: "contrast",
      style: { filter: "contrast(150%)" },
    },
    {
      name: "Brightness",
      value: "brightness",
      style: { filter: "brightness(120%)" },
    },
    { name: "Blur", value: "blur", style: { filter: "blur(2px)" } },
    { name: "Invert", value: "invert", style: { filter: "invert(80%)" } },
    {
      name: "Saturate",
      value: "saturate",
      style: { filter: "saturate(200%)" },
    },
  ];

  // Get the style for the current filter
  const currentFilterStyle =
    filters.find((f) => f.value === filter)?.style || {};

  return (
    <div className="bg-gray-900 rounded-lg max-w-3xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-white mb-6">
        Photo Upload & Editor
      </h2>

      {/* Upload Area */}
      {!image ? (
        <div
          className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 text-center h-80 flex flex-col items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                setImage(event.target.result);
                setFilename(file.name);
              };
              reader.readAsDataURL(file);
            }
          }}
        >
          <div className="text-gray-400 mb-4 bg-gray-800 p-4 rounded-full">
            <FaRegImage size={48} />
          </div>
          <p className="text-gray-300 mb-4 text-lg">
            Drag and drop your photo here, or click to browse
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Supported formats: JPG, PNG, WEBP
          </p>

          <label className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded cursor-pointer transition duration-200">
            Select Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => rotateImage(1)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white flex items-center"
                title="Rotate"
              >
                <FaRedo size={20} />
              </button>

              <button
                onClick={() => handleZoom(1)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white flex items-center"
                title="Zoom In"
              >
                <FaSearchPlus size={20} />
              </button>

              <button
                onClick={() => handleZoom(-1)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white flex items-center"
                title="Zoom Out"
                disabled={zoom <= 0.5}
              >
                <FaSearchMinus size={20} />
              </button>

              <button
                onClick={toggleCropMode}
                className={`p-2 rounded-lg text-white flex items-center ${editMode === "crop" ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
                title="Crop"
              >
                <FaCrop size={20} />
              </button>

              <div className="relative inline-block">
                <button
                  onClick={() =>
                    setEditMode((prev) => (prev === "filter" ? null : "filter"))
                  }
                  className={`p-2 rounded-lg text-white flex items-center ${editMode === "filter" ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
                  title="Filters"
                >
                  <FaSlidersH size={20} />
                </button>

                {editMode === "filter" && (
                  <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-lg p-4 z-50 w-64">
                    <h3 className="text-white font-medium mb-2">Filters</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filters.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => handleFilterChange(f.value)}
                          className={`p-2 rounded text-center text-sm ${filter === f.value ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetEdits}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white flex items-center"
                title="Reset Edits"
              >
                <FaSyncAlt size={20} />
              </button>

              <button
                onClick={handleRemoveImage}
                className="bg-red-600 hover:bg-red-700 p-2 rounded-lg text-white flex items-center"
                title="Remove Image"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>

          {/* Image Preview Area */}
          <div
            className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center h-80"
            ref={containerRef}
          >
            <div
              className="relative"
              style={{
                cursor: dragStart
                  ? "grabbing"
                  : editMode === "crop"
                    ? "default"
                    : "grab",
              }}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imageRef}
                src={image}
                alt="Preview"
                className="max-h-80 transition-all duration-200"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: "center",
                  ...currentFilterStyle,
                  marginLeft: `${position.x}px`,
                  marginTop: `${position.y}px`,
                }}
              />

              {editMode === "crop" && (
                <div className="absolute inset-0 bg-black bg-opacity-50">
                  <div
                    className="absolute border-2 border-white"
                    style={{
                      left: `${cropArea.x}%`,
                      top: `${cropArea.y}%`,
                      width: `${cropArea.width}%`,
                      height: `${cropArea.height}%`,
                    }}
                  >
                    {/* Crop handles */}
                    <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                  </div>

                  {/* Crop confirmation buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white flex items-center"
                    >
                      <FaTimes size={20} />
                    </button>
                    <button
                      onClick={applyCrop}
                      className="bg-green-600 hover:bg-green-700 p-2 rounded-lg text-white flex items-center"
                    >
                      <FaCheck size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Info & Controls */}
          <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div className="text-white">
              <p className="text-sm text-gray-400">Filename: {filename}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm mr-2">Zoom: {zoom.toFixed(1)}x</span>
                <span className="text-sm">Rotation: {rotation}°</span>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg text-white flex items-center">
              <FaSave size={20} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 text-gray-400 text-sm">
        <h3 className="text-white text-lg font-medium mb-2">
          Photo Requirements
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Upload a professional, high-quality headshot</li>
          <li>Make sure your face is clearly visible with good lighting</li>
          <li>Professional attire recommended</li>
          <li>Neutral background works best for cinema advertisements</li>
          <li>Minimum resolution: 1000x1000 pixels</li>
        </ul>
      </div>
    </div>
  );
}

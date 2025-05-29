"use client";

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Cropper, CropperRef, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";
import { getMimeType } from "advanced-cropper/extensions/mimes";
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
} from "react-icons/fa";
import Button from "./Button";

export default function PhotoUploadEditor() {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const cropperRef = useRef(null);

  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState("none");
  const [editMode, setEditMode] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [filename, setFilename] = useState("");

  const filters = [
    { name: "None", value: "none", style: {} },
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
    {
      name: "Saturate",
      value: "saturate",
      style: { filter: "saturate(200%)" },
    },
  ];

  const currentFilterStyle =
    filters.find((f) => f.value === filter)?.style || {};

  const onUpload = () => {
    inputRef.current?.click();
  };

  const onLoadImage = (event) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      const blob = URL.createObjectURL(file);
      const typeFallback = file.type;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          src: blob,
          type: getMimeType(e.target?.result, typeFallback),
        });

        setOriginalImage({
          src: blob,
          type: getMimeType(e.target?.result, typeFallback),
        });
        setFilename(file.name);
        setEditMode("crop");
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = "";
  };

  const rotateImage = (direction) => {
    setRotation((prev) => prev + 90 * direction);
  };

  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(0.5, Math.min(prev + delta * 0.1, 3)));
  };

  const handleFilterChange = (value) => {
    setEditMode("");
    setFilter(value);
  };
  const resetEdits = () => {
    if (originalImage) {
      setImage(originalImage);
    }
    setZoom(1);
    setRotation(0);
    setFilter("none");
    setEditMode(null);
    setPosition({ x: 0, y: 0 });
  };

  const toggleCropMode = () => {
    setEditMode((prev) => (prev === "crop" ? null : "crop"));
  };

  const handleRemoveImage = () => {
    if (image?.src) URL.revokeObjectURL(image.src);
    setZoom(1);
    setRotation(0);
    setFilter("none");
    setEditMode(null);
    setPosition({ x: 0, y: 0 });
    setImage(null);
    setOriginalImage(null);
    setFilename("");
  };
  const saveCroppedImage = () => {
    const canvas = cropperRef.current?.getCanvas();
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const croppedImage = {
        src: dataUrl,
        type: "image/png",
      };
      setImage(croppedImage);
      setEditMode(null);
    }
  };

  useEffect(() => {
    return () => {
      if (image?.src) URL.revokeObjectURL(image.src);
    };
  }, [image]);

  return (
    <div className="bg-gray-900 rounded-lg max-w-3xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-white mb-6">
        Photo Upload & Editor
      </h2>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onLoadImage}
        style={{ display: "none" }}
      />

      {!image ? (
        <div
          className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 text-center h-80 flex flex-col items-center justify-center cursor-pointer"
          onClick={onUpload}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const fakeEvent = {
                target: { files: [file] },
                preventDefault: () => {},
              };
              onLoadImage(fakeEvent);
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
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => rotateImage(1)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white"
                title="Rotate"
              >
                <FaRedo size={20} />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(1)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white"
                title="Zoom In"
              >
                <FaSearchPlus size={20} />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(-1)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white"
                title="Zoom Out"
              >
                <FaSearchMinus size={20} />
              </button>
              <button
                type="button"
                onClick={toggleCropMode}
                className={`p-2 rounded-lg text-white ${editMode === "crop" ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
                title="Crop"
              >
                <FaCrop size={20} />
              </button>
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() =>
                    setEditMode((prev) => (prev === "filter" ? null : "filter"))
                  }
                  className={`p-2 rounded-lg text-white ${editMode === "filter" ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"}`}
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
                          type="button"
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
                type="button"
                onClick={resetEdits}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white"
                title="Reset Edits"
              >
                <FaSyncAlt size={20} />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-600 hover:bg-red-700 p-2 rounded-lg text-white"
                title="Remove Image"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>

          <div className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center h-80">
            <img
              ref={imageRef}
              src={image.src}
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
              <div className="absolute inset-0">
                <Cropper
                  ref={cropperRef}
                  src={image?.src}
                  stencilComponent={CircleStencil}
                  stencilProps={{ aspectRatio: 1 }}
                  imageClassName="cropper-image"
                  className="cropper"
                  backgroundClassName="cropper-bg"
                  canvas={true}
                  checkOrientation={true}
                  imageRestriction="stencil"
                  priority="coordinates"
                  transformImage={{ adjustStencil: true }}
                  transitions={true}
                />
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row  justify-between items-center">
            <div className="text-white mb-2 md:mb-0">
              <p className="text-sm text-gray-400">Filename: {filename}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm mr-2">Zoom: {zoom.toFixed(1)}x</span>
                <span className="text-sm">Rotation: {rotation}°</span>
              </div>
            </div>
            <Button
              type="button"
              fullWidth={false}
              leftIcon={<FaSave size={20} className="mr-2" />}
              onClick={saveCroppedImage}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

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

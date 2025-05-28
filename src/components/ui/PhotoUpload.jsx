"use client";

import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Cropper, CropperRef,CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";

export default function PhotoUploadEditor() {
  const inputRef = useRef(null);
  const cropperRef = useRef(null);

  const [image, setImage] = useState(
    "https://play-lh.googleusercontent.com/IkcyuPcrQlDsv62dwGqteL_0K_Rt2BUTXfV3_vR4VmAGo-WSCfT2FgHdCBUsMw3TPGU",
  );

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      const newTab = window.open();
      if (newTab && canvas) {
        newTab.document.body.innerHTML = `<img src="${canvas.toDataURL()}"></img>`;
      }
    }
  };

  const onLoadImage = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="example">
      <div className="example__cropper-wrapper">
        <Cropper
          ref={cropperRef}
          className="example__cropper"
          backgroundClassName="example__cropper-background"
          src={image}
          stencilComponent={CircleStencil}
          stencilProps={{
            aspectRatio: 1 / 1,
            grid: true,
          }}
        />
      </div>
      <div className="example__buttons-wrapper">
        <button className="example__button" onClick={onUpload}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onLoadImage}
          />
          Upload image
        </button>
        {image && (
          <button className="example__button" onClick={onCrop}>
            Download result
          </button>
        )}
      </div>
    </div>
  );
}

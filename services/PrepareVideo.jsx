"use client"

import { useEffect, useRef } from "react";

export default function PrepareVideo({ composition }) {
  const canvasRef = useRef(null);
  const totalFrames = 150;
  const fps = 30;
  const width = 1280;
  const height = 720;
  const props = { name: "Omkar" };

  useEffect(() => {
    window.Module = {
      onRuntimeInitialized: () => {
        console.log("✅ FFmpeg WASM runtime initialized");
      },
    };

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    (async () => {
      try {
        await loadScript(
          "https://pixpro-video-generation.s3.ap-south-1.amazonaws.com/ffmpeg/ffmpeg.min.js",
        );
        await loadScript("/bundle.js"); // ✅ dynamically loads Remotion renderer

        console.log("✅ All scripts loaded");
        handleRender();
      } catch (err) {
        console.error("❌ Failed to load script:", err);
      }
    })();

    return () => {
      delete window.renderRemotionFrame;
      delete window.Module;
    };
  }, []);

  const handleRender = async () => {
    console.log("Preparing to render video...");
    if (!window.renderRemotionFrame) {
      alert("renderRemotionFrame not found");
      return;
    }

    console.log("Starting video rendering...");

    const { createFFmpeg, fetchFile } = window.FFmpeg;
    const ffmpeg = createFFmpeg({
      log: true,
    });

    await ffmpeg.load();

    for (let frame = 0; frame < totalFrames; frame++) {
      console.log("Rendering frame ${frame}");
      await window.renderRemotionFrame({
        canvas: canvasRef.current,
        frame,
        width,
        height,
        props,
        composition,
      });

      const blob = await new Promise((resolve) =>
        canvasRef.current.toBlob(resolve, "image/png"),
      );
      const buffer = await blob.arrayBuffer();
      ffmpeg.FS("writeFile", `frame${frame}.png`, new Uint8Array(buffer));
    }

    console.log("Encoding video...");
    await ffmpeg.run(
      "-framerate",
      `${fps}`,
      "-i",
      "frame%d.png",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "output.mp4",
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
    const url = URL.createObjectURL(videoBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "remotion-render.mp4";
    a.click();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      className="hidden"
      height={height}
      style={{
        background: "#fff",
        display: "block",
        margin: "20px auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    />
  );
}

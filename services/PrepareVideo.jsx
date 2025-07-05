"use client";

import { useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function PrepareVideo({ composition }) {
  const canvasRef = useRef(null);
  const totalFrames = 30;
  const fps = 30;
  const width = 1280;
  const height = 720;
  const props = { name: "Omkar" };

  useEffect(() => {
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
        // ✅ Load Remotion renderer that defines window.renderRemotionFrame
        await loadScript("/pixpro-remotion-integration/bundle.js");

        if (typeof window.renderRemotionFrame !== "function") {
          throw new Error("❌ renderRemotionFrame not loaded.");
        }

        // ✅ FFmpeg setup (keep your version)
        const ffmpeg = new FFmpeg({ log: true });
        await ffmpeg.load();

        for (let frame = 0; frame < totalFrames; frame++) {
          console.log(`Rendering frame ${frame}`);
          await window.renderRemotionFrame({
            canvas: canvasRef.current,
            frame,
            width,
            height,
            props,
            composition,
          });

          const blob = await new Promise((res) =>
            canvasRef.current.toBlob(res, "image/png"),
          );
          const buffer = await blob.arrayBuffer();
          await ffmpeg.writeFile(`frame${frame}.png`, new Uint8Array(buffer));
        }

        console.log("Encoding...");
        await ffmpeg.exec([
          "-framerate",
          "30",
          "-i",
          "frame%d.png",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "output.mp4",
        ]);

        const data = await ffmpeg.readFile("output.mp4");
        const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
        const url = URL.createObjectURL(videoBlob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "remotion-render.mp4";
        a.click();
      } catch (err) {
        console.error("❌ Error during rendering:", err);
      }
    })();

    return () => {
      delete window.renderRemotionFrame;
    };
  }, []);

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

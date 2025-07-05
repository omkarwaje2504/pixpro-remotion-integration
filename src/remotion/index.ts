import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
import MyVideo from "./Video";
import React from "react";
import ReactDOM from "react-dom/client";
import html2canvas from "html2canvas";

declare global {
  interface Window {
    renderRemotionFrame: (options: {
      canvas: HTMLCanvasElement;
      frame: number;
      width: number;
      height: number;
      props: any;
    }) => Promise<void>;
  }
}

registerRoot(RemotionRoot);

// ✅ No Internals.setFrame()
window.renderRemotionFrame = async ({ canvas, frame, width, height, props }) => {
  const container = document.createElement("div");
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  const FrameWrapper = () =>
    React.createElement(MyVideo, {
      ...(typeof props === "object" ? props : {}),
      frame, // ✅ pass frame explicitly
    });

  const root = ReactDOM.createRoot(container);

  await new Promise((res) => {
    root.render(React.createElement(FrameWrapper));
    setTimeout(res, 50); // wait for render
  });

  const snapshot = await html2canvas(container, { width, height });
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(snapshot, 0, 0);

  root.unmount();
  container.remove();
};

import { registerRoot, useCurrentFrame } from 'remotion';
import MyVideo from './Video';
import { RemotionRoot } from './Root';
import React from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';

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

window.renderRemotionFrame = async ({
  canvas,
  frame,
  width,
  height,
  props,
}: {
  canvas: HTMLCanvasElement;
  frame: number;
  width: number;
  height: number;
  props: any;
}) => {
  // Create a hidden container
  const container = document.createElement('div');
  container.style.width = width + 'px';
  container.style.height = height + 'px';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  const FrameWrapper = () => {
    const FrameContext = require('remotion').Internals.useCurrentFrame;
    // Hack: mock current frame
    require('remotion').Internals.setFrame(frame);
    return React.createElement(MyVideo, props);
  };

  const root = ReactDOM.createRoot(container);
  await new Promise((res) => {
    root.render(React.createElement(FrameWrapper));
    setTimeout(res, 50); // wait for render
  });

  const resultCanvas = await html2canvas(container, {
    width,
    height,
  });

  const ctx = canvas.getContext('2d');
  ctx?.drawImage(resultCanvas, 0, 0);

  root.unmount();
  container.remove();
};

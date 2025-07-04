
import { AbsoluteFill, interpolate } from "remotion";

export const MyVideo: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      className="bg-teal-100 text-black text-xl font-bold"
      style={{ opacity }}
    >
      <h1 className="mx-auto my-auto text-4xl">Hello, {frame}!</h1>
    </AbsoluteFill>
  );
};

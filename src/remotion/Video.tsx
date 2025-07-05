import { AbsoluteFill, interpolate } from "remotion";

const MyVideo: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      className=" text-xl font-bold"
      style={{
        opacity,
        backgroundColor: `rgba(0, 0, 0, ${interpolate(frame, [0, 30], [0, 1])})`,
        color: `rgba(255, 255, 255, ${interpolate(frame, [0, 30], [0, 1])})`,
      }}
    >
      <h1 className="mx-auto my-auto text-4xl">Hello, {frame}!</h1>
    </AbsoluteFill>
  );
};

export default MyVideo;

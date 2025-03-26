// remotion/Video.tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const MyVideo: React.FC<{ name: string }> = ({ name }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill className="bg-teal-100 text-black text-xl font-bold" style={{ opacity }}>
      <h1 className='mx-auto my-auto text-4xl'>Hello, {name}!</h1>
    </AbsoluteFill>
  );
};

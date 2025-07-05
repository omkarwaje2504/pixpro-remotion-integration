import { Composition } from "remotion";
import MyVideo from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={40}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ frame: 0 }}
      />
    </>
  );
};

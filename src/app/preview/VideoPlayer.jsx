"use client";

import { Player } from "@remotion/player";
import { MyVideo } from "../../remotion/Video";

export default function VideoPlayer({ name }) {
  return (
    <Player
      component={MyVideo}
      inputProps={{ name }}
      durationInFrames={150}
      compositionWidth={1280}
      compositionHeight={720}
      fps={30}
      controls
    />
  );
}

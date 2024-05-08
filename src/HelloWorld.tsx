import Papa from "papaparse";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Video
} from "remotion";
import { Slide1 } from "./Slides/Slide1";
import { voices } from "./server/TextToSpeech/constants";
import { RequestMetadata, VoiceType } from "./lib/interfaces";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { useEffect, useState } from "react";
import { staticFile } from "remotion";

// Define the type for the CSV data
type ExtractedValues = {
  [key: string]: string;
};

// Define the schema for the CSV data
export const mySchema = z.object({
  dialogue: z.array(z.string()),
  titleColor: zColor(),
  voice: z.enum(
    Object.keys(voices) as [VoiceType] | [VoiceType, ...VoiceType[]]
  ),
  pitch: z.number().min(-20).max(20),
  speakingRate: z.number().min(0.25).max(4),
  audioUrl: z.string().nullable(),
});

export const HelloWorld: React.FC<RequestMetadata> = (props) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const opacity = interpolate(
    frame,
    [videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const transitionStart = 0;

  const [extractedValues, setExtractedValues] = useState<ExtractedValues | null>(
    null
  );

  return (
    <AbsoluteFill
      style={{
        flex: 1,
        background: "white",
        position: "relative",
      }}
    >
      {/* Background video */}
  

      {props.audioUrl && (
        <Audio id="TTS Audio" about="TTS Audio" src={props.audioUrl} />
      )}
      <div style={{ opacity }}>
        <Sequence from={transitionStart} durationInFrames={300}>
          <Slide1
            text1={props.dialogue[0]}
          />
        </Sequence>
        <Sequence from={300} durationInFrames={760 - 300}>
          <Slide1
            text1={props.dialogue[1]}
          />
        </Sequence>
        <Sequence from={760} durationInFrames={1227 - 760}>
          <Slide1
            text1={props.dialogue[2]}
          />
        </Sequence>
        <Sequence from={1227} durationInFrames={1488 - 1227}>
          <Slide1            
            text1={props.dialogue[3]}
          />
        </Sequence>
        <Sequence from={1488} durationInFrames={1965 - 1488}>
          <Slide1            
            text1={props.dialogue[4]}
          />
        </Sequence>
        <Sequence from={1965} durationInFrames={2401 - 1965}>
          <Slide1
            text1={props.dialogue[5]}
          />
        </Sequence>
        <Sequence from={2401}>
          <Slide1
            text1={props.dialogue[6]}
          />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

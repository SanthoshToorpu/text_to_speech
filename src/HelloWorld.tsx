import Papa from "papaparse";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig, Audio } from "remotion";
import { Slide1 } from "./Slides/Slide1";
import { voices } from "./server/TextToSpeech/constants";
import { RequestMetadata, VoiceType } from "./lib/interfaces";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { useEffect, useState } from "react";


// Define the type for the CSV data
type ExtractedValues = {
  [key: string]: string;
};

// Function to read CSV file and extract values within square brackets



// Define the schema for the CSV data
export const mySchema = z.object({
  titleText: z.string(),
  subtitleText: z.string(),
  titleColor: zColor(),
  voice: z.enum(
    Object.keys(voices) as [VoiceType] | [VoiceType, ...VoiceType[]],
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
    },
  );
  const transitionStart = 0;

  const [extractedValues, setExtractedValues] = useState<ExtractedValues | null>(null);


  return (
    <AbsoluteFill style={{ flex: 1, backgroundColor: "white" }}>
      {props.audioUrl && (
        <Audio id="TTS Audio" about="TTS Audio" src={props.audioUrl} />
      )}
      <div style={{ opacity }}>
        <Sequence from={transitionStart} durationInFrames={300}>
          <Slide1
            text1={`Namaskar ${extractedValues?.["Customer's Name"] ?? "John Doe"}! I'm ${extractedValues?.["Executive Name"] ?? "Michael Smith"} from ${extractedValues?.["Company Name"] ?? "Insurance Inc"}, your trusted insurance provider. Thank you for choosing us to protect what matters most to you.`}
          />
        </Sequence>
        <Sequence from={300} durationInFrames={760-300}>
          <Slide1
            text1={`Your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) offers comprehensive coverage tailored to your needs, with a tenure of ${extractedValues?.["Policy Tenure"] ?? "10"} years and a premium of ${extractedValues?.["Policy Premium"] ?? "100000"}, ensuring your peace of mind.`}
          />
        </Sequence>
        <Sequence from={760} durationInFrames={1227 - 760}>
          <Slide1
            text1={`Rest assured, ${extractedValues?.["Customer's Name"] ?? "John Doe"}, your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) is backed by ${extractedValues?.["Company Name"] ?? "Insurance Inc"}'s solid reputation and expertise, fully licensed and regulated for transparency and reliability. `}
          />
        </Sequence>
        <Sequence from={1227} durationInFrames={1488 - 1227}>
          <Slide1            
            text1={`Our policy specializes in personalized service, addressing your unique needs, from homeowners to business owners, with tailored solutions. Your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) covers accidents, disasters, and medical expenses, with a simple claims registration process via our website or dedicated claims team.`}
          />
        </Sequence>
        <Sequence from={1488} durationInFrames={1965 - 1488}>
          <Slide1            
            text1={` Your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) covers accidents, disasters, and medical expenses, with a simple claims registration process via our website or dedicated claims team.`}
          />
        </Sequence>
        <Sequence from={1965}>
          <Slide1
            text1={`For questions or assistance, reach us by phone, email, or visit our branches, where our friendly customer service team is ready to support you. Thank you, ${extractedValues?.["Customer's Name"] ?? "John Doe"}, for choosing us; your satisfaction is our priority. Let's ensure your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy serves you well.`}
          />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

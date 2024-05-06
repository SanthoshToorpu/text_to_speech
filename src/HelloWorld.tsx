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
const readCSV = async (csvFile: string): Promise<ExtractedValues> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      complete: (results) => {
        const data: unknown[][] = results.data as unknown[][];
        const extractedValues: ExtractedValues = {};
        // Loop through each row of the CSV data
        for (const row of data) {
          const keyMatch = String(row[0]).match(/\[(.*?)\]/);
          if (keyMatch) {
            const key = keyMatch[1]; // Extract value within square brackets
            const value = row[1];
            extractedValues[key] = value as string;
          }
        }
        resolve(extractedValues);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvFile = await fetch("text_to_speech\src\test.csv"); // Replace with your CSV file path
        const data = await csvFile.text();
        const values = await readCSV(data);
        setExtractedValues(values);
        console.log(values);
      } catch (error) {
        console.error("Error fetching or parsing CSV file:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <AbsoluteFill style={{ flex: 1, backgroundColor: "white" }}>
      {props.audioUrl && (
        <Audio id="TTS Audio" about="TTS Audio" src={props.audioUrl} />
      )}
      <div style={{ opacity }}>
        <Sequence from={transitionStart} durationInFrames={820}>
          <Slide1
            text1={`Namaskar ${extractedValues?.["Customer's Name"] ?? "John Doe"}! I'm ${extractedValues?.["Executive Name"] ?? "Michael Smith"} from ${extractedValues?.["Company Name"] ?? "Insurance Inc"}, your trusted insurance provider. Thank you for choosing us to protect what matters most to you.`}
            text2={`Your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) offers comprehensive coverage tailored to your needs, with a tenure of ${extractedValues?.["Policy Tenure"] ?? "10"} years and a premium of ${extractedValues?.["Policy Premium"] ?? "100000"}, ensuring your peace of mind.`}
          />
        </Sequence>
        <Sequence from={820} durationInFrames={2009 - 820}>
          <Slide1
            text1={`Rest assured, ${extractedValues?.["Customer's Name"] ?? "John Doe"}, your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) is backed by ${extractedValues?.["Company Name"] ?? "Insurance Inc"}'s solid reputation and expertise, fully licensed and regulated for transparency and reliability. Our policy specializes in personalized service, addressing your unique needs, from homeowners to business owners, with tailored solutions. Your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy (Policy ID: ${extractedValues?.["Policy ID"] ?? "134567"}) covers accidents, disasters, and medical expenses, with a simple claims registration process via our website or dedicated claims team.`}
            text2=""
          />
        </Sequence>
        <Sequence from={2009}>
          <Slide1
            text1={`For questions or assistance, reach us by phone, email, or visit our branches, where our friendly customer service team is ready to support you. Thank you, ${extractedValues?.["Customer's Name"] ?? "John Doe"}, for choosing us; your satisfaction is our priority. Let's ensure your ${extractedValues?.["Policy Name"] ?? "Life Insurance"} policy serves you well.`}
            text2=""
          />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Composition } from "remotion";
import { HelloWorld, mySchema } from "./HelloWorld";
import { getTTSFromServer } from "./lib/client-utils";
import { waitForNoInput } from "./debounce";

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  
  let dialogue = [
    "Namaskar John Doe! I'm Michael Smith from Insurance Inc, your trusted insurance provider. Thank you for choosing us to protect what matters most to you.",
    "Your Life Insurance policy (Policy ID: 123456) offers comprehensive coverage tailored to your needs, with a tenure of 10 years and a premium of 1000, ensuring your peace of mind.",
    "Rest assured, John Doe, your Life Insurance policy (Policy ID: 123456) is backed by Insurance Inc's solid reputation and expertise, fully licensed and regulated for transparency and reliability.",
    "Our policy specializes in personalized service, addressing your unique needs, from homeowners to business owners, with tailored solutions. Your Life Insurance policy (Policy ID: 123456) covers accidents, disasters, and medical expenses, with a simple claims registration process via our website or dedicated claims team.",
    "For questions or assistance, reach us by phone, email, or visit our branches, where our friendly customer service team is ready to support you.",
    "Thank you, John Doe, for choosing us; your satisfaction is our priority. Let's ensure your Life Insurance policy serves you well."
  ]

  return (
    <Composition
      id="HelloWorld"
      schema={mySchema}
      component={HelloWorld}
      durationInFrames={300}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        dialogue : dialogue,
        titleColor: "#2E8AEA" as const,
        voice: "Woman 1 (US)" as const,
        pitch: 0,
        speakingRate: 1,
        audioUrl: null,
      }}
      calculateMetadata={async ({ props, abortSignal }) => {
        await waitForNoInput(abortSignal, 1000);
        const audioUrl = await getTTSFromServer({ ...props });
        const audioDurationInSeconds =
          await getAudioDurationInSeconds(audioUrl);
        const calculatedVideoDuration = Math.ceil(audioDurationInSeconds);
        return {
          props: {
            ...props,
            audioUrl,
          },
          durationInFrames: 30 + calculatedVideoDuration * FPS,
        };
      }}
    />
  );
};

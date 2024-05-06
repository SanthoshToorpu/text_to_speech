import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Composition } from "remotion";
import { HelloWorld, mySchema } from "./HelloWorld";
import { getTTSFromServer } from "./lib/client-utils";
import { waitForNoInput } from "./debounce";

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  
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
        titleText:
          "Text to speech on Remotion using  Google Cloud and Firebase!" as const,
        subtitleText:
          "With these powerful tools, what will you build?" as const,
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

import { interpolate } from "remotion";
import { Audio, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RequestMetadata } from "../lib/interfaces";

interface SlideProps {
  text1: string;
  text2: string;
}

export const Slide1: React.FC<SlideProps> = (props) => {
  const { text1, text2 } = props;
  const videoConfig = useVideoConfig();
  const realFrame = useCurrentFrame();
  const frameAdjustedForSpeakingRate = realFrame * 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "66.66%", // Two-thirds of the screen
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            fontFamily: "SF Pro Text, Helvetica, Arial",
            fontSize: 24, // Smaller font size
            marginBottom: 20,
          }}
        >
          {text1.split(" ").map((t, i) => (
            <span
              key={t}
              style={{
                marginLeft: 10,
                marginRight: 10,
                transform: `scale(${spring({
                  fps: videoConfig.fps,
                  frame: frameAdjustedForSpeakingRate - i * 10, // Increased delay
                  config: {
                    damping: 100,
                    stiffness: 200,
                    mass: 0.5,
                  },
                })}`,
                display: "inline-block",
              }}
            >
              {t}
            </span>
          ))}
        </p>
        {frameAdjustedForSpeakingRate >= 360 && (
          <p
            style={{
              fontFamily: "SF Pro Text, Helvetica, Arial",
              fontSize: 24, // Smaller font size
              marginBottom: 20,
            }}
          >
            {text2.split(" ").map((t, i) => (
              <span
                key={t}
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  transform: `scale(${spring({
                    fps: videoConfig.fps,
                    frame: frameAdjustedForSpeakingRate - (360 + i * 10), // Adjusted delay
                    config: {
                      damping: 100,
                      stiffness: 200,
                      mass: 0.5,
                    },
                  })}`,
                  display: "inline-block",
                  opacity: interpolate(
                    frameAdjustedForSpeakingRate,
                    [360 + i * 10, 360 + i * 10 + 5],
                    [0, 1],
                    { extrapolateRight: "clamp" }
                  ),
                }}
              >
                {t}
              </span>
            ))}
          </p>
        )}
      </div>
      {/* Space for the image */}
      <div style={{ width: "33.33%" }} />
    </div>
  );
};
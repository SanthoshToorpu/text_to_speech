import md5 from "md5";
import {
  checkIfAudioHasAlreadyBeenSynthesized as isAudioAlreadySynthesized,
  createFirebaseUrl,
  uploadFileToFirebase,
} from "../../lib/firebase/utils";
import { audioDirectoryInBucket, voices } from "./constants";
import textToSpeech from "@google-cloud/text-to-speech";
import { RequestMetadata } from "../../lib/interfaces";

const client = new textToSpeech.TextToSpeechClient();

export const createTextToSpeechAudio = async (
  props: RequestMetadata,
): Promise<string> => {
  if (!voices[props.voice]) throw new Error("Voice not found");
  const selectedVoice = voices[props.voice];

  const ssml = `
<speak>
<prosody>
<emphasis level="strong">Namaskar John Doe! I'm Michael Smith from Insurance Inc, your trusted insurance provider. Thank you for choosing us to protect what matters most to you.

Your Life Insurance policy (Policy ID: 123456) offers comprehensive coverage tailored to your needs, with a tenure of 10 years and a premium of 1000, ensuring your peace of mind.

Rest assured, John Doe, your Life Insurance policy (Policy ID: 123456) is backed by Insurance Inc's solid reputation and expertise, fully licensed and regulated for transparency and reliability.

Our policy specializes in personalized service, addressing your unique needs, from homeowners to business owners, with tailored solutions. Your Life Insurance policy (Policy ID: 123456) covers accidents, disasters, and medical expenses, with a simple claims registration process via our website or dedicated claims team.

For questions or assistance, reach us by phone, email, or visit our branches, where our friendly customer service team is ready to support you.

Thank you, John Doe, for choosing us; your satisfaction is our priority. Let's ensure your Life Insurance policy serves you well.

</emphasis>
</prosody>
</speak>`;
  /**
   * * Determine directory name from SSML, directory in bucket, and voice name, to make a really unique fileName.
   * * Only hashing the SSML makes it easy to find specific voice audios in Firebase storage.
   */
  const ssmlHash = md5(`${ssml} ${props.speakingRate} ${props.pitch}`);
  const filePathInBucket = `${audioDirectoryInBucket}/${selectedVoice.name}-${ssmlHash}.mp3`;

  // Return URL if already exists
  const fileExists = await isAudioAlreadySynthesized(filePathInBucket);
  if (fileExists) return fileExists;

  // Create the TTS audio
  // https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize
  const [response] = await client.synthesizeSpeech({
    input: {
      ssml,
    },
    voice: {
      name: selectedVoice.name,
      languageCode: selectedVoice.languageCode,
    },
    audioConfig: {
      audioEncoding: "LINEAR16", // Higher quality than 'MP3'
      effectsProfileId: ["large-home-entertainment-class-device"], // Sounds better than small-devices
      speakingRate: props.speakingRate,
      pitch: props.pitch,
    },
  });
  // Upload the file to firebase
  const uploadedFile = await uploadFileToFirebase(
    response.audioContent as Uint8Array,
    filePathInBucket,
  );

  const { fullPath } = uploadedFile.metadata;

  return createFirebaseUrl(fullPath);
};

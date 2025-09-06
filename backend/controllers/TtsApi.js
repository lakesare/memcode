import OpenAI from 'openai';

class TtsApi {
  static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Convert text to speech using OpenAI TTS
  static generateSpeech = async (request, response) => {
    try {
      const { text, voice = 'alloy' } = request.body;
      
      if (!text) {
        return response.validation(['Text is required']);
      }

      // Limit text length to prevent abuse (OpenAI has its own limits)
      if (text.length > 1000) {
        return response.validation(['Text is too long (max 100 characters)']);
      }

      const ttsResponse = await TtsApi.openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: text.substring(0, 100), // Ensure we don't exceed limits
        speed: 1,
        voice: 'shimmer'
      });
      
      const buffer = Buffer.from(await ttsResponse.arrayBuffer());
      
      response.set('Content-Type', 'audio/mpeg');
      response.send(buffer);
      
    } catch (error) {
      console.error('TTS Error:', error);
      response.error('Failed to generate speech');
    }
  }
}

export default TtsApi;

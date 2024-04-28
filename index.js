
import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';

const speechFile = path.resolve("./speech.mp3");

// Initialize OpenAI API
const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
  };
const openai = new OpenAI(configuration);


// Load environment variables
config();

// Create a web server
const app = express();
const port = process.env.PORT || 3034;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// Define a route to handle questions
app.get('/ask-me', async (req, res) => {
  // Call the OpenAI API to generate an answer
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: "system", content: req.query.question }],
  });
  res.send(completion.data.choices[0].text);
});

// Text to speech Generator
app.get('/text-to-speech', async(req, res)=>{
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: req.query.question,
      });
      console.log(speechFile);
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
})


// speech to text Generator
app.get('/speech-to-text', async(req, res)=>{
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("/audio.mp3"),
        model: "whisper-1",
      });
    
      console.log(transcription.text);
})
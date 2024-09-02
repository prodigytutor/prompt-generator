// pages/api/openai.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import openai from '../../utils/openai';
import { OpenAIRequest, OpenAIResponse } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAIResponse | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body as OpenAIRequest;
      const v = `You are tasked to fixing a generative ai prompt. Instructions are as follows:

      you are an extraordinary prompt engineer and have been tasked wit proofing and correcting user prompts
            please correct the submitted prompt in detail, ensuring that the prompt is clear, concise, and free of errors
            and has everyting needed to complete the task.
      
      Instructions for the output format:
      - Output code without descriptions, unless it is important.
      - Minimize prose, comments and empty lines.
      - Only show the relevant code that needs to be modified. Use comments to represent the parts that are not modified.
      - Make it easy to copy and paste.
      - Consider other possibilities to achieve the result, do not be limited by the prompt.`
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: v}
            { role: "user", content: prompt }],
      });
      
      const generatedText = response.data.choices[0].message?.content || '';
      res.status(200).json({ result: generatedText });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
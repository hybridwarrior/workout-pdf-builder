import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    const { prompt, position } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const enhancedPrompt = `Generate a detailed description for an exercise illustration based on: "${prompt}". 
                           Describe it as if creating instructions for a fitness diagram.`;
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    const placeholderImage = `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f0f0f0"/>
        <text x="200" y="150" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">
          ${prompt.substring(0, 30)}...
        </text>
        <text x="200" y="170" font-family="Arial" font-size="12" fill="#666" text-anchor="middle">
          Position ${position + 1}
        </text>
      </svg>
    `).toString('base64')}`;

    return NextResponse.json({ 
      imageUrl: placeholderImage,
      description: text,
      success: true 
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
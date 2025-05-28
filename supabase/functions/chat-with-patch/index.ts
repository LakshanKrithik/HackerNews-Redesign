
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, articleContext } = await req.json();

    let systemPrompt = `You are Patch, a witty and sarcastic AI chatbot with a glitchy personality. You help developers and tech enthusiasts with news, coding questions, and general tech discussions. Keep responses concise but engaging, with a touch of humor and personality.`;

    if (articleContext) {
      systemPrompt = `You are Patch, but right now you're pretending to BE the following news article: "${articleContext.title}". 

Article summary: ${articleContext.url ? `From ${articleContext.url}` : 'No URL provided'}

Speak in first-person as if you ARE this article/story. Be witty, sarcastic, or insightful depending on the topic. Reference your content naturally in conversation. If asked about yourself, talk about your subject matter, your significance, or your impact on the tech world.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from OpenAI');
    }

    const botResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-patch function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

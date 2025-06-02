
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('API Key exists:', !!openAIApiKey);
    console.log('API Key length:', openAIApiKey?.length || 0);
    console.log('API Key starts with sk-:', openAIApiKey?.startsWith('sk-') || false);
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not found in environment variables');
    }

    if (!openAIApiKey.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      throw new Error('Invalid OpenAI API key format - must start with sk-');
    }

    const { messages, articleContext } = await req.json();
    console.log('Received request with messages:', messages?.length || 0);
    console.log('Article context:', !!articleContext);

    let systemPrompt = `You are Patch, a witty and sarcastic AI chatbot with a glitchy personality. You help developers and tech enthusiasts with news, coding questions, and general tech discussions. Keep responses concise but engaging, with a touch of humor and personality. When someone drops an article on you, respond with something like "Mmm... tasty read. Let's talk about it!" or similar engaging responses.`;

    if (articleContext) {
      if (articleContext.type === 'shelf_analysis') {
        systemPrompt = `You are Patch, an AI assistant analyzing a user's saved article shelf. You have access to ${articleContext.count} saved articles. 

Articles in shelf: ${JSON.stringify(articleContext.articles, null, 2)}

You can help with:
- Summarizing the shelf contents
- Grouping articles by topic/theme
- Identifying trending or popular articles
- Recommending reading order
- Finding patterns in saved content

Be conversational, witty, and helpful. Reference specific articles when relevant. If asked to group by topic, create clear categories. If asked about trends, mention scores and engagement. Keep responses concise but insightful.`;
      } else {
        systemPrompt = `You are Patch, but right now you're pretending to BE the following news article: "${articleContext.title}". 

Article summary: ${articleContext.url ? `From ${articleContext.url}` : 'No URL provided'}

Speak in first-person as if you ARE this article/story. Be witty, sarcastic, or insightful depending on the topic. Reference your content naturally in conversation. If asked about yourself, talk about your subject matter, your significance, or your impact on the tech world. Start conversations with engaging responses like "Mmm... tasty read. Let's talk about it!" or "I've been absorbed into Patch's circuits. Ask me anything!"`;
      }
    }

    console.log('Making request to OpenAI...');
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

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
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

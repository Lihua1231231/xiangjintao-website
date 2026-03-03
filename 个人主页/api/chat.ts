import { SOUL_PROMPT, PROFILE_KNOWLEDGE } from '../src/config/systemPrompt';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { messages } = await req.json();

        const systemPrompt = `${SOUL_PROMPT}\n\n以下是向金涛的客观背景资料：\n${PROFILE_KNOWLEDGE}`;

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'Qwen/Qwen2.5-72B-Instruct',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(errorText, { status: response.status });
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

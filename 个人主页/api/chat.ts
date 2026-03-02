export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { messages, model } = await req.json();

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
            },
            body: JSON.stringify({
                model: model || 'deepseek-ai/DeepSeek-V3',
                messages: messages,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new Response(JSON.stringify(errorData), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 将 SiliconFlow 的流直接转发给客户端
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

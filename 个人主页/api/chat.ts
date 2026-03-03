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

        // 过滤器：清理掉前端可能传来的历史系统提示词，防止角色设定失效
        const safeMessages = messages.filter((m: any) => m.role !== 'system');

        const currentDate = new Date().toLocaleDateString('zh-CN');
        const timeContext = `[系统强制提示：今天是现实世界中的 ${currentDate}。请严格基于此日期计算年龄或时间间隔。]\n`;
        const systemPrompt = `${timeContext}${SOUL_PROMPT}\n\n以下是向金涛的客观背景资料：\n${PROFILE_KNOWLEDGE}`;

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
                    ...safeMessages
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

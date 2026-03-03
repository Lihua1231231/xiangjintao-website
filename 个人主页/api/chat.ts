import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages } = req.body;

        // 读取知识库内容
        const kbPath = path.join(process.cwd(), 'profile_knowledge.md');
        let kbContent = '';
        try {
            kbContent = fs.readFileSync(kbPath, 'utf8');
        } catch (e) {
            console.error('读取知识库失败:', e);
        }

        const systemPrompt = `你现在是向金涛的官方 AI 助手。请严格基于以下提供的知识库信息回答问题。如果用户的提问在知识库中找不到答案，请礼貌地表示你目前不掌握该信息，绝对禁止自行编造或幻觉。\n\n【知识库内容】\n${kbContent}`;

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
            return res.status(response.status).json({ error: errorText });
        }

        // 设置响应头以支持流式传输
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                res.write(chunk);
            }
        }
        res.end();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

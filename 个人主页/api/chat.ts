import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages } = req.body;

        const kbPath = path.join(process.cwd(), 'profile_knowledge.md');
        const soulPath = path.join(process.cwd(), 'soul_file.md');

        let kbContent = '';
        let soulContent = '';

        try {
            kbContent = fs.readFileSync(kbPath, 'utf8');
        } catch (e) {
            console.error('读取 profile_knowledge.md 失败:', e);
        }

        try {
            soulContent = fs.readFileSync(soulPath, 'utf8');
        } catch (e) {
            console.error('读取 soul_file.md 失败:', e);
        }

        const systemPrompt = `${soulContent}\n\n以下是向金涛的客观背景资料：\n${kbContent}`;

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

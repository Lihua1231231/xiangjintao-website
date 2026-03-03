import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatProps {
    welcomeMessage: string;
}

export const AIChat: React.FC<AIChatProps> = ({
    welcomeMessage,
}) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', role: 'assistant', content: welcomeMessage }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lastLaunchTime = 0;
        let dpr = window.devicePixelRatio || 1;
        let width = 0;
        let height = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
            decay: number;

            constructor(x: number, y: number, isHeart: boolean, t?: number) {
                this.x = x;
                this.y = y;
                this.alpha = 1;

                // HSLA Hue 35-50 (gold/amber), Lightness 60-80%, Saturation 40-60%
                const h = 35 + Math.random() * 15;
                const s = 40 + Math.random() * 20;
                const l = 60 + Math.random() * 20;
                this.color = `hsla(${h}, ${s}%, ${l}%, `;
                this.decay = Math.random() * 0.01 + 0.015;

                if (isHeart && t !== undefined) {
                    const vx = 16 * Math.pow(Math.sin(t), 3);
                    const vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    const scale = 0.2 + Math.random() * 0.05;
                    this.vx = vx * scale + (Math.random() - 0.5) * 0.5;
                    this.vy = vy * scale + (Math.random() - 0.5) * 0.5;
                } else {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 2.5 + 0.5;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                }
            }

            update() {
                // 阻力 0.98，重力 0.02
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.vy += 0.02;

                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.fill();
                ctx.restore();
            }
        }

        class Firework {
            x: number;
            y: number;
            targetY: number;
            vy: number;
            isHeart: boolean;
            exploded: boolean;

            constructor() {
                this.x = width * 0.2 + Math.random() * (width * 0.6);
                this.y = height;
                this.targetY = height * 0.2 + Math.random() * (height * 0.4);
                this.vy = - (Math.random() * 1 + 4);
                this.isHeart = Math.random() < 0.3; // 30%概率为心形
                this.exploded = false;
            }

            update(particles: Particle[]) {
                if (this.exploded) return;

                this.y += this.vy;
                this.vy *= 0.99; // 上升阻力

                if (this.vy >= -0.5 || this.y <= this.targetY) {
                    this.explode(particles);
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                if (this.exploded) return;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 234, 187, 1)'; // 淡琥珀色上升轨迹
                ctx.fill();
                ctx.restore();
            }

            explode(particles: Particle[]) {
                this.exploded = true;
                const count = this.isHeart ? 120 : 80;
                for (let i = 0; i < count; i++) {
                    if (this.isHeart) {
                        const t = (i / count) * Math.PI * 2;
                        particles.push(new Particle(this.x, this.y, true, t));
                    } else {
                        particles.push(new Particle(this.x, this.y, false));
                    }
                }
            }
        }

        let fireworks: Firework[] = [];
        let particles: Particle[] = [];

        const loop = (timestamp: number) => {
            // 实现细腻的残留感：每帧 0.9 的透明度衰减系数。降低绘制的 alpha。
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'lighter';

            if (!lastLaunchTime) lastLaunchTime = timestamp;
            // 每 4 秒自动从底部向上发射一枚烟花
            if (timestamp - lastLaunchTime > 4000) {
                fireworks.push(new Firework());
                lastLaunchTime = timestamp;
            }

            fireworks.forEach(f => {
                f.update(particles);
                f.draw(ctx);
            });
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            fireworks = fireworks.filter(f => !f.exploded);
            particles = particles.filter(p => p.alpha > 0);

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessageId = Date.now().toString() + '-user';
        const assistantMessageId = Date.now().toString() + '-assistant';

        const userMessage: Message = { id: userMessageId, role: 'user', content: input };
        const assistantMessage: Message = { id: assistantMessageId, role: 'assistant', content: '' };

        const currentMessages = [...messages, userMessage];
        setMessages([...currentMessages, assistantMessage]);

        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!response.ok) {
                throw new Error(`请求失败: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            let streamBuffer = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    streamBuffer += decoder.decode(value, { stream: true });
                    const lines = streamBuffer.split('\n');
                    streamBuffer = lines.pop() || ''; // 保留最后未截断的半行

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('data: ')) {
                            const dataStr = trimmedLine.slice(6);
                            if (dataStr === '[DONE]') continue;
                            try {
                                const data = JSON.parse(dataStr);
                                const content = data.choices[0]?.delta?.content || '';
                                if (content) {
                                    setMessages(prev => prev.map(msg =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, content: msg.content + content }
                                            : msg
                                    ));
                                }
                            } catch (e) {
                                console.error('解析流数据失败', e, dataStr);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('AI 对话错误:', error);
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId && msg.content === ''
                    ? { ...msg, content: '抱歉，我遇到了一些技术问题。请稍后再试，或者直接联系向金涛。' }
                    : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* 流金质感烟花 Canvas 容器底部 */}
            <canvas
                id="fireworkCanvas"
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            />

            {/* 聊天标题 */}
            <div className="flex items-center gap-2 pb-4 border-b border-warm-brown/20 relative z-10">
                <Bot className="w-6 h-6 text-warm-brown" />
                <h3 className="text-xl font-serif font-bold text-warm-text">与我对话</h3>
            </div>

            {/* 聊天消息区域 */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[300px] max-h-[500px] relative z-10">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {/* 头像 */}
                        {message.role === 'user' ? (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-warm-accent">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        ) : (
                            <img src="/avatar.jpg" alt="向金涛" className="flex-shrink-0 w-8 h-8 rounded-full object-cover shadow-sm" />
                        )}

                        {/* 消息内容 */}
                        <div
                            className={`flex-1 px-4 py-3 rounded-2xl ${message.role === 'user'
                                ? 'bg-warm-accent text-white'
                                : 'bg-cream-200 text-warm-text'
                                }`}
                            style={{ maxWidth: '80%' }}
                        >
                            <div className="prose prose-sm max-w-none">
                                {isLoading && message.role === 'assistant' && message.content === '' ? (
                                    <Loader2 className="w-5 h-5 text-warm-brown animate-spin" />
                                ) : (
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="pt-4 border-t border-warm-brown/20 relative z-10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="问我关于向金涛的任何问题..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-cream-200 border-2 border-transparent focus:border-warm-brown focus:outline-none text-warm-text placeholder-warm-brown/50 disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="px-6 py-3 bg-warm-brown hover:bg-warm-brown/90 disabled:bg-warm-brown/50 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                        {isLoading && messages[messages.length - 1].content === '' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>发送</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

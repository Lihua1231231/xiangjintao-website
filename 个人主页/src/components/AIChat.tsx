import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
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
        { role: 'assistant', content: welcomeMessage }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // 创建一个空的助手消息用于流式更新
        const assistantMessage: Message = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!response.ok) {
                throw new Error(`请求失败: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.slice(6);
                            if (dataStr === '[DONE]') continue;
                            try {
                                const data = JSON.parse(dataStr);
                                const content = data.choices[0]?.delta?.content || '';
                                accumulatedContent += content;

                                // 更新最后一条消息（助手消息）
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = accumulatedContent;
                                    return newMessages;
                                });
                            } catch (e) {
                                console.error('解析流数据失败', e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('AI 对话错误:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = '抱歉，我遇到了一些技术问题。请稍后再试，或者直接联系向金涛。';
                return newMessages;
            });
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
        <div className="flex flex-col h-full">
            {/* 聊天标题 */}
            <div className="flex items-center gap-2 pb-4 border-b border-warm-brown/20">
                <Bot className="w-6 h-6 text-warm-brown" />
                <h3 className="text-xl font-serif font-bold text-warm-text">与我对话</h3>
            </div>

            {/* 聊天消息区域 */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[300px] max-h-[500px]">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {/* 头像 */}
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                ? 'bg-warm-accent'
                                : 'bg-warm-brown'
                                }`}
                        >
                            {message.role === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                            ) : (
                                <Bot className="w-5 h-5 text-white" />
                            )}
                        </div>

                        {/* 消息内容 */}
                        <div
                            className={`flex-1 px-4 py-3 rounded-2xl ${message.role === 'user'
                                ? 'bg-warm-accent text-white'
                                : 'bg-cream-200 text-warm-text'
                                }`}
                            style={{ maxWidth: '80%' }}
                        >
                            <div className="prose prose-sm max-w-none">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 加载指示器 */}
                {isLoading && messages[messages.length - 1].content === '' && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warm-brown flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 px-4 py-3 rounded-2xl bg-cream-200">
                            <Loader2 className="w-5 h-5 text-warm-brown animate-spin" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="pt-4 border-t border-warm-brown/20">
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

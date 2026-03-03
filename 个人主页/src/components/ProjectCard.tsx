import React, { useRef, useState } from 'react';
import type { WorkItem } from '../portfolioData';

interface ProjectCardProps {
    work: WorkItem;
}

export function ProjectCard({ work }: ProjectCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <a
            ref={cardRef}
            href={work.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`,
            } as React.CSSProperties}
            className="flex flex-col snap-start shrink-0 w-full max-w-[16rem] h-full p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-500 hover:-translate-y-1 group backdrop-blur-md relative overflow-hidden"
        >
            {/* 内部精准 Spotlight 层 */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`
                }}
            />

            {/* 边框 1px 精准高光层 */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none z-10"
                style={{
                    background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 40%)`,
                    maskImage: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    maskComposite: `exclude`,
                    WebkitMaskComposite: `destination-out`,
                    padding: `1px`,
                }}
            />

            {/* 背景悬停图片 */}
            {work.image && (
                <img
                    src={work.image}
                    alt={work.title}
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 scale-110 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100"
                />
            )}
            {/* 悬停时的半透明黑色遮罩，确保文字清晰 */}
            {work.image && (
                <div className="absolute inset-0 bg-black/50 z-0 opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100" />
            )}

            {/* 内部文字容器 relative 上浮 */}
            <div className="relative z-30 flex flex-col h-full pointer-events-none">
                <div className="flex justify-between items-start mb-2">
                    {work.iconType === 'bilibili' ? (
                        <div className="p-1.5 bg-bilibili-pink/20 rounded-lg">
                            <svg className="w-5 h-5 text-bilibili-pink/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                    ) : <div />}
                    {work.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${work.iconType === 'bilibili' ? 'bg-bilibili-pink/10 text-bilibili-pink/60 border border-bilibili-pink/20' : 'bg-white/10 text-white/80'}`}>
                            {work.badge}
                        </span>
                    )}
                </div>

                <h4 className={`text-white font-semibold tracking-tight text-lg transition-colors ${work.hoverColor === 'orange' ? 'group-hover:text-work-orange' :
                    work.hoverColor === 'blue' ? 'group-hover:text-work-blue' :
                        work.hoverColor === 'pink' ? 'group-hover:text-work-pink' : ''
                    }`}>
                    {work.title}
                </h4>

                <div className="text-base leading-relaxed mt-2 flex-grow flex flex-col gap-2">
                    {work.description.split('\n\n').map((paragraph, pIdx) => (
                        <p
                            key={pIdx}
                            className={`whitespace-pre-line transition-colors duration-500 ${pIdx === 0
                                ? 'text-white/95 font-medium group-hover:text-white'
                                : 'text-white/70 group-hover:text-white/90'
                                }`}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                    {work.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white/80 group-hover:bg-white/20 group-hover:text-white transition-colors duration-500">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    );
}

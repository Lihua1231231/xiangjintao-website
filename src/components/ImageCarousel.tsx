import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
    alt?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt = "照片" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // 自动轮播逻辑
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            nextImage();
        }, 4000);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused]);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    // 触摸滑动逻辑
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const diff = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <div
            className="relative w-full h-full group overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* 主图片 - 使用绝对定位实现淡入淡出 */}
            <div className="relative w-full h-full">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`${alt} ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* 左右切换按钮（悬停时显示）*/}
            <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20"
                aria-label="上一张"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20"
                aria-label="下一张"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* 分页点（底部居中）*/}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                        className={`transition-all duration-300 ${index === currentIndex
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            } rounded-full`}
                        aria-label={`切换到照片 ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

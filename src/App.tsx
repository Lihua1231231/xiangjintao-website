import { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, Phone, MessageCircle, Mail, X, Check, Copy, Bot } from 'lucide-react';
import { portfolioData } from './portfolioData';
import type { ContactInfo } from './portfolioData';
import { ImageCarousel } from './components/ImageCarousel';
import { AIChat } from './components/AIChat';
import { ProjectCard } from './components/ProjectCard';
// 图标映射
const ContactIcon = ({ type, className }: { type: ContactInfo['icon'], className?: string }) => {
  switch (type) {
    case 'phone': return <Phone className={className} />;
    case 'message-circle': return <MessageCircle className={className} />;
    case 'mail': return <Mail className={className} />;
    default: return null;
  }
};

function App() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const aiChatRef = useRef<HTMLDivElement>(null);
  const [showChatFab, setShowChatFab] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect(); };
  }, [checkScroll]);

  useEffect(() => {
    const el = aiChatRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setShowChatFab(!entry.isIntersecting);
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToChat = () => {
    aiChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  const handleResumeClick = () => {
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError(false);
  };

  const handlePasswordSubmit = () => {
    if (password === portfolioData.resumePassword) {
      window.open(portfolioData.resumeUrl, '_blank');
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleCopyContact = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="relative min-h-screen bg-cream-100 py-6 px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* 底部环境深度：3 个极慢运动的环境光晕球 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/5 blur-[160px] animate-floating" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-violet-600/5 blur-[160px] animate-floating" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-500/5 blur-[160px] animate-floating" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="max-w-6xl mx-auto space-y-4 relative z-10">

        {/* 紧凑的 Bento Grid 布局 (1:1等分比例) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* 左侧：照片焦点卡片 - 占 1 列 (50%) */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-md overflow-hidden flex flex-col h-full w-full animate-reveal">
            {/* 图片轮播区域 - 锁定高度改为比例自适应 */}
            <div className="aspect-[4/3] overflow-hidden relative">
              <ImageCarousel
                images={portfolioData.photos}
                alt={`${portfolioData.name}的照片`}
              />
            </div>

            {/* 底部文字区域 - 极其紧凑 */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="space-y-0.5">
                {/* 姓名 */}
                <h1 className="text-xl font-serif font-bold text-warm-text">
                  {portfolioData.name}
                </h1>

                {/* 简介 */}
                <p className="text-xs text-warm-brown">
                  {portfolioData.tagline}
                </p>
              </div>

              {/* 极其紧凑的分割线 */}
              <div className="my-4 border-t border-white/10" />

              {/* 联系信息区域 - 压缩间距 */}
              <div>
                <h3 className="text-[9px] font-bold tracking-widest text-contact-icon/50 uppercase mb-2">
                  CONTACT
                </h3>
                <div className="space-y-0.5">
                  {portfolioData.contacts.map((contact, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopyContact(contact.value, index)}
                      className="group w-full flex items-center gap-2.5 text-sm text-contact-icon hover:bg-white/10 rounded-lg px-2 py-1.5 -mx-2 transition-all duration-200 cursor-pointer text-left"
                    >
                      <ContactIcon
                        type={contact.icon}
                        className="w-3.5 h-3.5 text-contact-icon/60 transition-colors group-hover:text-contact-icon"
                      />
                      <span className="flex-1">{contact.value}</span>
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-500 transition-opacity" />
                      ) : (
                        <Copy className="w-3 h-3 text-contact-icon/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 查看简历按钮 */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={handleResumeClick}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-brown/10 border border-warm-brown/20 hover:bg-warm-brown/20 text-warm-brown rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm backdrop-blur-sm text-sm"
                >
                  <FileText className="w-4 h-4" />
                  查看简历
                </button>
              </div>
            </div>
          </div>

          {/* 右侧容器：上下两块 */}
          <div className="lg:col-span-1 flex flex-col gap-4">

            {/* 右上：信息中心卡片 (ISFJ + 兴趣爱好) */}
            <div className="bg-gradient-to-br from-warm-accent to-warm-brown rounded-2xl shadow-md p-4 sm:p-5 text-white flex flex-col flex-none h-fit animate-reveal" style={{ animationDelay: '120ms' }}>
              {/* ISFJ 部分 */}
              <div className="pb-3 border-b border-white/20">
                <div className="text-3xl sm:text-4xl font-serif font-bold mb-1">
                  {portfolioData.about.mbti}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed opacity-95">
                  {portfolioData.about.mbtiDescription}
                </div>
              </div>

              {/* 兴趣爱好部分 */}
              <div className="flex-1 pt-3">
                <h3 className="text-sm font-medium mb-2 opacity-90">兴趣爱好</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {portfolioData.about.hobbies.map((hobby, index) => {
                    const content = (
                      <>
                        <span className="text-lg">{hobby.icon}</span>
                        <span className="text-xs font-medium">{hobby.label}</span>
                      </>
                    );
                    const className = "flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1.5 hover:bg-white/20 transition-colors";
                    return hobby.link ? (
                      <a key={index} href={hobby.link} target="_blank" rel="noopener noreferrer" className={className + " cursor-pointer"}>
                        {content}
                      </a>
                    ) : (
                      <div key={index} className={className}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 右下：横向滑动作品集 */}
            <div className="flex-1 bg-gradient-to-br from-warm-brown to-warm-accent rounded-2xl shadow-md p-5 sm:p-6 text-white flex flex-col overflow-hidden relative animate-reveal" style={{ animationDelay: '240ms' }}>
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <h3 className="text-[10px] text-white/60 uppercase tracking-widest m-0">SELECTED WORKS</h3>
                <span className="text-[10px] text-white/40 tracking-widest">(可以点击查看)</span>
              </div>
              <div className="flex-1 relative">
                {canScrollLeft && (
                  <>
                    <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-warm-brown/60 to-transparent z-10 pointer-events-none rounded-l-xl" />
                    <button onClick={() => scroll('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 transition-colors">
                      ‹
                    </button>
                  </>
                )}
                {canScrollRight && (
                  <>
                    <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-warm-brown/60 to-transparent z-10 pointer-events-none rounded-r-xl" />
                    <button onClick={() => scroll('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 transition-colors">
                      ›
                    </button>
                  </>
                )}
                <div ref={scrollRef} className="flex h-full overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide items-stretch">
                  {portfolioData.works.map((work, index) => (
                    <ProjectCard key={index} work={work} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：AI 对话区域 */}
        <div ref={aiChatRef} className="bg-[#1a1510] rounded-2xl shadow-md p-6 animate-reveal" style={{ animationDelay: '360ms' }}>
          <AIChat
            welcomeMessage={portfolioData.ai.welcomeMessage}
          />
        </div>

        {/* 页脚 */}
        <footer className="text-center text-warm-brown/60 text-xs py-4">
          <p>© 2026 {portfolioData.name}</p>
        </footer>
      </div>

      {/* 浮动 AI 对话引导按钮 */}
      {showChatFab && (
        <button
          onClick={scrollToChat}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-[#1a1510] text-warm-accent border border-warm-accent/20 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm animate-reveal"
          style={{ animationDelay: '600ms' }}
        >
          <Bot className="w-4 h-4" />
          <span className="text-sm font-medium">和我聊聊</span>
        </button>
      )}

      {/* 密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowPasswordModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-cream-50 rounded-2xl shadow-xl p-6 w-full max-w-xs space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-warm-text">请输入密码查看简历</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-warm-brown/40 hover:text-warm-brown">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-warm-brown/50">请联系本人获取密码</p>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="输入密码"
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-300 bg-white text-warm-text placeholder:text-warm-brown/30 focus:outline-none focus:border-warm-brown/40"
            />
            {passwordError && (
              <p className="text-xs text-red-500">密码错误，请重试</p>
            )}
            <button
              onClick={handlePasswordSubmit}
              className="w-full py-2 text-sm font-medium text-white bg-warm-brown rounded-lg hover:bg-warm-brown/90 transition-colors"
            >
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

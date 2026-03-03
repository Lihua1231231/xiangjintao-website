import { Download, Phone, MessageCircle, Mail } from 'lucide-react';
import { portfolioData } from './portfolioData';
import type { ContactInfo } from './portfolioData';
import { ImageCarousel } from './components/ImageCarousel';
import { AIChat } from './components/AIChat';

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
  const handleDownloadResume = () => {
    window.open(portfolioData.resumeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream-100 py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* 紧凑的 Bento Grid 布局 (1:1等分比例) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* 左侧：照片焦点卡片 - 占 1 列 (50%) */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-md overflow-hidden flex flex-col h-full w-full">
            {/* 图片轮播区域 - 锁定高度改为比例自适应 */}
            <div className="aspect-[4/3] sm:aspect-[3/4] lg:aspect-square overflow-hidden relative">
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
                    <div key={index} className="group flex items-center gap-2.5 text-sm text-contact-icon hover:bg-white/10 rounded-lg px-2 py-1.5 -mx-2 transition-all duration-200">
                      <ContactIcon
                        type={contact.icon}
                        className="w-3.5 h-3.5 text-contact-icon/60 transition-colors group-hover:text-contact-icon"
                      />
                      <span>{contact.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 下载简历按钮 - 紧随其后 */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={handleDownloadResume}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-warm-brown/10 border border-warm-brown/20 hover:bg-warm-brown/20 text-warm-brown rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm backdrop-blur-sm text-sm"
                >
                  <Download className="w-4 h-4" />
                  下载简历
                </button>
              </div>
            </div>
          </div>

          {/* 右侧容器：分成上下两块，通过 flex-col 分配高度，占 1 列 (50%) */}
          <div className="lg:col-span-1 flex flex-col gap-4">

            {/* 右上：信息中心卡片 (ISFJ + 兴趣爱好) - 极致压缩, h-fit */}
            <div className="bg-gradient-to-br from-warm-accent to-warm-brown rounded-2xl shadow-md p-4 sm:p-5 text-white flex flex-col flex-none h-fit">
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
                  {portfolioData.about.hobbies.map((hobby, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1.5 hover:bg-white/20 transition-colors"
                    >
                      <span className="text-lg">{hobby.icon}</span>
                      <span className="text-xs font-medium">{hobby.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右下/下方：横向滑动作品集 - 彻底拉满剩余的所有垂直空间 */}
            <div className="flex-1 bg-gradient-to-br from-warm-brown to-warm-accent rounded-2xl shadow-md p-5 sm:p-6 text-white flex flex-col overflow-hidden relative">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <h3 className="text-[10px] text-white/60 uppercase tracking-widest m-0">SELECTED WORKS</h3>
                <span className="text-[10px] text-white/40 tracking-widest">(可以点击查看)</span>
              </div>
              <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide items-stretch">
                {portfolioData.works.map((work, index) => (
                  <a
                    key={index}
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col snap-start shrink-0 w-full max-w-[16rem] h-full p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md relative overflow-hidden"
                  >
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
                    <div className="relative z-10 flex flex-col h-full">
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
                      <h4 className={`text-white font-bold text-lg transition-colors ${work.hoverColor === 'orange' ? 'group-hover:text-work-orange' :
                        work.hoverColor === 'blue' ? 'group-hover:text-work-blue' :
                          work.hoverColor === 'pink' ? 'group-hover:text-work-pink' : ''
                        }`}>
                        {work.title}
                      </h4>
                      <p className="text-white/70 text-base leading-relaxed mt-1 group-hover:text-white/90 flex-grow">
                        {work.description}
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {work.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80 group-hover:bg-white/20 group-hover:text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部：AI 对话区域 */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <AIChat
            welcomeMessage={portfolioData.ai.welcomeMessage}
          />
        </div>

        {/* 页脚 */}
        <footer className="text-center text-warm-brown/60 text-xs py-4">
          <p>© 2026 {portfolioData.name}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

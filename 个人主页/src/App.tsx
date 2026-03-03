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

        {/* 紧凑的2列 Bento Grid 布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* 左侧：照片焦点卡片 - 上方图片轮播 + 下方紧凑文字 */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-md overflow-hidden flex flex-col">
            {/* 图片轮播区域 - 锁定高度改为比例自适应 */}
            <div className="aspect-[4/3] sm:aspect-[3/4] lg:aspect-square overflow-hidden rounded-2xl relative">
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

          {/* 右侧：信息中心卡片 (ISFJ + 兴趣爱好) */}
          <div className="bg-gradient-to-br from-warm-accent to-warm-brown rounded-2xl shadow-md p-6 text-white flex flex-col min-h-[500px] lg:min-h-[600px]">
            {/* ISFJ 部分 */}
            <div className="pb-5 border-b border-white/20">
              <div className="text-4xl sm:text-5xl font-serif font-bold mb-2">
                {portfolioData.about.mbti}
              </div>
              <div className="text-sm sm:text-base leading-relaxed opacity-95">
                {portfolioData.about.mbtiDescription}
              </div>
            </div>

            {/* 兴趣爱好部分 */}
            <div className="flex-1 pt-5">
              <h3 className="text-lg font-medium mb-4 opacity-90">兴趣爱好</h3>
              <div className="grid grid-cols-2 gap-3">
                {portfolioData.about.hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 hover:bg-white/20 transition-colors"
                  >
                    <span className="text-xl sm:text-2xl">{hobby.icon}</span>
                    <span className="text-xs sm:text-sm font-medium">{hobby.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 横向滑动作品集 */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[10px] text-white/60 uppercase tracking-widest m-0">SELECTED WORKS</h3>
                <span className="text-[10px] text-white/40 tracking-widest">(可以点击查看)</span>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
                {portfolioData.works.map((work, index) => (
                  <a
                    key={index}
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snap-start shrink-0 w-full max-w-[16rem] p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      {work.iconType === 'bilibili' ? (
                        <div className="p-1.5 bg-bilibili-pink/20 rounded-lg">
                          <svg className="w-5 h-5 text-bilibili-pink/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      ) : null}
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
                    <p className="text-white/70 text-sm leading-relaxed mt-1">
                      {work.description}
                    </p>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {work.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">
                          {tag}
                        </span>
                      ))}
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

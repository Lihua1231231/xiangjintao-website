import { Download } from 'lucide-react';
import { portfolioData } from './portfolioData';
import { ImageCarousel } from './components/ImageCarousel';
import { AIChat } from './components/AIChat';

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
          <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
            {/* 图片轮播区域 - 锁定高度防止跳动 */}
            <div className="h-[450px] overflow-hidden rounded-2xl relative">
              <ImageCarousel
                images={portfolioData.photos}
                alt={`${portfolioData.name}的照片`}
              />
            </div>

            {/* 底部文字区域 - 紧凑排列 */}
            <div className="p-5 space-y-3">
              {/* 姓名 */}
              <h1 className="text-2xl font-serif font-bold text-warm-text">
                {portfolioData.name}
              </h1>

              {/* 简介 */}
              <p className="text-sm text-warm-brown">
                {portfolioData.tagline}
              </p>

              {/* 下载简历按钮 */}
              <button
                onClick={handleDownloadResume}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-warm-brown hover:bg-warm-brown/90 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md"
              >
                <Download className="w-5 h-5" />
                下载简历
              </button>
            </div>
          </div>

          {/* 右侧：信息中心卡片 (ISFJ + 兴趣爱好) */}
          <div className="bg-gradient-to-br from-warm-accent to-warm-brown rounded-2xl shadow-md p-6 text-white flex flex-col" style={{ minHeight: '600px' }}>
            {/* ISFJ 部分 */}
            <div className="pb-5 border-b border-white/20">
              <div className="text-5xl font-serif font-bold mb-2">
                {portfolioData.about.mbti}
              </div>
              <div className="text-base leading-relaxed opacity-95">
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
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 hover:bg-white/20 transition-colors"
                  >
                    <span className="text-2xl">{hobby.icon}</span>
                    <span className="text-sm font-medium">{hobby.label}</span>
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
                <a
                  href="https://tracker.xiangjintao.top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-start shrink-0 w-64 p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-orange-200 transition-colors">
                      HC Tracker
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    基于 React 19 + Tailwind v4 的智能招聘管理系统，实现全流程招聘追踪。
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">React 19</span>
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">Tailwind v4</span>
                  </div>
                </a>

                {/* 第二个作品：招聘广告生成器 */}
                <a
                  href="https://jd.xiangjintao.top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-start shrink-0 w-64 p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-orange-200 transition-colors">
                      JD Generator
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    基于 Next.js 14 构建的智能招聘广告生成器，一键输出专业文案。
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">Next.js 14</span>
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">OpenAI</span>
                  </div>
                </a>

                {/* 第三个作品：天气预报 */}
                <a
                  href="https://luoluoweather.xiangjintao.top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="snap-start shrink-0 w-64 p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:-translate-y-1 group backdrop-blur-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-bold text-lg group-hover:text-blue-200 transition-colors">
                      Weather Forecast
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    治愈系玻璃拟态设计，基于和风天气 API 的精准气象助手。
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">Vanilla JS</span>
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full text-white/80">QWeather</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：AI 对话区域 */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <AIChat
            apiKey={portfolioData.ai.apiKey}
            model={portfolioData.ai.model}
            apiEndpoint={portfolioData.ai.apiEndpoint}
            systemPrompt={portfolioData.ai.systemPrompt}
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

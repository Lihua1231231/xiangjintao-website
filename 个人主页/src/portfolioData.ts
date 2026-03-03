// ==========================================
// 个人作品集数据配置
// ==========================================

export interface ContactInfo {
  icon: 'phone' | 'message-circle' | 'mail';
  label: string;
  value: string;
}

export interface WorkItem {
  title: string;
  description: string;
  link: string;
  tags: string[];
  hoverColor?: string;
  badge?: string;
  iconType?: 'default' | 'bilibili';
  image?: string;
}

export const portfolioData = {
  // ========== 1. 基本信息 ==========
  name: "向金涛",
  tagline: "积极主动 | 稳重可靠 | 善于思考",

  // ========== 2. 照片轮播 ==========
  photos: [
    "/photo1.jpg",  // 演讲照片
    "/photo2.jpg",  // 会议照片
    "/photo3.jpg",  // 吉他照片
  ],

  // ========== 3. 简历文件 ==========
  resumeUrl: "/resume.pdf",

  // ========== 4. 联系信息 ==========
  contacts: [
    { icon: 'phone', label: '电话', value: '18673129182' },
    { icon: 'message-circle', label: '微信', value: 'xjt18973111415' },
    { icon: 'mail', label: '邮箱', value: '3294182452@qq.com' }
  ] as ContactInfo[],

  // ========== 5. 作品集 ==========
  works: [
    {
      title: "HC Tracker",
      description: "一款专为招聘团队打造的全链路 Headcount 智能协同看板。\n\n直击 Excel 流转低效的痛点，系统深度集成本地 PDF 解析与 OpenAI 大模型，一键提取简历亮点；提供基于 dnd-kit 的顺滑拖拽流转与转化仪表盘。\n\n全栈基于 Next.js 与 Prisma 构建，配合前端 Optimistic UI (乐观更新) 机制，实现毫秒级的无感同步体验。",
      link: "https://tracker.xiangjintao.top",
      tags: ["React 19", "Tailwind v4"],
      hoverColor: "orange",
      image: "/project-hc.jpg"
    },
    {
      title: "JD Generator",
      description: "基于大语言模型驱动的智能招聘文案生成系统。\n\n为打破 HR 撰写枯燥 JD 的效率瓶颈，用户仅需输入碎片化关键词，即可通过深度 Prompt 工程瞬间输出专业、极具感召力的招聘简章。\n\n架构上采用 React 与纯客户端直连 OpenAI 的无服务器设计，从物理底层保障数据隐私，辅以极致优化的中文排版，实现极客级别的交互。",
      link: "https://jd.xiangjintao.top",
      tags: ["Next.js 14", "OpenAI"],
      hoverColor: "orange",
      image: "/project-jd.jpg"
    },
    {
      title: "Weather Forecast",
      description: "一个以纯净、治愈为核心诉求的现代化气象 Web 应用。\n\n针对市面天气产品广告繁杂的痛点，系统提供精准定位、实时气象监测及未来 7 天趋势可视化，并内置智能穿衣与防晒预警。\n\n项目摒弃臃肿框架，完全使用 Vanilla JS 与 Fetch API 驱动，搭配 CSS3 玻璃拟态特效，实现跨平台的高性能与高颜值体验。",
      link: "https://luoluoweather.xiangjintao.top",
      tags: ["Vanilla JS", "QWeather"],
      hoverColor: "blue",
      image: "/project-weather.jpg"
    },
    {
      title: "Bilibili Downloader",
      description: "一款基于 Python 与 Flask 的轻量级视频归档工具。\n\n为解决传统下载工具门槛高、界面简陋的痛点，本项目结合 yt-dlp 强悍引擎与玻璃拟态 UI，支持从 360p 到 4K 视频的智能解析、轨道分离与精准裁剪。\n\n技术上采用多线程非阻塞 I/O 与前端异步轮询，搭配零配置沙盒部署，提供丝滑的桌面级多媒体下载体验。",
      link: "https://github.com/Lihua1231231/bilibili-downloader",
      tags: ["Python", "Flask", "FFmpeg"],
      hoverColor: "pink",
      badge: "Open Source",
      iconType: "bilibili",
      image: "/project-bilibili.jpg"
    }
  ] as WorkItem[],

  // ========== 6. 关于我 ==========
  about: {
    // MBTI 性格类型
    mbti: "ISFJ",
    mbtiDescription: "可靠尽责，注重细节，能通过务实的行动为团队提供坚定支持。",

    // 兴趣爱好（精简版）
    hobbies: [
      { label: "健身", icon: "💪" },
      { label: "羽毛球", icon: "🏸" },
      { label: "网球", icon: "🎾" },
      { label: "骑行", icon: "🚴" },
      { label: "电吉他", icon: "🎸" },
      { label: "电贝斯", icon: "🎵" },
      { label: "播音主持", icon: "🎙️" }
    ]
  },

  // ========== 7. AI 对话配置 ==========
  ai: {
    model: "Qwen/Qwen2.5-72B-Instruct",
    welcomeMessage: "你好！我是向金涛的 AI 助手。你可以问我关于金涛的经历、项目或任何你感兴趣的事情。",
    systemPrompt: "我是向金涛的官方 AI 助手。我将基于知识库为你提供准确的信息。"
  }
};

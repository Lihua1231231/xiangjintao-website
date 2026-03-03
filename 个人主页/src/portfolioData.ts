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
      description: "基于 React 19 + Tailwind v4 的智能招聘管理系统，实现全流程招聘追踪。",
      link: "https://tracker.xiangjintao.top",
      tags: ["React 19", "Tailwind v4"],
      hoverColor: "orange"
    },
    {
      title: "JD Generator",
      description: "基于 Next.js 14 构建的智能招聘广告生成器，一键输出专业文案。",
      link: "https://jd.xiangjintao.top",
      tags: ["Next.js 14", "OpenAI"],
      hoverColor: "orange"
    },
    {
      title: "Weather Forecast",
      description: "治愈系玻璃拟态设计，基于和风天气 API 的精准气象助手。",
      link: "https://luoluoweather.xiangjintao.top",
      tags: ["Vanilla JS", "QWeather"],
      hoverColor: "blue"
    },
    {
      title: "Bilibili Downloader",
      description: "基于 Python + Flask 的高效下载工具。支持 4K 解析、音视频自动合并及片段裁剪。",
      link: "https://github.com/Lihua1231231/bilibili-downloader",
      tags: ["Python", "Flask", "FFmpeg"],
      hoverColor: "pink",
      badge: "Open Source",
      iconType: "bilibili"
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

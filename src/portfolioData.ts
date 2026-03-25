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
  titleCn: string;
  description: string;
  liveUrl?: string;
  introUrl?: string;
  tags: string[];
  accentColor: string;
  badge?: string;
  featured?: boolean;
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
  resumeUrl: "https://resume.xiangjintao.top",
  resumePassword: "xjt2026",

  // ========== 4. 联系信息 ==========
  contacts: [
    { icon: 'phone', label: '电话', value: '18673129182' },
    { icon: 'message-circle', label: '微信', value: 'xjt18973111415' },
    { icon: 'mail', label: '邮箱', value: '3294182452@qq.com' }
  ] as ContactInfo[],

  // ========== 5. 作品集 ==========
  works: [
    {
      title: "Performance Review",
      titleCn: "绩效考核系统",
      description: "背景：企业绩效考核流程分散，自评、初评、终评缺乏统一平台。主流绩效系统报价高。\n行动：构建覆盖自评→360度提名→审批→评分→终评的全流程系统，集成飞书文档与多角色权限管控。\n结果：实现透明化绩效协同管理，已上线运行，覆盖100余人。",
      liveUrl: "https://jixiao.xiangjintao.top/",
      introUrl: "https://jixiao-intro.xiangjintao.top/",
      tags: ["React", "Tailwind", "AI"],
      accentColor: "#C17F3A",
      featured: true
    },
    {
      title: "MellonCollie",
      titleCn: "简历评估系统",
      description: "背景：不同 HR 对简历的判断不一；HR 简历筛选速度较慢。\n行动：打造 7*24 小时全自动简历分析系统，准确高效分析简历。\n结果：自动从飞书同步候选人（每 5 分钟）；AI 自动评估给出强推/可推/观望/不推结论并同步备注；支持批量终止投递与评估口径动态更新。",
      liveUrl: "https://melloncollie.xiangjintao.top/",
      introUrl: "https://mellon-collie-intro.xiangjintao.top/",
      tags: ["React", "LLM", "PDF解析"],
      accentColor: "#8B6B9E",
      featured: true
    },
    {
      title: "JD Generator",
      titleCn: "招聘广告生成器",
      description: "背景：HR 撰写招聘文案耗时且质量参差，需要 AI 辅助提效。\n行动：设计 4 步推理管道（需求分析→行业对标→生成→终稿），无服务器架构直连大模型。\n结果：输入关键词秒出专业招聘简章，从底层保障数据隐私。",
      liveUrl: "https://jd.xiangjintao.top/",
      introUrl: "https://jd-intro.xiangjintao.top/",
      tags: ["React", "OpenAI"],
      accentColor: "#D4A574"
    },
    {
      title: "Department Crayfish",
      titleCn: "部门小龙虾",
      description: "背景：传统多智能体框架缺乏质量管控，存在重复劳动与数据伪造风险。\n行动：部署开源项目 edict，借鉴古代三省六部制，构建 12 个 AI 智能体的层级治理系统，门下省拥有审批否决权，并将自研简历评估系统作为其 skills。\n结果：实现了简历筛选评估、行业简报推送等招聘流程的自动化。",
      introUrl: "https://sanshengliubu-intro.xiangjintao.top/",
      tags: ["React", "Tailwind"],
      accentColor: "#C75B3F"
    },
    {
      title: "Weather Forecast",
      titleCn: "天气预报",
      description: "背景：市面天气应用广告繁杂，缺少纯净治愈的使用体验。\n行动：零框架纯原生 JS 开发，搭配玻璃拟态设计与和风天气 API。\n结果：精准定位、7 天趋势可视化、智能穿衣与防晒预警，跨平台高性能。",
      liveUrl: "https://luoluoweather.xiangjintao.top/",
      tags: ["Vanilla JS", "QWeather"],
      accentColor: "#5B8FA8"
    },
    {
      title: "Bilibili Downloader",
      titleCn: "哔哩哔哩下载器",
      description: "背景：传统下载工具门槛高、界面简陋，难以满足日常视频归档需求。\n行动：基于 Flask + yt-dlp 引擎，支持 360p 到 4K 解析、格式转换与精准裁剪。\n结果：一键解析、实时进度反馈，内置 FFmpeg 实现零配置桌面体验。",
      introUrl: "https://bilibili-downloader-intro.xiangjintao.top/",
      tags: ["Python", "Flask", "FFmpeg"],
      accentColor: "#EC4899",
      badge: "Open Source"
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
      { label: "播音主持", icon: "🎙️" },
      { label: "Vibe-coding（可点击）", icon: "💻", link: "/vibe-coding.html" }
    ]
  },

  // ========== 7. AI 对话配置 ==========
  ai: {
    model: "Qwen/Qwen2.5-72B-Instruct",
    welcomeMessage: "你好！我是向金涛的 AI 助手。你可以问我关于金涛的经历、项目或任何你感兴趣的事情。",
    systemPrompt: "我是向金涛的官方 AI 助手。我将基于知识库为你提供准确的信息。"
  }
};

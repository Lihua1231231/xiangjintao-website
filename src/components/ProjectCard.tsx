import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { WorkItem } from '../portfolioData';

interface ProjectCardProps {
  work: WorkItem;
  index: number;
}

export function ProjectCard({ work }: ProjectCardProps) {
  return (
    <div
      className="group flex flex-col snap-start shrink-0 w-full sm:max-w-[16rem] h-full p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md relative overflow-hidden"
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: work.accentColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderLeftWidth = '5px';
        e.currentTarget.style.borderColor = `${work.accentColor}40`;
        e.currentTarget.style.borderLeftColor = work.accentColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderLeftWidth = '3px';
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.borderLeftColor = work.accentColor;
      }}
    >
      {/* Header */}
      <div className="mb-2">
        <h4
          className="text-white font-semibold tracking-tight text-lg transition-colors duration-200"
          onMouseEnter={(e) => { e.currentTarget.style.color = work.accentColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
        >
          {work.titleCn}
        </h4>
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
          {work.title}
        </span>
      </div>

      {/* Description */}
      <div className="text-sm text-white/70 leading-relaxed mb-3 space-y-1">
        {work.description.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {work.tags.map((tag, tIdx) => (
          <span
            key={tIdx}
            className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/60"
          >
            {tag}
          </span>
        ))}
        {work.badge && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: work.accentColor }}
          >
            {work.badge}
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action links */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/10">
        {work.introUrl && (
          <a
            href={work.introUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white px-2.5 py-1 rounded-full transition-opacity duration-200 hover:opacity-85"
            style={{ backgroundColor: work.accentColor }}
          >
            <ArrowUpRight className="w-3 h-3" />
            了解更多
          </a>
        )}
        {work.liveUrl && (
          <a
            href={work.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            <ExternalLink className="w-3 h-3" />
            访问
          </a>
        )}
      </div>
    </div>
  );
}

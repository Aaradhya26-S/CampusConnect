import React from 'react';

// Status Distribution Donut Chart
export const StatusDonutChart: React.FC<{
  data: { label: string; count: number; color?: string }[];
}> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  const colors = [
    '#F59E0B', // Submitted (Amber)
    '#3B82F6', // Under review (Blue)
    '#6366F1', // Assigned (Indigo)
    '#0D9488', // In Progress (Teal)
    '#10B981', // Resolved (Emerald)
    '#64748B', // Closed (Slate)
    '#EF4444', // Rejected (Rose)
  ];

  let cumulativeAngle = 0;
  const segments = data
    .filter((d) => d.count > 0)
    .map((item, index) => {
      const percentage = total > 0 ? item.count / total : 0;
      const strokeDash = `${percentage * 100} ${100 - percentage * 100}`;
      const strokeOffset = -cumulativeAngle;
      cumulativeAngle += percentage * 100;

      return {
        ...item,
        color: item.color || colors[index % colors.length],
        strokeDash,
        strokeOffset,
        percentage: Math.round(percentage * 100),
      };
    });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4">
      {/* SVG Donut */}
      <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="5"
          />
          {segments.map((s, idx) => (
            <circle
              key={idx}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={s.color}
              strokeWidth="5"
              strokeDasharray={s.strokeDash}
              strokeDashoffset={s.strokeOffset}
              className="transition-all duration-500 ease-out hover:opacity-85"
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-navy-900">{total}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Cases</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="flex-1 w-full space-y-2">
        {data.map((item, idx) => {
          const color = colors[idx % colors.length];
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-medium text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy-900">{item.count}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Category Distribution Horizontal Bar Chart
export const CategoryBarChart: React.FC<{
  categories: { name: string; count: number; percentage: number }[];
}> = ({ categories }) => {
  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="space-y-3.5 p-4">
      {categories.map((cat) => {
        const fillWidth = `${Math.max(6, (cat.count / maxCount) * 100)}%`;
        return (
          <div key={cat.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">{cat.name}</span>
              <span className="font-bold text-navy-900">
                {cat.count} <span className="font-normal text-slate-400">({cat.percentage}%)</span>
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                style={{ width: fillWidth }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Monthly Trend Line/Area Chart
export const TrendLineChart: React.FC<{
  trends: { month: string; submitted: number; resolved: number }[];
}> = ({ trends }) => {
  if (!trends || trends.length === 0) return null;

  const maxVal = Math.max(...trends.flatMap((t) => [t.submitted, t.resolved]), 10);
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const getCoordinates = (val: number, idx: number) => {
    const x = paddingX + (idx / (trends.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const submittedPoints = trends.map((t, i) => getCoordinates(t.submitted, i));
  const resolvedPoints = trends.map((t, i) => getCoordinates(t.resolved, i));

  const submittedPath = submittedPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const resolvedPath = resolvedPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="p-4">
      <div className="flex items-center justify-end gap-5 text-xs font-medium mb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy-800" />
          <span className="text-slate-600">Complaints Submitted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
          <span className="text-slate-600">Complaints Resolved</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#F1F5F9"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Submitted Line (Navy) */}
          <path d={submittedPath} fill="none" stroke="#1E3E62" strokeWidth="2.5" strokeLinecap="round" />
          {submittedPoints.map((p, i) => (
            <circle key={`sub-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#1E3E62" />
          ))}

          {/* Resolved Line (Teal) */}
          <path d={resolvedPath} fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
          {resolvedPoints.map((p, i) => (
            <circle key={`res-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#0D9488" />
          ))}

          {/* X Axis Labels */}
          {trends.map((t, idx) => {
            const p = getCoordinates(0, idx);
            return (
              <text
                key={t.month}
                x={p.x}
                y={chartHeight - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#94A3B8"
                fontWeight="500"
              >
                {t.month}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

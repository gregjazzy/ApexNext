'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useLocale } from 'next-intl';

interface ResilienceRadarProps {
  data: {
    donnees: number;
    decision: number;
    relationnel: number;
    creativite: number;
    execution: number;
  };
}

export function ResilienceRadar({ data }: ResilienceRadarProps) {
  const locale = useLocale();
  const l = locale === 'en' ? 'en' : 'fr';

  const labels = {
    donnees: l === 'fr' ? 'Données' : 'Data',
    decision: l === 'fr' ? 'Décision' : 'Decision',
    relationnel: l === 'fr' ? 'Relationnel' : 'Relational',
    creativite: l === 'fr' ? 'Créativité' : 'Creativity',
    execution: l === 'fr' ? 'Exécution' : 'Execution',
  };

  const chartData = [
    { dimension: labels.donnees, value: data.donnees, fullMark: 100 },
    { dimension: labels.decision, value: data.decision, fullMark: 100 },
    { dimension: labels.relationnel, value: data.relationnel, fullMark: 100 },
    { dimension: labels.creativite, value: data.creativite, fullMark: 100 },
    { dimension: labels.execution, value: data.execution, fullMark: 100 },
  ];

  // Couleur dynamique selon le score moyen
  const avgScore = Math.round((data.donnees + data.decision + data.relationnel + data.creativite + data.execution) / 5);
  const strokeColor = avgScore >= 70 ? '#34d399' : avgScore >= 40 ? '#fbbf24' : '#fb7185';
  const fillColor = avgScore >= 70 ? 'rgba(52, 211, 153, 0.3)' : avgScore >= 40 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 113, 133, 0.3)';

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid 
            stroke="#334155" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={{ stroke: '#475569' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickCount={5}
            axisLine={{ stroke: '#334155' }}
          />
          <Radar
            name="Résilience"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill={fillColor}
            dot={{
              r: 4,
              fill: strokeColor,
              strokeWidth: 0,
            }}
            activeDot={{
              r: 6,
              fill: strokeColor,
              stroke: '#0f172a',
              strokeWidth: 2,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}


"use client";

import { useAnimatedValues } from "@/components/domain/use-animated-values";

type ChartDatum = {
  name: string;
  value: number;
};

const CENTER = 50;
const CHART_RADIUS = 30;
const LABEL_RADIUS = 42;
const GRID_RINGS = [0.25, 0.5, 0.75, 1];
const RADAR_COLOR = "#1F6FEB";

function pointAt(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;

  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

function pointsToString(points: { x: number; y: number }[]) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

function labelAnchor(x: number) {
  if (Math.abs(x - CENTER) < 2) return "middle";
  return x > CENTER ? "start" : "end";
}

export function MiniRadarChart({ data }: { data: ChartDatum[] }) {
  const total = data.length;
  const max = Math.max(1, ...data.map((item) => item.value));
  const minVisible = Math.max(max * 0.12, 0.5);
  const targetData = data.map((item) => ({
    ...item,
    displayValue: ((item.value <= 0 ? minVisible : item.value) / max) * 100,
  }));
  const animatedValues = useAnimatedValues(
    targetData.map((item) => ({ id: item.name, value: item.displayValue })),
    500,
    { animateOnMount: true },
  );
  const displayData = targetData.map((item) => ({
    ...item,
    displayValue: animatedValues[item.name] ?? item.displayValue,
  }));
  const radarPoints = displayData.map((item, index) =>
    pointAt(index, total, (item.displayValue / 100) * CHART_RADIUS),
  );
  const gridPoints = GRID_RINGS.map((ring) =>
    pointsToString(data.map((_, index) => pointAt(index, total, CHART_RADIUS * ring))),
  );

  return (
    <div className="h-56 w-full">
      <svg
        aria-label="감정 그래프"
        className="h-full w-full overflow-visible"
        role="img"
        viewBox="0 0 100 100"
      >
        <g fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.45">
          {gridPoints.map((points, index) => (
            <polygon key={GRID_RINGS[index]} points={points} />
          ))}
          {data.map((_, index) => {
            const outer = pointAt(index, total, CHART_RADIUS);

            return <line key={index} x1={CENTER} x2={outer.x} y1={CENTER} y2={outer.y} />;
          })}
        </g>
        <polygon
          fill={RADAR_COLOR}
          fillOpacity="0.28"
          points={pointsToString(radarPoints)}
          stroke={RADAR_COLOR}
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
        {displayData.map((item, index) => {
          const point = pointAt(index, total, (item.displayValue / 100) * CHART_RADIUS);

          return (
            <circle key={item.name} cx={point.x} cy={point.y} fill={RADAR_COLOR} r="1.15">
              <title>{`${item.name} · ${item.value}`}</title>
            </circle>
          );
        })}
        {data.map((item, index) => {
          const point = pointAt(index, total, LABEL_RADIUS);

          return (
            <text
              key={item.name}
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="4.8"
              opacity="0.68"
              textAnchor={labelAnchor(point.x)}
              x={point.x}
              y={point.y}
            >
              {item.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { ProfileInterval } from "./mockProfileSeries";

const ProfileChart = ({ rows }: { rows: ProfileInterval[] }) => {
  const data = rows.map((r) => ({
    idx: r.index,
    hour: r.hour,
    timestamp: r.timestamp,
    scalingFactor: r.scalingFactor,
    mwTarget: r.mwTarget,
    mvarComponent: r.mvarComponent,
  }));

  return (
    <div className="bg-atmo-0 border border-atmo-4 rounded-md p-6 h-[640px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 32, bottom: 16, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="idx"
            tickFormatter={(i) => {
              const r = data[i];
              return r ? `${String(r.hour).padStart(2, "0")}:00` : "";
            }}
            interval={7}
            stroke="#64748B"
            fontSize={11}
          />
          <YAxis yAxisId="left" domain={[0, 1]} stroke="#64748B" fontSize={11} tickFormatter={(v) => v.toFixed(2)} />
          <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={11} />
          <Tooltip
            contentStyle={{ fontSize: 12, fontFamily: "inherit" }}
            labelFormatter={(i) => data[i as number]?.timestamp ?? ""}
            formatter={(value: number, name: string) => [
              typeof value === "number" ? value.toFixed(2) : value,
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line yAxisId="left" type="monotone" dataKey="scalingFactor" name="Scaling Factor" stroke="#2563EB" dot={false} strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="mwTarget" name="MW Target" stroke="#F59E0B" dot={false} strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="mvarComponent" name="MVAR" stroke="#10B981" dot={false} strokeWidth={1.5} strokeDasharray="4 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfileChart;

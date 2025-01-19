import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Example 2D time-series data
const data = [
  { timestep: 1, channel1: 10, channel2: 15, channel3: 20 },
  { timestep: 2, channel1: 12, channel2: 18, channel3: 22 },
  { timestep: 3, channel1: 14, channel2: 20, channel3: 25 },
  { timestep: 4, channel1: 16, channel2: 22, channel3: 28 },
];

// The `LineChart` component
export default function TimeSeriesChart = () => (
  <LineChart
    width={600}
    height={300}
    data={data}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="timestep" label={{ value: "Timesteps", position: "insideBottomRight", offset: -5 }} />
    <YAxis label={{ value: "Values", angle: -90, position: "insideLeft" }} />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="channel1" stroke="#8884d8" />
    <Line type="monotone" dataKey="channel2" stroke="#82ca9d" />
    <Line type="monotone" dataKey="channel3" stroke="#ffc658" />
  </LineChart>
);

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// The `LineChart` component
export default function TimeSeriesChart(props: { data: any, ts: any, fs: any, yax_label: any }) {
    // Preprocess the data
    function preprocessData(data: any, ts: any, fs: any) {
        const numChannels = data.length;
        const numSamples = data[0].length;
      
        // Create an array of objects for each sample
        const result = Array.from({ length: numSamples }, (_, sampleIdx) => {
          const entry: { [key: string]: any } = { timestep: ts + sampleIdx / fs }; // Adjust timestep to match sampling rate
          for (let channelIdx = 0; channelIdx < numChannels; channelIdx++) {
            entry[`channel${channelIdx + 1}`] = data[channelIdx][sampleIdx];
          }
          return entry;
        });
      
        return result;
      }
  
    const processedData = preprocessData(props.data, props.ts, props.fs);

  return (
    <LineChart
      width={600}
      height={300}
      data={processedData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestep" label={{ value: "Time (s)", position: "insideBottomRight", offset: -5 }} />
      <YAxis label={{ value: props.yax_label, angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      {Object.keys(processedData[0]).filter(key => key !== "timestep").map(channel => (
        <Line key={channel} type="monotone" dataKey={channel} />
      ))}
    </LineChart>
  );
  }

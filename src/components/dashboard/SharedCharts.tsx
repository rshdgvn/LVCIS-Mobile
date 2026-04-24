import React from "react";
import { Dimensions, Text, View } from "react-native";
import Svg, { Circle, Path, Circle as SvgCircle } from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

export const CircularProgress = ({
  percent,
  size = 70,
  strokeWidth = 8,
  color = "#3b82f6",
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#111827" }}>
        {percent}%
      </Text>
    </View>
  );
};

export const LineChart = ({
  data,
}: {
  data: { label: string; value: number }[];
}) => {
  const chartW = CARD_WIDTH - 40;
  const chartH = 100;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 8;

  const minVal = Math.min(...data.map((d) => d.value));
  const maxVal = Math.max(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1)) * (chartW - padLeft - padRight);
    const y =
      padTop + (1 - (d.value - minVal) / range) * (chartH - padTop - padBottom);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <View>
      <Svg width={chartW} height={chartH}>
        <Path
          d={linePath}
          stroke="#3b82f6"
          strokeWidth={3}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <SvgCircle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4.5}
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
          paddingHorizontal: padLeft,
        }}
      >
        {data.map((d) => (
          <Text
            key={d.label}
            style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600" }}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

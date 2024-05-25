import { ColorType, CrosshairMode, CrosshairOptions, DeepPartial, LineStyle } from "lightweight-charts";
import { DEFAULT_CHART_COLORS } from "./types";

export const tickMarkFormat = (time: number, timeOption: string) => {
  if (timeOption === '1m') {
    return new Date(time * 1000).toLocaleString("zh-CN", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
  } else {
    return new Date(time * 1000).toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      hour12: false,
    });
  }
}

export const localizationTimeFormat = (time: number, timeOption: string) => {
  if (timeOption === '1m') {
    return new Date(time * 1000).toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    return new Date(time * 1000).toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export const gridConfig = {
  vertLines: {
    visible: true,
    color: '#1A1E23'
  },
  horzLines: {
    visible: true,
    color: '#1A1E23'
  },
}

export const crosshairConfig:DeepPartial<CrosshairOptions> | undefined = {
  vertLine: {
    width: 1,
    color: 'white',
    labelBackgroundColor: '#2A2E34',
  },
  horzLine: {
    width: 1,
    color: 'white',
    labelBackgroundColor: '#2A2E34',
    
  }
}

export const layoutConfig = {
  background: { type: ColorType.Solid, color: DEFAULT_CHART_COLORS.backgroundColor },
  textColor: DEFAULT_CHART_COLORS.textColor,
}
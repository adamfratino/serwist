import type { COLOR_SCHEMES } from "./constants";

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export interface TocEntry {
  title: string;
  id: string;
  children?: TocEntry[];
}

export interface TwoslashProps {
  id: string | undefined;
  html: string | undefined;
  bottom: boolean;
  right: boolean;
  x: number | undefined;
  y: number | undefined;
  closeTooltip(): void;
  timeout: NodeJS.Timeout | undefined;
}

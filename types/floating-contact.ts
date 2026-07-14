export type FloatingContactDataSource =
  | "hotline"
  | "zalo"
  | "messenger"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "custom";

export type FloatingContactActionType =
  | "phone"
  | "zalo"
  | "internal"
  | "external";

export interface FloatingContactItem {
  id: string;
  label: string;
  dataSource: FloatingContactDataSource;
  actionType: FloatingContactActionType;
  url?: string;
  iconMediaId?: string | null;
  iconUrl?: string | null;
  target: "_self" | "_blank";
  badge?: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface FloatingContactConfig {
  enabled: boolean;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  desktopTopPercent: number;
  mobileBackgroundColor: string;
  desktopBackgroundColor: string;
  items: FloatingContactItem[];
}

export interface ResolvedFloatingContactItem extends FloatingContactItem {
  href: string;
  resolvedIconUrl: string | null;
}

export interface ResolvedFloatingContactConfig
  extends Omit<FloatingContactConfig, "items"> {
  items: ResolvedFloatingContactItem[];
}

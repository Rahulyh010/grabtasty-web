// types/index.ts

export interface SystemCodeInfo {
  name: string;
  pattern: string;
  patternDescription: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
  description: string;
  daysPerWeek: number;
}

export interface Subscription {
  comboId: string;
  systemCode: string;
  cuisineType: string;
  weeklyPrice: number;
  monthlyPrice: number;
  quarterlyPrice: number;
  isPublished: boolean;
  isDraft: boolean;
  sampleDishes: string[];
  customizations: {
    allowChapatiRiceChoice: boolean;
    allowSpiceLevelChoice: boolean;
    allowPortionChoice: boolean;
  };
  createdAt: string;
  lastModified: string;
  systemCodeInfo: SystemCodeInfo;
}

export interface Kitchen {
  _id: string;
  name: string;
  address: string;
  phone: string;
  adminName: string;
  pincodes: string[];
  banner?: string;
  approved: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface KitchenSubscriptionsResponse {
  message: string;
  kitchen: Kitchen;
  subscriptions: Subscription[];
  totalSubscriptions: number;
  filters: {
    systemCode?: string;
    cuisineType?: string;
    mealType?: string;
  };
}

export interface KitchenDetailsResponse {
  message: string;
  data: Kitchen;
}

export type Sentiment = 'LOVED_REPEAT' | 'GOOD_ONCE' | 'SKIP';

export type PriceLevel = 1 | 2 | 3 | 4;

export interface DietaryAttributes {
  isPureVeg?: boolean;
  isHalal?: boolean;
  isJainFriendly?: boolean;
  servesAlcohol?: boolean;
  isPetFriendly?: boolean;
  hasOutdoorSeating?: boolean;
  hasSpecialtyCoffee?: boolean;
  hasFilterCoffee?: boolean;
  isLateNight?: boolean;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  tasteBio?: string;
  isCurrentUser?: boolean;
  favoriteNeighborhood?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  neighborhood: 'Alwarpet' | 'Nungambakkam' | 'Mylapore' | 'T. Nagar' | 'Poes Garden' | 'Besant Nagar' | 'Anna Nagar' | 'ECR';
  address: string;
  lat: number;
  lng: number;
  priceLevel: PriceLevel;
  cuisine: string[];
  coverImage: string;
  attributes: DietaryAttributes;
  popularDishes: string[];
}

export interface Visit {
  id: string;
  userId: string;
  restaurantId: string;
  sentiment: Sentiment;
  visitCount: number;
  topDishes: string[];
  vibeTags: string[];
  note?: string;
  createdAt: string; // ISO date
}

export interface Wishlist {
  userId: string;
  restaurantId: string;
  createdAt: string;
}

export interface RestaurantWithFriendInsights extends Restaurant {
  friendVisits: {
    user: User;
    visitCount: number;
    sentiment: Sentiment;
    topDishes: string[];
    vibeTags: string[];
    note?: string;
    visitedAt: string;
  }[];
  totalFriendVisits: number;
  repeatFriendCount: number; // Friends who visited > 1 time
  repeatScore: number; // % of friends who loved & returned
  topFriendDish?: string;
  distanceKm?: number;
  isWishlistedByCurrentUser?: boolean;
}

export interface GroupConsensusPick {
  restaurant: RestaurantWithFriendInsights;
  score: number;
  reasons: string[];
  vetoAlert?: boolean;
}

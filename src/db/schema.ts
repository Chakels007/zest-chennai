import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// 1. USERS
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  handle: varchar('handle', { length: 100 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  tasteBio: text('taste_bio'),
  favoriteNeighborhood: varchar('favorite_neighborhood', { length: 100 }).default('Alwarpet'),
  dietaryPreferences: jsonb('dietary_preferences').$type<{
    isPureVeg?: boolean;
    isHalalOnly?: boolean;
    isJain?: boolean;
  }>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. NEIGHBORHOODS
export const neighborhoods = pgTable('neighborhoods', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  city: varchar('city', { length: 50 }).default('Chennai').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
});

// 3. RESTAURANTS
export const restaurants = pgTable('restaurants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  neighborhood: varchar('neighborhood', { length: 100 }).notNull(),
  address: text('address').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  priceLevel: integer('price_level').default(2).notNull(),
  cuisine: text('cuisine').array().notNull(),
  coverImage: text('cover_image').notNull(),
  popularDishes: text('popular_dishes').array().notNull(),
  attributes: jsonb('attributes').$type<{
    isPureVeg?: boolean;
    isHalal?: boolean;
    isJainFriendly?: boolean;
    servesAlcohol?: boolean;
    isPetFriendly?: boolean;
    hasOutdoorSeating?: boolean;
    hasSpecialtyCoffee?: boolean;
    hasFilterCoffee?: boolean;
    isLateNight?: boolean;
  }>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. FRIENDSHIPS
export const friendships = pgTable('friendships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  friendId: uuid('friend_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 20 }).default('ACCEPTED').notNull(), // PENDING, ACCEPTED
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. VISITS (Repeat Dining Signal)
export const visits = pgTable('visits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id).notNull(),
  sentiment: varchar('sentiment', { length: 20 }).notNull(), // LOVED_REPEAT, GOOD_ONCE, SKIP
  visitCount: integer('visit_count').default(1).notNull(),
  topDishes: text('top_dishes').array().notNull(),
  vibeTags: text('vibe_tags').array().default([]),
  note: text('note'),
  visitedAt: timestamp('visited_at').defaultNow().notNull(),
});

// 6. WISHLISTS
export const wishlists = pgTable('wishlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

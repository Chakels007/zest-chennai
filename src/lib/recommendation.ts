import {
  Restaurant,
  RestaurantWithFriendInsights,
  Visit,
  User,
  Wishlist,
  GroupConsensusPick,
} from '@/types';
import { calculateDistanceKm, CHENNAI_DEFAULT_COORDS } from './geo';

export function enrichRestaurantsWithInsights(
  restaurants: Restaurant[],
  visits: Visit[],
  friends: User[],
  wishlists: Wishlist[],
  currentUserId: string = 'user_me',
  userLat: number = CHENNAI_DEFAULT_COORDS.lat,
  userLng: number = CHENNAI_DEFAULT_COORDS.lng
): RestaurantWithFriendInsights[] {
  const friendsMap = new Map(friends.map((f) => [f.id, f]));
  const userWishlistSet = new Set(
    wishlists.filter((w) => w.userId === currentUserId).map((w) => w.restaurantId)
  );

  return restaurants.map((r) => {
    // Visits from friends
    const restaurantVisits = visits.filter((v) => v.restaurantId === r.id);
    
    const friendVisits = restaurantVisits
      .filter((v) => friendsMap.has(v.userId))
      .map((v) => ({
        user: friendsMap.get(v.userId)!,
        visitCount: v.visitCount,
        sentiment: v.sentiment,
        topDishes: v.topDishes,
        vibeTags: v.vibeTags,
        note: v.note,
        visitedAt: v.createdAt,
      }));

    const totalFriendVisits = friendVisits.reduce((acc, fv) => acc + fv.visitCount, 0);
    const repeatFriends = friendVisits.filter((fv) => fv.visitCount > 1 || fv.sentiment === 'LOVED_REPEAT');
    const repeatFriendCount = repeatFriends.length;

    // Repeat score: ratio of loved repeats over total friends who visited
    const repeatScore = friendVisits.length > 0 
      ? Math.round((repeatFriendCount / friendVisits.length) * 100) 
      : 0;

    // Aggregate most recommended dish among friends
    const dishCounts: Record<string, number> = {};
    friendVisits.forEach((fv) => {
      fv.topDishes.forEach((dish) => {
        dishCounts[dish] = (dishCounts[dish] || 0) + fv.visitCount;
      });
    });

    let topFriendDish: string | undefined = undefined;
    let maxDishCount = 0;
    Object.entries(dishCounts).forEach(([dish, count]) => {
      if (count > maxDishCount) {
        maxDishCount = count;
        topFriendDish = dish;
      }
    });

    const distanceKm = calculateDistanceKm(userLat, userLng, r.lat, r.lng);

    return {
      ...r,
      friendVisits,
      totalFriendVisits,
      repeatFriendCount,
      repeatScore,
      topFriendDish: topFriendDish || r.popularDishes[0],
      distanceKm,
      isWishlistedByCurrentUser: userWishlistSet.has(r.id),
    };
  });
}

/**
 * The "Friday Night Consensus Engine":
 * Computes the 3 best matching restaurants for an active group of friends.
 */
export function computeGroupConsensus(
  selectedFriendIds: string[],
  allEnriched: RestaurantWithFriendInsights[],
  wishlists: Wishlist[],
  targetNeighborhood: string = 'All'
): GroupConsensusPick[] {
  const selectedUserSet = new Set(selectedFriendIds);

  const eligibleRestaurants = allEnriched.filter((r) => {
    if (targetNeighborhood !== 'All' && r.neighborhood !== targetNeighborhood) {
      return false;
    }
    return true;
  });

  const picks: GroupConsensusPick[] = eligibleRestaurants.map((restaurant) => {
    let score = 0;
    const reasons: string[] = [];
    let hasVeto = false;

    // Check for Veto (any friend marked 'SKIP')
    const friendVisitsInGroup = restaurant.friendVisits.filter((fv) =>
      selectedUserSet.has(fv.user.id)
    );

    const skipVisit = friendVisitsInGroup.find((fv) => fv.sentiment === 'SKIP');
    if (skipVisit) {
      hasVeto = true;
      reasons.push(`⚠️ ${skipVisit.user.name} had a bad experience here.`);
      score -= 50;
    }

    // Wishlist overlaps (High intent)
    const friendsWithInWishlist = wishlists
      .filter((w) => w.restaurantId === restaurant.id && selectedUserSet.has(w.userId));

    if (friendsWithInWishlist.length > 0) {
      score += friendsWithInWishlist.length * 15;
      reasons.push(
        `⭐ On ${friendsWithInWishlist.length} friend${
          friendsWithInWishlist.length > 1 ? 's\'' : '\'s'
        } must-try wishlist`
      );
    }

    // Repeat visits from the group
    friendVisitsInGroup.forEach((fv) => {
      if (fv.sentiment === 'LOVED_REPEAT') {
        const repeatBonus = fv.visitCount * 10;
        score += repeatBonus;
        reasons.push(`🔁 ${fv.user.name.split(' ')[0]} visited ${fv.visitCount}x and loved it`);
      } else if (fv.sentiment === 'GOOD_ONCE') {
        score += 5;
      }
    });

    // Baseline quality
    score += restaurant.repeatFriendCount * 4;

    return {
      restaurant,
      score,
      reasons,
      vetoAlert: hasVeto,
    };
  });

  // Sort descending by consensus score
  return picks
    .filter((p) => !p.vetoAlert)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

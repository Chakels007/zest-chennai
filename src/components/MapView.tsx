'use client';

import React, { useEffect, useRef } from 'react';
import { RestaurantWithFriendInsights } from '@/types';
import L from 'leaflet';

interface MapViewProps {
  restaurants: RestaurantWithFriendInsights[];
  selectedNeighborhood: string;
  onSelectRestaurant: (restaurant: RestaurantWithFriendInsights) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  restaurants,
  selectedNeighborhood,
  onSelectRestaurant,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map centered on Central Chennai (Alwarpet)
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([13.0336, 80.2524], 14);

      // Add OpenStreetMap tiles with custom dark styling via CSS filter in globals.css
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when restaurants or neighborhood changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = L.latLngBounds([]);

    restaurants.forEach((restaurant) => {
      bounds.extend([restaurant.lat, restaurant.lng]);

      const hasRepeat = restaurant.repeatFriendCount > 0;
      const markerColor = hasRepeat ? '#ff5722' : '#3b82f6';

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${markerColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            color: white;
            font-size: 13px;
            font-weight: 800;
          ">
            ${hasRepeat ? '🔥' : '📍'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([restaurant.lat, restaurant.lng], { icon: customIcon });

      const popupHtml = `
        <div style="min-width: 180px; padding: 4px;">
          <h4 style="font-weight: 800; font-size: 13px; margin: 0 0 2px 0; color: #fff;">
            ${restaurant.name}
          </h4>
          <p style="font-size: 11px; color: #9ca3af; margin: 0 0 6px 0;">
            ${restaurant.neighborhood} · ${restaurant.cuisine[0]}
          </p>
          ${
            restaurant.friendVisits.length > 0
              ? `<div style="font-size: 11px; color: #fbbf24; font-weight: 600; margin-bottom: 4px;">
                   👥 ${restaurant.friendVisits.length} friend(s) visited
                 </div>`
              : `<div style="font-size: 11px; color: #6b7280; margin-bottom: 4px;">Unvisited by friends</div>`
          }
          <div style="font-size: 11px; color: #f97316; font-weight: 700;">
            🍴 ${restaurant.topFriendDish || restaurant.popularDishes[0]}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersLayerRef.current?.addLayer(marker);
    });

    if (restaurants.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [restaurants]);

  return (
    <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 z-[1000] bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-gray-300 flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
        <span>Central Chennai Taste Map ({restaurants.length} spots)</span>
      </div>
    </div>
  );
};

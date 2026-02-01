import { useState, useEffect, useCallback } from "react";
import { MapPin, Loader2, Navigation, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================
// NEARBY PLACES EXPLORER COMPONENT
// ============================================
// This component:
// 1. Requests user's location permission
// 2. Gets latitude/longitude from browser
// 3. Queries Overpass API for nearby places
// 4. Shows an interactive Leaflet map
// 5. Displays categorized lists of places
// ============================================

// Category configuration with Overpass API tags
const CATEGORIES = [
  {
    id: "hospitals",
    name: "Hospitals",
    icon: "🏥",
    tags: ["amenity=hospital", "amenity=clinic"],
    color: "bg-red-500"
  },
  {
    id: "landmarks",
    name: "Landmarks",
    icon: "🏛️",
    tags: ["tourism=museum", "tourism=attraction", "historic=monument", "historic=memorial"],
    color: "bg-purple-500"
  },
  {
    id: "nature",
    name: "Nature",
    icon: "🌳",
    tags: ["leisure=park", "leisure=garden", "natural=beach", "natural=water", "tourism=viewpoint"],
    color: "bg-green-500"
  },
  {
    id: "food",
    name: "Food & Cafes",
    icon: "🍽️",
    tags: ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"],
    color: "bg-orange-500"
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎭",
    tags: ["tourism=zoo", "tourism=aquarium", "tourism=theme_park", "amenity=theatre", "amenity=cinema"],
    color: "bg-pink-500"
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    tags: ["shop=mall", "shop=supermarket", "amenity=marketplace"],
    color: "bg-blue-500"
  },
  {
    id: "cultural",
    name: "Cultural",
    icon: "🛕",
    tags: ["amenity=place_of_worship", "tourism=gallery", "amenity=community_centre"],
    color: "bg-yellow-500"
  },
  {
    id: "adventure",
    name: "Adventure",
    icon: "🏔️",
    tags: ["sport=climbing", "sport=skiing", "leisure=sports_centre"],
    color: "bg-indigo-500"
  },
  {
    id: "scenic",
    name: "Scenic Views",
    icon: "🌅",
    tags: ["tourism=viewpoint", "natural=peak", "waterway=waterfall"],
    color: "bg-teal-500"
  }
];

// Type definitions
interface Place {
  id: number;
  name: string;
  lat: number;
  lon: number;
  category: string;
  categoryIcon: string;
  distance: number;
  tags: Record<string, string>;
}

interface UserLocation {
  lat: number;
  lon: number;
}

// Calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Lazy load the map component to avoid SSR issues
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom user location marker (blue)
const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 14);
  }, [lat, lon, map]);
  return null;
};

const NearbyExplorer = () => {
  // State management
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchRadius, setSearchRadius] = useState(3); // km

  // ============================================
  // STEP 1: Request Location Permission
  // ============================================
  const requestLocation = useCallback(() => {
    setLocationLoading(true);
    setError(null);

    // Check if geolocation is available in the browser
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    // Request user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success: Save the coordinates
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setLocationLoading(false);
      },
      (err) => {
        // Error: Handle different error types
        let message = "Unable to get your location";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "Location permission denied. Please enable location access in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        setError(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // ============================================
  // STEP 2: Fetch Nearby Places from Overpass API
  // ============================================
  const fetchNearbyPlaces = useCallback(async () => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    try {
      // Build Overpass API query for all categories
      const allTags = CATEGORIES.flatMap((cat) => cat.tags);
      const tagQueries = allTags.map((tag) => {
        const [key, value] = tag.split("=");
        return `node["${key}"="${value}"](around:${searchRadius * 1000},${userLocation.lat},${userLocation.lon});`;
      }).join("\n");

      const query = `
        [out:json][timeout:25];
        (
          ${tagQueries}
        );
        out body;
      `;

      // Send request to Overpass API
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nearby places");
      }

      const data = await response.json();

      // Process the results
      const processedPlaces: Place[] = data.elements
        .filter((el: any) => el.tags && el.tags.name) // Only keep places with names
        .map((el: any) => {
          // Find which category this place belongs to
          let matchedCategory = CATEGORIES[0];
          for (const cat of CATEGORIES) {
            for (const tag of cat.tags) {
              const [key, value] = tag.split("=");
              if (el.tags[key] === value) {
                matchedCategory = cat;
                break;
              }
            }
          }

          return {
            id: el.id,
            name: el.tags.name,
            lat: el.lat,
            lon: el.lon,
            category: matchedCategory.id,
            categoryIcon: matchedCategory.icon,
            distance: calculateDistance(userLocation.lat, userLocation.lon, el.lat, el.lon),
            tags: el.tags
          };
        })
        .sort((a: Place, b: Place) => a.distance - b.distance); // Sort by distance

      setPlaces(processedPlaces);
    } catch (err) {
      setError("Failed to fetch nearby places. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userLocation, searchRadius]);

  // Fetch places when location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyPlaces();
    }
  }, [userLocation, fetchNearbyPlaces]);

  // Filter places by selected category
  const filteredPlaces = selectedCategory === "all"
    ? places
    : places.filter((p) => p.category === selectedCategory);

  // Count places per category
  const getCategoryCount = (categoryId: string) => {
    return places.filter((p) => p.category === categoryId).length;
  };

  return (
    <section id="nearby" className="section-padding bg-gradient-to-br from-nepal-sky/5 via-background to-accent/5">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-nepal-terracotta/10 text-nepal-terracotta px-4 py-2 rounded-full mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Explore Nearby</span>
          </div>
          <h2 className="heading-section text-foreground mb-4">
            Discover <span className="italic text-nepal-terracotta">Places</span> Around You
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Find hospitals, landmarks, restaurants, and more near your current location. Allow location access to explore what's nearby.
          </p>
        </div>

        {/* Location Permission Request */}
        {!userLocation && (
          <div className="max-w-md mx-auto text-center bg-card rounded-3xl p-8 shadow-card border border-border mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nepal-terracotta/10 flex items-center justify-center">
              <Navigation className="h-10 w-10 text-nepal-terracotta" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
              Enable Location Access
            </h3>
            <p className="text-muted-foreground mb-6">
              To show nearby places, we need access to your current location. Your location data is only used locally and never stored.
            </p>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm mb-4 bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button
              onClick={requestLocation}
              disabled={locationLoading}
              className="btn-accent gap-2"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Allow Location Access
                </>
              )}
            </Button>
          </div>
        )}

        {/* Main Content - After Location is Granted */}
        {userLocation && (
          <div className="space-y-8">
            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-nepal-terracotta" />
                <span>
                  Your location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Radius:</span>
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="bg-secondary rounded-lg px-3 py-1.5 text-sm border border-border"
                  >
                    <option value={1}>1 km</option>
                    <option value={3}>3 km</option>
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                  </select>
                </div>
                <Button
                  onClick={fetchNearbyPlaces}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "btn-primary" : ""}
              >
                All ({places.length})
              </Button>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`gap-1 ${selectedCategory === cat.id ? "btn-primary" : ""}`}
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                  <span>({getCategoryCount(cat.id)})</span>
                </Button>
              ))}
            </div>

            {/* Error State */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-4 rounded-lg justify-center">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-nepal-terracotta" />
                <span className="text-muted-foreground">Searching nearby places...</span>
              </div>
            )}

            {/* Map and Results Grid */}
            {!loading && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Interactive Leaflet Map */}
                <div className="bg-card rounded-3xl overflow-hidden shadow-card border border-border h-[400px] lg:h-[600px]">
                  <MapContainer
                    center={[userLocation.lat, userLocation.lon]}
                    zoom={14}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                  >
                    {/* Map tiles from OpenStreetMap */}
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Recenter map component */}
                    <RecenterMap lat={userLocation.lat} lon={userLocation.lon} />

                    {/* User's location marker */}
                    <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>📍 You are here</strong>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Markers for each nearby place */}
                    {filteredPlaces.map((place) => (
                      <Marker
                        key={place.id}
                        position={[place.lat, place.lon]}
                        icon={defaultIcon}
                      >
                        <Popup>
                          <div className="text-center min-w-[150px]">
                            <div className="text-lg mb-1">{place.categoryIcon}</div>
                            <strong>{place.name}</strong>
                            <div className="text-sm text-gray-500 mt-1">
                              {place.distance.toFixed(2)} km away
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Places List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <h3 className="font-display text-xl font-semibold text-foreground sticky top-0 bg-background/95 backdrop-blur py-2">
                    {filteredPlaces.length} Places Found
                  </h3>
                  
                  {filteredPlaces.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                      <p className="text-muted-foreground">
                        No places found in this category within {searchRadius} km.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredPlaces.map((place) => (
                        <div
                          key={place.id}
                          className="bg-card rounded-xl p-4 border border-border hover:border-nepal-terracotta/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{place.categoryIcon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {place.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {CATEGORIES.find((c) => c.id === place.category)?.name}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  📍 {place.distance.toFixed(2)} km away
                                </span>
                              </div>
                              {place.tags.opening_hours && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  🕐 {place.tags.opening_hours}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyExplorer;

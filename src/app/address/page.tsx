/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

// Define types for Leaflet
type LeafletMap = any;
type LeafletMarker = any;
type LeafletLatLng = { lat: number; lng: number };

interface FormData {
  fullName: string;
  phoneNumber: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
  latitude: number;
  longitude: number;
  locationType: "home" | "office" | "other";
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
  lat?: string;
  lon?: string;
}

type LocationAccuracy = "high" | "medium" | "low" | "error" | "detecting";

export default function LocationPickerPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap>(null);
  const markerRef = useRef<LeafletMarker>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    address: "",
    landmark: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "",
    area: "",
    latitude: 12.9716,
    longitude: 77.5946,
    locationType: "home",
  });

  const [showMap, setShowMap] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationAccuracy, setLocationAccuracy] =
    useState<LocationAccuracy>("high");
  const [showLocationHelp, setShowLocationHelp] = useState<boolean>(false);

  // Initialize map when shown
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [showMap]);

  const initializeMap = async (): Promise<void> => {
    try {
      const L = (await import("leaflet")).default;

      // @ts-ignore - Leaflet type definitions issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [formData.latitude, formData.longitude],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div class="marker-pin">📍</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker([formData.latitude, formData.longitude], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      map.on("moveend", () => {
        const center: LeafletLatLng = map.getCenter();
        marker.setLatLng(center);
        updateLocationFromMap(center.lat, center.lng);
      });

      marker.on("dragend", (e: any) => {
        const latLng: LeafletLatLng = e.target.getLatLng();
        map.setView(latLng, map.getZoom());
        updateLocationFromMap(latLng.lat, latLng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const updateLocationFromMap = async (
    lat: number,
    lng: number
  ): Promise<void> => {
    setIsLoading(true);
    setLocationAccuracy("detecting");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      if (response.ok) {
        const data: NominatimResponse = await response.json();
        if (data && data.address) {
          const addr = data.address;

          // Build address parts
          const addressParts: string[] = [];
          if (addr.house_number) addressParts.push(addr.house_number);
          if (addr.road) addressParts.push(addr.road);

          const fullAddress =
            addressParts.length > 0
              ? addressParts.join(", ")
              : data.display_name || "";
          const area = addr.neighbourhood || addr.suburb || addr.quarter || "";
          const pincode = addr.postcode || "";
          const city = addr.city || addr.town || addr.village || "Bangalore";
          const state = addr.state || "Karnataka";

          // Auto-fill form
          setFormData((prev) => ({
            ...prev,
            address: fullAddress,
            area: area,
            pincode: pincode,
            city: city,
            state: state,
            latitude: lat,
            longitude: lng,
          }));

          // Determine location accuracy
          if (pincode && area) {
            setLocationAccuracy("high");
          } else if (area || pincode) {
            setLocationAccuracy("medium");
          } else {
            setLocationAccuracy("low");
          }
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationAccuracy("error");
      setShowLocationHelp(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = (): void => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);
        }

        updateLocationFromMap(lat, lng);
        setIsGettingLocation(false);
      },
      (error: GeolocationPositionError) => {
        setIsGettingLocation(false);
        setShowLocationHelp(true);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              "Location permission denied. Please search manually or enable location access."
            );
            break;
          default:
            alert(
              "Unable to get your location. Please use the search or drag the map."
            );
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const searchLocation = async (): Promise<void> => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Bangalore"
        )}&limit=1&countrycodes=in&addressdetails=1`
      );

      if (response.ok) {
        const results: NominatimResponse[] = await response.json();
        if (results.length > 0) {
          const result = results[0];
          const lat = parseFloat(result.lat || "0");
          const lng = parseFloat(result.lon || "0");

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
          }

          updateLocationFromMap(lat, lng);
          setSearchQuery("");
        } else {
          alert("Location not found. Please try a different search term.");
        }
      }
    } catch (error) {
      alert("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    if (locationAccuracy === "low" || locationAccuracy === "error") {
      if (
        !confirm("Location accuracy is low. Do you want to continue anyway?")
      ) {
        return;
      }
    }

    // Prepare data for API
    const submitData = {
      ...formData,
      coordinates: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      locationAccuracy: locationAccuracy,
      timestamp: new Date().toISOString(),
    };

    console.log("Submitting location data:", submitData);

    // Here you would make your API call
    try {
      // Example API call:
      // const response = await fetch('/api/save-location', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submitData)
      // });

      alert(
        "Location saved successfully! 📍\n\n" +
          `Address: ${formData.address}\n` +
          `Area: ${formData.area}\n` +
          `Pincode: ${formData.pincode}\n` +
          `Coordinates: ${formData.latitude.toFixed(
            6
          )}, ${formData.longitude.toFixed(6)}`
      );
    } catch (error) {
      alert("Failed to save location. Please try again.");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      searchLocation();
    }
  };

  const getAccuracyMessage = (): {
    text: string;
    color: string;
    bg: string;
  } => {
    switch (locationAccuracy) {
      case "high":
        return {
          text: "📍 Accurate location detected",
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case "medium":
        return {
          text: "⚠️ Partially accurate - please verify",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        };
      case "low":
        return {
          text: "❌ Low accuracy - drag map to adjust",
          color: "text-red-600",
          bg: "bg-red-50",
        };
      case "error":
        return {
          text: "❌ Location detection failed",
          color: "text-red-600",
          bg: "bg-red-50",
        };
      case "detecting":
        return {
          text: "🔄 Detecting location...",
          color: "text-blue-600",
          bg: "bg-blue-50",
        };
      default:
        return {
          text: "📍 Click map to set location",
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Delivery Location
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in your details and set precise location
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Location Accuracy Status */}
        <div
          className={`mb-6 p-4 rounded-lg border ${getAccuracyMessage().bg} ${
            getAccuracyMessage().color
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{getAccuracyMessage().text}</span>
            {(locationAccuracy === "low" || locationAccuracy === "error") && (
              <button
                onClick={() => setShowLocationHelp(!showLocationHelp)}
                className="text-sm underline"
              >
                Need help?
              </button>
            )}
          </div>

          {showLocationHelp && (
            <div className="mt-3 text-sm">
              <p className="mb-2">
                <strong>To improve location accuracy:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use "Get Current Location" for GPS positioning</li>
                <li>Search for nearby landmarks or addresses</li>
                <li>Drag the map marker to exact position</li>
                <li>Zoom in closer for better precision</li>
              </ul>
            </div>
          )}
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {/* Personal Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Type
            </label>
            <div className="flex gap-4">
              {(["home", "office", "other"] as const).map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="locationType"
                    value={type}
                    checked={formData.locationType === type}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Address Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Address Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="House/Flat number, Street name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nearby landmark"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Locality
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Area name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Coordinates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Set Precise Location
              </h2>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {showMap ? "Hide Map" : "Show Map"}
              </button>
            </div>

            {showMap && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Map Controls */}
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="flex">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Search location in Bangalore..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={searchLocation}
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400"
                        >
                          {isLoading ? "..." : "🔍"}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2"
                    >
                      {isGettingLocation ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Getting...
                        </>
                      ) : (
                        <>📍 Current Location</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Map */}
                <div className="h-96 relative">
                  <div
                    ref={mapRef}
                    className="h-full w-full"
                    style={{ background: "#f5f5f5" }}
                  >
                    {!mapLoaded && showMap && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="text-4xl mb-3">🗺️</div>
                          <div className="text-lg font-medium text-gray-700">
                            Loading Map...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Instructions */}
                <div className="bg-blue-50 p-3 border-t border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Pro tip:</strong> Drag the map or marker to
                    adjust location. Zoom in for better accuracy.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors shadow-md"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>

      {/* CSS */}
      <style jsx global>{`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css");

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .marker-pin {
          font-size: 24px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

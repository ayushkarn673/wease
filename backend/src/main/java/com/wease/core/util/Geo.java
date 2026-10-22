package com.wease.core.util;

import com.wease.core.exception.BadRequestException;

public final class Geo {

    // Professionals serve customers within this distance of their base location.
    public static final double SERVICE_RADIUS_KM = 10.0;

    private static final double EARTH_RADIUS_KM = 6371.0;

    private Geo() {
    }

    // Great-circle distance between two points (haversine formula).
    public static double distanceKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Wease operates in India; this catches swapped or mistyped coordinates.
    public static void requireInIndia(Double lat, Double lng) {
        if (lat == null || lng == null) {
            throw new BadRequestException("Choose a location on the map.");
        }
        if (!isInIndia(lat, lng)) {
            throw new BadRequestException("That location is outside India. Please choose it again on the map.");
        }
    }

    public static boolean isInIndia(Double lat, Double lng) {
        return lat != null && lng != null && lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
    }

    // About 1 km precision: enough to show a service area without revealing someone's exact address.
    public static Double approximate(Double value) {
        return value == null ? null : Math.round(value * 100) / 100.0;
    }

    public static double roundKm(double km) {
        return Math.round(km * 10) / 10.0;
    }
}
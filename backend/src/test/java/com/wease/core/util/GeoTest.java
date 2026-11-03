package com.wease.core.util;

import com.wease.core.exception.BadRequestException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.within;

class GeoTest {

    @Test
    @DisplayName("Distance between two known points (Alambagh bus station → Charbagh, Lucknow ≈ 2.5 km)")
    void distanceBetweenKnownPoints() {
        double km = Geo.distanceKm(26.8146, 80.9022, 26.8318, 80.9200);

        assertThat(km).isCloseTo(2.6, within(0.3));
    }

    @Test
    @DisplayName("Distance is zero for the same point and the same in both directions")
    void distanceIsSymmetric() {
        assertThat(Geo.distanceKm(18.52, 73.85, 18.52, 73.85)).isZero();
        assertThat(Geo.distanceKm(18.52, 73.85, 19.07, 72.87))
                .isCloseTo(Geo.distanceKm(19.07, 72.87, 18.52, 73.85), within(1e-9));
    }

    @Test
    @DisplayName("Pune to Mumbai is about 120 km, well outside the 10 km service area")
    void longDistance() {
        double km = Geo.distanceKm(18.5204, 73.8567, 19.0760, 72.8777);

        assertThat(km).isBetween(110.0, 130.0);
        assertThat(km).isGreaterThan(Geo.SERVICE_RADIUS_KM);
    }

    @Test
    @DisplayName("Only locations inside India are accepted")
    void indiaBounds() {
        assertThat(Geo.isInIndia(26.81, 80.90)).isTrue();   // Lucknow
        assertThat(Geo.isInIndia(51.50, -0.12)).isFalse();  // London
        assertThat(Geo.isInIndia(80.90, 26.81)).isFalse();  // latitude and longitude swapped
        assertThat(Geo.isInIndia(null, 80.90)).isFalse();
    }

    @Test
    @DisplayName("A missing or foreign location is rejected with a clear message")
    void requireInIndia() {
        assertThatThrownBy(() -> Geo.requireInIndia(null, null))
                .isInstanceOf(BadRequestException.class).hasMessageContaining("Choose a location");
        assertThatThrownBy(() -> Geo.requireInIndia(51.5, -0.12))
                .isInstanceOf(BadRequestException.class).hasMessageContaining("outside India");
    }

    @Test
    @DisplayName("Public locations are rounded to about 1 km so exact addresses stay private")
    void approximateLocation() {
        assertThat(Geo.approximate(26.81468)).isEqualTo(26.81);
        assertThat(Geo.approximate(80.90251)).isEqualTo(80.90);
        assertThat(Geo.approximate(null)).isNull();
        assertThat(Geo.roundKm(8.6549)).isEqualTo(8.7);
    }
}

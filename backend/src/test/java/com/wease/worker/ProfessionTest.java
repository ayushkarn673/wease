package com.wease.worker;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProfessionTest {

    @Test
    @DisplayName("Trades read naturally in notifications")
    void labels() {
        assertThat(Profession.ELECTRICIAN.label()).isEqualTo("Electrician");
        assertThat(Profession.AC_TECHNICIAN.label()).isEqualTo("AC technician");
        assertThat(Profession.LABOURER.label()).isEqualTo("Labourer");
    }
}

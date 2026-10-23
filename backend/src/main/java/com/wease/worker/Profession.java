package com.wease.worker;

public enum Profession {
    CARPENTER,
    PAINTER,
    ELECTRICIAN,
    PLUMBER,
    MASON,
    CLEANER,
    AC_TECHNICIAN,
    LABOURER;

    // How the trade reads to people, e.g. "Electrician", "AC technician".
    public String label() {
        if (this == AC_TECHNICIAN) {
            return "AC technician";
        }
        String lower = name().toLowerCase(java.util.Locale.ROOT).replace('_', ' ');
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}

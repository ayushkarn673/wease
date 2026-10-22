package com.wease.quote;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record QuoteResponse(
        Long id,
        QuoteStatus status,
        boolean extraWork,
        BigDecimal labourTotal,
        BigDecimal materialTotal,
        BigDecimal otherTotal,
        BigDecimal total,
        String note,
        LocalDateTime createdAt,
        LocalDateTime respondedAt,
        List<Item> items
) {
    public record Item(Long id, QuoteItemType type, String description, Integer quantity,
                       BigDecimal unitPrice, BigDecimal amount) {
    }

    static QuoteResponse from(ServiceQuote quote) {
        return new QuoteResponse(
                quote.getId(), quote.getStatus(), Boolean.TRUE.equals(quote.getExtraWork()), quote.getLabourTotal(), quote.getMaterialTotal(),
                quote.getOtherTotal(), quote.getTotal(), quote.getNote(), quote.getCreatedAt(),
                quote.getRespondedAt(),
                quote.getItems().stream()
                        .map(i -> new Item(i.getId(), i.getType(), i.getDescription(), i.getQuantity(),
                                i.getUnitPrice(), i.getAmount()))
                        .toList());
    }
}
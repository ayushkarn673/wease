package com.wease.quote;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class QuoteRequest {

    @NotNull(message = "Add at least one item")
    @Size(min = 1, max = 20, message = "A quote needs between 1 and 20 items")
    private List<@Valid QuoteItemRequest> items;

    @Size(max = 500, message = "Keep the note under 500 characters")
    private String note;
}
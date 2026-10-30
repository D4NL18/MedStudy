package com.medstudy.backend.modules.clinic.dto;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Response payload for an atomic item purchase, extending ClinicStateResponse so clients can either
 * consume the updated clinic state directly or inspect purchasedItem (P-080, P-083, P-084).
 */
public class BuyClinicItemResponse extends ClinicStateResponse {

    private PlacedItemDto purchasedItem;
    private String message;

    public BuyClinicItemResponse() {
    }

    public static BuyClinicItemResponse from(PlacedItemDto purchasedItem, ClinicStateResponse state, String message) {
        BuyClinicItemResponse res = new BuyClinicItemResponse();
        res.setPurchasedItem(purchasedItem);
        res.setMessage(message);
        if (state != null) {
            res.setClinicId(state.getClinicId());
            res.setClinicName(state.getClinicName());
            res.setExpansionLevel(state.getExpansionLevel());
            res.setExpansionName(state.getExpansionName());
            res.setGridWidth(state.getGridWidth());
            res.setGridHeight(state.getGridHeight());
            res.setTheme(state.getTheme());
            res.setLifetimeXp(state.getLifetimeXp());
            res.setCurrentXp(state.getCurrentXp());
            res.setCurrentStreakDays(state.getCurrentStreakDays());
            res.setStreakMultiplierPercent(state.getStreakMultiplierPercent());
            res.setNextExpansionLevel(state.getNextExpansionLevel());
            res.setNextExpansionName(state.getNextExpansionName());
            res.setNextExpansionGridWidth(state.getNextExpansionGridWidth());
            res.setNextExpansionGridHeight(state.getNextExpansionGridHeight());
            res.setNextExpansionCostXp(state.getNextExpansionCostXp());
            res.setNextExpansionRequiredLifetimeXp(state.getNextExpansionRequiredLifetimeXp());
            res.setCanExpand(state.isCanExpand());
            res.setOwnedItemIds(state.getOwnedItemIds());
            res.setPlacedItems(state.getPlacedItems());
            res.setInventory(state.getInventory());
            res.setCatalog(state.getCatalog());
        }
        return res;
    }

    @Override
    public Map<String, Object> getData() {
        Map<String, Object> data = new LinkedHashMap<>(super.getData());
        data.put("purchasedItem", purchasedItem);
        data.put("placedItem", purchasedItem);
        data.put("message", message);
        return data;
    }

    public PlacedItemDto getPurchasedItem() {
        return purchasedItem;
    }

    public void setPurchasedItem(PlacedItemDto purchasedItem) {
        this.purchasedItem = purchasedItem;
    }

    public PlacedItemDto getPlacedItem() {
        return purchasedItem;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

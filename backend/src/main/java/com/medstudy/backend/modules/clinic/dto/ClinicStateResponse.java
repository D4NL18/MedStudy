package com.medstudy.backend.modules.clinic.dto;

import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Consolidated state response for the student's clinic, supporting both direct property access
 * and standardized {"data": ..., "meta": ...} envelope consumption (P-080, P-082, P-083, P-084).
 */
public class ClinicStateResponse {

    private UUID clinicId;
    private String clinicName;
    private int expansionLevel;
    private String expansionName;
    private int gridWidth;
    private int gridHeight;
    private String theme;
    private String wallTheme = "wall_clean_white";
    private String floorTheme = "floor_porcelanato_cinza";
    private DoctorAvatarDto avatar;
    private List<OwnedSurfaceDto> ownedSurfaces = new ArrayList<>();
    private long lifetimeXp;
    private long currentXp;
    private int currentStreakDays;
    private int streakMultiplierPercent;
    private Integer nextExpansionLevel;
    private String nextExpansionName;
    private Integer nextExpansionGridWidth;
    private Integer nextExpansionGridHeight;
    private Integer nextExpansionCostXp;
    private Long nextExpansionRequiredLifetimeXp;
    private boolean canExpand;
    private List<String> ownedItemIds = new ArrayList<>();
    private List<PlacedItemDto> placedItems = new ArrayList<>();
    private List<PlacedItemDto> inventory = new ArrayList<>();
    private List<ClinicCatalogItem> catalog = new ArrayList<>();

    public ClinicStateResponse() {
    }

    public Map<String, Object> getData() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("clinicId", clinicId);
        data.put("clinicName", clinicName);
        data.put("expansionLevel", expansionLevel);
        data.put("expansionName", expansionName);
        data.put("gridWidth", gridWidth);
        data.put("gridHeight", gridHeight);
        data.put("theme", theme);
        data.put("wallTheme", wallTheme);
        data.put("floorTheme", floorTheme);
        data.put("avatar", avatar);
        data.put("ownedSurfaces", ownedSurfaces);
        data.put("lifetimeXp", lifetimeXp);
        data.put("currentXp", currentXp);
        data.put("currentStreakDays", currentStreakDays);
        data.put("streakMultiplierPercent", streakMultiplierPercent);
        data.put("nextExpansionLevel", nextExpansionLevel);
        data.put("nextExpansionName", nextExpansionName);
        data.put("nextExpansionGridWidth", nextExpansionGridWidth);
        data.put("nextExpansionGridHeight", nextExpansionGridHeight);
        data.put("nextExpansionCostXp", nextExpansionCostXp);
        data.put("nextExpansionRequiredLifetimeXp", nextExpansionRequiredLifetimeXp);
        data.put("canExpand", canExpand);
        data.put("ownedItemIds", ownedItemIds);
        data.put("placedItems", placedItems);
        data.put("inventory", inventory);
        data.put("catalog", catalog);
        return data;
    }

    public Map<String, Object> getMeta() {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("timestamp", Instant.now().toString());
        meta.put("catalogTotalItems", catalog != null ? catalog.size() : 0);
        return meta;
    }

    public UUID getClinicId() {
        return clinicId;
    }

    public void setClinicId(UUID clinicId) {
        this.clinicId = clinicId;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public int getExpansionLevel() {
        return expansionLevel;
    }

    public void setExpansionLevel(int expansionLevel) {
        this.expansionLevel = expansionLevel;
    }

    public String getExpansionName() {
        return expansionName;
    }

    public void setExpansionName(String expansionName) {
        this.expansionName = expansionName;
    }

    public int getGridWidth() {
        return gridWidth;
    }

    public void setGridWidth(int gridWidth) {
        this.gridWidth = gridWidth;
    }

    public int getGridHeight() {
        return gridHeight;
    }

    public void setGridHeight(int gridHeight) {
        this.gridHeight = gridHeight;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getWallTheme() {
        return wallTheme;
    }

    public void setWallTheme(String wallTheme) {
        this.wallTheme = wallTheme;
    }

    public String getFloorTheme() {
        return floorTheme;
    }

    public void setFloorTheme(String floorTheme) {
        this.floorTheme = floorTheme;
    }

    public DoctorAvatarDto getAvatar() {
        return avatar;
    }

    public void setAvatar(DoctorAvatarDto avatar) {
        this.avatar = avatar;
    }

    public List<OwnedSurfaceDto> getOwnedSurfaces() {
        return ownedSurfaces;
    }

    public void setOwnedSurfaces(List<OwnedSurfaceDto> ownedSurfaces) {
        this.ownedSurfaces = ownedSurfaces;
    }

    public long getLifetimeXp() {
        return lifetimeXp;
    }

    public void setLifetimeXp(long lifetimeXp) {
        this.lifetimeXp = lifetimeXp;
    }

    public long getCurrentXp() {
        return currentXp;
    }

    public void setCurrentXp(long currentXp) {
        this.currentXp = currentXp;
    }

    public int getCurrentStreakDays() {
        return currentStreakDays;
    }

    public void setCurrentStreakDays(int currentStreakDays) {
        this.currentStreakDays = currentStreakDays;
    }

    public int getStreakMultiplierPercent() {
        return streakMultiplierPercent;
    }

    public void setStreakMultiplierPercent(int streakMultiplierPercent) {
        this.streakMultiplierPercent = streakMultiplierPercent;
    }

    public Integer getNextExpansionLevel() {
        return nextExpansionLevel;
    }

    public void setNextExpansionLevel(Integer nextExpansionLevel) {
        this.nextExpansionLevel = nextExpansionLevel;
    }

    public String getNextExpansionName() {
        return nextExpansionName;
    }

    public void setNextExpansionName(String nextExpansionName) {
        this.nextExpansionName = nextExpansionName;
    }

    public Integer getNextExpansionGridWidth() {
        return nextExpansionGridWidth;
    }

    public void setNextExpansionGridWidth(Integer nextExpansionGridWidth) {
        this.nextExpansionGridWidth = nextExpansionGridWidth;
    }

    public Integer getNextExpansionGridHeight() {
        return nextExpansionGridHeight;
    }

    public void setNextExpansionGridHeight(Integer nextExpansionGridHeight) {
        this.nextExpansionGridHeight = nextExpansionGridHeight;
    }

    public Integer getNextExpansionCostXp() {
        return nextExpansionCostXp;
    }

    public void setNextExpansionCostXp(Integer nextExpansionCostXp) {
        this.nextExpansionCostXp = nextExpansionCostXp;
    }

    public Long getNextExpansionRequiredLifetimeXp() {
        return nextExpansionRequiredLifetimeXp;
    }

    public void setNextExpansionRequiredLifetimeXp(Long nextExpansionRequiredLifetimeXp) {
        this.nextExpansionRequiredLifetimeXp = nextExpansionRequiredLifetimeXp;
    }

    public boolean isCanExpand() {
        return canExpand;
    }

    public void setCanExpand(boolean canExpand) {
        this.canExpand = canExpand;
    }

    public List<String> getOwnedItemIds() {
        return ownedItemIds;
    }

    public void setOwnedItemIds(List<String> ownedItemIds) {
        this.ownedItemIds = ownedItemIds;
    }

    public List<PlacedItemDto> getPlacedItems() {
        return placedItems;
    }

    public void setPlacedItems(List<PlacedItemDto> placedItems) {
        this.placedItems = placedItems;
    }

    public List<PlacedItemDto> getInventory() {
        return inventory;
    }

    public void setInventory(List<PlacedItemDto> inventory) {
        this.inventory = inventory;
    }

    public List<ClinicCatalogItem> getCatalog() {
        return catalog;
    }

    public void setCatalog(List<ClinicCatalogItem> catalog) {
        this.catalog = catalog;
    }
}

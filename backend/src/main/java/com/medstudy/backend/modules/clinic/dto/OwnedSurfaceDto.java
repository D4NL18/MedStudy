package com.medstudy.backend.modules.clinic.dto;

public class OwnedSurfaceDto {

    private String id;
    private String type; // 'WALL' or 'FLOOR'
    private String name;
    private int costXp;

    public OwnedSurfaceDto() {
    }

    public OwnedSurfaceDto(String id, String type, String name, int costXp) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.costXp = costXp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCostXp() {
        return costXp;
    }

    public void setCostXp(int costXp) {
        this.costXp = costXp;
    }
}

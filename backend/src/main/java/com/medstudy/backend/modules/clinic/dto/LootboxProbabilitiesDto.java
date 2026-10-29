package com.medstudy.backend.modules.clinic.dto;

public class LootboxProbabilitiesDto {

    private double common;
    private double rare;
    private double epic;
    private double legendary;

    public LootboxProbabilitiesDto() {
    }

    public LootboxProbabilitiesDto(double common, double rare, double epic, double legendary) {
        this.common = common;
        this.rare = rare;
        this.epic = epic;
        this.legendary = legendary;
    }

    public double getCommon() {
        return common;
    }

    public void setCommon(double common) {
        this.common = common;
    }

    public double getRare() {
        return rare;
    }

    public void setRare(double rare) {
        this.rare = rare;
    }

    public double getEpic() {
        return epic;
    }

    public void setEpic(double epic) {
        this.epic = epic;
    }

    public double getLegendary() {
        return legendary;
    }

    public void setLegendary(double legendary) {
        this.legendary = legendary;
    }
}

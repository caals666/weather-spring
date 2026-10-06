package com.example.backend.dto;

import com.example.backend.model.Weather;

import java.util.List;

public class WeatherResponse {

    private String resolvedAddress;
    private String timezone;
    private List<Weather> days;

    public String getResolvedAddress() {
        return resolvedAddress;
    }

    public void setResolvedAddress(String resolvedAddress) {
        this.resolvedAddress = resolvedAddress;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public List<Weather> getDays() {
        return days;
    }

    public void setDays(List<Weather> days) {
        this.days = days;
    }
}
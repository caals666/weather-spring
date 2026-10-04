package com.example.backend.dto;

import com.example.backend.model.Weather;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class WeatherResponse {
    private String resolvedAddress;
    private String timezone;
    private List<Weather> days;
}

package com.example.backend.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Weather {
    private String datetime;
    public double humidity;
    public String city;
    public double temp;
    public String icon;
}

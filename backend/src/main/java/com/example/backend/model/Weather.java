package com.example.backend.model;

public class Weather {

    private String datetime;
    private double humidity;
    private String city;
    private double temp;
    private String icon;

    public String getDatetime() { return datetime; }
    public void setDatetime(String datetime) { this.datetime = datetime; }

    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public double getTemp() { return temp; }
    public void setTemp(double temp) { this.temp = temp; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
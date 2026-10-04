package com.example.backend.controller;

import com.example.backend.dto.WeatherResponse;
import com.example.backend.model.Weather;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

@RestController
@RequestMapping("/")
public class WeatherController {

    private final WebClient webClient;

    public WeatherController(WebClient webClient){
        this.webClient = webClient;
    }

                             @Value("${visual_crossing_api}")
    private String apiKey;

    @GetMapping("{country}")
    @Cacheable(value = "weather_single", key = "#country")
    public Weather getWeather(@PathVariable String country) throws IOException{
        String url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+country+"/?key="+apiKey;
        WeatherResponse response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(WeatherResponse.class)
                .block();

        if(response == null|| response.getDays()==null||response.getDays().isEmpty()){
            throw new IOException("wrong");
        }
        Weather weather = response.getDays().get(0);
        weather.setCity(response.getResolvedAddress());

        return weather;
    }
}

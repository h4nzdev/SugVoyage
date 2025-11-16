import axios from "axios";

const OPENWEATHER_API_KEY = import.meta.env.OPENWEATHER_API_KEY;
const OPENROUTE_API_KEY = import.meta.env.OPENROUTE_API_KEY;

export const LiveDataService = {
  // 🎯 WEATHER DATA
  async getWeatherData(latitude = 10.3157, longitude = 123.8854) {
    // Default: Cebu coordinates
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      const weather = response.data;
      return {
        temperature: Math.round(weather.main.temp),
        condition: weather.weather[0].main,
        description: weather.weather[0].description,
        humidity: weather.main.humidity,
        icon: this.getWeatherIcon(weather.weather[0].main),
        status: this.getWeatherStatus(weather.weather[0].main),
      };
    } catch (error) {
      console.log("❌ Weather API error, using fallback data");
      return this.getFallbackWeather();
    }
  },

  getWeatherIcon(condition) {
    const icons = {
      Clear: "sun",
      Clouds: "cloud",
      Rain: "cloud-rain",
      Drizzle: "cloud-drizzle",
      Thunderstorm: "cloud-lightning",
      Snow: "cloud-snow",
      Mist: "cloud",
      Fog: "cloud",
    };
    return icons[condition] || "sun";
  },

  getWeatherStatus(condition) {
    const status = {
      Clear: "perfect",
      Clouds: "good",
      Rain: "moderate",
      Drizzle: "moderate",
      Thunderstorm: "poor",
      Snow: "moderate",
    };
    return status[condition] || "good";
  },

  getFallbackWeather() {
    return {
      temperature: 32,
      condition: "Clear",
      description: "sunny",
      humidity: 65,
      icon: "sun",
      status: "perfect",
    };
  },

  // 🎯 TRAFFIC DATA (Simplified using OpenRouteService)
  async getTrafficData(start = [123.8854, 10.3157], end = [123.8963, 10.3126]) {
    // Cebu sample route
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          coordinates: [start, end],
          instructions: false,
          preference: "recommended",
        },
        {
          headers: {
            Authorization: OPENROUTE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const route = response.data.routes[0];
      const duration = route.summary.duration; // in seconds
      const distance = route.summary.distance; // in meters

      return {
        duration: Math.round(duration / 60), // convert to minutes
        distance: (distance / 1000).toFixed(1), // convert to km
        traffic: this.getTrafficStatus(duration, distance),
        status: this.getTrafficCondition(duration, distance),
      };
    } catch (error) {
      console.log("❌ Traffic API error, using fallback data");
      return this.getFallbackTraffic();
    }
  },

  getTrafficStatus(duration, distance) {
    const speed = distance / 1000 / (duration / 3600); // km/h
    if (speed > 40) return "Light";
    if (speed > 20) return "Moderate";
    return "Heavy";
  },

  getTrafficCondition(duration, distance) {
    const speed = distance / 1000 / (duration / 3600);
    if (speed > 40) return "good";
    if (speed > 20) return "moderate";
    return "poor";
  },

  getFallbackTraffic() {
    return {
      duration: 15,
      distance: "5.2",
      traffic: "Light",
      status: "good",
    };
  },

  // 🎯 CROWD DATA (Simplified - using time-based logic)
  getCrowdData() {
    const hour = new Date().getHours();
    let crowdLevel, peakTime;

    if (hour >= 11 && hour <= 14) {
      crowdLevel = "High";
      peakTime = "Now";
    } else if (hour >= 17 && hour <= 19) {
      crowdLevel = "Moderate";
      peakTime = "5-7PM";
    } else {
      crowdLevel = "Low";
      peakTime = "11AM-2PM";
    }

    return {
      level: crowdLevel,
      peak: peakTime,
      status:
        crowdLevel === "Low"
          ? "good"
          : crowdLevel === "Moderate"
          ? "moderate"
          : "poor",
    };
  },
};

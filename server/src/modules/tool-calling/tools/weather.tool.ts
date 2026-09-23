import { tool } from '@langchain/core/tools';
import * as axios from 'axios';
import { z } from 'zod';

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});


// ! FUNCTION OF THE WEATHER DATA
const fetchWeather = async (city: string) => {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('Weather API key is missing.');
  }

  if (!city?.trim()) {
    throw new Error('Please provide a city name.');
  }

  try {
    const response = await api.get(`/weather?q=${city}&appid=${apiKey}`);

    const { main, weather, name, wind } = response.data;

    const temperature = main.temp;
    const description = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    return `City: ${name}
Temperature: ${temperature}°C
Humidity: ${humidity}%
Wind Speed: ${windSpeed} m/s
Description: ${description}`;
  } catch (error: unknown) {
    console.error(
      'Error fetching weather:',
      error instanceof Error ? error.message : error,
    );
    return {
      error:
        'Unable to fetch weather data. Please check the city name or try again later.',
    };
  }
};



// ! WEATHER TOOL WITH ZOD VALIDATION
export const weatherTool = tool(
  async ({ city }) => {
    return await fetchWeather(city);
  },
  {
    name: 'weather_Tool',
    description:
      'Get the current weather information for a city, including temperature, humidity, wind speed, and weather description.',
    schema: z.object({
      city: z.string().describe('name of the city'),
    }),
  },
);

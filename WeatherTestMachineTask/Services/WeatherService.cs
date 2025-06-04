using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WeatherTestMachineTask.Entities;
using WeatherTestMachineTask.WeatherDbContext;

namespace WeatherTestMachineTask.Services
{
    public class WeatherService : IWeatherServiceInterface
    {
        private readonly HttpClient _httpClient;
        private readonly WeatherApplicationDbContext _context;
        private readonly string _apiKey;

        public WeatherService(HttpClient httpClient, WeatherApplicationDbContext context, IConfiguration config)
        {
            _httpClient = httpClient;
            _context = context;
            _apiKey = "48a23b2fa09da3c447fd73406894fc23";

            if (string.IsNullOrEmpty(_apiKey))
                throw new ArgumentException("OpenWeather API Key is missing from configuration.");
        }

       
        public async Task<ResponseDto<WeatherHistory>> FetchWeatherAsync(string city)
        {
            try
            {
                var url = $"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={_apiKey}&units=metric";
                Console.WriteLine($"Calling OpenWeather API: {url}");

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return new  ResponseDto < WeatherHistory>
                    {
                    
                        message = $"OpenWeather API Error: {response.StatusCode}. Details: {errorContent}",
                        statusCode = 500
                    };
                }

                var jsonString = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(jsonString);
                var root = doc.RootElement;

                var weather = new WeatherHistory
                {
                    City = city,
                    Temperature = root.GetProperty("main").GetProperty("temp").GetDecimal(),
                    Description = root.GetProperty("weather")[0].GetProperty("description").GetString(),
                    Icon = root.GetProperty("weather")[0].GetProperty("icon").GetString(),
                    FetchedAt = DateTime.UtcNow
                };

                _context.WeatherHistories.Add(weather);
                await _context.SaveChangesAsync();
                var latestWeather = await _context.WeatherHistories
    .Where(w => w.City == city)
    .OrderByDescending(w => w.FetchedAt)
    .FirstOrDefaultAsync();

                return new ResponseDto <WeatherHistory>{data=latestWeather, message = "Weather fetched successfully", statusCode = 200 };
            }
            catch (Exception ex)
            {
                return new ResponseDto<WeatherHistory> { message = ex.Message, statusCode = 500 };
            }
        }

        public async Task<ResponseDto<List<WeatherHistory>>> GetHistoryAsync(string city, DateTime fromDate, DateTime toDate)
        {
            try
            {
                if ((toDate - fromDate).Days > 30)
                    throw new Exception("Max range 30 days");

                var weatherHistory = await _context.WeatherHistories
                    .Where(w => w.City.ToLower() == city.ToLower() && w.FetchedAt >= fromDate && w.FetchedAt <= toDate)
                    .ToListAsync();

                return new ResponseDto<List<WeatherHistory>>
                {
                    data = weatherHistory,
                    message = "Weather history fetched successfully",
                    statusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new ResponseDto<List<WeatherHistory>> { message = ex.Message, statusCode = 500 };
            }
        }
    }
}

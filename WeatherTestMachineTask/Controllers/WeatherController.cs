using System.Net;
using Microsoft.AspNetCore.Mvc;
using WeatherTestMachineTask.Services;

namespace WeatherTestMachineTask.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherServiceInterface _weatherService;

        public WeatherController(IWeatherServiceInterface weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet("{city}")]
        public async Task<IActionResult> GetWeather(string city)
        {
            var result = await _weatherService.FetchWeatherAsync(city);
            return StatusCode(result.statusCode, result);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] string city, DateTime from, DateTime to)
        {
            var result = await _weatherService.GetHistoryAsync(city, from, to);
            return StatusCode(result.statusCode, result);
        }
    }
}

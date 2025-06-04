using WeatherTestMachineTask.Entities;

namespace WeatherTestMachineTask.Services
{
    public interface IWeatherServiceInterface
    {

        Task<ResponseDto<WeatherHistory>> FetchWeatherAsync(string city);

        Task<ResponseDto<List<WeatherHistory>>> GetHistoryAsync(string city, DateTime fromDate, DateTime toDate);

    }
}

using Microsoft.EntityFrameworkCore;
using WeatherTestMachineTask.Entities;

namespace WeatherTestMachineTask.WeatherDbContext
{
    public class WeatherApplicationDbContext:DbContext
    {
        public WeatherApplicationDbContext(DbContextOptions<WeatherApplicationDbContext> options ):base(options){ }
        public DbSet<WeatherHistory> WeatherHistories { get; set; }
    }
}
    
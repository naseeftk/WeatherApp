namespace WeatherTestMachineTask.WeatherDbContext
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Design;
    using Microsoft.Extensions.Configuration;
    using System.IO;

    namespace WeatherTestMachineTask.WeatherDbContext
    {
        public class WeatherDbContextFactory : IDesignTimeDbContextFactory<WeatherApplicationDbContext>
        {
            public WeatherApplicationDbContext CreateDbContext(string[] args)
            {
                // Build config from appsettings.json
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory()) // points to the root folder of the project
                    .AddJsonFile("appsettings.json")
                    .Build();

                var optionsBuilder = new DbContextOptionsBuilder<WeatherApplicationDbContext>();
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseSqlServer(connectionString);

                return new WeatherApplicationDbContext(optionsBuilder.Options);
            }
        }
    }

}

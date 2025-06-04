using System.ComponentModel.DataAnnotations;

namespace WeatherTestMachineTask.Entities
{


public class WeatherHistory
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "City is required")]
        [StringLength(100, ErrorMessage = "City name can't be longer than 100 characters")]
        public string City { get; set; }

        [Range(-100, 100, ErrorMessage = "Temperature must be between -100°C and 100°C")]
        public decimal Temperature { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(255, ErrorMessage = "Description can't be longer than 255 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Icon code is required")]
        [StringLength(10, ErrorMessage = "Icon code can't be longer than 10 characters")]
        public string Icon { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime FetchedAt { get; set; }
    }

}


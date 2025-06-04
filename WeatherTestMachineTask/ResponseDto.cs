namespace WeatherTestMachineTask
{
    public class ResponseDto<T>
    {
        public string message { get; set; }
        public T data { get; set; }
        public int statusCode { get; set; }

    }
}

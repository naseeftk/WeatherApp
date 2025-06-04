import React, { useEffect, useState } from 'react';
import { FaCloud } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { IoIosSunny } from 'react-icons/io';
import img from './assets/image.png'
import axios from 'axios';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('kerala');
  const [historyData, setHistoryData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`https://localhost:7005/Weather/${city}`);
      setWeatherData(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to load weather data.');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`https://localhost:7005/Weather/history`, {
        params: {
          city: city,
          from: dateRange.from,
          to: dateRange.to
        }
      });
      setHistoryData(response.data.data);
    } catch (error) {
      console.error('Error fetching history data:', error);
      setError('Failed to load history data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWeather();
    await fetchHistory();
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    fetchWeather();
    fetchHistory();
  }, []);

  return (
    <div className="w-full h-screen bg-orange-100">
      <div>
        <div
          className="min-h-screen w-full bg-cover bg-center flex flex-wrap justify-center"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="w-11/12 h-screen">
            <div className="w-full flex flex-col md:flex-row h-full items-center gap-4">
              {/* Weather Card */}
              <div className="w-full md:mt-0 mt-5 md:w-1/3 h-[500px] max-w-xs md:max-w-md p-3 rounded-2xl text-center bg-[#f7d698] border-gray-200 shadow-lg flex flex-col items-center justify-between">
                <div className="flex items-center justify-center">
                  <p className="text-3xl">Today</p>
                  <RiArrowDropDownLine size={24} />
                </div>
                <form onSubmit={handleSubmit} className="w-full mb-4 space-y-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="w-full p-2 rounded border border-gray-300 bg-orange-300"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      name="from"
                      value={dateRange.from}
                      onChange={handleDateChange}
                      className="w-1/2 p-2 rounded border border-gray-300 bg-orange-300"
                    />
                    <input
                      type="date"
                      name="to"
                      value={dateRange.to}
                      onChange={handleDateChange}
                      className="w-1/2 p-2 rounded border border-gray-300 bg-orange-300"
                    />
                  </div>
                  <button type="submit" className="w-full mt-2 bg-blue-500 text-white p-2 rounded">
                    Get Weather
                  </button>
                </form>
                {error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : weatherData ? (
                  <>
                    <IoIosSunny size={48} />
                    <h1 className="text-6xl font-bold ml-4 text-orange-500">
                      {Math.round(weatherData.temperature)}°C
                    </h1>
                    <h1 className="text-center text-lg md:text-2xl mt-4 font-bold text-orange-500">
                      {weatherData.description}
                    </h1>
                    <p className="text-lg md:text-2xl mt-4 text-orange-500">
                      {weatherData.city}
                    </p>
                    <p className="text-base md:text-xl mt-4 text-orange-500">
                      {new Date(weatherData.fetchedAt).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              {/* History and Information Section */}
              <div className="w-full md:w-8/12 h-auto p-4">
                {/* History Data */}
                <div className="w-full md:w-3/4 rounded-xl p-3 bg-[#f7d698] bg-opacity-40 border-gray-100 mb-4">
                  <h2 className="text-xl text-white mb-4">Weather History</h2>
                  <div className="flex flex-wrap justify-center gap-4">
                    {historyData.length > 0 ? (
                      historyData.map((item, index) => (
                        <div
                          key={index}
                          className="text-white sm:w-24 md:w-28 lg:w-20 p-2 flex flex-col items-center justify-center rounded-lg"
                        >
                          <p className="text-xs md:text-sm font-bold">
                            {new Date(item.fetchedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs">{convertTime(item.fetchedAt)}</p>
                          <div className="flex items-center">
                            <FaCloud className="text-white w-4 h-4 md:w-6 md:h-6 mr-1" />
                            <p className="text-sm md:text-base">{Math.round(item.temperature)}°C</p>
                          </div>
                          <p className="text-xs">{item.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-white">No history data available</p>
                    )}
                  </div>
                </div>

                {/* Information Section */}
                <div className="w-full md:w-9/12 h-auto p-4">
                  <p className="text-xl md:text-2xl text-white mb-2">Weather Information</p>
                  <p className="text-s md:text-lg text-white">
                    {weatherData?.description 
                      ? `Current weather in ${weatherData.city} is ${weatherData.description} with a temperature of ${Math.round(weatherData.temperature)}°C.`
                      : 'Weather data not available.'}
                  </p>
                  {historyData.length > 0 && (
                    <p className="text-s md:text-lg text-white mt-2">
                      Historical data shows temperatures ranging from {Math.min(...historyData.map(item => item.temperature))}°C to {Math.max(...historyData.map(item => item.temperature))}°C in the selected period.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
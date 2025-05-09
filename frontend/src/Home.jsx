import React, { useEffect, useState } from 'react';
import { FaCloud } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { IoIosSunny } from 'react-icons/io';
import img from './assets/image.png'
 import axiosInstance from './Api/axiosInstance';


const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('kochi');
  const [forcast,setForcast]=useState(null)


  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(`weather?city=${city}`);
      console.log(response,"ressss")
      setData(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load weather data.');
    }
  };

let lon=data?.coord.lon;
let lat=data?.coord.lat;


const handleForcast = async () => {
  try {
    const response = await axiosInstance.post(`/forcast?lat=${lat}&lon=${lon}`);
   setForcast(response.data); 
    console.log(response.data,"ress");

  } catch (error) {
    console.error(error);
  }
}


 
  const handleSubmit =async (e) => {
    e.preventDefault();
   fetchData()
    handleForcast()
  };

  const convertTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hours12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hours12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    fetchData();
    handleForcast();
  }, []);

console.log(forcast,"forcaa");
  return (
    <div className="w-full h-screen bg-orange-100">
      <div>
        <div
          className="min-h-screen w-full bg-cover bg-center flex flex-wrap justify-center"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div className="w-11/12 h-screen">
            <div className="w-full flex flex-col md:flex-row h-full items-center gap-4">
              <div className="w-full md:mt-0 mt-5 md:w-1/3 h-[400px] max-w-xs md:max-w-md p-3 rounded-2xl text-center bg-[#f7d698] border-gray-200 shadow-lg flex flex-col items-center justify-between">
                <div className="flex items-center justify-center">
                  <p className="text-3xl">Today</p>
                  <RiArrowDropDownLine size={24} />
                </div>
                <form onSubmit={handleSubmit} className="w-full mb-4">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="w-full p-2 rounded border border-gray-300 bg-orange-300"
                  />
                  <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
                    Get Weather
                  </button>
                </form>
                {error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : data ? (
                  <>
                    <IoIosSunny size={48} />
                    <h1 className="text-6xl font-bold ml-4 text-orange-500">
                      {Math.round(data.main.temp - 273.15)}°C
                    </h1>
                    <h1 className="text-center text-lg md:text-2xl mt-4 font-bold text-orange-500">
                      {data.weather[0].main}
                    </h1>
                    <p className="text-lg md:text-2xl mt-4 text-orange-500">
                      {data.name}
                    </p>
                    <p className="text-base md:text-xl mt-4 text-orange-500">
                      {data.dt.slice(0, 10)} 
                    </p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div className="w-full md:w-8/12 h-auto p-4">
                <div className="w-full md:w-3/4 rounded-xl p-3  bg-[#f7d698] bg-opacity-40 border-gray-100">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-wrap justify-center gap-8">
                      {forcast?.data?.map((x, index) => (
                        <div
                          key={index}
                          className="text-white sm:w-24 md:w-28 lg:w-20 p-2 flex flex-col items-center justify-center rounded-lg"
                        >
                          <p className="text-xs md:text-sm font-bold">{convertTime(x?.time)}</p>
                          <div className="flex items-center">
                            <FaCloud className="text-white w-4 h-4 md:w-6 md:h-6 mr-1" />
                            <p className="text-sm md:text-base">{x?.temperature?.celsius}°C</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                </div>

                <div className="w-full md:w-9/12 h-auto p-4">
                  <p className="text-xl md:text-2xl text-white mb-2">Random Text</p>
                  <p className="text-s md:text-lg text-white">
                    Improve him believe opinion offered met and end cheered forbade. Friendly as stronger speedily by recurred. Son interest wandered sir addition end say. Manners beloved affixed picture men ask.
                  </p>
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


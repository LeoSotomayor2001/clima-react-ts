import axios from "axios"
import { z } from "zod"
import { SearchType } from "../types";


// function isWeatherResponse(weather: unknown) : weather is Weather {
//     return (
//         Boolean(weather)&&
//         typeof weather==='object' &&
//         typeof (weather as Weather).name==='string' &&
//         typeof (weather as Weather).main.temp==='number' &&
//         typeof (weather as Weather).main.temp_max==='number' &&
//         typeof (weather as Weather).main.temp_min==='number' 
//     )
// }
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})
type Weather = z.infer<typeof Weather>
export default function useWeather() {
    const fetchWeather = async (search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY;
        try {
            const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

            const { data } = await axios(geoURL);
            const lat = data[0].lat;
            const lon = data[0].lon;
            const wheatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

            //castear el type
            // const {data:weather}=await axios<Weather>(wheatherURL);
            // console.log(weather);

            //type Guards
            // const {data:weather}=await axios(wheatherURL);
            // const result= isWeatherResponse(weather);
            // if(result){
            //     console.log(weather.name)
            // }

            //Zod
            const { data: weather } = await axios(wheatherURL);
            const result = Weather.safeParse(weather);
            if (result.success) {
                console.log(weather.name)
            }


        } catch (error) {
            console.log('Error fetching weather:', error);
        }
    }

    return {
        fetchWeather
    }
}
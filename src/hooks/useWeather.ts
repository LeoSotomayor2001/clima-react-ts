import axios from "axios"
import { set, z } from "zod"
//import {object,string,number,InferOutput,parse} from "valibot"
import { SearchType } from "../types";
import { useMemo, useState } from "react";


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
//zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})
export type Weather = z.infer<typeof Weather>


// //valibot 
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })
// type Weather = InferOutput<typeof WeatherSchema>

const initialState={
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
}
export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState )
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const fetchWeather = async (search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY;
        setLoading(true)
        setNotFound(false)
        setWeather(initialState)
        try {
            const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

            const { data } = await axios(geoURL);
            if(!data[0]){
                setNotFound(true)
                return
            }
            const lat = data[0].lat;
            const lon = data[0].lon;
            const weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

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
            const {data: weatherResult} = await axios(weatherURL)
            const result = Weather.safeParse(weatherResult)
            if(result.success) {
                setWeather(result.data)
            }
            // //valibot

            // const { data: weather } = await axios<Weather>(wheatherURL);
            // const result= parse(WeatherSchema,weather);
            // if(result){
            //     console.log(result)
                
            // }


        } catch (error) {
            console.log('Error fetching weather:', error);
        }
        finally {
            setLoading(false)
            
        }

    }
    const hasWeatherData=useMemo(() => weather.name ,[weather])

    return {
        weather,
        loading,
        fetchWeather,
        hasWeatherData,
        notFound
    }
}
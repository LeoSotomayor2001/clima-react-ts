export const formatTemperature = (temp: number): number => {
    return Math.round(temp - 273.15);
}
const fs = require('fs');
const axios = require('axios');


class Busquedas{

    historial = [];
    lat = '';
    lon = '';

    dbPath = './db/database.json';

    constructor(){
       this.leerDB();
    }

    get paramsMapBox (){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
        }
    }

    get paramsWeather(){
        return {
            'appid': process.env.WEATHER_KEY,
           // 'lat': '-78.50972',
           // 'lon': '-0.21861',
            'lat': this.lat,
            'lon': this.lon,
            'units': 'metric',
            'lang':'es'
        }
    }

    
    async ciudad(lugar = ''){   
        //peticion http
        try {
           
            const instanceAxios = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });
            const resp = await instanceAxios.get();
            return resp.data.features.map(lugar => ({
                    //Devuelve un objeto
                id      : lugar.id,
                nombre  : lugar.place_name,
                lng     : lugar.center[1],
                lat     : lugar.center[0]
            })
                // Devolver un json
                // {
                //     return  lugar.id
                // }
            
            );
        } catch (error) {
            return [];
        }
    }

    async clima( lat, lon){
        this.lat = lat;
        this.lon = lon;
        try {
            const instanceAxios = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsWeather
            });
            const resp = await instanceAxios.get();

            const {weather, main} = resp.data;

           return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
           }
            
        } catch (error) {
            return []; 
        }
    }

    agregarHistorial(lugar = ''){
        //Evitar duplicidad
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.slice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.grabarDB();
    }
    grabarDB(){
        fs.writeFileSync(this.dbPath,JSON.stringify(this.historial));
    }

    leerDB(){
       if(!fs.existsSync(this.dbPath)){
        return null;
       }

       const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
       const data = JSON.parse(info);
       this.historial = data;

    }
}
module.exports = Busquedas;
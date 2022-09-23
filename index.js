require('dotenv').config();

const {leerQuestion, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async() => {
let opt;
const busquedas = new Busquedas();

do {

    opt = await inquirerMenu();

    switch (opt) {
        case 1:
            // Mostrar mensaje para que el puedan introducir los valores
            const lugar = await leerQuestion('Ciudad: ');
            //Buscar lugares
            const lugares = await busquedas.ciudad(lugar);
            //Seleccionar lugar
            const idLugar = await listarLugares(lugares);
                if(idLugar === '0') continue;
            const lugarSel = lugares.find(l => l.id === idLugar);
            //Guardar en DB
            busquedas.agregarHistorial(lugarSel.nombre);
            //Obtener datos del clima 
            const dataWeather = await busquedas.clima(lugarSel.lng, lugarSel.lat);
            //Mostrar la informacion
            console.clear();
            console.log('\nInformacion de la ciudad\n'.green);
            console.log('Ciudad: ',lugarSel.nombre );
            console.log('Lat: ', lugarSel.lng);
            console.log('Lng: ', lugarSel.lat);
            console.log('Temperatura: ', dataWeather.temp);
            console.log('Min: ', dataWeather.min);
            console.log('Max: ', dataWeather.max);
            console.log('Como esta el clima: ', dataWeather.desc);
            break;

        case 2:
            busquedas.historial.forEach((lugar, i) => {
                const idx = `${i + 1}.`.green; 
                console.log(`${idx} ${lugar}`);
            })
        break;

    }
    await pausa();

}while (opt !== 0);

}

main(); 
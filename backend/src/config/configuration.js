const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');  /* Los argumentos los utilizo porque en Makefile no puedo pasar variables de entorno en Windows */


let configFile = 'config.test.yaml'; // Valor por defecto
const argv = yargs(hideBin(process.argv)).argv;
if (process.env.NODE_ENV === 'prod' || argv.config === 'prod') { 
   configFile = 'config.prod.yaml';
}
if (process.env.NODE_ENV === 'docker') {
    configFile = 'config.docker.yaml';
}


const config = yaml.load(fs.readFileSync(configFile, 'utf-8'));

module.exports = {
    config
};
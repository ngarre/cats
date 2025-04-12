const yaml = require('js-yaml');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Valor por defecto según NODE_ENV
let configFile = 'config.prod.yaml';
if (process.env.NODE_ENV === 'test') {
   configFile = 'config.test.yaml';
}
if (process.env.NODE_ENV === 'docker') {
    configFile = 'config.docker.yaml';
}

/* Lee el fichero de configuración
let configFile = 'config.prod.yaml';
const argv = yargs(hideBin(process.argv)).argv;
if (argv.config != undefined) {
    configFile = argv.config;
} */

const config = yaml.load(fs.readFileSync(configFile, 'utf-8'));

module.exports = {
    config
};
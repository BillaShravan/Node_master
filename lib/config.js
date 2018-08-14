/*
*create environemnts
*/

let environments = {};

environments.build = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'build',
    'hashSecret': 'thisIsSecret'
};

environments.staging = {
    'httpPort':4000,
    'httpsPort':4001,
    'envName':'staging',
    'hashSecret': 'thisIsSecret'
};

environments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'hashSecret': 'thisIsSecret',
    'envName':'production'
};

let currentEnvironment = typeof process.argv[2] == 'string' ? process.argv[2]  : '';

module.exports = typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.build ;



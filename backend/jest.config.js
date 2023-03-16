/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const dotenv = require('dotenv')
dotenv.config({ path: './tests/.env' })
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"http://20cd163119.51mypc.cn"'
  // BASE_API: '"http://localhost:81"'
  // BASE_API: '"http://192.168.10.81:81"'
  BASE_API: '"http://10.10.0.2"'
})

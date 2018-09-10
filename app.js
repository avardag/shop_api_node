const express = require('express')

const app = express();

// MW
app.use((req, res, next)=>{
  res.status(200).json({
    message: 'Connected'
  })
})

module.exports = app;
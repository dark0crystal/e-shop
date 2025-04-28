const express = require('express');
const  app =express()

// HTTP Methods

//GET
app.get('/hello',(request , response)=>{
    response.send("Hello World")
})
// POST

// PUT

// DELETE

app.listen(3006 ,()=>{
    console.log("server started on port :3006")
} )
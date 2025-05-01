import express from 'express'
const  app =express()

// HTTP Methods

//GET
app.get('/hello',(request , response)=>{
    response.send("Hello World")
})


app.listen(8383 ,()=>{
    console.log("server started on port :3006")
} )
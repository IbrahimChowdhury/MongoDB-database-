let express=require("express")
let mongoose =require("mongoose")
let app=express()

let port= 3000

// one system of connecting mongoDB to nodejs:
/*

mongoose.connect("mongodb://127.0.0.1:27017/products")
.then(()=>{
    console.log("mongoDB is connected")
})
.catch((error)=>{
    console.log("mongoDB is not connected")
    console.log(error)
    process.exit(1)
})

*/



// another system of connecting 
let connectDB= async () =>{
    try {
       await mongoose.connect("mongodb://127.0.0.1:27017/products")
        console.log("mongoDB is connected")
    } catch (err) {
        console.log("mongoDB is not connected")
    }
}


app.get("/",(req,res)=>{
    res.send(`<h1>This is HomePage</h1>`)
})


app.listen(port, async () =>{
 console.log(`Your server is  running at http://localhost:${port}`)
    await connectDB()
})

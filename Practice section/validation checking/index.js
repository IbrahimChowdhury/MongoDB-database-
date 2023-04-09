let express=require("express")
let mongoose=require("mongoose")
let app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
let port=5000




let cars_schema = new mongoose.Schema({
   title:{
    type:String,
    required:true
   },
   speed:{
    type:Number,
    required:true
   },
   price:Number,
   description:String,
   created_at:{
    type:Date,
    default:Date.now()
   }
})

let cars_model= mongoose.model("Cars",cars_schema)



app.post("/cars",async(req,res)=>{
    try {
        let cars=cars_model({
            title:req.body.title,
            speed:req.body.speed,
            price:req.body.price,
            description:req.body.description
        })
        let cars_item = await cars.save()
        res.status(202).send(cars_item)

    } catch (error) {
        res.status(404).json({massage:error})
    }
})






mongoose.set('strictQuery', true)
// connecting mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/industry_2")
.then(()=>{
    console.log("mongodb is connected")
})
.catch(()=>{
    console.log("mongoDb is not connected")
})






// home page 
app.get("/",(req,res)=>{
    res.send("This is HOME page")
})




// server
app.listen(port,()=>{
    console.log(`your server is running at http://localhost:${port}`)
})










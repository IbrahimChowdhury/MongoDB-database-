const { Double } = require("bson")
let express=require("express")
let app=express()
let mongoose=require("mongoose")
const { double } = require("webidl-conversions")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
let port=4000



// creating Schema and model of a database 
let food_Schema= new mongoose.Schema({
    name:{
        type:String,
       require:true
    },
    price:Number,
    rating:Number,
    description:String,
    created_at:{
        type:Date,
        default:Date.now()
    }
    
})


// let modelName=mongoose.model("collections_name",schema)
let food_model=mongoose.model("food_items",food_Schema)



// home route
app.get("/",(req,res)=>{
    res.send("<h1>This is HOME Route</h1>")
})



// CRUD operation= Create Read Update Delete

// Create operation
app.post("/fooditems",(req,res)=>{
    try {
        let foods=food_model({
            name:req.body.name,
            price:req.body.price,
            rating:req.body.rating,
            description:req.body.description
        })
       foods.save()
       res.status(200).json(foods)

    } catch (error) {
        res.status(404).json({massage:error})
    }
})



// Read operation or find all food items 
app.get("/fooditems",async(req,res)=>{
    try {
    //    let fooods=await food_model.find({price:{$eq:400}})   // for comparison operator
    let fooods=await food_model.find({$and:[{price:{$gt:200}},{rating:{$gt:4.5}}]})   // for logial operator 
       if(fooods)
       {
        res.status(202).json(fooods)
       }
       else
       {
        res.status(404).json({massage:"product not found"})
       }
    } catch (error) {
        res.status(500).json({massage:"someThing is wrong"})
    }
})


// find a specific food items 
app.get("/fooditems/:id",async(req,res)=>{
  try {
    let id=req.params.id
    let food=await food_model.findOne({_id:id},{_id:0,description:0,created_at:0})
    if (food) {
        res.status(202).json(food)
    } else {
        res.status(404).json({massage:"food not found"})
    }

  } catch (error) {
    res.status(500).json({massage:"something is wrong"})
  }
})



// connection with mongoDB with the help of mongoose
mongoose.connect("mongodb://127.0.0.1:27017/industry_2")
.then(()=>{
    console.log("mongoDB is connected")
})
.catch(()=>{
    console.log("mongoDB is not connected")
})



// server
app.listen(port,()=>{
    console.log(`your server is running at http://localhost:${port}`)
})


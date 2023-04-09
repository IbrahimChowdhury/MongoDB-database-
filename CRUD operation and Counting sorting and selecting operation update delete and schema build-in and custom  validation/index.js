let express=require("express")
let mongoose=require("mongoose")

let app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


let port=4000





// creating Schema and model
// creating schema
let motorBikes_schema = new mongoose.Schema(
    {
    name:{
        type:String,

        // below are schema validation
        required : [true, "name must be included"],
        minlength:[3, "min length is 3"], //minimum length is 3cherecter 
        maxlength:[100, "max length is 15"], //maximum cherecter is 15 cherecter
        // uppercase:true,  // name strored in database in uppercase
      lowercase:true,  // name strored in database in lowercase
         trim:true,   //reduce the space in front and back
        //  enum:{values:["pulsar150, fz version 2"], message:`{VALUE} is not supported`},  //that means if give name that must be between the enum
        unique:true,  // the name must be unique 
    },
    speed:{
        type:Number,
       
        required : [true, "speed mustbe mentioned"],
        validate:{
            validator:function(v){
                return v.length<=4
            },
            message:(props)=>`${props.value} is not a valid speed`
        }
    },
     price:{
        type:Number,
        min:[50000,"minimum cost for a bike is 50000taka"],
        max:[1000000,"maximun cost for a bike is 1000000taka"],
        required:true,
        validate:{
            validator:function(v){
                return v.length<=4
            },
            message:(props)=>`${props.value} is not a valid speed`
        }
    },
    rating:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})

//creating model
let motorBikes_model= mongoose.model("MotorBikes",motorBikes_schema)


//CRUD = Create Read Update Delete

// Creating or Posting 
app.post("/motorbikes",async(req,res)=>{
    try {
        let motorBikes = motorBikes_model({
            name:req.body.name,
            speed:req.body.speed,
            price:req.body.price,
            rating:req.body.rating,
            description:req.body.description
        
        })

      let motorbike =await  motorBikes.save()
        res.status(200).json(motorbike)

    } catch (error) {
        res.status(404).json({message:error.message})
    }
})

// home page
app.get("/",(req,res)=>{
    res.send("This is HomePage")
})


// getting all bikes
app.get("/motorbikes",async(req,res)=>{
    try {
        // let bikes= await motorBikes_model.find().sort({price:1}).select({name:1,_id:0,price:1})
        let bikes= await motorBikes_model.find().sort({price:1})
        if (bikes) {
            res.status(200).json(bikes)
        } else {
            res.status(404).json({massage:"bikes not found"})            
        }
    } catch (error) {
        res.status(500).json({massage:"something is wrong"})
    }
})


// getting specific bike using id
app.get("/motorbikes/:id", async(req,res)=>{
    try {
        let id=req.params.id
        let bike= await motorBikes_model.findOne({_id:id},{name:1,price:1,_id:0})
        if (bike) {
            res.status(202).json(bike)
        } else {
            res.status(404).json({massage:"bike not found"})
        }
    } catch (error) {
        res.status(500).json({massage:"something is error"})
    }
})




// Delete items 
app.delete("/motorbikes/:id", async(req,res)=>{
    try {
        let id=req.params.id
        // let bike= await motorBikes_model.deleteOne({_id:id}) //if we want to delete single item without showing its real data 
        let bike = await motorBikes_model.findByIdAndDelete({_id:id})   // deleting by seeing its real data
        if (bike) {
            res.status(202).json({bike})

        } else {
            res.status(404).json({massage:"bike not deleted"})
        }
    } catch (error) {

        res.status(500).json({massage:"something is wrong"})
    }
})





// update items
app.put("/motorbikes/:id",async(req,res)=>{
    try {
        let id=req.params.id
        let name=req.body.name
        let price=req.body.price
        let speed=req.body.speed
        let description=req.body.description
        let rating=req.body.rating

        let updatedBike=await motorBikes_model.findByIdAndUpdate(
            {
                _id:id
            },
            {
                $set:{
                   name:name,
                   price:price,
                   speed:speed,
                   description:description,
                   rating:rating
                }
            },
            {
                new:true
            }
        )

        if (updatedBike) {
            res.status(202).json(updatedBike)
        } else {
            res.status(404).json({massage:"bike not updated"})
        }
    } catch (error) {
        res.status(500).json({massage:"something is wrong"})
    }
})




// // connceting NodeJs with mongoDB

mongoose.set('strictQuery', true)

mongoose.connect("mongodb://127.0.0.1:27017/industry_2")
.then(()=>{
    console.log("mongoDB is connected ")
})
.catch(()=>{
    console.log("mongoDB is not connected")
})








// creating server 
app.listen(port,()=>{
        console.log(`your server is running at http://localhost:${port}`)
})
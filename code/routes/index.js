var express = require('express');
var router = express.Router();

const { MongoClient, MongoServerError, ObjectId } = require('mongodb');
const url = 'mongodb://root:root_pwd@mongo:27017/';
const client = new MongoClient(url);

// Database Name
const dbName = 'timer_db';

client.connect();
console.log('Connected successfully to mongodb');
const db = client.db(dbName);


/* GET home page. */
router.get('/', async function(req,res) {
  let date = new Date();
  let collection = db.collection('videos');
  result_videos = await collection.find({}).toArray();

  res.render('index', {
    title: 'Timer', 
    day : date.toLocaleDateString('it-It'),    
    time_rome: date.toLocaleTimeString('it-IT'),
    time_ny: date.toLocaleTimeString('it-IT', { timeZone: 'America/New_York'} ),
    videos: result_videos
    }); 
}); 


router.get("/new_video.html", function(req,res){
  let date = new Date();
  res.render('new_video',{
    title: 'Timer', 
    day : date.toLocaleDateString('it-It'),  
    time_rome: date.toLocaleTimeString('it-IT'),
    time_ny: date.toLocaleTimeString('it-IT', { timeZone: 'America/New_York'} ),
  
  });
});
 
router.get("/list_videos.html", async function(req,res){
  let date = new Date;
  try{
    let collection = db.collection('videos');
    let result_videos = await collection.find({}).toArray();
    console.log(result_videos.length);
    res.render("videos",{
      title: 'Timer', 
      day : date.toLocaleDateString('it-It'),  
      time_rome: date.toLocaleTimeString('it-IT'),
      time_ny: date.toLocaleTimeString('it-IT', { timeZone: 'America/New_York'} ),
      videos: result_videos
    });

  }catch (error){
    if(error instanceof MongoServerError){
      console.error("Error with server mongo : ${error}");
    }
    throw error;
  }
  
});
router.post("/add_new_video.html", async function (req,res) {
  let date = new Date();
  try{
    let collection = db.collection('videos'); 
    console.log(req.body.name+" "+req.body.url);
    if(req.body.name !== undefined && req.body.url !== undefined ){
      //console.info(req.body.url);
      await collection.insertOne({ name:req.body.name, url:req.body.url});
    }
   


    let result_videos = await collection.find({});

    res.render('videos', {
      title: 'Timer', 
      day : date.toLocaleDateString('it-It'),  
      time_rome: date.toLocaleTimeString('it-IT'),
      time_ny: date.toLocaleTimeString('it-IT', { timeZone: 'America/New_York'} ),
      videos: result_videos
    });

  }catch(error){
    if(error instanceof MongoServerError){
        console.error("Error with server mongo : ${error}");
    }
    throw error;
  }

});

router.post("/delete_video", async function(req,res){
 // console.log(req);
  console.log(req.body.id );
  if(req.body.id !== undefined){
     await db.collection('videos').deleteOne({_id: new ObjectId(req.body.id) });
     //console.log("deleteds");
  } 
  res.writeHead(200, {"Content-Type":"application/json"});
  res.end();
});



module.exports = router;   




    
 


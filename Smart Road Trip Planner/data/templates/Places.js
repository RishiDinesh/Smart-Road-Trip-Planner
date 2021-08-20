const fetch = require("node-fetch");
const scaler = require('minmaxscaler');
var mongoose = require("mongoose")
var UserProfile = require("../models/userProfile.js");
var images = require("../Data/images.js");
var POImap = require("../Data/POImap.js");

const apiKey = "5ae2e3f221c38a28845f05b6759d096befe15006ab3c24ca32014f44";
var databaseUri ="mongodb+srv://admin:Password@2002@cluster0.i4sv9.mongodb.net/RoadTrip?retryWrites=true&w=majority"
mongoose.connect(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true } )
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));


function otmAPI(method, query) {
    return new Promise(function(resolve, reject) {
    var API ="https://api.opentripmap.com/0.1/en/places/" + method
    if(method=="xid"){
        API += query
        API += "?apikey=" + apiKey;
    }
    else if (query !== undefined){
        API += "?apikey=" + apiKey;
        API += "&" + query;
    }
    fetch(API)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(function(err) { reject("Fetch Error :-S", err); });
    });
}

async function getPlaceInfo(xid){
    let res = await otmAPI("xid",`/${xid}`)
    let info = {
        xid : res.xid,
        name : res.name,
        address : res.address,
        kinds : res.kinds,
        point : res.point
    }
    return info
}

// CALLABLE - pass query with minimum 3 characters for autosuggest
async function overview(city, radius, categories = "adult,amusements,interesting_places,sport,tourist_facilities", autosuggest = 0, query){
    let res = await otmAPI("geoname",`name=${city}`)
    if(res.error) return res.error
    let coordinates = {lat : res["lat"], long : res["lon"]}
    var POI
    if(autosuggest==1)
        POI = await otmAPI("autosuggest",`radius=${radius}&lon=${coordinates.long}&lat=${coordinates.lat}&name=${query}&kinds=${categories}`)
    else
        POI = await otmAPI("radius",`radius=${radius}&lon=${coordinates.long}&lat=${coordinates.lat}&kinds=${categories}`)
    if(POI.error) return POI.error
    var allCategories = Object.keys(images)
    POI["features"].forEach(function(place,index){
        for(var i=0;i<allCategories.length;i++){
            if(place["properties"]["kinds"].split(",").includes(allCategories[i])){
                POI["features"][index]["thumbnail"] = images[allCategories[i]] + "&w=250&h=140"
                break
            }
        }
    })
    POI["features"] = POI["features"].filter(item => item.properties.name != '')
    console.log(POI["features"])
}

// CALLABLE
async function updateWeight(userId,level,xid){
    try{
        var profile = await UserProfile.findOne({_id : userId},function(err,doc){
            if(err) throw err
            else profile = doc
        })
        var flag = 0
        profile["POI"].forEach(place => {
            if(place["xid"]==xid){
                flag = 1
                place["level"] = level
                place["timestamp"] = Math.round(new Date().getTime()/1000)
            }
        })
        if(flag==0){
            let info = await getPlaceInfo(xid)
            profile["POI"].push({
                xid : xid,
                level : level,
                categories :info["kinds"].split(","),
                timestamp : Math.round(new Date().getTime()/1000)
            })
        }
        profile.save(function(err,result){
            if(err) throw err
            else console.log("User Profile Updated")
        })
    }catch(err){
        console.log(err)
    }
}

// To be executed on login
async function updatePOIcategories(userId){
    var POI = await recommendCategories(userId)
    var allCategories = Object.keys(POImap)
    POI = POI.filter(value => allCategories.includes(value));
    POI = POI.slice(0,3)
    while(POI.length != 3){
        POI.push("-")
    }
    var POIvec = []
    POI.forEach(place => {
        if(place=="-") POIvec.push(0)
        else POIvec.push(POImap[place])
    })

    await UserProfile.updateOne({_id: userId }, 
        {POIcategories : POIvec},
        function(){console.log("POI categories updated")}
    );
}

async function recommendCategories(userId){
    var times = [], lvls = [], POI = {}, categories = [], query = []
    try{
        profile = await UserProfile.findOne({_id : userId},function(err,doc){
            if(err) throw err
            else profile = doc
        })
    
        profile["POI"].forEach(place => {
            times.push(place["timestamp"])
            lvls.push(place["level"])
            categories.push(place["categories"])
        })
        if(times.length == 1 ) times = [1]
        else times = scaler.fit_transform(times, max_ = 0.9, min_ = 0.1)
        function Multiply(a,b){
            return a.map((e,i) => parseFloat((e * b[i]).toFixed(3)))
        }
        var weights = Multiply(times, lvls)
        
        categories.forEach(function(group,index){
            group.forEach(category => {
                if(!Object.keys(POI).includes(category)) POI[category] = weights[index] 
                else if(POI[category]<weights[index]) POI[category] = weights[index]               
            })
        })
        POI = Object.keys(POI).map(function(key) {
            return [key, POI[key]];
            });
        
        POI.sort(function(first, second) {
            return second[1] - first[1];
            });
        POI.forEach(place => {
            query.push(place[0])
        })
    }catch(error){
        console.log(error)
    }
    return query
}

// CALLABLE
async function recommendPOI(userId){
    var categories = await recommendCategories(userId)
    console.log(categories)
    // allow the user to select categories from the recommended list 
    // of categories and then call the overview function
}

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });


// updateWeight("609517c3843ccf3dc43c4113",0.9,"W29267290")
// recommendPOI("609517c3843ccf3dc43c4113")
// overview("chennai",5000,"malls","1","exp")
// getPlaceInfo("N344405874")
updatePOIcategories("60950bfab418810f3449f8cc")


/*
'N5744866570' - Palmshore
W154030370 - Express Avenue
N6274320986 - Shake Shack

N4799194310 - Adyar Ananda Bhavan
W22902280 - Marina Beach
W29267290 - Citi center
*/

/*
RECOMMENDED PLACES USER
[
  'tourist_facilities',
  'shops',
  'malls',
  'restaurants',       
  'foods',
  'fast_food'
]

RECOMMENDED PLACES USERX
[
  'interesting_places',
  'natural',
  'beaches',
  'other_beaches',     
  'restaurants',       
  'foods',
  'tourist_facilities',
  'shops',
  'malls'
]
*/
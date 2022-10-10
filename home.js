const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homefile=fs.readFileSync("home.html","utf-8");
const replaceVal =(tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp); 
    temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min); 
    temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max); 
    temperature = temperature.replace("{%location%}",orgval.name); 
    temperature = temperature.replace("{%country%}",orgval.sys.country );
    temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main );  
    return temperature;
};
 const server = http.createServer((req,res)=>{
      if(req.url=="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Gaya&units=metric&appid=00e6d744aaa98acbfddbb8e697d56c5d" )
        .on('data',  (chunk)=> {
            const objdata=JSON.parse(chunk);
            const arrData =[objdata];
          //console.log(arrData[0].main.temp);
          const realTimeData = arrData.map((val)=>
              // console.log(val.main);
              replaceVal(homefile,val)).join("");
          res.write(realTimeData);
          //console.log(realTimeData);
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
           res.end();
          console.log('end');
        }); 
      }
 });

 server.listen(8008,"127.0.0.1",()=>{
     console.log("listen");
 });
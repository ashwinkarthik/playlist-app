 

var express = require('express'),
    path = require('path'),
    app = express(),
    googleapis = require('googleapis'),
    API_KEY = 'AIzaSyBsa8KVrYKsCi2PjXAkTlz5DavoKQceNRQ',
    RESULT_COUNT = 20;

googleapis.options ({ auth: API_KEY });
var youtube = googleapis.youtube ('v3');

app.use(express.static(__dirname+'/'));

app.get('/',function(req,res){
        res.sendFile(path.join(__dirname,'/index.html'));
});

app.get('/:name',function(req,res){
        
  youtube.search.list(
        {
         part: 'snippet',
         type: 'video',
         q: req.params.name,
         maxResults: RESULT_COUNT,
         order: 'date',
         safeSearch: 'moderate',
         videoEmbeddable: true
        },
        function(err,result){
                if(err)
                        console.log(err);
                else{
                      
                        var results = [];
                        for(var i=0;i<RESULT_COUNT;i++) {
                            var item = result.items[i];
                            var resultObject = { };
                            resultObject.videoId = item.id.videoId;
                            resultObject.title = item.snippet.title;
                            resultObject.imageURL = item.snippet.thumbnails.high.url;
                            results.push(resultObject);
                        }
                       
                        console.log(JSON.stringify(results,null,2));
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(results,null,2));
                }

        });
});

app.listen(1500);
console.log('Listening on Port 1500');

require('http').createServer(function($req, $res) {
    
    var chunks = [], body = "", $body = {};
    $req
        .on('data', (chunk) => {
            chunks.push(chunk);
        })
        .on('end', function() {

            body = Buffer.concat(chunks).toString();

            if (body.length != 0)
                $body = JSON.parse(body);

            var parts = $req.url.split("/");
            var method = parts[parts.length - 1];

            eval(method + "($req, $body, $res)");

        });

}).listen(8000, function() { console.log("Running on 8000...") });

function Start($req, $body, $res) {

    var convo = $convos.new();

    var item = new ConvoItem();
    item.agents = ["menu"];

    convo.add(item);

    $res.end(convo.id + "");

}

function Convo($req, $body, $res) {

    var convo = $convos.find($body.id);

    $res.end(convo.stringify());

}

function Process($req, $body, $res) {

    var convo = $convos.find($body.conversation);

    convo.process($body.text);

    var item = convo.last();

    $res.end(item.stringify($body.style));

}
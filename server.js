const server = require("http");
const fs = require("fs");
const path = require("path");
const { parse } = require("querystring");

console.log("hello world");

function GetURI(n) {
  var url = n.toString().split("/");
  if (url.length > 2) {
    var type = url[1];
    var file = url[2];

    return {
      type: type,
      Option: file,
    };
  } else {
    var type = url[1];
    return {
      type: type,
    };
  }
}

const app = function (req, res) {
  var encoded = GetURI(req.url);
  console.log(encoded);
  switch (encoded.type) {



    case "image": {
      var filepath = "./src/image/1.jpg";
      fs.readFile(
        filepath,
        {
          encoding: "base64",
        },
        (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(
            '<html><body style="display:flex;justify-content:center;"><img src="data:image/*;base64,'
          );
          res.write(data);
          res.end('"/></body></html>');
        }
      );
      break;
    }



    case "database": {
      res.writeHead(200, { "Content-type": "application/json" });
      fs.readFile("./src/database/data.json", (err, data) => {
        return res.end(data);
      });
      break;
    }



    case "text": {
      var text = "you see text on this page";
      if (encoded.Option != undefined) {
        text = decodeURI(req.url);
        text = text.split("/").pop();
      }
      console.log(text);
      res.writeHead(200, { "Content-type": "text/plain" });
      console.log(text);
      return res.end(text);
    }
    case "login": {
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on("end", () => {
          //console.log(parse(body));
          body = parse(body);

          fs.readFile("./src/database/data.json", (err, users) => {
            var u = JSON.parse(users);
            var status = false;
            u.forEach((value) => {
              console.log(value);
              if (value.login == body.login && value.pass == body.pass) {
                status = true;
              }
            });


            if (status)
             return res.end(JSON.stringify({ status: "login_ok" }));
            else 
              return res.end(JSON.stringify({ status: "login_failed" }));
            
          });
        });
      }
      break;
    }

    case "signup": {
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on("end", () => {
          //console.log(parse(body));
          body = parse(body);
          console.log(body);
          if (body.login != "" && body.pass != "") {
            console.log("here");
            var json;

            fs.readFile("./src/database/data.json", (err, data) => {
              json = JSON.parse(data);

              var user = {
                login: body.login,
                pass: body.pass,
              };

              json.push(user);
              console.log(json);

              fs.writeFileSync(
                "./src/database/data.json",
                JSON.stringify(json, null, "\t")
              );

              return res.end(JSON.stringify({ status: "register_ok" }));
            });
          }
        });
        break;
      }
    }
    default: {
      res.writeHead(200, "text/html");
      fs.readFile("./src/index.html", (err, data) => {
        return res.end(data);
      });
    }
  }
};

server.createServer(app).listen(3001, () => {
  console.log("http://localhost:3001");
});

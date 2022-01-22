var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log(
    "球球你了，输一下端口号吧。只要这样输入\nnode server.js 8888 就好啦~"
  );
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("你发请求过来啦~ 路径（带查询参数）为：" + pathWithQuery);

  if (path === "/") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(fs.readFileSync("./public/index.html"));
    response.end();
  } else if (path === "/weixin.js") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    response.write(fs.readFileSync("./public/weixin.js"));
    response.end();
  } else if (path === "/weixin.json") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/json;charset=utf-8");
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:9999");
    response.write(fs.readFileSync("./public/weixin.json"));
    response.end();
  } else if (path === "/data.js") {
    if (request.headers["referer"].indexOf("http://localhost:9999") === 0) {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/javascript;charset=utf-8");
      let string = fs.readFileSync("./public/data.js").toString();
      let data = fs.readFileSync("./public/weixin.json").toString();
      let string2 = string
        .replace("{{data}}", data)
        .replace("{{xxx}}", query.callback);
      response.write(string2);
      response.end();
    }
  } else {
    response.statusCode = 404;
    response.end();
  }

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log("监听 " + port + " 成功啦，\n请打开 http://localhost:" + port);

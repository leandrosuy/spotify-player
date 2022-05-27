const express = require("express");
const request = require("request");
const app = express();
app.use(express.json());

var client_id = "ac9daaaa56eb428a905fbc126cd5e6ae";
var client_secret = "104c35cbbe6f4effb3e1ea45f2664284";
var token =
  "BQApIOF3r0f7pIQFZUfEXNBqFby43SyfoJQm9zN541_-EeufwwEF1PW82zON4jJRjfbR9IERIJW2V92cNL_w4Kg6Jbw_FJ94N2-zmON7et6y26VFgvg4ZCF4SpED70QPTndeBGODJjsPW8l_ImJspAxJ1JG6DYYTLWpGug";

// Buscar token
app.get("/token", (req, res) => {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
      return res.json({ token });
    }
  });
});

// Buscar informações sobre a device
// app.get("/info/:token", (req, res) => {
app.get("/info", (req, res) => {
  //   var { token } = req.params;
  var authOptions = {
    url: "https://api.spotify.com/v1/me/player/devices",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  request.get(authOptions, function (error, response, body) {
    let bodyConvert = JSON.parse(body);
    return res.json(bodyConvert);
  });
});

// Controlar volume
app.get("/volume/:volume_percent/:device_id", (req, res) => {
  const { volume_percent } = req.params;
  const { device_id } = req.params;

  var authOptions = {
    url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume_percent}&device_id=${device_id}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  request.put(authOptions, function () {
    res.json({ volume: `${volume_percent}%` });
  });
});

app.listen(3000, () => {
  console.log("Node is spotify 🎧🎵");
});

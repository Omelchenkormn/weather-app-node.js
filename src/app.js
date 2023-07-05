const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Roman Omelchenko",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Roman Omelchenko",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help ",
    message: "This is some helpful text.",
    name: "Roman Omelchenko",
  });
});

app.get("/weather", (req, res) => {
  const userQueryLocation = req.query.address;

  if (!userQueryLocation) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(
    userQueryLocation,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: userQueryLocation,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Roman Omelchenko",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page not found",
    name: "Roman Omelchenko",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

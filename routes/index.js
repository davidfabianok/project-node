const express = require("express"),
  Router = express.Router(),
  News = require("../models/News"),
  User = require("../models/User"),
  bcrypt = require('bcryptjs');
  

Router.get("/", (req, res) =>
  res.render("home", { namepage: "Home", navbar: true  })
);

// User routes

Router.get("/login", (req, res) => {
   if(req.session.user_id){
     res.redirect("/news");
  } 
  res.render("login", { namepage: "Iniciar sesión" })
});

Router.post("/login", async (req, res) => {
  const usr = await User.findOne({
    email: req.body.email
  })

  const match = await bcrypt.compare(req.body.password, usr.password);

  if(match){
    req.session.user_id = usr._id;
    res.redirect('/news');
  } else {
    res.render("login", { namepage: "Iniciar sesión" });
  }
});

Router.get("/register", (req, res) => {
   if (!req.session.user_id) {
     res.redirect("/news");
   } 

  res.render("register", { namepage: "Registrarse" })
}
);

Router.post("/register", async (req, res) => {
  const { name, email, password, rpassword } = req.body;
  const e_name = [],
    e_email = [],
    e_pass = [],
    e_rpass = [];

  if (!name.trim()) {
    e_name.push({
      name: "Agrega tu nombre"
    });
  } else if (name.trim().length < 3) {
    e_name.push({
      name: "Minimo 3 caracteres"
    });
  }
  if (!email.trim()) {
    e_email.push({
      email: "Agrega tu email"
    });
  }

  if (password.trim().length < 8) {
    e_pass.push({
      password: "Agrega tu contraseña con al menos 8 caracteres"
    });
  } else if (password !== rpassword) {
    e_rpass.push({
      rpassword: "Las contraseñas no coinciden"
    });
    e_pass.push({
      password: ""
    });
  }

  if (
    e_name.length > 0 ||
    e_email.length > 0 ||
    e_pass.length > 0 ||
    e_rpass.length > 0
  ) {
    res.render("register", { e_name, e_email, e_pass, e_rpass, name, email });
  } else {
    const emailUser = await User.findOne({email: email });
    if(emailUser){
      e_email.push({
        email: "Este email ya esta en uso"
      });
      res.render("register", { e_name, e_email, e_pass, e_rpass, name, email });
    }
    const newUser = new User({ name, email, password });
    newUser.password = await newUser.encryptPassword(password);

    await newUser.save();
    res.redirect('/login');
  }
});

// News routes

Router.get("/news", async (req, res) => {
  if(!req.session.user_id){
     res.redirect("/login");
  } 
  const news = await News.find().sort({ date: "desc" });
  
  res.render("news", {
    namepage: "Novedades",
    navbar: true,
    btnAdd: true,
    news
  });
});

Router.post("/news", async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title.trim()) {
    errors.push({
      text: "No puede estar vacio"
    });
  } else if (title.trim().length < 3) {
    errors.push({
      text: "Minimo 3 caracteres"
    });
  }
  if (errors.length > 0) {
    res.render("addNews", { title, description, errors });
  } else {
    const addNews = new News({ title, description });
    await addNews.save();
    res.redirect("/news");
  }
});

Router.get("/news/add", (req, res) =>
  res.render("addNews", { namepage: "Agregar novedad", navbar: true })
);

module.exports = Router;

import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";
const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());

let url = process.env.URL;
const sequelize = new Sequelize(url);

const User = sequelize.define("User", {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name: {type: DataTypes.STRING},
  password: {type: DataTypes.STRING},
});

User.sync();


const List = sequelize.define("list", {
  list_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  list_name: {type: DataTypes.STRING},
  user_id: {type: DataTypes.INTEGER},
});

List.sync();

const Task = sequelize.define("task", {
  task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  task_description: {type: DataTypes.STRING},
  list_id: {type: DataTypes.INTEGER},
  task_status: {type: DataTypes.STRING},
});

Task.sync();

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_name: req.body.username },
    });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Username or password incorrect");
    }
  } catch {
    res.status(500).send();
  }
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      user_name: req.body.username,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch(error) {
    console.log(error);
    res.status(500).send();
  }
});

const port = process.env.PORT || 3000;
app.listen(port);

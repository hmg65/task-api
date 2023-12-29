import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import { Sequelize } from "sequelize";
const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://gslafacc:22x60wNBbefpSmWZRPg2oEYl-EMH45Fe@satao.db.elephantsql.com/gslafacc')

const User = sequelize.define('user', {
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_name: Sequelize.STRING,
    password: Sequelize.STRING
  });
  
  const List = sequelize.define('list', {
    list_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    list_name: Sequelize.STRING,
    user_id: Sequelize.INTEGER
  });
  
  const Task = sequelize.define('task', {
    task_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    task_description: Sequelize.STRING,
    list_id: Sequelize.INTEGER,
    task_status: Sequelize.STRING
  });

  app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ where: { user_name: req.body.username } });
      if (user && await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Username or password incorrect');
      }
    } catch {
      res.status(500).send();
    }
  });   

app.post('/register', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        user_name: req.body.username,
        password: hashedPassword
      });
      res.status(201).json(user);
    } catch {
      res.status(500).send();
    }
  });




const port = process.env.PORT || 3000;
app.listen(port);
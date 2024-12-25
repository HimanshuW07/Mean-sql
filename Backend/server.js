import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 8085;

const app = express();
app.use(bodyParser.json());
app.use(cors()); // This allows all origins, but you can restrict it to a specific origin if needed

//Establish the database connection

const __dirname = path.resolve();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(function (error) {
    if (error) {
      console.log("Error Connecting to DB");
      console.log(error);
    } else {
      console.log("successfully Connected to DB");
    }
  });


//Create the Records

app.post("/api/student/add", (req, res) => {
    let details = {
      stname: req.body.stname,
      course: req.body.course,
      fee: req.body.fee,
    };
    let sql = "INSERT INTO student SET ?";
    db.query(sql, details, (error) => {
      if (error) {
        res.send({ status: false, message: "Student created Failed" });
      } else {
        res.send({ status: true, message: "Student created successfully" });
      }
    });
  });



//view the Records

app.get("/api/student", (req, res) => {
  const sql = "SELECT * FROM student";
  db.query(sql, (error, result) => {
      if (error) {
          res.status(500).send({ status: false, message: "Database query failed" });
      } else {
          res.status(200).send({ status: true, data: result });
      }
  });
});


//Search the Records

app.get("/api/student/:id", (req, res) => {
    var studentid = req.params.id;
    var sql = "SELECT * FROM student WHERE id=" + studentid;
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });



//Update the Records

app.put("/api/student/update/:id", (req, res) => {
    let sql =
      "UPDATE student SET stname='" +
      req.body.stname +
      "', course='" +
      req.body.course +
      "',fee='" +
      req.body.fee +
      "'  WHERE id=" +
      req.params.id;
  
    let a = db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "Student Updated Failed" });
      } else {
        res.send({ status: true, message: "Student Updated successfully" });
      }
    });
  });



  //Delete the Records

  app.delete("/api/student/delete/:id", (req, res) => {
    let sql = "DELETE FROM student WHERE id=" + req.params.id + "";
    let query = db.query(sql, (error) => {
      if (error) {
        res.send({ status: false, message: "Student Deleted Failed" });
      } else {
        res.send({ status: true, message: "Student Deleted successfully" });
      }
    });
  });

    // Serve Static Files
    app.use(express.static(path.join(__dirname, '/Frontend/frond-end/dist/frond-end')));
    app.get('*', (_, res) => {
        res.sendFile(path.resolve(__dirname, 'Frontend', 'frond-end', 'dist', 'frond-end', 'index.html'));
    });
    
  
  //Establish the Port
  
    app.listen(PORT,function check(error) {
      if (error) 
      {
      console.log("Error....dddd!!!!");
      }
  
      else 
      {
          console.log("Started....!!!! 8085");
  
      }
  });
  
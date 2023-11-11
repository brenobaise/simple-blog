import express from "express";

// imports env file
import dotevn from "dotenv";
dotevn.config();

// create an instance of express 
const app = express();
const port = process.env.PORT;

// const to store the server path file
// const root_path = {root : __dirname};

// register the view engine for the app
app.set('view engine', 'ejs');
// tells express where the static pages are
app.use(express.static('public'));

// Server port
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

app.get('/', (req,res) =>{
    res.send('<h1> HomePage </h1>');
});
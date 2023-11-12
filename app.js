import express from "express";

// imports env file
import dotevn from "dotenv";
import { getAllBlogs, getBlogById, createBlog, deleteBlog} from './database.js';

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
app.use(express.json());


// Server port
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

app.get('/', (req,res) =>{
    // HomePage
    res.render('index.ejs');
});

app.get('/blogs', async (req, res) =>{
    // view all existing blog entries
    const blogs = await getAllBlogs();
    res.render('blogs.ejs', {blogs : blogs});
});
app.get('/blogs/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await getBlogById(id);
    res.send(blog);
});

app.post('/blogs/create', async (req, res) =>{
    // Create a new blog entry
    const { title, contents } = req.body;
    const newBlogEntry = await createBlog(title, contents);
    res.status(201).send();
});

app.get('/about', (req, res) => {
    // About Page
});
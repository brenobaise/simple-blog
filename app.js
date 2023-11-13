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
app.use(express.urlencoded({extended : true}));


// Server port
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

app.get('/', async (req,res) =>{
    // HomePage
    res.render('index', {title: 'Home'});
});

app.get('/blogs', async (req, res) =>{
    // view all existing blog entries
    const blogs = await getAllBlogs();
    res.render('blogs', { blogs: blogs, title: 'All Blogs' });

});

app.get('/blogs/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await getBlogById(id);
    res.send(blog);
});

app.get('/createBlog', async (req, res) => {
    res.render('create', {title: "Create a new Entry"});
})

app.post('/blogs', async (req, res) => {
    const data = req.body;
    await createBlog(data);
    res.redirect('/blogs');
});

app.get('/about', async (req, res) => {
    // About Page
});
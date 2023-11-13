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
    // View all existing blog entries
    const blogs = await getAllBlogs();
    res.render('blogs', { blogs: blogs, title: 'All Blogs' });

});

app.get('/blogs/:id', async (req, res) => {
    // View a specific blog
    const id = req.params.id;
    const blog = await getBlogById(id);
    res.send(blog);
});

app.get('/createBlog', async (req, res) => {
    // New blog page
    res.render('create', {title: "Create a new Entry"});
})

app.post('/blogs', async (req, res) => {
    // Commit a created blog to the database
    const data = req.body;

    // Check if creating the blog was successful
    const newBlogId = await createBlog(data);
    if (newBlogId !== -1) {
        // Redirect to the newly created blog
        res.redirect(`/blogs/${newBlogId}`);
    } else {
        // Render the create page again with an error message
        res.render('create', { title: "Create a new Entry"});
    }
});

app.get('/about', async (req, res) => {
    // About Page
});
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Create a pool of connections
const pool= mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}).promise();


//  CRUD OPERATIONS
export async function getAllBlogs(){
    try {
        const blogs = await pool.query("SELECT * FROM blogs");
        return blogs[0];
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }   
}

export async function getBlogById(blogId) {
    try {
        const blogExists = await searchById(blogId);

        if (blogExists) {
            // If the blog with the given ID exists, retrieve and return the blog object
            const blog = await pool.query("SELECT * FROM blogs WHERE id = ?", [blogId]);
            return blog[0][0];
        } else {
            // If the blog with the given ID doesn't exist, return null or any appropriate indication
            console.error("Error: Blog with ID not found");
            return null ;
        }
    } catch (err) {
        console.error('Error at getBlogById:', err);
        throw err;
    }
}

export async function createBlog({ title, contents }) {
    try {
        // Check if a blog with the same title and contents already exists
        const existingBlog = await pool.query("SELECT * FROM blogs WHERE title = ? AND contents = ?", [title, contents]);

        if (existingBlog && existingBlog[0].length > 0) {
            console.log("User was not able to create a blog, an existing blog was found");
            return -1; // Return -1 to indicate that the blog creation was unsuccessful
        }

        // If a blog doesn't already exist with the same title and contents, insert the new blog
        const result = await pool.query("INSERT INTO blogs (title, contents) VALUES (?, ?)", [title, contents]);

        // Return the ID of the newly created blog
        return result.insertId;
    } catch (err) {
        console.error('Error at createBlog: ', err);
        return -1; // Return -1 to indicate that the blog creation was unsuccessful
    }
}


export async function deleteBlog(blogId) {
    try {
        const blogToDelete = await searchById(blogId);

        if (!blogToDelete) {
            // If the blog with the given ID doesn't exist, return false
            return false;
        }

        // If the blog exists, delete it
        await pool.query("DELETE FROM blogs WHERE id = ?", [blogId]);

        // Return true to indicate successful deletion
        return true;
    } catch (err) {
        console.error("Error at deleteBlog: ", err);
        // Return false in case of an error
        return false;
    }
}

// CRUD Utility Functions
export async function searchById(blogId) {
    try {
        const foundBlog = await pool.query("SELECT * FROM blogs WHERE id = ?", [blogId]);

        if (foundBlog && foundBlog[0].length > 0) {
            // Return true if the blog with the given ID is found
            return true;
        } else {
            // Return false if the blog with the given ID doesn't exist
            return false;
        }
    } catch (err) {
        console.error("Error searching for blog by ID:", err);
        // Return false in case of an error
        return false;
    }
}



// Dev methods
async function devFlushDatabase(){
    pool.query("DELETE FROM blogs");
    console.log("flushed")
}

async function devGetBlogs(){
    const data =  await getAllBlogs();
    console.log(data);
}
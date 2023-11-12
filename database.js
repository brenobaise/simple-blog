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
console.log(process.env.HOST, process.env.USER, process.env.PASSWORD, process.env.DATABASE);

export async function getAllBlogs(){
    try {
        const blogs = await pool.query("SELECT * FROM blogs");
        return blogs[0];
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }   
}
export async function getBlogById(){
    try{
        const blog = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
        return blog[0];
    }catch(err){
        console.error('Error at getBlogById:', err);
    }
}
export async function createBlog(title, contents){
    try{
        const existingBlog = await pool.query("SELECT * FROM blogs WHERE title = ? OR contents = ?",
        [title, contents]);

        if( existingBlog[0].length > 0){
            console.log("User was not able to create a blog, an existing blog was found");
            return -1;
        }

        // if a blog already doesnt exist
        const blog = await pool.query("INSERT INTO blogs (title, contents) VALUES (?, ?)",
         [title, contents]);

    }catch (err){
        console.error('Error at createBlog: ', err);
    }
}

export async function deleteBlog(blogId){
    try{
        if(!(searchById(blogId))){
            return -1;
        }
        await pool.query("DELETE FROM blogs WHERE id = ?", [blogId]);
    }catch (err){
        console.error("Error at deleteBlog: ", err);
        console.log("delete")
    }

}

async function searchById(blogId){
    try{
        const foundBlog = await pool.query("SELECT id FROM blogs WHERE id = ?", 
        [blogId]);
        if(foundBlog)
        return foundBlog[0][0].id;
    }catch(err){
        console.error("Error 404 : ID not found");
        return -1;
    }
    
}
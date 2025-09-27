# Social Media App - MERN

This is a social media app built using the MERN stack (MongoDB, Express, React, and Node), with JavaScript as the programming language.

## Requirements

Make sure Node.js is installed on your computer. You can download it from [https://nodejs.org/en/download](https://nodejs.org/en/download).

This project uses environment variables to manage configuration and sensitive information. Create a `.env` file in the `backend` directory with the following variables:

- `PORT`: Port where the app will run
- `MONGO_URI`: Connection string for your MongoDB database
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `SECRET_KEY`: Secret key to sign JWT tokens
- `CLOUD_NAME`: Your Cloudinary cloud name

## Installation

Clone this project by either downloading the ZIP file or cloning it using the repository URL.

cd Social-media-app

### Run the backend

cd backend
npm run dev


If you encounter the error `sh: 1: nodemon: not found`, run:

npm install --save-dev nodemon
npm run dev


### Run the frontend

cd frontend


If you encounter the error `vite: not found`, run:

npm install vite --save-dev


Then start the frontend server:

npm run dev


The app will be running at: [http://localhost:5173](http://localhost:5173)

## Features

- State management implemented with Redux for real-time data updates
- Real-time chat system using Socket.io
- User online/offline status using Socket.io
- Full CRUD operations for posts
- Bookmark, like, and comment on posts
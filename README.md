# Reddit Clone

A simple Reddit clone built with React, Express, and MySQL. This app allows users to post content and view each other's posts.

## Features

- Submit posts with a title and content.
- View a list of all posts made by users.
- Posts are saved in a MySQL database, and the data persists even after page reloads.

## Prerequisites

Before running this app locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/)

## Installation

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd reddit-clone
Step 2: Set up the MySQL database
CREATE DATABASE reddit_clone;
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);

Be sure to install all dependencies of the project before using as it is crucial for you to run the server of this projecy.
after they are installed type node server.js in the terminal and open the html file in the browser.
If everything was done correctly you should be able to use the app and create posts.

Also the latest feature is the comments feature, this is the database schema for the comments to work:

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);


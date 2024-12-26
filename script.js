// script.js

const Post = ({ title, content, likes, onLike }) => (
  <div className="post">
      <h3>{title}</h3>
      <p>{content}</p>
      <button onClick={onLike}>Like {likes}</button>
  </div>
);
  
  const PostForm = ({ onAddPost }) => {
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title || !content) return;
  
      await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
  
      onAddPost({ title, content });
      setTitle('');
      setContent('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit">Add Post</button>
      </form>
    );
  };
  
  const App = () => {
    const [posts, setPosts] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
      fetch('http://localhost:3001/api/posts')
          .then((res) => res.json())
          .then((data) => {
              // Initialize likes for each post from the database
              setPosts(data); // Ensure this includes the likes from the database
          });
  }, []);

    const addPost = (newPost) => {
        const postWithLikes = { ...newPost, likes: 0 }; // Initialize likes for new post
        setPosts([postWithLikes, ...posts]);
    };

    const handleLike = async (id) => {
      // Send a request to the backend to like the post
      await fetch(`http://localhost:3001/api/posts/${id}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });
  
      // Update the local state to reflect the new like count
      setPosts(posts.map(post => 
          post.id === id ? { ...post, likes: post.likes + 1 } : post
      ));
  };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h1>First-React-App</h1>
            <input
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <PostForm onAddPost={addPost} />
            {filteredPosts.map((post) => (
                <Post 
                    key={post.id} 
                    title={post.title} 
                    content={post.content} 
                    likes={post.likes} 
                    onLike={() => handleLike(post.id)} // Pass the like handler
                />
            ))}
        </div>
    );
};
  
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  
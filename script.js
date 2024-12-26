// script.js

const Post = ({ title, content }) => (
    <div className="post">
      <h3>{title}</h3>
      <p>{content}</p>
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
  
    React.useEffect(() => {
      fetch('http://localhost:3001/api/posts')
        .then((res) => res.json())
        .then((data) => setPosts(data));
    }, []);
  
    const addPost = (newPost) => {
      setPosts([newPost, ...posts]);
    };
  
    return (
      <div>
        <h1>First-React-App</h1>
        <PostForm onAddPost={addPost} />
        {posts.map((post) => (
          <Post key={post.id} title={post.title} content={post.content} />
        ))}
      </div>
    );
  };
  
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  
// script.js

const Post = ({ id, title, content, likes, onLike, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(title);
  const [editContent, setEditContent] = React.useState(content);

  const handleEdit = () => {
    onEdit(id, editTitle, editContent);
    setIsEditing(false);
  };

  return (
    <div className="post">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          ></textarea>
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{title}</h3>
          <p>{content}</p>
          <button onClick={onLike}>Like {likes}</button>
          <button onClick={onDelete}>Delete</button>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

// the post form
  
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
  // handling sumbmition
    return (
      <form onSubmit={handleSubmit} className="post-form">
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
        <h3> Posts Below!!</h3>
      </form>
    );
  };
  
  const App = () => {
    const [posts, setPosts] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        fetch('http://localhost:3001/api/posts')
            .then((res) => res.json())
            .then((data) => setPosts(data));
    }, []);

    const addPost = (newPost) => {
      // Add the post to the state
      setPosts(prevPosts => [{ ...newPost, likes: 0 }, ...prevPosts]);
      
      // Perform a hard refresh after adding the post
      window.location.reload();
  };

    const handleLike = async (id) => {
        await fetch(`http://localhost:3001/api/posts/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        setPosts(posts.map(post => 
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:3001/api/posts/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        setPosts(posts.filter(post => post.id !== id)); // Remove the deleted post from state
    };

    //handling the edit

    const handleEdit = async (id, newTitle, newContent) => {
      await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      setPosts(posts.map(post => 
        post.id === id ? { ...post, title: newTitle, content: newContent } : post
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
                    id = {post.id}
                    title={post.title} 
                    content={post.content} 
                    likes={post.likes} 
                    onLike={() => handleLike(post.id)} 
                    onDelete={() => handleDelete(post.id)} // Pass the delete handler
                    onEdit={handleEdit}
                />
            ))}
        </div>
    );
};
  
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  
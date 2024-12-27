// script.js

const Post = ({ id, title, content, likes, onLike, onDelete, onEdit }) => {
  const [comments, setComments] = React.useState([]);
  const [showComments, setShowComments] = React.useState(false);

  // Fetch comments when comments section is expanded
  React.useEffect(() => {
    if (showComments) {
      fetch(`http://localhost:3001/api/posts/${id}/comments`)
        .then((res) => res.json())
        .then((data) => setComments(data));
    }
  }, [showComments, id]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const addComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleDeleteComment = async (commentId) => {
    await fetch(`http://localhost:3001/api/comments/${commentId}`, {
      method: 'DELETE',
    });
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="post">
      <h3>{title}</h3>
      <p>{content}</p>
      <button onClick={onLike}>Like {likes}</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={toggleComments}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>

      {showComments && (
        <div className="comments-section">
          <CommentForm postId={id} onAddComment={addComment} />
          
          {comments.length > 0 ? (
            comments.map(comment => (
              <Comment 
                key={comment.id} 
                id={comment.id} 
                content={comment.content} 
                onDelete={() => handleDeleteComment(comment.id)} 
              />
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
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

// the comment component

// Comment Component
const Comment = ({ id, content, onDelete }) => {
  return (
    <div className="comment">
      <p>{content}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

// Comment Form Component
const CommentForm = ({ postId, onAddComment }) => {
  const [content, setContent] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newComment = await response.json();
      onAddComment(newComment);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit">Post Comment</button>
    </form>
  );
};
  
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  
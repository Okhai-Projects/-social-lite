
import { useCallback, useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

function App() { 
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState({})
  const [commentInputs, setCommentInputs] = useState({})    
  const [token, setToken] = useState(
    () => localStorage.getItem('sociallite_token') || ''
  )
  const [username, setUsername] = useState(
    () => localStorage.getItem('sociallite_username') || ''
  )

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [content, setContent] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showAuth, setShowAuth] = useState(!token)

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);

    
      if (!response.ok) {
        throw new Error('Could not load posts.')
      }

      const data = await response.json()
      const loadedPosts = Array.isArray(data) ? data : data.posts || []

      setPosts(loadedPosts)
      setError('')
    } catch {
      setError(
        'Could not connect to SocialLite. Make sure your backend is running.'
      )
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  function handleInputChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  function logout() {
    localStorage.removeItem('sociallite_token')
    localStorage.removeItem('sociallite_username')
    setToken('')
    setUsername('')
    setShowAuth(true)
    setMessage('You have logged out.')
  }

  async function handleAuth(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const isRegister = mode === 'register'
    const endpoint = isRegister
      ? '/api/auth/register'
      : '/api/auth/login'

    const payload = isRegister
      ? {
          username: form.username,
          email: form.email,
          password: form.password,
        }
      : {
          username: form.username,
          password: form.password,
        }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const detail = data.detail
        const errorText = Array.isArray(detail)
          ? detail.map((item) => item.msg).join(', ')
          : detail

        throw new Error(
          errorText ||
            (isRegister
              ? 'Registration failed.'
              : 'Login failed. Check your credentials.')
        )
      }

      if (isRegister) {
        setMessage('Account created! You can now log in.')
        setMode('login')
        setForm({
          username: form.username,
          email: '',
          password: '',
        })
      } else {
        if (!data.access_token) {
          throw new Error('The server did not return an access token.')
        }

        localStorage.setItem('sociallite_token', data.access_token)
        localStorage.setItem('sociallite_username', form.username)

        setToken(data.access_token)
        setUsername(form.username)
        setShowAuth(false)
        setForm({
          username: '',
          email: '',
          password: '',
        })
        setMessage('Welcome to SocialLite!')
        await loadPosts()
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePost(event) {
    event.preventDefault()

    if (!token) {
      setError('Please log in before creating a post.')
      setShowAuth(true)
      return
    }

    if (!content.trim()) {
      setError('Write something before posting.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout()
          throw new Error('Your session expired. Please log in again.')
        }

        const detail = data.detail
        const errorText = Array.isArray(detail)
          ? detail.map((item) => item.msg).join(', ')
          : detail

        throw new Error(errorText || 'Could not create your post.')
      }

      setContent('')
      setMessage('Your post was published!')
      await loadPosts()
    } catch (err) {
      setError(err.message || 'Could not publish your post.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLike(post) {
    if (!token) {
      setError('Please log in to like posts.')
      setShowAuth(true)
      return
    }

    const postId = post.id ?? post.post_id

    if (postId == null) {
      setError('Could not identify this post.')
      return
    }

    const wasLiked = Boolean(post.liked)

    setError('')
    setMessage('')

    // Update the interface immediately.
    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        (item.id ?? item.post_id) === postId
          ? {
              ...item,
              liked: !wasLiked,
              likes: Math.max(
                0,
                Number(item.likes || 0) + (wasLiked ? -1 : 1)
              ),
            }
          : item
      )
    )

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${postId}/like`,
        {
          method: wasLiked ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout()
          throw new Error('Your session expired. Please log in again.')
        }

        throw new Error(data.detail || 'Could not update your like.')
      }

      setPosts((currentPosts) =>
        currentPosts.map((item) =>
          (item.id ?? item.post_id) === postId
            ? {
                ...item,
                liked: data.liked,
                likes: data.likes,
              }
            : item
        )
      )
    } catch (err) {
      // Restore the previous button state if the request fails.
      setPosts((currentPosts) =>
        currentPosts.map((item) =>
          (item.id ?? item.post_id) === postId
            ? {
                ...item,
                liked: wasLiked,
                likes: Math.max(
                  0,
                  Number(item.likes || 0) + (wasLiked ? 1 : -1)
                ),
              }
            : item
        )
      )

      setError(err.message || 'Could not update your like.')
    }
  }

  async function handleDeletePost(post) {
    if (!token) {
      setError('Please log in to delete a post.')
      setShowAuth(true)
      return
    }

    const postId = post.id ?? post.post_id

    if (postId == null) {
      setError('Could not identify this post.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout()
          throw new Error('Your session expired. Please log in again.')
        }

        throw new Error(data.detail || 'Could not delete this post.')
      }

      setPosts((currentPosts) =>
        currentPosts.filter(
          (item) => (item.id ?? item.post_id) !== postId
        )
      )

      setMessage('Your post was deleted successfully.')
    } catch (err) {
      setError(err.message || 'Could not delete this post.')
    }
  }

  async function loadComments(postId) {
    try {
      const response = await fetch(
        `${API_URL}/api/posts/${postId}/comments`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load comments.')
      }

      setComments((current) => ({
        ...current,
        [postId]: data.comments || [],
      }))
    } catch (err) {
      setError(err.message || 'Could not load comments.')
    }
  }


async function handleDeleteComment(commentId, postId) {
  try {
    const response = await fetch(
      `${API_URL}/api/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to delete comment.')
    }

    setComments((current) => ({
      ...current,
      [postId]: (current[postId] || []).filter(
        (comment) => (comment.id ?? comment.comment_id) !== commentId
      ),
    }))

    setMessage('Comment deleted successfully!')
    setError('')
  } catch (err) {
    setError(err.message || 'Failed to delete comment.')
  }
}

const handleStartEdit = (post) => {
setEditingPostId(post.id ?? post.post_id)
setEditContent(post.content || '')
}

const handleSaveEdit = async (event, postId) => {
event.preventDefault()


const contentToSave = editContent.trim()

if (!contentToSave) {
  setError('Post content cannot be empty.')

  return
}

try {
  const response = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: contentToSave }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Could not update post.')
  }

  setPosts((current) =>
    current.map((post) =>
      (post.id ?? post.post_id) === postId
        ? { ...post, content: data.content }
        : post
    )
  )

  setEditingPostId(null)
  setEditContent('')
  setError('')
  setMessage('Post updated successfully!')
} catch (err) {
  setError(err.message || 'Could not update post.')
}

}

  async function handleCreateComment(postId) {
    const commentContent = (commentInputs[postId] || '').trim()

    if (!token) {
      setError('Please log in to comment.')
      setShowAuth(true)
      return
    }

    if (!commentContent) {
      setError('Please write a comment first.')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentContent }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout()
          throw new Error('Your session expired. Please log in again.')
        }

        throw new Error(data.detail || 'Could not create comment.')
      }

      setComments((current) => ({
        ...current,
        [postId]: [...(current[postId] || []), data],
      }))

      setCommentInputs((current) => ({
        ...current,
        [postId]: '',
      }))

      setMessage('Your comment was added!')
      setError('')
    } catch (err) {
      setError(err.message || 'Could not create comment.')
    }
  }


  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  function formatDate(value) {
    if (!value) return ''

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return date.toLocaleString()
  }

  function getPostUsername(post) {
    return (
      post.username ||
      post.author_username ||
      post.author ||
      'SocialLite user'
    )
  }

  function getPostId(post, index) {
    return post.id ?? post.post_id ?? index
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="SocialLite home">
          <span className="brand-icon">S</span>
          <span>SocialLite</span>
        </a>

        <nav className="top-nav">
          <a className="nav-link active" href="#home">
            Home
          </a>
          <a className="nav-link" href="#feed">
            Explore
          </a>
        </nav>

        <div className="topbar-account">
          {token ? (
            <>
              <span className="signed-in">
                <span className="online-dot" />
                {username}
              </span>
              <button
                className="outline-button"
                onClick={logout}
                type="button"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              className="primary-button small-button"
              onClick={() => {
                setShowAuth(true)
                switchMode('login')
              }}
              type="button"
            >
              Log in
            </button>
          )}
        </div>
      </header>

      <main id="home" className="main-layout">
        <aside className="sidebar">
          <div className="sidebar-card profile-card">
            <div className="profile-cover">
              <span className="cover-decoration">✳</span>
            </div>

            <div className="profile-avatar">
              {username ? username.charAt(0).toUpperCase() : 'S'}
            </div>

            <h3>{username || 'Welcome to SocialLite'}</h3>

            <p className="muted-text">
              {token ? 'Your SocialLite profile' : 'Your community awaits'}
            </p>

            <div className="profile-divider" />

            <div className="profile-stat">
              <span>Your feed</span>
              <strong>{posts.length}</strong>
            </div>

            <div className="profile-stat">
              <span>Your account</span>
              <strong>{token ? 'Active' : 'Guest'}</strong>
            </div>
          </div>

          <div className="sidebar-card sidebar-menu">
            <h4>YOUR SPACE</h4>

            <a className="menu-item selected" href="#feed">
              <span>▦</span> Home feed
            </a>

            <a className="menu-item" href="#create-post">
              <span>✎</span> Create a post
            </a>

            <a className="menu-item" href="#community">
              <span>♡</span> Community
            </a>
          </div>

          <p className="sidebar-footer">
            About · Privacy · Guidelines
            <br />
            © 2026 SocialLite
          </p>
        </aside>

        <section id="feed" className="feed-column">
          <div className="welcome-section">
            <div>
              <p className="eyebrow">YOUR COMMUNITY, YOUR VOICE</p>
              <h1>What's happening?</h1>
              <p className="welcome-subtitle">
                Share a thought. Start a conversation.
              </p>
            </div>

            <div className="welcome-art" aria-hidden="true">
              <span className="art-circle circle-one" />
              <span className="art-circle circle-two" />
              <span className="art-sparkle">✦</span>
              <span className="art-heart">♡</span>
            </div>
          </div>

          {error && (
            <div className="notice error-notice" role="alert">
              <span>!</span>
              {error}
              <button
                onClick={() => setError('')}
                aria-label="Dismiss error"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {message && (
            <div className="notice success-notice" role="status">
              <span>✓</span>
              {message}
              <button
                onClick={() => setMessage('')}
                aria-label="Dismiss message"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {token && (
            <form
              id="create-post"
              className="composer card"
              onSubmit={handleCreatePost}
            >
              <div className="composer-heading">
                <div className="avatar">
                  {username.charAt(0).toUpperCase() || 'S'}
                </div>

                <div>
                  <strong>{username}</strong>
                  <p className="muted-text">Share with the community</p>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="What's on your mind?"
                maxLength={280}
                rows={3}
                aria-label="Post content"
              />

              <div className="composer-bottom">
                <span className="character-count">
                  {content.length}/280 characters
                </span>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={loading || !content.trim()}
                >
                  {loading ? 'Publishing...' : '↗ Publish post'}
                </button>
              </div>
            </form>
          )}

          {!token && (
            <div className="guest-banner card">
              <div className="guest-icon">✦</div>

              <div className="guest-copy">
                <h3>Your voice belongs here.</h3>
                <p>
                  Log in to share your thoughts and become part of the
                  conversation.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setShowAuth(true)
                  switchMode('login')
                }}
                type="button"
              >
                Join the conversation
              </button>
            </div>
          )}

          <div className="feed-heading">
            <div>
              <h2>Community feed</h2>
              <p>See what everyone is sharing</p>
            </div>

            <button
              className="refresh-button"
              onClick={loadPosts}
              aria-label="Refresh posts"
              title="Refresh posts"
              type="button"
            >
              ↻
            </button>
          </div>

          <div className="post-list">
            {posts.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">✎</div>
                <h3>No posts yet</h3>
                <p>
                  When people share their thoughts, you'll see them here.
                </p>
              </div>
            ) : (
              posts.map((post, index) => {
                const author = getPostUsername(post)

                return (
                  <article
                    className="post-card card"
                    key={getPostId(post, index)}
                  >
                    <div className="post-header">
                      <div className="avatar post-avatar">
                        {author.charAt(0).toUpperCase()}
                      </div>

                      <div className="post-author">
                        <strong>{author}</strong>
                        <span className="post-date">
                          {formatDate(
                            post.created_at ||
                              post.createdAt ||
                              post.timestamp
                          ) || 'Community post'}
                        </span>
                      </div>

                    
{token && (
<>
<button
className="edit-post-button"
type="button"
onClick={() => handleStartEdit(post)}
>
✏️ Edit </button>

<button
  className="more-button"
  aria-label="Delete post"
  title="Delete post"
  type="button"
  onClick={() => handleDeletePost(post)}
>
  🗑️ Delete
</button>


</>
)}

                    </div>

                    <div className="post-content">
  {(editingPostId === (post.id ?? post.post_id)) ? (
    <form
      onSubmit={(event) =>
        handleSaveEdit(event, post.id ?? post.post_id)
      }
    >
      <textarea
        value={editContent}
        onChange={(event) => setEditContent(event.target.value)}
        maxLength={2000}
        required
        rows={4}
        aria-label="Edit post content"
      />


  <button type="submit" className="primary-button">
    💾 Save
  </button>

  <button
    type="button"
    className="post-action"
    onClick={() => {
      setEditingPostId(null)
      setEditContent('')
    }}
  >
    Cancel
  </button>
</form>


) : (
post.content || post.text || ''
)}

</div>


                    <div className="post-divider" />

                    <div className="post-actions">
                      <button
                        className="post-action like-button"
                        type="button"
                        onClick={() => handleLike(post)}
                        aria-pressed={Boolean(post.liked)}
                      >
                        <span className="action-icon">
                          {post.liked ? '♥' : '♡'}
                        </span>
                        {post.liked ? 'Unlike' : 'Like'}
                        <span>({Number(post.likes || 0)})</span>
                      </button>

                      <button
  className="post-action"
  type="button"
  onClick={() => loadComments(post.id ?? post.post_id)}
>
  <span className="action-icon">◯</span>
  Discussion ({(comments[post.id ?? post.post_id] || []).length})
</button>

                      <span className="post-action">
                        <span className="action-icon">↗</span>
                        Share
                      </span>
                    </div>
                    <div className="comments-section">
  {(comments[post.id ?? post.post_id] || []).map((comment) => (
    <div className="comment-item" key={comment.id}>
  <strong>{comment.username}</strong>
  <p>{comment.content}</p>
  <small>{formatDate(comment.created_at)}</small>

{token && comment.username === username && (
<button
type="button"
className="delete-comment-button"
onClick={() => handleDeleteComment(comment.id, post.id ?? post.post_id)}
>
🗑️ Delete </button>
)}

</div>

  ))}

  {token && (
    <form
      className="comment-form"
      onSubmit={(event) => {
        event.preventDefault()
        handleCreateComment(post.id ?? post.post_id)
      }}
    >
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentInputs[post.id ?? post.post_id] || ''}
        onChange={(event) =>
          setCommentInputs((current) => ({
            ...current,
            [post.id ?? post.post_id]: event.target.value,
          }))
        }
        maxLength={2000}
        aria-label="Write a comment"
      />

      <button
        className="primary-button"
        type="submit"
        disabled={!(commentInputs[post.id ?? post.post_id] || '').trim()}
      >
        Comment
      </button>
    </form>
  )}
</div>
                  </article>
                )
              })
            )}
          </div>

          <div id="community" className="feed-bottom">
            You're all caught up. Thanks for being here! ✨
          </div>
        </section>

        <aside className="right-sidebar">
          <div className="sidebar-card community-card">
            <div className="right-card-heading">
              <h3>About SocialLite</h3>
              <span className="tiny-sparkle">✦</span>
            </div>

            <p>
              A little space on the internet to share ideas, meet people, and
              have meaningful conversations.
            </p>

            <div className="community-highlight">
              <span className="highlight-icon">♡</span>
              <div>
                <strong>Be yourself</strong>
                <p>Every voice matters here.</p>
              </div>
            </div>

            <div className="community-highlight">
              <span className="highlight-icon">✧</span>
              <div>
                <strong>Stay curious</strong>
                <p>Discover new perspectives.</p>
              </div>
            </div>
          </div>

          <div className="sidebar-card tips-card">
            <span className="tip-icon">✦</span>
            <h3>A little reminder</h3>
            <p>
              Kindness makes every community better. Be thoughtful, be
              respectful, and enjoy connecting.
            </p>
          </div>
        </aside>
      </main>

      {showAuth && !token && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAuth(false)
              setError('')
              setMessage('')
            }
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="modal-close"
              onClick={() => setShowAuth(false)}
              aria-label="Close dialog"
              type="button"
            >
              ×
            </button>

            <div className="auth-brand-icon">S</div>

            <p className="eyebrow">WELCOME TO SOCIALLITE</p>

            <h2 id="auth-title">
              {mode === 'login' ? 'Welcome back.' : 'Find your people.'}
            </h2>

            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in and pick up where you left off.'
                : 'Create an account and join the conversation.'}
            </p>

            <div className="auth-tabs">
              <button
                className={
                  mode === 'login' ? 'auth-tab active-tab' : 'auth-tab'
                }
                onClick={() => switchMode('login')}
                type="button"
              >
                Log in
              </button>

              <button
                className={
                  mode === 'register' ? 'auth-tab active-tab' : 'auth-tab'
                }
                onClick={() => switchMode('register')}
                type="button"
              >
                Create account
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleInputChange}
                minLength={3}
                maxLength={50}
                autoComplete="username"
                required
              />

              {mode === 'register' && (
                <>
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                  />
                </>
              )}

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleInputChange}
                minLength={8}
                maxLength={128}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                required
              />

              {mode === 'register' && (
                <p className="password-hint">Use at least 8 characters.</p>
              )}

              <button
                className="primary-button auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Log in to SocialLite →'
                    : 'Create my account →'}
              </button>
            </form>

            <p className="auth-terms">
              By continuing, please use SocialLite respectfully and keep your
              account credentials private.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App

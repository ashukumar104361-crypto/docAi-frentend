import { useState } from 'react';

const features = [
  {
    icon: '📄',
    title: 'Upload Documents',
    description: 'Bring your documents into one simple workspace.',
    action: 'upload'
  },
  {
    icon: '✨',
    title: 'AI-Powered Insights',
    description: 'Understand important information faster with AI assistance.',
    action: 'insights'
  },
  {
    icon: '🔎',
    title: 'Find What Matters',
    description: 'Search and organize document details with confidence.',
    action: 'search'
  }
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [featureMessage, setFeatureMessage] = useState('');
  const [authMode, setAuthMode] = useState(null); // 'login', 'signup', or null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'dashboard'
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyImportant, setShowOnlyImportant] = useState(false);

  function handleFileChange(event) {
    const [file] = event.target.files;
    if (file) {
      setSelectedFile(file);
      if (isLoggedIn) {
        setUploadedFiles(prev => [...prev, {
          file, 
          id: Date.now(), 
          displayName: file.name,
          status: 'Processed',
          isImportant: false,
          date: new Date().toLocaleDateString()
        }]);
      }
    } else {
      setSelectedFile(null);
    }
  }

  function removeFile(id) {
    setUploadedFiles(prev => prev.filter(item => item.id !== id));
  }

  function editFile(id) {
    const newName = prompt('Enter a new name for this file:');
    if (newName && newName.trim() !== '') {
      setUploadedFiles(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, displayName: newName.trim() };
        }
        return item;
      }));
    }
  }

  function toggleImportant(id) {
    setUploadedFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isImportant: !item.isImportant };
      }
      return item;
    }));
  }

  function formatFileSize(fileSize) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  }

  function handleFeatureClick() {
    if (!isLoggedIn) {
      setAuthMode('login');
    } else {
      setCurrentView('dashboard');
    }
  }

  const filteredFiles = uploadedFiles.filter(item => {
    const matchesSearch = item.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImportant = showOnlyImportant ? item.isImportant : true;
    return matchesSearch && matchesImportant;
  });

  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#top" onClick={() => setCurrentView('home')} aria-label="DocSmart AI home">
          <span className="brand-mark">D</span>
          <span>DocSmart AI</span>
        </a>
        <nav aria-label="Main navigation" style={{ alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <button className="secondary-button" onClick={() => setCurrentView('home')}>Home</button>
              <button className="nav-button" onClick={() => setCurrentView('dashboard')} style={{ border: 'none', cursor: 'pointer' }}>My Dashboard</button>
              <button className="secondary-button" onClick={() => { setIsLoggedIn(false); setCurrentView('home'); }}>Log out</button>
            </>
          ) : (
            <>
              <a href="#features" className="text-button" style={{ display: 'inline-flex', alignItems: 'center' }}>Features</a>
              <a href="#how-it-works" className="text-button" style={{ display: 'inline-flex', alignItems: 'center' }}>How it works</a>
              <button className="secondary-button" onClick={() => setAuthMode('login')}>Log in</button>
            </>
          )}
        </nav>
        {!isLoggedIn && <button className="nav-button" onClick={() => setAuthMode('signup')} style={{ border: 'none', cursor: 'pointer' }}>Sign up</button>}
      </header>

      {authMode && (
        <div className="modal-backdrop" onClick={(e) => { if(e.target.className === 'modal-backdrop') setAuthMode(null) }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setAuthMode(null)} aria-label="Close modal">×</button>
            <h2>{authMode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
            <p>{authMode === 'login' ? 'Log in to access your uploaded documents.' : 'Sign up to start processing your documents.'}</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert(authMode === 'login' ? 'Login successful! (Demo)' : 'Signup successful! (Demo)'); setAuthMode(null); setIsLoggedIn(true); setCurrentView('dashboard'); }}>
              {authMode === 'signup' && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" required />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" required />
              </div>
              
              <button type="submit" className="primary-button modal-button">
                {authMode === 'login' ? 'Log in' : 'Sign up'}
              </button>
            </form>
            
            <div className="modal-switch">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main id="top">
        {isLoggedIn && currentView === 'dashboard' ? (
          <section className="dashboard-section" id="dashboard" style={{ padding: '4rem 0', width: 'min(1120px, calc(100% - 3rem))', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>My Documents</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '0.6rem', border: '1px solid #d1def5', fontSize: '0.95rem', outline: 'none', minWidth: '220px' }}
                />
                <button 
                  onClick={() => setShowOnlyImportant(!showOnlyImportant)}
                  style={{
                    padding: '0.6rem 1rem', 
                    borderRadius: '0.6rem', 
                    border: showOnlyImportant ? '1px solid #f1c40f' : '1px solid #d1def5', 
                    background: showOnlyImportant ? '#fffcf0' : '#fff',
                    color: showOnlyImportant ? '#d4a100' : '#56627a',
                    fontWeight: showOnlyImportant ? '700' : '500',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {showOnlyImportant ? '★ Important' : '☆ Important'}
                </button>
                <a 
                  href="https://www.digilocker.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="secondary-button"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    textDecoration: 'none', 
                    background: '#e8f3ee', 
                    borderColor: '#b9dfcb', 
                    color: '#217346',
                    margin: 0
                  }}
                  title="Login to DigiLocker website"
                >
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>◩</span> Login with DigiLocker
                </a>
                <label className="primary-button" style={{ cursor: 'pointer', margin: 0 }}>
                  Upload New
                  <input type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} />
                </label>
              </div>
            </div>
            
            {uploadedFiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '1rem', border: '2px dashed #e3eaf5' }}>
                <p style={{ color: '#657189', fontSize: '1.1rem', marginBottom: '1.5rem' }}>No documents uploaded yet.</p>
                <label className="nav-button" style={{ cursor: 'pointer', display: 'inline-block' }}>
                  Choose a file
                  <input type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} />
                </label>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e3eaf5' }}>
                <p style={{ color: '#657189', fontSize: '1.1rem' }}>
                  {showOnlyImportant && !searchQuery 
                    ? "No important documents found. Star (★) some files first to see them here!" 
                    : `No documents found matching "${searchQuery}".`}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredFiles.map(item => (
                  <div key={item.id} style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e3eaf5', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div style={{ width: '48px', height: '48px', background: '#eaf0ff', color: '#3157c8', borderRadius: '10px', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {item.file.name.split('.').pop().toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#172033', title: item.displayName }}>{item.displayName}</h4>
                        <span style={{ fontSize: '0.85rem', color: '#657189' }}>{formatFileSize(item.file.size)}</span>
                      </div>
                    </div>
                    {item.file.type?.startsWith('image/') && (
                      <div style={{ marginBottom: '1.2rem', height: '140px', overflow: 'hidden', borderRadius: '8px', background: '#f8faff', border: '1px solid #edf0f6' }}>
                        <img src={URL.createObjectURL(item.file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '1rem', borderTop: '1px solid #edf0f6' }}>
                      <span style={{ color: '#3c6a17', background: '#f7fff1', padding: '0.3rem 0.8rem', borderRadius: '2rem', border: '1px solid #cfe6ba', fontWeight: '600' }}>✓ {item.status}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => toggleImportant(item.id)} style={{ background: item.isImportant ? '#fffcf0' : '#f8faff', border: item.isImportant ? '1px solid #f1c40f' : '1px solid #dfe6f2', borderRadius: '0.4rem', padding: '0.3rem 0.6rem', color: item.isImportant ? '#d4a100' : '#657189', cursor: 'pointer', fontSize: '0.9rem' }} title={item.isImportant ? "Remove from Important" : "Mark as Important"}>
                          {item.isImportant ? '★' : '☆'}
                        </button>
                        <button onClick={() => editFile(item.id)} style={{ background: '#f8faff', border: '1px solid #dfe6f2', borderRadius: '0.4rem', padding: '0.3rem 0.7rem', color: '#3157c8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Rename</button>
                        <button onClick={() => removeFile(item.id)} style={{ background: '#fff0f1', border: '1px solid #ffe6e8', borderRadius: '0.4rem', padding: '0.3rem 0.7rem', color: '#cc4d59', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">INTELLIGENT DOCUMENT PROCESSING</p>
            <h1>Make every document easier to understand.</h1>
            <p className="hero-text">
              DocSmart AI will help teams organize documents and uncover useful information in less time.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#upload">Choose a document</a>
              <a className="text-button" href="#how-it-works">See how it works <span>→</span></a>
            </div>
          </div>

          <div className="document-preview" aria-label="Document preview illustration">
            <div className="preview-topbar">
              <span className="preview-dot"></span>
              <span className="preview-dot"></span>
              <span className="preview-dot"></span>
            </div>
            <div className="preview-content">
              <div className="preview-file-icon">PDF</div>
              <div className="preview-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="insight-card">
                <span className="sparkle">✦</span>
                <div>
                  <strong>Key insight found</strong>
                  <p>Important details are ready to review.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="upload-section" id="upload" aria-labelledby="upload-title">
          <div className="upload-copy">
            <p className="eyebrow">DOCUMENT UPLOAD</p>
            <h2 id="upload-title">Choose a document to get started.</h2>
            <p>Upload functionality is available in your dashboard.</p>
          </div>
          
          {!isLoggedIn ? (
            <button className="upload-box" type="button" onClick={() => setAuthMode('signup')} style={{ width: '100%', fontFamily: 'inherit' }}>
              <span className="upload-icon" aria-hidden="true">↑</span>
              <strong>Choose a file from your computer</strong>
              <span>Click here to Sign up or Log in to upload</span>
            </button>
          ) : (
            <button className="upload-box" type="button" onClick={() => setCurrentView('dashboard')} style={{ width: '100%', fontFamily: 'inherit' }}>
              <span className="upload-icon" aria-hidden="true">↑</span>
              <strong>Go to My Dashboard</strong>
              <span>Click here to upload and view your documents</span>
            </button>
          )}
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow">A CLEARER WORKFLOW</p>
            <h2>Built to keep documents simple.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <button
                className="feature-card"
                key={feature.title}
                type="button"
                onClick={() => handleFeatureClick(feature)}
              >
                <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </button>
            ))}
          </div>
          {featureMessage && <p className="feature-message" role="status">{featureMessage}</p>}
        </section>

        <section className="steps-section" id="how-it-works">
          <div>
            <p className="eyebrow">HOW IT WILL WORK</p>
            <h2>A smarter path from document to decision.</h2>
          </div>
          <ol className="steps-list">
            <li onClick={handleFeatureClick}><span>01</span> Add your document</li>
            <li onClick={handleFeatureClick}><span>02</span> Let DocSmart AI process it</li>
            <li onClick={handleFeatureClick}><span>03</span> Review useful results</li>
          </ol>
        </section>
        </>
        )}
      </main>

      <footer>DocSmart AI · Hackathon Project</footer>
    </div>
  );
}

export default App;

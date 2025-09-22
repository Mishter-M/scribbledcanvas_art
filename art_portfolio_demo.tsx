import React, { useState, useEffect } from 'react';

// Define the structure for artwork items
interface Artwork {
  id: number;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  imageUrl: string;
  createdAt: number;
}

const ArtPortfolio = () => {
  const [currentView, setCurrentView] = useState('landing');
  
  // Use typed state for artworks
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentImageData, setCurrentImageData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    dimensions: '',
    year: new Date().getFullYear().toString()
  });

  useEffect(() => {
    const sampleArtworks: Artwork[] = [
      {
        id: 1,
        title: "Neon Dreams",
        year: "2024",
        medium: "Digital Art",
        dimensions: "4K Digital",
        description: "A cyberpunk-inspired piece exploring the intersection of technology and human emotion.",
        imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000814'/%3E%3Crect x='50' y='50' width='300' height='4' fill='%23ff0080'/%3E%3Crect x='80' y='120' width='240' height='3' fill='%2300ffff'/%3E%3Crect x='60' y='190' width='280' height='5' fill='%2300ff80'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3ENeon Dreams%3C/text%3E%3C/svg%3E",
        createdAt: Date.now() - 86400000
      },
      {
        id: 2,
        title: "Midnight Aurora",
        year: "2024",
        medium: "Acrylic on Canvas",
        dimensions: "36 x 48 inches",
        description: "Abstract interpretation of northern lights dancing across a starless void.",
        imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23001219'/%3E%3Cpath d='M0 100 Q200 50 400 120 L400 160 Q200 110 0 140 Z' fill='%23ff006e' opacity='0.6'/%3E%3Cpath d='M0 140 Q200 90 400 160 L400 200 Q200 150 0 180 Z' fill='%238338ec' opacity='0.5'/%3E%3Ctext x='200' y='260' font-family='Arial' font-size='18' fill='%2300f5ff' text-anchor='middle'%3EMidnight Aurora%3C/text%3E%3C/svg%3E",
        createdAt: Date.now() - 172800000
      }
    ];
    setArtworks(sampleArtworks);
  }, []);

  const handleImageUpload = (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentImageData(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!currentImageData) {
      alert('Please select an image first!');
      return;
    }

    setUploading(true);
    
    setTimeout(() => {
      const newArtwork = {
        id: Date.now(),
        ...formData,
        imageUrl: currentImageData,
        createdAt: Date.now()
      };

      setArtworks([newArtwork, ...artworks]);
      
      setFormData({
        title: '',
        description: '',
        medium: '',
        dimensions: '',
        year: new Date().getFullYear().toString()
      });
      setCurrentImageData(null);
      setShowUploadForm(false);
      setUploading(false);
      
      alert('✨ Artwork uploaded successfully! In the real app, this would be saved to AWS S3 and DynamoDB.');
    }, 2000);
  };

  const styles = {
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
      '50%': { transform: 'translateY(-20px) rotate(180deg)' }
    },
    '@keyframes glow': {
      '0%, 100%': { textShadow: '0 0 20px #ff0080, 0 0 30px #ff0080' },
      '50%': { textShadow: '0 0 30px #00f5ff, 0 0 40px #00f5ff' }
    },
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 30px rgba(255, 0, 128, 0.3)' },
      '50%': { transform: 'scale(1.05)', boxShadow: '0 0 40px rgba(0, 245, 255, 0.5)' }
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  };

  if (currentView === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000814 0%, #001d3d 40%, #003566 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
            @keyframes glow {
              0%, 100% { text-shadow: 0 0 20px #ff0080, 0 0 30px #ff0080; }
              50% { text-shadow: 0 0 30px #00f5ff, 0 0 40px #00f5ff; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 0, 128, 0.3); }
              50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(0, 245, 255, 0.5); }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, #ff0080, #ff4081)',
          borderRadius: '50%',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, #00f5ff, #00ff80)',
          borderRadius: '50%',
          opacity: 0.15,
          animation: 'float 8s ease-in-out infinite reverse'
        }} />

        <nav style={{
          padding: '2rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            background: 'linear-gradient(45deg, #ff0080, #00f5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨ SCRIBBLED CANVAS ART
          </div>
          <button
            onClick={() => setCurrentView('portfolio')}
            style={{
              background: 'transparent',
              color: '#00f5ff',
              border: '2px solid #00f5ff',
              padding: '0.8rem 2rem',
              borderRadius: '50px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#00f5ff';
              e.target.style.color = '#000814';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#00f5ff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            View Portfolio
          </button>
        </nav>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            marginBottom: '2rem',
            background: 'linear-gradient(45deg, #ff0080, #ff4081, #8338ec, #00f5ff, #00ff80)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'glow 3s ease-in-out infinite',
            lineHeight: 1.1
          }}>
            DIGITAL
            <br />
            <span style={{ color: '#ffffff', textShadow: '0 0 30px rgba(255, 255, 255, 0.5)' }}>
              ARTISTRY
            </span>
          </h1>
          
          <p style={{
            fontSize: '1.4rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '600px',
            marginBottom: '3rem',
            lineHeight: 1.6
          }}>
            Where creativity meets technology. Experience a curated collection of 
            <span style={{ color: '#ff0080', fontWeight: 700 }}> digital masterpieces</span> and 
            <span style={{ color: '#00f5ff', fontWeight: 700 }}> contemporary art</span>.
          </p>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setCurrentView('portfolio')}
              style={{
                background: 'linear-gradient(45deg, #ff0080, #ff4081)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 3rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                animation: 'pulse 2s infinite',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              🚀 Explore Gallery
            </button>
            
            <button
              onClick={() => {
                setCurrentView('portfolio');
                setTimeout(() => setShowUploadForm(true), 500);
              }}
              style={{
                background: 'transparent',
                color: '#00f5ff',
                border: '3px solid #00f5ff',
                padding: '1.2rem 3rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#00f5ff';
                e.target.style.color = '#000814';
                e.target.style.transform = 'translateY(-5px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#00f5ff';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ➕ Add Artwork
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          padding: '4rem 3rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {[
            { icon: '🎨', title: 'Digital Canvas', desc: 'Upload and showcase your digital masterpieces' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'AWS-powered infrastructure for global reach' },
            { icon: '🌟', title: 'Modern Gallery', desc: 'Stunning presentation that captivates viewers' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.background = 'rgba(255, 0, 128, 0.1)';
              e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.3rem' }}>{feature.title}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 100%)',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <header style={{
        background: 'rgba(0, 8, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 0, 128, 0.2)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            onClick={() => setCurrentView('landing')}
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ff0080, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              backgroundColor: 'transparent'
            }}
          >
            ✨ SCRIBBLED CANVAS ART
          </button>
          
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            style={{
              background: showUploadForm 
                ? 'linear-gradient(45deg, #ff4081, #ff0080)' 
                : 'linear-gradient(45deg, #00f5ff, #00ff80)',
              color: '#000814',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: '50px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {showUploadForm ? '✕ Close' : '+ Add Artwork'}
          </button>
        </div>
      </header>

      {showUploadForm && (
        <section style={{
          background: 'rgba(0, 8, 20, 0.9)',
          backdropFilter: 'blur(30px)',
          margin: '2rem 0',
          padding: '3rem 0',
          borderTop: '1px solid rgba(255, 0, 128, 0.2)',
          borderBottom: '1px solid rgba(255, 0, 128, 0.2)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(30px)',
              padding: '3rem',
              borderRadius: '25px',
              border: '1px solid rgba(255, 0, 128, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}>
              <h2 style={{
                marginBottom: '3rem',
                textAlign: 'center',
                fontSize: '2.5rem',
                fontWeight: 900,
                background: 'linear-gradient(45deg, #ff0080, #00f5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Upload Your Masterpiece
              </h2>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#00f5ff',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Select Image *
                </label>
                <div style={{
                  border: currentImageData ? '2px solid #00f5ff' : '3px dashed #ff0080',
                  borderRadius: '20px',
                  padding: '3rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: currentImageData 
                    ? 'rgba(0, 245, 255, 0.1)' 
                    : 'linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(131, 56, 236, 0.1))'
                }} onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  // use addEventListener with cast to support DOM Event
                  input.addEventListener('change', handleImageUpload as EventListener);
                  input.click();
                }}>
                  {currentImageData ? (
                    <div>
                      <img
                        src={currentImageData}
                        alt="Preview"
                        style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                        background: 'linear-gradient(45deg, #ff0080, #8338ec)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        🎨
                      </div>
                      <h3 style={{
                        marginBottom: '1rem',
                        color: '#ffffff',
                        fontSize: '1.5rem',
                        fontWeight: 700
                      }}>
                        Drop your artwork here
                      </h3>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                        or click to select from device
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: '#00f5ff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter artwork title"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(255, 0, 128, 0.3)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: '#00f5ff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2024"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(255, 0, 128, 0.3)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: '#00f5ff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Medium
                  </label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    placeholder="Digital art, Oil, etc."
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(255, 0, 128, 0.3)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: '#00f5ff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="24 x 36 inches"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid rgba(255, 0, 128, 0.3)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#ffffff',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: '#00f5ff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell the story behind this artwork..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff',
                    transition: 'all 0.3s ease',
                    resize: 'vertical'
                  }}
                />
              </div>

              {uploading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'rgba(0, 245, 255, 0.1)',
                  borderRadius: '15px',
                  color: '#00f5ff',
                  border: '1px solid rgba(0, 245, 255, 0.3)'
                }}>
                  <div style={{
                    width: '25px',
                    height: '25px',
                    border: '3px solid rgba(0, 245, 255, 0.3)',
                    borderTop: '3px solid #00f5ff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    Uploading to AWS S3 and saving metadata to DynamoDB...
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(45deg, #ff0080, #8338ec)',
                    color: 'white',
                    border: 'none',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                    e.target.style.boxShadow = '0 15px 40px rgba(255, 0, 128, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🚀 Upload to AWS
                </button>
              }
            </div>
          </div>
        </section>
      )}

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        {artworks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '25px',
            border: '1px solid rgba(255, 0, 128, 0.2)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🎨</div>
            <h2 style={{
              marginBottom: '1rem',
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #ff0080, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Your Digital Gallery Awaits
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem'
            }}>
              Start by uploading your first masterpiece to begin your artistic journey
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '3rem'
          }}>
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 0, 128, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.border = '1px solid rgba(0, 245, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  height: '350px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 8, 20, 0.8) 100%)'
                  }} />
                </div>
                
                <div style={{ padding: '2rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.6rem',
                      margin: 0,
                      color: '#ffffff',
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #ffffff, #00f5ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {artwork.title}
                    </h3>
                    {artwork.year && (
                      <span style={{
                        color: '#ff0080',
                        fontWeight: 700,
                        fontSize: '1rem',
                        padding: '0.3rem 0.8rem',
                        background: 'rgba(255, 0, 128, 0.1)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 0, 128, 0.3)'
                      }}>
                        {artwork.year}
                      </span>
                    )}
                  </div>
                  
                  {artwork.medium && (
                    <p style={{
                      color: '#00f5ff',
                      marginBottom: '0.8rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      fontStyle: 'italic'
                    }}>
                      {artwork.medium}
                    </p>
                  )}
                  
                  {artwork.dimensions && (
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '1rem',
                      fontSize: '0.95rem'
                    }}>
                      📐 {artwork.dimensions}
                    </p>
                  )}
                  
                  {artwork.description && (
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                      fontSize: '1rem'
                    }}>
                      {artwork.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtPortfolio;
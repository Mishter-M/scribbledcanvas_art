// Editable artwork gallery component with scroll behavior
import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

interface Artwork {
  id: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  featured?: boolean;
}

const defaultArtworks: Artwork[] = [
  {
    id: '1',
    title: "Neon Dreams",
    year: "2024",
    medium: "Digital Art",
    dimensions: "4K Digital",
    description: "A cyberpunk-inspired piece exploring the intersection of technology and human emotion.",
    imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000814'/%3E%3Crect x='50' y='50' width='300' height='4' fill='%23ff0080'/%3E%3Crect x='80' y='120' width='240' height='3' fill='%2300ffff'/%3E%3Crect x='60' y='190' width='280' height='5' fill='%2300ff80'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3ENeon Dreams%3C/text%3E%3C/svg%3E",
    createdAt: Date.now() - 86400000,
    featured: true
  },
  {
    id: '2',
    title: "Midnight Aurora",
    year: "2024",
    medium: "Acrylic on Canvas",
    dimensions: "36 x 48 inches",
    description: "Abstract interpretation of northern lights dancing across a starless void.",
    imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23001219'/%3E%3Cpath d='M0 100 Q200 50 400 120 L400 160 Q200 110 0 140 Z' fill='%23ff006e' opacity='0.6'/%3E%3Cpath d='M0 140 Q200 90 400 160 L400 200 Q200 150 0 180 Z' fill='%238338ec' opacity='0.5'/%3E%3Ctext x='200' y='260' font-family='Arial' font-size='18' fill='%2300f5ff' text-anchor='middle'%3EMidnight Aurora%3C/text%3E%3C/svg%3E",
    createdAt: Date.now() - 172800000,
    featured: true
  },
  {
    id: '3',
    title: "Digital Solitude",
    year: "2023",
    medium: "Mixed Media Digital",
    dimensions: "3000 x 4000 px",
    description: "Exploring themes of isolation in the digital age through abstract forms and vibrant colors.",
    imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23001122'/%3E%3Ccircle cx='200' cy='150' r='80' fill='%23ff4081' opacity='0.7'/%3E%3Crect x='150' y='100' width='100' height='100' fill='%2300f5ff' opacity='0.5' transform='rotate(45 200 150)'/%3E%3Ctext x='200' y='280' font-family='Arial' font-size='16' fill='%23ffffff' text-anchor='middle'%3EDigital Solitude%3C/text%3E%3C/svg%3E",
    createdAt: Date.now() - 259200000
  },
  {
    id: '4',
    title: "Quantum Fragments",
    year: "2023",
    medium: "Digital Collage",
    dimensions: "2400 x 3600 px",
    description: "A visual representation of quantum mechanics through fragmented digital imagery.",
    imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' viewBox='0 0 400 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000011'/%3E%3Cpolygon points='100,50 150,100 100,150 50,100' fill='%2300ff80' opacity='0.8'/%3E%3Cpolygon points='300,80 350,130 300,180 250,130' fill='%23ff0080' opacity='0.7'/%3E%3Cpolygon points='200,120 250,170 200,220 150,170' fill='%238338ec' opacity='0.6'/%3E%3Ctext x='200' y='280' font-family='Arial' font-size='14' fill='%23ffffff' text-anchor='middle'%3EQuantum Fragments%3C/text%3E%3C/svg%3E",
    createdAt: Date.now() - 345600000
  }
];

interface EditableArtworkGalleryProps {
  onArtworkChange?: (artworks: Artwork[]) => void;
}

const EditableArtworkGallery: React.FC<EditableArtworkGalleryProps> = ({ onArtworkChange }) => {
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { canEdit, checkPermission } = useAdmin();

  // Load artworks from localStorage on mount
  useEffect(() => {
    const savedArtworks = localStorage.getItem('scribbledcanvas_artworks');
    if (savedArtworks) {
      try {
        const parsed = JSON.parse(savedArtworks);
        setArtworks(parsed);
      } catch (error) {
        console.error('Error parsing saved artworks:', error);
      }
    }
  }, []);

  const saveArtworks = (newArtworks: Artwork[]) => {
    setArtworks(newArtworks);
    localStorage.setItem('scribbledcanvas_artworks', JSON.stringify(newArtworks));
    onArtworkChange?.(newArtworks);
  };

  const handleAddArtwork = () => {
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      title: '',
      year: new Date().getFullYear().toString(),
      medium: '',
      dimensions: '',
      description: '',
      imageUrl: '',
      createdAt: Date.now()
    };
    setEditingArtwork(newArtwork);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork({ ...artwork });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleDeleteArtwork = (id: string) => {
    if (confirm('Are you sure you want to delete this artwork?')) {
      const newArtworks = artworks.filter(a => a.id !== id);
      saveArtworks(newArtworks);
    }
  };

  const handleSaveArtwork = () => {
    if (!editingArtwork) return;

    if (isAddingNew) {
      const newArtworks = [editingArtwork, ...artworks];
      saveArtworks(newArtworks);
    } else {
      const newArtworks = artworks.map(a => 
        a.id === editingArtwork.id ? editingArtwork : a
      );
      saveArtworks(newArtworks);
    }

    setIsEditing(false);
    setEditingArtwork(null);
    setIsAddingNew(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingArtwork) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditingArtwork({
        ...editingArtwork,
        imageUrl: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleFeatured = (id: string) => {
    const newArtworks = artworks.map(artwork => 
      artwork.id === id 
        ? { ...artwork, featured: !artwork.featured }
        : artwork
    );
    saveArtworks(newArtworks);
  };

  return (
    <section id="artwork-gallery" style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
      padding: '4rem 2rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4rem',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #ffd700, #ffb347, #daa520)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Featured Artworks
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem',
              maxWidth: '600px'
            }}>
              Explore a curated collection of digital masterpieces and contemporary art pieces.
            </p>
          </div>

          {canEdit && checkPermission('edit_artworks') && (
            <button
              onClick={handleAddArtwork}
              style={{
                background: 'linear-gradient(45deg, #ffd700, #daa520)',
                color: '#000000',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ➕ Add Artwork
            </button>
          )}
        </div>

        {/* Artwork Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '3rem'
        }}>
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(30px)',
                borderRadius: '25px',
                overflow: 'hidden',
                border: artwork.featured 
                  ? '2px solid rgba(255, 215, 0, 0.5)' 
                  : '1px solid rgba(255, 215, 0, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Featured badge */}
              {artwork.featured && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#000',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  zIndex: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  ⭐ Featured
                </div>
              )}

              {/* Edit controls for authorized users */}
              {canEdit && checkPermission('edit_artworks') && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  zIndex: 10
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditArtwork(artwork);
                    }}
                    style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      border: '1px solid rgba(255, 215, 0, 0.5)',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      color: '#ffd700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit artwork"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeatured(artwork.id);
                    }}
                    style={{
                      background: artwork.featured 
                        ? 'rgba(255, 215, 0, 0.2)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: artwork.featured 
                        ? '1px solid rgba(255, 215, 0, 0.5)' 
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      color: artwork.featured ? '#FFD700' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={artwork.featured ? "Remove from featured" : "Add to featured"}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteArtwork(artwork.id);
                    }}
                    style={{
                      background: 'rgba(255, 0, 128, 0.2)',
                      border: '1px solid rgba(255, 0, 128, 0.5)',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      color: '#ff0080',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete artwork"
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* Artwork Image */}
              <div style={{
                height: '300px',
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
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
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

              {/* Artwork Info */}
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
                    fontWeight: 800
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

        {/* Empty state */}
        {artworks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '25px',
            border: '1px solid rgba(255, 0, 128, 0.2)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🎨</div>
            <h3 style={{
              marginBottom: '1rem',
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #ff0080, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              No Artworks Yet
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem'
            }}>
              Start building your digital gallery by adding your first artwork
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && editingArtwork && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 8, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(30px)',
            padding: '3rem',
            borderRadius: '25px',
            border: '1px solid rgba(255, 0, 128, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              marginBottom: '2rem',
              fontSize: '2rem',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ff0080, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {isAddingNew ? 'Add New Artwork' : 'Edit Artwork'}
            </h2>

            {/* Form fields */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{ display: 'block', color: '#00f5ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={editingArtwork.title}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#00f5ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Year
                </label>
                <input
                  type="text"
                  value={editingArtwork.year}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, year: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#00f5ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Medium
                </label>
                <input
                  type="text"
                  value={editingArtwork.medium}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, medium: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#00f5ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Dimensions
                </label>
                <input
                  type="text"
                  value={editingArtwork.dimensions}
                  onChange={(e) => setEditingArtwork({ ...editingArtwork, dimensions: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#00f5ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                Description
              </label>
              <textarea
                value={editingArtwork.description}
                onChange={(e) => setEditingArtwork({ ...editingArtwork, description: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid rgba(255, 0, 128, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#00f5ff', marginBottom: '0.5rem', fontWeight: 600 }}>
                Artwork Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid rgba(255, 0, 128, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
              {editingArtwork.imageUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={editingArtwork.imageUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <input
                type="checkbox"
                id="featured"
                checked={editingArtwork.featured || false}
                onChange={(e) => setEditingArtwork({ ...editingArtwork, featured: e.target.checked })}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="featured" style={{ color: '#00f5ff', fontWeight: 600 }}>
                Featured Artwork
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingArtwork(null);
                  setIsAddingNew(false);
                }}
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveArtwork}
                disabled={!editingArtwork.title || !editingArtwork.imageUrl}
                style={{
                  background: 'linear-gradient(45deg, #ff0080, #8338ec)',
                  border: 'none',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  cursor: editingArtwork.title && editingArtwork.imageUrl ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  opacity: editingArtwork.title && editingArtwork.imageUrl ? 1 : 0.5
                }}
              >
                {isAddingNew ? 'Add' : 'Save'} Artwork
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default EditableArtworkGallery;

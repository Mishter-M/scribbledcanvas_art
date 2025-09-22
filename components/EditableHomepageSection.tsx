// Editable homepage section component
import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { contentAPI, HomepageContent as APIHomepageContent } from '../lib/contentAPI';

interface HomepageContent {
  artistName: string;
  artistTitle: string;
  artistBio: string;
  artistStatement: string;
  backgroundImage: string;
}

const defaultContent: HomepageContent = {
  artistName: "Kalyani Kaleru",
  artistTitle: "Mother • Wife • Artist",
  artistBio: "Kalyani Kaleru is a multifaceted artist who weaves the threads of motherhood, partnership, and creativity into extraordinary visual narratives. Balancing her roles as a devoted mother and supportive wife while pursuing her artistic passion, she creates art that speaks to the soul of every woman who dares to dream beyond conventional boundaries. Her work captures the delicate dance between responsibility and self-expression, transforming everyday moments into profound artistic statements.",
  artistStatement: "Art is my sanctuary, my voice, and my rebellion against the ordinary. As a mother and wife, I find inspiration in the quiet moments between chaos—the golden hour light streaming through a window while my child sleeps, the thoughtful pause in conversation with my partner, the stolen moments of creative solitude. My canvases become windows to the inner world of a woman who refuses to be defined by just one role. Each stroke tells a story of balance, each color represents a facet of my identity, and every piece is a testament to the power of pursuing your passion despite life's beautiful complexities.",
  backgroundImage: ""
};

// Static theme colors - Black and Golden Chrome
const THEME_COLORS = {
  primary: "#ffd700",      // Gold
  secondary: "#ffb347",    // Light gold/orange
  accent: "#daa520",       // Dark gold
  dark: "#000000",         // Black
  darkAlt: "#1a1a1a"      // Dark gray
};

interface EditableHomepageSectionProps {
  onContentChange?: (content: HomepageContent) => void;
  showEditButton?: boolean; // Add optional showEditButton prop to control display of the edit button
}

const EditableHomepageSection: React.FC<EditableHomepageSectionProps> = ({ onContentChange, showEditButton = true }) => {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<HomepageContent>(defaultContent);
  const { canEdit, checkPermission } = useAdmin();

  // Helper function to ensure text is visible against dark backgrounds
  const getContrastColor = (color: string, fallback: string = '#ffffff') => {
    // For dark cosmic background, we want to ensure text is always visible
    // Use white or light colors for better contrast
    return fallback;
  };

  // Load content from API or localStorage on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const apiContent = await contentAPI.getHomepageContent();
        if (apiContent) {
          setContent(apiContent);
          setEditContent(apiContent);
        } else {
          // Fallback to localStorage if API fails
          const savedContent = localStorage.getItem('scribbledcanvas_homepage_content');
          if (savedContent) {
            const parsed = JSON.parse(savedContent);
            setContent(parsed);
            setEditContent(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to localStorage
        const savedContent = localStorage.getItem('scribbledcanvas_homepage_content');
        if (savedContent) {
          try {
            const parsed = JSON.parse(savedContent);
            setContent(parsed);
            setEditContent(parsed);
          } catch (parseError) {
            console.error('Error parsing saved content:', parseError);
          }
        }
      }
    };

    loadContent();
  }, []);

  const handleSave = async () => {
    try {
      // Save to API (with localStorage fallback built-in)
      const success = await contentAPI.saveHomepageContent(editContent);
      
      // Update local state
      setContent(editContent);
      setIsEditing(false);
      onContentChange?.(editContent);
      
      if (success) {
        console.log('Content saved to backend successfully');
      } else {
        console.warn('Content saved to localStorage only - backend unavailable');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      // Still update local state even if save fails
      setContent(editContent);
      localStorage.setItem('scribbledcanvas_homepage_content', JSON.stringify(editContent));
      setIsEditing(false);
      onContentChange?.(editContent);
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditContent({
        ...editContent,
        backgroundImage: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const customBackground = content.backgroundImage 
    ? { backgroundImage: `url(${content.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, #000000 0%, #0a0a0a 30%, #1a1a1a 70%, #2a2a2a 100%)` };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes morph {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            25% { border-radius: 50% 50% 80% 20% / 60% 40% 60% 40%; }
            50% { border-radius: 80% 20% 50% 50% / 40% 60% 40% 60%; }
            75% { border-radius: 20% 80% 30% 70% / 70% 30% 70% 30%; }
          }
          .text-transition {
            transition: color 0.3s ease, text-shadow 0.3s ease, filter 0.3s ease;
          }
          .bg-transition {
            transition: background 0.3s ease, border-color 0.3s ease;
          }
        `}
      </style>
      <section style={{
        minHeight: '100vh',
        ...customBackground,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 2rem',
        overflow: 'hidden'
      }}>
      {/* Overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: content.backgroundImage 
          ? 'rgba(0, 0, 0, 0.7)' 
          : 'rgba(0, 0, 0, 0.2)',
        backdropFilter: content.backgroundImage ? 'blur(2px)' : 'none'
      }} />

      {/* Edit button for authorized users */}
      {canEdit && checkPermission('edit_homepage') && showEditButton && (
        <button
          onClick={() => setIsEditing(true)}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            background: 'rgba(255, 0, 128, 0.2)',
            border: '2px solid rgba(255, 0, 128, 0.5)',
            borderRadius: '50px',
            color: '#ff0080',
            padding: '0.8rem 1.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            zIndex: 10,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 128, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ✏️ Edit Page
        </button>
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Artist Info */}
          <div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              marginBottom: '1rem',
              background: `linear-gradient(45deg, ${THEME_COLORS.primary}, ${THEME_COLORS.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
              filter: 'brightness(1.3) contrast(1.2)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              {content.artistName}
            </h1>
            
            <h2 className="text-transition" style={{
              fontSize: '1.4rem',
              color: THEME_COLORS.accent,
              marginBottom: '2rem',
              fontWeight: 600,
              letterSpacing: '1px',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
              filter: 'brightness(1.2) contrast(1.1)'
            }}>
              {content.artistTitle}
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: '#ffffff',
              lineHeight: 1.6,
              marginBottom: '2rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
            }}>
              {content.artistBio}
            </p>

            <div className="bg-transition" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              padding: '2rem',
              borderRadius: '20px',
              border: `1px solid ${THEME_COLORS.primary}60`,
              borderLeft: `4px solid ${THEME_COLORS.primary}`
            }}>
              <h3 style={{
                color: THEME_COLORS.secondary,
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: 700,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
              }}>
                Artist Statement
              </h3>
              <p style={{
                color: '#f0f0f0',
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '2rem',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
              }}>
                "{content.artistStatement}"
              </p>
              
              <button
                onClick={() => {
                  const galleryElement = document.getElementById('artwork-gallery');
                  if (galleryElement) {
                    galleryElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: THEME_COLORS.primary,
                  border: `2px solid ${THEME_COLORS.primary}`,
                  padding: '0.8rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '1rem',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = THEME_COLORS.primary;
                  target.style.color = '#000000';
                  target.style.transform = 'translateY(-2px)';
                  target.style.textShadow = 'none';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'rgba(0, 0, 0, 0.3)';
                  target.style.color = THEME_COLORS.primary;
                  target.style.transform = 'translateY(0)';
                  target.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.7)';
                }}
              >
                ✨ View My Gallery
              </button>
            </div>
          </div>

          {/* Visual Element */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '400px',
              height: '400px',
              background: `linear-gradient(45deg, ${THEME_COLORS.primary}20, ${THEME_COLORS.secondary}20, ${THEME_COLORS.accent}20)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <div style={{
                width: '300px',
                height: '300px',
                background: `linear-gradient(135deg, ${THEME_COLORS.primary}, ${THEME_COLORS.secondary})`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                animation: 'morph 8s ease-in-out infinite'
              }} />
              
              {/* Abstract shapes */}
              <div style={{
                position: 'absolute',
                top: '20%',
                right: '15%',
                width: '60px',
                height: '60px',
                background: THEME_COLORS.accent,
                borderRadius: '50%',
                opacity: 0.7,
                animation: 'float 4s ease-in-out infinite reverse'
              }} />
              
              <div style={{
                position: 'absolute',
                bottom: '25%',
                left: '10%',
                width: '40px',
                height: '40px',
                background: THEME_COLORS.secondary,
                transform: 'rotate(45deg)',
                opacity: 0.8,
                animation: 'float 5s ease-in-out infinite'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 215, 0, 0.05)',
            backdropFilter: 'blur(30px)',
            padding: '3rem',
            borderRadius: '25px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
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
              background: 'linear-gradient(45deg, #ffd700, #ffb347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Edit Homepage Content
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{ display: 'block', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Artist Name
                </label>
                <input
                  type="text"
                  value={editContent.artistName}
                  onChange={(e) => setEditContent({ ...editContent, artistName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Artist Title
                </label>
                <input
                  type="text"
                  value={editContent.artistTitle}
                  onChange={(e) => setEditContent({ ...editContent, artistTitle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 600 }}>
                Artist Bio
              </label>
              <textarea
                value={editContent.artistBio}
                onChange={(e) => setEditContent({ ...editContent, artistBio: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 600 }}>
                Artist Statement
              </label>
              <textarea
                value={editContent.artistStatement}
                onChange={(e) => setEditContent({ ...editContent, artistStatement: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: '#ffd700', marginBottom: '0.5rem', fontWeight: 600 }}>
                Background Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
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
                onClick={handleSave}
                style={{
                  background: 'linear-gradient(45deg, #ff0080, #8338ec)',
                  border: 'none',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes morph {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
            50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
            75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
          }
        `}
      </style>
    </section>
    </>
  );
};

export default EditableHomepageSection;

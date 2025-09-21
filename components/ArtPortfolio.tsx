'use client';

import React, { useState } from 'react';
import { AdminProvider } from './AdminContext';
import EditableHomepageSection from './EditableHomepageSection';
import EditableArtworkGallery from './EditableArtworkGallery';

const ArtPortfolio: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'portfolio'>('home');

  const scrollToGallery = () => {
    const galleryElement = document.getElementById('artwork-gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AdminProvider>
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        
        {currentView === 'home' ? (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 30%, #1a1a1a 70%, #2a2a2a 100%)',
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
                  0%, 100% { text-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700; }
                  50% { text-shadow: 0 0 30px #ffb347, 0 0 40px #ffb347; }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
                  50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255, 179, 71, 0.5); }
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>

            {/* Floating animations */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(45deg, #ffd700, #ffb347)',
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
              background: 'linear-gradient(45deg, #daa520, #b8860b)',
              borderRadius: '50%',
              opacity: 0.15,
              animation: 'float 8s ease-in-out infinite reverse'
            }} />

            {/* Navigation */}
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
                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ✨ SCRIBBLED CANVAS ART
              </div>
              <button
                onClick={scrollToGallery}
                style={{
                  background: 'transparent',
                  color: '#ffd700',
                  border: '2px solid #ffd700',
                  padding: '0.8rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = '#ffd700';
                  target.style.color = '#000000';
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'transparent';
                  target.style.color = '#ffd700';
                  target.style.transform = 'translateY(0)';
                }}
              >
                View Gallery
              </button>
            </nav>

            {/* Hero Section */}
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
              <EditableHomepageSection />
            </div>

            {/* Features Section */}
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
                  e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
                  e.currentTarget.style.border = '1px solid rgba(255, 215, 0, 0.3)';
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

            {/* Artwork Gallery Section */}
            <div id="artwork-gallery">
              <EditableArtworkGallery />
            </div>

            {/* Footer with discrete admin access */}
            <footer style={{
              borderTop: '1px solid rgba(255, 215, 0, 0.2)',
              padding: '3rem 2rem 2rem',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  ✨ SCRIBBLED CANVAS ART
                </div>
                <p style={{
                  color: 'rgba(255, 215, 0, 0.6)',
                  marginBottom: '2rem',
                  fontSize: '0.9rem'
                }}>
                  © 2025 Scribbled Canvas Art Gallery. All rights reserved.
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  flexWrap: 'wrap'
                }}>
                  <a
                    href="#"
                    style={{
                      color: 'rgba(255, 215, 0, 0.4)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.8)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.4)'}
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    style={{
                      color: 'rgba(255, 215, 0, 0.4)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.8)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.4)'}
                  >
                    Terms of Service
                  </a>
                  <a
                    href="/admin"
                    style={{
                      color: 'rgba(255, 215, 0, 0.2)',
                      textDecoration: 'none',
                      fontSize: '0.7rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.6)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.2)'}
                  >
                    Admin
                  </a>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000814 0%, #001d3d 40%, #003566 100%)',
            padding: '2rem'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem'
              }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0
                }}>
                  Art Portfolio
                </h1>
                <button
                  onClick={() => setCurrentView('home')}
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
                >
                  ← Back to Home
                </button>
              </div>
              
              <EditableArtworkGallery />
            </div>
          </div>
        )}
      </div>
    </AdminProvider>
  );
};

export default ArtPortfolio;

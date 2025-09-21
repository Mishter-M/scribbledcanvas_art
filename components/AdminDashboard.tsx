'use client';

import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import LoginModal from './LoginModal';
import EditableHomepageSection from './EditableHomepageSection';
import EditableArtworkGallery from './EditableArtworkGallery';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, isAdmin, canEdit } = useAdmin();
  const [showLoginModal, setShowLoginModal] = useState(!currentUser);
  const [activeTab, setActiveTab] = useState<'homepage' | 'artworks' | 'analytics'>('homepage');

  // Redirect if not logged in
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif"
      }}>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
        <div style={{
          background: 'rgba(255, 215, 0, 0.05)',
          backdropFilter: 'blur(20px)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          maxWidth: '500px'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>🔐</div>
          <h1 style={{
            color: '#ffd700',
            fontSize: '2rem',
            marginBottom: '1rem',
            fontWeight: 700
          }}>
            Admin Access Required
          </h1>
          <p style={{
            color: 'rgba(255, 215, 0, 0.7)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            This page is restricted to administrators and editors only. Please log in with your credentials.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              background: 'linear-gradient(45deg, #ffd700, #ffb347)',
              color: '#000000',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-2px) scale(1.05)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0) scale(1)';
            }}
          >
            🔑 Admin Login
          </button>
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 215, 0, 0.02)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 215, 0, 0.1)'
          }}>
            <p style={{ color: 'rgba(255, 215, 0, 0.5)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Demo Credentials:
            </p>
            <p style={{ color: '#ffd700', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
              Admin: admin@scribbledcanvas.com / admin123
            </p>
            <p style={{ color: '#ffb347', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
              Editor: editor@scribbledcanvas.com / editor123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #1a1a1a 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Admin Header */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ffd700, #ffb347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ✨ SCRIBBLED CANVAS ART ADMIN
            </div>
            <div style={{
              background: currentUser.role === 'admin' ? 'linear-gradient(45deg, #ffd700, #ffb347)' : '#daa520',
              color: '#000000',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              {currentUser.role}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'rgba(255, 215, 0, 0.7)' }}>
              Welcome, {currentUser.name}
            </span>
            <button
              onClick={() => window.open('/', '_blank')}
              style={{
                background: 'transparent',
                color: '#ffd700',
                border: '1px solid #ffd700',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              >
                View Site
              </button>
              <button
                onClick={logout}
                style={{
                  background: 'linear-gradient(45deg, #ffd700, #ffb347)',  /* Gold gradient button */
                  color: '#000000',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                >
                Logout
              </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        background: '#1a1a1a',  /* Dark background for tabs */
        borderBottom: '1px solid #ffd700',  /* Gold border bottom */
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { id: 'homepage', label: 'Homepage Content', icon: '🏠' },
            { id: 'artworks', label: 'Artwork Gallery', icon: '🎨' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(45deg, #ffd700, #ffb347)' : 'transparent',
                color: activeTab === tab.id ? '#000000' : '#ffd700',
                border: activeTab === tab.id ? 'none' : 'none',
                padding: '1rem 2rem',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderBottom: activeTab === tab.id ? '2px solid #ffb347' : '2px solid transparent'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {activeTab === 'homepage' && (
          <div>
            <div style={{
              background: 'rgba(255, 215, 0, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 215, 0, 0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                color: '#ffd700',
                fontSize: '1.8rem',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                🏠 Homepage Content Management
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '2rem',
                lineHeight: 1.6
              }}>
                Customize the artist information, background images, and color themes for the homepage.
              </p>
            </div>
            <EditableHomepageSection />
          </div>
        )}

        {activeTab === 'artworks' && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                color: '#ffffff',
                fontSize: '1.8rem',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                🎨 Artwork Gallery Management
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '2rem',
                lineHeight: 1.6
              }}>
                Add, edit, delete, and manage featured artworks in the gallery.
              </p>
            </div>
            <EditableArtworkGallery />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
            <h2 style={{
              color: '#ffffff',
              fontSize: '2rem',
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Analytics Dashboard
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '2rem',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              View website statistics, visitor analytics, and artwork performance metrics. This feature will be integrated with AWS CloudWatch and analytics services.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {[
                { label: 'Total Visitors', value: '12,543', icon: '👥' },
                { label: 'Artworks Views', value: '8,921', icon: '👁️' },
                { label: 'Featured Clicks', value: '2,134', icon: '⭐' },
                { label: 'Admin Logins', value: '43', icon: '🔐' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{
                    color: '#00f5ff',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    marginBottom: '0.3rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.9rem'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

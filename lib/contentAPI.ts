// Content API service for backend integration
export interface HomepageContent {
  artistName: string;
  artistTitle: string;
  artistBio: string;
  artistStatement: string;
  backgroundImage: string;
}

export interface ArtworkItem {
  id: string;
  title: string;
  description: string;
  medium: string;
  dimensions: string;
  year: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
}

// Get API endpoint from environment or use a default
const getAPIEndpoint = (): string => {
  // In production, this will be set by CloudFormation outputs
  if (typeof window !== 'undefined') {
    // Check if API endpoint is embedded in the page (for static exports)
    const metaTag = document.querySelector('meta[name="api-endpoint"]');
    if (metaTag) {
      return metaTag.getAttribute('content') || '';
    }
  }
  
  // Fallback to environment variable or default
  return process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.scribbledcanvas.com';
};

class ContentAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = getAPIEndpoint();
  }

  // Homepage content methods
  async getHomepageContent(): Promise<HomepageContent | null> {
    try {
      const response = await fetch(`${this.baseURL}/content/homepage`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch homepage content from API, using localStorage fallback');
        return this.getLocalHomepageContent();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
      return this.getLocalHomepageContent();
    }
  }

  async saveHomepageContent(content: HomepageContent): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/content/homepage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        console.warn('Failed to save to API, saving to localStorage');
        this.saveLocalHomepageContent(content);
        return false;
      }

      const result = await response.json();
      
      // Also save to localStorage as backup
      this.saveLocalHomepageContent(content);
      
      return result.success;
    } catch (error) {
      console.warn('API unavailable, saving to localStorage only:', error);
      this.saveLocalHomepageContent(content);
      return false;
    }
  }

  // Artwork methods
  async getArtworks(): Promise<ArtworkItem[]> {
    try {
      const response = await fetch(`${this.baseURL}/content/artworks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch artworks from API, using localStorage fallback');
        return this.getLocalArtworks();
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error);
      return this.getLocalArtworks();
    }
  }

  async saveArtworks(artworks: ArtworkItem[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/content/artworks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artworks),
      });

      if (!response.ok) {
        console.warn('Failed to save artworks to API, saving to localStorage');
        this.saveLocalArtworks(artworks);
        return false;
      }

      const result = await response.json();
      
      // Also save to localStorage as backup
      this.saveLocalArtworks(artworks);
      
      return result.success;
    } catch (error) {
      console.warn('API unavailable, saving to localStorage only:', error);
      this.saveLocalArtworks(artworks);
      return false;
    }
  }

  // Local storage fallback methods
  private getLocalHomepageContent(): HomepageContent | null {
    if (typeof window === 'undefined') return null;
    
    const saved = localStorage.getItem('scribbledcanvas_homepage_content');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved homepage content:', error);
      }
    }
    return null;
  }

  private saveLocalHomepageContent(content: HomepageContent): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('scribbledcanvas_homepage_content', JSON.stringify(content));
  }

  private getLocalArtworks(): ArtworkItem[] {
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem('scribbledcanvas_artworks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved artworks:', error);
      }
    }
    return [];
  }

  private saveLocalArtworks(artworks: ArtworkItem[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('scribbledcanvas_artworks', JSON.stringify(artworks));
  }

  // Health check method
  async checkAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/content/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const contentAPI = new ContentAPI();
export default contentAPI;

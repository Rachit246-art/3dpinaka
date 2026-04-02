export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/fallback.png';
    
    // 1. Return immediately if it's already an absolute URL
    if (imagePath.startsWith('http')) return imagePath;
    
    const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, "");
    
    // 2. Handle /uploads/ and /images/ paths (standard formats)
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('/images')) {
        return `${BASE_URL}${imagePath}`;
    }
    
    // 3. Handle 'uploads/...' and 'images/...' (without leading slash)
    if (imagePath.startsWith('uploads/') || imagePath.startsWith('images/')) {
        return `${BASE_URL}/${imagePath}`;
    }
    
    // 4. Legacy/Filename-only: fallback to /uploads/
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${BASE_URL}/uploads/${cleanPath}`;
};


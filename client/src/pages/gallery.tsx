import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Heart, Share2, Calendar, MapPin } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo, useCallback } from "react";

// Organized gallery data structure for easy admin dashboard integration
const GALLERY_CATEGORIES = {
  residential: {
    title: "Residential Interiors",
    description: "Elegant homes designed for modern living",
    slug: "residential"
  },
  commercial: {
    title: "Commercial Spaces", 
    description: "Professional environments that inspire productivity",
    slug: "commercial"
  },
  furniture: {
    title: "Custom Furniture",
    description: "Handcrafted pieces that blend artistry with functionality",
    slug: "furniture"
  }
} as const;

type CategorySlug = keyof typeof GALLERY_CATEGORIES;

const Gallery = () => {
  const { category } = useParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(
    (category && category in GALLERY_CATEGORIES) ? category as CategorySlug : 'all'
  );
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});

  // Comprehensive gallery items organized by category for admin management
  const galleryItems = [
    // Residential Projects
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Modern Living Room",
      category: "residential",
      subcategory: "Living Rooms",
      description: "Elegant living space with sophisticated furniture and lighting",
      projectDate: "2024",
      location: "Kigali, Rwanda",
      featured: true
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Luxury Bedroom Suite",
      category: "residential", 
      subcategory: "Bedrooms",
      description: "Tranquil bedroom with premium finishes and custom furniture",
      projectDate: "2024",
      location: "Nyarutarama, Kigali",
      featured: false
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Contemporary Kitchen",
      category: "residential",
      subcategory: "Kitchens",
      description: "State-of-the-art kitchen design with luxury appliances",
      projectDate: "2023",
      location: "Kimihurura, Kigali",
      featured: true
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Dining Room Elegance",
      category: "residential",
      subcategory: "Dining Rooms",
      description: "Sophisticated dining space for entertaining guests",
      projectDate: "2023",
      location: "Gacuriro, Kigali",
      featured: false
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Master Bathroom",
      category: "residential",
      subcategory: "Bathrooms",
      description: "Spa-like bathroom retreat with marble finishes",
      projectDate: "2024",
      location: "Kacyiru, Kigali",
      featured: false
    },
    
    // Commercial Projects
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Executive Office",
      category: "commercial",
      subcategory: "Offices",
      description: "Professional workspace with modern aesthetic and premium finishes",
      projectDate: "2024",
      location: "City Center, Kigali",
      featured: true
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Restaurant Interior",
      category: "commercial",
      subcategory: "Restaurants",
      description: "Upscale dining establishment with custom lighting and seating",
      projectDate: "2023",
      location: "Remera, Kigali",
      featured: false
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Hotel Lobby Design",
      category: "commercial",
      subcategory: "Hotels",
      description: "Luxurious hotel entrance with artistic elements and welcoming atmosphere",
      projectDate: "2023",
      location: "Nyarugenge, Kigali",
      featured: true
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Spa Retreat",
      category: "commercial",
      subcategory: "Wellness",
      description: "Serene spa environment with natural materials and calming design",
      projectDate: "2024",
      location: "Gasabo, Kigali",
      featured: false
    },
    
    // Custom Furniture Projects
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Custom Dining Set",
      category: "furniture",
      subcategory: "Dining Furniture",
      description: "Handcrafted dining table and chairs with African-inspired design",
      projectDate: "2024",
      location: "Workshop, Kigali",
      featured: true
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Executive Desk Collection",
      category: "furniture",
      subcategory: "Office Furniture",
      description: "Premium office furniture with contemporary design and functionality",
      projectDate: "2023",
      location: "Workshop, Kigali",
      featured: false
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Living Room Suite",
      category: "furniture",
      subcategory: "Living Room Furniture",
      description: "Comfortable and stylish sofa set with matching coffee table",
      projectDate: "2024",
      location: "Workshop, Kigali",
      featured: true
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Custom Wardrobes",
      category: "furniture",
      subcategory: "Storage Solutions",
      description: "Bespoke bedroom storage with optimized space utilization",
      projectDate: "2023",
      location: "Workshop, Kigali",
      featured: false
    }
  ];

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  // Get current category info
  const currentCategoryInfo = selectedCategory !== 'all' 
    ? GALLERY_CATEGORIES[selectedCategory] 
    : { title: "Complete Portfolio", description: "Explore our full range of interior design projects" };

  // Lightbox navigation functions
  const openLightbox = useCallback((imageId: number) => {
    setSelectedImage(imageId);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      nextIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredItems[nextIndex].id);
  }, [filteredItems, selectedImage]);

  const toggleLike = useCallback((imageId: number) => {
    setIsLiked(prev => ({ ...prev, [imageId]: !prev[imageId] }));
  }, []);

  const selectedImageData = selectedImage ? filteredItems.find(item => item.id === selectedImage) : null;

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="mb-8 hover:bg-bronze/10" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-italiana mb-6" data-testid="heading-gallery-title">
              {currentCategoryInfo.title}
            </h1>
            <p className="text-xl text-charcoal/70 max-w-3xl mx-auto" data-testid="text-gallery-description">
              {currentCategoryInfo.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter Navigation */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 ${selectedCategory === 'all' 
              ? 'bg-bronze text-white hover:bg-bronze/90' 
              : 'border-bronze text-bronze hover:bg-bronze/10'
            }`}
            data-testid="button-filter-all"
          >
            <Filter className="w-4 h-4 mr-2" />
            All Projects ({galleryItems.length})
          </Button>
          
          {Object.entries(GALLERY_CATEGORIES).map(([slug, info]) => {
            const itemCount = galleryItems.filter(item => item.category === slug).length;
            return (
              <Button
                key={slug}
                variant={selectedCategory === slug ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(slug as CategorySlug)}
                className={`px-6 py-3 ${selectedCategory === slug 
                  ? 'bg-bronze text-white hover:bg-bronze/90' 
                  : 'border-bronze text-bronze hover:bg-bronze/10'
                }`}
                data-testid={`button-filter-${slug}`}
              >
                {info.title} ({itemCount})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid - Enhanced Aesthetic Design */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(item.id)}
              data-testid={`gallery-item-${item.id}`}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white">
                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-bronze to-bronze/80 text-white px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm" data-testid={`badge-featured-${item.id}`}>
                    Featured
                  </div>
                )}
                
                {/* Like button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110"
                  data-testid={`button-like-${item.id}`}
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isLiked[item.id] ? 'text-red-500 fill-red-500' : 'text-white'
                    }`}
                  />
                </button>
                
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Enhanced overlay with better typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-4 text-white w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-bronze bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm" data-testid={`text-category-${item.id}`}>
                        {GALLERY_CATEGORIES[item.category as CategorySlug]?.title || item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-italiana mb-1 line-clamp-1" data-testid={`text-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/90 mb-2 line-clamp-2" data-testid={`text-description-${item.id}`}>
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span data-testid={`text-location-${item.id}`}>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span data-testid={`text-date-${item.id}`}>{item.projectDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elegant bottom info panel */}
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-italiana font-semibold text-charcoal text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-charcoal/60">{item.subcategory}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-bronze font-medium">{item.projectDate}</div>
                      <div className="text-xs text-charcoal/50">{item.location.split(', ')[0]}</div>
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-bronze/0 group-hover:border-bronze/20 rounded-2xl transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No results message */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
          >
            <h3 className="text-2xl font-italiana text-charcoal/70 mb-4">No Projects Found</h3>
            <p className="text-charcoal/50">
              No projects match the selected category. Try selecting a different filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Elegant Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-testid="lightbox-overlay"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-60 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              data-testid="button-close-lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation buttons */}
            {filteredItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-60 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-60 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Main lightbox content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-6xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              data-testid="lightbox-content"
            >
              <div className="grid lg:grid-cols-3 h-full">
                {/* Image section */}
                <div className="lg:col-span-2 relative">
                  <motion.img
                    key={selectedImageData.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={selectedImageData.image}
                    alt={selectedImageData.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Featured badge in lightbox */}
                  {selectedImageData.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-bronze to-bronze/80 text-white px-3 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm">
                      Featured Project
                    </div>
                  )}
                </div>

                {/* Info section */}
                <div className="p-8 flex flex-col">
                  <div className="flex-1">
                    {/* Category badge */}
                    <div className="inline-block bg-bronze/10 text-bronze px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {GALLERY_CATEGORIES[selectedImageData.category as CategorySlug]?.title}
                    </div>

                    {/* Title */}
                    <h2 className="font-italiana text-3xl font-bold text-charcoal mb-2">
                      {selectedImageData.title}
                    </h2>

                    {/* Subcategory */}
                    <p className="text-bronze font-medium mb-4">{selectedImageData.subcategory}</p>

                    {/* Description */}
                    <p className="text-charcoal/80 leading-relaxed mb-6">
                      {selectedImageData.description}
                    </p>

                    {/* Project details */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-bronze" />
                        <span className="text-charcoal/70">{selectedImageData.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-bronze" />
                        <span className="text-charcoal/70">Completed in {selectedImageData.projectDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-6 border-t border-charcoal/10">
                    <button
                      onClick={() => toggleLike(selectedImageData.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                        isLiked[selectedImageData.id]
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-gray-50 text-charcoal hover:bg-gray-100 border border-gray-200'
                      }`}
                      data-testid="button-lightbox-like"
                    >
                      <Heart 
                        className={`w-4 h-4 ${isLiked[selectedImageData.id] ? 'fill-red-600' : ''}`}
                      />
                      <span className="text-sm font-medium">
                        {isLiked[selectedImageData.id] ? 'Liked' : 'Like'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedImageData.title,
                            text: selectedImageData.description,
                            url: window.location.href
                          });
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-bronze text-white hover:bg-bronze/90 transition-all duration-300"
                      data-testid="button-lightbox-share"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
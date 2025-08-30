import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Heart, Share2, Calendar, MapPin, ZoomIn, Facebook, MessageCircle, Send } from "lucide-react";
import { SiPinterest, SiInstagram } from "react-icons/si";
import { FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { Link, useParams } from "wouter";
import { useState, useMemo, useCallback, useEffect } from "react";
import { apiRequest } from '@/lib/queryClient';
import galleryHeroImage from '@assets/image_1755719366080.png';

// All gallery images now come from admin panel uploads to Supabase

// Organized gallery categories
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
  const [selectedImage, setSelectedImage] = useState<number | string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedImageAlt, setExpandedImageAlt] = useState<string>("");
  const [isLiked, setIsLiked] = useState<Record<number | string, boolean>>({});
  const [shareMenuOpen, setShareMenuOpen] = useState<number | string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [currentShareItem, setCurrentShareItem] = useState<any | null>(null);
  const [databaseImages, setDatabaseImages] = useState<any[]>([]);

  // Gallery now uses only images uploaded through admin panel

  // Fetch database images
  useEffect(() => {
    const fetchDatabaseImages = async () => {
      try {
        // Use a public endpoint that doesn't require admin auth
        const response = await fetch('/api/gallery/public');
        if (response.ok) {
          const dbImages = await response.json();
          setDatabaseImages(dbImages);
        } else {
          // If public endpoint doesn't exist, fallback to empty array
          setDatabaseImages([]);
        }
      } catch (error) {
        console.log('Database images not available, gallery will be empty');
        setDatabaseImages([]);
      }
    };

    fetchDatabaseImages();
  }, []);

  // Use only database images from admin panel uploads
  const allGalleryItems = useMemo(() => {
    return databaseImages.map((dbImage: any) => ({
      id: `db_${dbImage.id}`,
      image: dbImage.imageUrl,
      title: dbImage.title,
      category: dbImage.category,
      subcategory: dbImage.subcategory,
      description: dbImage.description,
      projectDate: dbImage.projectDate || "2024",
      location: dbImage.location || "Kigali, Rwanda",
      featured: dbImage.featured || false
    }));
  }, [databaseImages]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return allGalleryItems;
    return allGalleryItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory, allGalleryItems]);

  const toggleLike = useCallback((id: number | string) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const openLightbox = useCallback((id: number | string) => {
    const item = allGalleryItems.find(item => item.id === id);
    if (item) {
      setExpandedImage(item.image);
      setExpandedImageAlt(item.description);
      setSelectedImage(id);
    }
  }, [allGalleryItems]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setExpandedImage(null);
    setExpandedImageAlt("");
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    }

    const newItem = filteredItems[newIndex];
    setSelectedImage(newItem.id);
    setExpandedImage(newItem.image);
    setExpandedImageAlt(newItem.description);
  }, [selectedImage, filteredItems]);

  // Social sharing functionality with subtle marketing
  const generateShareMessage = useCallback((item: any) => {
    const messages = {
      pinterest: `${item.title} - Discover the art of sophisticated living through exceptional interior design. Every space tells a story of elegance and innovation. #InteriorDesign #HomeDecor #LuxuryLiving #KigaliDesign`,
      facebook: `✨ Inspired by this stunning ${item.title} design! There's something magical about spaces that perfectly blend functionality with beauty. What makes a home truly exceptional? It's the thoughtful details that create lasting impressions. #DesignInspiration #InteriorDesign #HomeDesign`,
      whatsapp: `🏠 Look at this amazing ${item.title}! The attention to detail is incredible. This is what happens when creativity meets craftsmanship. Thought you'd appreciate this beautiful design! 🎨`,
      instagram: `${item.title} 🏡\n\nWhen design transcends decoration and becomes art... Every element carefully curated to create spaces that inspire daily life. ✨\n\n#InteriorDesign #DesignInspiration #HomeDecor #LuxuryInteriors #ModernLiving #DesignDetails #HomeDesign #Architecture`,
      twitter: `${item.title} - Where thoughtful design meets everyday living. Spaces that don't just look beautiful, but feel extraordinary. 🏠✨ #InteriorDesign #HomeDesign #DesignInspiration`
    };
    return messages;
  }, []);

  const openShareModal = useCallback((item: any) => {
    setCurrentShareItem(item);
    setShareModalOpen(true);
    setShareMenuOpen(null);
  }, []);

  const closeShareModal = useCallback(() => {
    setShareModalOpen(false);
    setCurrentShareItem(null);
  }, []);

  const shareToSocial = useCallback((platform: string, item: any) => {
    const currentUrl = window.location.href;
    const messages = generateShareMessage(item);
    const imageUrl = item.image; // In a real app, this would be a full URL
    
    const shareUrls = {
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(messages.pinterest)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(messages.facebook)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(messages.whatsapp + ' ' + currentUrl)}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL, opens Instagram
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}&url=${encodeURIComponent(currentUrl)}`
    };

    if (platform === 'instagram') {
      // Copy text to clipboard for Instagram
      navigator.clipboard.writeText(messages.instagram + '\n\n' + currentUrl);
      alert('Caption copied to clipboard! Open Instagram to share.');
    }
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    closeShareModal();
  }, [generateShareMessage, closeShareModal]);

  return (
    <div className="min-h-screen bg-white">
      {/* Sophisticated Hero Header */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Hero Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <motion.img
            src={databaseImages.find(img => img.featured)?.image || databaseImages[0]?.image || galleryHeroImage}
            alt="Elegant interior design showcase"
            className="w-full h-full object-cover scale-105"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          />
          {/* Sophisticated Multi-layer Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 0.1, scale: 1.2, rotate: 5 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-20 right-20 w-96 h-96 border border-bronze/30 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.2, rotate: 5 }}
            animate={{ opacity: 0.05, scale: 0.8, rotate: -5 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-20 left-20 w-80 h-80 border border-cream/20 rounded-full"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-20 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            {/* Enhanced Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <Link href="/" className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white hover:text-charcoal transition-all duration-300 group shadow-lg hover:shadow-xl">
                <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium tracking-wide text-sm uppercase">Back to Home</span>
              </Link>
            </motion.div>

            {/* Sophisticated Title with Decorative Elements */}
            <div className="relative mb-8">
              {/* Top decorative line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex justify-center items-center mb-8"
              >
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-bronze/60"></div>
                <div className="mx-4 w-2 h-2 bg-bronze/60 rounded-full"></div>
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-bronze/60"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
                className="font-italiana text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-[0.2em] relative"
                style={{
                  textShadow: '0 4px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)'
                }}
              >
                PROJECT GALLERY
              </motion.h1>

              {/* Bottom decorative line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex justify-center items-center mt-8"
              >
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-cream/60 to-transparent"></div>
              </motion.div>
            </div>

            {/* Elegant Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-xl md:text-2xl text-cream/90 leading-relaxed font-light mb-4">
                Explore our portfolio of exceptional interior design
              </p>
              <p className="text-lg text-cream/80 leading-relaxed font-light">
                Where elegance meets innovation in every carefully curated space
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Minimalist Filter Bar */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-xs font-light tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-charcoal text-white hover:bg-charcoal/90'
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                }`}
                data-testid="button-filter-all"
              >
                All ({allGalleryItems.length})
              </Button>
              
              {Object.entries(GALLERY_CATEGORIES).map(([slug, info]) => {
                const itemCount = allGalleryItems.filter(item => item.category === slug).length;
                return (
                  <Button
                    key={slug}
                    variant={selectedCategory === slug ? 'default' : 'ghost'}
                    onClick={() => setSelectedCategory(slug as CategorySlug)}
                    className={`px-4 py-2 text-xs font-light tracking-wider uppercase transition-all duration-300 ${
                      selectedCategory === slug 
                        ? 'bg-charcoal text-white hover:bg-charcoal/90' 
                        : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                    }`}
                    data-testid={`button-filter-${slug}`}
                  >
                    {slug === 'residential' ? 'Residential' : slug === 'commercial' ? 'Commercial' : 'Furniture'} ({itemCount})
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid - Ultra-Sophisticated Aesthetic Layout */}
      <section className="py-20 bg-gradient-to-b from-white via-cream/30 to-white relative">
        <div className="container mx-auto px-6">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(item.id)}
                  data-testid={`gallery-item-${item.id}`}
                >
                  <div className="relative bg-white hover:shadow-md transition-shadow duration-300">
                    {/* Featured indicator */}
                    {item.featured && (
                      <div className="absolute top-3 left-3 z-20 w-2 h-2 bg-charcoal rounded-full" data-testid={`badge-featured-${item.id}`}></div>
                    )}

                    {/* Image container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.description}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                      {/* Share button - Always visible on image */}
                      <div className="absolute top-3 right-3 z-20">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareMenuOpen(shareMenuOpen === item.id ? null : item.id);
                          }}
                          className="bg-white/90 backdrop-blur-sm text-charcoal p-2 rounded-full hover:bg-white transition-all duration-200 shadow-sm"
                          data-testid={`button-share-${item.id}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>

                        {/* Share dropdown */}
                        <AnimatePresence>
                          {shareMenuOpen === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 min-w-32 z-30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => openShareModal(item)}
                                className="flex items-center space-x-2 w-full p-2 text-charcoal/80 hover:bg-gray-50 rounded-md transition-colors duration-150 text-sm"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Share</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Location - Always visible on image */}
                      <div className="absolute bottom-3 left-3 z-20">
                        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-charcoal text-xs">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clean title below image */}
                    <div className="p-4">
                      <h3 className="font-light text-charcoal/90 text-sm leading-tight">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* No results state */}
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24"
            >
              <h3 className="text-3xl font-italiana text-charcoal/70 mb-4">No Projects Found</h3>
              <p className="text-charcoal/50 mb-8">
                No projects match the selected category. Try selecting a different filter.
              </p>
              <Button 
                onClick={() => setSelectedCategory('all')}
                className="bg-bronze hover:bg-bronze/90 text-white px-8 py-3"
              >
                View All Projects
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              closeLightbox();
              setShareMenuOpen(null);
            }}
          >
            {/* Navigation arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
              data-testid="button-prev-image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
              data-testid="button-next-image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
              className="relative max-w-6xl max-h-[90vh] bg-white shadow-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-12 h-12 bg-bronze hover:bg-bronze/90 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-10"
                data-testid="button-close-modal"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Expanded image */}
              <motion.img
                src={expandedImage}
                alt={expandedImageAlt}
                className="w-full h-auto max-h-[70vh] object-contain"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Image info */}
              {(() => {
                const currentItem = allGalleryItems.find(item => item.id === selectedImage);
                return currentItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-6 bg-gradient-to-t from-cream/30 to-white"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-bronze text-sm font-semibold mb-2 uppercase tracking-wider">{currentItem.subcategory}</p>
                        <h3 className="font-italiana text-2xl font-bold text-charcoal mb-3">{currentItem.title}</h3>
                        <p className="text-charcoal/70 mb-4 leading-relaxed">{currentItem.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-charcoal/60">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{currentItem.projectDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{currentItem.location}</span>
                          </div>
                          {currentItem.featured && (
                            <div className="bg-bronze/10 text-bronze px-3 py-1 rounded-full text-xs font-semibold">
                              Featured Project
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleLike(currentItem.id)}
                          className="p-3 bg-cream hover:bg-bronze/10 rounded-full transition-colors duration-300"
                        >
                          <Heart 
                            className={`w-5 h-5 ${
                              isLiked[currentItem.id] ? 'text-red-500 fill-current' : 'text-charcoal/60'
                            }`} 
                          />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openShareModal(currentItem);
                          }}
                          className="p-3 bg-cream hover:bg-bronze/10 rounded-full transition-colors duration-300"
                        >
                          <Share2 className="w-5 h-5 text-charcoal/60" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
              
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-bronze/40"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-bronze/40"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-bronze/40"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-bronze/40"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Centered Social Share Modal */}
      <AnimatePresence>
        {shareModalOpen && currentShareItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={closeShareModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white rounded-3xl shadow-3xl max-w-md w-full mx-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeShareModal}
                className="absolute top-4 right-4 w-10 h-10 bg-cream hover:bg-bronze/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
              >
                <X className="w-5 h-5 text-charcoal/60" />
              </button>
              
              {/* Header */}
              <div className="p-8 pb-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-bronze to-bronze/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-italiana text-2xl font-bold text-charcoal mb-2">Share This Design</h3>
                  <p className="text-charcoal/60 text-sm leading-relaxed">
                    Inspire others with <span className="font-semibold text-bronze">{currentShareItem.title}</span>
                  </p>
                </motion.div>
              </div>
              
              {/* Social Media Icons Grid */}
              <div className="px-8 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Pinterest */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareToSocial('pinterest', currentShareItem)}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/50 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 shadow-lg">
                      <SiPinterest className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-red-700 group-hover:text-red-800">Pinterest</span>
                    <span className="text-xs text-red-500/70 mt-1">Pin inspiration</span>
                  </motion.button>
                  
                  {/* Facebook */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareToSocial('facebook', currentShareItem)}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 shadow-lg">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800">Facebook</span>
                    <span className="text-xs text-blue-500/70 mt-1">Share with friends</span>
                  </motion.button>
                  
                  {/* WhatsApp */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareToSocial('whatsapp', currentShareItem)}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-2xl flex items-center justify-center mb-3 transition-colors duration-300 shadow-lg">
                      <FaWhatsapp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-700 group-hover:text-green-800">WhatsApp</span>
                    <span className="text-xs text-green-500/70 mt-1">Send to contacts</span>
                  </motion.button>
                  
                  {/* Instagram */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareToSocial('instagram', currentShareItem)}
                    className="flex flex-col items-center p-6 bg-gradient-to-br from-pink-50 to-purple-100/50 hover:from-pink-100 hover:to-purple-200/50 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-lg">
                      <SiInstagram className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-pink-700 group-hover:text-pink-800">Instagram</span>
                    <span className="text-xs text-pink-500/70 mt-1">Copy caption</span>
                  </motion.button>
                </motion.div>
                
                {/* X (Twitter) - Full Width */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToSocial('twitter', currentShareItem)}
                  className="w-full flex items-center justify-center p-6 mt-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-gray-800 hover:bg-black rounded-2xl flex items-center justify-center mr-4 transition-colors duration-300 shadow-lg">
                    <FaXTwitter className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-black block">X (Twitter)</span>
                    <span className="text-xs text-gray-600/70">Share with the design community</span>
                  </div>
                </motion.button>
              </div>
              
              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="px-8 pb-8"
              >
                <div className="text-center pt-4 border-t border-bronze/10">
                  <p className="text-xs text-charcoal/40 italic">Spread the beauty of exceptional design</p>
                </div>
              </motion.div>
              
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-bronze/20 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-bronze/20 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-bronze/20 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-bronze/20 rounded-br-lg"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-cream via-[#f5f1ed] to-[#8b7355] relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.05, scale: 1.1, rotate: 10 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-10 right-10 w-96 h-96 border border-bronze/20 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.1, rotate: 10 }}
            animate={{ opacity: 0.03, scale: 0.9, rotate: -10 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-10 w-80 h-80 border border-bronze/15 rounded-full"
          />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Elegant divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center items-center mb-8"
            >
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-bronze/60"></div>
              <div className="mx-4 w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-bronze/60"></div>
            </motion.div>

            <h2 className="font-italiana text-4xl md:text-5xl font-bold mb-6 tracking-wide text-charcoal">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-charcoal/80 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Let's create something extraordinary together. Contact us to discuss your next interior design project.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/#contact'; 
              }}>
                <Button className="bg-bronze hover:bg-bronze/90 text-white px-8 py-4 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-bronze/60 text-bronze hover:bg-bronze hover:text-white px-8 py-4 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>

            {/* Bottom decorative element */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center items-center mt-12"
            >
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-bronze/40 to-transparent"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
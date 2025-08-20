import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Heart, Share2, Calendar, MapPin, ZoomIn } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo, useCallback } from "react";

// Import ONLY authentic KJESS Designs project images
import projectImg1 from "@assets/IMG_0011_1755724301675.jpeg";
import projectImg2 from "@assets/IMG_0021_1755724301676.jpeg";
import projectImg3 from "@assets/IMG_3958_1755727527464.jpeg";
import projectImg4 from "@assets/IMG_5416_1755727527465.jpeg";
import projectImg5 from "@assets/IMG_5422_1755724301678.jpeg";
import projectImg6 from "@assets/PHOTO-2024-11-11-13-25-27 2_1755727527466.jpeg";
import projectImg7 from "@assets/PHOTO-2024-11-11-13-25-27 3_1755727527467.jpeg";
import projectImg8 from "@assets/PHOTO-2024-11-11-13-25-27 6_1755727527467.jpeg";
import projectImg9 from "@assets/PHOTO-2024-11-11-13-25-27 11_1755727527468.jpeg";
import projectImg10 from "@assets/PHOTO-2024-11-11-13-25-27 14_1755727515902.jpeg";
import projectImg11 from "@assets/PHOTO-2024-11-11-13-25-27 17_1755727515903.jpeg";
import projectImg12 from "@assets/PHOTO-2024-11-11-13-25-27 25_1755727515903.jpeg";
import projectImg13 from "@assets/PHOTO-2024-11-11-13-25-27 29_1755727503846.jpeg";
import projectImg14 from "@assets/PHOTO-2024-11-11-13-25-27 43_1755727503847.jpeg";
import projectImg15 from "@assets/PHOTO-2024-11-11-13-25-27 52_1755727503847.jpeg";
import projectImg16 from "@assets/PHOTO-2024-11-11-13-25-27 59_1755727419390.jpeg";
import projectImg17 from "@assets/PHOTO-2024-11-11-13-25-27 60_1755727419391.jpeg";
import furnitureChair from "@assets/PHOTO-2024-11-11-13-25-27_17-removebg-preview_1755727365622.png";

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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedImageAlt, setExpandedImageAlt] = useState<string>("");
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});

  // ONLY authentic KJESS Designs project photos
  const galleryItems = [
    // Featured Residential Projects (Best Images First)
    {
      id: 1,
      image: projectImg3,
      title: "Signature Living Space",
      category: "residential",
      subcategory: "Living Rooms",
      description: "Award-winning modern living room with sophisticated furniture and lighting design",
      projectDate: "2024",
      location: "Kigali, Rwanda",
      featured: true
    },
    {
      id: 2,
      image: projectImg1,
      title: "Contemporary Family Home",
      category: "residential", 
      subcategory: "Living Areas",
      description: "Elegant family space with premium finishes and custom elements",
      projectDate: "2024",
      location: "Nyarutarama, Kigali",
      featured: true
    },
    {
      id: 3,
      image: projectImg10,
      title: "Modern Kitchen Design",
      category: "residential",
      subcategory: "Kitchens",
      description: "State-of-the-art kitchen with luxury appliances and sophisticated storage solutions",
      projectDate: "2024",
      location: "Kimihurura, Kigali",
      featured: true
    },
    {
      id: 4,
      image: projectImg6,
      title: "Master Bedroom Suite",
      category: "residential",
      subcategory: "Bedrooms",
      description: "Tranquil bedroom retreat with custom furniture and elegant lighting",
      projectDate: "2024",
      location: "Gacuriro, Kigali",
      featured: false
    },
    {
      id: 5,
      image: projectImg7,
      title: "Dining Room Excellence",
      category: "residential",
      subcategory: "Dining Rooms",
      description: "Sophisticated dining space perfect for entertaining and family gatherings",
      projectDate: "2023",
      location: "Kacyiru, Kigali",
      featured: false
    },
    {
      id: 6,
      image: projectImg8,
      title: "Luxury Bathroom Design",
      category: "residential",
      subcategory: "Bathrooms",
      description: "Spa-like bathroom with premium marble finishes and modern fixtures",
      projectDate: "2024",
      location: "Remera, Kigali",
      featured: false
    },
    {
      id: 7,
      image: projectImg9,
      title: "Open Concept Living",
      category: "residential",
      subcategory: "Living Areas",
      description: "Spacious open-plan design with seamless indoor-outdoor flow",
      projectDate: "2023",
      location: "Nyamirambo, Kigali",
      featured: false
    },
    {
      id: 8,
      image: projectImg11,
      title: "Modern Family Kitchen",
      category: "residential",
      subcategory: "Kitchens",
      description: "Contemporary kitchen design with island seating and premium appliances",
      projectDate: "2024",
      location: "Gasabo, Kigali",
      featured: false
    },
    {
      id: 9,
      image: projectImg12,
      title: "Elegant Bedroom Design",
      category: "residential",
      subcategory: "Bedrooms",
      description: "Sophisticated bedroom with custom headboard and luxury bedding",
      projectDate: "2024",
      location: "Kinyinya, Kigali",
      featured: false
    },
    {
      id: 10,
      image: projectImg13,
      title: "Contemporary Living Room",
      category: "residential",
      subcategory: "Living Rooms",
      description: "Modern living space with artistic elements and comfortable seating",
      projectDate: "2023",
      location: "Gikondo, Kigali",
      featured: false
    },

    // Commercial Projects
    {
      id: 20,
      image: projectImg14,
      title: "Executive Office Suite",
      category: "commercial",
      subcategory: "Offices",
      description: "Professional workspace with modern aesthetic and premium finishes",
      projectDate: "2024",
      location: "City Center, Kigali",
      featured: true
    },
    {
      id: 21,
      image: projectImg15,
      title: "Corporate Conference Room",
      category: "commercial",
      subcategory: "Meeting Spaces",
      description: "Sophisticated meeting space with advanced technology integration",
      projectDate: "2024",
      location: "Kigali Heights",
      featured: true
    },
    {
      id: 22,
      image: projectImg16,
      title: "Modern Reception Area",
      category: "commercial",
      subcategory: "Reception",
      description: "Welcoming reception space with artistic elements and comfortable seating",
      projectDate: "2023",
      location: "Nyarugenge, Kigali",
      featured: false
    },
    {
      id: 23,
      image: projectImg17,
      title: "Professional Office Space",
      category: "commercial",
      subcategory: "Offices",
      description: "Contemporary office design with open-plan layout and modern furnishings",
      projectDate: "2023",
      location: "Remera, Kigali",
      featured: false
    },
    {
      id: 24,
      image: projectImg2,
      title: "Retail Showroom",
      category: "commercial",
      subcategory: "Retail",
      description: "Elegant retail space with strategic lighting and display solutions",
      projectDate: "2024",
      location: "Kimisagara, Kigali",
      featured: false
    },
    {
      id: 25,
      image: projectImg4,
      title: "Corporate Workspace",
      category: "commercial",
      subcategory: "Offices",
      description: "Modern corporate environment designed for productivity and collaboration",
      projectDate: "2024",
      location: "Gishushu, Kigali",
      featured: false
    },
    {
      id: 26,
      image: projectImg5,
      title: "Business Meeting Room",
      category: "commercial",
      subcategory: "Meeting Spaces",
      description: "Professional meeting space with elegant furniture and proper lighting",
      projectDate: "2023",
      location: "Kacyiru, Kigali",
      featured: false
    },

    // Custom Furniture Projects
    {
      id: 40,
      image: furnitureChair,
      title: "Traditional African Chair",
      category: "furniture",
      subcategory: "Seating",
      description: "Handcrafted chair featuring traditional African patterns with modern comfort and premium upholstery",
      projectDate: "2024",
      location: "KJESS Workshop",
      featured: true
    }
  ];

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const toggleLike = useCallback((id: number) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const openLightbox = useCallback((id: number) => {
    const item = galleryItems.find(item => item.id === id);
    if (item) {
      setExpandedImage(item.image);
      setExpandedImageAlt(item.description);
      setSelectedImage(id);
    }
  }, [galleryItems]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Elegant Header */}
      <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal/90 text-white py-24 overflow-hidden">
        {/* Artistic backdrop elements */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.1, scale: 1.2, rotate: 10 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-10 right-10 w-96 h-96 border border-bronze/20 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.2, rotate: 10 }}
            animate={{ opacity: 0.05, scale: 0.8, rotate: -10 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-10 left-10 w-72 h-72 border border-bronze/30 rounded-full"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Link href="/" className="inline-flex items-center text-bronze hover:text-white transition-colors duration-300 group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium tracking-wide">Back to Home</span>
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
              className="font-italiana text-6xl md:text-8xl font-bold mb-6 tracking-wider"
            >
              PROJECT GALLERY
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-cream/90 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Explore our portfolio of exceptional interior design projects, showcasing elegance, innovation, and timeless sophistication.
            </motion.p>

            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 flex justify-center items-center space-x-4"
            >
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-bronze/60"></div>
              <div className="w-3 h-3 bg-bronze/60 rounded-full"></div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-bronze/60"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-bronze/20 py-6">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="flex flex-wrap justify-center gap-3 bg-white/80 p-4 rounded-2xl shadow-lg">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-bronze text-white hover:bg-bronze/90 shadow-lg scale-105'
                    : 'border-bronze text-bronze hover:bg-bronze/10 hover:border-bronze/60'
                }`}
                data-testid="button-filter-all"
              >
                All Projects ({galleryItems.length})
              </Button>
              
              {Object.entries(GALLERY_CATEGORIES).map(([slug, info]) => {
                const itemCount = galleryItems.filter(item => item.category === slug).length;
                return (
                  <Button
                    key={slug}
                    variant={selectedCategory === slug ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(slug as CategorySlug)}
                    className={`px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                      selectedCategory === slug 
                        ? 'bg-bronze text-white hover:bg-bronze/90 shadow-lg scale-105' 
                        : 'border-bronze text-bronze hover:bg-bronze/10 hover:border-bronze/60'
                    }`}
                    data-testid={`button-filter-${slug}`}
                  >
                    {info.title} ({itemCount})
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid - Sophisticated Magazine-Style Layout */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8"
          >
            {filteredItems.map((item, index) => {
              // Create aesthetic variations for different items
              const isLarge = index % 7 === 0 || index % 11 === 0; // Featured large items
              const isWide = index % 5 === 0 && !isLarge; // Wide aspect items
              const hasRotation = index % 13 === 0; // Slight rotation for artistic feel
              const isElevated = index % 9 === 0; // Extra elevation for depth
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`group cursor-pointer break-inside-avoid mb-8 ${
                    hasRotation ? 'transform hover:rotate-0 rotate-1' : ''
                  } ${
                    isElevated ? 'relative z-10' : ''
                  }`}
                  onClick={() => openLightbox(item.id)}
                  data-testid={`gallery-item-${item.id}`}
                >
                  <div className={`relative overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-white ${
                    isLarge ? 'rounded-3xl p-6' : isWide ? 'rounded-2xl p-4' : 'rounded-2xl p-3'
                  } ${
                    isElevated ? 'shadow-2xl' : ''
                  }`}>
                  {/* Featured badge */}
                  {item.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-bronze to-bronze/80 text-white px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm" data-testid={`badge-featured-${item.id}`}>
                      Featured
                    </div>
                  )}
                  
                  {/* Love button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                    data-testid={`button-like-${item.id}`}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isLiked[item.id] ? 'text-red-500 fill-current' : 'text-charcoal/60 hover:text-red-500'
                      }`} 
                    />
                  </button>

                  {/* Image container with aesthetic variations */}
                  <div className={`relative overflow-hidden ${
                    isLarge ? 'aspect-[3/4] rounded-2xl' : 
                    isWide ? 'aspect-[16/9] rounded-xl' : 
                    'aspect-[4/3] rounded-xl'
                  }`}>
                    <img
                      src={item.image}
                      alt={item.description}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Subtle hover overlay without icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Project info overlay with size variations */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/90 to-transparent text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ${
                      isLarge ? 'p-6' : 'p-4'
                    }`}>
                      <p className={`text-bronze/90 font-medium mb-1 uppercase tracking-wider ${
                        isLarge ? 'text-sm' : 'text-xs'
                      }`}>{item.subcategory}</p>
                      <h3 className={`font-italiana font-bold mb-2 leading-tight ${
                        isLarge ? 'text-2xl' : 'text-lg'
                      }`}>{item.title}</h3>
                      
                      <div className={`flex items-center justify-between text-cream/80 ${
                        isLarge ? 'text-sm' : 'text-xs'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Calendar className={isLarge ? 'w-4 h-4' : 'w-3 h-3'} />
                          <span>{item.projectDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className={isLarge ? 'w-4 h-4' : 'w-3 h-3'} />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Artistic corner accent for special items */}
                  {(item.featured || isLarge) && (
                    <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-bronze/30"></div>
                  )}
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
            onClick={closeLightbox}
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
                const currentItem = galleryItems.find(item => item.id === selectedImage);
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
                        <button className="p-3 bg-cream hover:bg-bronze/10 rounded-full transition-colors duration-300">
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

      {/* Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-charcoal to-charcoal/90 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-italiana text-4xl md:text-5xl font-bold mb-6 tracking-wide">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's create something extraordinary together. Contact us to discuss your next interior design project.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button className="bg-bronze hover:bg-bronze/90 text-white px-8 py-4 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-bronze text-bronze hover:bg-bronze hover:text-white px-8 py-4 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
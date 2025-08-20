import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Heart, Share2, Calendar, MapPin, ZoomIn } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo, useCallback } from "react";

// Import real KJESS Designs project images
import projectImg1 from "@assets/IMG_0011_1755724301675.jpeg";
import projectImg2 from "@assets/IMG_0021_1755724301676.jpeg";
import projectImg3 from "@assets/IMG_3958_1755724301677.jpeg";
import projectImg4 from "@assets/IMG_5416_1755724301677.jpeg";
import projectImg5 from "@assets/IMG_5422_1755724301678.jpeg";
import projectImg6 from "@assets/PHOTO-2024-11-11-13-25-27 2_1755724301679.jpeg";
import projectImg7 from "@assets/PHOTO-2024-11-11-13-25-27 3_1755724301681.jpeg";
import projectImg8 from "@assets/PHOTO-2024-11-11-13-25-27 6_1755724301684.jpeg";
import projectImg9 from "@assets/PHOTO-2024-11-11-13-25-27 11_1755724301686.jpeg";
import projectImg10 from "@assets/PHOTO-2024-11-11-13-25-27 14_1755724301688.jpeg";
import projectImg11 from "@assets/PHOTO-2024-11-11-13-25-27 17_1755724301692.jpeg";
import projectImg12 from "@assets/PHOTO-2024-11-11-13-25-27 25_1755724301693.jpeg";
import projectImg13 from "@assets/PHOTO-2024-11-11-13-25-27 29_1755724301694.jpeg";
import projectImg14 from "@assets/PHOTO-2024-11-11-13-25-27 43_1755724301695.jpeg";
import projectImg15 from "@assets/PHOTO-2024-11-11-13-25-27 52_1755724301695.jpeg";
import projectImg16 from "@assets/PHOTO-2024-11-11-13-25-27 59_1755724301696.jpeg";
import projectImg17 from "@assets/PHOTO-2024-11-11-13-25-27 60_1755724301699.jpeg";
import furnitureChair from "@assets/PHOTO-2024-11-11-13-25-27_17-removebg-preview_1755724395612.png";
import interiorImg1 from "@assets/image_1755104650441.png";
import interiorImg2 from "@assets/image_1755104680089.png";
import interiorImg3 from "@assets/image_1755104729823.png";
import interiorImg4 from "@assets/image_1755104762607.png";
import interiorImg5 from "@assets/image_1755104785392.png";
import interiorImg6 from "@assets/image_1755104813921.png";
import interiorImg7 from "@assets/image_1755104844178.png";
import interiorImg8 from "@assets/image_1755104869069.png";
import interiorImg9 from "@assets/image_1755104895646.png";
import interiorImg10 from "@assets/image_1755104918264.png";
import interiorImg11 from "@assets/image_1755104942771.png";
import commercialImg1 from "@assets/image_1755106453821.png";
import commercialImg2 from "@assets/image_1755106786925.png";
import commercialImg3 from "@assets/image_1755107055502.png";
import commercialImg4 from "@assets/image_1755108355220.png";
import commercialImg5 from "@assets/image_1755108466201.png";
import furnitureImg1 from "@assets/image_1755112607322.png";
import furnitureImg2 from "@assets/image_1755113167474.png";
import furnitureImg3 from "@assets/image_1755113400426.png";
import luxuryImg1 from "@assets/image_1755717970699.png";
import luxuryImg2 from "@assets/image_1755718192050.png";
import luxuryImg3 from "@assets/image_1755718394711.png";
import luxuryImg4 from "@assets/image_1755719366080.png";
import luxuryImg5 from "@assets/image_1755719619382.png";
import luxuryImg6 from "@assets/image_1755719885931.png";
import luxuryImg7 from "@assets/image_1755720116208.png";
import luxuryImg8 from "@assets/image_1755720418895.png";
import luxuryImg9 from "@assets/image_1755720815914.png";
import luxuryImg10 from "@assets/image_1755721224386.png";
import luxuryImg11 from "@assets/image_1755721331301.png";
import luxuryImg12 from "@assets/image_1755721382971.png";
import luxuryImg13 from "@assets/image_1755721499635.png";
import luxuryImg14 from "@assets/image_1755721564259.png";
import luxuryImg15 from "@assets/image_1755721649514.png";
import luxuryImg16 from "@assets/image_1755721896611.png";
import luxuryImg17 from "@assets/image_1755722080826.png";
import signatureImg from "@assets/image_1755723808536.png";

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
  },
  luxury: {
    title: "Luxury Projects",
    description: "Premium designs with sophisticated finishes",
    slug: "luxury"
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

  // Real KJESS Designs project gallery organized by category
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
      image: luxuryImg1,
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
      image: interiorImg1,
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
      image: interiorImg2,
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
      image: luxuryImg2,
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
      image: interiorImg3,
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
      image: luxuryImg3,
      title: "Modern Family Kitchen",
      category: "residential",
      subcategory: "Kitchens",
      description: "Contemporary kitchen design with island seating and premium appliances",
      projectDate: "2024",
      location: "Gasabo, Kigali",
      featured: false
    },

    // Commercial Projects
    {
      id: 20,
      image: commercialImg1,
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
      image: commercialImg2,
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
      image: commercialImg3,
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
      image: commercialImg4,
      title: "Restaurant Interior",
      category: "commercial",
      subcategory: "Restaurants",
      description: "Upscale dining establishment with custom lighting and premium furnishings",
      projectDate: "2023",
      location: "Remera, Kigali",
      featured: false
    },
    {
      id: 24,
      image: commercialImg5,
      title: "Retail Showroom",
      category: "commercial",
      subcategory: "Retail",
      description: "Elegant retail space with strategic lighting and display solutions",
      projectDate: "2024",
      location: "Kimisagara, Kigali",
      featured: false
    },

    // Custom Furniture Projects
    {
      id: 40,
      image: furnitureChair,
      title: "Traditional African Chair",
      category: "furniture",
      subcategory: "Seating",
      description: "Handcrafted chair featuring traditional African patterns with modern comfort",
      projectDate: "2024",
      location: "KJESS Workshop",
      featured: true
    },
    {
      id: 41,
      image: furnitureImg1,
      title: "Custom Dining Table",
      category: "furniture",
      subcategory: "Tables",
      description: "Elegant dining table with premium wood finish and sophisticated design",
      projectDate: "2024",
      location: "KJESS Workshop",
      featured: true
    },
    {
      id: 42,
      image: furnitureImg2,
      title: "Luxury Bedroom Set",
      category: "furniture",
      subcategory: "Bedroom Furniture",
      description: "Complete bedroom furniture collection with matching nightstands and dresser",
      projectDate: "2023",
      location: "KJESS Workshop",
      featured: false
    },
    {
      id: 43,
      image: furnitureImg3,
      title: "Modern Coffee Table",
      category: "furniture",
      subcategory: "Tables",
      description: "Contemporary coffee table with glass top and artistic base design",
      projectDate: "2024",
      location: "KJESS Workshop",
      featured: false
    },

    // Luxury Projects
    {
      id: 60,
      image: signatureImg,
      title: "Signature Luxury Project",
      category: "luxury",
      subcategory: "Premium Residences",
      description: "Award-winning luxury interior featuring bespoke elements and premium materials",
      projectDate: "2024",
      location: "Kiyovu, Kigali",
      featured: true
    },
    {
      id: 61,
      image: luxuryImg4,
      title: "Premium Penthouse",
      category: "luxury",
      subcategory: "Penthouse",
      description: "Sophisticated penthouse design with panoramic views and luxury finishes",
      projectDate: "2024",
      location: "Nyarutarama Heights",
      featured: true
    },
    {
      id: 62,
      image: luxuryImg5,
      title: "Executive Villa",
      category: "luxury",
      subcategory: "Villas",
      description: "Elegant villa interior with custom furniture and artistic lighting",
      projectDate: "2023",
      location: "Kacyiru Hills",
      featured: false
    },
    {
      id: 63,
      image: luxuryImg6,
      title: "Luxury Master Suite",
      category: "luxury",
      subcategory: "Master Bedrooms",
      description: "Opulent master bedroom with walk-in closet and en-suite bathroom",
      projectDate: "2024",
      location: "Gishushu",
      featured: false
    },
    {
      id: 64,
      image: luxuryImg7,
      title: "Premium Living Space",
      category: "luxury",
      subcategory: "Living Areas",
      description: "Grand living room with double-height ceilings and designer furniture",
      projectDate: "2023",
      location: "Kibagabaga",
      featured: false
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

      {/* Gallery Grid - Enhanced Aesthetic Design */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(item.id)}
                data-testid={`gallery-item-${item.id}`}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-white">
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

                  {/* Image container with hover effects */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.description}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay with zoom icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 p-3 rounded-full shadow-lg backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <ZoomIn className="w-6 h-6 text-charcoal" />
                        </div>
                      </div>
                    </div>

                    {/* Project info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/90 to-transparent text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-xs text-bronze/90 font-medium mb-1 uppercase tracking-wider">{item.subcategory}</p>
                      <h3 className="font-italiana text-lg font-bold mb-2 leading-tight">{item.title}</h3>
                      
                      <div className="flex items-center justify-between text-xs text-cream/80">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.projectDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
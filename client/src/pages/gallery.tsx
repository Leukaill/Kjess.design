import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo } from "react";

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

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              data-testid={`gallery-item-${item.id}`}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4 z-10 bg-bronze text-white px-3 py-1 text-xs font-medium rounded-full" data-testid={`badge-featured-${item.id}`}>
                    Featured
                  </div>
                )}
                
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-bronze block" data-testid={`text-category-${item.id}`}>
                        {GALLERY_CATEGORIES[item.category as CategorySlug]?.title || item.category}
                      </span>
                      <span className="text-xs text-white/60">•</span>
                      <span className="text-xs text-white/80" data-testid={`text-subcategory-${item.id}`}>
                        {item.subcategory}
                      </span>
                    </div>
                    <h3 className="text-xl font-italiana mb-2" data-testid={`text-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/80 mb-2" data-testid={`text-description-${item.id}`}>
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/70">
                      <span data-testid={`text-location-${item.id}`}>{item.location}</span>
                      <span data-testid={`text-date-${item.id}`}>{item.projectDate}</span>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default Gallery;
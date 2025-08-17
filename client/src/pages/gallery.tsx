import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const Gallery = () => {
  const galleryItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Modern Living Room",
      category: "Residential",
      description: "Elegant living space with sophisticated furniture and lighting"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Luxury Bedroom Suite",
      category: "Residential", 
      description: "Tranquil bedroom with premium finishes and custom furniture"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Contemporary Kitchen",
      category: "Residential",
      description: "State-of-the-art kitchen design with luxury appliances"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Executive Office",
      category: "Commercial",
      description: "Professional workspace with modern aesthetic"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Dining Room Elegance",
      category: "Residential",
      description: "Sophisticated dining space for entertaining"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Hotel Lobby Design",
      category: "Hospitality",
      description: "Luxurious hotel entrance with artistic elements"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Spa Retreat",
      category: "Hospitality",
      description: "Serene spa environment with natural materials"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95",
      title: "Restaurant Interior",
      category: "Commercial",
      description: "Upscale dining establishment with custom lighting"
    }
  ];

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
            <h1 className="text-5xl font-italiana mb-6">Our Gallery</h1>
            <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
              Explore our portfolio of sophisticated interior designs, from residential spaces to commercial environments.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              data-testid={`gallery-item-${item.id}`}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-sm font-medium text-bronze mb-2 block">{item.category}</span>
                    <h3 className="text-xl font-italiana mb-2">{item.title}</h3>
                    <p className="text-sm text-white/80">{item.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
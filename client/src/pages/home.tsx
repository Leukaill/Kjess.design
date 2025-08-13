import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema, insertNewsletterSchema, type InsertContact, type InsertNewsletter } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Mail, MapPin, Instagram, Star, Quote } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const fadeInY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const fadeInOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Contact form
  const contactForm = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Newsletter form
  const newsletterForm = useForm<InsertNewsletter>({
    resolver: zodResolver(insertNewsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  // Contact mutation
  const contactMutation = useMutation({
    mutationFn: (data: InsertContact) =>
      apiRequest("POST", "/api/contact", data),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Message Sent!",
        description: result.message,
      });
      contactForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: async (error: any) => {
      const errorData = await error.response?.json();
      toast({
        title: "Error",
        description: errorData?.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Newsletter mutation
  const newsletterMutation = useMutation({
    mutationFn: (data: InsertNewsletter) =>
      apiRequest("POST", "/api/newsletter", data),
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Subscribed!",
        description: result.message,
      });
      newsletterForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/newsletters"] });
    },
    onError: async (error: any) => {
      const errorData = await error.response?.json();
      toast({
        title: "Error",
        description: errorData?.message || "Failed to subscribe",
        variant: "destructive",
      });
    },
  });

  const onContactSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  const onNewsletterSubmit = (data: InsertNewsletter) => {
    newsletterMutation.mutate(data);
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, Kigali Holdings",
      content: "KJESS Designs transformed our office into a sophisticated workspace that perfectly reflects our company's vision. Their attention to detail is unmatched.",
      rating: 5
    },
    {
      name: "David Uwimana", 
      role: "Homeowner",
      content: "Working with KJESS was an absolute pleasure. They understood our needs perfectly and created a home that exceeds all our expectations.",
      rating: 5
    },
    {
      name: "Marie Claire Nyirahabimana",
      role: "Hotel Manager",
      content: "The luxury and elegance KJESS brought to our hotel's interior has significantly elevated our guest experience. Exceptional craftsmanship.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal overflow-x-hidden">
      {/* Hero Section - Matching first design exactly */}
      <section id="home" className="relative h-screen flex overflow-hidden">
        {/* Left side - Text content with cream background */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/2 bg-cream flex flex-col justify-center px-20 relative"
        >
          {/* Subtle decorative line */}
          <div className="absolute left-0 top-1/2 w-1 h-32 bg-bronze/20 transform -translate-y-1/2"></div>
          
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-charcoal mb-16 flex items-center justify-center shadow-lg luxury-hover"
          >
            <span className="text-cream text-3xl font-italiana font-bold tracking-wider">K</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-italiana text-5xl md:text-7xl font-normal leading-[0.9] text-charcoal mb-10 tracking-wide"
          >
            KJESS DESIGNS<span className="text-bronze">.</span>LTD
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-charcoal/80 mb-2 font-italiana italic tracking-wide">
              Interior Design & Furnitures
            </p>
            <div className="w-16 h-px bg-bronze/40 mb-6"></div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-charcoal/70 font-italiana font-light tracking-wider"
          >
            Our Portfolio
          </motion.p>
        </motion.div>
        
        {/* Right side - Image fills entire right half */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ y: heroY }}
          className="w-1/2 h-full relative overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=1200&q=90"
            alt="Modern interior with yellow chair, flowers and contemporary furniture"
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
          
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-transparent to-transparent"></div>
          
          {/* Decorative corner accent */}
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cream/30"></div>
        </motion.div>
      </section>

      {/* Introduction Section - Ultra elegant and aesthetic */}
      <section className="py-24 bg-gradient-to-b from-white to-cream/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 border border-bronze/10 rotate-45 opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 border border-charcoal/5 rotate-12"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Image container with sophisticated framing */}
              <div className="relative">
                {/* Outer decorative frame */}
                <div className="absolute -inset-4 border border-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative overflow-hidden bg-white p-2 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700&q=95"
                    alt="Contemporary living room with marble accent wall and modern furnishing"
                    className="w-full h-[550px] object-cover transition-all duration-1000 ease-out group-hover:scale-[1.02]"
                  />
                  
                  {/* Sophisticated overlay */}
                  <div className="absolute inset-2 border border-white/30 pointer-events-none"></div>
                </div>
                
                {/* Corner accent elements */}
                <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-bronze/40"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-bronze/40"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Elegant side decoration */}
              <div className="absolute -left-8 top-0 flex flex-col items-center">
                <div className="w-px h-16 bg-gradient-to-b from-bronze/60 to-transparent"></div>
                <div className="w-2 h-2 bg-bronze/50 rounded-full my-2"></div>
                <div className="w-px h-16 bg-gradient-to-t from-bronze/60 to-transparent"></div>
              </div>
              
              {/* Typography section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="font-italiana text-6xl md:text-7xl mb-10 text-charcoal leading-[0.85] tracking-wider relative">
                  INTRODUCTION
                  <div className="absolute -bottom-4 left-0 w-24 h-px bg-bronze/50"></div>
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-xl leading-relaxed text-charcoal/85 font-light tracking-wide">
                  Kjess Designs is where <span className="font-italiana italic text-bronze">creativity meets craftsmanship</span>. 
                  We are a Rwandan-based interior design and furniture company dedicated to
                  transforming spaces into timeless masterpieces.
                </p>
                
                {/* Ultra elegant separator */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center py-6"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-bronze/60 to-bronze/60"></div>
                    <div className="relative">
                      <div className="w-3 h-3 bg-bronze/40 rounded-full"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-bronze/20 rounded-full animate-ping"></div>
                    </div>
                    <div className="w-16 h-px bg-gradient-to-l from-transparent via-bronze/60 to-bronze/60"></div>
                  </div>
                </motion.div>
                
                <p className="text-xl leading-relaxed text-charcoal/85 font-light tracking-wide">
                  With a commitment to <span className="font-italiana italic text-bronze">excellence, elegance, and innovation</span>, we
                  bring your visions to life through thoughtful design and superior
                  <span className="font-italiana text-bronze font-medium"> Attention to Details</span>.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Section - Matching third design */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="font-italiana text-5xl md:text-7xl mb-8 text-charcoal leading-tight">
                  OUR History
                </h2>
                <p className="text-lg leading-relaxed text-charcoal/80 mb-6">
                  Founded over a decade ago, Kjess Designs began as a small design
                  studio with a passion for refined interiors and handcrafted
                  furniture. Through years of dedication, we have grown into a
                  trusted name in Rwanda's design industry, collaborating with
                  individuals, luxury residences, and institutions to deliver
                  exceptional spaces.
                </p>
                <p className="text-lg leading-relaxed text-charcoal/80">
                  Our journey has been shaped by a relentless pursuit of quality
                  and a deep understanding of design aesthetics.
                </p>
              </motion.div>
            </div>
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Modern living room with green accent wall"
                    className="w-full h-48 object-cover rounded-lg luxury-hover"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                    alt="Elegant living space with contemporary artwork"
                    className="w-full h-48 object-cover rounded-lg luxury-hover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Matching fourth design */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Modern living room with round wooden coffee table"
                className="w-full h-96 object-cover luxury-hover mb-8"
              />

              <div className="bg-white border border-gray-200 p-6">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
                  alt="Modern upholstered chair"
                  className="w-full h-32 object-cover mb-4"
                />
                <div className="text-center">
                  <h4 className="font-playfair text-sm font-semibold mb-1">
                    KJESS DESIGNS
                  </h4>
                  <p className="text-xs text-charcoal/70">Interior Design Studio</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-5xl md:text-7xl mb-8 text-charcoal leading-tight">
                OUR SERVICES
              </h2>
              
              <div className="space-y-4 text-lg text-charcoal/80">
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Interior design & space planning</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>3D visualization & material selection</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Custom-made furniture (sofas, chairs, Outdoor Lounge, TV stands, Dinning tables, etc.)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Bespoke joinery (kitchens, closets, doors, wall & ceiling panels)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Curtain treatment & window dressing</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Lighting selection & decorative lighting solutions</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Turnkey interior fit-outs & project management</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Metal-wood furniture integration</span>
                </div>
                <div className="flex items-start">
                  <span className="text-bronze mr-3">•</span>
                  <span>Styling & final interior accessorizing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section - Matching fifth design */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-italiana text-5xl md:text-7xl mb-8 text-charcoal leading-tight">
              A LITTLE About us
            </h2>
            
            <div className="w-full h-32 mb-8">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=200"
                alt="Wooden furniture craftsmanship detail"
                className="w-full h-full object-cover luxury-hover"
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <div className="bg-white px-8 py-4 rounded-full border border-charcoal/20">
                <span className="text-charcoal uppercase tracking-wider text-sm font-medium">
                  INTERIOR DESIGN
                </span>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-lg leading-relaxed text-charcoal/80">
                At Kjess Designs, we specialize in interior design solutions and
                custom-made furniture that reflect elegance, comfort, and purpose.
                Our team of talented designers and skilled artisans works closely
                with clients to craft environments that are both functional and
                inspiring. From contemporary to classic styles, we curate every
                detail to align with your personality and lifestyle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section - Matching sixth design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Workshop with furniture materials and tools"
                className="w-full h-96 object-cover luxury-hover"
              />
              
              {/* Polaroid-style overlays */}
              <div className="absolute -top-4 -left-4 bg-white p-2 shadow-lg rotate-6 luxury-hover">
                <img
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
                  alt="Detailed craftsmanship"
                  className="w-24 h-20 object-cover"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-4 bg-white p-2 shadow-lg -rotate-6 luxury-hover">
                <img
                  src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
                  alt="Interior detail"
                  className="w-24 h-20 object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-5xl md:text-7xl mb-8 text-charcoal leading-tight">
                OUR Mission
              </h2>
              
              <p className="text-lg leading-relaxed text-charcoal/80">
                To create beautiful, functional, and inspiring interior spaces by
                combining design expertise with premium craftsmanship. We strive to
                exceed our clients' expectations through professionalism, creativity,
                and a deep commitment to quality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Matching seventh design */}
      <section id="gallery" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-5xl md:text-7xl mb-4 text-charcoal leading-tight">
                GALLERY
              </h2>
              <p className="font-italiana text-xl mb-8 text-charcoal">
                PROJECT HIGHLIGHTS
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Modern dining room with pendant lights"
                  className="w-full h-48 object-cover luxury-hover"
                />
                <img
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Contemporary lighting fixtures"
                  className="w-full h-48 object-cover luxury-hover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="bg-white p-4">
                <img
                  src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
                  alt="Luxury leather armchair"
                  className="w-full h-40 object-cover luxury-hover"
                />
              </div>
              
              <div className="bg-white p-4">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
                  alt="Wooden furniture detail"
                  className="w-full h-32 object-cover luxury-hover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section - Matching eighth design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Outdoor luxury seating by the ocean"
              className="w-full h-64 object-cover luxury-hover"
            />
            <img
              src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Elegant outdoor dining setup"
              className="w-full h-64 object-cover luxury-hover"
            />
            <img
              src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Sophisticated interior dining room"
              className="w-full h-64 object-cover luxury-hover"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <h2 className="font-italiana text-5xl md:text-7xl text-charcoal leading-tight">
              OUR VISION
            </h2>
            
            <p className="text-lg leading-relaxed text-charcoal/80">
              To be Rwanda's leading interior design and bespoke furniture company,
              recognized for transforming everyday spaces into extraordinary
              experiences. We aim to set a benchmark in the industry through
              innovation, design integrity, and client satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Beautiful Bed Ideas Section - Matching ninth design */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400"
                alt="Modern upholstered bed with textured headboard"
                className="w-full h-64 object-cover luxury-hover"
              />
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
                  alt="Contemporary bedroom with wooden features"
                  className="w-full h-32 object-cover luxury-hover"
                />
                <img
                  src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
                  alt="Minimalist bedroom design with natural textures"
                  className="w-full h-28 object-cover luxury-hover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-5xl md:text-7xl mb-8 text-charcoal leading-tight">
                BEAUTIFUL<br />
                Bed IDEAS
              </h2>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Most elegant section */}
      <section className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-bronze/20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-italiana text-5xl md:text-7xl mb-6 text-cream leading-tight">
              CLIENT TESTIMONIALS
            </h2>
            <p className="text-xl text-cream/80">What our valued clients say about us</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-cream/5 backdrop-blur-sm p-8 rounded-lg border border-cream/10 luxury-hover"
              >
                <div className="mb-6">
                  <Quote className="text-bronze mb-4" size={32} />
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-bronze fill-bronze" size={16} />
                    ))}
                  </div>
                </div>
                
                <p className="text-cream/90 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-cream/20 pt-4">
                  <h4 className="font-playfair text-lg font-semibold text-cream mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-cream/70 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Matching tenth design */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Luxury interior with elegant lighting and comfortable seating"
                className="w-full h-96 object-cover luxury-hover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-italiana text-5xl md:text-7xl mb-8 text-charcoal leading-tight">
                LET'S Contact
              </h2>
              
              {/* Contact Info Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-cream rounded-lg">
                  <Phone className="mx-auto mb-2 text-bronze" size={24} />
                  <div className="w-12 h-12 bg-white mx-auto mb-2 flex items-center justify-center rounded">
                    <img
                      src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50"
                      alt="Creative Director"
                      className="w-8 h-8 object-cover rounded"
                    />
                  </div>
                  <p className="text-xs font-semibold">CREATIVE DIRECTOR</p>
                </div>
                
                <div className="text-center p-4 bg-cream rounded-lg">
                  <Instagram className="mx-auto mb-2 text-bronze" size={24} />
                  <div className="w-12 h-12 bg-white mx-auto mb-2 flex items-center justify-center rounded">
                    <div className="w-8 h-8 bg-black flex items-center justify-center">
                      {/* QR Code placeholder */}
                      <div className="grid grid-cols-3 gap-px">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className={`w-1 h-1 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold">INSTAGRAM</p>
                </div>
                
                <div className="text-center p-4 bg-cream rounded-lg">
                  <MapPin className="mx-auto mb-2 text-bronze" size={24} />
                  <div className="w-12 h-12 bg-black mx-auto mb-2 flex items-center justify-center rounded">
                    {/* QR Code placeholder */}
                    <div className="grid grid-cols-3 gap-px">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 ${i % 3 === 0 ? 'bg-white' : 'bg-black'}`}></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold">LOCATION</p>
                </div>
              </div>
              
              {/* Contact Details */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <MapPin className="text-bronze mr-3" size={16} />
                  <span className="text-sm">
                    <strong>Location:</strong> Kigali, Rwanda/Gisozi
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-bronze mr-3" size={16} />
                  <span className="text-sm">
                    <strong>Phone:</strong> +250 784024818 / +250 786515555
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-bronze mr-3" size={16} />
                  <span className="text-sm">
                    <strong>Email:</strong> karumujess@gmail.com
                  </span>
                </div>
                <div className="flex items-center">
                  <Instagram className="text-bronze mr-3" size={16} />
                  <span className="text-sm">
                    <strong>Instagram:</strong> @kjess_designs_rw
                  </span>
                </div>
              </div>

              {/* Contact Form */}
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="luxury-input"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email"
                              {...field} 
                              className="luxury-input"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={contactForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+250 123 456 789" 
                            {...field}
                            value={field.value || ""}
                            className="luxury-input"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project..."
                            rows={5}
                            {...field} 
                            className="luxury-input"
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="luxury-button w-full text-white py-3"
                    disabled={contactMutation.isPending}
                    data-testid="button-send-message"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-italiana text-4xl md:text-6xl mb-6 text-charcoal">
              Stay Updated
            </h2>
            <p className="text-lg text-charcoal/80 mb-8">
              Subscribe to our newsletter for the latest design trends and project updates
            </p>
            
            <Form {...newsletterForm}>
              <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <FormField
                  control={newsletterForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          type="email"
                          {...field} 
                          className="luxury-input"
                          data-testid="input-newsletter-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="luxury-button text-white px-6"
                  disabled={newsletterMutation.isPending}
                  data-testid="button-subscribe-newsletter"
                >
                  {newsletterMutation.isPending ? "..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>

      {/* Client Logos Section - Matching eleventh design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="font-italiana text-2xl text-charcoal/70 mb-8">Proudly Served</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold text-sm">BANK OF KIGALI</span>
                </div>
                <p className="text-xs text-charcoal/50">Financially transforming lives</p>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold text-sm">KIGALI GOLF</span>
                </div>
                <p className="text-xs text-charcoal/50">Resort & Villas</p>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-green-700 font-bold text-sm">Green Hills Academy</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-blue-800 font-bold text-sm">GOVERNOR'S RESIDENCE</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-red-600 font-bold text-sm">SOLID AFRICA</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-gray-600 font-bold text-sm">QUESTION COFFEE</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-orange-600 font-bold text-sm">AFRICAN WILDLIFE FOUNDATION</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-red-800 font-bold text-sm">The Susan Thompson Buffett Foundation</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold text-sm">Volcanoes</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="text-yellow-600 font-bold text-sm">AFRICA'S TOUCH & LEISURE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
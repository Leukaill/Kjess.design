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
      {/* Hero Section - Sophisticated and Immersive Design */}
      <section id="home" className="relative h-screen flex overflow-hidden">
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Elegant geometric shapes */}
          <div className="absolute top-20 left-20 w-96 h-96 border border-bronze/10 rotate-45 opacity-30 animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-64 h-64 bg-gradient-to-br from-charcoal/5 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-bronze rounded-full opacity-60"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-charcoal/40 rounded-full"></div>
        </div>

        {/* Left side - Enhanced Text content with sophisticated layout */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-1/2 bg-gradient-to-br from-cream via-cream to-warm-white flex flex-col justify-center px-16 lg:px-24 relative"
        >
          {/* Elegant side accent */}
          <div className="absolute left-0 top-1/2 w-2 h-40 bg-gradient-to-b from-transparent via-bronze to-transparent transform -translate-y-1/2 opacity-60"></div>
          
          {/* Enhanced Logo with sophisticated styling */}
          <motion.div 
            initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
            className="relative mb-20 group"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-charcoal to-charcoal/90 flex items-center justify-center shadow-2xl relative overflow-hidden cursor-pointer transition-all duration-500 group-hover:shadow-3xl group-hover:-translate-y-2">
              {/* Logo background pattern */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="text-cream text-4xl font-italiana font-bold tracking-wider relative z-10 group-hover:scale-110 transition-transform duration-300">K</span>
              
              {/* Decorative corners */}
              <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-bronze/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-bronze/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Floating accent elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-bronze/20 rotate-45"
            ></motion.div>
          </motion.div>
          
          {/* Enhanced Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-12 relative"
          >
            <h1 className="font-italiana text-6xl lg:text-8xl font-normal leading-[0.85] text-charcoal tracking-wide relative">
              <span className="inline-block">KJESS</span>
              <br />
              <span className="inline-block relative">
                DESIGNS
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="text-bronze inline-block ml-2"
                >
                  .
                </motion.span>
                
              </span>
            </h1>
            
            {/* Decorative line animation */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="h-0.5 bg-gradient-to-r from-bronze to-bronze/40 mt-6"
            ></motion.div>
          </motion.div>
          
          {/* Enhanced Subtitle Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12 relative"
          >
            <p className="text-2xl lg:text-3xl text-charcoal/85 mb-4 font-italiana italic tracking-wide leading-relaxed">
              Interior Design & <span className="text-bronze font-medium">Luxury</span> Furniture
            </p>
            
            {/* Enhanced decorative elements */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-6 h-px bg-bronze"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-12 h-px bg-bronze/40"></div>
            </div>
          </motion.div>
          
          {/* Call-to-Action Elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-6"
          >
            <p className="text-lg text-charcoal/70 font-italiana font-light tracking-wider mb-6">
              Discover Our <span className="font-medium text-charcoal">Premium Portfolio</span>
            </p>
            
            {/* Interactive CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-8 py-4 border border-bronze/30 hover:bg-bronze hover:text-white transition-all duration-300 cursor-pointer group"
            >
              <span className="text-charcoal group-hover:text-white font-italiana text-sm uppercase tracking-wider font-medium">
                Explore Our Work
              </span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="w-5 h-px bg-bronze group-hover:bg-white transition-colors duration-300"
              ></motion.div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center space-x-8 mt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-italiana font-bold text-charcoal">100+</div>
                <div className="text-xs text-charcoal/60 uppercase tracking-wide">Projects</div>
              </div>
              <div className="w-px h-8 bg-bronze/30"></div>
              <div className="text-center">
                <div className="text-2xl font-italiana font-bold text-charcoal">5+</div>
                <div className="text-xs text-charcoal/60 uppercase tracking-wide">Years</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Right side - Enhanced Image with sophisticated effects */}
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 1.1 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          style={{ y: heroY }}
          className="w-1/2 h-full relative overflow-hidden group"
        >
          {/* Main Hero Image */}
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=1400&q=95"
            alt="Elegant modern interior featuring luxury furniture, artistic lighting, and sophisticated design elements"
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
          />
          
          {/* Sophisticated overlay system */}
          <div className="absolute inset-0 bg-gradient-to-l from-charcoal/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/5 via-transparent to-transparent"></div>
          
          {/* Floating design elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute top-12 right-12 bg-white/90 backdrop-blur-sm p-4 shadow-xl border border-bronze/20"
          >
            <div className="text-center">
              <div className="w-8 h-px bg-bronze mx-auto mb-2"></div>
              <p className="text-xs text-charcoal font-medium tracking-wider uppercase">Award Winning</p>
              <p className="text-xs text-charcoal/70">Design Studio</p>
            </div>
          </motion.div>

          {/* Enhanced corner accents */}
          <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-cream/40 opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cream/30 opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
          
          {/* Artistic light rays effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000">
            <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-bronze/40 to-transparent rotate-45"></div>
            <div className="absolute bottom-1/3 right-1/3 w-px h-24 bg-gradient-to-b from-transparent via-bronze/30 to-transparent -rotate-45"></div>
          </div>
        </motion.div>
      </section>

      {/* Introduction Section - Sophisticated and Luxurious Design */}
      <section className="py-32 bg-gradient-to-br from-white via-cream/10 to-white relative overflow-hidden">
        {/* Artistic background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-16 right-16 w-80 h-80 border border-bronze/15 rotate-45 opacity-60"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 border border-charcoal/8 rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-r from-bronze/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-bronze rounded-full opacity-40"></div>
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-charcoal/30 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left Column - Enhanced Artistic Image Layout */}
            <motion.div
              initial={{ opacity: 0, x: -80, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main showcase image with sophisticated multi-layer framing */}
              <div className="relative group">
                {/* Artistic backdrop layers */}
                <div className="absolute -inset-8 bg-gradient-to-br from-bronze/12 via-transparent to-charcoal/8 rotate-1 group-hover:rotate-2 transition-all duration-700 opacity-70"></div>
                <div className="absolute -inset-6 bg-gradient-to-tl from-charcoal/5 via-transparent to-bronze/8 -rotate-1 group-hover:-rotate-2 transition-all duration-1000 opacity-50"></div>
                
                {/* Enhanced main image container */}
                <div className="relative bg-white p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-700 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700&q=95"
                    alt="Contemporary living room featuring marble accent wall, modern furnishing, and sophisticated design elements"
                    className="w-full h-[520px] object-cover transition-all duration-1000 ease-out group-hover:scale-110"
                  />
                  
                  {/* Sophisticated multi-layer overlays */}
                  <div className="absolute inset-6 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-6 bg-gradient-to-br from-transparent via-transparent to-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  
                  {/* Interior frame details */}
                  <div className="absolute inset-6 border border-white/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Enhanced corner accent elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-bronze/50 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-bronze/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Floating decorative elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -15 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -top-6 -right-8 w-16 h-16 bg-bronze/20 rotate-45 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                ></motion.div>
              </div>

              {/* Floating information card */}
              <motion.div
                initial={{ opacity: 0, y: 60, x: -40 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="absolute -bottom-12 -left-12 bg-white shadow-2xl p-6 border border-bronze/30 hover:shadow-3xl transition-all duration-500 group cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-3"></div>
                  <h4 className="font-italiana text-lg font-bold text-charcoal tracking-wider mb-1">
                    CREATIVE VISION
                  </h4>
                  <p className="text-sm text-charcoal/70 font-light">
                    Where artistry meets functionality
                  </p>
                  <div className="w-8 h-px bg-bronze/40 mx-auto mt-3"></div>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-1 right-1 w-4 h-4 border-r border-t border-bronze/30"></div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Enhanced Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Enhanced side decoration */}
              <div className="absolute -left-12 top-0 flex flex-col items-center opacity-60">
                <div className="w-px h-20 bg-gradient-to-b from-bronze/80 to-transparent"></div>
                <div className="w-3 h-3 bg-bronze/60 rounded-full my-3"></div>
                <div className="w-px h-20 bg-gradient-to-t from-bronze/80 to-transparent"></div>
                <div className="w-2 h-2 bg-bronze/40 rounded-full mt-6"></div>
              </div>
              
              {/* Enhanced Typography section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="relative">
                  <h2 className="font-italiana text-7xl md:text-8xl mb-8 text-charcoal leading-[0.8] tracking-wider relative">
                    INTRO<span className="text-bronze">DUCTION</span>
                  </h2>
                  {/* Enhanced decorative underline */}
                  <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-bronze via-bronze/60 to-transparent"></div>
                </div>
                
                <p className="text-xl text-charcoal/70 font-light italic tracking-wide mt-6">
                  Where creativity meets exceptional craftsmanship
                </p>
              </motion.div>
              
              {/* Enhanced content with better typography hierarchy */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="relative">
                  {/* Decorative quote mark */}
                  <div className="absolute -top-4 -left-8 text-6xl text-bronze/20 font-serif leading-none">"</div>
                  
                  <div className="pl-6 space-y-6">
                    <p className="text-xl leading-relaxed text-charcoal/85 font-light tracking-wide">
                      Kjess Designs is where <span className="font-italiana italic text-bronze font-medium">creativity meets craftsmanship</span>. 
                      We are a Rwandan-based interior design and furniture company dedicated to
                      transforming spaces into <span className="font-medium text-charcoal">timeless masterpieces</span>.
                    </p>
                    
                    <p className="text-xl leading-relaxed text-charcoal/85 font-light tracking-wide">
                      With unwavering commitment to <span className="font-italiana italic text-bronze">excellence, elegance, and innovation</span>, we
                      bring your visions to life through thoughtful design and superior
                      <span className="font-italiana text-bronze font-medium"> attention to detail</span>.
                    </p>
                  </div>
                </div>

                {/* Enhanced elegant separator with animation */}
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.9 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-bronze/70 to-bronze/70"></div>
                    <div className="relative">
                      <div className="w-4 h-4 bg-bronze/50 rounded-full"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-bronze/30 rounded-full animate-ping"></div>
                    </div>
                    <div className="w-20 h-px bg-gradient-to-l from-transparent via-bronze/70 to-bronze/70"></div>
                  </div>
                </motion.div>

                {/* Call to action section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-cream/50 to-white p-6 border-l-4 border-bronze relative"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-bronze/20"></div>
                  <h4 className="font-italiana text-2xl font-bold text-charcoal mb-3 tracking-wide">
                    Our Promise
                  </h4>
                  <p className="text-charcoal/70 leading-relaxed">
                    Every project we undertake is a testament to our dedication to creating spaces that not only inspire but also reflect the unique personality and lifestyle of our clients.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Section - Sophisticated Journey & Heritage Design */}
      <section className="py-32 bg-gradient-to-b from-cream via-warm-white to-cream relative overflow-hidden">
        {/* Artistic background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 border border-bronze/12 rotate-12 opacity-50"></div>
          <div className="absolute bottom-16 left-16 w-80 h-80 border border-charcoal/8 -rotate-12 opacity-40"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-bronze/8 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/5 w-3 h-3 bg-bronze/30 rounded-full"></div>
          <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-charcoal/25 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left Column - Enhanced Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative"
            >
              {/* Decorative side element */}
              <div className="absolute -left-8 top-0 flex flex-col items-center opacity-50">
                <div className="w-px h-24 bg-gradient-to-b from-bronze/60 to-transparent"></div>
                <div className="w-4 h-4 bg-bronze/40 rounded-full my-4"></div>
                <div className="w-px h-24 bg-gradient-to-t from-bronze/60 to-transparent"></div>
              </div>

              {/* Enhanced title section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="relative">
                  <h2 className="font-italiana text-7xl md:text-8xl mb-8 text-charcoal leading-[0.8] tracking-wider">
                    OUR <span className="text-bronze">HERITAGE</span>
                  </h2>
                  {/* Enhanced decorative underline */}
                  <div className="absolute -bottom-2 left-0 w-40 h-1 bg-gradient-to-r from-bronze via-bronze/60 to-bronze/20"></div>
                </div>
                
                <p className="text-xl text-charcoal/70 font-light italic tracking-wide mt-8">
                  A decade of design excellence and innovation
                </p>
              </motion.div>
              
              {/* Enhanced content sections */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Timeline-style content blocks */}
                <div className="relative">
                  <div className="absolute -left-4 top-2 w-2 h-2 bg-bronze/60 rounded-full"></div>
                  <div className="pl-8">
                    <h4 className="font-italiana text-xl font-semibold text-charcoal mb-3 tracking-wide">
                      The Beginning
                    </h4>
                    <p className="text-lg leading-relaxed text-charcoal/85 font-light tracking-wide">
                      Founded over a decade ago, Kjess Designs began as a 
                      <span className="font-italiana italic text-bronze font-medium"> small design studio</span> with a passion for refined interiors and handcrafted furniture.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-4 top-2 w-2 h-2 bg-bronze/60 rounded-full"></div>
                  <div className="pl-8">
                    <h4 className="font-italiana text-xl font-semibold text-charcoal mb-3 tracking-wide">
                      Growth & Recognition
                    </h4>
                    <p className="text-lg leading-relaxed text-charcoal/85 font-light tracking-wide">
                      Through years of dedication, we have grown into a 
                      <span className="font-medium text-charcoal">trusted name in Rwanda's design industry</span>, collaborating with
                      individuals, luxury residences, and institutions to deliver exceptional spaces.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-4 top-2 w-2 h-2 bg-bronze/60 rounded-full"></div>
                  <div className="pl-8">
                    <h4 className="font-italiana text-xl font-semibold text-charcoal mb-3 tracking-wide">
                      Our Philosophy
                    </h4>
                    <p className="text-lg leading-relaxed text-charcoal/85 font-light tracking-wide">
                      Our journey has been shaped by a 
                      <span className="font-italiana italic text-bronze">relentless pursuit of quality</span> and a deep understanding of 
                      <span className="font-medium text-charcoal">design aesthetics</span>.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced call-to-action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 bg-white p-6 border-l-4 border-bronze shadow-lg relative"
              >
                <div className="absolute top-0 right-0 w-10 h-10 border-r border-t border-bronze/25"></div>
                <h4 className="font-italiana text-xl font-bold text-charcoal mb-2 tracking-wide">
                  Legacy of Excellence
                </h4>
                <p className="text-charcoal/70 leading-relaxed">
                  Every project we complete adds to our rich heritage of transforming ordinary spaces into extraordinary experiences.
                </p>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Enhanced Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              {/* Sophisticated gallery layout with overlapping elements */}
              <div className="relative">
                {/* Background artistic elements */}
                <div className="absolute -inset-12 bg-gradient-to-br from-bronze/8 via-transparent to-charcoal/5 rotate-3 opacity-40"></div>
                
                {/* Main gallery grid */}
                <div className="relative grid grid-cols-2 gap-6">
                  {/* Primary showcase image */}
                  <motion.div
                    initial={{ opacity: 0, y: 40, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="col-span-2 bg-white p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 group relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=500"
                      alt="Modern living room with sophisticated design elements and natural lighting"
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    
                    {/* Image overlay */}
                    <div className="absolute inset-4 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Corner accents */}
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-bronze/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.div>
                  
                  {/* Secondary images with staggered animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 60, rotate: 2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-500 group relative"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350"
                      alt="Elegant contemporary furniture and design details"
                      className="w-full h-40 object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    
                    {/* Floating label */}
                    <div className="absolute -bottom-2 -left-2 bg-bronze/90 text-white px-3 py-1 text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      THEN
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 60, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-500 group relative mt-8"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=350"
                      alt="Modern luxury interior with sophisticated artistic elements"
                      className="w-full h-40 object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    
                    {/* Floating label */}
                    <div className="absolute -bottom-2 -right-2 bg-charcoal text-white px-3 py-1 text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      NOW
                    </div>
                  </motion.div>
                </div>

                {/* Floating milestone badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  viewport={{ once: true }}
                  className="absolute -top-8 -left-8 bg-white shadow-2xl p-6 border border-bronze/30 hover:shadow-3xl transition-all duration-500 group cursor-pointer"
                >
                  <div className="text-center">
                    <div className="w-12 h-px bg-bronze mx-auto mb-3"></div>
                    <div className="text-3xl font-italiana font-bold text-charcoal mb-1">10+</div>
                    <p className="text-xs text-charcoal/70 font-medium tracking-wider uppercase">Years</p>
                    <p className="text-xs text-charcoal/60 mt-1">Of Excellence</p>
                    <div className="w-6 h-px bg-bronze/40 mx-auto mt-2"></div>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-bronze/40"></div>
                </motion.div>

                {/* Floating achievement badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 bg-bronze text-white p-4 shadow-2xl hover:shadow-3xl transition-all duration-500"
                >
                  <div className="text-center">
                    <div className="text-2xl font-italiana font-bold mb-1">100+</div>
                    <p className="text-xs font-medium tracking-wide uppercase">Projects</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced elegant design */}
      <section id="services" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background decorative elements */}
        <div className="absolute top-10 right-10 w-96 h-96 border border-bronze/5 rotate-12 opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 border border-charcoal/5 rotate-45 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            {/* Left side - Enhanced image layout with integrated branding */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main image with sophisticated framing */}
              <div className="relative group mb-8">
                {/* Decorative shadow frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-bronze/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative bg-white p-2 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Modern living room with round wooden coffee table, plants, and natural lighting"
                    className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  
                  {/* Elegant overlay gradient */}
                  <div className="absolute inset-2 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Redesigned branding card - positioned as floating element */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -right-8 bg-white shadow-2xl border border-bronze/20 overflow-hidden group/card hover:shadow-3xl transition-all duration-500"
              >
                {/* Card content with better proportions */}
                <div className="w-64 p-6">
                  {/* Image section */}
                  <div className="mb-4 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
                      alt="Elegant modern furniture showcase"
                      className="w-full h-32 object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                  </div>
                  
                  {/* Branding section with enhanced typography */}
                  <div className="text-center relative">
                    {/* Decorative line above */}
                    <div className="w-16 h-px bg-bronze mx-auto mb-3"></div>
                    
                    <h4 className="font-italiana text-lg font-bold mb-2 text-charcoal tracking-wider">
                      KJESS DESIGNS
                    </h4>
                    <p className="text-sm text-charcoal/80 font-light tracking-wide mb-3">
                      Interior Design Studio
                    </p>
                    
                    {/* Decorative line below */}
                    <div className="w-8 h-px bg-bronze/40 mx-auto"></div>
                  </div>
                </div>
                
                {/* Subtle accent corner */}
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-bronze/30"></div>
              </motion.div>
            </motion.div>

            {/* Right side - Enhanced services list */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Enhanced title with decorative elements */}
              <div className="mb-16">
                <div className="relative">
                  <h2 className="font-italiana text-6xl md:text-7xl mb-4 text-charcoal leading-tight tracking-wide">
                    OUR SERVICES
                  </h2>
                  {/* Decorative accent */}
                  <div className="w-24 h-1 bg-gradient-to-r from-bronze to-bronze/40 mb-8"></div>
                </div>
              </div>
              
              {/* Enhanced services list with better spacing and hover effects */}
              <div className="space-y-8 text-base text-charcoal/90 leading-relaxed">
                {[
                  "Interior design & space planning",
                  "3D visualization & material selection", 
                  "Custom-made furniture (sofas, chairs, Outdoor Lounge, TV stands, Dinning tables, etc.)",
                  "Bespoke joinery (kitchens, closets, doors, wall & ceiling panels)",
                  "Curtain treatment & window dressing",
                  "Lighting selection & decorative lighting solutions",
                  "Turnkey interior fit-outs & project management",
                  "Metal-wood furniture integration",
                  "Styling & final interior accessorizing"
                ].map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start group/item hover:translate-x-2 transition-transform duration-300"
                  >
                    <span className="text-bronze mr-4 text-lg font-bold mt-1 group-hover/item:scale-125 transition-transform duration-300">•</span>
                    <span className="group-hover/item:text-charcoal transition-colors duration-300">{service}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Subtle decorative element at bottom */}
              <div className="mt-16 flex justify-end">
                <div className="w-32 h-px bg-gradient-to-r from-transparent to-bronze/30"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section - Sophisticated and Aesthetic Design */}
      <section className="py-32 bg-gradient-to-br from-cream via-white to-cream/50 relative overflow-hidden">
        {/* Elegant background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 border border-bronze/8 rotate-45 opacity-40"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-charcoal/5 rotate-12 opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-bronze/5 to-transparent rounded-full opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Enhanced Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="relative inline-block">
              {/* Decorative elements around title */}
              <div className="absolute -top-8 -left-8 w-16 h-16 border border-bronze/20 rotate-45 opacity-60"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-bronze/10 rotate-12"></div>
              
              <h2 className="font-italiana text-6xl md:text-8xl mb-6 text-charcoal leading-tight tracking-wide relative">
                A LITTLE <span className="text-bronze">About</span> Us
              </h2>
              
              {/* Elegant underline with gradient */}
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-8"></div>
            </div>
            
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto font-light italic tracking-wide">
              Crafting spaces that tell your story
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-16 items-center">
            {/* Left Column - Artistic Image Layout */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Main featured image with sophisticated framing */}
              <div className="relative">
                {/* Artistic shadow overlay */}
                <div className="absolute -inset-6 bg-gradient-to-br from-bronze/15 via-transparent to-charcoal/10 rotate-1 group-hover:rotate-2 transition-transform duration-700"></div>
                
                {/* Main image container */}
                <div className="relative bg-white p-4 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700"
                    alt="Elegant interior design showcase with modern furniture and artistic lighting"
                    className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Elegant overlay gradient */}
                  <div className="absolute inset-4 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Floating accent elements */}
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-bronze/20 rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 border-2 border-bronze/40 rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </div>

              {/* Floating info card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -right-8 bg-white shadow-xl p-6 border border-bronze/20 hover:shadow-2xl transition-all duration-500"
              >
                <div className="text-center">
                  <div className="w-12 h-px bg-bronze mx-auto mb-3"></div>
                  <h4 className="font-italiana text-lg font-bold text-charcoal tracking-wider mb-2">
                    SINCE 2020
                  </h4>
                  <p className="text-sm text-charcoal/70 font-light">
                    Excellence in Design
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Center Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8 relative"
            >
              {/* Decorative quote mark */}
              <div className="absolute -top-6 -left-4 text-6xl text-bronze/20 font-serif">"</div>
              
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-charcoal/80 font-light relative pl-8">
                  At Kjess Designs, we specialize in interior design solutions and
                  custom-made furniture that reflect <span className="font-medium text-charcoal">elegance, comfort, and purpose</span>.
                </p>
                
                <p className="text-lg leading-relaxed text-charcoal/80 font-light pl-8">
                  Our team of talented designers and skilled artisans works closely
                  with clients to craft environments that are both <span className="italic text-bronze">functional and
                  inspiring</span>.
                </p>
                
                <p className="text-lg leading-relaxed text-charcoal/80 font-light pl-8">
                  From contemporary to classic styles, we curate every
                  detail to align with your <span className="font-medium">personality and lifestyle</span>.
                </p>
              </div>

              {/* Enhanced call-to-action element */}
              <div className="pt-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-px bg-gradient-to-r from-bronze to-transparent"></div>
                  <div className="bg-white px-6 py-3 border border-bronze/30 hover:bg-bronze hover:text-white transition-all duration-300 cursor-pointer group">
                    <span className="text-charcoal group-hover:text-white uppercase tracking-wider text-sm font-medium">
                      Our Philosophy
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stats and Features */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Stats cards */}
              <div className="space-y-6">
                {[
                  { number: "100+", label: "Projects Completed", accent: "bronze" },
                  { number: "50+", label: "Happy Clients", accent: "charcoal" },
                  { number: "5+", label: "Years Experience", accent: "bronze" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-bronze/30 hover:border-bronze group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 ${stat.accent === 'bronze' ? 'bg-bronze' : 'bg-charcoal'} rounded-full group-hover:scale-150 transition-transform duration-300`}></div>
                      <div>
                        <h3 className="text-3xl font-italiana font-bold text-charcoal mb-1">
                          {stat.number}
                        </h3>
                        <p className="text-sm text-charcoal/70 uppercase tracking-wider font-medium">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feature highlight */}
              <div className="bg-gradient-to-br from-bronze/10 to-charcoal/5 p-6 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-bronze/20"></div>
                
                <h4 className="font-italiana text-xl font-bold text-charcoal mb-3 tracking-wide">
                  Our Expertise
                </h4>
                <div className="space-y-2 text-sm text-charcoal/80">
                  <p>• Luxury Interior Design</p>
                  <p>• Custom Furniture Creation</p>
                  <p>• Space Optimization</p>
                  <p>• Project Management</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-bronze/40 to-transparent mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section - Sophisticated and Inspiring Design */}
      <section className="py-32 bg-gradient-to-b from-white via-cream/20 to-white relative overflow-hidden">
        {/* Artistic background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-bronze/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-tl from-charcoal/10 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        {/* Decorative geometric shapes */}
        <div className="absolute top-16 right-16 w-24 h-24 border border-bronze/15 rotate-45 opacity-40"></div>
        <div className="absolute bottom-24 left-24 w-32 h-32 border-2 border-charcoal/10 rotate-12 opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header with enhanced typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="relative inline-block">
              <h2 className="font-italiana text-7xl md:text-8xl text-charcoal leading-tight tracking-wide relative">
                OUR <span className="text-bronze">MISSION</span>
              </h2>
              {/* Elegant underline */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent"></div>
            </div>
            <p className="text-xl text-charcoal/60 mt-8 font-light italic tracking-wide">
              Transforming spaces, enriching lives
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column - Enhanced Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Main showcase image with sophisticated framing */}
              <div className="relative group">
                {/* Artistic backdrop */}
                <div className="absolute -inset-8 bg-gradient-to-br from-bronze/10 via-transparent to-charcoal/5 rotate-1 group-hover:rotate-2 transition-transform duration-700 opacity-60"></div>
                
                {/* Primary image container */}
                <div className="relative bg-white p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=500"
                    alt="Elegant modern workspace with custom furniture and artistic lighting"
                    className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Sophisticated overlay */}
                  <div className="absolute inset-6 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Corner accent */}
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-bronze/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Floating showcase cards */}
              <motion.div
                initial={{ opacity: 0, y: 60, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -8 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -top-8 -right-12 bg-white p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
                  alt="Luxury furniture craftsmanship detail"
                  className="w-32 h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="mt-2 text-center">
                  <p className="text-xs text-charcoal/70 font-medium tracking-wide">CRAFTSMANSHIP</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 60, rotate: 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-12 -left-8 bg-white p-4 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
                  alt="Modern interior design excellence"
                  className="w-32 h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="mt-2 text-center">
                  <p className="text-xs text-charcoal/70 font-medium tracking-wide">INNOVATION</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Enhanced Mission Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Mission statement with enhanced typography */}
              <div className="relative">
                {/* Decorative quote */}
                <div className="absolute -top-8 -left-6 text-8xl text-bronze/20 font-serif leading-none">"</div>
                
                <div className="space-y-6 pl-8">
                  <p className="text-xl leading-relaxed text-charcoal/85 font-light">
                    To create <span className="font-medium text-charcoal">beautiful, functional, and inspiring</span> interior spaces by
                    combining design expertise with premium craftsmanship.
                  </p>
                  
                  <p className="text-xl leading-relaxed text-charcoal/85 font-light">
                    We strive to exceed our clients' expectations through 
                    <span className="italic text-bronze"> professionalism, creativity</span>, and a deep commitment to quality.
                  </p>
                </div>
              </div>

              {/* Mission pillars */}
              <div className="space-y-6">
                <h3 className="font-italiana text-2xl font-bold text-charcoal mb-6 tracking-wide">
                  Our Foundation
                </h3>
                
                <div className="space-y-4">
                  {[
                    { icon: "✦", title: "Excellence", desc: "Uncompromising quality in every detail" },
                    { icon: "◆", title: "Innovation", desc: "Cutting-edge design solutions" },
                    { icon: "★", title: "Dedication", desc: "Committed to client satisfaction" }
                  ].map((pillar, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4 group hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="text-bronze text-xl mt-1 group-hover:scale-125 transition-transform duration-300">
                        {pillar.icon}
                      </div>
                      <div>
                        <h4 className="font-italiana text-lg font-semibold text-charcoal mb-1">
                          {pillar.title}
                        </h4>
                        <p className="text-charcoal/70 text-sm leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Call to action element */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="pt-8"
              >
                <div className="bg-gradient-to-r from-cream to-white p-6 border-l-4 border-bronze relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-bronze/20"></div>
                  
                  <div className="relative">
                    <h4 className="font-italiana text-xl font-bold text-charcoal mb-2 tracking-wide">
                      Ready to Transform Your Space?
                    </h4>
                    <p className="text-charcoal/70 text-sm mb-4">
                      Let's bring your vision to life with our expertise and craftsmanship.
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-px bg-bronze"></div>
                      <span className="text-bronze text-sm font-medium tracking-wider uppercase">
                        Start Your Journey
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <div className="inline-flex items-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-bronze/40"></div>
              <div className="w-3 h-3 bg-bronze rounded-full opacity-60"></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-bronze/40"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section - Sophisticated & Elegant Design */}
      <section className="py-32 bg-gradient-to-br from-charcoal via-charcoal/98 to-charcoal relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 border border-bronze/10 rotate-45 opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-bronze/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-bronze/40 rounded-full opacity-70"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-cream/30 rounded-full"></div>
          
          {/* Floating geometric patterns */}
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.15, rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/2 w-64 h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent"
          ></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Enhanced header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* Decorative accent line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-8"
            ></motion.div>
            
            <h2 className="font-italiana text-6xl md:text-8xl mb-6 text-cream leading-tight tracking-wide">
              OUR CREATIVE
              <span className="block text-bronze">TEAM</span>
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-bronze/60"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-16 h-px bg-bronze/40"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-12 h-px bg-bronze/60"></div>
            </div>
            
            <p className="text-lg text-cream/80 font-light tracking-wide max-w-2xl mx-auto">
              Meet the talented individuals who bring your design visions to life
            </p>
          </motion.div>

          {/* Team members grid */}
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Jessica Karumu",
                role: "Founder & Creative Director",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b739?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                bio: "Leading visionary with over 5 years of experience in luxury interior design",
                linkedin: "#",
                instagram: "@kjess_designs_rw",
                twitter: "#"
              },
              {
                name: "David Uwimana",
                role: "Senior Interior Designer",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                bio: "Specialist in modern and contemporary design with a passion for sustainable materials",
                linkedin: "#",
                instagram: "#",
                twitter: "#"
              },
              {
                name: "Sarah Mukamana",
                role: "Project Manager & Designer",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                bio: "Expert in project coordination and client relations with eye for detail",
                linkedin: "#",
                instagram: "#",
                twitter: "#"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Decorative frame */}
                <div className="absolute -inset-2 bg-gradient-to-br from-bronze/15 via-transparent to-bronze/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-cream/5 backdrop-blur-sm border border-cream/10 hover:border-bronze/30 transition-all duration-500 group-hover:bg-cream/10 overflow-hidden">
                  {/* Member image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent"></div>
                    
                    {/* Social media overlay */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center justify-center space-x-4">
                        <a href={member.linkedin} className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-bronze hover:text-white transition-all duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a href={member.instagram} className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-bronze hover:text-white transition-all duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                        <a href={member.twitter} className="w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-bronze hover:text-white transition-all duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Member info */}
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="font-italiana text-2xl text-cream mb-2 group-hover:text-bronze/90 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-bronze text-sm font-medium tracking-wider uppercase mb-4">
                        {member.role}
                      </p>
                      <div className="w-12 h-px bg-bronze/60 mx-auto group-hover:w-16 transition-all duration-300"></div>
                    </div>
                    
                    <p className="text-cream/80 text-sm leading-relaxed font-light text-center group-hover:text-cream transition-colors duration-300">
                      {member.bio}
                    </p>
                  </div>
                  
                  {/* Bottom decorative accent */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="inline-flex items-center space-x-6">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-bronze/50"></div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-bronze/60 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-bronze/40 rounded-full"></div>
                <div className="w-2 h-2 bg-bronze/60 rounded-full animate-pulse"></div>
              </div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-bronze/50"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Sophisticated Portfolio Showcase */}
      <section id="gallery" className="py-32 bg-gradient-to-b from-cream via-warm-white to-cream relative overflow-hidden">
        {/* Artistic background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-80 h-80 border border-bronze/15 rotate-45 opacity-50"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 border border-charcoal/10 -rotate-12 opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-bronze/8 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-bronze/40 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-charcoal/30 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Enhanced Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="relative inline-block">
              {/* Decorative elements around title */}
              <div className="absolute -top-8 -left-8 w-20 h-20 border border-bronze/25 rotate-45 opacity-60"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-bronze/15 rotate-12"></div>
              
              <h2 className="font-italiana text-7xl md:text-9xl mb-8 text-charcoal leading-[0.8] tracking-wider relative">
                GALLERY
              </h2>
              
              {/* Enhanced decorative underline */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-bronze to-transparent"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <p className="font-italiana text-2xl text-charcoal/70 font-light italic tracking-wide mb-4">
                PROJECT HIGHLIGHTS & PORTFOLIO SHOWCASE
              </p>
              
              {/* Elegant separator */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-bronze/60"></div>
                <div className="w-3 h-3 bg-bronze/40 rounded-full"></div>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-bronze/60"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Gallery Grid */}
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left Column - Featured Projects */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="relative">
                <h3 className="font-italiana text-2xl font-bold text-charcoal mb-6 tracking-wide">
                  Featured Projects
                </h3>
                <div className="w-20 h-px bg-bronze/60 mb-8"></div>
              </div>
              
              {/* Sophisticated image grid */}
              <div className="space-y-8">
                {/* Primary showcase image */}
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Artistic backdrop */}
                  <div className="absolute -inset-6 bg-gradient-to-br from-bronze/12 via-transparent to-charcoal/8 rotate-1 group-hover:rotate-2 transition-all duration-700 opacity-60"></div>
                  
                  <div className="relative bg-white p-4 shadow-2xl group-hover:shadow-3xl transition-all duration-700">
                    <img
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
                      alt="Modern dining room featuring elegant pendant lighting and sophisticated furniture arrangement"
                      className="w-full h-64 object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Image overlay */}
                    <div className="absolute inset-4 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Corner accent */}
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-bronze/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Project label */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-4 -right-4 bg-bronze text-white px-4 py-2 shadow-xl"
                  >
                    <span className="text-xs font-medium tracking-wider uppercase">Dining Excellence</span>
                  </motion.div>
                </motion.div>

                {/* Secondary images grid */}
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 40, rotate: -2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="bg-white p-3 shadow-xl group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <img
                        src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=250"
                        alt="Contemporary lighting fixtures with artistic design elements"
                        className="w-full h-32 object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Floating category badge */}
                    <div className="absolute -top-2 -left-2 bg-white shadow-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-charcoal font-medium tracking-wide">LIGHTING</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40, rotate: 2 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="relative group mt-4"
                  >
                    <div className="bg-white p-3 shadow-xl group-hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <img
                        src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=250"
                        alt="Luxury leather furniture showcasing premium craftsmanship"
                        className="w-full h-32 object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Floating category badge */}
                    <div className="absolute -top-2 -right-2 bg-charcoal text-white shadow-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-medium tracking-wide">FURNITURE</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Center Column - Signature Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Signature project showcase */}
              <div className="relative group">
                {/* Artistic multi-layer backdrop */}
                <div className="absolute -inset-8 bg-gradient-to-br from-bronze/15 via-transparent to-charcoal/10 rotate-2 group-hover:rotate-3 transition-all duration-1000 opacity-50"></div>
                <div className="absolute -inset-6 bg-gradient-to-tl from-charcoal/8 via-transparent to-bronze/12 -rotate-1 group-hover:-rotate-2 transition-all duration-1200 opacity-40"></div>
                
                <div className="relative bg-white p-6 shadow-3xl group-hover:shadow-4xl transition-all duration-700">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700"
                    alt="Signature interior design project featuring modern elegance and sophisticated spatial arrangement"
                    className="w-full h-96 object-cover transition-all duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Multi-layer overlays */}
                  <div className="absolute inset-6 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-6 bg-gradient-to-br from-transparent via-transparent to-bronze/15 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  
                  {/* Interior frame */}
                  <div className="absolute inset-6 border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Enhanced corner accents */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-bronze/60 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-bronze/60 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </div>

              {/* Signature project info card */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -left-8 bg-white shadow-2xl p-6 border border-bronze/30 hover:shadow-3xl transition-all duration-500"
              >
                <div className="text-center">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-3"></div>
                  <h4 className="font-italiana text-xl font-bold text-charcoal tracking-wider mb-2">
                    SIGNATURE PROJECT
                  </h4>
                  <p className="text-sm text-charcoal/70 font-light mb-3">
                    Award-winning interior excellence
                  </p>
                  <div className="w-8 h-px bg-bronze/40 mx-auto"></div>
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-1 right-1 w-4 h-4 border-r border-t border-bronze/40"></div>
              </motion.div>
            </motion.div>

            {/* Right Column - Portfolio Details & Categories */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="relative">
                <h3 className="font-italiana text-2xl font-bold text-charcoal mb-6 tracking-wide">
                  Our Expertise
                </h3>
                <div className="w-20 h-px bg-bronze/60 mb-8"></div>
              </div>

              {/* Portfolio categories */}
              <div className="space-y-6">
                {[
                  { 
                    title: "Residential Interiors", 
                    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                    alt: "Elegant residential interior with modern furniture and sophisticated design",
                    projects: "45+ Projects" 
                  },
                  { 
                    title: "Commercial Spaces", 
                    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                    alt: "Professional commercial interior with contemporary lighting and furniture",
                    projects: "30+ Projects" 
                  },
                  { 
                    title: "Custom Furniture", 
                    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
                    alt: "Luxury custom furniture pieces showcasing exceptional craftsmanship",
                    projects: "100+ Pieces" 
                  }
                ].map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, x: 20 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="w-24 h-20 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.alt}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      <div className="flex-1 p-4">
                        <h4 className="font-italiana text-lg font-semibold text-charcoal mb-1 tracking-wide">
                          {category.title}
                        </h4>
                        <p className="text-sm text-charcoal/70 font-medium tracking-wider">
                          {category.projects}
                        </p>
                      </div>
                      
                      <div className="pr-4">
                        <div className="w-6 h-px bg-bronze opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Hover accent */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-bronze transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced call-to-action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                viewport={{ once: true }}
                className="pt-8"
              >
                <div className="bg-gradient-to-r from-cream to-white p-6 border-l-4 border-bronze shadow-lg relative">
                  <div className="absolute top-0 right-0 w-10 h-10 border-r border-t border-bronze/25"></div>
                  <h4 className="font-italiana text-xl font-bold text-charcoal mb-2 tracking-wide">
                    View Complete Portfolio
                  </h4>
                  <p className="text-charcoal/70 leading-relaxed mb-4">
                    Explore our extensive collection of transformative interior design projects.
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-px bg-bronze"></div>
                    <span className="text-bronze text-sm font-medium tracking-wider uppercase">
                      Discover More
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <div className="inline-flex items-center space-x-6">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-bronze/50"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                <div className="w-3 h-3 bg-bronze/40 rounded-full"></div>
                <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              </div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-bronze/50"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visionary Transition Divider */}
      <div className="h-32 bg-gradient-to-b from-white via-cream/20 to-cream/60 relative overflow-hidden">
        {/* Floating particles animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          {/* Animated light rays */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateZ: 0 }}
            whileInView={{ opacity: 0.3, scale: 1.2, rotateZ: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-96 h-px bg-gradient-to-r from-transparent via-bronze/30 to-transparent transform -translate-x-1/2 -translate-y-1/2"
          ></motion.div>
          
          {/* Floating geometric elements */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: -100 }}
            whileInView={{ opacity: 0.6, y: -20, x: 100 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute top-8 left-1/4 w-2 h-2 bg-bronze/40 rounded-full"
          ></motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20, x: 100 }}
            whileInView={{ opacity: 0.4, y: 20, x: -100 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
            className="absolute bottom-8 right-1/4 w-3 h-3 border border-charcoal/20 rotate-45"
          ></motion.div>
          
          {/* Central vision symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, type: "spring", stiffness: 100 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="w-12 h-12 border-2 border-bronze/30 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="w-4 h-4 bg-bronze/60 rounded-full"
                ></motion.div>
              </div>
              {/* Pulsing ring */}
              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                whileInView={{ opacity: [0, 0.5, 0], scale: [1, 1.8, 2.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
                className="absolute inset-0 border border-bronze/20 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Vision Section - Compact & Aesthetic Design */}
      <section className="py-20 bg-gradient-to-br from-cream/60 via-white to-warm-white/80 relative overflow-hidden">
        {/* Elegant background elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-8 right-16 w-32 h-32 border border-bronze/20 rotate-45"></div>
          <div className="absolute bottom-8 left-16 w-24 h-24 bg-gradient-to-br from-charcoal/5 to-transparent rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-bronze rounded-full opacity-60"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Compact Image Collage */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-3 h-64"
              >
                {/* Main focal image */}
                <div className="relative overflow-hidden group col-span-2 h-32">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
                    alt="Luxury interior design vision"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/20 via-transparent to-transparent"></div>
                  
                  {/* Floating accent */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs text-charcoal font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Excellence
                  </div>
                </div>
                
                {/* Two smaller accent images */}
                <div className="relative overflow-hidden group h-28">
                  <img
                    src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
                    alt="Design innovation"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="relative overflow-hidden group h-28">
                  <img
                    src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
                    alt="Interior craftsmanship"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
              
              {/* Decorative frame element */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-r-2 border-b-2 border-bronze/30"></div>
            </div>
            
            {/* Right: Enhanced Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Compact header with decorative element */}
              <div className="relative">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-px bg-bronze"></div>
                  <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                  <div className="text-bronze text-sm font-medium tracking-wider uppercase">Our Vision</div>
                </div>
                
                <h2 className="font-italiana text-4xl md:text-5xl text-charcoal leading-tight mb-6">
                  Transforming
                  <span className="block text-bronze">Dreams into Reality</span>
                </h2>
              </div>
              
              {/* Enhanced description */}
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-charcoal/80 font-light">
                  To be Rwanda's leading interior design and bespoke furniture company, 
                  recognized for transforming everyday spaces into extraordinary experiences.
                </p>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-bronze/60 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    Setting industry benchmarks through innovation, design integrity, and exceptional client satisfaction.
                  </p>
                </div>
              </div>
              
              {/* Compact stats or highlight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6 pt-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-italiana font-bold text-charcoal">Excellence</div>
                  <div className="text-xs text-charcoal/60 uppercase tracking-wide">Driven</div>
                </div>
                <div className="w-px h-8 bg-bronze/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-italiana font-bold text-charcoal">Innovation</div>
                  <div className="text-xs text-charcoal/60 uppercase tracking-wide">Focused</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Testimonials Section - Sophisticated & Elegant Design */}
      <section className="py-32 bg-charcoal relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal/90"></div>
          <div className="absolute top-20 right-20 w-80 h-80 border border-bronze/15 rotate-45 opacity-40"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-bronze/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-bronze/60 rounded-full opacity-70"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-cream/40 rounded-full"></div>
          
          {/* Elegant floating geometric patterns */}
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.2, rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-16 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-bronze/30 to-transparent"
          ></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Enhanced header with sophisticated styling */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* Decorative accent line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-8"
            ></motion.div>
            
            <div className="relative">
              <h2 className="font-italiana text-5xl md:text-7xl mb-6 text-cream leading-tight tracking-wide">
                CLIENT
                <span className="block text-bronze">TESTIMONIALS</span>
              </h2>
              
              {/* Floating accent elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="absolute -top-4 -right-4 w-6 h-6 border border-bronze/40 rotate-45"
              ></motion.div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-bronze/60"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-16 h-px bg-bronze/40"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-12 h-px bg-bronze/60"></div>
            </div>
            
            <p className="text-lg text-cream/80 font-light tracking-wide">What our valued clients say about us</p>
          </motion.div>

          {/* Enhanced testimonials grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Decorative frame */}
                <div className="absolute -inset-1 bg-gradient-to-br from-bronze/20 via-transparent to-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-cream/8 backdrop-blur-sm p-8 border border-cream/15 hover:border-bronze/30 transition-all duration-500 group-hover:bg-cream/12 group-hover:shadow-2xl">
                  {/* Quote section with enhanced styling */}
                  <div className="mb-8 relative">
                    {/* Artistic quote mark */}
                    <div className="relative mb-6">
                      <Quote className="text-bronze mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300" size={36} />
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Enhanced star rating */}
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.2 + i * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Star className="text-bronze fill-bronze group-hover:scale-110 transition-transform duration-300" size={18} />
                        </motion.div>
                      ))}
                      <div className="ml-4 w-8 h-px bg-bronze/40 group-hover:bg-bronze/60 transition-colors duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced testimonial content */}
                  <div className="relative mb-8">
                    <p className="text-cream/90 leading-relaxed font-light text-base italic group-hover:text-cream transition-colors duration-300">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Decorative accent */}
                    <div className="absolute -right-4 top-4 w-1 h-12 bg-gradient-to-b from-bronze/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Enhanced client info */}
                  <div className="relative">
                    <div className="h-px bg-gradient-to-r from-bronze/40 via-cream/20 to-transparent mb-6 group-hover:from-bronze/60 transition-colors duration-300"></div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Client avatar placeholder */}
                      <div className="w-12 h-12 bg-gradient-to-br from-bronze/20 to-bronze/10 rounded-full flex items-center justify-center border border-bronze/30 group-hover:border-bronze/50 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-cream/20 to-cream/10 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-bronze/40 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-italiana text-lg font-medium text-cream mb-1 group-hover:text-bronze/90 transition-colors duration-300">
                          {testimonial.name}
                        </h4>
                        <p className="text-cream/70 text-sm font-light tracking-wide group-hover:text-cream/80 transition-colors duration-300">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom right decorative accent */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="inline-flex items-center space-x-6">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-bronze/50"></div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-bronze/60 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-bronze/40 rounded-full"></div>
                <div className="w-2 h-2 bg-bronze/60 rounded-full animate-pulse"></div>
              </div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-bronze/50"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Sophisticated & Elegant Design */}
      <section id="contact" className="py-32 bg-gradient-to-br from-white via-cream/10 to-warm-white/30 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-16 right-16 w-96 h-96 border border-bronze/15 rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-charcoal/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-bronze/60 rounded-full opacity-70"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-charcoal/40 rounded-full"></div>
          
          {/* Floating geometric patterns */}
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.2, rotate: 180 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/2 w-64 h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent"
          ></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Enhanced header section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* Decorative top line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-8"
            ></motion.div>
            
            <h2 className="font-italiana text-5xl md:text-7xl mb-6 text-charcoal leading-tight tracking-wide">
              LET'S CREATE
              <span className="block text-bronze">TOGETHER</span>
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-px bg-bronze/60"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-16 h-px bg-bronze/40"></div>
              <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
              <div className="w-12 h-px bg-bronze/60"></div>
            </div>
            
            <p className="text-lg text-charcoal/80 font-light tracking-wide max-w-2xl mx-auto">
              Let's bring your vision to life with our expertise and craftsmanship.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left side - Enhanced image and contact info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Enhanced main image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-bronze/10 via-transparent to-charcoal/5 rotate-1 group-hover:rotate-2 transition-all duration-700 opacity-60"></div>
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Luxury interior design consultation space"
                    className="w-full h-96 object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent"></div>
                  
                  {/* Floating contact badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 border border-bronze/20 group-hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="text-center">
                      <div className="w-8 h-px bg-bronze mx-auto mb-2"></div>
                      <p className="text-xs text-charcoal font-medium tracking-wider uppercase mb-1">Ready to Start?</p>
                      <p className="text-xs text-charcoal/70">Contact Us Today</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative corner accents */}
                <div className="absolute -top-2 -right-2 w-12 h-12 border-r-2 border-t-2 border-bronze/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 border-l-2 border-b-2 border-bronze/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Integrated contact information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm border border-bronze/15 overflow-hidden"
              >
                {/* Header with decorative element */}
                <div className="bg-gradient-to-r from-cream/60 to-cream/40 p-6 border-b border-bronze/10">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-8 h-px bg-bronze/60"></div>
                    <h3 className="font-italiana text-xl text-charcoal tracking-wide">Get in Touch</h3>
                    <div className="w-8 h-px bg-bronze/60"></div>
                  </div>
                </div>
                
                {/* Contact methods grid */}
                <div className="p-6 space-y-6">
                  {/* Phone */}
                  <div className="flex items-center space-x-4 group hover:bg-cream/20 p-4 -m-4 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-bronze/15 to-bronze/10 flex items-center justify-center border border-bronze/20 group-hover:border-bronze/40 transition-colors duration-300">
                      <Phone className="text-bronze" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal mb-1">Phone</p>
                      <p className="text-sm text-charcoal/70">+250 784024818</p>
                      <p className="text-sm text-charcoal/70">+250 786515555</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 border border-bronze/30 flex items-center justify-center">
                        <div className="w-4 h-4 bg-bronze/40"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center space-x-4 group hover:bg-cream/20 p-4 -m-4 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-bronze/15 to-bronze/10 flex items-center justify-center border border-bronze/20 group-hover:border-bronze/40 transition-colors duration-300">
                      <Mail className="text-bronze" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal mb-1">Email</p>
                      <p className="text-sm text-charcoal/70">karumujess@gmail.com</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 border border-bronze/30 flex items-center justify-center">
                        <div className="w-4 h-4 bg-bronze/40"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center space-x-4 group hover:bg-cream/20 p-4 -m-4 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-bronze/15 to-bronze/10 flex items-center justify-center border border-bronze/20 group-hover:border-bronze/40 transition-colors duration-300">
                      <MapPin className="text-bronze" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal mb-1">Location</p>
                      <p className="text-sm text-charcoal/70">Kigali, Rwanda/Gisozi</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 border border-bronze/30 flex items-center justify-center">
                        <div className="w-4 h-4 bg-bronze/40"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Instagram */}
                  <div className="flex items-center space-x-4 group hover:bg-cream/20 p-4 -m-4 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-bronze/15 to-bronze/10 flex items-center justify-center border border-bronze/20 group-hover:border-bronze/40 transition-colors duration-300">
                      <Instagram className="text-bronze" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal mb-1">Instagram</p>
                      <p className="text-sm text-charcoal/70">@kjess_designs_rw</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 border border-bronze/30 flex items-center justify-center">
                        <div className="w-4 h-4 bg-bronze/40"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom decorative element */}
                <div className="bg-gradient-to-r from-cream/40 to-cream/60 p-4 border-t border-bronze/10">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-px bg-bronze/40"></div>
                      <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                      <div className="text-xs text-charcoal/70 font-medium tracking-wider uppercase">Available 24/7</div>
                      <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                      <div className="w-6 h-px bg-bronze/40"></div>
                    </div>
                  </div>
                </div>
              </motion.div>


            </motion.div>
            
            {/* Right side - Enhanced contact form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Form container with sophisticated styling */}
              <div className="relative bg-white/80 backdrop-blur-sm p-10 border border-bronze/15 shadow-xl">
                {/* Decorative header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-8 h-px bg-bronze/60"></div>
                    <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                    <div className="text-bronze text-sm font-medium tracking-wider uppercase">Get In Touch</div>
                    <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                    <div className="w-8 h-px bg-bronze/60"></div>
                  </div>
                  <h3 className="font-italiana text-3xl text-charcoal mb-2">Share Your Vision</h3>
                  <p className="text-sm text-charcoal/70">We'd love to hear about your project</p>
                </div>

                {/* Enhanced contact form */}
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={contactForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-charcoal font-medium">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                {...field} 
                                className="luxury-input bg-white/50 border-bronze/20 focus:border-bronze/40 focus:bg-white transition-all duration-300"
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
                            <FormLabel className="text-charcoal font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email"
                                {...field} 
                                className="luxury-input bg-white/50 border-bronze/20 focus:border-bronze/40 focus:bg-white transition-all duration-300"
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
                          <FormLabel className="text-charcoal font-medium">Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+250 123 456 789" 
                              {...field}
                              value={field.value || ""}
                              className="luxury-input bg-white/50 border-bronze/20 focus:border-bronze/40 focus:bg-white transition-all duration-300"
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
                          <FormLabel className="text-charcoal font-medium">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your project..."
                              rows={5}
                              {...field} 
                              className="luxury-input bg-white/50 border-bronze/20 focus:border-bronze/40 focus:bg-white transition-all duration-300 resize-none"
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="luxury-button w-full bg-charcoal hover:bg-bronze text-white py-4 font-medium tracking-wide uppercase transition-all duration-300 hover:shadow-lg"
                        disabled={contactMutation.isPending}
                        data-testid="button-send-message"
                      >
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </Form>
                
                {/* Bottom decorative element */}
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-bronze/20 opacity-60"></div>
              </div>
              
              {/* Floating decorative accents */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-bronze/30"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-bronze/30"></div>
              
              {/* Additional design showcase image below the form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="relative group mt-8"
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-bronze/5 via-transparent to-charcoal/5 rotate-1 group-hover:rotate-2 transition-all duration-700 opacity-60"></div>
                <div className="relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                    alt="Modern interior design workspace with elegant furniture"
                    className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent"></div>
                  
                  {/* Floating design element */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 border border-bronze/20 group-hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="text-center">
                      <div className="w-6 h-px bg-bronze mx-auto mb-1"></div>
                      <p className="text-xs text-charcoal font-medium tracking-wider uppercase">Our Workspace</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Subtle corner accent */}
                <div className="absolute -top-1 -right-1 w-8 h-8 border-r border-t border-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced & Sophisticated Design */}
      <section className="py-32 bg-gradient-to-br from-cream via-warm-white/80 to-cream relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-80 h-80 border border-bronze/15 rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-charcoal/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-bronze/60 rounded-full opacity-70"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-charcoal/40 rounded-full"></div>
          
          {/* Floating geometric patterns */}
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.2, rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/2 w-48 h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent"
          ></motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Enhanced visual element */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-bronze/10 via-transparent to-charcoal/5 rotate-1 group-hover:rotate-2 transition-all duration-700 opacity-60"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 border border-bronze/15 group-hover:shadow-xl transition-shadow duration-500">
                  <div className="text-center space-y-6">
                    {/* Newsletter icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-bronze/20 to-bronze/10 mx-auto flex items-center justify-center border border-bronze/30 group-hover:border-bronze/50 transition-colors duration-300">
                      <svg className="w-10 h-10 text-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <div>
                      <h3 className="font-italiana text-2xl text-charcoal mb-2">Design Insights</h3>
                      <p className="text-charcoal/70 text-sm">Weekly design tips, trends, and inspiration</p>
                    </div>
                    
                    <div className="space-y-3 text-sm text-charcoal/70">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                        <span>Exclusive project showcases</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                        <span>Design trend reports</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                        <span>Behind-the-scenes content</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner accents */}
                <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-bronze/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-bronze/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
            
            {/* Right side - Enhanced newsletter signup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Enhanced header */}
              <div className="text-center lg:text-left">
                {/* Decorative accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ duration: 1, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="h-px bg-gradient-to-r from-bronze to-transparent mb-6 mx-auto lg:mx-0"
                ></motion.div>
                
                <h2 className="font-italiana text-5xl md:text-6xl mb-6 text-charcoal leading-tight">
                  STAY IN THE
                  <span className="block text-bronze">LOOP</span>
                </h2>
                
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                  <div className="w-8 h-px bg-bronze/60"></div>
                  <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                  <div className="w-12 h-px bg-bronze/40"></div>
                </div>
                
                <p className="text-lg text-charcoal/80 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Join our community of design enthusiasts and be the first to discover the latest 
                  trends, exclusive projects, and design insights.
                </p>
              </div>
              
              {/* Enhanced form */}
              <div className="bg-white/70 backdrop-blur-sm p-8 border border-bronze/15">
                <Form {...newsletterForm}>
                  <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="space-y-6">
                    <FormField
                      control={newsletterForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-charcoal font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email"
                              {...field} 
                              className="luxury-input bg-white/80 border-bronze/20 focus:border-bronze/40 focus:bg-white transition-all duration-300 h-12"
                              data-testid="input-newsletter-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-charcoal hover:bg-bronze text-white py-4 font-medium tracking-wide uppercase transition-all duration-300 hover:shadow-lg"
                      disabled={newsletterMutation.isPending}
                      data-testid="button-subscribe-newsletter"
                    >
                      {newsletterMutation.isPending ? "Subscribing..." : "Subscribe to Newsletter"}
                    </Button>
                    
                    <p className="text-xs text-charcoal/60 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
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

      {/* Footer Section - Sophisticated & Elegant Design */}
      <footer className="bg-charcoal text-cream relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-80 h-80 border border-bronze/10 rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-bronze/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-bronze/40 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-cream/30 rounded-full"></div>
        </div>
        
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-italiana text-3xl text-cream mb-2 tracking-wide">
                  KJESS DESIGNS
                </h3>
                <div className="w-16 h-px bg-bronze/60"></div>
              </div>
              
              <p className="text-cream/80 leading-relaxed font-light">
                Crafting exceptional spaces that inspire and transform. Where elegance meets functionality in perfect harmony.
              </p>
              
              {/* Social media links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-cream/10 hover:bg-bronze flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-5 h-5 text-cream group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-cream/10 hover:bg-bronze flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-5 h-5 text-cream group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-cream/10 hover:bg-bronze flex items-center justify-center transition-all duration-300 group">
                  <svg className="w-5 h-5 text-cream group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
            
            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h4 className="font-italiana text-xl text-cream mb-4 tracking-wide">Services</h4>
                <div className="w-12 h-px bg-bronze/40"></div>
              </div>
              
              <ul className="space-y-3">
                {[
                  "Interior Design",
                  "Custom Furniture",
                  "Space Planning",
                  "Consultation",
                  "Project Management",
                  "Renovation Services"
                ].map((service, index) => (
                  <li key={index}>
                    <a href="#" className="text-cream/80 hover:text-bronze transition-colors duration-300 font-light text-sm">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h4 className="font-italiana text-xl text-cream mb-4 tracking-wide">Quick Links</h4>
                <div className="w-12 h-px bg-bronze/40"></div>
              </div>
              
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Portfolio",
                  "Our Team",
                  "Testimonials",
                  "Contact",
                  "Newsletter"
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-cream/80 hover:text-bronze transition-colors duration-300 font-light text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h4 className="font-italiana text-xl text-cream mb-4 tracking-wide">Get in Touch</h4>
                <div className="w-12 h-px bg-bronze/40"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 mt-1 text-bronze">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-cream/80 font-light text-sm leading-relaxed">
                      Kigali, Rwanda<br />
                      Kimihurura, KG 7 Ave
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-bronze">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-cream/80 font-light text-sm">+250 788 888 888</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-bronze">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-cream/80 font-light text-sm">info@kjessdesigns.com</p>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="pt-4">
                <a href="#contact" className="inline-flex items-center space-x-2 bg-bronze hover:bg-cream text-white hover:text-charcoal px-6 py-3 font-medium text-sm uppercase tracking-wide transition-all duration-300 group">
                  <span>Start Your Project</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom footer bar */}
        <div className="border-t border-cream/10 py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <p className="text-cream/60 text-sm font-light">
                  © 2024 KJESS Designs. All rights reserved.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-bronze/40 rounded-full"></div>
                  <div className="w-2 h-2 bg-bronze/60 rounded-full"></div>
                  <div className="w-1 h-1 bg-bronze/40 rounded-full"></div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6"
              >
                <a href="#" className="text-cream/60 hover:text-bronze text-sm font-light transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-cream/60 hover:text-bronze text-sm font-light transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-cream/60 hover:text-bronze text-sm font-light transition-colors duration-300">
                  Cookie Policy
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
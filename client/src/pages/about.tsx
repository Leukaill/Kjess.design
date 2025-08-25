import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Users, Clock, Star, Sparkles, Heart } from "lucide-react";
import { Link } from "wouter";

const About = () => {
  const stats = [
    { icon: Award, label: "Awards Won", value: "15+" },
    { icon: Users, label: "Happy Clients", value: "200+" },
    { icon: Clock, label: "Years Experience", value: "10+" }
  ];

  const values = [
    {
      icon: Star,
      title: "Excellence",
      description: "We pursue perfection in every detail, ensuring that each project exceeds expectations and stands the test of time."
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We embrace new technologies and design trends while maintaining timeless elegance in our work."
    },
    {
      icon: Heart,
      title: "Collaboration",
      description: "We work closely with our clients to understand their vision and bring it to life through thoughtful collaboration."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal/95 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-bronze rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cream rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" data-testid="link-back-home">
            <Button 
              variant="ghost" 
              className="mb-12 text-white hover:bg-white/10 border border-white/20 hover:border-bronze/50 transition-all duration-300" 
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto mb-8"></div>
              <h1 className="text-6xl md:text-7xl font-italiana mb-8 bg-gradient-to-r from-white via-cream to-bronze bg-clip-text text-transparent">
                About KJESS Designs
              </h1>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-bronze to-transparent mx-auto"></div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl text-white/80 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Creating sophisticated spaces that blend elegance with functionality, one masterpiece at a time.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        
        {/* Our Story Section */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-italiana mb-8 text-bronze">Our Story</h2>
                  <div className="w-16 h-px bg-bronze mb-8"></div>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-xl leading-relaxed text-white/85 font-light"
                >
                  Founded with a passion for transforming spaces into works of art, <span className="text-bronze font-medium">KJESS Designs</span> has been at the forefront of luxury interior design for over a decade.
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-xl leading-relaxed text-white/85 font-light"
                >
                  We believe that every space tells a story, and our mission is to help you tell yours through <span className="text-bronze font-medium">thoughtful design choices</span>, premium materials, and innovative solutions.
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="text-xl leading-relaxed text-white/85 font-light"
                >
                  From residential sanctuaries to commercial environments, we approach each project with fresh eyes and a commitment to <span className="text-bronze font-medium">excellence</span> that has earned us recognition throughout the industry.
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-bronze/20 to-transparent rounded-2xl blur-2xl transform rotate-3"></div>
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95"
                    alt="Elegant KJESS Designs luxury interior featuring sophisticated furniture and artistic lighting"
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent"></div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-bronze/20"
                >
                  <div className="text-center">
                    <div className="w-16 h-px bg-bronze mx-auto mb-4"></div>
                    <h4 className="font-italiana text-xl font-bold text-charcoal tracking-wider mb-2">
                      SINCE 2015
                    </h4>
                    <p className="text-sm text-charcoal/70 font-light">
                      Excellence in Design
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
                data-testid={`stat-${index}`}
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-bronze to-bronze/70 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-bronze/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </div>
                <h3 className="text-5xl font-italiana text-bronze mb-4 group-hover:text-white transition-colors duration-300">
                  {stat.value}
                </h3>
                <p className="text-white/70 text-lg font-light">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-16 border border-white/20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-italiana mb-6 text-bronze">Our Values</h2>
              <div className="w-20 h-px bg-bronze mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group"
                  data-testid={`value-${value.title.toLowerCase()}`}
                >
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-bronze/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-bronze/30 transition-colors duration-300">
                      <value.icon className="w-8 h-8 text-bronze" />
                    </div>
                    <h3 className="text-2xl font-italiana mb-6 text-bronze group-hover:text-white transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-white/80 font-light leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
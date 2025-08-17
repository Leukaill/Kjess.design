import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Users, Clock } from "lucide-react";
import { Link } from "wouter";

const About = () => {
  const stats = [
    { icon: Award, label: "Awards Won", value: "15+" },
    { icon: Users, label: "Happy Clients", value: "200+" },
    { icon: Clock, label: "Years Experience", value: "10+" }
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
            <h1 className="text-5xl font-italiana mb-6">About KJESS Designs</h1>
            <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
              Creating sophisticated spaces that blend elegance with functionality, one project at a time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-italiana mb-6">Our Story</h2>
            <p className="text-lg text-charcoal/80 mb-6">
              Founded with a passion for transforming spaces into works of art, KJESS Designs has been at the forefront 
              of luxury interior design for over a decade. Our team of skilled designers brings together creativity, 
              craftsmanship, and attention to detail to create environments that inspire and delight.
            </p>
            <p className="text-lg text-charcoal/80 mb-6">
              We believe that every space tells a story, and our mission is to help you tell yours through thoughtful 
              design choices, premium materials, and innovative solutions that reflect your unique style and needs.
            </p>
            <p className="text-lg text-charcoal/80">
              From residential sanctuaries to commercial environments, we approach each project with fresh eyes and 
              a commitment to excellence that has earned us recognition throughout the industry.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=95"
              alt="KJESS Designs Studio"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="w-16 h-16 bg-bronze/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-bronze" />
              </div>
              <h3 className="text-3xl font-italiana text-bronze mb-2">{stat.value}</h3>
              <p className="text-charcoal/70">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-lg p-12 shadow-lg"
        >
          <h2 className="text-3xl font-italiana text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center" data-testid="value-excellence">
              <h3 className="text-xl font-italiana mb-4 text-bronze">Excellence</h3>
              <p className="text-charcoal/70">
                We pursue perfection in every detail, ensuring that each project exceeds expectations and stands the test of time.
              </p>
            </div>
            <div className="text-center" data-testid="value-innovation">
              <h3 className="text-xl font-italiana mb-4 text-bronze">Innovation</h3>
              <p className="text-charcoal/70">
                We embrace new technologies and design trends while maintaining timeless elegance in our work.
              </p>
            </div>
            <div className="text-center" data-testid="value-collaboration">
              <h3 className="text-xl font-italiana mb-4 text-bronze">Collaboration</h3>
              <p className="text-charcoal/70">
                We work closely with our clients to understand their vision and bring it to life through thoughtful collaboration.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, User, CheckCircle, Code, Smartphone, Globe, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

const WebDevelopmentService: React.FC = () => {
  const navigate = useNavigate();

  const service = {
    id: "web-development-service",
    title: "Professional Web Development",
    description: "I will create a modern, responsive website for your business. Includes SEO optimization, mobile-friendly design, and fast loading times. Perfect for businesses looking to establish a strong online presence with a professional, user-friendly website.",
    category: "Web Development",
    price: 2500,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    delivery: 7,
    rating: 4.9,
    reviews: 156,
    freelancer: "Web Development Team",
    features: [
      "Responsive Design",
      "SEO Optimization",
      "Mobile-Friendly",
      "Fast Loading Times",
      "Modern UI/UX",
      "Cross-Browser Compatible",
      "Content Management System",
      "Security Implementation"
    ],
    technologies: [
      "React.js",
      "Node.js",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "MongoDB",
      "PostgreSQL",
      "AWS/Vercel"
    ],
    plans: [
      {
        name: "Basic Website",
        price: 1500,
        description: "Simple website with essential features",
        features: ["5 pages", "Responsive design", "Contact form", "Basic SEO", "3 revisions"],
        delivery: "7 days"
      },
      {
        name: "Professional Website",
        price: 2500,
        description: "Advanced website with premium features",
        features: ["10 pages", "Responsive design", "Contact form", "Advanced SEO", "Blog section", "5 revisions"],
        delivery: "10 days"
      },
      {
        name: "E-commerce Website",
        price: 4000,
        description: "Full e-commerce solution with payment integration",
        features: ["Unlimited pages", "Payment gateway", "Inventory management", "Admin dashboard", "Unlimited revisions"],
        delivery: "14 days"
      }
    ],
    faqs: [
      {
        question: "What do you need to get started?",
        answer: "A brief about your business, content, and any design inspiration you have. I'll also need your brand colors and logo if available."
      },
      {
        question: "Can you redesign my existing website?",
        answer: "Absolutely! I can modernize and improve your current site while maintaining your brand identity and improving user experience."
      },
      {
        question: "Do you provide support after delivery?",
        answer: "Yes, I offer 2 weeks of free support after project completion, and ongoing maintenance packages are available."
      },
      {
        question: "What technologies do you use?",
        answer: "I use modern technologies like React, Node.js, TypeScript, and Next.js to create fast, scalable, and maintainable websites."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-dark-800/50 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white">Web Development Service</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="relative">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{service.title}</h1>
                <p className="text-green-400 text-lg">{service.category}</p>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-dark-800/50 rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold ml-2">{service.rating}</span>
                    <span className="text-gray-400 ml-1">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.delivery} days delivery</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-400">₹{service.price}</div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">{service.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-dark-800/50 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border ${
                      index === 1
                        ? 'border-green-500 bg-green-600/10'
                        : 'border-green-500/20 bg-dark-700/50'
                    }`}
                  >
                    <h4 className="text-xl font-semibold text-white mb-2">{plan.name}</h4>
                    <div className="text-3xl font-bold text-green-400 mb-4">₹{plan.price}</div>
                    <p className="text-gray-300 mb-4">{plan.description}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-gray-400 text-sm mb-4">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {plan.delivery}
                    </div>
                    <Button
                      className={`w-full ${
                        index === 1
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-dark-600 hover:bg-dark-500'
                      }`}
                    >
                      Choose Plan
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-dark-800/50 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-green-500/20 pb-4 last:border-b-0">
                    <h4 className="text-lg font-semibold text-white mb-2">{faq.question}</h4>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-dark-800/50 rounded-lg p-6 border border-green-500/20">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-400 mb-2">₹{service.price}</div>
                <div className="text-gray-400">Starting Price</div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Order Now
                </Button>
                <Button className="w-full bg-dark-600 hover:bg-dark-500">
                  Contact Freelancer
                </Button>
                <Button className="w-full bg-dark-600 hover:bg-dark-500">
                  Save to Wishlist
                </Button>
                <Button className="w-full bg-dark-600 hover:bg-dark-500">
                  Share Service
                </Button>
              </div>
            </div>

            {/* About Freelancer */}
            <div className="bg-dark-800/50 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">About the Freelancer</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{service.freelancer}</p>
                  <p className="text-green-400 text-sm">Web Development Expert</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Professional web development team with expertise in modern technologies. 
                We create fast, scalable, and user-friendly websites that drive business growth.
              </p>
            </div>

            {/* Service Stats */}
            <div className="bg-dark-800/50 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Service Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-white">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">On-Time Delivery</span>
                  <span className="text-white">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revision Rate</span>
                  <span className="text-white">2.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopmentService; 
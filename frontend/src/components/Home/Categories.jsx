import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const MAX_SECTORS = 6;

// 100% Working Premium background images for categories
const bgImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/categories/');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sectors = categories.slice(0, MAX_SECTORS);

  return (
    <section className="py-20 sm:py-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-emerald-500 font-black text-[11px] uppercase tracking-[0.2em] mb-3">Top Sectors</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Industries THAT <span className="text-emerald-500 capitalize font-serif italic font-medium">Inspire</span>
            </h2>
          </div>
          <p className="text-slate-500 text-sm md:text-base max-w-md md:text-right leading-relaxed font-medium">
            Explore the most in-demand career paths. We connect you with top organizations in these thriving sectors.
          </p>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-slate-200 rounded-[2rem] h-[320px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectors.map((cat, index) => {
              const bgImage = bgImages[index % bgImages.length];
              return (
                <Reveal key={cat.id} delay={index * 100}>
                  <Link
                    to={`/categories/${cat.id}/jobs`}
                    className="group relative block w-full h-[320px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-slate-900"
                  >
                    {/* Background Image with Fallback for Broken Links */}
                    <img 
                      src={bgImage} 
                      alt={cat.name} 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90"></div>
                    
                    {/* Content inside Image */}
                    <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between z-10">
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
                          {cat.name}
                        </h3>
                        <p className="text-slate-300 font-medium text-sm">
                          Explore top opportunities in this sector.
                        </p>
                      </div>
                      
                      {/* Circular Action Button */}
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-emerald-500 group-hover:border-emerald-500 flex items-center justify-center transition-all duration-300 shrink-0">
                        <ArrowRight className="w-5 h-5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" strokeWidth={2.5} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* View All Categories Button */}
        <Reveal className="text-center mt-12">
          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-500 text-white font-black px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Explore All Categories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
        </Reveal>

      </div>
    </section>
  );
};

export default Categories;
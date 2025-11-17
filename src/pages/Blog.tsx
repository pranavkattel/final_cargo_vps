import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const Blog = () => {
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);
    
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ background: 'linear-gradient(135deg, #0096C7 0%, #0077A3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Capital Cargo Blog</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Expert insights, guides, and updates on international shipping, logistics, 
            and export opportunities from Nepal to the world.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: '#F9B222', color: 'white' }}>
                Featured Article
              </span>
            </div>
            
            <div className="bg-primary-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full min-h-[400px]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-white px-3 py-1 rounded-full text-sm font-medium" style={{ color: '#1a1a1a' }}>
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#1E293B' }}>
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
                        <User className="h-5 w-5" style={{ color: '#0096C7' }} />
                      </div>
                      <span className="text-gray-700 font-medium">{featuredPost.author}</span>
                    </div>
                    
                    <Link 
                      to={`/blog/${featuredPost.slug}`}
                      className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2" 
                      style={{ backgroundColor: '#0096C7' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9B222'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0096C7'}
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-b" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-primary-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? '#0096C7' : undefined
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <article key={post.id} className="bg-primary-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium" style={{ color: '#1a1a1a' }}>
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-200" style={{ color: '#1E293B' }}>
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f6f6f6' }}>
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{post.author}</span>
                    </div>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="font-medium text-sm flex items-center space-x-1 transition-colors duration-200" 
                      style={{ color: '#0096C7' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#F9B222'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0096C7'}
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1E293B' }}>Popular Topics</h2>
            <p className="text-lg text-gray-600">
              Explore our most read articles and guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Export Documentation', icon: '📋', count: '12 articles' },
              { title: 'Shipping Methods', icon: '🚢', count: '8 articles' },
              { title: 'Customs Guide', icon: '🛃', count: '15 articles' },
              { title: 'Market Insights', icon: '📊', count: '10 articles' },
              { title: 'Packaging Tips', icon: '📦', count: '6 articles' },
              { title: 'Trade Regulations', icon: '⚖️', count: '9 articles' },
              { title: 'Success Stories', icon: '🏆', count: '7 articles' },
              { title: 'Industry News', icon: '📰', count: '20 articles' }
            ].map((topic, index) => (
              <div key={index} className="bg-primary-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer text-center">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: '#1E293B' }}>{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

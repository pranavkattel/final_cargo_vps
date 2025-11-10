import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="pt-16">
      {/* SEO Meta Tags in Hidden Section */}
      <div className="sr-only">
        <h1>{post.title} - Capital Cargo Nepal</h1>
        <p>{post.excerpt}</p>
        <p>Keywords: {post.keywords?.join(', ')}</p>
        <p>By {post.author} | Published {post.date} | Category: {post.category}</p>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-sm mb-4 hover:text-yellow-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#f9b222' }}>
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => {
              // Headings
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                const text = paragraph.replace(/\*\*/g, '');
                return (
                  <h2 key={index} className="text-2xl md:text-3xl font-bold mt-8 mb-4" style={{ color: '#0096C7' }}>
                    {text}
                  </h2>
                );
              }
              
              // Lists
              if (paragraph.startsWith('- ') || paragraph.startsWith('✈️') || paragraph.startsWith('🚢') || paragraph.startsWith('❌') || paragraph.startsWith('✅')) {
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-3 pl-4">
                    {paragraph}
                  </p>
                );
              }
              
              // Bold text
              if (paragraph.includes('**')) {
                const parts = paragraph.split('**');
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                    {parts.map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="font-semibold text-gray-900">{part}</strong>
                    )}
                  </p>
                );
              }
              
              // Regular paragraphs
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 rounded-xl" style={{ backgroundColor: '#f6f6f6' }}>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
              Ready to Ship with Capital Cargo?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              With 27+ years of experience, we provide reliable international shipping solutions from Nepal to anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/quote"
                className="inline-block text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 text-center hover:opacity-90"
                style={{ backgroundColor: '#f9b222' }}
              >
                Get Free Quote
              </Link>
              <Link
                to="/contact"
                className="inline-block border-2 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 text-center hover:bg-gray-50"
                style={{ borderColor: '#0096C7', color: '#0096C7' }}
              >
                Contact Us: +977-01-5367883
              </Link>
            </div>
          </div>

          {/* Author Info */}
          <div className="mt-12 p-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f6f6f6' }}>
                <User className="h-8 w-8" style={{ color: '#f9b222' }} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{post.author}</h4>
                <p className="text-gray-600">Logistics Expert at Capital Cargo</p>
              </div>
            </div>
          </div>

          {/* Related Posts Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousPost && (
                <Link
                  to={`/blog/${previousPost.slug}`}
                  className="p-6 rounded-lg border-2 border-gray-200 hover:border-yellow-400 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous Article
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-yellow-600">{previousPost.title}</h4>
                </Link>
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="p-6 rounded-lg border-2 border-gray-200 hover:border-yellow-400 transition-colors group text-right"
                >
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                    Next Article
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-yellow-600">{nextPost.title}</h4>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#0096C7' }}>
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts
              .filter(p => p.category === post.category && p.slug !== slug)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 hover:text-yellow-600">{relatedPost.title}</h3>
                    <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;

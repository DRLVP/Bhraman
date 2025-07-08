import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';



export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">About Bhraman</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the story behind India's leading travel experience company and our passion for creating unforgettable journeys.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2010, Bhraman (which means 'travel' in Sanskrit) began with a simple mission: to help people experience the incredible diversity and beauty of India through thoughtfully crafted travel experiences.
          </p>
          <p className="text-gray-600 mb-4">
            What started as a small team of passionate travelers has grown into one of India's most trusted travel companies, serving thousands of happy customers each year. Our founder, Rajesh Kumar, began the company after spending years exploring every corner of India and realizing the potential for creating authentic, immersive travel experiences that go beyond the typical tourist attractions.
          </p>
          <p className="text-gray-600">
            Today, we continue to be driven by our love for travel and our commitment to showcasing the best of India's landscapes, cultures, and traditions. We believe that travel has the power to transform lives, create connections, and foster understanding between different cultures.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
          {/* In a real application, you would use an actual image */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-medium">
            Company Image Placeholder
          </div>
        </div>
      </div>

      {/* Mission & Values Section */}
      <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            At Bhraman, we're guided by a set of core principles that shape everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Experiences</h3>
            <p className="text-gray-600">
              We believe in creating travel experiences that are genuine, immersive, and showcase the true essence of each destination.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Responsible Tourism</h3>
            <p className="text-gray-600">
              We are committed to sustainable travel practices that respect local communities, preserve cultural heritage, and protect the environment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer-Centric</h3>
            <p className="text-gray-600">
              Our travelers are at the heart of everything we do. We strive to exceed expectations and create memorable journeys tailored to individual needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Safety & Reliability</h3>
            <p className="text-gray-600">
              We prioritize the safety and well-being of our travelers, ensuring reliable services and support throughout their journey.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We continuously seek new ways to enhance the travel experience, embracing technology and creative solutions to meet evolving traveler needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Respect</h3>
            <p className="text-gray-600">
              We foster understanding and appreciation of diverse cultures, traditions, and ways of life through responsible and respectful travel.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose Bhraman</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover what sets us apart and makes us the preferred choice for travelers exploring India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Local Knowledge</h3>
              <p className="text-gray-600">
                Our team consists of travel experts with deep knowledge of India's diverse regions, cultures, and hidden gems.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Service</h3>
              <p className="text-gray-600">
                We take the time to understand your preferences and create tailored travel experiences that match your interests.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Accommodations</h3>
              <p className="text-gray-600">
                We partner with carefully selected hotels and resorts that offer comfort, cleanliness, and authentic local character.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees or surprises. We provide clear, upfront pricing so you know exactly what you're paying for.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available around the clock to assist you before, during, and after your journey.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentic Experiences</h3>
              <p className="text-gray-600">
                We go beyond tourist attractions to offer genuine cultural experiences and interactions with local communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey Timeline */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Key milestones in our company's history as we've grown to become a leading travel provider.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-500 border-4 border-white z-10"></div>
                
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Empty space for the other side */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            The passionate travel experts behind Bhraman who work tirelessly to create exceptional experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 relative">
                {/* In a real application, you would use actual team member images */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Team Member Image
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 md:p-12 text-white">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="max-w-3xl mx-auto opacity-90">
            Don't just take our word for it. Here's what some of our happy customers have to say about their experiences with Bhraman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                AS
              </div>
              <div className="ml-4">
                <h4 className="font-bold">Ananya Singh</h4>
                <p className="text-sm opacity-80">Kerala Backwaters Tour</p>
              </div>
            </div>
            <p className="italic opacity-90">
              "Our trip to Kerala was absolutely magical! The houseboat experience arranged by Bhraman was the highlight of our journey. Every detail was perfectly planned, and our guide was knowledgeable and friendly."
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-lg">
                RJ
              </div>
              <div className="ml-4">
                <h4 className="font-bold">Rahul Joshi</h4>
                <p className="text-sm opacity-80">Rajasthan Heritage Tour</p>
              </div>
            </div>
            <p className="italic opacity-90">
              "The attention to detail was impressive. From luxury accommodations in heritage hotels to the carefully selected local experiences, Bhraman created a journey that exceeded our expectations in every way."
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 border border-white border-opacity-20">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                MP
              </div>
              <div className="ml-4">
                <h4 className="font-bold">Meera Patel</h4>
                <p className="text-sm opacity-80">Himalayan Adventure</p>
              </div>
            </div>
            <p className="italic opacity-90">
              "As a solo female traveler, safety was my primary concern. Bhraman not only ensured I felt secure throughout my journey but also created opportunities for me to connect with local communities in meaningful ways."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Explore our curated travel packages and begin your adventure with Bhraman today. Let us help you create memories that will last a lifetime.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Browse Packages
          </Button>
          <Button size="lg" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
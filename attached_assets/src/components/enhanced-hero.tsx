import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Star, ArrowRight, Calendar, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollingCategories } from './scrolling-categories';
import { useLocation } from 'wouter';

export function EnhancedHero() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [postcode, setPostcode] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Auto-populate location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation && !postcode) {
      setPostcode(savedLocation);
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      let query = searchQuery.trim();
      if (postcode.trim()) {
        query += ` ${postcode.trim()}`;
      }
      if (selectedDay && selectedDay !== 'any') {
        query += ` ${selectedDay}`;
      }
      setLocation(`/smart-search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setLocation(`/search?category=${categoryId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      setIsLocating(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Convert coordinates to postcode/town using reverse geocoding
      const response = await fetch(
        `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          const nearestPostcode = data.result[0].postcode;
          setPostcode(nearestPostcode);
          localStorage.setItem('userLocation', nearestPostcode);
        }
      } else {
        // Fallback: use approximate location
        setPostcode(`${latitude.toFixed(3)},${longitude.toFixed(3)}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please enter your postcode manually.');
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium">
                <Star className="w-4 h-4 mr-2 fill-current" />
                6,000+ Verified Activities Across the UK
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Amazing
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Family Activities
              </span>
              Near You
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover baby classes, toddler groups, after-school clubs and family activities. 
              Search by location or activity type to find the perfect experiences for your family.
            </p>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Activity Search */}
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="What are you looking for? (e.g., baby sensory, swimming)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 h-16 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  {/* Day of Week Selector */}
                  <div className="relative">
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="h-16 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <SelectValue placeholder="Any day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any day</SelectItem>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Search */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Postcode or town"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 pr-12 h-16 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-14 w-10 p-0 hover:bg-purple-50"
                      onClick={getCurrentLocation}
                      disabled={isLocating}
                    >
                      <Locate className={`w-4 h-4 text-purple-600 ${isLocating ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Search Button - Full width below */}
                <div className="mt-4">
                  <Button 
                    onClick={handleSearch}
                    className="w-full h-16 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Search
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Examples */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <span className="text-sm text-gray-500 mr-2">Popular searches:</span>
                  {['Baby sensory', 'Swimming lessons', 'Music classes', 'Toddler sense'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(() => handleSearch(), 100);
                      }}
                      className="text-sm bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">6,000+</div>
                <div className="text-gray-600 font-medium">Verified Activities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600 font-medium">UK Towns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Online Booking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">4.8★</div>
                <div className="text-gray-600 font-medium">Average Class Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive directory of family activities, from baby sensory classes to after-school clubs
            </p>
          </div>

          <ScrollingCategories onCategorySelect={handleCategorySelect} />
        </div>

        {/* Features Section */}
        <div className="pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find activities using natural language. Search for "baby swimming near me" or "toddler music classes"
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Schedules</h3>
              <p className="text-gray-600 leading-relaxed">
                See live availability and multiple session times. Book the perfect slot for your family's routine
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover activities in your area with detailed location information and easy directions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
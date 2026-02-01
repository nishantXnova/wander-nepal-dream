import { Plane, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Airline data with logos
const airlines = [
  {
    name: "Nepal Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Nepal_Airlines_Logo.svg/200px-Nepal_Airlines_Logo.svg.png",
    website: "https://www.nepalairlines.com.np/",
    description: "National flag carrier of Nepal",
    routes: "Domestic & International"
  },
  {
    name: "Buddha Air",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1b/Buddha_Air_logo.png",
    website: "https://www.buddhaair.com/",
    description: "Leading private airline",
    routes: "Domestic"
  },
  {
    name: "Yeti Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Yeti_Airlines_Logo.svg/200px-Yeti_Airlines_Logo.svg.png",
    website: "https://www.yetiairlines.com/",
    description: "Reliable domestic carrier",
    routes: "Domestic"
  },
  {
    name: "Shree Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Shree_Airlines_Logo.png/200px-Shree_Airlines_Logo.png",
    website: "https://www.shreeairlines.com/",
    description: "Growing domestic airline",
    routes: "Domestic"
  },
  {
    name: "Saurya Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/5e/Saurya_Airlines_logo.png",
    website: "https://www.sauryaairlines.com/",
    description: "Modern fleet operations",
    routes: "Domestic"
  },
  {
    name: "Tara Air",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Tara_Air_logo.svg/200px-Tara_Air_logo.svg.png",
    website: "https://www.taraair.com/",
    description: "Mountain flight specialist",
    routes: "Remote Destinations"
  }
];

const popularRoutes = [
  { from: "Kathmandu", to: "Pokhara", duration: "25 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Lukla", duration: "35 min", frequency: "Daily (weather permitting)" },
  { from: "Pokhara", to: "Jomsom", duration: "20 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Bharatpur", duration: "25 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Biratnagar", duration: "35 min", frequency: "Daily" },
  { from: "Kathmandu", to: "Nepalgunj", duration: "1 hr", frequency: "Daily" },
];

const FlightBooking = () => {
  const handleBookFlight = (website?: string) => {
    window.open(website || "https://www.nepalairlines.com.np/", "_blank", "noopener,noreferrer");
  };

  return (
    <section id="flights" className="section-padding bg-gradient-to-br from-nepal-sky/10 via-background to-accent/5">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <Plane className="h-4 w-4" />
            <span className="text-sm font-medium">Flight Booking</span>
          </div>
          <h2 className="heading-section text-foreground mb-4">
            Book Your <span className="italic text-accent">Flights</span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Reach Nepal's remote destinations quickly with domestic flights. From scenic mountain flights to essential connections.
          </p>
        </div>

        {/* Airlines Grid */}
        <div className="mb-12">
          <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
            Nepal's Airlines
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {airlines.map((airline, index) => (
              <div
                key={index}
                onClick={() => handleBookFlight(airline.website)}
                className="bg-card rounded-2xl p-4 border border-border hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-3 rounded-xl bg-white flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img
                    src={airline.logo}
                    alt={`${airline.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to plane icon if logo fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>';
                    }}
                  />
                </div>
                <h4 className="font-medium text-foreground text-sm mb-1">{airline.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{airline.routes}</p>
                <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left - Booking Card */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Plane className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">Nepal Airlines</h3>
                <p className="text-muted-foreground">Official National Flag Carrier</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Nepal Airlines operates domestic and international flights connecting major cities and remote mountain destinations. 
              Book directly through their official website for the best rates and schedules.
            </p>

            <div className="bg-secondary rounded-xl p-4 mb-6">
              <h4 className="font-medium text-foreground mb-3">Why Book with Nepal Airlines?</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Nepal's national flag carrier with wide route network
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Direct flights to mountain destinations like Lukla
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  International connections to major Asian cities
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Flexible booking and rebooking options
                </li>
              </ul>
            </div>

            <Button 
              onClick={() => handleBookFlight()}
              className="w-full btn-accent text-lg py-6 gap-2"
            >
              <Plane className="h-5 w-5" />
              Book on Nepal Airlines
              <ExternalLink className="h-4 w-4" />
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              You'll be redirected to nepalairlines.com.np to complete your booking
            </p>
          </div>

          {/* Right - Popular Routes */}
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">Popular Domestic Routes</h3>
            <div className="space-y-4">
              {popularRoutes.map((route, index) => (
                <div 
                  key={index}
                  className="bg-card rounded-xl p-4 border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleBookFlight()}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">{route.from}</span>
                      </div>
                      <div className="w-8 h-px bg-border relative">
                        <Plane className="h-3 w-3 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">{route.to}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {route.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {route.frequency}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 mt-6">
              <h4 className="font-medium text-foreground mb-2">✈️ Mountain Flight Tip</h4>
              <p className="text-sm text-muted-foreground">
                The Kathmandu to Lukla flight is one of the world's most scenic and thrilling flights, 
                offering close-up views of Everest. Book early during peak trekking season!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightBooking;

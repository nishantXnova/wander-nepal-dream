import { useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import destination images
import heroEverest from "@/assets/hero-everest.jpg";
import kathmanduTemple from "@/assets/kathmandu-temple.jpg";
import pokharaLake from "@/assets/pokhara-lake.jpg";
import chitwanWildlife from "@/assets/chitwan-wildlife.jpg";
import annapurnaTrek from "@/assets/annapurna-trek.jpg";
import lumbiniTemple from "@/assets/lumbini-temple.jpg";

// Gallery images with captions
const galleryImages = [
  {
    src: heroEverest,
    title: "Mount Everest",
    location: "Sagarmatha National Park",
    category: "Adventure"
  },
  {
    src: kathmanduTemple,
    title: "Boudhanath Stupa",
    location: "Kathmandu Valley",
    category: "Culture"
  },
  {
    src: pokharaLake,
    title: "Phewa Lake",
    location: "Pokhara",
    category: "Nature"
  },
  {
    src: chitwanWildlife,
    title: "One-Horned Rhino",
    location: "Chitwan National Park",
    category: "Wildlife"
  },
  {
    src: annapurnaTrek,
    title: "Annapurna Base Camp",
    location: "Annapurna Region",
    category: "Adventure"
  },
  {
    src: lumbiniTemple,
    title: "Maya Devi Temple",
    location: "Lumbini",
    category: "Spirituality"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Adventure", "Culture", "Nature", "Wildlife", "Spirituality"];

  const filteredImages = filter === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    
    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section id="gallery" className="section-padding bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-nepal-gold/10 text-nepal-gold px-4 py-2 rounded-full mb-4">
            <Camera className="h-4 w-4" />
            <span className="text-sm font-medium">Photo Gallery</span>
          </div>
          <h2 className="heading-section text-foreground mb-4">
            Stunning <span className="italic text-nepal-gold">Moments</span> of Nepal
          </h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Experience the breathtaking beauty of Nepal through our curated collection of stunning photographs from across the country.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={filter === category ? "btn-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer card-hover"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-nepal-gold/90 text-white text-xs rounded-full mb-2">
                  {image.category}
                </span>
                <h3 className="text-white font-display text-lg font-semibold">{image.title}</h3>
                <p className="text-white/80 text-sm">{image.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white z-50"
              onClick={closeLightbox}
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/30 rounded-full z-50"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 bg-black/30 rounded-full z-50"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image */}
            <div 
              className="max-w-5xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <span className="inline-block px-2 py-1 bg-nepal-gold text-white text-xs rounded-full mb-2">
                  {filteredImages[selectedImage].category}
                </span>
                <h3 className="text-white font-display text-xl font-semibold">
                  {filteredImages[selectedImage].title}
                </h3>
                <p className="text-white/80">{filteredImages[selectedImage].location}</p>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {selectedImage + 1} / {filteredImages.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

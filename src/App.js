// Step 1: Import necessary hooks and your CSS file
import React, { useEffect } from 'react';
import './output.css'; // Make sure this path is correct for your main stylesheet
import 'animate.css/animate.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Step 2: Define your main App component
function App() {

  // Step 3: Use useEffect to run scripts after the component loads
  useEffect(() => {
    // Initialize AOS (Animate on Scroll)
    AOS.init({ duration: 1000, once: true });

    // --- Story Loading Logic ---
    async function fetchAndDisplayStories() {
      const container = document.getElementById("homepageStories");
      if (!container) return; // Exit if the container isn't on the page

      container.innerHTML = "";
      try {
        // This is the new part: Fetching from the manifest file
        const manifestRes = await fetch("/stories/_manifest.json");
        const storyFilenames = await manifestRes.json();
        
        if (!storyFilenames.length) {
          container.innerHTML = "<p class='text-center text-gray-500 col-span-full'>No stories yet.</p>";
          return;
        }

        const storyPromises = storyFilenames.map(filename =>
          fetch(`/stories/${filename}`).then(res => res.json())
        );
        const stories = await Promise.all(storyPromises);

        const latestFive = stories.slice(-5).reverse();

        latestFive.forEach((story, index) => {
          const card = document.createElement("div");
          card.className = "bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 transition hover:shadow-xl animate__animated animate__fadeInUp";
          card.setAttribute("data-aos", "fade-up");
          card.setAttribute("data-aos-delay", index * 100);

          const date = new Date(story.timestamp).toLocaleDateString("en-IN");

          card.innerHTML = `
            ${story.image ? `<img src="/uploads/${story.image}" alt="Story Image" class="w-full h-40 object-cover rounded-lg mb-4">` : ""}
            <h3 class="text-lg font-bold text-blue-700 mb-1">${story.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${story.city || ""}, ${story.country || ""}</p>
            <p class="text-sm text-gray-700 whitespace-pre-line mb-2">${story.story}</p>
            <div class="text-xs text-gray-400 italic">🕒 ${date}</div>
          `;
          container.appendChild(card);
        });

        const viewAllCard = document.createElement("div");
        viewAllCard.className = "flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white text-blue-800 font-semibold rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-105 transition animate__animated animate__fadeInUp";
        viewAllCard.setAttribute("data-aos", "fade-up");
        viewAllCard.setAttribute("data-aos-delay", "600");
        viewAllCard.innerHTML = `
          <div class="text-center">
            <p class="text-lg mb-2">📖 Want to read more stories?</p>
            <a href="stories.html" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">View All Stories</a>
          </div>
        `;
        container.appendChild(viewAllCard);

      } catch (err) {
        container.innerHTML = "<p class='text-red-600'>❌ Failed to load stories</p>";
        console.error("Story load error:", err);
      }
    }
    
    fetchAndDisplayStories();


    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    
    const handleMenuToggle = () => mobileMenu.classList.toggle("hidden");
    const handleLinkClick = () => mobileMenu.classList.add("hidden");

    if(mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", handleMenuToggle);
      const links = mobileMenu.querySelectorAll("a");
      links.forEach(link => link.addEventListener("click", handleLinkClick));
    }

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.removeEventListener("click", handleMenuToggle);
        const links = mobileMenu.querySelectorAll("a");
        links.forEach(link => link.removeEventListener("click", handleLinkClick));
      }
    };
    
  }, []); // The empty array [] means this effect runs once after the initial render

  // Step 4: Return the JSX (HTML inside React)
  return (
    // We use a React Fragment <>...</> to wrap everything
    <>
      {/* 🌐 Sticky Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Left: Logo + Brand (Always Visible) */}
          <a href="#home" className="flex items-center gap-4 hover:opacity-90 transition">
            <img src="images/logo.png" alt="Logo" className="h-10 w-10 object-cover rounded-full" />
            <span className="text-base font-bold text-blue-700 whitespace-nowrap hidden md:inline">Space of Purification Global</span>
          </a>

          {/* Centered Brand on Mobile Only */}
          <a href="#home" className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
            <span className="text-base font-bold text-blue-700 text-center whitespace-nowrap">
              Space of Purification Global
            </span>
          </a>

          {/* Center: Nav Links (Desktop Only) */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-gray-700 font-medium">
            <a href="#home" className="hover:text-blue-600 transition">Home</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#share-story" className="hover:text-blue-600 transition">Share Story</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Plans</a>
          </nav>

          {/* Right: Hamburger (Mobile) + Buttons (Desktop) */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-3">
              <a href="tel:+919769300131" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">📞 Call</a>
              <a href="https://wa.me/919769300131" className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition">💬 WhatsApp</a>
            </div>
            <button id="mobileMenuBtn" className="md:hidden text-gray-700 focus:outline-none z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobileMenu" className="md:hidden hidden px-4 pb-4 bg-white border-t">
          <nav className="flex flex-col space-y-2 text-gray-700 font-medium">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#share-story" className="hover:text-blue-600">Share Story</a>
            <a href="#pricing" className="hover:text-blue-600">Plans</a>
            <a href="tel:+919769300131" className="bg-blue-600 text-white rounded-full px-4 py-2 text-center">📞 Call</a>
            <a href="https://wa.me/919769300131" className="bg-green-500 text-white rounded-full px-4 py-2 text-center">💬 WhatsApp</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 min-h-screen flex items-center justify-center px-4 text-center bg-gradient-to-b from-white via-blue-100 to-purple-100">
        <div data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Break Free. Heal Deeply. Rediscover Life.
          </h1>
          <p className="mb-12">
            <strong>It’s not just healing — it’s a return to your true self.</strong><br />
            We help those trapped in cycles of overthinking, anxiety, and silent emotional battles — people carrying invisible pain for months or even years.<br />
            Through 12+ years of proven healing methods, we guide you to break free, rediscover peace, and awaken your inner strength.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+919769300131" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition">Call Now</a>
            <a href="https://wa.me/919769300131" className="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600 transition">WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-white py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center" data-aos="fade-up">Why Choose Space of Purification Global?</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            With over 12 years of experience, we’ve helped people overcome deep mental struggles like anxiety, overthinking, and emotional pain. We don’t just give advice — we offer proven methods and deep transformation techniques that bring lasting peace and clarity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cards go here */}
          </div>
        </div>
      </section>

      {/* Share Your Story Section */}
      <section id="share-story" className="bg-blue-50 py-16 px-6 md:px-20 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-black" data-aos="fade-up">Stories of Transformation</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            We believe your story matters. Share how you've transformed your life, and inspire others to begin their journey of healing. Every step counts, and your voice can bring light to someone still in the dark.
          </p>
          <div data-aos="fade-up" data-aos-delay="200" className="hidden sm:block">
            <a href="share-form.html" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
              Share Your Transformation Story
            </a>
          </div>
        </div>
        <a href="share-form.html" className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-md transition sm:hidden">
          + Share Story
        </a>
        <div id="homepageStories" className="mt-20 grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
      </section>

      {/* About You / Our Vision Section */}
      <section id="about" className="relative py-24 px-6 md:px-20 overflow-hidden bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <div className="relative z-10 max-w-5xl mx-auto text-center" data-aos="fade-up">
          <div className="backdrop-blur-md bg-white/70 p-10 rounded-2xl shadow-2xl border border-white/40">
            <h2 className="text-4xl font-bold text-blue-800 mb-4">About You — The Seeker</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              You’re not just visiting another website. You’re here because something inside you wants clarity, healing, and a real breakthrough. Whether you’re drowning in overthinking or feeling lost despite success — your journey is valid. We see you.
            </p>
            <h3 className="text-2xl font-semibold text-purple-700 mt-8 mb-2">Our Vision</h3>
            <p className="text-md text-gray-600 leading-relaxed">
              Space of Purification Global was born from 12+ years of guiding minds through pain and into light. We're not therapists. We’re mind healers, vision clearers, energy transformers. Our mission? To help you unlock the peaceful warrior inside.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-orange-50 py-16 px-4 sm:px-6 lg:px-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-orange-600 mb-12">
          Our Pricing Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pricing cards go here */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-12 mt-16 rounded-t-3xl shadow-inner">
        {/* Footer content goes here */}
      </footer>
    </>
  );
}

export default App;
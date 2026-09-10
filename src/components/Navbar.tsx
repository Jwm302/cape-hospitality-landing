import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { CapeLogo } from './CapeLogo';

interface NavbarProps {
  onScheduleBriefing: () => void;
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScheduleBriefing,
  onContactClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Our USP', href: '#usp' },
    { label: 'Data Science', href: '#data-science' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-zinc-200/90 py-3 shadow-xs'
          : 'bg-[#fbfbfa]/90 backdrop-blur-md border-b border-zinc-200/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Mark in Navbar */}
          <a
            href="#"
            className="flex items-center group focus:outline-none"
            id="nav-logo"
            aria-label="Cape Hospitality Advisers"
          >
            <CapeLogo variant="navbar" />
          </a>

          {/* Clean Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-1.5 shadow-xs">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-1 text-xs font-semibold text-zinc-600 hover:text-[#10213a] rounded-full hover:bg-zinc-100 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Simple CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onScheduleBriefing}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold rounded-full bg-[#10213a] text-white hover:bg-[#1a335a] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
              id="nav-briefing-btn"
            >
              <span>Schedule Briefing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 focus:outline-none rounded-lg border border-zinc-200 bg-white"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 border border-zinc-200 bg-white rounded-2xl flex flex-col gap-2 shadow-lg">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 py-2 px-3 rounded-lg hover:bg-zinc-50"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-zinc-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScheduleBriefing();
                }}
                className="w-full py-3 text-xs font-bold rounded-full bg-[#10213a] text-white flex items-center justify-center gap-2"
              >
                Schedule Briefing
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

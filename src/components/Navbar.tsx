import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { CapeLogo } from './CapeLogo';

interface NavbarProps {
  onScheduleBriefing: () => void;
  onContactClick: () => void;
  onRequestFreeDataPackage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScheduleBriefing,
  onContactClick,
  onRequestFreeDataPackage,
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
    { label: 'Methodology', href: '#reality-gap' },
    { label: 'Virtual Audit', href: '#virtual-audit' },
    { label: 'On-Site Case Study', href: '#sample-audit' },
    { label: 'Why Partner', href: '#usp' },
    { label: 'Services', href: '#pricing' },
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
            aria-label="Cape Hospitality Advisors"
          >
            <CapeLogo variant="navbar" />
          </a>

          {/* Clean Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-1.5 shadow-xs">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1 text-xs font-semibold text-zinc-600 hover:text-[#10213a] rounded-full hover:bg-zinc-100 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onRequestFreeDataPackage}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border border-[#b38a54]/40 bg-[#b38a54]/10 text-[#9c753e] hover:bg-[#b38a54] hover:text-white active:scale-[0.98] transition-all cursor-pointer"
              id="nav-free-package-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Free Data Package</span>
            </button>

            <button
              onClick={onScheduleBriefing}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold rounded-full bg-[#10213a] text-white hover:bg-[#1a335a] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
              id="nav-briefing-btn"
            >
              <span>Schedule Briefing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
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
          <div className="lg:hidden mt-3 p-5 border border-zinc-200 bg-white rounded-2xl flex flex-col gap-2 shadow-lg text-left">
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
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestFreeDataPackage();
                }}
                className="w-full py-2.5 text-xs font-bold rounded-full border border-[#b38a54] text-[#9c753e] bg-[#b38a54]/10 flex items-center justify-center gap-2"
              >
                Get Free Data Package Now
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScheduleBriefing();
                }}
                className="w-full py-2.5 text-xs font-bold rounded-full bg-[#10213a] text-white flex items-center justify-center gap-2"
              >
                Schedule Confidential Briefing
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

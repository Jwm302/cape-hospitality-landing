import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { CapeLogo } from './CapeLogo';
import { LanguageSwitch } from './LanguageSwitch';
import { useLang } from '../i18n';

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

// Links start with "/" so they also work from the sample report page.
const NAV_ITEMS: Record<'en' | 'de', NavItem[]> = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'Try the Demo', href: '/#virtual-audit' },
    {
      label: 'Services',
      href: '/#services',
      children: [
        { label: 'Free Virtual Audit', href: '/#services' },
        { label: 'On-Site Mystery Audit', href: '/#services' },
        { label: 'Portfolio Partnership', href: '/#services' },
      ],
    },
    { label: 'Sample Report', href: '/sample-report' },
    { label: 'Contact', href: '/#contact' },
  ],
  de: [
    { label: 'Start', href: '/' },
    { label: 'Demo testen', href: '/#virtual-audit' },
    {
      label: 'Leistungen',
      href: '/#services',
      children: [
        { label: 'Kostenloses Virtuelles Audit', href: '/#services' },
        { label: 'Mystery-Audit vor Ort', href: '/#services' },
        { label: 'Portfolio-Partnerschaft', href: '/#services' },
      ],
    },
    { label: 'Beispielbericht', href: '/sample-report' },
    { label: 'Kontakt', href: '/#contact' },
  ],
};

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang } = useLang();
  const items = NAV_ITEMS[lang];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <a href="/" id="nav-logo" aria-label="Cape Hospitality Advisors">
          <CapeLogo variant="navbar" />
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-7">
          <nav className="flex items-center gap-7">
            {items.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-1 text-sm uppercase tracking-wide text-zinc-600 hover:text-zinc-900"
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </a>
                  <div className="absolute left-0 top-full pt-3 hidden group-hover:block group-focus-within:block">
                    <div className="w-60 bg-zinc-800 py-2 shadow-lg">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-white hover:bg-zinc-700"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm uppercase tracking-wide text-zinc-600 hover:text-zinc-900"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <LanguageSwitch compact />
        </div>

        {/* Mobile: language switch stays visible next to the menu button */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitch compact />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-zinc-900"
            aria-label={lang === 'de' ? 'Menü öffnen' : 'Toggle menu'}
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-zinc-200 bg-white px-4 py-3 flex flex-col">
          {items.map((item) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-sm uppercase tracking-wide text-zinc-700"
              >
                {item.label}
              </a>
              {item.children?.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 pl-4 text-sm text-zinc-500"
                >
                  {child.label}
                </a>
              ))}
            </React.Fragment>
          ))}
        </nav>
      )}
    </header>
  );
};

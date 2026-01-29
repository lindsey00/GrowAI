import React from 'react';
import { Twitter, Linkedin, Youtube, Github } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    [t.footer.product]: [
      { label: t.footer.platform, href: '#platform' },
      { label: t.footer.technology, href: '#technology' },
      { label: t.footer.solutions, href: '#solutions' },
      { label: t.footer.pricing, href: '#pricing' }
    ],
    [t.footer.company]: [
      { label: t.footer.about, href: '#about' },
      { label: t.footer.careers, href: '#careers' },
      { label: t.footer.news, href: '#news' },
      { label: t.footer.contact, href: '#contact' }
    ],
    [t.footer.resources]: [
      { label: t.footer.docs, href: '#docs' },
      { label: t.footer.support, href: '#support' },
      { label: t.footer.blog, href: '#blog' },
      { label: t.footer.community, href: '#community' }
    ],
    [t.footer.legal]: [
      { label: t.footer.privacy, href: '#privacy' },
      { label: t.footer.terms, href: '#terms' },
      { label: t.footer.security, href: '#security' },
      { label: t.footer.compliance, href: '#compliance' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Logo - CSS Based */}
            <a href="/" className="group relative mb-4 inline-block">
              <div className="flex items-baseline gap-0 transition-all duration-700">
                {/* GrowA Text */}
                <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-700 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-300">
                  GrowA
                </span>
                
                {/* i with Star on top */}
                <div className="relative inline-flex flex-col items-center">
                  {/* Star Icon - positioned above i */}
                  <svg className="w-3 h-3 text-cyan-400 absolute -top-3 group-hover:scale-125 transition-transform duration-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  {/* i stem */}
                  <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-700 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-300">
                    I
                  </span>
                </div>

                {/* -MAP Text */}
                <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-700 group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-300">
                  -MAP
                </span>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-400/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-cyan-400/20 group-hover:to-blue-500/20 blur-xl transition-all duration-700 rounded-lg -z-10"></div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} {t.footer.brand}. {t.footer.rights}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-gray-500 hover:text-white transition-colors">
              {t.footer.privacyPolicy}
            </a>
            <a href="#terms" className="text-gray-500 hover:text-white transition-colors">
              {t.footer.termsOfService}
            </a>
            <a href="#cookies" className="text-gray-500 hover:text-white transition-colors">
              {t.footer.cookieSettings}
            </a>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;

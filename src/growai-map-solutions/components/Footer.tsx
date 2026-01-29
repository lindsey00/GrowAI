
import React from 'react';
import { Home, Database, BarChart3, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-main border-t border-white/5 pt-24 pb-32 md:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 bg-primary rounded flex items-center justify-center">
                <BarChart3 className="size-5 text-main" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">GrowAI-MAP</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
              {t.footer.description}
            </p>
            <div className="flex gap-6">
              <Twitter className="size-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="size-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <Github className="size-5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{t.footer.product}</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.aiPlatform}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.predictive}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.quality}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.supply}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{t.footer.company}</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.caseStudies}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.about}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.careers}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.news}</a></li>
            </ul>
          </div>

          <div className="hidden lg:block">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{t.footer.resources}</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.documentation}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.caseStudies}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.blog}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-mono uppercase tracking-[0.2em]">© 2024 GROWAI-MAP SOLUTIONS INC. {t.footer.rights}</p>
          <div className="flex gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white">{t.footer.terms}</a>
            <a href="#" className="hover:text-white">{t.footer.security}</a>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
        <div className="flex items-center justify-around bg-main/80 backdrop-blur-xl border-t border-white/5 px-6 pb-8 pt-3">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home className="size-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <Database className="size-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Systems</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <BarChart3 className="size-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Reports</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <Mail className="size-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Help</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

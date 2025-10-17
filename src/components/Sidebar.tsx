import { Link } from 'react-router-dom';
import { X, Phone, Store, UserCheck, ClipboardList, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const contactLinks = [
  {
    id: 'supplier',
    icon: Package,
    labelKey: 'contactSupplier',
    path: '/contact/supplier',
  },
  {
    id: 'owner',
    icon: Store,
    labelKey: 'contactMedicalOwner',
    path: '/contact/medical-owner',
  },
  {
    id: 'rep',
    icon: UserCheck,
    labelKey: 'contactMedicalRep',
    path: '/contact/medical-rep',
  },
  {
    id: 'booker',
    icon: ClipboardList,
    labelKey: 'contactOrderBooker',
    path: '/contact/order-booker',
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, language } = useLanguage();
  const isUrdu = language === 'urdu';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-card border-r transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)]`}
      >
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h2 className={`text-lg font-semibold ${isUrdu ? 'font-urdu' : ''}`}>
            {t('quickContacts')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-full pb-20">
          <div className="p-4">
            <div className="hidden md:block mb-6">
              <h2 className={`text-lg font-semibold ${isUrdu ? 'font-urdu' : ''}`}>
                {t('quickContacts')}
              </h2>
            </div>

            <nav className="space-y-2">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.id}
                    to={link.path}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`text-sm font-medium ${isUrdu ? 'font-urdu' : ''}`}>
                      {t(link.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

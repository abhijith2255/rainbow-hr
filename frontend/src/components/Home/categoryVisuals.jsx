import { useState } from 'react';
import {
  Code,
  HeartPulse,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Utensils,
  Truck,
  Users,
  Monitor,
  Stethoscope,
  Landmark,
  Megaphone,
  Factory,
  Plane,
  Wrench,
  Palette,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Database,
  LayoutGrid,
  Building2,
} from 'lucide-react';

// Category.icon field-il ninnu varunna Lucide icon name -> React component mapping.
// ManageCategories-il 'code', 'monitor' ennu lowercase aayum type cheyyunnathu kondu
// ella keys-um lowercase-il aanu store cheyyunnathu.
const ICONS = {
  code: Code,
  heartpulse: HeartPulse,
  trendingup: TrendingUp,
  briefcase: Briefcase,
  graduationcap: GraduationCap,
  utensils: Utensils,
  truck: Truck,
  users: Users,
  monitor: Monitor,
  stethoscope: Stethoscope,
  landmark: Landmark,
  megaphone: Megaphone,
  factory: Factory,
  plane: Plane,
  wrench: Wrench,
  palette: Palette,
  scale: Scale,
  shieldcheck: ShieldCheck,
  shoppingcart: ShoppingCart,
  database: Database,
};

// Ariyappedaatha icon name-ukalil kaanikkunna default icon.
export const FALLBACK_ICON = LayoutGrid;

// Icon name-ne clean cheythu matching Lucide component thirichu nalkunnu.
export const resolveCategoryIcon = (iconName) => {
  if (!iconName) return FALLBACK_ICON;

  // Spaces, underscores, hyphens maatti kalayunnu + lowercase aakkunnu.
  const key = String(iconName).trim().toLowerCase().replace(/[\s_-]/g, '');
  if (ICONS[key]) return ICONS[key];

  // 'FaCode', 'SiPython' polulla react-icons style prefixes handle cheyyunnu.
  const stripped = key.replace(/^(fa|si|bi|md|hi|ti|fi)[a-z]?/, '');
  return ICONS[stripped] || FALLBACK_ICON;
};

// Oru category-inu vendi Lucide icon render cheyyunna reusable component.
export const CategoryIcon = ({ iconName, className = 'w-8 h-8' }) => {
  const Icon = resolveCategoryIcon(iconName);
  return <Icon className={className} strokeWidth={2} />;
};

// Oru category card-inu distinct aaya vibrant gradient theme.
// index % length upayogichu ella card-inum different color range kittunnu.
export const CATEGORY_THEMES = [
  {
    icon: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/30',
    accent: 'group-hover:text-emerald-300',
    chip: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/25',
    ring: 'hover:border-emerald-400/40',
  },
  {
    icon: 'from-rose-400 to-pink-500',
    glow: 'shadow-rose-500/30',
    accent: 'group-hover:text-rose-300',
    chip: 'bg-rose-400/10 text-rose-200 border-rose-400/25',
    ring: 'hover:border-rose-400/40',
  },
  {
    icon: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/30',
    accent: 'group-hover:text-amber-300',
    chip: 'bg-amber-400/10 text-amber-200 border-amber-400/25',
    ring: 'hover:border-amber-400/40',
  },
  {
    icon: 'from-sky-400 to-indigo-500',
    glow: 'shadow-sky-500/30',
    accent: 'group-hover:text-sky-300',
    chip: 'bg-sky-400/10 text-sky-200 border-sky-400/25',
    ring: 'hover:border-sky-400/40',
  },
  {
    icon: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/30',
    accent: 'group-hover:text-violet-300',
    chip: 'bg-violet-400/10 text-violet-200 border-violet-400/25',
    ring: 'hover:border-violet-400/40',
  },
  {
    icon: 'from-cyan-400 to-blue-500',
    glow: 'shadow-cyan-500/30',
    accent: 'group-hover:text-cyan-300',
    chip: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/25',
    ring: 'hover:border-cyan-400/40',
  },
  {
    icon: 'from-lime-400 to-green-500',
    glow: 'shadow-lime-500/30',
    accent: 'group-hover:text-lime-300',
    chip: 'bg-lime-400/10 text-lime-200 border-lime-400/25',
    ring: 'hover:border-lime-400/40',
  },
  {
    icon: 'from-fuchsia-400 to-purple-500',
    glow: 'shadow-fuchsia-500/30',
    accent: 'group-hover:text-fuchsia-300',
    chip: 'bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-400/25',
    ring: 'hover:border-fuchsia-400/40',
  },
  {
    icon: 'from-orange-400 to-red-500',
    glow: 'shadow-orange-500/30',
    accent: 'group-hover:text-orange-300',
    chip: 'bg-orange-400/10 text-orange-200 border-orange-400/25',
    ring: 'hover:border-orange-400/40',
  },
  {
    icon: 'from-teal-400 to-emerald-500',
    glow: 'shadow-teal-500/30',
    accent: 'group-hover:text-teal-300',
    chip: 'bg-teal-400/10 text-teal-200 border-teal-400/25',
    ring: 'hover:border-teal-400/40',
  },
];

export const getCategoryTheme = (index) =>
  CATEGORY_THEMES[Math.abs(index) % CATEGORY_THEMES.length];

// ---------- Company Logo / Industry Icon Tile ----------
// Job card-il kaanikkunna square tile. Company logo upload cheythittundenkil
// aa image kaanikkunnu; illenkil category-yude industry icon + vibrant gradient
// background kaanikkunnu. Ethu job-inum same category-kku same color kittan
// themeIndex aayi job.category (allenkil job.id) pass cheyyunnu.
const LOGO_SIZES = {
  sm: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6' },
  md: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
  lg: { box: 'w-16 h-16 rounded-2xl', icon: 'w-8 h-8' },
  xl: { box: 'w-20 h-20 rounded-[1.25rem]', icon: 'w-9 h-9' },
};

export const CompanyLogo = ({
  logoUrl,
  name = '',
  iconName,
  themeIndex = 0,
  size = 'md',
  className = '',
}) => {
  // Image load പരാജയപ്പെട്ടാൽ (broken URL) icon fallback-ലേക്ക് മാറുന്നു
  const [imgFailed, setImgFailed] = useState(false);
  const dims = LOGO_SIZES[size] || LOGO_SIZES.md;
  const theme = getCategoryTheme(themeIndex);

  if (logoUrl && !imgFailed) {
    return (
      <div className={`${dims.box} bg-white border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-200 transition-colors ${className}`}>
        <img
          src={logoUrl}
          alt={name ? `${name} logo` : 'Company logo'}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    );
  }

  // Category name-il ninnu kittunna icon; athillenkil generic building icon
  const Icon = iconName ? resolveCategoryIcon(iconName) : Building2;
  return (
    <div className={`${dims.box} bg-gradient-to-br ${theme.icon} flex items-center justify-center shrink-0 shadow-lg ${theme.glow} group-hover:scale-105 transition-transform duration-300 ${className}`}>
      <Icon className={`${dims.icon} text-white`} strokeWidth={2} />
    </div>
  );
};

import createElement from '../vendor/lucide/createElement.js';
import House from '../vendor/lucide/icons/house.js';
import Search from '../vendor/lucide/icons/search.js';
import CalendarDays from '../vendor/lucide/icons/calendar-days.js';
import User from '../vendor/lucide/icons/user.js';
import ChevronRight from '../vendor/lucide/icons/chevron-right.js';
import Building from '../vendor/lucide/icons/building-2.js';
import Landmark from '../vendor/lucide/icons/landmark.js';
import Globe from '../vendor/lucide/icons/globe.js';
import Briefcase from '../vendor/lucide/icons/briefcase.js';
import Upload from '../vendor/lucide/icons/cloud-upload.js';
import FileText from '../vendor/lucide/icons/file-text.js';
import Clock from '../vendor/lucide/icons/clock-3.js';
import Check from '../vendor/lucide/icons/circle-check-big.js';
import Copy from '../vendor/lucide/icons/copy.js';
import Video from '../vendor/lucide/icons/video.js';
import Rotate from '../vendor/lucide/icons/rotate-ccw.js';
import Close from '../vendor/lucide/icons/circle-x.js';
import Message from '../vendor/lucide/icons/message-square.js';
import Wallet from '../vendor/lucide/icons/wallet-cards.js';
import Graduation from '../vendor/lucide/icons/graduation-cap.js';
import CalendarClock from '../vendor/lucide/icons/calendar-clock.js';
import Clipboard from '../vendor/lucide/icons/clipboard-check.js';
import Shield from '../vendor/lucide/icons/shield-check.js';
import Bell from '../vendor/lucide/icons/bell.js';
import Dashboard from '../vendor/lucide/icons/layout-dashboard.js';
import Users from '../vendor/lucide/icons/users.js';
import CalendarRange from '../vendor/lucide/icons/calendar-range.js';
import Receipt from '../vendor/lucide/icons/receipt-text.js';
import Support from '../vendor/lucide/icons/life-buoy.js';
import Banknote from '../vendor/lucide/icons/banknote.js';
import Chart from '../vendor/lucide/icons/chart-no-axes-column.js';
import Settings from '../vendor/lucide/icons/settings.js';
import Filter from '../vendor/lucide/icons/list-filter.js';
import More from '../vendor/lucide/icons/ellipsis.js';
import Alert from '../vendor/lucide/icons/triangle-alert.js';
import Plus from '../vendor/lucide/icons/plus.js';
import ArrowLeft from '../vendor/lucide/icons/arrow-left.js';
import External from '../vendor/lucide/icons/external-link.js';
import Book from '../vendor/lucide/icons/book-open.js';
import Pencil from '../vendor/lucide/icons/pencil.js';
import Save from '../vendor/lucide/icons/save.js';
import Help from '../vendor/lucide/icons/circle-question-mark.js';
import Eye from '../vendor/lucide/icons/eye.js';
import Download from '../vendor/lucide/icons/download.js';
import Mail from '../vendor/lucide/icons/mail.js';
import Smartphone from '../vendor/lucide/icons/smartphone.js';
import Menu from '../vendor/lucide/icons/menu.js';
import Money from '../vendor/lucide/icons/circle-dollar-sign.js';
import FileCheck from '../vendor/lucide/icons/file-check.js';
import CalendarCheck from '../vendor/lucide/icons/calendar-check-2.js';
import Send from '../vendor/lucide/icons/send.js';
import BadgeCheck from '../vendor/lucide/icons/badge-check.js';

const nodes = {
  home: House, search: Search, calendar: CalendarDays, user: User, chevron: ChevronRight,
  building: Building, landmark: Landmark, globe: Globe, briefcase: Briefcase, upload: Upload,
  file: FileText, clock: Clock, check: Check, copy: Copy, video: Video, rotate: Rotate,
  close: Close, message: Message, wallet: Wallet, graduation: Graduation, calendarClock: CalendarClock,
  clipboard: Clipboard, shield: Shield, bell: Bell, dashboard: Dashboard, users: Users,
  calendarRange: CalendarRange, receipt: Receipt, support: Support, banknote: Banknote,
  chart: Chart, settings: Settings, filter: Filter, more: More, alert: Alert, plus: Plus,
  back: ArrowLeft, external: External, book: Book, pencil: Pencil, save: Save, help: Help,
  eye: Eye, download: Download, mail: Mail, smartphone: Smartphone, menu: Menu, money: Money,
  fileCheck: FileCheck, calendarCheck: CalendarCheck, send: Send, badgeCheck: BadgeCheck
};

export function icon(name, size = 20, className = '') {
  const node = nodes[name] || nodes.help;
  const element = createElement(node, {
    width: size,
    height: size,
    'stroke-width': 1.8,
    class: `icon ${className}`.trim(),
    'aria-hidden': 'true'
  });
  return element.outerHTML;
}


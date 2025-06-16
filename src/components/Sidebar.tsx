import sidebarStyles from "../styles/Sidebar.module.css";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
}

interface SidebarProps {
  logo?: string;
  activeItemId?: string;
  navItems?: NavItem[];
  onItemClick?: (itemId: string) => void;
}

const defaultNavItems: NavItem[] = [
  { id: "dashboard", label: "儀表板", icon: "📊", path: "/dashboard" },
  { id: "projects", label: "專案", icon: "📋", path: "/projects" },
  { id: "kanban", label: "看板", icon: "📌", path: "/kanban" },
  { id: "gantt", label: "甘特圖", icon: "📈", path: "/gantt" },
  { id: "team", label: "團隊", icon: "👥", path: "/team" },
  { id: "settings", label: "設定", icon: "⚙️", path: "/settings" },
];

export default function Sidebar({ 
  logo = "專案管理",
  activeItemId = "kanban",
  navItems = defaultNavItems,
  onItemClick 
}: SidebarProps) {
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === "Enter" || e.key === " ") {
      handleItemClick(navItems[currentIndex].id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % navItems.length;
      const nextElement = document.querySelector(`[data-nav-index="${nextIndex}"]`) as HTMLElement;
      nextElement?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? navItems.length - 1 : currentIndex - 1;
      const prevElement = document.querySelector(`[data-nav-index="${prevIndex}"]`) as HTMLElement;
      prevElement?.focus();
    }
  };

  return (
    <>
      <div className={sidebarStyles.logo}>{logo}</div>
      {navItems.map((item, index) => (
        <div
          key={item.id}
          data-nav-index={index}
          className={`${sidebarStyles.navItem} ${
            activeItemId === item.id ? sidebarStyles.active : ""
          }`}
          onClick={() => handleItemClick(item.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {item.icon} {item.label}
        </div>
      ))}
    </>
  );
}

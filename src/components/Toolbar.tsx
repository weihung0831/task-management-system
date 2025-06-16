import toolbarStyles from "../styles/Toolbar.module.css";

interface ToolbarAction {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: string;
  onClick?: () => void;
}

interface UserInfo {
  name: string;
  avatar?: string;
  initials?: string;
}

interface ToolbarProps {
  title?: string;
  actions?: ToolbarAction[];
  user?: UserInfo;
  onUserClick?: () => void;
}

const defaultActions: ToolbarAction[] = [
  { 
    id: "add-task", 
    label: "新增任務", 
    variant: "primary", 
    icon: "+" 
  }
];

export default function Toolbar({
  title = "專案看板",
  actions = defaultActions,
  user = { name: "User", initials: "U" },
  onUserClick
}: ToolbarProps) {
  const renderAction = (action: ToolbarAction) => {
    const className = `btn-${action.variant || "primary"}`;
    
    return (
      <button
        key={action.id}
        className={className}
        onClick={action.onClick}
        type="button"
      >
        {action.icon && <span>{action.icon}</span>}
        {action.label}
      </button>
    );
  };

  const handleUserClick = () => {
    onUserClick?.();
  };

  return (
    <>
      <div className={toolbarStyles.title}>{title}</div>
      <div className={toolbarStyles.actions}>
        {actions.map(renderAction)}
        <button 
          className={toolbarStyles.userAvatar}
          onClick={handleUserClick}
          type="button"
          aria-label={`用戶選單 - ${user.name}`}
          title={user.name}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            user.initials || user.name.charAt(0).toUpperCase()
          )}
        </button>
      </div>
    </>
  );
}

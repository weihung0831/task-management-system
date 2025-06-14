import sidebarStyles from "../styles/Sidebar.module.css";

export default function Sidebar() {
  return (
    <>
      <div className={sidebarStyles.logo}>專案管理</div>
      <div className={`${sidebarStyles.navItem} ${sidebarStyles.active}`}>
        📊 儀表板
      </div>
      <div className={sidebarStyles.navItem}>📋 專案</div>
      <div className={sidebarStyles.navItem}>📌 看板</div>
      <div className={sidebarStyles.navItem}>📈 甘特圖</div>
      <div className={sidebarStyles.navItem}>👥 團隊</div>
      <div className={sidebarStyles.navItem}>⚙️ 設定</div>
    </>
  );
}

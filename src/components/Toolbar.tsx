import toolbarStyles from "../styles/Toolbar.module.css";

export default function Toolbar() {
  return (
    <>
      <div className={toolbarStyles.title}>專案看板</div>
      <div className={toolbarStyles.actions}>
        <button className="btn-primary">+ 新增任務</button>
        <div className={toolbarStyles.userAvatar}>U</div>
      </div>
    </>
  );
}

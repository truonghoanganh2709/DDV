import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.box}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Huy
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            Xac nhan
          </button>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './ToastContainer.module.css';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export default function ToastContainer({ toasts }) {
  return (
    <div className={styles.wrap} aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        return (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
            <Icon size={20} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

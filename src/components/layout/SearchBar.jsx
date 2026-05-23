import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTypewriterPlaceholder } from '../../hooks/useTypewriterPlaceholder';
import styles from './SearchBar.module.css';

const PLACEHOLDERS = [
  'iPhone 17 Pro Max',
  'Galaxy S25 Ultra',
  'Xiaomi 15',
  'MacBook Air M4',
  'AirPods Pro 2',
];

export default function SearchBar({ initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const animated = useTypewriterPlaceholder(PLACEHOLDERS);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  return (
    <form className={styles.search} onSubmit={submit}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={query ? '' : animated || 'Bạn muốn tìm gì...'}
        aria-label="Tìm kiếm"
      />
      <button type="submit" aria-label="Tim">
        <Search size={20} />
      </button>
    </form>
  );
}

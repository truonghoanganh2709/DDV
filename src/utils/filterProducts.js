export function filterProducts(products, filters) {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sort,
    featured,
    onSale,
  } = filters;

  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  if (brand && brand !== 'all') {
    result = result.filter((p) => p.brand === brand);
  }

  if (minPrice != null && minPrice !== '') {
    result = result.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice != null && maxPrice !== '') {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (featured) {
    result = result.filter((p) => p.featured);
  }

  if (onSale) {
    result = result.filter((p) => p.originalPrice > p.price);
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }

  return result;
}

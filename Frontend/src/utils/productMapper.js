const seedsKeywords = ['seed', 'sapling'];

const normalizeImageUrl = (imageUrl, backendOrigin) => {
  if (!imageUrl) {
    return null;
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${backendOrigin}${cleanPath}`;
};

const deriveSections = (category = '', cropType = '') => {
  const isSeedCategory =
    category.toUpperCase() === 'SEEDS_SAPLINGS' ||
    seedsKeywords.some((keyword) => cropType.toLowerCase().includes(keyword));

  return isSeedCategory
    ? ['newArrivals', 'seeds']
    : ['newArrivals', 'products'];
};

const resolveDisplayCategory = (cropType = '', sections = []) => {
  if (sections.includes('seeds')) {
    return 'Seeds & Saplings';
  }
  return cropType || 'Vegetables';
};

const resolveCreatedOrder = (crop) => {
  if (crop.createdAt) {
    const created = Date.parse(crop.createdAt);
    if (!Number.isNaN(created)) {
      return created;
    }
  }
  if (crop.harvestDate) {
    const harvest = Date.parse(crop.harvestDate);
    if (!Number.isNaN(harvest)) {
      return harvest;
    }
  }
  return crop.id || 0;
};

export const mapCropToProduct = (crop, backendOrigin) => {
  const sections = deriveSections(crop.category || '', crop.cropType || '');
  const image = normalizeImageUrl(crop.imageUrl, backendOrigin);

  return {
    id: crop.id,
    name: crop.cropName,
    farm: crop.farmer?.name || 'Farmer',
    location: crop.location,
    price: `₹${crop.price}`,
    unit: '/ unit',
    image,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 200) + 50,
    categoryLabel: resolveDisplayCategory(crop.cropType, sections),
    cropType: crop.cropType,
    sections,
    createdOrder: resolveCreatedOrder(crop),
    organic: false,
    fairPrice: true,
    isNew: sections.includes('newArrivals'),
  };
};

export const filterBySection = (products, section) =>
  products.filter((product) => product.sections.includes(section));



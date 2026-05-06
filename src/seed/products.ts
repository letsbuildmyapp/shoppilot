import type { Product } from '@/types';

// Real Unsplash image URLs — direct file URLs, no API needed.
const img = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const now = Date.now();

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'tide-bowl',
    slug: 'tide-bowl',
    name: 'Tide Serving Bowl',
    category: 'serving',
    shortDescription: 'Wide, shallow stoneware bowl in a slow-poured ash glaze.',
    description:
      'Thrown on the wheel in our Vermont studio and finished with an ash glaze that breaks toward the rim. Each bowl is one of about thirty in a single firing — no two are quite alike. Food-safe, dishwasher safe, microwaveable.',
    images: [
      img('photo-1610701596061-2ecf227e85b2'),
      img('photo-1578749556568-bc2c40e68b61'),
      img('photo-1606755456206-b25206cde27e'),
    ],
    variants: [
      { id: 'tide-9', label: '9 inch', priceCents: 8800, inventory: 12, sku: 'KR-TIDE-9' },
      { id: 'tide-12', label: '12 inch', priceCents: 14200, inventory: 6, sku: 'KR-TIDE-12' },
    ],
    basePriceCents: 8800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 30,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: 'haystack-mug',
    slug: 'haystack-mug',
    name: 'Haystack Mug',
    category: 'mugs',
    shortDescription: 'A heavy, hand-thrown mug with a thumb-rest handle.',
    description:
      'Designed for slow mornings. Generous bowl, deliberate handle, glazed in oat or storm. Holds 12 oz comfortably.',
    images: [
      img('photo-1514228742587-6b1558fcca3d'),
      img('photo-1517256064527-09c73fc73e38'),
      img('photo-1581244277943-fe4a9c777189'),
    ],
    variants: [
      { id: 'haystack-oat', label: 'Oat', priceCents: 4400, inventory: 24, sku: 'KR-HAY-OAT' },
      { id: 'haystack-storm', label: 'Storm', priceCents: 4400, inventory: 18, sku: 'KR-HAY-STM' },
    ],
    basePriceCents: 4400,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 28,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: 'nocturne-vase',
    slug: 'nocturne-vase',
    name: 'Nocturne Vase',
    category: 'vases',
    shortDescription: 'Tall porcelain vase with a wood-fired tenmoku finish.',
    description:
      'Wood-fired in our anagama kiln over 36 hours. The tenmoku glaze pools at the foot and breaks deep blue along the shoulder. Holds water; intended for short cuttings or dried branches.',
    images: [
      img('photo-1582719471384-894fbb16e074'),
      img('photo-1493106819501-66d381c466f1'),
      img('photo-1587049352846-4a222e784d38'),
    ],
    variants: [
      { id: 'nocturne-std', label: '11 in', priceCents: 21500, inventory: 4, sku: 'KR-NOC-11' },
    ],
    basePriceCents: 21500,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 60,
    updatedAt: now - 86400000 * 4,
  },
  {
    id: 'field-dinner-plate',
    slug: 'field-dinner-plate',
    name: 'Field Dinner Plate',
    category: 'tableware',
    shortDescription: 'A 10½" dinner plate with a soft, hand-rolled rim.',
    description:
      'Our most-loved plate, made in pairs and quads. The off-white slip is finished with a clear satin glaze. Sized for everyday meals.',
    images: [
      img('photo-1530747673506-b9bd6b2c8b3d'),
      img('photo-1512149074996-e923ac45be6a'),
      img('photo-1556909114-f6e7ad7d3136'),
    ],
    variants: [
      { id: 'field-bone', label: 'Bone', priceCents: 5800, inventory: 30, sku: 'KR-FLD-BN' },
      { id: 'field-moss', label: 'Moss', priceCents: 6200, inventory: 14, sku: 'KR-FLD-MS' },
    ],
    basePriceCents: 5800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 21,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: 'kettle-teapot',
    slug: 'kettle-teapot',
    name: 'Kettle Teapot',
    category: 'tea',
    shortDescription: 'Round-bellied teapot with a cane-wrapped handle.',
    description:
      'Stoneware body, cane-wrapped handle, integrated strainer. Brews 24 oz, a generous two cups.',
    images: [
      img('photo-1576092768241-dec231879fc3'),
      img('photo-1556679343-c7306c1976bc'),
      img('photo-1597328629137-bca4cae89c79'),
    ],
    variants: [
      { id: 'kettle-std', label: 'Stoneware', priceCents: 16800, inventory: 9, sku: 'KR-KET' },
    ],
    basePriceCents: 16800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 18,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: 'ridge-tumbler',
    slug: 'ridge-tumbler',
    name: 'Ridge Tumbler',
    category: 'mugs',
    shortDescription: 'A short, wide-mouthed tumbler for whiskey or matcha.',
    description:
      'Hand-thrown and faceted, with a satin nuka glaze. Comfortable in hand; holds 8 oz.',
    images: [
      img('photo-1567706402313-c094f00c3a77'),
      img('photo-1518733057094-95b53143d2a7'),
      img('photo-1485962398705-ef6a13c41e8f'),
    ],
    variants: [
      { id: 'ridge-nuka', label: 'Nuka', priceCents: 3800, inventory: 22, sku: 'KR-RDG-N' },
      { id: 'ridge-iron', label: 'Iron', priceCents: 3800, inventory: 16, sku: 'KR-RDG-I' },
    ],
    basePriceCents: 3800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 14,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: 'orchard-pitcher',
    slug: 'orchard-pitcher',
    name: 'Orchard Pitcher',
    category: 'serving',
    shortDescription: 'A two-quart pitcher with a wide pouring lip.',
    description:
      'Generously sized for water, cider, or wildflowers. Glazed in a soft celadon green.',
    images: [
      img('photo-1487349384428-12b47aca925e'),
      img('photo-1495474472287-4d71bcdd2085'),
      img('photo-1554118811-1e0d58224f24'),
    ],
    variants: [
      { id: 'orch-celadon', label: 'Celadon', priceCents: 11800, inventory: 8, sku: 'KR-OR-CEL' },
    ],
    basePriceCents: 11800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 26,
    updatedAt: now - 86400000 * 5,
  },
  {
    id: 'spoonful-bowl',
    slug: 'spoonful-bowl',
    name: 'Spoonful Bowl',
    category: 'tableware',
    shortDescription: 'A 6" cereal-and-soup bowl, sold in pairs.',
    description:
      'Sized for granola, miso, or a small soup. Sold in matched pairs from a single firing.',
    images: [
      img('photo-1606755962773-d324e0a13086'),
      img('photo-1622428051717-dcd8412959de'),
      img('photo-1611464908623-07b29c557354'),
    ],
    variants: [
      { id: 'spoon-bone', label: 'Bone, pair', priceCents: 7400, inventory: 20, sku: 'KR-SPN-BN' },
      { id: 'spoon-moss', label: 'Moss, pair', priceCents: 7800, inventory: 12, sku: 'KR-SPN-MS' },
    ],
    basePriceCents: 7400,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 11,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: 'meadow-planter',
    slug: 'meadow-planter',
    name: 'Meadow Planter',
    category: 'planters',
    shortDescription: 'A 7" footed planter with drainage and dish.',
    description:
      'A planter sized for a medium houseplant — pothos, philodendron, snake plant. Ships with a matching saucer dish.',
    images: [
      img('photo-1485955900006-10f4d324d411'),
      img('photo-1459411552884-841db9b3cc2a'),
      img('photo-1463320898484-cdee8141c787'),
    ],
    variants: [
      { id: 'meadow-bone', label: 'Bone', priceCents: 6400, inventory: 18, sku: 'KR-MDW-BN' },
      { id: 'meadow-iron', label: 'Iron', priceCents: 6400, inventory: 11, sku: 'KR-MDW-IR' },
    ],
    basePriceCents: 6400,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 9,
    updatedAt: now - 86400000 * 0,
  },
  {
    id: 'cabin-mug',
    slug: 'cabin-mug',
    name: 'Cabin Mug',
    category: 'mugs',
    shortDescription: 'A taller mug with a short handle, sized for soup or coffee.',
    description:
      'Holds 14 oz. Interior glazed clear; exterior glazed in a deep iron speckle.',
    images: [
      img('photo-1572119865084-43c285814d63'),
      img('photo-1521017432531-fbd92d768814'),
      img('photo-1495474472287-4d71bcdd2085'),
    ],
    variants: [
      { id: 'cabin-iron', label: 'Iron', priceCents: 4800, inventory: 26, sku: 'KR-CAB-IR' },
    ],
    basePriceCents: 4800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 8,
    updatedAt: now - 86400000 * 1,
  },
  {
    id: 'bramble-platter',
    slug: 'bramble-platter',
    name: 'Bramble Platter',
    category: 'serving',
    shortDescription: 'A 14" oval platter for bread, fish, or a roast.',
    description:
      'Substantial enough for a centerpiece roast. Hand-rolled rim, satin glaze.',
    images: [
      img('photo-1551024506-0bccd828d307'),
      img('photo-1535470745795-6c2f6dafdf78'),
      img('photo-1542910503-6e7d4b5d7e5b'),
    ],
    variants: [
      { id: 'bramble-bone', label: 'Bone', priceCents: 12800, inventory: 7, sku: 'KR-BRM-BN' },
    ],
    basePriceCents: 12800,
    syncedFromShopify: false,
    active: true,
    createdAt: now - 86400000 * 4,
    updatedAt: now - 86400000 * 0,
  },
  {
    id: 'lantern-vase',
    slug: 'lantern-vase',
    name: 'Lantern Vase',
    category: 'vases',
    shortDescription: 'A small, single-stem porcelain vase.',
    description:
      'Small enough for a windowsill, sized for one or two stems. Unglazed exterior, glazed interior; reveals the porcelain body.',
    images: [
      img('photo-1565538810643-b5bdb714032a'),
      img('photo-1557777586-f6682739fcf3'),
      img('photo-1582486225644-d9d2737f3aac'),
    ],
    variants: [
      { id: 'lantern-std', label: 'Porcelain', priceCents: 5400, inventory: 14, sku: 'KR-LNT' },
    ],
    basePriceCents: 5400,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 6,
    updatedAt: now - 86400000 * 0,
  },
  {
    id: 'thicket-tea-cup',
    slug: 'thicket-tea-cup',
    name: 'Thicket Tea Cup',
    category: 'tea',
    shortDescription: 'A small, handle-less tea cup, sold in sets of two.',
    description:
      'Sized for green tea or a small espresso. Comfortable in two hands. Sold as matched pairs from a single firing.',
    images: [
      img('photo-1571934811356-5cc061b6821f'),
      img('photo-1597318181409-cf64d0b5d8a2'),
      img('photo-1606312619070-d48b4c652a52'),
    ],
    variants: [
      { id: 'thicket-pair', label: 'Pair', priceCents: 6800, inventory: 16, sku: 'KR-TKT' },
    ],
    basePriceCents: 6800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 5,
    updatedAt: now - 86400000 * 0,
  },
  {
    id: 'oat-side-plate',
    slug: 'oat-side-plate',
    name: 'Oat Side Plate',
    category: 'tableware',
    shortDescription: 'A 7½" side plate, made in matched quads.',
    description:
      'For toast, salad, dessert. Made in fours; the photograph shows variation across one firing.',
    images: [
      img('photo-1607301406259-dfb186e15de8'),
      img('photo-1600628421066-f6bda6a7b976'),
      img('photo-1545315835-1c97e3a0b14a'),
    ],
    variants: [
      { id: 'oat-bone', label: 'Bone, set of 4', priceCents: 14800, inventory: 9, sku: 'KR-OAT-BN' },
    ],
    basePriceCents: 14800,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 16,
    updatedAt: now - 86400000 * 2,
  },
  {
    id: 'compass-bowl',
    slug: 'compass-bowl',
    name: 'Compass Bowl',
    category: 'serving',
    shortDescription: 'A medium serving bowl with hand-trimmed rings.',
    description:
      'A workhorse — sized between cereal and centerpiece. Sturdy, with deep hand-trimmed rings on the foot.',
    images: [
      img('photo-1587302912306-cf1ed9c33146'),
      img('photo-1596797038530-2c107229654b'),
      img('photo-1579113800032-c38bd7635818'),
    ],
    variants: [
      { id: 'compass-storm', label: 'Storm', priceCents: 9400, inventory: 11, sku: 'KR-CMP-STM' },
    ],
    basePriceCents: 9400,
    syncedFromShopify: true,
    syncedAt: now - 1000 * 60 * 60 * 6,
    active: true,
    createdAt: now - 86400000 * 7,
    updatedAt: now - 86400000 * 0,
  },
];

export function findProduct(idOrSlug: string) {
  return SEED_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export const CATEGORY_LABEL: Record<string, string> = {
  tableware: 'Tableware',
  vases: 'Vases',
  mugs: 'Mugs & Cups',
  serving: 'Serving',
  planters: 'Planters',
  tea: 'Tea',
};

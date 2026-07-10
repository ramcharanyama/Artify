// ─── Users ───────────────────────────────────────────────────────────────────

export const dummyUsers = [
  {
    id: 1,
    email: 'admin@artify.com',
    name: 'Admin User',
    phone: '9000000001',
    address: 'Artify HQ, Mumbai',
    avatarUrl: null,
    role: 'ADMIN',
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: 2,
    email: 'ravi.artist@artify.com',
    name: 'Ravi Kumar',
    phone: '9000000002',
    address: 'Jubilee Hills, Hyderabad',
    avatarUrl: null,
    role: 'ARTIST',
    createdAt: '2025-01-15T00:00:00',
  },
  {
    id: 3,
    email: 'priya.artist@artify.com',
    name: 'Priya Sharma',
    phone: '9000000003',
    address: 'Koramangala, Bangalore',
    avatarUrl: null,
    role: 'ARTIST',
    createdAt: '2025-02-01T00:00:00',
  },
  {
    id: 4,
    email: 'amit@artify.com',
    name: 'Amit Patel',
    phone: '9000000004',
    address: 'Andheri West, Mumbai',
    avatarUrl: null,
    role: 'CUSTOMER',
    createdAt: '2025-03-01T00:00:00',
  },
  {
    id: 5,
    email: 'sneha@artify.com',
    name: 'Sneha Reddy',
    phone: '9000000005',
    address: 'Banjara Hills, Hyderabad',
    avatarUrl: null,
    role: 'CUSTOMER',
    createdAt: '2025-03-15T00:00:00',
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

export const dummyCategories = [
  {
    id: 1,
    name: 'Paintings',
    description: 'Oil, acrylic, and watercolor paintings',
    imageUrl: '/images/cat-paintings.jpg',
  },
  {
    id: 2,
    name: 'Digital Art',
    description: 'Digital illustrations and graphic art',
    imageUrl: '/images/cat-digital.jpg',
  },
  {
    id: 3,
    name: 'Sculptures',
    description: '3D art sculptures and installations',
    imageUrl: '/images/cat-sculptures.jpg',
  },
  {
    id: 4,
    name: 'Photography',
    description: 'Fine art and landscape photography',
    imageUrl: '/images/cat-photography.jpg',
  },
  {
    id: 5,
    name: 'Sketches',
    description: 'Pencil, charcoal, and ink sketches',
    imageUrl: '/images/cat-sketches.jpg',
  },
];

// ─── Products ────────────────────────────────────────────────────────────────

export const dummyProducts = [
  {
    id: 1,
    artistId: 2,
    categoryId: 1,
    title: 'Sunset Over Ganges',
    description:
      'A breathtaking oil painting capturing the golden sunset over the sacred Ganges river. The warm hues of orange and gold reflect beautifully on the water surface.',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
    stock: 1,
    status: 'ACTIVE',
    createdAt: '2025-04-01T10:00:00',
    artistName: 'Ravi Kumar',
    categoryName: 'Paintings',
  },
  {
    id: 2,
    artistId: 2,
    categoryId: 1,
    title: 'Mystic Mountains',
    description:
      'An acrylic masterpiece depicting the misty peaks of the Western Ghats at dawn. Layers of blues and purples create depth and mystery.',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500',
    stock: 1,
    status: 'ACTIVE',
    createdAt: '2025-04-05T10:00:00',
    artistName: 'Ravi Kumar',
    categoryName: 'Paintings',
  },
  {
    id: 3,
    artistId: 3,
    categoryId: 2,
    title: 'Cyberpunk Dreams',
    description:
      'A vibrant digital artwork featuring a futuristic cityscape bathed in neon lights. Every detail has been meticulously crafted.',
    price: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339afa560d?w=500',
    stock: 5,
    status: 'ACTIVE',
    createdAt: '2025-04-10T10:00:00',
    artistName: 'Priya Sharma',
    categoryName: 'Digital Art',
  },
  {
    id: 4,
    artistId: 3,
    categoryId: 2,
    title: 'Abstract Harmony',
    description:
      'An abstract digital composition exploring the interplay of geometric shapes and organic forms in a cosmic setting.',
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
    stock: 3,
    status: 'ACTIVE',
    createdAt: '2025-04-12T10:00:00',
    artistName: 'Priya Sharma',
    categoryName: 'Digital Art',
  },
  {
    id: 5,
    artistId: 2,
    categoryId: 3,
    title: 'Dancing Shiva Bronze',
    description:
      'A handcrafted bronze sculpture of Nataraja, the cosmic dancer. This exquisite piece captures the divine rhythm of creation and destruction.',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=500',
    stock: 1,
    status: 'ACTIVE',
    createdAt: '2025-04-15T10:00:00',
    artistName: 'Ravi Kumar',
    categoryName: 'Sculptures',
  },
  {
    id: 6,
    artistId: 3,
    categoryId: 4,
    title: 'Monsoon in Kerala',
    description:
      'A stunning photograph capturing the dramatic monsoon clouds over the backwaters of Kerala. The play of light and shadow is mesmerizing.',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500',
    stock: 2,
    status: 'ACTIVE',
    createdAt: '2025-04-18T10:00:00',
    artistName: 'Priya Sharma',
    categoryName: 'Photography',
  },
  {
    id: 7,
    artistId: 2,
    categoryId: 5,
    title: 'Portrait of Wisdom',
    description:
      'A detailed charcoal sketch of an elderly sage with weathered features that tell stories of a lifetime. Every wrinkle and expression line is captured with precision.',
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d789a8ce?w=500',
    stock: 3,
    status: 'ACTIVE',
    createdAt: '2025-04-20T10:00:00',
    artistName: 'Ravi Kumar',
    categoryName: 'Sketches',
  },
  {
    id: 8,
    artistId: 3,
    categoryId: 1,
    title: 'Lotus Pond Serenity',
    description:
      'A watercolor painting of a tranquil lotus pond in the early morning. Soft pinks and greens create a peaceful atmosphere.',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500',
    stock: 1,
    status: 'ACTIVE',
    createdAt: '2025-04-22T10:00:00',
    artistName: 'Priya Sharma',
    categoryName: 'Paintings',
  },
  {
    id: 9,
    artistId: 2,
    categoryId: 2,
    title: 'Rajasthani Folk Digital',
    description:
      'A digital reinterpretation of traditional Rajasthani folk art with modern twists. Vibrant colors and patterns celebrate Indian heritage.',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500',
    stock: 4,
    status: 'ACTIVE',
    createdAt: '2025-04-25T10:00:00',
    artistName: 'Ravi Kumar',
    categoryName: 'Digital Art',
  },
  {
    id: 10,
    artistId: 3,
    categoryId: 4,
    title: 'Himalayan Dawn',
    description:
      'A breathtaking photograph of the first light hitting the Himalayan peaks. The golden light transforms the snow-capped mountains into a magical landscape.',
    price: 14000,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    stock: 2,
    status: 'SOLD',
    createdAt: '2025-04-28T10:00:00',
    artistName: 'Priya Sharma',
    categoryName: 'Photography',
  },
];

// ─── Carts ───────────────────────────────────────────────────────────────────

export const dummyCarts = [
  {
    id: 1,
    userId: 4,
    totalAmount: 23000,
    items: [
      {
        id: 1,
        cartId: 1,
        productId: 1,
        quantity: 1,
        product: {
          id: 1,
          artistId: 2,
          categoryId: 1,
          title: 'Sunset Over Ganges',
          description:
            'A breathtaking oil painting capturing the golden sunset over the sacred Ganges river. The warm hues of orange and gold reflect beautifully on the water surface.',
          price: 15000,
          imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
          stock: 1,
          status: 'ACTIVE',
          createdAt: '2025-04-01T10:00:00',
          artistName: 'Ravi Kumar',
          categoryName: 'Paintings',
        },
      },
      {
        id: 2,
        cartId: 1,
        productId: 3,
        quantity: 1,
        product: {
          id: 3,
          artistId: 3,
          categoryId: 2,
          title: 'Cyberpunk Dreams',
          description:
            'A vibrant digital artwork featuring a futuristic cityscape bathed in neon lights. Every detail has been meticulously crafted.',
          price: 8000,
          imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339afa560d?w=500',
          stock: 5,
          status: 'ACTIVE',
          createdAt: '2025-04-10T10:00:00',
          artistName: 'Priya Sharma',
          categoryName: 'Digital Art',
        },
      },
    ],
  },
  {
    id: 2,
    userId: 5,
    totalAmount: 6500,
    items: [
      {
        id: 3,
        cartId: 2,
        productId: 4,
        quantity: 1,
        product: {
          id: 4,
          artistId: 3,
          categoryId: 2,
          title: 'Abstract Harmony',
          description:
            'An abstract digital composition exploring the interplay of geometric shapes and organic forms in a cosmic setting.',
          price: 6500,
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
          stock: 3,
          status: 'ACTIVE',
          createdAt: '2025-04-12T10:00:00',
          artistName: 'Priya Sharma',
          categoryName: 'Digital Art',
        },
      },
    ],
  },
];

// ─── Orders ──────────────────────────────────────────────────────────────────

export const dummyOrders = [
  {
    id: 1,
    userId: 4,
    totalAmount: 22000,
    status: 'DELIVERED',
    shippingAddress: 'Andheri West, Mumbai',
    createdAt: '2025-05-01T10:00:00',
    items: [
      {
        id: 1,
        orderId: 1,
        productId: 2,
        quantity: 1,
        priceAtPurchase: 22000,
        product: {
          id: 2,
          artistId: 2,
          categoryId: 1,
          title: 'Mystic Mountains',
          description:
            'An acrylic masterpiece depicting the misty peaks of the Western Ghats at dawn. Layers of blues and purples create depth and mystery.',
          price: 22000,
          imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500',
          stock: 1,
          status: 'ACTIVE',
          createdAt: '2025-04-05T10:00:00',
          artistName: 'Ravi Kumar',
          categoryName: 'Paintings',
        },
      },
    ],
  },
  {
    id: 2,
    userId: 5,
    totalAmount: 14000,
    status: 'SHIPPED',
    shippingAddress: 'Banjara Hills, Hyderabad',
    createdAt: '2025-05-10T10:00:00',
    items: [
      {
        id: 2,
        orderId: 2,
        productId: 10,
        quantity: 1,
        priceAtPurchase: 14000,
        product: {
          id: 10,
          artistId: 3,
          categoryId: 4,
          title: 'Himalayan Dawn',
          description:
            'A breathtaking photograph of the first light hitting the Himalayan peaks. The golden light transforms the snow-capped mountains into a magical landscape.',
          price: 14000,
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          stock: 2,
          status: 'SOLD',
          createdAt: '2025-04-28T10:00:00',
          artistName: 'Priya Sharma',
          categoryName: 'Photography',
        },
      },
    ],
  },
  {
    id: 3,
    userId: 4,
    totalAmount: 45000,
    status: 'PENDING',
    shippingAddress: 'Andheri West, Mumbai',
    createdAt: '2025-05-15T10:00:00',
    items: [
      {
        id: 3,
        orderId: 3,
        productId: 5,
        quantity: 1,
        priceAtPurchase: 45000,
        product: {
          id: 5,
          artistId: 2,
          categoryId: 3,
          title: 'Dancing Shiva Bronze',
          description:
            'A handcrafted bronze sculpture of Nataraja, the cosmic dancer. This exquisite piece captures the divine rhythm of creation and destruction.',
          price: 45000,
          imageUrl: 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=500',
          stock: 1,
          status: 'ACTIVE',
          createdAt: '2025-04-15T10:00:00',
          artistName: 'Ravi Kumar',
          categoryName: 'Sculptures',
        },
      },
    ],
  },
];

// ─── Payments ────────────────────────────────────────────────────────────────

export const dummyPayments = [
  {
    id: 1,
    orderId: 1,
    method: 'UPI',
    transactionId: 'TXN001UPI2025',
    amount: 22000,
    status: 'COMPLETED',
    paidAt: '2025-05-01T10:05:00',
  },
  {
    id: 2,
    orderId: 2,
    method: 'CREDIT_CARD',
    transactionId: 'TXN002CC2025',
    amount: 14000,
    status: 'COMPLETED',
    paidAt: '2025-05-10T10:05:00',
  },
  {
    id: 3,
    orderId: 3,
    method: 'NET_BANKING',
    transactionId: null,
    amount: 45000,
    status: 'PENDING',
    paidAt: null,
  },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const dummyReviews = [
  {
    id: 1,
    userId: 4,
    productId: 2,
    rating: 5,
    comment:
      'Absolutely stunning painting! The colors are even more vivid in person. Ravi is a true master.',
    createdAt: '2025-05-05T10:00:00',
    userName: 'Amit Patel',
  },
  {
    id: 2,
    userId: 5,
    productId: 3,
    rating: 4,
    comment:
      'Beautiful digital art with incredible detail. Looks amazing as a large print on my wall.',
    createdAt: '2025-05-12T10:00:00',
    userName: 'Sneha Reddy',
  },
  {
    id: 3,
    userId: 4,
    productId: 7,
    rating: 5,
    comment:
      'The level of detail in this charcoal sketch is phenomenal. A true collector piece.',
    createdAt: '2025-05-18T10:00:00',
    userName: 'Amit Patel',
  },
];

// ─── Derived Data ────────────────────────────────────────────────────────────

export const dummyArtists = dummyUsers.filter((u) => u.role === 'ARTIST');

export const dummyAdminSummary = {
  totalUsers: dummyUsers.length,
  totalProducts: dummyProducts.length,
  totalOrders: dummyOrders.length,
  totalRevenue: dummyOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  totalArtists: dummyArtists.length,
  pendingOrders: dummyOrders.filter((o) => o.status === 'PENDING').length,
};

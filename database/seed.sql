-- =============================================================================
-- ARTIFY — Seed Data
-- MySQL 8.0+
-- =============================================================================
-- Run AFTER schema.sql.
-- Usage: mysql -u root -p artify_db < seed.sql
--
-- All user passwords are "Password@123" (BCrypt-hashed below).
-- =============================================================================

USE artify_db;

-- -----------------------------------------------------------------------------
-- USERS
-- BCrypt hash of "Password@123" (cost factor 10)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, name, phone, address, avatar_url, role) VALUES
(1, 'admin@artify.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Arjun Mehta',    '+91-9000000001', '1 MG Road, Mumbai 400001',          'https://placehold.co/150?text=AM', 'ADMIN'),
(2, 'priya@artify.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Priya Sharma',   '+91-9000000002', '42 Art Lane, New Delhi 110001',     'https://placehold.co/150?text=PS', 'ARTIST'),
(3, 'rahul@artify.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Rahul Verma',    '+91-9000000003', '15 Canvas Road, Bangalore 560001',  'https://placehold.co/150?text=RV', 'ARTIST'),
(4, 'ananya@artify.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ananya Patel',   '+91-9000000004', '88 Gallery Ave, Chennai 600001',    'https://placehold.co/150?text=AP', 'CUSTOMER'),
(5, 'vikram@artify.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vikram Singh',   '+91-9000000005', '27 Exhibit Blvd, Hyderabad 500001', 'https://placehold.co/150?text=VS', 'CUSTOMER');

-- -----------------------------------------------------------------------------
-- ARTISTS
-- -----------------------------------------------------------------------------
INSERT INTO artists (id, user_id, bio, portfolio_url, is_verified, rating) VALUES
(1, 2, 'Contemporary artist specializing in abstract watercolors and mixed media. Exhibited at National Gallery of Modern Art.', 'https://priyasharma.art', TRUE,  4.5),
(2, 3, 'Digital artist and illustrator with a passion for surrealism and cyberpunk aesthetics. Winner of India Digital Art Award 2025.', 'https://rahulverma.art',  TRUE,  4.2);

-- -----------------------------------------------------------------------------
-- CATEGORIES
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, description, image_url) VALUES
(1, 'Paintings',    'Original paintings in oil, acrylic, watercolor, and other traditional mediums',  'https://placehold.co/400x300?text=Paintings'),
(2, 'Digital Art',  'Digital illustrations, generative art, and computer-aided designs',               'https://placehold.co/400x300?text=Digital+Art'),
(3, 'Sculptures',   'Three-dimensional artwork, installations, and carved pieces',                    'https://placehold.co/400x300?text=Sculptures'),
(4, 'Photography',  'Fine art photography, landscape, portrait, and street photography',              'https://placehold.co/400x300?text=Photography'),
(5, 'Mixed Media',  'Artwork combining multiple artistic mediums and found objects',                  'https://placehold.co/400x300?text=Mixed+Media');

-- -----------------------------------------------------------------------------
-- PRODUCTS
-- -----------------------------------------------------------------------------
INSERT INTO products (id, artist_id, category_id, title, description, price, image_url, stock, status) VALUES
(1,  1, 1, 'Monsoon Dreams',         'Abstract watercolor capturing the rhythmic dance of Indian monsoons with indigo and emerald hues.',                   15000.00, 'https://placehold.co/600x400/6C63FF/FFFFFF?text=Monsoon+Dreams',     1,  'ACTIVE'),
(2,  1, 1, 'Golden Temple at Dawn',   'Oil painting of the Golden Temple bathed in the first light of sunrise, reflecting on the sacred pool.',              25000.00, 'https://placehold.co/600x400/FFD700/333333?text=Golden+Temple',      1,  'ACTIVE'),
(3,  1, 5, 'Urban Chaos',             'Mixed media piece exploring the vibrant chaos of Mumbai street life using newspaper clippings and acrylics.',         18000.00, 'https://placehold.co/600x400/FF6B6B/FFFFFF?text=Urban+Chaos',        1,  'ACTIVE'),
(4,  2, 2, 'Neon Goddess',            'Digital illustration of a cyberpunk-inspired goddess with neon accents and circuit-board halos.',                      8000.00,  'https://placehold.co/600x400/00FFAA/333333?text=Neon+Goddess',       5,  'ACTIVE'),
(5,  2, 2, 'Fractal Universe',        'Generative art piece weaving mathematical fractals into cosmic nebula patterns.',                                     12000.00, 'https://placehold.co/600x400/9B59B6/FFFFFF?text=Fractal+Universe',   3,  'ACTIVE'),
(6,  2, 4, 'Himalayan Serenity',      'Fine art photograph of the snow-capped Himalayan range during the golden hour.',                                      6000.00,  'https://placehold.co/600x400/87CEEB/333333?text=Himalayan+Serenity', 10, 'ACTIVE'),
(7,  1, 1, 'Lotus Pond',              'Serene watercolor of lotus flowers in full bloom on a misty morning pond.',                                           9500.00,  'https://placehold.co/600x400/FF69B4/FFFFFF?text=Lotus+Pond',         1,  'ACTIVE'),
(8,  2, 2, 'Cyber Shiva',             'Digital reimagination of Lord Shiva in a futuristic cyberpunk cityscape with holographic trishul.',                    15000.00, 'https://placehold.co/600x400/1A1A2E/00FFAA?text=Cyber+Shiva',        2,  'ACTIVE'),
(9,  1, 5, 'Textile Dreams',          'Mixed media incorporating traditional Indian textiles, embroidery threads, and gold-leaf accents.',                   22000.00, 'https://placehold.co/600x400/DAA520/FFFFFF?text=Textile+Dreams',      1,  'DRAFT'),
(10, 2, 3, 'Dancing Atoms',           'Abstract bronze sculpture representing the eternal dance of subatomic particles.',                                    35000.00, 'https://placehold.co/600x400/CD7F32/FFFFFF?text=Dancing+Atoms',       1,  'ACTIVE');

-- -----------------------------------------------------------------------------
-- CART (customer Ananya)
-- -----------------------------------------------------------------------------
INSERT INTO cart (id, user_id) VALUES
(1, 4);

INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 4, 2);

-- -----------------------------------------------------------------------------
-- ORDERS (customer Vikram — completed order)
-- -----------------------------------------------------------------------------
INSERT INTO orders (id, user_id, total_amount, status, shipping_address) VALUES
(1, 5, 21000.00, 'DELIVERED', '27 Exhibit Blvd, Hyderabad 500001');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 6, 1, 6000.00),
(2, 1, 4, 1, 8000.00),
(3, 1, 7, 1, 9500.00);
-- Subtotal: 6000 + 8000 + 9500 = 23500; total_amount includes potential discount => set to 21000
-- In production, total_amount = sum(price_at_purchase * quantity) unless discount logic applies.

-- A second order (pending)
INSERT INTO orders (id, user_id, total_amount, status, shipping_address) VALUES
(2, 4, 15000.00, 'CONFIRMED', '88 Gallery Ave, Chennai 600001');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES
(4, 2, 1, 1, 15000.00);

-- -----------------------------------------------------------------------------
-- PAYMENTS
-- -----------------------------------------------------------------------------
INSERT INTO payments (id, order_id, method, transaction_id, amount, status, paid_at) VALUES
(1, 1, 'UPI',         'TXN_20260701_001', 21000.00, 'COMPLETED', '2026-07-01 10:30:00'),
(2, 2, 'CREDIT_CARD', 'TXN_20260703_002', 15000.00, 'COMPLETED', '2026-07-03 14:15:00');

-- -----------------------------------------------------------------------------
-- REVIEWS
-- -----------------------------------------------------------------------------
INSERT INTO reviews (id, user_id, product_id, rating, comment) VALUES
(1, 5, 6, 5, 'Absolutely stunning photograph! The colors of the Himalayas are captured magnificently. Worth every rupee.'),
(2, 4, 4, 4, 'Beautiful digital art — Neon Goddess looks amazing as a canvas print in my living room.'),
(3, 5, 4, 5, 'Rahul''s cyberpunk style is truly unique. This piece is a conversation starter!');

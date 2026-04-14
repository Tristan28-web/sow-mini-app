const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const rootPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres'
  });

  try {
    const dbName = process.env.DB_NAME || 'sow_app';
    const check = await rootPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (check.rows.length === 0) {
      await rootPool.query(`CREATE DATABASE ${dbName}`);
    }
    await rootPool.end();

    const db = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: dbName
    });

    await db.query('DROP TABLE IF EXISTS products CASCADE');
    await db.query('DROP TABLE IF EXISTS users CASCADE');
    await db.query('DROP TABLE IF EXISTS translations CASCADE');

    await db.query(`
      CREATE TABLE users (
        id       SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE translations (
        id      SERIAL PRIMARY KEY,
        key     VARCHAR(255) UNIQUE NOT NULL,
        en_text TEXT,
        sv_text TEXT
      )
    `);

    await db.query(`
      CREATE TABLE products (
        id          SERIAL PRIMARY KEY,
        article_no  VARCHAR(50)   NOT NULL DEFAULT '',
        description TEXT          NOT NULL DEFAULT '',
        in_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
        out_price   NUMERIC(12,2) NOT NULL DEFAULT 0,
        unit        VARCHAR(100)  NOT NULL DEFAULT '',
        stock       NUMERIC(12,2) NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `);

    const hashedPass = await bcrypt.hash('password123', 10);
    await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPass]);

    const texts = [
      ['login_title', 'Login', 'Logga in'],
      ['email_label', 'Email address', 'Skriv in din epost adress'],
      ['pass_label', 'Password', 'Skriv in ditt lösenord'],
      ['btn_login', 'Sign in', 'Logga in'],
      ['login_error', 'Invalid email or password', 'Ogiltig e-postadress eller lösenord'],
      ['menu_title', 'Menu', 'Meny'],
      ['invoices', 'Invoices', 'Fakturor'],
      ['customers', 'Customers', 'Kunder'],
      ['my_business', 'My Business', 'Mitt företag'],
      ['invoice_journal', 'Invoice Journal', 'Fakturajournal'],
      ['price_list', 'Price List', 'Prislista'],
      ['multiple_invoicing', 'Multiple Invoicing', 'Massfakturering'],
      ['unpaid_invoices', 'Unpaid Invoices', 'Obetalda fakturor'],
      ['offer', 'Offer', 'Offert'],
      ['inventory_control', 'Inventory Control', 'Lagerkontroll'],
      ['member_invoicing', 'Member Invoicing', 'Medlemsfakturering'],
      ['import_export', 'Import/Export', 'Import/Export'],
      ['logout', 'Log out', 'Logga ut'],
      ['article_no', 'Article No.', 'Artikelnr'],
      ['product_service', 'Product/Service', 'Produkt/Tjänst'],
      ['in_price', 'In Price', 'Inpris'],
      ['price', 'Price', 'Pris'],
      ['in_stock', 'In Stock', 'I lager'],
      ['unit', 'Unit', 'Enhet'],
      ['description', 'Description', 'Beskrivning'],
      ['new_product', 'New Product', 'Ny produkt'],
      ['print_list', 'Print List', 'Skriv ut lista'],
      ['advanced_mode', 'Advanced mode', 'Avancerat läge'],
      ['search_article', 'Search Article No...', 'Sök artikelnr...'],
      ['search_product', 'Search Product...', 'Sök produkt...']
    ];
    for (const [key, en, sv] of texts) {
      await db.query('INSERT INTO translations (key, en_text, sv_text) VALUES ($1, $2, $3)', [key, en, sv]);
    }

    const products = [
      ['ART-1001', 'This is a test product with fifty characters this!', 750000, 1500800, 'kilometers/hour', 2500600],
      ['ART-1002', 'Sony DSLR Camera 12345',                             8000,   15000,   'pcs',             150],
      ['ART-1003', 'Random product sample item',                         500,    1234,    'box',             300],
      ['ART-1004', 'Laptop Pro 15 Ultra Slim Edition',                   45000,  89900,   'pcs',             75],
      ['ART-1005', 'Wireless Bluetooth Headphones',                      1200,   2499,    'pcs',             500],
      ['ART-1006', 'Office Desk Chair Ergonomic',                        3500,   7200,    'pcs',             40],
      ['ART-1007', 'USB-C Hub 7-in-1 Multiport Adapter',                 350,    799,     'pcs',             820],
      ['ART-1008', 'Standing Desk Electric Height Adjustable',           8000,   17500,   'pcs',             25],
      ['ART-1009', 'Mechanical Keyboard RGB',                            1800,   3599,    'pcs',             200],
      ['ART-1010', 'Dell Monitor 27 4K UHD',                             12000,  24900,   'pcs',             60],
      ['ART-1011', 'Webcam Full HD 1080p Auto Focus',                    900,    1899,    'pcs',             350],
      ['ART-1012', 'Laser Printer Colour A4',                            5500,   10999,   'pcs',             30],
      ['ART-1013', 'External SSD 1TB USB 3.2',                           2200,   4299,    'pcs',             410],
      ['ART-1014', 'Noise Cancelling Microphone Studio',                 2800,   5999,    'pcs',             90],
      ['ART-1015', 'Smart LED Desk Lamp 12W',                            450,    999,     'pcs',             700],
      ['ART-1016', 'Cable Management Box Large',                         120,    299,     'pcs',             1200],
      ['ART-1017', 'Portable Projector Full HD Mini',                    6000,   12500,   'pcs',             55],
      ['ART-1018', 'Wireless Charging Pad 15W',                          280,    649,     'pcs',             900],
      ['ART-1019', 'Lumbar Support Cushion Memory Foam',                 380,    850,     'pcs',             600],
      ['ART-1020', 'Video Conference Speakerphone 360',                  4200,   8990,    'pcs',             80],
    ];

    for (const [article_no, description, in_price, out_price, unit, stock] of products) {
      await db.query(
        `INSERT INTO products (article_no, description, in_price, out_price, unit, stock) VALUES ($1, $2, $3, $4, $5, $6)`,
        [article_no, description, in_price, out_price, unit, stock]
      );
    }

    console.log('Seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

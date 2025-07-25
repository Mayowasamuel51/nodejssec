CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  user_id INT, -- who added the product
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

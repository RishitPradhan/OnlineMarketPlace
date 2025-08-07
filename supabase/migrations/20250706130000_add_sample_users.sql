/*
  # Add sample users for testing messaging functionality

  1. Sample Users
    - Add a few test users with different roles
    - These users will be available for messaging tests
    - All users have the same password hash for simplicity (in production, use proper hashing)

  2. Test Data
    - 3 sample users: client, freelancer, admin
    - Each user has unique email and basic profile info
*/

-- Insert sample users for testing
INSERT INTO users (id, email, first_name, last_name, role, password_hash, created_at, updated_at) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'john.doe@example.com',
    'John',
    'Doe',
    'client',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'jane.smith@example.com',
    'Jane',
    'Smith',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'admin@example.com',
    'Admin',
    'User',
    'admin',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'alice.johnson@example.com',
    'Alice',
    'Johnson',
    'freelancer',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'bob.wilson@example.com',
    'Bob',
    'Wilson',
    'client',
    '$2a$10$dummy.hash.for.testing',
    now(),
    now()
  )
ON CONFLICT (email) DO NOTHING; 
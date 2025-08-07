/*
  # Add sample orders for testing order management functionality

  1. Sample Orders
    - Add orders for different users (clients and freelancers)
    - Include various statuses (pending, in_progress, completed)
    - Link to existing services and users
    - Realistic order data for testing
*/

-- Insert sample orders for testing
INSERT INTO orders (id, serviceid, clientid, freelancerid, amount, requirements, deliverydate, status, created_at, updated_at) VALUES
  (
    'order-1111-1111-1111-111111111111',
    '5b9eb8a0-0747-4b2c-a937-3e41e86e7fc4', -- Professional Web Development service
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    1500.00,
    'Need a modern website for my business with contact form and SEO optimization. Please include mobile responsiveness.',
    now() + interval '7 days',
    'pending',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    'order-2222-2222-2222-222222222222',
    '6c0fc8b1-1858-5d3d-b048-4f52f97f8fc5', -- E-commerce Website service
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    2500.00,
    'Complete e-commerce solution needed. Include payment gateway, inventory management, and admin dashboard.',
    now() + interval '10 days',
    'in_progress',
    now() - interval '5 days',
    now() - interval '1 day'
  ),
  (
    'order-3333-3333-3333-333333333333',
    '7d1gd9c2-2969-6e4e-c159-5g63g08g9gd6', -- UI/UX Design service
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    800.00,
    'Need professional UI/UX design for a mobile app. Focus on user experience and modern aesthetics.',
    now() + interval '5 days',
    'completed',
    now() - interval '10 days',
    now() - interval '2 days'
  ),
  (
    'order-4444-4444-4444-444444444444',
    '8e2he0d3-3a7a-7f5f-d26a-6h74h19h0he7', -- Logo Design service
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    300.00,
    'Creative logo design needed for my startup. Multiple concepts and revisions required.',
    now() + interval '3 days',
    'pending',
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    'order-5555-5555-5555-555555555555',
    '5b9eb8a0-0747-4b2c-a937-3e41e86e7fc4', -- Professional Web Development service
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    1500.00,
    'Simple website with basic features. Need it quickly for business launch.',
    now() + interval '7 days',
    'cancelled',
    now() - interval '3 days',
    now() - interval '1 day'
  ),
  (
    'order-6666-6666-6666-666666666666',
    '6c0fc8b1-1858-5d3d-b048-4f52f97f8fc5', -- E-commerce Website service
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    2500.00,
    'Premium e-commerce solution with advanced features and custom functionality.',
    now() + interval '14 days',
    'in_progress',
    now() - interval '7 days',
    now() - interval '2 days'
  ),
  (
    'order-7777-7777-7777-777777777777',
    '7d1gd9c2-2969-6e4e-c159-5g63g08g9gd6', -- UI/UX Design service
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    800.00,
    'Complete UI/UX redesign for existing web application. Focus on improving user experience.',
    now() + interval '5 days',
    'completed',
    now() - interval '15 days',
    now() - interval '5 days'
  ),
  (
    'order-8888-8888-8888-888888888888',
    '8e2he0d3-3a7a-7f5f-d26a-6h74h19h0he7', -- Logo Design service
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    300.00,
    'Professional logo design for consulting business. Clean and modern style preferred.',
    now() + interval '3 days',
    'disputed',
    now() - interval '5 days',
    now() - interval '1 day'
  )
ON CONFLICT (id) DO NOTHING; 
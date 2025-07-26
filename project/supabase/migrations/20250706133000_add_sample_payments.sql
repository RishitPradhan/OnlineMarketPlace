/*
  # Add sample payments for testing payment summary functionality

  1. Sample Payments
    - Add test payments with different statuses
    - Include both sent and received payments
    - Various amounts and payment methods
    - Different dates for testing time-based filtering

  2. Test Data
    - 10 sample payments with realistic data
    - Mix of pending, completed, and failed payments
    - Different amounts ranging from $10 to $500
*/

-- Insert sample payments for testing
INSERT INTO payments (id, order_id, payer_id, receiver_id, amount, payment_method, status, transaction_id, payment_details, created_at, updated_at) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'order-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    150.00,
    'card',
    'completed',
    'txn_completed_001',
    '{"card_last4": "4242", "card_brand": "visa"}',
    now() - interval '5 days',
    now() - interval '5 days'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'order-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    75.50,
    'card',
    'pending',
    NULL,
    '{"card_last4": "4242", "card_brand": "visa"}',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'order-3333-3333-3333-333333333333',
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    300.00,
    'card',
    'completed',
    'txn_completed_002',
    '{"card_last4": "5555", "card_brand": "mastercard"}',
    now() - interval '10 days',
    now() - interval '10 days'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'order-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    45.00,
    'upi',
    'failed',
    NULL,
    '{"upi_id": "bob@upi"}',
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'order-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    200.00,
    'card',
    'completed',
    'txn_completed_003',
    '{"card_last4": "4242", "card_brand": "visa"}',
    now() - interval '15 days',
    now() - interval '15 days'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'order-6666-6666-6666-666666666666',
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    125.75,
    'card',
    'processing',
    NULL,
    '{"card_last4": "5555", "card_brand": "mastercard"}',
    now() - interval '3 hours',
    now() - interval '3 hours'
  ),
  (
    'gggggggg-gggg-gggg-gggg-gggggggggggg',
    'order-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    500.00,
    'card',
    'completed',
    'txn_completed_004',
    '{"card_last4": "4242", "card_brand": "visa"}',
    now() - interval '30 days',
    now() - interval '30 days'
  ),
  (
    'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
    'order-8888-8888-8888-888888888888',
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '44444444-4444-4444-4444-444444444444', -- Alice Johnson (freelancer)
    25.00,
    'upi',
    'pending',
    NULL,
    '{"upi_id": "bob@upi"}',
    now() - interval '6 hours',
    now() - interval '6 hours'
  ),
  (
    'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii',
    'order-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111', -- John Doe (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    350.00,
    'card',
    'completed',
    'txn_completed_005',
    '{"card_last4": "4242", "card_brand": "visa"}',
    now() - interval '45 days',
    now() - interval '45 days'
  ),
  (
    'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj',
    'order-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '55555555-5555-5555-5555-555555555555', -- Bob Wilson (client)
    '22222222-2222-2222-2222-222222222222', -- Jane Smith (freelancer)
    10.00,
    'card',
    'refunded',
    'txn_refunded_001',
    '{"card_last4": "5555", "card_brand": "mastercard"}',
    now() - interval '60 days',
    now() - interval '60 days'
  )
ON CONFLICT (id) DO NOTHING; 
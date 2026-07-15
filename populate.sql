INSERT INTO users (id, email, password, name, role, created_at, updated_at) VALUES 
(gen_random_uuid(), 'user1@test.com', 'pwd', 'Assinante Ativo 1', 'ROLE_USER', now(), now()),
(gen_random_uuid(), 'user2@test.com', 'pwd', 'Assinante Trial 1', 'ROLE_USER', now(), now()),
(gen_random_uuid(), 'user3@test.com', 'pwd', 'Assinante Expirado', 'ROLE_USER', now(), now()),
(gen_random_uuid(), 'user4@test.com', 'pwd', 'Assinante Ativo 2', 'ROLE_USER', now(), now()),
(gen_random_uuid(), 'user5@test.com', 'pwd', 'Assinante Vitalício', 'ROLE_USER', now(), now())
ON CONFLICT (email) DO NOTHING;

INSERT INTO subscriptions (id, user_id, status, trial_start_date, trial_end_date, current_period_start, current_period_end, is_admin_override, notes, created_at, updated_at)
SELECT gen_random_uuid(), id, 'ACTIVE', now() - interval '30 days', now() - interval '20 days', now() - interval '10 days', now() + interval '20 days', false, '', now(), now() 
FROM users WHERE email = 'user1@test.com' AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id);

INSERT INTO subscriptions (id, user_id, status, trial_start_date, trial_end_date, current_period_start, current_period_end, is_admin_override, notes, created_at, updated_at)
SELECT gen_random_uuid(), id, 'TRIAL', now() - interval '5 days', now() + interval '5 days', null, null, false, '', now(), now() 
FROM users WHERE email = 'user2@test.com' AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id);

INSERT INTO subscriptions (id, user_id, status, trial_start_date, trial_end_date, current_period_start, current_period_end, is_admin_override, notes, created_at, updated_at)
SELECT gen_random_uuid(), id, 'EXPIRED', now() - interval '40 days', now() - interval '30 days', now() - interval '30 days', now() - interval '5 days', false, '', now(), now() 
FROM users WHERE email = 'user3@test.com' AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id);

INSERT INTO subscriptions (id, user_id, status, trial_start_date, trial_end_date, current_period_start, current_period_end, is_admin_override, notes, created_at, updated_at)
SELECT gen_random_uuid(), id, 'ACTIVE', now() - interval '60 days', now() - interval '50 days', now() - interval '20 days', now() + interval '10 days', false, '', now(), now() 
FROM users WHERE email = 'user4@test.com' AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id);

INSERT INTO subscriptions (id, user_id, status, trial_start_date, trial_end_date, current_period_start, current_period_end, is_admin_override, notes, created_at, updated_at)
SELECT gen_random_uuid(), id, 'LIFETIME', now(), now(), now(), now(), true, 'Admin granted', now(), now() 
FROM users WHERE email = 'user5@test.com' AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    badge_type VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE (user_id, badge_type)
);

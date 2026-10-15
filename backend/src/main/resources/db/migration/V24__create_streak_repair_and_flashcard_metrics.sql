-- V24: Streak Repair and Flashcard Gamification
CREATE TABLE IF NOT EXISTS streak_repairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    repaired_date DATE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_repaired_date UNIQUE (user_id, repaired_date)
);

CREATE INDEX IF NOT EXISTS idx_streak_repairs_user_date ON streak_repairs(user_id, repaired_date);

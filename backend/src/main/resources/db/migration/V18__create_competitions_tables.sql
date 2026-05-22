CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competition_type VARCHAR(30) NOT NULL, -- 'GROUP', 'DUEL_TIME', 'DUEL_TARGET'
    metric_type VARCHAR(30) NOT NULL, -- 'TOTAL_QUESTIONS', 'CORRECT_QUESTIONS'
    target_value INTEGER, -- for 'DUEL_TARGET'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PENDING', 'ACTIVE', 'FINISHED'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_competitions_creator ON competitions(creator_id);

CREATE TABLE competition_participants (
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'INVITED', 'ACCEPTED', 'DECLINED'
    joined_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (competition_id, user_id)
);

CREATE INDEX idx_competition_participants_user ON competition_participants(user_id);

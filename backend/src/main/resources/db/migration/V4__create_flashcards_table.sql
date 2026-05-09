CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    grande_area VARCHAR(50) NOT NULL,
    frente JSONB NOT NULL,
    verso JSONB NOT NULL,
    proxima_revisao DATE NOT NULL,
    dificuldade_ultima VARCHAR(20),
    ease_factor DOUBLE PRECISION DEFAULT 2.5,
    intervalo_atual INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_flashcard_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_area ON flashcards(user_id, grande_area);
CREATE INDEX IF NOT EXISTS idx_flashcards_proxima_revisao ON flashcards(user_id, proxima_revisao);

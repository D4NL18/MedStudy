-- Migration V22: Create user_settings and redistribution_drafts tables

CREATE TABLE user_settings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    max_reviews_per_day INT,
    theme_color VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE redistribution_drafts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    draft_data TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_redistribution_drafts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

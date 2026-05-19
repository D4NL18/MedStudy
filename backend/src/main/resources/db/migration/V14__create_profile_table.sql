CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
    handle VARCHAR(50) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    semestre INTEGER NOT NULL,
    faculdade VARCHAR(255) NOT NULL,
    avatar_preset_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_profiles_handle ON profiles(handle);

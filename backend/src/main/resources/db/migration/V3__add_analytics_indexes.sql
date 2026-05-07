-- Índices para otimizar queries de Dashboard e Analytics
CREATE INDEX idx_sessions_user_area ON study_sessions(user_id, grande_area);
CREATE INDEX idx_sessions_user_date ON study_sessions(user_id, data_sessao);
CREATE INDEX idx_simulados_user_date ON simulados(user_id, data_realizacao);
CREATE INDEX idx_sessions_user_tema ON study_sessions(user_id, tema);

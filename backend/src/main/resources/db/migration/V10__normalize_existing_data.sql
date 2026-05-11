-- Normalização básica de strings existentes (Trim)
UPDATE study_sessions SET 
    grande_area = TRIM(grande_area), 
    tema = TRIM(tema), 
    instituicao = TRIM(instituicao);

UPDATE flashcards SET 
    grande_area = TRIM(grande_area);

-- Nota: A normalização robusta (remover acentos) será aplicada 
-- gradualmente via ganchos de ciclo de vida (PrePersist/PreUpdate) 
-- conforme os registros forem acessados/atualizados, para evitar 
-- inconsistências de script SQL dependentes de dialeto.

-- V29__add_daily_free_lootbox_column.sql
-- Adiciona rastreamento de data da Caixa da Sorte diária gratuita por estudante (não acumulável)

ALTER TABLE user_clinics ADD COLUMN IF NOT EXISTS last_free_lootbox_date DATE;

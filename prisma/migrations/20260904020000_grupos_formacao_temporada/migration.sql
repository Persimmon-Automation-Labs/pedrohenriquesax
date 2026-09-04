-- O Pedro pediu duas seções novas na trajetória: a formação (as escolas) e a
-- temporada corrente (residência nos navios). Postgres não deixa adicionar
-- valor a um enum dentro de transação com uso no mesmo comando, por isso cada
-- um no seu ALTER, e IF NOT EXISTS para o deploy poder rodar de novo.
ALTER TYPE "CredentialGroup" ADD VALUE IF NOT EXISTS 'formacao' BEFORE 'big_band';
ALTER TYPE "CredentialGroup" ADD VALUE IF NOT EXISTS 'temporada' AFTER 'big_band';

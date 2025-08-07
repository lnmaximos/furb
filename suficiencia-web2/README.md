## Banco de Dados

```sql
-- Crie o usuário:
CREATE USER leon WITH PASSWORD 'pizza123';

-- Crie o banco de dados
CREATE DATABASE furb_pw2;

-- Dê todas as permissões no banco para o usuário
GRANT ALL PRIVILEGES ON DATABASE furb_pw2 TO leon;

```
Após criar o banco, se conectar a ele (`\c furb_pw2;`) e executar o comando abaixo para garantir as permissões no schema (usei o public):
```sql
GRANT ALL ON SCHEMA public TO leon;
```

## Executando a Aplicação

Na pasta raiz do projeto:

```bash
./mvnw spring-boot:run
```
A aplicação estará no ar e a documentação interativa estará em `http://localhost:8080/swagger-ui/index.html`.

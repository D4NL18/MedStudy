# MedStudy — Plataforma de Estudos Médicos

Bem-vindo ao repositório do **MedStudy**, uma plataforma web full-stack para médicos e estudantes de medicina prestando residência no Brasil. 

Esta é uma arquitetura Monorepo contendo:
- **Frontend**: Angular 18 (Standalone Components, SCSS, RxJS, NgRx)
- **Backend**: Java 21, Spring Boot 3 (Spring Security, Data JPA, MapStruct)
- **Banco de Dados**: PostgreSQL 16 local via Docker

---

## Pré-requisitos

1. **Docker e Docker Compose** (Para subir o PostgreSQL local)
2. **Node.js** (LTS v22 — o projeto usa `.nvmrc`) e **npm**
3. **Java 21** (O backend utiliza Maven Wrapper, não é necessário instalar o Maven na sua máquina, mas o Java 21 é obrigatório).

---

## Configuração Inicial do Ambiente

Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```
O `.env` contém as variáveis locais como porta, usuário e senha do banco de dados, além da chave secreta do JWT.

---

## 1. Subindo o Banco de Dados (PostgreSQL)

O banco de dados é inicializado através do Docker. Na raiz do projeto, execute:

```bash
docker-compose up -d
```
Isso vai expor o PostgreSQL na porta `5432` com as credenciais definidas no `.env`.

---

## 2. Rodando o Backend (Spring Boot)

O backend utiliza o **Maven Wrapper** (`./mvnw` ou `mvnw.cmd` no Windows), garantindo que todos rodem a mesma versão do Maven.

Navegue até o diretório do backend e inicie a aplicação:

```bash
cd backend
./mvnw spring-boot:run
```
O Spring Boot subirá por padrão na porta `8080`.

---

## 3. Rodando o Frontend (Angular)

O frontend utiliza o Angular CLI. Certifique-se de estar usando a versão do Node.js definida no `.nvmrc`.

Navegue até o diretório do frontend, instale as dependências e inicie o servidor:

```bash
cd frontend
# (Opcional se usar nvm) nvm use
npm install
npm start
```
O frontend subirá por padrão em `http://localhost:4200`.

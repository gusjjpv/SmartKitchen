# Exemplos de requisicoes via curl (backend)

Defina a URL base no terminal:
```bash
export BASE_URL="http://localhost:3000"
```

## Cadastro de usuario
```bash
curl -X POST "$BASE_URL/cadastro" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Souza",
    "email": "maria@exemplo.com",
    "senha": "123456",
    "contato": "11999990000"
  }'
```

## Login
```bash
curl -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@exemplo.com",
    "senha": "123456"
  }'
```

## Listar usuarios
```bash
curl "$BASE_URL/users"
```

## Criar restaurante
```bash
curl -X POST "$BASE_URL/restaurantes" \
  -H "Content-Type: application/json" \
  -d '{
    "admin_usuario_id": "UUID_DO_USUARIO",
    "nome": "Lanchonete Central",
    "slug": "lanchonete-central",
    "whatsapp": "11988887777",
    "rua": "Rua A",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "Sao Paulo",
    "estado": "SP",
    "cep": "01000-000",
    "ativo": true
  }'
```

## Listar restaurantes
```bash
curl "$BASE_URL/restaurantes"
```

## Cadastrar horario de funcionamento
```bash
curl -X POST "$BASE_URL/restaurantes/REST_ID/horarios" \
  -H "Content-Type: application/json" \
  -d '{
    "dia_semana": 1,
    "horario_abertura": "10:00",
    "horario_fechamento": "22:00",
    "fechado": false
  }'
```

## Listar horarios do restaurante
```bash
curl "$BASE_URL/restaurantes/REST_ID/horarios"
```

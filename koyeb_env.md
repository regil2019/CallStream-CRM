# Variáveis de Ambiente para o Koyeb

O Koyeb (seu backend) precisa saber exatamente como se conectar com o Vercel (frontend), com o banco Postgres (Neon) e com o Redis (Upstash).

Copie os valores dessa tabela e os adicione na aba **Environment variables** do painel de controle do Koyeb.

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_kt0r1YSaxQHl@ep-rapid-bonus-adgi0yqq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `FRONTEND_URL` | `https://call-stream-crm.vercel.app` |
| `REDIS_HOST` | `solid-crayfish-73671.upstash.io` |
| `REDIS_PORT` | `6379` |
| `REDIS_PASSWORD` | `gQAAAAAAAR_HAAIncDIyYzYxMzZhYzFiYWI0NDgzYjgwZGRiOTNhODQxMTRkYXAyNzM2NzE` |
| `REDIS_TLS` | `true` |
| `JWT_SECRET` | `coloque-uma-senha-secreta-ficticia-aqui` |
| `UPLOAD_DIR` | `uploads` |

> [!IMPORTANT]  
> **Aviso sobre o Upstash (REDIS_TLS)**
> Como o banco de dados do Upstash é online e seguro, ele exige que a conexão utilize TLS (Criptografia). O código foi preparado para ativar o TLS toda vez que você enviar a variável `REDIS_TLS` com o valor `true`.

> [!NOTE] 
> O frontend no Vercel não muda, lá a variável deve continuar como:
> `VITE_API_URL` com valor `https://extraordinary-christabel-call-crm-d010795c.koyeb.app/api/v1`

---

## 🚀 Comandos para o Git

Agora que todas as alterações no código foram feitas, você vai precisar salvar isso no seu repositório local e enviar para o GitHub (o que fará o Koyeb fazer o redeploy automático).
Rode estes comandos no terminal da pasta do seu projeto (`backend_Call-CRM`):

```bash
git add .
git commit -m "feat: adicionar suporte a senha e tls para redis em produção no upstash"
git push origin main
```

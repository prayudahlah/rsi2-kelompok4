# Praktikum Rekayasa Sistem Informasi

Kelompok 4A:
- Aulia Rahma Bidayah (L0224003)
- Prayuda Afifan Handoyo (L0224008)
- Dien Akmalin Rizqi Akbar (L0224028)
- Gloria Dana Praisylia (L0224043)

---

Aplikasi manajemen event untuk kegiatan praktikum RSI. Admin dapat membuat, mengedit, dan menghapus event. User dapat mendaftar ke event yang tersedia dan melihat riwayat pendaftaran.

## Tech Stack

- **Frontend:** Next.js 16 + Bun + Tailwind CSS
- **Backend:** FastAPI + SQLModel
- **Database:** PostgreSQL 17
- **Container:** Docker + Docker Compose

## Aplikasi (Frontend)

```
https://rsi-praktikum.prayudahlah.dev
```

## API Documentation

```
https://rsi-praktikum.prayudahlah.dev/api/docs
```

## API URL

```
https://rsi-praktikum.prayudahlah.dev/api
```

## Development

```bash
docker compose -f compose.dev.yaml up --watch --build
```

## Production

```bash
docker compose -f compose.prod.yaml up -d --build
```

## Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `POSTGRES_USER` | PostgreSQL user |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | Database name |
| `POSTGRES_HOST` | Database host (default: postgres) |
| `POSTGRES_PORT` | Database port (default: 5432) |
| `DATABASE_URL` | Auto-built from above vars |

## Frontend Routes

| Path | Description |
|---|---|
| `/` | Home |
| `/login` | Login |
| `/register` | Register |
| `/event-management` | Kelola event (admin) |
| `/event-registration` | Pendaftaran events |
| `/about` | About page |

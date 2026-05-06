#!/bin/sh
set -e

# Periksa apakah revisi head sudah diterapkan
echo "Memeriksa revisi migrasi..."
current_rev=$(alembic current | grep -v "Current revision for database" | head -n1)
head_rev=$(alembic heads | head -n1)

if [ "$current_rev" != "$head_rev" ]; then
    echo "Menjalankan migrasi baru..."
    alembic upgrade head
else
    echo "Migrasi sudah terbaru, melewati proses upgrade."
fi

insert_initial_data() {
    echo "Memasukkan data role jika belum ada..."
    psql "$DATABASE_URL" <<-EOF
        INSERT INTO role (name)
        VALUES 
            ('admin'),
            ('user')
        ON CONFLICT (name) DO NOTHING;
EOF
    echo "Data role selesai dimasukkan."
}

insert_initial_data

exec "$@"

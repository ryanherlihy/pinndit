sudo -u postgres psql -c "DROP DATABASE if exists pinndit;"
sudo -u postgres psql -c "CREATE DATABASE pinndit;"
sudo -u postgres psql -d  pinndit --file=./drop.sql
sudo -u postgres psql -d  pinndit --file=./schema.sql
sudo -u postgres psql -d  pinndit --file=./dummyData.sql
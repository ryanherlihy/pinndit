psql -c "DROP DATABASE if exists pinndit;"
psql -c "CREATE DATABASE pinndit;"
psql -d  pinndit --file=./drop.sql
psql -d  pinndit --file=./schema.sql
psql -d  pinndit --file=./dummyData.sql
pause
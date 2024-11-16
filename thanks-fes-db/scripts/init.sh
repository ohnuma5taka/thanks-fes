#!/bin/bash

init_path=/var/db2inst1/init_db.sh
echo "#!/bin/bash" >> $init_path
echo "db2 list database directory | grep -iwq $DB_DATABASE" >> $init_path
echo "if [ \$? = 0 ]; then db2 drop database $DB_DATABASE; fi" >> $init_path
echo "db2 terminate" >> $init_path
echo "db2 create database $DB_DATABASE using codeset UTF-8 territory JP pagesize 8 K" >> $init_path
echo "db2 connect to $DB_DATABASE" >> $init_path
echo "db2 create schema $DB_SCHEMA" >> $init_path
echo "db2 set current schema $DB_SCHEMA" >> $init_path
echo "db2 -tvf /var/db2inst1/create_table.sql" >> $init_path

chmod a+x $init_path
su - db2inst1 -c $init_path

# Result Message
width=60
message="Completed"

padding=$(( (width - ${#message} - 2) / 2 ))
message_line=$(printf "#%${padding}s%s%${padding}s#" "" "$message" "")
border=$(printf "%-${#message_line}s" "#")
border=${border// /#}

ESC=$(printf '\033')
echo -e "$ESC[32m$border\n$message_line\n$border$ESC[m"

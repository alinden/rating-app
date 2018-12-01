#!/usr/bin/bash

psql -c '\i ./sql/migrate_1.sql' -d ratings -U postgres

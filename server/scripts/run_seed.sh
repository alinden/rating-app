#!/bin/bash

psql -c '\i ./sql/ratings_seed.sql' -d ratings -U postgres

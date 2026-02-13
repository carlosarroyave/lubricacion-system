#!/bin/bash
pip install --upgrade pip
pip install -r requirements.txt
python -c "from app.core.database import init_db; init_db()"
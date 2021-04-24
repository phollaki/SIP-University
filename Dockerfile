FROM python:3.9.4-buster
RUN apt-get update && apt-get install -y python-psycopg2
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 13224

CMD [ "python3", "app.py"]
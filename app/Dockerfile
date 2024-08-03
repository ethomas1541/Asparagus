FROM python:3.12
LABEL maintainer="ethomas7@uoregon.edu"
RUN apt-get update -y
COPY . /flask_app
WORKDIR /flask_app
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "-B"]
CMD ["flask_app.py"]
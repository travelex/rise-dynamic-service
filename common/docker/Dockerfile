FROM circleci/node:10.16.0-stretch

ADD serverless/Makefile /home/circleci/Makefile

RUN cd /home/circleci/ && sudo make install && make configure

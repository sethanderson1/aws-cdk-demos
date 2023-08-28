FROM ubuntu:18.04
#FROM public.ecr.aws/lts/apache2:2.4-20.04_beta
#FROM public.ecr.aws/lts/ubuntu:edge

RUN apt-get update && \
    apt-get -y install \
        curl \
        wget \
        telnet \
        tar \
        vim \
        unzip \
        openjdk-8-jdk \
        net-tools \
        procps \
        gnupg \
        tree
 
RUN apt-get update
RUN apt-get -y install apache2 libapache2-mod-jk
#RUN cp -v /usr/lib/apache2/modules/mod_jk.so /usr/local/apache2/modules/mod_jk.so

# Install apache and write hello world message

RUN echo 'Hello World!' > /var/www/html/index.html

# Configure apache

RUN echo '. /etc/apache2/envvars' > /root/run_apache.sh && \
    echo 'mkdir -p /var/run/apache2' >> /root/run_apache.sh && \
    echo 'mkdir -p /var/lock/apache2' >> /root/run_apache.sh && \
    echo '/usr/sbin/apache2 -D FOREGROUND' >> /root/run_apache.sh && \
    chmod 755 /root/run_apache.sh

EXPOSE 80

CMD /root/run_apache.sh
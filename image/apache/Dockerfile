# Use an official base image
FROM ubuntu:18.04

# Install dependencies and enable Apache modules
RUN apt-get update && \
    apt-get -y install \
        curl wget telnet tar vim unzip \
        openjdk-8-jdk net-tools procps gnupg tree \
        apache2 libapache2-mod-jk && \
    a2enmod proxy proxy_http && \
    rm -rf /var/lib/apt/lists/*

# Copy the custom configuration for Apache into the image
COPY 000-default.conf /etc/apache2/sites-available/

# Enable the site (optional but explicit)
# RUN a2ensite 000-default.conf

# Install apache and write a test message
RUN echo 'Hello World!' > /var/www/html/index.html

# Create the script to run Apache in the foreground
RUN echo '. /etc/apache2/envvars' > /root/run_apache.sh && \
    echo 'mkdir -p /var/run/apache2' >> /root/run_apache.sh && \
    echo 'mkdir -p /var/lock/apache2' >> /root/run_apache.sh && \
    echo '/usr/sbin/apache2 -D FOREGROUND' >> /root/run_apache.sh && \
    chmod 755 /root/run_apache.sh

# Expose the web server port
EXPOSE 80

# Run Apache in the foreground
CMD /root/run_apache.sh

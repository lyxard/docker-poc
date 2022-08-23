FROM perl:5.8

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get autoremove -y
RUN apt-get install apt-utils -y

#RUN apt-get install -y apache2 && \
#   a2enmod cgid
#   #apache2-utils &&\
#   #a2enmod cgid &&\
#   #apt-transport-https &&\
#   #build-essential
#   #ca-certificates \
#   #curl \
#   #perl \
#   #cpanminus \
#   #libssl-dev \
#   #apt-utils \
#   #apt-get clean

RUN \
    #DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y \
        build-essential \
        apt-utils \
        ssl-cert \
        apache2 \
        apache2-utils \
        apache2-dev \
        libapache2-mod-perl2 \
        libapache2-mod-perl2-dev \
        libcgi-pm-perl \
        liblocal-lib-perl \
        cpanminus \
        libexpat1-dev \
        libssl-dev \
        mysql-client \
        libmysqlclient-dev \
        libapreq2-dev \
        zip && \
    cpanm DBD::mysql && \
    a2enmod cgid && \
    a2enmod rewrite && \
    a2dissite 000-default && \
    #apt-get update -y && \
    #apt-get upgrade -y && \
    apt-get -y clean

#RUN cpanm install Unisolve::Config
#RUN cpanm --installdep .


#RUN mkdir /var/www/html/cgi-bin
#RUN chmod a+x /var/www/html/cgi-bin
COPY localhost.conf /etc/apache2/sites-enabled/localhost.conf

#COPY ./html/index.html /var/www/html
#COPY ./html/cgi-bin/test.pl /var/www/html

RUN mkdir /var/www/html/css
RUN mkdir /var/www/html/images
RUN mkdir /var/www/html/javascript
RUN mkdir /var/www/html/jquery




COPY ./html/* /var/www/html/
COPY ./html/css/* /var/www/html/css/
COPY ./html/images/* /var/www/html/images/
COPY ./html/javascript/* /var/www/html/javascript/
COPY ./html/jquery/* /var/www/html/jquery/



COPY ./html/cgi-bin/test.pl /var/www/html
COPY ./html/cgi-bin/connect_db_ts.pl /var/www/html
COPY ./html/cgi-bin/shop_timesheet.conf /var/www/html
COPY ./html/cgi-bin/get_acco_ip.pl /var/www/html
COPY ./html/cgi-bin/shop_timesheet_common.pl /var/www/html
#CMD cpanm --installdep .



#RUN service apache2 restart

#VOLUME [".","/var/www/html"]


#RUN cpanm --installdep .

#CMD ["cpanm ","--installdep ."]


VOLUME [ "./html","/var/www/html"]

WORKDIR /var/www/html

RUN chmod +x index.html
RUN chmod +x test.pl
RUN chmod +x connect_db_ts.pl
RUN chmod +x shop_timesheet.conf
RUN chmod +x get_acco_ip.pl
RUN chmod +x shop_timesheet_common.pl

EXPOSE 80

#RUN service apache2 reload
RUN service apache2 restart --full restart

#RUN \
#    chmod -777 /var/www/html/index.html && \
#    chmod -777 /var/www/html/cgi-bin/test.pl

CMD ["apache2ctl", "-DFOREGROUND"]

#CMD ["service apache2","--full-restart"]
#CMD ["perl5.8.9","-de0"]
#ENTRYPOINT apache2ctl -D FOREGROUND



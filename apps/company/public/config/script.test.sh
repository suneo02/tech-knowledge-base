# !/bin/bash

PROJECT=Wind.Bs.SuperList.Web
BASEPATH=/wind/html/$PROJECT
cd $BASEPATH
chown -R dev:users $BASEPATH

find $BASEPATH -type d -exec chmod -R 750 {} \;
find $BASEPATH -type f -exec chmod -R 640 {} \;


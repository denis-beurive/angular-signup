# Note about Bower

* http://stackoverflow.com/questions/21168141/can-not-install-packages-using-node-package-manager-in-ubuntu
* http://blog.teamtreehouse.com/getting-started-bower
* https://github.com/angular-ui/bootstrap-bower
* https://github.com/angular/bower-angular-route

# Note about Apache's configuration

http://stackoverflow.com/questions/30843130/bootstrap-no-access-control-allow-origin-header

      <IfModule mod_headers.c>
        Header set Access-Control-Allow-Origin "*"
      </IfModule>

You need to activate the module "headers".

      /usr/sbin/a2enmod headers
      service apache2 restart


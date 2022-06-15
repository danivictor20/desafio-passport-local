# Detalles para Leo | Desafío balance de carga

- Comandos 
    
    $ node index.js --puerto 8081 --modo CLUSTER
    $ node index.js --puerto 8081 --modo FORK

    $ nodemon index.js --puerto 8081 --modo CLUSTER
    $ nodemon index.js --puerto 8081 --modo FORK

    $ forever start index.js --puerto 8081 --modo CLUSTER (Requiere npm i forever -g)
    $ forever -w start index.js --puerto 8081 --modo FORK (En modo WATCH)
        - http://localhost:8081/ecommerce/
    $ forever list
    $ forever stopall

    $ pm2 list (Requiere npm i pm2 -g)
    $ pm2 start index.js --name servidor-modo-fork-8081 --watch -- --puerto 8081 (En modo FORK y WATCH)
    $ pm2 start index.js --name servidor-modo-cluster-8081 -i max -- --puerto 8081 (En modo CLUSTER)
    $ pm2 stop servidor-modo-fork-8081
    $ pm2 delete servidor-modo-fork-8081

- Proxy inverso con NGINX

    
    # Dejo un archivo .doc con las pruebas y screenshots



- Configurar el .env

Leo, te dejo un .env.example para que saques un .env de ese. Los valores te los dejo en el chat o en el 
comentario de la entrega. Cualquier duda consultame

$ npm i

# Puebas y endpoints

- /ecommerce        -> Estará protegida. Automaticamente te manda al login
- /ecommerce/login  -> Tenes el botón para registrarte o iniciar cuando ya tengas usuario 
- /ecommerce/info   -> Se agregó el número de hilos del servidor

# Aclaraciones

- Te deje una variable en el .env para que la configures en segundos el tiempo de inactividad para voltear la sesión
- Otra cosa: Para este desafío dejé código limpio y solo importando lo justo y necesario para que quede bien claro lo de Passport Local,
ya que las sesiones como todo el circuito queda en manos de la librería

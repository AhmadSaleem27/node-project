const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');

//Middlewares
const app = express();
app.use(express.static(path.resolve('./public')));
app.use(express.static(__dirname));
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname, { 
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    },
}));

    const initialBulbStates = [false, false, false, false];

    io.on('connection', (socket) => {
        console.log('A user connected');
    
        // Send initial bulb states to the new client
        socket.emit('initialBulbStates', initialBulbStates);
    
        socket.on('toggle', (data) => {
            console.log(`Bulb ${data.index} toggled to ${data.state}`);
            initialBulbStates[data.index - 1] = data.state === 'on';
            io.emit('toggle', data);
        });
    
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    app.get("/",(req,res)=>{
        res.send("/index.html")
    })

const PORT = 5500;
server.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});



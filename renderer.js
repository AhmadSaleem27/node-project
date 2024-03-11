document.addEventListener('DOMContentLoaded', function () {
    const socket = io.connect('http://localhost:5500');

    window.toggleBulb = function (index) {
        const bulb = document.getElementById(`bulb${index}`);
        const currentState = bulb.classList.contains('on');
        const newState = !currentState ? 'on' : 'off';

        bulb.classList.toggle('on', !currentState);
        bulb.style.borderColor = currentState ? 'red' : 'green';

        socket.emit('toggle', { index, state: newState });
        socket.emit('broadcastToggle', { index, state: newState });
        updateButtonInnerHTML();
    };

    socket.on('toggle', (data) => {
        const bulb = document.getElementById(`bulb${data.index}`);
        bulb.style.borderColor = data.state === 'on' ? 'green' : 'red';
        console.log(`Received toggle event: Bulb ${data.index} is now ${data.state}`);
        updateButtonInnerHTML(); 
    });

    socket.on('broadcastToggle', (data) => {
        const bulb = document.getElementById(`bulb${data.index}`);
        bulb.style.borderColor = data.state === 'on' ? 'green' : 'red';
        console.log(`Received broadcast toggle event: Bulb ${data.index} is now ${data.state}`);
        updateButtonInnerHTML();
    });

    window.toggleAllStates = function () {
        const bulbs = document.getElementsByClassName('bulb');

        for (let i = 0; i < bulbs.length; i++) {
            const currentState = bulbs[i].classList.contains('on');
            const newState = currentState ? 'off' : 'on';

            bulbs[i].classList.toggle('on', !currentState);
            bulbs[i].style.borderColor = currentState ? 'red' : 'green';

            socket.emit('toggle', { index: i + 1, state: newState });
            socket.emit('broadcastToggle', { index: i + 1, state: newState });
        }

        updateButtonInnerHTML(); 
    };

    function updateButtonInnerHTML() {
        const bulbs = document.getElementsByClassName('bulb');
        const button = document.querySelector('.btn');

        const anyBulbOn = Array.from(bulbs).some(bulb => bulb.classList.contains('on'));

        button.innerHTML = anyBulbOn ? 'OFF' : 'ON';
    }
});

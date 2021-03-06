(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const label = document.querySelector('.label');
    const config = {
        DotMinRad: 6,
        DotMaxRad: 20,
        massFactor: 0.002,
        deafColor: ` rgba(48, 253, 37, 0.9)`,
        pi: 2 * Math.PI,
        smooth: .65,
        sphereRad: 300,
        cursorDotRad: 25,
        mouseSize: 100,
        time: 1500,
        maxSize: 150,
    }
    let w, h, mouse;
    let dots;

    class Dot {
        constructor(arr) {
            this.pos = { x: mouse.x, y: mouse.y }
            this.vel = { x: 0, y: 0 };
            this.rad = arr || random(config.DotMinRad, config.DotMaxRad);
            this.mass = this.rad * config.massFactor;
            this.color = config.deafColor;
            this.tim = config.time;
        }
        draw(bigX, bigY) {
            this.pos.x = bigX || this.pos.x + this.vel.x;
            this.pos.y = bigY || this.pos.y + this.vel.y;
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
            createCircle(this.pos.x, this.pos.y, this.rad, false, config.deafColor);
        }
    }
    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let acc = { x: 0, y: 0 }
            for (let j = 0; j < dots.length; j++) {
                if (i == j) continue;
                let [a, b] = [dots[i], dots[j]];

                let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y }

                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (dist - config.sphereRad) / dist * b.mass;

                if (j == 0) {
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(48, 253, 37, ${alpha})`
                    if (dist < config.mouseSize) { force = (dist - config.mouseSize) * b.mass } else {

                    }
                }
                acc.x += delta.x * force;
                acc.y += delta.y * force;



            }
            dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
            dots[i].tim -= 1;

            if (dots[i].tim < 0) {
                if (dots.length > 60)
                    dots.splice(i, 1)
            }
        }

        dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
    }
    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();

        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
    }
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        mouse = { x: w / 2, y: h / 2, down: false }
        dots = [];
        dots.push(new Dot(config.cursorDotRad))
    }
    function loop() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.down) {
            if (dots.length < config.maxSize) {
                dots.push(new Dot());
            }

        }
        updateDots();
        updateLabel();
        window.requestAnimationFrame(loop)
    }
    init();
    loop();
    function isDown() {
        mouse.down = !mouse.down;
    }
    function updateLabel() {
        label.style.top = mouse.y + 'px';
        label.style.left = mouse.x + 'px';
    }
    function setPos({ layerX, layerY }) {
        [mouse.x, mouse.y] = [layerX, layerY];
    }
    canvas.addEventListener('mousemove', setPos);
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);

})();
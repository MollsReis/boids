'use strict';

// core boid object
var Boid = function(x, y) {
    // tweakables
    this.startingSpeed = 1;
    this.maxSpeed = 10;
    this.minDistance = 3;
    this.maxDistance = 10;

    // boid vectors
    this.position = new Vector(x, y);
    this.velocity = Util.randomVector(-10, 10).normalize().mult(this.startingSpeed);
    this.acceleration = new Vector(0, 0);

    // boid position update
    this.update = function() {
        // reset acceleration
        this.acceleration.mult(0);

        // calculate forces
        this.acceleration.add(separation());
        this.acceleration.add(alignment());
        this.acceleration.add(cohesion());

        // adjust velocity
        this.velocity.add(this.acceleration);

        // check for max speed
        if (this.velocity.magnitude() > this.maxSpeed) {
            this.velocity.normalize().mult(this.maxSpeed);
        }

        // adjust position
        this.position.add(this.velocity);
    };

    // render boid on canvas
    this.render = function(context) {
        var x = this.position.x % context.canvas.width,
            y = this.position.y % context.canvas.height;
        context.fillRect(x, y, 1, 1);
    };

    function separation() {
        //TODO
        return new Vector(0, 0);
    }

    function alignment() {
        //TODO
        return new Vector(0, 0);
    }

    function cohesion() {
        //TODO
        return new Vector(0, 0);
    }
};

// basic vector object
var Vector = function(x, y) {
    this.x = x;
    this.y = y;

    this.add = function(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };

    this.sub = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };

    this.mult = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };

    this.div = function(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    };

    this.magnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    this.normalize = function() {
        this.div(this.magnitude());
        return this;
    };
};

// helper functions
var Util = {
    getCanvas: function() {
        return document.getElementById('canvas');
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    randomPoint: function() {
        var canvas = Util.getCanvas();
        return [Util.randomInt(0, canvas.width), Util.randomInt(0, canvas.height)];
    },

    randomVector: function(min, max) {
        return new Vector(Util.randomInt(min, max), Util.randomInt(min, max));
    },

    generateSwarm: function(num) {
        var i, point;
        var swarm = [];
        for (i = 0; i < num; i++) {
            point = Util.randomPoint();
            swarm.push(new Boid(point[0], point[1]))
        }
        return swarm;
    }
};

var init = function() {
    // grab canvas/context
    var canvas = Util.getCanvas();
    var context = canvas.getContext('2d');

    // create swarm
    var boids = Util.generateSwarm(100);

    // loop forever
    var loop = setInterval(function() {
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // render boids
        boids.forEach(function(boid) { boid.render(context); });

        // update boid position
        boids.forEach(function(boid) { boid.update(); });
    }, 10);
};

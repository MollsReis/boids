'use strict';

// core boid object
var Boid = function(x, y, id) {
    this.id = id;
    this.position = new Vector(x, y);
    this.velocity = Util.randomVector(-10, 10).normalize().mult(Variables.startingSpeed);
    this.acceleration = new Vector(0, 0);

    // update boid acceleration
    this.updateAcceleration = function() {
        var closeNeighbors, neighbors;

        // reset acceleration
        this.acceleration.mult(0);

        // calculate forces
        closeNeighbors = this.neighbors(Variables.separationSpace);
        neighbors = this.neighbors(Variables.detectionSpace);
        this.acceleration.add(this.separation(closeNeighbors));
        this.acceleration.add(this.alignment(neighbors));
        this.acceleration.add(this.cohesion(neighbors));
    };

    // update boid velocity and position
    this.updatePosition = function() {
        var canvasWidth, canvasHeight;

        // adjust velocity
        this.velocity.add(this.acceleration);

        // check for max speed
        if (this.velocity.magnitude() > Variables.maxSpeed) {
            this.velocity.normalize().mult(Variables.maxSpeed);
        }

        // adjust position
        this.position.add(this.velocity);

        // adjust off-screen positions
        canvasWidth = Util.getCanvas().width;
        canvasHeight = Util.getCanvas().height;
        this.position.x = (this.position.x < 0 ? this.position.x + canvasWidth : this.position.x) % canvasWidth;
        this.position.y = (this.position.y < 0 ? this.position.y + canvasHeight : this.position.y) % canvasHeight;
    };

    // render boid on canvas
    this.render = function(context) {
        context.fillRect(this.position.x, this.position.y, Variables.boidSize, Variables.boidSize);
    };

    // get boids within a certain distance (exclude self)
    this.neighbors = function(targetDistance) {
        var thisId = this.id;
        var thisPosition = this.position;
        return swarm.reduce(function(neighbors, boid) {
            var boidPosition = boid.position.clone();
            if (Math.abs(thisPosition.x - boidPosition.x) <= targetDistance &&
                Math.abs(thisPosition.y - boidPosition.y) <= targetDistance &&
                boidPosition.sub(thisPosition).magnitude() <= targetDistance
                && thisId !== boid.id) {
                neighbors.push(boid);
            }
            return neighbors;
        }, []);
    };

    // generate vector of separation
    this.separation = function(neighbors) {
        var thisPosition = this.position;
        return neighbors.reduce(function(vec, boid) {
            return vec.add(thisPosition.clone().sub(boid.position));
        }, new Vector(0, 0)).div(neighbors.length || 1).mult(Variables.separationWeight);
    };

    // generate vector of alignment
    this.alignment = function(neighbors) {
        return neighbors.reduce(function(vec, boid) {
            return vec.add(boid.velocity);
        }, new Vector(0, 0)).div(neighbors.length || 1).mult(Variables.alignmentWeight);
    };

    // generate vector of cohesion
    this.cohesion = function(neighbors) {
        var thisPosition = this.position;
        return neighbors.reduce(function(vec, boid) {
            return vec.add(boid.position.clone().sub(thisPosition));
        }, new Vector(0, 0)).div(neighbors.length || 1).mult(Variables.cohesionWeight);
    };
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

    this.clone = function() {
        return new Vector(this.x, this.y);
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
            swarm.push(new Boid(point[0], point[1], i))
        }
        return swarm;
    }
};

var Variables = {
    fps: 60,
    boidSize: 3,
    swarmSize: 100,
    startingSpeed: 1.5,
    maxSpeed: 3,
    detectionSpace: 50,
    separationSpace: 5,
    separationWeight: 10,
    alignmentWeight: 10,
    cohesionWeight: 1
};

var swarm; //TODO come up with better way to expose swarm to individual boids

var init = function() {
    // grab canvas/context
    var canvas = Util.getCanvas();
    var context = canvas.getContext('2d');

    // create swarm
    swarm = Util.generateSwarm(Variables.swarmSize);

    // loop forever
    var loop = setInterval(function() {
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // render boids
        swarm.forEach(function(boid) { boid.render(context); });

        // update boid acceleration
        swarm.forEach(function(boid) { boid.updateAcceleration(); });

        // update boid position
        swarm.forEach(function(boid) { boid.updatePosition(); });
    }, 1000 / Variables.fps);
};

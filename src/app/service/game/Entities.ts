import { UntypedFormBuilder } from "@angular/forms";

export class Game{
    max_health = 10;
    curr_health = this.max_health;
    score = 0;
    money = 40;
    player_name = "igor";
    gameStopped = false;
    mouse = new Coordinates(0,0);
    gameEnd = false;

    projectiles : Projectile[] = []

    map = new Map([new Coordinates(0, 250),
        new Coordinates(200, 250),
        new Coordinates(200, 500),
        new Coordinates(400, 500),
        new Coordinates(400, 250),
        new Coordinates(700, 250)])
    
    towers : Tower[] = [];
    enemies : Enemy[] = [];
    waveNumber = 1;
    lastWave = performance.now();
    waveInterval = 5000;

    canvas !: HTMLCanvasElement;
    ctx !: CanvasRenderingContext2D;

    selected : Tower | undefined;
    

    draw = (time : number) => {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
        this.map.draw(this.ctx);
        this.enemies.forEach( (enemy) => enemy.draw(time, this.ctx))
        this.towers.forEach( (tower) => {
            tower.draw(this.ctx);
            tower.fire(this.enemies, this.ctx)
        })
        this.projectiles.forEach( (proj) => proj.draw());
        this.drawSelected();
    }

    healthEvent = new CustomEvent("health", {detail: this.curr_health})

    sendWave = (num : number) =>{
        console.log("Sending wave " + num)
        const multiplicator = Math.floor(Math.log10(num**2+ 4)) + 3;
        for (let index = 0; index < multiplicator; index++) {
            this.enemies.push(new Enemy(this.map.path, this, this.waveNumber));
        }
    }

    playGame = (time : number) =>{
        if(!this.gameStopped){
            this.draw(time)
            let now = performance.now();
            if(now - this.lastWave >= this.waveInterval){
                this.lastWave = now;
                this.sendWave(this.waveNumber++)
            }
            if(this.curr_health <= 0){
                this.gameStopped = true;
                this.gameEnd = true
                this.ctx.fillStyle = "rgba(40,40,40,180)"
                this.ctx.globalAlpha = 0.9;
                this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height)
            }
        }
    }
    setCanvas = (ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement) =>{
        this.canvas = canvas;
        this.ctx = ctx;
        canvas.addEventListener("mousemove", (e) =>{
            this.mouse = new Coordinates(e.offsetX, e.offsetY);
        })
        canvas.addEventListener("mouseup", (e) =>{
            this.placeTower()
        });
    }

    selectTower = (name:string) =>{
        switch(name){
            case "missile":
                this.selected = new MissileTower(this);
                break;
            case "taser":
                this.selected = new TaserTower(this);
                break;
            default:
                this.selected = undefined;
        }
    }

    placeTower = () => {
        if(this.selected && this.money >= this.selected.cost){
            this.selected.location = new Coordinates(this.mouse.x, this.mouse.y)
            this.towers.push(this.selected);
            this.money -= this.selected.cost;
            this.selected = undefined;
        }
    }

    drawSelected = () =>{
        if(this.selected){
            this.ctx.globalAlpha = 0.6;
            this.ctx.drawImage(this.selected.model,
                this.mouse.x  - this.selected.model.width/2, this.mouse.y - this.selected.model.height/2);
            
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y,
            this.selected.range, 0, Math.PI * 2)
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }

    constructor () {
        
    }
}

class Tower{
    projectile !: Projectile;
    range = 200;
    firerate = 2000;
    model !: HTMLImageElement;
    location = new Coordinates(-1000, -1000);
    lastShot = performance.now();
    cost = 0;

    draw = (canvas : CanvasRenderingContext2D) => {
        canvas.drawImage(this.model, this.location.x, this.location.y);
    }

    fire = (enemies : Enemy[], canvas : CanvasRenderingContext2D) => {
        //shoot the closest
        enemies.sort( (a,b) => a.currLoc.getDistance(this.location) - 
            b.currLoc.getDistance(this.location));

        enemies.forEach( (enemy) => {
            let now = performance.now();
            if(now - this.lastShot > this.firerate &&
                enemy.currLoc.getDistance(this.location) <= this.range){

                    this.projectile.shoot(now, enemy)
                    this.lastShot = now;
            }
        })
    }
    
    constructor(private game : Game){
        this.projectile = new Projectile(game, this);
    }
}

class TaserTower extends Tower{
    constructor(game : Game){
        super(game)
        this.model = new Image();
        this.model.src = "assets/media/tazer.png"
        this.range = 300;
        this.firerate = 1000;
        this.cost = 40
        this.projectile = new SplashProjectile(game, this);
    }
}

class MissileTower extends Tower{
    constructor(game : Game){
        super(game)
        this.model = new Image();
        this.model.src = "assets/media/missile.png"
        this.range = 100;
        this.firerate = 2000;
        this.cost = 20;
        this.projectile = new Projectile(game, this);
    }
}

class Projectile {
    length : number = 100;
    dmg =  10;
    timeShot !: number;
    enemy !: Enemy;
    shoot = (time : number, enemy : Enemy) => {
        this.timeShot = time
        this.enemy = enemy;
        this.game.projectiles.push(this);
        enemy.onHit(this.dmg);
    }
    draw = () => {
        let canvas = this.game.ctx;
        if (performance.now() - this.timeShot < this.length) {
            canvas.beginPath();
            canvas.moveTo(this.tower.location.x, this.tower.location.y);
            canvas.lineWidth = 5;
            canvas.strokeStyle = "#0f0";
            canvas.lineTo(this.enemy.currLoc.x, this.enemy.currLoc.y);
            canvas.stroke();
        }
        else{
            this.game.projectiles.splice(this.game.projectiles.findIndex(
                (e) => e===this
            ), 1)
        }
        
    }
    constructor(private game: Game, private tower : Tower){

    }
}
class SplashProjectile extends Projectile{
    constructor(game: Game, tower : Tower){
        super(game, tower)
    }
}

class Enemy{
    maxHp = 2;
    currHp = this.maxHp;
    money = 5;
    speed = 0.08;
    offsetX = Math.random()*18 * (Math.random() >= 0.2 ? -1 : 1);
    offsetY = Math.random()*10 * (Math.random() >= 0.2 ? -1 : 1);
    model = 15;
    currLoc : Coordinates;
    currGoal = 1;
    vector : Coordinates;
    color = "hsl(25, 100%, 50%)"

    //direction
    calculateDirection = () =>{
        return this.path[this.currGoal].subtract(this.currLoc).normalize();
    }

    //how to die
    onHit = (dmg : number) => {
       
        this.currHp -= dmg;
        this.color ="hsl(25, "+(this.currHp/this.maxHp)*100 + "%, 50%)"
        console.log(this.color)
        if (this.currHp <= 0){
            this.game.money += this.money;
            this.game.score += this.maxHp;
        } 
    }

    nextLocation = (time : number) =>{
        let scalar = this.speed * time;
        this.currLoc = this.currLoc.nextCoordinates(scalar, this.vector);
        
        if(this.path[this.currGoal].subtract(this.currLoc).getLength() <= this.model/3){
            this.currLoc = this.path[this.currGoal];

            if(this.currGoal + 1 < this.path.length){
                this.currGoal += 1;
            }
            else{
                this.currHp = 0;
                this.game.curr_health -= 1;
            }
            
            this.vector = this.calculateDirection();
        }
    }

    draw = (time : number, canvas : CanvasRenderingContext2D) => {
        canvas.fillStyle = this.color;
        if(this.currHp <= 0){
            this.game.enemies.splice(this.game.enemies.findIndex((e) =>e === this),
            1)    
        }

        if(this.currLoc.x + this.offsetX + this.model  > 0 &&
             this.currLoc.y + this.offsetY + this.model > 0){
            
            canvas.fillRect(this.currLoc.x + this.offsetX,
                this.currLoc.y + this.offsetY, this.model, this.model)
        }
        
        this.nextLocation(time)
    }

    constructor(private path : Coordinates[], private game : Game, private wave : number){
        this.currLoc = new Coordinates(path[0].x - Math.random()*200, path[0].y);
        this.vector = this.calculateDirection()
        this.maxHp = this.maxHp + wave
        this.currHp = this.maxHp;
    }
}


class Map{
    width !: number;

   
    draw = (canvas : CanvasRenderingContext2D) => {
        canvas.beginPath()
        canvas.moveTo(this.path[0].x, this.path[0].y)
        this.path.forEach((line) =>{
            canvas.lineWidth = this.width;
            canvas.strokeStyle = "#fff";
            canvas.lineTo(line.x,line.y)
            canvas.stroke()
        })
    }
    
    constructor(public path : Coordinates[]){
        this.width = 65;
    }
}

class Coordinates{

    subtract = (cord : Coordinates) =>{
        return new Coordinates(this.x - cord.x, this.y - cord.y)
    }

    getLength = () =>{
        return Math.sqrt(this.x**2 + this.y**2);
    }

    normalize = () => {
        let length = this.getLength();
        return new Coordinates(this.x/length, this.y/length);
    }

    getDistance = (cord : Coordinates) =>{
        return this.subtract(cord).getLength()
    }

    add = (cord : Coordinates) =>{
        return new Coordinates(this.x + cord.x, this.y + cord.y)
    }

    nextCoordinates = (scalar : number, vector : Coordinates) => {
        return this.add(new Coordinates(vector.x*scalar, vector.y*scalar));
    }

    addNumber = (num : number) =>{
        return new Coordinates(this.x + num, this.y + num);
    }

    biggerThan = (cord : Coordinates) => {
        return this.x >= cord.x && this.y >= cord.y 
    }

    constructor(public x : number, public y : number){
    }
}
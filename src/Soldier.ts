export class Soldier {
    constructor(public health: number, public strength: number) {
        this.health = health;
        this.strength = strength;

    }
    attack() { return this.strength; }
    
    receiveDamage(damage:number) {
        this.health -= damage;
    }
}
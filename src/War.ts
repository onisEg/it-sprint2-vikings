import { Saxon } from "./Saxon";
import { Viking } from "./Viking";

export class War {

    vikingArmy: Viking[] = [];
    saxonArmy: Saxon[] = [];

    addViking(viking: Viking): void {
        this.vikingArmy.push(viking);
    }
    addSaxon(saxon: Saxon): void {
        this.saxonArmy.push(saxon)
    }

    vikingAttack(): string {
        const saxonIndex = Math.floor(Math.random() * this.saxonArmy.length);
        const vikingIndex = Math.floor(Math.random() * this.vikingArmy.length);
        const attackedSaxon = this.saxonArmy[saxonIndex];
        const attackingViking = this.vikingArmy[vikingIndex];

        const result = attackedSaxon.receiveDamage(attackingViking.strength);

        if (attackedSaxon.health <= 0) {
            this.saxonArmy.splice(saxonIndex, 1);
        }
        return result;
    }
    saxonAttack(): string {
        const vikingIndex = Math.floor(Math.random() * this.vikingArmy.length);
        const saxonIndex = Math.floor(Math.random() * this.saxonArmy.length);
        const attackedViking = this.vikingArmy[vikingIndex];
        const attackingSaxon = this.saxonArmy[saxonIndex];

        const result = attackedViking.receiveDamage(attackingSaxon.strength);

        if (attackedViking.health <= 0) {
            this.vikingArmy.splice(vikingIndex, 1);
        }
        return result;
    }
    showStatus(): string {
        if (this.saxonArmy.length === 0) {
            return "Vikings have won the war of the century!";
        }
        if (this.vikingArmy.length === 0) {
            return "Saxons have won the war of the century!";
        }
        return "Vikings and Saxons are still in the thick of battle.";
    }

}
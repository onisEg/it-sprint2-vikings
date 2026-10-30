# Vikings Exercise — Understanding & Study Guide

> This guide is here so you can learn the exercise as if you'd done a similar one first: which concepts it trains, how to read a test and know what to write, and the full solution for every class with line-by-line explanation.

---

## 1) What does this exercise train?

The whole exercise is about **Object-Oriented Programming (OOP)**, specifically two pillars:

- **Inheritance:** a class takes from another class (Saxon and Viking inherit from Soldier).
- **Polymorphism:** the same method (`receiveDamage`) behaves differently in each class.

It also trains you in the **TDD** style (Test-Driven Development): the test is written first, and you write the code that makes it pass.

---

## 2) How to read a test and know what to write (the key skill)

Each test states a condition you must satisfy. Here's the translation:

| The test says | It means |
|---|---|
| `expect(ClassName.length).toEqual(2)` | The **constructor** takes **2** parameters |
| `expect(obj.health).toEqual(300)` | A value was passed and stored in a property called `health` |
| `expect(typeof(obj.attack)).toBe("function")` | There must be a **method** called `attack` |
| `expect(obj.attack.length).toEqual(0)` | The method `attack` takes **no** parameters |
| `expect(obj.attack()).toEqual(strength)` | The method `attack` **returns** `strength` |
| `expect(obj instanceof Soldier).toEqual(true)` | The class must **inherit** from Soldier (`extends`) |
| `expect(obj.method()).toEqual(undefined)` | The method **returns nothing** |

**The golden rule:** `.length` on a class = number of constructor parameters. `.length` on a method = number of its parameters. The parentheses `()` mean "call the method and check what it returns."

**Workflow:** uncomment **one** test, run `pnpm test`, write the smallest code that makes it green, then move to the next. One at a time.

---

## 3) Quick concepts you need

```ts
// Class + constructor shorthand (parameter properties)
class Soldier {
  constructor(public health: number, public strength: number) {}
  //          ↑ the `public` keyword declares the property AND assigns it automatically
}

// Inheritance
class Viking extends Soldier {
  constructor(health: number, strength: number) {
    super(health, strength); // must call the parent first, before any `this`
  }
}

// Polymorphism (override): redefine a method that already exists in the parent
```

- `public` / `private` / `protected` / `readonly` = access levels (encapsulation).
- `extends` = inherit. `super()` = call the parent constructor.
- **override** = write a method with the same name as the parent's but with different behavior → this is polymorphism.
- `` `${variable}` `` = template literal, inserts a variable inside a string.

---

## 4) The full solution with explanation

### Soldier (the base class)

```ts
export class Soldier {
    constructor(public health: number, public strength: number) {}

    attack() {
        return this.strength;        // returns the soldier's strength
    }

    receiveDamage(damage: number) {
        this.health -= damage;       // subtracts damage from health, returns nothing
    }
}
```

**The idea:** the parent class holds the shared behavior that all soldiers have. Methods are written **outside the constructor**, each one an independent member.

---

### Saxon (inherits from Soldier)

```ts
import { Soldier } from "./Soldier";

export class Saxon extends Soldier {
    constructor(health: number, strength: number) {
        super(health, strength);     // passes the values to the parent
    }

    receiveDamage(damage: number): string {
        this.health -= damage;
        if (this.health > 0) {
            return `A Saxon has received ${damage} points of damage`;
        }
        return "A Saxon has died in combat";
    }
}
```

**Key points:**
- `attack()` is **not written** — it comes from Soldier automatically (that's code reuse).
- `receiveDamage()` is **overridden** because Saxon wants it to return a message — this is **polymorphism**.
- `this.health > 0` distinguishes alive from dead (zero counts as dead).

---

### Viking (inherits from Soldier, adds a property and a method)

```ts
import { Soldier } from "./Soldier";

export class Viking extends Soldier {
    constructor(public name: string, health: number, strength: number) {
        super(health, strength);     // the parent only takes health and strength
    }

    receiveDamage(damage: number): string {
        this.health -= damage;
        if (this.health > 0) {
            return `${this.name} has received ${damage} points of damage`;
        }
        return `${this.name} has died in act of combat`;
    }

    battleCry() {
        return "Odin Owns You All!";
    }
}
```

**Key points:**
- The constructor takes **3** parameters, but the parent takes only **2** (`name` is specific to Viking).
- The messages use `${this.name}` (the viking's name) — and note "**act of** combat", which differs from the Saxon message.
- `battleCry()` is a **new** method specific to Viking (inheritance + extension).

> **Notice the difference:** both Saxon and Viking override `receiveDamage` but each with its own message = **polymorphism**. `battleCry`, on the other hand, is a brand-new addition = just extension.

---

### War (manages the battle between the two armies)

```ts
import { Viking } from "./Viking";
import { Saxon } from "./Saxon";

export class War {
    vikingArmy: Viking[] = [];
    saxonArmy: Saxon[] = [];

    addViking(viking: Viking): void {
        this.vikingArmy.push(viking);
    }

    addSaxon(saxon: Saxon): void {
        this.saxonArmy.push(saxon);
    }

    vikingAttack(): string {
        const saxonIndex = Math.floor(Math.random() * this.saxonArmy.length);
        const vikingIndex = Math.floor(Math.random() * this.vikingArmy.length);
        const attackedSaxon = this.saxonArmy[saxonIndex];
        const attackingViking = this.vikingArmy[vikingIndex];

        const result = attackedSaxon.receiveDamage(attackingViking.strength);

        if (attackedSaxon.health <= 0) {
            this.saxonArmy.splice(saxonIndex, 1);   // remove the dead one from the army
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
```

**Key points:**
- `vikingArmy: Viking[] = []` → a property of type "array of Vikings" that starts empty. There's no constructor, so `War.length` = 0.
- `Math.floor(Math.random() * army.length)` → picks a random index from the army.
- `splice(index, 1)` → removes one element at that position (removes the dead soldier).
- `War` uses the other classes' methods (`receiveDamage`) without knowing their internals → that's **abstraction** at work.

---

## 5) Takeaways — what to walk away with

1. **Inheritance** avoids repetition: Saxon and Viking got `attack` and `health`/`strength` from Soldier for free.
2. **Polymorphism** lets the same call (`receiveDamage`) give different results depending on the object's type — no `if` on the type.
3. **TDD:** the test describes exactly what's required; read it carefully and each sentence is a condition you write code to satisfy.
4. `super()` must come before any `this` in a subclass constructor.
5. Methods are written **outside** the constructor, each one independent.

**Link to the next step:** these same concepts (inheritance + polymorphism + interfaces) are the foundation of exercise S2.06 and the SOLID principles.

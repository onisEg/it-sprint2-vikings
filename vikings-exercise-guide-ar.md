# تمرين Vikings — دليل الفهم والمذاكرة

> الهدف من الملف ده إنك تفهم التمرين ده كأنك عملت واحد مشابه قبله: إيه المفاهيم اللي بيدرّبك عليها، إزاي تقرا التست وتعرف تكتب إيه، والحل الكامل لكل كلاس مع شرح كل سطر مهم.

---

## 1) التمرين بيدرّبك على إيه؟

التمرين كله عن **البرمجة الكائنية (OOP)**، وبالذات عمودين:

- **الوراثة (Inheritance):** كلاس ياخد من كلاس تاني (Saxon و Viking بياخدوا من Soldier).
- **تعدد الأشكال (Polymorphism):** نفس الميثود (`receiveDamage`) بتتصرّف بشكل مختلف في كل كلاس.

وكمان بيدرّبك على أسلوب **TDD** (التطوير المقاد بالاختبارات): التست مكتوب الأول، وإنت بتكتب الكود اللي يخلّيه يعدّي.

---

## 2) إزاي تقرا التست وتعرف تكتب إيه؟ (أهم مهارة)

كل تست بيقولك شرط لازم تحققه. دي الترجمة:

| التست بيقول | يعني لازم |
|---|---|
| `expect(ClassName.length).toEqual(2)` | الـ **constructor** ياخد **2** باراميتر |
| `expect(obj.health).toEqual(300)` | قيمة اتبعتت واتخزّنت في خاصية اسمها `health` |
| `expect(typeof(obj.attack)).toBe("function")` | لازم يكون فيه **ميثود** اسمها `attack` |
| `expect(obj.attack.length).toEqual(0)` | الميثود `attack` **ماتاخدش** باراميترز |
| `expect(obj.attack()).toEqual(strength)` | الميثود `attack` **ترجّع** قيمة `strength` |
| `expect(obj instanceof Soldier).toEqual(true)` | الكلاس لازم **يرث** من Soldier (`extends`) |
| `expect(obj.method()).toEqual(undefined)` | الميثود **ماترجّعش** حاجة |

**القاعدة الذهبية:** `.length` على كلاس = عدد باراميترز الـ constructor. `.length` على ميثود = عدد باراميترزها. الأقواس `()` معناها «نادِ الميثود وشوف بترجّع إيه».

**طريقة الشغل:** فكّ comment عن **تست واحد**، شغّل `pnpm test`، اكتب أقل كود يخلّيه يخضّر، بعدها انتقل للي بعده. واحدة واحدة.

---

## 3) مفاهيم سريعة محتاجها

```ts
// تعريف كلاس + constructor باختصار (parameter properties)
class Soldier {
  constructor(public health: number, public strength: number) {}
  //          ↑ كلمة public بتعرّف الخاصية وتسنّد القيمة تلقائياً
}

// الوراثة
class Viking extends Soldier {
  constructor(health: number, strength: number) {
    super(health, strength); // لازم تنادي الأب الأول، وقبل أي this
  }
}

// تعدد الأشكال (override): تعيد تعريف ميثود موجودة في الأب
```

- `public` / `private` / `protected` / `readonly` = مستويات الوصول (التغليف).
- `extends` = يرث. `super()` = ينادي constructor الأب.
- **override** = تكتب ميثود بنفس اسم اللي في الأب بس بسلوك مختلف → ده الـ polymorphism.
- `` `${variable}` `` = template literal، بتحط متغير جوّه نص.

---

## 4) الحل الكامل مع الشرح

### Soldier (الكلاس الأساسي)

```ts
export class Soldier {
    constructor(public health: number, public strength: number) {}

    attack() {
        return this.strength;        // بيرجّع قوة الجندي
    }

    receiveDamage(damage: number) {
        this.health -= damage;       // بيخصم الضرر من الصحة، وماير جّعش حاجة
    }
}
```

**الفكرة:** الكلاس الأب فيه السلوك المشترك اللي كل الجنود بيشاركوه. الميثودز بتتكتب **بره الـ constructor**، كل واحدة عضو مستقل.

---

### Saxon (بيرث من Soldier)

```ts
import { Soldier } from "./Soldier";

export class Saxon extends Soldier {
    constructor(health: number, strength: number) {
        super(health, strength);     // بيبعت القيم للأب
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

**نقاط مهمة:**
- `attack()` **مكتبتهاش** — جت بالوراثة من Soldier تلقائياً (ده معنى إعادة الاستخدام).
- `receiveDamage()` عملتها **override** عشان Saxon عايزها ترجّع رسالة — وده **الـ polymorphism**.
- `this.health > 0` بتفرّق بين لو عاش أو مات (الصفر يعتبر موت).

---

### Viking (بيرث من Soldier، وزوّد خاصية ومي ثود)

```ts
import { Soldier } from "./Soldier";

export class Viking extends Soldier {
    constructor(public name: string, health: number, strength: number) {
        super(health, strength);     // الأب بياخد health و strength بس
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

**نقاط مهمة:**
- الـ constructor بياخد **3** باراميترز، بس الأب بياخد **2** بس (`name` خاص بالـ Viking).
- الرسايل بتستخدم `${this.name}` (اسم الفايكنج) — ولاحظ «**act of** combat» مختلفة عن رسالة Saxon.
- `battleCry()` ميثود **جديدة** مخصوصة للـ Viking (وراثة + إضافة).

> **لاحظ الفرق:** Saxon و Viking الاتنين بيعملوا override لـ `receiveDamage` بس كل واحد برسالته = **polymorphism**. أما `battleCry` فهي إضافة جديدة = مجرد توسيع.

---

### War (بيدير الحرب بين الجيشين)

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
            this.saxonArmy.splice(saxonIndex, 1);   // يشيل الميت من الجيش
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

**نقاط مهمة:**
- `vikingArmy: Viking[] = []` → خاصية من نوع «مصفوفة Vikings» تبدأ فاضية. مفيش constructor فـ `War.length` = 0.
- `Math.floor(Math.random() * army.length)` → بيختار index عشوائي من الجيش.
- `splice(index, 1)` → بيحذف عنصر واحد من المكان ده (بيشيل الجندي الميت).
- `War` بيستخدم ميثودز الكلاسات التانية (`receiveDamage`) من غير ما يعرف تفاصيلها → ده **التجريد** شغّال.

---

## 5) الخلاصة — اللي تطلع بيه من التمرين

1. **الوراثة** بتوفّر تكرار: Saxon و Viking أخدوا `attack` و`health`/`strength` من Soldier مجاناً.
2. **الـ Polymorphism** بيخلّي نفس النداء (`receiveDamage`) يدّي نتايج مختلفة حسب نوع الكائن — من غير `if` على النوع.
3. **TDD:** التست بيوصفلك المطلوب بالظبط؛ اقراه كويس وكل جملة فيه = شرط تكتب كود يحققه.
4. `super()` لازم قبل أي `this` في الـ constructor بتاع كلاس وريث.
5. الميثودز بتتكتب **بره** الـ constructor، كل واحدة مستقلة.

**الربط بالخطوة الجاية:** نفس المفاهيم دي (وراثة + polymorphism + interfaces) هي أساس تمرين S2.06 والمبادئ SOLID.

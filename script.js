let characters = [];
let attacker = null;
let attacking = null;
let characterDisplay = document.getElementById("CharacterDisplay");
class Character {
  #name;
  #level;
  #class;
  #damage;
  constructor(charName, charClass, charLevel, health, damage) {
    this.#name = charName;
    this.#class = charClass;
    this.#level = charLevel;
    this.#damage = damage;
    this.health = health;
  }
  describe() {
    return this.#name + " is a level " + this.#level + " " + this.#class + ".";
  }
  levelUp(n) {
    this.#level += n;
  }
  action() {
    return "None";
  }
  computeDamage() {
    return this.getDamage() * Math.sqrt(this.getLevel());
  }
  getCharClass() {
    return this.#class;
  }
  getName() {
    return this.#name;
  }
  getDamage() {
    return this.#damage;
  }
  getLevel() {
    return this.#level;
  }
  getHealth() {
    return this.health;
  }
  deleteSelf() {
    characters.forEach((v, i) => {
      if (v == this) {
        delete characters[i];
        return;
      }
    });
  }
  attack(otherCharacter) {
    otherCharacter.health -= this.computeDamage();
    this.health -= otherCharacter.computeDamage();
    if (otherCharacter.health <= 0) {
      otherCharacter.deleteSelf();
    }
    if (this.health <= 0) {
      this.deleteSelf();
    }
  }
}

class Mage extends Character {
  #name;
  #class;
  #level;
  #damage;
  #spell;
  constructor(charName, charClass, charLevel, spell, health, damage) {
    super(Character);
    this.#name = charName;
    this.#class = charClass;
    this.#level = charLevel;
    this.#spell = spell;
    this.#damage = damage;
    this.health = health;
  }
  describe() {
    return (
      this.#name +
      " is level " +
      this.#level +
      " and knows " +
      this.#spell +
      "!"
    );
  }
  getHealth() {
    return this.health;
  }
  levelUp(n) {
    this.#level += n;
  }
  action() {
    return this.#name + " casts " + this.#spell + "!";
  }
  getCharClass() {
    return this.#class;
  }
  getName() {
    return this.#name;
  }
  getSpell() {
    return this.#spell;
  }
  computeDamage() {
    return this.getDamage() * Math.sqrt(this.getLevel());
  }
  getLevel() {
    return this.#level;
  }
}
class Warrior extends Character {
  #name;
  #class;
  #level;
  #weapon;
  #damage;
  constructor(charName, charClass, charLevel, weapon, health, damage) {
    super(Character);
    this.#name = charName;
    this.#class = charClass;
    this.#level = charLevel;
    this.#weapon = weapon;
    this.#damage = damage;
    this.health = health;
  }
  getWeapon() {
    return this.#weapon;
  }
  describe() {
    return (
      this.#name +
      " is a level " +
      this.#level +
      " Warrior wielding " +
      this.#weapon +
      "!"
    );
  }
  levelUp(n) {
    this.#level += n;
  }
  computeDamage() {
    return this.getDamage() * Math.sqrt(this.getLevel());
  }
  action() {
    return this.#name + " attacks with " + this.#weapon + "!";
  }
  getCharClass() {
    return this.#class;
  }
  getName() {
    return this.#name;
  }
  getHealth() {
    return this.health;
  }
  getDamage() {
    return this.#damage;
  }
  getLevel() {
    return this.#level;
  }
}
class GameConsole {
  constructor() {}
  async startGame() {
    this.#loginUser();
    this.#loadAssets();
    this.#loadData();
    console.log("Game loaded");
  }
  async #loginUser() {
    console.log("Authenticated user");
  }
  async #loadAssets() {
    console.log("Loading assets");
    let imageNames = ["mage.png", "unknown.png", "warrior.png"];
    imageNames.forEach(async (v, i) => {
      let img = new Image();
      img.src = v;
      await resolveAfterImageLoaded(img);
    });
    console.log("Assets loaded");
  }
  async #loadData() {
    convertData(localStorage.getItem("214753_214753_214753"));
    updatePage();
  }
}
let characterConsole = new GameConsole();
characterConsole.startGame();
window.addEventListener("beforeunload", () => {
  localStorage.setItem("214753_214753_214753", getData());
});
document.getElementById("deleteData").addEventListener("click", () => {
  characters = [];
  localStorage.removeItem("214753_214753_214753");
  location.reload();
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
}
document.getElementById("battleButton").addEventListener("click", () => {
  if (attacker && attacking) {
    attacker.attack(attacking);
    if (attacker.getHealth() <= 0) {
      delete attacker;
    }
    if (attacking.getHealth() <= 0) {
      delete attacking;
    }
    updatePage();
    attacker = null;
    attacking = null;
  }
});
setInterval(() => {
  if (
    document.getElementById("CharacterCreateInputClass").value == "Warrior" ||
    document.getElementById("CharacterCreateInputClass").value == "Mage"
  ) {
    document.getElementById("CharacterCreateInputWeapon").style.opacity = "1";
  } else {
    document.getElementById("CharacterCreateInputWeapon").style.opacity = "0";
  }
  (() => {
    if (attacker == null) {
      document.getElementById("attackingDisplay").innerText =
        "No battle present.";
      return;
    }
    if (attacker && attacking == null) {
      document.getElementById("attackingDisplay").innerText =
        "Attacker present but no defender present.";
      return;
    }
    document.getElementById(
      "attackingDisplay"
    ).innerHTML = `<b>${attacker.getName()}</b> attacking <b>${attacking.getName()}</b>`;
  })();
}, 50);
function resolveAfterImageLoaded(img) {
  return new Promise((resolve) => {
    img.onload = () => {
      resolve("success");
    };
  });
}
function getData() {
  let expandedCharacters = [];
  characters.forEach((cv, ind) => {
    if (cv.getCharClass() == "Warrior") {
      expandedCharacters.push([
        ind,
        cv.getCharClass(),
        cv.getName(),
        cv.getDamage(),
        cv.getLevel(),
        cv.health,
        cv.computeDamage(),
        cv.getWeapon(),
      ]);
      return;
    } else if (cv.getCharClass() == "Mage") {
      expandedCharacters.push([
        ind,
        cv.getCharClass(),
        cv.getName(),
        cv.getDamage(),
        cv.getLevel(),
        cv.health,
        cv.computeDamage(),
        cv.getSpell(),
      ]);
      return;
    }
    expandedCharacters.push([
      ind,
      cv.getCharClass(),
      cv.getName(),
      cv.getDamage(),
      cv.getLevel(),
      cv.health,
      cv.computeDamage(),
    ]);
  });
  return JSON.stringify(expandedCharacters);
}
function convertData(data) {
  let expandedCharacters = JSON.parse(data);
  expandedCharacters.forEach((cv, ind) => {
    if (cv[1] == "Warrior") {
      characters.push(new Warrior(cv[2], cv[1], cv[4], cv[7], cv[5], cv[3]));
      return;
    } else if (cv[1] == "Mage") {
      characters.push(new Mage(cv[2], cv[1], cv[4], cv[7], cv[5], cv[3]));
      return;
    }
    characters.push(new Character(cv[2], cv[1], cv[4], cv[5], cv[3]));
  });
}
function exportData() {
  copyToClipboard(getData());
  alert(`${getData()} copied to clipboard.`);
}
document.getElementById("exportData").addEventListener("click", exportData);

function updatePage() {
  while (characterDisplay.lastChild) {
    characterDisplay.lastChild.remove();
  }
  characters.forEach((characterValue, characterIndex) => {
    let characterIndex2 = Math.random() + "_" + Math.random();
    let characterInfoDisplay = document.createElement("div");
    characterInfoDisplay.className = "CharacterInfoDisplay";
    let characterInfoDisplayText = (cidt = document.createElement("p"));
    characterInfoDisplayText.innerHTML =
      characterValue.describe() +
      ` ${
        characterValue.health
      } Health, ${characterValue.computeDamage()} Damage`;
    characterInfoDisplayText.id = characterIndex2 + "_text";
    let characterInfoDisplayLevel = document.createElement("button");
    characterInfoDisplayLevel.innerHTML = "Level Up";
    characterInfoDisplayLevel.addEventListener("click", () => {
      characterValue.levelUp(1);
      updatePage();
    });
    let characterInfoDisplayRemove = document.createElement("button");
    characterInfoDisplayRemove.innerHTML = "Remove character";
    characterInfoDisplayRemove.addEventListener("click", () => {
      if (
        characters[characterIndex] == attacker ||
        characters[characterIndex] == attacking
      ) {
        alert("you cannot remove characters in battle");
        return;
      }
      delete characters[characterIndex];
      updatePage();
    });
    let characterInfoDisplayPicture = (cidp = document.createElement("img"));
    let characterInfoDisplayAction = (cida = document.createElement("button"));
    let characterInfoAttackButton = (ciab = document.createElement("button"));
    ciab.innerHTML = "Battle";
    let placeholderImage = new Image();
    console.log(characterValue.getCharClass());
    if (characterValue.getCharClass() == "Mage") {
      placeholderImage.src = "mage.png";
      cidp.src = "mage.png";
      cidp.width = placeholderImage.width / 20;
      cidp.height = placeholderImage.height / 20;
      cida.innerHTML = "Cast spell";
    } else if (characterValue.getCharClass() == "Warrior") {
      placeholderImage.src = "warrior.png";
      cidp.src = "warrior.png";
      cidp.width = placeholderImage.width / 3;
      cidp.height = placeholderImage.height / 3;
      cida.innerHTML = "Attack";
    } else {
      placeholderImage.src = "unknown.png";
      cidp.src = "unknown.png";
      cidp.width = placeholderImage.width / 15;
      cidp.height = placeholderImage.height / 15;
      cida.innerHTML = "Action";
    }
    delete placeholderImage;
    cida.addEventListener("click", () => {
      document.getElementById(characterIndex2 + "_text").innerText =
        characterValue.action();
    });
    ciab.addEventListener("click", () => {
      if (attacker == null) {
        attacker = characters[characterIndex];
        return;
      }
      if (characters[characterIndex] == attacker) {
        alert("Friendly Fire is disabled");
        return;
      }
      attacking = characters[characterIndex];
    });
    characterInfoDisplay.appendChild(characterInfoDisplayPicture);
    characterInfoDisplay.appendChild(characterInfoDisplayText);
    characterInfoDisplay.appendChild(characterInfoDisplayLevel);
    characterInfoDisplay.appendChild(characterInfoDisplayRemove);
    characterInfoDisplay.appendChild(characterInfoDisplayAction);
    characterInfoDisplay.appendChild(ciab);
    characterDisplay.appendChild(characterInfoDisplay);
  });
}
let createCharacterNode = document.getElementById("CharacterCreateInputSubmit");
function createError(
  error,
  parent = document.getElementById("CharacterCreateInputForm")
) {
  let newError = document.createElement("p");
  newError.className = "formError";
  newError.innerHTML = error;
  newError.style.color = "red";
  let ___ = 1;
  let ____ = setInterval(() => {
    ___ -= 0.004;
    newError.style.opacity = ___;
  }, 16.67);
  parent.appendChild(newError);
  setTimeout(() => {
    newError.remove();
    clearInterval(____);
  }, 5000);
}
createCharacterNode.addEventListener("click", () => {
  let charName = document.getElementById("CharacterCreateInputName").value;
  charName = charName.replace(/\s+/g, " ");
  if (charName.length < 3) {
    createError("name too short");
    return;
  }
  if (charName.length > 10) {
    createError("name too long");
    return;
  }
  let charClass = document.getElementById("CharacterCreateInputClass");
  let charWeapon = document.getElementById("CharacterCreateInputWeapon");
  let charDamage = new Number(
    document.getElementById("CharacterCreateInputDamage").value
  );
  let charHealth = new Number(
    document.getElementById("CharacterCreateInputHealth").value
  );
  let charLevel = new Number(
    document.getElementById("CharacterCreateInputLevel").value
  );
  if (charLevel < 1 || charLevel > 99) {
    createError("level out of range (1-99)");
    return;
  }
  let newChar;
  if (charClass.value == "Mage") {
    newChar = new Mage(
      charName,
      charClass.value,
      charLevel,
      charWeapon.value,
      charHealth,
      charDamage
    );
  } else if (charClass.value == "Warrior") {
    newChar = new Warrior(
      charName,
      charClass.value,
      charLevel,
      charWeapon.value,
      charHealth,
      charDamage
    );
  } else {
    newChar = new Character(
      charName,
      charClass.value,
      charLevel,
      charHealth,
      charDamage
    );
  }

  characters.push(newChar);
  updatePage();
});
document.getElementById("refreshCharacters").addEventListener("click", () => {
  updatePage();
});

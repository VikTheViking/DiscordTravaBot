function heroParser(src, lvl, race) {
	let code = src.split("code=")[1].split("&")[0];
	let maxed = (+lvl >= 100) ? true : false;
	
	let info = [];
	let atts = [
		['Hero Speed(f/h):', 0],
		['Fighting Strength(p):', 0],
		['Attack Bonus(%):', 0],
		['Defense Bonus(%):', 0],
		['Resources Production(one)', 0],
		['Resources Production(each)', 0],
		['Regeneration(%/d):', 10],
		['Experience Bonus(%):', 0],
		['Culture points(p/d):', 0],
		['Damage Reduction(hp):', 0],
		['Attack Natar Bonus(%):', 0],
		['Plunder Bonus(%):', 0],
		['Baracks TTime(%):', 0],
		['Stable TTime(%):', 0],
		['Troops Speed on 20+(%):', 0],
		['Troops Return Speed(%)', 0],
		['Troops Speed bwn Villages(%):', 0],
		['Troops Speed bwn Alliance(%):', 0],
		['A/D Bonus(p):', 0]
	];

	if (maxed) {
		atts[2][1] = 20;
    	atts[3][1] = 20;
    	atts[4][1] = 2000;
    	atts[5][1] = 600;
	}

	let horse = new Map();
	horse.set("00", ["No horse",[0, 7]]);
	horse.set("67", ["Gelding (tier 1)", [0, 14]]);
	horse.set("68", ["Thoroughbred (tier 2)", [0, 17]]);
	horse.set("69", ["Warhorse (tier 3)", [0, 20]]);

	let helmet = new Map();
	helmet.set("0", ["No helmet", [0, 0]]);
	helmet.set("1", ["Helmet of Awareness (tier 1)", [7, 15]]);
	helmet.set("2", ["Helmet of Enlightenment (tier 2)", [7, 20]]);
	helmet.set("3", ["Helmet of Wisdom (tier 3)", [7, 25]]);
	helmet.set("4", ["Helmet of Regeneration (tier 1)", [6, 10]]);
	helmet.set("5", ["Helmet of Healthiness (tier 2)", [6, 15]]);
	helmet.set("6", ["Helmet of Healing (tier 3)", [6, 20]]);
	helmet.set("7", ["Helmet of the Gladiator (tier 1)", [8, 100]]);
	helmet.set("8", ["Helmet of the Tribune (tier 2)", [8, 400]]);
	helmet.set("9", ["Helmet of the Consul (tier 3)", [8, 800]]);
	helmet.set("a", ["Helmet of the Horseman (tier 1)", [13, 10]]);
	helmet.set("b", ["Helmet of the Cavalry (tier 2)", [13, 15]]);
	helmet.set("c", ["Helmet of the Heavy cavalry (tier 3)", [13, 20]]);
	helmet.set("d", ["Helmet of the Mercenary (tier 1)", [12, 10]]);
	helmet.set("e", ["Helmet of the Warrior (tier 2)", [12, 15]]);
	helmet.set("f", ["Helmet of the Archon (tier 3)", [12, 20]]);

	let boots = new Map();
	boots.set("00", ["No boots", [0, 0]]);
	boots.set("5e", ["Boots of Regeneration (tier 1)", [6, 10]]);
	boots.set("5f", ["Boots of Healthiness (tier 2)", [6, 15]]);
	boots.set("60", ["Boots of Healing (tier 3)", [6, 20]]);
	boots.set("61", ["Boots of the Mercenary (tier 1)", [14, 25]]);
	boots.set("62", ["Boots of the Warrior (tier 2)", [14, 50]]);
	boots.set("63", ["Boots of the Archon (tier 3)", [14, 75]]);
	boots.set("64", ["Small spurs (tier 1)", [0, 3]]);
	boots.set("65", ["Spurs (tier 2)", [0, 4]]);
	boots.set("66", ["Nasty spurs (tier 3)", [0, 5]]);

	let armour = new Map();
	armour.set("00", "No armour");
	armour.set("52", ["Light armour of Regeneration (tier 1)", [6, 20]]);
	armour.set("53", ["Armour of Regeneration (tier 2)", [6, 30]]);
	armour.set("54", ["Heavy armour of Regeneration (tier 3)", [6, 40]]);
	armour.set("55", ["Light scale armour (tier 1)", [9, 4], [6, 10]]);
	armour.set("56", ["Scale armour (tier 2)", [9, 6], [6, 15]]);
	armour.set("57", ["Heavy scale armour (tier 3)", [9, 8], [6, 20]]);
	armour.set("58", ["Light breastplate (tier 1)", [1, 500]]);
	armour.set("59", ["Breastplate (tier 2)", [1, 1000]]);
	armour.set("5a", ["Heavy breastplate (tier 3)", [1, 1500]]);
	armour.set("5b", ["Light segmented armour (tier 1)", [1, 250], [9, 3]]);
	armour.set("5c", ["Segmented armour (tier 2)", [1, 500], [9, 4]]);
	armour.set("5d", ["Heavy segmented armour (tier 3)", [1, 750], [9, 5]]);

	let left = new Map();
	left.set("00", ["No item", [0, 0]]);
	left.set("3d", ["Small Map (tier 1)", [15, 30]]);
	left.set("3e", ["Map (tier 2)", [15, 40]]);
	left.set("3f", ["Large Map (tier 3)", [15, 50]]);
	left.set("40", ["Small Pennant (tier 1)", [16, 30]]);
	left.set("41", ["Pennant (tier 2)", [16, 40]]);
	left.set("42", ["Great Pennant (tier 3)", [16, 50]]);
	left.set("43", ["Small Standard (tier 1)", [17, 15]]);
	left.set("44", ["Standard (tier 2)", [17, 20]]);
	left.set("45", ["Great Standard (tier 3)", [17, 25]]);
	left.set("49", ["Pouch of the thief (tier 1)", [11, 10]]);
	left.set("4a", ["Bag of the thief (tier 2)", [11, 15]]);
	left.set("4b", ["Sack of the thief (tier 3)", [11, 20]]);
	left.set("4c", ["Small shield (tier 1)", [1, 500]]);
	left.set("4d", ["Shield (tier 2)", [1, 1000]]);
	left.set("4e", ["Large shield (tier 3)", [1, 1500]]);
	left.set("4f", ["Small horn of the Natarian (tier 1)", [10, 20]]);
	left.set("50", ["Horn of the Natarian (tier 2)", [10, 25]]);
	left.set("51", ["Large horn of the Natarian (tier 3)", [10, 30]]);

	let right = new Map();
	right.set("00", ["No item", [0, 0]]);
	right.set("10", ["Short sword of the Legionnaire (tier 1)", [1, 500], [18, 3]]);
	right.set("11", ["Sword of the Legionnaire (tier 2)", [1, 1000], [18, 4]]);
	right.set("12", ["Long sword of the Legionnaire (tier 3)", [1, 1500], [18, 5]]);
	right.set("13", ["Short sword of the Praetorian (tier 1)", [1, 500], [18, 3]]);
	right.set("14", ["Sword of the Praetorian (tier 2)", [1, 1000], [18, 4]]);
	right.set("15", ["Long sword of the Praetorian (tier 3)", [1, 1500], [18, 5]]);
	right.set("16", ["Short sword of the Imperian (tier 1)", [1, 500], [18, 3]]);
	right.set("17", ["Sword of the Imperian (tier 2)", [1, 1000], [18, 4]]);
	right.set("18", ["Long sword of the Imperian (tier 3)", [1, 1500], [18, 5]]);
	right.set("19", ["Short sword of the Imperatoris (tier 1)", [1, 500], [18, 9]]);
	right.set("1a", ["Sword of the Imperatoris (tier 2)", [1, 1000], [18, 12]]);
	right.set("1b", ["Long sword of the Imperatoris (tier 3)", [1, 1500], [18, 15]]);
	right.set("1c", ["Light lance of the Caesaris (tier 1)", [1, 500], [18, 12]]);
	right.set("1d", ["Lance of the Caesaris (tier 2)", [1, 1000], [18, 16]]);
	right.set("1e", ["Heavy lance of the Caesaris (tier 3)", [1, 1500], [18, 20]]);
	right.set("1f", ["Spear of the Phalanx (tier 1)", [1, 500], [18, 3]]);
	right.set("20", ["Pike of the Phalanx (tier 2)", [1, 1000], [18, 4]]);
	right.set("21", ["Lance of the Phalanx (tier 3)", [1, 1500], [18, 5]]);
	right.set("22", ["Short sword of the Swordsman (tier 1)", [1, 500], [18, 3]]);
	right.set("23", ["Sword of the Swordsman (tier 2)", [1, 1000], [18, 4]]);
	right.set("24", ["Long sword of the Swordsman (tier 3)", [1, 1500], [18, 5]]);
	right.set("25", ["Short-bow of the Theutates (tier 1)", [1, 500], [18, 6]]);
	right.set("26", ["Bow of the Theutates (tier 2)", [1, 1000], [18, 8]]);
	right.set("27", ["Long-bow of the Theutates (tier 3)", [1, 1500], [18, 10]]);
	right.set("28", ["Staff of the Druidrider (tier 1)", [1, 500], [18, 6]]);
	right.set("29", ["Great staff of the Druidrider (tier 2)", [1, 1000], [18, 8]]);
	right.set("2a", ["Fighting-staff of the Druidrider (tier 3)", [1, 1500], [18, 10]]);
	right.set("2b", ["Light lance of the Haeduan (tier 1)", [1, 500], [18, 9]]);
	right.set("2c", ["Lance of the Haeduan (tier 2)", [1, 1000], [18, 12]]);
	right.set("2d", ["Heavy lance of the Haeduan (tier 3)", [1, 1500], [18, 15]]);
	right.set("2e", ["Club of the Clubswinger (tier 1)", [1, 500], [18, 3]]);
	right.set("2f", ["Mace of the Clubswinger (tier 2)", [1, 1000], [18, 4]]);
	right.set("30", ["Morning star of the Clubswinger (tier 3)", [1, 1500], [18, 5]]);
	right.set("31", ["Spear of the Spearman (tier 1)", [1, 500], [18, 3]]);
	right.set("32", ["Spike of the Spearman (tier 2)", [1, 1000], [18, 4]]);
	right.set("33", ["Lance of the Spearman (tier 3)", [1, 1500], [18, 5]]);
	right.set("34", ["Hatchet of the Axeman (tier 1)", [1, 500], [18, 3]]);
	right.set("35", ["Axe of the Axeman (tier 2)", [1, 1000], [18, 4]]);
	right.set("36", ["Battle axe of the Axeman (tier 3)", [1, 1500], [18, 5]]);
	right.set("37", ["Light hammer of the Paladin (tier 1)", [1, 500], [18, 6]]);
	right.set("38", ["Hammer of the Paladin (tier 2)", [1, 1000], [18, 8]]);
	right.set("39", ["Heavy hammer of the Paladin (tier 3)", [1, 1500], [18, 10]]);
	right.set("3a", ["Short sword of the Teutonic Knight (tier 1)", [1, 500], [18, 9]]);
	right.set("3b", ["Sword of the Teutonic Knight (tier 2)", [1, 1000], [18, 12]]);
	right.set("3c", ["Long sword of the Teutonic Knight (tier 3)", [1, 1500], [18, 15]]);

	info.push(horse.get(code.substr(40, 2))[0]);
	atts[horse.get(code.substr(40, 2))[1][0]][1] += horse.get(code.substr(40, 2))[1][1];
	info.push(helmet.get(code[49])[0]);
	atts[helmet.get(code[49])[1][0]][1] += helmet.get(code[49])[1][1];
	info.push(right.get(code.substr(52, 2))[0]);
	for (let i = 1; i < right.get(code.substr(52, 2)).length; i++) {
		if (right.get(code.substr(52, 2))[i][0] == 18) atts[18][0] = right.get(code.substr(52, 2))[0].split(' the ')[1].slice(0, -8) + atts[18][0];
		atts[right.get(code.substr(52, 2))[i][0]][1] += right.get(code.substr(52, 2))[i][1];
	}
	info.push(left.get(code.substr(56, 2))[0]);
	atts[left.get(code.substr(56, 2))[1][0]][1] += left.get(code.substr(56, 2))[1][1];
	info.push(armour.get(code.substr(60, 2))[0]);
	for (let i = 1; i < armour.get(code.substr(60, 2)).length; i++) {
		atts[armour.get(code.substr(60, 2))[i][0]][1] += armour.get(code.substr(60, 2))[i][1];
	}
	info.push(boots.get(code.substr(64, 2))[0]);
	if (boots.get(code.substr(64, 2))[1][0] == 0 && atts[0][1] < 10) atts[boots.get(code.substr(64, 2))[1][0]][1] += 0;
	else atts[boots.get(code.substr(64, 2))[1][0]][1] += boots.get(code.substr(64, 2))[1][1];
	
	switch (race) {
	  case "Romans":
	    if (maxed) atts[1][1] += 10100;
	    break;
	  case "Gauls":
	    if (maxed) atts[1][1] += 8100;
	    if (atts[0][1] > 10) atts[0][1] += 5;
	    break;
	  case "Teutons":
	    if (maxed) atts[1][1] += 8100;
	    atts[11][1] += 20;
	    break;
	}

	atts = atts.filter(att => {return att[1] > 0;});

	return [info, atts, maxed];
}

module.exports = heroParser;
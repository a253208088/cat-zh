/**
 * Weird cat science
 */
dojo.declare("com.nuclearunicorn.game.science.ScienceManager", null, {
	
	game: null,
	
	//list of technologies
	techs:[{
		name: "calendar",
		title: "Calendar",
		
		description: "By studing the rotation of the Cath around the sun we may find a better understanding of the seasons and time.",
		effectDesc: "Calendar provides a way of more precise time tracking",
		
		unlocked: true,
		researched: false,
		cost: 60,	//cos in WCS (weird cat science)
		unlocks: ["agriculture"]
			
	},{
		name: "agriculture",
		title: "Agriculture",
		
		description: "By constructing artificial water channels we may improve our catnip fields production",
		effectDesc: "Base fields production improved up to 20%, can construct barns to store more catnip",
		
		unlocked: false,
		researched: false,
		cost: 200,
		unlocks: ["mining"]
	},{
		name: "archery",
		title: "Archery",
		
		description: "Ranged waponry known as a 'bow'",
		effectDesc: "You can train hunters",
		
		unlocked: false,
		researched: false,
		cost: 800,
		unlocks: ["metal"]
	},{
		name: "mining",
		title: "Mining",
		
		description: "Mining develops the ability to extract mineral resources from the bowels of the Cath",
		effectDesc: "You can build mines",
		
		unlocked: false,
		researched: false,
		cost: 800,
		unlocks: ["metal"]
	},{
		name: "metal",
		title: "Metal working",
		
		description: "The first metal-working technology that provides your civilization with sturdy, durable tools",
		effectDesc: "You can construct smelters that convert ore into the metal",
		
		unlocked: false,
		researched: false,
		cost: 800
	}
	],
	
	constructor: function(game){
		this.game = game;
	},
	
	get: function(techName){
		for( var i = 0; i< this.techs.length; i++){
			if (this.techs[i].name == techName){
				return this.techs[i];
			}
		}
		console.error("Failed to get tech for tech name '"+techName+"'");
		return null;
	},
	
	save: function(saveData){
		saveData.science = {
			techs: this.techs
		}
	},
	
	load: function(saveData){
		if (saveData.science){
			var techs = saveData.science.techs;
			//console.log("restored techs:",  techs);
			
			if (saveData.science.techs.length){
				for(var i = 0; i< saveData.science.techs.length; i++){
					var savedTech = saveData.science.techs[i];
					
					if (savedTech != null){
						var tech = this.game.science.get(savedTech.name);
						tech.unlocked = savedTech.unlocked;
						tech.researched = savedTech.researched;
					}
				}
			}
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.TechButton", com.nuclearunicorn.game.ui.button, {
	
	techName: null,
	
	constructor: function(opts, game){
		this.techName = opts.tech;
	},
	
	getTech: function(){
		return this.getTechByName(this.techName);
	},
	
	getTechByName: function(name){
		return this.game.science.get(name);
	},

	updateEnabled: function(){
		this.inherited(arguments);
		
		var tech = this.getTech();
		if (tech.researched /*|| !tech.unlocked*/){
			this.setEnabled(false);
		}
	},
	
	getDescription: function(){
		var tech = this.getTech();
		if (!tech.researched){
			return this.description;
		} else {
			return this.description + "\n" + "Effect: " + tech.effectDesc;
		}
	},
	
	updateVisible: function(){
		
		var tech = this.getTech();
		if (!tech.unlocked){
			this.setVisible(false);
		}else{
			this.setVisible(true);
		}
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.Library", com.nuclearunicorn.game.ui.tab, {

	render: function(tabContainer){
		
		var table = dojo.create("table", { style:{
			width: "100%"
		}}, tabContainer);
		
		var tr = dojo.create("tr", null, table);
		
		var tdTop = dojo.create("td", { colspan: 2 },
			dojo.create("tr", null, table));

		this.tdTop = tdTop;
		
		
		var tr = dojo.create("tr", null, table)
		
		var tdLeft = dojo.create("td", null, tr);	
		var tdRight = dojo.create("td", null, tr);

		
		this.inherited(arguments);
	},
	
	constructor: function(tabName, game){
		var self = this;
		this.game = game;

		for (var i = 0; i < this.game.science.techs.length; i++){
			var tech = this.game.science.techs[i];

			var btn = this.createTechBtn(tech);
			
			if (!tech.unlocked || tech.researched){
				btn.setEnabled(false);
			}
			this.addButton(btn);
		}
	},
	
	createTechBtn: function(tech){
		var btn = new com.nuclearunicorn.game.ui.TechButton({
			name : tech.title,
			handler: function(btn){
				tech.researched = true;

				if (tech.unlocks && tech.unlocks.length){
					for (var i = 0; i < tech.unlocks.length; i++){
						var newTech = btn.getTechByName(tech.unlocks[i]);
						newTech.unlocked = true;
					}
				}
				
			},
			prices:[{
				name:"science",
				val: tech.cost
			}],
			description: tech.description,
			tech: tech.name
		});
		return btn;
	}
});
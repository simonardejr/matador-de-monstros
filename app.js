new Vue({
	el: '#app',
	
	data: {
		running: false,
		playerName: 'Jogador',
		playerLife: 100,
		monsterLife: 100,
		playerCanHeal: 10,
		playerCanUseSpecial: 4,
		specialUsed: 0,
		healUsed: 0,
		logs: [],
	},
	
	computed: {
		hasResult() {
			return this.playerLife == 0 || this.monsterLife == 0
		},
		canUseSpecial() {
			return this.specialUsed < this.playerCanUseSpecial
		},
		canUseHeal() {
			return this.healUsed < this.playerCanHeal
		}
	},

	methods: {
		startGame() {
			this.running = true
			this.playerLife = 100
			this.monsterLife = 100
			this.specialUsed = 0
			this.healUsed = 0
			this.logs = []
		},

		attack(special) {
			this.hurt('monsterLife', 5,10, special, 'Jogador', 'Monstro', 'player')
			if(this.monsterLife > 0) {
				this.hurt('playerLife', 7,12, false, 'Monstro', 'Jogador', 'monster')
			}
		},

		hurt(player, min, max, special, source, target, cls) {
			if(special) this.specialUsed++

			const plus = this.canUseSpecial ? special ? 5 : 0 : 0
			const hurt = this.getRandom(min + plus, max + plus)
			this[player] = Math.max(this[player] - hurt, 0)

			this.registerLog(`${source} atingiu ${target} com ${hurt} de dano` + (special ? ' usando um ataque especial' : ''), special ? 'special' : cls)
		},

		healAndHurt() {
			this.heal(10, 15)
			this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
		},

		heal(min, max) {
			this.healUsed++
			const heal = this.getRandom(min,max);
			this.playerLife = Math.min(this.playerLife + heal, 100)
			this.registerLog(`Jogador ganhou ${heal} de life`, 'heal')
		},

		registerLog(text, cls) {
			this.logs.unshift({text, cls})
		},

		getRandom(min, max) {
			const value = Math.random() * (max - min) + min
			return Math.round(value)
		}
	},

	watch: {
		hasResult(value) {
			if(value) this.running = false
		}
	}

})
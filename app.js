new Vue({
	el: '#app',
	
	data: {
		running: false,
		logs: [],
		player: {
			name: 'Jogador',
			life: 100,
			heal: {
				available: 10,
				used: 0
			},
			special: {
				available: 4,
				used: 0
			}
		},
		monster: {
			life: 100
		},
		difficulty: 1
	},
	
	computed: {
		hasResult() {
			return this.player.life == 0 || this.monster.life == 0
		},
		canUseSpecial() {
			return this.player.special.used < this.player.special.available
		},
		canUseHeal() {
			return this.player.heal.used < this.player.heal.available
		}
	},

	methods: {
		startGame() {
			this.running = true
			this.player.life = 100
			this.monster.life = 100
			this.player.special.used = 0
			this.player.heal.used = 0
			this.logs = []
		},

		attack(special) {
			this.hurt('monster', 5,10, special, this.player.name, 'Monstro', 'player')
			if(this.monster.life > 0) {
				this.hurt('player', 5, this.getMaxMonsterDamage(), false, 'Monstro', this.player.name, 'monster')
			}
		},

		getMaxMonsterDamage() {
			return this.difficulty * 0.7 * 10
		},

		hurt(player, min, max, special, source, target, cls) {
			if(special) this.player.special.used++

			const plus = this.canUseSpecial ? special ? 5 : 0 : 0
			const hurt = this.getRandom(min + plus, max + plus)
			this[player].life = Math.max(this[player].life - hurt, 0)

			this.registerLog(`${source} atingiu ${target} com ${hurt} de dano` + (special ? ' usando um ataque especial' : ''), special ? 'special' : cls)
		},

		healAndHurt() {
			this.heal(10, 15)
			this.hurt('player', 7, 12, false, 'Monstro', 'Jogador', 'monster')
		},

		heal(min, max) {
			this.player.heal.used++
			const heal = this.getRandom(min,max);
			this.player.life = Math.min(this.player.life + heal, 100)
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
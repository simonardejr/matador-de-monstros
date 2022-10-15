new Vue({
	el: '#app',

	data: {
		running: false,
		logs: [],
		player: {
			name: 'Jogador' ,
			life: 100,
			heal: {
				available: 10,
				used: 0
			},
			special: {
				available: 4,
				used: 0
			},
			image: 'hero-idle'
		},
		monster: {
			life: 100,
			type: [
				'slime',
				'eye',
				'lizard'
			],
			color: 0
		},
		difficulty: 2,
		isOpen: false,
		hurtAnimation: {
			player: false,
			monster: false
		},
		hurtDamage: 0,
		showDamagePopup: {
			player: false,
			monster: false
		},
		monsterTurn: false,
		mode: 'light',
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
		},
		isMonsterTurn() {
			return this.monsterTurn
		}
	},

	methods: {
		startGame() {
			this.running = true
			this.player.life = 100
			this.monster.life = 100
			this.player.special.used = 0
			this.player.heal.used = 0
			this.logs = [],
			this.monster.color = Math.floor(Math.random() * 360) + 1
		},

		attack(special=false) {
			this.heroAtack()
			this.hurt('monster', 5, 10, special, this.player.name, this.monster.type[parseInt(this.difficulty) - 1], 'player')
			setTimeout(() => {
				if(this.monster.life > 0) {
					this.playSound('monster')
					this.hurt('player', 5, this.getMaxMonsterDamage(), false, this.monster.type[parseInt(this.difficulty) - 1], this.player.name, 'monster')
				}
			}, 2000)
		},

		heroAtack() {
			this.player.image = 'hero-atack'
			var audioAttack = new Audio('audio/attack.wav')
			audioAttack.play()
			this.setTurn('player')
			setTimeout(() => {
				this.player.image = 'hero-idle'
			}, 500)
			this.setTurn('monster')
		},

		getMaxMonsterDamage() {
			return this.difficulty * 0.7 * 10
		},

		hurt(player, min, max, special, source, target, cls) {
			if(special) this.player.special.used++

			const plus = this.canUseSpecial ? special ? 5 : 0 : 0
			this.hurtDamage = this.getRandom(min + plus, max + plus)
			this[player].life = Math.max(this[player].life - this.hurtDamage, 0)

			this.controlHurtAnimation(player)

			this.registerLog(`${source} atingiu ${target} com ${this.hurtDamage} de dano` + (special ? ' usando um ataque especial' : ''), special ? 'special' : cls)
		},

		setTurn(player) {
			this.monsterTurn = true

			if(player == 'monster') {
				setTimeout(() => {
					this.monsterTurn = false
				}, 3200)
				return
			}
		},

		playSound(player) {
			let audioPlay = new Audio('audio/' + this.monster.type[parseInt(this.difficulty)-1] + '.wav')
			audioPlay.play()
		},

		controlHurtAnimation(player) {
			setTimeout(() => {
				this.hurtAnimation[player] = true
				this.showDamagePopup[player] = true
			}, 500)

			setTimeout(() => {
				this.hurtAnimation[player] = false
				this.showDamagePopup[player] = false
			}, 1200)
		},

		healAndHurt() {
			this.heal(10, 15)
			setTimeout(() => {
				this.hurt('player', 7, 12, false, this.monster.type[parseInt(this.difficulty) - 1], this.player.name, 'monster')
			}, 2000)
			
		},

		heal(min, max) {
			this.setTurn('monster')
			let audioHeal = new Audio('audio/heal.wav')
			audioHeal.play()
			this.player.heal.used++
			const heal = this.getRandom(min,max);
			this.player.life = Math.min(this.player.life + heal, 100)
			this.registerLog(`${this.player.name} ganhou ${heal} de life`, 'heal')
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
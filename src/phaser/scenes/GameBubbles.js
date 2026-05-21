import Phaser from 'phaser'

class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'fuego_balas')
    this.setOrigin(0.5)
    this.setScale(5)
  }

  fire(x, y) {
    this.setActive(true)
    this.setVisible(true)
    this.setPosition(x, y)

    this.play('bola_fuego_vuelo')
    this.setAngle(-180)

    if (this.body) {
      this.body.reset(x, y)
      this.body.velocity.y = -500
    }
  }

  update() {
    if (this.y < 0) {
      this.setActive(false)
      this.setVisible(false)
      if (this.body) {
        this.body.stop()
      }
    }
  }
}

var balas

export default class GameBubbbles extends Phaser.Scene {
  constructor() {
    super('GameBubbles')
  }

  init() {}

  preload() {
    this.load.image('bloque', './assets/bloquesuelo.png')
    this.load.image('fondo', './assets/fondogamebubbles.png')
    this.load.image('burbuja', './assets/burbuja.png')
    this.load.image('jugador', './assets/setaJugadora.png')
    this.load.image('jugadorDeLado', './assets/setaJugadoraDeLado.png')
    this.load.audio('bgm', './assets/audio/Yuuyake_no_Beach.mp3')
    this.load.audio('laserSonido', './assets/audio/8-bit-laser.wav')

    this.load.spritesheet('fuego_balas', './assets/fuego_balas.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    const svgFullscreen = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%232c1d22" stroke-width="3" viewBox="0 0 24 24" width="35" height="35">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8V5a2 2 0 012-2h3" fill="%23ffffff" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 3h3a2 2 0 012 2v3" fill="%23ffffff" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16v3a2 2 0 002 2h3" fill="%23ffffff" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 21h3a2 2 0 002-2v-3" fill="%23ffffff" />
        </svg>
        `
    this.load.image('icono-fs', 'data:image/svg+xml;utf8,' + svgFullscreen)
  }

  create() {
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 })
    this.bgm.play()

    this.fondo = this.add.tileSprite(0, 0, 1280, 720, 'fondo').setOrigin(0, 0)
    this.suelo = this.add.tileSprite(0, 670, 1280, 50, 'bloque').setOrigin(0, 0)
    this.physics.add.existing(this.suelo, true)

    this.jugador = this.physics.add.sprite(100, 600, 'jugador').setScale(0.17)
    this.jugador.setOrigin(0.5, 1)
    this.jugador.setCollideWorldBounds(true)

    this.burbujas = this.physics.add.group()

    balas = this.physics.add.group({
      classType: Bullet,
      maxSize: 20,
      runChildUpdate: true,
    })

    balas.defaults.setAllowGravity = false

    for (let i = 0; i < 20; i++) {
      let unaBala = balas.get()
      if (unaBala) {
        unaBala.setActive(false)
        unaBala.setVisible(false)
      }
    }

    this.time.addEvent({
      delay: 2000,
      callback: this.lanzarBurbuja,
      callbackScope: this,
      loop: true,
    })

    this.physics.add.collider(this.jugador, this.suelo)
    this.physics.add.collider(this.burbujas, this.suelo, this.burbujaChocaSuelo, null, this)
    this.physics.add.overlap(this.jugador, this.burbujas, this.recolectarBurbuja, null, this)

    this.physics.add.overlap(balas, this.burbujas, this.balaChocaBurbuja, null, this)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    })

    this.efectoRespiracion = this.tweens.add({
      targets: this.jugador,
      scaleY: 0.16,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.anims.create({
      key: 'bola_fuego_vuelo',
      frames: this.anims.generateFrameNumbers('fuego_balas', { start: 220, end: 221 }),
      frameRate: 10,
      repeat: -1,
    })
    this.laserSonido = this.sound.add('laserSonido', { volume: 0.2 })

    this.score = 0
    this.palabraActual = ''
    this.gameOver = false

    this.diccionario = [
      'SETA',
      'BURBUJA',
      'SAKURA',
      'PETALO',
      'GAMING',
      'ARCADE',
      'ONIGIRI',
      'ANIME',
    ]
    let indiceAleatorio = Phaser.Math.Between(0, this.diccionario.length - 1)
    this.fraseObjetivo = this.diccionario[indiceAleatorio]
    this.indiceLetraActual = 0

    this.scoreText = this.add.text(16, 16, 'Puntuación: 0', {
      fontSize: '28px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.palabraText = this.add.text(16, 55, 'Objetivo: ' + this.fraseObjetivo, {
      fontSize: '32px',
      fill: '#ffcc00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 6,
    })

    this.palabraFormadaText = this.add.text(16, 100, 'Progreso: ', {
      fontSize: '32px',
      fill: '#0f0',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 6,
    })

    this.emitterPompas = this.add.particles(0, 0, 'burbuja', {
      speed: { min: 60, max: 180 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.12, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 700,
      gravityY: -100,
      emitting: false,
    })

    const fullScreenButton = crearBotónCute(this, 1220, 50, 70, 70, 'icono-fs')
    fullScreenButton.zona.on('pointerup', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen()
      } else {
        this.scale.startFullscreen()
      }
    })

    // ========================================================
    // GESTIÓN DE ENTRADAS FILTRADAS (PC vs MÓVIL)
    // ========================================================
    this.táctilIzq = false
    this.táctilDer = false
    this.táctilSaltar = false

    if (!this.isMobile()) {
      // ESCUCHADOR DE RATÓN/CLIC (SOLO EN PC)
      this.input.on('pointerdown', (pointer) => {
        if (this.gameOver) return
        if (pointer.button === 0) {
          this.dispararProyectil(this.jugador.x, this.jugador.y - 50)
          this.laserSonido.play()
        }
      })
    } else {
      // CONTROLES TÁCTILES PRO (SOLO EN MÓVIL)
      this.input.addPointer(3)
      const colorRosaPro = 0xff8da1

      // 1. Botón Mover Izquierda (Abajo a la izquierda)
      const graphicsIzq = this.add.graphics()
      graphicsIzq.fillStyle(colorRosaPro, 1)
      graphicsIzq.fillRoundedRect(0, 0, 100, 100, 25)
      const textIzq = this.add
        .text(50, 50, '◀', { fontSize: '40px', fill: '#ffffff' })
        .setOrigin(0.5)

      const btnIzq = this.add
        .container(40, 560, [graphicsIzq, textIzq])
        .setSize(100, 100)
        .setInteractive()
        .setAlpha(0.4)

      btnIzq.on('pointerdown', () => {
        this.táctilIzq = true
        btnIzq.setAlpha(0.8)
      })
      btnIzq.on('pointerup', () => {
        this.táctilIzq = false
        btnIzq.setAlpha(0.4)
      })
      btnIzq.on('pointerout', () => {
        this.táctilIzq = false
        btnIzq.setAlpha(0.4)
      })

      // 2. Botón Mover Derecha (Abajo a la derecha, dejando espacio en medio)
      const graphicsDer = this.add.graphics()
      graphicsDer.fillStyle(colorRosaPro, 1)
      graphicsDer.fillRoundedRect(0, 0, 100, 100, 25)
      const textDer = this.add
        .text(50, 50, '▶', { fontSize: '40px', fill: '#ffffff' })
        .setOrigin(0.5)

      const btnDer = this.add
        .container(260, 560, [graphicsDer, textDer])
        .setSize(100, 100)
        .setInteractive()
        .setAlpha(0.4)

      btnDer.on('pointerdown', () => {
        this.táctilDer = true
        btnDer.setAlpha(0.8)
      })
      btnDer.on('pointerup', () => {
        this.táctilDer = false
        btnDer.setAlpha(0.4)
      })
      btnDer.on('pointerout', () => {
        this.táctilDer = false
        btnDer.setAlpha(0.4)
      })

      // 3. Botón Saltar (ENCIMA de los dos, centrado perfectamente a mitad de camino)
      // Centrado en X: (40 + 260) / 2 = 150. Elevado en Y a 440 (120px más arriba)
      const graphicsSaltar = this.add.graphics()
      graphicsSaltar.fillStyle(colorRosaPro, 1)
      graphicsSaltar.fillRoundedRect(0, 0, 100, 100, 25)
      const textSaltar = this.add
        .text(50, 50, '▲', { fontSize: '40px', fill: '#ffffff' })
        .setOrigin(0.5)

      const btnSaltar = this.add
        .container(150, 440, [graphicsSaltar, textSaltar])
        .setSize(100, 100)
        .setInteractive()
        .setAlpha(0.4)

      btnSaltar.on('pointerdown', () => {
        this.táctilSaltar = true
        btnSaltar.setAlpha(0.8)
      })
      btnSaltar.on('pointerup', () => {
        this.táctilSaltar = false
        btnSaltar.setAlpha(0.4)
      })
      btnSaltar.on('pointerout', () => {
        this.táctilSaltar = false
        btnSaltar.setAlpha(0.4)
      })

      // 4. Botón de Disparo (Círculo Rosita con la X en el lado derecho)
      const radioCirculo = 60
      const graphicsDisp = this.add.graphics()
      graphicsDisp.fillStyle(colorRosaPro, 1)
      graphicsDisp.fillCircle(radioCirculo, radioCirculo, radioCirculo)

      const textDisp = this.add
        .text(radioCirculo, radioCirculo, 'X', {
          fontSize: '55px',
          fill: '#ffffff',
          fontFamily: 'Arial',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)

      const btnDisp = this.add
        .container(1100, 540, [graphicsDisp, textDisp])
        .setSize(radioCirculo * 2, radioCirculo * 2)
        .setInteractive()
        .setAlpha(0.4)

      btnDisp.on('pointerdown', () => {
        if (this.gameOver) return
        this.dispararProyectil(this.jugador.x, this.jugador.y - 50)
        this.laserSonido.play()
        btnDisp.setAlpha(0.8)
      })
      btnDisp.on('pointerup', () => {
        btnDisp.setAlpha(0.4)
      })
      btnDisp.on('pointerout', () => {
        btnDisp.setAlpha(0.4)
      })
    }
  }

  update() {
    if (this.wasd.esc.isDown) {
      this.scene.start('Start')
      this.bgm.stop()
    }

    if (this.gameOver) return

    if (Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
      this.dispararProyectil(this.jugador.x, this.jugador.y - 50)
      this.laserSonido.play()
    }

    const quiereSaltar = this.cursors.up.isDown || this.wasd.up.isDown || this.táctilSaltar
    const estaEnElSuelo = this.jugador.body.touching.down

    const limiteIzquierdo = 50
    const limiteDerecho = 1230
    this.jugador.x = Phaser.Math.Clamp(this.jugador.x, limiteIzquierdo, limiteDerecho)

    const anchoOriginal = this.jugador.width
    const altoOriginal = this.jugador.height

    if (this.cursors.left.isDown || this.wasd.left.isDown || this.táctilIzq) {
      this.jugador.setVelocityX(-500)
      this.jugador.setFlipX(true)

      if (this.jugador.texture.key !== 'jugadorDeLado' || this.jugador.scaleY < 0.15) {
        this.jugador.setTexture('jugadorDeLado')
        this.jugador.setScale(0.17)
        this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8)
        this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2)
      }
    } else if (this.cursors.right.isDown || this.wasd.right.isDown || this.táctilDer) {
      this.jugador.setVelocityX(500)
      this.jugador.setFlipX(false)

      if (this.jugador.texture.key !== 'jugadorDeLado' || this.jugador.scaleY < 0.15) {
        this.jugador.setTexture('jugadorDeLado')
        this.jugador.setScale(0.17)
        this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8)
        this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2)
      }
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.jugador.setVelocityX(0)

      if (this.jugador.scaleY > 0.1) {
        this.jugador.setTexture('jugadorDeLado')
        this.jugador.setScale(0.17, 0.09)
        this.jugador.setBodySize(anchoOriginal * 0.6, altoOriginal * 0.5)
        this.jugador.body.setOffset((anchoOriginal * 0.4) / 2, altoOriginal * 0.5)
        if (this.teclaPulsadaUnaVez(this.cursors.down, this.wasd.down)) {
          this.reproducirSonidoAgacharse()
        }
      }
    } else {
      this.jugador.setVelocityX(0)

      if (this.jugador.texture.key !== 'jugador' || this.jugador.scaleY < 0.15) {
        this.jugador.setTexture('jugador')
        this.jugador.setScale(0.17)
        this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8)
        this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2)
      }
    }

    if (quiereSaltar && estaEnElSuelo) {
      this.jugador.setVelocityY(-450)
      this.táctilSaltar = false

      if (this.jugador.texture.key !== 'jugadorDeLado' || this.jugador.scaleY < 0.15) {
        this.jugador.setTexture('jugadorDeLado')
        this.jugador.setScale(0.17)
        this.jugador.setBodySize(anchoOriginal * 0.8, altoOriginal * 0.8)
        this.jugador.body.setOffset((anchoOriginal * 0.2) / 2, altoOriginal * 0.2)
      }

      this.reproducirSonidoSalto()
    }

    this.burbujas.getChildren().forEach((burbuja) => {
      if (burbuja && burbuja.active && burbuja.textoAsociado) {
        burbuja.textoAsociado.x = burbuja.x
        burbuja.textoAsociado.y = burbuja.y

        if (burbuja.y > 720) {
          burbuja.textoAsociado.destroy()
          burbuja.destroy(true)
        }
      }
    })
  }

  dispararProyectil(x, y) {
    let bala = balas.get()
    if (bala) {
      bala.fire(x, y)
    }
  }

  balaChocaBurbuja(bala, burbuja) {
    if (!bala.active || !burbuja.active) return

    bala.setActive(false)
    bala.setVisible(false)
    if (bala.body) bala.body.stop()

    this.reproducirSonidoBurbuja()
    this.procesarAciertoBurbuja(burbuja)
  }

  recolectarBurbuja(jugador, burbuja) {
    if (this.gameOver) return
    if (burbuja.yaRecogida) return
    burbuja.yaRecogida = true
    this.reproducirSonidoBurbuja()

    this.procesarAciertoBurbuja(burbuja)
  }

  procesarAciertoBurbuja(burbuja) {
    if (!burbuja.textoAsociado) return

    let letraTocada = burbuja.textoAsociado.text.trim().toUpperCase()
    let letraCorrecta = this.fraseObjetivo[this.indiceLetraActual].trim().toUpperCase()

    if (letraTocada === letraCorrecta) {
      this.score += 100
      this.palabraActual += letraCorrecta
      this.indiceLetraActual++

      if (this.indiceLetraActual >= this.fraseObjetivo.length) {
        this.score += 500
        let nuevoIndice = Phaser.Math.Between(0, this.diccionario.length - 1)
        this.fraseObjetivo = this.diccionario[nuevoIndice]
        this.indiceLetraActual = 0
        this.palabraActual = ''
      }

      this.scoreText.setText('Puntuación: ' + this.score)
      this.palabraFormadaText.setText('Progreso: ' + this.palabraActual)
      this.palabraText.setText('Objetivo: ' + this.fraseObjetivo)

      if (this.emitterPompas) {
        this.emitterPompas.explode(Phaser.Math.Between(6, 10), burbuja.x, burbuja.y)
      }

      burbuja.textoAsociado.destroy()
      burbuja.destroy()
    } else {
      this.ejecutarGameOver()
    }
  }

  ejecutarGameOver() {
    this.reproducirSonidoPerder()
    this.gameOver = true
    this.physics.pause()
    this.time.removeAllEvents()
    this.bgm.stop()

    this.jugador.setTint(0xff0000)
    if (this.efectoRespiracion) this.efectoRespiracion.stop()

    // 1. Cambia la frase exclusivamente si es móvil
    const mensajeGameOver = this.isMobile() 
      ? '¡PERDISTE!\nPresiona AQUÍ para volver' 
      : '¡PERDISTE!\nPresiona ESC o AQUÍ para volver';

    // 2. Creamos el texto en pantalla
    const textoPerder = this.add
      .text(640, 360, mensajeGameOver, {
        fontSize: '64px',
        fill: '#ff0000',
        fontFamily: 'Arial',
        align: 'center',
        stroke: '#ffffff',
        strokeThickness: 8,
        fontWeight: 'bold',
      })
      .setOrigin(0.5)

    // 3. Añadimos la animación de latido a ambos (queda genial tanto con ratón como en táctil)
    this.tweens.add({
      targets: textoPerder,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // 4. Hacemos que sea interactivo ("clicable" con ratón o "pulsable" con el dedo)
    textoPerder.setInteractive() 

    textoPerder.on('pointerdown', () => {
      this.scene.start('Start')
      this.bgm.stop() 
    })
  }

  lanzarBurbuja() {
    if (this.gameOver) return

    let xAleatoria = Phaser.Math.Between(50, 1230)
    let nuevaBurbuja = this.burbujas.create(xAleatoria, 0, 'burbuja')

    nuevaBurbuja.setScale(0.2)
    let radio = nuevaBurbuja.width * 0.3
    nuevaBurbuja.setCircle(radio)

    nuevaBurbuja.setOffset(
      (nuevaBurbuja.width - radio * 1.9) / 2,
      (nuevaBurbuja.height - radio * 1.9) / 2,
    )

    nuevaBurbuja.body.setAllowGravity(false)
    nuevaBurbuja.setVelocityY(Phaser.Math.Between(80, 150))

    let letraBurbuja = ''
    if (Phaser.Math.Between(1, 100) <= 40) {
      letraBurbuja = this.fraseObjetivo[this.indiceLetraActual]
    } else {
      const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      letraBurbuja = letras[Phaser.Math.Between(0, letras.length - 1)]
    }

    let textoLetra = this.add
      .text(xAleatoria, 0, letraBurbuja, {
        fontSize: '26px',
        fill: '#fff',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)

    nuevaBurbuja.textoAsociado = textoLetra

    this.tweens.add({
      targets: nuevaBurbuja,
      scaleX: 0.23,
      scaleY: 0.17,
      duration: Phaser.Math.Between(600, 900),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  burbujaChocaSuelo(suelo, burbuja) {
    if (!burbuja.active) return

    if (this.emitterPompas) {
      this.emitterPompas.explode(Phaser.Math.Between(6, 10), burbuja.x, burbuja.y)
    }

    if (burbuja.textoAsociado) {
      burbuja.textoAsociado.destroy()
    }
    burbuja.destroy()
  }

  reproducirSonidoBurbuja() {
    const ctx = this.sound.context
    if (!ctx || ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }

  reproducirSonidoPerder() {
    const ctx = this.sound.context
    if (!ctx || ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.5)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  }

  reproducirSonidoSalto() {
    const ctx = this.sound.context
    if (!ctx || ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    const tiempoInicio = ctx.currentTime
    const duracion = 0.35

    osc.frequency.setValueAtTime(300, tiempoInicio)
    osc.frequency.exponentialRampToValueAtTime(950, tiempoInicio + 0.15)
    osc.frequency.exponentialRampToValueAtTime(500, tiempoInicio + duracion)

    gain.gain.setValueAtTime(0.01, tiempoInicio)
    gain.gain.linearRampToValueAtTime(0.3, tiempoInicio + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.01, tiempoInicio + duracion)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(tiempoInicio)
    osc.stop(tiempoInicio + duracion)
  }

  reproducirSonidoAgacharse() {
    const ctx = this.sound.context
    if (!ctx || ctx.state === 'suspended') return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    const tiempoInicio = ctx.currentTime
    const duracion = 0.15

    osc.frequency.setValueAtTime(600, tiempoInicio)
    osc.frequency.exponentialRampToValueAtTime(200, tiempoInicio + duracion)

    gain.gain.setValueAtTime(0.25, tiempoInicio)
    gain.gain.exponentialRampToValueAtTime(0.01, tiempoInicio + duracion)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(tiempoInicio)
    osc.stop(tiempoInicio + duracion)
  }

  teclaPulsadaUnaVez(tecla1, tecla2) {
    return Phaser.Input.Keyboard.JustDown(tecla1) || Phaser.Input.Keyboard.JustDown(tecla2)
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  }
}

// ========================================================
const crearBotónCute = (escena, x, y, ancho, alto, texto, tamañoTexto) => {
  const radio = 18
  const contenedor = escena.add.container(x, y)
  const xRel = -ancho / 2
  const yRel = -alto / 2

  const gráficos = escena.add.graphics()

  gráficos.fillStyle(0x2c1d22, 1)
  gráficos.fillRoundedRect(xRel - 4, yRel - 4, ancho + 8, alto + 8, radio + 4)

  gráficos.fillStyle(0xffffff, 1)
  gráficos.fillRoundedRect(xRel, yRel, ancho, alto, radio)

  gráficos.fillStyle(0xf3b0c3, 1)
  gráficos.fillRoundedRect(xRel + 2, yRel + 3, ancho - 4, alto - 5, radio - 2)

  gráficos.fillStyle(0xffd1dc, 1)
  gráficos.fillRoundedRect(xRel + 2, yRel + 2, ancho - 6, alto - 6, radio - 2)

  let elementoCentral

  if (texto === 'icono-fs') {
    elementoCentral = escena.add.image(0, 0, 'icono-fs')
  } else {
    elementoCentral = escena.add
      .text(0, 0, texto, {
        fontFamily: 'Comic Sans MS, cursive',
        fontSize: tamañoTexto || '24px',
        fill: '#ffffff',
        stroke: '#2c1d22',
        strokeThickness: 6,
        shadow: { offsetX: 3, offsetY: 3, color: '#2c1d22', blur: 0, fill: true },
      })
      .setOrigin(0.5)
  }

  const zona = escena.add.zone(0, 0, ancho, alto).setInteractive({ useHandCursor: true })
  contenedor.add([gráficos, elementoCentral, zona])

  zona.on('pointerover', () => {
    if (texto !== 'icono-fs') {
      elementoCentral.setFill('#ffffa0')
    } else {
      elementoCentral.setScale(1.15)
    }
  })

  zona.on('pointerout', () => {
    if (texto !== 'icono-fs') {
      elementoCentral.setFill('#ffffff')
    } else {
      elementoCentral.setScale(1.0)
    }
  })

  return { contenedor, zona }
}

// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("Game");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    this.load.image("cielo", "./public/assets/Cielo.webp");//cargo imagenes
    this.load.image("diamante", "./public/assets/diamond.png");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("plataforma", "./public/assets/platform.png");
    this.load.image("cuadrado", "./public/assets/Square.png");
    this.load.image("triangulo", "./public/assets/Triangle.png");
  }

  create() {
    // reescalo imagen cielo
    this.add.image(400, 300, "cielo").setScale(2);

    //reescalo plataforma
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "plataforma").setScale(2).refreshBody();

    this.player = this.physics.add.sprite(400, 300, "ninja");
    this.player.setScale(0.1); //reescalo el pj para que sea mas chico
    this.player.setBounce(0.5); //fisicas para que rebote
    this.player.setCollideWorldBounds(true); //que el pj no salga de la pantalla
    this.physics.add.collider(this.player, this.platforms); //colision pj y plataformas

    this.cursors = this.input.keyboard.createCursorKeys(); //teclas de movimiento

    this.figRecolectadas = [];//array que guarda forrmas recolectadas

    this.puntos = 0;//puntos del jugador
    this.puntosTexto = this.add.text(16, 16, "Puntos: 0", {
      fontSize: "20px",
      fill: "#fff",
    });

    this.timeLeft = 30;//timer
    this.timerText = this.add.text(650, 16, "Tiempo: 0", {
      fontSize: "20px",
      fill: "#fff",
    });

    this.time.addEvent({ //evento que se ejecuta cada 1,5 seg
      delay: 1500,
      callback: () => {
        const tipos = ["triangulo", "cuadrado", "diamante"]; //figuras a recolectar
        const tipo = Phaser.Utils.Array.GetRandom(tipos); //aleatorio para elegir que figura cae
        const x = Phaser.Math.Between(50, 750); //posicion aleatoria en x
        const figura = this.physics.add.image(x, 0, tipo).setScale(0.5); //crea la figura en posicion aleatoria y0
        figura.tipo = tipo; //guarda la figura en variante tipo
        figura.setVelocityY(Phaser.Math.Between(80, 150)); //vel de caida aleatoria
        figura.setBounce(0.5); //rebote de la figura
        figura.setCollideWorldBounds(true); //limites para que las figuras no salgan de la pantalla
        this.physics.add.collider(figura, this.platforms); //colision figura y plataforma

        this.physics.add.overlap(this.player, figura, () => { //colision pj y figura
          figura.destroy(); //cuando el pj toca la figura desaparece

          this.figRecolectadas.push(tipo); //se gurada la figura en el array

          let puntosGanados = 0;//guarda los puntos segun la figura
          if (tipo === "triangulo") {
            puntosGanados = 10;
          } else if (tipo === "cuadrado") {
            puntosGanados = 15;
          } else if (tipo === "diamante") {
            puntosGanados = 25;
          }

          this.puntos += puntosGanados; //suma los puntos y los muestra en pantalla
          this.puntosTexto.setText("Puntos: " + this.puntos);

          const cuadrados = this.figRecolectadas.filter(f => f === "cuadrado").length;//cuenta las formas recolectadas
          const triangulos = this.figRecolectadas.filter(f => f === "triangulo").length;
          const diamantes = this.figRecolectadas.filter(f => f === "diamante").length;

          if (cuadrados >= 2 && triangulos >= 2 && diamantes >= 2) { //al tener 2 de cada forma se gana
            this.player.setTint(0x00ff00); //pinto al pj de verde
            this.add.text(300, 300, "VICTORIA", {
              fontSize: "40px",
              fill: "#0f0"
            });
            this.scene.pause(); //pausa la escena
          }
        });
      },
      loop: true, //transforma el evento en un bucle
    });

    this.time.addEvent({ //timer mejora 1
      delay: 1000, //retraso de 1 seg
      callback: () => {
        this.timeLeft--; //le saca 1 seg al timer
        this.timerText.setText("Tiempo: " + this.timeLeft); //imprime tiempo

        if (this.timeLeft <= 0) { // verifica tiempo
          this.player.setTint(0xff0000); //pj rojo si pierde
          this.add.text(300, 300, "PERDISTE", { //muestra mensaje
            fontSize: "40px",
            fill: "#f00"
          });
          this.scene.pause(); //pausa la escena
        }
      },
      loop: true, //vuelve el evento un bucle
    });
  }

  update() {
    if (this.cursors.left.isDown) { //movimienta a la izquierda
      this.player.setVelocityX(-300);
      this.player.angle -= 5; //gira el personaje segun el movimiento
    }

    else if (this.cursors.right.isDown) {//movimiento a la derecha
      this.player.setVelocityX(300);
      this.player.angle += 5;
    }
    
    else {
      this.player.setVelocityX(0); //si el pj no se mueve detiene el movimiento
    
      if (this.player.body.touching.down) {//deja el pj en posicion normal
          this.player.angle = 0;
      }
    }
  
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330); //salta si el pj toca el suelo
    }
  }
}
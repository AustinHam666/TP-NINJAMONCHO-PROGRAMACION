export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  init(data) {
    this.ganaste = data.ganaste;
    this.puntos = data.puntos;
    console.log("Datos recibidos en GameOver:", data);
  }

  preload() {
    this.load.image("cielo", "./public/assets/FondoMenu.jpg");
    this.load.on('complete', () => {
      console.log("Imagen 'cielo' cargada");
    });
    this.load.on('loaderror', (file) => {
      console.error("Error al cargar archivo:", file.key);
    });
  }

  create() {
    console.log("Escena GameOver creada");

    // Fondo de color simple para depuración
    this.cameras.main.setBackgroundColor("#000000");

    // Fondo de imagen
    this.add.image(400, 300, "cielo").setScale(2);

    // Mostrar mensaje de victoria o derrota
    const mensaje = this.ganaste ? "VICTORIA" : "DERROTA";
    const color = this.ganaste ? "#0f0" : "#f00";

    this.add.text(300, 200, mensaje, {
      fontSize: "48px",
      fill: color,
    });

    // Mostrar puntuación final
    this.add.text(280, 270, "Puntuación final: " + this.puntos, {
      fontSize: "32px",
      fill: "#fff",
    });

    // Mostrar instrucción para reiniciar
    this.add.text(220, 350, "Presiona ENTER para volver a jugar", {
      fontSize: "24px",
      fill: "#fff",
    });

    // Reiniciar el juego
    this.input.keyboard.once("keydown-ENTER", () => {
      console.log("Reiniciando juego...");
      this.scene.start("Game"); 
    });
  }
}
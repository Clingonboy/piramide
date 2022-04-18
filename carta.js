class Carta {
  constructor(seme, valore, img) {
    this.seme = seme;
    this.valore = valore;
    this.img = img;
    this.img = document.getElementById(
      "" + this.valore + this.seme
    );
    this.x = 0;
    this.y = 0;
    this.w = 50;
    this.h = 100;
    this.isOpen = true
  }

  drawCart(ctx) {
    if (this.isOpen) {
      ctx.drawImage(
        this.img,
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
    } else {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
      ctx.stroke();
    }
  }
  
}
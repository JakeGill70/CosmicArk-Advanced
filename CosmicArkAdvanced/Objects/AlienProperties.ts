module CosmicArkAdvanced {
    export class AlienProperties {
        speed: number;
        canMove: boolean;
        initialY: number;

        constructor(spd:number=60) {
            this.speed = spd;
            this.canMove = true;
        }
    }
}
import Phaser from "phaser";
import MapScene from "./MapScene.js";

export default class GameEvent{
    /**
     * @param {MapScene} scene - The scene that this update belongs to 
     */
    scene;
    player;
    physics;
    map;
    terrain_layer;
    cursors;
    debug_text;
    jump = 0;
    double_jump = 0;

    constructor (scene){
        this.scene = scene;
        this.player = scene.player;
        this.map = scene.map;
        this.terrain_layer = scene.terrain_layer;
        this.cursors = scene.cursors;
        this.debug_text = scene.debug_text;
        this.physics = scene.physics;
    }
    /**
     * Update the game event
     * @param {Number} time - The current timestamp as generated by the requestAnimationFrame
     * @param {Number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update(time, delta){
        this.physics.collide(this.player, this.terrain_layer);
        if (this.cursors.left.isDown){
            if (!this.cursors.up.isDown && !this.double_jump) this.player.anims.play('run', true);
            this.player.flipX = true;
            this.player.body.setVelocityX(-100);
        }
        else if (this.cursors.right.isDown){
            if (!this.cursors.up.isDown && !this.double_jump) this.player.anims.play('run', true);
            this.player.flipX = false;
            this.player.body.setVelocityX(100);
        }
        else{
            if (!this.double_jump) this.player.anims.play('idle', true);
            this.player.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down){
            this.jump = 1;
            this.double_jump = 0;
            this.player.anims.play('jump');
            this.player.body.setVelocityY(-300);
        }
        else if (this.player.body.blocked.down){
            this.jump = 0;
            this.double_jump = 0;
        }

        this.cursors.up.on('down', () => {
            if (!this.player.body.blocked.down && !this.double_jump && this.jump){
                this.double_jump = 1;
                this.player.anims.play('doubleJump');
                this.player.body.setVelocityY(-300);
            }
        }, this);

        if (this.jump && this.player.body.velocity.y < 0){
            this.terrain_layer.setCollisionByProperty({collision_type: 1}, false);
        }
        else{
            if (this.player.body.velocity.y > 0){
                this.player.anims.play('fall');
            }
            this.terrain_layer.setCollisionByProperty({collision_type: 1});
        }
        this.BackgroundAnimation();
        this.debug_text.setText(this.jump + " " + this.double_jump + this.player.body.blocked.right.toString());
    }

    BackgroundAnimation(){
        if (this.scene.background != {}){
            const dir = this.scene.background.anim.direction;
            this.scene.background.image.tilePositionX += this.scene.background.anim.speed * this.scene.dx[dir];
            this.scene.background.image.tilePositionY += this.scene.background.anim.speed * this.scene.dy[dir];
        }
    }
}
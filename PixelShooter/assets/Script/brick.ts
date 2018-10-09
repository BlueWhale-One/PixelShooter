import Game from "./game";

const { ccclass, property } = cc._decorator;
const State = cc.Enum({
    move: 1,
    touch: 2,
    pause: 3,
    end: 4
})
@ccclass
export default class Brick extends cc.Component {
    protected rigidbody = null;
    protected canvas: cc.Node = null;
    public contact: boolean = false;
    public type: number = 0;
    public end: boolean = false;
    public state = State.move;
    protected produce: boolean = true;
    public life: number = 0;
    protected dis: number = 0;

    protected onLoad() {
        this.rigidbody = this.getComponent(cc.RigidBody);
        cc.director.getPhysicsManager().enabled = true;
        this.rigidbody.enabledContactListener = true;
        this.canvas = cc.find("Canvas");
    }
    protected onBeginContact(contact, self, other) {
        if (other.node.group == 'bullet') {
            switch (this.type) {
                case 4: {
                    this.canvas.getComponent(Game).addHeart();
                }
                    break;
                case 3: {
                    this.canvas.getComponent(Game).blockBoom();
                }
                    break;
                case 5: {
                    this.canvas.getComponent(Game).freezeBlock(this.node.position);
                }
                    break;
                case 6: {
                    this.canvas.getComponent(Game).flashBlock(this.node.position);
                }
                    break;
                case 7: {
                    this.canvas.getComponent(Game).boomBlock(this.node.position);
                }
                    break;
                case 8: {
                    this.canvas.getComponent(Game).powerUp();
                }
                    break;
                case 9: {
                    this.canvas.getComponent(Game).reduceBrickLife(this.node);
                }
                    break;
                default:
                    break;
            }
        }
        if (other.node.group == 'pixel') {
            switch (this.type) {
                case 9: {
                    this.canvas.getComponent(Game).reduceBrickLife(this.node);
                }
            }
        }
        if (this.life == 0) {
            this.canvas.getComponent(Game).Combo++;
            this.canvas.getComponent(Game).Count += 4;
            this.state = State.touch;
            this.canvas.getComponent(Game).reduceBrick(self.node.position, this.type, this.node, this.life);
        }
    }
    protected update(dt) {
        if (this.type == 10) {
            this.dis += this.node.getComponent(cc.RigidBody).linearVelocity.x * dt;
            if (Math.abs(this.dis) >= 300) {
                let speed = this.node.getComponent(cc.RigidBody).linearVelocity;
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed.x * -1, speed.y);
                this.dis = 0;
            }

        }
    }
}

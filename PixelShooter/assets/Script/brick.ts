import LevelGame from "./levelgame";
import EndlessGame from './endlessgame';

const { ccclass, property } = cc._decorator;
const State = cc.Enum({
    move: 1,
    touch: 2,
    pause: 3,
    end: 4
})
const BrickType = cc.Enum({
    N1: 0,
    N2: 1,
    N3: 2,
    N4: 3,
    A1: 4,
    A2: 5,
    A3: 6,
    A4: 7,
    B1: 8,
    B2: 9,
    B3: 10,
    B4: 11
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
    protected   Script:string=null;

    protected onLoad() {
        this.rigidbody = this.getComponent(cc.RigidBody);
        cc.director.getPhysicsManager().enabled = true;
        this.rigidbody.enabledContactListener = true;
        this.canvas = cc.find("Canvas");
        if(this.node.parent.name=='endless'){
           this.Script='endlessgame';
        }else{
           this.Script='levelgame';
        }
    }
    protected onBeginContact(contact, self, other) {
        

        if (other.node.group == 'bullet') {
            switch (this.type) {
                case BrickType.N4: {
                    this.canvas.getComponent(this.Script).addHeart();
                }
                    break;
                case BrickType.N3: {
                    this.canvas.getComponent(this.Script).blockBoom();
                }
                    break;
                case BrickType.A1: {
                    this.canvas.getComponent(this.Script).freezeBlock(this.node.position);
                    this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, false, this.node, this.life);
                }
                    break;
                case BrickType.A2: {
                    this.canvas.getComponent(this.Script).flashBlock(this.node.position);
                    this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, false, this.node, this.life);
                }
                    break;
                case BrickType.A3: {
                    this.canvas.getComponent(this.Script).boomBlock(this.node.position);
                    this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, false, this.node, this.life);
                }
                    break;
                case BrickType.A4: {
                    this.canvas.getComponent(this.Script).powerUp();
                }
                    break;
                case BrickType.B1: {
                    this.canvas.getComponent(this.Script).reduceBrickLife(this.node);
                }
                    break;
                default:
                    break;
            }
        }
        if (other.node.group == 'pixel') {
            switch (this.type) {
                case BrickType.A1: {
                    this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, true, this.node, this.life);
                }
                    break;
                case BrickType.A2: {
                    this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, true, this.node, this.life);
                }
                    break;
                case BrickType.A3: {
                    this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, true, this.node, this.life);
                }
                    break;
                case BrickType.B1: {
                    this.canvas.getComponent(this.Script).reduceBrickLife(this.node);
                }
                    break;

                default:
                    break;
            }
        }
        if (this.life == 0) {
            this.canvas.getComponent(this.Script).Combo++;
            this.canvas.getComponent(this.Script).Count += 4;
            this.state = State.touch;
            if (this.type == BrickType.A1 || this.type == BrickType.A2 || this.type == BrickType.A3) {

            } else {
                this.canvas.getComponent(this.Script).reduceBrick(self.node.position, this.type, true, this.node, this.life);
            }

        }
    }
    protected update(dt) {
            if (this.type == BrickType.B2) {
                this.dis += this.canvas.getComponent(this.Script).BrickData[BrickType.B2].speedx * dt;
                if (Math.abs(this.dis) >= this.canvas.getComponent(this.Script).BrickData[BrickType.B2].distance) {
                    let speed = this.node.getComponent(cc.RigidBody).linearVelocity;
                    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed.x * -1, speed.y);
                    this.dis = 0;
                }
            }
        }
    
}

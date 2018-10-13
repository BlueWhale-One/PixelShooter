import LevelGame from "./levelgame";
import EndlessGame from './endlessgame';
import Data from "./data";

const { ccclass, property } = cc._decorator;
const State = cc.Enum({
    move: 1,
    touch: 2,
    pause: 3,
    end: 4
})
enum BrickType {
    N1 = 0,
    N2 = 1,
    N3 = 2,
    N4 = 3,
    A1 = 4,
    A2 = 5,
    A3 = 6,
    A4 = 7,
    B1 = 8,
    B2 = 9,
    B3 = 10,
    B4 = 11
}
enum BrickState {
    move = 1,
    touch,
    pause,
    end
}
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
    protected Script: any = null;
    protected instance: Data = null;

    protected onLoad() {
        this.instance = cc.find('Data').getComponent(Data);
        this.rigidbody = this.getComponent(cc.RigidBody);
        cc.director.getPhysicsManager().enabled = true;
        this.rigidbody.enabledContactListener = true;
        this.canvas = cc.find("Canvas");
        if (this.node.parent.name == 'endless') {
            this.Script = this.canvas.getComponent('endlessgame');
        } else {
            this.Script = this.canvas.getComponent('levelgame');
        }
    }

    protected reduceBrick(boom: boolean, node: cc.Node) {
        let self = this;
        let type = node.getComponent(Brick).type;
        let life = node.getComponent(Brick).life;
        if (life == 0) {
            if (!boom) {
                this.Script.scheduleOnce(function () {
                    node.getComponent(Brick).state = BrickState.end;
                    this.Script.Count -= 4;
                }.bind(this), this.Script.BrickData[type].scaleTime);
            } else {
                let dir = [cc.v2(1, 1), cc.v2(-1, 1), cc.v2(-1, -1), cc.v2(1, -1)];
                let dis: number = this.Script.DataConfig["block"].position;
                let speed: number = this.Script.DataConfig["block"].speed;
                for (let i = 0; i < 4; i++) {
                    let fadetime = 0;
                    let dirx = dir[i].x;
                    let diry = dir[i].y;
                    let pos = node.position;
                    let block = cc.instantiate(self.instance.Block);
                    block.scale = this.Script.BrickData[type].scale;
                    block.parent = this.Script.BackGround;
                    if (type == BrickType.B3) {
                        block.x = pos.x + dirx * dis * 0.5;
                        block.y = pos.y + diry * dis * 0.5;
                    } else {
                        block.x = pos.x + dirx * dis;
                        block.y = pos.y + diry * dis;
                    }
                    let fun1 = cc.callFunc(function () {
                        switch (type) {
                            case BrickType.N1: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                            }
                                break;
                            case BrickType.N2: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed * 2, diry * speed * 2);
                                block.color = cc.Color.RED;
                                block.getComponent(cc.RigidBody).gravityScale = 0;
                            }
                                break;
                            case BrickType.N3: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed * 2, diry * speed * 2);
                                block.color = new cc.Color(246, 23, 255);
                            }
                                break;
                            case BrickType.N4: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(30, 187, 30);
                            }
                                break;
                            case BrickType.A1: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(56, 176, 233);
                            }
                                break;
                            case BrickType.A2: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(241, 241, 132);
                            }
                                break;
                            case BrickType.A3: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(51, 51, 48);
                            }
                                break;
                            case BrickType.A4: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(111, 29, 255);
                            }
                                break;
                            case BrickType.B1: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(82, 108, 126);
                            }
                                break;
                            case BrickType.B2: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(7, 65, 7);
                            }
                                break;
                            case BrickType.B3: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(240, 151, 39);
                            }
                                break;
                            case BrickType.B4: {
                                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(dirx * speed, diry * speed);
                                block.color = new cc.Color(124, 247, 237);
                            }
                                break;
                            default:
                                break;
                        }
                    }.bind(this))
                    let fun2 = cc.callFunc(function () {
                        block.destroy();
                    }.bind(this))
                    block.runAction(cc.sequence(fun1, cc.fadeOut(this.Script.DataConfig["block"].fadeTime), fun2));
                }
                this.Script.scheduleOnce(function () {
                    node.getComponent(Brick).state = BrickState.end;
                    this.Script.Count -= 4;
                }.bind(this), this.Script.DataConfig["block"].fadeTime);
            }
        }

    }

    protected reduceBrickLife() {
        this.life--;
    }
    protected powerUp() {
        this.Script._powerUp = true;
        let powerLabel = cc.find(`power`, this.Script.BackGround);
        powerLabel.active = true;
        powerLabel.runAction(cc.sequence(cc.blink(0.5, 5), cc.callFunc(function () {
            powerLabel.active = false;
        })))
    }

    public addHeart() {
        if (this.Script.HeartCount < 5) {
            // let heart = cc.instantiate(this.Heart);
            // heart.setPosition((this.HeartCount + 1) * 60, this.BackGround.height - 50)
            // heart.parent = this.BackGround;
            // this.HeartList.push(heart);
            this.Script.HeartCount++;
            this.Script.HearLabel.string = "<outline color=#42350F width=2>" + this.Script.HeartCount + "</outline>";
        }
    }

    protected allBrickBoom() {
        let count = this.Script.BrickList.length;
        this.Script.Count += count * 4;
        this.Script.Combo += count;
        for (let i = 0; i < count; i++) {
            if (this.Script.BrickList[i].getComponent("brick").state == BrickState.move) {
                this.Script.BrickList[i].getComponent("brick").state = BrickState.touch;
                this.Script.BrickList[i].getComponent("brick").life = 0;
                this.reduceBrick(true, this.Script.BrickList[i]);
            }
        }
    }

    public circleBlock() {
        let self = this;
        let circle = cc.instantiate(self.instance.CirclePrefab);
        let data = this.Script.BrickData[this.type];
        circle.parent = this.Script.BackGround;
        circle.setPosition(this.node.position);
        circle.setContentSize(cc.size(data.startSize, data.startSize));
        circle.opacity = 120;
        circle.zIndex = -1;
        switch (this.type) {
            case BrickType.A1:
                circle.color = new cc.Color(56, 176, 233);
                break;
            case BrickType.A2:
                circle.color = new cc.Color(241, 241, 132);
                break;
            case BrickType.A3:
                circle.color = new cc.Color(51, 51, 48);
                break;
            default:
                break;
        }
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.Script.BrickList.length; i++) {
                let dis = Math.abs(this.Script.BrickList[i].position.sub(this.node.position).mag());
                if (dis <= data.range) {
                    switch (this.type) {
                        case BrickType.A1:
                            this.Script.BrickList[i].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                            break;
                        case BrickType.A2:
                            let speed = this.Script.BrickList[i].getComponent(cc.RigidBody).linearVelocity;
                            this.Script.BrickList[i].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, speed.y - data.speedUp);
                            break;
                        case BrickType.A3:
                            // console.log(this.state);
                            if (this.Script.BrickList[i].getComponent(Brick).state == BrickState.move) {
                                this.Script.Count += 4;
                                this.Script.Combo++;
                                this.Script.BrickList[i].getComponent(Brick).state = BrickState.touch;
                                this.life = 0;
                                this.reduceBrick(true, this.Script.BrickList[i]);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(data.scaleTime, data.range * 2 / data.startSize), fun1, cc.delayTime(data.delayTime), cc.fadeOut(data.fadeTime), fun2));
    }


    protected onBeginContact(contact, self, other) {
        if (other.node.group == 'bullet') {
            switch (this.type) {
                case BrickType.N4: {
                    this.addHeart();
                }
                    break;
                case BrickType.N3: {
                    this.allBrickBoom();
                }
                    break;
                case BrickType.A1: {
                    this.reduceBrick(false, this.node);
                    /*  this.state = BrickState.end;
                     this.Script.scheduleOnce(function () {
                         this.Script.Count -= 4;
                     }.bind(this), this.Script.BrickData[this.type].scaleTime); */
                    this.circleBlock();
                }
                    break;
                case BrickType.A2: {
                    this.reduceBrick(false, this.node);
                    /* this.state = BrickState.end;
                    this.Script.scheduleOnce(function () {
                        this.Script.Count -= 4;
                    }.bind(this), this.Script.BrickData[this.type].scaleTime); */
                    this.circleBlock();
                }
                    break;
                case BrickType.A3: {
                    this.reduceBrick(false, this.node);
                    /* this.state = BrickState.end;
                    this.Script.scheduleOnce(function () {
                        this.Script.Count -= 4;
                    }.bind(this), this.Script.BrickData[this.type].scaleTime); */
                    this.circleBlock();
                }
                    break;
                case BrickType.A4: {
                    this.powerUp();
                }
                    break;
                case BrickType.B1: {
                    this.reduceBrickLife();
                }
                    break;
                default:
                    break;
            }
        }
        if (other.node.group == 'pixel') {
            switch (this.type) {
                case BrickType.A1: {
                    this.reduceBrick(true, this.node);
                }
                    break;
                case BrickType.A2: {
                    this.reduceBrick(true, this.node);
                }
                    break;
                case BrickType.A3: {
                    this.reduceBrick(true, this.node);
                }
                    break;
                case BrickType.B1: {
                    this.reduceBrickLife();
                }
                    break;

                default:
                    break;
            }
        }
        if (this.life == 0) {
            this.Script.Combo++;
            this.Script.Count += 4;
            this.state = State.touch;
            if (this.type == BrickType.A1 || this.type == BrickType.A2 || this.type == BrickType.A3) {

            } else {
                this.reduceBrick(true, this.node);
            }

        }
    }
    protected update(dt) {
        if (this.type == BrickType.B2) {
            this.dis += this.Script.BrickData[BrickType.B2].speedx * dt;
            if (Math.abs(this.dis) >= this.Script.BrickData[BrickType.B2].distance) {
                let speed = this.node.getComponent(cc.RigidBody).linearVelocity;
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed.x * -1, speed.y);
                this.dis = 0;
            }
        }
       

    }

}

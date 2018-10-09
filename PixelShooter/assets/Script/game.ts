import Menu from "./mainmenu";
import Data from "./data";
import Bullet from "./bullet";
import Brick from "./brick";

const { ccclass, property } = cc._decorator;
const BrickType = cc.Enum({
    N1: 1,
    N2: 2,
    N3: 3,
    N4: 4,
    A1: 5,
    A2: 6,
    A3: 7,
    A4: 8,
    B1: 9,
    B2: 10,
    B3: 11,
    B4: 12
})
const BrickState = cc.Enum({
    move: 1,
    touch: 2,
    pause: 3,
    end: 4
})


@ccclass
export default class Game extends cc.Component {
    @property(cc.Prefab)
    private CirclePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    private Bullet: cc.Prefab = null;
    @property(cc.Prefab)
    private Block: cc.Prefab = null;
    @property([cc.SpriteFrame])
    protected star: cc.SpriteFrame[] = [];
    @property(cc.Prefab)
    protected LevelButton: cc.Prefab = null;
    /**
	 * 预制体数组
	 * @param index 数字下标
	 */
    @property([cc.Prefab])
    protected brickPrefabList: cc.Prefab[] = [];

    protected ProcessBar: number = null;
    protected GamePause: cc.Node = null;
    protected Shoot: cc.Node = null;
    protected BackGround: cc.Node = null;
    protected Tank: cc.Node = null;
    protected GameOver: cc.Node = null;
    protected Circle: cc.Node = null;
    protected Scroll: cc.Node = null;
    protected Untouch: cc.Node = null;
    protected Floor: cc.Node = null;
    protected GameWin: cc.Node = null;
    protected LevelData: cc.Node = null;
    protected Timer: number = 0;
    protected BrickList: cc.Node[] = [];
    protected HeartList: cc.Node[] = [];
    protected HeartCount: number = 0;
    protected BrickCount: number = 0;
    protected LevelLabel: cc.RichText = null;
    protected Score: number = 0;
    protected MaxCombo: number = 0;
    public Combo: number = 0;
    public Count: number = 0;
    protected CurrentScore: number = 0;
    protected ConfigData: any = null;
    protected Level: number = 0;
    protected BrickNumber: number = 0;
    protected Rule: cc.Node = null;
    protected Mask: cc.Node = null;
    protected BrickParent: cc.Node = null;
    protected TopUI: cc.Node = null;
    protected HearLabel: cc.RichText = null;
    protected LevelView: cc.Node = null;

    protected isLoading: boolean = false;
    protected speedconfig: number = 50;
    protected currentBrick: number = 0;
    protected distance: number = 0;
    /**
	 * 总砖块数
	 */
    protected totalBrickCount: number = 0;
    public _powerUp: boolean = false;

    protected onLoad() {
        this.Combo = 0;
        this.MaxCombo = 0;
        this.Count = 0;
        this.Timer = 0;
        this.HeartCount = 5;
        this.Score = 0;
        this.totalBrickCount = 0;
        this.Level = cc.sys.localStorage.getItem("level");
        cc.director.getPhysicsManager().enabled = true;
        this.BackGround = cc.find(`background`, this.node);
        this.Tank = cc.find(`background/tank`, this.node);
        this.Untouch = cc.find(`background/untouch`, this.node);
        this.GameOver = cc.find(`gameover`, this.node);
        this.GameWin = cc.find(`gamewin`, this.node);
        this.GamePause = cc.find(`gamepause`, this.node);
        this.Scroll = cc.find(`background/scroll`, this.node);
        this.Mask = cc.find(`topui/progress/mask`, this.node);
        this.Rule = cc.find(`rule`, this.node);
        this.Floor = cc.find(`background/floor`, this.node);
        this.TopUI = cc.find(`topui`, this.node);
        this.Circle = cc.find(`circle`, this.Scroll);
        this.LevelLabel = cc.find(`topui/levelui/levelnumber/level`, this.node).getComponent(cc.RichText);
        this.HearLabel = cc.find(`topui/heart/count`, this.node).getComponent(cc.RichText);
        this.Shoot = cc.find(`background/shoot`, this.node);
        this.LevelData = cc.find("Data");
        this.ProcessBar = cc.find(`topui/progress`, this.node).getComponent(cc.ProgressBar).totalLength;
        cc.director.resume();
        this.Scroll.on(cc.Node.EventType.TOUCH_START, this.initTank, this);
        this.Scroll.on(cc.Node.EventType.TOUCH_MOVE, this.moveTank, this);
        this.Shoot.on(cc.Node.EventType.TOUCH_START, this.shootBullet, this);
        this.BrickParent = cc.find(`background/brick`, this.node)
        this.GameOver.active = false;
        this.GameWin.active = false;
        this.GamePause.active = false;
        this.Rule.active = false;
        this.initHeart();
        // this.setBrick();
        this.getData();
        this.Mask.width = 0;
        // this.ProcessBar.progress = 0;  
        this.LevelLabel.string = "<outline color=#264390 width=2>" + "Level " + (++this.Level) + "</outline>";
        this.Level--;
    }
    protected start() {

    }
    protected onEnable() {
        // this.setBrick();
    }

    protected initTank(event: any) {
        this.Tank.x = event.touch.getLocation().x;
        if (this.Tank.x <= this.Tank.width / 2) {
            this.Tank.x = this.Tank.width / 2;
        }
        if (this.Tank.x >= this.BackGround.width - this.Tank.width / 2) {
            this.Tank.x = this.BackGround.width - this.Tank.width / 2;
        }
        this.Circle.x = this.Tank.x;
    }
    protected moveTank(event: any) {
        this.Tank.x += event.touch.getDelta().x;
        if (this.Tank.x <= this.Tank.width / 2) {
            this.Tank.x = this.Tank.width / 2;
        }
        if (this.Tank.x >= this.BackGround.width - this.Tank.width / 2) {
            this.Tank.x = this.BackGround.width - this.Tank.width / 2;
        }
        this.Circle.x = this.Tank.x;

    }
    protected initHeart() {
        /*  for (let i = 0; i < this.HeartCount; i++) {
             let heart = cc.instantiate(this.Heart);
             heart.setPosition((i + 1) * 60, this.BackGround.height - 50)
             heart.parent = this.BackGround;
             this.HeartList.push(heart);
         } */
        this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";
    }
    public addHeart() {
        if (this.HeartCount < 5) {
            // let heart = cc.instantiate(this.Heart);
            // heart.setPosition((this.HeartCount + 1) * 60, this.BackGround.height - 50)
            // heart.parent = this.BackGround;
            // this.HeartList.push(heart);
            this.HeartCount++;
            this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";
        }
    }

    protected reduceHeart() {
        this.HeartCount--;
        // this.HeartList[this.HeartCount].destroy();
        // this.HeartList.splice(this.HeartCount, 1);
        this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";
        if (this.HeartCount == 0) {
            if (this.Score < this.ConfigData[this.Level].score[0]) {
                this.gameOver();
            }
        }
    }
    /**
    * 生成新砖块
    */
    protected setBrick() {
        // cc.log(this.ConfigData);       

        for (let j = 0; j < this.ConfigData[this.Level].brick.length; j++) {
            let time: number = 1;
            if (j == BrickType.N2 - 1) {
                time = 5
            }
            if (j == BrickType.N3 - 1) {
                time = 15
            }
            if (j == BrickType.N4 - 1) {
                time = 25
            }
            if (j == BrickType.A1 - 1) {
                time = 35
            }
            if (j == BrickType.A2 - 1) {
                time = 45
            }
            if (j == BrickType.A3 - 1) {
                time = 55
            }
            if (j == BrickType.A4 - 1) {
                time = 65
            }
            if (j == BrickType.B1 - 1) {
                time = 10
            }
            if (j == BrickType.B2 - 1) {
                time = 85
            }
            if (j == BrickType.B3 - 1) {
                time = 5
            }
            if (j == BrickType.B4 - 1) {
                time = 105
            }

            for (let i = 0; i < this.ConfigData[this.Level].brick[j]; i++) {
                this.scheduleOnce(function () {
                    let brick = cc.instantiate(this.brickPrefabList[j]);
                    brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed));
                    brick.setPosition(Math.random() * (this.BackGround.width - brick.width * 1.5) + brick.width * 1.5/2, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
                    if (j == BrickType.B2 - 1) {
                        if (brick.position.x <= (300 + brick.width * 1.5)) {
                            brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(80, -(this.speedconfig * this.ConfigData[this.Level].speed));
                        } else if (brick.position.x >= this.BackGround.width - (300 + brick.width * 1.5)) {
                            brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(-80, -(this.speedconfig * this.ConfigData[this.Level].speed));
                        } else {
                            let arr = [-1, 1];
                            let a = arr[Math.round(Math.random())];
                            brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(80 * a, -(this.speedconfig * this.ConfigData[this.Level].speed));
                        }
                    } else if (j == BrickType.B3 - 1) {
                        brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed * 1.5));
                    } else {
                        brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed));
                    }
                    brick.parent = this.BackGround;
                    if (j == BrickType.B1 - 1) {
                        brick.getComponent(Brick).life = 3;
                    }
                    if (j == BrickType.B4 - 1) {
                        brick.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.01), cc.delayTime(1), cc.fadeIn(0.01), cc.delayTime(1))))
                    }
                    this.BrickList.push(brick);
                    this.BrickCount++;
                    this.BrickNumber++;
                    brick.getComponent("brick").type = j + 1;
                }.bind(this), (i + 1) * time)
            }
        }
        /* 
          for (let i = 0; i < this.ConfigData[this.Level].brick[0]; i++) {
              this.scheduleOnce(function () {
                  let brick = cc.instantiate(this.brickPrefabList[0]);
                  brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed));
                  brick.setPosition(Math.random() * (this.BackGround.width - 80) + 40, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
                  brick.parent = this.BackGround;
                  this.BrickList.push(brick);
                  brick.getComponent("brick").type = BrickType.N1;
                  this.BrickCount++;
                  this.BrickNumber++;
              }.bind(this), i)
          }
          for (let i = 0; i < this.ConfigData[this.Level].brick[1]; i++) {
              this.scheduleOnce(function () {
                  let brick: cc.Node = cc.instantiate(this.brickPrefabList[1]);
                  brick.setPosition(Math.random() * (this.BackGround.width - 80) + 40, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
                  brick.parent = this.BackGround;
                  brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed));
                  this.BrickList.push(brick);
                  brick.getComponent("brick").type = BrickType.N2;
                  this.BrickCount++;
                  this.BrickNumber++;
              }.bind(this), (i + 1) * (5 * Math.random() + 10));
          }
          for (let i = 0; i < this.ConfigData[this.Level].brick[2]; i++) {
              this.scheduleOnce(function () {
                  let brick = cc.instantiate(this.brickPrefabList[2]);
                  brick.setPosition(Math.random() * (this.BackGround.width - 80) + 40, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
                  brick.parent = this.BackGround;
                  this.BrickList.push(brick);
                  brick.getComponent("brick").type = BrickType.N3;
                  brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed*2));
                  this.BrickCount++;
                  this.BrickNumber++;
              }.bind(this), (i + 1) * (5 * Math.random() + 20))
          }
          for (let i = 0; i < this.ConfigData[this.Level].brick[3]; i++) {
              this.scheduleOnce(function () {
                  let brick = cc.instantiate(this.brickPrefabList[3]);
                  brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed*2));
                  brick.setPosition(Math.random() * (this.BackGround.width - 80) + 40, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
                  brick.parent = this.BackGround;
                  brick.getComponent("brick").type = BrickType.N4;
                  this.BrickList.push(brick);
                  this.BrickCount++;
                  this.BrickNumber++;
              }.bind(this), (i + 1) * (5 * Math.random() + 30))
          }
          for (let i = 0; i < this.ConfigData[this.Level].brick[4]; i++) {
              this.scheduleOnce(function () {
                  let brick = cc.instantiate(this.brickPrefabList[4]);
                  brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speedconfig * this.ConfigData[this.Level].speed)*2);
                  brick.setPosition(Math.random() * (this.BackGround.width - 80) + 40, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
                  brick.parent = this.BackGround;
                  this.BrickList.push(brick);
                  brick.getComponent("brick").type = BrickType.N5;
                  this.BrickCount++;
                  this.BrickNumber++;
              }.bind(this), (i + 1) * (5 * Math.random()))
          }         */
    }
    protected getData() {
        cc.loader.loadRes("./config", function (err, result) {
            if (err) {
                cc.log(err);
                return;
            } else {
                cc.log(result.json);
            }
            this.ConfigData = result.json;
            for (let i = 0; i < this.ConfigData[this.Level].brick.length; i++) {
                this.totalBrickCount += this.ConfigData[this.Level].brick[i];
            }
            this.setBrick();
        }.bind(this));
    }

    /**
     * 产生小方块
     *  
     */
    public reduceBrick(pos: cc.Vec2, type: number, node?: cc.Node, life?: number) {
        if (life == 0) {
            if (type == BrickType.A1 || type == BrickType.A2 || type == BrickType.A3) {
                this.scheduleOnce(function () {
                    if (node) {
                        node.getComponent("brick").state = BrickState.end;
                    }
                }.bind(this), 0.5);
            } else {
                let dir = [cc.v2(1, 1), cc.v2(-1, 1), cc.v2(-1, -1), cc.v2(1, -1)];
                let dis: number = 40;
                let speed: number = 200;
                for (let i = 0; i < 4; i++) {
                    let fadetime = 0;
                    let dirx = dir[i].x;
                    let diry = dir[i].y;
                    let block = cc.instantiate(this.Block);
                    block.parent = this.BackGround;
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
                                block.setContentSize(block.getContentSize().width * 0.5, block.getContentSize().height * 0.5);
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
                    })
                    let fun2 = cc.callFunc(function () {
                        block.destroy();
                        this.Count--;
                    }.bind(this))
                    block.runAction(cc.sequence(fun1, cc.fadeOut(1), fun2));

                }
                this.scheduleOnce(function () {
                    if (node) {
                        node.getComponent("brick").state = BrickState.end;
                    }
                }.bind(this), 1);
            }
        }
    }

    /**全消除
    */
    public blockBoom() {
        let count = this.BrickList.length;
        this.Count += count * 4;
        this.Combo += count;
        for (let i = 0; i < count; i++) {
            this.BrickList[i].getComponent("brick").state = BrickState.touch;
            this.reduceBrick(this.BrickList[i].position, this.BrickList[i].getComponent('brick').type, this.BrickList[i], this.BrickList[i].getComponent('brick').life);
        }
    }
    /**冻结
     */
    public freezeBlock(pos: cc.Vec2) {
        let circle = cc.instantiate(this.CirclePrefab);
        circle.parent = this.BackGround;
        circle.setContentSize(cc.size(10, 10));
        circle.setPosition(pos);
        circle.zIndex = -1;
        circle.opacity = 120;
        circle.color = cc.color(56, 176, 233);
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.BrickList.length; i++) {
                let dis = Math.abs(this.BrickList[i].position.sub(pos).mag());
                if (dis <= 200) {
                    this.BrickList[i].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(0.5, 40), fun1, cc.delayTime(0.3), cc.fadeOut(0.2), fun2));
    }
    /**加速
     */
    public flashBlock(pos: cc.Vec2) {
        let circle = cc.instantiate(this.CirclePrefab);
        circle.parent = this.BackGround;
        circle.setContentSize(cc.size(10, 10));
        circle.setPosition(pos);
        circle.zIndex = -1;
        circle.opacity = 120;
        circle.color = cc.color(241, 241, 132);
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.BrickList.length; i++) {
                let dis = Math.abs(this.BrickList[i].position.sub(pos).mag());
                if (dis <= 200) {
                    let speed = this.BrickList[i].getComponent(cc.RigidBody).linearVelocity;
                    this.BrickList[i].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, speed.y - 50);
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(0.5, 40), fun1, cc.delayTime(0.3), cc.fadeOut(0.2), fun2));
    }
    /**爆炸
     */
    public boomBlock(pos: cc.Vec2) {
        let circle = cc.instantiate(this.CirclePrefab);
        circle.parent = this.BackGround;
        circle.setContentSize(cc.size(10, 10));
        circle.setPosition(pos);
        circle.zIndex = -1;
        circle.opacity = 120;
        circle.color = cc.color(51, 51, 48);
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.BrickList.length; i++) {
                let dis = Math.abs(this.BrickList[i].position.sub(pos).mag());
                if (dis <= 200) {
                    this.BrickList[i].getComponent("brick").state = BrickState.touch;
                    this.reduceBrick(this.BrickList[i].position, this.BrickList[i].getComponent('brick').type, this.BrickList[i], this.BrickList[i].getComponent('brick').life);
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(0.5, 40), fun1, cc.delayTime(0.3), cc.fadeOut(0.2), fun2));
    }
    /**加强子弹
     */
    public powerUp() {
        this._powerUp = true;
        let powerLabel = cc.find(`background/power`, this.node)
        powerLabel.active = true;
        powerLabel.runAction(cc.sequence(cc.blink(0.5, 5), cc.callFunc(function () {
            powerLabel.active = false;
        })))
    }

    public reduceBrickLife(node: cc.Node) {
        node.getComponent(Brick).life--;
        // cc.log(node.getComponent(Brick).life)
        /* if (node.getComponent(Brick).life == 0) {
            node.getComponent("brick").state = BrickState.touch;
            // this.reduceBrick(node.position, node.getComponent('brick').type, node);
        } */
        // cc.log(node.getComponent(Brick).life)
    }

    protected shootBullet() {
        this.Untouch.active = true;
        this.scheduleOnce(function () {
            this.Untouch.active = false;
        }.bind(this), 1)
        let bullet = cc.instantiate(this.Bullet);
        bullet.x = this.Tank.x;
        bullet.y = this.Tank.y + this.Tank.height;
        bullet.parent = this.BackGround;
        bullet.getComponent(Bullet).power = this._powerUp;
        if (this._powerUp) {
            this._powerUp = false;
            bullet.width = bullet.width * 2;
            bullet.height = bullet.height * 2;
        }

    }
    protected gameRule() {
        this.Rule.active = true;
        cc.director.pause();
    }
    protected gameAgain() {
        cc.director.loadScene("game");
    }
    protected gameWin() {
        this.BackGround.active = false;
        this.TopUI.active = false;
        for (let i = 0; i < 3; i++) {
            // let star = cc.instantiate(this.Star);
            // star.parent = cc.find(`content/star`, this.GameWin);
            // star.setPosition(-220 + 220 * i, 49);
            if (this.Score > this.ConfigData[this.Level].score[i]) {
                // star.color = cc.color(255, 214, 0);
                let str = `content/star/star_` + (i + 1);
                cc.find(str, this.GameWin).getComponent(cc.Sprite).spriteFrame = this.star[1];
                let starScore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].star;
                if (i == 1) {
                    cc.find(str, this.GameWin).rotation = -26;
                }
                if (starScore < i) {
                    this.LevelData.getComponent("data").Data[this.Level].star = i;
                    this.LevelData.getComponent("data").setData();
                }
            }
            let highScore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
            if (highScore < this.Score) {
                this.LevelData.getComponent("data").Data[this.Level].score = this.Score;
                this.LevelData.getComponent("data").setData();
            }
            let str = `content/star/score_` + (i + 1);
            cc.find(str, this.GameWin).getComponent(cc.Label).string = this.ConfigData[this.Level].score[i];

        }
        if (this.Level == 5) {
            cc.find(`conten/nextbutton`, this.GameWin).active = false;
        }
        let highscore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
        cc.find(`content/highscore`, this.GameWin).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + highscore + "</outline>";
        cc.find(`content/score`, this.GameWin).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + this.Score + "</outline>";
        this.GameWin.active = true;
    }
    protected gameOver() {
        this.BackGround.active = false;
        this.TopUI.active = false;
        this.GameOver.active = true;
        for (let i = 0; i < 3; i++) {
            let highScore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
            if (highScore < this.Score) {
                this.LevelData.getComponent("data").Data[this.Level].score = this.Score;
                this.LevelData.getComponent("data").setData();
            }
            let str = `content/star/score_` + (i + 1);
            cc.find(str, this.GameOver).getComponent(cc.Label).string = this.ConfigData[this.Level].score[i];
        }
        let highscore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
        cc.find(`content/highscore`, this.GameOver).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + highscore + "</outline>";
        cc.find(`content/score`, this.GameOver).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + this.Score + "</outline>";

    }
    protected backToMenu() {
        this.BackGround.active = false;
        this.TopUI.active = false;
        this.Rule.active = false;
        this.GamePause.active = false;
        this.GameWin.active = false;
        this.GameOver.active = false;
        this.LevelData.getComponent(Data).returnLevel();
        /* if (!this.isLoading) {
            this.isLoading = true;
            cc.director.loadScene("mainmenu");
        } */

    }
    protected nextLevel() {
        cc.sys.localStorage.setItem('level', ++this.Level);
        cc.director.loadScene("game");
    }
    protected gamePause() {
        cc.director.pause();
        this.GamePause.active = true;
    }
    protected gameResume() {
        this.GamePause.active = false;
        this.Rule.active = false;
        cc.director.resume();

    }

    protected update(dt) {
        this.Timer += dt;
        let score = 0;
        score = 5 * this.Combo * (this.Combo + 1);
        this.Score = this.CurrentScore + score;
        if (this.Count == 0) {
            this.CurrentScore = this.Score;
            this.Combo = 0;
        }
        for (let i = 0; i < this.BrickList.length; i++) {

            if (this.BrickList[i].y < this.Floor.y + this.BrickList[i].height * 1.414) {
                this.BrickList[i].destroy();
                this.BrickList.splice(i, 1);
                this.reduceHeart();
                if (this.BrickNumber == this.totalBrickCount) {
                    if (this.BrickList.length == 0) {
                        this.gameWin();
                    }
                }
            } else {
                if (this.BrickList[i].getComponent("brick").state == BrickState.touch && this.BrickList[i].getComponent("brick").life == 0) {
                    this.BrickList[i].removeFromParent();
                } if (this.BrickList[i].getComponent("brick").state == BrickState.end) {
                    this.BrickList.splice(i, 1);
                    if (this.BrickNumber == this.totalBrickCount) {
                        if (this.BrickList.length == 0) {
                            this.gameWin();
                        }
                    }
                }
            }
        }
        if (this.ConfigData) {
            if (this.Mask.width < this.ProcessBar) {
                this.Mask.width = (this.Score / this.ConfigData[this.Level].score[0]) * 0.4 * this.ProcessBar;
                if (this.Mask.width >= (0.4 * this.ProcessBar)) {
                    cc.find(`topui/progress/star_1`, this.node).getComponent(cc.Sprite).spriteFrame = this.star[0];
                    this.Mask.width = (((this.Score - this.ConfigData[this.Level].score[0]) / (this.ConfigData[this.Level].score[1] - this.ConfigData[this.Level].score[0])) * 0.3 + 0.4) * this.ProcessBar;
                    if (this.Mask.width >= (0.7 * this.ProcessBar)) {
                        cc.find(`topui/progress/star_2`, this.node).getComponent(cc.Sprite).spriteFrame = this.star[0];
                        this.Mask.width = (((this.Score - this.ConfigData[this.Level].score[1]) / (this.ConfigData[this.Level].score[2] - this.ConfigData[this.Level].score[1])) * 0.3 + 0.7) * this.ProcessBar;
                        if (this.Mask.width >= this.ProcessBar) {
                            cc.find(`topui/progress/star_3`, this.node).getComponent(cc.Sprite).spriteFrame = this.star[0];
                            this.Mask.width = this.ProcessBar;
                        }
                    }

                }
            }
        }
    }

}

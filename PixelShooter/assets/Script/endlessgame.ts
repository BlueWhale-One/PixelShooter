const { ccclass, property } = cc._decorator;
import Menu from "./mainmenu";
import Data from "./data";
import Bullet from "./bullet";
import Brick from "./brick";
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
export default class EndlessGame extends cc.Component {

    protected TopUI: cc.Node = null;
    protected BackGround: cc.Node = null;
    protected Tank: cc.Node = null;
    protected Circle: cc.Node = null;
    protected Scroll: cc.Node = null;
    protected Floor: cc.Node = null;
    protected Shoot: cc.Node = null;
    protected Untouch: cc.Node = null;
    protected Rule: cc.Node = null;
    protected GamePause: cc.Node = null;
    protected GameOver: cc.Node = null;


    protected BrickList: cc.Node[] = [];
    protected HeartList: cc.Node[] = [];


    protected randomList = [];
    protected BrickNameData = [];

    protected LevelData: any = null;
    protected endlessData: any = null;
    protected BrickData: any = null;
    public DataConfig: any = null;

    protected HearLabel: cc.RichText = null;
    protected ScoreLabel: cc.RichText = null;

    protected HeartCount: number = 5;
    protected BrickCount: number = 0;
    protected levelTimer: number = 0;
    protected MaxCombo: number = 0;
    protected CurrentScore: number = 0;
    protected BrickNumber: number = 0;
    protected distance: number = 0;
    protected currentBrick: number = 0;
    protected Score: number = 0;
    protected interval: number = 0;
    protected intervalTimer: number = 0;
    protected speed: number = 0;
    protected totalBrickCount: number = 0;

    public Combo: number = 0;
    public Count: number = 0;

    public _powerUp: boolean = false;

    protected instance: Data = null;




    protected onLoad() {
        this.instance = cc.find('Data').getComponent(Data);
        cc.director.getPhysicsManager().enabled = true;
        this.TopUI = cc.find('topui', this.node);
        this.BackGround = cc.find('endless', this.node);
        this.Tank = cc.find(`tank`, this.BackGround);
        this.Scroll = cc.find(`scroll`, this.BackGround);
        this.Circle = cc.find(`circle`, this.Scroll);
        this.Shoot = cc.find(`shoot`, this.BackGround);
        this.Floor = cc.find(`floor`, this.BackGround);
        this.Rule = cc.find('rule', this.node);
        this.Untouch = cc.find(`untouch`, this.BackGround);
        this.GamePause = cc.find(`gamepause`, this.node);
        this.GameOver = cc.find(`gameover`, this.node);
        this.HearLabel = cc.find(`topui/heart/count`, this.node).getComponent(cc.RichText);
        this.ScoreLabel = cc.find(`topui/levelui/score/label`, this.node).getComponent(cc.RichText);       
        this.LevelData = cc.find("Data").getComponent(Data);  
        this.GameOver.active = false;
        this.GamePause.active = false;
        this.Rule.active = false;

        this.Scroll.on(cc.Node.EventType.TOUCH_START, this.initTank, this);
        this.Scroll.on(cc.Node.EventType.TOUCH_MOVE, this.moveTank, this);
        this.Shoot.on(cc.Node.EventType.TOUCH_START, this.shootBullet, this);

        cc.director.resume();
        this.setData();
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
        this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";
    }
    public addHeart() {
        if (this.HeartCount < 5) {
            this.HeartCount++;
            this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";
        }
    }

    protected reduceHeart() {
        this.HeartCount--;
        this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";
        if (this.HeartCount == 0) {
            this.gameOver();

        }
    }

    /**全消除
    */
    public blockBoom() {
        let count = this.BrickList.length;
        this.Count += count * 4;
        this.Combo += count;
        for (let i = 0; i < count; i++) {
            if (this.BrickList[i].getComponent("brick").state == BrickState.move) {
                this.BrickList[i].getComponent("brick").state = BrickState.touch;
                this.BrickList[i].getComponent("brick").life = 0;
                this.reduceBrick(this.BrickList[i].position, this.BrickList[i].getComponent('brick').type, true, this.BrickList[i], this.BrickList[i].getComponent('brick').life);
            }
        }
    }
    /**冻结
     */
    public freezeBlock(pos: cc.Vec2) {
        let self = this;
        let circle = cc.instantiate(self.instance.CirclePrefab);
        let data = this.BrickData[BrickType.A1];
        circle.parent = this.BackGround;
        circle.setContentSize(cc.size(data.startSize, data.startSize));
        circle.setPosition(pos);
        circle.zIndex = -1;
        circle.opacity = 120;
        circle.color = cc.color(56, 176, 233);
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.BrickList.length; i++) {
                let dis = Math.abs(this.BrickList[i].position.sub(pos).mag());
                if (dis <= data.range) {
                    this.BrickList[i].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(data.scaleTime, data.range * 2 / data.startSize), fun1, cc.delayTime(data.delayTime), cc.fadeOut(data.fadeTime), fun2));
    }
    /**加速
     */
    public flashBlock(pos: cc.Vec2) {
        let self = this;
        let circle = cc.instantiate(self.instance.CirclePrefab);
        let data = this.BrickData[BrickType.A2];
        circle.parent = this.BackGround;
        circle.setContentSize(cc.size(data.startSize, data.startSize));
        circle.setPosition(pos);
        circle.zIndex = -1;
        circle.opacity = 120;
        circle.color = cc.color(241, 241, 132);
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.BrickList.length; i++) {
                let dis = Math.abs(this.BrickList[i].position.sub(pos).mag());
                if (dis <= data.range) {
                    let speed = this.BrickList[i].getComponent(cc.RigidBody).linearVelocity;
                    this.BrickList[i].getComponent(cc.RigidBody).linearVelocity = cc.v2(0, speed.y - data.speedUp);
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(data.scaleTime, data.range * 2 / data.startSize), fun1, cc.delayTime(data.delayTime), cc.fadeOut(data.fadeTime), fun2));
    }
    /**爆炸
     */
    public boomBlock(pos: cc.Vec2) {
        let self = this;
        let circle = cc.instantiate(self.instance.CirclePrefab);
        let data = this.BrickData[BrickType.A3];
        circle.parent = this.BackGround;
        circle.setContentSize(cc.size(data.startSize, data.startSize));
        circle.setPosition(pos);
        circle.zIndex = -1;
        circle.opacity = 120;
        circle.color = cc.color(51, 51, 48);
        let fun1 = cc.callFunc(function () {
            for (let i = 0; i < this.BrickList.length; i++) {
                let dis = Math.abs(this.BrickList[i].position.sub(pos).mag());
                if (dis <= data.range) {
                    if (this.BrickList[i].getComponent("brick").state == BrickState.move) {
                        this.Count += 4;
                        this.Combo++;
                        this.BrickList[i].getComponent("brick").state = BrickState.touch;
                        this.BrickList[i].getComponent("brick").life = 0;
                        this.reduceBrick(this.BrickList[i].position, this.BrickList[i].getComponent('brick').type, true, this.BrickList[i], this.BrickList[i].getComponent('brick').life);
                    }
                }
            }
        }, this)
        let fun2 = cc.callFunc(function () {
            circle.removeFromParent();
        }, this)
        circle.runAction(cc.sequence(cc.scaleTo(data.scaleTime, data.range * 2 / data.startSize), fun1, cc.delayTime(data.delayTime), cc.fadeOut(data.fadeTime), fun2));
    }

    public reduceBrickLife(node: cc.Node) {
        node.getComponent(Brick).life--;
    }

    public powerUp() {
        this._powerUp = true;
        let powerLabel = cc.find(`power`, this.BackGround);
        powerLabel.active = true;
        powerLabel.runAction(cc.sequence(cc.blink(0.5, 5), cc.callFunc(function () {
            powerLabel.active = false;
        })))
    }

    protected shootBullet() {
        let self = this;
        this.Untouch.active = true;
        this.scheduleOnce(function () {
            this.Untouch.active = false;
        }.bind(this), this.DataConfig['tank'].duration);
        let bullet = cc.instantiate(self.instance.Bullet);
        bullet.x = this.Tank.x;
        bullet.y = this.Tank.y + this.Tank.height;
        bullet.parent = this.BackGround;
        bullet.getComponent(Bullet).power = this._powerUp;
        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.DataConfig["tank"].speed);
        if (this._powerUp) {
            this._powerUp = false;
            bullet.scale = this.BrickData[BrickType.A4].bulletScale;
        }

    }

    protected setData() {
        let self = this;
        cc.loader.loadRes('./brick', function (err, result) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(result.json);
                this.BrickData = result.json;
                let arr = Object.keys(result.json).length;
                for (let i = 0; i < arr; i++) {
                    this.BrickNameData[i] = result.json[i].type;
                }
                cc.loader.loadRes("./config", function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result.json);
                        this.DataConfig = result.json;
                        cc.loader.loadRes('./endless', function (err, result) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                console.log(result.json);
                                this.endlessData = result.json;
                                this.interval = this.endlessData.interval;
                                this.speed = this.endlessData.speed;
                                this.setRandom();
                            }
                        }.bind(this))
                    }
                }.bind(this));
            }
        }.bind(this))
    }

    protected setRandom() {
        let count: number = 0;
        for (let i = 0; i < this.BrickNameData.length; i++) {
            if (this.endlessData.brick[this.BrickNameData[i]].chance != 0) {
                for (let j = count; j < (this.endlessData.brick[this.BrickNameData[i]].chance + count); j++) {
                    this.randomList[j] = i;
                }
            }
            count = this.randomList.length;
        }
        console.log(this.randomList);
    }

    protected setBrick() {
        let self = this;
        let random = Math.floor(Math.random() * 100);
        let j = this.randomList[random];
        let data = this.BrickData[j];
        let brick = cc.instantiate(self.instance.brickPrefabList[j]);
        brick.parent = this.BackGround;
        brick.scale = data.scale;
        brick.setPosition(Math.random() * (this.BackGround.width - brick.width * 1.5 * brick.scale) + brick.width * 1.5 * brick.scale / 2, this.BackGround.height - this.TopUI.height + brick.width * 1.5);
        this.BrickList.push(brick);
        this.BrickCount++;
        this.BrickNumber++;
        brick.getComponent("brick").type = j;
        if (j == BrickType.B2) {
            if (brick.position.x <= (data.distance + brick.width * 1.5 * brick.scale)) {
                brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(data.speedx, -(this.speed));
            } else if (brick.position.x >= this.BackGround.width - (data.distance + brick.width * 1.5 * brick.scale)) {
                brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(-data.speedx, -(this.speed));
            } else {
                let arr = [-1, 1];
                let a = arr[Math.round(Math.random())];
                brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(data.speedx * a, -(this.speed));
            }
        } else if (j == BrickType.B3) {
            brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speed * data.speedUp));
        } else {
            brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.speed));
        }

        if (j == BrickType.B1) {
            brick.getComponent(Brick).life = data.life;
        }
        if (j == BrickType.B4) {
            brick.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.01), cc.delayTime(data.blinkhide), cc.fadeIn(0.01), cc.delayTime(data.blinkshow))));
        }
    }

    protected reduceBrick(pos: cc.Vec2, type: number, boom?: boolean, node?: cc.Node, life?: number) {
        let self = this;
        if (life == 0) {
            if (!boom) {
                this.scheduleOnce(function () {
                    if (node) {
                        node.getComponent("brick").state = BrickState.end;
                    }
                    this.Count -= 4;
                }.bind(this), this.BrickData[type].fadeTime + this.BrickData[type].delayTime + this.BrickData[type].scaleTime);
            } else {
                let dir = [cc.v2(1, 1), cc.v2(-1, 1), cc.v2(-1, -1), cc.v2(1, -1)];
                let dis: number = this.DataConfig["block"].position;
                let speed: number = this.DataConfig["block"].speed;
                for (let i = 0; i < 4; i++) {
                    let fadetime = 0;
                    let dirx = dir[i].x;
                    let diry = dir[i].y;
                    let block = cc.instantiate(self.instance.Block);
                    block.scale = this.BrickData[type].scale;
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
                    })
                    let fun2 = cc.callFunc(function () {
                        block.destroy();
                    }.bind(this))
                    block.runAction(cc.sequence(fun1, cc.fadeOut(this.DataConfig["block"].fadeTime), fun2));
                }
                this.scheduleOnce(function () {
                    if (node) {
                        node.getComponent("brick").state = BrickState.end;
                    }
                    this.Count -= 4;
                }.bind(this), this.DataConfig["block"].fadeTime);

            }
        }

    }

    protected gameRule() {
        this.Rule.active = true;
        cc.director.pause();
    }
    protected gameAgain() {
        cc.director.loadScene("endlessgame");
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
    protected backToMenu() {  
        cc.director.loadScene("mainmenu");
    }

    protected gameOver() {
        cc.director.pause();
        this.GameOver.active = true;
        for (let i = 0; i < this.BrickList.length; i++) {
            this.BackGround.removeChild(this.BrickList[i]);
        }
        cc.find('content/score', this.GameOver).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + this.Score + " </outline>";
        // console.log(cc.sys.localStorage.getItem("endless").score);

        if (cc.sys.localStorage.getItem("endless") == undefined) {
            cc.sys.localStorage.setItem("endless", this.Score);
        } else {
            let highscore = cc.sys.localStorage.getItem('endless');
            if (this.Score > highscore) {
                cc.sys.localStorage.setItem("endless", this.Score);
            }
        }
        let highscore = cc.sys.localStorage.getItem("endless");
        cc.find('content/highscore', this.GameOver).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + highscore + " </outline>";

        // cc.find('')
    }



    protected update(dt) {
        let self = this;
        // console.log(this.Count);
        this.levelTimer += dt;
        this.intervalTimer += dt;

        let score = 0;
        score = 5 * this.Combo * (this.Combo + 1);
        this.Score = this.CurrentScore + score;
        if (this.Count == 0) {
            this.CurrentScore = this.Score;
            this.Combo = 0;
        }
        this.ScoreLabel.string = "<outline color=#264390 width=2>" + this.Score + "</outline>";

        if (this.interval != 0) {
            if (this.intervalTimer >= this.interval) {
                this.intervalTimer = 0;
                this.setBrick();
            }
            if (this.levelTimer > this.endlessData.leveltime) {
                this.levelTimer = 0;
                if (this.interval >= this.endlessData.mininterval) {
                    this.interval -= this.endlessData.intervalreduce;
                } else {
                    this.interval = this.endlessData.mininterval;
                }
                if (this.speed >= this.endlessData.maxspeed) {
                    this.speed += this.endlessData.speedadd;
                } else {
                    this.speed = this.endlessData.maxspeed;
                }
            }
        }
        for (let i = 0; i < this.BrickList.length; i++) {
            if (this.BrickList[i].y < (this.Floor.y + this.BrickList[i].height * this.BrickList[i].scale * 1.414)) {
                this.BrickList[i].destroy();
                this.BrickList.splice(i, 1);
                this.reduceHeart();
            } else {
                if (this.BrickList[i].getComponent("brick").state == BrickState.touch && this.BrickList[i].getComponent("brick").life == 0) {
                    this.BrickList[i].removeFromParent();
                } if (this.BrickList[i].getComponent("brick").state == BrickState.end) {
                    this.BrickList.splice(i, 1);
                }
            }
        }

    }
}

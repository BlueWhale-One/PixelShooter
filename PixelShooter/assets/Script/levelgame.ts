import Menu from "./mainmenu";
import Data from "./data";
import Bullet from "./bullet";
import Brick from "./brick";

const { ccclass, property } = cc._decorator;
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
export default class LevelGame extends cc.Component {   

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
    protected LevelData: any = null;
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
    protected currentBrick: number = 0;
    protected distance: number = 0;

    // 
    public DataConfig: any = null;
    public BrickData: any = null;

    protected BrickNameData = [];
    /**
	 * 总砖块数
	 */
    protected totalBrickCount: number = 0;
    public _powerUp: boolean = false;

    protected randomList = [];
    protected numList = [];
    protected endlessData: any = null;
    protected instance:Data=null;

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
        this.LevelData = cc.find("Data").getComponent(Data);        
        this.instance=this.LevelData.instance;
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
        this.BackGround.active = true;
        this.initHeart();
        this.Mask.width = 0;
        // this.setBrick();        
        this.getData();
        this.LevelLabel.string = "<outline color=#264390 width=2>" + "Level " + (++this.Level) + "</outline>";
        this.Level--;


        // this.ProcessBar.progress = 0;  

    }
    protected start() {

    }
    protected onEnable() {

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

    protected randomBrick() {
        let random = Math.floor(Math.random() * this.totalBrickCount);
        if (this.numList.length < this.totalBrickCount) {
            for (let i = 0; i <= this.numList.length; i++) {
                if (random == this.numList[i]) {
                    break;
                } else {
                    if (i == this.numList.length) {
                        this.numList.push(random);
                        break;
                    }
                }
            }
            this.randomBrick();
        }

    }
    /**
    * 生成新砖块
    */
    protected setBrick() {
        let self=this;
        let length = Object.keys(this.ConfigData[this.Level].brick).length;
        let count: number = 0;
        for (let i = 0; i < length; i++) {
            if (this.ConfigData[this.Level].brick[this.BrickNameData[i]] != 0) {
                for (let j = count; j < (this.ConfigData[this.Level].brick[this.BrickNameData[i]] + count); j++) {
                    this.randomList[j] = i;
                }
            }
            count = this.randomList.length;
        }
        // cc.log(this.randomList);
        this.randomBrick();
        // cc.log(this.numList);

        for (let i = 0; i < this.totalBrickCount; i++) {
            let j = this.randomList[this.numList[i]];
            let data = this.BrickData[j];
            // cc.log(index);
            this.scheduleOnce(function () {
                let brick = cc.instantiate(self.instance.brickPrefabList[j]);
                brick.parent = this.BackGround;
                brick.scale = data.scale;
                brick.setPosition(Math.random() * (this.BackGround.width - brick.width * 1.5 * brick.scale) + brick.width * 1.5 * brick.scale / 2, this.BackGround.height - this.TopUI.height + brick.width * 1.5 * brick.scale / 2);
                if (j == BrickType.B2) {
                    if (brick.position.x <= (data.distance + brick.width * 1.5 * brick.scale)) {
                        brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(data.speedx, -(this.ConfigData[this.Level].speed * data.speed));
                    } else if (brick.position.x >= this.BackGround.width - (data.distance + brick.width * 1.5 * brick.scale)) {
                        brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(-data.speedx, -(this.ConfigData[this.Level].speed * data.speed));
                    } else {
                        let arr = [-1, 1];
                        let a = arr[Math.round(Math.random())];
                        brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(data.speedx * a, -(this.ConfigData[this.Level].speed * data.speed));
                    }
                } else if (j == BrickType.B3) {
                    brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.ConfigData[this.Level].speed * data.speedUp * data.speed));
                } else {
                    brick.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -(this.ConfigData[this.Level].speed * data.speed));
                }

                if (j == BrickType.B1) {
                    brick.getComponent(Brick).life = data.life;
                }
                if (j == BrickType.B4) {
                    brick.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.01), cc.delayTime(data.blinkhide), cc.fadeIn(0.01), cc.delayTime(data.blinkshow))));
                }
                this.BrickList.push(brick);
                this.BrickCount++;
                this.BrickNumber++;
                brick.getComponent("brick").type = j;
            }.bind(this), this.ConfigData[this.Level].interval * (i + 1));
        }
    }

    protected getData() {
        cc.loader.loadRes("./level", function (err, result) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(result.json);
                this.ConfigData = result.json;

                cc.loader.loadRes("./brick", function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result.json);
                        this.BrickData = result.json;
                        let arr = Object.keys(this.BrickData).length;
                        for (let i = 0; i < arr; i++) {
                            this.BrickNameData[i] = this.BrickData[i].type;
                            // cc.log(this.BrickNameData);
                        }
                        let length = Object.keys(this.ConfigData[this.Level].brick).length;
                        for (let j = 0; j < length; j++) {
                            this.totalBrickCount += this.ConfigData[this.Level].brick[this.BrickNameData[j]];
                        }

                        cc.loader.loadRes("./config", function (err, result) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                console.log(result.json);
                                this.DataConfig = result.json;
                                this.setBrick();
                            }
                        }.bind(this));

                    }
                }.bind(this));
            }

        }.bind(this));

    }
    protected shootBullet() {
        let self=this;
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
    
    public reduceHeart() {
        this.HeartCount--;
        // console.log(this.HeartCount);
        // this.HeartList[this.HeartCount].destroy();
        // this.HeartList.splice(this.HeartCount, 1);
        this.HearLabel.string = "<outline color=#42350F width=2>" + this.HeartCount + "</outline>";        
        if (this.HeartCount == 0) {
            if (this.Score < this.ConfigData[this.Level].score[0]) {
                this.gameOver();
            } else {
                this.gameWin();
            }
        }
    }
    protected gameRule() {
        this.Rule.active = true;
        cc.director.pause();
    }
    protected gameAgain() {
        cc.director.loadScene("levelgame");
    }
    public gameWin() {
        let self=this;
        this.BackGround.active = false;
        this.TopUI.active = false;

        if (CC_WECHATGAME) {
            cc.find('gamewin2', this.node).active = true;
            this.setRankScore("win");
            cc.find('content/rank', this.GameWin).getComponent(cc.WXSubContextView).enabled = false;
        } else {

            this.GameWin.active = true;
            for (let i = 0; i < 3; i++) {
                // let star = cc.instantiate(this.Star);
                // star.parent = cc.find(`content/star`, this.GameWin);
                // star.setPosition(-220 + 220 * i, 49);
                if (this.Score > this.ConfigData[this.Level].score[i]) {
                    // star.color = cc.color(255, 214, 0);
                    let str = `content/star/star_` + (i + 1);
                    cc.find(str, this.GameWin).getComponent(cc.Sprite).spriteFrame = self.instance.star[1];
                    let starScore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].star;
                    if (i == 1) {
                        cc.find(str, this.GameWin).rotation = -26;
                    }
                    if (starScore < i) {
                        this.LevelData.Data[this.Level].star = i;
                        this.LevelData.setData();
                    }
                }
                let highScore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
                if (highScore < this.Score) {
                    this.LevelData.Data[this.Level].score = this.Score;
                    this.LevelData.setData();
                }
                let str = `content/star/score_` + (i + 1);
                cc.find(str, this.GameWin).getComponent(cc.Label).string = this.ConfigData[this.Level].score[i];
                let highscore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
                cc.find(`content/highscore`, this.GameWin).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + highscore + "</outline>";
                cc.find(`content/score`, this.GameWin).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + this.Score + "</outline>";
            }
        }
        /* if (this.Level == 21) {
            cc.find(`conten/nextbutton`, this.GameWin).active = false;
        } */


        // this.setRankScore("win");
        // cc.find('content/rank', this.GameWin).getComponent(cc.WXSubContextView).enabled = false;
        // this.setRank();

    }
    protected tex;

    protected setRank() {
        this.tex = new cc.Texture2D();
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 800;
        sharedCanvas.height = 500;

        // let canvas = wx.creatCanvas();
        // let context = canvas.getContext('2d');
        // // sharedCanvas.width = 800;
        // // sharedCanvas.height = 500;
        // context.drawImage(sharedCanvas, 0, 0);

        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.GameOver.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex);
        console.log(this.tex);


    }
    protected hideRank() {
        this.GameOver.active = false;
        /* 
                   if(CC_WECHATGAME){
                    wx.getOpenDataContext().postMessage({
                        message: "show"                
                    });
                   } */
    }

    protected setRankScore(type: string) {
        let self = this;
        let scoreList = [self.ConfigData[self.Level].score[0], self.ConfigData[self.Level].score[1], self.ConfigData[self.Level].score[2]]
        if (CC_WECHATGAME) {
            wx.getOpenDataContext().postMessage({
                message: type,
                level: {
                    index: self.Level,
                    scoreList: scoreList,
                    score: self.Score
                }
            });

            /*  wx.setUserCloudStorage({
                 KVDataList: list,
                 success(res) {
                     console.log(res);
                    
                 },
                 fail(res) {
                     console.log(res);
                 }
             }) */
        }

    }
    public gameOver() {
        this.BackGround.active = false;
        this.TopUI.active = false;
        this.GameOver.active = true;
        if (CC_WECHATGAME) {
            cc.find('gameover2', this.node).active = true;
            this.setRankScore("over");
            cc.find('content/rank', this.GameOver).getComponent(cc.WXSubContextView).enabled = false;
        } else {
            for (let i = 0; i < 3; i++) {
                let highScore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
                if (highScore < this.Score) {
                    this.LevelData.Data[this.Level].score = this.Score;
                    this.LevelData.setData();
                }
                let str = `content/star/score_` + (i + 1);
                cc.find(str, this.GameOver).getComponent(cc.Label).string = this.ConfigData[this.Level].score[i];
            }
            let highscore = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[this.Level].score;
            // this.setRank();
            cc.find(`content/highscore`, this.GameOver).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + highscore + "</outline>";
            cc.find(`content/score`, this.GameOver).getComponent(cc.RichText).string = "<outline color=#3A230A width=5>" + this.Score + "</outline>";
        }
    }
    protected backToMenu() {
        this.BackGround.active = false;
        this.TopUI.active = false;
        this.Rule.active = false;
        this.GamePause.active = false;
        this.GameWin.active = false;
        this.GameOver.active = false;
        this.LevelData.returnLevel();
        /* if (!this.isLoading) {
            this.isLoading = true;
            cc.director.loadScene("mainmenu");
        } */

    }
    protected nextLevel() {
        cc.sys.localStorage.setItem('level', ++this.Level);
        cc.director.loadScene("levelgame");
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

    // protected loadData:boolean=false; 

    protected update(dt) {
        let self=this;
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
                        if (this.Score < this.ConfigData[this.Level].score[0]) {
                            this.gameOver();
                        } else {
                            this.gameWin();
                        }
                    }
                }
            } else {
                if (this.BrickList[i].getComponent("brick").state == BrickState.touch && this.BrickList[i].getComponent("brick").life == 0) {
                    this.BrickList[i].removeFromParent();
                } 
                if (this.BrickList[i].getComponent("brick").state == BrickState.end) {
                    this.BrickList.splice(i, 1);
                    if (this.BrickNumber == this.totalBrickCount) {
                        if (this.BrickList.length == 0) {
                            if (this.Score < this.ConfigData[this.Level].score[0]) {
                                this.gameOver();
                            } else {
                                this.gameWin();
                            }
                        }
                    }
                }
            }
        }
        if (this.ConfigData) {
            if (this.Mask.width < this.ProcessBar) {
                this.Mask.width = (this.Score / this.ConfigData[this.Level].score[0]) * 0.4 * this.ProcessBar;
                if (this.Mask.width >= (0.4 * this.ProcessBar)) {
                    cc.find(`topui/progress/star_1`, this.node).getComponent(cc.Sprite).spriteFrame =self.instance.star[0];
                    this.Mask.width = (((this.Score - this.ConfigData[this.Level].score[0]) / (this.ConfigData[this.Level].score[1] - this.ConfigData[this.Level].score[0])) * 0.3 + 0.4) * this.ProcessBar;
                    if (this.Mask.width >= (0.7 * this.ProcessBar)) {
                        cc.find(`topui/progress/star_2`, this.node).getComponent(cc.Sprite).spriteFrame = self.instance.star[0];
                        this.Mask.width = (((this.Score - this.ConfigData[this.Level].score[1]) / (this.ConfigData[this.Level].score[2] - this.ConfigData[this.Level].score[1])) * 0.3 + 0.7) * this.ProcessBar;
                        if (this.Mask.width >= this.ProcessBar) {
                            cc.find(`topui/progress/star_3`, this.node).getComponent(cc.Sprite).spriteFrame = self.instance.star[0];
                            this.Mask.width = this.ProcessBar;
                        }
                    }

                }
            }
        }
    }

}

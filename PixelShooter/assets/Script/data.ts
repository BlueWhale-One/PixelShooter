import Menu from './mainmenu';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Data extends cc.Component {
    @property(cc.Prefab)
    protected LevelButton: cc.Prefab = null;
    @property([cc.Prefab])
    protected StarList: cc.Prefab[] = [];
    @property([cc.SpriteFrame])
    protected ButtonList: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    public CirclePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public Bullet: cc.Prefab = null;
    @property(cc.Prefab)
    public Block: cc.Prefab = null;
    @property([cc.SpriteFrame])
    public star: cc.SpriteFrame[] = [];
    @property([cc.Prefab])
    public brickPrefabList: cc.Prefab[] = [];



    public Data = [];
    protected Item: cc.Node = null;
    protected Level: cc.Node = null;
    protected LevelNumber: cc.Node = null;
    protected LevelList: cc.Node[] = [];
    protected LevelView: cc.Node = null;
    protected Back: cc.Node = null;
    protected LastPage: cc.Sprite = null;
    protected NextPage: cc.Sprite = null;
    protected ChildCount: number = 3;
    protected ProgressBar: cc.Node = null;

    public instance:Data=null

    protected onLoad() {
        this.instance=this;
        cc.game.addPersistRootNode(this.node);
        if (CC_WECHATGAME) {

        } else {
            if (cc.sys.localStorage.getItem("isfirst")) {
                cc.sys.localStorage.setItem("isfirst", 0);
            } else {
                cc.sys.localStorage.setItem("isfirst", 1);
                for (let i = 0; i < 35; i++) {
                    // if (JSON.parse(cc.sys.localStorage.getItem("LevelData"))[i]== undefined) {
                    let data = {
                        "star": -1,
                        "score": 0
                    }
                    // this.Data = JSON.parse(cc.sys.localStorage.getItem("LevelData"));
                    this.Data[i] = data;
                    cc.sys.localStorage.setItem("LevelData", JSON.stringify(this.Data));
                    // }
                }
            }
        }
        this.Item = cc.find(`Canvas/background/item`);
        this.Back = cc.find(`Canvas/background/back`);
        // this.ProgressBar = cc.find(`Canvas/background/progress`);
        this.LevelView = cc.find(`PageView`, this.node);
        this.LastPage = cc.find(`lastpage`, this.LevelView).getComponent(cc.Sprite);
        this.NextPage = cc.find(`nextpage`, this.LevelView).getComponent(cc.Sprite);
        this.ChildCount = cc.find(`view/content`, this.LevelView).children.length;
        this.LevelView.active = false;
        this.Data = JSON.parse(cc.sys.localStorage.getItem("LevelData"));
        // cc.find('menubutton',this.node).active=false;        
    }
    public setData() {
        cc.sys.localStorage.setItem("LevelData", JSON.stringify(this.Data));

    }
    protected nextPage() {
        let currentpage = this.LevelView.getComponent(cc.PageView).getCurrentPageIndex();
        if (this.NextPage.spriteFrame === this.ButtonList[4]) {
            this.LevelView.getComponent(cc.PageView).scrollToPage(currentpage + 1, 0.4);
            if (currentpage == (this.ChildCount - 2)) {
                this.NextPage.spriteFrame = this.ButtonList[3];
            } else {
                this.NextPage.spriteFrame = this.ButtonList[4];
            }
            this.LastPage.spriteFrame = this.ButtonList[1];

        }
        // cc.log(this.LevelView.getComponent(cc.PageView).getCurrentPageIndex());
    }
    protected lastPage() {
        let currentpage = this.LevelView.getComponent(cc.PageView).getCurrentPageIndex();
        if (this.LastPage.spriteFrame === this.ButtonList[1]) {
            this.LevelView.getComponent(cc.PageView).scrollToPage(currentpage - 1, 0.4);
            if (currentpage == 1) {
                this.LastPage.spriteFrame = this.ButtonList[0];
            } else {
                this.LastPage.spriteFrame = this.ButtonList[1];
            }
            this.NextPage.spriteFrame = this.ButtonList[4];
        }
        // cc.log(this.LevelView.getComponent(cc.PageView).getCurrentPageIndex());
    }
    public returnLevel() {
        // this.LevelView.getComponent(cc.PageView).setCurrentPageIndex(0);
        if (CC_WECHATGAME) {
            cc.find('PageView2', this.node).active = true;
        } else {
            this.LevelView.active = true;
            this.setLevel();
        }
    }
    protected backToMenu() {
        this.LevelView.active = false;
        cc.director.loadScene("mainmenu");

    }

    protected onLoading(completedCount: number, totalCount: number, itme: any) {
        this.ProgressBar.getComponent(cc.ProgressBar).progress = completedCount / totalCount;
    }

    public showRank() {
        this.LevelView.active = false;
        this.Item.active = false;
        cc.find('menubutton', this.node).active = true;
        // this.rank.getComponent(cc.WXSubContextView).enabled=false;
        // let rank = new cc.Texture2D;
        // let openDataContext = wx.getOpenDataContext()
        // let sharedCanvas = openDataContext.canvas;
        // rank.initWithElement(sharedCanvas);
        // rank.handleLoadedTexture();
        // this.rank.getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(rank); 

        /*
               let list: [{
                   key: 'score',
                   value: 100
               }]
               wx.setUserCloudStorage({
                   KVDataList: list,
                   success(res) {
                       cc.log(res);
                   },
                   fail(res) {
                       cc.log(res);
                   }
               })  */
    }

    public setLevel() {        
            this.LevelView.active = true;
            this.LastPage.spriteFrame = this.ButtonList[0];
            this.NextPage.spriteFrame = this.ButtonList[4];
            this.LevelView.getComponent(cc.PageView).setCurrentPageIndex(0);
            for (let i = 0; i < this.ChildCount; i++) {
                let parent = `view/content/page_` + (i + 1);
                cc.find(parent, this.LevelView).removeAllChildren();
            }

            for (let i = 1; i < 22; i++) {
                let levelbutton = cc.instantiate(this.LevelButton);
                let parent = `view/content/page_` + Math.floor((i - 1) / 9 + 1);
                levelbutton.parent = cc.find(parent, this.LevelView);
                if (i % 9 === 0) {
                    levelbutton.setPosition((-221 + 2 * 217), (246.5 - 2 * 250));
                }
                else {
                    levelbutton.setPosition((-221 + ((i % 9 - 1) % 3) * 217), (246.5 - Math.floor((i % 9 - 1) / 3) * 250));
                }
                cc.find(`label`, levelbutton).getComponent(cc.RichText).string = "<outline color=#37230A width=6>" + i + "</outline>";
                this.LevelList.push(levelbutton);
                let data = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[i - 1].star;
                if (i > 1) {
                    for (let j = 0; j < 3; j++) {
                        if (JSON.parse(cc.sys.localStorage.getItem("LevelData"))[i - 2].star != -1) {
                            cc.find(`lock`, levelbutton).active = false;
                            levelbutton.on(cc.Node.EventType.TOUCH_END, function () {
                                cc.sys.localStorage.setItem('level', i - 1);
                                cc.director.loadScene("levelgame", function () {
                                    this.LevelView.active = false;
                                    this.isLoaded = true;
                                }.bind(this));
                            }.bind(this))
                            if (data >= j) {
                                let str = `star/star_` + (j + 1);
                                cc.find(`lock`, levelbutton).active = false;
                                cc.find(str, levelbutton).getComponent(cc.Sprite).spriteFrame = this.ButtonList[2];
                            }
                        } else {
                            if (data == -1) {
                                cc.find(`star`, levelbutton).active = false;
                            } else {
                                if (data >= j) {
                                    let str = `star/star_` + (j + 1);
                                    cc.find(`lock`, levelbutton).active = false;
                                    cc.find(str, levelbutton).getComponent(cc.Sprite).spriteFrame = this.ButtonList[2];
                                    levelbutton.on(cc.Node.EventType.TOUCH_END, function () {
                                        cc.sys.localStorage.setItem('level', i - 1);
                                        cc.director.loadScene("levelgame", function () {
                                            this.LevelView.active = false;
                                        }.bind(this));
                                    }.bind(this))
                                }
                            }
                        }
                    }
                } else {
                    cc.find(`lock`, levelbutton).active = false;
                    for (let j = 0; j < 3; j++) {
                        if (data >= j) {
                            let str = `star/star_` + (j + 1);
                            cc.find(`lock`, levelbutton).active = false;
                            cc.find(str, levelbutton).getComponent(cc.Sprite).spriteFrame = this.ButtonList[2];
                        }
                    }
                    levelbutton.on(cc.Node.EventType.TOUCH_END, function () {
                        cc.sys.localStorage.setItem('level', i - 1);
                        cc.director.loadScene("levelgame", function () {
                            this.LevelView.active = false;
                        }.bind(this));
                    }.bind(this))
                }
            }    
    }
}

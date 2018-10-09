
import Menu from "./mainmenu";
const {ccclass, property} = cc._decorator;

class Info{
    parent:cc.Node;
}


@ccclass
export default class Level extends cc.Component {
    @property([cc.SpriteFrame])
    ButtonList:cc.SpriteFrame[]=[];
    @property(cc.Prefab)
    protected LevelButton: cc.Prefab = null;
   

    public LevelNumber:number=0;
    protected NextPage:cc.Sprite=null;
    protected LastPage:cc.Sprite=null;
    protected ChildCount:number=0;
    
    public static setlevel(arg:Info){
        cc.log(Menu.instance.LevelPrefab)
        let level=cc.instantiate(Menu.instance.LevelPrefab);
        level.parent=arg.parent;
        let LevelView=level.getComponent(Level);
        LevelView.setLevel();

    }
    
    protected onLoad(){
       this.NextPage=cc.find(`nextpage`,this.node).getComponent(cc.Sprite);
       this.LastPage=cc.find(`lastpage`,this.node).getComponent(cc.Sprite);
       this.ChildCount=cc.find(`view/content`, this.node).children.length;      
    }

    protected nextPage() {
        let currentpage = this.node.getComponent(cc.PageView).getCurrentPageIndex();
        if (this.NextPage.spriteFrame === this.ButtonList[4]) {
            this.node.getComponent(cc.PageView).scrollToPage(currentpage + 1, 0.4);
            if (currentpage == (this.ChildCount-2)) {
                this.NextPage.spriteFrame = this.ButtonList[3];
            } else {
                this.NextPage.spriteFrame = this.ButtonList[4];
            }
            this.LastPage.spriteFrame = this.ButtonList[1];

        }
    }
    protected lastPage() {
        let currentpage = this.node.getComponent(cc.PageView).getCurrentPageIndex();
        if (this.LastPage.spriteFrame === this.ButtonList[1]) {
            this.node.getComponent(cc.PageView).scrollToPage(currentpage - 1, 0.4);
            if (currentpage == 1) {
                this.LastPage.spriteFrame = this.ButtonList[0];
            } else {
                this.LastPage.spriteFrame = this.ButtonList[1];
            }
            this.NextPage.spriteFrame = this.ButtonList[4];
        }
    }
    public setLevel(){
        this.LastPage.spriteFrame = this.ButtonList[0];
        this.NextPage.spriteFrame = this.ButtonList[4];
        for (let i = 1; i < 22; i++) {
            let levelbutton = cc.instantiate(this.LevelButton);
            let parent = `view/content/page_` + Math.floor((i-1)/ 9 + 1);
            levelbutton.parent = cc.find(parent, this.node);
            if (i % 9 === 0) {
                levelbutton.setPosition((-221 + 2 * 217), (246.5 - 2 * 250));
            }
            else {
                levelbutton.setPosition((-221 + ((i % 9 - 1) % 3) * 217), (246.5 - Math.floor((i % 9 - 1) / 3) * 250));
            }
            cc.find(`label`, levelbutton).getComponent(cc.RichText).string = "<outline color=#37230A width=6>" + i + "</outline>";
            // this.LevelList.push(levelbutton);
            let data = JSON.parse(cc.sys.localStorage.getItem("LevelData"))[i - 1].star;
            if (i > 1) {
                for (let j = 0; j < 3; j++) {
                    if (JSON.parse(cc.sys.localStorage.getItem("LevelData"))[i - 2].star != -1) {
                        cc.find(`lock`, levelbutton).active = false;
                        levelbutton.on(cc.Node.EventType.TOUCH_END, function () {
                            cc.sys.localStorage.setItem('level', i - 1);
                            cc.director.loadScene("game");
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
                                    cc.director.loadScene("game");
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
                    cc.director.loadScene("game");
                }.bind(this))
            }


        }

    }
}

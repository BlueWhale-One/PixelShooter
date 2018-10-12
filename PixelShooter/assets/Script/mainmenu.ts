import Game from "./game";
import Data from "./data";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
    @property(cc.Prefab)
    protected LevelButton: cc.Prefab = null;
    @property([cc.Prefab])
    protected StarList: cc.Prefab[] = [];
    @property([cc.SpriteFrame])
    protected ButtonList: cc.SpriteFrame[] = [];

    protected Item: cc.Node = null;
    protected Level: cc.Node = null;
    protected LevelNumber: cc.Node = null;
    protected LevelList: cc.Node[] = [];
    protected Data: cc.Node = null;
    protected Back: cc.Node = null;
    protected LevelView: cc.Node = null;
    protected LastPage: cc.Sprite = null;
    protected NextPage: cc.Sprite = null;
    protected ChildCount: number = 0;  

    protected onLoad() {     
        this.Item = cc.find(`background/item`, this.node);
        this.LevelNumber = cc.find("levelnumber");
        this.Back = cc.find(`background/back`, this.node);
        this.Data=cc.find("Data");       
        this.Item.active = true;            
    }
    
    protected startGame() {
        this.Item.active = false;
        this.Data.getComponent(Data).setLevel();
        if (CC_WECHATGAME) {
            wx.getOpenDataContext().postMessage({
                message: "levelselect"
            });
        }
        cc.find('PageView',this.Data).active=true;
    }

    protected showRank(){
        this.Data.getComponent(Data).showRank();
    }
    
}

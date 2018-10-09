import Game from "./game";
const { ccclass, property } = cc._decorator;
const BrickType = cc.Enum({
    N1: 1,
    N2: 2,
    N3: 3,
    N4: 4,
    N5: 5
})
@ccclass
export default class Bullet extends cc.Component {
    protected rigidbody=null;
    protected canvas:cc.Node=null;
    public power:boolean=false;

    protected onLoad(){
       this.rigidbody=this.getComponent(cc.RigidBody);
       cc.director.getPhysicsManager().enabled=true;
       this.rigidbody.enabledContactListener=true;
       this.canvas=cc.find("Canvas");
    //    this.power=this.canvas.getComponent(Game)._powerUp;
       /* if(this.power){           
           this.node.setContentSize(this.node.width*2,this.node.height*2);
       } */
    }

    protected onBeginContact(contact, self, other) {    
        if(this.power){
            // this.power=false;
        }else{
            self.node.destroy();
        }
       

    }
    protected update(dt){
        if(this.node.y>1700){
            this.node.destroy();
        }
    }
}

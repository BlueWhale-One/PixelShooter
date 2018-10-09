const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    protected rigidbody = null;


    protected onLoad() {
        this.rigidbody = this.getComponent(cc.RigidBody);
        cc.director.getPhysicsManager().enabled = true;
        this.rigidbody.enabledContactListener = true;
    }

    protected onBeginContact(contact, self, other) {
        if (other.tag == 1) {
            let speed = self.getComponent(cc.RigidBody).linearVelocity;  
            if (self.node.color!==cc.color(0,0,0)) {
                self.getComponent(cc.RigidBody).linearVelocity = cc.v2(-speed.x, speed.y);
            } else{
                if (speed.y > 0) {
                    self.getComponent(cc.RigidBody).linearVelocity = cc.v2(-speed.x, -speed.y);
                }
                if (speed.y < 0) {
                    self.getComponent(cc.RigidBody).linearVelocity = cc.v2(-speed.x, speed.y);
                }
            }
        }       
        if(other.node.group=='brick'){
            this.node.removeFromParent();
        }
    }
    protected update(dt){
        if(this.node.y>1700){
            this.node.destroy();
        }
    }
}

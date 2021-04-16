
import { _decorator, Component, Node, Prefab, director } from 'cc';
import { tileManager } from './tileManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    Timer: number = 10;
    timerCount = 0;

    onLoad() {
        tileManager.instance.init();
        // setTimeout(() => {
        //     tileManager.instance.addTiles();
        // }, 2 * 1000);
    }

    start() {
        // [3]
    }

    update(dt: number) {
        this.timerCount += dt;
        if (this.timerCount >= this.Timer) {
            // tileManager.instance.addTiles();
            console.log('Timer Passed');
            this.timerCount = 0;
        }



    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */

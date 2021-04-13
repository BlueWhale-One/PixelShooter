
import { _decorator, Component, Node, math, instantiate, Prefab, Vec2, v2, v3 } from 'cc';
import { Tile } from './tile';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class tileManager extends Component {
    @property(Node)
    tileContainer!: Node;
    @property(Prefab)
    tile_Prefab!: Prefab;

    tileData: number[][] = [];
    tileMap: any[][] = [];
    static instance: tileManager;


    onLoad() {
        tileManager.instance = this;
        for (let j = 0; j < 8; j++) {
            let array: number[] = [];
            for (let i = 0; i < 6; i++) {
                array.push(0);
            }
            this.tileData.push(array);
        }

    }

    init() {
        for (let j = 0; j < 2; j++) {
            let array: Tile[] = [];
            for (let i = 0; i < 6; i++) {
                let random = Math.floor(Math.random() * 5 + 1);
                let tile = this.getTile(random, i, j);
                if (tile) {
                    array.push(tile);
                    this.tileData[j][i] = random;
                }
            }
            this.tileMap.push(array);
        }
        for (let j = 2; j < 8; j++) {
            let array: any[] = [null, null, null, null, null, null];
            this.tileMap.push(array);
        }
        console.log(this.tileData);
        console.log(this.tileMap);
    }

    getTile(num: number, i: number, j: number) {
        let node = instantiate(this.tile_Prefab);
        node.setParent(this.tileContainer);
        node.setPosition(v3(118 * i + 55, 118 * j + 55, 0));
        let tile = node.getComponent(Tile);
        tile?.init(num);
        return tile;
    }

    start() {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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

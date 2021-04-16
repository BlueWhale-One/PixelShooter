
import { _decorator, Component, Node, math, instantiate, Prefab, Vec2, v2, v3, tween } from 'cc';
import { Tile } from './tile';
const { ccclass, property } = _decorator;

enum MoveDir {
    UP,
    Down,
    Left,
    Right
}
@ccclass('GameManager')
export class tileManager extends Component {
    @property(Node)
    tileContainer!: Node;
    @property(Prefab)
    tile_Prefab!: Prefab;
    @property(Node)
    blockNode!: Node;
    tileData: number[][] = [];
    tileMap: any[][] = [];
    static instance: tileManager;


    delayTime !: number;

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

    isShowBlock(isShow: boolean) {
        this.blockNode.active = isShow;
    }

    init() {
        for (let j = 0; j < 2; j++) {
            let array: Tile[] = [];
            for (let i = 0; i < 6; i++) {
                let random = Math.floor(Math.random() * 5 + 1);
                if (j > 0) {
                    while (random == this.tileData[j - 1][i]) {
                        random = Math.floor(Math.random() * 5 + 1);
                    }
                }

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

    addTiles() {

        for (let j = 6; j >= 0; j--) {
            for (let i = 0; i < 6; i++) {
                if (this.tileData[j][i] != 0) {
                    this.tileData[j + 1][i] = this.tileData[j][i];
                    this.tileData[j][i] = 0;

                    this.tileMap[j + 1][i] = this.tileMap[j][i];
                    this.tileMap[j + 1][i].node.setPosition(v3(i * 118 + 55, (j + 1) * 118 + 55, 0));
                    this.tileMap[j][i] = null;
                }
            }
        }


        let hang = 0;
        let array = [];
        // let array: Tile[] = [];
        for (let i = 0; i < 6; i++) {
            let random = Math.floor(Math.random() * 5 + 1);
            // if (j > 0) {
            while (random == this.tileData[hang + 1][i]) {
                random = Math.floor(Math.random() * 5 + 1);
            }
            // }

            let tile = this.getTile(random, i, hang);
            if (tile) {
                array.push(tile);
                this.tileData[hang][i] = random;
            }
        }

        this.tileMap[hang] = array;
        console.log(this.tileData, this.tileMap);

    }

    getTile(num: number, i: number, j: number) {
        let node = instantiate(this.tile_Prefab);
        node.setParent(this.tileContainer);
        node.setPosition(v3(118 * i + 55, 118 * j + 55, 0));
        let tile = node.getComponent(Tile);
        tile?.init(num, j, i);
        return tile;
    }

    start() {


    }

    tilesDelete(dirction: number, hang: number, lie: number, selectNum: number, tile: Tile) {
        let delteTile;
        let delteIndex;
        let moveHang: number = hang;
        let moveLie: number = lie;
        switch (dirction) {
            case MoveDir.Right:
                moveLie = lie - 1;
                break;
            case MoveDir.Left:
                moveLie = lie + 1;
                break;
            case MoveDir.Down:
                moveHang = hang + 1;
                // delteTile = this.tileMap[hang - 1][lie];
                // delteIndex = this.tileData[hang - 1][lie];
                break;
            case MoveDir.UP:
                moveHang = hang - 1;
                // delteTile = this.tileMap[hang + 1][lie];
                // delteIndex = this.tileData[hang + 1][lie];
                break;

        }
        // console.log(moveHang, moveLie);


        let Newtile = this.getTile(selectNum, lie, hang);

        // let Newtile = tile;
        tile.node.destroy();

        delteTile = this.tileMap[hang][lie];
        if (delteTile != null && delteTile.node) {
            delteTile.node.destroy();
        }
        // this.tileMap[hang][lie] = tile;

        this.tileMap[hang][lie] = Newtile;
        // this.tileMap[hang][lie].node.getComponent(Tile).Lable.string = '' + selectNum;
        // this.tileMap[hang][lie].node.setPosition(v3(118 * lie + 55, 118 * hang + 55, 0));

        this.tileData[hang][lie] = selectNum;
        if (dirction != -1) {
            this.tilesMoveDown(moveHang, moveLie);
            // this.tilesMoveDown(moveHang, lie);
        }
        // 
        if (dirction == MoveDir.Left || dirction == MoveDir.Right) {
            setTimeout(() => {
                this.checkDownDelete(lie);
            }, this.delayTime * 1000)
        }

        if (dirction == MoveDir.UP || dirction == MoveDir.Down) {
            setTimeout(() => {
                this.checkDownDelete(lie);
            }, this.delayTime * 1000)
        }

        // console.log(this.tileData, this.tileMap);
    }


    tilesMoveDown(hang: number, lie: number) {
        // console.log(hang, lie);
        let delaytime = 0;
        let deltaTime = 0.4;
        for (let i = (hang + 1); i < 8; i++) {
            // console.log(this.tileData[i][lie]);
            setTimeout(() => {


                if (this.tileData[i][lie] != 0) {
                    // if (this.tileData[i][lie] == this.tileData[i - 1][lie]) {
                    // console.log('2222');
                    //     let num = this.tileData[i][lie] + 1;
                    //     this.tilesDelete(MoveDir.Down, i, lie, num, this.tileMap[i - 1][lie]);
                    // } else {
                    let num = this.tileData[i][lie];

                    if (i == 1) {
                        let j = -1;
                        this.tileMap[j + 1][lie] = this.tileMap[i][lie];
                        // this.tileMap[j + 1][lie].node.setPosition(v3(lie * 118 + 55, (j + 1) * 118 + 55, 0));
                        // let act = 
                        tween(this.tileMap[j + 1][lie].node)
                            .to(0.3, { position: v3(lie * 118 + 55, (j + 1) * 118 + 55, 0) })
                            // .repeat(1)
                            .start();
                        this.tileMap[i][lie] = null;

                        this.tileData[j + 1][lie] = this.tileData[i][lie];
                        this.tileData[i][lie] = 0;
                        // console.log(this.tileData, this.tileMap);
                        delaytime += deltaTime;
                    }
                    // i = 2  j = 1
                    for (let j = i - 1; j >= 0; j--) {
                        if (this.tileData[j][lie] != 0) {
                            this.tileMap[j + 1][lie] = this.tileMap[i][lie];
                            if (this.tileMap[j + 1][lie] != null) {
                                // this.tileMap[j + 1][lie].node.setPosition(v3(lie * 118 + 55, (j + 1) * 118 + 55, 0));

                                tween(this.tileMap[j + 1][lie].node)
                                    .to(0.3, { position: v3(lie * 118 + 55, (j + 1) * 118 + 55, 0) })
                                    // .repeat(1)
                                    .start();

                            }
                            this.tileMap[i][lie] = null;

                            this.tileData[j + 1][lie] = this.tileData[i][lie];
                            this.tileData[i][lie] = 0;
                            delaytime += deltaTime * (i - j);
                            break;
                        }

                    }

                }
                // return;
            }, (delaytime * (i - 1) * 1000));
        }
        // console.log(this.tileData, this.tileMap);
        this.checkDownDelete(lie);

    }

    checkDownDelete(lie: number) {
        let delatTime = 0;

        for (let i = 1; i < 8; i++) {
            // for (let j = i - 1; j > 0; j--) {
            setTimeout(() => {
                if (this.tileData[i][lie] != 0 && this.tileData[i][lie] == this.tileData[i - 1][lie]) {
                    // console.log('111111111111');
                    let selectNum = this.tileData[i][lie] + 1;
                    let Newtile = this.getTile(selectNum, lie, i - 1);
                    this.tileMap[i][lie].node.destroy();
                    this.tileMap[i][lie] = null;
                    let delteTile = this.tileMap[i - 1][lie];
                    if (delteTile != null) {
                        delteTile.node.destroy();
                    }
                    // this.tileMap[hang][lie] = tile;

                    this.tileMap[i - 1][lie] = Newtile;
                    // tile.fresh(selectNum);
                    this.tileData[i][lie] = 0;
                    this.tileData[i - 1][lie] = selectNum;

                    this.tilesMoveDown(i, lie);
                }
                // }
            }, 1000 * 0.2 * (i));
        }
        // console.log(this.tileData, this.tileMap);
    }


}
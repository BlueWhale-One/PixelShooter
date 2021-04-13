
import { _decorator, Component, Node, Vec2, Vec3, EventTouch, v3, math, Prefab, tween } from 'cc';
import { Tile } from './tile';
import { tileManager } from './tileManager';
const { ccclass, property } = _decorator;

@ccclass('TileTouchMgr')
export class TileTouchMgr extends Component {
    @property(Node)
    tile!: Node;

    touchStartPos!: Vec3;

    // data = [[1,2],[]];
    currentNum: number = 0;

    delayTime = 0.4;


    onLoad() {
        this.tile.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.tile.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.tile.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        console.log('----------move start ----------');
        // if (!this.touchStartPos) {
        let target = event.target;
        if (target && target instanceof Node) {
            this.touchStartPos = target.getPosition();
            let hang = Math.floor((this.tile.position.y + 55) / 118);
            let lie = Math.floor((this.tile.position.x) / 118);
            this.currentNum = tileManager.instance.tileData[hang][lie];
            tileManager.instance.tileData[hang][lie] = 0;
            console.log(tileManager.instance.tileData);
        }
        // }
    }

    onTouchMove(event: EventTouch) {
        // console.log(event);
        if (event) {
            let location = event.getLocation();
            let pos = new Vec3(location.x - 25, location.y - 25, 0);
            // this.tile.position = pos;


            this.checkHasTile1(event.getDelta(), pos);
            // this.tile.position = pos;
            // if (this.tile.position.x >= 645) {
            //     this.tile.setPosition(v3(645, this.tile.position.y, 0));
            // }
            // if (this.tile.position.x <= 55) {
            //     this.tile.setPosition(v3(55, this.tile.position.y, 0));
            // }
            // if (this.tile.position.y >= 881) {
            //     this.tile.setPosition(v3(this.tile.position.x, 881, 0));
            // }
            // if (this.tile.position.y <= 55) {
            //     this.tile.setPosition(v3(this.tile.position.x, 55, 0));
            // }


        }
    }

    checkHasTile1(delta: Vec2, posLocation: Vec3) {
        let tileHang = Math.floor((this.tile.position.y) / 118);
        let tileLie = Math.floor((this.tile.position.x) / 118);

        let hang = Math.floor((posLocation.y) / 118);
        let lie = Math.floor((posLocation.x) / 118);

        let lieLeft = Math.floor((posLocation.x - 55) / 118);
        let lieRight = Math.floor((posLocation.x + 55) / 118);
        let hangUp = Math.floor((posLocation.y + 55) / 118);
        let hangDown = Math.floor((posLocation.y - 55) / 118);
        // console.log(hang, lie);

        // if (tileManager.instance.tileData[hang][lie] == 0) {
        //     this.tile.setPosition(posLocation);
        //     return;
        // }

        let posx
            = this.checkBlockHangTile(delta, posLocation);
        // posx = posLocation.x;
        let posy;
        let pos;

        posy = this.checkBlockLieTile(delta, posLocation);

        // }
        let finHang = Math.floor((posy - 55) / 118);
        let finLie = Math.floor((posx - 55) / 118);
        // console.log(finHang, finLie);

        pos = v3(posx, posy, 0);
        // let pos = v3(tileLie * 118 + 55, posLocation.y, 0);
        // if (tileManager.instance.tileData[hang][lieLeft] == 0) {
        this.tile.setPosition(pos);

        // }
    }

    checkBlockHangTile(delta: Vec2, posLocation: Vec3) {
        let tileLie = Math.floor((this.tile.position.x) / 118);
        let tileHang = Math.floor((this.tile.position.y - 55) / 118);
        // let tileHang = Math.floor((this.tile.position.y) / 118);
        let tileLieLeft = Math.floor((this.tile.position.x - 55) / 118);

        // let tileHang = Math.floor((this.tile.position.y) / 118);
        let tileLieRight = Math.floor((this.tile.position.x + 55) / 118);

        let hang = Math.floor((posLocation.y) / 118);
        let lie = Math.floor((posLocation.x) / 118);
        let lieLeft = Math.floor((posLocation.x - 55) / 118);
        let lieRight = Math.floor((posLocation.x + 55) / 118);
        let posx;
        // console.log(tileHang);

        let disX = posLocation.x - this.tile.position.x;
        if (hang >= 7) {
            hang = 7;
        }
        if (hang <= 0) {
            hang = 0;
        }
        if (lieRight > 5) {
            lieRight = 5;
        }
        if (lieLeft < 0) {
            lieLeft = 0;
        }

        if (disX < 0) {
            if (tileLie > 0) {
                if (tileManager.instance.tileData[hang][tileLie - 1] != 0) {

                    if (tileManager.instance.tileData[hang][tileLie - 1] == this.currentNum) {
                        this.currentNum++;
                        tileManager.instance.tileData[hang][tileLie - 1]++;
                        tileManager.instance.tileMap[hang][tileLie - 1].node.destroy();
                        tileManager.instance.tileMap[hang][tileLie] = null;
                        tileManager.instance.tileMap[hang][tileLie - 1] = this.tile.getComponent(Tile);
                        this.tile.getComponent(Tile)?.fresh(this.currentNum);
                        return (tileLie - 1) * 118 + 55;
                    }


                    return tileLie * 118 + 55;
                }

                // for (let i = tileLie; i > 0; i--) {
                // if (tileManager.instance.tileData[tileHang][tileLieLeft] == 0) {
                //     return posLocation.x;
                // }
                // }


            }
            if (tileManager.instance.tileData[hang][lieLeft] != 0) {
                return tileLie * 118 + 55;
            }
            // if (lieRight < 5) {
            if (tileManager.instance.tileData[hang][lieRight] != 0) {
                return tileLie * 118 + 55;
            }
            // }
            if (lieLeft == lieRight) {
                return tileLie * 118 + 55;
            }
            return posLocation.x;
        } else {
            if (tileLie < 5) {
                if (tileManager.instance.tileData[hang][tileLie + 1] != 0) {
                    return tileLie * 118 + 55;
                }
            }
            // if (lieRight < 5) {
            if (tileManager.instance.tileData[hang][lieRight] != 0) {
                return tileLie * 118 + 55;
            }
            // }
            if (tileManager.instance.tileData[hang][lieLeft] != 0) {
                return tileLie * 118 + 55;
            }
            if (lieLeft == lieRight) {
                return tileLie * 118 + 55;
            }
            return posLocation.x;
        }
    }

    checkBlockLieTile(delta: Vec2, posLocation: Vec3) {
        let tileLie = Math.floor((this.tile.position.x) / 118);

        let tileHang = Math.floor((this.tile.position.y) / 118);
        let tileLieLeft = Math.floor((this.tile.position.x - 55) / 118);

        // let tileHang = Math.floor((this.tile.position.y) / 118);
        let tileLieRight = Math.floor((this.tile.position.x + 55) / 118);



        let hangUp = Math.floor((
            // this.tile.position.y
            posLocation.y
            + 55) / 118);
        let hangDown = Math.floor((
            // this.tile.position.y
            posLocation.y
            - 55) / 118);
        let hang = Math.floor((posLocation.y) / 118);
        let lie = Math.floor((posLocation.x) / 118);
        // let lieLeft = Math.floor((posLocation.x - 55) / 118);
        // let lieRight = Math.floor((posLocation.x + 55) / 118);
        // let posx;
        // console.log(tileHang);

        let disY = posLocation.y - this.tile.position.y;

        if (tileHang >= 7) {
            tileHang = 7;
        }

        if (lie <= 0) {
            lie = 0;
        }
        if (lie >= 5) {
            lie = 5;
        }


        if (disY < 0) {
            // console.log(tileManager.instance.tileData[hang][lieLeft]);

            if (tileHang < 1) {
                return tileHang * 118 + 55;
            } else {
                if (tileManager.instance.tileData[tileHang - 1][lie] != 0) {
                    return tileHang * 118 + 55;
                }
            }

            if (tileManager.instance.tileData[hangUp][lie] != 0) {
                return tileHang * 118 + 55;
            }
            if (hangDown > 0) {
                if (tileManager.instance.tileData[hangDown][lie] != 0) {
                    return tileHang * 118 + 55;
                }
            }
            if (hangDown == hangUp) {
                return tileHang * 118 + 55;
            }
            // if (tileManager.instance.tileData[hang][tileLie - 1] != 0) {
            //     return this.tile.position.x;
            // }
            return posLocation.y;
            // this.tile.setPosition(posLocation);
        }
        else {
            if (tileHang > 6) {
                return tileHang * 118 + 55;
            }

            if (tileManager.instance.tileData[tileHang + 1][lie] != 0) {
                return tileHang * 118 + 55;
            }
            if (tileManager.instance.tileData[hangUp][lie] != 0) {
                return tileHang * 118 + 55;
            }
            if (hangDown > 0) {
                if (tileManager.instance.tileData[hangDown][lie] != 0) {
                    return tileHang * 118 + 55;
                }
            }
            if (hangDown == hangUp) {
                return tileHang * 118 + 55;
            }
            return posLocation.y;
            // this.tile.setPosition(posLocation);
        }
    }
    onTouchEnd() {

        console.log('----------move end ----------');
        let finHang = Math.floor((this.tile.position.y - 55) / 118);
        let finLie = Math.floor((this.tile.position.x) / 118);
        this.tile.setPosition(v3(finLie * 118 + 55, finHang * 118 + 55, 0));
        let hang: number = 0;
        let hasdelete = false;
        for (let i = finHang; i > 0; i--) {
            if (tileManager.instance.tileData[i][finLie] == 0) {
                hang = i;
                if (tileManager.instance.tileData[i - 1][finLie] == this.currentNum) {
                    hang = i - 1;
                    hasdelete = true;
                    setTimeout(() => {
                        if (tileManager.instance.tileMap[i - 1][finLie]) {
                            tileManager.instance.tileMap[i - 1][finLie].node.destroy();
                        }
                        tileManager.instance.tileMap[i - 1][finLie] = this.tile.getComponent(Tile);
                    }, 1000 * this.delayTime);
                    this.currentNum += 1;
                }
            }
        }


        // console.log(this.currentNum);

        tween(this.tile)
            .to(this.delayTime, { position: v3(finLie * 118 + 55, hang * 118 + 55, 0) })
            // .union()

            // .call(() => {


            // })
            .repeat(1)
            .start();

        // if (hasdelete ){
        tileManager.instance.tileData[hang][finLie] = this.currentNum;
        setTimeout(() => {
            if (tileManager.instance.tileMap[hang][finLie]) {
                tileManager.instance.tileMap[hang][finLie].fresh(this.currentNum);
                this.currentNum = 0;
                console.log(tileManager.instance.tileData);
            }
        }, 1000 * this.delayTime);
        // }
    }

    checkSameAdd() {

    }


    start() {

    }


}

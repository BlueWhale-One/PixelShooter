
import { _decorator, Component, Node, Vec2, Vec3, EventTouch, v3, math, Prefab, tween } from 'cc';
import { Tile } from './tile';
import { tileManager } from './tileManager';
const { ccclass, property } = _decorator;

@ccclass('TileTouchMgrBackUp')
export class TileTouchMgrBackUp extends Component {
    @property(Node)
    tile!: Node;
    // @property()

    touchStartPos!: Vec3;

    // data = [[1,2],[]];
    currentNum: number = 0;

    delayTime = 0.4;


    onLoad() {
        this.tile.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.tile.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.tile.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.tile.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        // console.log('----------move start ----------');
        // if (!this.touchStartPos) {
        let target = event.target;
        if (target && target instanceof Node) {
            this.touchStartPos = target.getPosition();
            let hang = Math.floor((this.tile.position.y + 55) / 118);
            let lie = Math.floor((this.tile.position.x) / 118);
            this.currentNum = tileManager.instance.tileData[hang][lie];
            tileManager.instance.tileData[hang][lie] = 0;
            // console.log(tileManager.instance.tileData);
        }
        // }
    }

    onTouchMove(event: EventTouch) {
        // console.log(event);
        if (event) {
            let location = event.getDelta();
            // let pos = new Vec3(location.x - 25, location.y - 25, 0);
            // this.checkHasTile1(event.getDelta(), pos);
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
            this.tile.position = new Vec3(this.tile.position.x + location.x, this.tile.position.y + location.y, 0);

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
        let finLie = Math.floor((this.tile.position.x) / 118);
        let Lie = Math.floor((posx) / 118);
        // let finLieU = Math.floor((posy + 55) / 118);
        let finHang = Math.floor((this.tile.position.y) / 118);
        let Hang = Math.floor((posy) / 118);
        // let finHangR = Math.floor((posx + 55) / 118);



        // let pos = v3(tileLie * 118 + 55, posLocation.y, 0);
        /* if (finLie > 0 && finLie < 5 && finHang > 0 && finHang < 8) {

            console.log(finHang, finLie);
            // console.log(tileManager.instance.tileData[finHang][finLie - 1],
            //     tileManager.instance.tileData[finHang][finLie + 1]);

            // if (finLie == 0 || finLie == 5) {
            //     if (tileManager.instance.tileData[finHang][finLie] != 0) {
            //         posy = 55 + 118 * finHang;
            //     }
            // } else {
            if (tileManager.instance.tileData[finHang + 1][finLie] != 0) {
                posy = 55 + 118 * finHang;
            }
            if (tileManager.instance.tileData[finHang - 1][finLie] != 0) {
                posy = 55 + 118 * finHang;
            }
            // }

            // if (finHang > 0 && finHang < 8) {

            // if (tileManager.instance.tileData[finHang + 1][finLie] != 0) {
            //     posx = 55 + 118 * Hang;
            // }
            // if (tileManager.instance.tileData[finHang - 1][finLie] != 0) {
            //     posx = 55 + 118 * Hang;
            // }
            // }
        }

        if (finLie == 0) {
            if (tileManager.instance.tileData[finHang][finLie] != 0) {
                posy = 55 + 118 * finHang;
            }
        } */

        pos = v3(posx, posy, 0);

        this.tile.setPosition(pos);

        // }
    }

    checkBlockHangTile(delta: Vec2, posLocation: Vec3) {
        let tileLie = Math.floor((this.tile.position.x) / 118);
        let tileHang = Math.floor((this.tile.position.y) / 118);
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
        if (tileHang >= 7) {
            tileHang = 7;
        }
        if (tileHang <= 0) {
            tileHang = 0;
        }

        if (lie <= 0) {
            lie = 0;
        }
        if (lie >= 5) {
            lie = 5;
        }
        if (lieRight > 5) {
            lieRight = 5;
        }
        if (lieLeft < 0) {
            lieLeft = 0;
        }

        if (disX < 0) {
            if (tileLie > 0) {
                if (tileManager.instance.tileData[tileHang][tileLie - 1] != 0) {

                    if (tileManager.instance.tileData[tileHang][tileLie - 1] == this.currentNum) {
                        //     this.currentNum++;
                        //     tileManager.instance.tileData[hang][tileLie - 1]++;
                        //     tileManager.instance.tileMap[hang][tileLie - 1].node.destroy();
                        //     tileManager.instance.tileMap[hang][tileLie] = null;
                        //     tileManager.instance.tileMap[hang][tileLie - 1] = this.tile.getComponent(Tile);
                        //     this.tile.getComponent(Tile)?.fresh(this.currentNum);
                        //     console.log('**********left delete************');

                        //     tileManager.instance.isShowBlock(true);
                        //     setTimeout(() => {
                        //         tileManager.instance.isShowBlock(false);
                        //     }, this.delayTime * 1000);

                        //     return (tileLie - 1) * 118 + 55;
                    }
                    return tileLie * 118 + 55;
                } else {
                    for (let i = tileLie; i >= 0; i--) {
                        if (i > 0) {
                            if (tileManager.instance.tileData[tileHang][i - 1] != 0) {
                                console.log(i);
                                // , Math.floor(posLocation.y / 118));
                                if (Math.floor(posLocation.x / 118) >= i) {
                                    if (Math.floor(posLocation.x / 118) == 0) {
                                        return 55;
                                    }
                                    return posLocation.x;
                                } else {
                                    return i * 118 + 55;
                                }
                            } else {
                                continue;
                            }
                        } else {
                            if (tileManager.instance.tileData[tileHang][i] == 0) {
                                // , Math.floor(posLocation.y / 118));
                                if (Math.floor(posLocation.x / 118) >= i) {
                                    if (Math.floor(posLocation.x / 118) == 0) {
                                        return 55;
                                    }
                                    return posLocation.x;
                                } else {
                                    return i * 118 + 55;
                                }
                            }
                        }
                    }
                }

                // for (let i = tileLie; i > 0; i--) {
                // if (tileManager.instance.tileData[tileHang][tileLieLeft] == 0) {
                //     return posLocation.x;
                // }
                // }

            }
            if (tileManager.instance.tileData[tileHang][lieLeft] != 0) {
                return tileLie * 118 + 55;
            }
            // if (lieRight < 5) {
            if (tileManager.instance.tileData[tileHang][lieRight] != 0) {
                return tileLie * 118 + 55;
            }
            // }
            if (lieLeft == lieRight) {
                return tileLie * 118 + 55;
            }
            return posLocation.x;
        } else {
            if (tileLie < 5) {
                if (tileManager.instance.tileData[tileHang][tileLie + 1] != 0) {
                    return tileLie * 118 + 55;
                } else {
                    for (let i = tileLie; i <= 5; i++) {
                        if (i < 5) {
                            if (tileManager.instance.tileData[tileHang][i + 1] != 0) {
                                if (Math.floor(posLocation.x / 118) <= i) {
                                    if (Math.floor(posLocation.x / 118) >= 5) {
                                        return 5 * 118 + 55;
                                    }
                                    return posLocation.x;
                                } else {
                                    return i * 118 + 55;
                                }
                            } else {
                                continue;
                            }
                        } else {
                            if (tileManager.instance.tileData[tileHang][i] == 0) {
                                if (Math.floor(posLocation.x / 118) <= i) {
                                    if (Math.floor(posLocation.x / 118) >= 5) {
                                        return 5 * 118 + 55;
                                    }
                                    return posLocation.x;
                                } else {
                                    return i * 118 + 55;
                                }
                            }
                        }
                    }
                }
            }
            /*  else {
                 if (tileManager.instance.tileData[tileHang][tileLie] == 0) {
                     if (Math.floor(posLocation.x / 118) <= tileLie * 118 + 55) {
                         // if (Math.floor(posLocation.x / 118) == 0) {
                         //     return 55;
                         // }
                         return posLocation.x;
                     }
                     return tileLie * 118 + 55;
                 }
             } */
            // if (lieRight < 5) {
            if (tileManager.instance.tileData[tileHang][lieRight] != 0) {
                return tileLie * 118 + 55;
            }
            // }
            if (tileManager.instance.tileData[tileHang][lieLeft] != 0) {
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

        let disY = posLocation.y - this.tile.position.y;

        if (tileHang >= 7) {
            tileHang = 7;
        }
        if (hangDown <= 0) {
            hangDown = 0;
        }
        if (hangUp >= 7) {
            hangUp = 7;
        }
        if (hang <= 0) {
            hang = 0;
        }
        if (hang >= 7) {
            hang = 7;
        }


        if (lie <= 0) {
            lie = 0;
        }
        if (lie >= 5) {
            lie = 5;
        }
        if (tileLie <= 0) {
            tileLie = 0;
        }
        if (tileLie >= 5) {
            tileLie = 5;
        }


        if (disY < 0) {
            // console.log(tileManager.instance.tileData[hang][lieLeft]);

            if (tileHang > 0) {
                // return tileHang * 118 + 55;
                // } else {
                if (tileManager.instance.tileData[tileHang - 1][tileLie] != 0) {
                    return tileHang * 118 + 55;
                }
                else {
                    for (let i = hang; i < 8; i++) {
                        if (tileManager.instance.tileData[i][tileLie] == 0) {
                            // console.log(i, Math.floor(posLocation.y / 118));
                            if (Math.floor(posLocation.y / 118) >= i) {
                                if (Math.floor(posLocation.y / 118) == 0) {
                                    return 55;
                                }
                                // let y = Math.floor((posLocation.y - 55) / 118);
                                // console.log(y);
                                // if (tileManager.instance.tileData[y][tileLie] != 0) {
                                //     return (y + 1) * 118 + 55;
                                // }

                                return posLocation.y;
                            } else {
                                return i * 118 + 55;
                            }
                        }
                        continue;
                    }
                }

            }

            if (tileManager.instance.tileData[hangUp][tileLie] != 0) {
                // if (Math.floor(posLocation.y / 118 + 55) <= hangUp) {
                //     return posLocation.y;
                // } else {
                return tileHang * 118 + 55;
                // }
            }
            // if (hangDown > 0) {
            if (tileManager.instance.tileData[hangDown][tileLie] != 0) {
                // if (Math.floor(posLocation.y / 118) >= hangDown) {
                //     return posLocation.y;
                // } else {
                return tileHang * 118 + 55;
                // }
            }
            // }
            if (hangDown == hangUp) {
                return tileHang * 118 + 55;
            }
            if (tileManager.instance.tileData[tileHang][tileLie - 1] != 0) {
                return this.tile.position.x;
            }
            return posLocation.y;
        }
        else {
            // if (tileHang > 6) {
            //     return tileHang * 118 + 55;
            // }

            if (tileHang < 7) {
                if (tileManager.instance.tileData[tileHang + 1][tileLie] != 0) {
                    return tileHang * 118 + 55;
                }
                else {
                    // console.log(tileLie);
                    for (let i = hang; i < 8; i++) {
                        if (tileManager.instance.tileData[i][tileLie] == 0) {
                            return posLocation.y;
                        }
                        continue;
                    }
                }
            }
            if (tileManager.instance.tileData[hangUp][tileLie] != 0) {
                return tileHang * 118 + 55;
            }
            // if (hangDown > 0) {
            if (tileManager.instance.tileData[hangDown][tileLie] != 0) {
                return tileHang * 118 + 55;
            }
            // }
            if (hangDown == hangUp) {
                return tileHang * 118 + 55;
            }
            return posLocation.y;
            // this.tile.setPosition(posLocation);
        }
    }
    onTouchEnd() {
        tileManager.instance.isShowBlock(true);
        // console.log('----------move end ----------');
        let finHang = Math.floor((this.tile.position.y - 55) / 118);
        let finLie = Math.floor((this.tile.position.x) / 118);
        // console.log(finHang, finLie);
        this.tile.setPosition(v3(finLie * 118 + 55, finHang * 118 + 55, 0));
        let hang: number = finHang;
        let hasdelete = false;
        for (let i = finHang; i >= 0; i--) {
            if (tileManager.instance.tileData[i][finLie] == 0) {
                hang = i;
                if (i > 0) {
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
        }


        // console.log(this.currentNum);

        if (hang != finHang) {

        } else {

        }
        tween(this.tile)
            .to(this.delayTime, { position: v3(finLie * 118 + 55, hang * 118 + 55, 0) })
            // .union()

            // .call(() => {


            // })
            .repeat(1)
            .start();

        setTimeout(() => {
            tileManager.instance.isShowBlock(false);
            tileManager.instance.tileData[hang][finLie] = this.currentNum;
            if (hasdelete) {
                if (tileManager.instance.tileMap[hang][finLie]) {
                    tileManager.instance.tileMap[hang][finLie].fresh(this.currentNum);
                }
            }
            // console.log(tileManager.instance.tileData);
            this.currentNum = 0;
        }, 1000 * this.delayTime);
    }

    checkSameAdd() {

    }


    start() {

    }


}

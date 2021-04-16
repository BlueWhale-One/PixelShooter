
import { _decorator, Component, Node, Label, SpriteFrame, SpriteAtlas, Sprite, color } from 'cc';
const { ccclass, property } = _decorator;

enum Color {

}


@ccclass('Tile')
export class Tile extends Component {
    @property(Label)
    Lable!: Label;
    @property(Sprite)
    bg!: Sprite;
    @property(SpriteAtlas)
    atlas!: SpriteAtlas;

    number!: number;
    hang!: number;
    lie!: number;

    color = [
        color(94, 196, 226),
        color(190, 217, 80),
        color(216, 107, 176),
        color(218, 131, 131),
        color(70, 210, 145),
        color(132, 137, 218),
        color(217, 210, 100),
        color(179, 111, 229),
        color(94, 196, 226),
        color(190, 217, 80),
        color(216, 107, 176),
        color(218, 131, 131),
        color(70, 210, 145),
        color(132, 137, 218),
        color(217, 210, 100),
        color(179, 111, 229),
    ]

    onLoad() {

    }

    init(num: number, hang: number, lie: number) {
        this.number = num;
        this.Lable.string = '' + num;
        this.node.name = '' + num;
        this.bg.color = this.color[num - 1];
        this.hang = hang;
        this.lie = lie;
    }

    // fresh(num: number) {
    //     this.Lable.string = '' + num;
    // }

    ondestroy() {

    }
}


import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    @property(Label)
    Lable!: Label;

    number!: number;

    onLoad() {

    }

    init(num: number) {
        this.number = num;
        this.Lable.string = '' + num;
        this.node.name = '' + num;
    }

    fresh(num: number) {
        this.Lable.string = '' + num;
    }
}

import Map, { FloorNode } from "../Map";
import MapTool, { MapToolProps } from "./MapTool";

class AddStairsTool extends MapTool<MapToolProps, any> {

    public constructor(props) {
        super(props);
        this.state = {
            cursor: 'crosshair',
        };
    }

    public onDown (e: React.PointerEvent): void {
        if (!this.props.map.isFloor(this.props.map.state.currentFloor+1)) return;
        const a: FloorNode = {
            floor: this.props.map.state.currentFloor,
            node: {
                _type: 'stairs_up',
                id: Date.now(),
                x: this.props.map.winX2map(e.clientX),
                y: this.props.map.winY2map(e.clientY),
                edges: [],
                body: {},
            },
        };
        setTimeout(() => {
            const b: FloorNode = {
                floor: this.props.map.state.currentFloor+1,
                node: {
                    _type: 'stairs_down',
                    id: Date.now(),
                    x: this.props.map.winX2map(e.clientX),
                    y: this.props.map.winY2map(e.clientY),
                    edges: [],
                    body: {
                        lower: a.node.id,
                    },
                },
            };
            a.node.body!.upper = b.node.id;
            this.props.map.addStairs(a, b);
        }, 2);
    }
}

export default AddStairsTool;
import * as Cesium from 'cesium';

type eventCallBack = {
    'LEFT_CLICK': Function | null,
    'MOUSE_MOVE': Function | null,
    'DRAW_EXTENT': Function | null
}
export default class EarthMap {
    public viewer;
    protected drawExtentHandler: Cesium.ScreenSpaceEventHandler | undefined;
    protected selectEntiyHandler: Cesium.ScreenSpaceEventHandler | undefined;
    protected eventHandler: eventCallBack = {
        'LEFT_CLICK': null,
        'MOUSE_MOVE': null,
        'DRAW_EXTENT': null
    }
    constructor(protected domId: string) {
        let url: string;
        if (import.meta.env.DEV) {
            url = `192.168.2.5:7749`;
        }
        else {
            let href = window.document.location.href;
            url = /[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+/.exec(href)![0];
        }
        let baseImagery = new Cesium.UrlTemplateImageryProvider({
            url: `http://${url}/tiles/world/{tileCode}.jpg`,
            minimumLevel: 1,
            maximumLevel: 6,
            customTags: {
                tileCode: function (_: any, x: number, y: number, level: number) {
                    let rowCode = y.toString(2).padStart(level, '0');
                    let colCode = x.toString(2).padStart(level, '0');
                    let morton = '';
                    for (let i = 0; i < level; i++) {
                        morton += rowCode.charAt(i);
                        morton += colCode.charAt(i);
                    }
                    let num = Number.parseInt(morton, 2);
                    let tileCode = num.toString(4).padStart(level, '0');
                    return tileCode;
                }
            }
        })
        let viewer = new Cesium.Viewer(domId, {
            imageryProvider: baseImagery,
            baseLayerPicker: false,
            animation: false,
            timeline: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            selectionIndicator: false,
            fullscreenButton: false
        });
        this.viewer = viewer;
        // if (navigator.onLine && import.meta.env.DEV) {
        //     viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
        //         url: "https://dev.virtualearth.net",
        //         key: "AsO_dDf7ndOheuvb2M7jbrhAIWvODGcuIrjBa6v3gJ5WcjhWCM8d5k842C4K5JBb",
        //         mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS_ON_DEMAND
        //     }));
        // }
        let dom = viewer.cesiumWidget.creditContainer as HTMLElement;
        dom.style.display = "none";
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(110, 20, 1e7),
        });
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;
        this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.selectEntity(true);
    }

    on(type: keyof eventCallBack, callback: Function) {
        this.eventHandler[type] = callback;
    }

    dispatchEvent(type: keyof eventCallBack, ...data: any) {
        if (this.eventHandler[type]) {
            this.eventHandler[type]!(...data);
        }
    }

    addTiles(addr: string, min: number, max: number, ext: number[] | undefined = undefined) {
        let rectangle = ext ? Cesium.Rectangle.fromDegrees(...ext) : undefined;
        let imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: `http://${addr}/{tileCode}.jpg`,
            minimumLevel: min,
            maximumLevel: max,
            rectangle: rectangle,
            customTags: {
                tileCode: function (_: any, x: number, y: number, level: number) {
                    let rowCode = y.toString(2).padStart(level, '0');
                    let colCode = x.toString(2).padStart(level, '0');
                    let morton = '';
                    for (let i = 0; i < level; i++) {
                        morton += rowCode.charAt(i);
                        morton += colCode.charAt(i);
                    }
                    let num = Number.parseInt(morton, 2);
                    let tileCode = num.toString(4).padStart(level, '0');
                    return tileCode;
                },
            },
        });
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    }

    addImage(url: string, left: number, bottom: number, right: number, top: number) {
        let rectangle = Cesium.Rectangle.fromDegrees(left, bottom, right, top);
        return this.viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: url,
            rectangle: rectangle
        }));
    }
    removeImage(layer: Cesium.ImageryLayer) {
        this.viewer.imageryLayers.remove(layer);
    }
    addPoint(lon: number, lat: number) {
        return this.viewer.entities.add({
            // fromDegrees（经度，纬度，高度，椭球，结果）从以度为单位的经度和纬度值返回Cartesian3位置
            position: Cesium.Cartesian3.fromDegrees(lon, lat),
            point: {
                // 点的大小（像素）
                pixelSize: 10,
                // 点位颜色，fromCssColorString 可以直接使用CSS颜色
                color: Cesium.Color.fromCssColorString('#ee0000'),
                // 边框颜色
                outlineColor: Cesium.Color.fromCssColorString('#fff'),
                // 边框宽度(像素)
                outlineWidth: 2,
                // 是否显示
                show: true
            },
            // label: {
            //     // 文本。支持显式换行符“ \ n”
            //     text: '测试名称',
            //     // 字体样式，以CSS语法指定字体
            //     font: '14pt Source Han Sans CN',
            //     // 字体颜色
            //     fillColor: Cesium.Color.BLACK,
            //     // 背景颜色
            //     backgroundColor: Cesium.Color.AQUA,
            //     // 是否显示背景颜色
            //     showBackground: true,
            //     // 字体边框颜色
            //     outlineColor: Cesium.Color.WHITE,
            //     // 字体边框尺寸
            //     outlineWidth: 10,
            //     // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
            //     scale: 1.0,
            //     // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
            //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //     // 相对于坐标的水平位置
            //     verticalOrigin: Cesium.VerticalOrigin.CENTER,
            //     // 相对于坐标的水平位置
            //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            //     // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
            //     pixelOffset: new Cesium.Cartesian2(0, -20),
            //     // 是否显示
            //     show: false
            // }
        });
    }
    removeTarget(target: Cesium.Entity) {
        this.viewer.entities.remove(target);
    }
    zoomTo(target: Cesium.ImageryLayer | Cesium.Entity | Cesium.Entity[]) {
        this.viewer.zoomTo(target);
    }
    flyTo(target: Cesium.ImageryLayer | Cesium.Entity | Cesium.Entity[]) {
        this.viewer.flyTo(target, { duration: 1 });
    }
    selectEntity(enable: boolean) {
        if ((this.selectEntiyHandler && enable) || (!this.selectEntiyHandler && !enable)) return;
        if (enable) {
            //初始化鼠标事件
            this.selectEntiyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
            this.selectEntiyHandler.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                let feature = this.viewer.scene.pick(e.position);
                if (Cesium.defined(feature)) {
                    this.dispatchEvent('LEFT_CLICK', feature.id);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            this.selectEntiyHandler.setInputAction((e: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
                let feature = this.viewer.scene.pick(e.endPosition);
                if (Cesium.defined(feature)) {
                    this.viewer.canvas.style.cursor = 'pointer';
                    this.dispatchEvent('MOUSE_MOVE', feature.id);
                }
                else {
                    this.viewer.canvas.style.cursor = 'default';
                    this.dispatchEvent('MOUSE_MOVE');
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        else {
            this.selectEntiyHandler!.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.selectEntiyHandler!.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.selectEntiyHandler = undefined;
        }
    }
    drawExtent(enable: boolean) {
        if ((this.drawExtentHandler && enable) || (!this.drawExtentHandler && !enable)) return;

        if (enable) {
            let drawPoint: Cesium.Cartesian3[] = [];
            let box: Cesium.Entity | null;
            //绘框事件
            this.drawExtentHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
            this.drawExtentHandler.setInputAction((e: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                let ellipsoid = this.viewer.scene.globe.ellipsoid;
                let cartesian = this.viewer.camera.pickEllipsoid(e.position, ellipsoid);
                if (Cesium.defined(cartesian)) {
                    if (drawPoint.length === 0) {
                        drawPoint.push(cartesian!);
                    }
                    else if (drawPoint.length === 2) {
                        //获取框选范围经纬度
                        drawPoint.pop();
                        drawPoint.push(cartesian!);
                        let rectangle = Cesium.Rectangle.fromCartesianArray(drawPoint);
                        let result = {} as Cesium.Cartographic;
                        let cartographic = Cesium.Rectangle.southwest(rectangle, result);
                        let lon1 = Cesium.Math.toDegrees(result.longitude);
                        let lat1 = Cesium.Math.toDegrees(result.latitude);
                        cartographic = Cesium.Rectangle.northeast(rectangle, result);
                        let lon2 = Cesium.Math.toDegrees(result.longitude);
                        let lat2 = Cesium.Math.toDegrees(result.latitude);
                        let ext = [lon1, lat1, lon2, lat2];
                        //转交数据
                        this.dispatchEvent('DRAW_EXTENT', ext);

                        //清除绘制的矩形实体
                        this.viewer.entities.remove(box!);
                        drawPoint.length = 0;
                        box = null;
                    }
                }

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            this.drawExtentHandler.setInputAction((e: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
                if (drawPoint.length > 0) {
                    let ellipsoid = this.viewer.scene.globe.ellipsoid;
                    let cartesian = this.viewer.camera.pickEllipsoid(e.endPosition, ellipsoid);
                    if (Cesium.defined(cartesian)) {
                        if (drawPoint.length === 1) {
                            drawPoint.push(cartesian!);
                            box = this.viewer.entities.add({
                                rectangle: {
                                    coordinates: new Cesium.CallbackProperty(function () {
                                        return Cesium.Rectangle.fromCartesianArray(drawPoint);
                                    }, false),
                                    material: Cesium.Color.fromCssColorString('#3887ff').withAlpha(0.5),
                                    outlineColor: Cesium.Color.fromCssColorString('#002896'),
                                    outline: true,
                                    height: 0,
                                }
                            });
                        }
                        else if (drawPoint.length === 2) {
                            drawPoint.pop();
                            drawPoint.push(cartesian!);
                        }
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.viewer.canvas.style.cursor = 'crosshair';
        }
        else {
            this.drawExtentHandler!.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.drawExtentHandler!.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.drawExtentHandler = undefined;
        }
    }
}
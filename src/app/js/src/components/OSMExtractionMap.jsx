import React, { Component } from 'react';
import { bool, func, object, oneOf } from 'prop-types';
import { connect } from 'react-redux';
import {
    Map as ReactLeafletMap,
    TileLayer,
    ZoomControl,
    GeoJSON,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

import {
    cancelDrawing,
    completeDrawing,
} from '../actions.ui';

import {
    basemapTilesUrl,
    basemapAttribution,
    basemapMaxZoom,
    initialMapCenter,
    initialMapZoom,
    drawToolTypeEnum,
    areaOfInterestStyle,
    overpassDataStyle,
} from '../constants';


class OSMExtractionMap extends Component {
    constructor(props) {
        super(props);
        this.handleDrawAreaOfInterest = this.handleDrawAreaOfInterest.bind(this);
        this.handleCancelDrawing = this.handleCancelDrawing.bind(this);
    }

    componentDidMount() {
        const {
            leafletMap: {
                leafletElement,
            },
        } = this;

        leafletElement.on(
            L.Draw.Event.DRAWSTOP,
            this.handleCancelDrawing,
        );

        leafletElement.on(
            L.Draw.Event.CREATED,
            this.handleDrawAreaOfInterest,
        );

        this.rectangleDrawHandler = new L.Draw.Rectangle(leafletElement, {
            shapeOptions: areaOfInterestStyle,
        });

        this.polygonDrawHandler = new L.Draw.Polygon(leafletElement, {
            shapeOptions: areaOfInterestStyle,
        });
    }

    componentDidUpdate({ drawingActive: drawingWasActive }) {
        const {
            drawTool,
            drawingActive,
        } = this.props;

        if (drawingActive === drawingWasActive) {
            return null;
        }

        if (drawingActive) {
            switch (drawTool) {
                case drawToolTypeEnum.box:
                    this.rectangleDrawHandler.enable();
                    break;
                case drawToolTypeEnum.shape:
                    this.polygonDrawHandler.enable();
                    break;
                default:
                    window.console.warn('invalid draw tool type');
                    break;
            }
        } else {
            this.polygonDrawHandler.disable();
            this.rectangleDrawHandler.disable();
        }

        return null;
    }

    handleDrawAreaOfInterest({ layer }) {
        return this.props.dispatch(completeDrawing(layer.toGeoJSON()));
    }

    handleCancelDrawing() {
        return !this.props.drawnShape ?
            this.props.dispatch(cancelDrawing()) :
            null;
    }

    render() {
        const {
            drawnShape,
            data,
        } = this.props;

        const areaOfInterest = drawnShape ? (
            <GeoJSON
                data={drawnShape}
                style={areaOfInterestStyle}
            />) : null;

        const overpassAPIData = data ? (
            <GeoJSON
                data={data}
                pointToLayer={
                    (_, latLng) => L.circleMarker(latLng, overpassDataStyle)
                }
            />) : null;

        return (
            <ReactLeafletMap
                id="osm-extraction-map"
                ref={(m) => { this.leafletMap = m; }}
                center={initialMapCenter}
                zoom={initialMapZoom}
                zoomControl={false}
            >
                <TileLayer
                    url={basemapTilesUrl}
                    attribution={basemapAttribution}
                    maxZoom={basemapMaxZoom}
                />
                <ZoomControl position="topright" />
                {areaOfInterest}
                {overpassAPIData}
            </ReactLeafletMap>
        );
    }
}

OSMExtractionMap.defaultProps = {
    drawTool: null,
    drawnShape: null,
    data: null,
};

OSMExtractionMap.propTypes = {
    dispatch: func.isRequired,
    drawTool: oneOf(Object.values(drawToolTypeEnum)),
    drawnShape: object, // eslint-disable-line react/forbid-prop-types
    data: object, // eslint-disable-line react/forbid-prop-types
    drawingActive: bool.isRequired,
};

function mapStateToProps({
    ui: {
        drawing: {
            drawTool,
            active: drawingActive,
            drawnShape,
        },
    },
    data: {
        overpass: {
            data,
        },
    },
}) {
    return {
        drawTool,
        drawingActive,
        drawnShape,
        data,
    };
}

export default connect(mapStateToProps)(OSMExtractionMap);
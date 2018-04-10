L.Tooltip.include({

baseInitLayout: L.Tooltip.prototype._initLayout,

_initLayout: function () {

 this.baseInitLayout();

 if (this.options.draggable) {
   this._contentNode.setAttribute('draggable', true);

   var div = this._contentNode;

   if (L.TooltipDrag) {

   var draggable = this.options.draggable;

     if (this.dragging) {
       draggable = this.dragging.enabled();
       this.dragging.disable();
     }

     this.dragging = new L.TooltipDrag(this);

     var dragEnabled = this.options.dragEnabled;
     if (dragEnabled) {
       this.dragging.enable();
     }
     else {
       this.dragging.disable();
     }
   }
 }

},

// override onAdd to make clickable even for map.openTooltip
// see https://github.com/Leaflet/Leaflet/issues/5974
baseOnAdd: L.Tooltip.prototype.onAdd,

onAdd: function (map) {
 this.baseOnAdd(map);

 if (this.options.interactive && this._container) {
   L.DomUtil.addClass(this._container, 'leaflet-clickable');
   this.addInteractiveTarget(this._container);
 }
},


_setPosition: function (pos) {
 var map = this._map,
   container = this._container,
   centerPoint = map.latLngToContainerPoint(map.getCenter()),
   tooltipPoint = map.layerPointToContainerPoint(pos),
   direction = this.options.direction,
   tooltipWidth = container.offsetWidth,
   tooltipHeight = container.offsetHeight,
   offset = L.point(this.options.offset),
   anchor = this._getAnchor();

 L.DomUtil.removeClass(container, 'leaflet-tooltip-right');
 L.DomUtil.removeClass(container, 'leaflet-tooltip-left');
 L.DomUtil.removeClass(container, 'leaflet-tooltip-top');
 L.DomUtil.removeClass(container, 'leaflet-tooltip-bottom');
 L.DomUtil.removeClass(container, 'leaflet-tooltip-center');

 if (direction.split(' ').length > 1) {
   var directions = direction.split(' ');
   for (var i = 0; i < directions.length; i++) {
     direction = directions[i];
     if (direction === 'top') {
       pos = pos.add(L.point(0, -tooltipHeight + offset.y + anchor.y, true));
     } else if (direction === 'bottom') {
       pos = pos.subtract(L.point(0, -offset.y, true));
     } else if (direction === 'center') {
       pos = pos.subtract(L.point(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true));
     } else if (direction === 'right' ) {
       pos = pos.add(L.point(offset.x + anchor.x, 0, true));
     } else {
       direction = 'left';
       pos = pos.subtract(L.point(tooltipWidth + anchor.x - offset.x, 0, true));
     }
     L.DomUtil.addClass(container, 'leaflet-tooltip-' + direction);
   }
 }
 else {
   if (direction === 'top') {
     pos = pos.add(L.point(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y, true));
   } else if (direction === 'bottom') {
     pos = pos.subtract(L.point(tooltipWidth / 2 - offset.x, -offset.y, true));
   } else if (direction === 'center') {
     pos = pos.subtract(L.point(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true));
   } else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
     direction = 'right';
     pos = pos.add(L.point(offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y, true));
   } else {
     direction = 'left';
     pos = pos.subtract(L.point(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y, true));
   }
   L.DomUtil.addClass(container, 'leaflet-tooltip-' + direction);
 }
 L.DomUtil.setPosition(container, pos);
},
});

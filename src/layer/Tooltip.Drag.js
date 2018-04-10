/*
 * L.Handler.TooltipDrag is used internally by L.Tooltip to make the tooltips draggable.
 */


/* @namespace Tooltip
 * @section Interaction handlers
 *
 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
 *
 * ```js
 * tooltip.dragging.disable();
 * ```
 *
 * @property dragging: Handler
 * Tooltip dragging handler (by both mouse and touch).
 */

 /*
  * L.Handler.TooltipDrag is used internally by L.Tooltip to make the tooltips draggable.
  */

 /* @namespace Tooltip
  * @section Interaction handlers
  *
  * Interaction handlers are properties of a tooltip instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
  *
  * ```js
  * tooltip.dragging.disable();
  * ```
  *
  * @property dragging: Handler
  * Tooltip dragging handler (by both mouse and touch).
  */

L.TooltipDrag = L.Handler.extend({
  initialize: function (tooltip) {
      this._tooltip = tooltip;
  },

  addHooks: function () {
      // var icon = this._tooltip._icon;

      if (!this._draggable) {

          this._draggable = new L.Draggable(this._tooltip._contentNode, this._tooltip._contentNode, true);
      }

      this._draggable.on({
          dragstart: this._onDragStart,
          drag: this._onDrag,
          dragend: this._onDragEnd
      }, this).enable();

  },

  removeHooks: function () {
      this._draggable.off({
          dragstart: this._onDragStart,
          drag: this._onDrag,
          dragend: this._onDragEnd
      }, this).disable();
  },

  moved: function () {
      return this._draggable && this._draggable._moved;
  },

  moving: function () {
      return this._draggable && this._draggable._moving;
  },

  _onDragStart: function (e) {
      // @section Dragging events
      // @event dragstart: Event
      // Fired when the user starts dragging the tooltip.

      // @event movestart: Event
      // Fired when the tooltip starts moving (because of dragging).

      this._oldLatLng = this._tooltip.getLatLng();
      this._tooltip
          .fire('movestart')
          .fire('dragstart');

      //var width = this._container.offsetWidth;
      //var height = this._container.offsetHeight;


      this._contStartPos = L.DomUtil.getPosition(this._tooltip._container);
  },

  _onDrag: function (e) {

      // @event drag: Event
      // Fired repeatedly while the user drags the tooltip.
      this._tooltip
          .fire('move', e)
          .fire('drag', e);
  },

  _onDragEnd: function (e) {

      // @event dragend: DragEndEvent
      // Fired when the user stops dragging the tooltip.

      // @event moveend: Event
      // Fired when the tooltip stops moving (because of dragging).

      this._contFinishPos = L.DomUtil.getPosition(this._tooltip._container);

      var tooltip = this._tooltip,
          map = tooltip._map;

      if (this._tooltip.options.relative) {
          var pos = L.DomUtil.getPosition(tooltip._contentNode);
          var sourcePos;
          if (tooltip._source) {
              if (tooltip._source._latlng) {
                  sourcePos = map.latLngToLayerPoint(tooltip._source._latlng);
              } else if (tooltip._source._latlngs) {
                  sourcePos = map.latLngToLayerPoint(L.latLngBounds(tooltip._source._latlngs).getCenter());
              }
          } else {
              sourcePos = map.latLngToLayerPoint(tooltip._latlng);
          }

          if (sourcePos) {
              var offset = pos.subtract(sourcePos);

              var tooltipAnchor;
              try { tooltipAnchor = tooltip._source._getTooltipAnchor(); } catch (e) { tooltipAnchor = L.point(0, 0); }
              offset = offset.subtract(tooltipAnchor);
              tooltip.options.offset = offset;
              e.offset = offset;
          }
      } else {

          var fp = map.layerPointToLatLng(this._contFinishPos);
          var sp = map.layerPointToLatLng(this._contStartPos);

          var dlat = sp.lat - fp.lat;
          var dlng = sp.lng - fp.lng;

          var newLatLng = L.latLng(this._oldLatLng.lat - dlat,  this._oldLatLng.lng - dlng);
          tooltip.setLatLng(newLatLng);
          e.newLatLng = newLatLng;
      }

      this._tooltip
          .fire('moveend')
          .fire('dragend', e);


      delete this._oldLatLng;
  }
    });

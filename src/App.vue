<template>
<div id="app">
  <viewer :images="imageArr">
    <waterfall :align="align" :grow="grow" :line-gap="200" :watch="items" @reflowed="reflowed" ref="waterfall">
      <waterfall-slot v-for="(item, index) in items" :width="item.width" :height="item.height" :order="index" :key="item.index" move-class="item-move">
        <img class="item" :title="item.datetime" :id="'item'+item.index" style="width:100%;height:100%" :index="item.index" :src="item.path">
      </waterfall-slot>
    </waterfall>
  </viewer>
</div>
</template>

<script>
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
export default {
  components: {
    Waterfall,
    WaterfallSlot
  },
  data() {
    return {
      grow: [2, 1, 1, 1],
      imageArr: [],
      align: 'center',
      items: [],
      isBusy: false
    }
  },
  created() {
    let _this = this;
    _this.imageArr = require.context('../public/images', false, /.jpg$/).keys();
    _this.imageArr.forEach(function (str, i) {
      _this.imageArr[i] = "../images" + str.substring(1);
    })
    _this.imageArr.forEach(function (str, i) {
      _this.items[i] = {
        index: i++,
        width: 1,
        height: 1,
        path: str,
        datetime: '',
        lon: '',
        lat: '',
        orientation: 0,
      }
    })
  },
  mounted() {
    var _this = this;
    for (let i = 0; i < $('.item').length; i++) {
      (function () {
        EXIF.getData($('.item')[i], function () {
          var obj = EXIF.getAllTags(this);
          _this.$set(_this.items[i], 'datetime', obj.DateTime)
          _this.$set(_this.items[i], 'lat', _this.DegreeConvertBack(`${obj.GPSLatitude[0].numerator}°${obj.GPSLatitude[1].numerator}'${obj.GPSLatitude[2].numerator}"`))
          _this.$set(_this.items[i], 'lon', _this.DegreeConvertBack(`${obj.GPSLongitude[0].numerator}°${obj.GPSLongitude[1].numerator}'${obj.GPSLongitude[2].numerator}"`))
          _this.$set(_this.items[i], 'orientation', obj.Orientation)
          if (obj.ImageWidth) {
            _this.$set(_this.items[i], 'width', obj.ImageWidth / 12)
          }
          if (obj.ImageHeight) {
            _this.$set(_this.items[i], 'height', obj.ImageHeight / 12)
          }
          // _this.items[i].datetime = obj.Datetime;
          // _this.items[i].lat = _this.DegreeConvertBack(`${obj.GPSLatitude[0].numerator}°${obj.GPSLatitude[1].numerator}'${obj.GPSLatitude[2].numerator}"`)
          // _this.items[i].lon = _this.DegreeConvertBack(`${obj.GPSLongitude[0].numerator}°${obj.GPSLongitude[1].numerator}'${obj.GPSLongitude[2].numerator}"`)
          // _this.items[i].orientation = obj.Orientation;
          // _this.items[i].width = obj.ImageWidth/12; 
          // _this.items[i].height = obj.ImageHeight/12;
        });
      })()
    }
    document.body.addEventListener('click', function () {
      _this.shuffle()
    }, false)
  },
  methods: {
    DegreeConvertBack(value) {
      var d = value.split("°")[0];
      var f = value.split("°")[1].split("'")[0];
      var m = value.split("°")[1].split("'")[1].split('"')[0];
      var f = parseFloat(f) + parseFloat(m / 60);
      var du = parseFloat(f / 60) + parseFloat(d);
      return du;
    },
    shuffle: function () {
      this.items.sort(function () {
        return Math.random() - 0.5
      })
    },
    reflowed: function () {
      this.isBusy = false
    }
  }
}
</script>

<style>
body {
  margin: 5px;
  font-family: Helvetica, sans-serif;
}

.item {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  font-size: 1.2em;
  color: rgb(0, 158, 107);
}

.item:after {
  content: attr(index);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

.wf-transition {
  transition: opacity .3s ease;
  -webkit-transition: opacity .3s ease;
}

.wf-enter {
  opacity: 0;
}

.item-move {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
  -webkit-transition: all .5s cubic-bezier(.55, 0, .1, 1);
}
</style>

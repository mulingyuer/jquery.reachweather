; (function ($) {
  $.extend({
    reachweather: function (option) {
      /* option参数
      * baidukye:百度的开发者key
      * amapkey: 高德开发者key
      */
      if (!option.baidukey) {
        throw new Error('参数baidukey没有传入开发者key');
      };
      if (!option.amapkey) {
        throw new Error('参数amapkey没有传入开发者key');
      };
      if (!option.success) {
        throw new Error('没有传入sccess');
      } else {
        const fn = Object.prototype.toString.call(option.success);
        if (fn.substring(1, fn.length - 1).split(/\s/)[1].toLowerCase() !== 'function') {
          throw new Error('传入的success错误，它不是一个function！');
        }
      };

      let $script = $('<script></script>');
      let body = document.getElementsByTagName('body')[0];
      /*加载完毕*/
      $script.on('load', function () {
        const country = returnCitySN.cname.toLowerCase();
        if (country.match('china')) {
          baiduGetAddress(returnCitySN.cip);
        } else {
          throw new Error('当前插件不支持国外天气获取！');
        };
      })
      $script.attr('src', 'https://pv.sohu.com/cityjson?ie=utf-8');
      body.appendChild($script[0]);
      /*百度获取城市*/
      function baiduGetAddress(ip) {
        $.ajax({
          url: 'https://api.map.baidu.com/location/ip',
          data: {
            ak: option.baidukey,
            ip: ip
          },
          type: 'GET',
          dataType: 'jsonp',
          success: function (data) {
            const city = data['content']['address_detail']['city'];
            if (city) {
              getAmapWeather(city);
            } else {
              error('无法获取到当前所在的city（城市）');
            };
          },
          error: function (xhr, status, error) {
            const errorCode = xhr.status;
            switch (errorCode) {
              case '1':
                error('百度服务响应超时或系统内部错误，错误码： ' + errorCode);
                break;
              case '101':
                error('请求消息没有携带百度key，错误码： ' + errorCode);
                break;
              case '200':
                error('APP不存在，AK有误请检查再重试，错误码： ' + errorCode);
                break;
              case '210':
                error('APP IP校验失败，错误码： ' + errorCode);
                break;
              case '211':
                error('APP SN校验失败 ，错误码： ' + errorCode);
                break;
              case '220':
                error('APP Referer校验失败，错误码： ' + errorCode);
                break;
              case '240':
                error('APP 服务被禁用，错误码： ' + errorCode);
                break;
              case '250':
                error('用户不存在，错误码： ' + errorCode);
                break;
              case '260':
                error('服务不存在，错误码： ' + errorCode);
                break;
              case '261':
                error('服务被禁用，错误码： ' + errorCode);
                break;
              case '301':
                error('永久配额超限，限制访问，错误码： ' + errorCode);
                break;
              case '302':
                error('天配额超限，限制访问 ，错误码： ' + errorCode);
                break;
              case '401':
                error('当前并发量已经超过约定并发配额，限制访问，错误码： ' + errorCode);
                break;
              case '402':
                error('当前并发量已经超过约定并发配额，并且服务总并发量也已经超过设定的总并发配额，限制访问，错误码： ' + errorCode);
                break;
              case '1001':
                error('没有IPv6地址访问的权限，错误码：' + errorCode);
                break;
              default:
                error('未定义的错误，错误码：' + errorCode);
            };
          }
        });
      };
      /*高德获取天气*/
      function getAmapWeather(city) {
        $.ajax({
          url: 'https://restapi.amap.com/v3/weather/weatherInfo',
          data: {
            key: option.amapkey,
            city: city
          },
          type: 'GET',
          success: function (data) {
            if (data.status) {
              const lives = data['lives'][0];
              option.success(lives);
            } else {
              error('获取天气服务器返回失败，错误消息：' + data.info + '状态码：' + data.infocode);
            };
          },
          error: function (xhr) {
            const errorCode = xhr.status;
            error('最后一步获取天气时ajax出错，错误码：' + errorCode);
          }
        });
      };
      /*错误输出*/
      function error(text) {
        throw new Error(text);
      };
    }
  });
})(jQuery);
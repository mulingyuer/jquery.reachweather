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
        if (!country.match('china')) {
          amapIpPost(returnCitySN.cip)
        } else {
          baiduGetAddress(returnCitySN.cip);
        };
      })
      $script.attr('src', 'https://pv.sohu.com/cityjson?ie=utf-8');
      body.appendChild($script[0]);


      /*高德ip定位*/
      function amapIpPost(ip) {
        $.ajax({
          url: 'https://restapi.amap.com/v3/ip',
          data: {
            key: option.amapkey,
            ip: ip
          },
          type: 'GET',
          success: function (data) {
            if (data.status === '1') {
              const city = data['city'];
              if (typeof city === 'string') {
                getAmapWeather(city);
              } else {
                throw new Error('当前插件不支持国外天气获取！');
              };
            } else {
              weaher_Error('通过高德ip定位出错，错误消息：' + data.info + '状态码：' + data.infocode);
            };
          },
          error: function (xhr) {
            const errorCode = xhr.status;
            weaher_Error('通过高德ip定位出错，错误码：' + errorCode);
          }
        });
      };
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
              weaher_Error('无法获取到当前所在的city（城市）');
            };
          },
          error: function (xhr, status, error) {
            const errorCode = xhr.status;
            switch (errorCode) {
              case 1:
                weaher_Error('百度服务响应超时或系统内部错误，错误码： ' + errorCode);
                break;
              case 101:
                weaher_Error('请求消息没有携带百度key，错误码： ' + errorCode);
                break;
              case 200:
                weaher_Error('APP不存在，AK有误请检查再重试，错误码： ' + errorCode);
                break;
              case 210:
                weaher_Error('APP IP校验失败，错误码： ' + errorCode);
                break;
              case 211:
                weaher_Error('APP SN校验失败 ，错误码： ' + errorCode);
                break;
              case 220:
                weaher_Error('APP Referer校验失败，错误码： ' + errorCode);
                break;
              case 240:
                weaher_Error('APP 服务被禁用，错误码： ' + errorCode);
                break;
              case 250:
                weaher_Error('用户不存在，错误码： ' + errorCode);
                break;
              case 260:
                weaher_Error('服务不存在，错误码： ' + errorCode);
                break;
              case 261:
                weaher_Error('服务被禁用，错误码： ' + errorCode);
                break;
              case 301:
                weaher_Error('永久配额超限，限制访问，错误码： ' + errorCode);
                break;
              case 302:
                weaher_Error('天配额超限，限制访问 ，错误码： ' + errorCode);
                break;
              case 401:
                weaher_Error('当前并发量已经超过约定并发配额，限制访问，错误码： ' + errorCode);
                break;
              case 402:
                weaher_Error('当前并发量已经超过约定并发配额，并且服务总并发量也已经超过设定的总并发配额，限制访问，错误码： ' + errorCode);
                break;
              case 1001:
                weaher_Error('没有IPv6地址访问的权限，错误码：' + errorCode);
                break;
              default:
                weaher_Error('未定义的错误，错误码：' + errorCode);
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
            if (data.status === '1') {
              const lives = data['lives'][0];
              option.success(lives);
            } else {
              weaher_Error('获取天气服务器返回失败，错误消息：' + data.info + '状态码：' + data.infocode);
            };
          },
          error: function (xhr) {
            const errorCode = xhr.status;
            weaher_Error('最后一步获取天气时ajax出错，错误码：' + errorCode);
          }
        });
      };
      /*错误输出*/
      function weaher_Error(text) {
        throw new Error(text);
      };
    }
  });
})(jQuery);
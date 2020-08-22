<template>
  <div>
    <div>
      <!-- share -->
      <div v-if="!isLocaleCN && !isMiniApp">
        <div class="title">Share to Friends</div>
        <ShareIcons></ShareIcons>
      </div>

      <!-- WeChat notification, for CN only -->
      <div v-if="isLocaleCN">
        <div class="title">实时更新订阅</div>
        <div class="mBlock" style="text-align: center;padding:30px">
          <div>
            微信扫描或长按下方二维码，或搜索"
            <span style="text-wrap: none">UCLCSSA学联社区</span>"
          </div>
          <img src="../assets/qr.png" style="max-width: 260px;" />
          <div>订阅每日实时数据更新及重要预警通知</div>
          <div
            v-if="isLocaleCN && isWeChat()"
            style="margin-top: 20px;text-align:center;user-select: none;"
          >
            <hr />
            <div style="font-size: 20px;">本应用地址</div>
            <div
              style="font-size: 25px;font-weight:bold;padding: 10px 0;user-select: text;"
            >covid19.uclcssa.cn</div>长按复制即可分享给其他人
          </div>
        </div>

        <!-- Mini app fallback (as not external link should exists) -->
        <div v-if="isMiniApp">
          <br />
          <div class="title">{{ $t('subtitles.about') }}</div>
          <ul>
            <li>请使用浏览器访问 covid19.uclcssa.cn 以获取本页面数据来源及更新时间</li>
            <li>本页面开源于Github，欢迎提供任何建议及贡献！</li>
            <li>作者：©2020 Henry (@henryz00), Davies (@DaviesXue) | UCLCSSA 伦敦大学学院中国学联</li>
          </ul>
        </div>
      </div>

      <!-- source and credits -->
      <div v-if="!isLocaleCN || !isMiniApp">
        <br />
        <div class="title">{{ $t('subtitles.source') }}</div>
        <ul>
          <li>
            <a href="https://github.com/isjeffcom/coronvirusFigureUK">
              Coronavirus UK Data API -
              isjeffcom
            </a>
          </li>
          <li>
            <a href="https://github.com/CSSEGISandData/COVID-19">
              COVID-19 Data Repository - Johns
              Hopkins CSSE
            </a>
          </li>
          <li>
            <a href="https://apify.com/covid-19">COVID-19 Data APIs for statistics - APIFY</a>
          </li>
          <li>
            <a href="https://github.com/ExpDev07/coronavirus-tracker-api">
              Coronavirus Tracker API -
              ExpDev07
            </a>
          </li>
          <li>
            <a
              href="https://github.com/nytimes/covid-19-data"
            >Coronavirus Data in the United States - The New York Times</a>
          </li>
          <li>
            <a
              href="https://bl.ocks.org/jrzief/70f1f8a5d066a286da3a1e699823470f"
            >D3 Bar Chart Races (Based on) - jrzief</a>
          </li>
          <li>
            <a href="https://www.iconfinder.com/p/coronavirus-awareness-icons">
              Coronavirus Awareness
              Icons - iconfinder
            </a>
          </li>
          <li>{{lastUpdated}}</li>
        </ul>

        <div class="title">{{ $t('subtitles.about') }}</div>
        <ul>
          <li>
            This project is open sourced at
            <a
              href="https://github.com/henryz00/COVID-19-Data-Visualizer-UK"
            >Github Repository</a>,
            pull requests and issues welcomed!
          </li>
          <li>
            © 2020
            <a href="https://github.com/henryz00">@henryz00</a> and
            <a href="https://github.com/DaviesXue">@DaviesXue</a>
            <span>{{isLocaleCN ? " | UCLCSSA 伦敦大学学院中国学联" : " at University College London."}}</span>
          </li>
        </ul>
        <div style="font-size:14px; opacity:0.5;">
          You are free to distribute, embed or edit whole or part of the site without prior notice to us, as long as
          you mention the source (covid19track.site or covid19.uclcssa.cn) or keep this section intact. Please see the github repo for more
          information if you would like to modify the source code :)
        </div>
      </div>

      <!-- logo and language switch -->
      <div style="text-align: center;margin: 50px 0;opacity: 0.5;color: silver;">
        <img src="../assets/logo_grey.png" style="max-width: 200px;" v-if="isLocaleCN" />
        <br />
        <br />
        <a href="#" @click="changeLang('en')">English</a> |
        <a href="#" @click="changeLang('zh')">中文</a>
      </div>
    </div>

    <div v-if="isMiniApp && isLocaleCN && !showWechatPopup">
      <MiniAppPostOverlay></MiniAppPostOverlay>
    </div>
  </div>
</template>

<script>
import ShareIcons from "./ShareIcons.vue";
import MiniAppPostOverlay from "./MiniAppPostOverlay.vue";

export default {
  name: "Credits",
  props: ["isMiniApp", "isLocaleCN", "isWeChat", "showWechatPopup", "lastUpdated", "changeLang"],
  components: {
    MiniAppPostOverlay,
    ShareIcons,
  },
};
</script>
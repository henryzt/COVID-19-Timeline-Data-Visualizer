<!--ref https://codepen.io/ruslan_khomiak/pen/QGmwMP-->
<template>
    <div class="fab">
  <span class="fab-action-button">
        <i class="fab-action-button__icon"><SettingsIcon></SettingsIcon></i>
    </span>
        <ul class="fab-buttons">
            <li class="fab-buttons__item">
                <a href="#share" class="fab-buttons__link" :data-tooltip="$t('fab.share')">
                    <ShareIcon></ShareIcon>
                </a>
            </li>
            <li class="fab-buttons__item" @click="$emit('switchLayout', true)">
                <a href="javascript:;" class="fab-buttons__link" :data-tooltip="$t('fab.dashboard')">
                    <DashboardIcon></DashboardIcon>
                </a>
            </li>
            <li class="fab-buttons__item" @click="$emit('switchLayout', false)">
                <a href="javascript:;" class="fab-buttons__link" :data-tooltip="$t('fab.scroll')">
                    <ScrollIcon></ScrollIcon>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    import DashboardIcon from 'mdi-vue/ViewDashboard'
    import ScrollIcon from 'mdi-vue/ViewDay'
    import ShareIcon from 'mdi-vue/ShareVariant'
    import SettingsIcon from 'mdi-vue/Cog'
    export default {
        name: "FAB",
        components: {
            DashboardIcon,
            ScrollIcon,
            ShareIcon,
            SettingsIcon
        },
        methods: {
            share(){
                window.ga('send', 'event', "share", "fab-share", '');
                if (navigator.share) {
                    navigator.share({
                        title: 'COVID-19 World Realtime Data Visualizer and Timeline - Coronavirus Nearby Cases Finder',
                        url: 'https://covid19track.site/?source=share'
                    })
                } else {
                    console.log("not supported")
                }
            }
        }
    }
</script>

<style scoped>
    body {
        font-family: Arial, sans-serif;
    }

    .fab {
        position: fixed;
        width: 56px;
        right: 5vh;
        bottom: 5vh;
        margin-left: -28px;
        z-index: 300;
    }

    .fab:hover .fab-buttons {
        opacity: 1;
        visibility: visible;
    }

    .fab:hover .fab-buttons__link {
        transform: scaleY(1) scaleX(1) translateY(-16px) translateX(0px);
    }

    .fab-action-button:hover + .fab-buttons .fab-buttons__link:before {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
        transform-origin: right center 0;
        transition-delay: 0.3s;
    }

    .fab-action-button {
        position: absolute;
        bottom: 0;
        display: block;
        width: 56px;
        height: 56px;
        background-color: #29B6F6;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    }

    .fab-buttons {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 50px;
        list-style: none;
        margin: 0;
        padding: 0;
        opacity: 0;
        visibility: hidden;
        transition: 0.2s;
    }

    .fab-action-button__icon {
        display: inline-block;
        width: 56px;
        height: 56px;
        color: white;
        text-align: center;
        padding-top: 13px;
    }

    .fab-buttons__item {
        display: block;
        text-align: center;
        margin: 12px 0;
    }

    .fab-buttons__link {
        display: inline-block;
        width: 40px;
        height: 40px;
        text-decoration: none;
        background-color: #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        transform: scaleY(0.5) scaleX(0.5) translateY(0px) translateX(0px);
        -moz-transition: .3s;
        -webkit-transition: .3s;
        -o-transition: .3s;
        transition: .3s;
    }

    [data-tooltip]:before {
        top: 50%;
        margin-top: -11px;
        font-weight: 600;
        border-radius: 2px;
        background: #585858;
        color: #fff;
        content: attr(data-tooltip);
        font-size: 12px;
        text-decoration: none;
        visibility: hidden;
        opacity: 0;
        padding: 4px 7px;
        margin-right: 12px;
        position: absolute;
        transform: scale(0);
        right: 100%;
        white-space: nowrap;
        transform-origin: top right;
        transition: all .3s cubic-bezier(.25, .8, .25, 1);
    }

    [data-tooltip]:hover:before {
        visibility: visible;
        opacity: 1;
        transform: scale(1);
        transform-origin: right center 0;
    }

    .icon-material {
        display: inline-block;
        width: 40px;
        height: 40px;
    }

    a{
        padding-top: 5px;
    }
</style>
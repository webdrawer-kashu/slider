# slider

## jQuery Plugins
jQueryを使ったスライド。
レスポンシブは未対応。
## 使い方
```javascript
$("#slide01").sliders();
```

## option
```javascript
slideType
//スライドのタイプ。以下から選択。
    fadeSlide　フェードイン
    leftSlide　左にスライド（終わりまで行くと左へ戻る）デフォルト
    leftSlideLoop　左にスライド（ループ）
    leftSlideAnimation　常に左にスライド（ループ）
    selectAnimation　左にスライド（前へ次への選択ボタンあり）
    moveOn　現在表示されているものの上に右からスライド

changeTime
//次のスライドまでの移動秒数。デフォルトは1500
showTime
//表示秒数デフォルトは3000
allTime
//leftSlideAnimation 常に左にスライド（ループ）専用の全体にかかる秒数。デフォルトは15000
animeType
//アニメーションタイプ。デフォルトはswing。jquery.easing.jsを読みこめばそちらの値も使えます。
```

## デモ
<a href="http://webdrawer.net/sample/js/sliders/index.html" target="_blank">[デモページ]
<a href="http://webdrawer.net/javascript/sliders.html" target="_blank">[ブログ]</a>

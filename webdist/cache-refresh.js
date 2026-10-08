/* 1회성 자산 새로고침 — 옛 정책(assets/ 1년 immutable)으로 파일을 저장해 둔 브라우저용.
 * Clear-Site-Data 를 지원하지 않는 사파리(아이폰·아이패드)는 서버가 캐시를 비울 수 없어서, 페이지가 직접
 * 'reload' 모드로 다시 받아 캐시 항목을 새 것으로 덮어쓴다. 기기당 한 번만(localStorage 표시) 돌고, 끝나면 한 번 새로고침한다.
 * 목록은 webdist/assets 의 *.js·*.css — webdist 를 새 버전으로 바꾸면 이 목록도 다시 만들어야 한다(없는 파일은 그냥 건너뜀).
 * 올리고 싶은 때는 KEY 의 숫자를 올리면 다시 한 번 돈다. */
(function () {
  var KEY = 'tkb_asset_refresh_v1';
  try {
    if (localStorage.getItem(KEY)) return;
  } catch (e) {
    return;
  }
  if (!window.fetch || !window.Promise) return;
  var files = [
    "/assets/Chat-BGHHn5_w.js",
    "/assets/DmWindow-B0D775gB.js",
    "/assets/FloatingWindow-CgcsEYUd.js",
    "/assets/FriendWindow-ecntrbhD.js",
    "/assets/LibraryPanel-B-GUUgdq.js",
    "/assets/Lobby-DjsP-q47.js",
    "/assets/LobbyJumpMenu-BtYoINtL.js",
    "/assets/LobbyJumpMenu-CDOjlzC4.css",
    "/assets/ParticleBuffer-CMB7L347.js",
    "/assets/ProfilePanel-CcI09IwL.js",
    "/assets/Room-DIUhKNkp.js",
    "/assets/Settings-DEICL6gy.js",
    "/assets/VisitedLobby-H09ke_II.js",
    "/assets/browserAll-CH_vcmxm.js",
    "/assets/externalizeLogImages-BUW88OBY.js",
    "/assets/gifResize.worker-BPC6SMn_.js",
    "/assets/image-CJqz1FOB.js",
    "/assets/index-CJPXaEyi.css",
    "/assets/index-CrtSqM-7.js",
    "/assets/index-DLwZOjxA.js",
    "/assets/init-CT5Y4fl8.js",
    "/assets/netImage-q1HBfP67.js",
    "/assets/popout-y3WmKa7H.js",
    "/assets/profileTheme-DACDRQUP.js",
    "/assets/roomFile-DlI8vkns.js",
    "/assets/sessionlogsServer-DDlJpFpY.js",
    "/assets/webworkerAll-THWVbp4C.js"
  ];
  var network = true;
  var fetched = 0;
  Promise.all(
    files.map(function (u) {
      return fetch(u, { cache: 'reload', credentials: 'same-origin' })
        .then(function (r) {
          if (r.ok) fetched++;
          return r.arrayBuffer();
        })
        .catch(function () {
          network = false;
        });
    })
  ).then(function () {
    if (!network) return; // 네트워크 오류 — 표시하지 않고 다음 접속에 다시 시도
    try {
      localStorage.setItem(KEY, '1');
    } catch (e) {
      return; // 저장 불가(사생활 보호 모드 등) — 새로고침 반복을 막으려고 여기서 끝낸다
    }
    if (fetched > 0) location.reload();
  });
})();

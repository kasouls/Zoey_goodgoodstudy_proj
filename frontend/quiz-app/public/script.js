document.addEventListener("DOMContentLoaded", function () {
    var rootApp = document.getElementById("root");

    // ✅ 让 `#root` 直接全屏显示
    rootApp.style.display = "block"; 
    rootApp.style.width = "100vw";
    rootApp.style.height = "100vh";
    rootApp.style.position = "fixed";
    rootApp.style.top = "0";
    rootApp.style.left = "0";

    // ✅ 确保模糊效果被移除
    rootApp.classList.remove("root-blur");
    rootApp.style.filter = "none";

    console.log("✅ `root-blur` 已移除，界面清晰！");
});

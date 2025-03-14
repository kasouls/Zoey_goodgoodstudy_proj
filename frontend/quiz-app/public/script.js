document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 检查 Lottie:", window.lottie); // 检查 Lottie 是否加载成功
    if (!window.lottie) {
        console.error("❌ Lottie.js 未正确加载！");
        return;
    }

    var animationContainer = document.getElementById("welcome-animation");
    var rootApp = document.getElementById("root");
    var overlay = document.getElementById("welcome-overlay");

    // ✅ **确保 `#root` 在动画前就占满全屏**
    rootApp.style.display = "block"; 
    rootApp.style.width = "100vw";
    rootApp.style.height = "100vh";
    rootApp.style.position = "fixed";
    rootApp.style.top = "0";
    rootApp.style.left = "0";

    rootApp.classList.add("root-blur"); // ✅ 添加毛玻璃效果

    fetch("./animations/welcome-animation.json")
        .then(response => {
            if (!response.ok) throw new Error("❌ JSON 读取失败");
            return response.json();
        })
        .then(animationData => {
            var animation = lottie.loadAnimation({
                container: animationContainer,
                renderer: "canvas",
                loop: false,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                    clearCanvas: true,
                    hideOnTransparent: true,
                    preserveAspectRatio: "xMidYMid meet"
                },
            });

            // ✅ **动画播放完后，去掉毛玻璃 & 彻底显示主页**
            setTimeout(() => {
                overlay.style.display = "none"; // 隐藏动画
                rootApp.classList.remove("root-blur"); // 恢复主页正常背景
                console.log("✅ 动画播放完成，主页恢复清晰！");
            }, 1500);
        })
        .catch(err => console.error("❌ JSON 加载失败:", err));
});

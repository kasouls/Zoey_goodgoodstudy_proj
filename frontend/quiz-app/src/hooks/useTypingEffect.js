import { useState, useEffect } from "react";

const useTypingEffect = ({
    text = "", 
    deleting = false, 
    onComplete, 
    speed = 200, 
    deleteSpeed = 50, 
    startTyping = false 
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        //console.log("🟢 useTypingEffect 开始执行: text =", text, "deleting =", deleting, "startTyping =", startTyping);

        if (!text || !startTyping) {
           // console.log("⚠️ text 为空，清空 displayedText");
            setDisplayedText(""); 
            return;
        }

        setShowCursor(true);
        let index = deleting ? text.length : 0;
        let currentText = deleting ? text : "";

        if (deleting) {
            setIsDeleting(true);
            setTimeout(() => {
                const deleteInterval = setInterval(() => {
                    if (index > 0) {
                        index--;
                        currentText = text.slice(0, index);
                       // console.log("✏️ 删除中:", currentText);
                        setDisplayedText(currentText);
                    } else {
                        clearInterval(deleteInterval);
                        setIsDeleting(false);
                        setTimeout(() => typeOut(), 1000);
                    }
                }, index > text.length - 2 ? 300 : deleteSpeed);
            }, 2000);
        } else {
            typeOut();
        }

        function typeOut() {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    //console.log("⌨️ 打字中:", text.slice(0, i + 1));
                    setDisplayedText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                    setShowCursor(false);
                    if (onComplete) onComplete();
                }
            }, speed);
        }
    }, [text, deleting, startTyping]); 

   // console.log("🔵 useTypingEffect 返回的 displayedText:", displayedText);
    return { displayedText: displayedText || "", showCursor };
};

export default useTypingEffect;

const showQueueList = (showElement) => {
    if (showElement) {
        document.querySelector(".queuelist").style.display = "block"
        document.querySelector(".songlist").style.display = "none"
        document.querySelector(".likedlist").style.display = "none"

        document.getElementById("toggleAutoPlay").style.display = "inline-block"
    } else {
        document.querySelector(".queuelist").style.display = "none"
        document.getElementById("toggleAutoPlay").style.display = "none"
    }
}

export const showSongList = (showElement) => {
    if (showElement) {
        document.querySelector(".songlist").style.display = "block"
        document.querySelector(".queuelist").style.display = "none"
        document.querySelector(".likedlist").style.display = "none"

        document.getElementById("toggleAutoPlay").style.display = "inline-block"
    } else {
        document.getElementById("toggleAutoPlay").style.display = "none"
        document.querySelector(".songlist").style.display = "none"
    }
}

export const showLikedSongsList = (showElement) => {
    if (showElement) {
        document.querySelector(".likedlist").style.display = "block"
        document.querySelector(".queuelist").style.display = "none"
        document.querySelector(".songlist").style.display = "none"

        document.getElementById("toggleAutoPlay").style.display = "inline-block"
    } else {
        document.querySelector(".likedlist").style.display = "none"
        document.getElementById("toggleAutoPlay").style.display = "none"
    }
}

export const convertSecondsToMinutes = (seconds) => {
    let totalMinutes = Math.floor(seconds / 60);
    let remainingSeconds = (seconds % 60).toFixed(2);
    let [integerPart, decimalPart] = remainingSeconds.split('.');
    let formattedMinutes = String(totalMinutes).padStart(2, '0');
    let formattedSeconds = integerPart.padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

document.querySelector(".songinfo").innerHTML = `<p class="self-center inverted m-0 primary-font"> - Song 404 - </p>`
document.querySelector(".songtime").innerHTML = `<p class="self-center inverted m-0 primary-font"> 00:00 / 00:00 </p>`

document.querySelector(".queuebtn").addEventListener("click", () => {
    showQueueList(true)
    document.querySelector(".folderName").innerHTML = "Queue"
})

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%"
})

let recentlyPlayed = JSON.parse(localStorage.getItem("recently played")) || []
recentlyPlayed.length !== 0 ? document.querySelector(".listenAgain").innerHTML = "Listen Again" : ""
